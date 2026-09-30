import {test,expect,type Page} from '@playwright/test';
import {content,itemMap} from '../../src/languages/mandarin/content';
const home=(p:Page)=>p.getByRole('button',{name:/^(Lernen starten|Weiterlernen)$/});
async function seed(page:Page,task:string,evaluation?:any){
 await page.goto('/');await home(page).waitFor();
 await page.evaluate(async({task,evaluation,items})=>{
 const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result)});
 await new Promise<void>(r=>{const tx=db.transaction(['sessions','events','preferences'],'readwrite');for(const k of ['sessions','events','preferences'])tx.objectStore(k).clear();
 tx.objectStore('sessions').put({id:'resolution',plannerVersion:'d1',plan:[task,'meet-wo','closure'],index:0,completed:false,startedAt:Date.now(),updatedAt:Date.now(),script:'hant',...(evaluation?{evaluation:{index:0,taskId:task,...evaluation}}:{})});
 for(const i of items)tx.objectStore('events').put({id:i.id,sessionId:'prior',taskId:'fixture',at:1,type:'introduction_dimensions',detail:{item:i.id,form:i.hant,toneNumbers:i.toneNumbers,script:'hant',dimensions:'meaning,pronunciation,hanzi,writing',introductionVersion:1}});
 tx.oncomplete=()=>r();});db.close();},{task,evaluation,items:content.items});
 await page.reload();await home(page).click();
}
for(const width of [320,390,1280])test(`listening seeds: equal required resolution, outcomes/help/reload ${width}`,async({page},info)=>{
 await page.setViewportSize({width,height:900});
 for(const id of ['xiexie','dont-understand'])for(const outcome of ['success','error','help']){
 const task=content.tasks.find(t=>t.kind==='listen'&&t.itemId===id)!;const item=itemMap.get(id)!;
 await seed(page,task.id);await page.locator('.audioButton').first().click();
 if(outcome==='help')await page.getByRole('button',{name:'Hilfe zeigen',exact:true}).click();
 await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill(outcome==='error'?'unpassend':item.answers[0]);await page.getByRole('button',{name:'Prüfen',exact:true}).click();
 const resolved=page.locator('.resolvedExercise');await expect(resolved).toHaveAttribute('data-task-complete','true');
 await expect(resolved.locator('.reference')).toContainText(item.hant.replaceAll(' ',''));
 await expect(resolved.locator('.reference')).toContainText(item.meaning.de);
 await expect(resolved.locator('.referenceAudio .audioButton').first()).toBeVisible();await expect(resolved.locator('.continueButton')).toBeVisible();
 await expect(resolved.locator('.assistanceNote')).toHaveCount(outcome==='help'?1:0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`work/resolution/${info.project.name}-${width}-${id}-${outcome}.png`,fullPage:true});
 const before=await resolved.innerText();await page.reload();await home(page).click();await expect(page.locator('.resolvedExercise')).toHaveText(before,{useInnerText:true});
 }
});
test('tone and notation resolutions reconstruct existing feedback/continuation only',async({page},info)=>{
 for(const width of [320,390,1280])for(const ok of [true,false])for(const notation of [false,true]){
 await page.setViewportSize({width,height:900});const part=notation?'notation':'tone:0';
 await seed(page,'tones',{step:part,results:{[part]:{value:notation?(ok?'ma3':'ma2'):(ok?'2':'1'),kind:ok?'success':'attention',message:notation?'Vergleiche die Tonzahl.':'Ton 2'}}});
 const area=page.locator(notation?'.notationPractice':'.toneQuiz');await expect(area.locator('[role=status]')).toHaveCount(1);
 await expect(area.getByRole('button',{name:notation&&!ok?'Noch einmal versuchen':'Weiter',exact:true})).toBeVisible();
 await page.screenshot({path:`work/resolution/${info.project.name}-${width}-${notation?'notation':'tone'}-${ok}.png`,fullPage:true});
 const before=await area.innerText();await page.reload();await home(page).click();await expect(page.locator(notation?'.notationPractice':'.toneQuiz')).toHaveText(before,{useInnerText:true});
 }
});
for(const width of [320,390,1280])test(`slot reference role: own name remains open, help/result/reload ${width}`,async({page},info)=>{
 await page.setViewportSize({width,height:900});
 const requests:string[]=[];page.on('request',r=>{if(r.url().includes('/audio/'))requests.push(r.url());});
 for(const outcome of ['success','error','help']){
 await seed(page,'recall-wojiao');requests.length=0;
 await expect(page.locator('.fixedSlotReference')).toHaveCount(0);
 if(outcome==='help')await page.getByRole('button',{name:'Hilfe zeigen',exact:true}).click();
 await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill(outcome==='error'?'banana':'wo3 jiao4 Eva');
 await page.getByRole('button',{name:'Prüfen',exact:true}).click();
 const fixed=page.locator('.fixedSlotReference');await expect(fixed).toContainText('Ergänze deinen eigenen Namen');
 await expect(fixed.locator('.audioButton')).toHaveCount(2);
 for(const b of await fixed.locator('.audioButton').all()){await b.click();await expect(b.locator('..')).toHaveAttribute('data-playing','true');await expect(b.locator('..')).toHaveAttribute('data-playing','false');}
 expect(requests.some(s=>/polly-wojiao(?:-slow)?\.mp3/.test(s))).toBe(false);
 await expect(page.locator('.resolvedExercise')).not.toContainText('Wolfram');
 const before=await page.locator('.resolvedExercise').innerText();await page.reload();await home(page).click();
 await expect(page.locator('.resolvedExercise')).toHaveText(before,{useInnerText:true});
 await expect(page.locator('.fixedSlotReference .audioButton')).toHaveCount(2);
 await page.screenshot({path:`work/resolution/${info.project.name}-${width}-slot-${outcome}.png`,fullPage:true});
 }
 await seed(page,'meet-wojiao');await expect(page.getByText('Hörbeispiel mit einem Beispielnamen.',{exact:false})).toBeVisible();
});
test('additional slot paths: help audio, first introduction and restored tone example',async({page})=>{
 await seed(page,'recall-wojiao');
 const sources:string[]=[];page.on('request',r=>{if(r.url().includes('/audio/'))sources.push(r.url());});
 await page.getByRole('button',{name:'Hilfe zeigen',exact:true}).click();
 for(const b of await page.locator('.fixedSlotReference .audioButton').all()){await b.click();await expect(b.locator('..')).toHaveAttribute('data-playing','true');await expect(b.locator('..')).toHaveAttribute('data-playing','false');}
 expect(sources.some(s=>/polly-wojiao(?:-slow)?\.mp3/.test(s))).toBe(false);
 await expect(page.locator('.fixedSlotReference .audioButton')).toHaveCount(2);
 // Unknown tone attention has its own introductory route; complete audio is explicitly an example.
 await seed(page,'tone-jiao');await expect(page.getByText('Hörbeispiel mit einem Beispielnamen.',{exact:false})).toBeVisible();
 await seed(page,'tone-jiao',{results:{main:{value:'4',kind:'success',message:''}}});
 // Existing tone-attention guard is intentionally unchanged; either route keeps the example label.
 await expect(page.getByText('Hörbeispiel mit einem Beispielnamen.',{exact:false})).toBeVisible();
 await page.goto('/');await home(page).waitFor();
 await page.evaluate(async()=>{
 const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result)});
 await new Promise<void>(r=>{const tx=db.transaction(['sessions','events'],'readwrite');tx.objectStore('events').clear();
 tx.objectStore('sessions').put({id:'resolution',plannerVersion:'d1',plan:['meet-wojiao','closure'],index:0,completed:false,startedAt:Date.now(),updatedAt:Date.now(),script:'hant'});tx.oncomplete=()=>r();});db.close();
 });await page.reload();await home(page).click();
 await expect(page.locator('.attentionIntroduction')).toBeVisible();
 await expect(page.getByText('Hörbeispiel mit einem Beispielnamen.',{exact:false})).toBeVisible();
});
