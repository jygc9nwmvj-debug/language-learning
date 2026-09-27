import { test, expect, type Page } from '@playwright/test';
async function task(page: Page, id: string, name = '') {
  await page.goto('/'); await expect(page.getByRole('button',{name:'Weiterlernen',exact:true})).toBeVisible();
  await page.evaluate(async ({id,name}) => {
    const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});
    await new Promise<void>((resolve,reject)=>{
      const t=db.transaction(['sessions','preferences'],'readwrite');
      t.objectStore('sessions').put({id:crypto.randomUUID(),plan:[id,'closure'],index:0,completed:false,startedAt:Date.now(),updatedAt:Date.now(),script:'hant'});
      t.objectStore('preferences').put({key:'name',value:name}); t.oncomplete=()=>resolve();t.onerror=()=>reject(t.error);
    });db.close();
  },{id,name});
  await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
}
for(const [input,expected] of [
 ['wo3 jiao4 Wolfram','Richtig.'],['wǒ jiào Wolfram','Richtig.'],['wo jiao Wolfram','Tonangaben fehlen'],
 ['wo3 jiao Wolfram','jiao4 (jiào)'],['wo3 jiao4','Ergänze nach dem Ausdruck deinen Namen.'],['wo3 joao4 Wolfram','„joao4“ → jiao4 (jiào)'],
]) test(`name introduction: ${input}`, async ({page})=>{
 await task(page,'recall-wojiao','');
 const field=page.getByLabel('Deine Antwort',{exact:true});await field.fill(input);
 await expect(field).toHaveAttribute('autocorrect','off');
 await page.getByRole('button',{name:'Prüfen',exact:true}).click();
 await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeVisible();
 await expect(field).toHaveValue(input);await expect(field).toHaveAttribute('readonly','');
 await expect(page.getByRole('status').filter({hasText:expected})).toBeVisible();
 await expect(page.getByRole('button',{name:'Prüfen',exact:true})).toHaveCount(0);
 await expect(page.locator('.reference')).toHaveCount(0);await expect(page.locator('output')).toHaveCount(0);
 await field.press('Enter');await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeVisible();
 if(input==='wo3 jiao4 Wolfram') await page.screenshot({path:'test-results/a1-correct-name.png',fullPage:true});
});
test('thanks variants keep the submitted answer and reveal only the missing tone', async ({page})=>{
 for(const input of ['xie4 xie5','xièxie','謝謝','谢谢','xie xie']) {
  await task(page,'recall-xiexie');await page.getByLabel('Deine Antwort',{exact:true}).fill(input);
  await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeVisible();
  await expect(page.getByLabel('Deine Antwort',{exact:true})).toHaveValue(input);
  await expect(page.getByRole('status').filter({hasText:input==='xie xie'?'xie4 (xiè)':'Richtig.'})).toBeVisible();
  await expect(page.locator('.reference')).toHaveCount(0);await expect(page.getByRole('button',{name:'Prüfen',exact:true})).toHaveCount(0);
 }
});
test('meaning exercises use canonical answers and keep exact learner input',async({page})=>{
 for(const [id,input,ok] of [['read-wo','mich',true],['read-hao','gut',true],['read-hao','schlecht',false]] as const) {
  await task(page,id);await page.getByLabel('Deine Antwort',{exact:true}).fill(input);await page.getByRole('button',{name:'Prüfen',exact:true}).click();
  await expect(page.getByRole('status').filter({hasText:ok?'Richtig.':'Die Bedeutung ist: gut.'})).toBeVisible();
  await expect(page.locator('.answerSummary')).toContainText(input);await expect(page.getByRole('button',{name:'Prüfen',exact:true})).toHaveCount(0);
 }
});
test('tone typing practice ends evaluation and offers only an explicit retry after a mistake',async({page})=>{
 await task(page,'tones');await page.getByRole('button',{name:'Bedeutungen aufdecken'}).click();
 for(const n of [2,4,3]) {await page.getByRole('button',{name:'Anhören',exact:true}).click();await page.getByRole('button',{name:String(n),exact:true}).click();await page.getByRole('button',{name:'Weiter',exact:true}).click();}
 const field=page.getByLabel('Tippe má mit einer Tonzahl');await field.fill('ma4');await page.getByRole('button',{name:'Prüfen',exact:true}).click();
 await expect(field).toHaveValue('ma4');await expect(page.getByRole('button',{name:'Prüfen',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Noch einmal versuchen'}).click();await field.fill('ma2');await page.getByRole('button',{name:'Prüfen',exact:true}).click();
 await expect(field).toHaveValue('ma2');await expect(page.getByRole('button',{name:'Prüfen',exact:true})).toHaveCount(0);await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeVisible();
});


test('stored sentence cannot contaminate the model or reject a valid introduction',async({page})=>{
 await task(page,'recall-wojiao','Wo3 joao4 Wolfram');
 await page.getByRole('button',{name:'Hilfe zeigen',exact:true}).click();
 await expect(page.locator('.reference')).toContainText('我叫 …');
 await expect(page.locator('.reference')).not.toContainText('joao');
 await page.getByLabel('Deine Antwort',{exact:true}).fill('wo3 jiao4 Wolfram');
 await page.getByRole('button',{name:'Prüfen',exact:true}).click();
 await expect(page.getByRole('status').filter({hasText:'Richtig.'})).toBeVisible();
 await expect(page.locator('.reference')).toHaveCount(0);
 await expect(page.getByLabel('Deine Antwort',{exact:true})).toHaveValue('wo3 jiao4 Wolfram');
});
