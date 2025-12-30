import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const SimplePage = ({ titleKey, contentKey }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[70vh] flex flex-col items-center px-4 py-16 bg-gray-50/30">
      <Helmet>
        <title>{t(titleKey)} - QRGENHUB</title>
      </Helmet>

      <div className="w-full max-w-3xl">
        {/* Başlık Alanı */}
        <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-8 tracking-tighter uppercase italic text-center md:text-left">
          {t(titleKey)}
        </h1>

        {/* İçerik Kartı */}
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
          {/* Arka Plan Süslemesi (Opsiyonel) */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 pointer-events-none" />
          
          <div className="relative z-10">
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
              {t(contentKey)}
            </p>
          </div>
        </div>

        {/* Alt Bilgi / Dönüş Linki */}
        <div className="mt-8 text-center md:text-left">
          <p className="text-xs text-gray-400 font-medium">
            © 2025 QRGENHUB.COM — {t('footer_tagline') || 'Hız İçin Tasarlandı'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimplePage;