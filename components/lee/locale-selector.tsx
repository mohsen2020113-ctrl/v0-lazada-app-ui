'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Globe, X, Check, ChevronRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { Language, Currency, languageConfig, currencyConfig } from '@/lib/translations';

export function LocaleSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'language' | 'currency'>('language');
  const { currentLanguage, currentCurrency, setLanguage, setCurrency, t, isRTL } = useI18n();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const languages: Language[] = ['ar', 'en', 'ae', 'fr'];
  const currencies: Currency[] = ['AED', 'SAR', 'USD', 'EUR'];

  const currencyLabels: Record<Currency, string> = {
    AED: 'UAE Dirham',
    SAR: 'Saudi Riyal',
    USD: 'US Dollar',
    EUR: 'Euro',
  };

  return (
    <>
      {/* Globe Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        aria-label="Language & Currency"
      >
        <Globe className="w-4 h-4 text-white" />
      </button>

      {/* Modal Portal - rendered at body to avoid fixed positioning issues */}
      {mounted && createPortal(
        <>
          {/* Backdrop */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-[9998]"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Bottom Sheet */}
          <div
        className={`fixed inset-x-0 bottom-0 z-[9999] bg-white rounded-t-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '70vh' }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className={`flex items-center justify-between px-4 pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 className="text-lg font-bold text-gray-900">
            {activeTab === 'language' ? t('settings.selectLanguage') : t('settings.selectCurrency')}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('language')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'language'
                ? 'text-[#f85c98] border-b-2 border-[#f85c98]'
                : 'text-gray-500'
            }`}
          >
            {t('settings.language')}
          </button>
          <button
            onClick={() => setActiveTab('currency')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'currency'
                ? 'text-[#f85c98] border-b-2 border-[#f85c98]'
                : 'text-gray-500'
            }`}
          >
            {t('settings.currency')}
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 140px)' }}>
          {activeTab === 'language' ? (
            <div className="p-2">
              {languages.map((lang) => {
                const config = languageConfig[lang];
                const isSelected = lang === currentLanguage;
                
                return (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      isSelected ? 'bg-pink-50' : 'hover:bg-gray-50'
                    } ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-2xl">{config.flag}</span>
                      <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                        <p className="font-medium text-gray-900">{config.nativeName}</p>
                        <p className="text-sm text-gray-500">{config.name}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-[#f85c98]" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-2">
              {currencies.map((currency) => {
                const isSelected = currency === currentCurrency;
                const config = currencyConfig[currency];
                
                return (
                  <button
                    key={currency}
                    onClick={() => {
                      setCurrency(currency);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      isSelected ? 'bg-pink-50' : 'hover:bg-gray-50'
                    } ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-700">
                        {config.symbol}
                      </span>
                      <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                        <p className="font-medium text-gray-900">{currency}</p>
                        <p className="text-sm text-gray-500">{currencyLabels[currency]}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-[#f85c98]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Current Selection Footer */}
        <div className={`px-4 py-3 border-t bg-gray-50 flex items-center justify-center gap-4 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-gray-500">
            {languageConfig[currentLanguage].flag} {languageConfig[currentLanguage].nativeName}
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {currencyConfig[currentCurrency].symbol} {currentCurrency}
          </span>
        </div>
      </div>
        </>,
        document.body
      )}
    </>
  );
}

// Compact version for header
export function LocaleSelectorCompact() {
  const { currentLanguage, currentCurrency } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-xs"
      >
        <span>{languageConfig[currentLanguage].flag}</span>
        <span>{currentCurrency}</span>
        <ChevronRight className="w-3 h-3" />
      </button>
      
      {isOpen && <LocaleSelectorModal onClose={() => setIsOpen(false)} />}
    </>
  );
}

function LocaleSelectorModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'language' | 'currency'>('language');
  const { currentLanguage, currentCurrency, setLanguage, setCurrency, t, isRTL } = useI18n();

  const languages: Language[] = ['ar', 'en', 'ae', 'fr'];
  const currencies: Currency[] = ['AED', 'SAR', 'USD', 'EUR'];

  const currencyLabels: Record<Currency, string> = {
    AED: 'UAE Dirham',
    SAR: 'Saudi Riyal',
    USD: 'US Dollar',
    EUR: 'Euro',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl" style={{ maxHeight: '70vh' }}>
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className={`flex items-center justify-between px-4 pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 className="text-lg font-bold text-gray-900">
            {activeTab === 'language' ? t('settings.selectLanguage') : t('settings.selectCurrency')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('language')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'language'
                ? 'text-[#f85c98] border-b-2 border-[#f85c98]'
                : 'text-gray-500'
            }`}
          >
            {t('settings.language')}
          </button>
          <button
            onClick={() => setActiveTab('currency')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'currency'
                ? 'text-[#f85c98] border-b-2 border-[#f85c98]'
                : 'text-gray-500'
            }`}
          >
            {t('settings.currency')}
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-2" style={{ maxHeight: 'calc(70vh - 140px)' }}>
          {activeTab === 'language' ? (
            languages.map((lang) => {
              const config = languageConfig[lang];
              const isSelected = lang === currentLanguage;
              
              return (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    isSelected ? 'bg-pink-50' : 'hover:bg-gray-50'
                  } ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-2xl">{config.flag}</span>
                    <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                      <p className="font-medium text-gray-900">{config.nativeName}</p>
                      <p className="text-sm text-gray-500">{config.name}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-[#f85c98]" />}
                </button>
              );
            })
          ) : (
            currencies.map((currency) => {
              const isSelected = currency === currentCurrency;
              const config = currencyConfig[currency];
              
              return (
                <button
                  key={currency}
                  onClick={() => {
                    setCurrency(currency);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    isSelected ? 'bg-pink-50' : 'hover:bg-gray-50'
                  } ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-700">
                      {config.symbol}
                    </span>
                    <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                      <p className="font-medium text-gray-900">{currency}</p>
                      <p className="text-sm text-gray-500">{currencyLabels[currency]}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-[#f85c98]" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
