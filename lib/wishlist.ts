import { supabase, safeSupabaseCall } from './supabase';

export async function addToWishlist(
  userId: string,
  productHandle: string
): Promise<boolean> {
  return safeSupabaseCall(
    async () => {
      if (!supabase) return false;
      const { error } = await supabase.from('wishlists').insert({
        user_id: userId,
        product_handle: productHandle,
      });
      if (error) throw error;
      return true;
    },
    false
  );
}

export async function removeFromWishlist(
  userId: string,
  productHandle: string
): Promise<boolean> {
  return safeSupabaseCall(
    async () => {
      if (!supabase) return false;
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('product_handle', productHandle);
      if (error) throw error;
      return true;
    },
    false
  );
}

export async function getWishlist(userId: string): Promise<string[]> {
  return safeSupabaseCall(
    async () => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('wishlists')
        .select('product_handle')
        .eq('user_id', userId);
      if (error) throw error;
      return data?.map((item: any) => item.product_handle) || [];
    },
    []
  );
}

export async function isWishlisted(
  userId: string,
  productHandle: string
): Promise<boolean> {
  return safeSupabaseCall(
    async () => {
      if (!supabase) return false;
      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', userId)
        .eq('product_handle', productHandle)
        .limit(1);
      if (error) throw error;
      return (data?.length || 0) > 0;
    },
    false
  );
}
