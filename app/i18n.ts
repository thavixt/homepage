import i18n, { type ResourceLanguage } from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import type { TypedTranslationFunction } from "./translations";
import en from './locales/en.json'
import hu from './locales/hu.json'

const DEFAULT_LANGUAGE = 'en';
export type SupportedLanguages = 'en' | 'hu';

// the translation json files
const resources: Record<SupportedLanguages, {common: ResourceLanguage}> = {
  en: {
    common: en,
  },
  hu: {
    common: hu,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    // lng: "en",
    lng: typeof window === 'undefined' ? DEFAULT_LANGUAGE : (window.localStorage.getItem('homepage-language') ?? DEFAULT_LANGUAGE),
    supportedLngs: ["en", "hu"] as SupportedLanguages[],
    // TODO: might be worth splitting into multiple namespace.json files
    // when the number of translations is not manageable anymore
    ns: ["common"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false, // react already safe from xss
    },
    // afaik defining custom error handlers can be skipped it this point,
    // since the type-safe translation methods should prevent them from being invoked anyway?
  }, (error) => {
    if (error) {
      console.warn('Failed to initialized i18next-react instance');
      console.error(error);
    }
  });

// useTranslation hook augmented with type-safe parameters
export function useTypesafeTranslation(): TypedTranslationFunction {
  const { t: rawT } = useTranslation();
  return rawT as TypedTranslationFunction;
}

// default i18n object augmented with type-safe translate method
// for use in reducer side-effects like toasts or whatever later
export default {
  ...i18n,
  translate: i18n.t as TypedTranslationFunction,
}
