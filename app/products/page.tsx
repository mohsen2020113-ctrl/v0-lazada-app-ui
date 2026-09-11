import { Metadata } from 'next'
import { fetchAllProducts } from '@/lib/shopify'
import { PaginatedProducts } from '@/components/products/paginated-products'

export const metadata: Metadata = {
  title: 'جميع المنتجات | Lazada',
  description: 'اعرض جميع المنتجات المتوفرة في متجرنا. أكثر من 1400 منتج بجودة عالية وأسعار مميزة.',
}

export const revalidate = 60 // ISR: revalidate every 60 seconds

async function getAllProductsData() {
  try {
    const { products } = await fetchAllProducts()
    console.log(`[v0] Loaded ${products.length} products for catalog page`)
    return products
  } catch (error) {
    console.error('[v0] Error fetching products:', error)
    return []
  }
}

export default async function ProductsCatalogPage() {
  const products = await getAllProductsData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-500 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">جميع المنتجات</h1>
          <p className="text-pink-100">
            {products.length} منتج متاح | اكتشف أفضل العروض اليوم
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {products.length > 0 ? (
          <>
            <PaginatedProducts products={products} itemsPerPage={50} />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">لا توجد منتجات متاحة حالياً</p>
          </div>
        )}
      </div>
    </div>
  )
}
