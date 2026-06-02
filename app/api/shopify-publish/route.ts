import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description_ar, description_en, colors, sizes, category } = body

    const domain =
      process.env.SHOPIFY_STORE_DOMAIN ||
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
      'smcicw-19.myshopify.com'
    const token = process.env.SHOPIFY_ADMIN_TOKEN

    if (!token) {
      return NextResponse.json(
        { error: 'SHOPIFY_ADMIN_TOKEN env var is not set' },
        { status: 500 }
      )
    }

    // Build tags from colors and category
    const colorTags = (colors || []).map(
      (c: { name_en?: string; name_ar?: string }) => c.name_en || c.name_ar || ''
    )
    const tags = [category, ...colorTags].filter(Boolean).join(', ')

    // Build variants/options from sizes
    const hasSizes = sizes && sizes.length > 0
    const options = hasSizes ? [{ name: 'Size', values: sizes }] : undefined
    const variants = hasSizes
      ? sizes.map((size: string) => ({ option1: size, price: '0.00', inventory_management: null }))
      : [{ price: '0.00', inventory_management: null }]

    const body_html = `<div dir="rtl"><p>${description_ar || ''}</p></div><div><p>${description_en || ''}</p></div>`

    const productPayload: Record<string, unknown> = {
      title: name || 'منتج جديد',
      body_html,
      vendor: 'LEE',
      product_type: category || '',
      tags,
      variants,
      status: 'active',
    }
    if (options) productPayload.options = options

    const shopifyRes = await fetch(
      `https://${domain}/admin/api/2024-01/products.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token,
        },
        body: JSON.stringify({ product: productPayload }),
      }
    )

    if (!shopifyRes.ok) {
      const errText = await shopifyRes.text()
      return NextResponse.json(
        { error: `Shopify API error ${shopifyRes.status}: ${errText}` },
        { status: 502 }
      )
    }

    const data = await shopifyRes.json()
    const created = data.product
    const storeSlug = domain.replace('.myshopify.com', '')

    return NextResponse.json({
      id: created.id,
      handle: created.handle,
      adminUrl: `https://admin.shopify.com/store/${storeSlug}/products/${created.id}`,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
