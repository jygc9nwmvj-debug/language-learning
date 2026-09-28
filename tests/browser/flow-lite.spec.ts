import { finishAttention } from './helpers/attention';
import {test,expect} from '@playwright/test';
async function observeAudio(page:import('@playwright/test').Page, block=false){
 await page.addInitScript((block)=>{
  const plays:string[]=[];const instances:HTMLMediaElement[]=[];Object.assign(window,{referencePlays:plays,referenceInstances:instances,microphoneRequests:0});
  const play=HTMLMediaElement.prototype.play;let rejected=false;
  HTMLMediaElement.prototype.play=function(){plays.push(this.src);instances.push(this);if(block&&!rejected){rejected=true;return Promise.reject(new DOMException('Autoplay test','NotAllowedError'));}return play.call(this);};
  Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:async()=>{(window as any).microphoneRequests++;throw Error('No automatic microphone');}}});
 },block);
}
test('encounter plays once, promotes recording, and next object initializes with its own audio',async({page})=>{
 await observeAudio(page);await page.goto('/');await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
 await finishAttention(page);await expect(page.locator('.pronunciationMeaning')).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>(window as any).referencePlays.length)).toBe(1);
 await expect(page.locator('.speakingPractice')).toHaveAttribute('data-ready-to-record','true');
 expect(await page.getByRole('button',{name:'Aufnehmen',exact:true}).evaluate(e=>getComputedStyle(e).backgroundColor)).toBe('rgb(41, 75, 60)');
 await page.locator('.recordingInfo summary').click();
 expect(await page.evaluate(()=>(window as any).referencePlays.length)).toBe(1);
 expect(await page.evaluate(()=>(window as any).microphoneRequests)).toBe(0);
 await page.getByRole('button',{name:'Weiter',exact:true}).click();await expect(page.locator('.hanziHero')).toHaveText('我');
 await finishAttention(page);await expect(page.locator('.pronunciationMeaning')).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>(window as any).referencePlays.length)).toBe(2);
 const paths=await page.evaluate(()=>(window as any).referencePlays as string[]);expect(paths[0]).toContain('polly-nihao.mp3');expect(paths[1]).toContain('polly-wo.mp3');
 await page.getByRole('button',{name:'Für jetzt aufhören',exact:true}).click();
 await expect(page.getByRole('button',{name:'Weiterlernen',exact:true})).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>(window as any).referenceInstances.every((a:HTMLMediaElement)=>a.paused))).toBe(true);
});
test('blocked reference autoplay offers manual play without repeated attempts or automatic recording',async({page})=>{
 await observeAudio(page,true);await page.goto('/');await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
 await expect(page.getByText('Zum Anhören auf Play tippen.')).toBeVisible();await expect(page.locator('.pronunciationMeaning')).toHaveCount(0);
 expect(await page.evaluate(()=>(window as any).referencePlays.length)).toBe(1);
 await page.getByRole('button',{name:'Anhören',exact:true}).click();await finishAttention(page);await expect(page.locator('.pronunciationMeaning')).toBeVisible();
 expect(await page.evaluate(()=>(window as any).referencePlays.length)).toBe(2);expect(await page.evaluate(()=>(window as any).microphoneRequests)).toBe(0);
});
test('restart is explicit, cancellation preserves progress, confirmation clears it and begins at nihao',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();await finishAttention(page);await expect(page.locator('.pronunciationMeaning')).toBeVisible();
 await page.getByRole('button',{name:'Weiter',exact:true}).click();await expect(page.locator('.hanziHero')).toHaveText('我');
 await page.getByRole('button',{name:'Für jetzt aufhören',exact:true}).click();await page.getByText('Einstellungen & Sicherung',{exact:true}).click();await page.getByText('Von vorne beginnen',{exact:true}).click();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Lernstand sichern',exact:true}).click();expect((await download).suggestedFilename()).toMatch(/^mandarin-.*\.json$/);
 page.once('dialog',dialog=>dialog.dismiss());await page.getByRole('button',{name:'Lernstand zurücksetzen …',exact:true}).click();
 await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();await expect(page.locator('.hanziHero')).toHaveText('我');
 await page.getByRole('button',{name:'Für jetzt aufhören',exact:true}).click();await page.getByText('Einstellungen & Sicherung',{exact:true}).click();await page.getByText('Von vorne beginnen',{exact:true}).click();
 page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Lernstand zurücksetzen …',exact:true}).click();
 await expect(page.getByText('Dein Lernstand wurde zurückgesetzt. Weiterlernen beginnt wieder mit 你好.')).toBeVisible();
 const counts=await page.evaluate(async()=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});const result=await Promise.all([...db.objectStoreNames].map(name=>new Promise<number>(r=>{const q=db.transaction(name).objectStore(name).count();q.onsuccess=()=>r(q.result);})));db.close();return result;});expect(counts.every(n=>n===0)).toBe(true);
 await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();await expect(page.locator('.hanziHero')).toHaveText('你好');await finishAttention(page);await expect(page.locator('.pronunciationMeaning')).toBeVisible();
});
