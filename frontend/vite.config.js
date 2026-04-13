import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from 'vite-plugin-sitemap';
import { blogPosts } from "./src/data/posts.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const paths = [
    '/tr/url', '/en/url', '/fr/url', '/de/url', '/es/url',
    '/tr/blog', '/en/blog', '/fr/blog', '/de/blog', '/es/blog',
  ];

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
        hostname: env.VITE_HOSTNAME || 'https://www.qrgenhub.com',
        dynamicRoutes: paths,
        generateRobotsTxt: false,
        changefreq: 'weekly',
        priority: 0.8,
      }),
    ],
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Sadece devasa ikon paketini ayırıyoruz
            if (id.includes('node_modules/react-icons')) {
              return 'icons';
            }
            // Diğer her şey vendor (Güvenlik için)
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
  };
});