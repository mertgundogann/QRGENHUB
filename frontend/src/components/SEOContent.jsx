import React from "react";
import { useTranslation } from "react-i18next";

const FeatureItem = ({ emoji, title, desc }) => (
  <div className="group text-center p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
    <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">{emoji}</div>
    <h3 className="font-black text-gray-800 mb-3 uppercase text-sm tracking-tighter">{title}</h3>
    <p className="text-xs text-gray-500 leading-relaxed font-medium px-2">{desc}</p>
  </div>
);

const FAQItem = ({ q, a }) => (
  <div className="space-y-3">
    <h4 className="font-black text-sm text-indigo-600 uppercase tracking-widest">{q}</h4>
    <p className="text-sm text-gray-500 font-medium leading-relaxed italic border-l-4 border-indigo-100 pl-4">{a}</p>
  </div>
);

const SEOContent = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-4xl mt-24 space-y-20 px-2 pb-10">
      {/* Özellikler Bölümü */}
      <section className="grid md:grid-cols-3 gap-8">
        <FeatureItem emoji="⚡" title={t('feat1_t')} desc={t('feat1_d')} />
        <FeatureItem emoji="🎨" title={t('feat2_t')} desc={t('feat2_d')} />
        <FeatureItem emoji="💎" title={t('feat3_t')} desc={t('feat3_d')} />
      </section>

      {/* FAQ Bölümü */}
      <section className="bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl border border-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <span className="text-9xl font-black tracking-tighter italic">FAQ</span>
        </div>
        <h2 className="text-3xl font-black text-center mb-12 text-gray-800 uppercase tracking-tighter">
          {t('faq_title')}
        </h2>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          <FAQItem q={t('q1')} a={t('a1')} />
          <FAQItem q={t('q2')} a={t('a2')} />
          <FAQItem q={t('q3')} a={t('a3')} />
          <FAQItem q={t('q4')} a={t('a4')} />
        </div>
      </section>
    </div>
  );
};

export default SEOContent;