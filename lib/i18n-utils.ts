/**
 * 4LEEE Internationalization Utilities
 * Provides type-safe helpers and utilities for translation management
 */

import { Language, Currency } from './translations';

/**
 * Translation key namespace for better type safety and organization
 * Use these keys with the t() function from useI18n hook
 */
export const TranslationKeys = {
  // Navigation
  nav: {
    home: 'nav.home',
    cart: 'nav.cart',
    account: 'nav.account',
    fashion: 'nav.fashion',
    messages: 'nav.messages',
  },
  
  // Actions
  action: {
    addToCart: 'action.addToCart',
    buyNow: 'action.buyNow',
    search: 'action.search',
    checkout: 'action.checkout',
    continueShopping: 'action.continueShopping',
    back: 'action.back',
    viewAll: 'action.viewAll',
    shopNow: 'action.shopNow',
    remove: 'action.remove',
    loadMore: 'action.loadMore',
    seeAll: 'action.seeAll',
  },
  
  // Products
  product: {
    price: 'product.price',
    quantity: 'product.quantity',
    inStock: 'product.inStock',
    outOfStock: 'product.outOfStock',
    onlyXLeft: 'product.onlyXLeft',
    freeShipping: 'product.freeShipping',
    sold: 'product.sold',
    reviews: 'product.reviews',
  },
  
  // Promotions
  promo: {
    flashSale: 'promo.flashSale',
    paydaySale: 'promo.paydaySale',
    off: 'promo.off',
    upTo: 'promo.upTo',
    ourProducts: 'promo.ourProducts',
    dailyDeals: 'promo.dailyDeals',
    justForYou: 'promo.justForYou',
  },
  
  // Cart
  cart: {
    empty: 'cart.empty',
    subtotal: 'cart.subtotal',
    total: 'cart.total',
    items: 'cart.items',
    shipping: 'cart.shipping',
  },
  
  // Status
  status: {
    loading: 'status.loading',
    noResults: 'status.noResults',
    error: 'status.error',
    noProducts: 'status.noProducts',
    allLoaded: 'status.allLoaded',
  },
  
  // Search
  search: {
    placeholder: 'search.placeholder',
    results: 'search.results',
    searchingFor: 'search.searchingFor',
  },
  
  // Categories
  category: {
    all: 'category.all',
    electronics: 'category.electronics',
    fashion: 'category.fashion',
    beauty: 'category.beauty',
    home: 'category.home',
  },
  
  // Settings
  settings: {
    language: 'settings.language',
    currency: 'settings.currency',
    selectLanguage: 'settings.selectLanguage',
    selectCurrency: 'settings.selectCurrency',
  },
  
  // 4LEEE Brand
  fourLeee: {
    brand: '4leee.brand',
    tagline: '4leee.tagline',
    wallet: '4leee.wallet',
    assistant: '4leee.assistant',
    store: '4leee.store',
    rewards: '4leee.rewards',
    flash: '4leee.flash',
    land: '4leee.land',
  },
  
  // Account
  account: {
    myOrders: 'account.myOrders',
    myWallet: 'account.myWallet',
    myGames: 'account.myGames',
    wishlist: 'account.wishlist',
    reviews: 'account.reviews',
    chat: 'account.chat',
    billing: 'account.billing',
    followed: 'account.followed',
    memberships: 'account.memberships',
    tryBuy: 'account.tryBuy',
    security: 'account.security',
    policies: 'account.policies',
    help: 'account.help',
    feedback: 'account.feedback',
    logout: 'account.logout',
  },
} as const;

/**
 * Type for translation key paths
 */
export type TranslationKey = typeof TranslationKeys[keyof typeof TranslationKeys][keyof typeof TranslationKeys[keyof typeof TranslationKeys]];

/**
 * Language option for dropdowns
 */
export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

/**
 * Currency option for dropdowns
 */
export interface CurrencyOption {
  code: Currency;
  name: string;
  symbol: string;
}

/**
 * Get all available languages
 */
export const getLanguageOptions = (): LanguageOption[] => [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
];

/**
 * Get all available currencies
 */
export const getCurrencyOptions = (): CurrencyOption[] => [
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
];

/**
 * Format a number according to locale
 */
export const formatNumber = (number: number, language: Language): string => {
  const formatter = new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : language === 'th' ? 'th-TH' : language === 'fr' ? 'fr-FR' : 'en-US');
  return formatter.format(number);
};

/**
 * Format a date according to locale
 */
export const formatDate = (date: Date, language: Language): string => {
  const formatter = new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : language === 'th' ? 'th-TH' : language === 'fr' ? 'fr-FR' : 'en-US');
  return formatter.format(date);
};

/**
 * Get text direction for language
 */
export const getTextDirection = (language: Language): 'ltr' | 'rtl' => {
  return language === 'ar' ? 'rtl' : 'ltr';
};

/**
 * Check if language is RTL
 */
export const isRTLLanguage = (language: Language): boolean => {
  return language === 'ar';
};

/**
 * Get language name by code
 */
export const getLanguageName = (code: Language): string => {
  const options = getLanguageOptions();
  return options.find(lang => lang.code === code)?.nativeName || code;
};

/**
 * Get currency name by code
 */
export const getCurrencyName = (code: Currency): string => {
  const options = getCurrencyOptions();
  return options.find(curr => curr.code === code)?.name || code;
};
