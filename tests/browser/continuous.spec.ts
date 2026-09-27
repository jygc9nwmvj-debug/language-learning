import {test,expect} from '@playwright/test';
async function seed(page:any,old=false){
 await page.goto('/');await expect(page.getByRole('button',{name:'Weiterlernen',exact:true})).toBeVisible();
 await page.evaluate(async(old:boolean)=>{
  const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});
  await new Promise<void>(r=>{const t=db.transaction(['events','sessions'],'readwrite');
   for(const id of ['nihao','wo','ni','hao','wojiao','askname','xiexie','zaijian'])t.objectStore('events').put({id:id,at:Date.now()-86400000,sessionId:'prior',taskId:'meet-'+id,type:'task_completed',contentVersion:'b',detail:{}});
   if(old)t.objectStore('sessions').put({id:'old',plan:['write-guided','closure'],index:0,completed:false,startedAt:Date.now(),updatedAt:Date.now(),script:'hant'});
   t.oncomplete=()=>r();});db.close();
 },old);await page.reload();
}
async function current(page:any){return page.evaluate(async()=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});return new Promise<any>(r=>{const q=db.transaction('sessions').objectStore('sessions').getAll();q.onsuccess=()=>{db.close();r(q.result.sort((a:any,b:any)=>b.updatedAt-a.updatedAt)[0]);};});});}
test('migration, short pause, next-day continuation preserve history and dose new objects',async({page})=>{
 await seed(page,true);await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();await expect(page.locator('.lessonCard')).toBeVisible();await expect(page.locator('.lessonCard')).toHaveAttribute('aria-busy','false');
 let s=await current(page);expect(s.id).not.toBe('old');expect(s.plannerVersion).toBe('d1');expect(s.plan.length).toBeLessThanOrEqual(8);expect(s.plan.some((id:string)=>id.startsWith('d-meet-'))).toBe(true);
 await page.getByRole('button',{name:'Überspringen',exact:true}).click();s=await current(page);
 await page.getByRole('button',{name:'Für jetzt aufhören',exact:true}).click();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();await expect(page.locator('.lessonCard')).toBeVisible();await expect(page.locator('.lessonCard')).toHaveAttribute('aria-busy','false');expect((await current(page)).index).toBe(s.index);
 await page.getByRole('button',{name:'Für jetzt aufhören',exact:true}).click();
 await page.evaluate(()=>{const original=Date.now;Date.now=()=>original()+86400000;});await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();await expect(page.locator('.lessonCard')).toBeVisible();await expect(page.locator('.lessonCard')).toHaveAttribute('aria-busy','false');await expect.poll(async()=>(await current(page))?.id).not.toBe(s.id);const next=await current(page);expect(next.plannerVersion).toBe('d1');
});
test('new repair expression uses progressive reference and available Polly audio',async({page})=>{
 await seed(page);await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();await expect(page.locator('.lessonCard')).toBeVisible();await expect(page.locator('.lessonCard')).toHaveAttribute('aria-busy','false');
 for(let n=0;n<7;n++){const s=await current(page);if(s.plan[s.index]==='d-meet-dont-understand')break;await page.getByRole('button',{name:'Überspringen',exact:true}).click();await expect.poll(async()=>(await current(page)).index).not.toBe(s.index);}
 await expect(page.locator('.hanziHero')).toHaveText('我聽不懂');await page.getByRole('button',{name:'Anhören',exact:true}).click();
 await expect(page.locator('.pronunciationMeaning')).toContainText('ich verstehe nicht');await expect(page.getByRole('button',{name:'Aufnehmen',exact:true})).toBeEnabled();await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeEnabled();
});
test('generic new writing model mounts and numeric reconstruction saves one real attempt',async({page})=>{
 await seed(page);
 async function plan(ids:string[]){await page.evaluate(async ids=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});await new Promise<void>(r=>{const t=db.transaction('sessions','readwrite');t.objectStore('sessions').put({id:crypto.randomUUID(),plannerVersion:'d1',plan:[...ids,'closure'],index:0,completed:false,startedAt:Date.now(),updatedAt:Date.now()+100,script:'hant'});t.oncomplete=()=>r();});db.close();},ids);await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();await expect(page.locator('.lessonCard')).toBeVisible();await expect(page.locator('.lessonCard')).toHaveAttribute('aria-busy','false');}
 await plan(['d-write-yi','d-sequence-123']);await expect(page.locator('.writingSurface svg').first()).toBeVisible();await page.getByRole('button',{name:'Überspringen',exact:true}).click();
 for(const name of ['一','二','三'])await page.getByRole('button',{name,exact:true}).click();await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.getByRole('status')).toContainText('Die Reihenfolge stimmt.');
});
