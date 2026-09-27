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
    await expect(page.getByText('Für offline bereit',{exact:true})).toBeVisible();
    await page.reload(); await expect(page.getByText(/Testversion 0.1.2/)).toBeVisible();
    // Stop the origin instead of WebKit's broken offline-emulation switch (Playwright #42775).
    server.closeAllConnections();await new Promise<void>(resolve=>server.close(()=>resolve()));
    await page.reload();
    await expect(page.getByRole('button',{name:'Weiterlernen',exact:true})).toBeVisible();
  } finally {await page.close();server.closeAllConnections();if(server.listening)await new Promise<void>(resolve=>server.close(()=>resolve()));}
});
