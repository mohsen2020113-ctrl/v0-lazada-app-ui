export type SupplierCountry = "CN" | "TR" | "IN" | "AE";

export interface DropshipSupplier {
  id: string;
  name: string;
  nameAr: string;
  country: SupplierCountry;
  countryFlag: string;
  countryNameAr: string;
  rating: number;
  totalProducts: number;
  processingDays: number;
  shippingDays: string;
  minOrderValue: number;
  currency: string;
  verified: boolean;
  categories: string[];
  categoriesAr: string[];
}

export interface DropshipProduct {
  id: string;
  supplierId: string;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  supplierPrice: number;
  suggestedRetailPrice: number;
  currency: string;
  stock: number;
  moq: number;
  weight: number;
  imageUrl: string;
  sku: string;
  rating: number;
  soldCount: number;
  tags: string[];
  tagsAr: string[];
}

export interface DropshipProfitResult {
  supplierPrice: number;
  retailPrice: number;
  grossProfit: number;
  grossMarginPercent: number;
  estimatedFees: number;
  netProfit: number;
  netMarginPercent: number;
  currency: string;
  isViable: boolean;
}

export const dropshipSuppliers: DropshipSupplier[] = [
  {
    id: "sup-001",
    name: "Shenzhen TechSource Co.",
    nameAr: "شركة تيك سورس شنزن",
    country: "CN",
    countryFlag: "🇨🇳",
    countryNameAr: "الصين",
    rating: 4.8,
    totalProducts: 3200,
    processingDays: 2,
    shippingDays: "5-8",
    minOrderValue: 0,
    currency: "USD",
    verified: true,
    categories: ["Electronics", "Gadgets", "Smart Home"],
    categoriesAr: ["إلكترونيات", "أجهزة ذكية", "المنزل الذكي"],
  },
  {
    id: "sup-002",
    name: "Guangzhou Fashion Hub",
    nameAr: "مركز أزياء غوانغتشو",
    country: "CN",
    countryFlag: "🇨🇳",
    countryNameAr: "الصين",
    rating: 4.5,
    totalProducts: 5800,
    processingDays: 1,
    shippingDays: "6-10",
    minOrderValue: 0,
    currency: "USD",
    verified: true,
    categories: ["Apparel", "Accessories", "Bags"],
    categoriesAr: ["ملابس", "إكسسوارات", "حقائب"],
  },
  {
    id: "sup-003",
    name: "Istanbul Textile Masters",
    nameAr: "أساتذة النسيج في إسطنبول",
    country: "TR",
    countryFlag: "🇹🇷",
    countryNameAr: "تركيا",
    rating: 4.7,
    totalProducts: 1400,
    processingDays: 3,
    shippingDays: "4-7",
    minOrderValue: 50,
    currency: "USD",
    verified: true,
    categories: ["Apparel", "Home Textiles", "Curtains"],
    categoriesAr: ["ملابس", "مفارش المنزل", "ستائر"],
  },
  {
    id: "sup-004",
    name: "Mumbai Spice & Beauty",
    nameAr: "جمال ومستلزمات مومباي",
    country: "IN",
    countryFlag: "🇮🇳",
    countryNameAr: "الهند",
    rating: 4.3,
    totalProducts: 920,
    processingDays: 2,
    shippingDays: "7-12",
    minOrderValue: 0,
    currency: "USD",
    verified: false,
    categories: ["Beauty", "Wellness", "Organic"],
    categoriesAr: ["جمال", "صحة وعناية", "منتجات طبيعية"],
  },
  {
    id: "sup-005",
    name: "Dubai Luxury Wholesale",
    nameAr: "تجارة دبي للجملة الفاخرة",
    country: "AE",
    countryFlag: "🇦🇪",
    countryNameAr: "الإمارات",
    rating: 4.9,
    totalProducts: 380,
    processingDays: 1,
    shippingDays: "1-3",
    minOrderValue: 200,
    currency: "AED",
    verified: true,
    categories: ["Luxury", "Perfumes", "Gifts"],
    categoriesAr: ["منتجات فاخرة", "عطور", "هدايا"],
  },
];

