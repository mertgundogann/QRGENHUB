import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogPosts } from "../data/posts";
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const PostDetail = () => {
  const { postId, lng } = useParams(); // postId = URL'deki mevcut slug
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // Yönlendirme sırasında eski dildeki içeriğin görünmesini engellemek için state
  const [isSyncing, setIsSyncing] = useState(true);

  const SUPPORTED_LANGS = ['tr', 'en', 'fr', 'de', 'es'];

  useEffect(() => {
    // 1. i18next dilini URL parametresiyle eşitle
    if (lng && i18n.language !== lng) {
      i18n.changeLanguage(lng);
    }

    // 2. Dil/Slug Senkronizasyonu Kontrolü
    // postId'nin hangi blog yazısına ait olduğunu bul (tüm dilleri tara)
    const currentPost = blogPosts.find((p) => 
      Object.values(p.languages).some(lang => lang.slug === postId)
    );

    if (currentPost) {
      const correctSlug = currentPost.languages[lng]?.slug;

      // Eğer URL'deki slug, seçili dilin slug'ı ile uyuşmuyorsa (Dil değişmişse)
      if (correctSlug && correctSlug !== postId) {
        setIsSyncing(true); // İçeriği geçici olarak gizle
        navigate(`/${lng}/blog/${correctSlug}`, { replace: true });
        return;
      }
    }
    
    // Her şey senkronize olduğunda içeriği göster
    setIsSyncing(false);
  }, [lng, postId, navigate, i18n]);

  // Render edilecek postu ve içeriği belirle
  const post = blogPosts.find((p) => p.languages[lng]?.slug === postId);
  const langContent = post?.languages[lng];

  // Senkronizasyon sırasında veya yazı bulunamadığında loader/boşluk göster
  if (isSyncing || !post || !langContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white/50">
        {!isSyncing && (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">{t('post_not_found')}</h2>
            <button 
              onClick={() => navigate(`/${lng}/blog`)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold"
            >
              {t('back_to_blog')}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 bg-white/50 min-h-screen">
      <Helmet>
        <title>{langContent.title} | QRGEN HUB</title>
        <meta name="description" content={langContent.excerpt} />
        
        {/* SEO: Hreflang Linkleri */}
        {SUPPORTED_LANGS.map((sLang) => {
          const sSlug = post.languages[sLang]?.slug;
          return sSlug ? (
            <link 
              key={sLang}
              rel="alternate" 
              hreflang={sLang} 
              href={`${window.location.origin}/${sLang}/blog/${sSlug}`} 
            />
          ) : null;
        })}
        
        <link 
          rel="alternate" 
          hreflang="x-default" 
          href={`${window.location.origin}/en/blog/${post.languages['en']?.slug}`} 
        />
        <link rel="canonical" href={`${window.location.origin}/${lng}/blog/${postId}`} />
      </Helmet>

      {/* Geri Dön Butonu */}
      <button 
        onClick={() => navigate(`/${lng}/blog`)}
        className="mb-8 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition-all"
      >
        <span>←</span> {t('back_to_blog')}
      </button>

      <header className="mb-10 text-center">
        <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
          {t('blog_title_main')}
        </p>

        <div className="inline-block px-4 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6">
          {post.category}
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6 italic tracking-tighter uppercase">
          {langContent.title}
        </h1>
      </header>

      <div className="rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 border-8 border-white bg-gray-100">
        <img 
          src={post.image} 
          alt={langContent.title} 
          className="w-full h-auto object-cover min-h-[300px]"
          loading="lazy"
        />
      </div>

      <article className="prose prose-indigo lg:prose-xl max-w-none px-2 md:px-6">
        <div 
          className="text-gray-600 leading-relaxed font-medium blog-content"
          dangerouslySetInnerHTML={{ __html: langContent.content }} 
        />
      </article>

      {/* Sayfa Altı CTA */}
      <div className="mt-16 p-8 md:p-12 bg-indigo-600 rounded-[3rem] text-center shadow-xl shadow-indigo-100">
        <h3 className="text-white text-2xl font-black mb-4 uppercase italic tracking-tight">
          {t('cta_blog_title')}
        </h3>
        <p className="text-indigo-100 mb-8 font-medium">
          {t('cta_blog_desc')}
        </p>
        <button 
          onClick={() => navigate(`/${lng}/`)}
          className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95"
        >
          {t('cta_blog_button')}
        </button>
      </div>
    </div>
  );
};

export default PostDetail;