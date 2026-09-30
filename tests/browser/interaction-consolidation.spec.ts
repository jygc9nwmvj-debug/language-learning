import {test,expect,type Page} from '@playwright/test';
import {content,itemMap,taskMap} from '../../src/languages/mandarin/content';
import {writeHao,research} from './writing-helpers';
const home = (page:Page)=>page.getByRole('button',{name:/^(Lernen starten|Weiterlernen)$/});
async function seed(page:Page,task:string,transfer:boolean|'listen'=false) {
 await page.goto('/');await home(page).waitFor();
 await page.evaluate(async({task,items,transfer})=>{
  const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result)});
  await new Promise<void>(r=>{const tx=db.transaction(['sessions','events','preferences','relations'],'readwrite');
   for(const store of ['sessions','events','preferences','relations'])tx.objectStore(store).clear();
   tx.objectStore('sessions').put({id:'ui-consolidation',plannerVersion:'d1',plan:[task,'meet-wo','closure'],index:0,completed:false,startedAt:Date.now(),updatedAt:Date.now(),script:'hant'});
   for(const item of items)tx.objectStore('events').put({id:'intro-'+item.id,at:1,sessionId:'prior',taskId:'fixture',type:'introduction_dimensions',detail:{item:item.id,form:item.hant,toneNumbers:item.toneNumbers,script:'hant',dimensions:'meaning,pronunciation,hanzi,writing',introductionVersion:1}});
   if(transfer)tx.objectStore('preferences').put({key:'mini-transfer-active-v1',value:JSON.stringify({caseId:'origin-slower',revision:1,sessionId:'ui-consolidation',index:0,phase:transfer==='listen'?'listen':'answer',answer:'',heard:transfer!=='listen',plays:transfer==='listen'?0:1,firstSeenAt:1})});
   tx.oncomplete=()=>r();});db.close();
 },{task,items:content.items,transfer});await page.reload();await home(page).click();await expect(page.locator('.lessonCard:not([hidden])')).toBeVisible();
}
async function capture(page:Page,name:string,width:number,project:string) {
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`work/consolidation/${project}-${width}-${name}.png`,fullPage:true,animations:'disabled'});
}
for(const width of [320,390,1280]) {
 test(`transfer hierarchy, adjacent comparison, disclosure and reload ${width}`,async({page},info)=>{
  await page.setViewportSize({width,height:900});await seed(page,'closure',true);
  const question=await page.locator('.transferQuestion h3').innerText();
  await expect(page.locator('.miniTransfer .audioButton')).toBeVisible();
  await capture(page,'transfer-answer',width,info.project.name);
  await page.locator('textarea').fill('B versteht die Frage nach der Herkunft nicht und bittet A, langsamer zu sprechen.');
  await page.getByRole('button',{name:'Antwort abgeben',exact:true}).click();
  await expect(page.locator('.transferQuestion h3')).toHaveText(question);
  expect(await page.locator('.answerSummary').evaluate(el=>el.nextElementSibling?.classList.contains('transferSolution'))).toBe(true);
  await expect(page.locator('.transferResult .continueButton')).toBeVisible();
  await expect(page.getByText(/Wortmuster|Antwortmerkmale|Das bestätigt nicht/)).toHaveCount(0);

  await capture(page,'transfer-result',width,info.project.name);
  await page.reload();await home(page).click();await expect(page.locator('.transferQuestion h3')).toHaveText(question);
  expect((await research(page)).filter(e=>e.type==='transfer_assessed')).toHaveLength(1);
  const disclosure=page.getByText('Transkript ansehen',{exact:true});await disclosure.focus();await page.keyboard.press('Enter');
  await expect(page.locator('.miniTransfer .reference')).toHaveCount(2);await capture(page,'transfer-transcript',width,info.project.name);
  await page.keyboard.press('Enter');await expect(page.locator('.miniTransfer .reference')).toHaveCount(0);
  await page.emulateMedia({reducedMotion:'reduce'});
  expect(await page.locator('.transferResult').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');
  await page.locator('.continueButton').focus();expect(await page.locator('.continueButton').evaluate(e=>getComputedStyle(e).outlineStyle)).toBe('solid');
 });
 test(`existing learning surfaces and supported responses ${width}`,async({page},info)=>{
  test.setTimeout(90000);await page.setViewportSize({width,height:900});
  for(const [task,response] of [['read-hao','falsch'],['hear-nihao','hallo'],['recall-nihao','ni3 hao3']]){
   await seed(page,task);if(task.startsWith('hear'))await page.locator('.responseExercise > .audioControl button').click();
   if(task.startsWith('recall'))await page.getByRole('button',{name:'Hilfe zeigen',exact:true}).click();
   await capture(page,task+'-open',width,info.project.name);
   await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill(response);await page.getByRole('button',{name:'Prüfen',exact:true}).click();
   await expect(page.locator('.responseExercise,.resolvedExercise')).toHaveAttribute('data-task-complete','true');
   if(task.startsWith('recall')){
    await expect(page.locator('.assistanceNote')).toHaveText('Mit Hilfe beantwortet.');
    expect((await research(page)).find(e=>e.type==='attempt')?.detail.assisted).toBe(true);
   }
   await capture(page,task+'-result',width,info.project.name);
  }
  for(const task of ['d-meet-im-german','d-meet-san']){
   await seed(page,task);await expect(page.getByText('Ein kurzer Ausdruck für dein nächstes Gespräch.',{exact:true})).toHaveCount(0);const hero=page.locator('.practiceReference .hanziHero');const before=await hero.boundingBox();const disclosure=page.getByText('Eine kleine Entdeckung',{exact:true});await disclosure.click();expect(await hero.boundingBox()).toEqual(before);expect(before!.height).toBeLessThanOrEqual(await hero.evaluate(e=>parseFloat(getComputedStyle(e).fontSize)*1.6+24));await capture(page,task+'-discovery',width,info.project.name);await disclosure.click();
  }
  for(const correct of [false,true]){
   await seed(page,'d-sequence-123');const ids=taskMap.get('d-sequence-123')!.sequence!;
   for(const id of correct?ids:[...ids].reverse())await page.getByRole('button',{name:itemMap.get(id)!.hant,exact:true}).click();
   await capture(page,'sequence-selected-'+correct,width,info.project.name);
   await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.locator('.sequenceReference')).toBeVisible();
   await capture(page,'sequence-result-'+correct,width,info.project.name);
   const text=await page.locator('.numberSequence').innerText();await page.reload();await home(page).click();expect(await page.locator('.numberSequence').innerText()).toBe(text);
  }

 });
}
test('writing fading, completion controls and optional repeat',async({page},info)=>{
 test.setTimeout(90000);await page.setViewportSize({width:390,height:900});await seed(page,'write-guided');
 await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase','writing',{timeout:25000});
 for(const level of ['full_guided','full_reduced','faint_outline','brief_recall']){
  await expect(page.locator('.writingExercise')).toHaveAttribute('data-scaffold',level);
  if(level==='brief_recall'){await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase','preview');await expect(page.locator('.writingIntro p')).toHaveCount(0);await expect(page.locator('.writingStatus')).toHaveText('Merke dir die Form. Gleich verschwindet die Vorlage.');await capture(page,'writing-preview',390,info.project.name);}
  await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase','writing');
  await capture(page,level,390,info.project.name);await writeHao(page);
 }
 await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase','saved');
 for(const width of [320,390,1280]){await page.setViewportSize({width,height:900});await capture(page,'writing-saved',width,info.project.name);}
 await expect(page.locator('.writingControls')).toBeHidden();
 await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeEnabled();
 await page.getByRole('button',{name:'Noch einmal',exact:true}).click();await expect(page.locator('.writingControls')).toBeVisible();
 expect((await research(page)).filter(e=>e.type==='attempt'&&e.taskId==='write-guided')).toHaveLength(1);
});
test('tone activation preserves language geometry',async({page},info)=>{
 await page.setViewportSize({width:320,height:900});await seed(page,'tones');
 const before=await page.locator('.toneLanguage').first().boundingBox();
 await page.getByRole('button',{name:'Ton 1',exact:true}).click();await expect(page.locator('.toneRow').first()).toHaveAttribute('data-active','true');
 const after=await page.locator('.toneLanguage').first().boundingBox();expect(after).toEqual(before);
 await capture(page,'tone-active',320,info.project.name);
});

test('transfer listening uses shared control and reveals the existing answer step',async({page},info)=>{
 await seed(page,'closure','listen');
 for(const width of [320,390,1280]){await page.setViewportSize({width,height:900});await capture(page,'transfer-listen',width,info.project.name);}
 await expect(page.locator('textarea')).toHaveCount(0);
 await page.getByRole('button',{name:'Gespräch anhören',exact:true}).click();
 await expect(page.getByRole('button',{name:'Anhalten',exact:true})).toBeVisible();
 await expect(page.locator('.transferPlaybackStatus')).toContainText('Person');
 await expect(page.locator('textarea')).toBeVisible({timeout:20000});
 await expect(page.getByRole('button',{name:'Gespräch noch einmal hören',exact:true})).toBeVisible();
});
