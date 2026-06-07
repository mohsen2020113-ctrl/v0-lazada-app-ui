—// mobile-app/src/components/CurrencySelector.tsx
// LEE E-Commerce Platform — Mobile Currency Selector (React / Vite)

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CurrencyConfig } from '../lib/currency-engine'
import { useCurrency } from '../context/CurrencyContext'

interface CurrencyRowProps {
  currency: CurrencyConfig
  isSelected: boolean
  onSelect: () => void
}

function CurrencyRow({ currency, isSelected, onSelect }: CurrencyRowProps) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={isSelected}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, widur: '100%',
        padding: '14px 16px', border: 'none', borderBottom: '1px solid #f2f2f2',
        background: isSelected ? '#fff7ed' : '#fff', cursor: 'pointer', textAlign: 'left',
      }}
    >
      <span style={{ fontSize: 30, lineHeight: 1, flexShrink: 0 }}>{currency.flag}</span>
      <span style={{ flex: 1, minWidur: 0 }}>
        <span style={{ display: 'block', fontWeight: 600, fontSize: 15, color: '#1a1a1a', letterSpacing: -0.2 }}>
          {currency.code}
          <span style={{ fontWeight: 400, color: '#555', marginLeft: 6, fontSize: 14 }}>{currency.name}</span>
        </span>
        <span style={{ display: 'block', fontSize: 12, color: '#999', marginTop: 2, direction: 'rtl', textAlign: 'left' }}>
          {currency.nameAr} · {currency.symbol}
        </span>
      </span>
      {isSelected
        ? <span style={{ color: '#f97316', fontWeight: 800, fontSize: 20 }}>✓</span>
        : <span style={{ color: '#ccc', fontSize: 14 }}>›</span>
      }
    </button>
  )
}

interface CurrencyModalProps {
  current: string
  currencies: CurrencyConfig[]
  onSelect: (code: string) => void
  onClose: () => void
}

function CurrencyModal({ current, currencies, onSelect, onClose }: CurrencyModalProps) {
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const filtered = search.trim()
    ? currencies.filter(
        (c) =>
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.nameAr.includes(search) ||
          c.symbol.includes(search)
      )
    : currencies

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Select currency"
      style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', background: '#fff' }}
    >
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '16px 16px 12px',
        borderBottom: '1px solid #eee', gap: 12, background: '#fff',
        position: 'sticky', top: 0, zIndex: 1,
      }}>
        <button onClick={onClose} aria-label="Go back"
          style={{ border: 'none', background: 'none', fontSize: 24, cursor: 'pointer', padding: 4, lineHeight: 1, color: '#333' }}>
          ←
        </button>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, flex: 1 }}>Select Currency</h2>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 16px', background: '#fff', position: 'sticky', top: 61, zIndex: 1, borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f5f5f5', borderRadius: 12, padding: '0 12px', gap: 8 }}>
          <span style={{ fontSize: 16, color: '#999' }}>🔍</span>
          <input
            ref={inputRef} type="search" inputMode="search" placeholder="Search currency…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, border: 'none', background: 'transparent', padding: '12px 0', fontSize: 15, outline: 'none', color: '#1a1a1a' }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              style={{ border: 'none', background: 'none', fontSize: 16, color: '#999', cursor: 'pointer', padding: 0 }}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div style={{ overflowY: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        {filtered.length === 0
          ? <div style={{ textAlign: 'center', color: '#999', padding: '40px 20px', fontSize: 15 }}>No currencies found for "{search}"</div>
          : filtered.map((c) => (
              <CurrencyRow key={c.code} currency={c} isSelected={c.code === current}
                onSelect={() => { onSelect(c.code); onClose() }} />
            ))
        }
      </div>
    </div>
  )
}

interface CurrencySelectorProps {
  variant?: 'pill' | 'fab' | 'inline'
  className?: string
}

export default function CurrencySelector({ variant = 'pill', className }: CurrencySelectorProps) {
  const { currency, config, currencies, setCurrency } = useCurrency()
  const [open, setOpen] = useState(false)
  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])
  const handleSelect = useCallback((code: string) => { setCurrency(code) }, [setCurrency])

  const triggerStyle: React.CSSProperties =
    variant === 'fab'
      ? { position: 'fixed', bottom: 80, right: 16, zIndex: 990, display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 50, boxShadow: '0 4px 20px rgba(0,0,0,0.25)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }
      : variant === 'inline'
      ? { display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'inherit', padding: '4px 0' }
      : { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: '#f5f5f5', border: '1.5px solid #e5e5e5', borderRadius: 50, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1a1a1a' }

  return (
    <>
      <button
        onClick={handleOpen}
        aria-label={`Currency: ${currency}. Tap to change.`}
        style={triggerStyle}
        className={className}
      >
        <span style={{ fontSize: variant === 'fab' ? 20 : 18, lineHeight: 1 }}>{config?.flag ?? '🌍'}</span>
        <span>{currency}</span>
        {variant !== 'inline' && <span style={{ fontSize: 9, opacity: 0.5 }}>▼</span>}
      </button>
      {open && (
        <CurrencyModal current={currency} currencies={currencies} onSelect={handleSelect} onClose={handleClose} />
      )}
    </>
  )
}
