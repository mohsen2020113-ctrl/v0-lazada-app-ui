import { NextResponse } from 'next/server'
import { products } from '@/lib/data/products'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = products.find(p => p.id === id)
<<<<<<< HEAD

=======
    
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2
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
