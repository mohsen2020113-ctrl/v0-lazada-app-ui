import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer())
    const base64 = buffer.toString('base64')
    const mimeType = imageFile.type || 'image/jpeg'

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: mimeType, data: base64 } },
              { text: 'Describe this product in 3 words maximum for e-commerce search. Return ONLY the search keywords in English.' }
            ]
          }]
        })
      }
    )

    const geminiData = await geminiRes.json()
    const searchQuery = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''

    if (!searchQuery) {
      return NextResponse.json({ error: 'Could not analyze image' }, { status: 400 })
    }

    const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'f61e20-88.myshopify.com'
    const shopifyToken = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || '54710e221c946a7f98e4ec4ca2df3029'

    const shopifyRes = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': shopifyToken
      },
      body: JSON.stringify({
        query: `{
          products(first: 6, query: "${searchQuery}") {
            edges {
              node {
                id
                handle
                title
                priceRange { minVariantPrice { amount } }
                images(first: 1) { edges { node { url } } }
              }
            }
          }
        }`
      })
    })

    const shopifyData = await shopifyRes.json()
    const products = shopifyData?.data?.products?.edges?.map((e: any) => e.node) ?? []

    return NextResponse.json({ query: searchQuery, products })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
