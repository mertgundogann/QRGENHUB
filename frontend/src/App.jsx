import React, { useEffect, Suspense, lazy, useMemo } from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useParams, 
} from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import Footer from "./components/Footer";

// 1. KRİTİK SAYFA
import CreateQR from "./pages/CreateQR"; 

// 2. DİĞER SAYFALAR (Lazy Loaded)
const Blog = lazy(() => import("./pages/Blog"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const SimplePage = lazy(() => import("./pages/SimplePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const SUPPORTED_LANGS = ['tr', 'en', 'fr', 'de', 'es'];

const getBrowserLang = () => {
  const lang = navigator.language.split('-')[0];
  return SUPPORTED_LANGS.includes(lang) ? lang : 'en';
};

// --- ÇEVİRİ TABLOSU (URL SLUGLARI) ---
// SEO için her dilin kendi dilinde aranma hacmi olan kelimeleri kullanıyoruz
const routeTranslations = {
  en: {
    url: 'url-qr', wifi: 'wifi-qr', vcard: 'vcard-qr', text: 'text-qr', sms: 'sms-qr', email: 'email-qr', tel: 'tel-qr'
  },
  tr: {
    url: 'url-qr', wifi: 'wifi-qr', vcard: 'vcard-qr', text: 'metin-qr', sms: 'sms-qr', email: 'eposta-qr', tel: 'tel-qr'
  },
  es: {
    url: 'crear-qr-url', wifi: 'codigo-qr-wifi', vcard: 'qr-vcard', text: 'qr-de-texto', sms: 'qr-sms', email: 'qr-email', tel: 'qr-telefono'
  },
  fr: {
    url: 'creer-qr-url', wifi: 'qr-code-wifi', vcard: 'qr-vcard', text: 'qr-texte', sms: 'qr-sms', email: 'qr-email', tel: 'qr-telephone'
  },
  de: {
    url: 'url-qr-erstellen', wifi: 'wlan-qr-code', vcard: 'vcard-qr', text: 'text-qr-code', sms: 'sms-qr', email: 'email-qr', tel: 'tel-qr'
  }
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh] w-full">
    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// --- İÇERİK YÖNETİMİ ---
function AppContent() {
  const { i18n } = useTranslation();
  const { lng } = useParams();

  // 🔥 GÜVENLİK DUVARI 🔥
  const isLanguageValid = SUPPORTED_LANGS.includes(lng);

  // Geçersiz dildeyken NotFound gösterir.
  if (!isLanguageValid) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFound />
      </Suspense>
    );
  }

  // Dil değişimi
  useEffect(() => {
    if (lng && isLanguageValid && i18n.language !== lng) {
      i18n.changeLanguage(lng);
    }
  }, [lng, isLanguageValid]); // eslint-disable-line react-hooks/exhaustive-deps

  // Aktif dilin URL çevirilerini alıyoruz (hata olursa İngilizceyi varsayılan yapar)
  const localizedRoutes = routeTranslations[lng] || routeTranslations['en'];

  // Menü linklerini aktif dile göre dinamik olarak oluşturuyoruz
  // useMemo ile sadece dil değiştiğinde yeniden hesaplanmasını sağlıyoruz
  const navLinks = useMemo(() => [
    { id: localizedRoutes.url, type: "url" },
    { id: localizedRoutes.wifi, type: "wifi" },
    { id: localizedRoutes.vcard, type: "vcard" },
    { id: localizedRoutes.text, type: "text" }, 
    { id: localizedRoutes.sms, type: "sms" },
    { id: localizedRoutes.email, type: "email" },
    { id: localizedRoutes.tel, type: "tel" },    
    { id: "blog", type: "blog" }
  ], [localizedRoutes]);

  return (
    <div className="min-h-screen w-full bg-[#f1f5f9] dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-12 md:pt-20 relative overflow-x-hidden transition-colors duration-300">
      
      <Helmet>
        <html lang={lng} className={localStorage.getItem('theme') === 'dark' ? 'dark' : ''} />
      </Helmet>

      {/* Dinamik navLinks'i Header'a gönderiyoruz */}
      <Header navLinks={navLinks} />

      <main className="w-full flex-grow flex justify-center py-6">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Index'e gelenleri o dilin kendi URL aracına atıyoruz */}
            <Route index element={<Navigate to={`${localizedRoutes.url}/`} replace />} />

            {/* --- STATİK SAYFALAR --- */}
            <Route path="privacy" element={<SimplePage titleKey="privacy.title" contentKey="privacy.content" />} />
            <Route path="terms" element={<SimplePage titleKey="terms.title" contentKey="terms.content" />} />

            {/* --- QR ARAÇLARI (YERELEŞTİRİLMİŞ URL'LER) --- */}
            <Route path={localizedRoutes.url} element={<CreateQR key="url" defaultType="url" />} />
            <Route path={localizedRoutes.wifi} element={<CreateQR key="wifi" defaultType="wifi" />} />
            <Route path={localizedRoutes.vcard} element={<CreateQR key="vcard" defaultType="vcard" />} />
            <Route path={localizedRoutes.text} element={<CreateQR key="text" defaultType="text" />} />
            <Route path={localizedRoutes.sms} element={<CreateQR key="sms" defaultType="sms" />} />
            <Route path={localizedRoutes.email} element={<CreateQR key="email" defaultType="email" />} />
            <Route path={localizedRoutes.tel} element={<CreateQR key="tel" defaultType="tel" />} />
            
            {/* 🔥 YENİ: ÇAPRAZ DİL VE SEO YÖNLENDİRMELERİ (DYNAMIC CROSS-LANG REDIRECTS) 🔥 */}
            {/* Kullanıcı dil değiştirdiğinde eski dilin URL'si kalırsa, onu otomatik olarak yeni dilin URL'sine yönlendirir */}
            {Object.keys(routeTranslations.en).flatMap((toolKey) => {
              const correctSlug = localizedRoutes[toolKey]; // O anki dilin doğru slug'ı
              
              // Tüm dillerdeki bu araca ait benzersiz slug'ları bul
              const allSlugsForTool = [...new Set(Object.values(routeTranslations).map(trans => trans[toolKey]))];
              
              // Doğru slug haricindeki tüm yabancı slug'lar için yönlendirme rotası (Route) oluştur
              return allSlugsForTool
                .filter(foreignSlug => foreignSlug !== correctSlug)
                .map(foreignSlug => (
                  <Route 
                    key={`${toolKey}-${foreignSlug}`} 
                    path={foreignSlug} 
                    element={<Navigate to={`../${correctSlug}/`} replace />} 
                  />
                ));
            })}

            {/* Eski kısa kullanımlar için yönlendirmeler */}
            <Route path="url" element={<Navigate to={`../${localizedRoutes.url}/`} replace />} />
            <Route path="wifi" element={<Navigate to={`../${localizedRoutes.wifi}/`} replace />} />
            <Route path="vcard" element={<Navigate to={`../${localizedRoutes.vcard}/`} replace />} />

            {/* --- BLOG --- */}
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:postId" element={<PostDetail />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

// 🔥 ÇÖZÜM BURADA: WRAPPER BİLEŞENİ 🔥
function AppRouteWrapper() {
  const { lng } = useParams();
  return <AppContent key={lng} />;
}

function App() {
  const browserLang = getBrowserLang();
  // Tarayıcı dilinin yerelleştirilmiş URL'lerini buluyoruz
  const defaultRoutes = routeTranslations[browserLang] || routeTranslations['en'];
  
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* --- KÖK YÖNLENDİRMELERİ --- */}
          <Route path="/" element={<Navigate to={`/${browserLang}/${defaultRoutes.url}/`} replace />} />
          <Route path="/privacy" element={<Navigate to={`/${browserLang}/privacy/`} replace />} />
          <Route path="/terms" element={<Navigate to={`/${browserLang}/terms/`} replace />} />

          {/* Kök dizinden gelen eski Link Yönlendirmeleri (Direkt qrgenhub.com/wifi-qr gibi gelenler için) */}
          <Route path="/url-qr" element={<Navigate to={`/${browserLang}/${defaultRoutes.url}/`} replace />} />
          <Route path="/wifi-qr" element={<Navigate to={`/${browserLang}/${defaultRoutes.wifi}/`} replace />} />
          <Route path="/vcard-qr" element={<Navigate to={`/${browserLang}/${defaultRoutes.vcard}/`} replace />} />
          <Route path="/text-qr" element={<Navigate to={`/${browserLang}/${defaultRoutes.text}/`} replace />} />
          <Route path="/sms-qr" element={<Navigate to={`/${browserLang}/${defaultRoutes.sms}/`} replace />} />
          <Route path="/email-qr" element={<Navigate to={`/${browserLang}/${defaultRoutes.email}/`} replace />} />
          <Route path="/tel-qr" element={<Navigate to={`/${browserLang}/${defaultRoutes.tel}/`} replace />} />
          
          {/* --- ANA UYGULAMA --- */}
          <Route path="/:lng/*" element={<AppRouteWrapper />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;