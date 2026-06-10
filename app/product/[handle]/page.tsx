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

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'details', label: 'Product Details' },
    { id: 'recommendations', label: 'Recommendations' },
  ]

  return (
    <div className="min-h-screen bg-white pb-48">
      {/* Header */}
      <ProductHeader
        productName={product.name}
        rating={product.rating}
        reviewCount={product.reviewCount}
        cartCount={3}
      />

      {/* Tab Navigation */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200 px-4">
        <div className="flex gap-6 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 font-medium text-sm md:text-base whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-6 p-4 md:p-8">
        {/* Gallery */}
        <ProductGallery images={product.images} videos={product.videos} productName={product.name} />

        {/* Product Info */}
        <div className="space-y-6">
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

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <>
              <ShippingInfo shipping={product.shipping} vouchers={product.vouchers} />
              <BuyerGallery images={product.images.map((img) => 'https://via.placeholder.com/100x100?text=Buyer+Photo')} />
            </>
          )}

          {activeTab === 'reviews' && (
            <ReviewsSection reviews={product.reviews} rating={product.rating} reviewCount={product.reviewCount} />
          )}

          {activeTab === 'details' && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-4">Product Details</h3>
              <div className="space-y-3">
                {product.specifications?.map((spec, i) => (
                  <p key={i} className="text-sm text-gray-700">
                    - {spec}
                  </p>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <SimilarProducts products={product.similarProducts} storeProducts={product.similarProducts.slice(0, 2)} />
          )}
        </div>
      </div>

      {/* Actions */}
      <ProductActions sellerId={product.seller.name} sellerName={product.seller.name} price={product.price} />
    </div>
  )
}
