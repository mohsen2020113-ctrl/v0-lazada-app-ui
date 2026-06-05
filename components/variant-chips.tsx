'use client'

interface VariantChipsProps {
  variants: Array<{
    id: string
    title: string
    available: boolean
    price?: string
  }>
  selectedIndex: number
  onSelect: (index: number) => void
  label?: string
}

export function VariantChips({ variants, selectedIndex, onSelect, label = 'Choose Option' }: VariantChipsProps) {
  if (!variants.length) return null

  return (
    <div className="mb-4">
      {label && (
        <p className="text-white/50 text-xs font-bold tracking-wide mb-2.5">{label}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {variants.map((variant, index) => (
          <button
            key={variant.id}
            onClick={() => onSelect(index)}
            disabled={!variant.available}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              index === selectedIndex
                ? 'bg-[#F57224] text-white shadow-lg scale-105'
                : variant.available
                  ? 'bg-[#1A1A1A] text-white/70 border border-white/10 hover:border-white/30 hover:text-white/90'
                  : 'bg-[#0F0F0F] text-white/30 border border-white/5 cursor-not-allowed'
            }`}
          >
            {variant.title}
            {variant.price && index === selectedIndex && (
              <span className="text-xs opacity-90 ml-1.5">({variant.price})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
