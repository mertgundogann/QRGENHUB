import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  const { lng } = useParams();

  return (
    <footer className="w-full py-12 px-6 border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Sol: Logo */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-xl font-black italic tracking-tighter text-gray-800 uppercase">
            QRGEN<span className="text-indigo-600">HUB</span>
          </span>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">
            {t('footer_tagline') || 'HIZ İÇİN TASARLANDI'}
          </p>
        </div>

        {/* Orta: Yasal Linkler */}
        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <Link to={`/${lng}/privacy`} className="hover:text-indigo-600 transition-colors">
            {t('privacy.title')}
          </Link>
          <Link to={`/${lng}/terms`} className="hover:text-indigo-600 transition-colors">
            {t('terms.title')}
          </Link>
        </div>

        {/* Sağ: Telif Hakkı */}
        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
          © {new Date().getFullYear()} QRGENHUB.COM
        </div>

      </div>
    </footer>
  );
};

export default Footer;