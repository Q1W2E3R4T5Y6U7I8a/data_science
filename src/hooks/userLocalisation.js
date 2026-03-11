import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import translations from '../localisation/translations';

const LANGUAGE_KEY = 'preferred_language';
const SUPPORTED_LANGUAGES = ['en', 'fr', 'ua'];

const LocalizationContext = createContext(null);

export const LocalizationProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
      return saved;
    }
    const browserLang = navigator.language.split('-')[0];
    if (SUPPORTED_LANGUAGES.includes(browserLang)) {
      return browserLang;
    }
    return 'en';
  });

  const [flagUrl, setFlagUrl] = useState('');

  useEffect(() => {
    const publicUrl = process.env.PUBLIC_URL || '';
    setFlagUrl(`${publicUrl}/flags/${language}.png`);
    localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        let fallback = translations.en;
        for (const fk of keys) {
          fallback = fallback?.[fk];
        }
        value = fallback !== undefined ? fallback : key;
        break;
      }
    }
    if (typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (_, param) => params[param] || `{${param}}`);
    }
    return value;
  }, [language]);

  const changeLanguage = useCallback((newLang) => {
    if (SUPPORTED_LANGUAGES.includes(newLang)) {
      setLanguage(newLang);
    }
  }, []);

  const getAvailableLanguages = useCallback(() => {
    return SUPPORTED_LANGUAGES.map(lang => ({
      code: lang,
      name: lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : 'Українська',
      flag: `${process.env.PUBLIC_URL || ''}/flags/${lang}.png`
    }));
  }, []);

  return (
    <LocalizationContext.Provider value={{
      language,
      t,
      changeLanguage,
      flagUrl,
      getAvailableLanguages,
      isRTL: false,
    }}>
      {children}
    </LocalizationContext.Provider>
  );
};

const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

export default useLocalization;