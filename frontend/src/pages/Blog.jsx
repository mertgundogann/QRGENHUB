import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { blogPosts } from '../data/posts';

const Blog = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLang = lng || 'tr';

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(currentLang, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "QRGenHub Blog",
    "description": t('blog_subtitle') || 'QR Technology, Tips and Tricks',
    "url": `https://www.qrgenhub.com/${currentLang}/blog/`, // Burası da slashlı olmalı
    "blogPost": blogPosts.slice(0, 10).map(post => {
      const pData = post.languages[currentLang] || post.languages['en'];
      return {
        "@type": "BlogPosting",
        "headline": pData.title,
        "image": post.image,
        "datePublished": post.date, 
        "url": `https://www.qrgenhub.com/${currentLang}/blog/${pData.slug}/`, // Slash eklendi
        "description": pData.excerpt,
        "author": {
            "@type": "Organization",
            "name": "QRGenHub Team"
        }
      };
    })
  };

  return (
    <div className="w-full min-h-screen px-4 pt-8 pb-20 transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      
      <SEO 
        title={t('blog_title_seo') || 'Blog'} 
        description={t('blog_desc_seo') || 'QR kod teknolojileri, ipuçları ve rehberler.'} 
        structuredData={blogSchema}
      />

      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-gray-900 dark:text-white transition-colors">
          <span className="text-indigo-600 dark:text-indigo-400">
            {t('blog_title_main') || 'QR BLOG'}
          </span>
        </h1>
        <p className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {t('blog_subtitle') || 'QR Teknolojileri Hakkında Her Şey'}
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => {
          const postData = post.languages[currentLang] || post.languages['en'];
          
          if (!postData) return null;

          return (
            <article 
              key={post.id} 
              className="flex flex-col rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group bg-white border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
              itemScope
              itemType="https://schema.org/BlogPosting"
            >
              <div className="h-48 overflow-hidden relative bg-gray-200 dark:bg-gray-700">
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 text-indigo-700 shadow-sm backdrop-blur-sm">
                    {t(post.category)}
                  </span>
                </div>
                
                <img 
                  src={post.image} 
                  alt={post.imageAlt || postData.title} 
                  width="800"
                  height="400"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h2 className="text-xl font-bold mb-3 leading-tight text-gray-900 dark:text-white transition-colors" itemProp="headline">
                  {/* SLASH GÜNCELLEMESİ YAPILDI 👇 */}
                  <Link to={`/${currentLang}/blog/${postData.slug}/`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {postData.title}
                  </Link>
                </h2>
                
                <p className="text-xs font-medium leading-relaxed mb-6 line-clamp-3 text-gray-500 dark:text-gray-400 transition-colors" itemProp="description">
                  {postData.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider" itemProp="datePublished">
                      {formatDate(post.date)}
                  </span>
                  
                  {/* SLASH GÜNCELLEMESİ YAPILDI 👇 */}
                  <Link 
                    to={`/${currentLang}/blog/${postData.slug}/`} 
                    aria-label={`${t('read_more')} - ${postData.title}`}
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:gap-3 transition-all"
                  >
                    {t('read_more') || 'DEVAMINI OKU'} 
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Blog;