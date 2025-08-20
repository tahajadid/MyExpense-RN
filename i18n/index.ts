import i18next, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager, Platform } from "react-native";

import translationAr from "./locales/arabic.json";
import translationFr from "./locales/french.json";

const resources = {
  fr: { translation: translationFr },
  ar: { translation: translationAr },
};

const RTL_LANGUAGES = ["ar"];
const defaultLanguage = "fr";

// Configure RTL (only for RN, not web)
if (Platform.OS !== "web") {
  const isRTL = RTL_LANGUAGES.includes(defaultLanguage);
  try {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
  } catch (e) {
    console.warn("⚠️ RTL not applied:", e);
  }
}

// Options typed explicitly to avoid overload error
const options: InitOptions = {
  resources,
  lng: defaultLanguage,
  fallbackLng: "fr",
  compatibilityJSON: "v4", // ✅ correct for i18next >= 23
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
};

// Initialize i18n
i18next.use(initReactI18next).init(options);

export default i18next;
