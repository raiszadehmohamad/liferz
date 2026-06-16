const CACHE_VERSION = 'liferz-v1';
const STATIC_CACHE_NAME = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `dynamic-${CACHE_VERSION}`;

// Asset URLs to precache upon service worker registration
const ASSETS_TO_PRECACHE = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Precaching app shell...');
      return cache.addAll(ASSETS_TO_PRECACHE).catch(err => {
        console.warn('[Service Worker] Precache warm-up missed some assets:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
            console.log('[Service Worker] Cleaning old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Focus only on same-origin or HTTP GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Network First for API routes or highly dynamic endpoints
  if (requestUrl.pathname.includes('/api/') || requestUrl.pathname.includes('/liferz_')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone response and cache it
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If offline, try matching dynamic/fallback cache
          return caches.match(event.request);
        })
    );
  } else {
    // Cache First for static assets like fonts, assets, scripts, stylesheets, shapes-icons
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return response;
          })
          .catch(() => {
            // Empty / fallback match
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
    );
  }
});
