import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from './locales/en.js'
// import hu from './locales/hu'

// NOTE: also set language setting labels in ./routes/settings.tsx
export type SupportedLanguage = 'en' | 'hu';

export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_NS = "t";
export const resources = {
  en: { t: en },
  // hu: { t: en },
  // hu: { t: hu },
};

i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // supportedLngs: ["en", "hu"] as SupportedLanguage[],
    lng: typeof window === 'undefined'
      ? DEFAULT_LANGUAGE
      : (window.localStorage.getItem('homepage-language') ?? DEFAULT_LANGUAGE),
    defaultNS: DEFAULT_NS,
    resources,
    // interpolation: {
    //   escapeValue: false, // react already safe from xss
    // },
  }, (error) => {
    if (error) {
      console.warn('Failed to initialized i18n instance');
      console.error(error);
    }
  });

export default i18next;

// // Example
// declare module "i18next" {
//   interface CustomTypeOptions {
//     defaultNS: typeof DEFAULT_NS;
//     resources: typeof resources;
//   }
// }

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    defaultNS: typeof DEFAULT_NS;
    resources: typeof resources.en,
    // resources: {
    //   // types based on default language dictionary
    //   t: typeof en;
    // };
  }
}