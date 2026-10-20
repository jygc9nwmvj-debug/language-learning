import {test,expect,type Page} from '@playwright/test';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {content,itemMap,taskMap} from '../../src/languages/mandarin/content';
import {introductionDetail} from '../../src/languages/mandarin/introduction';
import {matchingSets} from '../../src/languages/mandarin/matching';
import {dialogueDefinition} from '../../src/languages/mandarin/dialogue';
const phase=process.env.DESIGN_PHASE??'after';
type Fixture={task?:string;dimensions?:string[];feedback?:any;step?:string;results?:any;events?:any[];index?:number;plan?:string[];preferences?:any[]};
const event=(type:string,detail:any={},taskId='closure')=>({id:crypto.randomUUID(),at:Date.now(),sessionId:'design',taskId,type,contentVersion:'design-fixture',detail:{index:0,...detail}});
async function seed(page:Page,f:Fixture={}){
 await page.goto('/');await page.getByRole('button',{name:/^(Lernen starten|Weiterlernen)$/}).waitFor();
 const taskId=f.task??'d-recall-dont-know',now=Date.now();if(!taskMap.has(taskId))throw new Error('Unknown visual fixture task: '+taskId);
 const session:any={id:'design',plan:f.plan??[taskId,'closure'],index:f.index??0,completed:false,plannerVersion:'d1',script:'hant',startedAt:now,updatedAt:now};
 const introductions=content.items.map(i=>({id:'introduced-'+i.id,at:now-1000,sessionId:'prior',taskId:'fixture',type:'introduction_dimensions',contentVersion:'design-fixture',detail:introductionDetail(i,'hant',f.dimensions&&i.id===taskMap.get(taskId)?.itemId?f.dimensions as any:i.introduction.dimensions,'design-fixture')}));
 const events:any[]=[...introductions,...content.items.filter(i=>!f.dimensions||i.id!==taskMap.get(taskId)?.itemId||f.dimensions.includes('tone')).map(i=>event('tone_attention_confirmed',{item:i.id,toneNumbers:i.toneNumbers,attentionVersion:1})),event('tone_notation_introduced',{},'tones')];
 // A restored production response needs its occurrence's saved assessment context.
 // Without it the app correctly renders the legacy, uncolored comparison fallback.
 if(f.feedback&&taskMap.get(taskId)?.kind==='recall'){
  const assessment=taskMap.get(taskId)!.assess!;
  events.push(event('attempt',{index:session.index,assessToneNotation:assessment.toneNotation,assessNeutralTone:assessment.neutralTone},taskId));
 }
 if(f.feedback||f.results)session.evaluation={taskId,index:session.index,step:f.step??'main',results:f.results??{main:f.feedback}};
 await page.evaluate(async({session,events,preferences})=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});await new Promise<void>(r=>{const tx=db.transaction(['sessions','events','preferences','relations'],'readwrite');for(const name of ['sessions','events','preferences','relations'])tx.objectStore(name).clear();tx.objectStore('sessions').put(session);for(const e of events)tx.objectStore('events').put(e);for(const p of preferences)tx.objectStore('preferences').put(p);tx.oncomplete=()=>r();});db.close();},{session,events:[...events,...(f.events??[])],preferences:f.preferences??[]});
 await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();await expect(page.locator('.lessonCard:not([hidden])')).toBeVisible();
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
}
const feedback=(value:string,kind='attention')=>({value,message:kind==='success'?'Richtig.':'Vergleiche mit der vollständigen Form.',kind,help:false});
function dialogue(phase:string,result?:boolean):Fixture{
 const own:any[]=[{...event('dialogue_started',{runId:'dialogue',dialogueId:dialogueDefinition.id,revision:1}),id:'dialogue'},event('dialogue_step',{runId:'dialogue',sequence:0,phase,turn:0}),event('dialogue_heard',{runId:'dialogue',phase,turn:0})];
 if(phase==='turn'&&result!==undefined)own.push(event('dialogue_answer',{runId:'dialogue',turn:0,answer:result?dialogueDefinition.turns[0].answers[0]:'ich weiß es nicht',correct:result}));
 if(phase==='respond'&&result!==undefined)own.push(event('dialogue_response',{runId:'dialogue',answer:result?'im-fine':'zaijian',correct:result}));
 return {task:'closure',events:own};
}
function matching(relation:string,status='open'):Fixture{
 const set=matchingSets.find(s=>s.id==='people:'+relation)??matchingSets.find(s=>s.id==='early-self:'+relation)!;
 const own=[{...event('matching_started',{runId:'matching',setId:set.id,revision:1,script:'hant',left:set.items.join(','),right:[...set.items].reverse().join(',')}),id:'matching'}];
 if(status==='error')own.push(event('matching_pair',{runId:'matching',sequence:0,left:set.items[0],right:set.items[1],correct:false}));
 if(status==='complete')for(const [n,id] of set.items.entries())own.push(event('matching_pair',{runId:'matching',sequence:n,left:id,right:id,correct:true}));
 return {task:'read-wo',events:own};
}
test('screen atlas: regular families and their input/help/result states',async({page},info)=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 page.setDefaultTimeout(10000);
 await page.addInitScript(()=>{
  // Deterministic UI fixture only; no assertion about real audio or microphone quality.
  HTMLMediaElement.prototype.play=async function(){this.dispatchEvent(new Event('playing'));if((window as any).finishFixtureAudio)setTimeout(()=>this.dispatchEvent(new Event('ended')),20);};
  HTMLMediaElement.prototype.pause=function(){this.dispatchEvent(new Event('pause'));};
  Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>{throw new DOMException('Fixture permission denied','NotAllowedError');}}});
 });
 const out=`work/mobile-v2/design/${phase}/${info.project.name}`;mkdirSync(out,{recursive:true});const results:any[]=[];
 async function capture(name:string,family:string){
  await page.mouse.move(0,0);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(100);
  const m=await page.evaluate(()=>{
   const rect=(el:Element|null)=>{if(!el)return null;const b=el.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height,bottom:b.bottom,right:b.right};};
   const root=[...document.querySelectorAll('.viewportFlow')].find(el=>el.getClientRects().length),primary=root?.querySelector('[data-primary-dock]')??null;
   const controls=[...document.querySelectorAll('button,summary,input,textarea')].filter(el=>el.getClientRects().length).map(el=>({name:el.getAttribute('aria-label')||el.textContent?.trim(),disabled:(el as HTMLButtonElement).disabled,...rect(el)}));
   const shell=document.querySelector('.lessonShell');return {viewport:{width:innerWidth,height:innerHeight},pageWidth:document.documentElement.scrollWidth,pageHeight:document.documentElement.scrollHeight,bodyScroll:scrollY,root:rect(root),content:root?{height:root.clientHeight,scroll:root.scrollHeight,width:root.clientWidth,scrollWidth:root.scrollWidth}:null,header:rect(document.querySelector('.lessonHeader')),primary:rect(primary),controls,shell:rect(shell)};
  });
  results.push({name,family,...m});writeFileSync(`${out}/metrics.json`,JSON.stringify(results,null,2));await page.screenshot({path:`${out}/${name}.png`});
  if(phase==='after')expect(m.pageWidth,name+' page width').toBeLessThanOrEqual(m.viewport.width+1);
  if(phase==='after'&&m.root){expect(m.bodyScroll,name+' body scroll').toBe(0);expect(m.pageHeight,name+' page height').toBeLessThanOrEqual(m.viewport.height+1);if(m.primary)expect(m.primary.bottom,name+' action visibility').toBeLessThanOrEqual(m.viewport.height+1);}
 }
 await page.goto('/');await page.getByRole('button',{name:'Lernen starten',exact:true}).waitFor();await capture('01-home','home');
 await page.locator('.settings > summary').click();await capture('02-settings','settings');
 await page.evaluate(()=>{document.documentElement.dataset.offline='failed';window.dispatchEvent(new Event('offline-ready'));});await capture('03-offline-retry','system');
 for(const [name,dimensions] of [['04-introduction-hear',[]],['05-introduction-tone',['pronunciation']],['06-introduction-hanzi',['pronunciation','tone']],['07-introduction-connect',['pronunciation','tone','hanzi']]] as [string,string[]][]){await seed(page,{task:'meet-wo',dimensions});await capture(name,'introduction');}
 await seed(page,{task:'d-meet-im-german'});await page.locator('.practiceContext > summary').click();await page.getByText('Sprachhinweis',{exact:true}).click();await capture('08-phrase-detail','introduction');
 await seed(page);await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill('wo3 bu4 dzi dap');await capture('09-recall-input','production');
 await page.getByRole('button',{name:'Hilfe zeigen',exact:true}).click();await capture('10-recall-help','production');
 for(const [name,value,kind] of [['11-correction-spelling','wo3 bu4 dzi dap','attention'],['12-correction-tone','wo3 bu4 zhi4 dao','success'],['13-correction-missing','wo3 bu4 dao','attention'],['14-correction-extra','wo3 bu4 zhi1 dao ma','attention'],['15-correction-fallback','banana orange','error'],['16-correction-success','wo3 bu4 zhi1 dao','success']]){await seed(page,{feedback:feedback(value,kind)});await capture(name,'production');}
 await seed(page,{task:'recall-nihao',feedback:feedback('ni hao')});await capture('17-correction-omitted-tone','production');
 for(const [name,task,result] of [['18-read-input','read-nihao',false],['19-read-result','read-nihao',true],['20-listen-input','hear-nihao',false],['21-listen-result','hear-nihao',true]] as [string,string,boolean][]){await seed(page,{task,...(result?{feedback:feedback('hallo','success')}:{})});await capture(name,task.startsWith('read')?'reading':'listening');}
 await seed(page,{task:'read-nihao',feedback:feedback('hallo','success')});await page.getByRole('button',{name:'Aufnehmen · freiwillig',exact:true}).click();await expect(page.locator('.recordingPanel')).toContainText('nicht verfügbar');await capture('22-microphone-optional','system');
 await seed(page,{task:'write-wo'});await capture('23-writing-demo','writing');
 const recallWriting=[...taskMap.values()].find(t=>t.kind==='writing'&&t.recall)!;
 await seed(page,{task:recallWriting.id});await capture('24-writing-recall','writing');await page.getByRole('button',{name:'Vorlage zeigen',exact:true}).click();await capture('25-writing-help','writing');
 await seed(page,{task:'write-wo',feedback:{...feedback('','success'),result:'success',help:true,mode:'screen',stage:0,ink:['M 20 20 L 80 100'],inkSize:300}});await capture('26-writing-saved','writing');
 await seed(page,{task:'tones',dimensions:[]});await capture('27-tone-examples','tones');
 await seed(page,{task:'tones',step:'tone:0',results:{}});await capture('28-tone-quiz','tones');
 await seed(page,{task:'tones',step:'notation',results:{}});await capture('29-tone-notation','tones');
 for(const [name,relation,status] of [['30-matching-meaning','form-meaning','open'],['31-matching-audio','audio-form','open'],['32-matching-pinyin','pinyin-form','open'],['33-matching-error','form-meaning','error'],['34-matching-complete','form-meaning','complete']]){await seed(page,matching(relation,status));await capture(name,'matching');}
 for(const [name,p,result] of [['35-dialogue-listen','listen',undefined],['36-dialogue-turn','turn',undefined],['37-dialogue-correction','turn',false],['38-dialogue-revisit','revisit',undefined],['39-dialogue-choice','respond',undefined],['40-dialogue-choice-result','respond',false],['41-dialogue-complete','complete',undefined]] as [string,string,boolean|undefined][]){await seed(page,dialogue(p,result));await capture(name,'dialogue');}
 const screenlessTask='d-recall-dont-understand';
 await seed(page,{task:screenlessTask,events:[event('screenless_offered',{},screenlessTask)]});await capture('42-screenless-prompt','screenless');await page.getByRole('button',{name:'Aufdecken',exact:true}).click();await capture('43-screenless-compare','screenless');
 await seed(page,{task:'read-nihao',plan:['read-nihao','closure'],events:[event('paper_offered',{items:'hao,ni,wo',index:1})]});await page.getByRole('button',{name:'Überspringen',exact:true}).click();await expect(page.getByRole('button',{name:'Fertig – vergleichen',exact:true})).toBeVisible();await capture('44-paper-prompt','paper');await page.getByRole('button',{name:'Fertig – vergleichen',exact:true}).click();await capture('45-paper-compare','paper');
 await seed(page,{task:'d-sequence-78910'});await capture('46-sequence-input','sequence');await seed(page,{task:'d-sequence-78910',feedback:feedback('shi-number,qi,ba,jiu')});await capture('47-sequence-result','sequence');
 for(const [name,p] of [['49-transfer-listen','listen'],['50-transfer-answer','answer'],['51-transfer-result','result']]){await seed(page,{task:'closure',preferences:[{key:'mini-transfer-active-v1',value:JSON.stringify({caseId:'name-repeat',revision:1,sessionId:'design',index:0,phase:p,answer:p==='result'?'A soll die Frage nach dem Namen wiederholen.':'',heard:p!=='listen',plays:p==='listen'?0:1,firstSeenAt:Date.now()})}]});await capture(name,'transfer');}
 await seed(page,{task:'read-nihao',plan:['meet-nihao','read-nihao','closure'],index:1});await page.getByRole('button',{name:'Vorheriges',exact:true}).click();await capture('52-inspection','inspection');
 writeFileSync(`${out}/metrics.json`,JSON.stringify(results,null,2));
 // Contact sheets are review aids, not an assertion of visual quality.
 for(let start=0;start<results.length;start+=6){const group=results.slice(start,start+6);await page.setViewportSize({width:960,height:1050});await page.setContent(`<style>body{margin:0;background:#ddd;font:14px sans-serif;display:grid;grid-template-columns:repeat(3,320px)}figure{margin:0;padding:8px;box-sizing:border-box;height:520px}figcaption{height:32px}img{display:block;max-width:304px;max-height:472px;margin:auto}</style>`+group.map(r=>`<figure><figcaption>${r.name}</figcaption><img src="data:image/png;base64,${readFileSync(`${out}/${r.name}.png`).toString('base64')}"></figure>`).join(''));await page.screenshot({path:`${out}/sheet-${start/6+1}.png`});}
});

