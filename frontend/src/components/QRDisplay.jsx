import React from 'react';
import { useTranslation } from 'react-i18next';

const QRDisplay = ({ loading, qr, handleDownloadPNG, handleDownloadSVG }) => {
  const { t } = useTranslation();
  
  const currentType = window.location.pathname.split('/')[2] || 'url';

  // 1. BOŞ DURUM (Empty State)
  if (!qr && !loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed rounded-[2.5rem] transition-colors duration-300
        border-gray-100 bg-gray-50/50 
        dark:border-gray-700 dark:bg-gray-900/50">
        
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300
          bg-gray-100 
          dark:bg-gray-800">
           <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
           </svg>
        </div>
        <p className="font-medium text-center text-sm leading-relaxed max-w-[200px] transition-colors duration-300
          text-gray-600 
          dark:text-gray-400">
          {t('placeholder_text')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      
      {/* 2. QR ÖNİZLEME KUTUSU */}
      <div className="relative group p-8 rounded-[2.5rem] border shadow-inner flex justify-center items-center overflow-hidden transition-colors duration-300
        bg-white border-gray-100 
        dark:bg-gray-800 dark:border-gray-700">
        
        {loading && (
          <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-20 transition-colors duration-300
            bg-white/80 
            dark:bg-gray-800/80">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <img 
          src={qr} 
          loading="lazy" 
          alt="Generated QR Code - QRGenHub" 
          title={t('qr_code_preview')}
          className={`max-w-full h-auto rounded-lg transition-all duration-500 ${loading ? 'opacity-30 blur-sm' : 'group-hover:scale-105'}`} 
        />
      </div>

      {/* 3. UYARI MESAJI (vCard için) */}
      {qr && currentType === "vcard" && (
        <div className="p-4 rounded-2xl animate-pulse border transition-colors duration-300
          bg-amber-50 border-amber-100 
          dark:bg-amber-900/20 dark:border-amber-800/30">
          <p className="text-[10px] font-bold text-center leading-relaxed transition-colors duration-300
            text-amber-700 
            dark:text-amber-400">
            {t('qr.hint.vcard_complexity')}
          </p>
        </div>
      )}

      {/* 4. İNDİRME BUTONLARI (Kopyala Kaldırıldı, Sadece Bunlar Kaldı) */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleDownloadPNG} 
          disabled={loading}
          className={`py-4 rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
            loading 
            ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none dark:bg-gray-700 dark:text-gray-600" 
            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 dark:shadow-none"
          }`}
        >
          PNG
        </button>
        
        <button 
          onClick={handleDownloadSVG} 
          disabled={loading}
          className={`relative py-4 rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
            loading 
            ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none dark:bg-gray-700 dark:text-gray-600" 
            : "bg-gray-900 text-white hover:bg-black shadow-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:shadow-none"
          }`}
        >
          SVG
          {!loading && (
            <span className="absolute -top-2 -right-1 bg-green-500 text-white text-[7px] px-1.5 py-0.5 rounded-full shadow-sm animate-bounce hidden sm:block">
              BEST
            </span>
          )}
        </button>
      </div>

      {/* 5. ALT BİLGİ KUTUSU */}
      <div className="p-4 rounded-2xl border transition-colors duration-300
        bg-indigo-50/50 border-indigo-100/50 
        dark:bg-indigo-900/20 dark:border-indigo-800/30">
        <p className="text-[10px] font-bold text-center leading-relaxed transition-colors duration-300
          text-indigo-600 
          dark:text-indigo-300">
          {t('download_hint')}
        </p>
      </div>
    </div>
  );
};

export default QRDisplay;