import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

async function getOrCreateCart(userId: string | null, sessionToken: string, country: string) {
  const query = userId
    ? supabaseAdmin.from('carts').select('*').eq('user_id', userId).single()
    : supabaseAdmin.from('carts').select('*').eq('session_token', sessionToken).single()

  const { data: cart } = await query

  if (cart) return cart

  const { data: newCart } = await supabaseAdmin
    .from('carts')
    .insert({ user_id: userId, session_token: sessionToken, country_code: country })
    .select()
    .single()

  return newCart
}

export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get('lee_session')?.value || req.headers.get('x-session') || 'guest'
  const country = req.cookies.get('lee_country')?.value || 'AE'

  const cart = await getOrCreateCart(null, sessionToken, country)
  const { data: items } = await supabaseAdmin.from('cart_items').select('*').eq('cart_id', cart.id)

  return NextResponse.json({ cart, items: items || [] })
}

export async function POST(req: NextRequest) {
  const sessionToken = req.cookies.get('lee_session')?.value || 'guest'
  const country = req.cookies.get('lee_country')?.value || 'AE'
  const body = await req.json()

  const cart = await getOrCreateCart(null, sessionToken, country)

  // Check if item already in cart
  const { data: existing } = await supabaseAdmin
    .from('cart_items')
    .select('*')
    .eq('cart_id', cart.id)
    .eq('shopify_variant_id', body.variantId)
    .single()

  if (existing) {
    await supabaseAdmin
      .from('cart_items')
      .update({ quantity: existing.quantity + (body.quantity || 1) })
      .eq('id', existing.id)
  } else {
    await supabaseAdmin.from('cart_items').insert({
      cart_id: cart.id,
      shopify_product_id: body.productId,
      shopify_variant_id: body.variantId,
      product_title: body.title,
      variant_title: body.variantTitle,
      price: body.price,
      currency: body.currency || 'AED',
      quantity: body.quantity || 1,
      image_url: body.imageUrl,
      product_handle: body.handle,
    })
  }

  const { data: items } = await supabaseAdmin.from('cart_items').select('*').eq('cart_id', cart.id)
  return NextResponse.json({ cart, items })
}

export async function DELETE(req: NextRequest) {
  const { itemId } = await req.json()
  await supabaseAdmin.from('cart_items').delete().eq('id', itemId)
  return NextResponse.json({ success: true })
}