for(const relation of ['form-meaning','audio-form','pinyin-form'])test(`matching cards: ${relation}, stable layout and unchanged evidence`,async({page},info)=>{
 await page.addInitScript(()=>{
  HTMLMediaElement.prototype.play=async function(){this.dispatchEvent(new Event('playing'));setTimeout(()=>this.dispatchEvent(new Event('ended')),10);};
  HTMLMediaElement.prototype.pause=function(){this.dispatchEvent(new Event('pause'));};
 });
 await seed(page,matching(relation));
 const set=matchingSets.find(s=>s.id==='people:'+relation)??matchingSets.find(s=>s.id==='early-self:'+relation)!;
 const board=page.locator('.matchingBoard'),columns=board.locator('.matchingColumn');
 const boxes=()=>board.locator('.matchingCell').evaluateAll(cells=>cells.map(cell=>{const b=cell.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height};}));
 const original=await boxes();
 for(const b of original){expect(b.height).toBeGreaterThanOrEqual(96);expect(b.width).toBeGreaterThanOrEqual(96);}
 expect(Math.max(...original.map(b=>b.height))-Math.min(...original.map(b=>b.height))).toBeLessThan(1);
 expect(await columns.nth(1).locator('button').first().evaluate(b=>getComputedStyle(b).opacity)).toBe('1');
 const saved=()=>page.evaluate(async()=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});const out:any={};for(const key of ['events','relations','sessions'])out[key]=await new Promise(r=>{const q=db.transaction(key).objectStore(key).getAll();q.onsuccess=()=>r(q.result);});db.close();return out;});
 const before=await saved();
 const choose=async(id:string)=>{
  const b=columns.nth(0).getByRole('button').nth(set.items.indexOf(id));await expect(b).toBeEnabled();await b.focus();await b.press('Enter');
  if(relation==='audio-form')await expect.poll(async()=>(await saved()).events.filter((e:any)=>e.type==='matching_audio'&&e.detail.item===id).length).toBeGreaterThan(0);
  await expect(board.locator('.matchingCell[data-selected=true]')).toHaveCount(1);
 };
 const answer=async(id:string)=>{const b=columns.nth(1).getByRole('button').nth([...set.items].reverse().indexOf(id));await expect(b).toBeEnabled();await b.focus();await b.press('Enter');};
 const resume=async()=>{await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();await expect(board).toBeVisible();};
 await choose(set.items[0]);
 const out=`work/mobile-v2/design/cards/${info.project.name}`;mkdirSync(out,{recursive:true});
 await page.screenshot({path:`${out}/${relation}-selected.png`});
 await answer(set.items[1]);await expect(board.locator('[data-wrong=true]')).toHaveCount(2);
 await expect(board.locator('.matchingErrorMark')).toHaveCount(2);
 await expect(page.locator('.matchingFeedback')).toContainText('Versuche es noch einmal');
 await expect(page.locator('.matchingFeedback')).not.toContainText('Passend ist');
 await expect(board.locator('[data-correct-alternative=true]')).toHaveCount(0);
 expect(await boxes()).toEqual(original);await page.screenshot({path:`${out}/${relation}-error.png`});
 await resume();await expect(board.locator('[data-correct-alternative=true]')).toHaveCount(0);
 await expect(page.locator('.matchingFeedback')).not.toContainText('Passend ist');
 await choose(set.items[1]);await answer(set.items[0]);
 await expect(board.locator('[data-correct-alternative=true]')).toHaveCount(0);
 await expect(page.locator('.matchingFeedback')).not.toContainText('Passend ist');
 await choose(set.items[0]);await answer(set.items[1]);
 await expect(board.locator('[data-correct-alternative=true]')).toHaveCount(1);
 await expect(page.locator('.matchingFeedback')).toContainText('Passend ist');
 await expect(board.locator('[data-correct-alternative=true] button')).toHaveText(relation==='form-meaning'?itemMap.get(set.items[0])!.meaning.de:itemMap.get(set.items[0])!.hant);
 expect(await boxes()).toEqual(original);await page.screenshot({path:`${out}/${relation}-correction.png`});
 const attemptsBeforeReload=(await saved()).events.filter((e:any)=>e.type==='matching_pair');
 await resume();await expect(board.locator('[data-correct-alternative=true]')).toHaveCount(1);
 expect((await saved()).events.filter((e:any)=>e.type==='matching_pair')).toEqual(attemptsBeforeReload);
 await choose(set.items[1]);await expect(board.locator('[data-correct-alternative=true]')).toHaveCount(0);
 await choose(set.items[0]);await expect(board.locator('[data-correct-alternative=true]')).toHaveCount(1);
 for(const id of set.items){await choose(id);await answer(id);await expect(board.locator('[data-matched=true]')).toHaveCount(2*(set.items.indexOf(id)+1));await expect(board.locator('.matchingMatched [data-icon=check]')).toHaveCount(2*(set.items.indexOf(id)+1));expect(await boxes()).toEqual(original);}
 await expect(page.locator('.matchingExercise')).toHaveAttribute('data-phase','complete');
 await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeEnabled();
 const after=await saved(),pairs=after.events.filter((e:any)=>e.type==='matching_pair');
 expect(pairs).toHaveLength(set.items.length+3);expect(pairs.slice(1).every((e:any)=>e.detail.assisted&&!e.detail.independent)).toBe(true);expect(pairs.at(-1).detail.elimination).toBe(true);
 expect(after.relations).toEqual(before.relations);expect(after.sessions).toEqual(before.sessions);
 if(relation==='audio-form'){
  const replay=columns.nth(0).getByRole('button').first(),n=after.events.filter((e:any)=>e.type==='matching_audio').length;
  await expect(replay).toBeEnabled();await replay.click();
  await expect.poll(async()=>(await saved()).events.filter((e:any)=>e.type==='matching_audio').length).toBeGreaterThan(n);
  expect((await saved()).events.filter((e:any)=>e.type==='matching_pair')).toHaveLength(pairs.length);
 }
 await page.screenshot({path:`${out}/${relation}-complete.png`});
 await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
 await expect(page.locator('.matchingExercise')).toHaveAttribute('data-phase','complete');
 expect((await saved()).events.filter((e:any)=>e.type==='matching_pair')).toEqual(pairs);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(info.project.use.viewport!.width);
 expect(await page.locator('.viewportFlow').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
});

