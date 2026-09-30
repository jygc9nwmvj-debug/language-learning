import {test,expect,type Page} from '@playwright/test';
import {itemMap} from '../../src/languages/mandarin/content';
async function plan(page:Page,task:string,itemId?:string){
 await page.goto('/');await page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/}).waitFor();
 const item=itemId?itemMap.get(itemId):undefined;
 await page.evaluate(async({task,item})=>{
  const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});
  await new Promise<void>(r=>{const t=db.transaction(['sessions','events'],'readwrite'),now=Date.now();
   t.objectStore('sessions').put({id:'focus',plannerVersion:'d1',plan:[task,'meet-wo','closure'],index:0,completed:false,startedAt:now,updatedAt:now+100,script:'hant'});
   if(item)t.objectStore('events').put({id:'introduced',at:1,sessionId:'prior',taskId:'fixture',type:'introduction_dimensions',detail:{item:item.id,form:item.hant,toneNumbers:item.toneNumbers,script:'hant',dimensions:'meaning,pronunciation,hanzi,writing',introductionVersion:1}});
   t.oncomplete=()=>r();});db.close();
 },{task,item});await page.reload();await page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/}).click();
}
for(const width of [320,390,1280]) test(`phrase and correction stay anchored at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});
 await page.emulateMedia({reducedMotion:'reduce'});
 await plan(page,'recall-askname','askname');
 const field=page.getByRole('textbox',{name:'Deine Antwort',exact:true});
 await field.fill('wrong');await page.getByRole('button',{name:'Prüfen',exact:true}).click();
 const phrase=page.locator('.correctionReference .phraseUnits');
 const audio=page.getByRole('group',{name:'Korrekte Zielphrase anhören'});
 await expect(audio).toBeVisible();await expect(page.getByRole('button',{name:'Überspringen',exact:true})).toBeHidden();
 const geometry=()=>phrase.locator('.unitHanzi,.unitPinyin').evaluateAll(nodes=>nodes.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y+scrollY,w:r.width,h:r.height,size:getComputedStyle(e).fontSize};}));
 const before=await geometry();
 const audioTop=await audio.evaluate(e=>e.getBoundingClientRect().top+scrollY);
 for(const name of ['名字','叫']){
  await page.getByRole('button',{name:`${name} erkunden`,exact:true}).click();
  const detail=page.getByRole('region',{name:'Worterklärung'});await expect(detail).toBeVisible();
  expect(await geometry()).toEqual(before);
  expect(await audio.evaluate(e=>e.getBoundingClientRect().top+scrollY)).toBe(audioTop);
  expect(await detail.evaluate(e=>e.getBoundingClientRect().top+scrollY)).toBeGreaterThan(audioTop);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`work/stable-layout-${width}-${name}.png`,fullPage:true});
  await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:`${name} erkunden`,exact:true})).toBeFocused();await expect(detail).toHaveCount(0);expect(await geometry()).toEqual(before);
 }
 await expect(page.locator('.answerSummary')).toContainText('wrong');
 await expect(page.locator('.productionFeedback')).toBeVisible();
 await expect(page.getByRole('button',{name:'Weiter',exact:true})).toHaveClass(/continueButton/);
});
