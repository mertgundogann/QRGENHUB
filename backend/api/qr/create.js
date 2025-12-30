import QRCode from "qrcode";
import Cors from "cors";
import rateLimit from "express-rate-limit";
import initMiddleware from "../../utils/init-middleware.js";

// 1️⃣ CORS Middleware
const cors = initMiddleware(
  Cors({
    origin: ["https://qrgenhub.com", "https://www.qrgenhub.com","http://localhost:5173"],
    methods: ["POST", "OPTIONS"],
  })
);

// 2️⃣ Rate Limit Middleware
const limiter = initMiddleware(
  rateLimit({
    windowMs: 60 * 1000, // 1 dakika
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      errorCode: "ERR_TOO_MANY_REQUESTS",
      message: "Too many requests. Please try again later.",
    },
  })
);

// 3️⃣ Serverless Function
export default async function handler(req, res) {
  await cors(req, res);
  await limiter(req, res);

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { value, fgColor = "#000000", bgColor = "#ffffff" } = req.body;

  if (!value || typeof value !== "string") return res.status(400).json({ error: "Invalid data type" });
  if (value.length > 2048) return res.status(400).json({ error: "Data too long" });
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(fgColor) || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(bgColor)) {
    return res.status(400).json({ error: "Invalid color format" });
  }

  try {
    const qrImage = await QRCode.toDataURL(value, {
      width: 1000,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: fgColor, light: bgColor },
    });

    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-QR-Engine", "QRGenHub-Core");

    res.status(200).json({ qr: qrImage });
  } catch (err) {
    console.error("QR Generation Error:", err);
    res.status(500).json({ error: "QR generation failed" });
  }
}
