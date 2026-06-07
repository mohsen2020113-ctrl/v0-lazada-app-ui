# Currency Conversion System Documentation

This document describes the comprehensive currency conversion system integrated throughout the 4LEEE application.

## Overview

The 4LEEE platform supports dynamic currency conversion for customers across 40+ countries in the Middle East, Southeast Asia, South Asia, Europe, Americas, and Africa. All prices are stored in AED (UAE Dirham) and converted to user's local currency on-the-fly.

## System Architecture

### 1. Exchange Rate Data (`lib/geo.ts`)

**EXCHANGE_RATES** - Mapping of currency codes to USD rates (USD = 1.0 as base)

```typescript
export const EXCHANGE_RATES: Record<string, number> = {
  AED: 3.6725,  // UAE Dirham
  USD: 1.0,     // US Dollar (base)
  EUR: 0.92,    // Euro
  THB: 33.5,    // Thai Baht
  INR: 83.2,    // Indian Rupee
  // ... 40+ currencies
}
```

**Supported Currency Families:**
- **Middle East**: AED, SAR, KWD, QAR, BHD, OMR, EGP, JOD, LBP
- **Southeast Asia**: THB, MYR, SGD, IDR, PHP, VND, MMK, LAK, KHR
- **South Asia**: INR, PKR, BDT, LKR, NPR
- **Europe**: EUR, GBP, CHF, SEK, NOK
- **Americas**: USD, CAD, MXN, BRL, ARS
- **Asia Pacific**: CNY, JPY, KRW, TWD, HKD
- **Africa**: ZAR, NGN, KES, GHS, ETB
- **Other**: TRY, RUB, UAH

### 2. Currency Metadata (`lib/geo.ts`)

**CURRENCY_METADATA** - Formatting rules, symbols, and localization data

```typescript
export const CURRENCY_METADATA: Record<string, CurrencyMetadata> = {
  AED: {
    symbol: 'د.إ',           // Arabic symbol
    name: 'UAE Dirham',
    nameAr: 'الدرهم الإماراتي',
    position: 'after',       // Symbol after amount
    decimals: 2,
    locale: 'ar-AE'
  },
  USD: {
    symbol: '$',
    name: 'US Dollar',
    nameAr: 'الدولار الأمريكي',
    position: 'before',      // Symbol before amount
    decimals: 2,
    locale: 'en-US'
  },
  // ... 20+ currencies with complete metadata
}
```

## Core Functions

### Client-Side Utilities (`lib/geo.ts`)

#### 1. `formatPrice(amount, currency?, localize?): string`

Formats a price with currency symbol and proper locale formatting.

```typescript
formatPrice(299.99, 'AED')    // "د.إ 299.99" (AED uses position: 'after')
formatPrice(299.99, 'USD')    // "$ 299.99" (USD uses position: 'before')
formatPrice(299.99, 'THB')    // "299.99 ฿" (THB uses position: 'after')
```

#### 2. `convertCurrency(amount, fromCurrency, toCurrency, precision?): number`

Converts amount from one currency to another using USD as intermediate.

```typescript
// Convert 100 AED to USD
const usdAmount = convertCurrency(100, 'AED', 'USD', 2)  // ~27.23

// Convert 100 THB to EUR
const eurAmount = convertCurrency(100, 'THB', 'EUR', 2)  // ~2.76
```

**How it works:**
1. Convert source amount to USD using source currency rate
2. Convert USD amount to target currency using target rate
3. Return rounded to specified precision

**Formula:** 
```
amount_in_usd = amount / fromRate
result = amount_in_usd * toRate
```

#### 3. `convertFromAED(amount, toCurrency, precision?): number`

Shortcut function to convert from AED (base currency for 4LEEE).

```typescript
const thbAmount = convertFromAED(100, 'THB')  // AED 100 → THB
const usdAmount = convertFromAED(500, 'USD')  // AED 500 → USD
```

#### 4. `convertToAED(amount, fromCurrency, precision?): number`

Shortcut function to convert to AED from any currency.

```typescript
const aedAmount = convertToAED(100, 'THB')  // THB 100 → AED
const aedAmount2 = convertToAED(50, 'USD')  // USD 50 → AED
```

#### 5. `getExchangeRate(fromCurrency, toCurrency, precision?): number`

Gets the exchange rate between two currencies.

```typescript
const rate = getExchangeRate('AED', 'USD', 4)  // 0.2723 (1 AED = 0.2723 USD)
const rate2 = getExchangeRate('USD', 'EUR', 4) // 0.92 (1 USD = 0.92 EUR)
```

#### 6. `formatPriceInCurrency(aedAmount, toCurrency?, localize?): string`

Combines conversion and formatting in one step - ideal for display.

```typescript
formatPriceInCurrency(299.99, 'USD')  // "$ 81.52"
formatPriceInCurrency(299.99, 'THB')  // "9,999.35 ฿"
```

### Server-Side Utilities (`lib/currency-converter.ts`)

#### 1. `convertCurrencyDetailed(amount, fromCurrency, toCurrency, precision?): ConversionResult`

Returns detailed conversion info for logging/auditing.

```typescript
const result = convertCurrencyDetailed(100, 'AED', 'USD')
// {
//   originalAmount: 100,
//   originalCurrency: 'AED',
//   convertedAmount: 27.23,
//   targetCurrency: 'USD',
//   exchangeRate: 0.2723,
//   timestamp: 1706123456789
// }
```

#### 2. `convertFromAEDMultiple(aedAmount, currencies?): PricingResult`

Convert AED amount to multiple currencies at once - useful for price listings.

