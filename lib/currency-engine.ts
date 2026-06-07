// lib/currency-engine.ts
// LEE E-Commerce Platform — Multi-Currency Pricing Engine
// Base currency: AED (UAE Dirham)

export interface CurrencyConfig {
  code: string
  name: string
  nameAr: string
  symbol: string
  rateToAED: number
  flag: string
  decimals?: number
  symbolAfter?: boolean
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  AED: { code: 'AED', name: 'UAE Dirham',            nameAr: 'درهم إماراتي',        symbol: 'د.إ',  rateToAED: 1,        flag: '🇦🇪', symbolAfter: true },
  USD: { code: 'USD', name: 'US Dollar',              nameAr: 'دولار أمريكي',        symbol: '$',    rateToAED: 3.67,     flag: '🇺🇸' },
  EUR: { code: 'EUR', name: 'Euro',                   nameAr: 'يورو',                symbol: '€',    rateToAED: 4.02,     flag: '🇪🇺' },
  GBP: { code: 'GBP', name: 'British Pound',          nameAr: 'جنيه إسترليني',       symbol: '£',    rateToAED: 4.65,     flag: '🇬🇧' },
  SAR: { code: 'SAR', name: 'Saudi Riyal',            nameAr: 'ريال سعودي',          symbol: 'ر.س',  rateToAED: 0.98,     flag: '🇸🇦', symbolAfter: true },
  KWD: { code: 'KWD', name: 'Kuwaiti Dinar',          nameAr: 'دينار كويتي',         symbol: 'د.ك',  rateToAED: 11.96,    flag: '🇰🇼', decimals: 3, symbolAfter: true },
  QAR: { code: 'QAR', name: 'Qatari Riyal',           nameAr: 'ريال قطري',           symbol: 'ر.ق',  rateToAED: 1.01,     flag: '🇶🇦', symbolAfter: true },
  BHD: { code: 'BHD', name: 'Bahraini Dinar',         nameAr: 'دينار بحريني',        symbol: 'د.ب',  rateToAED: 9.74,     flag: '🇧🇭', decimals: 3, symbolAfter: true },
  OMR: { code: 'OMR', name: 'Omani Rial',             nameAr: 'ريال عُماني',         symbol: 'ر.ع',  rateToAED: 9.54,     flag: '🇴🇲', decimals: 3, symbolAfter: true },
  EGP: { code: 'EGP', name: 'Egyptian Pound',         nameAr: 'جنيه مصري',           symbol: 'ج.م',  rateToAED: 0.074,    flag: '🇪🇬', symbolAfter: true },
  JOD: { code: 'JOD', name: 'Jordanian Dinar',        nameAr: 'دينار أردني',         symbol: 'د.ا',  rateToAED: 5.18,     flag: '🇯🇴', decimals: 3, symbolAfter: true },
  TRY: { code: 'TRY', name: 'Turkish Lira',           nameAr: 'ليرة تركية',          symbol: '₺',    rateToAED: 0.11,     flag: '🇹🇷' },
  INR: { code: 'INR', name: 'Indian Rupee',           nameAr: 'روبية هندية',          symbol: '₹',    rateToAED: 0.044,    flag: '🇮🇳' },
  PKR: { code: 'PKR', name: 'Pakistani Rupee',        nameAr: 'روبية باكستانية',     symbol: '₨',    rateToAED: 0.013,    flag: '🇵🇰' },
  BDT: { code: 'BDT', name: 'Bangladeshi Taka',       nameAr: 'تاكا بنغلاديشي',      symbol: '৳',    rateToAED: 0.033,    flag: '🇧🇩' },
  NGN: { code: 'NGN', name: 'Nigerian Naira',         nameAr: 'نيرة نيجيرية',        symbol: '₦',    rateToAED: 0.0024,   flag: '🇳🇬' },
  ZAR: { code: 'ZAR', name: 'South African Rand',     nameAr: 'راند جنوب أفريقي',    symbol: 'R',    rateToAED: 0.20,     flag: '🇿🇦' },
  KES: { code: 'KES', name: 'Kenyan Shilling',        nameAr: 'شلن كيني',            symbol: 'KSh',  rateToAED: 0.028,    flag: '🇰🇪' },
  CNY: { code: 'CNY', name: 'Chinese Yuan',           nameAr: 'يوان صيني',           symbol: '¥',    rateToAED: 0.51,     flag: '🇨🇳' },
  JPY: { code: 'JPY', name: 'Japanese Yen',           nameAr: 'ين ياباني',           symbol: '¥',    rateToAED: 0.024,    flag: '🇯🇵', decimals: 0 },
  KRW: { code: 'KRW', name: 'Korean Won',             nameAr: 'وون كوري',            symbol: '₩',    rateToAED: 0.0027,   flag: '🇰🇷', decimals: 0 },
  MYR: { code: 'MYR', name: 'Malaysian Ringgit',      nameAr: 'رينغيت ماليزي',       symbol: 'RM',   rateToAED: 0.78,     flag: '🇲🇾' },
  IDR: { code: 'IDR', name: 'Indonesian Rupiah',      nameAr: 'روبية إندونيسية',     symbol: 'Rp',   rateToAED: 0.00023,  flag: '🇮🇩', decimals: 0 },
  THB: { code: 'THB', name: 'Thai Baht (Legacy)',      nameAr: 'بات تايلاندي (قديم)',        symbol: '฿',    rateToAED: 0.10,     flag: '🇹🇭' }, // Legacy support only - deprecated
  VND: { code: 'VND', name: 'Vietnamese Dong',        nameAr: 'دونغ فيتنامي',        symbol: '₫',    rateToAED: 0.00015,  flag: '🇻🇳', decimals: 0 },
  PHP: { code: 'PHP', name: 'Philippine Peso',        nameAr: 'بيسو فلبيني',         symbol: '₱',    rateToAED: 0.064,    flag: '🇵🇭' },
  SGD: { code: 'SGD', name: 'Singapore Dollar',       nameAr: 'دولار سنغافوري',      symbol: 'S$',   rateToAED: 2.72,     flag: '🇸🇬' },
  AUD: { code: 'AUD', name: 'Australian Dollar',      nameAr: 'دولار أسترالي',       symbol: 'A$',   rateToAED: 2.34,     flag: '🇦🇺' },
  CAD: { code: 'CAD', name: 'Canadian Dollar',        nameAr: 'دولار كندي',          symbol: 'C$',   rateToAED: 2.68,     flag: '🇨🇦' },
  BRL: { code: 'BRL', name: 'Brazilian Real',         nameAr: 'ريال برازيلي',        symbol: 'R$',   rateToAED: 0.67,     flag: '🇧🇷' },
  MXN: { code: 'MXN', name: 'Mexican Peso',           nameAr: 'بيسو مكسيكي',         symbol: '$',    rateToAED: 0.19,     flag: '🇲🇽' },
  CHF: { code: 'CHF', name: 'Swiss Franc',            nameAr: 'فرنك سويسري',         symbol: 'CHF',  rateToAED: 4.12,     flag: '🇨🇭' },
  SEK: { code: 'SEK', name: 'Swedish Krona',          nameAr: 'كرونة سويدية',        symbol: 'kr',   rateToAED: 0.35,     flag: '🇸🇪' },
  NOK: { code: 'NOK', name: 'Norwegian Krone',        nameAr: 'كرونة نرويجية',       symbol: 'kr',   rateToAED: 0.34,     flag: '🇳🇴' },
  DKK: { code: 'DKK', name: 'Danish Krone',           nameAr: 'كرونة دانماركية',     symbol: 'kr',   rateToAED: 0.54,     flag: '🇩🇰' },
  PLN: { code: 'PLN', name: 'Polish Zloty',           nameAr: 'زلوتي بولندي',        symbol: 'zł',   rateToAED: 0.93,     flag: '🇵🇱' },
  CZK: { code: 'CZK', name: 'Czech Koruna',           nameAr: 'كورونا تشيكية',       symbol: 'Kč',   rateToAED: 0.16,     flag: '🇨🇿' },
  HUF: { code: 'HUF', name: 'Hungarian Forint',       nameAr: 'فورنت مجري',          symbol: 'Ft',   rateToAED: 0.0099,   flag: '🇭🇺', decimals: 0 },
  RON: { code: 'RON', name: 'Romanian Leu',           nameAr: 'ليو روماني',          symbol: 'lei',  rateToAED: 0.81,     flag: '🇷🇴' },
  ILS: { code: 'ILS', name: 'Israeli Shekel',         nameAr: 'شيقل إسرائيلي',       symbol: '₪',    rateToAED: 1.00,     flag: '🇮🇱' },
  LBP: { code: 'LBP', name: 'Lebanese Pound',         nameAr: 'ليرة لبنانية',        symbol: 'ل.ل',  rateToAED: 0.000041, flag: '🇱🇧', decimals: 0, symbolAfter: true },
  LYD: { code: 'LYD', name: 'Libyan Dinar',           nameAr: 'دينار ليبي',          symbol: 'ل.د',  rateToAED: 0.75,     flag: '🇱🇾', decimals: 3, symbolAfter: true },
  MAD: { code: 'MAD', name: 'Moroccan Dirham',        nameAr: 'درهم مغربي',          symbol: 'د.م.', rateToAED: 0.37,     flag: '🇲🇦', symbolAfter: true },
  TND: { code: 'TND', name: 'Tunisian Dinar',         nameAr: 'دينار تونسي',         symbol: 'د.ت',  rateToAED: 1.22,     flag: '🇹🇳', decimals: 3, symbolAfter: true },
  DZD: { code: 'DZD', name: 'Algerian Dinar',         nameAr: 'دينار جزائر��',        symbol: 'د.ج',  rateToAED: 0.028,    flag: '🇩🇿', symbolAfter: true },
  SDG: { code: 'SDG', name: 'Sudanese Pound',         nameAr: 'جنيه سوداني',         symbol: 'ج.س',  rateToAED: 0.0059,   flag: '🇸🇩', symbolAfter: true },
  IQD: { code: 'IQD', name: 'Iraqi Dinar',            nameAr: 'دينار عراقي',         symbol: 'ع.د',  rateToAED: 0.0028,   flag: '🇮🇶', decimals: 0, symbolAfter: true },
  SYP: { code: 'SYP', name: 'Syrian Pound',           nameAr: 'ليرة سورية',          symbol: 'ل.س',  rateToAED: 0.00029,  flag: '🇸🇾', decimals: 0, symbolAfter: true },
  YER: { code: 'YER', name: 'Yemeni Rial',            nameAr: 'ريال يمني',           symbol: 'ر.ي',  rateToAED: 0.0147,   flag: '🇾🇪', symbolAfter: true },
  NZD: { code: 'NZD', name: 'New Zealand Dollar',     nameAr: 'دولار نيوزيلندي',     symbol: 'NZ$',  rateToAED: 2.14,     flag: '🇳🇿' },
  HKD: { code: 'HKD', name: 'Hong Kong Dollar',       nameAr: 'دولار هونغ كونغ',     symbol: 'HK$',  rateToAED: 0.47,     flag: '🇭🇰' },
  TWD: { code: 'TWD', name: 'Taiwan Dollar',          nameAr: 'دولار تايواني',       symbol: 'NT$',  rateToAED: 0.11,     flag: '🇹🇼' },
  MOP: { code: 'MOP', name: 'Macanese Pataca',        nameAr: 'باتاكا ماكاو',        symbol: 'MOP$', rateToAED: 0.46,     flag: '🇲🇴' },
  MMK: { code: 'MMK', name: 'Myanmar Kyat',           nameAr: 'كيات ميانماري',       symbol: 'K',    rateToAED: 0.0017,   flag: '🇲🇲', decimals: 0 },
  KHR: { code: 'KHR', name: 'Cambodian Riel',         nameAr: 'ريال كمبودي',         symbol: '៛',    rateToAED: 0.00090,  flag: '🇰🇭', decimals: 0 },
  LAK: { code: 'LAK', name: 'Lao Kip',               nameAr: 'كيب لاوسي',           symbol: '₭',    rateToAED: 0.00018,  flag: '🇱🇦', decimals: 0 },
  NPR: { code: 'NPR', name: 'Nepalese Rupee',         nameAr: 'روبية نيبالية',        symbol: '₨',    rateToAED: 0.028,    flag: '🇳🇵' },
  LKR: { code: 'LKR', name: 'Sri Lankan Rupee',       nameAr: 'روبية سريلانكية',     symbol: 'Rs',   rateToAED: 0.011,    flag: '🇱🇰' },
  MVR: { code: 'MVR', name: 'Maldivian Rufiyaa',      nameAr: 'رفية مالديفية',       symbol: 'Rf',   rateToAED: 0.24,     flag: '🇲🇻' },
  AFN: { code: 'AFN', name: 'Afghan Afghani',         nameAr: 'أفغاني أفغاني',       symbol: '؋',    rateToAED: 0.050,    flag: '🇦🇫' },
  UZS: { code: 'UZS', name: 'Uzbek Som',              nameAr: 'سوم أوزبكي',          symbol: "so'm", rateToAED: 0.00029,  flag: '🇺🇿', decimals: 0 },
  KZT: { code: 'KZT', name: 'Kazakhstani Tenge',      nameAr: 'تنغة كازاخستانية',    symbol: '₸',    rateToAED: 0.0075,   flag: '🇰🇿' },
  AZN: { code: 'AZN', name: 'Azerbaijani Manat',      nameAr: 'مانات أذربيجاني',     symbol: '₼',    rateToAED: 2.16,     flag: '🇦🇿' },
  GEL: { code: 'GEL', name: 'Georgian Lari',          nameAr: 'لاري جورجي',          symbol: '₾',    rateToAED: 1.34,     flag: '🇬🇪' },
  AMD: { code: 'AMD', name: 'Armenian Dram',          nameAr: 'درام أرميني',         symbol: '֏',    rateToAED: 0.0095,   flag: '🇦🇲', decimals: 0 },
  RUB: { code: 'RUB', name: 'Russian Ruble',          nameAr: 'روبل روسي',           symbol: '₽',    rateToAED: 0.040,    flag: '🇷🇺' },
  UAH: { code: 'UAH', name: 'Ukrainian Hryvnia',      nameAr: 'هريفنيا أوكراني',     symbol: '₴',    rateToAED: 0.089,    flag: '🇺🇦' },
  ETB: { code: 'ETB', name: 'Ethiopian Birr',         nameAr: 'بير إثيوبي',          symbol: 'Br',   rateToAED: 0.028,    flag: '🇪🇹' },
  GHS: { code: 'GHS', name: 'Ghanaian Cedi',          nameAr: 'سيدي غاني',           symbol: '₵',    rateToAED: 0.28,     flag: '🇬🇭' },
  TZS: { code: 'TZS', name: 'Tanzanian Shilling',     nameAr: 'شلن تنزاني',          symbol: 'TSh',  rateToAED: 0.0014,   flag: '🇹🇿', decimals: 0 },
  UGX: { code: 'UGX', name: 'Ugandan Shilling',       nameAr: 'شلن أوغندي',          symbol: 'USh',  rateToAED: 0.00099,  flag: '🇺🇬', decimals: 0 },
  RWF: { code: 'RWF', name: 'Rwandan Franc',          nameAr: 'فرنك رواندي',         symbol: 'RF',   rateToAED: 0.0026,   flag: '🇷🇼', decimals: 0 },
  XOF: { code: 'XOF', name: 'West African CFA Franc', nameAr: 'فرنك أفريقي غربي',   symbol: 'CFA',  rateToAED: 0.0061,   flag: '🌍', decimals: 0 },
  XAF: { code: 'XAF', name: 'Central African CFA',   nameAr: 'فرنك أفريقي وسطي',   symbol: 'FCFA', rateToAED: 0.0061,   flag: '🌍', decimals: 0 },
  MZN: { code: 'MZN', name: 'Mozambican Metical',     nameAr: 'ميتيكال موزمبيقي',   symbol: 'MT',   rateToAED: 0.058,    flag: '🇲🇿' },
  ZMW: { code: 'ZMW', name: 'Zambian Kwacha',         nameAr: 'كواشا زامبي',         symbol: 'ZK',   rateToAED: 0.13,     flag: '🇿🇲' },
  BIF: { code: 'BIF', name: 'Burundian Franc',        nameAr: 'فرنك بوروندي',        symbol: 'Fr',   rateToAED: 0.0014,   flag: '🇧🇮', decimals: 0 },
  MGA: { code: 'MGA', name: 'Malagasy Ariary',        nameAr: 'أرياري مدغشقري',      symbol: 'Ar',   rateToAED: 0.00082,  flag: '🇲🇬', decimals: 0 },
  AOA: { code: 'AOA', name: 'Angolan Kwanza',         nameAr: 'كوانزا أنغولي',       symbol: 'Kz',   rateToAED: 0.0040,   flag: '🇦🇴' },
  CDF: { code: 'CDF', name: 'Congolese Franc',        nameAr: 'فرنك كونغولي',        symbol: 'FC',   rateToAED: 0.0013,   flag: '🇨🇩', decimals: 0 },
  SOS: { code: 'SOS', name: 'Somali Shilling',        nameAr: 'شلن صومالي',          symbol: 'Sh',   rateToAED: 0.0064,   flag: '🇸🇴', decimals: 0 },
  ERN: { code: 'ERN', name: 'Eritrean Nakfa',         nameAr: 'ناكفا إريتري',        symbol: 'Nfk',  rateToAED: 0.24,     flag: '🇪🇷' },
  DJF: { code: 'DJF', name: 'Djiboutian Franc',       nameAr: 'فرنك جيبوتي',         symbol: 'Fdj',  rateToAED: 0.021,    flag: '🇩🇯', decimals: 0 },
  ARS: { code: 'ARS', name: 'Argentine Peso',         nameAr: 'بيسو أرجنتيني',       symbol: '$',    rateToAED: 0.0038,   flag: '🇦🇷' },
  CLP: { code: 'CLP', name: 'Chilean Peso',           nameAr: 'بيسو تشيلي',          symbol: '$',    rateToAED: 0.0040,   flag: '🇨🇱', decimals: 0 },
  COP: { code: 'COP', name: 'Colombian Peso',         nameAr: 'بيسو كولومبي',        symbol: '$',    rateToAED: 0.00088,  flag: '🇨🇴', decimals: 0 },
  PEN: { code: 'PEN', name: 'Peruvian Sol',           nameAr: 'سول بيروفي',          symbol: 'S/',   rateToAED: 0.99,     flag: '🇵🇪' },
  VES: { code: 'VES', name: 'Venezuelan Bolivar',     nameAr: 'بوليفار فنزويلي',     symbol: 'Bs.',  rateToAED: 0.10,     flag: '🇻🇪' },
  BOB: { code: 'BOB', name: 'Bolivian Boliviano',     nameAr: 'بوليفيانو بوليفي',    symbol: 'Bs.',  rateToAED: 0.53,     flag: '🇧🇴' },
  PYG: { code: 'PYG', name: 'Paraguayan Guaraní',     nameAr: 'غواراني باراغوياني',  symbol: '₲',    rateToAED: 0.00050,  flag: '🇵🇾', decimals: 0 },
  UYU: { code: 'UYU', name: 'Uruguayan Peso',         nameAr: 'بيسو أوروغواياني',    symbol: '$',    rateToAED: 0.091,    flag: '🇺🇾' },
  GTQ: { code: 'GTQ', name: 'Guatemalan Quetzal',     nameAr: 'كيتزال غواتيمالي',    symbol: 'Q',    rateToAED: 0.47,     flag: '🇬🇹' },
  CRC: { code: 'CRC', name: 'Costa Rican Colón',      nameAr: 'كولون كوستاريكي',     symbol: '₡',    rateToAED: 0.0072,   flag: '🇨🇷', decimals: 0 },
  HNL: { code: 'HNL', name: 'Honduran Lempira',       nameAr: 'ليمبيرا هندوراسي',    symbol: 'L',    rateToAED: 0.15,     flag: '🇭🇳' },
  NIO: { code: 'NIO', name: 'Nicaraguan Córdoba',     nameAr: 'كوردوبا نيكاراغوي',   symbol: 'C$',   rateToAED: 0.10,     flag: '🇳🇮' },
  PAB: { code: 'PAB', name: 'Panamanian Balboa',      nameAr: 'بالبوا بنمي',         symbol: 'B/.',  rateToAED: 3.67,     flag: '🇵🇦' },
  DOP: { code: 'DOP', name: 'Dominican Peso',         nameAr: 'بيسو دومينيكاني',     symbol: '$',    rateToAED: 0.062,    flag: '🇩🇴' },
  CUP: { code: 'CUP', name: 'Cuban Peso',             nameAr: 'بيسو كوبي',           symbol: '$',    rateToAED: 0.15,     flag: '🇨🇺' },
  TTD: { code: 'TTD', name: 'Trinidad Dollar',        nameAr: 'دولار ترينيداد',       symbol: 'TT$',  rateToAED: 0.54,     flag: '🇹🇹' },
  JMD: { code: 'JMD', name: 'Jamaican Dollar',        nameAr: 'دولار جامايكي',        symbol: 'J$',   rateToAED: 0.024,    flag: '🇯🇲' },
  BBD: { code: 'BBD', name: 'Barbadian Dollar',       nameAr: 'دولار بربادوس',        symbol: 'Bds$', rateToAED: 1.84,     flag: '🇧🇧' },
  XCD: { code: 'XCD', name: 'East Caribbean Dollar',  nameAr: 'دولار كاريبي شرقي',   symbol: 'EC$',  rateToAED: 1.36,     flag: '🌎' },
  ISK: { code: 'ISK', name: 'Icelandic Króna',        nameAr: 'كرونة آيسلندية',      symbol: 'kr',   rateToAED: 0.027,    flag: '🇮🇸', decimals: 0 },
  HRK: { code: 'HRK', name: 'Croatian Kuna',          nameAr: 'كونا كرواتية',        symbol: 'kn',   rateToAED: 0.52,     flag: '🇭🇷' },
  BGN: { code: 'BGN', name: 'Bulgarian Lev',          nameAr: 'ليف بلغاري',          symbol: 'лв',   rateToAED: 2.06,     flag: '🇧🇬' },
  RSD: { code: 'RSD', name: 'Serbian Dinar',          nameAr: 'دينار صربي',          symbol: 'дин',  rateToAED: 0.034,    flag: '🇷🇸' },
  MKD: { code: 'MKD', name: 'Macedonian Denar',       nameAr: 'دينار مقدوني',        symbol: 'ден',  rateToAED: 0.065,    flag: '🇲🇰' },
  ALL: { code: 'ALL', name: 'Albanian Lek',           nameAr: 'ليك ألباني',          symbol: 'L',    rateToAED: 0.038,    flag: '🇦🇱' },
  BAM: { code: 'BAM', name: 'Bosnia Mark',            nameAr: 'مارك بوسني',          symbol: 'KM',   rateToAED: 2.06,     flag: '🇧🇦' },
  MDL: { code: 'MDL', name: 'Moldovan Leu',           nameAr: 'ليو مولدوفي',         symbol: 'L',    rateToAED: 0.21,     flag: '🇲🇩' },
  BYN: { code: 'BYN', name: 'Belarusian Ruble',       nameAr: 'روبل بيلاروسي',       symbol: 'Br',   rateToAED: 1.13,     flag: '🇧🇾' },
}

