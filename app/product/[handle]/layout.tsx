import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Product Details - 4LEEE',
  description: 'Browse product details on 4LEEE online shopping marketplace',
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children
}
