import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, limit, serverTimestamp } from 'firebase/firestore';

interface CompetitorPrice {
  noon?: number;
  amazon?: number;
  jumia?: number;
  price: number;
}

interface PriceIntelligenceInput {
  productId: string;
  competitorPrices: CompetitorPrice[];
}

export async function POST(request: NextRequest) {
  try {
    const body: PriceIntelligenceInput = await request.json();
    const { productId, competitorPrices } = body;

    if (!productId || !competitorPrices || competitorPrices.length === 0) {
      return NextResponse.json(
        { error: 'productId and competitorPrices required' },
        { status: 400 }
      );
    }

    const ourPrice = competitorPrices[0].price;
    const competitorOnlyPrices = [
      competitorPrices[0].noon,
      competitorPrices[0].amazon,
      competitorPrices[0].jumia,
    ].filter((p): p is number => p !== undefined);

    const lowestCompetitor = Math.min(...competitorOnlyPrices, ourPrice);
    const margin = ourPrice - lowestCompetitor;
    const marginPercent = ((margin / ourPrice) * 100).toFixed(2);

    let recommendation = 'MAINTAIN';
    if (ourPrice > lowestCompetitor * 1.15) {
      recommendation = 'REDUCE';
    } else if (ourPrice < lowestCompetitor * 0.95) {
      recommendation = 'INCREASE';
    }

    const priceRecord = {
      productId,
      ourPrice,
      competitorPrices: competitorPrices[0],
      lowestCompetitor,
      margin,
      marginPercent,
      recommendation,
      timestamp: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'price_intelligence'), priceRecord);

    const historyQuery = query(
      collection(db, 'price_intelligence'),
      where('productId', '==', productId),
      orderBy('timestamp', 'desc'),
      limit(30)
    );

    const historyDocs = await getDocs(historyQuery);
    const priceHistory = historyDocs.docs.map((doc) => ({
      date: doc.data().timestamp,
      price: doc.data().ourPrice,
    }));

    const alert =
      recommendation === 'REDUCE'
        ? `Price ${marginPercent}% above lowest competitor (${lowestCompetitor} AED)`
        : recommendation === 'INCREASE'
        ? `Price ${marginPercent}% below lowest competitor (${lowestCompetitor} AED)`
        : undefined;

    return NextResponse.json({
      recommendation,
      ourPrice,
      lowestCompetitor,
      margin,
      marginPercent,
      priceHistory,
      alert,
      recordId: docRef.id,
    });
  } catch (error) {
    console.error('Price intelligence error:', error);
    return NextResponse.json({ error: 'Price analysis failed' }, { status: 500 });
  }
}
