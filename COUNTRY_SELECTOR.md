# CountrySelector Component Documentation

## Overview

The `CountrySelector` component is a comprehensive country selection interface integrated with the 4LEEE geo-location system. It allows users to select their country and view localized delivery information, tax/duty rates, and currency details.

## Features

- **260+ Countries**: Complete global coverage with English and Arabic names
- **Two Display Modes**: Full modal interface or compact button for headers
- **Delivery Information**: Estimated shipping days from Dubai and China warehouses
- **Tax & Duty Rates**: Country-specific VAT and import duty information
- **Searchable**: Quick country lookup by name, Arabic name, or country code
- **Geo Integration**: Automatically detects current country and sets cookies
- **Accessibility**: ARIA labels, keyboard support, semantic HTML
- **Performance**: Lazy loaded modal with portal rendering

## Installation & Usage

### Basic Implementation

```typescript
'use client'

import { CountrySelector } from '@/components/CountrySelector'

export function MyComponent() {
  const handleCountryChange = (countryCode: string) => {
    console.log('Selected country:', countryCode)
  }

  return (
    <CountrySelector 
      onCountryChange={handleCountryChange}
    />
  )
}
```

### Props

```typescript
interface CountrySelectorProps {
  onCountryChange?: (country: string) => void  // Callback when country is selected
  showDeliveryInfo?: boolean                     // Show delivery days and costs (default: true)
  compact?: boolean                              // Compact mode (default: false)
}
```

### Display Modes

#### Full Mode (Default)

```typescript
<CountrySelector 
  compact={false}
  showDeliveryInfo={true}
/>
```

- Displays globe icon button
- Opens bottom sheet modal on click
- Shows full country information
- Displays delivery estimates and rates

#### Compact Mode

```typescript
<CountrySelector 
  compact={true}
  onCountryChange={handleChange}
/>
```

- Shows country code in teal button with location icon
- Ideal for headers, toolbars, and tight spaces
- Opens full modal on click for selection

## Integration Examples

### 1. In Header Component

```typescript
export function Header() {
  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between">
      <h1>4LEEE</h1>
      <div className="flex gap-3">
        <CountrySelector compact={true} />
        <LocaleSelector />
      </div>
    </header>
  )
}
```

### 2. In Settings Page

```typescript
export function SettingsPage() {
  const [selectedCountry, setSelectedCountry] = useState('')

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-2">Select Your Country</label>
        <CountrySelector 
          onCountryChange={setSelectedCountry}
          showDeliveryInfo={true}
        />
        {selectedCountry && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {selectedCountry}
          </p>
        )}
      </div>
    </div>
  )
}
```

### 3. With Delivery Cost Calculator

```typescript
import { COUNTRIES } from '@/lib/warehouse-routing'
import { CountrySelector } from '@/components/CountrySelector'

export function DeliveryCalculator() {
  const [selectedCountry, setSelectedCountry] = useState('')

  const getDeliveryInfo = () => {
    const country = COUNTRIES.find(c => c.code === selectedCountry)
    if (!country) return null

    const deliveryDays = country.preferredWarehouse === 'dubai' 
      ? country.deliveryDaysDubai 
      : country.deliveryDaysChina

    return {
      days: deliveryDays,
      cost: calculateCost(country), // your cost function
      warehouse: country.preferredWarehouse
    }
  }

  return (
    <div>
      <CountrySelector onCountryChange={setSelectedCountry} />
      {selectedCountry && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3>Estimated Delivery</h3>
          <p>{getDeliveryInfo()?.days} business days</p>
        </div>
      )}
    </div>
  )
}
```

## Data Structure

The component integrates with the `COUNTRIES` array from `lib/warehouse-routing.ts`:

```typescript
interface CountryConfig {
  code: string                      // ISO 3166-1 alpha-2 code (e.g., 'AE', 'US')
  name: string                      // English country name
  nameAr: string                    // Arabic country name
  currency: string                  // Currency code (e.g., 'AED')
  vatRate: number                   // VAT rate as decimal (0.05 = 5%)
  dutyRate: number                  // Customs duty rate
  preferredWarehouse: 'china' | 'dubai' | 'both'
  deliveryDaysChina: number         // Estimated days from China warehouse
  deliveryDaysDubai: number         // Estimated days from Dubai warehouse
  shippingZoneChina: 1 | 2 | 3 | 4 | 5 | 6
  shippingZoneDubai: 1 | 2 | 3 | 4 | 5 | 6
}
```

