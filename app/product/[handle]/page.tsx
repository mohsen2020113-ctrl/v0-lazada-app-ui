import { Suspense } from 'react'
import { ProductPageClient } from '@/components/product/product-page'

async function getProduct(handle: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/${handle}`, {
      cache: 'revalidate',
      next: { revalidate: 3600 } // revalidate every hour
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('[v0] Failed to fetch product:', error)
    return null
  }
}

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = await params
  const product = await getProduct(resolvedParams.handle)
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p>جاري التحميل...</p></div>}>
      <ProductPageClient initialProduct={product} handle={resolvedParams.handle} />
    </Suspense>
  )
}
