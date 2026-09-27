import { expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
const hao = JSON.parse(readFileSync('src/languages/mandarin/data/hao.json', 'utf8'));
export async function openWriting(page: Page) {
  await page.goto('/'); await page.getByRole('button', { name: 'Weiterlernen', exact: true }).click();
  for (let n = 0; n < 5; n++) await page.getByRole('button', { name: 'Überspringen', exact: true }).click();
}
export async function observe(page: Page) {
  await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase', 'writing', { timeout: 20000 });
}
export async function drawStroke(page: Page, path: number[][], selector = '.hanziWriter') {
  await page.locator(selector).scrollIntoViewIfNeeded();
  const box = (await page.locator(selector).boundingBox())!;
  const pad = selector === '.hanziWriter' ? 15 : box.width * 15 / 280;
  const scale = (box.width - 2 * pad) / 1024;
  const points = path.map(([x,y]) => ({ x: box.x + pad + x * scale, y: box.y + pad + (900-y) * scale }));
  await page.mouse.move(points[0].x, points[0].y); await page.mouse.down();
  for (const p of points.slice(1)) await page.mouse.move(p.x, p.y, { steps: 3 });
  await page.mouse.up(); await page.waitForTimeout(350);
}
export async function writeHao(page: Page, selector = '.hanziWriter') {
  for (const path of hao.medians) await drawStroke(page, path, selector);
}
export async function paperIntroduction(page: Page, productions = 4) {
  await observe(page); await page.getByRole('button', { name: 'Auf Papier schreiben', exact: true }).click();
  for (let n = 0; n < productions; n++) {
    await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase', 'writing');
    await page.getByRole('button', { name: 'Ich habe geschrieben – vergleichen', exact: true }).click();
    await page.getByRole('button', { name: 'Sicher', exact: true }).click();
    await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase', 'success');
    if (n < productions - 1) await expect(page.locator('.writingExercise')).toHaveAttribute('data-phase', 'writing');
  }
}
export async function research(page: Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(r => { const q = indexedDB.open('language-learning-local'); q.onsuccess = () => r(q.result); });
    return new Promise<any[]>(r => { const q = db.transaction('events').objectStore('events').getAll(); q.onsuccess = () => { r(q.result.sort((a: any, b: any) => a.at-b.at)); db.close(); }; });
  });
}
