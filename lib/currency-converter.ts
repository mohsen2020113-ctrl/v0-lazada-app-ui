import { EXCHANGE_RATES, CURRENCY_METADATA } from './geo'

/**
 * Server-side currency conversion utility
 * Use this in API routes and Server Components
 */

interface ConversionResult {
  originalAmount: number
  originalCurrency: string
  convertedAmount: number
  targetCurrency: string
  exchangeRate: number
  timestamp: number
}

interface PricingResult {
  aed: number
  usd: number
  eur: number
  gbp: number
  thb: number
  inr: number
  all: Record<string, number>
}

/**
 * Convert amount between two currencies with detailed result info
 */
export function convertCurrencyDetailed(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  precision: number = 2
): ConversionResult {
  const fromRate = EXCHANGE_RATES[fromCurrency]
  const toRate = EXCHANGE_RATES[toCurrency]

  if (!fromRate || !toRate) {
    throw new Error(`Exchange rate not found for ${fromCurrency} or ${toCurrency}`)
  }

  const inUSD = amount / fromRate
  const converted = inUSD * toRate
  const rate = toRate / fromRate

  return {
    originalAmount: amount,
    originalCurrency: fromCurrency,
    convertedAmount: parseFloat(converted.toFixed(precision)),
    targetCurrency: toCurrency,
    exchangeRate: parseFloat(rate.toFixed(4)),
    timestamp: Date.now(),
  }
}

/**
 * Convert price from AED to multiple major currencies at once
 * Useful for displaying prices in different regions
 */
export function convertFromAEDMultiple(aedAmount: number, currencies?: string[]): PricingResult {
  const targetCurrencies = currencies || ['AED', 'USD', 'EUR', 'GBP', 'THB', 'INR']
  const decimals = 2

  const result: PricingResult = {
    aed: aedAmount,
    usd: 0,
    eur: 0,
    gbp: 0,
    thb: 0,
    inr: 0,
    all: { AED: aedAmount },
  }

  for (const currency of targetCurrencies) {
    if (currency === 'AED') continue

    const aedRate = EXCHANGE_RATES['AED']
    const targetRate = EXCHANGE_RATES[currency]

    if (!aedRate || !targetRate) continue

    const inUSD = aedAmount / aedRate
    const converted = inUSD * targetRate
    const rounded = parseFloat(converted.toFixed(decimals))

    result.all[currency] = rounded

    // Set common currency properties
    if (currency === 'USD') result.usd = rounded
    if (currency === 'EUR') result.eur = rounded
    if (currency === 'GBP') result.gbp = rounded
    if (currency === 'THB') result.thb = rounded
    if (currency === 'INR') result.inr = rounded
  }

  return result
}

/**
 * Format currency value with proper symbol and locale
 */
export function formatCurrency(
  amount: number,
  currency: string,
  useSymbol: boolean = true,
  localize: boolean = true
): string {
  const metadata = CURRENCY_METADATA[currency]

  if (!metadata) {
    return `${currency} ${amount.toFixed(2)}`
  }

  const formatted = localize
    ? amount.toLocaleString(metadata.locale, {
        minimumFractionDigits: metadata.decimals,
        maximumFractionDigits: metadata.decimals,
      })
    : amount.toFixed(metadata.decimals)

  if (!useSymbol) {
    return `${formatted} ${currency}`
  }

  const symbol = metadata.symbol
  return metadata.position === 'before' ? `${symbol} ${formatted}` : `${formatted} ${symbol}`
}

/**
 * Get all currency symbols mapped to currency codes
 */
export function getAllCurrencySymbols(): Record<string, string> {
  const symbols: Record<string, string> = {}
  for (const [currency, metadata] of Object.entries(CURRENCY_METADATA)) {
    symbols[currency] = metadata.symbol
  }
  return symbols
}

/**
 * Get all supported currencies with metadata
 */
export function getSupportedCurrencies(): Array<{
  code: string
  symbol: string
  name: string
  nameAr: string
}> {
  return Object.entries(CURRENCY_METADATA).map(([code, metadata]) => ({
    code,
    symbol: metadata.symbol,
    name: metadata.name,
    nameAr: metadata.nameAr,
  }))
}

/**
 * Validate if currency code is supported
 */
export function isSupportedCurrency(currency: string): boolean {
  return currency in EXCHANGE_RATES && currency in CURRENCY_METADATA
}

/**
 * Get exchange rate for display (e.g., "1 AED = 0.27 USD")
 */
export function getExchangeRateDisplay(fromCurrency: string, toCurrency: string): string {
  const rate = getExchangeRate(fromCurrency, toCurrency)
  const from = CURRENCY_METADATA[fromCurrency]?.symbol || fromCurrency
  const to = CURRENCY_METADATA[toCurrency]?.symbol || toCurrency
  return `1 ${from} = ${rate} ${to}`
}

/**
 * Get the exchange rate between two currencies
 */
export function getExchangeRate(fromCurrency: string, toCurrency: string, precision: number = 4): number {
  const fromRate = EXCHANGE_RATES[fromCurrency]
  const toRate = EXCHANGE_RATES[toCurrency]

  if (!fromRate || !toRate) {
    console.warn(`[v0] Exchange rate not found for ${fromCurrency} or ${toCurrency}`)
    return 1
  }

  const rate = toRate / fromRate
  return parseFloat(rate.toFixed(precision))
}

export default {
  convertCurrencyDetailed,
  convertFromAEDMultiple,
  formatCurrency,
  getAllCurrencySymbols,
  getSupportedCurrencies,
  isSupportedCurrency,
  getExchangeRateDisplay,
  getExchangeRate,
}
