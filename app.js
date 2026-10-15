
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
logger = logging.getLogger("blurancy_cartify")

# Allowed website origins (no trailing slash).
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
)

# Add these as environment variables in Render.
TWILIO_ACCOUNT_SID = os.getenv("SMS_ACCOUNT_SID", "").strip()
TWILIO_AUTH_TOKEN = os.getenv("SMS_AUTH_TOKEN", "").strip()
TWILIO_FROM_NUMBER = os.getenv("SMS_FROM_NUMBER", "").strip()
OTP_SECRET = os.getenv("OTP_SECRET", "").strip()

OTP_EXPIRY_SECONDS = 300
RESEND_SECONDS = 60
MAX_ATTEMPTS = 5
MAX_SENDS_PER_HOUR = 5

# Temporary storage: pending OTPs are lost on server restart.
otp_store = {}
last_send = {}
send_history = {}
store_lock = Lock()


def error_response(message, status=400):
    return jsonify({
        "success": False,
        "message": message,
    }), status


def normalize_phone(value):
    """Accept international numbers or 10-digit Indian numbers."""
    if not isinstance(value, str):
        return None

    phone = re.sub(r"[\s()-]", "", value.strip())

    if re.fullmatch(r"\d{10}", phone):
        phone = "+91" + phone
    elif re.fullmatch(r"91\d{10}", phone):
        phone = "+" + phone

    if not re.fullmatch(r"\+[1-9]\d{7,14}", phone):
        return None

    return phone


def hash_otp(phone, otp):
    return hmac.new(
        OTP_SECRET.encode("utf-8"),
        f"{phone}:{otp}".encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def send_sms(phone, otp):
    """Send a real SMS using the Twilio Messages API."""
    url = (
        "https://api.twilio.com/2010-04-01/Accounts/"
        f"{TWILIO_ACCOUNT_SID}/Messages.json"
    )

    message = (
        f"Your Blurancy Cartify verification code is {otp}. "
        "It expires in 5 minutes. Do not share this code."
    )

    response = requests.post(
        url,
        auth=(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN),
        data={
            "To": phone,
            "From": TWILIO_FROM_NUMBER,
            "Body": message,
        },
        timeout=15,
    )

    if not response.ok:
        logger.error(
            "SMS provider rejected the request (HTTP %s).",
            response.status_code,
        )
        return False

    return True


@app.get("/")
def home():
    return jsonify({
        "service": "Blurancy Cartify OTP Server",
        "status": "running",
    })


@app.get("/health")
def health():
    return jsonify({
        "success": True,
        "status": "healthy",
    })


@app.post("/send-otp")
def send_otp():
    data = request.get_json(silent=True) or {}
    phone = normalize_phone(data.get("phone") or data.get("mobile"))

    if not phone:
        return error_response(
            "Enter a valid phone number with country code."
        )

    if not all((
        TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN,
        TWILIO_FROM_NUMBER,
        OTP_SECRET,
    )):
        logger.error("Required OTP environment variables are missing.")
        return error_response(
            "OTP service is not configured. Please try later.",
            503,
        )

    now = time.time()

    with store_lock:
        previous = last_send.get(phone, 0)

        if now - previous < RESEND_SECONDS:
            remaining = int(RESEND_SECONDS - (now - previous))
            return error_response(
                f"Please wait {remaining} seconds before requesting another OTP.",
                429,
            )

        history = [
            sent_at
            for sent_at in send_history.get(phone, [])
            if now - sent_at < 3600
        ]

        if len(history) >= MAX_SENDS_PER_HOUR:
            return error_response(
                "Too many requests. Try again later.",
                429,
            )

        # Reserve the sending slot.
        last_send[phone] = now
        send_history[phone] = history + [now]

    otp = f"{secrets.randbelow(1_000_000):06d}"

    try:
        delivered_to_provider = send_sms(phone, otp)
    except requests.RequestException:
        logger.exception("Could not connect to the SMS provider.")
        delivered_to_provider = False

    if not delivered_to_provider:
        with store_lock:
            if last_send.get(phone) == now:
                last_send.pop(phone, None)

            history = send_history.get(phone, [])
            if history and history[-1] == now:
                history.pop()

        return error_response(
            "SMS could not be submitted. Check your SMS provider settings.",
            502,
        )

    with store_lock:
        otp_store[phone] = {
            "digest": hash_otp(phone, otp),
            "expires": time.time() + OTP_EXPIRY_SECONDS,
            "attempts": 0,
        }

    return jsonify({
        "success": True,
        "message": "OTP submitted to the SMS provider. Check your phone.",
    }), 200


@app.post("/verify-otp")
def verify_otp():
    data = request.get_json(silent=True) or {}

    phone = normalize_phone(data.get("phone") or data.get("mobile"))
    otp = data.get("otp") or data.get("code")

    if not phone:
        return error_response("Enter a valid phone number.")

    if not isinstance(otp, str) or not re.fullmatch(r"\d{6}", otp):
        return error_response("Enter the 6-digit OTP.")

    if not OTP_SECRET:
        return error_response("OTP service is not configured.", 503)

    with store_lock:
        record = otp_store.get(phone)

        if record is None:
            return error_response(
                "No active OTP found. Request a new OTP."
            )

        if time.time() > record["expires"]:
            otp_store.pop(phone, None)
            return error_response(
                "OTP expired. Request a new OTP."
            )

        if record["attempts"] >= MAX_ATTEMPTS:
            otp_store.pop(phone, None)
            return error_response(
                "Too many incorrect attempts. Request a new OTP.",
                429,
            )

        submitted_digest = hash_otp(phone, otp)

        if not hmac.compare_digest(
            record["digest"], submitted_digest
        ):
            record["attempts"] += 1
            return error_response("Incorrect OTP. Try again.")

        # A successful OTP can only be used once.
        otp_store.pop(phone, None)

    return jsonify({
        "success": True,
        "verified": True,
        "message": "Phone number verified successfully.",
    }), 200


if __name__ == "__main__":
    port = int(os.getenv("PORT", "10000"))
    app.run(host="0.0.0.0", port=port)
