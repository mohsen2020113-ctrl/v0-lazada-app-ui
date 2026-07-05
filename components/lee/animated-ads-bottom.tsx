"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const ads = [
  {
    id: 1,
    title: "CLEARANCE SALE",
    subtitle: "LAST CHANCE",
    highlight: "UP TO 90% OFF",
    description: "Everything Must Go!",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop",
  },
  {
    id: 2,
    title: "MID-YEAR SALE",
    subtitle: "BIGGEST EVENT",
    highlight: "SAVE AED 10,000",
    description: "Half Year Mega Deals",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop",
  },
  {
    id: 3,
    title: "EXCLUSIVE DEALS",
    subtitle: "APP ONLY",
    highlight: "EXTRA 30% OFF",
    description: "Download & Save More",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
  },
  {
    id: 4,
    title: "BRAND DAY",
    subtitle: "OFFICIAL STORES",
    highlight: "BUY 2 GET 1",
    description: "Top Brands Big Discounts",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
  },
  {
    id: 5,
    title: "DOUBLE DISCOUNT",
    subtitle: "STACK & SAVE",
    highlight: "2X SAVINGS",
    description: "Vouchers + Sale Prices",
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200&h=600&fit=crop",
  },
  {
    id: 6,
    title: "CASHBACK OFFERS",
    subtitle: "GET MONEY BACK",
    highlight: "UP TO AED 2,000",
    description: "Shop Now, Earn Later",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop",
  },
  {
    id: 7,
    title: "LOYALTY REWARDS",
    subtitle: "MEMBERS EARN",
    highlight: "5X POINTS",
    description: "Redeem for Free Items",
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&h=600&fit=crop",
  },
  {
    id: 8,
    title: "WEEKEND FLASH",
    subtitle: "48 HOURS ONLY",
    highlight: "70% OFF",
    description: "Limited Time Weekend Deals",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop",
  },
  {
    id: 9,
    title: "HAPPY HOUR",
    subtitle: "12PM - 2PM DAILY",
    highlight: "FLASH PRICES",
    description: "2 Hours of Crazy Deals",
    image: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=1200&h=600&fit=crop",
  },
  {
    id: 10,
    title: "BUY MORE SAVE MORE",
    subtitle: "BULK DISCOUNT",
    highlight: "UP TO 50% OFF",
    description: "The More You Buy, The More You Save",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
  },
  {
    id: 11,
    title: "SUMMER COLLECTION",
    subtitle: "NEW ARRIVALS",
    highlight: "AED 199 ONWARDS",
    description: "Hot Styles for Hot Days",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=600&fit=crop",
  },
  {
    id: 12,
    title: "WINTER SALE",
    subtitle: "COZY SEASON",
    highlight: "40% OFF",
    description: "Warm Up Your Wardrobe",
    image: "https://images.unsplash.com/photo-1457545195570-67f207084966?w=1200&h=600&fit=crop",
  },
  {
    id: 13,
    title: "ANNIVERSARY SALE",
    subtitle: "THANK YOU",
    highlight: "AED 11.11 DEALS",
    description: "Celebrating With Big Savings",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&h=600&fit=crop",
  },
  {
    id: 14,
    title: "STAFF PICKS",
    subtitle: "CURATED FOR YOU",
    highlight: "BEST SELLERS",
    description: "Our Team's Top Recommendations",
    image: "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=1200&h=600&fit=crop",
  },
  {
    id: 15,
    title: "TRENDING NOW",
    subtitle: "WHAT'S HOT",
    highlight: "#1 SELLING",
    description: "Shop What Everyone Loves",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=600&fit=crop",
  },
  {
    id: 16,
    title: "HOTTEST DEALS",
    subtitle: "SELLING FAST",
    highlight: "LIMITED STOCK",
    description: "Don't Miss These Bargains",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop",
  },
  {
    id: 17,
    title: "MEMBER EXCLUSIVE",
    subtitle: "SIGN UP NOW",
    highlight: "AED 500 OFF",
    description: "New Member Welcome Gift",
    image: "https://images.unsplash.com/photo-1556742208-999815fca738?w=1200&h=600&fit=crop",
  },
  {
    id: 18,
    title: "FLASH VOUCHER",
    subtitle: "CLAIM NOW",
    highlight: "AED 100 OFF",
    description: "Use Before Midnight",
    image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200&h=600&fit=crop",
  },
  {
    id: 19,
    title: "FREE GIFT",
    subtitle: "WITH PURCHASE",
    highlight: "WORTH AED 999",
    description: "Spend AED 1,500 Get Free Gift",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&h=600&fit=crop",
  },
  {
    id: 20,
    title: "COLLECTOR'S EDITION",
    subtitle: "LIMITED RUN",
    highlight: "EXCLUSIVE",
    description: "Rare Items for True Fans",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop",
  },
]

export function AnimatedAdsBottom() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ads.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + ads.length) % ads.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % ads.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const currentAd = ads[currentSlide]

  return (
    <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden mx-3 my-3 rounded-xl" style={{ widur: 'calc(100% - 1.5rem)' }}>
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <Image
          src={currentAd.image}
          alt={currentAd.title}
          fill
          className="object-cover transition-transform duration-700"
          priority={currentSlide < 2}
          sizes="100vw"
        />
      </div>

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />

      {/* Text content overlaid on left */}
      <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-8 z-10">
        <div className="max-w-[65%] sm:max-w-[55%]">
          {/* Subtitle badge */}
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded mb-1.5 uppercase tracking-wider">
            {currentAd.subtitle}
          </span>
          
          {/* Main title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight mb-1 drop-shadow-lg">
            {currentAd.title}
          </h2>
          
          {/* Highlight price/discount */}
          <p className="text-lg sm:text-xl md:text-2xl font-extrabold text-yellow-400 mb-1 drop-shadow-md">
            {currentAd.highlight}
          </p>
          
          {/* Description */}
          <p className="text-white/90 text-xs sm:text-sm mb-3 drop-shadow">
            {currentAd.description}
          </p>
          
          {/* Shop Now button */}
          <button className="bg-white text-gray-900 font-bold text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-full hover:bg-yellow-400 transition-colors shadow-lg">
            Shop Now
          </button>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors z-20"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors z-20"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Slide counter */}
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded z-20">
        {currentSlide + 1}/{ads.length}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
        {ads.slice(0, 10).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              currentSlide === index ? 'bg-white w-3' : 'bg-white/50'
            }`}
          />
        ))}
        {ads.length > 10 && (
          <span className="text-white/70 text-[8px] ml-1">+{ads.length - 10}</span>
        )}
      </div>
    </div>
  )
}
