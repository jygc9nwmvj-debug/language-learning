import {test,expect,type Page} from '@playwright/test';
async function plan(page:Page, task:string, events:unknown[]=[]){
 await page.goto('/');await page.getByRole('button',{name:'Weiterlernen',exact:true}).waitFor();
 await page.evaluate(async({task,events})=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});await new Promise<void>(r=>{const t=db.transaction(['sessions','events'],'readwrite');t.objectStore('sessions').put({id:'attention',plannerVersion:'d1',plan:[task,'closure'],index:0,completed:false,startedAt:Date.now(),updatedAt:Date.now()+100,script:'hant'});for(const e of events)t.objectStore('events').put(e);t.oncomplete=()=>r();});db.close();},{task,events});await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
}
async function events(page:Page){return page.evaluate(async()=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});return new Promise<any[]>(r=>{const q=db.transaction('events').objectStore('events').getAll();q.onsuccess=()=>{db.close();r(q.result);};});});}
for(const item of ['nihao','hao'])test(`${item}: one surface separates hearing, tone, Hanzi and meaning; acknowledged item resumes compactly`,async({page})=>{
 await page.setViewportSize({width:320,height:844});
 await page.addInitScript(()=>{const play=HTMLMediaElement.prototype.play;Object.assign(window,{referenceCount:0});HTMLMediaElement.prototype.play=function(){(window as any).referenceCount++;return play.call(this);};});
 if(item === 'nihao') await page.addInitScript(() => {
  Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:async()=>new AudioContext().createMediaStreamDestination().stream}});
  class Capture { static isTypeSupported(){return true;} state='inactive';mimeType='audio/mpeg';onstart?:()=>void;onstop?:()=>void;ondataavailable?:(event:{data:Blob})=>void;start(){this.state='recording';setTimeout(()=>this.onstart?.(),0);}async stop(){this.state='inactive';this.ondataavailable?.({data:await(await fetch('/audio/mandarin/polly-nihao.mp3')).blob()});this.onstop?.();} }
  Object.assign(window,{MediaRecorder:Capture}); const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){if(this.src.startsWith('blob:'))this.loop=true;return play.call(this);};
 });
 await plan(page,`meet-${item}`);
 const surface=page.locator('.attentionIntroduction');await expect(surface).toHaveAttribute('data-focus','hear');
 await expect(surface.locator('.hanziHero')).toHaveCount(0);await expect(surface.locator('.pronunciationMeaning')).toHaveCount(0);await expect(page.getByRole('button',{name:'Aufnehmen',exact:true})).toHaveCount(0);
 await expect(surface).toHaveAttribute('data-focus','tone');await expect(surface.locator('.focusedSyllables')).toContainText('3. Ton');
 expect((await events(page)).some(e=>['tone_attention_confirmed','audio_replay','pinyin_reveal'].includes(e.type))).toBe(false);
 await page.screenshot({path:`work/attention-${item}-tone-320.png`,fullPage:true});
 const button=page.getByRole('button',{name:'Schriftbild ansehen',exact:true});await expect(button).toHaveAccessibleName('Schriftbild ansehen');expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
 await button.click();await expect(surface).toHaveAttribute('data-focus','hanzi');await expect(surface.locator('.hanziHero')).toHaveText(item==='nihao'?'你好':'好');await expect(surface.locator('.focusedSyllables')).toHaveCount(0);await expect(surface.locator('.pronunciationMeaning')).toHaveCount(0);
 await expect(surface.locator('.referenceAudio')).toBeHidden();
 await page.screenshot({path:`work/attention-${item}-hanzi-320.png`,fullPage:true});
 await page.getByRole('button',{name:'Bedeutung dazunehmen',exact:true}).click();await expect(surface).toHaveAttribute('data-focus','connect');await expect(surface.locator('.pronunciationMeaning')).toBeVisible();await expect(page.getByRole('button',{name:'Aufnehmen',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>(window as any).referenceCount)).toBe(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 if(item==='nihao') {
  await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:'work/attention-connected-390.png',fullPage:true});
  await page.getByRole('button',{name:'Aufnehmen',exact:true}).click();await page.getByRole('button',{name:'Aufnahme beenden',exact:true}).click();
  await expect(page.getByRole('button',{name:'Wiedergabe pausieren',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeDisabled();await page.getByRole('button',{name:'Wiedergabe pausieren',exact:true}).click();await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeEnabled();
 }
 const saved=await events(page);expect(saved.filter(e=>e.type==='tone_attention_confirmed')).toHaveLength(1);expect(saved.find(e=>e.type==='hanzi_attention_confirmed').detail.form).toBe(item==='hao'?'好':'你好');
 await page.getByRole('button',{name:'Für jetzt aufhören',exact:true}).click();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();await expect(page.locator('.pronunciationMeaning')).toBeVisible();await expect(surface).toHaveAttribute('data-focus','connect');
});
test('old Pinyin exposure does not enable grading, explicit item plus notation introduction does',async({page})=>{
 const old={id:'old',at:1,sessionId:'prior',taskId:'meet-nihao',type:'pinyin_reveal',contentVersion:'old',detail:{item:'nihao'}};
 const notation={...old,id:'notation',taskId:'tones',type:'task_completed'};
 await plan(page,'recall-nihao',[old,notation,{...old,id:'introduced',type:'introduction_dimensions',detail:{item:'nihao',script:'hant',form:'你好',toneNumbers:'ni3 hao3',dimensions:'meaning,pronunciation',introductionVersion:1}}]);await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill('ni2 hao3');await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.locator('.feedback')).toHaveText('Richtig.');expect((await events(page)).find(e=>e.type==='attempt').detail.assessToneNotation).toBe(false);
 await page.getByRole('button',{name:'Für jetzt aufhören',exact:true}).click();
 await plan(page,'recall-nihao',[{...old,id:'tone-focus',type:'tone_attention_confirmed',detail:{item:'nihao',toneNumbers:'ni3 hao3',attentionVersion:1}}]);await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill('ni2 hao3');await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.locator('.feedback')).toContainText('Diese Tonnotation braucht eine Korrektur:');await expect(page.locator('.feedback')).toContainText('Deine Aussprache wurde nicht bewertet.');
});
test('blocked audio and failed introduction save cannot fake teaching; retry stays on the current focus',async({page})=>{
 await page.addInitScript(()=>{HTMLMediaElement.prototype.play=function(){return Promise.reject(new DOMException('Blocked','NotAllowedError'));};const add=IDBObjectStore.prototype.add;let fail=true;IDBObjectStore.prototype.add=function(value:any,key?:IDBValidKey){if(value?.type==='tone_attention_confirmed'&&fail){fail=false;throw new DOMException('Test save failure','QuotaExceededError');}return key===undefined?add.call(this,value):add.call(this,value,key);};});
 await plan(page,'meet-nihao');await expect(page.getByText('Zum Anhören auf Play tippen.')).toBeVisible();await page.getByRole('button',{name:'Schrift ohne Warten ansehen'}).click();
 await page.getByRole('button',{name:'Schriftbild ansehen',exact:true}).click();await expect(page.getByRole('alert')).toContainText('Dein Lernstand konnte nicht gespeichert werden');await expect(page.locator('.attentionIntroduction')).toHaveAttribute('data-focus','tone');expect((await events(page)).some(e=>e.type==='tone_attention_confirmed')).toBe(false);
 await page.getByRole('button',{name:'Schriftbild ansehen',exact:true}).click();await expect(page.locator('.attentionIntroduction')).toHaveAttribute('data-focus','hanzi');
});

test('Tone Lab focuses the played example and introduces all four before its first quiz',async({page})=>{
 await page.setViewportSize({width:390,height:844});await plan(page,'tones');
 const reveal=page.getByRole('button',{name:'Bedeutungen aufdecken',exact:true});await expect(reveal).toBeDisabled();
 for(const tone of [1,2,3,4]) {await page.getByRole('button',{name:`Ton ${tone}`,exact:true}).click();await expect(page.locator('.toneRow[data-active=true]')).toHaveCount(1);if(tone<4)await expect(reveal).toBeDisabled();}
 await reveal.click();await expect(page.getByText('Welchen Ton hörst du?',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'work/attention-tone-lab-390.png',fullPage:true});
});
