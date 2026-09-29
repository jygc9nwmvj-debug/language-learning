import {test,expect,type Page} from '@playwright/test';
async function state(page:Page){return page.evaluate(async()=>{
 const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});
 const out:any={};for(const key of ['sessions','events','relations','preferences'])out[key]=await new Promise(r=>{const q=db.transaction(key).objectStore(key).getAll();q.onsuccess=()=>r(q.result);});db.close();return out;
});}
async function start(page:Page){
 await page.goto('/');await page.getByRole('button',{name:'Weiterlernen',exact:true}).waitFor();
 await page.evaluate(async()=>{
 const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});
 await new Promise<void>(r=>{const tx=db.transaction(['sessions','events','preferences'],'readwrite'),now=Date.now();
 tx.objectStore('sessions').put({id:'boundary',plannerVersion:'d1',plan:['recall-nihao','closure'],index:0,completed:false,startedAt:now,updatedAt:now,script:'hant'});
 tx.objectStore('preferences').put({key:'name',value:'Pilot'});
 tx.objectStore('events').put({id:'intro',at:now-86400000,sessionId:'prior',taskId:'fixture',type:'introduction_dimensions',contentVersion:'test',detail:{item:'nihao',form:'你好',toneNumbers:'ni3 hao3',script:'hant',dimensions:'meaning,pronunciation',introductionVersion:1}});
 tx.objectStore('events').put({id:'historical-stop',at:now-86400000,sessionId:'prior',taskId:'closure',type:'meaningful_stop_offered',contentVersion:'test',detail:{}});
 tx.oncomplete=()=>r();});db.close();});
 await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
 await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill('ni3 hao3');await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.locator('.feedback')).toContainText('Richtig');
 await page.evaluate(()=>{(window as any).stopScreens=[];new MutationObserver(()=>{if(/Runde abgeschlossen|Guter Punkt für eine Pause|Weiterüben/.test(document.body.innerText))(window as any).stopScreens.push(document.body.innerText);}).observe(document.body,{subtree:true,childList:true,characterData:true});});
}
test('batch completion continues, persists and allows voluntary pause/re-entry across multiple batches',async({page})=>{
 await start(page);const before=await state(page);
 await page.getByRole('button',{name:'Weiter',exact:true}).click();
 await expect.poll(async()=> (await state(page)).sessions.filter((s:any)=>s.completed).length).toBe(1);
 await expect(page.locator('.lessonCard')).not.toHaveAttribute('data-task-kind','closure');
 let saved=await state(page);expect(saved.relations).toEqual(before.relations);expect(saved.events).toEqual(expect.arrayContaining(before.events));expect(saved.preferences).toEqual(before.preferences);
 const first=saved.sessions.find((s:any)=>!s.completed);expect(first.plannerVersion).toBe('d1');expect(first.index).toBe(0);expect(first.updatedAt).toBeGreaterThan(saved.sessions.find((s:any)=>s.id==='boundary').updatedAt);
 // Cross a second actual scheduler batch without any completion/stop dismissal.
 for(let n=0;n<first.plan.length-1;n++){
  await page.locator('.skipButton').click();
  if(n<first.plan.length-2)await expect.poll(async()=> (await state(page)).sessions.find((s:any)=>s.id===first.id).index).toBe(n+1);
 }
 await expect.poll(async()=> (await state(page)).sessions.filter((s:any)=>s.completed).length).toBe(2);
 await expect(page.locator('.lessonCard')).not.toHaveAttribute('data-task-kind','closure');
 saved=await state(page);const current=saved.sessions.find((s:any)=>!s.completed);
 await page.getByRole('button',{name:'Für jetzt aufhören',exact:true}).click();await expect(page.getByRole('button',{name:'Weiterlernen',exact:true})).toBeVisible();
 await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
 await expect(page.locator('.lessonCard')).toBeVisible();
 saved=await state(page);expect(saved.sessions.find((s:any)=>!s.completed)).toEqual(current);
 expect(saved.events.filter((e:any)=>['session_stop_accepted','voluntary_continue_after_stop'].includes(e.type))).toHaveLength(0);
 expect(saved.events.filter((e:any)=>e.type==='meaningful_stop_offered').map((e:any)=>e.id)).toEqual(['historical-stop']);
 expect(saved.events.filter((e:any)=>e.type==='session_end')).toHaveLength(2);
 expect(saved.events.find((e:any)=>e.type==='learning_continue'&&e.sessionId===first.id).detail).toMatchObject({reason:'batch_transition',previousSessionId:'boundary'});
 expect(saved.events.some((e:any)=>e.type==='session_pause'&&e.sessionId===current.id)).toBe(true);
 expect(saved.events.some((e:any)=>e.type==='session_resume'&&e.sessionId===current.id)).toBe(true);
 expect(saved.events.some((e:any)=>e.type==='active_time'&&e.detail.activeTaskMs>0)).toBe(true);
 expect(await page.evaluate(()=>(window as any).stopScreens??[])).toEqual([]);
});
test('failed batch save rolls back and can retry without losing completed evidence',async({page})=>{
 await start(page);const before=await state(page);
 await page.evaluate(()=>{const put=IDBObjectStore.prototype.put;let failed=false;IDBObjectStore.prototype.put=function(value:any,...args:any[]){if(!failed&&this.name==='sessions'&&value.id!=='boundary'){failed=true;throw new DOMException('Test storage failure','QuotaExceededError');}return put.call(this,value,...args);};});
 await page.getByRole('button',{name:'Weiter',exact:true}).click();
 await expect(page.getByRole('button',{name:'Erneut versuchen',exact:true})).toBeVisible();
 let saved=await state(page);expect(saved.sessions).toHaveLength(1);expect(saved.sessions[0]).toMatchObject({id:'boundary',completed:false,index:1});expect(saved.relations).toEqual(before.relations);expect(saved.events.some((e:any)=>e.type==='session_end')).toBe(false);
 await page.getByRole('button',{name:'Erneut versuchen',exact:true}).click();
 await expect(page.locator('.lessonCard')).not.toHaveAttribute('data-task-kind','closure');
 saved=await state(page);expect(saved.sessions).toHaveLength(2);expect(saved.events.filter((e:any)=>e.type==='session_end')).toHaveLength(1);expect(saved.relations).toEqual(before.relations);
 expect(await page.evaluate(()=>(window as any).stopScreens)).toEqual([]);
});
