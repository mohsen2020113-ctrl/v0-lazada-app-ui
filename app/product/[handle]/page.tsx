import { Suspense } from 'react'
import { ProductPage } from '@/components/product/product-page'

export default function Page({ params }: { params: Promise<{ handle: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p>Loading...</p></div>}>
      <ProductPage params={params} />
    </Suspense>
  )
}
