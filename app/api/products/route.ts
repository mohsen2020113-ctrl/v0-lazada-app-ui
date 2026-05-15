import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/lib/data/products'

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(products)
  } catch (error) {
    console.error('[API] /api/products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
