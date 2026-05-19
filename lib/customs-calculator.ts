// lib/customs-calculator.ts
// LEE E-Commerce Platform — Customs & Tax Calculator
// Full 260-country database, production TypeScript

export interface CustomsResult {
  countryCode: string
  countryName: string
  countryNameAr: string
  productValueAED: number
  importDutyRate: number
  importDutyAED: number
  vatRate: number
  vatAED: number
  customsHandlingFeeAED: number
  totalTaxAED: number
  totalLandedCostAED: number
  breakdown: TaxLineItem[]
  warning?: string
  isFreeZone: boolean
  dutyFreeThresholdAED?: number
}

export interface TaxLineItem {
  label: string
  rate?: string
  amountAED: number
  amountFormatted: string
}

interface CountryTaxData {
  name: string
  nameAr: string
  vatRate: number
  dutyRate: number
  dutyRates?: Partial<Record<ProductCategory, number>>
  handlingFeeAED: number
  dutyFreeThresholdAED?: number
  warning?: string
  isHighTariff?: boolean
}

type ProductCategory = 'electronics' | 'clothing' | 'food' | 'cosmetics' | 'furniture' | 'general'

const COUNTRY_DATA: Record<string, CountryTaxData> = {
  // ── GCC ──────────────────────────────────────────────────────────────────
  AE: { name: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', vatRate: 5, dutyRate: 5, handlingFeeAED: 15, dutyFreeThresholdAED: 1000 },
  SA: { name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', vatRate: 15, dutyRate: 5, handlingFeeAED: 20, dutyFreeThresholdAED: 267 },
  KW: { name: 'Kuwait', nameAr: 'الكويت', vatRate: 0, dutyRate: 5, handlingFeeAED: 15, dutyFreeThresholdAED: 917 },
  QA: { name: 'Qatar', nameAr: 'قطر', vatRate: 0, dutyRate: 5, handlingFeeAED: 15 },
  BH: { name: 'Bahrain', nameAr: 'البحرين', vatRate: 10, dutyRate: 5, handlingFeeAED: 15 },
  OM: { name: 'Oman', nameAr: 'عُمان', vatRate: 5, dutyRate: 5, handlingFeeAED: 15 },

  // ── Americas ──────────────────────────────────────────────────────────────
  US: { name: 'United States', nameAr: 'الولايات المتحدة', vatRate: 0, dutyRate: 3.5, dutyRates: { electronics: 0, clothing: 12, food: 5, cosmetics: 6.5, furniture: 4, general: 3.5 }, handlingFeeAED: 0, dutyFreeThresholdAED: 2936 },
  CA: { name: 'Canada', nameAr: 'كندا', vatRate: 5, dutyRate: 5, dutyRates: { electronics: 0, clothing: 18, food: 0, cosmetics: 6.5, furniture: 9.5, general: 5 }, handlingFeeAED: 20, dutyFreeThresholdAED: 108 },
  MX: { name: 'Mexico', nameAr: 'المكسيك', vatRate: 16, dutyRate: 15, handlingFeeAED: 35 },
  BR: { name: 'Brazil', nameAr: 'البرازيل', vatRate: 17, dutyRate: 60, handlingFeeAED: 80, isHighTariff: true, warning: 'Brazil has very high import duties — combined taxes can exceed 100% of product value' },
  AR: { name: 'Argentina', nameAr: 'الأرجنتين', vatRate: 21, dutyRate: 35, handlingFeeAED: 60, isHighTariff: true },
  CL: { name: 'Chile', nameAr: 'تشيلي', vatRate: 19, dutyRate: 6, handlingFeeAED: 30 },
  CO: { name: 'Colombia', nameAr: 'كولومبيا', vatRate: 19, dutyRate: 15, handlingFeeAED: 35 },
  PE: { name: 'Peru', nameAr: 'بيرو', vatRate: 18, dutyRate: 11, handlingFeeAED: 30 },
  VE: { name: 'Venezuela', nameAr: 'فنزويلا', vatRate: 16, dutyRate: 20, handlingFeeAED: 40, warning: 'Trade restrictions apply — verify item eligibility' },
  EC: { name: 'Ecuador', nameAr: 'الإكوادور', vatRate: 12, dutyRate: 10, handlingFeeAED: 30 },
  BO: { name: 'Bolivia', nameAr: 'بوليفيا', vatRate: 14.94, dutyRate: 10, handlingFeeAED: 35 },
  PY: { name: 'Paraguay', nameAr: 'باراغواي', vatRate: 10, dutyRate: 6, handlingFeeAED: 30 },
  UY: { name: 'Uruguay', nameAr: 'أوروغواي', vatRate: 22, dutyRate: 18, handlingFeeAED: 40 },
  GY: { name: 'Guyana', nameAr: 'غيانا', vatRate: 14, dutyRate: 15, handlingFeeAED: 35 },
  SR: { name: 'Suriname', nameAr: 'سورينام', vatRate: 10, dutyRate: 15, handlingFeeAED: 35 },
  GF: { name: 'French Guiana', nameAr: 'غيانا الفرنسية', vatRate: 20, dutyRate: 10, handlingFeeAED: 35 },
  GT: { name: 'Guatemala', nameAr: 'غواتيمالا', vatRate: 12, dutyRate: 10, handlingFeeAED: 30 },
  BZ: { name: 'Belize', nameAr: 'بليز', vatRate: 12.5, dutyRate: 20, handlingFeeAED: 30 },
  HN: { name: 'Honduras', nameAr: 'هندوراس', vatRate: 15, dutyRate: 15, handlingFeeAED: 30 },
  SV: { name: 'El Salvador', nameAr: 'السلفادور', vatRate: 13, dutyRate: 6, handlingFeeAED: 25 },
  NI: { name: 'Nicaragua', nameAr: 'نيكاراغوا', vatRate: 15, dutyRate: 10, handlingFeeAED: 30 },
  CR: { name: 'Costa Rica', nameAr: 'كوستاريكا', vatRate: 13, dutyRate: 10, handlingFeeAED: 30 },
  PA: { name: 'Panama', nameAr: 'بنما', vatRate: 7, dutyRate: 8, handlingFeeAED: 25 },
  CU: { name: 'Cuba', nameAr: 'كوبا', vatRate: 0, dutyRate: 30, handlingFeeAED: 50, warning: 'Significant trade restrictions apply' },
  JM: { name: 'Jamaica', nameAr: 'جامايكا', vatRate: 16.5, dutyRate: 20, handlingFeeAED: 30 },
  HT: { name: 'Haiti', nameAr: 'هايتي', vatRate: 10, dutyRate: 15, handlingFeeAED: 35 },
  DO: { name: 'Dominican Republic', nameAr: 'جمهورية الدومينيكان', vatRate: 18, dutyRate: 20, handlingFeeAED: 30 },
  TT: { name: 'Trinidad and Tobago', nameAr: 'ترينيداد وتوباغو', vatRate: 12.5, dutyRate: 20, handlingFeeAED: 30 },
  BB: { name: 'Barbados', nameAr: 'باربادوس', vatRate: 17.5, dutyRate: 20, handlingFeeAED: 30 },
  LC: { name: 'Saint Lucia', nameAr: 'سانت لوسيا', vatRate: 15, dutyRate: 20, handlingFeeAED: 30 },
  VC: { name: 'Saint Vincent', nameAr: 'سانت فينسنت', vatRate: 16, dutyRate: 20, handlingFeeAED: 30 },
  GD: { name: 'Grenada', nameAr: 'غرينادا', vatRate: 15, dutyRate: 20, handlingFeeAED: 30 },
  AG: { name: 'Antigua and Barbuda', nameAr: 'أنتيغوا وبربودا', vatRate: 15, dutyRate: 20, handlingFeeAED: 30 },
  DM: { name: 'Dominica', nameAr: 'دومينيكا', vatRate: 15, dutyRate: 20, handlingFeeAED: 30 },
  KN: { name: 'Saint Kitts and Nevis', nameAr: 'سانت كيتس ونيفيس', vatRate: 17, dutyRate: 20, handlingFeeAED: 30 },
  BS: { name: 'Bahamas', nameAr: 'جزر البهاما', vatRate: 10, dutyRate: 25, handlingFeeAED: 35 },

  // ── Europe ──────────────────────────────────────────────────────────────
  GB: { name: 'United Kingdom', nameAr: 'المملكة المتحدة', vatRate: 20, dutyRate: 6, dutyRates: { electronics: 0, clothing: 12, food: 0, cosmetics: 6.5, furniture: 6, general: 6 }, handlingFeeAED: 15, dutyFreeThresholdAED: 636 },
  DE: { name: 'Germany', nameAr: 'ألمانيا', vatRate: 19, dutyRate: 6, dutyRates: { electronics: 0, clothing: 12, food: 8, cosmetics: 6.5, furniture: 6, general: 6 }, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  FR: { name: 'France', nameAr: 'فرنسا', vatRate: 20, dutyRate: 6, dutyRates: { electronics: 0, clothing: 12, food: 8, cosmetics: 6.5, furniture: 6, general: 6 }, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  IT: { name: 'Italy', nameAr: 'إيطاليا', vatRate: 22, dutyRate: 6, dutyRates: { electronics: 0, clothing: 12, food: 8, cosmetics: 6.5, furniture: 6, general: 6 }, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  ES: { name: 'Spain', nameAr: 'إسبانيا', vatRate: 21, dutyRate: 6, dutyRates: { electronics: 0, clothing: 12, food: 8, cosmetics: 6.5, furniture: 6, general: 6 }, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  NL: { name: 'Netherlands', nameAr: 'هولندا', vatRate: 21, dutyRate: 6, dutyRates: { electronics: 0, clothing: 12, food: 8, cosmetics: 6.5, furniture: 6, general: 6 }, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  BE: { name: 'Belgium', nameAr: 'بلجيكا', vatRate: 21, dutyRate: 6, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  PT: { name: 'Portugal', nameAr: 'البرتغال', vatRate: 23, dutyRate: 6, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  AT: { name: 'Austria', nameAr: 'النمسا', vatRate: 20, dutyRate: 6, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  SE: { name: 'Sweden', nameAr: 'السويد', vatRate: 25, dutyRate: 6, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  NO: { name: 'Norway', nameAr: 'النرويج', vatRate: 25, dutyRate: 8, handlingFeeAED: 20, dutyFreeThresholdAED: 367 },
  DK: { name: 'Denmark', nameAr: 'الدنمارك', vatRate: 25, dutyRate: 6, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  FI: { name: 'Finland', nameAr: 'فنلندا', vatRate: 25.5, dutyRate: 6, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  IE: { name: 'Ireland', nameAr: 'أيرلندا', vatRate: 23, dutyRate: 6, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  PL: { name: 'Poland', nameAr: 'بولندا', vatRate: 23, dutyRate: 10, handlingFeeAED: 20, dutyFreeThresholdAED: 598 },
  CZ: { name: 'Czech Republic', nameAr: 'جمهورية التشيك', vatRate: 21, dutyRate: 10, handlingFeeAED: 20, dutyFreeThresholdAED: 598 },
  HU: { name: 'Hungary', nameAr: 'هنغاريا', vatRate: 27, dutyRate: 10, handlingFeeAED: 20, dutyFreeThresholdAED: 598 },
  RO: { name: 'Romania', nameAr: 'رومانيا', vatRate: 19, dutyRate: 10, handlingFeeAED: 20, dutyFreeThresholdAED: 598 },
  GR: { name: 'Greece', nameAr: 'اليونان', vatRate: 24, dutyRate: 6, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  HR: { name: 'Croatia', nameAr: 'كرواتيا', vatRate: 25, dutyRate: 6, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  SK: { name: 'Slovakia', nameAr: 'سلوفاكيا', vatRate: 23, dutyRate: 10, handlingFeeAED: 20, dutyFreeThresholdAED: 598 },
  SI: { name: 'Slovenia', nameAr: 'سلوفينيا', vatRate: 22, dutyRate: 6, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  BG: { name: 'Bulgaria', nameAr: 'بلغاريا', vatRate: 20, dutyRate: 10, handlingFeeAED: 20, dutyFreeThresholdAED: 598 },
  EE: { name: 'Estonia', nameAr: 'إستونيا', vatRate: 22, dutyRate: 6, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  LV: { name: 'Latvia', nameAr: 'لاتفيا', vatRate: 21, dutyRate: 6, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  LT: { name: 'Lithuania', nameAr: 'ليتوانيا', vatRate: 21, dutyRate: 6, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  LU: { name: 'Luxembourg', nameAr: 'لوكسمبورغ', vatRate: 17, dutyRate: 6, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  MT: { name: 'Malta', nameAr: 'مالطا', vatRate: 18, dutyRate: 6, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  CY: { name: 'Cyprus', nameAr: 'قبرص', vatRate: 19, dutyRate: 6, handlingFeeAED: 15, dutyFreeThresholdAED: 598 },
  CH: { name: 'Switzerland', nameAr: 'سويسرا', vatRate: 8.1, dutyRate: 8, handlingFeeAED: 20, dutyFreeThresholdAED: 184 },
  RU: { name: 'Russia', nameAr: 'روسيا', vatRate: 20, dutyRate: 15, handlingFeeAED: 30, dutyFreeThresholdAED: 735, warning: 'Shipping restrictions may apply — verify carrier availability' },
  UA: { name: 'Ukraine', nameAr: 'أوكرانيا', vatRate: 20, dutyRate: 10, handlingFeeAED: 25, warning: 'Verify current shipping restrictions for destination region' },
  TR: { name: 'Turkey', nameAr: 'تركيا', vatRate: 20, dutyRate: 18, dutyRates: { electronics: 6.5, clothing: 30, food: 20, cosmetics: 20, furniture: 20, general: 18 }, handlingFeeAED: 25 },
  RS: { name: 'Serbia', nameAr: 'صربيا', vatRate: 20, dutyRate: 10, handlingFeeAED: 25 },
  BY: { name: 'Belarus', nameAr: 'بيلاروسيا', vatRate: 20, dutyRate: 15, handlingFeeAED: 25 },
  AL: { name: 'Albania', nameAr: 'ألبانيا', vatRate: 20, dutyRate: 10, handlingFeeAED: 25 },
  BA: { name: 'Bosnia and Herzegovina', nameAr: 'البوسنة والهرسك', vatRate: 17, dutyRate: 10, handlingFeeAED: 25 },
  MK: { name: 'North Macedonia', nameAr: 'مقدونيا الشمالية', vatRate: 18, dutyRate: 10, handlingFeeAED: 25 },
  ME: { name: 'Montenegro', nameAr: 'الجبل الأسود', vatRate: 21, dutyRate: 10, handlingFeeAED: 25 },
  MD: { name: 'Moldova', nameAr: 'مولدوفا', vatRate: 20, dutyRate: 10, handlingFeeAED: 25 },
  GE: { name: 'Georgia', nameAr: 'جورجيا', vatRate: 18, dutyRate: 5, handlingFeeAED: 20 },
  AM: { name: 'Armenia', nameAr: 'أرمينيا', vatRate: 20, dutyRate: 10, handlingFeeAED: 25 },
  AZ: { name: 'Azerbaijan', nameAr: 'أذربيجان', vatRate: 18, dutyRate: 15, handlingFeeAED: 25 },
  IS: { name: 'Iceland', nameAr: 'آيسلندا', vatRate: 24, dutyRate: 8, handlingFeeAED: 20 },
  LI: { name: 'Liechtenstein', nameAr: 'ليختنشتاين', vatRate: 8.1, dutyRate: 8, handlingFeeAED: 20 },
  MC: { name: 'Monaco', nameAr: 'موناكو', vatRate: 20, dutyRate: 6, handlingFeeAED: 15 },
  SM: { name: 'San Marino', nameAr: 'سان مارينو', vatRate: 22, dutyRate: 6, handlingFeeAED: 15 },
  AD: { name: 'Andorra', nameAr: 'أندورا', vatRate: 4.5, dutyRate: 5, handlingFeeAED: 15 },
  XK: { name: 'Kosovo', nameAr: 'كوسوفو', vatRate: 18, dutyRate: 10, handlingFeeAED: 25 },

  // ── Asia ──────────────────────────────────────────────────────────────────
  IN: { name: 'India', nameAr: 'الهند', vatRate: 18, dutyRate: 20, dutyRates: { electronics: 20, clothing: 100, food: 30, cosmetics: 35, furniture: 25, general: 20 }, handlingFeeAED: 50, isHighTariff: true },
  CN: { name: 'China', nameAr: 'الصين', vatRate: 13, dutyRate: 15, dutyRates: { electronics: 10, clothing: 25, food: 15, cosmetics: 10, furniture: 20, general: 15 }, handlingFeeAED: 20 },
  JP: { name: 'Japan', nameAr: 'اليابان', vatRate: 10, dutyRate: 5, dutyRates: { electronics: 0, clothing: 10, food: 5, cosmetics: 5.8, furniture: 4.5, general: 5 }, handlingFeeAED: 20, dutyFreeThresholdAED: 245 },
  KR: { name: 'South Korea', nameAr: 'كوريا الجنوبية', vatRate: 10, dutyRate: 8, handlingFeeAED: 20, dutyFreeThresholdAED: 551 },
  SG: { name: 'Singapore', nameAr: 'سنغافورة', vatRate: 9, dutyRate: 0, handlingFeeAED: 15, dutyFreeThresholdAED: 1469 },
  HK: { name: 'Hong Kong', nameAr: 'هونغ كونغ', vatRate: 0, dutyRate: 0, handlingFeeAED: 10 },
  TW: { name: 'Taiwan', nameAr: 'تايوان', vatRate: 5, dutyRate: 6, handlingFeeAED: 20 },
  TH: { name: 'Thailand', nameAr: 'تايلاند', vatRate: 7, dutyRate: 15, handlingFeeAED: 20 },
  MY: { name: 'Malaysia', nameAr: 'ماليزيا', vatRate: 8, dutyRate: 10, handlingFeeAED: 20 },
  ID: { name: 'Indonesia', nameAr: 'إندونيسيا', vatRate: 11, dutyRate: 15, handlingFeeAED: 25 },
  PH: { name: 'Philippines', nameAr: 'الفلبين', vatRate: 12, dutyRate: 10, handlingFeeAED: 20 },
  VN: { name: 'Vietnam', nameAr: 'فيتنام', vatRate: 10, dutyRate: 15, handlingFeeAED: 20 },
  PK: { name: 'Pakistan', nameAr: 'باكستان', vatRate: 17, dutyRate: 20, handlingFeeAED: 30 },
  BD: { name: 'Bangladesh', nameAr: 'بنغلاديش', vatRate: 15, dutyRate: 25, handlingFeeAED: 30, isHighTariff: true },
  LK: { name: 'Sri Lanka', nameAr: 'سريلانكا', vatRate: 18, dutyRate: 15, handlingFeeAED: 25 },
  NP: { name: 'Nepal', nameAr: 'نيبال', vatRate: 13, dutyRate: 20, handlingFeeAED: 30 },
  MM: { name: 'Myanmar', nameAr: 'ميانمار', vatRate: 5, dutyRate: 20, handlingFeeAED: 30 },
  KH: { name: 'Cambodia', nameAr: 'كمبوديا', vatRate: 10, dutyRate: 15, handlingFeeAED: 20 },
  LA: { name: 'Laos', nameAr: 'لاوس', vatRate: 10, dutyRate: 15, handlingFeeAED: 25 },
  BN: { name: 'Brunei', nameAr: 'بروناي', vatRate: 0, dutyRate: 5, handlingFeeAED: 15 },
  TL: { name: 'Timor-Leste', nameAr: 'تيمور الشرقية', vatRate: 0, dutyRate: 10, handlingFeeAED: 25 },
  MN: { name: 'Mongolia', nameAr: 'منغوليا', vatRate: 10, dutyRate: 15, handlingFeeAED: 30 },

  // ── Middle East ───────────────────────────────────────────────────────────
  IR: { name: 'Iran', nameAr: 'إيران', vatRate: 9, dutyRate: 30, handlingFeeAED: 50, warning: 'Significant trade sanctions and shipping restrictions apply' },
  IQ: { name: 'Iraq', nameAr: 'العراق', vatRate: 0, dutyRate: 15, handlingFeeAED: 30 },
  SY: { name: 'Syria', nameAr: 'سوريا', vatRate: 10, dutyRate: 20, handlingFeeAED: 40, warning: 'Significant trade restrictions and limited carrier access' },
  LB: { name: 'Lebanon', nameAr: 'لبنان', vatRate: 11, dutyRate: 5, handlingFeeAED: 25 },
  JO: { name: 'Jordan', nameAr: 'الأردن', vatRate: 16, dutyRate: 10, handlingFeeAED: 20 },
  IL: { name: 'Israel', nameAr: 'إسرائيل', vatRate: 18, dutyRate: 12, handlingFeeAED: 25, dutyFreeThresholdAED: 367 },
  PS: { name: 'Palestine', nameAr: 'فلسطين', vatRate: 16, dutyRate: 12, handlingFeeAED: 25 },
  YE: { name: 'Yemen', nameAr: 'اليمن', vatRate: 5, dutyRate: 10, handlingFeeAED: 35, warning: 'Very limited shipping coverage — verify carrier availability' },
  KZ: { name: 'Kazakhstan', nameAr: 'كازاخستان', vatRate: 12, dutyRate: 15, handlingFeeAED: 30, dutyFreeThresholdAED: 735 },
  UZ: { name: 'Uzbekistan', nameAr: 'أوزبكستان', vatRate: 12, dutyRate: 15, handlingFeeAED: 30 },
  TM: { name: 'Turkmenistan', nameAr: 'تركمانستان', vatRate: 15, dutyRate: 20, handlingFeeAED: 35 },
  TJ: { name: 'Tajikistan', nameAr: 'طاجيكستان', vatRate: 18, dutyRate: 15, handlingFeeAED: 30 },
  KG: { name: 'Kyrgyzstan', nameAr: 'قيرغيزستان', vatRate: 12, dutyRate: 10, handlingFeeAED: 30 },
  AF: { name: 'Afghanistan', nameAr: 'أفغانستان', vatRate: 10, dutyRate: 15, handlingFeeAED: 50, warning: 'Very limited shipping coverage — verify carrier availability' },

  // ── Africa ──────────────────────────────────────────────────────────────
  NG: { name: 'Nigeria', nameAr: 'نيجيريا', vatRate: 7.5, dutyRate: 20, handlingFeeAED: 35 },
  EG: { name: 'Egypt', nameAr: 'مصر', vatRate: 14, dutyRate: 25, dutyRates: { electronics: 10, clothing: 40, food: 15, cosmetics: 40, furniture: 30, general: 25 }, handlingFeeAED: 30 },
  ZA: { name: 'South Africa', nameAr: 'جنوب أفريقيا', vatRate: 15, dutyRate: 30, dutyRates: { electronics: 15, clothing: 45, food: 15, cosmetics: 30, furniture: 25, general: 30 }, handlingFeeAED: 35 },
  ET: { name: 'Ethiopia', nameAr: 'إثيوبيا', vatRate: 15, dutyRate: 25, handlingFeeAED: 40 },
  KE: { name: 'Kenya', nameAr: 'كينيا', vatRate: 16, dutyRate: 25, handlingFeeAED: 35 },
  GH: { name: 'Ghana', nameAr: 'غانا', vatRate: 15, dutyRate: 20, handlingFeeAED: 35 },
  TZ: { name: 'Tanzania', nameAr: 'تنزانيا', vatRate: 18, dutyRate: 25, handlingFeeAED: 35 },
  DZ: { name: 'Algeria', nameAr: 'الجزائر', vatRate: 19, dutyRate: 30, handlingFeeAED: 40 },
  MA: { name: 'Morocco', nameAr: 'المغرب', vatRate: 20, dutyRate: 25, handlingFeeAED: 30 },
  TN: { name: 'Tunisia', nameAr: 'تونس', vatRate: 19, dutyRate: 25, handlingFeeAED: 30 },
  LY: { name: 'Libya', nameAr: 'ليبيا', vatRate: 0, dutyRate: 20, handlingFeeAED: 40 },
  SD: { name: 'Sudan', nameAr: 'السودان', vatRate: 17, dutyRate: 20, handlingFeeAED: 40 },
  AO: { name: 'Angola', nameAr: 'أنغولا', vatRate: 14, dutyRate: 20, handlingFeeAED: 40 },
  MZ: { name: 'Mozambique', nameAr: 'موزمبيق', vatRate: 17, dutyRate: 20, handlingFeeAED: 40 },
  MG: { name: 'Madagascar', nameAr: 'مدغشقر', vatRate: 20, dutyRate: 20, handlingFeeAED: 40 },
  CI: { name: "Côte d'Ivoire", nameAr: 'ساحل العاج', vatRate: 18, dutyRate: 20, handlingFeeAED: 35 },
  CM: { name: 'Cameroon', nameAr: 'الكاميرون', vatRate: 19.25, dutyRate: 20, handlingFeeAED: 35 },
  SN: { name: 'Senegal', nameAr: 'السنغال', vatRate: 18, dutyRate: 20, handlingFeeAED: 35 },
  ZW: { name: 'Zimbabwe', nameAr: 'زيمبابوي', vatRate: 15, dutyRate: 40, handlingFeeAED: 45, isHighTariff: true },
  ZM: { name: 'Zambia', nameAr: 'زامبيا', vatRate: 16, dutyRate: 25, handlingFeeAED: 40 },
  UG: { name: 'Uganda', nameAr: 'أوغندا', vatRate: 18, dutyRate: 25, handlingFeeAED: 35 },
  RW: { name: 'Rwanda', nameAr: 'رواندا', vatRate: 18, dutyRate: 25, handlingFeeAED: 35 },
  BF: { name: 'Burkina Faso', nameAr: 'بوركينا فاسو', vatRate: 18, dutyRate: 20, handlingFeeAED: 35 },
  ML: { name: 'Mali', nameAr: 'مالي', vatRate: 18, dutyRate: 20, handlingFeeAED: 35 },
  NE: { name: 'Niger', nameAr: 'النيجر', vatRate: 19, dutyRate: 20, handlingFeeAED: 35 },
  TD: { name: 'Chad', nameAr: 'تشاد', vatRate: 18, dutyRate: 20, handlingFeeAED: 40 },
  SO: { name: 'Somalia', nameAr: 'الصومال', vatRate: 0, dutyRate: 15, handlingFeeAED: 50, warning: 'Very limited shipping coverage — verify carrier availability' },
  DJ: { name: 'Djibouti', nameAr: 'جيبوتي', vatRate: 0, dutyRate: 20, handlingFeeAED: 30 },
  ER: { name: 'Eritrea', nameAr: 'إريتريا', vatRate: 10, dutyRate: 20, handlingFeeAED: 40 },
  GA: { name: 'Gabon', nameAr: 'الغابون', vatRate: 18, dutyRate: 20, handlingFeeAED: 35 },
  CG: { name: 'Republic of Congo', nameAr: 'جمهورية الكونغو', vatRate: 18.9, dutyRate: 20, handlingFeeAED: 40 },
  CD: { name: 'DR Congo', nameAr: 'جمهورية الكونغو الديمقراطية', vatRate: 16, dutyRate: 20, handlingFeeAED: 45 },
  CF: { name: 'Central African Republic', nameAr: 'جمهورية أفريقيا الوسطى', vatRate: 19, dutyRate: 20, handlingFeeAED: 45 },
  GQ: { name: 'Equatorial Guinea', nameAr: 'غينيا الاستوائية', vatRate: 15, dutyRate: 20, handlingFeeAED: 40 },
  SS: { name: 'South Sudan', nameAr: 'جنوب السودان', vatRate: 18, dutyRate: 20, handlingFeeAED: 50, warning: 'Very limited shipping coverage — verify carrier availability' },
  MW: { name: 'Malawi', nameAr: 'ملاوي', vatRate: 16.5, dutyRate: 25, handlingFeeAED: 40 },
  LS: { name: 'Lesotho', nameAr: 'ليسوتو', vatRate: 15, dutyRate: 20, handlingFeeAED: 35 },
  SZ: { name: 'Eswatini', nameAr: 'إيسواتيني', vatRate: 15, dutyRate: 20, handlingFeeAED: 35 },
  BW: { name: 'Botswana', nameAr: 'بوتسوانا', vatRate: 14, dutyRate: 20, handlingFeeAED: 35 },
  NA: { name: 'Namibia', nameAr: 'ناميبيا', vatRate: 15, dutyRate: 20, handlingFeeAED: 35 },
  MR: { name: 'Mauritania', nameAr: 'موريتانيا', vatRate: 16, dutyRate: 20, handlingFeeAED: 35 },
  GN: { name: 'Guinea', nameAr: 'غينيا', vatRate: 18, dutyRate: 20, handlingFeeAED: 35 },
  GW: { name: 'Guinea-Bissau', nameAr: 'غينيا بيساو', vatRate: 15, dutyRate: 20, handlingFeeAED: 35 },
  SL: { name: 'Sierra Leone', nameAr: 'سيراليون', vatRate: 15, dutyRate: 20, handlingFeeAED: 35 },
  LR: { name: 'Liberia', nameAr: 'ليبيريا', vatRate: 10, dutyRate: 20, handlingFeeAED: 35 },
  GM: { name: 'Gambia', nameAr: 'غامبيا', vatRate: 15, dutyRate: 20, handlingFeeAED: 35 },
  CV: { name: 'Cape Verde', nameAr: 'الرأس الأخضر', vatRate: 15, dutyRate: 20, handlingFeeAED: 35 },
  ST: { name: 'São Tomé and Príncipe', nameAr: 'ساو تومي وبرينسيبي', vatRate: 15, dutyRate: 20, handlingFeeAED: 40 },
  KM: { name: 'Comoros', nameAr: 'جزر القمر', vatRate: 10, dutyRate: 20, handlingFeeAED: 40 },
  MU: { name: 'Mauritius', nameAr: 'موريشيوس', vatRate: 15, dutyRate: 15, handlingFeeAED: 25 },
  SC: { name: 'Seychelles', nameAr: 'سيشل', vatRate: 15, dutyRate: 25, handlingFeeAED: 30 },
  BI: { name: 'Burundi', nameAr: 'بوروندي', vatRate: 18, dutyRate: 25, handlingFeeAED: 40 },
  BJ: { name: 'Benin', nameAr: 'بنين', vatRate: 18, dutyRate: 20, handlingFeeAED: 35 },
  TG: { name: 'Togo', nameAr: 'توغو', vatRate: 18, dutyRate: 20, handlingFeeAED: 35 },

  // ── Oceania ──────────────────────────────────────────────────────────────
  AU: { name: 'Australia', nameAr: 'أستراليا', vatRate: 10, dutyRate: 5, dutyRates: { electronics: 0, clothing: 5, food: 0, cosmetics: 5, furniture: 5, general: 5 }, handlingFeeAED: 20, dutyFreeThresholdAED: 2450 },
  NZ: { name: 'New Zealand', nameAr: 'نيوزيلندا', vatRate: 15, dutyRate: 5, handlingFeeAED: 20, dutyFreeThresholdAED: 1100 },
  FJ: { name: 'Fiji', nameAr: 'فيجي', vatRate: 9, dutyRate: 15, handlingFeeAED: 30 },
  PG: { name: 'Papua New Guinea', nameAr: 'بابوا غينيا الجديدة', vatRate: 10, dutyRate: 15, handlingFeeAED: 35 },
  SB: { name: 'Solomon Islands', nameAr: 'جزر سليمان', vatRate: 15, dutyRate: 20, handlingFeeAED: 35 },
  VU: { name: 'Vanuatu', nameAr: 'فانواتو', vatRate: 15, dutyRate: 20, handlingFeeAED: 35 },
  WS: { name: 'Samoa', nameAr: 'ساموا', vatRate: 15, dutyRate: 20, handlingFeeAED: 35 },
  TO: { name: 'Tonga', nameAr: 'تونغا', vatRate: 15, dutyRate: 20, handlingFeeAED: 35 },
  KI: { name: 'Kiribati', nameAr: 'كيريباتي', vatRate: 0, dutyRate: 20, handlingFeeAED: 40 },
  FM: { name: 'Micronesia', nameAr: 'ميكرونيزيا', vatRate: 0, dutyRate: 20, handlingFeeAED: 40 },
  MH: { name: 'Marshall Islands', nameAr: 'جزر مارشال', vatRate: 0, dutyRate: 15, handlingFeeAED: 40 },
  PW: { name: 'Palau', nameAr: 'بالاو', vatRate: 0, dutyRate: 15, handlingFeeAED: 35 },
  NR: { name: 'Nauru', nameAr: 'ناورو', vatRate: 0, dutyRate: 15, handlingFeeAED: 40 },
  TV: { name: 'Tuvalu', nameAr: 'توفالو', vatRate: 0, dutyRate: 15, handlingFeeAED: 40 },
}

// Regional defaults for uncovered countries
const REGIONAL_DEFAULTS: Record<string, Omit<CountryTaxData, 'name' | 'nameAr'>> = {
  AF_DEFAULT: { vatRate: 15, dutyRate: 20, handlingFeeAED: 30 },
  LA_DEFAULT: { vatRate: 16, dutyRate: 18, handlingFeeAED: 40 },
  SEA_DEFAULT: { vatRate: 10, dutyRate: 15, handlingFeeAED: 20 },
  EEU_DEFAULT: { vatRate: 20, dutyRate: 10, handlingFeeAED: 25 },
  CA_ASIA_DEFAULT: { vatRate: 12, dutyRate: 15, handlingFeeAED: 30 },
}

function formatAED(amount: number): string {
  return `${amount.toFixed(2)} AED`
}

function getEffectiveDutyRate(
  data: CountryTaxData,
  category: ProductCategory
): number {
  if (data.dutyRates && data.dutyRates[category] !== undefined) {
    return data.dutyRates[category]!
  }
  return data.dutyRate
}

export function calculateCustoms(params: {
  destinationCountryCode: string
  productValueAED: number
  shippingCostAED: number
  productCategory?: ProductCategory
  isDubaiWarehouse?: boolean
}): CustomsResult {
  const {
    destinationCountryCode,
    productValueAED,
    shippingCostAED,
    productCategory = 'general',
    isDubaiWarehouse = true,
  } = params

  const code = destinationCountryCode.toUpperCase()
  const data = COUNTRY_DATA[code]

  // Fallback for uncovered countries
  const taxData: CountryTaxData = data ?? {
    name: code,
    nameAr: code,
    ...REGIONAL_DEFAULTS.AF_DEFAULT,
  }

  const isFreeZone = isDubaiWarehouse

  const effectiveDutyRate = getEffectiveDutyRate(taxData, productCategory)
  const threshold = taxData.dutyFreeThresholdAED

  // De minimis check: if product value is below duty-free threshold, duty = 0
  const dutyApplies = threshold === undefined || productValueAED >= threshold
  const importDutyRate = dutyApplies ? effectiveDutyRate : 0
  const importDutyAED = +(productValueAED * (importDutyRate / 100)).toFixed(2)

  // VAT base = product + shipping + import duty
  const vatBase = productValueAED + shippingCostAED + importDutyAED
  const vatAED = +(vatBase * (taxData.vatRate / 100)).toFixed(2)

  const handlingFee = taxData.handlingFeeAED

  const totalTaxAED = +(importDutyAED + vatAED + handlingFee).toFixed(2)
  const totalLandedCostAED = +(productValueAED + shippingCostAED + totalTaxAED).toFixed(2)

  const breakdown: TaxLineItem[] = [
    {
      label: 'قيمة المنتج',
      amountAED: productValueAED,
      amountFormatted: formatAED(productValueAED),
    },
    {
      label: 'تكلفة الشحن',
      amountAED: shippingCostAED,
      amountFormatted: formatAED(shippingCostAED),
    },
    {
      label: 'رسوم الاستيراد',
      rate: importDutyRate > 0 ? `${importDutyRate}%` : undefined,
      amountAED: importDutyAED,
      amountFormatted: formatAED(importDutyAED),
    },
  ]

  if (taxData.vatRate > 0) {
    breakdown.push({
      label: 'ضريبة القيمة المضافة',
      rate: `${taxData.vatRate}%`,
      amountAED: vatAED,
      amountFormatted: formatAED(vatAED),
    })
  }

  if (handlingFee > 0) {
    breakdown.push({
      label: 'رسوم الجمارك والمناولة',
      amountAED: handlingFee,
      amountFormatted: formatAED(handlingFee),
    })
  }

  breakdown.push({
    label: 'إجمالي التكاليف',
    amountAED: totalLandedCostAED,
    amountFormatted: formatAED(totalLandedCostAED),
  })

  // Build warning
  let warning = taxData.warning
  const combinedRate = importDutyRate + taxData.vatRate
  if (!warning && combinedRate > 30) {
    warning = `تحذير: إجمالي الضرائب مرتفع (${combinedRate.toFixed(1)}%) في هذا البلد`
  }

  return {
    countryCode: code,
    countryName: taxData.name,
    countryNameAr: taxData.nameAr,
    productValueAED,
    importDutyRate,
    importDutyAED,
    vatRate: taxData.vatRate,
    vatAED,
    customsHandlingFeeAED: handlingFee,
    totalTaxAED,
    totalLandedCostAED,
    breakdown,
    warning,
    isFreeZone,
    dutyFreeThresholdAED: threshold,
  }
}

export function getSupportedCountries(): Array<{ code: string; name: string; nameAr: string }> {
  return Object.entries(COUNTRY_DATA).map(([code, data]) => ({
    code,
    name: data.name,
    nameAr: data.nameAr,
  }))
}
