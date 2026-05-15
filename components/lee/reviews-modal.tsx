'use client';

import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { addReview } from '@/lib/reviews';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productHandle: string;
  onReviewAdded?: () => void;
}

export function ReviewsModal({
  isOpen,
  onClose,
  productHandle,
  onReviewAdded,
}: ReviewsModalProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setLoading(true);

    try {
      const success = await addReview(user.id, productHandle, rating, body);
      if (success) {
        setRating(5);
        setBody('');
        onReviewAdded?.();
        onClose();
      } else {
        setError('Failed to submit review');
      }
    } catch (err: any) {
      setError(err.message || 'Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
      <div className="w-full bg-white rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      value <= rating
                        ? 'fill-[#f85c98] text-[#f85c98]'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              minLength={10}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f85c98] resize-none"
              placeholder="Share your experience with this product..."
              rows={5}
            />
            <p className="text-xs text-gray-500 mt-1">
              {body.length}/500 characters
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !body.trim()}
            className="w-full py-3 bg-gradient-to-r from-[#f85c98] to-[#e91e8c] text-white rounded-lg font-semibold disabled:opacity-70"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
