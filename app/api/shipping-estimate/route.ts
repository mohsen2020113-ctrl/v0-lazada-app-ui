// app/api/shipping-estimate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { selectWarehouse, getCountry } from '@/lib/warehouse-routing';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const country = searchParams.get('country');
  const weightRaw = searchParams.get('weight');
  const valueRaw = searchParams.get('value');
  const preference = searchParams.get('preference') as 'fastest' | 'cheapest' | 'balanced' | null;
  const productOrigin = searchParams.get('origin') as 'china' | 'dubai' | 'any' | null;

  // ── Validate required params ──────────────────────────────────────────────
  if (!country) {
    return NextResponse.json(
      { error: 'Missing required parameter: country (ISO 2-letter code)' },
      { status: 400 }
    );
  }

  const countryConfig = getCountry(country);
  if (!countryConfig) {
    return NextResponse.json(
      { error: `Unknown country code: ${country}. Use ISO 3166-1 alpha-2 format.` },
      { status: 400 }
    );
  }

  const weightKg = weightRaw ? parseFloat(weightRaw) : 1;
  if (isNaN(weightKg) || weightKg <= 0) {
    return NextResponse.json(
      { error: 'Invalid weight. Must be a positive number in kilograms.' },
      { status: 400 }
    );
  }
  if (weightKg > 1000) {
    return NextResponse.json(
      { error: 'Weight exceeds maximum limit of 1000 kg.' },
      { status: 400 }
    );
  }

  const productValueAED = valueRaw ? parseFloat(valueRaw) : 200;
  if (isNaN(productValueAED) || productValueAED < 0) {
    return NextResponse.json(
      { error: 'Invalid value. Must be a non-negative number in AED.' },
      { status: 400 }
    );
  }

  const validPreferences = ['fastest', 'cheapest', 'balanced'];
  const resolvedPreference: 'fastest' | 'cheapest' | 'balanced' =
    preference && validPreferences.includes(preference)
      ? preference
      : 'balanced';

  const validOrigins = ['china', 'dubai', 'any'];
  const resolvedOrigin: 'china' | 'dubai' | 'any' =
    productOrigin && validOrigins.includes(productOrigin)
      ? productOrigin
      : 'any';

  // ── Run routing algorithm ─────────────────────────────────────────────────
  try {
    const recommendation = selectWarehouse({
      destinationCountryCode: country,
      weightKg,
      productValueAED,
      preference: resolvedPreference,
      productOrigin: resolvedOrigin,
    });

    // Round all monetary values to 2 decimals for clean JSON
    const round = (n: number) => Math.round(n * 100) / 100;

    const sanitize = (detail: typeof recommendation.recommended) => ({
      warehouse: detail.warehouse,
      totalCostAED: round(detail.totalCostAED),
      shippingCostAED: round(detail.shippingCostAED),
      customsDutyAED: round(detail.customsDutyAED),
      vatAED: round(detail.vatAED),
      estimatedDays: detail.estimatedDays,
      savingsVsAlternativeAED: round(detail.savingsVsAlternativeAED),
    });

    return NextResponse.json(
      {
        success: true,
        input: {
          country: countryConfig.code,
          countryName: countryConfig.name,
          countryNameAr: countryConfig.nameAr,
          weightKg,
          productValueAED: round(productValueAED),
          preference: resolvedPreference,
          productOrigin: resolvedOrigin,
        },
        recommendation: {
          recommendedWarehouse: recommendation.recommendedWarehouse,
          alternativeWarehouse: recommendation.alternativeWarehouse,
          recommended: sanitize(recommendation.recommended),
          alternative: sanitize(recommendation.alternative),
          reasoning: recommendation.reasoning,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
