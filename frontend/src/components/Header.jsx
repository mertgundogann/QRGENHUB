import React from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LANGS = ['tr', 'en', 'fr', 'de', 'es'];

const Header = ({ navLinks }) => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const location = useLocation();

  const currentPath = location.pathname.split('/').slice(2).join('/') || 'url';

  return (
    <header className="w-full flex flex-col items-center">
      {/* Dil Değiştirici */}
      <div className="absolute top-4 right-4 md:top-6 md:right-8 flex gap-1 bg-white/60 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-gray-100 z-50">
        {SUPPORTED_LANGS.map((lang) => (
          <NavLink
            key={lang}
            to={`/${lang}/${currentPath}`}
            className={({ isActive }) => `
              px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all
              ${isActive ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400 hover:text-gray-600 hover:bg-white/40"}
            `}
          >
            {lang.toUpperCase()}
          </NavLink>
        ))}
      </div>

      {/* Logo Alanı */}
      <NavLink to={`/${lng}/url`} className="mb-8 flex flex-col items-center group cursor-pointer mt-8 md:mt-0">
        
          <img src="/favicon.svg" className="h-12 md:h-14" alt="QRGENHUB" />

        
        <h1 className="text-3xl font-black text-gray-800 tracking-tight uppercase italic">
          QRGEN<span className="text-indigo-600">HUB</span>
        </h1>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 text-center">
          {t('title_default')}
        </p>
      </NavLink>

      {/* Navigasyon Menüsü */}
      <nav className="w-full max-w-4xl px-4 z-10 mb-6">
        <div className="flex flex-wrap justify-center gap-2 bg-white/80 backdrop-blur-md p-3 rounded-3xl shadow-sm border border-gray-100">
          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              to={`/${lng}/${link.id}`}
              className={({ isActive }) =>
                `px-5 py-2.5 text-xs font-bold rounded-2xl transition-all duration-300 ${
                  isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105" 
                  : "bg-transparent text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
                }`
              }
            >
              {link.id === 'blog' ? t('blog') : t(`qr.type.${link.type}`)}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;