function getDecimals(currencyCode: string): number {
  const config = CURRENCIES[currencyCode]
  if (!config) return 2
  if (config.decimals !== undefined) return config.decimals
  if (['JPY','KRW','VND','IDR','HUF','MMK','KHR','LAK','UZS','ISK','TZS','UGX','RWF','XOF','XAF','BIF','MGA','CDF','SOS','DJF','IQD','SYP','LBP','CLP','COP','PYG','CRC','AMD','NGN'].includes(currencyCode)) return 0
  if (['KWD','BHD','OMR','JOD','LYD','TND'].includes(currencyCode)) return 3
  return 2
}

export function convertFromAED(amountAED: number, targetCurrency: string): number {
  const config = CURRENCIES[targetCurrency]
  if (!config) throw new Error(`Unknown currency: ${targetCurrency}`)
  if (targetCurrency === 'AED') return amountAED
  return amountAED / config.rateToAED
}

export function convert(amount: number, fromCurrency: string, toCurrency: string): number {
  const fromConfig = CURRENCIES[fromCurrency]
  if (!fromConfig) throw new Error(`Unknown currency: ${fromCurrency}`)
  const amountInAED = fromCurrency === 'AED' ? amount : amount * fromConfig.rateToAED
  return convertFromAED(amountInAED, toCurrency)
}

