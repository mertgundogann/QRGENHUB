import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from 'vite-plugin-sitemap';
import { blogPosts } from './blogPosts'; // Blog verilerini import et

export default defineConfig(({ mode }) => {
  // .env dosyasını yükle
  const env = loadEnv(mode, process.cwd(), '');

  // Temel sayfalar (5 dil)
  const paths = [
    '/tr/url', '/en/url', '/fr/url', '/de/url', '/es/url',
    '/tr/blog', '/en/blog', '/fr/blog', '/de/blog', '/es/blog',
  ];

  // Dinamik blog sayfalarını ekle
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
