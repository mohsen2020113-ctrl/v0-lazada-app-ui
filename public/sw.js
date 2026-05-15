const CACHE_NAME = 'lee-v2';
const IMAGE_CACHE_NAME = 'lee-images-v1';
const API_CACHE_NAME = 'lee-api-v1';
const PRECACHE_URLS = ['/'];

// Cache durations
const IMAGE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const SEARCH_MAX_AGE = 5 * 60 * 1000; // 5 minutes

// Install event - cache initial assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (e) => {
  const currentCaches = [CACHE_NAME, IMAGE_CACHE_NAME, API_CACHE_NAME];
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !currentCaches.includes(key))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Helper: Check if cached response is stale
function isCacheStale(response, maxAge) {
  const dateHeader = response.headers.get('sw-cache-date');
  if (!dateHeader) return true;
  const cacheDate = new Date(dateHeader).getTime();
  return Date.now() - cacheDate > maxAge;
}

// Helper: Add cache date header
function addCacheDate(response) {
  const headers = new Headers(response.headers);
  headers.set('sw-cache-date', new Date().toISOString());
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Fetch event
self.addEventListener('fetch', (e) => {
  // Skip non-GET requests
  if (e.request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!e.request.url.startsWith('http')) return;

  const url = new URL(e.request.url);

  // Handle Shopify CDN images - cache with 7-day max-age
  if (url.hostname === 'cdn.shopify.com') {
    e.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(e.request);
        
        if (cached && !isCacheStale(cached, IMAGE_MAX_AGE)) {
          return cached;
        }

        try {
          const response = await fetch(e.request);
          if (response.ok) {
            cache.put(e.request, addCacheDate(response.clone()));
          }
          return response;
        } catch (error) {
          if (cached) return cached;
          return new Response('Image unavailable', { status: 503 });
        }
      })
    );
    return;
  }

  // Handle /api/search - stale-while-revalidate with 5 min max-age
  if (url.pathname === '/api/search') {
    e.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(e.request);
        
        // Return cached immediately if available, then revalidate in background
        const fetchPromise = fetch(e.request)
          .then((response) => {
            if (response.ok) {
              cache.put(e.request, addCacheDate(response.clone()));
            }
            return response;
          })
          .catch((error) => {
            console.error('Search API fetch failed:', error);
            return null;
          });

        if (cached && !isCacheStale(cached, SEARCH_MAX_AGE)) {
          // Revalidate in background
          fetchPromise;
          return cached;
        }

        // Wait for network if cache is stale or missing
        const networkResponse = await fetchPromise;
        if (networkResponse) return networkResponse;
        if (cached) return cached;
        
        return new Response(
          JSON.stringify({ results: [], error: 'Offline - no cached results' }),
          { 
            status: 503, 
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      })
    );
    return;
  }

  // Default handling for other requests
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(e.request)
        .then((response) => {
          // Don't cache non-ok responses
          if (!response || response.status !== 200) {
            return response;
          }

          // Clone the response for caching
          const responseToCache = response.clone();

          // Cache images and static assets
          caches.open(CACHE_NAME).then((cache) => {
            if (
              e.request.url.includes('/images/') ||
              e.request.url.includes('.jpg') ||
              e.request.url.includes('.png') ||
              e.request.url.includes('.webp') ||
              e.request.url.includes('.js') ||
              e.request.url.includes('.css')
            ) {
              cache.put(e.request, responseToCache);
            }
          });

          return response;
        })
        .catch(() => {
          // Return offline fallback for navigation requests
          if (e.request.mode === 'navigate') {
            return caches.match('/').then((cached) => {
              if (cached) return cached;
              return new Response(
                '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your internet connection and try again.</p></body></html>',
                { 
                  status: 503, 
                  headers: { 'Content-Type': 'text/html' } 
                }
              );
            });
          }
          return new Response('Offline', { status: 503 });
        });
    })
  );
});
