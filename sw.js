const CACHE = 'lernquest-v2';
const FILES = ['./', 'index.html', 'style.css', 'app.js', 'manifest.webmanifest', 'icon.svg',
  'data/content.js', 'data/mathe.js', 'data/deutsch.js', 'data/englisch.js', 'data/naturwissenschaften.js', 'data/mathe2.js', 'data/deutsch2.js', 'data/englisch2.js', 'data/nw2.js', 'data/gesellschaft.js', 'data/technik-sprachen.js', 'data/kreativ.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Stale-while-revalidate: sofort aus dem Cache, im Hintergrund aktualisieren (funktioniert so auch offline)
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(r, { ignoreSearch: true });
    const net = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});
