'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { getProductReviews, getAverageRating, Review } from '@/lib/reviews';

interface ReviewsSectionProps {
  productHandle: string;
  onWriteReview?: () => void;
}

export function ReviewsSection({
  productHandle,
  onWriteReview,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const [reviews, rating] = await Promise.all([
          getProductReviews(productHandle),
          getAverageRating(productHandle),
        ]);
        setReviews(reviews);
        setAvgRating(rating);
      } catch (error) {
        console.error('[v0] Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, [productHandle]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Reviews</h3>
        <button
          onClick={onWriteReview}
          className="px-4 py-2 bg-gradient-to-r from-[#f85c98] to-[#e91e8c] text-white rounded-lg text-sm font-medium"
        >
          Write Review
        </button>
      </div>

      {/* Average rating */}
      {reviews.length > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-3xl font-bold text-gray-900">{avgRating}</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i <= Math.round(avgRating)
                        ? 'fill-[#f85c98] text-[#f85c98]'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No reviews yet</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">
                    {review.user_email?.split('@')[0] || 'Anonymous'}
                  </p>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i <= review.rating
                            ? 'fill-[#f85c98] text-[#f85c98]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className="text-gray-700 text-sm">{review.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
