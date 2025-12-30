import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";


import tr from "./locales/tr.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import es from "./locales/es.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      tr: { translation: tr },
      en: { translation: en },
      fr: { translation: fr },
      de: { translation: de },
      es: { translation: es }
    },
    fallbackLng: "en",
    keySeparator: false, 
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;