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
              console.error(error)
                }, [error])

                  return (
                      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8">
                            <h2 className="text-2xl font-bold text-red-600">حدث خطأ ما</h2>
                                  <p className="text-gray-500 text-center max-w-md">
                                          عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
                                                </p>
                                                      <Button onClick={reset} variant="default">
                                                              حاول مجدداً
                                                                    </Button>
                                                                        </div>
                                                                          )
                                                                          }
