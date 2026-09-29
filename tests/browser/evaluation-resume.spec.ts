import {test,expect,type Page} from '@playwright/test';
import {itemMap,taskMap} from '../../src/languages/mandarin/content';
import {writeHao} from './writing-helpers';
async function state(page:Page){return page.evaluate(async()=>{
 const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result)});
 const out:any={};for(const key of ['sessions','events','relations'])out[key]=await new Promise(r=>{const q=db.transaction(key).objectStore(key).getAll();q.onsuccess=()=>r(q.result)});db.close();return out;
});}
async function resume(page:Page){await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();}
async function plan(page:Page,task:string,itemId?:string){
 await page.goto('/');await page.getByRole('button',{name:'Weiterlernen',exact:true}).waitFor();
 const items=(taskMap.get(task)?.sequence ?? (itemId?[itemId]:[])).map(id=>itemMap.get(id)!);
 await page.evaluate(async({task,items})=>{
 const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result)});
 await new Promise<void>(r=>{const t=db.transaction(['sessions','events'],'readwrite'),now=Date.now();
 t.objectStore('sessions').put({id:'resume',plannerVersion:'d1',plan:[task,task,'meet-wo','closure'],index:0,completed:false,startedAt:now,updatedAt:now,script:'hant'});
 for(const item of items){t.objectStore('events').put({id:`intro-${item.id}`,sessionId:'prior',taskId:'fixture',at:now,contentVersion:'test',type:'introduction_dimensions',detail:{item:item.id,form:item.hant,toneNumbers:item.toneNumbers,script:'hant',dimensions:'meaning,pronunciation,hanzi,writing,segmentation',introductionVersion:1}});
 t.objectStore('events').put({id:`tone-${item.id}`,sessionId:'prior',taskId:'fixture',at:now,contentVersion:'test',type:'tone_attention_confirmed',detail:{item:item.id,toneNumbers:item.toneNumbers,attentionVersion:1}});}
 t.oncomplete=()=>r();});db.close();},{task,items});await resume(page);
}
const attempts=(s:any)=>s.events.filter((e:any)=>e.type==='attempt');
for(const input of ['ni3 hao3','wo3'])test(`text feedback survives reload without another assessment: ${input}`,async({page})=>{
 await plan(page,'recall-nihao','nihao');await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill(input);
 await page.locator('.responseExercise form').evaluate((f:HTMLFormElement)=>{f.requestSubmit();f.requestSubmit()});
 await expect(page.locator('[data-task-complete=true]')).toBeVisible();const before=await state(page),feedback=await page.locator('.feedback').textContent();expect(attempts(before)).toHaveLength(1);
 await resume(page);await expect(page.locator('.answerSummary')).toContainText(input);await expect(page.locator('.feedback')).toHaveText(feedback!);await expect(page.getByRole('button',{name:'Prüfen',exact:true})).toHaveCount(0);
 expect((await state(page)).relations).toEqual(before.relations);expect(attempts(await state(page))).toEqual(attempts(before));
 await page.getByRole('button',{name:'Weiter',exact:true}).click();await expect(page.getByRole('textbox',{name:'Deine Antwort',exact:true})).toBeVisible();
 // Same task ID at a new position is a new occurrence.
 await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill('ni3 hao3');await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.locator('[data-task-complete=true]')).toBeVisible();expect(attempts(await state(page))).toHaveLength(2);
});
test('Tone Lab restores each answered question, next question and notation feedback',async({page})=>{
 await plan(page,'tones');for(const n of [1,2,3,4]){await page.getByRole('button',{name:`Ton ${n}`,exact:true}).click();await expect(page.locator('.toneLab > [role=status]')).toContainText(n<4?`(${n}/4)`:'Alle vier Töne gehört');}
 await page.getByRole('button',{name:'Bedeutungen aufdecken',exact:true}).click();
 for(const [question,n] of [1,4,3].entries()){
  await page.locator('.toneQuiz').getByRole('button',{name:'Anhören',exact:true}).click();await page.getByRole('button',{name:`Ton ${n} wählen`,exact:true}).click();await expect(page.locator('.toneFeedback')).toBeVisible();
  const before=await state(page),feedback=await page.locator('.toneFeedback').textContent();expect(attempts(before)).toHaveLength(question+1);
  await resume(page);await expect(page.locator('.toneFeedback')).toHaveText(feedback!);await expect(page.getByRole('button',{name:`Ton ${n} wählen`,exact:true})).toBeDisabled();
  expect((await state(page)).relations).toEqual(before.relations);expect(attempts(await state(page))).toEqual(attempts(before));
  await page.getByRole('button',{name:'Weiter',exact:true}).click();await expect(page.locator('.toneFeedback')).toHaveCount(0);
  await resume(page);await expect(page.locator('.toneFeedback')).toHaveCount(0);
 }
 await page.getByRole('textbox',{name:'Schreib denselben Ton jetzt als Zahl.',exact:true}).fill('ma2');await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.locator('.notationCorrect')).toBeVisible();const before=await state(page);
 await resume(page);await expect(page.locator('.notationCorrect')).toBeVisible();await expect(page.locator('.notationResponse')).toContainText('ma2');expect((await state(page)).relations).toEqual(before.relations);
 expect((await state(page)).events.filter((e:any)=>e.type==='tone_notation_practice')).toHaveLength(1);expect(attempts(await state(page))).toHaveLength(3);
});
test('repeated reveal produces one event and preserves assisted assessment',async({page})=>{
 await plan(page,'recall-nihao','nihao');const help=page.getByRole('button',{name:'Hilfe zeigen',exact:true});
 await help.evaluate((b:HTMLButtonElement)=>{b.click();b.click();b.click()});await help.click();
 await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill('ni3 hao3');await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.locator('[data-task-complete=true]')).toBeVisible();
 const saved=await state(page);expect(saved.events.filter((e:any)=>e.type==='pinyin_reveal')).toHaveLength(1);expect(attempts(saved)[0].detail.assisted).toBe(true);
});
test('saved writing result resumes without another writing assessment',async({page})=>{
 await plan(page,'write-recall','hao');await writeHao(page);await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase','saved');const before=await state(page),ink=await page.getByTestId('learner-ink').innerHTML();
 await resume(page);await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase','saved');expect(await page.getByTestId('learner-ink').innerHTML()).toBe(ink);expect((await state(page)).relations).toEqual(before.relations);expect(attempts(await state(page))).toHaveLength(1);
 await page.getByRole('button',{name:'Noch einmal',exact:true}).click();await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase','writing');await page.getByRole('button',{name:'Weiter',exact:true}).click();expect(attempts(await state(page))).toHaveLength(1);
});

