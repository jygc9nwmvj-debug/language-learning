import {test,expect,type Page} from '@playwright/test';
async function fixture(page:Page,blocked=false){
 await page.addInitScript(({blocked})=>{
  const w=window as any; w.autoAttempts=0; w.captureRequests=0;
  const play=HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play=function(){if(this.src.startsWith('blob:')){w.autoAttempts++;if(blocked)return Promise.reject(new DOMException('Blocked','NotAllowedError'));}return play.call(this);};
  Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>new Promise(resolve=>{w.captureRequests++;w.grant=()=>{const ctx=new AudioContext();const stream=ctx.createMediaStreamDestination().stream;w.fixture={ctx,stream};resolve(stream);};})}});
  class Recorder extends EventTarget{
   static isTypeSupported(){return true;}state='inactive';mimeType='audio/mpeg';onstart:any;onstop:any;ondataavailable:any;
   start(){this.state='recording';setTimeout(()=>this.onstart?.(),0);}
   stop(){this.state='inactive';w.finalize=async()=>{const bytes=await(await fetch('/audio/mandarin/polly-nihao.mp3')).arrayBuffer();this.ondataavailable?.({data:new Blob([bytes],{type:'audio/mpeg'})});this.onstop?.();};}
  }w.MediaRecorder=Recorder;
 },{blocked});
 await page.goto('/');await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
}
async function record(page:Page){
 await page.getByRole('button',{name:'Aufnehmen',exact:true}).click();
 await page.evaluate(()=>(window as any).grant());
 await expect(page.getByText(/^Aufnahme läuft/)).toBeVisible();
 await page.getByRole('button',{name:'Aufnahme beenden',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>typeof (window as any).finalize)).toBe('function');
}
test('advance is atomic through permission, capture, finalization and own playback',async({page})=>{
 await fixture(page);
 const next=page.getByRole('button',{name:'Weiter',exact:true});
 await expect(next).toBeDisabled();
 await page.getByRole('button',{name:'Pinyin und Bedeutung',exact:true}).click();
 await expect(next).toBeEnabled();
 // Same event loop: exercise the synchronous guard, not only rendered disabled styling.
 await page.evaluate(()=>{const buttons=[...document.querySelectorAll('button')];buttons.find(b=>b.textContent==='Aufnehmen')!.click();buttons.find(b=>b.textContent==='Weiter')!.click();});
 await expect(next).toBeDisabled();await expect(page.locator('.hanziHero')).toHaveText('你好');
 await page.evaluate(()=>(window as any).grant());await expect(page.getByText(/^Aufnahme läuft/)).toBeVisible();
 await expect(next).toBeDisabled();
 await page.getByRole('button',{name:'Aufnahme beenden',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>typeof (window as any).finalize)).toBe('function');
 await expect(next).toBeDisabled();await expect(page.locator('.hanziHero')).toHaveText('你好');
 await page.evaluate(()=>(window as any).finalize());
 const own=page.getByLabel('Deine Aufnahme',{exact:true});await expect(own).toHaveAttribute('src',/^blob:/);
 await expect.poll(()=>page.evaluate(()=>(window as any).autoAttempts)).toBe(1);
 await expect.poll(()=>own.evaluate((a:HTMLAudioElement)=>!a.paused)).toBe(true);await expect(next).toBeDisabled();
 await own.evaluate((a:HTMLAudioElement)=>a.pause());await expect(next).toBeEnabled();
 await page.evaluate(()=>{const buttons=[...document.querySelectorAll('button')];buttons.find(b=>b.textContent==='Weiter')!.click();buttons.find(b=>b.textContent==='Aufnehmen')!.click();});
 await expect(page.locator('.speakingPractice')).toHaveCount(0);
 expect(await page.evaluate(()=>(window as any).captureRequests)).toBe(1);
 await expect(page.getByRole('button',{name:'Ton 1',exact:true})).toBeEnabled();
 expect(await page.evaluate(()=>(window as any).fixture.stream.getTracks().every((t:MediaStreamTrack)=>t.readyState==='ended'))).toBe(true);
});
test('blocked automatic playback retains recording and releases transition',async({page})=>{
 await fixture(page,true);await record(page);await page.evaluate(()=>(window as any).finalize());
 await expect(page.getByText('Automatisches Abspielen ist hier gesperrt. Tippe auf Wiedergabe.')).toBeVisible();
 await expect(page.getByLabel('Deine Aufnahme',{exact:true})).toHaveAttribute('src',/^blob:/);
 await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeEnabled();
 expect(await page.evaluate(()=>(window as any).autoAttempts)).toBe(1);
 await page.getByRole('button',{name:'Aufnehmen',exact:true}).click();await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeDisabled();
});
test('pause cancels pending permission without poisoning remounted audio',async({page})=>{
 await fixture(page);await page.getByRole('button',{name:'Aufnehmen',exact:true}).click();
 await page.getByRole('button',{name:'Für jetzt aufhören',exact:true}).click();await expect(page.getByRole('button',{name:'Weiterlernen',exact:true})).toBeVisible();await page.evaluate(()=>(window as any).grant());
 await expect.poll(()=>page.evaluate(()=>(window as any).fixture.stream.getTracks().every((t:MediaStreamTrack)=>t.readyState==='ended'))).toBe(true);
 await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
 await expect(page.getByRole('button',{name:'Anhören',exact:true})).toBeEnabled();
});
test('checked reading develops in place and next object starts fresh on mobile',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.getByRole('button',{name:'Weiterlernen',exact:true})).toBeVisible();
 await page.evaluate(async()=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});await new Promise<void>(r=>{const t=db.transaction('sessions','readwrite');t.objectStore('sessions').put({id:'flow',plan:['read-hao','read-ni','closure'],index:0,completed:false,startedAt:Date.now(),updatedAt:Date.now(),script:'hant'});t.oncomplete=()=>r();});db.close();});
 await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
 await page.locator('input').fill('gut');await page.getByRole('button',{name:'Prüfen',exact:true}).click();
 await expect(page.locator('.answerSummary')).toContainText('gut');await expect(page.getByRole('button',{name:'Prüfen',exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Anhören',exact:true})).toBeEnabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'work/build-c-mobile.png',fullPage:true,animations:'disabled'});
 await page.getByRole('button',{name:'Weiter',exact:true}).click();await expect(page.locator('input')).toHaveValue('');await expect(page.locator('.answerSummary')).toHaveCount(0);
 await page.setViewportSize({width:320,height:740});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
