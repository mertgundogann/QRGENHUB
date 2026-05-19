import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { blogPosts } from '../data/posts';

// Her tool tipi için ilgili blog yazısının post ID'si
const TOOL_BLOG_MAP = {
  url:   'url-qr-code-guide-2026',
  wifi:  'wifi-qr-sharing',
  vcard: 'vcard-qr-power',
  sms:   'sms-qr-guide',
  email: 'email-qr-customer-support',
  tel:   'tel-qr-phone-guide',
  text:  'qr-guide-2026',
};

const SEOContent = ({ type }) => {
  const { t } = useTranslation();
  const { lng } = useParams();

  // İlgili blog yazısı hesapla
  const relatedPostId = type ? TOOL_BLOG_MAP[type] : null;
  const relatedPost = relatedPostId ? blogPosts.find(p => p.id === relatedPostId) : null;
  const relatedLang = lng || 'en';
  const relatedLangData = relatedPost?.languages?.[relatedLang] || relatedPost?.languages?.['en'];
  const relatedBlogUrl = relatedLangData ? `/${relatedLang}/blog/${relatedLangData.slug}/` : null;

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

  const relatedKey = type ? `related_tools_${type}` : null;
  const relatedTools = relatedKey ? t(relatedKey, { returnObjects: true }) : null;
  const relatedTitle = t('related_tools_title', { defaultValue: '' });

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

      {relatedBlogUrl && relatedLangData && (
        <div className="mt-8 p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/40 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-3xl">📖</div>
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-widest text-indigo-400 dark:text-indigo-400 mb-1">
              {t('related_article_label', { defaultValue: 'Related Article' })}
            </p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-snug">
              {relatedLangData.title}
            </p>
          </div>
          <Link
            to={relatedBlogUrl}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="shrink-0 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            {t('read_article', { defaultValue: 'Read →' })}
          </Link>
        </div>
      )}

      {Array.isArray(relatedTools) && relatedTools.length > 0 && (
        <div className="mt-12 p-6 rounded-3xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-black uppercase tracking-widest text-indigo-900 dark:text-indigo-300 mb-4">
            {relatedTitle}
          </h2>
          <div className="flex flex-wrap gap-3">
            {relatedTools.map((tool, i) => (
              <Link
                key={i}
                to={`/${lng}${tool.path.replace(/^\/[a-z]{2}/, '')}`}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOContent;