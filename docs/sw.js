// FloodWatch service worker: keeps the app shell available offline.
// Map tiles, routing, traffic and reports always come from the network.
const V = "floodwatch-v2";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(V).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin && u.hostname !== "cdnjs.cloudflare.com") return;
  e.respondWith(caches.match(r).then(hit => {
    const net = fetch(r).then(res => {
      if (res && res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
