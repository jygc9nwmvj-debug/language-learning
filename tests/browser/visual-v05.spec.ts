import {test,expect} from '@playwright/test';
import {finishAttention} from './helpers/attention';

test('v0.5 tokens, controls, settings, print and responsive entry',async({page},info)=>{
 await page.goto('/');
 const learn=page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/});await expect(learn).toBeVisible();
 const colors=await page.evaluate(()=>{const s=getComputedStyle(document.documentElement);return Object.fromEntries(['--green','--paper','--ink','--ink-muted','--blue','--coral','--surface'].map(k=>[k,s.getPropertyValue(k).trim()]));});
 expect(colors['--green']).toBe('#294b3c');
 const luminance=(hex:string)=>{const c=hex.slice(1).match(/../g)!.map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
 const contrast=(a:string,b:string)=>{const [hi,lo]=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (hi+.05)/(lo+.05);};
 for(const token of ['--ink','--ink-muted','--blue','--coral','--green'])expect(contrast(colors[token],colors['--paper'])).toBeGreaterThanOrEqual(4.5);
 expect(contrast(colors['--surface'],colors['--green'])).toBeGreaterThanOrEqual(4.5);
 for(const width of [320,390,768,1280]){
  await page.setViewportSize({width,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`work/v05-${info.project.name}-home-${width}.png`,fullPage:true,animations:'disabled'});
 }
 await page.getByText('Einstellungen & Sicherung',{exact:true}).click();
 await page.getByRole('button',{name:'Vereinfacht',exact:true}).click();await expect(page.getByRole('button',{name:'Vereinfacht',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Traditionell',exact:true}).click();await expect(page.getByRole('button',{name:'Traditionell',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.setViewportSize({width:320,height:740});await page.getByText('Von vorne beginnen',{exact:true}).click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`work/v05-${info.project.name}-settings-320.png`,fullPage:true,animations:'disabled'});
 await page.keyboard.press('Tab');await learn.focus();expect(await learn.evaluate(e=>getComputedStyle(e).outlineStyle)).toBe('solid');
 await page.setViewportSize({width:794,height:1123});await page.emulateMedia({media:'print'});await expect(page.locator('.worksheet')).toBeVisible();await expect(page.locator('main')).toBeHidden();
 await page.screenshot({path:`work/v05-${info.project.name}-print.png`,fullPage:true,animations:'disabled'});
});

test('v0.5 unfolds authored chunks without adding actions or losing reduced-motion/focus',async({page},info)=>{
 await page.setViewportSize({width:320,height:740});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');await page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/}).click();await finishAttention(page);
 const phrase=page.locator('.phraseForm');await expect(phrase).toHaveAttribute('data-expanded','false');
 const chunk=page.getByRole('button',{name:'你好 erkunden',exact:true});await chunk.focus();await page.keyboard.press('Enter');
 await expect(phrase).toHaveAttribute('data-expanded','true');
 await expect(page.getByRole('region',{name:'Worterklärung'})).toBeVisible();
 expect(await page.locator('.phraseUnits').evaluate(e=>getComputedStyle(e).transitionDuration)).toBe('0s');
 expect(await page.locator('.unitExplanation').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');
 for(const button of await page.locator('button:visible').all()){
  await expect(button).toHaveAccessibleName(/\S/);const box=(await button.boundingBox())!;expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);
 }
 await page.screenshot({path:`work/v05-${info.project.name}-unfold-320.png`,fullPage:true,animations:'disabled'});
 await page.keyboard.press('Escape');await expect(phrase).toHaveAttribute('data-expanded','false');
 await expect(page.getByRole('region',{name:'Worterklärung'})).toHaveCount(0);
});

test('v0.5 writer palette preserves real ink, template help and completion on a narrow surface',async({page},info)=>{
 const {drawStroke,research}=await import('./writing-helpers');
 const {readFileSync}=await import('node:fs');
 const hao=JSON.parse(readFileSync('src/languages/mandarin/data/hao.json','utf8'));
 await page.setViewportSize({width:320,height:740});await page.goto('/');
 await page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/}).waitFor();
 await page.evaluate(async()=>{
  const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});
  await new Promise<void>(r=>{const t=db.transaction(['sessions','events'],'readwrite');
   t.objectStore('sessions').put({id:'v05-writing',plannerVersion:'d1',plan:['write-recall','closure'],index:0,completed:false,startedAt:Date.now(),updatedAt:Date.now()+100,script:'hant'});
   t.objectStore('events').put({id:'v05-writing-introduction',at:1,sessionId:'prior',taskId:'fixture',type:'introduction_dimensions',detail:{item:'hao',form:'好',toneNumbers:'hao3',script:'hant',dimensions:'meaning,pronunciation,hanzi,writing',introductionVersion:1}});
   t.oncomplete=()=>r();});db.close();
 });
 await page.reload();await page.getByRole('button',{name:/^(Weiterlernen|Lernen starten)$/}).click();
 await expect(page.locator('.writingExercise')).toHaveAttribute('data-scaffold','delayed_recall');
 await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase','writing');
 const surface=await page.locator('.writingSurface').boundingBox();expect(surface!.width).toBeLessThanOrEqual(320);expect(surface!.width).toBe(surface!.height);
 await drawStroke(page,[[100,900],[850,900]]);
 await expect(page.getByRole('status').filter({hasText:'passt noch nicht'})).toBeVisible();
 await expect(page.getByTestId('learner-ink').locator('path')).toHaveCount(0);
 await page.getByRole('button',{name:'Vorlage zeigen',exact:true}).click();
 await expect(page.getByRole('button',{name:'Vorlage ausblenden',exact:true})).toHaveAttribute('aria-pressed','true');
 await drawStroke(page,hao.medians[0]);
 const ink=page.getByTestId('learner-ink');await expect(ink.locator('path')).toHaveCount(1);
 expect(await ink.locator('path').getAttribute('d')).not.toBe(hao.strokes[0]);
 expect(await ink.evaluate(e=>getComputedStyle(e).stroke)).toBe('rgb(32, 45, 39)');
 await page.screenshot({path:`work/v05-${info.project.name}-writing-320.png`,fullPage:true,animations:'disabled'});
 for(const path of hao.medians.slice(1))await drawStroke(page,path);
 await expect(page.getByRole('status').filter({hasText:'Geschafft'})).toBeVisible();
 const events=await research(page);const result=events.find(e=>e.type==='writing_stage_result');
 expect(result.detail).toMatchObject({correctStrokes:6,errors:1,assisted:true});
 expect(events.some(e=>e.type==='writing_hint')).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
