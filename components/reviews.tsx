'use client'
import { useState } from 'react'
import { Star, ThumbsUp, X } from 'lucide-react'

interface Review {
  id: string
  author: string
  rating: number
  title: string
  text: string
  helpful: number
  date: string
  verified: boolean
}

interface ReviewsProps {
  productId: string
  reviews?: Review[]
  averageRating?: number
  totalReviews?: number
  onAddReview?: (review: Omit<Review, 'id' | 'date'>) => void
}

export function Reviews({ 
  productId, 
  reviews = MOCK_REVIEWS, 
  averageRating = 4.6, 
  totalReviews = 1247,
  onAddReview 
}: ReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [formData, setFormData] = useState({ rating: 5, title: '', text: '' })
  const [selectedRating, setSelectedRating] = useState<number | null>(null)

  const handleSubmitReview = () => {
    if (!formData.title.trim() || !formData.text.trim()) return
    onAddReview?.({
      author: 'أنت',
      rating: formData.rating,
      title: formData.title,
      text: formData.text,
      helpful: 0,
      verified: true,
    })
    setFormData({ rating: 5, title: '', text: '' })
    setShowReviewForm(false)
  }

  const filteredReviews = selectedRating 
    ? reviews.filter(r => r.rating === selectedRating)
    : reviews

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
  }))

  return (
    <div className="bg-[#0F0F0F] px-5 py-8" dir="ltr">
      {/* Rating Summary */}
      <div className="mb-8">
        <h2 className="text-white font-bold text-lg mb-6">الreviewsات والمراجعات</h2>
        
        <div className="bg-[#1A1A1A] rounded-2xl p-5 mb-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white font-bold text-3xl">{averageRating}</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}
                    />
                  ))}
                </div>
              </div>
              <p className="text-white/50 text-xs">{totalReviews} reviews</p>
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-[#F57224] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#F57224]/80 transition-colors"
            >
              Write Review
            </button>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-3">
            {ratingDistribution.map(({ rating, count }) => {
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
              return (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                  className="w-full flex items-center gap-2 text-xs group"
                >
                  <span className="text-white/50 w-8">{rating}⭐</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden group-hover:bg-white/10 transition-colors">
                    <div
                      className="h-full bg-yellow-400 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-white/50 text-right min-w-fit">{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-[#1A1A1A] rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white font-bold">Add Your Review</p>
              <button onClick={() => setShowReviewForm(false)} className="text-white/50">
                <X size={16} />
              </button>
            </div>

            {/* Star Rating Selector */}
            <div className="mb-4">
              <p className="text-white/50 text-xs mb-2">الreviews</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setFormData(p => ({ ...p, rating: star }))}
                    className="text-2xl hover:scale-110 transition-transform"
                  >
                    <span className={star <= formData.rating ? '⭐' : '☆'} />
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <input
              type="text"
              placeholder="Review title..."
              value={formData.title}
              onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
              maxLength={100}
              className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/30 outline-none mb-3"
              dir="ltr"
            />

            {/* Review Text */}
            <textarea
              placeholder="Share your thoughts about this product..."
              value={formData.text}
              onChange={e => setFormData(p => ({ ...p, text: e.target.value }))}
              maxLength={500}
              rows={4}
              className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/30 outline-none resize-none mb-3"
              dir="ltr"
            />

            {/* Submit Button */}
            <button
              onClick={handleSubmitReview}
              disabled={!formData.title.trim() || !formData.text.trim()}
              className="w-full bg-[#F57224] text-white py-2.5 rounded-xl text-sm font-bold disabled:bg-white/10 disabled:text-white/40 hover:bg-[#F57224]/80 transition-colors"
            >
              Submit Review
            </button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <p className="text-white/50 text-sm text-center py-8">No reviews yet</p>
        ) : (
          filteredReviews.map(review => (
            <div key={review.id} className="bg-[#1A1A1A] rounded-2xl p-4 border border-white/5">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white text-sm font-bold">{review.author}</p>
                    {review.verified && (
                      <span className="text-[#F57224] text-[10px] bg-[#F57224]/15 px-1.5 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-white/50 text-xs">{review.date}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}
                    />
                  ))}
                </div>
              </div>

              {/* Review Title */}
              <p className="text-white font-bold text-sm mb-2">{review.title}</p>

              {/* Review Text */}
              <p className="text-white/60 text-xs leading-relaxed mb-3">{review.text}</p>

              {/* Helpful Button */}
              <button className="flex items-center gap-1.5 text-white/50 hover:text-white/70 text-xs transition-colors">
                <ThumbsUp size={12} />
                <span>Helpful ({review.helpful})</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredReviews.length > 0 && filteredReviews.length < reviews.length && (
        <button className="w-full mt-6 py-3 text-[#F57224] font-bold text-sm hover:text-[#F57224]/80 transition-colors">
          Load More Reviews
        </button>
      )}
    </div>
  )
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'فاطمة أحمد',
    rating: 5,
    title: 'منتج ممتاز وجودة عالية',
    text: 'المنتج فاق توقعاتي. الجودة رائعة والتسليم سريع جداً. سأشتري منه مرة أخرى بكل تأكيد. أنصح به بشدة!',
    helpful: 127,
    date: 'قبل أسبوعين',
    verified: true,
  },
  {
    id: '2',
    author: 'محمد علي',
    rating: 4,
    title: 'جيد جداً لكن السعر مرتفع قليلاً',
    text: 'جودة المنتج رائعة وسهل الاستخدام. السعر فقط يبدو مرتفع قليلاً مقارنة مع المنتجات المشابهة في السوق.',
    helpful: 45,
    date: 'قبل شهر',
    verified: true,
  },
  {
    id: '3',
    author: 'سارة محمود',
    rating: 5,
    title: 'ديليفري سريع وتغليف فخم',
    text: 'وصل المنتج في أقل من يوم، والتغليف كان فخم جداً. المنتج نفسه روعة والجودة ممتازة. شكراً لازاده!',
    helpful: 89,
    date: 'قبل 3 أيام',
    verified: true,
  },
  {
    id: '4',
    author: 'علي محمد',
    rating: 3,
    title: 'عادي وليس سيء',
    text: 'المنتج عادي الجودة. ليس سيء لكن ليس أفضل من المتوقع. لا بأس به للاستخدام العادي.',
    helpful: 23,
    date: 'قبل أسبوع',
    verified: true,
  },
  {
    id: '5',
    author: 'ليلى خالد',
    rating: 5,
    title: 'أفضل من الصور',
    text: 'المنتج أفضل من الصور بكثير! الألوان جميلة والجودة ممتازة. شكراً على الخدمة الرائعة.',
    helpful: 156,
    date: 'قبل 5 أيام',
    verified: true,
  },
]
