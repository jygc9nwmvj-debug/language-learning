import { test, expect } from '@playwright/test';
import { openWriting, observe, drawStroke, writeHao, research } from './writing-helpers';

test('four fading productions log scaffold, actual mistakes and hints, then leave for intervening material', async ({ page }) => {
  test.setTimeout(90000);
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await openWriting(page); await observe(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  for (const scaffold of ['full_guided', 'full_reduced', 'faint_outline']) {
    await expect(page.locator(`[data-scaffold="${scaffold}"]`)).toBeVisible();
    await page.getByRole('button', { name: 'Geführt schreiben', exact: true }).click();
    await page.waitForTimeout(400);
    // A deliberately unrelated stroke must be rejected and logged, without advancing the stage.
    await drawStroke(page, [[100,900],[850,900]]);
    if (scaffold === 'faint_outline') {
      await page.screenshot({ path: 'test-results/fading-outline.png', fullPage: true });
      await page.getByRole('button', { name: 'Nächsten Strich zeigen' }).click();
    }
    await writeHao(page);
    await page.getByRole('button', { name: 'Weiter mit weniger Hilfe', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Zeichen kurz ansehen', exact: true }).click();
  await expect(page.locator('.reference')).toBeVisible();
  await expect(page.locator('.writingCanvas')).toHaveCount(0);
  await expect(page.locator('.writingCanvas')).toBeVisible();
  await expect(page.locator('.lessonCard')).not.toContainText('好');
  await page.screenshot({ path: 'test-results/fading-blank.png', fullPage: true });
  await writeHao(page, '.writingCanvas');
  await page.getByRole('button', { name: 'Neu schreiben', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Mit der Vorlage vergleichen' })).toBeDisabled();
  await writeHao(page, '.writingCanvas');
  await page.getByRole('button', { name: 'Mit der Vorlage vergleichen' }).click();
  await page.getByRole('button', { name: 'Unsicher', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Was bedeutet das Gehörte?' })).toBeVisible();
  const log = await research(page);
  const results = log.filter(e => e.type === 'writing_stage_result');
  expect(results.map(e => e.detail.scaffold)).toEqual(['observe','full_guided','full_reduced','faint_outline','brief_recall']);
  for (const row of results.slice(1,4)) { expect(row.detail.errors).toBe(1); expect(row.detail.correctStrokes).toBe(6); expect(row.detail.assisted).toBe(true); }
  expect(results[1].detail.hints).toBe(7); expect(results[2].detail.hints).toBe(0); expect(results[3].detail.hints).toBe(1);
  expect(results[4].detail.result).toBe('unsure'); expect(results[4].detail.selfReport).toBe(true);
  expect(log.filter(e => e.type === 'attempt')).toHaveLength(1);
  expect(errors).toEqual([]);
});

test('delayed recall stays blank; asking for a model prevents independent evidence', async ({ page }) => {
  await openWriting(page);
  for (let n = 5; n < 22; n++) await page.getByRole('button', { name: 'Überspringen', exact: true }).click();
  await expect(page.locator('[data-scaffold="delayed_recall"]')).toBeVisible();
  await expect(page.locator('.lessonCard')).not.toContainText('好');
  await page.getByRole('button', { name: 'Vorlage zeigen', exact: true }).click();
  await expect(page.locator('.reference')).toHaveText('Vorlage好');
  await page.getByRole('button', { name: 'Vorlage ausblenden', exact: true }).click();
  await writeHao(page, '.writingCanvas');
  await page.getByRole('button', { name: 'Mit der Vorlage vergleichen' }).click();
  await page.getByRole('button', { name: 'Sicher', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Runde abgeschlossen.' })).toBeVisible();
  const log = await research(page);
  const attempt = log.find(e => e.type === 'attempt');
  expect(attempt.detail.assisted).toBe(true); expect(attempt.detail.selfReport).toBe(true);
  expect(log.find(e => e.type === 'writing_stage_result').detail.hints).toBe(1);
});
