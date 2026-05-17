import { Suspense } from "react"
import { SearchHeader } from "@/components/lee/search-header"
import { MercuryStatusBar } from "@/components/lee/mercury-status-bar"
import { AnimatedAds } from "@/components/lee/animated-ads"
import { BenefitsBar } from "@/components/lee/benefits-bar"
import { CategoryIcons } from "@/components/lee/category-icons"
import { VoucherSection } from "@/components/lee/voucher-section"
import { FlashSale } from "@/components/lee/flash-sale"
import { ShopifyProducts } from "@/components/lee/shopify-products"
import { DailyDeals } from "@/components/lee/daily-deals"
import { BottomNav } from "@/components/lee/bottom-nav-new"
import { RecGPTV2 } from "@/components/lee/recgpt-v2"
import { RecentlyViewedSection } from "@/components/lee/recently-viewed-section"
import { AnimatedAdsBottom } from "@/components/lee/animated-ads-bottom"
import { fetchAllProducts } from "@/lib/shopify"

export const revalidate = 3600 // Revalidate every hour

function ProductsLoading() {
  return (
    <div className="bg-white mx-3 mt-3 rounded-xl overflow-hidden p-3">
      <div className="grid grid-cols-2 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="mt-2 h-3 bg-gray-200 rounded w-3/4" />
            <div className="mt-1 h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductsError() {
  return (
    <div className="bg-white mx-3 mt-3 rounded-xl overflow-hidden p-6 text-center">
      <p className="text-gray-500 text-sm">Unable to load products. Please try again.</p>
    </div>
  )
}

export default async function LEEHome() {
  let allProducts: any[] = []
  let initialPageInfo = { hasNextPage: false, endCursor: null as string | null }
  try {
    const result = await fetchAllProducts()
    allProducts = result.products
    initialPageInfo = result.pageInfo
  } catch (error) {
    console.error('[v0] Error fetching products:', error)
  }
  return (
    <div className="min-h-screen min-h-dvh bg-gray-200 flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen min-h-dvh bg-gray-100 flex flex-col shadow-none sm:shadow-2xl relative">
        <MercuryStatusBar />
        <main className="flex-1 overflow-y-auto pb-20 hide-scrollbar">
          <div className="relative">
            <AnimatedAds />
            <div className="absolute top-0 left-0 right-0 z-20">
              <SearchHeader />
            </div>
          </div>
          <BenefitsBar />
          <CategoryIcons />
          <VoucherSection />
          <FlashSale />
          <DailyDeals />
          <AnimatedAdsBottom />
          <RecentlyViewedSection />
          <Suspense fallback={<ProductsLoading />}>
            <RecGPTV2 limit={12} />
          </Suspense>
          {allProducts.length === 0 ? (
            <ProductsError />
          ) : (
            <Suspense fallback={<ProductsLoading />}>
              <ShopifyProducts products={allProducts} initialPageInfo={initialPageInfo} />
            </Suspense>
          )}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
