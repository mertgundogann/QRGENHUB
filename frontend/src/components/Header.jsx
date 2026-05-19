import { NavLink, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';

const Header = ({ navLinks }) => {
  const { t } = useTranslation();
  const { lng } = useParams();
  
  // Dil parametresi undefined ise varsayılan 'en' olsun.
  const currentLang = lng || 'en';

  return (
    <header className="w-full flex flex-col items-center">
      
      {/* 🌍 SAĞ ÜST: Dil ve Tema Seçici */}
      <div className="absolute top-4 right-4 md:top-6 md:right-8 z-50 flex items-center gap-2">
        <ThemeToggle />
        <LanguageSelector />
      </div>

      {/* Logo Alanı */}
      {/* ✅ DÜZELTME 1: Logo linki '/url' yerine '/url-qr/' (slashlı) yapıldı */}
      <NavLink to={`/${currentLang}/${navLinks?.[0]?.id || 'url-qr'}/`} className="mb-8 flex flex-col items-center group cursor-pointer mt-8 md:mt-0">
        
        <img 
          src="/favicon.svg" 
          className="h-12 w-12 md:h-14 md:w-14" 
          alt="Free QR Code Generator with Logo - QRGENHUB"
          width="56"
          height="56"
          fetchPriority="high" 
        />
        
        <h1 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight uppercase italic transition-colors duration-300">
          QRGEN<span className="text-indigo-600 dark:text-indigo-400">HUB</span>
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 text-center transition-colors duration-300">
          {t('title_default')}
        </p>
      </NavLink>

      {/* Navigasyon Menüsü */}
      <nav className="w-full max-w-4xl px-4 z-10 mb-6">
        <div className="flex flex-wrap justify-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-3 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300">
          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              // ✅ DÜZELTME 2: Link sonuna / eklendi
              to={`/${currentLang}/${link.id}/`}
              className={({ isActive }) =>
                `px-5 py-2.5 text-xs font-bold rounded-2xl transition-all duration-300 ${
                  isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none transform scale-105" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`
              }
            >
              {t(`qr.type.${link.type}`)}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;