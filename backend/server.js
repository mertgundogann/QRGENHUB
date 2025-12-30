import express from "express";
import cors from "cors";
import QRCode from "qrcode";
import rateLimit from "express-rate-limit";

const app = express();

// Proxy arkasında (Vercel, Cloudflare, vb.) gerçek IP tespiti için şart
app.set('trust proxy', 1);

// --- 1. RATE LIMIT YAPILANDIRMASI ---
// --- 1. RATE LIMIT YAPILANDIRMASI (GÜNCELLENDİ) ---
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 Dakikalık pencere (15 dk çok uzun ceza demek)
  max: 30, // Dakikada 30 istek (Saniyede 0.5 istek - Debounce ile uyumlu)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    errorCode: "ERR_TOO_MANY_REQUESTS",
    message: "Too many requst. Please try again later."
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  }
});

// --- 2. CORS AYARLARI ---
const allowedOrigins = [
  "http://localhost:3000", // Eski React portu
  "http://localhost:5173", // Vite (Yeni) portun - HATAYI BU ÇÖZECEK
  "http://127.0.0.1:5173", // Alternatif local IP
  "https://qrgenhub.com",  
  "https://www.qrgenhub.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Sadece whitelist domainler. Tarayıcı dışı (origin-less) istekler burada reddedilir.
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS_NOT_ALLOWED"));
    }
  },
  methods: ['POST', 'OPTIONS'],
  optionsSuccessStatus: 200
};

// --- MIDDLEWARES ---
app.use(cors(corsOptions));
app.use(express.json({ limit: '500kb' }));

// --- 🔧 KRİTİK DÜZELTME: OPTIONS ISTERIALERINI RATE LIMIT'TEN MUAF TUT ---
app.use("/api/qr/", (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  apiLimiter(req, res, next);
});

// --- 3. QR GENERATOR ENDPOINT ---
app.post("/api/qr/create", async (req, res) => {
  const { value, fgColor = "#000000", bgColor = "#ffffff" } = req.body;

  // SIKI VALIDATION
  if (!value || typeof value !== 'string') {
    return res.status(400).json({ error: "Invalid data type" });
  }

  if (value.trim().length === 0 || value.length > 2048) {
    return res.status(400).json({ error: "Data length invalid (Max 2048 chars)" });
  }

  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexRegex.test(fgColor) || !hexRegex.test(bgColor)) {
    return res.status(400).json({ error: "Invalid color format" });
  }

  try {
    const options = {
      width: 1000,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: { dark: fgColor, light: bgColor }
    };

    const qrImage = await QRCode.toDataURL(value, options);
    
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-QR-Engine", "QRGenHub-Core");
    
    res.json({ qr: qrImage });

  } catch (err) {
    console.error("QR Hub Error:", err);
    res.status(500).json({ error: "QR generation failed" });
  }
});

// --- 4. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  if (err.message === "CORS_NOT_ALLOWED") {
    return res.status(403).json({
      error: "Access Forbidden",
      message: "CORS policy violation."
    });
  }
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 QRGenHub Backend Securely running on port ${PORT}`);
});