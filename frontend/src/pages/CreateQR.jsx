import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { qrTypes } from "../components/QRConstants";
import QRSettings from "../components/QRSettings";
import QRDisplay from "../components/QRDisplay";
import toast, { Toaster } from 'react-hot-toast';
import QRInputFields from "../components/QRInputFields";
import SEOContent from "../components/SEOContent";

// API URL production ve development için
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CreateQR = ({ defaultType }) => {
  const { t } = useTranslation();
  const [type, setType] = useState(defaultType || "url");
  const [inputs, setInputs] = useState({});
  const [qr, setQr] = useState(null);
  const [logo, setLogo] = useState(null);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [frameText, setFrameText] = useState("");

  const canvasRef = useRef(null);
  const advancedSettingsRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (defaultType) {
      setType(defaultType);
      setInputs({});
      setQr(null);
    }
  }, [defaultType]);

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
    if (!showAdvanced) {
      setTimeout(() => {
        advancedSettingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

  const getDynamicTitle = () => {
    return t('title_pattern', { 
      type: t(`qr.type.${type}`), 
      suffix: t('title_suffix') 
    });
  };

  // --- Backend isteği
  const handleCreate = useCallback(async () => {
    const getV = (key) => inputs[key] || inputs[t(key)] || "";

    let value = "";

    switch (type) {
      case "url": {
        const url = getV("qr.field.url")?.trim();
        value = url && !url.startsWith("http") ? `https://${url}` : url;
        break;
      }
      case "wifi": {
        const ssid = getV("qr.field.ssid");
        const enc = getV("qr.field.encryption") || "WPA";
        const pass = getV("qr.field.password") || "";
        if (ssid) value = `WIFI:S:${ssid};T:${enc};P:${pass};;`;
        break;
      }
      case "vcard": {
        const fn = getV("qr.field.fullname");
        const job = getV("qr.field.job") || "";
        const company = getV("qr.field.company") || "";
        const tel = getV("qr.field.phone") || "";
        const email = getV("qr.field.email") || "";
        const web = getV("qr.field.website") || "";
        const adr = getV("qr.field.address") || "";

        if (fn) {
          value = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            `FN:${fn}`,
            job ? `TITLE:${job}` : "",
            company ? `ORG:${company}` : "",
            tel ? `TEL;TYPE=CELL:${tel}` : "",
            email ? `EMAIL:${email}` : "",
            web ? `URL:${web}` : "",
            adr ? `ADR;TYPE=WORK:;;${adr}` : "",
            "END:VCARD"
          ].filter(Boolean).join("\n");
        }
        break;
      }
      case "tel": {
        const phone = getV("qr.field.phone");
        if (phone) value = `tel:${phone}`;
        break;
      }
      case "sms": {
        const sPhone = getV("qr.field.phone");
        const sMsg = getV("qr.field.message") || "";
        if (sPhone) value = `smsto:${sPhone}:${sMsg}`;
        break;
      }
      case "email": {
        const eTo = getV("qr.field.email");
        const eSub = getV("qr.field.subject") || "";
        const eBody = getV("qr.field.message") || "";
        if (eTo) value = `MATMSG:TO:${eTo};SUB:${eSub};BODY:${eBody};;`;
        break;
      }
      case "text": {
        value = getV("qr.field.text") || "";
        break;
      }
      default:
        value = Object.values(inputs).filter(v => v).join(" ");
    }

    if (!value || value.trim() === "") {
      setQr(null);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/qr/create`, {
        value,
        fgColor,
        bgColor
      });
      setQr(res.data.qr);
    } catch (err) {
      console.error("Backend Connection Error:", err);
      if (err.response?.status === 429) {
        toast.error(t('ERR_TOO_MANY_REQUESTS') || "Too many requests!");
      } else {
        toast.error(t('backend_error') || "Backend error occurred!");
      }
    } finally {
      setLoading(false);
    }
  }, [type, inputs, fgColor, bgColor, t]);

  useEffect(() => {
    const timer = setTimeout(() => handleCreate(), 500);
    return () => clearTimeout(timer);
  }, [handleCreate]);

  // --- QR Çizimi ve indirme
  const drawFullQR = (callback) => {
    if (!qr) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous"; 
    qrImg.onload = () => {
      const textPadding = frameText ? 120 : 0;
      canvas.width = qrImg.width;
      canvas.height = qrImg.height + textPadding;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(qrImg, 0, 0);

      if (frameText) {
        ctx.fillStyle = fgColor;
        ctx.font = "bold 45px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(frameText.toUpperCase(), canvas.width / 2, qrImg.height + 60);
      }

      if (logo) {
        const logoImg = new Image();
        logoImg.onload = () => {
          const size = qrImg.width * 0.22;
          const x = (qrImg.width - size) / 2;
          const y = (qrImg.height - size) / 2;
          ctx.fillStyle = bgColor;
          ctx.fillRect(x - 10, y - 10, size + 20, size + 20);
          ctx.drawImage(logoImg, x, y, size, size);
          callback(canvas);
        };
        logoImg.src = logo;
      } else callback(canvas);
    };
    qrImg.src = qr;
  };

  const handleDownloadPNG = () => drawFullQR(c => {
    const a = document.createElement("a");
    a.download = `qrgen-${type}.png`;
    a.href = c.toDataURL("image/png");
    a.click();
  });

  const handleDownloadSVG = () => drawFullQR(c => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${c.width}" height="${c.height}"><rect width="100%" height="100%" fill="${bgColor}"/><image href="${c.toDataURL("image/png")}" width="100%" height="100%"/></svg>`;
    const blob = new Blob([svgContent], {type: "image/svg+xml"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `qrgen-${type}.svg`;
    a.click();
  });

  const currentTypeData = qrTypes.find((t_item) => t_item.value === type) || qrTypes[0];

  return (
    <div className="flex flex-col items-center w-full px-4 pt-10 pb-20 bg-gray-50/30">
      <Toaster position="top-center" />
      <Helmet>
        <title>{getDynamicTitle()}</title>
      </Helmet>
      
      <div className="bg-white p-6 md:p-10 rounded-[3.5rem] shadow-2xl w-full max-w-xl border border-gray-100 relative z-10">
        <h1 className="text-2xl font-black text-center mb-8 tracking-tighter text-gray-800 uppercase italic">
          {getDynamicTitle()}
        </h1>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button onClick={() => {setFgColor("#000000"); setBgColor("#ffffff")}} className="px-5 py-2.5 bg-gray-100 rounded-2xl text-[10px] font-black uppercase transition-all hover:bg-gray-200">
            {t('classic')}
          </button>
          <button onClick={() => {setFgColor("#D4AF37"); setBgColor("#1a1a1a")}} className="px-5 py-2.5 bg-gray-900 text-yellow-500 rounded-2xl text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all">
            {t('gold')}
          </button>
          <button onClick={() => {setFgColor("#ffffff"); setBgColor("#4F46E5")}} className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all">
            {t('modern')}
          </button>
        </div>

        <QRInputFields fields={currentTypeData.fields} inputs={inputs} setInputs={setInputs} />

        <button onClick={toggleAdvanced} className="w-full py-4 text-xs font-black text-indigo-600 mb-6 bg-indigo-50/50 rounded-2xl hover:bg-indigo-100 transition-all uppercase tracking-widest border border-indigo-100/50">
          {showAdvanced ? `↑ ${t('close_settings')}` : `↓ ${t('adv_settings')}`}
        </button>

        {showAdvanced && (
          <div ref={advancedSettingsRef} className="p-6 bg-gray-50/50 rounded-[2.5rem] mb-8 border border-gray-100">
            <QRSettings 
              fgColor={fgColor} setFgColor={setFgColor} 
              bgColor={bgColor} setBgColor={setBgColor} 
              frameText={frameText} setFrameText={setFrameText} 
              logo={logo} setLogo={setLogo} 
              fileInputRef={fileInputRef} 
              t={t} 
            />
          </div>
        )}

        <QRDisplay 
          loading={loading} 
          qr={qr} 
          handleDownloadPNG={handleDownloadPNG} 
          handleDownloadSVG={handleDownloadSVG}
          handleCopy={() => toast.success(t('copied_to_clipboard'))}
        />
      </div>

      <SEOContent />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CreateQR;
