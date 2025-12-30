import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogPosts } from "../data/posts"; 
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const Blog = () => {
  const { t } = useTranslation();
  const { lng } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-gray-50/30">
      <Helmet>
        <title>Blog | {t('brand') || 'QRGEN HUB'}</title>
        <meta name="description" content="QR kod teknolojileri, dijital pazarlama ve SEO hakkında en güncel yazılar." />
      </Helmet>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">
          {t('blog_title_main')}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto font-medium">
          {t('blog_subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => {
          // Önce o dile ait içeriği alıyoruz, yoksa İngilizceye düşüyoruz
          const langContent = post.languages[lng] || post.languages['en'];

          return (
            <Link 
              // DİKKAT: post.id yerine langContent.slug kullanıyoruz
              to={`/${lng}/blog/${langContent.slug}`} 
              key={post.id}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={langContent.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600">
                  {post.category}
                </div>
              </div>
              
              <div className="p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
                  {langContent.title}
                </h2>
                
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {langContent.excerpt}
                </p>
                
                <div className="flex items-center text-xs font-black text-indigo-600 uppercase tracking-widest group-hover:tracking-[0.15em] transition-all">
                  {t('read_more')}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Blog;