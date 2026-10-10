const CACHE = 'lernquest-v6';
/*DATA:START*/ const DATA = ['data/content.js', 'data/cards.js', 'data/deutsch.js', 'data/deutsch2.js', 'data/englisch.js', 'data/englisch2.js', 'data/gesellschaft.js', 'data/kreativ.js', 'data/mathe.js', 'data/mathe2.js', 'data/naturwissenschaften.js', 'data/nw2.js', 'data/technik-sprachen.js', 'data/x-biologie.js', 'data/x-deutsch.js', 'data/x-englisch.js', 'data/x-erdkunde.js', 'data/x-extra.js', 'data/x-franzoesisch-latein.js', 'data/x-geschichte.js', 'data/x-informatik.js', 'data/x-mathe.js', 'data/x-musik-kunst.js', 'data/x-physik-chemie.js', 'data/x-politik-religion.js', ]; /*DATA:END*/
const FILES = ['./', 'index.html', 'style.css', 'app.js', 'quest-story.js', 'gen.js', 'diagrams.js', 'manifest.webmanifest', 'icon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png', ...DATA];

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
