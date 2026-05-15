export interface RecentlyViewed {
  handle: string;
  title: string;
  price: number;
  image: string;
  timestamp: number;
}

const STORAGE_KEY = 'lee_recently_viewed';
const MAX_ITEMS = 10;

export function addRecentlyViewed(
  handle: string,
  title: string,
  price: number,
  image: string
): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getRecentlyViewed();
    
    // Remove if already exists to avoid duplicates
    const filtered = existing.filter(item => item.handle !== handle);
    
    // Add new item to the beginning
    const updated = [
      {
        handle,
        title,
        price,
        image,
        timestamp: Date.now(),
      },
      ...filtered,
    ].slice(0, MAX_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('[v0] Error saving recently viewed:', error);
  }
}

export function getRecentlyViewed(): RecentlyViewed[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('[v0] Error reading recently viewed:', error);
    return [];
  }
}

export function clearRecentlyViewed(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[v0] Error clearing recently viewed:', error);
  }
}
