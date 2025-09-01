import i18n from "@/i18n"; // your existing i18n index
import React, { createContext, useContext, useState } from "react";

type LanguageContextType = {
  language: string;
  rtl: boolean;
  changeLanguage: (lng: string) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language || "fr");
  const [rtl, setRtl] = useState(language === "ar");

  const changeLanguage = async (lng: string) => {
    // Change i18n language
    await i18n.changeLanguage(lng);

    // Update RTL state (runtime only, no restart)
    setRtl(lng === "ar");
    setLanguage(lng);

    // Optionally update I18nManager for native apps / bare workflow
    // I18nManager.allowRTL(lng === "ar");
    // I18nManager.forceRTL(lng === "ar");
    // RNRestart.Restart(); // only if in Bare workflow
  };

  return (
    <LanguageContext.Provider value={{ language, rtl, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};
