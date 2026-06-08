import { Suspense } from 'react'
import { ProductPageClient } from '@/components/product/product-page'

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = await params
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p>جاري التحميل...</p></div>}>
      <ProductPageClient handle={resolvedParams.handle} />
    </Suspense>
  )
}
