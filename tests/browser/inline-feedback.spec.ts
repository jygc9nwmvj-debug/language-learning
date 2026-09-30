import {test,expect,type Page} from '@playwright/test';
import {itemMap} from '../../src/languages/mandarin/content';
async function plan(page:Page,task:string,itemId?:string){
 await page.goto('/');await page.getByRole('button',{name:/Lernen starten|Weiterlernen/}).waitFor();
 const item=itemId?itemMap.get(itemId):undefined;
 await page.evaluate(async({task,item})=>{
  const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});
  await new Promise<void>(r=>{const t=db.transaction(['sessions','events'],'readwrite'),now=Date.now();
   t.objectStore('sessions').put({id:'focus',plannerVersion:'d1',plan:[task,'meet-wo','closure'],index:0,completed:false,startedAt:now,updatedAt:now+100,script:'hant'});
   if(item)t.objectStore('events').put({id:'introduced',at:1,sessionId:'prior',taskId:'fixture',type:'introduction_dimensions',detail:{item:item.id,form:item.hant,toneNumbers:item.toneNumbers,script:'hant',dimensions:'meaning,pronunciation,hanzi,writing',introductionVersion:1}});
   t.objectStore('events').put({id:'tone',at:2,sessionId:'prior',taskId:'fixture',type:'tone_attention_confirmed',detail:{item:item?.id,toneNumbers:item?.toneNumbers,attentionVersion:1}});t.objectStore('events').put({id:'notation',at:3,sessionId:'prior',taskId:'tones',type:'tone_notation_introduced',detail:{}});t.oncomplete=()=>r();});db.close();
 },{task,item});await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
}
const cases=[
 ['d-recall-dont-know','dont-know','wo3 bu4 zhi1 dap',true],
 ['d-recall-dont-know','dont-know','wo3 bu4 dzi dap',true],
 ['recall-nihao','nihao','ni2 hao3',true],
 ['recall-nihao','nihao','ni hao',false],
 ['d-recall-dont-know','dont-know','wo3 bu4',false],
 ['d-recall-dont-know','dont-know','我不知道',false],
 ['d-recall-dont-know','dont-know','wo3 bu4 dao4',false],
 ['d-recall-dont-know','dont-know','wo3 bu4 zhi1 dao4 ma',false],
 ['d-recall-dont-know','dont-know','banana orange',false],
 ['d-recall-dont-know','dont-know','wo3 bu4 zhi1 dao4',false],
] as const;
for(const width of [320,390,1280]) for(const [task,item,input,inline] of cases) test(`${width}: ${input}`,async({page})=>{
 await page.setViewportSize({width,height:900});await plan(page,task,item);
 await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill(input);await page.getByRole('button',{name:'Prüfen',exact:true}).click();
 await expect(page.locator('.responseExercise')).toHaveAttribute('data-task-complete','true');
 await expect(page.locator('.inlineCorrection')).toHaveCount(inline?1:0);
 if(inline){await expect(page.locator('.feedback')).toHaveCount(0);await expect(page.locator('.inlineCorrection')).toContainText(input.split(' ')[0]);}
 else if(await page.locator('.productionFeedback').count()) await expect(page.locator('.correctComparison')).toBeVisible();
 else await expect(page.locator('.feedback')).toBeVisible();
 if(await page.locator('.productionFeedback').count()) {
  expect(await page.locator('.productionFeedback').evaluate(el=>el.previousElementSibling===null && el.nextElementSibling?.classList.contains('correctionReference'))).toBe(true);
 }
 await expect(page.getByRole('button',{name:'Überspringen',exact:true})).toBeHidden();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const snapshot=()=>page.evaluate(async()=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result)});const result:any={};for(const name of ['sessions','events','relations'])result[name]=await new Promise(r=>{const q=db.transaction(name).objectStore(name).getAll();q.onsuccess=()=>r(q.result)});db.close();return result;});
 if(width===390)await page.screenshot({path:`work/inline-case-${input.replaceAll(' ','-')}.png`,fullPage:true});
 const before=await snapshot();const text=await page.locator('.responseExercise').innerText();
 const saved=before.sessions.find((s:any)=>s.id==='focus').evaluation.results.main;
 expect(saved.value).toBe(input);expect(Object.keys(saved).sort()).toEqual(['help','kind','message','value']);
 if(input==='wo3 bu4 dzi dap'){
  await expect(page.locator('.inlineCorrection')).toContainText('zhī');await expect(page.locator('.inlineCorrection')).toContainText('dao');
  const phrase=page.locator('.correctionReference .hanziHero');expect((await phrase.boundingBox())!.height).toBeLessThan(70);
  await page.screenshot({path:`work/inline-${width}.png`,fullPage:true});
 }
 if(input==='ni hao'){expect(saved.kind).toBe('attention');await expect(page.locator('.productionFeedback')).toHaveAttribute('data-feedback-state','addition');await expect(page.locator('.productionFeedback del')).toHaveCount(0);await expect(page.locator('.productionFeedback')).toContainText('Richtig. Die Töne fehlen noch:');}
 if(input==='ni2 hao3'){await expect(page.locator('.productionFeedback')).toContainText('Der Ausdruck stimmt.');expect(saved.kind).toBe('attention');}
 if(input==='wo3 bu4 zhi1 dao4'||input==='我不知道'){expect(saved.kind).toBe('success');await expect(page.locator('.correctionReference')).toHaveCount(0);}
 await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();await expect(page.locator('.responseExercise')).toHaveAttribute('data-task-complete','true');
 expect(await page.locator('.responseExercise').innerText()).toBe(text);const after=await snapshot();expect(after.sessions).toEqual(before.sessions);expect(after.relations).toEqual(before.relations);expect(after.events.filter((e:any)=>e.type==='attempt')).toEqual(before.events.filter((e:any)=>e.type==='attempt'));
});
