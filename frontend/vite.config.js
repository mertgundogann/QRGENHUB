import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'

// Sitemap'e dahil edilecek sayfalar (5 dil için)
const paths = [
  '/tr/url', '/en/url', '/fr/url', '/de/url', '/es/url',
  '/tr/blog', '/en/blog', '/fr/blog', '/de/blog', '/es/blog',
  '/tr/blog/qr-kod-nasil-olusturulur',
  '/en/blog/qr-kod-nasil-olusturulur',
  '/fr/blog/qr-kod-nasil-olusturulur',
  '/de/blog/qr-kod-nasil-olusturulur',
  '/es/blog/qr-kod-nasil-olusturulur',
  '/tr/blog/restoran-qr-menu-avantajlari',
  '/en/blog/restoran-qr-menu-avantajlari',
  '/fr/blog/restoran-qr-menu-avantajlari',
  '/de/blog/restoran-qr-menu-avantajlari',
  '/es/blog/restoran-qr-menu-avantajlari'
];

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    sitemap({ 
      hostname: 'https://qrgen.pro', // Sitenin gerçek domainini buraya yazmalısın
      dynamicRoutes: paths,
      generateRobotsTxt: true,
      changefreq: 'weekly',
      priority: 0.8
    })
  ],
})