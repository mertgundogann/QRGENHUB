// Shared route translations — imported by App.jsx, PostDetail.jsx, and any other component
// that needs language-specific tool slugs.
const routeTranslations = {
  en: { url: 'url-qr',         wifi: 'wifi-qr',        vcard: 'vcard-qr', text: 'text-qr',       sms: 'sms-qr',  email: 'email-qr',  tel: 'tel-qr'       },
  tr: { url: 'url-qr',         wifi: 'wifi-qr',        vcard: 'vcard-qr', text: 'metin-qr',      sms: 'sms-qr',  email: 'eposta-qr', tel: 'tel-qr'       },
  es: { url: 'crear-qr-url',   wifi: 'codigo-qr-wifi', vcard: 'qr-vcard', text: 'qr-de-texto',   sms: 'qr-sms',  email: 'qr-email',  tel: 'qr-telefono'  },
  fr: { url: 'creer-qr-url',   wifi: 'qr-code-wifi',   vcard: 'qr-vcard', text: 'qr-texte',      sms: 'qr-sms',  email: 'qr-email',  tel: 'qr-telephone' },
  de: { url: 'url-qr-erstellen', wifi: 'wlan-qr-code', vcard: 'vcard-qr', text: 'text-qr-code',  sms: 'sms-qr',  email: 'email-qr',  tel: 'tel-qr'       },
};

export default routeTranslations;
