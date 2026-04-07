// Townshub UGC Studio — Service Worker
// Strategy:
//   - Static assets (_next/static, icons): cache-first
//   - API routes (/api/*): network-only (never stale)
//   - Navigation (HTML): network-first, fallback to cache, then /offline

const CACHE_VERSION = "townshub-v2"
const STATIC_CACHE = `${CACHE_VERSION}-static`
const PAGES_CACHE = `${CACHE_VERSION}-pages`

// Precache these individually so one failure doesn't abort SW installation
const PRECACHE_URLS = [
  "/offline",
  "/favicon.png",
  "/icon-192.png",
  "/icon-512.png",
]

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      // Use individual adds — if one fails the SW still installs
      Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)))
    ).then(() => self.skipWaiting())
  )
})

// ─── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("townshub-") && k !== STATIC_CACHE && k !== PAGES_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  )
})

// ─── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and cross-origin
  if (request.method !== "GET" || url.origin !== self.location.origin) return

  // API — network only
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request))
    return
  }

  // Next.js static assets — cache-first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/_next/image/") ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|ico|woff2?|ttf|otf)$/)
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // Navigation — network-first with offline fallback
  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request))
    return
  }
})

// ─── Strategies ───────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return new Response("Network error", { status: 408 })
  }
}

async function networkFirstNavigation(request) {
  const cache = await caches.open(PAGES_CACHE)
  try {
    const response = await fetch(request)
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch {
    const cached = await cache.match(request)
    if (cached) return cached
    const offline = await caches.match("/offline")
    return offline || new Response("You are offline", { status: 503 })
  }
}
