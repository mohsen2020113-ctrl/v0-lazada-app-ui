import { useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  onLoadMore: () => void
  isLoading: boolean
  hasMore: boolean
  threshold?: number
}

export function useInfiniteScroll({
  onLoadMore,
  isLoading,
  hasMore,
  threshold = 500,
}: UseInfiniteScrollOptions) {
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          hasMore
        ) {
          onLoadMore()
        }
      },
      {
        rootMargin: `${threshold}px`,
      }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [isLoading, hasMore, onLoadMore, threshold])

  return observerTarget
}