export const dropshipProducts: DropshipProduct[] = [
  // Shenzhen TechSource
  {
    id: "prod-001",
    supplierId: "sup-001",
    name: "Wireless Earbuds Pro X5",
    nameAr: "سماعات لاسلكية برو X5",
    category: "Electronics",
    categoryAr: "إلكترونيات",
    supplierPrice: 12.5,
    suggestedRetailPrice: 49.99,
    currency: "USD",
    stock: 840,
    moq: 1,
    weight: 0.08,
    imageUrl: "/images/products/earbuds-x5.jpg",
    sku: "TECH-EAR-001",
    rating: 4.7,
    soldCount: 3200,
    tags: ["wireless", "bluetooth", "audio"],
    tagsAr: ["لاسلكي", "بلوتوث", "صوت"],
  },
  {
    id: "prod-002",
    supplierId: "sup-001",
    name: "Smart Watch Series 8 Clone",
    nameAr: "ساعة ذكية سيريز 8",
    category: "Gadgets",
    categoryAr: "أجهزة ذكية",
    supplierPrice: 18.0,
    suggestedRetailPrice: 75.0,
    currency: "USD",
    stock: 430,
    moq: 1,
    weight: 0.12,
    imageUrl: "/images/products/smartwatch-s8.jpg",
    sku: "TECH-WTCH-002",
    rating: 4.4,
    soldCount: 1850,
    tags: ["smartwatch", "fitness", "health"],
    tagsAr: ["ساعة ذكية", "لياقة", "صحة"],
  },
  {
    id: "prod-003",
    supplierId: "sup-001",
    name: "USB-C Fast Charger 65W",
    nameAr: "شاحن USB-C سريع 65 واط",
    category: "Electronics",
    categoryAr: "إلكترونيات",
    supplierPrice: 6.0,
    suggestedRetailPrice: 24.99,
    currency: "USD",
    stock: 2100,
    moq: 5,
    weight: 0.15,
    imageUrl: "/images/products/charger-65w.jpg",
    sku: "TECH-CHG-003",
    rating: 4.8,
    soldCount: 6400,
    tags: ["charger", "usb-c", "fast charging"],
    tagsAr: ["شاحن", "شحن سريع"],
  },
  // Guangzhou Fashion Hub
  {
    id: "prod-004",
    supplierId: "sup-002",
    name: "Women's Modest Abaya Set",
    nameAr: "مجموعة عباءة نسائية محتشمة",
    category: "Apparel",
    categoryAr: "ملابس",
    supplierPrice: 14.0,
    suggestedRetailPrice: 59.99,
    currency: "USD",
    stock: 560,
    moq: 1,
    weight: 0.5,
    imageUrl: "/images/products/abaya-set.jpg",
    sku: "FASH-ABA-004",
    rating: 4.6,
    soldCount: 2100,
    tags: ["modest", "abaya", "fashion"],
    tagsAr: ["عباءة", "أزياء محتشمة"],
  },
  {
    id: "prod-005",
    supplierId: "sup-002",
    name: "Leather Crossbody Bag",
    nameAr: "حقيبة جلدية كروس بودي",
    category: "Bags",
    categoryAr: "حقائب",
    supplierPrice: 9.5,
    suggestedRetailPrice: 39.99,
    currency: "USD",
    stock: 780,
    moq: 1,
    weight: 0.4,
    imageUrl: "/images/products/crossbody-bag.jpg",
    sku: "FASH-BAG-005",
    rating: 4.5,
    soldCount: 3800,
    tags: ["bag", "leather", "fashion"],
    tagsAr: ["حقيبة", "جلد"],
  },
  {
    id: "prod-006",
    supplierId: "sup-002",
    name: "Men's Casual Linen Shirt",
    nameAr: "قميص كتاني كاجوال رجالي",
    category: "Apparel",
    categoryAr: "ملابس",
    supplierPrice: 7.0,
    suggestedRetailPrice: 29.99,
    currency: "USD",
    stock: 1200,
    moq: 2,
    weight: 0.25,
    imageUrl: "/images/products/linen-shirt.jpg",
    sku: "FASH-SHRT-006",
    rating: 4.3,
    soldCount: 2900,
    tags: ["shirt", "linen", "men"],
    tagsAr: ["قميص", "رجالي", "كتان"],
  },
  // Istanbul Textile
  {
    id: "prod-007",
    supplierId: "sup-003",
    name: "Premium Cotton Bedding Set",
    nameAr: "طقم سرير قطن فاخر",
    category: "Home Textiles",
    categoryAr: "مفارش المنزل",
    supplierPrice: 28.0,
    suggestedRetailPrice: 99.99,
    currency: "USD",
    stock: 220,
    moq: 1,
    weight: 2.0,
    imageUrl: "/images/products/bedding-set.jpg",
    sku: "TXTL-BED-007",
    rating: 4.9,
    soldCount: 870,
    tags: ["bedding", "cotton", "premium"],
    tagsAr: ["أغطية سرير", "قطن", "فاخر"],
  },
  {
    id: "prod-008",
    supplierId: "sup-003",
    name: "Embroidered Table Runner",
    nameAr: "مفرش طاولة مطرز",
    category: "Home Textiles",
    categoryAr: "مفارش المنزل",
    supplierPrice: 12.0,
    suggestedRetailPrice: 44.99,
    currency: "USD",
    stock: 340,
    moq: 2,
    weight: 0.3,
    imageUrl: "/images/products/table-runner.jpg",
    sku: "TXTL-TAB-008",
    rating: 4.7,
    soldCount: 640,
    tags: ["table", "embroidery", "decor"],
    tagsAr: ["ديكور", "تطريز", "طاولة"],
  },
  // Mumbai Beauty
  {
    id: "prod-009",
    supplierId: "sup-004",
    name: "Herbal Hair Growth Oil",
    nameAr: "زيت نمو الشعر العشبي",
    category: "Beauty",
    categoryAr: "جمال",
    supplierPrice: 4.5,
    suggestedRetailPrice: 19.99,
    currency: "USD",
    stock: 680,
    moq: 6,
    weight: 0.2,
    imageUrl: "/images/products/hair-oil.jpg",
    sku: "BEAU-HAIR-009",
    rating: 4.2,
    soldCount: 4100,
    tags: ["hair", "natural", "organic"],
    tagsAr: ["شعر", "طبيعي", "عضوي"],
  },
  {
    id: "prod-010",
    supplierId: "sup-004",
    name: "Turmeric Face Mask Pack",
    nameAr: "قناع وجه بالكركم",
    category: "Beauty",
    categoryAr: "جمال",
    supplierPrice: 3.0,
    suggestedRetailPrice: 14.99,
    currency: "USD",
    stock: 920,
    moq: 10,
    weight: 0.1,
    imageUrl: "/images/products/turmeric-mask.jpg",
    sku: "BEAU-MASK-010",
    rating: 4.4,
    soldCount: 2800,
    tags: ["face mask", "turmeric", "skincare"],
    tagsAr: ["ماسك", "كركم", "بشرة"],
  },
  // Dubai Luxury
  {
    id: "prod-011",
    supplierId: "sup-005",
    name: "Oud Al Malaki Perfume 100ml",
    nameAr: "عطر عود الملكي 100مل",
    category: "Perfumes",
    categoryAr: "عطور",
    supplierPrice: 85.0,
    suggestedRetailPrice: 280.0,
    currency: "AED",
    stock: 45,
    moq: 1,
    weight: 0.35,
    imageUrl: "/images/products/oud-perfume.jpg",
    sku: "LUX-PERF-011",
    rating: 4.9,
    soldCount: 320,
    tags: ["oud", "perfume", "luxury", "arabic"],
    tagsAr: ["عود", "عطر", "فاخر", "عربي"],
  },
  {
    id: "prod-012",
    supplierId: "sup-005",
    name: "Luxury Gift Box Set",
    nameAr: "مجموعة صندوق هدايا فاخر",
    category: "Gifts",
    categoryAr: "هدايا",
    supplierPrice: 120.0,
    suggestedRetailPrice: 399.0,
    currency: "AED",
    stock: 28,
    moq: 1,
    weight: 1.2,
    imageUrl: "/images/products/gift-box.jpg",
    sku: "LUX-GIFT-012",
    rating: 4.8,
    soldCount: 180,
    tags: ["gift", "luxury", "premium"],
    tagsAr: ["هدية", "فاخر", "مميز"],
  },
  {
    id: "prod-013",
    supplierId: "sup-001",
    name: "Portable Power Bank 20000mAh",
    nameAr: "بطارية محمولة 20000 مللي أمبير",
    category: "Electronics",
    categoryAr: "إلكترونيات",
    supplierPrice: 15.0,
    suggestedRetailPrice: 54.99,
    currency: "USD",
    stock: 650,
    moq: 1,
    weight: 0.45,
    imageUrl: "/images/products/powerbank.jpg",
    sku: "TECH-PWR-013",
    rating: 4.6,
    soldCount: 2300,
    tags: ["power bank", "charging", "portable"],
    tagsAr: ["بطارية", "شحن", "محمول"],
  },
  {
    id: "prod-014",
    supplierId: "sup-003",
    name: "Turkish Bath Towel Set",
    nameAr: "طقم مناشف حمام تركية",
    category: "Home Textiles",
    categoryAr: "مفارش المنزل",
    supplierPrice: 18.0,
    suggestedRetailPrice: 64.99,
    currency: "USD",
    stock: 190,
    moq: 2,
    weight: 1.2,
    imageUrl: "/images/products/towel-set.jpg",
    sku: "TXTL-TWL-014",
    rating: 4.8,
    soldCount: 1120,
    tags: ["towel", "turkish", "bathroom"],
    tagsAr: ["منشفة", "تركية", "حمام"],
  },
  {
    id: "prod-015",
    supplierId: "sup-002",
    name: "Kids Cartoon Backpack",
    nameAr: "حقيبة ظهر كرتونية للأطفال",
    category: "Bags",
    categoryAr: "حقائب",
    supplierPrice: 6.0,
    suggestedRetailPrice: 24.99,
    currency: "USD",
    stock: 1500,
    moq: 3,
    weight: 0.35,
    imageUrl: "/images/products/kids-backpack.jpg",
    sku: "FASH-KBAG-015",
    rating: 4.5,
    soldCount: 5200,
    tags: ["kids", "backpack", "school"],
    tagsAr: ["أطفال", "حقيبة ظهر", "مدرسة"],
  },
];

export function calculateDropshipProfit(
  product: DropshipProduct,
  sellingPrice?: number,
  platformFeePercent: number = 5,
): DropshipProfitResult {
  const retail = sellingPrice ?? product.suggestedRetailPrice;
  const supplier = product.supplierPrice;  const shippingCost = 0; // not tracked in product data
  const grossProfit = retail - supplier - shippingCost;
  const grossMarginPercent = (grossProfit / retail) * 100;
  const estimatedFees = retail * (platformFeePercent / 100);
  const netProfit = grossProfit - estimatedFees;
  const netMarginPercent = (netProfit / retail) * 100;

  return {
    supplierPrice: supplier,
    retailPrice: retail,
    grossProfit: Math.round(grossProfit * 100) / 100,
    grossMarginPercent: Math.round(grossMarginPercent * 10) / 10,
    estimatedFees: Math.round(estimatedFees * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    netMarginPercent: Math.round(netMarginPercent * 10) / 10,
    currency: product.currency,
    isViable: netMarginPercent >= 20,
  };
}
