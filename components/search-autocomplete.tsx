import { Clock, X, TrendingUp } from 'lucide-react'

interface SearchAutocompleteProps {
  query: string
  suggestions: string[]
  history: string[]
  isOpen: boolean
  onSuggestionClick: (suggestion: string) => void
  onHistoryRemove: (item: string) => void
  onClearHistory: () => void
}

export function SearchAutocomplete({
  query,
  suggestions,
  history,
  isOpen,
  onSuggestionClick,
  onHistoryRemove,
  onClearHistory,
}: SearchAutocompleteProps) {
  if (!isOpen) return null

  const showHistory = !query.trim()
  const items = showHistory ? history : suggestions

  if (items.length === 0 && !showHistory) {
    return (
      <div className="absolute top-full left-0 right-0 bg-[#1A1A1A] border-b border-white/8 rounded-b-lg z-50">
        <div className="px-4 py-8 text-center">
          <p className="text-white/40 text-sm">لا توجد اقتراحات</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-[#1A1A1A] border-b border-white/8 rounded-b-lg z-50 shadow-lg max-h-96 overflow-y-auto">
      <div className="divide-y divide-white/5">
        {items.map((item, index) => (
          <button
            key={`${showHistory ? 'history' : 'suggestion'}-${index}`}
            onClick={() => onSuggestionClick(item)}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
          >
            {showHistory ? (
              <Clock size={16} className="text-white/30 flex-shrink-0" />
            ) : (
              <TrendingUp size={16} className="text-[#F57224] flex-shrink-0" />
            )}
            <span className="flex-1 text-white/80 text-sm">{item}</span>
            {showHistory && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onHistoryRemove(item)
                }}
                className="text-white/20 hover:text-white/60 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </button>
        ))}
        
        {showHistory && history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="w-full px-4 py-3 text-center text-white/40 hover:text-white/60 transition-colors text-sm font-medium"
          >
            مسح السجل
          </button>
        )}
      </div>
    </div>
  )
}
