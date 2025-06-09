import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import type { TypedTranslationFunction } from "./translations";

import en from './locales/en.json'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    common: en,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",
    ns: ["common"],
    defaultNS: "common",
    keySeparator: ".",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  }, (error) => {
    if (error) {
      console.warn('Failed to initialized i18next-react instance');
      console.error(error);
    }
  });

export function useTypesafeTranslation(): TypedTranslationFunction {
  // If you use react-i18next:
  const { t: rawT } = useTranslation();
  return rawT as TypedTranslationFunction;
}
