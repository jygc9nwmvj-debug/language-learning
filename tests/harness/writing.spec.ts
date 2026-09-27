import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { drawStroke, observe } from '../browser/writing-helpers';
const data = Object.fromEntries(['hao','ni','wo'].map(id=>[id,JSON.parse(readFileSync(`src/languages/mandarin/data/${id}.json`,'utf8'))]));
async function events(page:Page) { return JSON.parse(await page.getByTestId('test-events').textContent() || '[]'); }
for (const id of ['hao','ni','wo']) test(`${id}: demonstration, honest imperfect ink, wrong shape/order, fading and recall`, async({page},info)=>{
  test.setTimeout(80000);
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/__test/a1');
  await page.getByLabel('Lernschritt',{exact:true}).selectOption(id==='hao'?'write-guided':`write-${id}`);
  await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase','demo');
  await observe(page);
  const stages=id==='hao'?['full_guided','full_reduced','faint_outline','brief_recall']:['full_guided','faint_outline','brief_recall'];
  const paths:number[][][]=data[id].medians;
  for (const [stageIndex,stage] of stages.entries()) {
    await expect(page.locator('.writingExercise')).toHaveAttribute('data-scaffold',stage);
    await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase','writing');
    if (stageIndex===0) {
      // Correct data, but a genuinely wrong next-stroke order and then wrong geometry.
      await drawStroke(page,paths.at(-1)!);
      await drawStroke(page,[[50,850],[950,850]]);
      await expect(page.getByTestId('learner-ink').locator('path')).toHaveCount(0);
      await expect.poll(async()=>(await events(page)).filter((e:any)=>e.type==='writing_stroke_error').length).toBe(2);
      await page.getByRole('button',{name:'Nächster Strich',exact:true}).click();
    }
    for (const [index,path] of paths.entries()) {
      // A visibly wobbly, recognizable path (roughly +/- 7px at 320px).
      const actual = stageIndex===1 ? path.map(([x,y],n)=>[x+(n%2?22:-22),y+(n%3?15:-15)]) : path;
      await drawStroke(page,actual);
      await expect(page.getByTestId('learner-ink').locator('path')).toHaveCount(index+1);
      if (index===0) {
        const d=await page.getByTestId('learner-ink').locator('path').getAttribute('d');
        const box=(await page.locator('.hanziWriter').boundingBox())!;
        const numbers=d!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
        expect(Math.abs(numbers[0]-(15+actual[0][0]*(box.width-30)/1024))).toBeLessThan(1.1);
        expect(Math.abs(numbers[1]-(15+(900-actual[0][1])*(box.width-30)/1024))).toBeLessThan(1.1);
        // Underlying ideal main strokes remain transparent even after acceptance.
        const visibleIdeal=await page.locator('.hanziWriter svg').evaluate(svg=>[...svg.querySelectorAll('path')].some(p=>p.getAttribute('stroke')==='rgb(38,61,51)' && p.getAttribute('stroke-opacity')==='1'));
        expect(visibleIdeal).toBe(false);
      }
    }
    await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase','success');
    if(stageIndex===1) await info.attach(`${id}-real-ink`,{body:await page.locator('.writingSurface').screenshot(),contentType:'image/png'});
  }
  await expect.poll(async()=>(await events(page)).some((e:any)=>e.type==='finished')).toBe(true);
  const log=await events(page);
  expect(log.filter((e:any)=>e.type==='writing_stage_result').length).toBe(stages.length);
  expect(log.filter((e:any)=>e.type==='attempt')).toHaveLength(1);
  expect(log.find((e:any)=>e.type==='attempt').detail.selfReport).toBe(false);
  await info.attach(`${id}-events.json`,{body:JSON.stringify(log,null,2),contentType:'application/json'});
  const databases=await page.evaluate(()=>indexedDB.databases());
  expect(databases.some(d=>d.name==='language-learning-local')).toBe(false);
  await page.getByRole('button',{name:'Reset / erneut testen',exact:true}).click();
  await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase','demo');
  expect(errors).toEqual([]);
});

test('real touch input does not scroll; cancellation and multi-touch never complete a stroke',async({page,context,browserName})=>{
  test.skip(browserName!=='chromium','Real touch injection uses Chromium CDP; other flow tests also run in WebKit.');
  await page.setViewportSize({width:390,height:844});
  const cdp=await context.newCDPSession(page);
  await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:2});
  await page.goto('/__test/a1');await page.getByLabel('Lernschritt',{exact:true}).selectOption('write-recall');
  await observe(page);await page.locator('.writingSurface').scrollIntoViewIfNeeded();
  const box=(await page.locator('.hanziWriter').boundingBox())!;
  const path=data.hao.medians[0].map(([x,y]:number[])=>({x:box.x+15+x*(box.width-30)/1024,y:box.y+15+(900-y)*(box.width-30)/1024}));
  const scroll=await page.evaluate(()=>scrollY);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[path[0]]});
  for(const point of path.slice(1)) await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect(page.getByTestId('learner-ink').locator('path')).toHaveCount(1);
  expect(await page.evaluate(()=>scrollY)).toBe(scroll);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[path[0]]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
  await expect(page.getByTestId('learner-ink').locator('path')).toHaveCount(0);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[path[0],{x:path[0].x+30,y:path[0].y}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect(page.getByTestId('learner-ink').locator('path')).toHaveCount(0);
  expect((await events(page)).some((e:any)=>e.type==='attempt')).toBe(false);
});
