// Static translations for key UI strings in 4 languages
// TODO: Integrate Google Translate API for dynamic product title/description translation
// When Vip adds his Google Translate API key, call the API here for product content

export type Language = 'en' | 'ar' | 'ur' | 'fr';
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
  ur: { name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
};

// Translation dictionary
const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.home': { en: 'Home', ar: 'الرئيسية', ur: 'หน้าแรก', fr: 'Accueil' },
  'nav.cart': { en: 'Cart', ar: 'السلة', ur: 'ตะกร้า', fr: 'Panier' },
  'nav.account': { en: 'Account', ar: 'الحساب', ur: 'บัญชี', fr: 'Compte' },
  'nav.fashion': { en: 'Fashion', ar: 'أزياء', ur: 'แฟชั่น', fr: 'Mode' },
  'nav.messages': { en: 'Messages', ar: 'الرسائل', ur: 'ข้อความ', fr: 'Messages' },
  
  // Actions
  'action.addToCart': { en: 'Add to Cart', ar: 'أضف إلى السلة', ur: 'เพิ่มลงตะกร้า', fr: 'Ajouter au panier' },
  'action.buyNow': { en: 'Buy Now', ar: 'اشتري الآن', ur: 'ซื้อเลย', fr: 'Acheter maintenant' },
  'action.search': { en: 'Search', ar: 'بحث', ur: 'ค้นหา', fr: 'Rechercher' },
  'action.checkout': { en: 'Checkout', ar: 'إتمام الشراء', ur: 'ชำระเงิน', fr: 'Passer la commande' },
  'action.continueShopping': { en: 'Continue Shopping', ar: 'متابعة التسوق', ur: 'ช้อปต่อ', fr: 'Continuer les achats' },
  'action.back': { en: 'Back', ar: 'رجوع', ur: 'กลับ', fr: 'Retour' },
  'action.viewAll': { en: 'View All', ar: 'عرض الكل', ur: 'ดูทั้งหมด', fr: 'Voir tout' },
  'action.shopNow': { en: 'Shop Now', ar: 'تسوق الآن', ur: 'ช้อปเลย', fr: 'Acheter maintenant' },
  'action.remove': { en: 'Remove', ar: 'إزالة', ur: 'ลบ', fr: 'Supprimer' },
  'action.loadMore': { en: 'Load More', ar: 'تحميل المزيد', ur: 'โหลดเพิ่ม', fr: 'Charger plus' },
  'action.seeAll': { en: 'See All', ar: 'عرض الكل', ur: 'ดูทั้งหมด', fr: 'Voir tout' },
  
  // Product
  'product.price': { en: 'Price', ar: 'السعر', ur: 'ราคา', fr: 'Prix' },
  'product.quantity': { en: 'Quantity', ar: 'الكمية', ur: 'จำนวน', fr: 'Quantité' },
  'product.inStock': { en: 'In Stock', ar: 'متوفر', ur: 'มีสินค้า', fr: 'En stock' },
  'product.outOfStock': { en: 'Out of Stock', ar: 'غير متوفر', ur: 'สินค้าหมด', fr: 'Rupture de stock' },
  'product.onlyXLeft': { en: 'Only {x} left!', ar: 'باقي {x} فقط!', ur: 'เหลือเพียง {x} ชิ้น!', fr: 'Plus que {x} en stock!' },
  'product.freeShipping': { en: 'Free Shipping', ar: 'شحن مجاني', ur: 'ส่งฟรี', fr: 'Livraison gratuite' },
  'product.sold': { en: 'sold', ar: 'مباع', ur: 'ขายแล้ว', fr: 'vendu' },
  'product.reviews': { en: 'reviews', ar: 'تقييمات', ur: 'รีวิว', fr: 'avis' },
  
  // Sales & Promotions
  'promo.flashSale': { en: 'Flash Sale', ar: 'تخفيضات سريعة', ur: 'Flash Sale', fr: 'Vente Flash' },
  'promo.paydaySale': { en: 'Payday Sale', ar: 'تخفيضات الراتب', ur: 'Payday Sale', fr: 'Soldes de paie' },
  'promo.off': { en: 'OFF', ar: 'خصم', ur: 'ลด', fr: 'DE RÉDUCTION' },
  'promo.upTo': { en: 'Up to', ar: 'حتى', ur: 'สูงสุด', fr: "Jusqu'à" },
  'promo.ourProducts': { en: 'Our Products', ar: 'منتجاتنا', ur: 'สินค้าของเรา', fr: 'Nos produits' },
  'promo.dailyDeals': { en: 'Daily Deals', ar: 'عروض يومية', ur: 'ดีลประจำวัน', fr: 'Offres du jour' },
  'promo.justForYou': { en: 'Just For You', ar: 'خصيصاً لك', ur: 'สำหรับคุณ', fr: 'Rien que pour vous' },
  
  // Cart
  'cart.empty': { en: 'Your cart is empty', ar: 'سلتك فارغة', ur: 'ตะกร้าว่างเปล่า', fr: 'Votre panier est vide' },
  'cart.subtotal': { en: 'Subtotal', ar: 'المجموع الفرعي', ur: 'ยอดรวม', fr: 'Sous-total' },
  'cart.total': { en: 'Total', ar: 'الإجمالي', ur: 'รวมทั้งหมด', fr: 'Total' },
  'cart.items': { en: 'items', ar: 'منتجات', ur: 'ชิ้น', fr: 'articles' },
  'cart.shipping': { en: 'Shipping', ar: 'الشحن', ur: 'ค่าจัดส่ง', fr: 'Livraison' },
  
  // Status
  'status.loading': { en: 'Loading...', ar: 'جاري التحميل...', ur: 'กำลังโหลด...', fr: 'Chargement...' },
  'status.noResults': { en: 'No results found', ar: 'لا توجد نتائج', ur: 'ไม่พบผลลัพธ์', fr: 'Aucun résultat' },
  'status.error': { en: 'Something went wrong', ar: 'حدث خطأ ما', ur: 'เกิดข้อผิดพลาด', fr: 'Une erreur est survenue' },
  'status.noProducts': { en: 'No products available', ar: 'لا توجد منتجات', ur: 'ไม่มีสินค้า', fr: 'Aucun produit disponible' },
  'status.allLoaded': { en: 'All products loaded', ar: 'تم تحميل كل المنتجات', ur: 'โหลดสินค้าทั้งหมดแล้ว', fr: 'Tous les produits chargés' },
  
  // Search
  'search.placeholder': { en: 'Search in 4LEEE', ar: 'ابحث في 4LEEE', ur: 'ค้นหาใน 4LEEE', fr: 'Rechercher dans 4LEEE' },
  'search.results': { en: 'Search Results', ar: 'نتائج البحث', ur: 'ผลการค้นหา', fr: 'Résultats de recherche' },
  'search.searchingFor': { en: 'Searching for', ar: 'البحث عن', ur: 'กำลังค้นหา', fr: 'Recherche de' },
  
  // Categories
  'category.all': { en: 'All', ar: 'الكل', ur: 'ทั้งหมด', fr: 'Tout' },
  'category.electronics': { en: 'Electronics', ar: 'إلكترونيات', ur: 'อิเล็กทรอนิกส์', fr: 'Électronique' },
  'category.fashion': { en: 'Fashion', ar: 'أزياء', ur: 'แฟชั่น', fr: 'Mode' },
  'category.beauty': { en: 'Beauty', ar: 'الجمال', ur: 'ความงาม', fr: 'Beauté' },
  'category.home': { en: 'Home', ar: 'المنزل', ur: 'บ้าน', fr: 'Maison' },
  
  // Settings
  'settings.language': { en: 'Language', ar: 'اللغة', ur: 'ภาษา', fr: 'Langue' },
  'settings.currency': { en: 'Currency', ar: 'العملة', ur: 'สกุลเงิน', fr: 'Devise' },
  'settings.selectLanguage': { en: 'Select Language', ar: 'اختر اللغة', ur: 'เลือกภาษา', fr: 'Choisir la langue' },
  'settings.selectCurrency': { en: 'Select Currency', ar: 'اختر العملة', ur: 'เลือกสกุลเงิน', fr: 'Choisir la devise' },
  
  // 4LEEE Brand
  '4leee.brand': { en: '4LEEE', ar: '4LEEE', ur: '4LEEE', fr: '4LEEE' },
  '4leee.tagline': { en: 'Your Ultimate Shopping Destination', ar: 'وجهتك النهائية للتسوق', ur: 'ปลายทางการช้อปของคุณ', fr: 'Votre destination shopping ultime' },
  '4leee.wallet': { en: '4LEEE Wallet', ar: 'محفظة 4LEEE', ur: 'กระเป๋า 4LEEE', fr: 'Portefeuille 4LEEE' },
  '4leee.assistant': { en: '4LEEE Assistant', ar: 'مساعد 4LEEE', ur: 'ผู้ช่วย 4LEEE', fr: 'Assistant 4LEEE' },
  '4leee.store': { en: 'Open shop on 4LEEE', ar: 'افتح متجرك على 4LEEE', ur: 'เปิดร้านค้าบน 4LEEE', fr: 'Ouvrir un magasin sur 4LEEE' },
  '4leee.rewards': { en: '4LEEE Rewards', ar: 'مكافآت 4LEEE', ur: 'รางวัล 4LEEE', fr: 'Récompenses 4LEEE' },
  '4leee.flash': { en: '4Flash', ar: '4Flash', ur: '4Flash', fr: '4Flash' },
  '4leee.land': { en: '4Land', ar: '4Land', ur: '4Land', fr: '4Land' },
  
  // Account
  'account.myOrders': { en: 'My Orders', ar: 'طلباتي', ur: 'คำสั่งซื้อของฉัน', fr: 'Mes commandes' },
  'account.myWallet': { en: 'My Wallet', ar: 'محفظتي', ur: 'กระเป๋าของฉัน', fr: 'Mon portefeuille' },
  'account.myGames': { en: 'My Games', ar: 'ألعابي', ur: 'เกมของฉัน', fr: 'Mes jeux' },
  'account.wishlist': { en: 'Wishlist', ar: 'قائمة الرغبات', ur: 'รายการที่ชอบ', fr: 'Liste de souhaits' },
  'account.reviews': { en: 'My Reviews', ar: 'تقييماتي', ur: 'รีวิวของฉัน', fr: 'Mes avis' },
  'account.chat': { en: 'Chat with Customer Care', ar: 'الدردشة مع خدمة العملاء', ur: 'แชทกับบริการลูกค้า', fr: 'Discuter avec le service client' },
  'account.billing': { en: 'Bill Payment & Top Up', ar: 'دفع الفواتير والشحن', ur: 'ชำระบิลและเติมเงิน', fr: 'Paiement de factures et rechargement' },
  'account.followed': { en: 'Followed Stores', ar: 'المتاجر المتابعة', ur: 'ร้านค้าที่ติดตาม', fr: 'Magasins suivis' },
  'account.memberships': { en: 'Memberships', ar: 'الاشتراكات', ur: 'สมาชิก', fr: 'Adhésions' },
  'account.tryBuy': { en: 'Try & Buy', ar: 'جرب واشتري', ur: 'ลองและซื้อ', fr: 'Essayer et acheter' },
  'account.security': { en: 'Account Security', ar: 'أمان الحساب', ur: 'ความปลอดภัยของบัญชี', fr: 'Sécurité du compte' },
  'account.policies': { en: 'Policies', ar: 'السياسات', ur: 'นโยบาย', fr: 'Politiques' },
  'account.help': { en: 'Help', ar: 'مساعدة', ur: 'ช่วยเหลือ', fr: 'Aide' },
  'account.feedback': { en: 'Feedback', ar: 'ملاحظاتك', ur: 'ความเห็น', fr: 'Avis' },
  'account.logout': { en: 'Logout', ar: 'تسجيل الخروج', ur: 'ออกจากระบบ', fr: 'Déconnexion' },
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
