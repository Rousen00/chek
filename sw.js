// Keeps the app shell available offline; the network copy wins whenever it is reachable.
const CACHE = 'chek-v3';
const FILES = ['./', 'index.html', 'manifest.json', 'icon-180.png', 'icon-512.png', ...['house', 'flat', 'car', 'moto'].flatMap(k => [`img/${k}.jpg`, `img/${k}-g.jpg`])];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then(m => m || caches.match('index.html'))));
});
