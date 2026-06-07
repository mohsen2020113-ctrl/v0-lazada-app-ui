'use client'

import { Star, ChevronRight, ImageIcon, ShoppingBag } from 'lucide-react'

interface ReviewItem {
  id: string
  author: string
  rating: number
  text: string
  images: string[]
}

interface ProductReviewsProps {
  rating: number
  totalReviews: number
}

const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: '1',
    author: 'Praneet P.',
    rating: 5,
    text: 'Smooth-rolling wheels, perfect for organizing items, convenient and genuinely useful.',
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200',
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200',
    ],
  },
  {
    id: '2',
    author: 'Abalone M.',
    rating: 5,
    text: 'Saves space in the kitchen, convenient and works just as described.',
    images: [
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=200',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200',
    ],
  },
  {
    id: '3',
    author: 'Kanya S.',
    rating: 5,
    text: 'Versatile and useful, elegant white color, convenient and easy to use, sturdy and durable.',
    images: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=200'],
  },
]

export function ProductReviews({ rating, totalReviews }: ProductReviewsProps) {
  return (
    <div className="bg-white">
      {/* Reviews header */}
      <div className="flex items-center justify-between px-4 pt-5">
        <h2 className="text-lg font-bold text-foreground">
          Reviews <span className="text-muted-foreground">({totalReviews.toLocaleString()})</span>
        </h2>
        <button className="flex items-center gap-1 text-foreground">
          <span className="text-lg font-bold">{rating.toFixed(1)}</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#FFB400] text-[#FFB400]" />
            ))}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* AI Summary */}
      <div className="mx-4 mt-4 rounded-2xl bg-[#F4F2FF] p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">AI Summary</h3>
          <span className="text-sm font-semibold text-[#7B5CFF]">Powered by AI from genuine reviews</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-foreground/80">
          This product is well-designed, compact, and offers great storage capacity, making it perfect for organizing
          items. Its smooth-rolling wheels and easy assembly enhance usability. Customers appreciate its{' '}
          <span className="font-semibold text-muted-foreground">more</span>
        </p>
      </div>

      {/* Filter chips */}
      <div className="flex gap-3 px-4 py-4">
        <button className="flex items-center gap-2 rounded-lg bg-[#FFF4ED] px-4 py-2.5 text-sm font-medium text-[#A05A2C]">
          <ImageIcon className="h-4 w-4" />
          With images/videos (456)
        </button>
        <button className="flex items-center gap-2 rounded-lg bg-[#FFF4ED] px-4 py-2.5 text-sm font-medium text-[#A05A2C]">
          <ShoppingBag className="h-4 w-4" />
          Repeat customer (186)
        </button>
      </div>

      {/* Review list */}
      <div className="divide-y divide-border">
        {MOCK_REVIEWS.map((review) => (
          <div key={review.id} className="px-4 py-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <p className="text-base leading-relaxed text-foreground">{review.text}</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'fill-[#FFB400] text-[#FFB400]' : 'text-border'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{review.author}</span>
                </div>
              </div>
              {review.images.length > 0 && (
                <div className="flex gap-2">
                  {review.images.slice(0, 2).map((img, idx) => (
                    <div key={idx} className="relative h-20 w-20 overflow-hidden rounded-lg">
                      <img
                        src={img || '/placeholder.svg'}
                        alt="Review"
                        className="h-full w-full object-cover"
                        crossOrigin="anonymous"
                      />
                      {idx === 1 && (
                        <div className="absolute bottom-1 right-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          +1
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-4 text-center text-sm font-semibold text-primary">View all reviews</button>
    </div>
  )
}
