import { useTranslation as useUntypedTranslation } from "react-i18next";

export function useTranslation() {
  const provided = useUntypedTranslation();

  return {
    ...provided,
    t: provided.t as UseTranslationTyped,
  }
}

type UseTranslationTyped = () => string;