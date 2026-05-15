import { ImageQualityResult } from '@/app/api/image-quality/route';

export async function analyzeImageQuality(imageUrl: string): Promise<ImageQualityResult> {
  try {
    const response = await fetch('/api/image-quality', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      throw new Error(`Image quality analysis failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[v0] Image quality analysis error:', error);
    throw error;
  }
}

export function getQualityBadge(score: number): {
  label: string;
  color: string;
  textColor: string;
} {
  if (score >= 85) {
    return { label: 'Excellent', color: 'bg-green-100', textColor: 'text-green-800' };
  }
  if (score >= 70) {
    return { label: 'Good', color: 'bg-blue-100', textColor: 'text-blue-800' };
  }
  if (score >= 50) {
    return { label: 'Fair', color: 'bg-yellow-100', textColor: 'text-yellow-800' };
  }
  return { label: 'Poor', color: 'bg-red-100', textColor: 'text-red-800' };
}

export function formatQualityScore(score: number): string {
  return `${Math.round(score)}/100`;
}

export function shouldApproveImage(result: ImageQualityResult): boolean {
  return result.approved && result.score >= 60;
}

export function getIssuesArabic(issues: string[]): Record<string, string> {
  const translations: Record<string, string> = {
    'Low lighting': 'إضاءة منخفضة',
    'Uneven lighting': 'إضاءة غير متساوية',
    'Dark shadows': 'ظلال قاسية',
    'Blurry image': 'صورة ضبابية',
    'Low resolution': 'دقة منخفضة',
    'Cluttered background': 'خلفية مشوشة',
    'Product partially hidden': 'المنتج مختبأ جزئياً',
    'Inaccurate colors': 'ألوان غير دقيقة',
    'Product cut off': 'المنتج مقطوع',
    'Distorted angles': 'زوايا مشوهة',
  };

  return issues.map((issue) => translations[issue] || issue).reduce(
    (acc, issue, idx) => ({
      ...acc,
      [`issue_${idx + 1}`]: issue,
    }),
    {}
  );
}

export function getSuggestionsArabic(suggestions: string[]): Record<string, string> {
  const translations: Record<string, string> = {
    'Improve lighting': 'تحسين الإضاءة',
    'Use natural light': 'استخدام الضوء الطبيعي',
    'Increase resolution': 'زيادة الدقة',
    'Simplify background': 'تبسيط الخلفية',
    'Show full product': 'عرض المنتج بالكامل',
    'Correct color balance': 'تصحيح توازن الألوان',
    'Adjust angle': 'تعديل الزاوية',
    'Remove distractions': 'إزالة المشتتات',
    'Focus on product': 'التركيز على المنتج',
    'Better composition': 'تكوين أفضل',
  };

  return suggestions.map((suggestion) => translations[suggestion] || suggestion).reduce(
    (acc, suggestion, idx) => ({
      ...acc,
      [`suggestion_${idx + 1}`]: suggestion,
    }),
    {}
  );
}
