import {test,expect,type Page} from '@playwright/test';
import {itemMap} from '../../src/languages/mandarin/content';
import {finishAttention} from './helpers/attention';
async function plan(page:Page,task:string,itemId?:string){
 await page.goto('/');await page.getByRole('button',{name:'Weiterlernen',exact:true}).waitFor();
 const item=itemId?itemMap.get(itemId):undefined;
 await page.evaluate(async({task,item})=>{
  const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});
  await new Promise<void>(r=>{const t=db.transaction(['sessions','events'],'readwrite'),now=Date.now();
   t.objectStore('sessions').put({id:'focus',plannerVersion:'d1',plan:[task,'meet-wo','closure'],index:0,completed:false,startedAt:now,updatedAt:now+100,script:'hant'});
   if(item)t.objectStore('events').put({id:'introduced',at:1,sessionId:'prior',taskId:'fixture',type:'introduction_dimensions',detail:{item:item.id,form:item.hant,toneNumbers:item.toneNumbers,script:'hant',dimensions:'meaning,pronunciation,hanzi,writing',introductionVersion:1}});
   t.oncomplete=()=>r();});db.close();
 },{task,item});await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
}
test('resolved recall changes focus and removes only its completed skip action',async({page},info)=>{
 await page.setViewportSize({width:1280,height:900});await plan(page,'recall-nihao','nihao');
 const skip=page.getByRole('button',{name:'Überspringen',exact:true});await expect(skip).toBeVisible();
 const field=page.getByRole('textbox',{name:'Deine Antwort',exact:true});expect((await field.boundingBox())!.width).toBeLessThanOrEqual(544);
 await field.fill('ni3 hao3');await page.getByRole('button',{name:'Prüfen',exact:true}).click();
 await expect(page.locator('.responseExercise')).toHaveAttribute('data-task-complete','true');await expect(skip).toBeHidden();
 await expect(page.locator('.answerSummary')).toContainText('ni3 hao3');await expect(page.locator('.feedback')).toHaveText('Richtig.');
 const hanziSize=await page.locator('.unitHanzi').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize));
 const feedbackSize=await page.locator('.feedback').evaluate(e=>parseFloat(getComputedStyle(e).fontSize));expect(hanziSize).toBeGreaterThan(feedbackSize*2);
 await expect(page.getByRole('button',{name:'Weiter',exact:true})).toHaveClass(/continueButton/);
 await page.screenshot({path:`work/focus-${info.project.name}-recall.png`,fullPage:true,animations:'disabled'});
 await page.getByRole('button',{name:'Weiter',exact:true}).click();await expect(skip).toBeVisible();
});
test('tone examples recede for quiz, audio stays beside question, notation resolves visually',async({page},info)=>{
 await page.setViewportSize({width:1280,height:900});await plan(page,'tones');
 for(const n of [1,2,3,4])await page.getByRole('button',{name:`Ton ${n}`,exact:true}).click();
 await page.getByRole('button',{name:'Bedeutungen aufdecken',exact:true}).click();await expect(page.locator('.toneComparison')).toBeVisible();
 for(const n of [2,4,3]){
  const play=page.locator('.toneQuiz').getByRole('button',{name:'Anhören',exact:true});
  const q=(await page.locator('.questionAudio h3').boundingBox())!,a=(await play.boundingBox())!;expect(a.x-q.x-q.width).toBeLessThanOrEqual(24);
  await play.click();await expect(page.locator('.toneComparison')).toBeHidden();
  await page.getByRole('button',{name:`Ton ${n} wählen`,exact:true}).click();await expect(page.getByRole('button',{name:'Überspringen',exact:true})).toBeVisible();await expect(page.locator('.toneFeedback')).toBeVisible();
  if(n===2)await page.screenshot({path:`work/focus-${info.project.name}-quiz.png`,fullPage:true,animations:'disabled'});
  await page.getByRole('button',{name:'Weiter',exact:true}).click();
 }
 await expect(page.locator('.notationExample')).toHaveText('mǎ→ma3');
 await page.getByRole('textbox',{name:'Schreib denselben Ton jetzt als Zahl.',exact:true}).fill('ma2');await page.getByRole('button',{name:'Prüfen',exact:true}).click();
 await expect(page.locator('.notationEquation')).toContainText('ma2');await expect(page.locator('.notationCorrect')).toBeVisible();
 await expect(page.getByRole('button',{name:'Überspringen',exact:true})).toBeHidden();await expect(page.locator('.notationExample')).toHaveCount(0);
 await page.screenshot({path:`work/focus-${info.project.name}-notation.png`,fullPage:true,animations:'disabled'});
 await page.setViewportSize({width:320,height:740});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`work/focus-${info.project.name}-notation-320.png`,fullPage:true,animations:'disabled'});
});
test('speaking UI groups reference controls and folds guidance only after recording starts',async({page},info)=>{
 // UI smoke fixture only: no encoder, waveform, signal or reliability assessment.
 await page.addInitScript(()=>{
  Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:async()=>new AudioContext().createMediaStreamDestination().stream}});
  class UIRecorder { static isTypeSupported(){return true;}state='inactive';mimeType='audio/webm';onstart?:()=>void;onstop?:()=>void;start(){this.state='recording';setTimeout(()=>this.onstart?.(),0);}stop(){this.state='inactive';this.onstop?.();} }
  Object.assign(window,{MediaRecorder:UIRecorder});
 });
 await page.setViewportSize({width:390,height:844});await page.goto('/');await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();await finishAttention(page);
 const pair=page.getByRole('group',{name:'Referenz anhören'});await expect(pair.getByRole('button',{name:'Anhören',exact:true})).toBeVisible();await expect(pair.getByRole('button',{name:'Langsam gesprochen',exact:true})).toBeVisible();
 await expect(page.locator('.practiceContext .focusNote')).toBeVisible();
 await page.getByRole('button',{name:'Aufnehmen',exact:true}).click();await expect(page.locator('.recordingPanel')).toHaveAttribute('data-state','recording');
 await expect(page.locator('.practiceContext')).not.toHaveAttribute('open','');await expect(page.locator('.practiceContext .focusNote')).toBeHidden();
 await expect(pair.locator('button').first()).toBeDisabled();await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeDisabled();
 await page.screenshot({path:`work/focus-${info.project.name}-speaking.png`,fullPage:true,animations:'disabled'});
 await page.getByText('Hinweise zum Ausdruck',{exact:true}).click();await expect(page.locator('.practiceContext .focusNote')).toBeVisible();
 await page.getByRole('button',{name:'Für jetzt aufhören',exact:true}).click();
});
