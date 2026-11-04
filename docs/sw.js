// FloodWatch service worker: keeps the app shell available offline.
// Map tiles, routing, traffic and reports always come from the network.
const V = "floodwatch-v6";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"];
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
  if (u.origin !== location.origin && u.hostname !== "cdnjs.cloudflare.com" && u.hostname !== "www.gstatic.com") return;
  e.respondWith(caches.match(r).then(hit => {
    const net = fetch(r).then(res => {
      if (res && res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});

// Tapping a flood alert opens (or returns to) the app
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    if (list.length) return list[0].focus();
    return clients.openWindow("./");
  }));
});

// Push alerts from the server (work even when the app is closed)
self.addEventListener("push", e => {
  let p = {};
  try { p = e.data ? e.data.json() : {}; } catch (_) { p = {}; }
  const n = Object.assign({}, p.data || {}, p.notification || {});
  e.waitUntil(self.registration.showNotification(n.title || "FloodWatch", {
    body: n.body || "A flood was reported near you.",
    tag: n.id ? "rep" + n.id : "flood",
    icon: "icon-192.png", badge: "icon-192.png", data: n
  }));
});
