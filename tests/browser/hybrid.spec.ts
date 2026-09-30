import {test,expect,type Page} from '@playwright/test';
async function seed(page:Page,id:string){
 await page.goto('/');await page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/}).waitFor();
 await page.evaluate(async id=>{
 const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});
 const now=Date.now(),old=now-2*86_400_000;
 await new Promise<void>(r=>{const tx=db.transaction(['sessions','events'],'readwrite');tx.objectStore('sessions').clear();tx.objectStore('events').clear();
 tx.objectStore('sessions').put({id,plannerVersion:'d1',plan:['meet-ni','meet-wo','d-recall-speak-slowly','closure'],index:2,completed:false,startedAt:now,updatedAt:now,script:'hant'});
 const put=(type:string,detail:any,taskId='fixture',sessionId='prior',at=old)=>tx.objectStore('events').put({id:crypto.randomUUID(),at,sessionId,taskId,type,detail,contentVersion:'test'});
 for(const [item,form,toneNumbers] of [['speak-slowly','請說慢一點','qing3 shuo1 man4 yi1 dian3'],['hao','好','hao3'],['ni','你','ni3'],['wo','我','wo3']])put('introduction_dimensions',{item,form,toneNumbers,script:'hant',dimensions:'meaning,pronunciation,hanzi,writing',introductionVersion:1});
 for(const task of ['meet-ni','meet-wo','meet-hao','read-ni','read-wo'])put('task_completed',{},task,id,now-1000);
 for(const item of ['nihao','xiexie'])put('attempt',{result:'success',assisted:false,objectId:'cmn:'+item},'read-'+item,id,now-900);
 put('introduction_dimensions',{item:'nihao'},'meet-nihao',id,now-800);
 tx.oncomplete=()=>r();});db.close();
 },id);await page.reload();await page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/}).click();
}
async function state(page:Page){return page.evaluate(async()=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});const out:any={};for(const key of ['events','relations','sessions'])out[key]=await new Promise(r=>{const q=db.transaction(key).objectStore(key).getAll();q.onsuccess=()=>r(q.result);});db.close();return out;});}
test('mobile screenless evidence, optional paper skip and voluntary stop/continue',async({page})=>{
 await page.setViewportSize({width:390,height:844});await seed(page,'hybrid-a');
 await expect(page.getByRole('button',{name:'Aufdecken',exact:true})).toBeVisible();
 const surface=page.locator('.hybridRecall');await expect(surface).toContainText('bitte sprich etwas langsamer');await expect(surface).not.toContainText(/\p{Script=Han}/u);
 await expect(surface.locator('.pinyin,.phraseUnit,.audioButton,input')).toHaveCount(0);
 await page.screenshot({path:'work/e-screenless.png',fullPage:true,animations:'disabled'});
 await page.getByRole('button',{name:'Aufdecken',exact:true}).click();
 await expect(surface.locator('.phraseUnits')).toBeVisible();await expect(surface.locator('.audioButton').first()).toBeEnabled();
 await page.getByRole('button',{name:'Ja, gewusst',exact:true}).click();
 await expect(page.getByRole('button',{name:'Fertig – vergleichen',exact:true})).toBeVisible();
 const before=await state(page);const result=before.events.find((e:any)=>e.type==='screenless_recall');
 expect(result.detail).toMatchObject({evidence:'self_report',pronunciation:'unknown',target:'meaning',assisted:false});
 expect(before.relations.some((r:any)=>r.objectId==='cmn:speak-slowly'&&r.target==='production')).toBe(false);
 await expect(surface).not.toContainText(/\p{Script=Han}/u);
 await expect(page.locator('.paperPrompts')).toContainText('ich');await expect(page.locator('.paperPrompts')).toContainText('gut');
 await page.screenshot({path:'work/e-paper.png',fullPage:true,animations:'disabled'});
 await page.getByRole('button',{name:'Später',exact:true}).click();
 await expect(page.locator('.lessonCard')).not.toHaveAttribute('data-task-kind','closure');
 const skipped=await state(page);expect(skipped.relations).toEqual(before.relations);expect(skipped.events.filter((e:any)=>e.type==='paper_skipped')).toHaveLength(1);expect(skipped.events.filter((e:any)=>e.type==='meaningful_stop_offered')).toHaveLength(0);
 await page.getByRole('button',{name:'Für jetzt aufhören',exact:true}).click();await expect(page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/})).toBeEnabled();
 expect((await state(page)).events.some((e:any)=>e.type==='session_pause')).toBe(true);
 await page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/}).click();await expect(page.locator('.lessonCard')).toBeVisible();
 expect((await state(page)).sessions.filter((s:any)=>!s.completed)).toHaveLength(1);
 // Same eligibility fixture, this time finish paper and continue automatically.
 await seed(page,'hybrid-b');await page.getByRole('button',{name:'Aufdecken',exact:true}).click();await page.getByRole('button',{name:'Ja, gewusst',exact:true}).click();
 await page.getByRole('button',{name:'Fertig – vergleichen',exact:true}).click();await expect(page.locator('.paperAnswers')).toContainText('好');
 await page.getByRole('button',{name:'Alle aus dem Gedächtnis geschrieben',exact:true}).click();await expect(page.locator('.lessonCard')).not.toHaveAttribute('data-task-kind','closure');
 await expect(page.locator('.lessonCard')).toBeVisible();expect((await state(page)).events.some((e:any)=>e.type==='voluntary_continue_after_stop')).toBe(false);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('revealed recall survives pause and remains assisted without pronunciation scoring',async({page})=>{
 await page.setViewportSize({width:320,height:844});await seed(page,'hybrid-reveal');
 await page.getByRole('button',{name:'Aufdecken',exact:true}).click();await page.getByRole('button',{name:'Für jetzt aufhören',exact:true}).click();
 await page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/}).click();await expect(page.getByRole('button',{name:'Direkt nachgesehen',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Direkt nachgesehen',exact:true}).click();
 const saved=await state(page);expect(saved.events.find((e:any)=>e.type==='screenless_recall').detail).toMatchObject({assisted:true,revealedBeforeAttempt:true,pronunciation:'unknown',result:'unsure'});
 await page.getByRole('button',{name:'Später',exact:true}).click();await expect(page.getByRole('button',{name:'Für jetzt beenden',exact:true})).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
