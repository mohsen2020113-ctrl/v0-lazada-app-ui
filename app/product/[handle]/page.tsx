import { Suspense } from 'react'
import { ProductPageClient } from '@/components/product/product-page'

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = await params
  const handle = resolvedParams?.handle || 'unknown'
  
  console.log('[v0] Page.tsx - resolved handle:', handle)
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p>جاري التحميل...</p></div>}>
      <ProductPageClient handle={handle} />
    </Suspense>
  )
}
