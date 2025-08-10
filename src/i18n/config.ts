"use client";
import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import fr from "./locales/fr/common.json";
import en from "./locales/en/common.json";

// Initialize i18n for client components. We'll lazy init in a safe-guarded way.
export const DEFAULT_LOCALE = "fr" as const;
export const SUPPORTED_LOCALES = ["fr", "en"] as const;

let initialized = false;

export function ensureI18n() {
  if (initialized) return i18n;
  i18n
    .use(initReactI18next)
    .init({
      lng: DEFAULT_LOCALE,
      fallbackLng: DEFAULT_LOCALE,
      resources: {
        fr: { common: fr },
        en: { common: en },
      },
      ns: ["common"],
      defaultNS: "common",
      interpolation: { escapeValue: false },
      returnEmptyString: false,
    });
  initialized = true;
  return i18n;
}

export default i18n;
