'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronDown, Heart, Search, Filter, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  title: string
  handle: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  sold: number
  discount?: number
}

const SORT_OPTIONS = [
  { label: 'Trending', value: 'trending' },
  { label: 'Newest', value: 'newest' },
  { label: 'Best Rating', value: 'rating' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
]

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Premium Wireless Headphones with Noise Cancellation',
    handle: 'wireless-headphones',
    price: 299,
    originalPrice: 399,
    image: '🎧',
    rating: 4.8,
    reviews: 256,
    sold: 1204,
    discount: 25,
  },
  {
    id: 'prod-2',
    title: 'Ultra Fast USB 3.0 Flash Drive 256GB',
    handle: 'usb-flash-drive',
    price: 89,
    originalPrice: 129,
    image: '💾',
    rating: 4.6,
    reviews: 189,
    sold: 892,
    discount: 31,
  },
  {
    id: 'prod-3',
    title: 'Portable Phone Charger 20000mAh',
    handle: 'phone-charger',
    price: 145,
    originalPrice: 199,
    image: '🔋',
    rating: 4.9,
    reviews: 412,
    sold: 2341,
    discount: 27,
  },
  {
    id: 'prod-4',
    title: 'Ergonomic Wireless Mouse USB Receiver',
    handle: 'wireless-mouse',
    price: 64,
    originalPrice: 99,
    image: '🖱️',
    rating: 4.5,
    reviews: 157,
    sold: 645,
    discount: 35,
  },
  {
    id: 'prod-5',
    title: 'Premium Phone Screen Protector Tempered Glass',
    handle: 'screen-protector',
    price: 24,
    originalPrice: 49,
    image: '📱',
    rating: 4.7,
    reviews: 523,
    sold: 3421,
    discount: 51,
  },
  {
    id: 'prod-6',
    title: 'Bluetooth Speaker Waterproof with AUX',
    handle: 'bluetooth-speaker',
    price: 178,
    originalPrice: 259,
    image: '🔊',
    rating: 4.8,
    reviews: 334,
    sold: 1876,
    discount: 31,
  },
  {
    id: 'prod-7',
    title: 'USB-C Fast Charging Cable 3 Pack',
    handle: 'usb-c-cable',
    price: 34,
    originalPrice: 59,
    image: '🔌',
    rating: 4.6,
    reviews: 267,
    sold: 2154,
    discount: 42,
  },
  {
    id: 'prod-8',
    title: 'Phone Stand Desktop Adjustable Holder',
    handle: 'phone-stand',
    price: 42,
    originalPrice: 79,
    image: '📐',
    rating: 4.4,
    reviews: 198,
    sold: 876,
    discount: 47,
  },
  {
    id: 'prod-9',
    title: 'Wireless Charging Pad 15W Fast Charge',
    handle: 'charging-pad',
    price: 89,
    originalPrice: 139,
    image: '⚡',
    rating: 4.7,
    reviews: 412,
    sold: 1234,
    discount: 36,
  },
  {
    id: 'prod-10',
    title: 'HDMI Cable 4K 2m High Speed Gold Plated',
    handle: 'hdmi-cable',
    price: 52,
    originalPrice: 89,
    image: '📺',
    rating: 4.5,
    reviews: 145,
    sold: 567,
    discount: 42,
  },
]

export default function CategoryPage({ params }: { params: Promise<{ handle: string }> }) {
  const router = useRouter()
  const [handle, setHandle] = useState<string>('')
  const [title, setTitle] = useState('Products')
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [sortBy, setSortBy] = useState('trending')
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then((p) => {
      setHandle(p.handle)
      const decodedTitle = decodeURIComponent(p.handle).replace(/-/g, ' ')
      setTitle(decodedTitle.charAt(0).toUpperCase() + decodedTitle.slice(1))
      
      // Simulate API call
      setTimeout(() => {
        setProducts(MOCK_PRODUCTS)
        setLoading(false)
      }, 600)
    })
  }, [params])

  const sortedProducts = useCallback(() => {
    const sorted = [...products]
    switch (sortBy) {
      case 'newest':
        return sorted.reverse()
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price)
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating)
      case 'trending':
      default:
        return sorted.sort((a, b) => b.sold - a.sold)
    }
  }, [products, sortBy])()

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId)
    } else {
      newWishlist.add(productId)
    }
    setWishlist(newWishlist)
  }

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
      <span className="text-xs text-gray-600 font-medium">{rating.toFixed(1)}</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-base font-bold text-gray-900 flex-1 truncate">{title}</h1>
          <button
            onClick={() => router.push('/search')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5 text-gray-900" />
          </button>
        </div>

        {/* Sort and Filter Bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 overflow-x-auto">
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors whitespace-nowrap text-sm font-medium text-gray-900"
            >
              <span>Sort</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Sort Dropdown Menu */}
            {showSortMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 min-w-48">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value)
                      setShowSortMenu(false)
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                      sortBy === option.value ? 'bg-pink-50 text-pink-600 font-medium' : 'text-gray-900'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors whitespace-nowrap text-sm font-medium text-gray-900">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-2 py-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg aspect-[2.5/4] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="text-5xl">📦</div>
            <p className="text-gray-600 text-sm">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {sortedProducts.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/product/${product.handle}`}>
                  <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow h-full flex flex-col">
                    {/* Product Image */}
                    <div className="relative aspect-[2.5/3] bg-gray-50 overflow-hidden flex items-center justify-center">
                      <span className="text-4xl">{product.image}</span>

                      {/* Discount Badge */}
                      {product.discount && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{product.discount}%
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleWishlist(product.id)
                        }}
                        className="absolute top-2 left-2 p-2 bg-white/90 hover:bg-white rounded-lg transition-all transform hover:scale-110"
                      >
                        <Heart
                          size={16}
                          className={`transition-colors ${
                            wishlist.has(product.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-2.5 flex-1 flex flex-col">
                      <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 mb-2 flex-1">
                        {product.title}
                      </h3>

                      {/* Rating */}
                      <div className="mb-2">
                        <StarRating rating={product.rating} />
                      </div>

                      {/* Sold Info */}
                      <p className="text-xs text-gray-500 mb-2">
                        {product.sold.toLocaleString()} sold
                      </p>

                      {/* Price Section */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-pink-600">
                          AED {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through">
                            AED {product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

