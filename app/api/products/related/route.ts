import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/lib/data/products'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const handle = searchParams.get('handle')

  const current = products.find((p) => p.id === handle)
  const category = current?.category

  // Prefer same-category products, fall back to everything else, exclude current.
  const sameCategory = products.filter(
    (p) => p.id !== handle && p.category === category,
  )
  const others = products.filter(
    (p) => p.id !== handle && p.category !== category,
  )

  const pool = [...sameCategory, ...others].slice(0, 12)

  const mapped = pool.map((p) => ({
    id: p.id,
    title: p.nameEn,
    handle: p.id,
    price: p.price,
    originalPrice: p.originalPrice,
    discount: p.discount,
    image: p.images[0],
    rating: p.rating,
    sold: p.sold,
  }))

  return NextResponse.json({ products: mapped })
}
