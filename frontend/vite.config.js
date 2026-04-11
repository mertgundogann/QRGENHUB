import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from 'vite-plugin-sitemap';
import { blogPosts } from "../frontend/src/data/posts.js"

export default defineConfig(({ mode }) => {
  // .env dosyasını yükle
  const env = loadEnv(mode, process.cwd(), '');

  const langs = ['tr', 'en', 'fr', 'de', 'es'];
  const qrTypes = ['url', 'wifi', 'vcard', 'text', 'sms', 'email', 'tel'];
  const staticPages = ['privacy', 'terms'];

  const paths = [];

  // QR generator pages for all languages
  langs.forEach(lang => {
    qrTypes.forEach(type => paths.push(`/${lang}/${type}`));
    staticPages.forEach(page => paths.push(`/${lang}/${page}`));
    paths.push(`/${lang}/blog`);
  });

  // Dynamic blog post pages
  blogPosts.forEach(post => {
    Object.entries(post.languages).forEach(([lang, data]) => {
      paths.push(`/${lang}/blog/${data.slug}`);
    });
  });

  return {
    plugins: [
      react(),
      tailwindcss(),
      sitemap({
        hostname: env.VITE_HOSTNAME || 'https://qrgenhub.com',
        dynamicRoutes: paths,
        generateRobotsTxt: true,
        changefreq: 'weekly',
        priority: 0.8,
      }),
    ],
    define: {
      
    },
  };
});
