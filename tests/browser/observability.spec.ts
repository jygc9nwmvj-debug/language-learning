import {test,expect} from '@playwright/test';
import {learningReport} from '../../src/core/observability/report';
test('normal recall keeps behavior while recording timing, assistance and source evidence',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Weiterlernen',exact:true}).waitFor();
 await page.evaluate(async()=>{
 const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});
 await new Promise<void>(r=>{const t=db.transaction(['events','sessions'],'readwrite'),now=Date.now();
 t.objectStore('sessions').put({id:'observability',plannerVersion:'d1',plan:['recall-nihao','d-recall-speak-slowly','closure'],index:0,completed:false,startedAt:now,updatedAt:now,script:'hant'});
 for(const [item,form,toneNumbers] of [['nihao','你好','ni3 hao3'],['speak-slowly','請說慢一點','qing3 shuo1 man4 yi1 dian3']])t.objectStore('events').put({id:'intro-'+item,type:'introduction_dimensions',at:now-86_400_000,sessionId:'prior',taskId:'fixture',contentVersion:'test',detail:{item,form,toneNumbers,script:'hant',dimensions:'meaning,pronunciation',introductionVersion:1}});
 t.oncomplete=()=>r();});db.close();});
 await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
 await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill('ni3 hao3');await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.locator('.feedback')).toContainText('Richtig');
 await page.getByRole('button',{name:'Weiter',exact:true}).click();await page.getByRole('button',{name:'Hilfe zeigen',exact:true}).click();
 await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill('qing3 shuo1 man4 yi4 dian3');await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.locator('.feedback')).toBeVisible();
 await page.getByRole('button',{name:'Für jetzt aufhören',exact:true}).click();await expect(page.getByRole('button',{name:'Weiterlernen',exact:true})).toBeVisible();
 const events=await page.evaluate(async()=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});const events=await new Promise<any[]>(r=>{const q=db.transaction('events').objectStore('events').getAll();q.onsuccess=()=>r(q.result);});db.close();return events;});
 const attempts=events.filter(e=>e.type==='attempt').sort((a,b)=>a.at-b.at);expect(attempts).toHaveLength(2);
 expect(attempts[0].detail).toMatchObject({assisted:false,evidence:'app_checked',observabilityVersion:1});expect(attempts[1].detail.assisted).toBe(true);
 for(const e of attempts){expect(e.detail.activeVisitId).toBeTruthy();expect(e.detail.activeTaskMs).toBeGreaterThan(0);expect(e.detail.correction).toBeUndefined();}
 expect(events.some(e=>e.type==='active_time')).toBe(true);
 const report=learningReport(events);expect(report.rows.filter(r=>r.dimension==='written_phrase_retrieval').map(r=>r.outcome)).toEqual(['unaided_success','assisted_success']);expect(report.activeMs).toBeGreaterThan(0);
 expect(report.rows.every(r=>r.sinceIntroductionMs!==null&&r.sinceIntroductionMs>=86_400_000)).toBe(true);
});