export function formatPrice(amount: number, currencyCode: string): string {
  const config = CURRENCIES[currencyCode]
  if (!config) return `${amount.toFixed(2)} ${currencyCode}`
  const decimals = getDecimals(currencyCode)
  const formatted = amount.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return config.symbolAfter ? `${formatted} ${config.symbol}` : `${config.symbol}${formatted}`
}

export function formatDualPrice(amountAED: number, localCurrency: string): { local: string; aed: string } {
  const localAmount = convertFromAED(amountAED, localCurrency)
  return { local: formatPrice(localAmount, localCurrency), aed: formatPrice(amountAED, 'AED') }
}

export function formatConvertedPrice(amountAED: number, targetCurrency: string): string {
  return formatPrice(convertFromAED(amountAED, targetCurrency), targetCurrency)
}

export const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  AE:'AED',SA:'SAR',KW:'KWD',QA:'QAR',BH:'BHD',OM:'OMR',EG:'EGP',JO:'JOD',LB:'LBP',SY:'SYP',IQ:'IQD',YE:'YER',LY:'LYD',TN:'TND',MA:'MAD',DZ:'DZD',SD:'SDG',MR:'XOF',DJ:'DJF',SO:'SOS',ER:'ERN',ET:'ETB',IL:'ILS',PS:'ILS',
  US:'USD',CA:'CAD',GB:'GBP',AU:'AUD',NZ:'NZD',DE:'EUR',FR:'EUR',IT:'EUR',ES:'EUR',NL:'EUR',BE:'EUR',AT:'EUR',PT:'EUR',IE:'EUR',FI:'EUR',GR:'EUR',CY:'EUR',MT:'EUR',SK:'EUR',SI:'EUR',EE:'EUR',LV:'EUR',LT:'EUR',LU:'EUR',MC:'EUR',SM:'EUR',VA:'EUR',AD:'EUR',CH:'CHF',LI:'CHF',SE:'SEK',NO:'NOK',DK:'DKK',IS:'ISK',PL:'PLN',CZ:'CZK',HU:'HUF',RO:'RON',BG:'BGN',HR:'EUR',RS:'RSD',BA:'BAM',ME:'EUR',MK:'MKD',AL:'ALL',XK:'EUR',MD:'MDL',UA:'UAH',BY:'BYN',RU:'RUB',TR:'TRY',GE:'GEL',AM:'AMD',AZ:'AZN',
  CN:'CNY',JP:'JPY',KR:'KRW',HK:'HKD',TW:'TWD',MO:'MOP',SG:'SGD',MY:'MYR',ID:'IDR',TH:'AED',VN:'VND',PH:'PHP',MM:'MMK',KH:'KHR',LA:'LAK',BN:'SGD',IN:'INR',PK:'PKR',BD:'BDT',NP:'NPR',LK:'LKR',MV:'MVR',AF:'AFN',IR:'IRR',KZ:'KZT',UZ:'UZS',TJ:'TJS',KG:'KGS',TM:'TMT',MN:'MNT',
  NG:'NGN',ZA:'ZAR',KE:'KES',GH:'GHS',TZ:'TZS',UG:'UGX',RW:'RWF',BI:'BIF',MG:'MGA',AO:'AOA',CD:'CDF',MZ:'MZN',ZM:'ZMW',ZW:'USD',BW:'BWP',NA:'NAD',LS:'LSL',SZ:'SZL',MW:'MWK',MU:'MUR',SC:'SCR',KM:'KMF',CV:'CVE',ST:'STN',GQ:'XAF',GA:'XAF',CG:'XAF',CM:'XAF',CF:'XAF',TD:'XAF',SN:'XOF',ML:'XOF',BF:'XOF',NE:'XOF',GN:'GNF',CI:'XOF',GW:'XOF',TG:'XOF',BJ:'XOF',GM:'GMD',SL:'SLL',LR:'LRD',SS:'SSP',
  MX:'MXN',BR:'BRL',AR:'ARS',CL:'CLP',CO:'COP',PE:'PEN',VE:'VES',BO:'BOB',PY:'PYG',UY:'UYU',EC:'USD',GY:'GYD',SR:'SRD',GF:'EUR',FK:'FKP',GT:'GTQ',BZ:'BZD',HN:'HNL',SV:'USD',NI:'NIO',CR:'CRC',PA:'PAB',CU:'CUP',DO:'DOP',HT:'HTG',JM:'JMD',TT:'TTD',BB:'BBD',GD:'XCD',LC:'XCD',VC:'XCD',AG:'XCD',DM:'XCD',KN:'XCD',BS:'BSD',TC:'USD',KY:'KYD',BM:'BMD',PR:'USD',
  FJ:'FJD',PG:'PGK',SB:'SBD',VU:'VUV',WS:'WST',TO:'TOP',KI:'AUD',NR:'AUD',TV:'AUD',PF:'XPF',NC:'XPF',GU:'USD',PW:'USD',FM:'USD',MH:'USD',
}

export function getCurrencyForCountry(countryCode: string): string {
  return COUNTRY_CURRENCY_MAP[countryCode.toUpperCase()] ?? 'USD'
}
export function getAllCurrencyCodes(): string[] { return Object.keys(CURRENCIES).sort() }
export function getAllCurrencies(): CurrencyConfig[] { return Object.values(CURRENCIES).sort((a,b)=>a.name.localeCompare(b.name)) }
export function getCurrency(code: string): CurrencyConfig {
  const config = CURRENCIES[code]; if (!config) throw new Error(`Currency not found: ${code}`); return config
}
export function roundForCurrency(amount: number, currencyCode: string): number {
  const d = getDecimals(currencyCode); return Math.round(amount * Math.pow(10,d)) / Math.pow(10,d)
}
