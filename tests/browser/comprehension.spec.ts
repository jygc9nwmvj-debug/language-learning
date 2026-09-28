import {test,expect,type Page} from '@playwright/test';
import {writeHao} from './writing-helpers';
async function plan(page:Page,tasks:string[],index=0,script='hant',events:unknown[]=[]){
 await page.goto('/');await page.getByRole('button',{name:'Weiterlernen',exact:true}).waitFor();
 await page.evaluate(async({tasks,index,script,events})=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});await new Promise<void>(r=>{const t=db.transaction(['sessions','events'],'readwrite');t.objectStore('sessions').put({id:'comprehension',plannerVersion:'d1',plan:[...tasks,'closure'],index,completed:false,startedAt:Date.now(),updatedAt:Date.now()+100,script});for(const e of events)t.objectStore('events').put(e);t.oncomplete=()=>r();});db.close();},{tasks,index,script,events});await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
}
async function state(page:Page){return page.evaluate(async()=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});const result:any={};for(const name of ['events','relations','sessions'])result[name]=await new Promise(r=>{const q=db.transaction(name).objectStore(name).getAll();q.onsuccess=()=>r(q.result);});db.close();return result;});}
test('mobile authored units, contextual character roles, scripts and known Pinyin',async({page},info)=>{
 await page.setViewportSize({width:320,height:844});
 await plan(page,['d-meet-speak-slowly']);
 const unit=page.getByRole('button',{name:'一點 erkunden',exact:true});await expect(unit).toBeVisible();
 await expect(page.locator('.unitPinyin')).toHaveText(['qǐng','shuō','màn','yì','diǎn']);
 await unit.click();const gloss=page.getByRole('region',{name:'Worterklärung'});await expect(gloss).toContainText('ein bisschen');await expect(gloss.locator('audio')).toHaveCount(0);
 await gloss.getByText('Zeichen ansehen',{exact:true}).click();await gloss.getByRole('button',{name:'點 ansehen'}).click();await expect(gloss.locator('.characterNote')).toContainText('Mengen');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`work/c23-${info.project.name}-320.png`,fullPage:true});
 await unit.click();await expect(gloss).toHaveCount(0);await page.getByRole('button',{name:'請 erkunden'}).click();await expect(gloss.locator('.audioButton')).toHaveCount(1);
 await page.keyboard.press('Escape');await expect(gloss).toHaveCount(0);
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'請 erkunden'}).click();await page.screenshot({path:`work/c23-${info.project.name}-390.png`,fullPage:true});
 await page.locator('.lessonHeader').click();await expect(gloss).toHaveCount(0);
 const saved=await state(page);expect(saved.relations).toHaveLength(0);expect(saved.events.filter((e:any)=>e.type==='attempt')).toHaveLength(0);
 await plan(page,['d-meet-speak-slowly'],0,'hans',[{id:'familiar',at:1,sessionId:'prior',taskId:'d-meet-speak-slowly',type:'task_completed',detail:{item:'speak-slowly'}}]);
 await expect(page.getByRole('button',{name:'请 erkunden'})).toBeVisible();await expect(page.locator('.explainedToken')).toContainText('请 qǐng');await expect(page.locator('.unitPinyin')).toHaveCount(0);await page.getByRole('button',{name:'Pinyin zeigen',exact:true}).click();await expect(page.locator('.unitPinyin')).toHaveCount(5);
 await plan(page,['meet-askname']);await expect(page.locator('.unitPinyin')).toHaveText(['nǐ','jiào','shén','me','míng','zi']);await expect(page.locator('.phrasePunctuation')).toHaveText('？');
 await plan(page,['meet-nihao']);await page.getByRole('button',{name:'Schriftbild ansehen',exact:true}).click();await page.getByRole('button',{name:'Bedeutung dazunehmen',exact:true}).click();await page.getByRole('button',{name:'你好 erkunden',exact:true}).click();await expect(page.getByRole('region',{name:'Worterklärung'})).toContainText('ganze Begrüßung');
});
test('unresolved recall has no tappable answer; explicit help is an assisted attempt',async({page})=>{
 await plan(page,['d-recall-speak-slowly']);await expect(page.locator('.phraseUnit')).toHaveCount(0);
 await page.getByRole('button',{name:'Hilfe zeigen',exact:true}).click();await page.getByRole('button',{name:'一點 erkunden'}).click();await expect(page.getByRole('region',{name:'Worterklärung'})).toBeVisible();
 await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill('qing3 shuo1 man4 yi4 dian3');await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.locator('.feedback')).toBeVisible();
 const saved=await state(page);expect(saved.events.find((e:any)=>e.type==='attempt').detail.assisted).toBe(true);
});
test('previous practice preserves current input and cursor, with no scheduled result',async({page})=>{
 await plan(page,['recall-nihao','d-recall-speak-slowly'],1);await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill('qing3 shuo1 man4 yi4 dian3');
 const before=await state(page);await page.getByRole('button',{name:'Vorheriges',exact:true}).click();
 const inspect=page.locator('.inspectionSurface');await inspect.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill('ni3 hao3');await inspect.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(inspect.locator('.feedback')).toBeVisible();
 const during=await state(page);expect(during.relations).toEqual(before.relations);expect(during.sessions).toEqual(before.sessions);expect(during.events.filter((e:any)=>e.type==='attempt')).toHaveLength(0);expect(during.events.filter((e:any)=>e.type==='inspection_practice_attempt')).toHaveLength(1);
 await inspect.getByRole('button',{name:'Weiter',exact:true}).click();await expect(inspect).toHaveCount(0);await expect(page.getByRole('textbox',{name:'Deine Antwort',exact:true})).toHaveValue('qing3 shuo1 man4 yi4 dian3');
 await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.locator('.feedback')).toBeVisible();expect((await state(page)).events.find((e:any)=>e.type==='attempt').detail.assisted).toBe(true);
});
test('successful writing can repeat and leave without adding mastery or failures',async({page})=>{
 await page.setViewportSize({width:390,height:844});await plan(page,['write-recall','recall-nihao']);
 await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase','writing');await writeHao(page);await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase','saved');
 const before=await state(page);expect(before.events.filter((e:any)=>e.type==='attempt')).toHaveLength(1);
 await page.getByRole('button',{name:'Noch einmal',exact:true}).click();await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase','writing');await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeEnabled();await writeHao(page);await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase','saved');
 const after=await state(page);expect(after.relations).toEqual(before.relations);expect(after.sessions).toEqual(before.sessions);expect(after.events.filter((e:any)=>e.type==='attempt')).toHaveLength(1);expect(after.events.filter((e:any)=>e.type==='optional_writing_result')).toHaveLength(1);
 await page.getByRole('button',{name:'Noch einmal',exact:true}).click();await page.getByRole('button',{name:'Weiter',exact:true}).click();await expect(page.getByRole('textbox',{name:'Deine Antwort',exact:true})).toBeVisible();expect((await state(page)).sessions[0].index).toBe(1);
});
