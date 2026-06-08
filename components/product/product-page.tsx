'use client'

import { use, useState } from 'react'
import { ArrowLeft, Search, Share2, ShoppingCart, Heart, Star } from 'lucide-react'
import { ProductGallery } from '@/components/product/product-gallery'

interface Product {
  id: string
  name: string
  nameEn: string
  price: number
  originalPrice: number
  discount: number
  category: string
  images: string[]
  rating: number
  reviews: number
  sold: number
  stock: number
  colors: string[]
  sizes: string[]
  description: string
  specifications: Record<string, string>
  seller: { name: string; rating: number; totalSales: number }
  shipping: { free: boolean; days: number; from: string }
  isNew: boolean
  isFeatured: boolean
  tags: string[]
}

const TABS = ['Overview', 'Reviews', 'Product Details', 'Recommendations']

async function getProduct(handle: string): Promise<Product> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/${handle}`, {
    cache: 'revalidate',
    next: { revalidate: 3600 }
  })
  
  if (!response.ok) throw new Error('Product not found')
  return response.json()
}

export function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = use(params)
  const productPromise = getProduct(handle)
  const product = use(productPromise)
  const [activeTab, setActiveTab] = useState('Overview')

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-white shadow-sm">
        <div className="flex items-center gap-2 px-3 py-3">
          <button onClick={() => window.history.back()} aria-label="Back" className="p-1">
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-lg border-2 border-[#E91E63] px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search in 4LEEE"
              className="flex-1 bg-transparent text-sm placeholder-muted-foreground outline-none"
            />
          </div>
          <button aria-label="Share" className="p-1">
            <Share2 className="h-5 w-5 text-foreground" />
          </button>
          <button aria-label="Cart" className="relative p-1">
            <ShoppingCart className="h-5 w-5 text-foreground" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E91E63] px-0.5 text-[10px] font-bold text-white">
              3
            </span>
          </button>
          <button aria-label="More" className="p-1 text-xl">
            ⋯
          </button>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-4 overflow-x-auto border-t border-border px-4 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative whitespace-nowrap py-3 text-sm font-medium transition-colors ${
                activeTab === tab ? 'text-[#E91E63]' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#E91E63] rounded-t-sm" />
              )}
            </button>
          ))}
        </nav>
      </header>

      {/* Product Gallery */}
      <ProductGallery 
        images={product.images || []} 
        alt={product.name} 
        discount={product.discount}
      />

      {/* Price & Info Section */}
      <div className="px-4 py-4 border-b border-border">
        {/* Price */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl font-bold text-[#E91E63]">฿{product.price}</span>
          {product.originalPrice > product.price && (
            <>
              <span className="text-sm line-through text-muted-foreground">฿{product.originalPrice}</span>
              <span className="text-xs font-semibold text-[#FF3B30] bg-red-50 px-2 py-1 rounded">
                -{product.discount}%
              </span>
            </>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.map((tag, i) => (
            <span key={i} className="text-xs bg-gray-100 text-foreground px-2.5 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Product Title & Rating */}
        <h1 className="text-lg font-semibold text-foreground mb-3">{product.name}</h1>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(product.rating) ? 'fill-[#FFB400] text-[#FFB400]' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground ml-2">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-muted-foreground">{product.sold} sold</span>
          <button className="text-[#E91E63] hover:text-[#d41e6f]">
            <Heart size={20} />
          </button>
        </div>

        {/* Shipping Info */}
        <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1 mb-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">
              {product.shipping.free ? 'Free' : `฿${product.shipping.free ? 0 : 50}`} • {product.shipping.days} days
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">From</span>
            <span className="font-medium">{product.shipping.from}</span>
          </div>
        </div>

        {/* Guarantee Badge */}
        <div className="flex items-start gap-2 text-xs mb-3">
          <div className="mt-0.5">✓</div>
          <div>
            <div className="font-semibold">7 Days Free Return</div>
            <div className="text-muted-foreground">No questions asked</div>
          </div>
        </div>
      </div>

      {/* Seller Info */}
      {activeTab === 'Overview' && (
        <div className="px-4 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Seller</h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-semibold text-sm">{product.seller.name}</div>
              <div className="text-xs text-muted-foreground">Rating: {product.seller.rating} • {product.seller.totalSales} sales</div>
            </div>
            <button className="text-[#E91E63] text-sm font-semibold">Visit</button>
          </div>
        </div>
      )}

      {/* Specifications */}
      {activeTab === 'Product Details' && (
        <div className="px-4 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Specifications</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground capitalize">{key}</div>
                <div className="text-sm font-semibold text-foreground">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-white px-4 py-3 flex gap-2 shadow-lg">
        <div className="flex gap-2 flex-1">
          <button className="flex-1 flex items-center justify-center gap-2 text-muted-foreground text-sm font-medium">
            <div className="text-xl">🏪</div>
            <span className="hidden sm:inline">Store</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 text-muted-foreground text-sm font-medium">
            <div className="text-xl">💬</div>
            <span className="hidden sm:inline">Chat</span>
          </button>
        </div>
        <button className="flex-1 bg-[#FF9500] hover:bg-[#F08500] text-white font-semibold py-3 rounded-lg transition-colors text-sm">
          Buy Now
        </button>
        <button className="flex-1 bg-[#E91E63] hover:bg-[#d41e6f] text-white font-semibold py-3 rounded-lg transition-colors text-sm">
          Add to Cart
        </button>
      </div>
    </div>
  )
}
