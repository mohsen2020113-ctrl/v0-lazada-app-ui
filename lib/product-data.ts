// Mock product data
export interface Review {
  id: string
  author: string
  rating: number
  text: string
  images?: string[]
  videos?: string[]
  date: string
}

export interface Product {
  id: string
  handle: string
  name: string
  description: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviewCount: number
  soldCount: number
  images: string[]
  videos?: string[]
  tags: string[]
  specifications: string[]
  seller: {
    name: string
    rating: number
    reviews: number
    badge?: string
  }
  shipping: {
    method: string
    cost: number
    estimatedDays: number
    guarantee?: string
    rewards?: number
  }
  vouchers: Array<{
    discount: number
    minSpend: number
  }>
  reviews: Review[]
  similarProducts: Array<Omit<Product, 'reviews' | 'specifications'>>
}

// Mock product data
export const mockProduct: Product = {
  id: '1',
  handle: 'floor-cleaner-mop',
  name: 'Floor Cleaner Mop - 35cm Microfiber Cleaning Tool',
  description: 'Professional floor cleaning mop with microfiber pads. Perfect for all floor types including tile, wood, and laminate.',
  price: 37.90,
  originalPrice: 90.00,
  discount: 58,
  rating: 4.9,
  reviewCount: 2042,
  soldCount: 7600,
  images: [
    'https://via.placeholder.com/400x400?text=Floor+Cleaner+Mop+1',
    'https://via.placeholder.com/400x400?text=Floor+Cleaner+Mop+2',
    'https://via.placeholder.com/400x400?text=Floor+Cleaner+Mop+3',
    'https://via.placeholder.com/400x400?text=Floor+Cleaner+Mop+4',
    'https://via.placeholder.com/400x400?text=Floor+Cleaner+Mop+5',
  ],
  videos: [
    'https://via.placeholder.com/400x300?text=Product+Demo+Video+1',
    'https://via.placeholder.com/400x300?text=Product+Demo+Video+2',
  ],
  tags: ['Floor Cleaning', 'Microfiber Mop', 'Water Mop', 'Easy Cleaning', 'Flexible'],
  specifications: [
    'Size: 35cm Width',
    'Material: Microfiber + Plastic Handle',
    'Weight: 400g',
    'Color: White',
    'Type: Wet & Dry Mop',
  ],
  seller: {
    name: 'Better Home Life',
    rating: 97,
    reviews: 770600,
    badge: 'Top Seller',
  },
  shipping: {
    method: 'Priority 48H',
    cost: 29.00,
    estimatedDays: 2,
    guarantee: 'Guaranteed by 20 May',
    rewards: 30,
  },
  vouchers: [
    { discount: 30, minSpend: 49 },
    { discount: 30, minSpend: 99 },
  ],
  reviews: [
    {
      id: '1',
      author: 'Praneet P.',
      rating: 5,
      text: 'อ้อกี่หนุนได้อย่างราบรื่น เหมาะสำหรับการจัดระเบียบสิ่งของ สะดวกและใช้งานได้จริง',
      images: ['https://via.placeholder.com/100x100?text=Review+1', 'https://via.placeholder.com/100x100?text=Review+2'],
      date: '2 weeks ago',
    },
    {
      id: '2',
      author: 'Abalone M.',
      rating: 5,
      text: 'ประหยัดพื้นที่ในการเก็บ สะดวกและใช้งานได้จริง',
      images: ['https://via.placeholder.com/100x100?text=Review+3', 'https://via.placeholder.com/100x100?text=Review+4'],
      date: '1 week ago',
    },
  ],
  similarProducts: [
    {
      id: '2',
      handle: 'umbrella-stand',
      name: 'Umbrella Stand - Compact Storage',
      price: 159.70,
      originalPrice: 199.00,
      discount: 20,
      rating: 4.9,
      reviewCount: 1700,
      soldCount: 1700,
      images: ['https://via.placeholder.com/200x200?text=Product+2'],
      tags: ['Umbrella', 'Storage'],
      specifications: [],
      seller: { name: 'Better Home Life', rating: 97, reviews: 770600 },
      shipping: { method: 'Standard', cost: 0, estimatedDays: 5 },
      vouchers: [],
    },
    {
      id: '3',
      handle: 'cleaning-brush',
      name: 'Cleaning Brush - Professional Grade',
      price: 25.26,
      originalPrice: 50.00,
      discount: 49,
      rating: 4.8,
      reviewCount: 8000,
      soldCount: 8000,
      images: ['https://via.placeholder.com/200x200?text=Product+3'],
      tags: ['Brush', 'Cleaning'],
      specifications: [],
      seller: { name: 'Better Home Life', rating: 97, reviews: 770600 },
      shipping: { method: 'Standard', cost: 0, estimatedDays: 5 },
      vouchers: [],
    },
    {
      id: '4',
      handle: 'slippers',
      name: 'Hello Polo Cute Slippers',
      price: 117.00,
      originalPrice: 200.00,
      discount: 42,
      rating: 5.0,
      reviewCount: 59200,
      soldCount: 59200,
      images: ['https://via.placeholder.com/200x200?text=Product+4'],
      tags: ['Slippers', 'Comfort'],
      specifications: [],
      seller: { name: 'Fashion Store', rating: 95, reviews: 500000 },
      shipping: { method: 'Standard', cost: 0, estimatedDays: 5 },
      vouchers: [],
    },
  ],
}
