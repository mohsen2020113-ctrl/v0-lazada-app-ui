// Static translations for key UI strings in 4 languages
// TODO: Integrate Google Translate API for dynamic product title/description translation
// When Vip adds his Google Translate API key, call the API here for product content

export type Language = 'en' | 'ar' | 'th' | 'fr';
export type Currency = 'AED' | 'SAR' | 'USD' | 'EUR' ;

// Exchange rates relative to AED (base currency)
export const exchangeRates: Record<Currency, number> = {
  AED: 1,
  SAR: 1.02,
  USD: 0.27,
  EUR: 0.25,
};

// Currency symbols and formatting
export const currencyConfig: Record<Currency, { symbol: string; position: 'before' | 'after' }> = {
  AED: { symbol: 'AED', position: 'before' },
  SAR: { symbol: 'SAR', position: 'before' },
  USD: { symbol: '$', position: 'before' },
  EUR: { symbol: '€', position: 'before' },
};

// Language configuration
export const languageConfig: Record<Language, { name: string; nativeName: string; flag: string; rtl: boolean }> = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  th: { name: 'Thai', nativeName: 'ภาษาไทย', flag: '🇹🇭', rtl: false },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
};

// Translation dictionary
const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.home': { en: 'Home', ar: 'الرئيسية', th: 'หน้าแรก', fr: 'Accueil' },
  'nav.cart': { en: 'Cart', ar: 'السلة', th: 'ตะกร้า', fr: 'Panier' },
  'nav.account': { en: 'Account', ar: 'الحساب', th: 'บัญชี', fr: 'Compte' },
  'nav.fashion': { en: 'Fashion', ar: 'أزياء', th: 'แฟชั่น', fr: 'Mode' },
  'nav.messages': { en: 'Messages', ar: 'الرسائل', th: 'ข้อความ', fr: 'Messages' },
  
  // Actions
  'action.addToCart': { en: 'Add to Cart', ar: 'أضف إلى السلة', th: 'เพิ่มลงตะกร้า', fr: 'Ajouter au panier' },
  'action.buyNow': { en: 'Buy Now', ar: 'اشتري الآن', th: 'ซื้อเลย', fr: 'Acheter maintenant' },
  'action.search': { en: 'Search', ar: 'بحث', th: 'ค้นหา', fr: 'Rechercher' },
  'action.checkout': { en: 'Checkout', ar: 'إتمام الشراء', th: 'ชำระเงิน', fr: 'Passer la commande' },
  'action.continueShopping': { en: 'Continue Shopping', ar: 'متابعة التسوق', th: 'ช้อปต่อ', fr: 'Continuer les achats' },
  'action.back': { en: 'Back', ar: 'رجوع', th: 'กลับ', fr: 'Retour' },
  'action.viewAll': { en: 'View All', ar: 'عرض الكل', th: 'ดูทั้งหมด', fr: 'Voir tout' },
  'action.shopNow': { en: 'Shop Now', ar: 'تسوق الآن', th: 'ช้อปเลย', fr: 'Acheter maintenant' },
  'action.remove': { en: 'Remove', ar: 'إزالة', th: 'ลบ', fr: 'Supprimer' },
  'action.loadMore': { en: 'Load More', ar: 'تحميل المزيد', th: 'โหลดเพิ่ม', fr: 'Charger plus' },
  'action.seeAll': { en: 'See All', ar: 'عرض الكل', th: 'ดูทั้งหมด', fr: 'Voir tout' },
  
  // Product
  'product.price': { en: 'Price', ar: 'السعر', th: 'ราคา', fr: 'Prix' },
  'product.quantity': { en: 'Quantity', ar: 'الكمية', th: 'จำนวน', fr: 'Quantité' },
  'product.inStock': { en: 'In Stock', ar: 'متوفر', th: 'มีสินค้า', fr: 'En stock' },
  'product.outOfStock': { en: 'Out of Stock', ar: 'غير متوفر', th: 'สินค้าหมด', fr: 'Rupture de stock' },
  'product.onlyXLeft': { en: 'Only {x} left!', ar: 'باقي {x} فقط!', th: 'เหลือเพียง {x} ชิ้น!', fr: 'Plus que {x} en stock!' },
  'product.freeShipping': { en: 'Free Shipping', ar: 'شحن مجاني', th: 'ส่งฟรี', fr: 'Livraison gratuite' },
  'product.sold': { en: 'sold', ar: 'مباع', th: 'ขายแล้ว', fr: 'vendu' },
  'product.reviews': { en: 'reviews', ar: 'تقييمات', th: 'รีวิว', fr: 'avis' },
  
  // Sales & Promotions
  'promo.flashSale': { en: 'Flash Sale', ar: 'تخفيضات سريعة', th: 'Flash Sale', fr: 'Vente Flash' },
  'promo.paydaySale': { en: 'Payday Sale', ar: 'تخفيضات الراتب', th: 'Payday Sale', fr: 'Soldes de paie' },
  'promo.off': { en: 'OFF', ar: 'خصم', th: 'ลด', fr: 'DE RÉDUCTION' },
  'promo.upTo': { en: 'Up to', ar: 'حتى', th: 'สูงสุด', fr: "Jusqu'à" },
  'promo.ourProducts': { en: 'Our Products', ar: 'منتجاتنا', th: 'สินค้าของเรา', fr: 'Nos produits' },
  'promo.dailyDeals': { en: 'Daily Deals', ar: 'عروض يومية', th: 'ดีลประจำวัน', fr: 'Offres du jour' },
  'promo.justForYou': { en: 'Just For You', ar: 'خصيصاً لك', th: 'สำหรับคุณ', fr: 'Rien que pour vous' },
  
  // Cart
  'cart.empty': { en: 'Your cart is empty', ar: 'سلتك فارغة', th: 'ตะกร้าว่างเปล่า', fr: 'Votre panier est vide' },
  'cart.subtotal': { en: 'Subtotal', ar: 'المجموع الفرعي', th: 'ยอดรวม', fr: 'Sous-total' },
  'cart.total': { en: 'Total', ar: 'الإجمالي', th: 'รวมทั้งหมด', fr: 'Total' },
  'cart.items': { en: 'items', ar: 'منتجات', th: 'ชิ้น', fr: 'articles' },
  'cart.shipping': { en: 'Shipping', ar: 'الشحن', th: 'ค่าจัดส่ง', fr: 'Livraison' },
  
  // Status
  'status.loading': { en: 'Loading...', ar: 'جاري التحميل...', th: 'กำลังโหลด...', fr: 'Chargement...' },
  'status.noResults': { en: 'No results found', ar: 'لا توجد نتائج', th: 'ไม่พบผลลัพธ์', fr: 'Aucun résultat' },
  'status.error': { en: 'Something went wrong', ar: 'حدث خطأ ما', th: 'เกิดข้อผิดพลาด', fr: 'Une erreur est survenue' },
  'status.noProducts': { en: 'No products available', ar: 'لا توجد منتجات', th: 'ไม่มีสินค้า', fr: 'Aucun produit disponible' },
  'status.allLoaded': { en: 'All products loaded', ar: 'تم تحميل كل المنتجات', th: 'โหลดสินค้าทั้งหมดแล้ว', fr: 'Tous les produits chargés' },
  
  // Search
  'search.placeholder': { en: 'Search in 4LEEE', ar: 'ابحث في 4LEEE', th: 'ค้นหาใน 4LEEE', fr: 'Rechercher dans 4LEEE' },
  'search.results': { en: 'Search Results', ar: 'نتائج البحث', th: 'ผลการค้นหา', fr: 'Résultats de recherche' },
  'search.searchingFor': { en: 'Searching for', ar: 'البحث عن', th: 'กำลังค้นหา', fr: 'Recherche de' },
  
  // Categories
  'category.all': { en: 'All', ar: 'الكل', th: 'ทั้งหมด', fr: 'Tout' },
  'category.electronics': { en: 'Electronics', ar: 'إلكترونيات', th: 'อิเล็กทรอนิกส์', fr: 'Électronique' },
  'category.fashion': { en: 'Fashion', ar: 'أزياء', th: 'แฟชั่น', fr: 'Mode' },
  'category.beauty': { en: 'Beauty', ar: 'الجمال', th: 'ความงาม', fr: 'Beauté' },
  'category.home': { en: 'Home', ar: 'المنزل', th: 'บ้าน', fr: 'Maison' },
  
  // Settings
  'settings.language': { en: 'Language', ar: 'اللغة', th: 'ภาษา', fr: 'Langue' },
  'settings.currency': { en: 'Currency', ar: 'العملة', th: 'สกุลเงิน', fr: 'Devise' },
  'settings.selectLanguage': { en: 'Select Language', ar: 'اختر اللغة', th: 'เลือกภาษา', fr: 'Choisir la langue' },
  'settings.selectCurrency': { en: 'Select Currency', ar: 'اختر العملة', th: 'เลือกสกุลเงิน', fr: 'Choisir la devise' },
  
  // 4LEEE Brand
  '4leee.brand': { en: '4LEEE', ar: '4LEEE', th: '4LEEE', fr: '4LEEE' },
  '4leee.tagline': { en: 'Your Ultimate Shopping Destination', ar: 'وجهتك النهائية للتسوق', th: 'ปลายทางการช้อปของคุณ', fr: 'Votre destination shopping ultime' },
  '4leee.wallet': { en: '4LEEE Wallet', ar: 'محفظة 4LEEE', th: 'กระเป๋า 4LEEE', fr: 'Portefeuille 4LEEE' },
  '4leee.assistant': { en: '4LEEE Assistant', ar: 'مساعد 4LEEE', th: 'ผู้ช่วย 4LEEE', fr: 'Assistant 4LEEE' },
  '4leee.store': { en: 'Open shop on 4LEEE', ar: 'افتح متجرك على 4LEEE', th: 'เปิดร้านค้าบน 4LEEE', fr: 'Ouvrir un magasin sur 4LEEE' },
  '4leee.rewards': { en: '4LEEE Rewards', ar: 'مكافآت 4LEEE', th: 'รางวัล 4LEEE', fr: 'Récompenses 4LEEE' },
  '4leee.flash': { en: '4Flash', ar: '4Flash', th: '4Flash', fr: '4Flash' },
  '4leee.land': { en: '4Land', ar: '4Land', th: '4Land', fr: '4Land' },
  
  // Account
  'account.myOrders': { en: 'My Orders', ar: 'طلباتي', th: 'คำสั่งซื้อของฉัน', fr: 'Mes commandes' },
  'account.myWallet': { en: 'My Wallet', ar: 'محفظتي', th: 'กระเป๋าของฉัน', fr: 'Mon portefeuille' },
  'account.myGames': { en: 'My Games', ar: 'ألعابي', th: 'เกมของฉัน', fr: 'Mes jeux' },
  'account.wishlist': { en: 'Wishlist', ar: 'قائمة الرغبات', th: 'รายการที่ชอบ', fr: 'Liste de souhaits' },
  'account.reviews': { en: 'My Reviews', ar: 'تقييماتي', th: 'รีวิวของฉัน', fr: 'Mes avis' },
  'account.chat': { en: 'Chat with Customer Care', ar: 'الدردشة مع خدمة العملاء', th: 'แชทกับบริการลูกค้า', fr: 'Discuter avec le service client' },
  'account.billing': { en: 'Bill Payment & Top Up', ar: 'دفع الفواتير والشحن', th: 'ชำระบิลและเติมเงิน', fr: 'Paiement de factures et rechargement' },
  'account.followed': { en: 'Followed Stores', ar: 'المتاجر المتابعة', th: 'ร้านค้าที่ติดตาม', fr: 'Magasins suivis' },
  'account.memberships': { en: 'Memberships', ar: 'الاشتراكات', th: 'สมาชิก', fr: 'Adhésions' },
  'account.tryBuy': { en: 'Try & Buy', ar: 'جرب واشتري', th: 'ลองและซื้อ', fr: 'Essayer et acheter' },
  'account.security': { en: 'Account Security', ar: 'أمان الحساب', th: 'ความปลอดภัยของบัญชี', fr: 'Sécurité du compte' },
  'account.policies': { en: 'Policies', ar: 'السياسات', th: 'นโยบาย', fr: 'Politiques' },
  'account.help': { en: 'Help', ar: 'مساعدة', th: 'ช่วยเหลือ', fr: 'Aide' },
  'account.feedback': { en: 'Feedback', ar: 'ملاحظاتك', th: 'ความเห็น', fr: 'Avis' },
  'account.logout': { en: 'Logout', ar: 'تسجيل الخروج', th: 'ออกจากระบบ', fr: 'Déconnexion' },
};

// Main translation function
export function t(key: string, lang: Language, replacements?: Record<string, string | number>): string {
  const translation = translations[key]?.[lang] || translations[key]?.['en'] || key;
  
  if (replacements) {
    return Object.entries(replacements).reduce(
      (str, [k, v]) => str.replace(`{${k}}`, String(v)),
      translation
    );
  }
  
  return translation;
}

// Price formatting function
export function formatPrice(
  priceInAED: number,
  currency: Currency,
  rtl: boolean = false
): string {
  const convertedPrice = priceInAED * exchangeRates[currency];
  const formatted = convertedPrice.toFixed(2);
  const { symbol, position } = currencyConfig[currency];
  
  if (rtl && position === 'before') {
    return `${formatted} ${symbol}`;
  }
  
  return position === 'before' ? `${symbol} ${formatted}` : `${formatted} ${symbol}`;
}

// Convert price from AED to target currency (just the number)
export function convertPrice(priceInAED: number, currency: Currency): number {
  return priceInAED * exchangeRates[currency];
}
