import QRCode from "qrcode";
import Cors from "cors";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import initMiddleware from "../../utils/init-middleware.js";

const isValidHex = (color) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

// CORS
const cors = initMiddleware(
  Cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://qrgenhub.com",
        "https://www.qrgenhub.com",
        "http://localhost:5173",
        "http://localhost:3000",
      ];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["POST", "OPTIONS"],
    credentials: true,
  })
);

// Distributed rate limit (Upstash Redis).
// Module-scope so the instance is reused across warm invocations.
// If env vars aren't set (e.g. local dev without Upstash), rate limit is skipped.
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(60, "60 s"),
        analytics: true,
        prefix: "qrgen:rl",
      })
    : null;

if (!ratelimit) {
  console.warn(
    "[ratelimit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set — rate limiting disabled."
  );
}

const getClientIp = (req) => {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) {
    return fwd.split(",")[0].trim();
  }
  return req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
};

export default async function handler(req, res) {
  // A. CORS
  await cors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // B. Method check
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // C. Rate limit (Upstash)
  if (ratelimit) {
    const ip = getClientIp(req);
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", reset);

    if (!success) {
      const retryAfterSec = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      res.setHeader("Retry-After", retryAfterSec);
      return res.status(429).json({
        errorCode: "ERR_TOO_MANY_REQUESTS",
        message: "Too many requests. Please try again later.",
      });
    }
  }

  // D. Validation
  const { value, fgColor = "#000000", bgColor = "#ffffff" } = req.body;

  if (!value || typeof value !== "string" || !value.trim()) {
    return res.status(400).json({ error: "Invalid data type or missing value" });
  }

  if (value.trim().length > 2000) {
    return res.status(400).json({ error: "Content is too long (Max 2000 chars)" });
  }

  if (!isValidHex(fgColor) || !isValidHex(bgColor)) {
    return res.status(400).json({ error: "Invalid color format. Use Hex codes." });
  }

  // E. Generate
  try {
    const qrImage = await QRCode.toDataURL(value, {
      width: 1000,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: fgColor, light: bgColor },
    });

    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-QR-Engine", "QRGenHub-Core");
    res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");

    return res.status(200).json({ qr: qrImage });
  } catch (err) {
    console.error("QR Generation Error:", err);
    return res.status(500).json({ error: "QR generation failed" });
  }
}