test('button hierarchy: primary, object audio and subordinate help remain distinct',async({page},info)=>{
 await seed(page,{task:'read-nihao',feedback:feedback('hallo','success')});
 await expect(page.locator('.continueButton')).toBeEnabled();
 const readStyle=async(selector:string)=>page.locator(selector).first().evaluate(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return {height:r.height,font:parseFloat(s.fontSize),background:s.backgroundColor,border:s.borderTopWidth};});
 const pinyin=await readStyle('.practiceReference .utilityButton'),primary=await readStyle('.continueButton'),normal=await readStyle('.referenceAudio [data-variant=normal] button'),slow=await readStyle('.referenceAudio [data-variant=slow] button');
 expect(primary.height).toBeGreaterThan(normal.height);expect(normal.height).toBeGreaterThan(pinyin.height);expect(pinyin.height).toBeGreaterThanOrEqual(44);expect(slow.height).toBeGreaterThanOrEqual(44);
 expect(primary.font).toBeGreaterThan(pinyin.font);expect(pinyin.border).toBe('0px');expect(pinyin.background).toBe('rgba(0, 0, 0, 0)');expect(normal.background).not.toBe(pinyin.background);
 const icon=async(variant:string)=>page.locator(`.referenceAudio [data-variant=${variant}] .controlIcon`).first().evaluate(el=>el.getBoundingClientRect().width);
 expect(await icon('normal')).toBeGreaterThan(await icon('slow'));
 const box=async(selector:string)=>page.locator(selector).first().boundingBox();
 const normalBox=await box('.referenceAudio [data-variant=normal] button'),slowBox=await box('.referenceAudio [data-variant=slow] button'),micBox=await box('.recordingHeading .recordButton'),infoBox=await box('.recordingInfo > summary');
 expect(normalBox!.x).toBeLessThan(slowBox!.x);expect(slowBox!.x).toBeLessThan(micBox!.x);expect(micBox!.x).toBeLessThan(infoBox!.x);
 expect(Math.abs(normalBox!.y-micBox!.y)).toBeLessThan(1);expect(Math.abs(normalBox!.y+normalBox!.height/2-slowBox!.y-slowBox!.height/2)).toBeLessThan(1);expect(infoBox!.x-(micBox!.x+micBox!.width)).toBe(8);
 const hanziBefore=await box('.practiceReference .hanziHero, .practiceReference .unitHanzi');
 await page.locator('.recordingInfo > summary').click();
 await expect(page.locator('.recordingInfo .infoContent')).toBeVisible();
 const openMic=await box('.recordingHeading .recordButton'),openInfo=await box('.recordingInfo > summary');expect(openInfo!.x-(openMic!.x+openMic!.width)).toBe(8);
 expect((await box('.practiceReference .hanziHero, .practiceReference .unitHanzi'))).toEqual(hanziBefore);
 expect(await page.locator('.viewportFlow').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
 await page.locator('.recordingInfo > summary').click();
 const out=`work/mobile-v2/design/hierarchy/${info.project.name}`;mkdirSync(out,{recursive:true});await page.screenshot({path:`${out}/result-pinyin-audio-next.png`});
 await page.getByRole('button',{name:'Pinyin zeigen',exact:true}).click();await expect(page.locator('.practiceReference')).toContainText('nǐ');
 await seed(page,{task:'read-nihao'});await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill('hallo');await expect(page.locator('.responseActions button[type=submit]')).toBeEnabled();const check=await readStyle('.responseActions button[type=submit]'),help=await readStyle('.responseActions .textButton');expect(check.height).toBeGreaterThan(help.height);expect(check.font).toBeGreaterThan(help.font);expect(help.height).toBeGreaterThanOrEqual(44);await page.screenshot({path:`${out}/input-check-help.png`});
});

