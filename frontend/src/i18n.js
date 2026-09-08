import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import enTranslation from './locales/en.json';
import siTranslation from './locales/si.json';
import taTranslation from './locales/ta.json';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      si: { translation: siTranslation },
      ta: { translation: taTranslation }
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;