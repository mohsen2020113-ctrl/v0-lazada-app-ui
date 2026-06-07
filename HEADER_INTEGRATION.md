# Header Components - CountrySelector Integration

## Overview

The Header components have been enhanced with CountrySelector integration, allowing users to quickly change their country/region directly from the header. Both the main SearchHeader and generic Header components now support the CountrySelector.

## Components Updated

### 1. SearchHeader (`components/lee/search-header.tsx`)

The SearchHeader is the primary header used on the homepage and most pages. It now includes the CountrySelector by default.

**Features:**
- Compact CountrySelector button positioned on the left of the search bar
- Full voice search, camera, and QR code scanning capabilities
- Responsive design for mobile and desktop
- Optional toggle via `showCountrySelector` prop

**Usage:**

```typescript
import { SearchHeader } from '@/components/lee/search-header'

export function MyComponent() {
  return (
    <SearchHeader 
      placeholder="Search products..."
      showCountrySelector={true}  // default: true
    />
  )
}
```

**Props:**

```typescript
interface SearchHeaderProps {
  placeholder?: string        // Search input placeholder (default: "Search products...")
  showCountrySelector?: boolean  // Show/hide country selector (default: true)
}
```

### 2. Header (`components/lee/header.tsx`)

The generic Header component used in various pages (account, settings, etc.) now supports CountrySelector.

**Features:**
- Optional CountrySelector button
- Back button for navigation
- Search functionality
- Pink gradient background with white text
- Responsive sizing for mobile and desktop

**Usage:**

```typescript
import { Header } from '@/components/lee/header'

export function MyPage() {
  return (
    <Header 
      title="My Account"
      showBack={true}
      showCountrySelector={true}  // default: false
      onSearchChange={(value) => console.log(value)}
    />
  )
}
```

**Props:**

```typescript
interface HeaderProps {
  title?: string                    // Header title
  showBack?: boolean               // Show back button (default: false)
  showSearch?: boolean             // Show search input (default: false)
  showCountrySelector?: boolean    // Show country selector (default: false)
  onSearchChange?: (value: string) => void
  onSearch?: () => void
}
```

## Visual Layout

### SearchHeader Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ [AE] [Search bar.................] [🎥] [🎤]                   │
│      └─ CountrySelector       └─ Camera  └─ Mic                │
└─────────────────────────────────────────────────────────────────┘
```

### Generic Header Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ [AE] [◀] My Account  OR  [AE] [Search bar.................] │
└─────────────────────────────────────────────────────────────────┘
```

## Integration Examples

### Example 1: Homepage with Country Selector

```typescript
export default function HomePage() {
  return (
    <div>
      <SearchHeader 
        showCountrySelector={true}
      />
      {/* Rest of content */}
    </div>
  )
}
```

### Example 2: Account Page with Optional Country Selector

```typescript
export function AccountPage() {
  return (
    <div>
      <Header 
        title="My Account"
        showBack={true}
        showCountrySelector={true}  // Enable if you want it
      />
      {/* Account content */}
    </div>
  )
}
```

### Example 3: Conditional Country Selector

```typescript
'use client'

import { Header } from '@/components/lee/header'
import { useGeo } from '@/lib/hooks/useGeo'

export function MyPage() {
  const geo = useGeo()
  const isGulfCountry = ['AE', 'SA', 'KW', 'QA'].includes(geo.country)

  return (
    <Header 
      title="Products"
      showCountrySelector={!isGulfCountry}  // Hide for Gulf users
    />
  )
}
```

## Styling & Appearance

### SearchHeader
- **Background**: White
- **CountrySelector**: Teal compact button with location icon
- **Search bar**: Full-width gray rounded search field
- **Action buttons**: Gray circular buttons for camera and microphone

### Generic Header
- **Background**: Pink to darker pink gradient (`from-[#f85c98] to-[#ec407a]`)
- **CountrySelector**: When enabled, compact button appears on left
- **Text**: White text for contrast
- **Back button**: White with hover effect

## CountrySelector Behavior

### When User Clicks CountrySelector

1. **Modal Opens**: Bottom sheet modal appears with country list
2. **Current Selection**: Currently selected country is highlighted with checkmark
3. **Searchable**: User can search by country name, Arabic name, or code
4. **Delivery Info**: Shows estimated delivery days and currency
5. **Selection**: Clicking a country updates the selection and closes modal
6. **Cookie Set**: Selection is persisted in `4leee_country` cookie

### Mobile Experience

- Modal appears as full-height bottom sheet
- Touch-friendly interface with large hit targets
- Smooth scroll animation
- Easy close button in header

## Server vs Client Components

- **SearchHeader**: `'use client'` - Full client-side interactivity
- **Header**: `'use client'` - Full client-side interactivity
- **CountrySelector**: `'use client'` - Client-side modal and selection

All components are client components to support real-time interactivity.

## Performance Optimizations

1. **Lazy Modal**: CountrySelector modal only renders when opened
2. **Portal Rendering**: Modal renders at document root to avoid stacking context issues
3. **Memoized Countries**: Countries pre-sorted with current selection first
4. **Efficient Search**: O(n) search with early filtering

## Accessibility

- ✅ ARIA labels on all buttons
- ✅ Keyboard navigation support
- ✅ Focus indicators on interactive elements
- ✅ Screen reader friendly labels
- ✅ Semantic HTML structure

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 12+, Android 8+)

## Troubleshooting

### CountrySelector Not Visible

**Check 1**: Verify `showCountrySelector` prop is `true`

```typescript
<SearchHeader showCountrySelector={true} />
```

**Check 2**: Ensure CountrySelector component is imported correctly

```typescript
import { CountrySelector } from '@/components/CountrySelector'
```

**Check 3**: Check browser console for errors

### Modal Not Opening

**Solution**: Ensure component is marked as `'use client'` directive

### Country Not Persisting

**Solution**: Check browser allows cookies. Verify `4leee_country` cookie in DevTools

## Future Enhancements

1. **Header Customization**: Theme variants (light/dark)
2. **Sticky Header**: Option to stick header on scroll
3. **Header Search Suggestions**: Real-time search suggestions
4. **Analytics**: Track country selection events
5. **Language Selector Integration**: Combine with language selector in header

## Related Components

- **CountrySelector** (`components/CountrySelector.tsx`) - The modal component
- **Locale Selector** (`components/lee/locale-selector.tsx`) - Language selection
- **Currency Selector** (`components/lee/currency-selector.tsx`) - Currency selection

## Testing

### Manual Testing Checklist

- [ ] Click on CountrySelector button in header
- [ ] Modal opens with country list
- [ ] Search works by country name
- [ ] Search works by country code
- [ ] Search works by Arabic name
- [ ] Select a different country
- [ ] Modal closes after selection
- [ ] Cookie is set to new country
- [ ] Page reloads and selection persists
- [ ] Test on mobile device
- [ ] Test keyboard navigation (Tab, Enter)
- [ ] Test on different screen sizes

### Test Page

Visit `/test-country-selector` to see both header modes and CountrySelector in action.

## Files Modified

- `components/lee/search-header.tsx` - Added CountrySelector import and integration
- `components/lee/header.tsx` - Added CountrySelector import and integration

## Commits

- "Integrate CountrySelector component into Header components" - Latest commit integrating CountrySelector