test('open actions: shared roles across affected learning states',async({page},info)=>{
 page.setDefaultTimeout(10000);
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.addInitScript(()=>{HTMLMediaElement.prototype.play=async function(){this.dispatchEvent(new Event('playing'));};HTMLMediaElement.prototype.pause=function(){this.dispatchEvent(new Event('pause'));};});
 const out=`work/mobile-v2/design/open-actions/${info.project.name}`;mkdirSync(out,{recursive:true});const evidence:any[]=[];
 async function capture(name:string,hasPrimary=true){
  await page.mouse.move(0,0);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(100);
  const metrics=await page.evaluate(()=>{
   const shown=(el:Element)=>!!el.getClientRects().length&&!el.closest('[hidden]');
   const actions=[...document.querySelectorAll<HTMLButtonElement>('button.primaryAction')].filter(shown).map(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el),arrow=el.querySelector('.primaryActionArrow')!,a=arrow.getBoundingClientRect();return {docked:el.hasAttribute('data-primary-dock'),text:el.textContent!.trim(),height:r.height,width:r.width,right:r.right,bottom:r.bottom,background:s.backgroundColor,border:s.borderTopWidth,font:parseFloat(s.fontSize),arrowWidth:a.width,arrowHeight:a.height,arrowBackground:getComputedStyle(arrow).backgroundColor};});
   const root=document.querySelector('.viewportFlow'),dock=document.querySelector('[data-primary-dock]');return {actions,horizontal:document.documentElement.scrollWidth,flowFits:!root||root.scrollWidth<=root.clientWidth,dockBottom:dock?.getBoundingClientRect().bottom??null};
  });
  expect(metrics.actions.length,name).toBe(hasPrimary?1:0);
  for(const a of metrics.actions){expect(a.height,name).toBeGreaterThanOrEqual(60);expect(['rgba(0, 0, 0, 0)','rgb(247, 245, 239)'],name).toContain(a.background);expect(a.border,name).toBe('0px');expect(a.arrowWidth,name).toBe(56);expect(a.arrowHeight,name).toBe(56);expect(a.arrowBackground,name).toBe('rgb(41, 75, 60)');expect(a.right,name).toBeLessThanOrEqual(page.viewportSize()!.width);}
  expect(metrics.horizontal,name).toBeLessThanOrEqual(page.viewportSize()!.width);expect(metrics.flowFits,name).toBe(true);if(metrics.dockBottom!==null)expect(metrics.dockBottom,name).toBeLessThanOrEqual(page.viewportSize()!.height+1);
  evidence.push({name,...metrics});await page.screenshot({path:`${out}/${name}.png`});
 }
 await page.goto('/');await page.getByRole('button',{name:'Lernen starten',exact:true}).waitFor();await capture('home');
 for(const [name,dimensions] of [['introduction-tone',['pronunciation']],['introduction-hanzi',['pronunciation','tone']],['introduction-connected',['pronunciation','tone','hanzi']]] as [string,string[]][]){await seed(page,{task:'meet-wo',dimensions});await capture(name);}
 await seed(page);await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill('wo3 bu4 dzi dap');await capture('production-input');await page.locator('button[type=submit] .primaryActionArrow').click();await expect(page.locator('.productionFeedback')).toBeVisible();await capture('production-correction');
 await seed(page,{task:'read-nihao'});const input=page.getByRole('textbox',{name:'Deine Antwort',exact:true});await input.fill('hallo');await expect(page.locator('button[type=submit]')).toBeEnabled();await page.locator('button[type=submit] .primaryActionLabel').click();await expect(page.locator('.resolvedExercise')).toBeVisible();await capture('reading-result');
 const attempts=()=>page.evaluate(async()=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});const events:any[]=await new Promise(r=>{const q=db.transaction('events').objectStore('events').getAll();q.onsuccess=()=>r(q.result);});db.close();return events.filter(e=>e.type==='attempt');});
 const before=await attempts();expect(before).toHaveLength(1);await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();await expect(page.locator('.resolvedExercise')).toBeVisible();expect(await attempts()).toEqual(before);
 await seed(page,{task:'read-nihao'});await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill('hallo');await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).press('Enter');await expect(page.locator('.resolvedExercise')).toBeVisible();expect(await attempts()).toHaveLength(1);
 await seed(page,{task:'hear-nihao'});await capture('listening-input');
 await seed(page,{task:'write-wo'});await capture('writing-tools',false);expect(await page.locator('.writingActionBar').evaluate(e=>getComputedStyle(e).backgroundColor)).toBe('rgb(247, 245, 239)');
 await seed(page,{task:'write-wo',feedback:{...feedback('','success'),result:'success',help:true,mode:'screen',stage:0,ink:['M 20 20 L 80 100'],inkSize:300}});await capture('writing-result');
 const recallWriting=[...taskMap.values()].find(t=>t.kind==='writing'&&t.recall)!;await seed(page,{task:recallWriting.id});await page.getByText('Schreiboptionen',{exact:true}).click();await page.getByRole('button',{name:'Auf Papier schreiben',exact:true}).click();await expect(page.getByRole('button',{name:'Ich habe geschrieben – vergleichen',exact:true})).toBeVisible();await capture('writing-paper-compare');
 await seed(page,{task:'tones',step:'notation',results:{}});await capture('notation-input');await seed(page,{task:'tones',step:'notation',results:{notation:feedback('wrong')}});await capture('notation-retry');
 const task='d-recall-dont-understand';await seed(page,{task,events:[event('screenless_offered',{},task)]});await capture('screenless-reveal');await page.getByRole('button',{name:'Aufdecken',exact:true}).click();await capture('screenless-choices',false);expect(await page.locator('.selfAssessmentActions .primaryActionArrow').count()).toBe(0);
 await seed(page,{task:'read-nihao',plan:['read-nihao','closure'],events:[event('paper_offered',{items:'hao,ni,wo',index:1})]});await page.getByRole('button',{name:'Überspringen',exact:true}).click();await expect(page.getByRole('button',{name:'Fertig – vergleichen',exact:true})).toBeVisible();await capture('paper-reveal');await page.getByRole('button',{name:'Fertig – vergleichen',exact:true}).click();await capture('paper-choices',false);
 await seed(page,{task:'d-sequence-78910'});await capture('sequence-input');await seed(page,matching('form-meaning','complete'));await capture('matching-complete');
 await seed(page,dialogue('turn'));await capture('dialogue-input');await seed(page,dialogue('complete'));await capture('dialogue-complete');
 for(const phase of ['answer','result']){await seed(page,{task:'closure',preferences:[{key:'mini-transfer-active-v1',value:JSON.stringify({caseId:'name-repeat',revision:1,sessionId:'design',index:0,phase,answer:phase==='result'?'A soll die Frage nach dem Namen wiederholen.':'',heard:true,plays:1,firstSeenAt:Date.now()})}]});await capture('transfer-'+phase);}
 writeFileSync(`${out}/metrics.json`,JSON.stringify(evidence,null,2));
});

