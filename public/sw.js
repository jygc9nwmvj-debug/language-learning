const CACHE = 'language-lab-v0-1';
const CORE = [
  '/', '/manifest.webmanifest',
  '/audio/mandarin/nihao.wav', '/audio/mandarin/wo.wav', '/audio/mandarin/ni.wav',
  '/audio/mandarin/hao.wav', '/audio/mandarin/xiexie.wav', '/audio/mandarin/zaijian.wav',
  '/audio/mandarin/wojiao.wav', '/audio/mandarin/nijiaoshenmemingzi.wav',
  '/audio/mandarin/ma1.wav', '/audio/mandarin/ma2.wav', '/audio/mandarin/ma3.wav', '/audio/mandarin/ma4.wav'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).catch(() => undefined));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const clone = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, clone));
      return response;
    }).catch(() => caches.match('/')))
  );
});
