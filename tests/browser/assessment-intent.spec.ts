import {test,expect,type Page} from '@playwright/test';
import {itemMap} from '../../src/languages/mandarin/content';
async function plan(page:Page,id:string,introducedItem?:string) {
 await page.goto('/');await page.getByRole('button',{name:'Weiterlernen',exact:true}).waitFor();
 const item=introducedItem?itemMap.get(introducedItem):undefined;
 await page.evaluate(async({id,item})=>{
  const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});
  await new Promise<void>(r=>{const t=db.transaction(['sessions','events'],'readwrite'),now=Date.now();
   t.objectStore('sessions').put({id:crypto.randomUUID(),plannerVersion:'d1',plan:[id,'closure'],index:0,completed:false,startedAt:now,updatedAt:now,script:'hant'});
   if(item)for(const [type,detail] of [
    ['introduction_dimensions',{item:item.id,script:'hant',form:item.hant,toneNumbers:item.toneNumbers,dimensions:'meaning,pronunciation,hanzi,writing',introductionVersion:1}],
    ['tone_attention_confirmed',{item:item.id,toneNumbers:item.toneNumbers,attentionVersion:1}],
    ['tone_notation_introduced',{}],
   ] as const)t.objectStore('events').put({id:crypto.randomUUID(),at:now,sessionId:'prior',taskId:type==='tone_notation_introduced'?'tones':id,type,detail,contentVersion:'build-d-1'});
   t.oncomplete=()=>r();});db.close();
 },{id,item});
 await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
}
async function stored(page:Page,table='events') {
 return page.evaluate(async table=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});return new Promise<any[]>(r=>{const q=db.transaction(table).objectStore(table).getAll();q.onsuccess=()=>{db.close();r(q.result);};});},table);
}
test('notation conversion teaches the visible mark, explains errors and records practice only',async({page})=>{
 await plan(page,'tones');
 const card=page.locator('.lessonCard');await expect(card).toHaveAttribute('data-learning-state','practice');
 await expect(card.locator('.eyebrow')).toHaveText('Töne kennenlernen und üben');
 for(const n of [1,2,3,4]){await page.getByRole('button',{name:`Ton ${n}`,exact:true}).click();await expect.poll(async()=>(await stored(page)).some(e=>e.type===`tone_example_${n}_introduced`)).toBe(true);}
 await expect(page.locator('.toneComparison')).toContainText('má'); // valid teaching source
 await page.getByRole('button',{name:'Bedeutungen aufdecken',exact:true}).click();
 for(const n of [2,4,3]){
  await page.locator('.toneQuiz').getByRole('button',{name:'Anhören',exact:true}).click();
  await page.getByRole('button',{name:`Ton ${n} wählen`,exact:true}).click();
  await page.getByRole('button',{name:'Weiter',exact:true}).click();
 }
 await expect(page.getByRole('heading',{name:'Vom Tonzeichen zur Tonzahl'})).toBeVisible();
 await expect(page.locator('.notationExample')).toContainText('mǎ');
 await expect(page.locator('.notationEquation')).toContainText('má');
 await expect(page.locator('.notationEquation input')).toHaveAttribute('placeholder','ma_');
 const before=await stored(page,'relations');const attempts=(await stored(page)).filter(e=>e.type==='attempt').length;
 const field=page.getByRole('textbox',{name:'Schreib denselben Ton jetzt als Zahl.',exact:true});
 await field.fill('ma4');await page.getByRole('button',{name:'Prüfen',exact:true}).click();
 await expect(page.locator('form.quizBox [role=status]')).toHaveText('Das Tonzeichen in „má“ steht für Ton 2. Schreibe ma2.');
 await expect(page.locator('.notationResponse')).toContainText('ma4');
 expect((await stored(page)).some(e=>e.type==='tone_notation_introduced')).toBe(false);
 await page.getByRole('button',{name:'Noch einmal versuchen',exact:true}).click();
 await field.fill('ma2');await page.getByRole('button',{name:'Prüfen',exact:true}).click();
 await expect(page.locator('form.quizBox [role=status]')).toHaveText('Genau: Das Tonzeichen in „má“ wird als ma2 geschrieben.');
 await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeEnabled();
 await expect.poll(async()=>(await stored(page)).filter(e=>e.type==='tone_notation_introduced').length).toBe(1);
 const events=await stored(page),practice=events.filter(e=>e.type==='tone_notation_practice').sort((a,b)=>a.at-b.at);
 expect(practice.map(e=>e.detail.result)).toEqual(['failure','success']);
 for(const e of practice)expect(e.detail).toMatchObject({assessmentIntent:'tone_notation_conversion',sourceWord:'ma2',phase:'guided_practice',evidence:'app_checked'});
 expect(events.filter(e=>e.type==='attempt')).toHaveLength(attempts);
 expect(await stored(page,'relations')).toEqual(before);
 expect(events.find(e=>e.type==='task_presented').detail.role).toBe('practice');
});
test('perception and lexical retrieval withhold answers; recognition keeps its necessary source',async({page})=>{
 for(const [id,itemId] of [['tone-wo','wo'],['tone-jiao','wojiao'],['tone-xie','xiexie']] as const){
  await plan(page,id,itemId);const card=page.locator('.lessonCard'),item=itemMap.get(itemId)!;
  await expect(card.locator('.eyebrow')).toHaveText('Hören und unterscheiden');
  await expect(card.locator('h2')).toContainText('hör');
  await expect(card).not.toContainText(item.pinyin);await expect(card).not.toContainText(item.toneNumbers);
  await expect(card.locator('[lang=zh]')).toHaveCount(0);
  await expect(card.getByRole('button',{name:'Ton 1 wählen',exact:true})).toBeDisabled();
  await card.getByRole('button',{name:'Anhören',exact:true}).click();
  await expect(card.getByRole('button',{name:'Ton 1 wählen',exact:true})).toBeEnabled();
  await expect(card).not.toContainText(item.pinyin);
 }
 await plan(page,'recall-nihao','nihao');const card=page.locator('.lessonCard');
 await expect(card.getByRole('textbox')).toBeVisible();await expect(card).not.toContainText('nǐ hǎo');await expect(card).not.toContainText('ni3 hao3');await expect(card).not.toContainText('你好');
 await plan(page,'read-hao','hao');await expect(card.getByRole('textbox')).toBeVisible();await expect(card.locator('.hanziHero')).toHaveText('好');await expect(card).not.toContainText('gut');await expect(card).not.toContainText('hǎo');
 await plan(page,'hear-xiexie','xiexie');await expect(card.getByRole('textbox')).toBeVisible();await expect(card).not.toContainText('danke');await expect(card.locator('.reference,.unitExplanation')).toHaveCount(0);
});
test('missing tone introduction teaches first, without presenting a scored tone question',async({page})=>{
 await plan(page,'tone-wo');
 await expect(page.locator('.lessonCard')).toHaveAttribute('data-learning-state','introduction');
 await expect(page.getByRole('button',{name:'Ton 3 wählen',exact:true})).toHaveCount(0);
 expect((await stored(page)).filter(e=>e.type==='attempt')).toHaveLength(0);
});
test('paper recall hides the worksheet answer, and opening its model is assisted evidence',async({page})=>{
 await page.addInitScript(()=>{window.print=()=>{};});
 await plan(page,'write-recall','hao');
 const writing=page.locator('.writingExercise');await expect(writing).toHaveAttribute('data-scaffold','delayed_recall');
 await page.getByRole('button',{name:'Auf Papier schreiben',exact:true}).click();
 await expect(writing).not.toContainText('好');
 await expect(page.getByRole('button',{name:'Ich habe geschrieben – vergleichen',exact:true})).toBeVisible();
 await writing.getByRole('button',{name:'Schreibblatt drucken',exact:true}).click();
 await expect.poll(async()=>(await stored(page)).filter(e=>e.type==='writing_hint'&&e.detail.source==='worksheet').length).toBe(1);
 await page.getByRole('button',{name:'Ich habe geschrieben – vergleichen',exact:true}).click();
 await page.getByRole('button',{name:'Sicher',exact:true}).click();
 await expect.poll(async()=>(await stored(page)).filter(e=>e.type==='attempt').length).toBe(1);
 expect((await stored(page)).find(e=>e.type==='attempt').detail).toMatchObject({assisted:true,evidence:'self_report',writingRecall:true});
});