test('tone recall and sequence restore their existing result views',async({page})=>{
 await plan(page,'tone-wo','wo');await page.getByRole('button',{name:'Anhören',exact:true}).click();await page.getByRole('button',{name:'Ton 2 wählen',exact:true}).click();await expect(page.locator('.toneFeedback')).toBeVisible();const tone=await state(page);
 await resume(page);await expect(page.getByRole('button',{name:'Ton 2 wählen',exact:true})).toBeDisabled();await expect(page.locator('.toneFeedback')).toBeVisible();expect((await state(page)).relations).toEqual(tone.relations);
 const task=[...taskMap.values()].find(t=>t.kind==='sequence')!;
 await page.getByRole('button',{name:'Für jetzt aufhören',exact:true}).click();
 await plan(page,task.id);
 for(const id of task.sequence!)await page.getByRole('button',{name:itemMap.get(id)!.hant,exact:true}).click();
 await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.locator('[data-task-complete=true]')).toBeVisible();const before=await state(page),response=await page.locator('.hanziSentence').textContent();
 await resume(page);await expect(page.locator('.hanziSentence')).toHaveText(response!);await expect(page.getByRole('button',{name:'Prüfen',exact:true})).toHaveCount(0);expect((await state(page)).relations).toEqual(before.relations);expect(attempts(await state(page))).toEqual(attempts(before));
});
