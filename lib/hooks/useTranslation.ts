/**
 * Custom hooks for i18n with type safety and convenience methods
 */

'use client';

import { useI18n as useI18nContext } from '@/lib/i18n-context';
import { TranslationKeys, TranslationKey, LanguageOption, CurrencyOption, getLanguageOptions, getCurrencyOptions, getTextDirection, isRTLLanguage } from '@/lib/i18n-utils';
import { Language, Currency } from '@/lib/translations';

/**
 * Enhanced useI18n hook with typed translation keys and additional utilities
 */
export function useTranslation() {
  const { t, setLanguage, setCurrency, currentLanguage, currentCurrency, isRTL, formatPrice } = useI18nContext();

  return {
    // Core i18n functions
    t,
    setLanguage,
    setCurrency,
    formatPrice,
    
    // Current settings
    currentLanguage,
    currentCurrency,
    isRTL,
    
    // Translation shortcuts with type safety
    trans: (key: TranslationKey, replacements?: Record<string, string | number>) => 
      t(key, replacements),
    
    // Common translations
    nav: {
      home: () => t(TranslationKeys.nav.home),
      cart: () => t(TranslationKeys.nav.cart),
      account: () => t(TranslationKeys.nav.account),
      fashion: () => t(TranslationKeys.nav.fashion),
      messages: () => t(TranslationKeys.nav.messages),
    },
    
    actions: {
      addToCart: () => t(TranslationKeys.action.addToCart),
      buyNow: () => t(TranslationKeys.action.buyNow),
      search: () => t(TranslationKeys.action.search),
      checkout: () => t(TranslationKeys.action.checkout),
      continueShopping: () => t(TranslationKeys.action.continueShopping),
      back: () => t(TranslationKeys.action.back),
      viewAll: () => t(TranslationKeys.action.viewAll),
      shopNow: () => t(TranslationKeys.action.shopNow),
      remove: () => t(TranslationKeys.action.remove),
      loadMore: () => t(TranslationKeys.action.loadMore),
      seeAll: () => t(TranslationKeys.action.seeAll),
    },
    
    products: {
      price: () => t(TranslationKeys.product.price),
      quantity: () => t(TranslationKeys.product.quantity),
      inStock: () => t(TranslationKeys.product.inStock),
      outOfStock: () => t(TranslationKeys.product.outOfStock),
      onlyXLeft: (x: number) => t(TranslationKeys.product.onlyXLeft, { x }),
      freeShipping: () => t(TranslationKeys.product.freeShipping),
      sold: () => t(TranslationKeys.product.sold),
      reviews: () => t(TranslationKeys.product.reviews),
    },
    
    promos: {
      flashSale: () => t(TranslationKeys.promo.flashSale),
      paydaySale: () => t(TranslationKeys.promo.paydaySale),
      off: () => t(TranslationKeys.promo.off),
      upTo: () => t(TranslationKeys.promo.upTo),
      ourProducts: () => t(TranslationKeys.promo.ourProducts),
      dailyDeals: () => t(TranslationKeys.promo.dailyDeals),
      justForYou: () => t(TranslationKeys.promo.justForYou),
    },
    
    cart: {
      empty: () => t(TranslationKeys.cart.empty),
      subtotal: () => t(TranslationKeys.cart.subtotal),
      total: () => t(TranslationKeys.cart.total),
      items: () => t(TranslationKeys.cart.items),
      shipping: () => t(TranslationKeys.cart.shipping),
    },
    
    status: {
      loading: () => t(TranslationKeys.status.loading),
      noResults: () => t(TranslationKeys.status.noResults),
      error: () => t(TranslationKeys.status.error),
      noProducts: () => t(TranslationKeys.status.noProducts),
      allLoaded: () => t(TranslationKeys.status.allLoaded),
    },
    
    fourLeee: {
      brand: () => t(TranslationKeys.fourLeee.brand),
      tagline: () => t(TranslationKeys.fourLeee.tagline),
      wallet: () => t(TranslationKeys.fourLeee.wallet),
      assistant: () => t(TranslationKeys.fourLeee.assistant),
      store: () => t(TranslationKeys.fourLeee.store),
      rewards: () => t(TranslationKeys.fourLeee.rewards),
      flash: () => t(TranslationKeys.fourLeee.flash),
      land: () => t(TranslationKeys.fourLeee.land),
    },
    
    account: {
      myOrders: () => t(TranslationKeys.account.myOrders),
      myWallet: () => t(TranslationKeys.account.myWallet),
      myGames: () => t(TranslationKeys.account.myGames),
      wishlist: () => t(TranslationKeys.account.wishlist),
      reviews: () => t(TranslationKeys.account.reviews),
      chat: () => t(TranslationKeys.account.chat),
      billing: () => t(TranslationKeys.account.billing),
      followed: () => t(TranslationKeys.account.followed),
      memberships: () => t(TranslationKeys.account.memberships),
      tryBuy: () => t(TranslationKeys.account.tryBuy),
      security: () => t(TranslationKeys.account.security),
      policies: () => t(TranslationKeys.account.policies),
      help: () => t(TranslationKeys.account.help),
      feedback: () => t(TranslationKeys.account.feedback),
      logout: () => t(TranslationKeys.account.logout),
    },
    
    // Language options
    languageOptions: getLanguageOptions(),
    currencyOptions: getCurrencyOptions(),
    
    // Utilities
    textDirection: getTextDirection(currentLanguage),
    isRTLLang: isRTLLanguage(currentLanguage),
  };
}

/**
 * Hook to get all language options
 */
export function useLanguageOptions(): LanguageOption[] {
  return getLanguageOptions();
}

/**
 * Hook to get all currency options
 */
export function useCurrencyOptions(): CurrencyOption[] {
  return getCurrencyOptions();
}

/**
 * Hook to manage language switching
 */
export function useLanguageSwitcher() {
  const { currentLanguage, setLanguage } = useI18nContext();
  
  return {
    currentLanguage,
    setLanguage,
    languages: getLanguageOptions(),
  };
}

/**
 * Hook to manage currency switching
 */
export function useCurrencySwitcher() {
  const { currentCurrency, setCurrency, formatPrice } = useI18nContext();
  
  return {
    currentCurrency,
    setCurrency,
    currencies: getCurrencyOptions(),
    formatPrice,
  };
}
