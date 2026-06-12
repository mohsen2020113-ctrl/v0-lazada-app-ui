import { ProductHeader } from '@/components/product/product-header'
import { ProductGallery } from '@/components/product/product-gallery'
import { ProductInfo } from '@/components/product/product-info'
import { ShippingInfo } from '@/components/product/shipping-info'
import { BuyerGallery } from '@/components/product/buyer-gallery'
import { ReviewsSection } from '@/components/product/reviews-section'
import { SimilarProducts } from '@/components/product/similar-products'
import { ProductActions } from '@/components/product/product-actions'
import { mockProduct } from '@/lib/product-data'
import { getProduct } from '@/lib/shopify'
import { ProductPageClient } from '@/components/product/product-page-client'

async function getProductData(handle: string) {
  try {
    const decodedHandle = decodeURIComponent(handle)
    console.log('[v0] Fetching product:', decodedHandle)
    
    const shopifyProduct = await getProduct(decodedHandle)
    
    if (shopifyProduct?.id) {
      console.log('[v0] Found in Shopify:', shopifyProduct.title)
      
      let discount = 0
      if (shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount) {
        const originalPrice = parseFloat(shopifyProduct.compareAtPriceRange.minVariantPrice.amount)
        const currentPrice = parseFloat(shopifyProduct.priceRange?.minVariantPrice?.amount || '0')
        discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      }
      
      return {
        ...shopifyProduct,
        name: shopifyProduct.title,
        price: parseFloat(shopifyProduct.priceRange?.minVariantPrice?.amount || '0'),
        originalPrice: shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount 
          ? parseFloat(shopifyProduct.compareAtPriceRange.minVariantPrice.amount)
          : parseFloat(shopifyProduct.priceRange?.minVariantPrice?.amount || '0'),
        discount,
        images: shopifyProduct.images?.edges?.map((e: any) => e.node.url) || [],
        videos: [],
        rating: 4.5,
        reviewCount: 2042,
        soldCount: 0,
        stock: 150,
        seller: shopifyProduct.vendor || 'Shopify Store',
        shipping: 'Free Shipping',
        vouchers: [],
        tags: [],
        specifications: [],
        similarProducts: [],
        reviews: [],
      }
    }
    
    console.log('[v0] Product not found, using mock:', decodedHandle)
    return mockProduct
  } catch (error: any) {
    console.error('[v0] Error fetching product:', error?.message)
    return mockProduct
  }
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProductData(params.handle)

  
  return (
    <ProductPageClient product={product} />
  )
}
