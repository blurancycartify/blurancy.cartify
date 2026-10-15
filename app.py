from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(
    app,
    resources={r"/*": {
        "origins": [
            "https://blurancycartify.de5.net",
            "https://blurancycartify.github.io"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }}
)
import os
import time
import secrets
import hashlib
import threading
import requests

from flask import Flask, request, jsonify

app = Flask(__name__)

# Configure these in Render's Environment settings.
SMS_ACCOUNT_SID = os.getenv("SMS_ACCOUNT_SID", "")
SMS_AUTH_TOKEN = os.getenv("SMS_AUTH_TOKEN", "")
SMS_FROM_NUMBER = os.getenv("SMS_FROM_NUMBER", "")
OTP_SECRET = os.getenv("OTP_SECRET", "")

# Starter storage only: resets when the server restarts.
otp_store = {}
send_log = {}
lock = threading.Lock()

OTP_LIFETIME = 300  # 5 minutes


def phone_is_valid(phone):
    # India mobile numbers in international format: +91XXXXXXXXXX
    return (
        isinstance(phone, str)
        and len(phone) == 13
        and phone.startswith("+91")
        and phone[3:].isdigit()
        and phone[3] in "6789"
    )


def otp_hash(phone, otp):
    return hashlib.sha256(
        f"{OTP_SECRET}:{phone}:{otp}".encode()
    ).hexdigest()


@app.get("/")
def home():
    return jsonify({
        "service": "Blurancy Cartify OTP API",
        "status": "running"
    })


@app.post("/send-otp")
def send_otp():
    data = request.get_json(silent=True) or {}
    phone = data.get("phone", "")

    if not OTP_SECRET:
        return jsonify(error="Server OTP secret is not configured"), 500

    if not phone_is_valid(phone):
        return jsonify(
            error="Enter an Indian mobile number like +919876543210"
        ), 400

    if not all([SMS_ACCOUNT_SID, SMS_AUTH_TOKEN, SMS_FROM_NUMBER]):
        return jsonify(
            error="SMS delivery is not configured on the server"
        ), 503

    now = time.time()

    with lock:
        recent = [
            t for t in send_log.get(phone, [])
            if now - t < 600
        ]
        if len(recent) >= 3:
            return jsonify(
                error="Too many requests. Try again later."
            ), 429
        recent.append(now)
        send_log[phone] = recent

    otp = f"{secrets.randbelow(1_000_000):06d}"

    try:
        response = requests.post(
            f"https://api.twilio.com/2010-04-01/Accounts/"
            f"{SMS_ACCOUNT_SID}/Messages.json",
            auth=(SMS_ACCOUNT_SID, SMS_AUTH_TOKEN),
            data={
                "To": phone,
                "From": SMS_FROM_NUMBER,
                "Body": (
                    f"Your Blurancy Cartify verification code is {otp}. "
                    "It expires in 5 minutes. Do not share it."
                ),
            },
            timeout=15,
        )
        response.raise_for_status()
    except requests.RequestException:
        return jsonify(
            error="SMS provider failed to send the message"
        ), 502

    with lock:
        otp_store[phone] = {
            "hash": otp_hash(phone, otp),
            "expires": now + OTP_LIFETIME,
            "attempts": 0,
        }

    return jsonify(message="OTP sent if SMS delivery succeeded")


@app.post("/verify-otp")
def verify_otp():
    data = request.get_json(silent=True) or {}
    phone = data.get("phone", "")
    otp = data.get("otp", "")

    if not phone_is_valid(phone) or not (
        isinstance(otp, str) and len(otp) == 6 and otp.isdigit()
    ):
        return jsonify(error="Invalid phone number or OTP format"), 400

    with lock:
        record = otp_store.get(phone)

        if not record or time.time() > record["expires"]:
            otp_store.pop(phone, None)
            return jsonify(error="OTP expired or not found"), 400

        record["attempts"] += 1
        if record["attempts"] > 5:
            otp_store.pop(phone, None)
            return jsonify(error="Too many incorrect attempts"), 429

        if not secrets.compare_digest(
            record["hash"], otp_hash(phone, otp)
        ):
            return jsonify(error="Incorrect OTP"), 400

        otp_store.pop(phone, None)

    return jsonify(
        verified=True,
        message="Phone number verified"
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "10000")))
