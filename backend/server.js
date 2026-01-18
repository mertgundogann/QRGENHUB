import express from "express";
import cors from "cors";
import QRCode from "qrcode";

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.post("/api/qr/create", async (req, res) => {
  const { type, value, fgColor = "#000000", bgColor = "#ffffff", format = "png" } = req.body;

  try {
    let qrData = value;

    if (type === "url") qrData = value.startsWith("http") ? value : `https://${value}`;
    else if (type === "tel") qrData = `tel:${value}`;
    else if (type === "wifi") {
      const [ssid, password, encryption] = value.split("|");
      qrData = `WIFI:S:${ssid};T:${encryption || "WPA"};P:${password};;`;
    } else if (type === "vcard") {
      const [name, tel, email] = value.split("|");
      qrData = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${tel}\nEMAIL:${email}\nEND:VCARD`;
    } else if (type === "sms") {
      const [phone, message] = value.split("|");
      qrData = `SMSTO:${phone}:${message}`;
    } else if (type === "email") {
      const [email, subject, body] = value.split("|");
      qrData = `MATMSG:TO:${email};SUB:${subject};BODY:${body};;`;
    }

    const options = {
      width: 600,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: { dark: fgColor, light: bgColor }
    };

    // SVG İsteği ise string dön, PNG ise DataURL dön
    if (format === "svg") {
      const svgString = await QRCode.toString(qrData, { ...options, type: 'svg' });
      res.json({ qr: svgString, format: "svg" });
    } else {
      const qrImage = await QRCode.toDataURL(qrData, options);
      res.json({ qr: qrImage, format: "png" });
    }
  } catch (err) {
    res.status(500).json({ error: "QR üretilemedi." });
  }
});

app.listen(5000, () => console.log(`🚀 Backend 5000 portunda hazır!`));