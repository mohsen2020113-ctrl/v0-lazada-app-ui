# خطة العمل والإصلاحات | Action Plan & Fixes

## الأولويات الفورية | Immediate Priorities

### 1️⃣ إصلاح صفحة المنتج (CRITICAL)

**المشكلة:**
صفحة `/product/[handle]` لا تستخدم معرّف المنتج من URL وتعرض دائماً نفس المنتج (Floor Cleaner Mop).

**السبب:**
الصفحة الحالية تستخدم `mockProduct` بدلاً من جلب المنتج من Shopify بناءً على `params.handle`.

**الحل المقترح:**

```typescript
// app/product/[handle]/page.tsx

'use server'  // استخدام Server Component

import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/shopify'
import { fetchAllProducts } from '@/lib/shopify'

interface Props {
  params: { handle: string }
}

export default async function ProductPage({ params }: Props) {
  // فك تشفير handle من URL
  const decodedHandle = decodeURIComponent(params.handle)
  
  // 1. حاول الحصول على المنتج من Shopify API
  let product = await getProduct(decodedHandle)
  
  // 2. إذا فشل، جلب جميع المنتجات والبحث
  if (!product) {
    const allProducts = await fetchAllProducts()
    product = allProducts?.products?.find(
      p => p.handle.toLowerCase() === decodedHandle.toLowerCase()
    )
  }
  
  // 3. إذا لم يجد المنتج، أظهر صفحة 404
  if (!product) {
    notFound()
  }
  
  return (
    <div>
      {/* عرض المنتج */}
      <ProductHeader product={product} />
      <ProductGallery images={product.images} />
      {/* ... باقي المكونات */}
    </div>
  )
}
```

**الجهد:** 2-3 ساعات
**الفائدة:** جميع المنتجات ستعرض البيانات الصحيحة

---

### 2️⃣ إزالة Dynamic Server Usage من الصفحة الرئيسية

**المشكلة:**
```
Route / couldn't be rendered statically because it used `cookies`
```

**السبب:**
استخدام `cookies()` في صفحة غير server component أو server component غير محسّن.

**الحل:**

```typescript
// app/page.tsx

// الطريقة 1: نقل استخدام cookies إلى middleware
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const locale = request.cookies.get('lee_country')?.value ?? 'ae'
  // معالجة locale
  return NextResponse.next()
}

// الطريقة 2: استخدام localStorage في Client Component
'use client'

useEffect(() => {
  const locale = localStorage.getItem('lee_country') ?? 'ae'
  // معالجة locale
}, [])
```

**الجهد:** 1-2 ساعات
**الفائدة:** تحسين الأداء والبناء

---

### 3️⃣ إصلاح Shopify Sitemap Errors

**المشكلة:**
```
Cannot read properties of undefined (reading 'handle')
```

**السبب:**
عدم معالجة null/undefined responses من Shopify API.

**الحل:**

```typescript
// lib/shopify.ts

export async function fetchCollections() {
  try {
    const collections = await shopifyFetch({
      query: COLLECTIONS_QUERY
    })
    
    // إضافة null checks
    return {
      collections: collections?.data?.collections?.edges
        ?.map(edge => ({
          handle: edge.node.handle || 'unknown',
          title: edge.node.title || 'Untitled',
          // ...
        }))
        .filter(Boolean) || []
    }
  } catch (error) {
    console.error('[v0] Error fetching collections:', error)
    return { collections: [] }
  }
}
```

**الجهد:** 30-45 دقيقة
**الفائدة:** Sitemap سيعمل بدون أخطاء

---

## تحسينات الأداء | Performance Improvements

### ضغط الصور (Image Optimization)

**المشكلة:**
صور المنتجات كبيرة جداً (11.8 MB إجمالي).

**الحل:**

```bash
# استخدام ImageMagick أو FFmpeg للضغط
for file in public/products/*.png; do
  convert "$file" -resize 50% -quality 80 "$file"
done

# أو استخدام Sharp
npm install sharp

# script.js
const sharp = require('sharp');
const fs = require('fs');

const files = fs.readdirSync('./public/products');
files.forEach(file => {
  if (file.endsWith('.png')) {
    sharp(`./public/products/${file}`)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(`./public/products/${file.replace('.png', '.webp')}`)
  }
})
```

**النتيجة:** تقليل الحجم بـ 70%
**الجهد:** 1 ساعة

---

### تحسين استخدام البيانات

```typescript
// استخدام pagination بدلاً من جلب جميع المنتجات
export async function fetchAllProducts(locale: string, limit = 20, cursor = null) {
  const query = `
    query {
      products(first: ${limit}, after: "${cursor}") {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            // ... باقي الحقول
          }
        }
      }
    }
  `
  return shopifyFetch({ query })
}
```

---

## إضافة Error Boundaries

```typescript
// app/error.tsx

'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[v0] Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
```

---

## خطة التنفيذ | Implementation Timeline

### يوم 1: الإصلاحات الحرجة
- [ ] إصلاح صفحة المنتج (2-3 ساعات)
- [ ] إزالة Dynamic Server Usage (1-2 ساعات)
- [ ] إصلاح Sitemap errors (30-45 دقيقة)

### يوم 2: تحسينات الأداء
- [ ] ضغط الصور (1 ساعة)
- [ ] تحسين Shopify queries (1-2 ساعات)
- [ ] إضافة Error Boundaries (1 ساعة)

### يوم 3: الاختبار والتحقق
- [ ] اختبار شامل لجميع الصفحات
- [ ] اختبار الأداء
- [ ] Deployment

---

## قائمة التحقق | Checklist

### قبل الإطلاق:
- [ ] جميع الصفحات تحمل بدون أخطاء
- [ ] صفحة المنتج تعرض البيانات الصحيحة لكل منتج
- [ ] Sitemap يعمل بنجاح
- [ ] جميع الصور تحمل بسرعة
- [ ] لا توجد console errors
- [ ] Mobile responsive
- [ ] Lighthouse score > 80

### الأمان:
- [ ] لا توجد XSS vulnerabilities
- [ ] CORS مكوّن بشكل صحيح
- [ ] API keys محمية
- [ ] User data encrypted

### الأداء:
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Page load < 3s

---

## الموارد والمراجع

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Shopify GraphQL Admin API](https://shopify.dev/api/admin-graphql)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React 19 Docs](https://react.dev)

---

**ملاحظة مهمة:** يجب اختبار جميع التغييرات محلياً أولاً قبل الـ production deployment.
