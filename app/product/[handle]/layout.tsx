import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params

  return {
    title: 'Product | 4LEEE',
    description: 'Shop quality products at 4LEEE with the best prices and free shipping.',
    openGraph: {
      title: 'Product | 4LEEE',
      description: 'Shop quality products at 4LEEE with the best prices and free shipping.',
      url: `https://www.4leee.com/product/${handle}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Product | 4LEEE',
      description: 'Shop quality products at 4LEEE',
    },
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
