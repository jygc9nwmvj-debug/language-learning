import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const files = (await readdir('dist', { recursive: true, withFileTypes: true })).filter(f => f.isFile() && !['sw.js', '_headers', '_redirects'].includes(f.name)).map(f => `${f.parentPath}/${f.name}`.replace(/^dist\//, '')).sort();
const hash = createHash('sha256');
// Cache identity also changes when the worker strategy changes.
hash.update(await readFile(new URL(import.meta.url)));
for (const file of files) hash.update(file).update(await readFile(`dist/${file}`));
const cache = `mandarin-v01-${hash.digest('hex').slice(0, 16)}`;
await writeFile('dist/sw.js', `const CACHE = ${JSON.stringify(cache)};
const ASSETS = ${JSON.stringify(files.map(f => f === 'index.html' ? '/' : '/' + f))};
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil((async () => {
  // Keep one prior bundle for open pages; never touch IndexedDB learner data.
  const previous = (await caches.keys()).filter(key => key.startsWith('mandarin-v01-') && key !== CACHE);
  for (const key of previous.slice(0, -1)) await caches.delete(key);
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (event.request.mode === 'navigate') return (await cache.match('/', {ignoreVary: true})) || fetch(event.request);
    const current = await cache.match(event.request, {ignoreSearch: true, ignoreVary: true});
    if (current) return current;
    if (url.pathname.startsWith('/assets/')) {
      for (const key of await caches.keys()) if (key.startsWith('mandarin-v01-') && key !== CACHE) {
        const previous = await (await caches.open(key)).match(event.request);
        if (previous) return previous;
      }
    }
    return fetch(event.request);
  })());
});
`);
console.log(`Precached ${files.length} build assets: ${cache}`);
