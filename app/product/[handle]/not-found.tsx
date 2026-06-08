'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Home, ShoppingCart } from 'lucide-react'

export default function ProductNotFound() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-4">
      {/* Product Not Found Illustration */}
      <div className="text-center">
        <ShoppingCart className="h-20 w-20 mx-auto text-primary/20 mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-2">المنتج غير موجود</h1>
        <p className="text-lg text-muted-foreground">Product Not Found</p>
      </div>

      {/* Description */}
      <div className="max-w-sm text-center">
        <p className="text-muted-foreground leading-relaxed">
          عذراً، المنتج الذي تبحث عنه غير متوفر أو قد يكون قد حُذف أو انتقل.
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          The product you are looking for is not available or may have been removed.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowLeft className="h-5 w-5" />
          العودة للخلف
        </button>
        <button
          onClick={() => router.push('/')}
          className="flex items-center justify-center gap-2 rounded-lg border-2 border-primary bg-transparent px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          <Home className="h-5 w-5" />
          الذهاب للتسوق
        </button>
      </div>
    </div>
  )
}
