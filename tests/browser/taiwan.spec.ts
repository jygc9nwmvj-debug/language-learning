import {test,expect,type Page} from '@playwright/test';
import { content } from '../../src/languages/mandarin/content/index.ts';
import editorial from '../../docs/curriculum/china-travel/editorial/editorial.json' with { type: 'json' };
async function seed(page:Page,id:string,script:'hant'|'hans'='hant'){
 await page.goto('/');await expect(page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/,exact:true})).toBeVisible();
 await page.evaluate(async({id,script,words})=>{
  const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});
  await new Promise<void>((r,reject)=>{const t=db.transaction(['sessions','events'],'readwrite');
   t.objectStore('sessions').put({id:'taiwan-browser',plannerVersion:'d1',plan:[id,'closure'],index:0,completed:false,startedAt:Date.now(),updatedAt:Date.now(),script});
   for(const word of words)t.objectStore('events').put({id:'word-'+word,at:Date.now(),sessionId:'introduced',taskId:id,type:'taiwan_word_introduced',contentVersion:'taiwan-text-1',detail:{word,script}});
   t.oncomplete=()=>r();t.onerror=()=>reject(t.error);});db.close();
 },{id,script,words:editorial.words.map(w=>w.id)});
 await page.reload();await page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/,exact:true}).click();await expect(page.locator('[data-task-kind="taiwan-text"]')).toBeVisible();
}
async function history(page:Page){return page.evaluate(async()=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});return new Promise<any[]>(r=>{const q=db.transaction('events').objectStore('events').getAll();q.onsuccess=()=>{db.close();r(q.result);};});});}
for(const script of ['hant','hans'] as const){
 test(`dialogue text, sentence resolution and reload in ${script}`,async({page,browserName})=>{
  await page.setViewportSize({width:375,height:812});
  await page.route('**/audio/**',r=>r.abort());await seed(page,'tw:dialogue:G15',script);
  await expect(page.locator('.twDialogue')).toContainText(script==='hant'?'您的護照':'您的护照');
  await expect(page.locator('audio')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.screenshot({path:`/tmp/taiwan-text-${script}-${browserName}.png`,fullPage:true});
  await page.getByRole('button',{name:'Zum Verständnis',exact:true}).click();
  await page.getByRole('button',{name:'Hallo.',exact:true}).click();await page.getByRole('button',{name:'Prüfen',exact:true}).click();
  await expect(page.locator('.twFeedback')).toContainText('Hallo.');
  await page.reload();await page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/,exact:true}).click();await expect(page.locator('.twFeedback')).toContainText('Hallo.');
  await page.locator('.twFeedback').getByRole('button',{name:'Weiter',exact:true}).click();
  await expect(page.locator('.twSentence').first()).toContainText(script==='hant'?'我有預訂':'我有预订');
  const events=await history(page);expect(events.filter(e=>e.type==='taiwan_attempt')).toHaveLength(1);
  expect(events.find(e=>e.type==='taiwan_attempt').detail.target).toBe('reading');
  expect(events.some(e=>e.type==='taiwan_attempt'&&e.detail.target==='listening')).toBe(false);
 });
}
test('Weiterlernen starts reachable text content with focused prerequisite introduction',async({page})=>{
 await page.goto('/');await expect(page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/,exact:true})).toBeVisible();
 await page.evaluate(async ids=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});await new Promise<void>(r=>{const t=db.transaction('events','readwrite');for(const id of ids)t.objectStore('events').put({id,taskId:id,type:'task_completed',at:Date.now(),sessionId:'foundation',contentVersion:'build-d-1',detail:{}});t.oncomplete=()=>r();});db.close();},content.tasks.filter(t=>t.kind==='encounter').map(t=>t.id));
 await page.reload();await page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/,exact:true}).click();
 await expect(page.locator('[data-taiwan-mode="introduction"]')).toBeVisible();
 await expect(page.locator('.twFocus')).toBeVisible();
 await page.getByRole('button',{name:'Pinyin anzeigen',exact:true}).click();await expect(page.getByRole('button',{name:'Pinyin ausblenden',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Weiter',exact:true}).click();
 expect((await history(page)).some(e=>e.type==='taiwan_word_introduced'&&e.detail.pronunciation===false)).toBe(true);
});
test('structured time and written Mandarin variants have bounded feedback',async({page})=>{
 await seed(page,'tw:exercise:value:t1430');await page.getByLabel('Deine Antwort').fill('14:30');await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.locator('.twFeedback')).toContainText('14:30');
});
test('unlisted Mandarin response remains a comparison, not a false failure',async({page})=>{
 const x=editorial.exercises.find(x=>x.type==='communicative_text_production')!;
 await seed(page,'tw:exercise:'+x.id);await page.getByRole('textbox').fill('Eine nicht gelistete Antwort');await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.locator('.twFeedback')).toContainText('nicht pauschal als falsch');
 expect((await history(page)).find(e=>e.type==='taiwan_attempt').detail.result).toBe('unsure');
});
test('multiple acceptable payment replies and all matching pairs work',async({page})=>{
 await seed(page,'tw:exercise:reply:payment');await page.getByRole('button',{name:'現金。',exact:true}).click();await page.getByRole('button',{name:'行動支付，謝謝。',exact:true}).click();await page.getByRole('button',{name:'Prüfen',exact:true}).click();expect((await history(page)).find(e=>e.type==='taiwan_attempt').detail.result).toBe('success');
 const m=editorial.matching.find(m=>m.relation==='hanzi-meaning')!;
 await seed(page,'tw:matching:'+m.id);
 for(const pair of m.pairs){const w=editorial.words.find(w=>w.id===pair.word)!;await page.getByRole('button',{name:w.hant,exact:true}).click();await page.getByRole('button',{name:pair.de,exact:true}).click();}
 await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeVisible();
});
test('new writing model loads locally and preserves foundation history',async({page})=>{
 const w=editorial.writing[0];await seed(page,'tw:writing:'+w.id);await expect(page.locator('.hanziWriter svg')).toBeVisible();
 expect((await history(page)).filter(e=>e.type==='taiwan_attempt'&&e.detail.target==='listening')).toHaveLength(0);
});
test('route map and persistent Pinyin help match the actual text evidence',async({page})=>{
 await page.setViewportSize({width:375,height:812});await seed(page,'tw:exercise:route:right');
 await expect(page.getByRole('img',{name:/Lageplan/})).toBeVisible();
 await page.getByRole('button',{name:'Pinyin anzeigen',exact:true}).click();
 await page.getByRole('button',{name:'geradeaus → rechts',exact:true}).click();
 await page.getByRole('button',{name:'Prüfen',exact:true}).click();
 const attempt=(await history(page)).find(e=>e.type==='taiwan_attempt');expect(attempt.detail.result).toBe('success');expect(attempt.detail.assisted).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
