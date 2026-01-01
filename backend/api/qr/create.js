import QRCode from "qrcode";
import Cors from "cors";
import rateLimit from "express-rate-limit";
import initMiddleware from "../../utils/init-middleware.js";


const isValidHex = (color) => /^#([0-9A-F]{3}){1,2}$/i.test(color);


const cors = initMiddleware(
  Cors({
    origin: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : ["https://qrgenhub.com", "https://www.qrgenhub.com", process.env.VITE_LOCAL || "http://localhost:5173"],
    methods: ["POST", "OPTIONS"],
  })
);


const limiter = initMiddleware(
  rateLimit({
    windowMs: 60 * 1000, 
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      errorCode: "ERR_TOO_MANY_REQUESTS",
      message: "Too many requests. Please try again later.",
    },
  })
);

export default async function handler(req, res) {
  
 
  const allowedOrigins = [
    'https://qrgenhub.com', 
    'https://www.qrgenhub.com', 
    'http://localhost:5173' 
  ];

  const origin = req.headers.origin;

 
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  
  if (req.method === 'OPTIONS') {
    
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    return res.status(200).end();
  }
  
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

 
  await cors(req, res);
  await limiter(req, res);

  const { value, fgColor = "#000000", bgColor = "#ffffff" } = req.body;

 
  if (!value || typeof value !== "string") {
    return res.status(400).json({ error: "Invalid data type or missing value" });
  }

 
  if (value.length > 2000) {
    return res.status(400).json({ error: "Content is too long (Max 2000 chars)" });
  }

 
  if (!isValidHex(fgColor) || !isValidHex(bgColor)) {
    return res.status(400).json({ error: "Invalid color format. Use Hex codes." });
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
    res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");

    res.status(200).json({ qr: qrImage });
  } catch (err) {
    console.error("QR Generation Error:", err);
    res.status(500).json({ error: "QR generation failed" });
  }
}