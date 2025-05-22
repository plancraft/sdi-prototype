import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { enGB, itIT, deIT } from './locales';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'en-GB': {
        translation: enGB,
      },
      'it-IT': {
        translation: itIT,
      },
      'de-IT': {
        translation: deIT,
      },
    },
    fallbackLng: 'de-IT',
    lng: 'de-IT', // Force German as the default language
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;