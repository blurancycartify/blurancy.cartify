
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { createClient } from "@supabase/supabase-js";
import {
  createHmac,
  randomInt,
  timingSafeEqual
} from "node:crypto";

const required = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "OTP_PEPPER",
  "MSG91_AUTH_KEY",
  "MSG91_TEMPLATE_ID",
  "CORS_ORIGINS"
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json({ limit: "10kb" }));

const allowedOrigins = process.env.CORS_ORIGINS
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // No-origin requests are allowed for health checks/tools.
    // The API still has rate limits and phone validation.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin not allowed"));
  }
}));

const db = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

const OTP_MINUTES = 5;
const MAX_ATTEMPTS = 5;
const PEPPER = process.env.OTP_PEPPER;

const sendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Try again later." }
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many verification attempts." }
});

function normalizePhone(value) {
  if (typeof value !== "string") return null;

  const phone = value.replace(/[\s()-]/g, "");

  // Accept +91 followed by 10 digits, or 91 followed by 10 digits.
  if (/^\+91[6-9]\d{9}$/.test(phone)) {
    return phone.slice(1);
  }
  if (/^91[6-9]\d{9}$/.test(phone)) {
    return phone;
  }

  return null;
}

function otpHash(phone, code) {
  return createHmac("sha256", PEPPER)
    .update(`${phone}:${code}`)
    .digest("hex");
}

function safeEqual(a, b) {
  const aa = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");

  return aa.length === bb.length &&
    timingSafeEqual(aa, bb);
}

function hashIp(ip) {
  return createHmac("sha256", PEPPER)
    .update(ip || "unknown")
    .digest("hex");
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "blurancy-cartify-otp" });
});

app.post("/otp/send", sendLimiter, async (req, res) => {
  try {
    const phone = normalizePhone(req.body?.phone);

    if (!phone) {
      return res.status(400).json({
        error: "Enter a valid Indian mobile number with +91."
      });
    }

    const now = Date.now();
    const since = new Date(now - 60 * 60 * 1000).toISOString();

    // Persistent per-number limit: 5 requests per hour.
    const { count, error: countError } = await db
      .from("otp_challenges")
      .select("id", { count: "exact", head: true })
      .eq("phone", phone)
      .gte("created_at", since);

    if (countError) throw countError;

    if ((count || 0) >= 5) {
      return res.status(429).json({
        error: "OTP limit reached for this number. Try later."
      });
    }

    // Resend cooldown: one request per 60 seconds.
    const { data: recent, error: recentError } = await db
      .from("otp_challenges")
      .select("created_at")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(1);

    if (recentError) throw recentError;

    if (recent?.length &&
        now - new Date(recent[0].created_at).getTime() < 60000) {
      return res.status(429).json({
        error: "Wait 60 seconds before requesting another OTP."
      });
    }

    const code = String(randomInt(0, 1000000)).padStart(6, "0");
    const expiresAt = new Date(
      now + OTP_MINUTES * 60 * 1000
    ).toISOString();

    const { data: challenge, error: insertError } = await db
      .from("otp_challenges")
      .insert({
        phone,
        otp_hash: otpHash(phone, code),
        expires_at: expiresAt,
        request_ip_hash: hashIp(req.ip)
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    // MSG91 Flow API: create a flow and a DLT-approved
    // template whose first variable is VAR1.
    const smsResponse = await fetch(
      "https://control.msg91.com/api/v5/flow",
      {
        method: "POST",
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
          accept: "application/json"
        },
        body: JSON.stringify({
          template_id: process.env.MSG91_TEMPLATE_ID,
          recipients: [{
            mobiles: phone,
            VAR1: code
          }]
        }),
        signal: AbortSignal.timeout(15000)
      }
    );

    const smsBody = await smsResponse.json().catch(() => ({}));

    if (!smsResponse.ok) {
      await db.from("otp_challenges")
        .delete()
        .eq("id", challenge.id);

      console.error("SMS provider rejected request", {
        status: smsResponse.status
      });

      return res.status(502).json({
        error: "SMS provider rejected the request. Check server settings."
      });
    }

    // A 2xx response means the provider accepted the API request,
    // not necessarily that the phone received the SMS.
    console.log("SMS API accepted request", {
      challengeId: challenge.id,
      providerStatus: smsBody.type || smsBody.status || "unknown"
    });

    return res.json({
      ok: true,
      message: "OTP request accepted. Check your SMS inbox.",
      expiresInSeconds: OTP_MINUTES * 60,
      resendAfterSeconds: 60
    });
  } catch (err) {
    console.error("OTP send failed:", err.message);
    return res.status(500).json({
      error: "Unable to request OTP. Check server logs."
    });
  }
});

app.post("/otp/verify", verifyLimiter, async (req, res) => {
  try {
    const phone = normalizePhone(req.body?.phone);
    const code = req.body?.code;

    if (!phone || typeof code !== "string" ||
        !/^\d{6}$/.test(code)) {
      return res.status(400).json({
        error: "Enter the valid phone number and 6-digit OTP."
      });
    }

    const { data: rows, error } = await db
      .from("otp_challenges")
      .select("*")
      .eq("phone", phone)
      .is("consumed_at", null)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;

    const challenge = rows?.[0];

    if (!challenge ||
        new Date(challenge.expires_at).getTime() <= Date.now() ||
        challenge.attempts >= MAX_ATTEMPTS) {
      return res.status(400).json({
        verified: false,
        error: "OTP expired or invalid. Request a new OTP."
      });
    }

    const suppliedHash = otpHash(phone, code);

    if (!safeEqual(suppliedHash, challenge.otp_hash)) {
      const { error: attemptError } = await db
        .from("otp_challenges")
        .update({ attempts: challenge.attempts + 1 })
        .eq("id", challenge.id)
        .eq("attempts", challenge.attempts)
        .is("consumed_at", null);

      if (attemptError) throw attemptError;

      return res.status(400).json({
        verified: false,
        error: "Incorrect OTP."
      });
    }

    // Consume it once. The conditional update prevents ordinary
    // repeat use; production should move this into an atomic DB RPC.
    const { data: consumed, error: consumeError } = await db
      .from("otp_challenges")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", challenge.id)
      .is("consumed_at", null)
      .select("id");

    if (consumeError) throw consumeError;

    if (!consumed?.length) {
      return res.status(409).json({
        verified: false,
        error: "OTP already used. Request a new one."
      });
    }

    return res.json({
      verified: true,
      message: "Phone OTP verified."
    });
  } catch (err) {
    console.error("OTP verification failed:", err.message);
    return res.status(500).json({
      error: "Unable to verify OTP. Try again."
    });
  }
});

const port = Number(process.env.PORT || 10000);

app.listen(port, "0.0.0.0", () => {
  console.log(`OTP server listening on port ${port}`);
});
