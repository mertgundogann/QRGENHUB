import React from 'react';
import { useTranslation } from 'react-i18next';

const SEOContent = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: "⚡",
      title: t('feat1_t'),
      desc: t('feat1_d'),
    },
    {
      icon: "🎨",
      title: t('feat2_t'),
      desc: t('feat2_d'),
    },
    {
      icon: "💎",
      title: t('feat3_t'),
      desc: t('feat3_d'),
    }
  ];

  return (
    <div className="w-full max-w-4xl mt-16 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((item, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center text-center p-8 rounded-3xl transition-all duration-300 group
              bg-white text-gray-800 shadow-sm border border-transparent
              hover:shadow-xl hover:-translate-y-1
              dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:shadow-none dark:hover:bg-gray-750"
          >
            
            <div className="text-5xl mb-6 w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </div>
            
            {/* 👇 DÜZELTME BURADA: h3 yerine h2 yapıldı. 
                Artık H1'den sonra H2 geliyor, hiyerarşi düzeldi. */}
            <h2 className="font-black text-sm mb-3 uppercase tracking-widest text-indigo-900 dark:text-indigo-300">
              {item.title}
            </h2>
            
            <p className="text-xs leading-relaxed opacity-70 font-medium">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SEOContent;