test('shared layout: content axis, sequence, self-report actions and inspection return',async({page})=>{
 await seed(page,{task:'d-sequence-78910',feedback:feedback('shi-number,qi,ba,jiu')});
 await expect(page.locator('.correctComparison .controlLabel')).toHaveText('Lösung');
 const axis=await page.evaluate(()=>({header:document.querySelector('.lessonHeader')!.getBoundingClientRect().x,content:document.querySelector('.viewportFlow')!.getBoundingClientRect().x+4,action:document.querySelector('[data-primary-dock]')!.getBoundingClientRect().x}));
 expect(Math.abs(axis.header-axis.content)).toBeLessThanOrEqual(1);expect(Math.abs(axis.action-axis.content)).toBeLessThanOrEqual(1);
 for(const row of await page.locator('.sequenceComparison').evaluateAll(rows=>rows.map(row=>[...row.children].map(c=>c.getBoundingClientRect().y))))expect(Math.max(...row)-Math.min(...row)).toBeLessThan(1);
 await seed(page,{task:'d-sequence-78910'});
 const y=await page.locator('.numberSequence > .buttonRow:not(.responseActions) > button').evaluateAll(bs=>bs.map(b=>b.getBoundingClientRect().y));expect(Math.max(...y)-Math.min(...y)).toBeLessThan(1);
 const task='d-recall-dont-understand';await seed(page,{task,events:[event('screenless_offered',{},task)]});
 await page.getByRole('button',{name:'Aufdecken',exact:true}).click();
 await expect(page.locator('.selfAssessmentActions[data-primary-dock]')).toBeVisible();
 for(const b of await page.locator('.selfAssessmentActions > button').all()){const r=await b.boundingBox();expect(r!.height).toBeGreaterThanOrEqual(48);expect(r!.y+r!.height).toBeLessThanOrEqual(page.viewportSize()!.height);}
 await seed(page,{task:'read-nihao',plan:['meet-nihao','read-nihao','closure'],index:1});
 await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill('hallo');await page.getByRole('button',{name:'Vorheriges',exact:true}).click();
 await expect(page.locator('.inspectionSurface .viewportFlow')).toBeVisible();
 await expect.poll(()=>page.locator('[data-primary-dock]').count()).toBe(1);
 await page.getByRole('button',{name:'Zur aktuellen Aufgabe',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Deine Antwort',exact:true})).toHaveValue('hallo');
 await expect.poll(()=>page.locator('[data-primary-dock]').count()).toBe(1);
});
