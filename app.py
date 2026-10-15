
import os
import re
import time
import hmac
import hashlib
import secrets
import logging
from threading import Lock

import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Only allow your Blurancy Cartify website domains.
ALLOWED_ORIGINS = [
    "https://blurancycartify.de5.net",
    "https://blurancycartify.github.io",
]

CORS(
    app,
    resources={
        r"/*": {
            "origins": ALLOWED_ORIGINS,
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
        }
    },
    supports_credentials=False,
)

# Configure these values in Render Environment, never in GitHub.
SMS_ACCOUNT_SID = os.environ.get("SMS_ACCOUNT_SID", "").strip()
SMS_AUTH_TOKEN = os.environ.get("SMS_AUTH_TOKEN", "").strip()
SMS_FROM_NUMBER = os.environ.get("SMS_FROM_NUMBER", "").strip()
OTP_SECRET = os.environ.get("OTP_SECRET", "").strip()

OTP_LIFETIME = 300       # OTP expires after 5 minutes
RESEND_WAIT = 60          # Wait 60 seconds before resending
MAX_ATTEMPTS = 5          # Maximum verification attempts
MAX_SENDS_PER_HOUR = 5    # Basic per-phone sending limit

# Temporary memory storage. Pending OTPs disappear if the server restarts.
otp_store = {}
last_send = {}
send_history = {}
store_lock = Lock()


def json_error(message, status=400):
    return jsonify({"success": False, "message": message}), status


def normalize_phone(value):
    """Accept Indian numbers with or without the +91 prefix."""
    if not isinstance(value, str):
        return None

    phone = re.sub(r"[\s()-]", "", value.strip())

    if re.fullmatch(r"\d{10}", phone):
        phone = "+91" + phone
    elif re.fullmatch(r"91\d{10}", phone):
        phone = "+" + phone

    # E.164-style format, with a maximum of 15 digits.
    if not re.fullmatch(r"\+[1-9]\d{7,14}", phone):
        return None

    return phone


def otp_digest(phone, otp):
    return hmac.new(
        OTP_SECRET.encode("utf-8"),
        f"{phone}:{otp}".encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def send_sms(phone, otp):
    """Send a real SMS using the Twilio Messages REST API."""
    url = (
        "https://api.twilio.com/2010-04-01/Accounts/"
        f"{SMS_ACCOUNT_SID}/Messages.json"
    )

    message = (
        f"Your Blurancy Cartify verification code is {otp}. "
        "It expires in 5 minutes. Do not share this code."
    )

    response = requests.post(
        url,
        auth=(SMS_ACCOUNT_SID, SMS_AUTH_TOKEN),
        data={
            "To": phone,
            "From": SMS_FROM_NUMBER,
            "Body": message,
        },
        timeout=15,
    )

    if not response.ok:
        # Do not expose Twilio credentials or raw provider responses.
        logger.error("SMS provider returned HTTP %s", response.status_code)
        return False

    return True


@app.get("/")
def home():
    return jsonify({
        "service": "Blurancy Cartify OTP Server",
        "status": "running",
        "endpoints": ["/send-otp", "/verify-otp"],
    })


@app.get("/health")
def health():
    return jsonify({"success": True, "status": "healthy"})


@app.post("/send-otp")
def send_otp():
    data = request.get_json(silent=True) or {}
    phone = normalize_phone(data.get("phone") or data.get("mobile"))

    if not phone:
        return json_error(
            "Enter a valid phone number with country code, or a 10-digit Indian number."
        )

    if not all([
        SMS_ACCOUNT_SID,
        SMS_AUTH_TOKEN,
        SMS_FROM_NUMBER,
        OTP_SECRET,
    ]):
        logger.error("Required OTP server environment variables are missing.")
        return json_error("OTP service is not configured. Please try later.", 503)

    now = time.time()

    with store_lock:
        previous = last_send.get(phone, 0)
        if now - previous < RESEND_WAIT:
            wait = int(RESEND_WAIT - (now - previous))
            return json_error(
                f"Please wait {wait} seconds before requesting another OTP.",
                429,
            )

        history = [
            sent_at for sent_at in send_history.get(phone, [])
            if now - sent_at < 3600
        ]

        if len(history) >= MAX_SENDS_PER_HOUR:
            return json_error(
                "Too many OTP requests. Try again later.",
                429,
            )

        # Reserve the send slot to reduce repeated concurrent requests.
        last_send[phone] = now
        send_history[phone] = history + [now]

    otp = f"{secrets.randbelow(1000000):06d}"

    try:
        sent = send_sms(phone, otp)
    except requests.RequestException:
        logger.exception("Could not connect to the SMS provider.")
        sent = False

    if not sent:
        with store_lock:
            # Allow a retry if the provider request failed.
            if last_send.get(phone) == now:
                last_send.pop(phone, None)
            history = send_history.get(phone, [])
            if history and history[-1] == now:
                history.pop()

        return json_error(
            "SMS could not be sent. Check the SMS provider configuration and try again.",
            502,
        )

    with store_lock:
        otp_store[phone] = {
            "digest": otp_digest(phone, otp),
            "expires": time.time() + OTP_LIFETIME,
            "attempts": 0,
        }

    return jsonify({
        "success": True,
        "message": "OTP sent. Check your SMS messages.",
    }), 200


@app.post("/verify-otp")
def verify_otp():
    data = request.get_json(silent=True) or {}
    phone = normalize_phone(data.get("phone") or data.get("mobile"))
    otp = data.get("otp") or data.get("code")

    if not phone:
        return json_error("Enter a valid phone number.")

    if not isinstance(otp, str) or not re.fullmatch(r"\d{6}", otp):
        return json_error("Enter the 6-digit OTP.")

    if not OTP_SECRET:
        return json_error("OTP service is not configured.", 503)

    now = time.time()

    with store_lock:
        record = otp_store.get(phone)

        if not record:
            return json_error(
                "No active OTP found. Please request a new OTP.",
                400,
            )

        if now > record["expires"]:
            otp_store.pop(phone, None)
            return json_error("OTP expired. Please request a new OTP.", 400)

        if record["attempts"] >= MAX_ATTEMPTS:
            otp_store.pop(phone, None)
            return json_error(
                "Too many incorrect attempts. Request a new OTP.",
                429,
            )

        submitted_digest = otp_digest(phone, otp)

        if not hmac.compare_digest(record["digest"], submitted_digest):
            record["attempts"] += 1
            return json_error("Incorrect OTP. Please try again.", 400)

        # One-time use: delete after successful verification.
        otp_store.pop(phone, None)

    return jsonify({
        "success": True,
        "verified": True,
        "message": "Phone number verified successfully.",
    }), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "10000"))
    app.run(host="0.0.0.0", port=port)
