'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-background to-muted px-4">
      {/* 404 Graphic */}
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-primary/20 mb-2">404</h1>
        <h2 className="text-3xl font-bold text-foreground mb-2">الصفحة غير موجودة</h2>
        <p className="text-lg text-muted-foreground mb-2">Page Not Found</p>
      </div>

      {/* Description */}
      <div className="max-w-sm text-center">
        <p className="text-muted-foreground leading-relaxed">
          عذراً، الصفحة التي تSearch عنها غير موجودة أو قد تم حذفها.
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          The page you are looking for does not exist or has been removed.
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
          الصفحة الرئيسية
        </button>
      </div>

      {/* Footer info */}
      <p className="text-xs text-muted-foreground mt-8">
        رمز الError: 404 | Error Code: 404
      </p>
    </div>
  )
}
