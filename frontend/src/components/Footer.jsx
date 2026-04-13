import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  const { lng } = useParams();

  // Eğer lng undefined gelirse (örneğin 404 sayfasında) varsayılan 'en' kullanalım.
  const currentLang = lng || 'en';

  return (
    <footer className="w-full py-12 px-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Sol: Logo */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-xl font-black italic tracking-tighter text-gray-800 dark:text-white uppercase transition-colors">
            QRGEN<span className="text-indigo-600 dark:text-indigo-400 transition-colors">HUB</span>
          </span>
          <p className="text-[9px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest mt-1">
            {t('footer_tagline') || 'HIZ İÇİN TASARLANDI'}
          </p>
        </div>

        {/* Orta: Yasal Linkler */}
        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">
          {/* ✅ DÜZELTME: Link sonuna / eklendi */}
          <Link to={`/${currentLang}/privacy/`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {t('privacy.title')}
          </Link>
          
          {/* ✅ DÜZELTME: Link sonuna / eklendi */}
          <Link to={`/${currentLang}/terms/`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {t('terms.title')}
          </Link>
        </div>

        {/* Sağ: Telif Hakkı */}
        <div className="text-[10px] text-gray-600 dark:text-gray-400 font-black uppercase tracking-widest">
          © {new Date().getFullYear()} QRGENHUB.COM
        </div>

      </div>
    </footer>
  );
};

export default Footer;