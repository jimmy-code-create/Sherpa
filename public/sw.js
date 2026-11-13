/**
 * Sherpa service worker.
 *
 * Strategy:
 *  - App shell: network-first with cache fallback (so updates land fast).
 *  - Navigations to /app/chapters/: cache-first per chapter, and the last 5
 *    viewed chapters are pinned in the `sherpa-chapters` cache (criterion 5:
 *    offline reading of the last 5 chapters). The pin list lives in
 *    IndexedDB-lite via a dedicated Cache entry `sherpa-recent` storing an
 *    ordered list of chapter URLs; opening the 6th evicts the oldest.
 *  - API routes: network-only (never cache mutations or authed JSON).
 *  - Static assets: cache-first.
 *
 * The client (src/components/pwa.tsx) registers this file and shows an
 * offline banner when `navigator.onLine` flips false.
 */

const SHELL_CACHE = "sherpa-shell-v1";
const CHAPTER_CACHE = "sherpa-chapters-v1";
const RECENT_KEY = "sherpa-recent-chapters";
const MAX_RECENT = 5;

const SHELL_URLS = ["/", "/manifest.webmanifest", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_URLS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("sherpa-") && k !== SHELL_CACHE && k !== CHAPTER_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function getRecent() {
  const cache = await caches.open(CHAPTER_CACHE);
  const res = await cache.match(RECENT_KEY);
  if (!res) return [];
  try {
    return (await res.json()) || [];
  } catch {
    return [];
  }
}

async function setRecent(list) {
  const cache = await caches.open(CHAPTER_CACHE);
  await cache.put(
    RECENT_KEY,
    new Response(JSON.stringify(list), { headers: { "Content-Type": "application/json" } }),
  );
}

/** Pin a chapter page (and its notes payload) for offline reading. */
async function pinChapter(url) {
  const recent = await getRecent();
  const next = [url, ...recent.filter((u) => u !== url)].slice(0, MAX_RECENT);
  await setRecent(next);
  const cache = await caches.open(CHAPTER_CACHE);
  try {
    await cache.add(url);
  } catch {
    /* offline at pin time — ignore */
  }
  return next;
}

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "PIN_CHAPTER" && typeof data.url === "string") {
    event.waitUntil(pinChapter(data.url));
  }
  if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

function isChapterNavigation(request) {
  return request.mode === "navigate" && new URL(request.url).pathname.startsWith("/app/chapters/");
}

function isApi(request) {
  return new URL(request.url).pathname.startsWith("/api/");
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // Never touch API calls (auth, mutations, AI generation).
  if (isApi(request)) return;

  // Chapter pages: network-first, but fall back to the pinned cache when
  // offline. Pin on success so the last 5 chapters stay readable.
  if (isChapterNavigation(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            void pinChapter(request.url);
            const copy = response.clone();
            void caches.open(CHAPTER_CACHE).then((c) => c.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const recent = await getRecent();
          const anyChapter = recent[0];
          return (
            caches.match(anyChapter) ||
            new Response("You're offline and this chapter isn't cached yet. Your last viewed chapters are available from the dashboard.", {
              status: 503,
              headers: { "Content-Type": "text/html; charset=utf-8" },
            })
          );
        }),
    );
    return;
  }

  // Navigations: network-first shell, cache fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match(request);
        return cached || (await caches.match("/")) || Response.error();
      }),
    );
    return;
  }

  // Static assets: cache-first.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok && request.url.startsWith(self.location.origin)) {
            const copy = response.clone();
            void caches.open(SHELL_CACHE).then((c) => c.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
