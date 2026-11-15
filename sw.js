/* Service worker del índice: abre sin conexión. Solo gestiona la portada;
   las guías de cada asignatura tienen su propio service worker. */
const V = 'gieia-hub-2026-11-15e';
const BASE = new URL('./', self.registration.scope).pathname;
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll([BASE, BASE + 'index.html'])).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('gieia-hub') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (u.pathname !== BASE && u.pathname !== BASE + 'index.html') return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const k = r.clone(); caches.open(V).then(c => c.put(e.request, k)); } return r; })
    .catch(() => caches.match(e.request, {ignoreSearch:true}).then(r => r || caches.match(BASE + 'index.html'))));
});
