'use client'

import { useState } from 'react'
import { ProductHeader } from '@/components/product/product-header'
import { ProductGallery } from '@/components/product/product-gallery'
import { ProductInfo } from '@/components/product/product-info'
import { ShippingInfo } from '@/components/product/shipping-info'
import { BuyerGallery } from '@/components/product/buyer-gallery'
import { ReviewsSection } from '@/components/product/reviews-section'
import { SimilarProducts } from '@/components/product/similar-products'
import { ProductActions } from '@/components/product/product-actions'
import { mockProduct } from '@/lib/product-data'

export default function ProductPage({ params }: { params: { handle: string } }) {
  const product = mockProduct
  const [activeTab, setActiveTab] = useState('overview')
  const [quantity, setQuantity] = useState(1)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'details', label: 'Product Details' },
    { id: 'recommendations', label: 'Recommendations' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <ProductHeader
        productName={product.name}
        rating={product.rating}
        reviewCount={product.reviewCount}
        cartCount={3}
      />

      {/* Main Content - Web Desktop Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Desktop Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
          {/* Left Column - Gallery (40%) */}
          <div className="lg:col-span-2">
            <ProductGallery images={product.images} videos={product.videos} productName={product.name} />
          </div>

          {/* Right Column - Info (60%) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Product Info */}
            <ProductInfo
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              rating={product.rating}
              reviewCount={product.reviewCount}
              soldCount={product.soldCount}
              tags={product.tags}
              specifications={product.specifications}
            />

            {/* Quantity and Seller Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-bold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 border-l border-r border-gray-300 font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-600 ml-auto">{product.stock || 150} Available</span>
              </div>

              {/* Seller Info Card */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900">{product.seller.name}</h4>
                    <p className="text-xs text-gray-600">Seller Rating 97% | Active 2 hours ago</p>
                  </div>
                  <button className="px-4 py-2 border border-pink-600 text-pink-600 font-bold rounded hover:bg-pink-50 transition-colors">
                    Visit Store
                  </button>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <ShippingInfo shipping={product.shipping} vouchers={product.vouchers} />

            {/* Tab Navigation for Desktop */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex gap-8 border-b border-gray-200 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 font-semibold text-sm md:text-base whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'text-pink-600 border-pink-600'
                        : 'text-gray-600 hover:text-gray-900 border-transparent'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <>
                    <BuyerGallery images={product.images.map((img) => 'https://via.placeholder.com/100x100?text=Buyer+Photo')} />
                  </>
                )}

                {activeTab === 'reviews' && (
                  <ReviewsSection reviews={product.reviews} rating={product.rating} reviewCount={product.reviewCount} />
                )}

                {activeTab === 'details' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-lg mb-4 text-gray-900">Product Details</h3>
                      <div className="space-y-3">
                        {product.specifications?.map((spec, i) => (
                          <div key={i} className="flex gap-3">
                            <span className="text-pink-600 font-bold">•</span>
                            <p className="text-sm text-gray-700">{spec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'recommendations' && (
                  <SimilarProducts products={product.similarProducts} storeProducts={product.similarProducts.slice(0, 2)} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Actions Footer */}
      <ProductActions sellerId={product.seller.name} sellerName={product.seller.name} price={product.price} quantity={quantity} />
    </div>
  )
}
