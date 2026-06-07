import type { Metadata } from 'next'
import { shopifyFetch } from '@/lib/shopify'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params

  try {
    const data = await shopifyFetch<{
      product: {
        title: string
        description: string
        featuredImage: { url: string; altText: string } | null
      } | null
    }>(`{ product(handle: "${handle}") { title description featuredImage { url altText } } }`)

    const product = data?.product

    if (!product) {
      return {
        title: 'Product | 4LEEE',
        description: 'Shop quality products at 4LEEE.',
      }
    }

    const title = `${product.title} | 4LEEE`
    const description =
      product.description?.substring(0, 155) ||
      `Buy ${product.title} at the best price. Free shipping.`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://www.4leee.com/product/${handle}`,
        type: 'website',
        images: product.featuredImage
          ? [
              {
                url: product.featuredImage.url,
                width: 800,
                height: 800,
                alt: product.featuredImage.altText || product.title,
              },
            ]
          : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: product.featuredImage ? [product.featuredImage.url] : [],
      },
    }
  } catch {
    return {
      title: 'Product | 4LEEE',
      description: 'Shop quality products at 4LEEE with the best prices and free shipping.',
    }
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
