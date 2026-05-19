import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import routeTranslations from '../config/routes';

const SEO = ({ title, description, image, structuredData, additionalStructuredData, localizedSlugs, toolType }) => {
  const location = useLocation();
  const siteUrl = 'https://www.qrgenhub.com';

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'es', label: 'Español' }
  ];

  // 1. URL Analizi
  const rawPathname = location.pathname;
  const cleanPathname = (rawPathname.endsWith('/') && rawPathname !== '/')
    ? rawPathname.slice(0, -1)
    : rawPathname;

  const pathSegments = cleanPathname.split('/').filter(item => item !== '');
  const firstSegment = pathSegments.length > 0 ? pathSegments[0] : null;
  const isFirstSegmentLang = languages.some(lang => lang.code === firstSegment);
  const currentLang = isFirstSegmentLang ? firstSegment : 'en';

  const withSlash = (path) => {
    return path.endsWith('/') ? path : `${path}/`;
  };

  // 2. Canonical URL Hesaplama
  let canonicalPath = cleanPathname;
  if (!isFirstSegmentLang) {
    if (pathSegments.length === 0) {
      canonicalPath = '/en/url-qr'; 
    } else {
      canonicalPath = `/en${cleanPathname.startsWith('/') ? cleanPathname : '/' + cleanPathname}`;
    }
  }

  const canonicalUrl = `${siteUrl}${withSlash(canonicalPath)}`;
  const metaImage = image || `${siteUrl}/og-image.png`;

  // 4. WebApplication Schema — sadece tool sayfalarında
  const webAppSchema = toolType ? {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "QRGenHub",
    "url": `${siteUrl}/${currentLang}/`,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": description || "Free QR code generator. Supports WiFi, URL, vCard and more.",
    "browserRequirements": "Requires JavaScript. Works on all modern browsers."
  } : null;

  // 5. BreadcrumbList Schema — blog ve tool sayfalarında otomatik
  const breadcrumbItems = [
    { "@type": "ListItem", "position": 1, "name": "QRGenHub", "item": `${siteUrl}/${currentLang}/` }
  ];
  if (localizedSlugs) {
    breadcrumbItems.push({ "@type": "ListItem", "position": 2, "name": "Blog", "item": `${siteUrl}/${currentLang}/blog/` });
    breadcrumbItems.push({ "@type": "ListItem", "position": 3, "name": title || "Post", "item": canonicalUrl });
  } else if (toolType) {
    breadcrumbItems.push({ "@type": "ListItem", "position": 2, "name": title || "QR Generator", "item": canonicalUrl });
  }
  const breadcrumbSchema = breadcrumbItems.length > 1 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems
  } : null;

  // 3. YENİ: x-default URL Hesaplama
  let xDefaultPath;
  if (localizedSlugs && localizedSlugs['en']) {
    xDefaultPath = `/en/blog/${localizedSlugs['en'].slug}`; // Blog ise İngilizce slug
  } else if (toolType && routeTranslations['en'][toolType]) {
    xDefaultPath = `/en/${routeTranslations['en'][toolType]}`; // Araç ise İngilizce araç slug'ı
  } else {
    // Diğer sayfalar için fallback (privacy, terms vb.)
    let pathWithoutLang = isFirstSegmentLang ? pathSegments.slice(1).join('/') : pathSegments.join('/');
    xDefaultPath = `/en/${pathWithoutLang || 'url-qr'}`;
  }
  const xDefaultUrl = `${siteUrl}${withSlash(xDefaultPath)}`;

  return (
    <Helmet>
      {/* --- Temel Meta --- */}
      <html lang={currentLang} />
      <title>{title || 'QRGenHub - Free QR Code Generator'}</title>
      <meta name="description" content={description || "Generate custom QR codes for free. Supports WiFi, URL, vCard and more."} />

      {/* --- Canonical --- */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* --- Open Graph --- */}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title || 'QRGenHub'} />
      <meta property="og:description" content={description || "Generate custom QR codes for free. Supports WiFi, URL, vCard and more."} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:type" content="website" />

      {/* --- Twitter Card --- */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || 'QRGenHub'} />
      <meta name="twitter:description" content={description || "Generate custom QR codes for free. Supports WiFi, URL, vCard and more."} />
      <meta name="twitter:image" content={metaImage} />

      {/* --- HREFLANG Yapılandırması --- */}
      {languages.map((lang) => {
        let hrefLangPath;

        if (localizedSlugs && localizedSlugs[lang.code]) {
           hrefLangPath = `/${lang.code}/blog/${localizedSlugs[lang.code].slug}`;
        } 
        else if (toolType && routeTranslations[lang.code] && routeTranslations[lang.code][toolType]) {
           hrefLangPath = `/${lang.code}/${routeTranslations[lang.code][toolType]}`;
        }
        else {
           let pathWithoutLang = isFirstSegmentLang ? pathSegments.slice(1).join('/') : pathSegments.join('/');
           if (!pathWithoutLang) {
             pathWithoutLang = routeTranslations[lang.code]?.url || 'url-qr';
           }
           hrefLangPath = `/${lang.code}/${pathWithoutLang}`;
        }

        return (
          <link 
            key={lang.code} 
            rel="alternate" 
            hrefLang={lang.code} 
            href={`${siteUrl}${withSlash(hrefLangPath)}`} 
          />
        );
      })}

      {/* YENİ: x-default Doğru Dinamik Yönlendirme */}
      <link 
        rel="alternate" 
        hrefLang="x-default" 
        href={xDefaultUrl} 
      />

      {/* --- Schema Markup --- */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      {additionalStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(additionalStructuredData)}
        </script>
      )}
      {webAppSchema && (
        <script type="application/ld+json">
          {JSON.stringify(webAppSchema)}
        </script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;