// app/api/currency/route.ts
// LEE E-Commerce Platform — Currency API Route (Next.js App Router)

import { NextRequest, NextResponse } from 'next/server'
import {
  CURRENCIES,
  convert,
  convertFromAED,
  formatPrice,
  formatDualPrice,
  getAllCurrencies,
  getCurrencyForCountry,
} from '@/lib/currency-engine'

const HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  'Access-Control-Allow-Origin': '*',
}

// GET /api/currency?amount=100&from=AED&to=USD
// GET /api/currency?amount=100&from=AED&to=USD&dual=true
// GET /api/currency?amount=100&from=AED&country=US   (derives target from country)
// GET /api/currency/rates  — returns all currencies with rates
export async function GET(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // ── /api/currency/rates ──────────────────────────────────────────────────
  if (pathname.endsWith('/rates')) {
    const currencies = getAllCurrencies().map((c) => ({
      code: c.code,
      name: c.name,
      nameAr: c.nameAr,
      symbol: c.symbol,
      flag: c.flag,
      rateToAED: c.rateToAED,
      rateFromAED: 1 / c.rateToAED,
    }))

    return NextResponse.json(
      {
        base: 'AED',
        timestamp: Date.now(),
        count: currencies.length,
        currencies,
      },
      { headers: HEADERS }
    )
  }

  // ── /api/currency (conversion) ───────────────────────────────────────────
  const amountParam = searchParams.get('amount')
  const fromParam   = (searchParams.get('from') ?? 'AED').toUpperCase()
  const isDual      = searchParams.get('dual') === 'true'
  const countryCode = searchParams.get('country')?.toUpperCase()

  let toParam = (searchParams.get('to') ?? '').toUpperCase()
  if (!toParam && countryCode) {
    toParam = getCurrencyForCountry(countryCode)
  }
  if (!toParam) toParam = 'USD'

  if (!amountParam) {
    return NextResponse.json(
      { error: 'Missing required query parameter: amount' },
      { status: 400, headers: HEADERS }
    )
  }

  const amount = parseFloat(amountParam)
  if (isNaN(amount) || amount < 0) {
    return NextResponse.json(
      { error: 'Parameter `amount` must be a non-negative number' },
      { status: 400, headers: HEADERS }
    )
  }

  if (!CURRENCIES[fromParam]) {
    return NextResponse.json(
      { error: `Unknown source currency: ${fromParam}` },
      { status: 400, headers: HEADERS }
    )
  }
  if (!CURRENCIES[toParam]) {
    return NextResponse.json(
      { error: `Unknown target currency: ${toParam}` },
      { status: 400, headers: HEADERS }
    )
  }

  const converted = convert(amount, fromParam, toParam)
  const formatted = formatPrice(converted, toParam)

  const response: Record<string, unknown> = {
    from: {
      code: fromParam,
      amount,
      formatted: formatPrice(amount, fromParam),
    },
    to: {
      code: toParam,
      amount: converted,
      formatted,
    },
    rate: converted / (amount || 1),
    timestamp: Date.now(),
  }

  if (isDual) {
    const amountAED = fromParam === 'AED' ? amount : convert(amount, fromParam, 'AED')
    response.dual = formatDualPrice(amountAED, toParam)
  }

  return NextResponse.json(response, { headers: HEADERS })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
