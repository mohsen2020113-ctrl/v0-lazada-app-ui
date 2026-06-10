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
  const product = mockProduct // In production, fetch based on params.handle

  return (
    <div className="min-h-screen bg-gray-50 pb-48">
      {/* Header */}
      <ProductHeader
        productName={product.name}
        rating={product.rating}
        reviewCount={product.reviewCount}
        cartCount={3}
      />

      {/* Gallery */}
      <ProductGallery images={product.images} videos={product.videos} productName={product.name} />

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

      {/* Shipping Info */}
      <ShippingInfo shipping={product.shipping} vouchers={product.vouchers} />

      {/* Buyer Gallery */}
      <BuyerGallery
        images={product.images.map(
          (img) => 'https://via.placeholder.com/100x100?text=Buyer+Photo'
        )}
      />

      {/* Reviews Section */}
      <ReviewsSection reviews={product.reviews} rating={product.rating} reviewCount={product.reviewCount} />

      {/* Similar Products */}
      <SimilarProducts
        products={product.similarProducts}
        storeProducts={product.similarProducts.slice(0, 2)}
      />

      {/* Actions */}
      <ProductActions sellerId={product.seller.name} sellerName={product.seller.name} price={product.price} />
    </div>
  )
}
