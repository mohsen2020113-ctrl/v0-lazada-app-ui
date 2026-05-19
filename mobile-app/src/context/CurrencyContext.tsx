—// mobile-app/src/context/CurrencyContext.tsx
// LEE E-Commerce Platform — Mobile App Currency Context (React / Vite)

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  CURRENCIES,
  CurrencyConfig,
  convert,
  convertFromAED,
  formatPrice,
  formatDualPrice,
  getCurrencyForCountry,
  getAllCurrencies,
} from '../lib/currency-engine'

const SESSION_KEY = 'lee_mobile_currency'
const DEFAULT_CURRENCY = 'AED'

export interface DualPrice {
  local: string
  aed: string
}

export interface CurrencyContextValue {
  currency: string
  config: CurrencyConfig
  currencies: CurrencyConfig[]
  setCurrency: (code: string) => void
  convert: (amount: number, from?: string, to?: string) => number
  formatFromAED: (amountAED: number) => string
  format: (amount: number, currencyCode?: string) => string
  dualPrice: (amountAED: number) => DualPrice
  getCurrencyForCountry: (countryCode: string) => string
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

function readSession(): string {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY)
    if (stored && CURRENCIES[stored]) return stored
  } catch {}
  return DEFAULT_CURRENCY
}

function writeSession(code: string): void {
  try {
    sessionStorage.setItem(SESSION_KEY, code)
  } catch {}
}

interface CurrencyProviderProps {
  children: React.ReactNode
  initialCurrency?: string
}

export function CurrencyProvider({ children, initialCurrency }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<string>(() => {
    if (initialCurrency && CURRENCIES[initialCurrency]) return initialCurrency
    return readSession()
  })

  useEffect(() => {
    writeSession(currency)
  }, [currency])

  const setCurrency = useCallback((code: string) => {
    if (!CURRENCIES[code]) {
      console.warn(`[CurrencyContext] Unknown currency code: ${code}`)
      return
    }
    setCurrencyState(code)
  }, [])

  const convertFn = useCallback(
    (amount: number, from?: string, to?: string): number => {
      const src = from ?? currency
      const dst = to ?? currency
      if (src === dst) return amount
      return convert(amount, src, dst)
    },
    [currency]
  )

  const formatFromAED = useCallback(
    (amountAED: number): string => {
      const converted = convertFromAED(amountAED, currency)
      return formatPrice(converted, currency)
    },
    [currency]
  )

  const format = useCallback(
    (amount: number, currencyCode?: string): string => {
      return formatPrice(amount, currencyCode ?? currency)
    },
    [currency]
  )

  const dualPrice = useCallback(
    (amountAED: number): DualPrice => {
      return formatDualPrice(amountAED, currency)
    },
    [currency]
  )

  const value: CurrencyContextValue = {
    currency,
    config: CURRENCIES[currency],
    currencies: getAllCurrencies(),
    setCurrency,
    convert: convertFn,
    formatFromAED,
    format,
    dualPrice,
    getCurrencyForCountry,
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

/**
 * Access currency state and helpers anywhere inside <CurrencyProvider>.
 *
 * @example
 * const { currency, setCurrency, formatFromAED } = useCurrency()
 * const price = formatFromAED(149.99)  // "US$40.87" when currency = "USD"
 */
export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext)
  if (!ctx) {
    throw new Error('useCurrency must be used inside <CurrencyProvider>')
  }
  return ctx
}

export default CurrencyContext
