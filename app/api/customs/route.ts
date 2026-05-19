// app/api/customs/route.ts
// Next.js App Router API route — LEE Platform Customs Calculator
// GET /api/customs?country=SA&value=500&shipping=50&category=electronics

import { NextRequest, NextResponse } from 'next/server'
import { calculateCustoms } from '@/lib/customs-calculator'

export const runtime = 'edge'

const VALID_CATEGORIES = ['electronics', 'clothing', 'food', 'cosmetics', 'furniture', 'general'] as const
type ProductCategory = (typeof VALID_CATEGORIES)[number]

function isValidCategory(value: string): value is ProductCategory {
  return VALID_CATEGORIES.includes(value as ProductCategory)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const country = searchParams.get('country')
  const valueStr = searchParams.get('value')
  const shippingStr = searchParams.get('shipping')
  const category = searchParams.get('category') ?? 'general'

  // ── Validation ────────────────────────────────────────────────────────────
  if (!country || country.trim().length < 2) {
    return NextResponse.json(
      { error: 'Missing or invalid "country" parameter (ISO 2-letter code required, e.g. SA, AE, GB)' },
      { status: 400 }
    )
  }

  const productValueAED = valueStr ? parseFloat(valueStr) : NaN
  if (isNaN(productValueAED) || productValueAED < 0) {
    return NextResponse.json(
      { error: 'Missing or invalid "value" parameter (must be a non-negative number in AED)' },
      { status: 400 }
    )
  }

  const shippingCostAED = shippingStr ? parseFloat(shippingStr) : 0
  if (isNaN(shippingCostAED) || shippingCostAED < 0) {
    return NextResponse.json(
      { error: 'Invalid "shipping" parameter (must be a non-negative number in AED)' },
      { status: 400 }
    )
  }

  if (!isValidCategory(category)) {
    return NextResponse.json(
      { error: `Invalid "category" parameter. Valid values: ${VALID_CATEGORIES.join(', ')}` },
      { status: 400 }
    )
  }

  // ── Calculation ───────────────────────────────────────────────────────────
  try {
    const result = calculateCustoms({
      destinationCountryCode: country.toUpperCase(),
      productValueAED,
      shippingCostAED,
      productCategory: category,
      isDubaiWarehouse: true,
    })

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json',
      },
    })
  } catch (err) {
    console.error('[customs/route] Calculation error:', err)
    return NextResponse.json(
      { error: 'Failed to calculate customs for the provided parameters' },
      { status: 500 }
    )
  }
}
