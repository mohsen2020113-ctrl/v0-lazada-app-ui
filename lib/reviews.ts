import { supabase, safeSupabaseCall } from './supabase';

export interface Review {
  id: string;
  user_id: string;
  product_handle: string;
  rating: number;
  body: string;
  created_at: string;
  user_email?: string;
}

export async function addReview(
  userId: string,
  productHandle: string,
  rating: number,
  body: string
): Promise<boolean> {
  return safeSupabaseCall(
    async () => {
      if (!supabase) return false;
      const { error } = await supabase.from('reviews').insert({
        user_id: userId,
        product_handle: productHandle,
        rating,
        body,
      });
      if (error) throw error;
      return true;
    },
    false
  );
}

export async function getProductReviews(
  productHandle: string
): Promise<Review[]> {
  return safeSupabaseCall(
    async () => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_handle', productHandle)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    []
  );
}

export async function getAverageRating(
  productHandle: string
): Promise<number> {
  return safeSupabaseCall(
    async () => {
      if (!supabase) return 0;
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_handle', productHandle);
      if (error) throw error;
      if (!data || data.length === 0) return 0;
      const sum = data.reduce((acc, item) => acc + item.rating, 0);
      return Math.round((sum / data.length) * 10) / 10;
    },
    0
  );
}

export async function deleteReview(reviewId: string): Promise<boolean> {
  return safeSupabaseCall(
    async () => {
      if (!supabase) return false;
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);
      if (error) throw error;
      return true;
    },
    false
  );
}
