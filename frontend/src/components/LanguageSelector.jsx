import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

// Bayrak ikonları (Aynen korundu)
const Flags = {
  tr: () => (
    <svg className="w-5 h-5 rounded-full object-cover border border-gray-200 dark:border-gray-600" viewBox="0 0 32 32">
      <rect x="0" y="0" width="32" height="32" fill="#E30A17"/>
      <circle cx="15" cy="16" r="7" fill="#ffffff"/>
      <circle cx="16.5" cy="16" r="5.5" fill="#E30A17"/>
      <polygon points="19,16 21,13 21,19" fill="#ffffff" transform="rotate(-30 20 16)"/>
    </svg>
  ),
  en: () => (
    <svg className="w-5 h-5 rounded-full object-cover border border-gray-200 dark:border-gray-600" viewBox="0 0 32 32">
      <rect x="0" y="0" width="32" height="32" fill="#012169"/>
      <path d="M0,0 L32,32 M32,0 L0,32" stroke="#ffffff" strokeWidth="4"/>
      <path d="M16,0 L16,32 M0,16 L32,16" stroke="#ffffff" strokeWidth="6"/>
      <path d="M16,0 L16,32 M0,16 L32,16" stroke="#C8102E" strokeWidth="4"/>
    </svg>
  ),
  de: () => (
    <svg className="w-5 h-5 rounded-full object-cover border border-gray-200 dark:border-gray-600" viewBox="0 0 32 32">
      <rect x="0" y="0" width="32" height="10.6" fill="#000000"/>
      <rect x="0" y="10.6" width="32" height="10.6" fill="#DD0000"/>
      <rect x="0" y="21.2" width="32" height="10.8" fill="#FFCE00"/>
    </svg>
  ),
  fr: () => (
    <svg className="w-5 h-5 rounded-full object-cover border border-gray-200 dark:border-gray-600" viewBox="0 0 32 32">
      <rect x="0" y="0" width="10.6" height="32" fill="#0055A4"/>
      <rect x="10.6" y="0" width="10.6" height="32" fill="#FFFFFF"/>
      <rect x="21.2" y="0" width="10.8" height="32" fill="#EF4135"/>
    </svg>
  ),
  es: () => (
    <svg className="w-5 h-5 rounded-full object-cover border border-gray-200 dark:border-gray-600" viewBox="0 0 32 32">
      <rect x="0" y="0" width="32" height="32" fill="#AA151B"/>
      <rect x="0" y="8" width="32" height="16" fill="#F1BF00"/>
    </svg>
  )
};

const languages = [
  { code: "en", label: "English", Flag: Flags.en },
  { code: "tr", label: "Türkçe", Flag: Flags.tr },
  { code: "de", label: "Deutsch", Flag: Flags.de },
  { code: "fr", label: "Français", Flag: Flags.fr },
  { code: "es", label: "Español", Flag: Flags.es },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);

    const currentPath = location.pathname;
    // Eğer anasayfadaysak (/) path boş string dönebilir, kontrol edelim.
    // .split ile array oluşturuyoruz.
    const pathParts = currentPath.split("/").filter(part => part !== ""); 
    
    // İlk segment dil kodu mu? (tr, en...)
    const isFirstSegmentLang = languages.some(l => l.code === pathParts[0]);

    let newPath = "";

    if (isFirstSegmentLang) {
      // Mevcut dili değiştir: [tr, url-qr] -> [en, url-qr]
      pathParts[0] = langCode;
      newPath = `/${pathParts.join("/")}`;
    } else {
      // Dil kodu yoksa başına ekle: [url-qr] -> [en, url-qr]
      newPath = `/${langCode}/${pathParts.join("/")}`;
    }

    // ✅ DÜZELTME: Oluşan URL'in sonu '/' ile bitmiyorsa ekle
    if (!newPath.endsWith("/")) {
        newPath += "/";
    }

    navigate(newPath);
  };

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];
  const CurrentFlag = currentLang.Flag;

  return (
    <div className="relative z-50" ref={dropdownRef}>
      {/* 1. ANA BUTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full transition-all shadow-sm backdrop-blur-sm border
          bg-white/80 border-gray-200 hover:bg-gray-50
          dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <CurrentFlag />
        <span className="text-sm font-bold uppercase text-gray-700 dark:text-gray-200">
            {currentLang.code}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} 
            text-gray-400 dark:text-gray-500`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        // 2. AÇILIR MENÜ
        <div className="absolute right-0 mt-2 w-40 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right border
          bg-white border-gray-100
          dark:bg-gray-800 dark:border-gray-700">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors
                  ${i18n.language === lang.code 
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  }`}
              >
                <lang.Flag />
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;