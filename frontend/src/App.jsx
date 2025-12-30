import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import CreateQR from "./pages/CreateQR";
import Blog from "./pages/Blog";
import PostDetail from "./pages/PostDetail";
import SimplePage from './pages/SimplePage';
import Header from "./components/Header";
import Footer from "./components/Footer";

const SUPPORTED_LANGS = ['tr', 'en', 'fr', 'de', 'es'];
const DOMAIN = "https://qrgenhub.com";

const getBrowserLang = () => {
  const lang = navigator.language.split('-')[0];
  return SUPPORTED_LANGS.includes(lang) ? lang : 'en';
};

const navLinks = [
  { id: "url", type: "url" },
  { id: "wifi", type: "wifi" },
  { id: "vcard", type: "vcard" },
  { id: "text", type: "text" }, 
  { id: "sms", type: "sms" },
  { id: "email", type: "email" },
  { id: "tel", type: "tel" },   
  { id: "blog", type: "blog" }
];

function AppContent() {
  const { t, i18n } = useTranslation();
  const { lng } = useParams();
  const location = useLocation();

  useEffect(() => {
    if (lng && SUPPORTED_LANGS.includes(lng) && i18n.language !== lng) {
      i18n.changeLanguage(lng);
    }
  }, [lng, i18n]);

  // Sayfa başlığı yönetimi
  const activeId = location.pathname.split('/')[2] || 'url'; 
  const currentCategory = navLinks.find(l => l.id === activeId)?.type || 'url';
  const pageTitle = currentCategory === 'blog' 
    ? t('blog') 
    : t('title_pattern', { type: t(`qr.type.${currentCategory}`), suffix: t('title_suffix') });

  return (
    <div className="min-h-screen w-full bg-[#f1f5f9] flex flex-col items-center pt-12 md:pt-20 relative overflow-x-hidden">
      <Helmet>
        <html lang={lng} />
        <title>{pageTitle} | QRGEN HUB</title>
        <link rel="canonical" href={`${DOMAIN}${location.pathname}`} />

        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-title" content="QRGENHUB" />
  <link rel="manifest" href="/site.webmanifest" />
      </Helmet>

      <Header navLinks={navLinks} />

      <main className="w-full flex-grow flex justify-center py-6">
        <Routes>
          <Route path="url" element={<CreateQR key="url" defaultType="url" />} />
          <Route path="text" element={<CreateQR key="text" defaultType="text" />} />
          <Route path="wifi" element={<CreateQR key="wifi" defaultType="wifi" />} />
          <Route path="vcard" element={<CreateQR key="vcard" defaultType="vcard" />} />
          <Route path="tel" element={<CreateQR key="tel" defaultType="tel" />} />
          <Route path="sms" element={<CreateQR key="sms" defaultType="sms" />} />
          <Route path="email" element={<CreateQR key="email" defaultType="email" />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:postId" element={<PostDetail />} />
          <Route path="privacy" element={<SimplePage titleKey="privacy.title" contentKey="privacy.content" />} />
          <Route path="terms" element={<SimplePage titleKey="terms.title" contentKey="terms.content" />} />
          <Route path="*" element={<Navigate to="url" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  const browserLang = getBrowserLang();
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={`/${browserLang}/url`} replace />} />
          <Route path="/:lng/*" element={<AppContent />} />
          <Route path="*" element={<Navigate to={`/${browserLang}/url`} replace />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;