import type { Metadata } from 'next'
import { Geist, Geist_Mono, Noto_Sans_Arabic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from './providers'
import { ServiceWorkerRegistration } from '@/components/service-worker-registration'
import { LEEAssistant } from '@/components/lee/LEEAssistant'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _notoSansArabic = Noto_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.4leee.com'),
  title: 'LEE - Shop Online | Best Deals & Free Shipping',
  description: 'Discover LEE - Your ultimate online shopping destination. Browse millions of products with amazing discounts and free shipping. Shop now!',
    viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.4leee.com',
    siteName: 'LEE',
    title: 'LEE - Shop Online',
    description: 'Your ultimate online shopping destination with amazing deals and free shipping',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LEE - Shop Online',
    description: 'Your ultimate online shopping destination',
  },
  robots: 'index, follow',
  alternates: {
    canonical: 'https://www.4leee.com',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#f85c98',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-gray-100" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-sans antialiased bg-gray-100 min-h-screen min-h-dvh overflow-x-hidden">
        <Providers>
          {children}
        </Providers>
        <ServiceWorkerRegistration />
        <LEEAssistant />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
