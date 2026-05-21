"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const ads = [
  {
    id: 1,
    title: "PAYDAY SALE",
    subtitle: "25-30 JUN",
    highlight: "UP TO AED 3,100.-",
    description: "Month End Voucher - Collect Now!",
    badge: "FREE",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop",
  },
  {
    id: 2,
    title: "FLASH SALE",
    subtitle: "ENDS IN 2H",
    highlight: "-70% OFF",
    description: "Limited Time Only - Don't Miss Out!",
    badge: "HOT",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=600&fit=crop",
  },
  {
    id: 3,
    title: "FREE SHIPPING",
    subtitle: "NO MINIMUM",
    highlight: "AED 0 DELIVERY",
    description: "On All Orders Today",
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&h=600&fit=crop",
  },
  {
    id: 4,
    title: "MEGA BRANDS",
    subtitle: "OFFICIAL STORE",
    highlight: "UP TO 80%",
    description: "Authentic Products Guaranteed",
    badge: "MALL",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=600&fit=crop",
  },
  {
    id: 5,
    title: "DAILY COINS",
    subtitle: "CHECK IN NOW",
    highlight: "AED 500 COINS",
    description: "Collect & Save More",
    badge: "EARN",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
  },
  {
    id: 6,
    title: "VIP EXCLUSIVE",
    subtitle: "MEMBERS ONLY",
    highlight: "EXTRA 25%",
    description: "Unlock Premium Deals & Rewards",
    badge: "VIP",
    image: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=1200&h=600&fit=crop",
  },
  {
    id: 7,
    title: "LEE BEAUTY",
    subtitle: "BEAUTY FEST",
    highlight: "BUY 1 GET 1",
    description: "Premium Skincare & Makeup",
    badge: "B1G1",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=600&fit=crop",
  },
  {
    id: 8,
    title: "TECH WEEK",
    subtitle: "GADGET SALE",
    highlight: "-60% OFF",
    description: "Electronics & Accessories",
    badge: "TECH",
    image: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=1200&h=600&fit=crop",
  },
  {
    id: 9,
    title: "FASHION DAY",
    subtitle: "STYLE DEALS",
    highlight: "FROM AED 99",
    description: "Trending Clothes & Shoes",
    badge: "STYLE",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=600&fit=crop",
  },
  {
    id: 10,
    title: "MIDNIGHT",
    subtitle: "12AM - 2AM",
    highlight: "EXTRA 20%",
    description: "Night Owl Special Discount",
    badge: "NIGHT",
    image: "https://images.unsplash.com/photo-1492552181161-62217fc3076d?w=1200&h=600&fit=crop",
  },
  {
    id: 11,
    title: "NEW USER",
    subtitle: "WELCOME GIFT",
    highlight: "AED 200 OFF",
    description: "First Purchase Discount",
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&h=600&fit=crop",
  },
  {
    id: 12,
    title: "BUNDLE SALE",
    subtitle: "BUY MORE SAVE",
    highlight: "3 FOR AED 299",
    description: "Mix & Match Any Items",
    badge: "BUNDLE",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
  },
  {
    id: 13,
    title: "CLEARANCE",
    subtitle: "LAST CHANCE",
    highlight: "UP TO 90%",
    description: "While Stocks Last",
    badge: "SALE",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop",
  },
  {
    id: 14,
    title: "HOME LIVING",
    subtitle: "DECOR DEALS",
    highlight: "-50% OFF",
    description: "Furniture & Home Items",
    badge: "HOME",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=600&fit=crop",
  },
  {
    id: 15,
    title: "PET LOVERS",
    subtitle: "FURRY FRIENDS",
    highlight: "FROM AED 49",
    description: "Pet Food & Accessories",
    badge: "PETS",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&h=600&fit=crop",
  },
  {
    id: 16,
    title: "SPORTS FEST",
    subtitle: "GET ACTIVE",
    highlight: "-40% OFF",
    description: "Fitness & Outdoor Gear",
    badge: "FIT",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&h=600&fit=crop",
  },
  {
    id: 17,
    title: "BOOK SALE",
    subtitle: "KNOWLEDGE",
    highlight: "3 FOR AED 199",
    description: "Bestsellers & New Releases",
    badge: "BOOK",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=600&fit=crop",
  },
  {
    id: 18,
    title: "BABY & KIDS",
    subtitle: "LITTLE ONES",
    highlight: "UP TO 60%",
    description: "Toys, Clothes & Essentials",
    badge: "KIDS",
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1200&h=600&fit=crop",
  },
  {
    id: 19,
    title: "LEE MALL DAY",
    subtitle: "AUTHENTIC",
    highlight: "EXTRA 15%",
    description: "Official Brand Stores Only",
    badge: "MALL",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=600&fit=crop",
  },
  {
    id: 20,
    title: "WEEKEND",
    subtitle: "SAT-SUN ONLY",
    highlight: "AED 100 OFF",
    description: "Use Code: LEEWEEKEND",
    badge: "CODE",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
  },
]

export function AnimatedAds() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating])

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % ads.length)
  }, [currentSlide, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + ads.length) % ads.length)
  }, [currentSlide, goToSlide])

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [nextSlide, isPaused])

  const currentAd = ads[currentSlide]

  return (
    <div 
      className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Full-Bleed Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={currentAd.image}
          alt={currentAd.title}
          fill
          className={`object-cover transition-all duration-700 ease-out ${isAnimating ? 'scale-105 opacity-80' : 'scale-100 opacity-100'}`}
          sizes="100vw"
          priority={currentSlide < 3}
        />
      </div>

      {/* Dark Gradient Overlay - Left to Right */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      
      {/* Additional bottom gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      {/* Content - Text on Left Side */}
      <div className="relative h-full flex items-center px-4 sm:px-6 md:px-8 pt-14 sm:pt-16">
        <div className="z-10 max-w-[70%] sm:max-w-[60%] md:max-w-[50%]">
          {/* Badge */}
          <div 
            className={`inline-flex items-center gap-1.5 bg-[#f85c98] px-2.5 py-1 rounded-full text-white text-[10px] sm:text-xs font-bold mb-2 transition-all duration-500 ${isAnimating ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}
          >
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            {currentAd.badge}
          </div>

          {/* Title */}
          <h2 
            className={`text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none mb-1 drop-shadow-lg transition-all duration-500 delay-75 ${isAnimating ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}`}
          >
            {currentAd.title}
          </h2>

          {/* Subtitle */}
          <p 
            className={`text-[#f85c98] text-sm sm:text-base md:text-lg font-bold mb-2 drop-shadow-md transition-all duration-500 delay-100 ${isAnimating ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}`}
          >
            {currentAd.subtitle}
          </p>

          {/* Highlight Price/Discount */}
          <div 
            className={`flex items-baseline gap-2 mb-2 transition-all duration-500 delay-150 ${isAnimating ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}
          >
            <span className="text-yellow-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black drop-shadow-lg">
              {currentAd.highlight}
            </span>
          </div>

          {/* Description */}
          <p 
            className={`text-white/90 text-xs sm:text-sm md:text-base mb-3 drop-shadow-md transition-all duration-500 delay-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
          >
            {currentAd.description}
          </p>

          {/* CTA Button */}
          <button 
            className={`bg-[#f85c98] hover:bg-[#e04d85] text-white px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slide Counter */}
      <div className="absolute bottom-3 right-4 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full text-white text-xs font-medium z-20">
        {currentSlide + 1}/{ads.length}
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {ads.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide % 5 === index 
                ? 'bg-[#f85c98] w-6' 
                : 'bg-white/50 w-2 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
