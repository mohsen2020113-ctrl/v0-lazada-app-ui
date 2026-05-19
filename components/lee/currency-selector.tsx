'use client'
// components/lee/currency-selector.tsx
// LEE E-Commerce Platform — Web Currency Selector (Next.js / React)

import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  CURRENCIES,
  CurrencyConfig,
  getAllCurrencies,
} from '@/lib/currency-engine'

const STORAGE_KEY = 'lee_currency'
const CURRENCY_CHANGE_EVENT = 'currencyChange'
const DEFAULT_CURRENCY = 'AED'

function getStoredCurrency(): string {
  if (typeof window === 'undefined') return DEFAULT_CURRENCY
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && CURRENCIES[stored]) return stored
  } catch {}
  return DEFAULT_CURRENCY
}

function setStoredCurrency(code: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, code)
    window.dispatchEvent(
      new CustomEvent(CURRENCY_CHANGE_EVENT, { detail: { currency: code } })
    )
  } catch {}
}

export function useSelectedCurrency() {
  const [currency, setCurrencyState] = useState<string>(DEFAULT_CURRENCY)

  useEffect(() => {
    setCurrencyState(getStoredCurrency())
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ currency: string }>).detail
      if (detail?.currency) setCurrencyState(detail.currency)
    }
    window.addEventListener(CURRENCY_CHANGE_EVENT, handler)
    return () => window.removeEventListener(CURRENCY_CHANGE_EVENT, handler)
  }, [])

  const setCurrency = useCallback((code: string) => {
    setStoredCurrency(code)
    setCurrencyState(code)
  }, [])

  return { currency, setCurrency, config: CURRENCIES[currency] }
}

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
        display: 'flex', alignItems: 'center', gap: 14, width: '100%',
        padding: '12px 12px', border: 'none', borderRadius: 12,
        background: isSelected ? '#fff7ed' : 'transparent', cursor: 'pointer', textAlign: 'left',
      }}
      onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = '#f5f5f5' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = isSelected ? '#fff7ed' : 'transparent' }}
    >
      <span style={{ fontSize: 28, lineHeight: 1 }}>{currency.flag}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontWeight: 600, fontSize: 15, color: '#1a1a1a' }}>
          {currency.code} — {currency.name}
        </span>
        <span style={{ display: 'block', fontSize: 12, color: '#888', marginTop: 1 }}>
          {currency.nameAr} · {currency.symbol}
        </span>
      </span>
      {isSelected && <span style={{ color: '#f97316', fontWeight: 700, fontSize: 18 }}>✓</span>}
    </button>
  )
}

interface CurrencyModalProps {
  current: string
  onSelect: (code: string) => void
  onClose: () => void
}

function CurrencyModal({ current, onSelect, onClose }: CurrencyModalProps) {
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const allCurrencies = getAllCurrencies()

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const filtered = search.trim()
    ? allCurrencies.filter(
        (c) =>
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.nameAr.includes(search) ||
          c.symbol.includes(search)
      )
    : allCurrencies

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Select currency"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, display: 'flex',
        alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.5)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        width: '100%', maxWidth: 480, maxHeight: '80vh', background: '#fff',
        borderRadius: '20px 20px 0 0', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', boxShadow: '0 -4px 32px rgba(0,0,0,0.15)',
      }}>
        <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, flex: 1 }}>Select Currency</h2>
          <button onClick={onClose} aria-label="Close" style={{ border: 'none', background: '#f5f5f5', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ padding: '12px 20px' }}>
          <input
            ref={inputRef} type="search" placeholder="Search currency or country…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 16px', border: '1.5px solid #e5e5e5', borderRadius: 12, fontSize: 15, outline: 'none', boxSizing: 'border-box', background: '#fafafa' }}
          />
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 8px 20px' }}>
          {filtered.length === 0
            ? <p style={{ textAlign: 'center', color: '#999', padding: 24 }}>No currencies found</p>
            : filtered.map((c) => (
                <CurrencyRow key={c.code} currency={c} isSelected={c.code === current}
                  onSelect={() => { onSelect(c.code); onClose() }} />
              ))
          }
        </div>
      </div>
    </div>
  )
}

interface CurrencySelectorProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  offset?: number
}

export default function CurrencySelector({ position = 'bottom-right', offset = 20 }: CurrencySelectorProps) {
  const { currency, setCurrency, config } = useSelectedCurrency()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const posStyle: React.CSSProperties = {
    position: 'fixed', zIndex: 9998,
    ...(position.includes('bottom') ? { bottom: offset } : { top: offset }),
    ...(position.includes('right') ? { right: offset } : { left: offset }),
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`Current currency: ${currency}. Click to change.`}
        style={{
          ...posStyle, display: 'flex', alignItems: 'center', gap: 6,
          padding: '10px 14px', background: '#fff', border: '1.5px solid #e5e5e5',
          borderRadius: 50, boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#1a1a1a',
          transition: 'box-shadow 0.2s, transform 0.2s',
        }}
        onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 6px 28px rgba(0,0,0,0.18)'; el.style.transform = 'translateY(-1px)' }}
        onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'; el.style.transform = 'translateY(0)' }}
      >
        <span style={{ fontSize: 20 }}>{config?.flag ?? '🌍'}</span>
        <span>{currency}</span>
        <span style={{ fontSize: 10, opacity: 0.5 }}>▼</span>
      </button>
      {open && (
        <CurrencyModal current={currency} onSelect={(code) => setCurrency(code)} onClose={() => setOpen(false)} />
      )}
    </>
  )
}
