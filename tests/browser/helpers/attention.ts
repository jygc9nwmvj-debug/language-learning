import type { Page } from '@playwright/test';
// Advance the pilot only when a normal encounter presents it; known items remain compact.
export async function finishAttention(page: Page) {
  await page.locator('.attentionIntroduction, .pronunciationMeaning').first().waitFor();
  if (!await page.locator('.attentionIntroduction').count() || await page.locator('.attentionIntroduction').getAttribute('data-focus') === 'connect') return;
  await page.getByRole('button', { name: 'Schriftbild ansehen', exact: true }).click();
  await page.getByRole('button', { name: 'Bedeutung dazunehmen', exact: true }).click();
}
