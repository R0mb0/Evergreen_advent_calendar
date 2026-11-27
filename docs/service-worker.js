// Bump this value whenever the app shell changes, so old caches are dropped.
const CACHE_VERSION = 'advent-v5.1.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const CDN_CACHE = `cdn-${CACHE_VERSION}`;

// App shell: everything needed to start the app offline.
// A missing file here must never break the installation (see "install" below).
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/i18n.js',
  './js/time-storage.js',
  './js/media-viewer.js',
  './js/pwa-install.js',
  './js/app.js',
  './config.json',
  './manifest.webmanifest',
  './days/manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png'
];

// Third-party libraries and fonts loaded from CDNs by index.html / media-viewer.js.
// They are cached at install time and then served cache-first, so the app also
// works offline after the first visit. Keep these URLs in sync with index.html.
const CDN_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@500;600;700;800&display=swap',
  'https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js',
  'https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js',
  'https://cdn.jsdelivr.net/npm/dompurify@3.1.7/dist/purify.min.js',
  'https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdn.jsdelivr.net/npm/ogg-opus-decoder@1.7.0/dist/ogg-opus-decoder.min.js'
];

const CDN_HOSTS = new Set([
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'unpkg.com',
  'cdn.jsdelivr.net',
  'cdnjs.cloudflare.com'
]);

// Files that must always be fresh when online (content changes between deploys).
const NETWORK_FIRST_PATHS = ['/config.json', '/days/manifest.json'];

// Safe cache write: ignores partial (206) responses and quota errors.
async function putInCache(cacheName, request, response) {
  if (!response || (!response.ok && response.type !== 'opaque') || response.status === 206) return;
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
  } catch {
    // Quota exceeded or unsupported response: caching is best-effort
  }
}

// 1. INSTALL: pre-cache the shell. Each file is added on its own, so one
//    failure (e.g. CDN unreachable) does not abort the whole installation.
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const staticCache = await caches.open(STATIC_CACHE);
      await Promise.allSettled(PRECACHE_ASSETS.map((url) => staticCache.add(url)));

      const cdnCache = await caches.open(CDN_CACHE);
      await Promise.allSettled(CDN_ASSETS.map((url) => cdnCache.add(url)));
    })()
  );
});

// 2. ACTIVATE: remove caches from previous versions
self.addEventListener('activate', (event) => {
  const validCaches = [STATIC_CACHE, RUNTIME_CACHE, CDN_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => !validCaches.includes(key)).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// 3. UPDATE ON USER REQUEST
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 4. FETCH: different strategies per resource type
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;
  // Audio/video use Range requests: let the browser handle them directly
  if (request.headers.has('range')) return;

  const url = new URL(request.url);

  // A) Third-party libraries and fonts: cache-first
  if (CDN_HOSTS.has(url.hostname)) {
    event.respondWith(
      caches.match(request, { ignoreVary: true }).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          putInCache(CDN_CACHE, request, response.clone());
          return response;
        });
      })
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // B) Page navigation: network-first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          putInCache(RUNTIME_CACHE, request, response.clone());
          return response;
        })
        .catch(() => caches.match(request).then((res) => res || caches.match('./index.html')))
    );
    return;
  }

  // C) Config and days manifest: network-first, so edits appear immediately
  if (NETWORK_FIRST_PATHS.some((path) => url.pathname.endsWith(path))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          putInCache(RUNTIME_CACHE, request, response.clone());
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // D) Icons: cache-first
  if (url.pathname.includes('/icons/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          putInCache(STATIC_CACHE, request, response.clone());
          return response;
        });
      })
    );
    return;
  }

  // E) Everything else (JS, CSS, daily content): stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          putInCache(RUNTIME_CACHE, request, response.clone());
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
