export interface Category {
  id: string
  name: string
  slug: string
  subcategories: Category[]
}

export const CATEGORIES: Category[] = [
  {
    id: 'womens-fashion',
    name: "Women's Fashion",
    slug: 'womens-fashion',
    subcategories: [
      { id: 'womens-dresses', name: "Women's Dresses", slug: 'womens-dresses', subcategories: [] },
      { id: 'womens-tops', name: "Women's Tops & Blouses", slug: 'womens-tops', subcategories: [] },
      { id: 'womens-bottoms', name: "Women's Bottoms", slug: 'womens-bottoms', subcategories: [] },
      { id: 'womens-outerwear', name: "Women's Outerwear", slug: 'womens-outerwear', subcategories: [] },
      { id: 'womens-activewear', name: "Women's Activewear", slug: 'womens-activewear', subcategories: [] },
      { id: 'womens-lingerie', name: "Women's Lingerie & Sleepwear", slug: 'womens-lingerie', subcategories: [] },
      { id: 'womens-accessories', name: "Women's Accessories", slug: 'womens-accessories', subcategories: [] },
    ],
  },
  {
    id: 'mens-fashion',
    name: "Men's Fashion",
    slug: 'mens-fashion',
    subcategories: [
      { id: 'mens-shirts', name: "Men's Shirts", slug: 'mens-shirts', subcategories: [] },
      { id: 'mens-pants', name: "Men's Pants & Shorts", slug: 'mens-pants', subcategories: [] },
      { id: 'mens-outerwear', name: "Men's Outerwear", slug: 'mens-outerwear', subcategories: [] },
      { id: 'mens-activewear', name: "Men's Activewear", slug: 'mens-activewear', subcategories: [] },
      { id: 'mens-underwear', name: "Men's Underwear & Socks", slug: 'mens-underwear', subcategories: [] },
      { id: 'mens-accessories', name: "Men's Accessories", slug: 'mens-accessories', subcategories: [] },
      { id: 'mens-formal', name: "Men's Formal Wear", slug: 'mens-formal', subcategories: [] },
    ],
  },
  {
    id: 'mobiles-gadgets',
    name: 'Mobiles & Gadgets',
    slug: 'mobiles-gadgets',
    subcategories: [
      { id: 'smartphones', name: 'Smartphones', slug: 'smartphones', subcategories: [] },
      { id: 'phone-accessories', name: 'Phone Accessories', slug: 'phone-accessories', subcategories: [] },
      { id: 'smartwatches', name: 'Smartwatches', slug: 'smartwatches', subcategories: [] },
      { id: 'portable-chargers', name: 'Portable Chargers', slug: 'portable-chargers', subcategories: [] },
      { id: 'earphones-headphones', name: 'Earphones & Headphones', slug: 'earphones-headphones', subcategories: [] },
      { id: 'phone-cases', name: 'Phone Cases & Covers', slug: 'phone-cases', subcategories: [] },
      { id: 'screen-protectors', name: 'Screen Protectors', slug: 'screen-protectors', subcategories: [] },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    subcategories: [
      { id: 'laptops', name: 'Laptops', slug: 'laptops', subcategories: [] },
      { id: 'tablets', name: 'Tablets', slug: 'tablets', subcategories: [] },
      { id: 'cameras', name: 'Cameras & Photography', slug: 'cameras', subcategories: [] },
      { id: 'audio-systems', name: 'Audio Systems', slug: 'audio-systems', subcategories: [] },
      { id: 'gaming', name: 'Gaming Devices', slug: 'gaming', subcategories: [] },
      { id: 'computers', name: 'Computers & Desktops', slug: 'computers', subcategories: [] },
      { id: 'computer-accessories', name: 'Computer Accessories', slug: 'computer-accessories', subcategories: [] },
    ],
  },
  {
    id: 'home-living',
    name: 'Home & Living',
    slug: 'home-living',
    subcategories: [
      { id: 'furniture', name: 'Furniture', slug: 'furniture', subcategories: [] },
      { id: 'home-decor', name: 'Home Decor', slug: 'home-decor', subcategories: [] },
      { id: 'bedding', name: 'Bedding & Pillows', slug: 'bedding', subcategories: [] },
      { id: 'kitchen-dining', name: 'Kitchen & Dining', slug: 'kitchen-dining', subcategories: [] },
      { id: 'home-appliances', name: 'Home Appliances', slug: 'home-appliances', subcategories: [] },
      { id: 'bathroom-accessories', name: 'Bathroom Accessories', slug: 'bathroom-accessories', subcategories: [] },
      { id: 'storage-organization', name: 'Storage & Organization', slug: 'storage-organization', subcategories: [] },
    ],
  },
  {
    id: 'kids-toys',
    name: "Kids & Toys",
    slug: 'kids-toys',
    subcategories: [
      { id: 'kids-clothing', name: "Kids' Clothing", slug: 'kids-clothing', subcategories: [] },
      { id: 'toys', name: 'Toys', slug: 'toys', subcategories: [] },
      { id: 'baby-gear', name: 'Baby Gear & Nursery', slug: 'baby-gear', subcategories: [] },
      { id: 'educational-toys', name: 'Educational Toys', slug: 'educational-toys', subcategories: [] },
      { id: 'board-games', name: 'Board Games & Puzzles', slug: 'board-games', subcategories: [] },
      { id: 'sports-toys', name: 'Sports Toys & Outdoor Play', slug: 'sports-toys', subcategories: [] },
      { id: 'baby-care', name: 'Baby Care', slug: 'baby-care', subcategories: [] },
    ],
  },
  {
    id: 'health-beauty',
    name: 'Health & Beauty',
    slug: 'health-beauty',
    subcategories: [
      { id: 'skincare', name: 'Skincare', slug: 'skincare', subcategories: [] },
      { id: 'makeup', name: 'Makeup & Cosmetics', slug: 'makeup', subcategories: [] },
      { id: 'haircare', name: 'Haircare', slug: 'haircare', subcategories: [] },
      { id: 'fragrance', name: 'Fragrance', slug: 'fragrance', subcategories: [] },
      { id: 'personal-care', name: 'Personal Care', slug: 'personal-care', subcategories: [] },
      { id: 'health-supplements', name: 'Health Supplements', slug: 'health-supplements', subcategories: [] },
      { id: 'wellness', name: 'Wellness & Fitness', slug: 'wellness', subcategories: [] },
    ],
  },
  {
    id: 'food-beverages',
    name: 'Food & Beverages',
    slug: 'food-beverages',
    subcategories: [
      { id: 'fresh-produce', name: 'Fresh Produce', slug: 'fresh-produce', subcategories: [] },
      { id: 'meat-seafood', name: 'Meat & Seafood', slug: 'meat-seafood', subcategories: [] },
      { id: 'dairy-eggs', name: 'Dairy & Eggs', slug: 'dairy-eggs', subcategories: [] },
      { id: 'pantry-staples', name: 'Pantry Staples', slug: 'pantry-staples', subcategories: [] },
      { id: 'beverages', name: 'Beverages', slug: 'beverages', subcategories: [] },
      { id: 'snacks', name: 'Snacks', slug: 'snacks', subcategories: [] },
      { id: 'specialty-foods', name: 'Specialty & Imported Foods', slug: 'specialty-foods', subcategories: [] },
    ],
  },
  {
    id: 'sports-travel',
    name: 'Sports & Travel',
    slug: 'sports-travel',
    subcategories: [
      { id: 'sports-equipment', name: 'Sports Equipment', slug: 'sports-equipment', subcategories: [] },
      { id: 'outdoor-gear', name: 'Outdoor & Camping Gear', slug: 'outdoor-gear', subcategories: [] },
      { id: 'fitness-equipment', name: 'Fitness Equipment', slug: 'fitness-equipment', subcategories: [] },
      { id: 'luggage', name: 'Luggage & Travel Bags', slug: 'luggage', subcategories: [] },
      { id: 'travel-accessories', name: 'Travel Accessories', slug: 'travel-accessories', subcategories: [] },
      { id: 'sports-apparel', name: 'Sports Apparel', slug: 'sports-apparel', subcategories: [] },
      { id: 'bicycle-accessories', name: 'Bicycles & Accessories', slug: 'bicycle-accessories', subcategories: [] },
    ],
  },
  {
    id: 'automotive-industrial',
    name: 'Automotive & Industrial',
    slug: 'automotive-industrial',
    subcategories: [
      { id: 'car-accessories', name: 'Car Accessories', slug: 'car-accessories', subcategories: [] },
      { id: 'motorcycle-parts', name: 'Motorcycle Parts & Accessories', slug: 'motorcycle-parts', subcategories: [] },
      { id: 'car-care', name: 'Car Care & Cleaning', slug: 'car-care', subcategories: [] },
      { id: 'safety-equipment', name: 'Safety Equipment', slug: 'safety-equipment', subcategories: [] },
      { id: 'tools-equipment', name: 'Tools & Equipment', slug: 'tools-equipment', subcategories: [] },
      { id: 'batteries-chargers', name: 'Batteries & Chargers', slug: 'batteries-chargers', subcategories: [] },
      { id: 'vehicle-electronics', name: 'Vehicle Electronics', slug: 'vehicle-electronics', subcategories: [] },
    ],
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  for (const category of CATEGORIES) {
    if (category.slug === slug) return category
    const found = category.subcategories.find(sub => sub.slug === slug)
    if (found) return found
  }
  return undefined
}

export function getCategoryTree(slug: string): { parent: Category; current: Category } | undefined {
  for (const category of CATEGORIES) {
    if (category.slug === slug) return { parent: category, current: category }
    const found = category.subcategories.find(sub => sub.slug === slug)
    if (found) return { parent: category, current: found }
  }
  return undefined
}
