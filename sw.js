/* Service worker - Jardinerie Marcipont
   Strategie : pages / CSS / JS / manifeste = reseau d'abord (toujours a jour),
   images = cache d'abord, jamais les videos ni la musique.
   Changer VERSION a chaque livraison. */
const VERSION = "marcipont-v1";
const OFFLINE = "/offline.html";
const CORE = [
  "/", "/offline.html",
  "/rubrique.css", "/rubrique.js", "/app.js",
  "/manifest.webmanifest",
  "/favicon.svg", "/icon-192.png", "/icon-512.png"
];

async function cleanCopy(resp) {
  // Recopie les reponses redirigees avant mise en cache (evite les redirections opaques)
  if (resp.redirected) {
    const body = await resp.clone().blob();
    return new Response(body, { status: 200, statusText: "OK", headers: resp.headers });
  }
  return resp;
}

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(CORE);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // tiers (Unsplash, Google Maps, Facebook) : reseau direct

  // Images : cache d'abord
  if (req.destination === "image") {
    e.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const r = await fetch(req);
        const c = await caches.open(VERSION);
        c.put(req, (await cleanCopy(r)).clone());
        return r;
      } catch (_) {
        return cached || Response.error();
      }
    })());
    return;
  }

  // Pages, CSS, JS, manifeste : reseau d'abord
  e.respondWith((async () => {
    try {
      const r = await fetch(req);
      const copy = await cleanCopy(r);
      const c = await caches.open(VERSION);
      c.put(req, copy.clone());
      return r;
    } catch (_) {
      const cached = await caches.match(req);
      if (cached) return cached;
      if (req.mode === "navigate") return caches.match(OFFLINE);
      return Response.error();
    }
  })());
});