Example: United Arab Emirates

```typescript
{
  code: 'AE',
  name: 'United Arab Emirates',
  nameAr: 'الإمارات العربية المتحدة',
  currency: 'AED',
  vatRate: 0.05,           // 5% VAT
  dutyRate: 0.05,          // 5% duty
  preferredWarehouse: 'dubai',
  deliveryDaysChina: 10,
  deliveryDaysDubai: 2,
  shippingZoneChina: 2,
  shippingZoneDubai: 1
}
```

## Styling

The component uses Tailwind CSS with 4LEEE's teal color scheme:

- **Primary Colors**: Teal (#0d9488) for buttons and highlights
- **Background**: White for modal, gray for sections
- **Text**: Gray-900 for headers, gray-600 for descriptions
- **Borders**: Gray-300 for dividers, teal-200 for focus states

### Customization Example

To use custom colors, create a wrapper component:

```typescript
export function CustomCountrySelector(props: CountrySelectorProps) {
  // Your styling wrapper
  return (
    <div className="[&_button]:bg-blue-600 [&_button:hover]:bg-blue-700">
      <CountrySelector {...props} />
    </div>
  )
}
```

## Geo Location Integration

The component automatically:

1. **Detects Current Country**: Uses Vercel's `req.geo?.country` from middleware
2. **Sets Cookies**: Persists selection as `4leee_country` (30-day expiry)
3. **Triggers Callbacks**: Fires `onCountryChange` on selection
4. **Highlights Selection**: Shows current country with checkmark

### Cookie Format

```
4leee_country=AE; path=/; max-age=2592000; sameSite=lax
```

## Searching

The search functionality filters by:

- **English Name**: "United Arab Emirates" → finds AE
- **Arabic Name**: "الإمارات" → finds AE
- **Country Code**: "AE" → finds United Arab Emirates

Search is case-insensitive and highlights current selection first in results.

## Accessibility

- **ARIA Labels**: `aria-label="Select country"`
- **Semantic HTML**: Uses `<button>` with proper `onClick` handlers
- **Keyboard Support**: Tab navigation through countries, Enter to select
- **Screen Readers**: Describes country, delivery info, and rates
- **Focus States**: Clear focus rings on all interactive elements

## Performance Considerations

1. **Lazy Loaded Modal**: Bottom sheet only renders when opened
2. **Portal Rendering**: Modal renders at document root to avoid stacking context issues
3. **Memoized Country List**: Countries are pre-sorted with current selection first
4. **Efficient Search**: O(n) search with early filtering

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS 12+, Android 8+)

## Testing

### Test Page

Visit `/test-country-selector` to see:
- Full and compact display modes
- Current geo location data
- Currency conversion examples
- Component interactions

### Manual Testing Checklist

- [ ] Click globe icon to open modal
- [ ] Search for countries by name/code/Arabic
- [ ] Select a different country
- [ ] Verify `onCountryChange` callback fires
- [ ] Check cookie is set to new country
- [ ] Close modal and reopen to verify selection persists
- [ ] Test on mobile with touch interactions
- [ ] Tab through countries with keyboard
- [ ] Verify RTL layout for Arabic search

## Common Issues

### Issue: Modal Not Opening

**Solution**: Ensure component is wrapped in `<ClientLayout>` or marked with `'use client'` directive.

### Issue: Country Not Persisting

**Solution**: Check browser allows cookies. Verify `4leee_country` cookie is set in DevTools.

### Issue: Search Not Working

**Solution**: Try searching by country code (e.g., "AE") or exact English/Arabic name.

### Issue: Delivery Info Not Showing

**Solution**: Set `showDeliveryInfo={true}` prop (it's the default).

## API Reference

### Functions

```typescript
// Get country config by code
const country = COUNTRIES.find(c => c.code === 'AE')

// Calculate tax for amount
const taxAmount = price * country.vatRate

// Calculate delivery cost
const deliveryCost = calculateZoneShippingCost(
  country.shippingZoneDubai,
  weight
)
```

## Future Enhancements

1. **Real-time Rates**: Fetch live exchange rates from API
2. **Customs Calculator**: Detailed tariff lookup by product category
3. **Regional Clustering**: Group countries by shipping zone
4. **Favorites**: Save recently selected countries
5. **Location Permissions**: Use browser geolocation as fallback
6. **Address Validation**: Verify addresses by country

## Support

For issues or feature requests, contact the development team or open an issue in the project repository.
