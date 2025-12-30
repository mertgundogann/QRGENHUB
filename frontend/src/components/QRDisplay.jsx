import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom'; // Tipi kontrol etmek için eklendi

const QRDisplay = ({ loading, qr, handleDownloadPNG, handleDownloadSVG, handleCopy, handleShare }) => {
  const { t } = useTranslation();
  const { lng } = useParams(); // URL'den mevcut dili ve yapıyı alıyoruz
  
  // Mevcut URL path'inden QR tipini yakalayalım (Örn: /tr/vcard -> vcard)
  const currentType = window.location.pathname.split('/')[2] || 'url';

  // Henüz QR üretilmemişse gösterilecek alan
  if (!qr && !loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/50">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
           <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
           </svg>
        </div>
        <p className="text-gray-400 font-medium text-center text-sm leading-relaxed max-w-[200px]">
          {t('placeholder_text')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      {/* QR Önizleme Alanı */}
      <div className="relative group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-inner flex justify-center items-center overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
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

      {/* Akıllı Bilgilendirme: Sadece vCard'da ve QR varken görünür */}
      {qr && currentType === "vcard" && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl animate-pulse">
          <p className="text-[10px] text-amber-700 font-bold text-center leading-relaxed">
            {t('qr.hint.vcard_complexity')}
          </p>
        </div>
      )}

      {/* İndirme Butonları */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleDownloadPNG} 
          disabled={loading}
          className={`py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
            loading 
            ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"
          }`}
        >
          {t('download_png')}
        </button>
        
        <button 
          onClick={handleDownloadSVG} 
          disabled={loading}
          className={`relative py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
            loading 
            ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
            : "bg-gray-900 text-white hover:bg-black shadow-gray-200 border-2 border-transparent hover:border-indigo-400"
          }`}
        >
          {t('download_svg')}
          {/* Önerilen Etiketi */}
          {!loading && (
            <span className="absolute -top-2 -right-1 bg-green-500 text-white text-[7px] px-2 py-0.5 rounded-full shadow-sm animate-bounce">
              {t('recommended') || 'BEST'}
            </span>
          )}
        </button>
      </div>

      {/* Kopyala ve Paylaş Butonları */}
      <div className="flex items-center gap-2">
        <button 
          onClick={handleCopy}
          disabled={loading}
          className={`flex-1 flex items-center justify-center gap-2 bg-white border-2 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-tight transition-all active:scale-95 ${
            loading 
            ? "border-gray-100 text-gray-300 cursor-not-allowed" 
            : "border-gray-100 text-gray-700 hover:border-indigo-600 hover:text-indigo-600"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          {t('copy')}
        </button>

        <button 
          onClick={() => handleShare('whatsapp')}
          disabled={loading}
          className={`w-14 h-14 flex items-center justify-center bg-[#25D366] text-white rounded-2xl transition-all shadow-lg active:scale-95 ${
            loading ? "opacity-50 cursor-not-allowed shadow-none" : "hover:opacity-90 shadow-green-100"
          }`}
          title="WhatsApp"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.672 1.433 5.662 1.434h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        </button>

        <button 
          onClick={() => handleShare('telegram')}
          disabled={loading}
          className={`w-14 h-14 flex items-center justify-center bg-[#0088cc] text-white rounded-2xl transition-all shadow-lg active:scale-95 ${
            loading ? "opacity-50 cursor-not-allowed shadow-none" : "hover:opacity-90 shadow-blue-100"
          }`}
          title="Telegram"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.441-.168.575-.487.77-.695.787-.456.038-.801-.305-1.242-.593-.69-.451-1.08-.731-1.75-.171-.775.648-2.176 2.112-2.665 2.731-.489.619-.906.66-.906.66-.234.026-.467-.09-.6-.28-.133-.19-.188-.458-.152-.733.111-.84.654-4.856.832-6.053.037-.249.123-.467.248-.654.125-.187.306-.328.528-.399.222-.071.493-.069.761.005.268.074 4.545 1.896 4.755 1.983.21.087.351.211.391.365.04.154.02.324-.047.481z"/></svg>
        </button>
      </div>

      <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
        <p className="text-[10px] text-indigo-600 font-bold text-center leading-relaxed">
          {t('download_hint')}
        </p>
      </div>
    </div>
  );
};

export default QRDisplay;