import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// NOTE: vite-plugin-sitemap was removed because it generated a broken sitemap
// (wrong URLs, no trailing slashes, no hreflang tags) that overwrote the
// carefully crafted public/sitemap.xml on every build.
// The sitemap is maintained manually in public/sitemap.xml.

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
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