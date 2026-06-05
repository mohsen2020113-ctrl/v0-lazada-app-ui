export interface Category {
  id: string
  name: string
  slug: string
  subcategories: Category[]
}

export const CATEGORIES: Category[] = [
  {
    id: 'fashion',
    name: 'Fashion',
    slug: 'fashion',
    subcategories: [
      { id: 'womens-clothing', name: "Women's Clothing", slug: 'womens-clothing', subcategories: [] },
      { id: 'mens-clothing', name: "Men's Clothing", slug: 'mens-clothing', subcategories: [] },
      { id: 'kids-clothing', name: "Kids' Clothing", slug: 'kids-clothing', subcategories: [] },
      { id: 'shoes', name: 'Shoes', slug: 'shoes', subcategories: [] },
      { id: 'accessories', name: 'Accessories', slug: 'accessories', subcategories: [] },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    subcategories: [
      { id: 'smartphones', name: 'Smartphones', slug: 'smartphones', subcategories: [] },
      { id: 'laptops', name: 'Laptops', slug: 'laptops', subcategories: [] },
      { id: 'tablets', name: 'Tablets', slug: 'tablets', subcategories: [] },
      { id: 'accessories-tech', name: 'Tech Accessories', slug: 'accessories-tech', subcategories: [] },
      { id: 'audio', name: 'Audio', slug: 'audio', subcategories: [] },
    ],
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    slug: 'home-garden',
    subcategories: [
      { id: 'furniture', name: 'Furniture', slug: 'furniture', subcategories: [] },
      { id: 'decor', name: 'Decor', slug: 'decor', subcategories: [] },
      { id: 'bedding', name: 'Bedding', slug: 'bedding', subcategories: [] },
      { id: 'kitchen', name: 'Kitchen', slug: 'kitchen', subcategories: [] },
      { id: 'tools', name: 'Tools', slug: 'tools', subcategories: [] },
    ],
  },
  {
    id: 'beauty-health',
    name: 'Beauty & Health',
    slug: 'beauty-health',
    subcategories: [
      { id: 'skincare', name: 'Skincare', slug: 'skincare', subcategories: [] },
      { id: 'cosmetics', name: 'Cosmetics', slug: 'cosmetics', subcategories: [] },
      { id: 'haircare', name: 'Haircare', slug: 'haircare', subcategories: [] },
      { id: 'supplements', name: 'Supplements', slug: 'supplements', subcategories: [] },
      { id: 'wellness', name: 'Wellness', slug: 'wellness', subcategories: [] },
    ],
  },
  {
    id: 'sports-outdoors',
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    subcategories: [
      { id: 'sports-equipment', name: 'Sports Equipment', slug: 'sports-equipment', subcategories: [] },
      { id: 'outdoor-gear', name: 'Outdoor Gear', slug: 'outdoor-gear', subcategories: [] },
      { id: 'fitness', name: 'Fitness', slug: 'fitness', subcategories: [] },
      { id: 'camping', name: 'Camping', slug: 'camping', subcategories: [] },
      { id: 'cycling', name: 'Cycling', slug: 'cycling', subcategories: [] },
    ],
  },
  {
    id: 'toys-games',
    name: 'Toys & Games',
    slug: 'toys-games',
    subcategories: [
      { id: 'toys', name: 'Toys', slug: 'toys', subcategories: [] },
      { id: 'board-games', name: 'Board Games', slug: 'board-games', subcategories: [] },
      { id: 'action-figures', name: 'Action Figures', slug: 'action-figures', subcategories: [] },
      { id: 'building-blocks', name: 'Building Blocks', slug: 'building-blocks', subcategories: [] },
      { id: 'puzzles', name: 'Puzzles', slug: 'puzzles', subcategories: [] },
    ],
  },
  {
    id: 'books-media',
    name: 'Books & Media',
    slug: 'books-media',
    subcategories: [
      { id: 'books', name: 'Books', slug: 'books', subcategories: [] },
      { id: 'ebooks', name: 'Ebooks', slug: 'ebooks', subcategories: [] },
      { id: 'movies', name: 'Movies', slug: 'movies', subcategories: [] },
      { id: 'music', name: 'Music', slug: 'music', subcategories: [] },
      { id: 'magazines', name: 'Magazines', slug: 'magazines', subcategories: [] },
    ],
  },
  {
    id: 'pet-supplies',
    name: 'Pet Supplies',
    slug: 'pet-supplies',
    subcategories: [
      { id: 'dog-supplies', name: 'Dog Supplies', slug: 'dog-supplies', subcategories: [] },
      { id: 'cat-supplies', name: 'Cat Supplies', slug: 'cat-supplies', subcategories: [] },
      { id: 'pet-food', name: 'Pet Food', slug: 'pet-food', subcategories: [] },
      { id: 'pet-furniture', name: 'Pet Furniture', slug: 'pet-furniture', subcategories: [] },
      { id: 'pet-toys', name: 'Pet Toys', slug: 'pet-toys', subcategories: [] },
    ],
  },
  {
    id: 'automotive',
    name: 'Automotive',
    slug: 'automotive',
    subcategories: [
      { id: 'car-accessories', name: 'Car Accessories', slug: 'car-accessories', subcategories: [] },
      { id: 'motorcycle-parts', name: 'Motorcycle Parts', slug: 'motorcycle-parts', subcategories: [] },
      { id: 'cleaning-maintenance', name: 'Cleaning & Maintenance', slug: 'cleaning-maintenance', subcategories: [] },
      { id: 'safety-equipment', name: 'Safety Equipment', slug: 'safety-equipment', subcategories: [] },
      { id: 'car-electronics', name: 'Car Electronics', slug: 'car-electronics', subcategories: [] },
    ],
  },
  {
    id: 'grocery',
    name: 'Grocery',
    slug: 'grocery',
    subcategories: [
      { id: 'fresh-produce', name: 'Fresh Produce', slug: 'fresh-produce', subcategories: [] },
      { id: 'dairy-eggs', name: 'Dairy & Eggs', slug: 'dairy-eggs', subcategories: [] },
      { id: 'meat-seafood', name: 'Meat & Seafood', slug: 'meat-seafood', subcategories: [] },
      { id: 'pantry-staples', name: 'Pantry Staples', slug: 'pantry-staples', subcategories: [] },
      { id: 'beverages', name: 'Beverages', slug: 'beverages', subcategories: [] },
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