```typescript
const prices = convertFromAEDMultiple(299.99)
// {
//   aed: 299.99,
//   usd: 81.52,
//   eur: 75.00,
//   gbp: 64.39,
//   thb: 10,000.45,
//   inr: 25,000.23,
//   all: {
//     AED: 299.99,
//     USD: 81.52,
//     EUR: 75.00,
//     // ... all supported currencies
//   }
// }
```

#### 3. `formatCurrency(amount, currency, useSymbol?, localize?): string`

Server-side currency formatting.

```typescript
formatCurrency(299.99, 'AED')          // "د.إ 299.99"
formatCurrency(299.99, 'AED', false)   // "299.99 AED"
formatCurrency(299.99, 'USD')          // "$ 299.99"
```

#### 4. `getSupportedCurrencies(): Array`

Get list of all supported currencies with metadata.

```typescript
const currencies = getSupportedCurrencies()
// [
//   { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', nameAr: '...' },
//   { code: 'USD', symbol: '$', name: 'US Dollar', nameAr: '...' },
//   // ... 40+ currencies
// ]
```

#### 5. `isSupportedCurrency(currency): boolean`

Check if a currency is supported.

```typescript
isSupportedCurrency('AED')   // true
isSupportedCurrency('USD')   // true
isSupportedCurrency('XYZ')   // false
```

#### 6. `getExchangeRateDisplay(fromCurrency, toCurrency): string`

Get human-readable exchange rate for display.

```typescript
getExchangeRateDisplay('AED', 'USD')  // "1 د.إ = 0.2723 $"
getExchangeRateDisplay('USD', 'EUR')  // "1 $ = 0.92 €"
```

## Usage Examples

### Example 1: Display Product Price in User's Currency

```typescript
'use client'

import { useGeoLocation, formatPriceInCurrency } from '@/lib/geo'

export function ProductCard({ priceInAED }) {
  const geo = useGeoLocation()
  
  return (
    <div>
      <h2>Product Name</h2>
      <p className="text-xl">
        {formatPriceInCurrency(priceInAED, geo.currency)}
      </p>
    </div>
  )
}
```

### Example 2: Convert All Prices for API Response

```typescript
import { convertFromAEDMultiple } from '@/lib/currency-converter'

export async function GET(req: Request) {
  const product = await db.products.findOne({ id: 'prod-001' })
  
  // Product price is stored in AED
  const pricing = convertFromAEDMultiple(product.priceAED, [
    'AED', 'USD', 'EUR', 'THB', 'INR'
  ])
  
  return Response.json({
    product: {
      ...product,
      pricing
    }
  })
}
```

### Example 3: Currency Selector Component

```typescript
'use client'

import { getSupportedCurrencies, formatCurrency } from '@/lib/currency-converter'
import { useGeoLocation } from '@/lib/geo'

export function CurrencySelector() {
  const geo = useGeoLocation()
  const currencies = getSupportedCurrencies()
  
  return (
    <select value={geo.currency} onChange={handleChange}>
      {currencies.map(curr => (
        <option key={curr.code} value={curr.code}>
          {curr.symbol} {curr.name}
        </option>
      ))}
    </select>
  )
}
```

### Example 4: Order Summary with Multiple Currencies

```typescript
'use client'

import { convertFromAEDMultiple } from '@/lib/currency-converter'
import { useGeoLocation } from '@/lib/geo'

export function OrderSummary({ subtotalAED }) {
  const geo = useGeoLocation()
  const pricing = convertFromAEDMultiple(subtotalAED)
  
  return (
    <div>
      <p>Subtotal: {pricing[geo.currency.toLowerCase()]}</p>
      <p>Tax: {pricing[geo.currency.toLowerCase()] * 0.05}</p>
      <p>Total: {pricing[geo.currency.toLowerCase()] * 1.05}</p>
    </div>
  )
}
```

## Exchange Rate Updates

Exchange rates are hardcoded in `EXCHANGE_RATES` and update every release. For real-time rates, consider:

1. **Option A**: Update rates from external API (Free Tier API, Open Exchange Rates)
   - Add scheduled job to fetch and cache rates
   - Update `EXCHANGE_RATES` periodically

2. **Option B**: Use Redis cache with periodic updates
   ```typescript
   const rates = await redis.get('4leee:exchange-rates') 
   // Fall back to EXCHANGE_RATES if cache miss
   ```

3. **Option C**: Integration with fintech API
   - Use Wise, OXR, or similar for accurate, live rates

## Testing Currency Conversions

```typescript
// Test conversion accuracy
import { convertCurrency, getExchangeRate } from '@/lib/geo'

describe('Currency Conversion', () => {
  it('should convert AED to USD correctly', () => {
    const result = convertCurrency(100, 'AED', 'USD', 2)
    expect(result).toBe(27.23)  // 100 / 3.6725 * 1.0
  })
  
  it('should handle round-trip conversions', () => {
    let amount = 100
    amount = convertCurrency(amount, 'AED', 'USD')
    amount = convertCurrency(amount, 'USD', 'AED', 0)
    expect(amount).toBe(100)  // Should round-trip correctly
  })
})
```

## Performance Considerations

1. **Cache Exchange Rates**: Rates are constants, so no runtime lookup needed
2. **Memoize Conversions**: Cache converted prices in components
3. **Batch Conversions**: Use `convertFromAEDMultiple()` instead of multiple calls
4. **Lazy Load**: Only load currency metadata when needed

## Security Notes

- Exchange rates are non-sensitive data (public knowledge)
- All conversions happen on client or server without external API calls
- No payment processing uses these rates (always use payment gateway rates)
- For order confirmation, store the conversion rate used at purchase time

## Future Enhancements

1. Real-time exchange rate updates from external API
2. Historical rate tracking for analytics
3. Currency preference saving per user
4. Rounding rules per currency and market
5. Cryptocurrency support (BTC, ETH, etc.)
6. Multi-rate pricing strategies per region
