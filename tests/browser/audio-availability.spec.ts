import {test,expect,type Page} from '@playwright/test';
import {itemMap,taskMap} from '../../src/languages/mandarin/content';
import {composeContinuous} from '../../src/languages/mandarin/continuous';
async function state(page:Page){return page.evaluate(async()=>{
 const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result)});
 const out:any={};for(const key of ['sessions','events','relations'])out[key]=await new Promise(r=>{const q=db.transaction(key).objectStore(key).getAll();q.onsuccess=()=>r(q.result)});db.close();return out;
});}
async function resume(page:Page){await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();}
async function plan(page:Page,task:string){
 await page.goto('/');await page.getByRole('button',{name:'Weiterlernen',exact:true}).waitFor();
 const item=itemMap.get(taskMap.get(task)!.itemId!)!;
 await page.evaluate(async({task,item})=>{
  const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result)});
  await new Promise<void>(r=>{const t=db.transaction(['sessions','events','relations'],'readwrite'),now=Date.now();
   for(const table of ['sessions','events','relations'])t.objectStore(table).clear();
   t.objectStore('sessions').put({id:'audio-availability',plannerVersion:'d1',plan:[task,'meet-wo','closure'],index:0,completed:false,startedAt:now,updatedAt:now,script:'hant'});
   t.objectStore('events').put({id:'intro',sessionId:'prior',taskId:'fixture',at:now,contentVersion:'test',type:'introduction_dimensions',detail:{item:item.id,form:item.hant,toneNumbers:item.toneNumbers,script:'hant',dimensions:item.introduction.dimensions.join(','),introductionVersion:1}});
   t.objectStore('events').put({id:'tone',sessionId:'prior',taskId:'fixture',at:now,contentVersion:'test',type:'tone_attention_confirmed',detail:{item:item.id,toneNumbers:item.toneNumbers,attentionVersion:1}});
   t.objectStore('events').put({id:'notation',sessionId:'prior',taskId:'tones',at:now,contentVersion:'test',type:'tone_notation_introduced',detail:{}});
   t.oncomplete=()=>r();});db.close();
 },{task,item});await resume(page);
}
const attempts=(s:any)=>s.events.filter((e:any)=>e.type==='attempt');
const optional=(s:any)=>s.events.filter((e:any)=>e.type==='optional_reference_audio');
async function answer(page:Page,input:string){await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill(input);await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.locator('.responseExercise')).toHaveAttribute('data-task-complete','true');}
test.beforeEach(async({page})=>{
 await page.addInitScript(()=>{(window as any).__audioPlays=[];const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){(window as any).__audioPlays.push(this.src);return play.call(this);};});
});
for(const [task,input,kind,result] of [
 ['d-recall-dont-understand','bu','error','failure'],
 ['recall-xiexie','ni3 hao3','error','failure'],
 ['recall-nihao','ni hao','attention','success'],
 ['recall-nihao','ni2 hao3','attention','success'],
])test(`correction reference preserves result and survives reload: ${task}/${input}`,async({page})=>{
 await plan(page,task);await expect(page.locator('.responseExercise .audioButton')).toHaveCount(0);
 await answer(page,input);await expect(page.locator('.responseExercise')).toHaveAttribute('data-outcome',kind);
 const group=page.getByRole('group',{name:'Korrekte Zielphrase anhören'});
 await expect(group.locator('.audioButton')).toHaveCount(2);expect(await page.evaluate(()=>(window as any).__audioPlays)).toEqual([]);
 const before=await state(page);expect(attempts(before)).toHaveLength(1);expect(attempts(before)[0].detail.result).toBe(result);expect(attempts(before)[0].detail.assisted).toBe(false);
 for(const [index,label] of ['Anhören','Langsam gesprochen'].entries()){
  await group.getByRole('button',{name:label,exact:true}).click();await expect.poll(async()=>optional(await state(page)).length).toBe(index+1);
 }
 const after=await state(page);expect(after.relations).toEqual(before.relations);expect(after.sessions).toEqual(before.sessions);expect(attempts(after)).toEqual(attempts(before));
 expect(after.events.filter((e:any)=>['audio_replay','pinyin_reveal','slow_audio'].includes(e.type))).toHaveLength(0);
 expect(optional(after).every((e:any)=>e.detail.optionalPractice&&e.detail.context==='correction')).toBe(true);
 const now=Date.now();expect(composeContinuous(after.relations,after.events,'hant',now)).toEqual(composeContinuous(before.relations,before.events,'hant',now));
 const item=itemMap.get(taskMap.get(task)!.itemId!)!;
 expect(await page.evaluate(()=>(window as any).__audioPlays)).toEqual([item.audio,item.slowAudio].map(src=>new URL(src!,page.url()).href));
 await resume(page);await expect(group).toBeVisible();expect(await page.evaluate(()=>(window as any).__audioPlays)).toEqual([]);
 await group.getByRole('button',{name:'Anhören',exact:true}).click();await expect.poll(async()=>optional(await state(page)).length).toBe(3);
 expect(attempts(await state(page))).toEqual(attempts(before));expect((await state(page)).relations).toEqual(before.relations);
});
test('fully correct production adds no feedback audio, including after explicit help',async({page})=>{
 for(const help of [false,true]){
  await plan(page,'recall-nihao');if(help)await page.getByRole('button',{name:'Hilfe zeigen',exact:true}).click();
  await answer(page,'ni3 hao3');await expect(page.locator('.responseExercise')).toHaveAttribute('data-outcome','success');
  await expect(page.getByRole('group',{name:'Korrekte Zielphrase anhören'})).toHaveCount(0);await expect(page.locator('.responseExercise .audioButton')).toHaveCount(0);
  expect(attempts(await state(page))[0].detail.assisted).toBe(help);
 }
});
test('eight detail references and existing what play only inside opened details',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 const cases:[string,[string,string][]][]=[
  ['recall-wojiao',[['叫','detail-jiao']]],
  ['recall-askname',[['什麼','what'],['名字','detail-mingzi'],['叫','detail-jiao']]],
  ['d-recall-dont-understand',[['聽不懂','detail-tingbudong']]],
  ['d-recall-say-again',[['再','detail-zai'],['說','detail-shuo'],['一遍','detail-yibian']]],
  ['d-recall-speak-slowly',[['說','detail-shuo'],['慢','detail-man'],['一點','detail-yidian']]],
 ];
 for(const [task,units] of cases){
  await plan(page,task);await expect(page.locator('.unitExplanation')).toHaveCount(0);await expect(page.locator('.responseExercise .audioButton')).toHaveCount(0);await answer(page,'wrong');
  const before=await state(page);await expect(page.locator('.responseExercise .audioButton')).toHaveCount(2);
  for(const [index,[form,id]] of units.entries()){
   await page.getByRole('button',{name:`${form} erkunden`,exact:true}).click();const detail=page.getByRole('region',{name:'Worterklärung'});
   await expect(detail.locator('.audioButton')).toHaveCount(1);await expect(detail).toContainText(form);
   await detail.getByRole('button',{name:'Anhören',exact:true}).click();await expect.poll(async()=>optional(await state(page)).length).toBe(index+1);
   const played=await page.evaluate(()=>(window as any).__audioPlays.at(-1));expect(played).toContain(`/audio/mandarin/polly-${id}.mp3`);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await detail.getByRole('button',{name:'Schließen',exact:true}).click();await expect(detail).toHaveCount(0);await expect(page.locator('.responseExercise .audioButton')).toHaveCount(2);
  }
  const after=await state(page);expect(after.relations).toEqual(before.relations);expect(after.sessions).toEqual(before.sessions);expect(attempts(after)).toEqual(attempts(before));
  const now=Date.now();expect(composeContinuous(after.relations,after.events,'hant',now)).toEqual(composeContinuous(before.relations,before.events,'hant',now));
 }
});
for(const task of ['hear-nihao','tone-jiao'])test(`auditory stimulus replay still hides answer: ${task}`,async({page})=>{
 await plan(page,task);const replay=page.getByRole('button',{name:'Anhören',exact:true});
 for(let n=1;n<=2;n++){await replay.click();await expect.poll(async()=>(await state(page)).events.filter((e:any)=>e.type==='audio_replay').length).toBe(n);}
 await expect(page.locator('.phraseForm,.unitExplanation,.feedback,.toneFeedback')).toHaveCount(0);
 const saved=await state(page);expect(attempts(saved)).toHaveLength(0);expect(saved.relations).toHaveLength(0);expect(saved.events.filter((e:any)=>e.type==='pinyin_reveal')).toHaveLength(0);
});
