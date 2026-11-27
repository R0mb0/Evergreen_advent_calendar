const CACHE_VERSION = 'app-v4.0.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

// Elenca qui TUTTI i file necessari per il funzionamento 100% offline
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './pwa-install.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png'
  // Aggiungi qui le tue librerie locali, es.:
  // './libs/chart.umd.min.js',
  // './libs/lucide.min.js'
];

// 1. INSTALLAZIONE: pre-cache di tutta l'App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
});

// 2. ATTIVAZIONE: pulizia automatica delle cache delle versioni precedenti
self.addEventListener('activate', (event) => {
  const validCaches = [STATIC_CACHE, RUNTIME_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !validCaches.includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// 3. AGGIORNAMENTO IMMEDIATO SU RICHIESTA DELL'UTENTE
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 4. FETCH: strategie differenziate per tipo di risorsa
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignora richieste non-GET o estensioni browser
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // A) Navigazione pagine (HTML): Network-First con fallback a Cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((res) => res || caches.match('./index.html')))
    );
    return;
  }

  // B) Librerie locali e icone: Cache-First (velocità massima e zero traffico)
  if (url.pathname.includes('/libs/') || url.pathname.includes('/icons/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
    return;
  }

  // C) Asset dell'app (JS, CSS, JSON): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});