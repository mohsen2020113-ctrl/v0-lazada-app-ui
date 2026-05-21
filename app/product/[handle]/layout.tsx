import type { Metadata } from 'next'
import { shopifyFetch } from '@/lib/shopify'

export async function generateMetadata({
  params,
  }: {
    params: { handle: string }
    }): Promise<Metadata> {
      const { handle } = params

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
                                                                          title: 'Product | LEE',
                                                                                  description: 'Shop quality products at LEE.',
                                                                                        }
                                                                                            }

                                                                                                const title = `${product.title} | LEE`
                                                                                                    const description =
                                                                                                          product.description?.substring(0, 155) ||
                                                                                                                `Buy ${product.title} at the best price. Free shipping to UAE.`

                                                                                                                    return {
                                                                                                                          title,
                                                                                                                                description,
                                                                                                                                      openGraph: {
                                                                                                                                              title,
                                                                                                                                                      description,
                                                                                                                                                              url: `https://www.4leee.com/product/${handle}`,
                                                                                                                                                                      type: 'website',
                                                                                                                                                                              images: product.featuredImage
                                                                                                                                                                                        ? [{ url: product.featuredImage.url, width: 800, height: 800, alt: product.featuredImage.altText || product.title }]
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
                                                                                                                                                                                                                                                                    title: 'Product | LEE',
                                                                                                                                                                                                                                                                          description: 'Shop quality products at LEE with the best prices and free shipping.',
                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                export default function ProductLayout({ children }: { children: React.ReactNode }) {
                                                                                                                                                                                                                                                                                  return <>{children}</>
                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                                  