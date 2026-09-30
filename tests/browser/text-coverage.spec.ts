import {test,expect,type Page} from '@playwright/test';
import {content} from '../../src/languages/mandarin/content';
const home=(page:Page)=>page.getByRole('button',{name:/^(Lernen starten|Weiterlernen)$/});
async function seed(page:Page,task:string,known=true,index=0) {
 await page.goto('/');await home(page).waitFor();
 await page.evaluate(async({task,items,known,index})=>{
  const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result)});
  await new Promise<void>(r=>{const tx=db.transaction(['sessions','events','preferences','relations'],'readwrite');for(const name of ['sessions','events','preferences','relations'])tx.objectStore(name).clear();
   tx.objectStore('sessions').put({id:'text-coverage',plannerVersion:'d1',plan:index?['meet-nihao',task,'closure']:[task,'meet-wo','closure'],index,completed:false,startedAt:1,updatedAt:Date.now(),script:'hant'});
   if(known)for(const item of items)tx.objectStore('events').put({id:'intro-'+item.id,at:1,sessionId:'prior',taskId:'fixture',type:'introduction_dimensions',detail:{item:item.id,form:item.hant,toneNumbers:item.toneNumbers,script:'hant',dimensions:'meaning,pronunciation,hanzi,writing',introductionVersion:1}});
   tx.oncomplete=()=>r();});db.close();
 },{task,items:content.items,known,index});await page.reload();await home(page).click();
}
async function capture(page:Page,name:string,width:number,project:string) {
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const missing=await page.locator('button:visible').evaluateAll(buttons=>buttons.filter(b=>!(b.getAttribute('aria-label')||b.textContent)?.trim()).length);
 expect(missing).toBe(0);
 await page.screenshot({path:`work/text-coverage/${project}-${width}-${name}.png`,fullPage:true,animations:'disabled'});
}
for(const width of [320,390,1280])test(`text corrections preserve functional context ${width}`,async({page},info)=>{
 test.setTimeout(90000);await page.setViewportSize({width,height:900});await page.goto('/');await home(page).waitFor();
 await expect(page.locator('.startCard > .eyebrow')).toHaveCount(0);
 await expect(page.locator('.startCard h2')).toHaveText('Mandarin lernen');
 await expect(page.getByText('Funktioniert jetzt auch offline.',{exact:true})).toHaveCount(1);
 await capture(page,'home',width,info.project.name);
 await seed(page,'meet-nihao',false);
 await expect(page.locator('.attentionIntroduction')).toBeVisible();
 await expect(page.locator('.lessonCard > h2')).toHaveCount(0);
 await expect(page.getByText('Hören. Verstehen. Selbst sagen.',{exact:true})).toHaveCount(0);
 await capture(page,'new-encounter',width,info.project.name);
 await seed(page,'d-recall-qing',false);
 await expect(page.locator('.attentionIntroduction')).toBeVisible();
 await expect(page.locator('.lessonCard > h2')).toHaveCount(0);
 await expect(page.getByText('Lerne den Ausdruck zuerst kennen.',{exact:true})).toHaveCount(0);
 await capture(page,'prerequisite-introduction',width,info.project.name);
 for(const task of ['meet-nihao','d-meet-im-german','d-meet-san','d-meet-what','d-meet-im-fine','d-meet-qing']){
  await seed(page,task);await expect(page.locator('.lessonCard > h2')).toHaveCount(0);
  if(task==='meet-nihao'||task==='d-meet-im-fine')await expect(page.locator('.practiceContext')).toHaveCount(0);
  else if(task==='d-meet-qing'){await expect(page.locator('.practiceContext')).toBeVisible();await expect(page.locator('.practiceContext')).toContainText('Es ist keine Antwort auf');}
  else if(task==='d-meet-what'){await expect(page.getByText(/Als Rückfrage: „Was/)).toBeVisible();}
  else {await expect(page.getByText('Eine kleine Entdeckung',{exact:true})).toBeVisible();await page.getByText('Eine kleine Entdeckung',{exact:true}).click();}
  await capture(page,task,width,info.project.name);
 }
 await seed(page,'d-write-ren');await expect(page.locator('.writingExercise')).toBeVisible();await expect(page.locator('.lessonCard > h2')).toHaveCount(0);await expect(page.locator('.writingIntro')).toContainText('Erst zuschauen');await capture(page,'generic-writing',width,info.project.name);
 await seed(page,'read-hao',true,1);await page.getByRole('button',{name:'Vorheriges',exact:true}).click();
 await expect(page.locator('.inspectionSurface')).toBeVisible();await expect(page.locator('.inspectionSurface > h2')).toHaveCount(0);
 await expect(page.getByText(/Freiwillige Übung · ohne neue Lernbewertung/)).toBeVisible();
 await capture(page,'inspection',width,info.project.name);
 await page.getByRole('button',{name:'Zur aktuellen Aufgabe',exact:true}).click();
 await expect(page.locator('.lessonCard:not([hidden]) > h2')).toHaveText('Was bedeutet dieses Zeichen?');
 await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill('gut');await page.getByRole('button',{name:'Prüfen',exact:true}).click();
 await expect(page.locator('.feedback')).toHaveText('Richtig.');await expect(page.locator('.practiceContext')).toHaveCount(0);
 await capture(page,'correct-read',width,info.project.name);
});
