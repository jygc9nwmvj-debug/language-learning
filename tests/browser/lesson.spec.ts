import { test, expect, type Page } from '@playwright/test';
import { paperIntroduction } from './writing-helpers';
async function snapshot(page: Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const r = indexedDB.open('language-learning-local'); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
    const read = (name: string) => new Promise<any[]>((resolve, reject) => { const r = db.transaction(name).objectStore(name).getAll(); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
    const state = { sessions: await read('sessions'), relations: await read('relations'), events: await read('events') }; db.close(); return state;
  });
}
const next = (page: Page) => page.getByRole('button', { name: 'Weiter', exact: true }).click();
test('complete Lesson 1, honest evidence, backup, offline cold reopen and delayed review', async ({ page, context }) => {
  test.setTimeout(90000);
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await expect(page.getByText('Für offline bereit', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Weiterlernen', exact: true }).click();
  let safety = 0;
  while (safety++ < 40) {
    const state = await snapshot(page); const session = state.sessions.sort((a,b) => b.updatedAt-a.updatedAt)[0];
    const id = session.plan[session.index];
    if (id === 'closure') { await next(page); break; }
    if (id.startsWith('meet-')) {
      if (id === 'meet-wojiao') await page.getByLabel('Dein Name', { exact: true }).fill('Wolfram');
      await page.getByRole('button', { name: 'Pinyin und Bedeutung', exact: true }).click();
      await next(page);
    } else if (id === 'tones') {
      await page.getByRole('button', { name: 'Bedeutungen aufdecken' }).click();
      for (const n of [2,4,3]) {
        await page.getByRole('button', { name: 'Anhören', exact: true }).click();
        await page.getByRole('button', { name: String(n), exact: true }).click();
        await next(page);
      }
      await page.getByLabel('Tippe má mit einer Tonzahl').fill('ma2');
      await page.getByRole('button', { name: 'Prüfen', exact: true }).click();
      await next(page);
    } else if (id.startsWith('tone-')) {
      await page.getByRole('button', { name: 'Anhören', exact: true }).click();
      await page.getByRole('button', { name: id === 'tone-wo' ? '3' : '4', exact: true }).click();
      await next(page);
    } else if (id === 'write-guided' || id === 'write-recall') {
      if (id === 'write-guided') await paperIntroduction(page);
      else { await expect(page.locator('.lessonCard .hanziLarge')).toHaveCount(0); await expect(page.locator('.writingCanvas')).toBeVisible(); }
      if (id === 'write-recall') await page.getByRole('button', { name: 'Auf Papier schreiben' }).click();
      await page.getByRole('button', { name: 'Ich habe geschrieben' }).click();
      await page.getByRole('button', { name: 'Mit der Vorlage vergleichen' }).click();
      await page.getByRole('button', { name: 'Sicher', exact: true }).click();
    } else {
      const answers: Record<string,string> = { 'hear-nihao':'hallo','hear-askname':'wie heißt du','read-wo':'ich','read-ni':'du','read-hao':'gut','recall-wojiao':'wo jiao Wolfram','recall-nihao':'ni hao','recall-xiexie':'xiexie','recall-zaijian':'zai jian' };
      if (id.startsWith('hear-')) await page.getByRole('button', { name: 'Anhören', exact: true }).click();
      await expect(page.locator('.reference')).toHaveCount(0);
      await page.getByLabel('Deine Antwort', { exact: true }).fill(answers[id]);
      await page.getByRole('button', { name: 'Prüfen', exact: true }).click();
      if (id === 'recall-wojiao') await expect(page.getByRole('status').filter({hasText:'Tonzeichen'})).toBeVisible();
      await next(page);
    }
    await expect.poll(async () => { const s = (await snapshot(page)).sessions.find(s => s.id === session.id); return s.index; }).not.toBe(session.index);
  }
  expect(safety).toBeLessThan(40);
  await expect(page.getByRole('heading', { name: 'Gut für heute.' })).toBeVisible();
  const state = await snapshot(page);
  expect(state.relations.some(r => r.target === 'speaking')).toBe(false);
  expect(state.relations.find(r => r.objectId === 'cmn:hao:hant' && r.target === 'writing').state).toBe('DEVELOPING');
  expect(state.relations.find(r => r.objectId === 'cmn:wojiao' && r.target === 'production')).toBeTruthy();
  expect(state.events.filter(e => e.type === 'attempt').every(e => e.detail.responseTimeMs >= 0)).toBe(true);
  await page.getByRole('button', { name: 'Passend', exact: true }).click();
  await page.getByText('Einstellungen & Sicherung', { exact: true }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Lernstand & Research Log exportieren' }).click();
  expect((await download).suggestedFilename()).toMatch(/^mandarin-.*\.json$/);
  await page.close(); await context.setOffline(true);
  const offline = await context.newPage(); offline.on('pageerror', e => errors.push(e.message));
  await offline.goto('http://localhost:4173/');
  await expect(offline.getByRole('button', { name: 'Weiterlernen', exact: true })).toBeVisible();
  await offline.clock.install({ time: new Date(Date.now() + 2 * 86400000) });
  await offline.getByRole('button', { name: 'Weiterlernen', exact: true }).click();
  await expect(offline.getByRole('heading', { name: 'Was bedeutet das Gehörte?' })).toBeVisible();
  await offline.getByRole('button', { name: 'Anhören', exact: true }).click();
  await expect(offline.getByText('Das Audio konnte nicht abgespielt werden.', { exact: false })).toHaveCount(0);
  await offline.getByLabel('Deine Antwort', { exact: true }).fill('hallo');
  await offline.getByRole('button', { name: 'Prüfen', exact: true }).click();
  await expect(offline.getByRole('status').filter({hasText:'richtig'})).toBeVisible();
  expect(errors).toEqual([]);
});
test('phone layout, denied microphone, pause/resume and A4 worksheet', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/');
  await page.screenshot({ path: 'test-results/home-phone.png', fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.getByRole('button', { name: 'Weiterlernen', exact: true }).click();
  await page.evaluate(() => { navigator.mediaDevices.getUserMedia = async () => { throw new DOMException('Denied', 'NotAllowedError'); }; });
  await page.getByRole('button', { name: 'Aufnehmen', exact: true }).click();
  await expect(page.getByText('Das Mikrofon ist nicht verfügbar.', { exact: false })).toBeVisible();
  await next(page); await page.getByRole('button', { name: 'Für jetzt aufhören', exact: true }).click();
  await page.reload(); await page.getByRole('button', { name: 'Weiterlernen', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Ein Laut, vier verschiedene Wörter.' })).toBeVisible();
  const data = await snapshot(page); expect(data.relations).toEqual([]);
  await page.emulateMedia({ media: 'print' }); await page.pdf({ path: 'test-results/worksheet.pdf', format: 'A4', preferCSSPageSize: true });
  await page.screenshot({ path: 'test-results/worksheet.png', fullPage: true });
});

test('local recording can be replayed and live microphone stops on leaving the task', async ({ page }) => {
  await page.addInitScript(() => {
    const original = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    (window as any).testStreams = [];
    navigator.mediaDevices.getUserMedia = async c => { const s = await original(c); (window as any).testStreams.push(s); return s; };
  });
  await page.goto('/'); await page.getByRole('button', { name: 'Weiterlernen', exact: true }).click();
  await page.getByRole('button', { name: 'Aufnehmen', exact: true }).click();
  await expect(page.getByText('Aufnahme läuft …', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Aufnahme beenden', exact: true }).click();
  await expect(page.getByLabel('Deine Aufnahme', { exact: true })).toHaveAttribute('src', /^blob:/);
  await page.getByRole('button', { name: 'Aufnehmen', exact: true }).click();
  await expect(page.getByText('Aufnahme läuft …', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Für jetzt aufhören', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Weiterlernen', exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => (window as any).testStreams.every((s: MediaStream) => s.getTracks().every(t => t.readyState === 'ended')))).toBe(true);
  const state = await snapshot(page);
  expect(state.relations).toEqual([]);
  expect(state.events.some(e => e.type === 'recording_completed_uncertain')).toBe(true);
});
