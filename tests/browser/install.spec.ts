import { test, expect, type Page } from '@playwright/test';
const label = 'Zum Home-Bildschirm hinzufügen';
const learn = (page: Page) => page.getByRole('button', { name: /^(Lernen starten|Weiterlernen)$/ });
const android = 'Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/140.0 Mobile Safari/537.36';
const iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 Version/26.0 Mobile/15E148 Safari/604.1';
async function environment(page: Page, options: { ios?: boolean; desktop?: boolean; installed?: 'standalone' | 'fullscreen' | 'ios'; early?: boolean } = {}) {
  await page.addInitScript(({ options, android, iphone }) => {
    Object.defineProperty(navigator, 'userAgent', { value: options.desktop ? 'Windows Chrome/140 Safari/537.36' : options.ios ? iphone : android, configurable: true });
    Object.defineProperty(navigator, 'userAgentData', { value: options.ios ? undefined : { mobile: !options.desktop }, configurable: true });
    Object.defineProperty(navigator, 'standalone', { value: options.installed === 'ios', configurable: true });
    const actual = window.matchMedia.bind(window);
    const modes: Record<string, MediaQueryList> = {};
    window.matchMedia = query => {
      if (!query.startsWith('(display-mode:')) return actual(query);
      if (!modes[query]) {
        const target = new EventTarget();
        modes[query] = Object.assign(target, { matches: query === `(display-mode: ${options.installed})`, media: query }) as MediaQueryList;
      }
      return modes[query];
    };
    (window as any).installQA = { calls: 0, activated: false, modes, emit(outcome = 'dismissed') {
      const event = new Event('beforeinstallprompt', { cancelable: true });
      Object.assign(event, { prompt: () => {
        this.calls++; this.activated = navigator.userActivation?.isActive;
        if (outcome === 'error') return Promise.reject(new Error('expired'));
        return Promise.resolve({ outcome });
      } });
      window.dispatchEvent(event);
      return event.defaultPrevented;
    } };
    if (options.early) {
      const add = window.addEventListener.bind(window);
      window.addEventListener = ((type: string, listener: EventListener, settings: any) => {
        add(type, listener, settings);
        if (type === 'beforeinstallprompt') (window as any).installQA.emit();
      }) as typeof window.addEventListener;
    }
  }, { options, android, iphone });
}
const emit = (page: Page, outcome = 'dismissed') => page.evaluate(outcome => (window as any).installQA.emit(outcome), outcome);
const calls = (page: Page) => page.evaluate(() => (window as any).installQA.calls);
async function layout(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const action = page.locator('.installAccess').locator('button, summary').or(page.locator('button.installAccess'));
  const box = await action.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  const primary = await learn(page).boundingBox();
  expect(box!.y).toBeGreaterThan(primary!.y + primary!.height);
  expect(await action.evaluate(e => getComputedStyle(e).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
}
for (const width of [320, 390]) {
  test(`native prompt is optional and consumed once at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 }); await environment(page); await page.goto('/');
    await expect(learn(page)).toHaveText('Lernen starten');
    await expect(page.locator('.installAccess')).toHaveCount(0);
    expect(await emit(page)).toBe(true);
    const install = page.getByRole('button', { name: label }); await expect(install).toBeVisible();
    expect(await calls(page)).toBe(0); await layout(page);
    await page.screenshot({ path: `../install-native-${width}-${test.info().project.name}.png`, fullPage: true });
    await install.click(); expect(await calls(page)).toBe(1);
    expect(await page.evaluate(() => (window as any).installQA.activated)).toBe(true);
    await expect(install).toHaveCount(0); await emit(page); await expect(install).toHaveCount(0);
    await expect(learn(page)).toBeEnabled(); await learn(page).click();
    await expect(page.locator('.lessonCard')).toHaveAttribute('data-learning-state', 'introduction');
    await expect(page.locator('.installAccess')).toHaveCount(0);
    await page.getByRole('button', { name: 'Für jetzt aufhören', exact: true }).click();
    await expect(learn(page)).toHaveText('Weiterlernen');
    await expect(install).toHaveCount(0);
    await page.reload(); await expect(learn(page)).toHaveText('Weiterlernen');
    await expect(install).toHaveCount(0); expect(await emit(page)).toBe(true); await expect(install).toBeVisible();
    expect(await calls(page)).toBe(0); await learn(page).click(); await expect(page.locator('.lessonCard')).toBeVisible();
  });
  test(`Safari instructions stay inline and collapsed until requested at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 }); await environment(page, { ios: true }); await page.goto('/');
    await expect(learn(page)).toHaveText('Lernen starten');
    const details = page.locator('details.installAccess'), summary = details.locator('summary');
    await expect(details).not.toHaveAttribute('open', ''); await expect(details.locator('ol')).not.toBeVisible();
    await layout(page); const before = await learn(page).boundingBox(), cardBefore = await page.locator('.startCard').boundingBox();
    await summary.focus(); await page.keyboard.press('Enter');
    await expect(details.locator('ol')).toBeVisible(); await expect(details.locator('li')).toHaveCount(3);
    await expect(details).toContainText('Als Web-App öffnen'); await expect(details).toContainText('Aktionen bearbeiten');
    const after = await learn(page).boundingBox(); const cardAfter = await page.locator('.startCard').boundingBox(); expect(after!.y - cardAfter!.y).toBe(before!.y - cardBefore!.y);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `../install-safari-${width}-${test.info().project.name}.png`, fullPage: true });
    await page.keyboard.press('Enter'); await expect(details.locator('ol')).not.toBeVisible(); await expect(summary).toBeFocused();
    await learn(page).click(); await expect(page.locator('.lessonCard')).toHaveAttribute('data-learning-state', 'introduction');
    await page.getByRole('button', { name: 'Für jetzt aufhören', exact: true }).click();
    await expect(learn(page)).toHaveText('Weiterlernen'); await expect(details).not.toHaveAttribute('open', '');
    await page.reload(); await expect(learn(page)).toHaveText('Weiterlernen'); await expect(details).not.toHaveAttribute('open', '');
    await learn(page).click(); await expect(page.locator('.lessonCard')).toBeVisible();
  });
}
test('early install event survives lazy App load; accepted install hides future access', async ({ page }) => {
  await environment(page, { early: true }); await page.goto('/'); await expect(learn(page)).toBeVisible();
  const install = page.getByRole('button', { name: label }); await expect(install).toBeVisible(); expect(await calls(page)).toBe(0);
  await emit(page, 'accepted'); await install.click(); await expect(install).toHaveCount(0); await emit(page); await expect(install).toHaveCount(0);
});
test('expired native prompt does not interrupt learning', async ({ page }) => {
  await environment(page); await page.goto('/'); await expect(learn(page)).toBeVisible(); await emit(page, 'error');
  await page.getByRole('button', { name: label }).click(); await expect(page.locator('.installAccess')).toHaveCount(0);
  await learn(page).click(); await expect(page.locator('.lessonCard')).toBeVisible();
});
for (const mode of ['standalone', 'fullscreen', 'ios'] as const) test(`installed ${mode} hides access before and after reload`, async ({ page }) => {
  await environment(page, { ios: mode === 'ios', installed: mode }); await page.goto('/'); await expect(learn(page)).toBeVisible();
  expect(await emit(page)).toBe(false); await expect(page.locator('.installAccess')).toHaveCount(0);
  await page.reload(); await expect(learn(page)).toBeVisible(); await expect(page.locator('.installAccess')).toHaveCount(0);
});
test('appinstalled and display-mode changes remove a retained prompt', async ({ page }) => {
  await environment(page); await page.goto('/'); await expect(learn(page)).toBeVisible(); await emit(page);
  await expect(page.locator('.installAccess')).toBeVisible();
  await page.evaluate(() => {
    const mode = (window as any).installQA.modes['(display-mode: standalone)']; mode.matches = true; mode.dispatchEvent(new Event('change'));
  });
  await expect(page.locator('.installAccess')).toHaveCount(0);
  await page.reload(); await expect(learn(page)).toBeVisible(); await emit(page); await expect(page.locator('.installAccess')).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event('appinstalled')));
  await expect(page.locator('.installAccess')).toHaveCount(0); await emit(page); await expect(page.locator('.installAccess')).toHaveCount(0);
});
for (const width of [320, 1280]) test(`desktop has no mobile install access at ${width}px even with prompt event`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 }); await environment(page, { desktop: true }); await page.goto('/');
  await expect(learn(page)).toBeVisible(); expect(await emit(page)).toBe(false); await expect(page.locator('.installAccess')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `../install-desktop-${width}-${test.info().project.name}.png`, fullPage: true });
});
