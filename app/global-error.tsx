'use client'

import { useEffect } from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
          console.error(error)
    }, [error])

  return (
        <html lang="ar" dir="rtl">
              <body>
                      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 bg-white">
                                <h2 className="text-2xl font-bold text-red-600">خطأ حرج في التطبيق</h2>h2>
                                <p className="text-gray-500 text-center max-w-md">
                                            حدث خطأ غير متوقع. يرجى تحديث الصفحة أو المحاولة لاحقاً.
                                </p>p>
                                <button
                                              onClick={reset}
                                              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                            >
                                            حاول مجدداً
                                </button>button>
                      </div>div>
              </body>body>
        </html>html>
      )
}</html>
