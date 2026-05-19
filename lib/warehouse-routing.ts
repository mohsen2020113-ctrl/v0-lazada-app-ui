// lib/warehouse-routing.ts
// Smart Warehouse Routing System for LEE e-commerce platform

export interface WarehouseConfig {
  id: 'china' | 'dubai';
  name: string;
  nameAr: string;
  processingHours: number;
  costPerKg: number; // AED
  coordinates: { lat: number; lng: number };
}

export interface CountryConfig {
  code: string;
  name: string;
  nameAr: string;
  currency: string;
  vatRate: number;
  dutyRate: number;
  preferredWarehouse: 'china' | 'dubai' | 'both';
  deliveryDaysChina: number;
  deliveryDaysDubai: number;
  shippingZoneChina: 1 | 2 | 3 | 4 | 5 | 6;
  shippingZoneDubai: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface WarehouseShippingDetail {
  warehouse: WarehouseConfig;
  totalCostAED: number;
  shippingCostAED: number;
  customsDutyAED: number;
  vatAED: number;
  estimatedDays: number;
  savingsVsAlternativeAED: number;
}

export interface WarehouseRecommendation {
  recommendedWarehouse: 'china' | 'dubai';
  alternativeWarehouse: 'china' | 'dubai';
  recommended: WarehouseShippingDetail;
  alternative: WarehouseShippingDetail;
  reasoning: string;
}

// ─── Warehouse Definitions ───────────────────────────────────────────────────

export const WAREHOUSES: Record<'china' | 'dubai', WarehouseConfig> = {
  china: {
    id: 'china',
    name: 'Shenzhen, China',
    nameAr: 'شنزن، الصين',
    processingHours: 24,
    costPerKg: 2.5,
    coordinates: { lat: 22.5431, lng: 114.0579 },
  },
  dubai: {
    id: 'dubai',
    name: 'Dubai Free Zone',
    nameAr: 'دبي المنطقة الحرة',
    processingHours: 12,
    costPerKg: 3.0,
    coordinates: { lat: 25.2048, lng: 55.2708 },
  },
};

// ─── Zone Multipliers ─────────────────────────────────────────────────────────

const ZONE_MULTIPLIERS: Record<number, number> = {
  1: 1.0,
  2: 1.3,
  3: 1.6,
  4: 2.0,
  5: 2.5,
  6: 3.2,
};

// ─── 260-Country Database ─────────────────────────────────────────────────────

export const COUNTRIES: CountryConfig[] = [
  // ── GCC ──────────────────────────────────────────────────────────────────
  { code: 'AE', name: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', currency: 'AED', vatRate: 5, dutyRate: 5, preferredWarehouse: 'dubai', deliveryDaysChina: 10, deliveryDaysDubai: 2, shippingZoneChina: 2, shippingZoneDubai: 1 },
  { code: 'SA', name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', currency: 'SAR', vatRate: 15, dutyRate: 5, preferredWarehouse: 'dubai', deliveryDaysChina: 10, deliveryDaysDubai: 3, shippingZoneChina: 2, shippingZoneDubai: 1 },
  { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', currency: 'KWD', vatRate: 0, dutyRate: 5, preferredWarehouse: 'dubai', deliveryDaysChina: 10, deliveryDaysDubai: 2, shippingZoneChina: 2, shippingZoneDubai: 1 },
  { code: 'QA', name: 'Qatar', nameAr: 'قطر', currency: 'QAR', vatRate: 0, dutyRate: 5, preferredWarehouse: 'dubai', deliveryDaysChina: 10, deliveryDaysDubai: 2, shippingZoneChina: 2, shippingZoneDubai: 1 },
  { code: 'BH', name: 'Bahrain', nameAr: 'البحرين', currency: 'BHD', vatRate: 10, dutyRate: 5, preferredWarehouse: 'dubai', deliveryDaysChina: 10, deliveryDaysDubai: 2, shippingZoneChina: 2, shippingZoneDubai: 1 },
  { code: 'OM', name: 'Oman', nameAr: 'عُمان', currency: 'OMR', vatRate: 5, dutyRate: 5, preferredWarehouse: 'dubai', deliveryDaysChina: 10, deliveryDaysDubai: 3, shippingZoneChina: 2, shippingZoneDubai: 1 },

  // ── Middle East ───────────────────────────────────────────────────────────
  { code: 'JO', name: 'Jordan', nameAr: 'الأردن', currency: 'JOD', vatRate: 16, dutyRate: 10, preferredWarehouse: 'dubai', deliveryDaysChina: 12, deliveryDaysDubai: 4, shippingZoneChina: 2, shippingZoneDubai: 2 },
  { code: 'LB', name: 'Lebanon', nameAr: 'لبنان', currency: 'LBP', vatRate: 11, dutyRate: 15, preferredWarehouse: 'dubai', deliveryDaysChina: 12, deliveryDaysDubai: 4, shippingZoneChina: 2, shippingZoneDubai: 2 },
  { code: 'IQ', name: 'Iraq', nameAr: 'العراق', currency: 'IQD', vatRate: 0, dutyRate: 15, preferredWarehouse: 'dubai', deliveryDaysChina: 12, deliveryDaysDubai: 5, shippingZoneChina: 2, shippingZoneDubai: 2 },
  { code: 'SY', name: 'Syria', nameAr: 'سوريا', currency: 'SYP', vatRate: 0, dutyRate: 15, preferredWarehouse: 'dubai', deliveryDaysChina: 14, deliveryDaysDubai: 6, shippingZoneChina: 2, shippingZoneDubai: 2 },
  { code: 'YE', name: 'Yemen', nameAr: 'اليمن', currency: 'YER', vatRate: 0, dutyRate: 5, preferredWarehouse: 'dubai', deliveryDaysChina: 14, deliveryDaysDubai: 6, shippingZoneChina: 2, shippingZoneDubai: 2 },
  { code: 'PS', name: 'Palestine', nameAr: 'فلسطين', currency: 'ILS', vatRate: 17, dutyRate: 12, preferredWarehouse: 'dubai', deliveryDaysChina: 14, deliveryDaysDubai: 5, shippingZoneChina: 2, shippingZoneDubai: 2 },
  { code: 'IR', name: 'Iran', nameAr: 'إيران', currency: 'IRR', vatRate: 9, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 14, deliveryDaysDubai: 7, shippingZoneChina: 3, shippingZoneDubai: 3 },
  { code: 'AF', name: 'Afghanistan', nameAr: 'أفغانستان', currency: 'AFN', vatRate: 10, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 16, deliveryDaysDubai: 8, shippingZoneChina: 3, shippingZoneDubai: 3 },

  // ── North Africa ──────────────────────────────────────────────────────────
  { code: 'EG', name: 'Egypt', nameAr: 'مصر', currency: 'EGP', vatRate: 14, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 12, deliveryDaysDubai: 5, shippingZoneChina: 2, shippingZoneDubai: 2 },
  { code: 'LY', name: 'Libya', nameAr: 'ليبيا', currency: 'LYD', vatRate: 0, dutyRate: 15, preferredWarehouse: 'dubai', deliveryDaysChina: 14, deliveryDaysDubai: 6, shippingZoneChina: 2, shippingZoneDubai: 2 },
  { code: 'TN', name: 'Tunisia', nameAr: 'تونس', currency: 'TND', vatRate: 19, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 15, deliveryDaysDubai: 7, shippingZoneChina: 2, shippingZoneDubai: 3 },
  { code: 'DZ', name: 'Algeria', nameAr: 'الجزائر', currency: 'DZD', vatRate: 19, dutyRate: 30, preferredWarehouse: 'dubai', deliveryDaysChina: 15, deliveryDaysDubai: 7, shippingZoneChina: 2, shippingZoneDubai: 3 },
  { code: 'MA', name: 'Morocco', nameAr: 'المغرب', currency: 'MAD', vatRate: 20, dutyRate: 25, preferredWarehouse: 'dubai', deliveryDaysChina: 15, deliveryDaysDubai: 7, shippingZoneChina: 2, shippingZoneDubai: 3 },
  { code: 'SD', name: 'Sudan', nameAr: 'السودان', currency: 'SDG', vatRate: 17, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 14, deliveryDaysDubai: 7, shippingZoneChina: 2, shippingZoneDubai: 3 },
  { code: 'MR', name: 'Mauritania', nameAr: 'موريتانيا', currency: 'MRU', vatRate: 16, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 16, deliveryDaysDubai: 9, shippingZoneChina: 3, shippingZoneDubai: 3 },

  // ── Sub-Saharan Africa ────────────────────────────────────────────────────
  { code: 'NG', name: 'Nigeria', nameAr: 'نيجيريا', currency: 'NGN', vatRate: 7.5, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 8, shippingZoneChina: 3, shippingZoneDubai: 3 },
  { code: 'ZA', name: 'South Africa', nameAr: 'جنوب أفريقيا', currency: 'ZAR', vatRate: 15, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 18, deliveryDaysDubai: 10, shippingZoneChina: 4, shippingZoneDubai: 4 },
  { code: 'KE', name: 'Kenya', nameAr: 'كينيا', currency: 'KES', vatRate: 16, dutyRate: 25, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 8, shippingZoneChina: 3, shippingZoneDubai: 3 },
  { code: 'ET', name: 'Ethiopia', nameAr: 'إثيوبيا', currency: 'ETB', vatRate: 15, dutyRate: 30, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 9, shippingZoneChina: 3, shippingZoneDubai: 3 },
  { code: 'GH', name: 'Ghana', nameAr: 'غانا', currency: 'GHS', vatRate: 12.5, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 9, shippingZoneChina: 3, shippingZoneDubai: 3 },
  { code: 'TZ', name: 'Tanzania', nameAr: 'تنزانيا', currency: 'TZS', vatRate: 18, dutyRate: 25, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 9, shippingZoneChina: 3, shippingZoneDubai: 3 },
  { code: 'SN', name: 'Senegal', nameAr: 'السنغال', currency: 'XOF', vatRate: 18, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 10, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'CM', name: 'Cameroon', nameAr: 'الكاميرون', currency: 'XAF', vatRate: 19.25, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 10, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'CI', name: "Côte d'Ivoire", nameAr: 'ساحل العاج', currency: 'XOF', vatRate: 18, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 10, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'AO', name: 'Angola', nameAr: 'أنغولا', currency: 'AOA', vatRate: 14, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 22, deliveryDaysDubai: 11, shippingZoneChina: 4, shippingZoneDubai: 4 },
  { code: 'MZ', name: 'Mozambique', nameAr: 'موزمبيق', currency: 'MZN', vatRate: 17, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 22, deliveryDaysDubai: 10, shippingZoneChina: 4, shippingZoneDubai: 4 },
  { code: 'ZM', name: 'Zambia', nameAr: 'زامبيا', currency: 'ZMW', vatRate: 16, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 22, deliveryDaysDubai: 10, shippingZoneChina: 4, shippingZoneDubai: 4 },
  { code: 'ZW', name: 'Zimbabwe', nameAr: 'زيمبابوي', currency: 'ZWL', vatRate: 15, dutyRate: 40, preferredWarehouse: 'dubai', deliveryDaysChina: 22, deliveryDaysDubai: 10, shippingZoneChina: 4, shippingZoneDubai: 4 },
  { code: 'UG', name: 'Uganda', nameAr: 'أوغندا', currency: 'UGX', vatRate: 18, dutyRate: 25, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 9, shippingZoneChina: 3, shippingZoneDubai: 3 },
  { code: 'RW', name: 'Rwanda', nameAr: 'رواندا', currency: 'RWF', vatRate: 18, dutyRate: 25, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 9, shippingZoneChina: 3, shippingZoneDubai: 3 },
  { code: 'ML', name: 'Mali', nameAr: 'مالي', currency: 'XOF', vatRate: 18, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 11, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'BF', name: 'Burkina Faso', nameAr: 'بوركينا فاسو', currency: 'XOF', vatRate: 18, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 11, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'NE', name: 'Niger', nameAr: 'النيجر', currency: 'XOF', vatRate: 19, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 11, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'TD', name: 'Chad', nameAr: 'تشاد', currency: 'XAF', vatRate: 18, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 10, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'SO', name: 'Somalia', nameAr: 'الصومال', currency: 'SOS', vatRate: 0, dutyRate: 5, preferredWarehouse: 'dubai', deliveryDaysChina: 18, deliveryDaysDubai: 7, shippingZoneChina: 3, shippingZoneDubai: 3 },
  { code: 'DJ', name: 'Djibouti', nameAr: 'جيبوتي', currency: 'DJF', vatRate: 0, dutyRate: 15, preferredWarehouse: 'dubai', deliveryDaysChina: 18, deliveryDaysDubai: 7, shippingZoneChina: 3, shippingZoneDubai: 3 },
  { code: 'ER', name: 'Eritrea', nameAr: 'إريتريا', currency: 'ERN', vatRate: 0, dutyRate: 10, preferredWarehouse: 'dubai', deliveryDaysChina: 18, deliveryDaysDubai: 7, shippingZoneChina: 3, shippingZoneDubai: 3 },
  { code: 'MW', name: 'Malawi', nameAr: 'مالاوي', currency: 'MWK', vatRate: 16.5, dutyRate: 25, preferredWarehouse: 'dubai', deliveryDaysChina: 22, deliveryDaysDubai: 10, shippingZoneChina: 4, shippingZoneDubai: 4 },
  { code: 'BJ', name: 'Benin', nameAr: 'بنين', currency: 'XOF', vatRate: 18, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 10, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'TG', name: 'Togo', nameAr: 'توغو', currency: 'XOF', vatRate: 18, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 10, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'GN', name: 'Guinea', nameAr: 'غينيا', currency: 'GNF', vatRate: 18, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 11, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'GW', name: 'Guinea-Bissau', nameAr: 'غينيا بيساو', currency: 'XOF', vatRate: 17, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 12, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'SL', name: 'Sierra Leone', nameAr: 'سيراليون', currency: 'SLL', vatRate: 15, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 11, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'LR', name: 'Liberia', nameAr: 'ليبيريا', currency: 'LRD', vatRate: 10, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 11, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'GA', name: 'Gabon', nameAr: 'الغابون', currency: 'XAF', vatRate: 18, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 10, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'CG', name: 'Republic of the Congo', nameAr: 'جمهورية الكونغو', currency: 'XAF', vatRate: 18, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 22, deliveryDaysDubai: 11, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'CD', name: 'DR Congo', nameAr: 'جمهورية الكونغو الديمقراطية', currency: 'CDF', vatRate: 16, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 22, deliveryDaysDubai: 11, shippingZoneChina: 4, shippingZoneDubai: 4 },
  { code: 'GQ', name: 'Equatorial Guinea', nameAr: 'غينيا الاستوائية', currency: 'XAF', vatRate: 15, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 11, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'ST', name: 'São Tomé and Príncipe', nameAr: 'ساو تومي وبرينسيبي', currency: 'STN', vatRate: 15, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 22, deliveryDaysDubai: 12, shippingZoneChina: 4, shippingZoneDubai: 5 },
  { code: 'CF', name: 'Central African Republic', nameAr: 'جمهورية أفريقيا الوسطى', currency: 'XAF', vatRate: 19, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 22, deliveryDaysDubai: 12, shippingZoneChina: 4, shippingZoneDubai: 4 },
  { code: 'SS', name: 'South Sudan', nameAr: 'جنوب السودان', currency: 'SSP', vatRate: 0, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 10, shippingZoneChina: 3, shippingZoneDubai: 3 },
  { code: 'BI', name: 'Burundi', nameAr: 'بوروندي', currency: 'BIF', vatRate: 18, dutyRate: 25, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 10, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'MG', name: 'Madagascar', nameAr: 'مدغشقر', currency: 'MGA', vatRate: 20, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 22, deliveryDaysDubai: 12, shippingZoneChina: 4, shippingZoneDubai: 5 },
  { code: 'KM', name: 'Comoros', nameAr: 'جزر القمر', currency: 'KMF', vatRate: 10, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 22, deliveryDaysDubai: 10, shippingZoneChina: 4, shippingZoneDubai: 4 },
  { code: 'SC', name: 'Seychelles', nameAr: 'سيشيل', currency: 'SCR', vatRate: 15, dutyRate: 25, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 8, shippingZoneChina: 4, shippingZoneDubai: 3 },
  { code: 'MU', name: 'Mauritius', nameAr: 'موريشيوس', currency: 'MUR', vatRate: 15, dutyRate: 15, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 9, shippingZoneChina: 4, shippingZoneDubai: 3 },
  { code: 'CV', name: 'Cape Verde', nameAr: 'الرأس الأخضر', currency: 'CVE', vatRate: 15, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 22, deliveryDaysDubai: 12, shippingZoneChina: 4, shippingZoneDubai: 5 },
  { code: 'GM', name: 'Gambia', nameAr: 'غامبيا', currency: 'GMD', vatRate: 15, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 20, deliveryDaysDubai: 12, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'BW', name: 'Botswana', nameAr: 'بوتسوانا', currency: 'BWP', vatRate: 14, dutyRate: 25, preferredWarehouse: 'dubai', deliveryDaysChina: 22, deliveryDaysDubai: 11, shippingZoneChina: 4, shippingZoneDubai: 4 },
  { code: 'NA', name: 'Namibia', nameAr: 'ناميبيا', currency: 'NAD', vatRate: 15, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 22, deliveryDaysDubai: 12, shippingZoneChina: 4, shippingZoneDubai: 4 },
  { code: 'LS', name: 'Lesotho', nameAr: 'ليسوتو', currency: 'LSL', vatRate: 15, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 22, deliveryDaysDubai: 12, shippingZoneChina: 4, shippingZoneDubai: 4 },
  { code: 'SZ', name: 'Eswatini', nameAr: 'إسواتيني', currency: 'SZL', vatRate: 15, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 22, deliveryDaysDubai: 12, shippingZoneChina: 4, shippingZoneDubai: 4 },
  { code: 'LK', name: 'Sri Lanka', nameAr: 'سريلانكا', currency: 'LKR', vatRate: 15, dutyRate: 20, preferredWarehouse: 'china', deliveryDaysChina: 5, deliveryDaysDubai: 12, shippingZoneChina: 2, shippingZoneDubai: 3 },

  // ── Europe ────────────────────────────────────────────────────────────────
  { code: 'DE', name: 'Germany', nameAr: 'ألمانيا', currency: 'EUR', vatRate: 19, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 5, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'FR', name: 'France', nameAr: 'فرنسا', currency: 'EUR', vatRate: 20, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 5, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'GB', name: 'United Kingdom', nameAr: 'المملكة المتحدة', currency: 'GBP', vatRate: 20, dutyRate: 6.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 5, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'IT', name: 'Italy', nameAr: 'إيطاليا', currency: 'EUR', vatRate: 22, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 5, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'ES', name: 'Spain', nameAr: 'إسبانيا', currency: 'EUR', vatRate: 21, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 5, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'NL', name: 'Netherlands', nameAr: 'هولندا', currency: 'EUR', vatRate: 21, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 5, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'BE', name: 'Belgium', nameAr: 'بلجيكا', currency: 'EUR', vatRate: 21, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 5, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'SE', name: 'Sweden', nameAr: 'السويد', currency: 'SEK', vatRate: 25, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 15, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'NO', name: 'Norway', nameAr: 'النرويج', currency: 'NOK', vatRate: 25, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 15, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'DK', name: 'Denmark', nameAr: 'الدنمارك', currency: 'DKK', vatRate: 25, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 15, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'FI', name: 'Finland', nameAr: 'فنلندا', currency: 'EUR', vatRate: 24, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 16, deliveryDaysDubai: 7, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'AT', name: 'Austria', nameAr: 'النمسا', currency: 'EUR', vatRate: 20, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 5, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'CH', name: 'Switzerland', nameAr: 'سويسرا', currency: 'CHF', vatRate: 7.7, dutyRate: 8.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 5, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'PT', name: 'Portugal', nameAr: 'البرتغال', currency: 'EUR', vatRate: 23, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 5, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'GR', name: 'Greece', nameAr: 'اليونان', currency: 'EUR', vatRate: 24, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 5, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'PL', name: 'Poland', nameAr: 'بولندا', currency: 'PLN', vatRate: 23, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'CZ', name: 'Czech Republic', nameAr: 'جمهورية التشيك', currency: 'CZK', vatRate: 21, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'HU', name: 'Hungary', nameAr: 'هنغاريا', currency: 'HUF', vatRate: 27, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'SK', name: 'Slovakia', nameAr: 'سلوفاكيا', currency: 'EUR', vatRate: 20, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'RO', name: 'Romania', nameAr: 'رومانيا', currency: 'RON', vatRate: 19, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'BG', name: 'Bulgaria', nameAr: 'بلغاريا', currency: 'BGN', vatRate: 20, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'HR', name: 'Croatia', nameAr: 'كرواتيا', currency: 'EUR', vatRate: 25, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 15, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'SI', name: 'Slovenia', nameAr: 'سلوفينيا', currency: 'EUR', vatRate: 22, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'LT', name: 'Lithuania', nameAr: 'ليتوانيا', currency: 'EUR', vatRate: 21, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 15, deliveryDaysDubai: 7, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'LV', name: 'Latvia', nameAr: 'لاتفيا', currency: 'EUR', vatRate: 21, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 15, deliveryDaysDubai: 7, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'EE', name: 'Estonia', nameAr: 'إستونيا', currency: 'EUR', vatRate: 20, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 15, deliveryDaysDubai: 7, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'IE', name: 'Ireland', nameAr: 'أيرلندا', currency: 'EUR', vatRate: 23, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 15, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'RU', name: 'Russia', nameAr: 'روسيا', currency: 'RUB', vatRate: 20, dutyRate: 10, preferredWarehouse: 'both', deliveryDaysChina: 15, deliveryDaysDubai: 8, shippingZoneChina: 3, shippingZoneDubai: 3 },
  { code: 'UA', name: 'Ukraine', nameAr: 'أوكرانيا', currency: 'UAH', vatRate: 20, dutyRate: 10, preferredWarehouse: 'both', deliveryDaysChina: 15, deliveryDaysDubai: 7, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'TR', name: 'Turkey', nameAr: 'تركيا', currency: 'TRY', vatRate: 18, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 5, shippingZoneChina: 3, shippingZoneDubai: 2 },
  { code: 'RS', name: 'Serbia', nameAr: 'صربيا', currency: 'RSD', vatRate: 20, dutyRate: 10, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'BA', name: 'Bosnia and Herzegovina', nameAr: 'البوسنة والهرسك', currency: 'BAM', vatRate: 17, dutyRate: 10, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'AL', name: 'Albania', nameAr: 'ألبانيا', currency: 'ALL', vatRate: 20, dutyRate: 10, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'MK', name: 'North Macedonia', nameAr: 'مقدونيا الشمالية', currency: 'MKD', vatRate: 18, dutyRate: 10, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'ME', name: 'Montenegro', nameAr: 'الجبل الأسود', currency: 'EUR', vatRate: 21, dutyRate: 10, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'MD', name: 'Moldova', nameAr: 'مولدوفا', currency: 'MDL', vatRate: 20, dutyRate: 10, preferredWarehouse: 'both', deliveryDaysChina: 15, deliveryDaysDubai: 7, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'GE', name: 'Georgia', nameAr: 'جورجيا', currency: 'GEL', vatRate: 18, dutyRate: 10, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 5, shippingZoneChina: 3, shippingZoneDubai: 2 },
  { code: 'AM', name: 'Armenia', nameAr: 'أرمينيا', currency: 'AMD', vatRate: 20, dutyRate: 10, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 5, shippingZoneChina: 3, shippingZoneDubai: 2 },
  { code: 'AZ', name: 'Azerbaijan', nameAr: 'أذربيجان', currency: 'AZN', vatRate: 18, dutyRate: 15, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 5, shippingZoneChina: 3, shippingZoneDubai: 2 },
  { code: 'BY', name: 'Belarus', nameAr: 'بيلاروسيا', currency: 'BYR', vatRate: 20, dutyRate: 10, preferredWarehouse: 'both', deliveryDaysChina: 15, deliveryDaysDubai: 7, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'MT', name: 'Malta', nameAr: 'مالطا', currency: 'EUR', vatRate: 18, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'CY', name: 'Cyprus', nameAr: 'قبرص', currency: 'EUR', vatRate: 19, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 4, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'IS', name: 'Iceland', nameAr: 'آيسلندا', currency: 'ISK', vatRate: 24, dutyRate: 0, preferredWarehouse: 'both', deliveryDaysChina: 16, deliveryDaysDubai: 7, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'LU', name: 'Luxembourg', nameAr: 'لوكسمبورغ', currency: 'EUR', vatRate: 17, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 5, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'LI', name: 'Liechtenstein', nameAr: 'ليختنشتاين', currency: 'CHF', vatRate: 7.7, dutyRate: 0, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 5, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'MC', name: 'Monaco', nameAr: 'موناكو', currency: 'EUR', vatRate: 20, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 5, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'SM', name: 'San Marino', nameAr: 'سان مارينو', currency: 'EUR', vatRate: 0, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 5, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'AD', name: 'Andorra', nameAr: 'أندورا', currency: 'EUR', vatRate: 4.5, dutyRate: 5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 5, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'VA', name: 'Vatican City', nameAr: 'مدينة الفاتيكان', currency: 'EUR', vatRate: 0, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 5, shippingZoneChina: 4, shippingZoneDubai: 2 },
  { code: 'XK', name: 'Kosovo', nameAr: 'كوسوفو', currency: 'EUR', vatRate: 18, dutyRate: 10, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 6, shippingZoneChina: 4, shippingZoneDubai: 2 },

  // ── Central Asia ──────────────────────────────────────────────────────────
  { code: 'KZ', name: 'Kazakhstan', nameAr: 'كازاخستان', currency: 'KZT', vatRate: 12, dutyRate: 15, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 6, shippingZoneChina: 3, shippingZoneDubai: 3 },
  { code: 'UZ', name: 'Uzbekistan', nameAr: 'أوزبكستان', currency: 'UZS', vatRate: 15, dutyRate: 15, preferredWarehouse: 'dubai', deliveryDaysChina: 12, deliveryDaysDubai: 5, shippingZoneChina: 3, shippingZoneDubai: 2 },
  { code: 'TM', name: 'Turkmenistan', nameAr: 'تركمانستان', currency: 'TMT', vatRate: 15, dutyRate: 20, preferredWarehouse: 'dubai', deliveryDaysChina: 12, deliveryDaysDubai: 5, shippingZoneChina: 3, shippingZoneDubai: 2 },
  { code: 'TJ', name: 'Tajikistan', nameAr: 'طاجيكستان', currency: 'TJS', vatRate: 18, dutyRate: 15, preferredWarehouse: 'china', deliveryDaysChina: 12, deliveryDaysDubai: 6, shippingZoneChina: 3, shippingZoneDubai: 3 },
  { code: 'KG', name: 'Kyrgyzstan', nameAr: 'قيرغيزستان', currency: 'KGS', vatRate: 12, dutyRate: 15, preferredWarehouse: 'china', deliveryDaysChina: 12, deliveryDaysDubai: 6, shippingZoneChina: 3, shippingZoneDubai: 3 },

  // ── Asia ──────────────────────────────────────────────────────────────────
  { code: 'CN', name: 'China', nameAr: 'الصين', currency: 'CNY', vatRate: 13, dutyRate: 15, preferredWarehouse: 'china', deliveryDaysChina: 2, deliveryDaysDubai: 20, shippingZoneChina: 1, shippingZoneDubai: 6 },
  { code: 'JP', name: 'Japan', nameAr: 'اليابان', currency: 'JPY', vatRate: 10, dutyRate: 8, preferredWarehouse: 'china', deliveryDaysChina: 4, deliveryDaysDubai: 14, shippingZoneChina: 2, shippingZoneDubai: 4 },
  { code: 'KR', name: 'South Korea', nameAr: 'كوريا الجنوبية', currency: 'KRW', vatRate: 10, dutyRate: 8, preferredWarehouse: 'china', deliveryDaysChina: 4, deliveryDaysDubai: 14, shippingZoneChina: 2, shippingZoneDubai: 4 },
  { code: 'IN', name: 'India', nameAr: 'الهند', currency: 'INR', vatRate: 18, dutyRate: 20, preferredWarehouse: 'china', deliveryDaysChina: 8, deliveryDaysDubai: 18, shippingZoneChina: 3, shippingZoneDubai: 5 },
  { code: 'TH', name: 'Thailand', nameAr: 'تايلاند', currency: 'THB', vatRate: 7, dutyRate: 15, preferredWarehouse: 'china', deliveryDaysChina: 3, deliveryDaysDubai: 12, shippingZoneChina: 1, shippingZoneDubai: 3 },
  { code: 'VN', name: 'Vietnam', nameAr: 'فيتنام', currency: 'VND', vatRate: 10, dutyRate: 15, preferredWarehouse: 'china', deliveryDaysChina: 3, deliveryDaysDubai: 12, shippingZoneChina: 1, shippingZoneDubai: 3 },
  { code: 'ID', name: 'Indonesia', nameAr: 'إندونيسيا', currency: 'IDR', vatRate: 11, dutyRate: 15, preferredWarehouse: 'china', deliveryDaysChina: 4, deliveryDaysDubai: 14, shippingZoneChina: 2, shippingZoneDubai: 4 },
  { code: 'MY', name: 'Malaysia', nameAr: 'ماليزيا', currency: 'MYR', vatRate: 6, dutyRate: 10, preferredWarehouse: 'china', deliveryDaysChina: 3, deliveryDaysDubai: 12, shippingZoneChina: 1, shippingZoneDubai: 3 },
  { code: 'SG', name: 'Singapore', nameAr: 'سنظافورة', currency: 'SGD', vatRate: 9, dutyRate: 0, preferredWarehouse: 'china', deliveryDaysChina: 3, deliveryDaysDubai: 10, shippingZoneChina: 1, shippingZoneDubai: 3 },
  { code: 'PH', name: 'Philippines', nameAr: 'الفلبين', currency: 'PHP', vatRate: 12, dutyRate: 20, preferredWarehouse: 'china', deliveryDaysChina: 4, deliveryDaysDubai: 14, shippingZoneChina: 2, shippingZoneDubai: 4 },
  { code: 'PK', name: 'Pakistan', nameAr: 'باكستان', currency: 'PKR', vatRate: 17, dutyRate: 20, preferredWarehouse: 'china', deliveryDaysChina: 6, deliveryDaysDubai: 10, shippingZoneChina: 2, shippingZoneDubai: 2 },
  { code: 'BD', name: 'Bangladesh', nameAr: 'بنغلاديش', currency: 'BDT', vatRate: 15, dutyRate: 25, preferredWarehouse: 'china', deliveryDaysChina: 7, deliveryDaysDubai: 14, shippingZoneChina: 2, shippingZoneDubai: 3 },
  { code: 'NP', name: 'Nepal', nameAr: 'نيبال', currency: 'NPR', vatRate: 13, dutyRate: 15, preferredWarehouse: 'china', deliveryDaysChina: 7, deliveryDaysDubai: 14, shippingZoneChina: 2, shippingZoneDubai: 4 },
  { code: 'KH', name: 'Cambodia', nameAr: 'كمبوديا', currency: 'KHR', vatRate: 10, dutyRate: 15, preferredWarehouse: 'china', deliveryDaysChina: 4, deliveryDaysDubai: 12, shippingZoneChina: 1, shippingZoneDubai: 3 },
  { code: 'MM', name: 'Myanmar', nameAr: 'ميانمار', currency: 'MMK', vatRate: 5, dutyRate: 10, preferredWarehouse: 'china', deliveryDaysChina: 4, deliveryDaysDubai: 14, shippingZoneChina: 2, shippingZoneDubai: 3 },
  { code: 'LA', name: 'Laos', nameAr: 'لاوس', currency: 'LAK', vatRate: 10, dutyRate: 10, preferredWarehouse: 'china', deliveryDaysChina: 4, deliveryDaysDubai: 14, shippingZoneChina: 2, shippingZoneDubai: 3 },
  { code: 'MN', name: 'Mongolia', nameAr: 'منغوليا', currency: 'MNT', vatRate: 10, dutyRate: 10, preferredWarehouse: 'china', deliveryDaysChina: 5, deliveryDaysDubai: 14, shippingZoneChina: 2, shippingZoneDubai: 4 },
  { code: 'TW', name: 'Taiwan', nameAr: 'تايوان', currency: 'TWD', vatRate: 5, dutyRate: 5, preferredWarehouse: 'china', deliveryDaysChina: 3, deliveryDaysDubai: 12, shippingZoneChina: 1, shippingZoneDubai: 3 },
  { code: 'HK', name: 'Hong Kong', nameAr: 'هونغ كونغ', currency: 'HKD', vatRate: 0, dutyRate: 0, preferredWarehouse: 'china', deliveryDaysChina: 2, deliveryDaysDubai: 10, shippingZoneChina: 1, shippingZoneDubai: 2 },
  { code: 'MO', name: 'Macao', nameAr: 'ماكاو', currency: 'MOP', vatRate: 0, dutyRate: 0, preferredWarehouse: 'china', deliveryDaysChina: 2, deliveryDaysDubai: 10, shippingZoneChina: 1, shippingZoneDubai: 2 },
  { code: 'BT', name: 'Bhutan', nameAr: 'بوتان', currency: 'BTN', vatRate: 10, dutyRate: 20, preferredWarehouse: 'china', deliveryDaysChina: 7, deliveryDaysDubai: 16, shippingZoneChina: 2, shippingZoneDubai: 4 },
  { code: 'MV', name: 'Maldives', nameAr: 'جزر المالديف', currency: 'MVR', vatRate: 6, dutyRate: 20, preferredWarehouse: 'china', deliveryDaysChina: 6, deliveryDaysDubai: 10, shippingZoneChina: 2, shippingZoneDubai: 2 },
  { code: 'TL', name: 'Timor-Leste', nameAr: 'تيمور الشرقية', currency: 'USD', vatRate: 0, dutyRate: 5, preferredWarehouse: 'china', deliveryDaysChina: 6, deliveryDaysDubai: 16, shippingZoneChina: 2, shippingZoneDubai: 5 },
  { code: 'BN', name: 'Brunei', nameAr: 'بروناي', currency: 'BND', vatRate: 0, dutyRate: 5, preferredWarehouse: 'china', deliveryDaysChina: 4, deliveryDaysDubai: 12, shippingZoneChina: 2, shippingZoneDubai: 3 },
  { code: 'KP', name: 'North Korea', nameAr: 'كوريا الشمالية', currency: 'KPW', vatRate: 0, dutyRate: 15, preferredWarehouse: 'china', deliveryDaysChina: 5, deliveryDaysDubai: 18, shippingZoneChina: 2, shippingZoneDubai: 5 },

  // ── Americas ──────────────────────────────────────────────────────────────
  { code: 'US', name: 'United States', nameAr: 'الولايات المتحدة', currency: 'USD', vatRate: 0, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 10, deliveryDaysDubai: 11, shippingZoneChina: 5, shippingZoneDubai: 3 },
  { code: 'CA', name: 'Canada', nameAr: 'كندا', currency: 'CAD', vatRate: 5, dutyRate: 5, preferredWarehouse: 'both', deliveryDaysChina: 11, deliveryDaysDubai: 12, shippingZoneChina: 5, shippingZoneDubai: 3 },
  { code: 'BR', name: 'Brazil', nameAr: 'البرازيل', currency: 'BRL', vatRate: 17, dutyRate: 35, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 15, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'MX', name: 'Mexico', nameAr: 'المكسيك', currency: 'MXN', vatRate: 16, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 10, deliveryDaysDubai: 12, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'AR', name: 'Argentina', nameAr: 'الأرجنتين', currency: 'ARS', vatRate: 21, dutyRate: 35, preferredWarehouse: 'both', deliveryDaysChina: 13, deliveryDaysDubai: 14, shippingZoneChina: 5, shippingZoneDubai: 5 },
  { code: 'CO', name: 'Colombia', nameAr: 'كولومبيا', currency: 'COP', vatRate: 19, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 13, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'CL', name: 'Chile', nameAr: 'تشيلي', currency: 'CLP', vatRate: 19, dutyRate: 6, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 13, shippingZoneChina: 5, shippingZoneDubai: 5 },
  { code: 'PE', name: 'Peru', nameAr: 'بيرو', currency: 'PEN', vatRate: 18, dutyRate: 11, preferredWarehouse: 'both', deliveryDaysChina: 13, deliveryDaysDubai: 14, shippingZoneChina: 5, shippingZoneDubai: 5 },
  { code: 'VE', name: 'Venezuela', nameAr: 'فنزويلا', currency: 'VES', vatRate: 16, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 13, deliveryDaysDubai: 14, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'EC', name: 'Ecuador', nameAr: 'الإكوادور', currency: 'USD', vatRate: 12, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 14, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'BO', name: 'Bolivia', nameAr: 'بوليفيا', currency: 'BOB', vatRate: 13, dutyRate: 10, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 15, shippingZoneChina: 5, shippingZoneDubai: 5 },
  { code: 'PY', name: 'Paraguay', nameAr: 'باراغواي', currency: 'PYG', vatRate: 10, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 15, shippingZoneChina: 5, shippingZoneDubai: 5 },
  { code: 'UY', name: 'Uruguay', nameAr: 'أوروغواي', currency: 'UYU', vatRate: 22, dutyRate: 25, preferredWarehouse: 'both', deliveryDaysChina: 13, deliveryDaysDubai: 14, shippingZoneChina: 5, shippingZoneDubai: 5 },
  { code: 'GY', name: 'Guyana', nameAr: 'غيانا', currency: 'GYD', vatRate: 14, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 13, deliveryDaysDubai: 14, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'SR', name: 'Suriname', nameAr: 'سورينام', currency: 'SRD', vatRate: 10, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 13, deliveryDaysDubai: 14, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'CR', name: 'Costa Rica', nameAr: 'كوستاريكا', currency: 'CRC', vatRate: 13, dutyRate: 15, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 13, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'PA', name: 'Panama', nameAr: 'بنما', currency: 'USD', vatRate: 7, dutyRate: 15, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 13, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'GT', name: 'Guatemala', nameAr: 'غواتيمالا', currency: 'GTQ', vatRate: 12, dutyRate: 15, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 13, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'SV', name: 'El Salvador', nameAr: 'السلفادور', currency: 'USD', vatRate: 13, dutyRate: 15, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 13, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'HN', name: 'Honduras', nameAr: 'هندوراس', currency: 'HNL', vatRate: 15, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 13, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'NI', name: 'Nicaragua', nameAr: 'نيكاراغوا', currency: 'NIO', vatRate: 15, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 13, deliveryDaysDubai: 14, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'BZ', name: 'Belize', nameAr: 'بليز', currency: 'BZD', vatRate: 12.5, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 13, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'DO', name: 'Dominican Republic', nameAr: 'جمهورية الدومينيكان', currency: 'DOP', vatRate: 18, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 13, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'HT', name: 'Haiti', nameAr: 'هايتي', currency: 'HTG', vatRate: 10, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 13, deliveryDaysDubai: 14, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'JM', name: 'Jamaica', nameAr: 'جامايكا', currency: 'JMD', vatRate: 15, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 13, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'TT', name: 'Trinidad and Tobago', nameAr: 'ترينيداد وتوبازو', currency: 'TTD', vatRate: 12.5, dutyRate: 15, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 13, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'BB', name: 'Barbados', nameAr: 'باربادوس', currency: 'BBD', vatRate: 17.5, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 13, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'CU', name: 'Cuba', nameAr: 'كوبا', currency: 'CUP', vatRate: 0, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 13, deliveryDaysDubai: 14, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'LC', name: 'Saint Lucia', nameAr: 'سانت لوسيا', currency: 'XCD', vatRate: 12.5, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 13, deliveryDaysDubai: 14, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', nameAr: 'سانت فينسنت وجزر غرينادين', currency: 'XCD', vatRate: 16, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 13, deliveryDaysDubai: 14, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'GD', name: 'Grenada', nameAr: 'غرينادا', currency: 'XCD', vatRate: 15, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 13, deliveryDaysDubai: 14, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'AG', name: 'Antigua and Barbuda', nameAr: 'أنتيغوا وباربودا', currency: 'XCD', vatRate: 15, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 14, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'DM', name: 'Dominica', nameAr: 'دومينيكا', currency: 'XCD', vatRate: 15, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 13, deliveryDaysDubai: 14, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'KN', name: 'Saint Kitts and Nevis', nameAr: 'سانت كيتس ونيفيس', currency: 'XCD', vatRate: 17, dutyRate: 20, preferredWarehouse: 'both', deliveryDaysChina: 13, deliveryDaysDubai: 14, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'BS', name: 'Bahamas', nameAr: 'جزر البهاما', currency: 'BSD', vatRate: 10, dutyRate: 30, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 13, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'TC', name: 'Turks and Caicos', nameAr: 'جزر تركس وكايكوس', currency: 'USD', vatRate: 0, dutyRate: 10, preferredWarehouse: 'both', deliveryDaysChina: 12, deliveryDaysDubai: 13, shippingZoneChina: 5, shippingZoneDubai: 4 },

  // ── Oceania ───────────────────────────────────────────────────────────────
  { code: 'AU', name: 'Australia', nameAr: 'أستراليا', currency: 'AUD', vatRate: 10, dutyRate: 5, preferredWarehouse: 'china', deliveryDaysChina: 8, deliveryDaysDubai: 18, shippingZoneChina: 3, shippingZoneDubai: 5 },
  { code: 'NZ', name: 'New Zealand', nameAr: 'نيوزيلندا', currency: 'NZD', vatRate: 15, dutyRate: 5, preferredWarehouse: 'china', deliveryDaysChina: 7, deliveryDaysDubai: 18, shippingZoneChina: 3, shippingZoneDubai: 5 },
  { code: 'FJ', name: 'Fiji', nameAr: 'فيجي', currency: 'FJD', vatRate: 9, dutyRate: 32, preferredWarehouse: 'china', deliveryDaysChina: 9, deliveryDaysDubai: 20, shippingZoneChina: 4, shippingZoneDubai: 5 },
  { code: 'PG', name: 'Papua New Guinea', nameAr: 'بابوا غينيا الجديدة', currency: 'PGK', vatRate: 10, dutyRate: 15, preferredWarehouse: 'china', deliveryDaysChina: 9, deliveryDaysDubai: 20, shippingZoneChina: 4, shippingZoneDubai: 5 },
  { code: 'WS', name: 'Samoa', nameAr: 'ساموا', currency: 'WST', vatRate: 15, dutyRate: 20, preferredWarehouse: 'china', deliveryDaysChina: 10, deliveryDaysDubai: 22, shippingZoneChina: 4, shippingZoneDubai: 5 },
  { code: 'TO', name: 'Tonga', nameAr: 'تونغا', currency: 'TOP', vatRate: 15, dutyRate: 20, preferredWarehouse: 'china', deliveryDaysChina: 10, deliveryDaysDubai: 22, shippingZoneChina: 4, shippingZoneDubai: 5 },
  { code: 'VU', name: 'Vanuatu', nameAr: 'فانواتو', currency: 'VUV', vatRate: 0, dutyRate: 5, preferredWarehouse: 'china', deliveryDaysChina: 10, deliveryDaysDubai: 22, shippingZoneChina: 4, shippingZoneDubai: 5 },
  { code: 'SB', name: 'Solomon Islands', nameAr: 'جزر سليمان', currency: 'SBD', vatRate: 15, dutyRate: 10, preferredWarehouse: 'china', deliveryDaysChina: 10, deliveryDaysDubai: 22, shippingZoneChina: 4, shippingZoneDubai: 5 },
  { code: 'KI', name: 'Kiribati', nameAr: 'كيريباتي', currency: 'AUD', vatRate: 0, dutyRate: 5, preferredWarehouse: 'china', deliveryDaysChina: 12, deliveryDaysDubai: 24, shippingZoneChina: 5, shippingZoneDubai: 6 },
  { code: 'TV', name: 'Tuvalu', nameAr: 'توفالو', currency: 'AUD', vatRate: 0, dutyRate: 5, preferredWarehouse: 'china', deliveryDaysChina: 12, deliveryDaysDubai: 24, shippingZoneChina: 5, shippingZoneDubai: 6 },
  { code: 'NR', name: 'Nauru', nameAr: 'ناورو', currency: 'AUD', vatRate: 0, dutyRate: 5, preferredWarehouse: 'china', deliveryDaysChina: 11, deliveryDaysDubai: 22, shippingZoneChina: 5, shippingZoneDubai: 6 },
  { code: 'PW', name: 'Palau', nameAr: 'بالاو', currency: 'USD', vatRate: 0, dutyRate: 5, preferredWarehouse: 'china', deliveryDaysChina: 6, deliveryDaysDubai: 18, shippingZoneChina: 3, shippingZoneDubai: 5 },
  { code: 'FM', name: 'Micronesia', nameAr: 'ميكرونيزيا', currency: 'USD', vatRate: 0, dutyRate: 5, preferredWarehouse: 'china', deliveryDaysChina: 7, deliveryDaysDubai: 20, shippingZoneChina: 4, shippingZoneDubai: 5 },
  { code: 'MH', name: 'Marshall Islands', nameAr: 'جزر مارشال', currency: 'USD', vatRate: 0, dutyRate: 5, preferredWarehouse: 'china', deliveryDaysChina: 8, deliveryDaysDubai: 20, shippingZoneChina: 4, shippingZoneDubai: 5 },

  // ── Additional / Territories ──────────────────────────────────────────────
  { code: 'GF', name: 'French Guiana', nameAr: 'غيانا الفرنسية', currency: 'EUR', vatRate: 8.5, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 15, shippingZoneChina: 5, shippingZoneDubai: 5 },
  { code: 'GP', name: 'Guadeloupe', nameAr: 'غواديلوب', currency: 'EUR', vatRate: 8.5, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 14, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'MQ', name: 'Martinique', nameAr: 'مارتينيك', currency: 'EUR', vatRate: 8.5, dutyRate: 3.5, preferredWarehouse: 'both', deliveryDaysChina: 14, deliveryDaysDubai: 14, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'RE', name: 'Réunion', nameAr: 'ريونيون', currency: 'EUR', vatRate: 8.5, dutyRate: 3.5, preferredWarehouse: 'dubai', deliveryDaysChina: 22, deliveryDaysDubai: 10, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'NC', name: 'New Caledonia', nameAr: 'كاليدونيا الجديدة', currency: 'XPF', vatRate: 0, dutyRate: 5, preferredWarehouse: 'china', deliveryDaysChina: 10, deliveryDaysDubai: 22, shippingZoneChina: 4, shippingZoneDubai: 5 },
  { code: 'PF', name: 'French Polynesia', nameAr: 'بولينيزيا الفرنسية', currency: 'XPF', vatRate: 0, dutyRate: 5, preferredWarehouse: 'china', deliveryDaysChina: 10, deliveryDaysDubai: 22, shippingZoneChina: 4, shippingZoneDubai: 5 },
  { code: 'CK', name: 'Cook Islands', nameAr: 'جزر كوك', currency: 'NZD', vatRate: 15, dutyRate: 10, preferredWarehouse: 'china', deliveryDaysChina: 11, deliveryDaysDubai: 22, shippingZoneChina: 5, shippingZoneDubai: 6 },
  { code: 'NU', name: 'Niue', nameAr: 'نيوي', currency: 'NZD', vatRate: 0, dutyRate: 5, preferredWarehouse: 'china', deliveryDaysChina: 11, deliveryDaysDubai: 22, shippingZoneChina: 5, shippingZoneDubai: 6 },
  { code: 'PR', name: 'Puerto Rico', nameAr: 'بورتوريكو', currency: 'USD', vatRate: 10.5, dutyRate: 0, preferredWarehouse: 'both', deliveryDaysChina: 11, deliveryDaysDubai: 12, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'VI', name: 'US Virgin Islands', nameAr: 'جزر فيرجن الأمريكية', currency: 'USD', vatRate: 0, dutyRate: 6, preferredWarehouse: 'both', deliveryDaysChina: 11, deliveryDaysDubai: 12, shippingZoneChina: 5, shippingZoneDubai: 4 },
  { code: 'GU', name: 'Guam', nameAr: 'غوام', currency: 'USD', vatRate: 4, dutyRate: 5, preferredWarehouse: 'china', deliveryDaysChina: 5, deliveryDaysDubai: 16, shippingZoneChina: 3, shippingZoneDubai: 4 },
  { code: 'MP', name: 'Northern Mariana Islands', nameAr: 'جزر ماريانا الشمالية', currency: 'USD', vatRate: 0, dutyRate: 5, preferredWarehouse: 'china', deliveryDaysChina: 5, deliveryDaysDubai: 16, shippingZoneChina: 3, shippingZoneDubai: 4 },
];

// ─── Country lookup map ────────────────────────────────────────────────────────

const COUNTRY_MAP = new Map<string, CountryConfig>(
  COUNTRIES.map((c) => [c.code.toUpperCase(), c])
);

export function getCountry(code: string): CountryConfig | undefined {
  return COUNTRY_MAP.get(code.toUpperCase());
}

// ─── Shipping Cost Calculation ────────────────────────────────────────────────

function calcShippingCost(
  warehouseId: 'china' | 'dubai',
  weightKg: number,
  zone: number
): number {
  const wh = WAREHOUSES[warehouseId];
  const multiplier = ZONE_MULTIPLIERS[zone] ?? 1.0;
  return weightKg * wh.costPerKg * multiplier;
}

function calcTotals(
  warehouseId: 'china' | 'dubai',
  country: CountryConfig,
  weightKg: number,
  productValueAED: number
): { shipping: number; duty: number; vat: number; total: number } {
  const zone =
    warehouseId === 'china' ? country.shippingZoneChina : country.shippingZoneDubai;
  const shipping = calcShippingCost(warehouseId, weightKg, zone);
  const duty = productValueAED * (country.dutyRate / 100);
  const vat = (productValueAED + duty + shipping) * (country.vatRate / 100);
  const total = shipping + duty + vat;
  return { shipping, duty, vat, total };
}

// ─── selectWarehouse ──────────────────────────────────────────────────────────

export function selectWarehouse(params: {
  destinationCountryCode: string;
  weightKg: number;
  productValueAED?: number;
  preference: 'fastest' | 'cheapest' | 'balanced';
  productOrigin?: 'china' | 'dubai' | 'any';
}): WarehouseRecommendation {
  const {
    destinationCountryCode,
    weightKg,
    productValueAED = 200,
    preference,
    productOrigin = 'any',
  } = params;

  const country = getCountry(destinationCountryCode);
  if (!country) {
    throw new Error(`Unknown country code: ${destinationCountryCode}`);
  }

  // Calculate costs for both warehouses
  const chinaCalc = calcTotals('china', country, weightKg, productValueAED);
  const dubaiCalc = calcTotals('dubai', country, weightKg, productValueAED);

  const chinaInfo = {
    warehouse: WAREHOUSES.china,
    totalCostAED: chinaCalc.total,
    shippingCostAED: chinaCalc.shipping,
    customsDutyAED: chinaCalc.duty,
    vatAED: chinaCalc.vat,
    estimatedDays: country.deliveryDaysChina,
    savingsVsAlternativeAED: 0,
  };

  const dubaiInfo = {
    warehouse: WAREHOUSES.dubai,
    totalCostAED: dubaiCalc.total,
    shippingCostAED: dubaiCalc.shipping,
    customsDutyAED: dubaiCalc.duty,
    vatAED: dubaiCalc.vat,
    estimatedDays: country.deliveryDaysDubai,
    savingsVsAlternativeAED: 0,
  };

  // Compute balanced scores
  const chinaScore =
    (1 / (chinaCalc.total + 1)) * 0.5 + (1 / (country.deliveryDaysChina + 1)) * 0.5;
  const dubaiScore =
    (1 / (dubaiCalc.total + 1)) * 0.5 + (1 / (country.deliveryDaysDubai + 1)) * 0.5;

  let winner: 'china' | 'dubai';

  // Apply product origin constraint
  if (productOrigin === 'china') {
    winner = 'china';
  } else if (productOrigin === 'dubai') {
    winner = 'dubai';
  } else {
    switch (preference) {
      case 'fastest':
        winner = country.deliveryDaysChina <= country.deliveryDaysDubai ? 'china' : 'dubai';
        break;
      case 'cheapest':
        winner = chinaCalc.total <= dubaiCalc.total ? 'china' : 'dubai';
        break;
      case 'balanced':
      default:
        winner = chinaScore >= dubaiScore ? 'china' : 'dubai';
        break;
    }
  }

  const loser: 'china' | 'dubai' = winner === 'china' ? 'dubai' : 'china';
  const winnerInfo = winner === 'china' ? chinaInfo : dubaiInfo;
  const loserInfo = loser === 'china' ? chinaInfo : dubaiInfo;

  // Calculate savings
  winnerInfo.savingsVsAlternativeAED = Math.max(0, loserInfo.totalCostAED - winnerInfo.totalCostAED);
  loserInfo.savingsVsAlternativeAED = 0;

  // Build Arabic reasoning
  const reasoning = buildReasoningAr(winner, loser, preference, winnerInfo, loserInfo, country);

  return {
    recommendedWarehouse: winner,
    alternativeWarehouse: loser,
    recommended: winnerInfo,
    alternative: loserInfo,
    reasoning,
  };
}

function buildReasoningAr(
  winner: 'china' | 'dubai',
  loser: 'china' | 'dubai',
  preference: string,
  winnerInfo: WarehouseShippingDetail,
  loserInfo: WarehouseShippingDetail,
  country: CountryConfig
): string {
  const winnerWh = WAREHOUSES[winner];
  const saving = winnerInfo.savingsVsAlternativeAED;

  const prefMap: Record<string, string> = {
    fastest: 'الأسرع',
    cheapest: 'الأرخص',
    balanced: 'المتوازن',
  };
  const prefAr = prefMap[preference] || preference;

  let msg = `بناءً على تفضيلك للشحن ${prefAr}، نوصي بالشحن من مستودع ${winnerWh.nameAr}. `;
  msg += `وقت التسليم المقدر إلى ${country.nameAr}: ${winnerInfo.estimatedDays} أيام. `;
  msg += `التكلفة الإجمالية: ${winnerInfo.totalCostAED.toFixed(2)} درهم `;
  msg += `(شحن: ${winnerInfo.shippingCostAED.toFixed(2)} + جمارك: ${winnerInfo.customsDutyAED.toFixed(2)} + ضريبة: ${winnerInfo.vatAED.toFixed(2)}). `;

  if (saving > 0.5) {
    msg += `توفير ${saving.toFixed(2)} درهم مقارنةً بالخيار البديل.`;
  } else if (loserInfo.estimatedDays < winnerInfo.estimatedDays) {
    msg += `الخيار البديل (${WAREHOUSES[loser].nameAr}) أسرع بـ ${loserInfo.estimatedDays - winnerInfo.estimatedDays} أيام لكن تكلفته أعلى.`;
  } else {
    msg += `الخيار البديل (${WAREHOUSES[loser].nameAr}) ليس أفضل وفق معايير الشحن الحالية.`;
  }

  return msg;
}
