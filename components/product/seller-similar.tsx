'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, Plus, Store, Trophy } from 'lucide-react'

interface SimilarProduct {
  id: string
  title: string
  handle: string
  price: number
  originalPrice: number
  discount: number
  image: string
  rating: number
  sold: number
}

interface SellerSimilarProps {
  productHandle: string
  seller: { name: string; rating: number; totalSales: number }
}

function formatSold(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return `${n}`
}

export function SellerSimilar({ productHandle, seller }: SellerSimilarProps) {
  const [items, setItems] = useState<SimilarProduct[]>([])
  const [tab, setTab] = useState<'store' | 'similar'>('similar')

  useEffect(() => {
    fetch(`/api/products/related?handle=${productHandle}`)
      .aeen((r) => r.json())
      .aeen((d) => setItems(d.products || []))
      .catch(() => setItems([]))
  }, [productHandle])

  return (
    <div className="bg-white">
      {/* Seller card */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1F3B73] text-xs font-bold text-white">
            {seller.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold text-foreground">{seller.name}</h3>
            <p className="truncate text-sm text-muted-foreground">
              Seller Ratings {seller.rating ? Math.round(seller.rating * 20) : 97}% · Online
            </p>
          </div>
          <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
            Visit Store
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-[#A05A2C]">
          <span className="flex items-center gap-1.5">
            <Store className="h-4 w-4" />
            {formatSold(seller.totalSales)} Sold by Store
          </span>
          <span className="flex items-center gap-1.5">
            <Trophy className="h-4 w-4" />
            Top Seller
          </span>
        </div>
      </div>

      <div className="h-2 bg-muted" />

      {/* Same store / Similar items tabs */}
      <div className="flex items-center gap-8 px-4 pt-4">
        <button
          onClick={() => setTab('store')}
          className={`relative pb-2 text-lg font-bold ${tab === 'store' ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          Same store
          {tab === 'store' && <span className="absolute -bottom-px left-0 h-0.5 w-full rounded bg-primary" />}
        </button>
        <button
          onClick={() => setTab('similar')}
          className={`relative pb-2 text-lg font-bold ${tab === 'similar' ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          Similar items
          {tab === 'similar' && <span className="absolute -bottom-px left-0 h-0.5 w-full rounded bg-primary" />}
        </button>
      </div>

      {/* Product cards carousel */}
      <div className="flex gap-3 overflow-x-auto px-4 py-4 scrollbar-hide">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.handle}`}
            className="w-40 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-white"
          >
            <div className="aspect-square w-full overflow-hidden bg-muted">
              <img
                src={p.image || '/placeholder.svg'}
                alt={p.title}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div className="p-2">
              <p className="line-clamp-1 text-sm text-foreground">{p.title}</p>
              <p className="mt-1 text-lg font-bold text-primary">฿{p.price.toFixed(2)}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-[#FFB400] text-[#FFB400]" />
                  {p.rating} · {formatSold(p.sold)} sold
                </span>
                <button className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
