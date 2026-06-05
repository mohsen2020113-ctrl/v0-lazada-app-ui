export function InfiniteScrollLoader({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null
  
  return (
    <div className="flex justify-center py-8">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

export function InfiniteScrollLoaderDark({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null
  
  return (
    <div className="flex justify-center py-8">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}
