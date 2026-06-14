import { NextRequest, NextResponse } from 'next/server'

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'smcicw-19.myshopify.com'
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN

async function shopifyAdmin(path: string, method = 'GET', body?: object) {
  if (!ADMIN_TOKEN) throw new Error('SHOPIFY_ADMIN_API_TOKEN not set')
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-01/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Shopify Admin error: ${res.status}`)
  return res.json()
}

export async function GET() {
  try {
    const data = await shopifyAdmin('products.json?limit=250&status=any')
    return NextResponse.json({ products: data.products })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const product = {
      title: body.title,
      body_html: body.description || '',
      vendor: body.vendor || '4LEEE',
      product_type: body.product_type || '',
      status: body.status || 'active',
      variants: [{
        price: String(body.price || '0.00'),
        compare_at_price: body.compare_price ? String(body.compare_price) : undefined,
        inventory_management: 'shopify',
        inventory_quantity: parseInt(body.inventory || '0'),
      }],
      images: body.image_url ? [{ src: body.image_url }] : [],
      tags: body.tags || '',
    }
    const data = await shopifyAdmin('products.json', 'POST', { product })
    return NextResponse.json({ product: data.product })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...rest } = body
    const data = await shopifyAdmin(`products/${id}.json`, 'PUT', { product: rest })
    return NextResponse.json({ product: data.product })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    await shopifyAdmin(`products/${id}.json`, 'DELETE')
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
