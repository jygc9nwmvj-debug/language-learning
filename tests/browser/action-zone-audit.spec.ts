import { test, expect, type Page } from '@playwright/test';
import { content, itemMap, taskMap } from '../../src/languages/mandarin/content';

const home = (page: Page) => page.getByRole('button', { name: /^(Lernen starten|Weiterlernen)$/ });

async function seed(page: Page, task: string, transfer = false) {
  await page.goto('/');
  await home(page).waitFor();
  await page.evaluate(async ({ task, items, transfer, toneNumbers }) => {
    const db = await new Promise<IDBDatabase>(resolve => {
      const request = indexedDB.open('language-learning-local');
      request.onsuccess = () => resolve(request.result);
    });
    await new Promise<void>(resolve => {
      const tx = db.transaction(['sessions', 'events', 'preferences', 'relations'], 'readwrite');
      for (const store of ['sessions', 'events', 'preferences', 'relations']) tx.objectStore(store).clear();
      tx.objectStore('sessions').put({ id: 'action-audit', plannerVersion: 'd1', plan: [task, 'meet-wo', 'closure'], index: 0, completed: false, startedAt: Date.now(), updatedAt: Date.now(), script: 'hant' });
      for (const item of items) tx.objectStore('events').put({ id: `intro-${item.id}`, at: 1, sessionId: 'prior', taskId: 'fixture', type: 'introduction_dimensions', detail: { item: item.id, form: item.hant, toneNumbers: item.toneNumbers, script: 'hant', dimensions: 'meaning,pronunciation,hanzi,writing', introductionVersion: 1 } });
      tx.objectStore('events').put({ id: 'tone-attention', at: 2, sessionId: 'prior', taskId: 'fixture', type: 'tone_attention_confirmed', detail: { item: 'wo', toneNumbers, attentionVersion: 1 } });
      if (transfer) tx.objectStore('preferences').put({ key: 'mini-transfer-active-v1', value: JSON.stringify({ caseId: 'origin-slower', revision: 1, sessionId: 'action-audit', index: 0, phase: 'answer', answer: '', heard: true, plays: 1, firstSeenAt: 1 }) });
      tx.oncomplete = () => resolve();
    });
    db.close();
  }, { task, items: content.items, transfer, toneNumbers: itemMap.get('wo')!.toneNumbers });
  await page.reload();
  await home(page).click();
  await expect(page.locator('.lessonCard:not([hidden])')).toBeVisible();
}

async function geometry(page: Page, label: string) {
  const button = page.getByRole('button', { name: label, exact: true });
  await button.scrollIntoViewIfNeeded();
  const box = await button.boundingBox();
  return { x: box!.x, y: box!.y, width: box!.width, height: box!.height, scrollY: await page.evaluate(() => scrollY), documentHeight: await page.evaluate(() => document.documentElement.scrollHeight) };
}

for (const [width, height] of [[320, 740], [390, 844], [768, 1024], [1280, 900]] as const) {
  test(`audit primary action geometry ${width}x${height}`, async ({ page }, info) => {
    await page.setViewportSize({ width, height });
    const rows: Array<{family:string;before:Awaited<ReturnType<typeof geometry>>;after:Awaited<ReturnType<typeof geometry>>;deltaY:number}> = [];

    for (const [task, answer, help] of [['recall-nihao', 'ni2 hao3', false], ['d-recall-dont-know', 'wo3 bu4', true], ['read-hao', 'falsch', false], ['hear-nihao', 'hallo', false]] as const) {
      await seed(page, task);
      if (task.startsWith('hear')) await page.locator('.responseExercise .audioControl[data-emphasis=stimulus] button').click();
      if (help) await page.getByRole('button', { name: 'Hilfe zeigen', exact: true }).click();
      await page.getByRole('textbox', { name: 'Deine Antwort', exact: true }).fill(answer);
      const before = await geometry(page, 'Prüfen');
      await page.getByRole('button', { name: 'Prüfen', exact: true }).click();
      const after = await geometry(page, 'Weiter');
      rows.push({ family: task, before, after, deltaY: after.y - before.y });
    }

    await seed(page, 'd-sequence-123');
    const ids = taskMap.get('d-sequence-123')!.sequence!;
    for (const id of [...ids].reverse()) await page.getByRole('button', { name: itemMap.get(id)!.hant, exact: true }).click();
    const sequenceBefore = await geometry(page, 'Prüfen');
    await page.getByRole('button', { name: 'Prüfen', exact: true }).click();
    const sequenceAfter = await geometry(page, 'Weiter');
    rows.push({ family: 'sequence', before: sequenceBefore, after: sequenceAfter, deltaY: sequenceAfter.y - sequenceBefore.y });

    await seed(page, 'closure', true);
    await page.locator('#transfer-answer').fill('Ich weiß es nicht.');
    const transferBefore = await geometry(page, 'Antwort abgeben');
    await page.getByRole('button', { name: 'Antwort abgeben', exact: true }).click();
    const transferAfter = await geometry(page, 'Weiter');
    rows.push({ family: 'transfer', before: transferBefore, after: transferAfter, deltaY: transferAfter.y - transferBefore.y });

    console.log(`ACTION_AUDIT ${info.project.name} ${width}x${height} ${JSON.stringify(rows)}`);
    for (const row of rows) {
      expect(Math.abs(row.after.x - row.before.x), `${row.family} horizontal action anchor`).toBeLessThan(1);
      expect(Math.abs(row.deltaY), `${row.family} vertical action movement`).toBeLessThanOrEqual(75);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('focused input remains operable in a keyboard-sized visual viewport', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 430 });
  await seed(page, 'd-recall-dont-know');
  const input = page.getByRole('textbox', { name: 'Deine Antwort', exact: true });
  await input.focus();
  await input.fill('wo3 bu4 zhi1 dao4');
  const before = await geometry(page, 'Prüfen');
  expect(before.y + before.height).toBeLessThanOrEqual(430);
  await page.getByRole('button', { name: 'Prüfen', exact: true }).click();
  const after = await geometry(page, 'Weiter');
  expect(after.y + after.height).toBeLessThanOrEqual(430);
  expect(Math.abs(after.x - before.x)).toBeLessThan(1);
  expect(Math.abs(after.y - before.y)).toBeLessThanOrEqual(75);
  console.log(`KEYBOARD_AUDIT ${info.project.name} ${JSON.stringify({ before, after })}`);
});
