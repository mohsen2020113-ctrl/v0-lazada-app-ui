export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
      {/* Image skeleton */}
      <div className="w-full aspect-square bg-gray-200 animate-pulse" />
      <div className="p-2 space-y-2">
        {/* Title skeleton */}
        <div className="h-3 bg-gray-200 animate-pulse rounded w-full" />
        <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4" />
        {/* Price skeleton */}
        <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mt-1" />
        {/* Rating skeleton */}
        <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
