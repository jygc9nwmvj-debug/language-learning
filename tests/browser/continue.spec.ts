import {test,expect} from '@playwright/test';
for(const empty of [true,false]) test(`voluntary repeat is available after ${empty?'no due work':'a completed round'} and preserves history`,async({page})=>{
 await page.goto('/');await expect(page.getByRole('button',{name:'Weiterlernen',exact:true})).toBeVisible();
 await page.evaluate(async empty=>{
  const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});
  await new Promise<void>(r=>{const t=db.transaction(['sessions','events'],'readwrite');
   t.objectStore('sessions').put({id:'previous',plan:empty?['closure']:['read-hao','closure'],index:empty?0:1,completed:false,startedAt:Date.now(),updatedAt:Date.now(),script:'hant'});
   t.objectStore('events').put({id:'keep-history',at:Date.now(),sessionId:'previous',taskId:'read-hao',type:'attempt',contentVersion:'lesson1-a1',detail:{result:'success'}});t.oncomplete=()=>r();});db.close();
 },empty);
 await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
 if(empty) await expect(page.getByRole('heading',{name:'Im Moment ist nichts fällig.'})).toBeVisible();
 else {await page.getByRole('button',{name:'Weiter',exact:true}).click();await expect(page.getByRole('heading',{name:'Runde abgeschlossen.'})).toBeVisible();}
 await page.getByRole('button',{name:'Lesson 1 erneut durchgehen',exact:true}).click();
 await expect(page.locator('.hanziHero')).toHaveText('你好');
 const saved=await page.evaluate(async()=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});const read=(table:string,key:string)=>new Promise<any>(r=>{const q=db.transaction(table).objectStore(table).get(key);q.onsuccess=()=>r(q.result);});const result=[await read('sessions','previous'),await read('events','keep-history')];db.close();return result;});
 expect(saved[0].id).toBe('previous');expect(saved[1].detail.result).toBe('success');
});
