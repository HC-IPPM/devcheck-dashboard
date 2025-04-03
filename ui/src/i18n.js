import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector'; // Add this import

const isCloudRun = window.location.hostname.includes("run.app");
const isCloudShell = window.location.hostname.includes("cloudshell");
const basePath = isCloudRun || isCloudShell ? "/locales" : "../public/locales";

i18n
  .use(HttpBackend)
  .use(LanguageDetector) // Use the language detector
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    backend: {
      // loadPath: `${basePath}/{{lng}}/translation.json`,
      loadPath: '/locales/{{lng}}/translation.json',
    },
    react: {
      useSuspense: false,
    },
    debug: true, // Enable debug mode to see more detailed logs
  });

export default i18n;