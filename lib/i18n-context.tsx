'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Currency, languageConfig, t as translate, formatPrice as formatPriceUtil } from './translations';

interface I18nContextType {
  currentLanguage: Language;
  currentCurrency: Currency;
  isRTL: boolean;
  isHydrated: boolean;
  setLanguage: (lang: Language) => void;
  setCurrency: (currency: Currency) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  formatPrice: (priceInAED: number) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [currentCurrency, setCurrentCurrency] = useState<Currency>('AED');
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount (after hydration)
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('lee_language') as Language;
      const savedCurrency = localStorage.getItem('lee_currency') as Currency;
      
      if (savedLang && ['en', 'ar', 'th', 'fr'].includes(savedLang)) {
        setCurrentLanguage(savedLang);
      }
      if (savedCurrency && ['AED', 'SAR', 'USD', 'EUR'].includes(savedCurrency)) {
        setCurrentCurrency(savedCurrency);
      }
    } catch (e) {
      // localStorage might not be available
    }
    
    setIsHydrated(true);
  }, []);

  // Update document direction when language changes
  useEffect(() => {
    if (!isHydrated) return;
    
    try {
      const isRTL = languageConfig[currentLanguage].rtl;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = currentLanguage;
      
      // Add/remove RTL class for Tailwind
      if (isRTL) {
        document.documentElement.classList.add('rtl');
      } else {
        document.documentElement.classList.remove('rtl');
      }
    } catch (e) {
      // Document might not be available
    }
  }, [currentLanguage, isHydrated]);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('lee_language', lang);
    } catch (e) {
      // localStorage might not be available
    }
  };

  const setCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
    try {
      localStorage.setItem('lee_currency', currency);
    } catch (e) {
      // localStorage might not be available
    }
  };

  // Only use RTL after hydration to avoid hydration mismatch
  const isRTL = isHydrated ? languageConfig[currentLanguage].rtl : false;

  const t = (key: string, replacements?: Record<string, string | number>) => {
    return translate(key, currentLanguage, replacements);
  };

  const formatPrice = (priceInAED: number) => {
    return formatPriceUtil(priceInAED, currentCurrency, isRTL);
  };

  return (
    <I18nContext.Provider
      value={{
        currentLanguage,
        currentCurrency,
        isRTL,
        isHydrated,
        setLanguage,
        setCurrency,
        t,
        formatPrice,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
