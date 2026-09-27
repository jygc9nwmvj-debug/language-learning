import { test, expect, type Page } from '@playwright/test';
import { openWriting, observe, drawStroke, writeHao, research } from './writing-helpers';
import { readFileSync } from 'node:fs';
const hao = JSON.parse(readFileSync('src/languages/mandarin/data/hao.json', 'utf8'));
async function openRecall(page: Page) {
  await page.goto('/'); await expect(page.getByRole('button',{name:'Weiterlernen',exact:true})).toBeVisible();
  await page.evaluate(async()=>{
    const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});
    await new Promise<void>(r=>{const t=db.transaction('sessions','readwrite');t.objectStore('sessions').put({id:'recall-fixture',plan:['write-recall','closure'],index:0,completed:false,startedAt:Date.now(),updatedAt:Date.now(),script:'hant'});t.oncomplete=()=>r();});db.close();
  });
  await page.reload(); await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
}
test('honest ink, immediate feedback and four automatically fading productions on a phone', async ({ page }) => {
  test.setTimeout(70000);
  await page.setViewportSize({ width: 390, height: 844 });
  await openWriting(page); await observe(page);
  await expect(page.getByTestId('stroke-numbers')).toBeVisible();
  await drawStroke(page, [[100,900],[850,900]]);
  await expect(page.getByRole('status').filter({hasText:'passt noch nicht'})).toBeVisible();
  await expect(page.getByTestId('learner-ink').locator('path')).toHaveCount(0);
  const levels = ['full_guided','full_reduced','faint_outline','brief_recall'];
  for (const [n, level] of levels.entries()) {
    await expect(page.locator('.writingExercise')).toHaveAttribute('data-scaffold',level);
    await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase','writing');
    if (n > 0) await expect(page.getByTestId('stroke-numbers')).toHaveCount(0);
    if (n === 3) {
      await expect(page.locator('.lessonCard .hanziLarge')).toHaveCount(0);
      await page.screenshot({path:'test-results/b-empty-phone.png',fullPage:true});
    }
    await drawStroke(page, hao.medians[0]);
    await expect(page.getByTestId('learner-ink').locator('path')).toHaveCount(1);
    const first = await page.getByTestId('learner-ink').locator('path').getAttribute('d');
    expect(first).not.toBe(hao.strokes[0]);
    expect(first).toMatch(/^M/);
    await expect(page.getByTestId('learner-ink')).toHaveAttribute('stroke-width','7');
    for (const path of hao.medians.slice(1)) await drawStroke(page,path);
    await expect(page.getByRole('status').filter({hasText:'Geschafft'})).toBeVisible();
    if (n === 1) await page.screenshot({path:'test-results/b-ink-phone.png',fullPage:true});
  }
  await expect(page.getByRole('heading',{name:'Was bedeutet das Gehörte?'})).toBeVisible();
  const log = await research(page), results = log.filter(e=>e.type==='writing_stage_result');
  expect(results.map(e=>e.detail.scaffold)).toEqual(levels);
  expect(results.map(e=>e.detail.category)).toEqual(['guided_trace','reduced_scaffold','reduced_scaffold','free_recall']);
  expect(results.every(e=>!e.detail.selfReport && e.detail.correctStrokes===6 && e.detail.assisted)).toBe(true);
  expect(results[0].detail.errors).toBe(1);
  expect(log.filter(e=>e.type==='attempt'&&e.taskId==='write-guided')).toHaveLength(1);
});
test('later recall starts blank; template, retry and replay are explicit assistance', async ({ page }) => {
  test.setTimeout(60000);
  await openRecall(page);
  await expect(page.locator('.writingExercise')).toHaveAttribute('data-scaffold','delayed_recall');
  await expect(page.getByTestId('stroke-numbers')).toHaveCount(0);
  await expect(page.locator('.lessonCard .hanziLarge')).toHaveCount(0);
  const before=await page.locator('.writingSurface').screenshot();
  await page.getByRole('button',{name:'Vorlage zeigen',exact:true}).click();
  await page.waitForTimeout(200);
  expect(Buffer.compare(before,await page.locator('.writingSurface').screenshot())).not.toBe(0);
  await drawStroke(page,hao.medians[0]);
  await page.getByRole('button',{name:'Neu ansetzen',exact:true}).click();
  await expect(page.getByTestId('learner-ink').locator('path')).toHaveCount(0);
  await page.getByRole('button',{name:'Noch einmal ansehen',exact:true}).click();
  await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase','demo');
  await observe(page); await writeHao(page);
  await expect(page.getByRole('heading',{name:'Runde abgeschlossen.'})).toBeVisible();
  const log=await research(page);
  expect(log.some(e=>e.type==='writing_hint')).toBe(true);
  expect(log.some(e=>e.type==='writing_clear')).toBe(true);
  expect(log.find(e=>e.type==='attempt'&&e.taskId==='write-recall').detail.assisted).toBe(true);
});


test('a stroke hint remains assistance after pausing and resuming the same recall', async ({page}) => {
  await openRecall(page);
  await page.getByRole('button',{name:'Nächster Strich',exact:true}).click();
  await expect.poll(async()=>(await research(page)).some(e=>e.type==='writing_stroke_hint')).toBe(true);
  await page.getByRole('button',{name:'Für jetzt aufhören',exact:true}).click();
  await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
  await writeHao(page);
  await expect(page.getByRole('heading',{name:'Runde abgeschlossen.'})).toBeVisible();
  const attempt=(await research(page)).find(e=>e.type==='attempt'&&e.taskId==='write-recall');
  expect(attempt.detail.assisted).toBe(true); expect(attempt.detail.selfReport).toBe(false);
});
