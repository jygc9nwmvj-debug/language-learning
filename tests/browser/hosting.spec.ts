import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

test('Cloudflare-style index redirect: reload and offline navigation use the unredirected root', async ({ page }) => {
  const root=resolve('dist');
  const server=createServer(async(req,res)=>{
    const pathname=new URL(req.url!,'http://localhost').pathname;
    if (pathname==='/index.html') { res.writeHead(308,{Location:'/'});res.end();return; }
    const file=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if (!file.startsWith(root+'/')) {res.writeHead(403);res.end();return;}
    try {
      const mime: Record<string,string>={'.html':'text/html','.js':'application/javascript','.css':'text/css','.wav':'audio/wav','.webmanifest':'application/manifest+json','.png':'image/png'};
      const data=await readFile(file);
      res.writeHead(200,{'Content-Type':mime[extname(file)]??'text/plain','Cache-Control':'no-cache'});res.end(data);
    } catch {res.writeHead(404);res.end();}
  });
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  const port=(server.address() as {port:number}).port;
  try {
    await page.goto(`http://127.0.0.1:${port}/`);
    await expect(page.getByText('Bereit zum Lernen',{exact:true})).toBeVisible();
    await page.reload(); await expect(page.getByText(/Testversion C/)).toBeVisible();
    // Stop the origin instead of WebKit's broken offline-emulation switch (Playwright #42775).
    server.closeAllConnections();await new Promise<void>(resolve=>server.close(()=>resolve()));
    await page.reload();
    await expect(page.getByRole('button',{name:'Weiterlernen',exact:true})).toBeVisible();
  } finally {await page.close();server.closeAllConnections();if(server.listening)await new Promise<void>(resolve=>server.close(()=>resolve()));}
});

test('legacy offline app updates with two open tabs and preserves learner IndexedDB', async ({ page, context }) => {
  const root=resolve('dist'); let upgraded=false;
  const legacyHtml=`<!doctype html><p>Testversion 0.1.2</p><input aria-label="Ungespeicherte Antwort"><script>navigator.serviceWorker.register('/sw.js');</script>`;
  // Reproduce the old lifecycle: cache-first HTML, no skipWaiting, registration on page load.
  const legacyWorker=`const CACHE='mandarin-v01-legacy';self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['/','/assets/old.js']))));self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));self.addEventListener('fetch',e=>{if(e.request.mode==='navigate')e.respondWith(caches.open(CACHE).then(c=>c.match('/')));});`;
  const server=createServer(async(req,res)=>{
    const pathname=new URL(req.url!,'http://localhost').pathname;
    res.setHeader('Cache-Control','no-store');
    if(!upgraded && pathname==='/') {res.setHeader('Content-Type','text/html');res.end(legacyHtml);return;}
    if(!upgraded && pathname==='/sw.js') {res.setHeader('Content-Type','application/javascript');res.end(legacyWorker);return;}
    if(!upgraded && pathname==='/assets/old.js') {res.end('legacy-asset');return;}
    try {
      const file=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
      if(!file.startsWith(root+'/'))throw new Error();
      const mime:Record<string,string>={'.html':'text/html','.js':'application/javascript','.css':'text/css','.wav':'audio/wav','.webmanifest':'application/manifest+json'};
      res.setHeader('Content-Type',mime[extname(file)]??'text/plain');res.end(await readFile(file));
    }catch{res.writeHead(404);res.end();}
  });
  await new Promise<void>(r=>server.listen(0,'127.0.0.1',r));
  const origin=`http://127.0.0.1:${(server.address() as {port:number}).port}`;
  const other=await context.newPage();
  try {
    await page.goto(origin);await page.evaluate(()=>navigator.serviceWorker.ready.then(()=>{}));await page.reload();
    await other.goto(origin);await other.getByLabel('Ungespeicherte Antwort').fill('wo3');
    await page.evaluate(async()=>{
      const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('learner-update-proof',1);q.onupgradeneeded=()=>q.result.createObjectStore('progress');q.onsuccess=()=>r(q.result);});
      await new Promise<void>(r=>{const t=db.transaction('progress','readwrite');t.objectStore('progress').put('keep-my-progress','sentinel');t.oncomplete=()=>r();});db.close();
    });
    upgraded=true;
    // Plain reload, same as the learner: legacy page registers the new worker in the background.
    await page.reload();
    await expect.poll(()=>page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();return r?.active?.state==='activated' && !r.installing && !r.waiting ? caches.has('mandarin-v01-legacy').then(async()=> (await caches.keys()).filter(k=>k.startsWith('mandarin-v01-')).length===2) : false;})).toBe(true);
    // Neither open tab is closed and no automatic reload loses the typed answer.
    await expect(other.getByLabel('Ungespeicherte Antwort')).toHaveValue('wo3');
    await page.reload();await expect(page.getByText(/Testversion C/)).toBeVisible();
    expect(await other.evaluate(()=>fetch('/assets/old.js').then(r=>r.text()))).toBe('legacy-asset');
    expect(await page.evaluate(async()=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('learner-update-proof');q.onsuccess=()=>r(q.result);});return new Promise(r=>{const q=db.transaction('progress').objectStore('progress').get('sentinel');q.onsuccess=()=>{r(q.result);db.close();};});})).toBe('keep-my-progress');
    server.closeAllConnections();await new Promise<void>(r=>server.close(()=>r()));
    await page.reload();await expect(page.getByText(/Testversion C/)).toBeVisible();
  }finally{await other.close();await page.close();server.closeAllConnections();if(server.listening)await new Promise<void>(r=>server.close(()=>r()));}
});

test('incomplete offline cache reports failure and retry repairs the missing asset', async({page})=>{
 await page.goto('/');await expect(page.getByText('Bereit zum Lernen',{exact:true})).toBeVisible();
 await page.evaluate(async()=>{const keys=(await caches.keys()).filter(k=>k.startsWith('mandarin-v01-'));for(const key of keys)await(await caches.open(key)).delete('/audio/mandarin/polly-nihao.mp3');});
 await page.reload();await expect(page.getByText('Noch nicht offline bereit. Prüfe die Internetverbindung und versuche es erneut.',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Vorbereitung erneut versuchen',exact:true}).click();
 await expect(page.getByText('Bereit zum Lernen',{exact:true})).toBeVisible();
 expect(await page.evaluate(async()=>!!(await caches.match('/audio/mandarin/polly-nihao.mp3')))).toBe(true);
});
