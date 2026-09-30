import {test,expect,type Page} from '@playwright/test';
import {writeHao,research} from './writing-helpers';
async function seed(page:Page,transfer=false){
 await page.goto('/');await page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/}).waitFor();
 await page.evaluate(async(transfer)=>{
  const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});
  await new Promise<void>(r=>{const tx=db.transaction(['sessions','events','preferences'],'readwrite');
   tx.objectStore('sessions').put({id:'p1-ui',plannerVersion:'d1',plan:transfer?['closure']:['write-recall','closure'],index:0,completed:false,startedAt:Date.now(),updatedAt:Date.now(),script:'hant'});
   tx.objectStore('events').put({id:'intro',at:1,sessionId:'prior',taskId:'fixture',type:'introduction_dimensions',contentVersion:'build-d-1',detail:{item:'hao',form:'好',script:'hant',toneNumbers:'hao3',dimensions:'meaning,pronunciation,hanzi,writing',introductionVersion:1}});
   if(transfer)tx.objectStore('preferences').put({key:'mini-transfer-active-v1',value:JSON.stringify({caseId:'origin-slower',revision:1,sessionId:'p1-ui',index:0,phase:'answer',answer:'',heard:true,plays:1,firstSeenAt:1})});
   tx.oncomplete=()=>r();});db.close();
 },transfer);
 await page.reload();await page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/}).click();
}
for(const variant of ['screen','paper','compare-switch','compare-reload'])test(`P1 writing: ${variant}`,async({page})=>{
 await seed(page);await expect(page.locator('.writingExercise')).toHaveAttribute('data-scaffold','delayed_recall');
 if(variant!=='screen'){
  await page.getByRole('button',{name:'Auf Papier schreiben',exact:true}).click();
  await page.getByRole('button',{name:'Ich habe geschrieben – vergleichen',exact:true}).click();
  if(variant==='paper')await page.getByRole('button',{name:'Sicher',exact:true}).click();
  else if(variant==='compare-switch')await page.getByRole('button',{name:'Am Bildschirm schreiben',exact:true}).click();
  else {await expect.poll(async()=>(await research(page)).some(e=>e.type==='writing_compare')).toBe(true);await page.reload();await page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/}).click();}
 }
 if(variant!=='paper')await writeHao(page);
 await expect.poll(async()=>(await research(page)).filter(e=>e.type==='attempt'&&e.taskId==='write-recall').length).toBe(1);
 const attempt=(await research(page)).find(e=>e.type==='attempt'&&e.taskId==='write-recall');
 expect(attempt.detail.assisted, JSON.stringify((await research(page)).filter(e=>e.type==='writing_compare'||e.type==='attempt'))).toBe(variant.startsWith('compare'));
 expect(attempt.detail.selfReport).toBe(variant==='paper');
 await expect(page.locator('.writingIntro h3')).toHaveText(variant==='paper'?'Vorlage zum Vergleich':'Dein geschriebenes Zeichen');
 const relation=await page.evaluate(async()=>{const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});return new Promise<any[]>(r=>{const q=db.transaction('relations').objectStore('relations').getAll();q.onsuccess=()=>{r(q.result);db.close();};});});
 expect(relation.find(r=>r.target==='writing').state).toBe(variant.startsWith('compare')?'FRAGILE':'DEVELOPING');
});
for(const width of [390,1280])test(`P1 transfer conservative feedback and reload at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:844});await seed(page,true);
 const answer='A soll langsam sprechen. Mit Bs Herkunft hat das nichts zu tun.';
 await page.locator('#transfer-answer').fill(answer);await page.getByRole('button',{name:'Antwort abgeben',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Auflösung',exact:true})).toBeVisible();
 await expect(page.getByText('Vollständig verstanden',{exact:true})).toHaveCount(0);
 await expect(page.getByText(/Wortmuster|Antwortmerkmale|Das bestätigt nicht/)).toHaveCount(0);

 expect((await research(page)).find(e=>e.type==='transfer_assessed').detail.outcome).toBe('features-only');
 await page.reload();await page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/}).click();
 await expect(page.getByRole('heading',{name:'Auflösung',exact:true})).toBeVisible();
 await page.getByText('Transkript ansehen',{exact:true}).click();await expect(page.locator('.reference')).toHaveCount(2);
 expect((await research(page)).filter(e=>e.type==='transfer_assessed')).toHaveLength(1);
});
