import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async'; 
import SEO from '../components/SEO';

const NotFound = () => {
  const { t, i18n } = useTranslation();
  const { lng } = useParams();
  
  const SUPPORTED_LANGS = ['tr', 'en', 'fr', 'de', 'es'];
  
  const detectedLang = i18n.language ? i18n.language.split('-')[0] : 'en';
  const currentLang = SUPPORTED_LANGS.includes(lng) ? lng : detectedLang;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      
      <SEO 
        title="404 - Page Not Found" 
        description="The page you are looking for does not exist." 
      />

      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <h1 className="text-9xl font-black text-indigo-600/20 dark:text-indigo-400/20 absolute select-none animate-pulse">
        404
      </h1>

      <div className="relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 italic uppercase">
          {t('404_title') || "PAGE NOT FOUND"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto font-medium">
          {t('404_desc') || "Oops! The page you are looking for might have been removed or is temporarily unavailable."}
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {/* SLASH GÜNCELLEMESİ YAPILDI 👇 */}
          <Link 
            to={`/${currentLang}/url-qr/`} 
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-lg hover:shadow-indigo-500/30"
          >
            {t('back_to_home') || "GO HOME"}
          </Link>
          
          {/* SLASH GÜNCELLEMESİ YAPILDI 👇 */}
          <Link 
            to={`/${currentLang}/blog/`} 
            className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl font-bold uppercase tracking-widest hover:scale-105 transition-transform border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
          >
            {t('read_blog') || "READ BLOG"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;