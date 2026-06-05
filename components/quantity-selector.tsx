'use client'
import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  min?: number
  max?: number
  label?: string
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 999,
  label = 'Quantity',
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || min
    if (value >= min && value <= max) {
      onQuantityChange(value)
    }
  }

  return (
    <div className="flex items-center justify-between mb-5">
      {label && (
        <p className="text-white/50 text-xs font-bold tracking-wide">{label}</p>
      )}
      <div className="flex items-center gap-3 bg-[#1A1A1A] rounded-xl p-1">
        <button
          onClick={handleDecrement}
          disabled={quantity <= min}
          className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="w-12 bg-transparent text-center text-white font-bold text-sm border-0 outline-none"
          aria-label="Quantity"
        />
        <button
          onClick={handleIncrement}
          disabled={quantity >= max}
          className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}
