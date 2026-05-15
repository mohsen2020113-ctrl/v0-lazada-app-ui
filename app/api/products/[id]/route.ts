import { NextResponse } from 'next/server'
import { products } from '@/lib/data/products'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = products.find(p => p.id === params.id)
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('[API] /api/products/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
