export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[3/4] bg-gray-200" />
      
      {/* Content skeleton */}
      <div className="p-2.5">
        {/* Title lines */}
        <div className="space-y-1.5">
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
        
        {/* Price */}
        <div className="mt-3 flex items-center gap-1.5">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  )
}

export function ProductCardSkeletonDark() {
  return (
    <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[4/5] bg-[#2A2A2A]" />
      
      {/* Content skeleton */}
      <div className="p-2.5">
        {/* Title lines */}
        <div className="space-y-1.5 mb-2">
          <div className="h-3 bg-[#2A2A2A] rounded w-3/4" />
          <div className="h-3 bg-[#2A2A2A] rounded w-2/3" />
        </div>
        
        {/* Price */}
        <div className="flex items-center gap-1.5">
          <div className="h-4 bg-[#2A2A2A] rounded w-1/3" />
          <div className="h-3 bg-[#2A2A2A] rounded w-1/4" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ columns = 2 }: { columns?: number }) {
  return (
    <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {[...Array(8)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProductGridSkeletonDark({ columns = 2 }: { columns?: number }) {
  return (
    <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {[...Array(8)].map((_, i) => (
        <ProductCardSkeletonDark key={i} />
      ))}
    </div>
  )
}

export function CategoryPageSkeleton() {
  return (
    <div className="px-3 py-4">
      <div className="grid grid-cols-2 gap-3">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function HomepageSkeleton() {
  return (
    <div className="bg-white mx-3 mt-3 rounded-xl overflow-hidden p-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="mt-2 h-3 bg-gray-200 rounded w-3/4" />
            <div className="mt-1 h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
