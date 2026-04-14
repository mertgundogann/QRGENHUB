import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const FaqSection = ({ type }) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);

  const typeKey = type ? `faq_items_${type}` : null;
  const typeSpecific = typeKey ? t(typeKey, { returnObjects: true }) : null;
  const faqItems = (Array.isArray(typeSpecific) ? typeSpecific : null) || t('faq_items', { returnObjects: true });

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

 
  if (!Array.isArray(faqItems)) return null;

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6">
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-800 dark:text-white">
          {t('faq_title')}
        </h2>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <button
                className="w-full flex justify-between items-center p-5 text-left font-semibold text-gray-700 dark:text-gray-200 focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className="pr-4">{item.q}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-5 border-t border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 leading-relaxed">
                 
                  {item.a.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i} className="text-gray-800 dark:text-white">{part}</strong> : part
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;