import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const SimplePage = ({ titleKey, contentKey }) => {
  const { t } = useTranslation();

  // SEO için Akıllı Açıklama:
  // İçeriğin ilk 160 karakterini alıp meta description yapıyoruz.
  // Bu sayede Google "Privacy Policy - QRGenHub" yerine içeriğin özetini gösterir.
  const contentText = t(contentKey);
  const metaDesc = contentText.length > 160 
    ? `${contentText.substring(0, 160)}...` 
    : contentText;

  return (
    <div className="min-h-[70vh] flex flex-col items-center px-4 py-16 bg-gray-50/30 dark:bg-gray-900 transition-colors duration-300">
      
      {/* SEO NOTU: 
         Burada 'localizedSlugs' göndermemize gerek yok.
         SEO.jsx bileşeni, Privacy ve Terms gibi standart sayfaların 
         dil geçişlerini (örn: /tr/privacy -> /en/privacy) otomatik halleder.
      */}
      <SEO 
        title={t(titleKey)} 
        description={metaDesc}
      />

      <div className="w-full max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white mb-8 tracking-tighter uppercase italic text-center md:text-left transition-colors">
          {t(titleKey)}
        </h1>

        <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-colors duration-300">
          {/* Dekoratif Daire */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-full -mr-16 -mt-16 pointer-events-none transition-colors" />
          
          <div className="relative z-10">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line transition-colors">
              {t(contentKey)}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center md:text-left">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium transition-colors">
            © {new Date().getFullYear()} QRGENHUB.COM — {t('footer_tagline') || 'Hız İçin Tasarlandı'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimplePage;