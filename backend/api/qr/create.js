import QRCode from "qrcode";
import Cors from "cors";
import rateLimit from "express-rate-limit";
import initMiddleware from "../../utils/init-middleware.js"; // Dosya yolunun doğru olduğundan emin ol

const isValidHex = (color) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

// 1. CORS Ayarları (Sadece burası yönetecek)
const cors = initMiddleware(
  Cors({
    // Origin kontrolünü burada yapıyoruz
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://qrgenhub.com",
        "https://www.qrgenhub.com",
        "http://localhost:5173", // Vite varsayılan portu
        "http://localhost:3000", // Olası diğer portlar
      ];
      
      // origin yoksa (server-to-server) veya listedeyse izin ver
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // Geliştirme aşamasında hatayı görmek için:
        console.warn("Blocked by CORS:", origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["POST", "OPTIONS"],
    credentials: true, // Eğer cookie vs gönderiyorsan gerekli
  })
);

// 2. Rate Limiter (Test sırasında çok sık hata almamak için limiti 100'e çektim)
const limiter = initMiddleware(
  rateLimit({
    windowMs: 60 * 1000, 
    max: 100, // Frontend yönlendirmeleri bazen arka arkaya istek atabilir, limiti biraz açtık
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      errorCode: "ERR_TOO_MANY_REQUESTS",
      message: "Too many requests. Please try again later.",
    },
  })
);

export default async function handler(req, res) {
  // A. Önce CORS Middleware çalışsın (OPTIONS istekleri burada yanıtlanır ve biter)
  await cors(req, res);

  // B. Eğer sadece OPTIONS isteği geldiyse (Pre-flight), cors middleware hallettiği için durabiliriz
  // Ancak garanti olsun diye manuel bitiriş ekleyebiliriz ama genelde gerekmez.
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // C. Metot Kontrolü
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // D. Rate Limiter Çalışsın
  try {
    await limiter(req, res);
  } catch (e) {
    // Rate limit hatası yakalanırsa
    return res.status(429).json({ error: "Too many requests" });
  }

  // --- İŞLEM BAŞLANGICI ---
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

    return res.status(200).json({ qr: qrImage });
  } catch (err) {
    console.error("QR Generation Error:", err);
    return res.status(500).json({ error: "QR generation failed" });
  }
}