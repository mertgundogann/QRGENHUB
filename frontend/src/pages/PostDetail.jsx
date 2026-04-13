import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogPosts } from "../data/posts"; 
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const PostDetail = () => {
  const { postId, lng } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const contentRef = useRef(null);
  const [isSyncing, setIsSyncing] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(lng, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  useEffect(() => {
    if (lng && i18n.language !== lng) {
      i18n.changeLanguage(lng);
    }

    const currentPost = blogPosts.find((p) => 
      Object.values(p.languages).some(lang => lang.slug === postId)
    );

    if (currentPost) {
      const correctSlug = currentPost.languages[lng]?.slug;
      if (correctSlug && correctSlug !== postId) {
        setIsSyncing(true);
        navigate(`/${lng}/blog/${correctSlug}/`, { replace: true });
        return;
      }
    }
    
    setIsSyncing(false);
  }, [lng, postId, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isSyncing) return;
    const handleContentClick = (e) => {
      const link = e.target.closest('a');
      if (link) {
        let url = link.getAttribute('href');
        if (url && (url.startsWith('/') || url.startsWith(window.location.origin))) {
          e.preventDefault();
          const path = url.startsWith('http') ? new URL(url).pathname : url;
          const cleanPath = path.replace(/^\/(tr|en|fr|de|es)/, '');
          const targetPath = (cleanPath === '/' || cleanPath === '') ? '/url-qr/' : cleanPath;
          
          let finalUrl = `/${lng}${targetPath.startsWith('/') ? targetPath : '/' + targetPath}`;
          if (!finalUrl.endsWith('/')) {
             finalUrl += '/';
          }
          
          navigate(finalUrl);
        }
      }
    };
    const contentDiv = contentRef.current;
    if (contentDiv) contentDiv.addEventListener('click', handleContentClick);
    return () => { if (contentDiv) contentDiv.removeEventListener('click', handleContentClick); };
  }, [navigate, lng, isSyncing]);

  const post = blogPosts.find((p) => p.languages[lng]?.slug === postId);
  const langContent = post?.languages[lng];

  if (isSyncing || !post || !langContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
        {!isSyncing && (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{t('post_not_found')}</h2>
            <button onClick={() => navigate(`/${lng}/blog/`)} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">
              {t('back_to_blog')}
            </button>
          </div>
        )}
      </div>
    );
  }

  // --- 1. SCHEMA DÜZELTMESİ ---
  // Author kısmını "Person" yerine "Organization" yaptık ve sabit isim verdik.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": langContent.title,
    "image": [post.image],
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Organization", // Kişi değil Kurum
      "name": "QRGenHub Team", // Senin ismin yerine Takım ismi
      "url": "https://www.qrgenhub.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "QRGenHub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.qrgenhub.com/favicon-96x96.png"
      }
    },
    "description": langContent.metaDescription || langContent.excerpt,
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.qrgenhub.com/${lng}/blog/${langContent.slug}/`
    }
  };

  return (
    <div className="w-full min-h-screen transition-colors duration-300 bg-white dark:bg-gray-900 pb-20">
      <SEO 
        title={langContent.title} 
        description={langContent.metaDescription || langContent.excerpt} 
        image={post.image}
        localizedSlugs={post.languages} 
        structuredData={articleSchema}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <button 
          onClick={() => navigate(`/${lng}/blog/`)}
          className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-all"
        >
          <span>←</span> {t('back_to_blog')}
        </button>

        <header className="mb-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-indigo-600 dark:text-indigo-400">
            {t('blog_title_main')}
          </p>
          
          <div className="inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
            {t(post.category)}
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 italic tracking-tighter uppercase text-gray-900 dark:text-white transition-colors">
            {langContent.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <span>📅 {formatDate(post.date)}</span>
            
            {/* --- 2. GÖRSEL DÜZELTME --- */}
            {/* Burada yazan {post.author} bloğunu tamamen sildim. */}
            {/* Artık ekranda sadece tarih görünecek, isim görünmeyecek. */}
            
          </div>
        </header>

        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 border-8 transition-colors duration-300 border-white bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
          <img 
            src={post.image} 
            alt={post.imageAlt || langContent.title} 
            width="1200" 
            height="630" 
            className="w-full h-auto object-cover min-h-[300px]"
            loading="eager" 
          />
        </div>

        <article className="prose prose-indigo lg:prose-xl max-w-none px-2 md:px-6 dark:prose-invert transition-colors duration-300">
          <div 
            ref={contentRef}
            className="leading-relaxed font-medium blog-content text-gray-600 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: langContent.content }} 
          />
        </article>

        <div className="mt-16 p-8 md:p-12 rounded-[3rem] text-center shadow-xl transition-all bg-indigo-600 shadow-indigo-100 dark:bg-indigo-700 dark:shadow-none">
          <h3 className="text-white text-2xl font-black mb-4 uppercase italic tracking-tight">
            {t('cta_blog_title')}
          </h3>
          <p className="text-indigo-100 mb-8 font-medium">
            {t('cta_blog_desc')}
          </p>
          <button 
            onClick={() => navigate(`/${lng}/url-qr/`)}
            className="px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 bg-white text-indigo-600 hover:bg-indigo-50 dark:bg-gray-900 dark:text-indigo-400 dark:hover:bg-gray-800"
          >
            {t('cta_blog_button')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;