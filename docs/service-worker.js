// Bump this value whenever the app shell changes, so old caches are dropped.
const CACHE_VERSION = 'advent-v6.0.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const CDN_CACHE = `cdn-${CACHE_VERSION}`;
// Daily files are NOT tied to the app version: they are stored under URLs that contain
// a content hash (?v=...), so they stay valid across app updates and are pruned explicitly.
const CONTENT_CACHE = 'advent-content';

// App shell: everything needed to start the app offline.
// A missing file here must never break the installation (see "install" below).
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/libs.js',
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

// Third-party libraries: the local copy in ./libs/ is pre-cached. If a local file is
// missing (libraries not downloaded yet), the CDN copy is cached instead.
// Keep this list in sync with js/libs.js and tools/download_libs.py.
const LIBRARIES = [
  { local: './libs/lucide.min.js', cdn: 'https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js' },
  { local: './libs/confetti.browser.min.js', cdn: 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js' },
  { local: './libs/marked.min.js', cdn: 'https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js' },
  { local: './libs/purify.min.js', cdn: 'https://cdn.jsdelivr.net/npm/dompurify@3.1.7/dist/purify.min.js' },
  { local: './libs/mammoth.browser.min.js', cdn: 'https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js' },
  { local: './libs/pdf.min.js', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js' },
  { local: './libs/pdf.worker.min.js', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js' },
  { local: './libs/ogg-opus-decoder.min.js', cdn: 'https://cdn.jsdelivr.net/npm/ogg-opus-decoder@1.7.0/dist/ogg-opus-decoder.min.js' }
];

const FONTS_LOCAL_CSS = './libs/fonts/fonts.css';
const FONTS_CDN_CSS =
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@500;600;700;800&display=swap';

const CDN_HOSTS = new Set([
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'unpkg.com',
  'cdn.jsdelivr.net',
  'cdnjs.cloudflare.com'
]);

// Files that must always be fresh when online (content changes between deploys).
const NETWORK_FIRST_PATHS = ['/config.json', '/days/manifest.json'];

const isDayContent = (url) =>
  url.pathname.includes('/days/') && !url.pathname.endsWith('/manifest.json');

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

// Caches the local fonts stylesheet and the font files it references.
async function precacheFonts(staticCache) {
  try {
    const response = await fetch(FONTS_LOCAL_CSS);
    const type = response.headers.get('content-type') || '';
    if (!response.ok || !type.includes('css')) throw new Error('local fonts missing');

    const css = await response.clone().text();
    await staticCache.put(FONTS_LOCAL_CSS, response);

    const base = new URL(FONTS_LOCAL_CSS, self.location.href);
    const fontUrls = [...css.matchAll(/url\(([^)]+)\)/g)]
      .map((m) => m[1].trim().replace(/^['"]|['"]$/g, ''))
      .filter((u) => !u.startsWith('data:'))
      .map((u) => new URL(u, base).href);

    await Promise.allSettled([...new Set(fontUrls)].map((u) => staticCache.add(u)));
  } catch {
    // Fallback: cache the Google Fonts stylesheet (font files are cached when used)
    const cdnCache = await caches.open(CDN_CACHE);
    await Promise.allSettled([cdnCache.add(FONTS_CDN_CSS)]);
  }
}

// 1. INSTALL: pre-cache the shell and the libraries. Each file is added on its own, so
//    one failure does not abort the whole installation.
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const staticCache = await caches.open(STATIC_CACHE);
      await Promise.allSettled(PRECACHE_ASSETS.map((url) => staticCache.add(url)));

      const cdnCache = await caches.open(CDN_CACHE);
      await Promise.allSettled(
        LIBRARIES.map(async ({ local, cdn }) => {
          try {
            await staticCache.add(local);
          } catch {
            await cdnCache.add(cdn);
          }
        })
      );

      await precacheFonts(staticCache);
    })()
  );
});

// 2. ACTIVATE: remove caches from previous versions (the content cache is kept)
self.addEventListener('activate', (event) => {
  const validCaches = [STATIC_CACHE, RUNTIME_CACHE, CDN_CACHE, CONTENT_CACHE];
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

// 3. MESSAGES FROM THE PAGE
self.addEventListener('message', (event) => {
  const data = event.data || {};

  // Update on user request
  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  // Keep the daily files offline: download the missing ones, drop outdated versions
  if (data.type === 'CACHE_CONTENT') {
    event.waitUntil(syncContent(data.urls || [], data.keep || []));
  }
});

async function syncContent(urls, keep) {
  const cache = await caches.open(CONTENT_CACHE);

  // Remove files that are no longer part of the calendar (or older versions of them)
  if (keep.length) {
    const keepSet = new Set(keep);
    for (const request of await cache.keys()) {
      if (!keepSet.has(request.url)) await cache.delete(request);
    }
  }

  // Download missing files, two at a time to stay gentle with the connection
  const queue = [...new Set(urls)];
  const worker = async () => {
    while (queue.length) {
      const url = queue.shift();
      try {
        if (await cache.match(url)) continue;
        const response = await fetch(url);
        if (response.ok && response.status === 200) await cache.put(url, response);
      } catch {
        // Offline or failed: it will be retried at the next visit
      }
    }
  };
  await Promise.all([worker(), worker()]);
}

// Serves a Range request (audio/video seeking) from a fully cached file
async function respondToRange(request) {
  const cache = await caches.open(CONTENT_CACHE);
  const cached = await cache.match(request.url);
  if (!cached) return fetch(request);

  const blob = await cached.blob();
  const size = blob.size;
  const match = /bytes=(\d*)-(\d*)/.exec(request.headers.get('range') || '');
  if (!match) return cached;

  let start = match[1] === '' ? size - Number(match[2]) : Number(match[1]);
  let end = match[1] === '' || match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1);
  start = Math.max(0, start);

  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  }

  return new Response(blob.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': cached.headers.get('Content-Type') || blob.type || 'application/octet-stream',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes'
    }
  });
}

// 4. FETCH: different strategies per resource type
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // A) Third-party fallbacks (CDN libraries and fonts): cache-first
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

  // B) Range requests (audio/video): served from the cache when the file is stored
  if (request.headers.has('range')) {
    if (isDayContent(url)) event.respondWith(respondToRange(request));
    return;
  }

  // C) Page navigation: network-first, fallback to cache
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

  // D) Config and days manifest: network-first, so edits appear immediately
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

  // E) Daily files: cache-first (their URLs change when the content changes)
  if (isDayContent(url)) {
    event.respondWith(
      caches.open(CONTENT_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok && response.status === 200) cache.put(request, response.clone());
        return response;
      })
    );
    return;
  }

  // F) Icons, local libraries and fonts: cache-first
  if (
    url.pathname.includes('/icons/') ||
    url.pathname.includes('/libs/')
  ) {
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

  // G) Everything else (JS, CSS): stale-while-revalidate
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
