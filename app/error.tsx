'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[v0] Error boundary:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">خطأ</h1>
          <p className="mt-2 text-gray-600">حدث خطأ ما. يرجى المحاولة مجدداً.</p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="space-y-2 rounded-lg bg-red-50 p-4 text-left">
            <p className="font-mono text-sm text-red-600">{error.message}</p>
            {error.digest && (
              <p className="font-mono text-xs text-red-500">ID: {error.digest}</p>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={() => reset()}
            className="flex-1 bg-orange-500 hover:bg-orange-600"
          >
            حاول مجدداً
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="flex-1"
          >
            العودة للرئيسية
          </Button>
        </div>
      </div>
    </div>
  )
}
