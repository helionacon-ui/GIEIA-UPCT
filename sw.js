/* Service worker del índice: abre sin conexión. Solo gestiona la portada;
   las guías de cada asignatura tienen su propio service worker. */
const V = 'gieia-hub-2026-11-19-obra';
const BASE = new URL('./', self.registration.scope).pathname;
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => Promise.all([BASE, BASE + 'index.html', BASE + 'piel.css?v=4', BASE + 'piel.js?v=4', BASE + 'sugerencias.js?v=2', BASE + 'manifest.webmanifest', BASE + 'icon-192.png', BASE + 'icon-512.png', BASE + 'icon-maskable-512.png', BASE + 'apple-touch-icon.png', BASE + 'busqueda.json'].map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('gieia-hub') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  /* se comparan rutas, no direcciones completas: el ?v= va aparte */
  const propios = ['', 'index.html', 'piel.css', 'piel.js', 'sugerencias.js', 'manifest.webmanifest',
    'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png',
    'busqueda.json', 'buscador-index.js', 'asig-nav.js'];
  if (!propios.some(n => u.pathname === BASE + n)) return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const k = r.clone(); caches.open(V).then(c => c.put(e.request, k)); } return r; })
    .catch(() => caches.match(e.request, {ignoreSearch:true}).then(r => r || caches.match(BASE + 'index.html'))));
});
