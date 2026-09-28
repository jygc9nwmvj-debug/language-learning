import { finishAttention } from './helpers/attention';
import { test, expect } from '@playwright/test';

async function captureFixture(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'mediaDevices', { value: { getUserMedia: async () => {
      const context = new AudioContext(); return context.createMediaStreamDestination().stream;
    } } });
    class RecorderFixture {
      static isTypeSupported() { return true; }
      state = 'inactive'; mimeType = 'audio/mpeg'; onstart?: () => void; onstop?: () => void; ondataavailable?: (event: { data: Blob }) => void;
      start() { this.state = 'recording'; setTimeout(() => this.onstart?.(), 0); }
      async stop() { this.state = 'inactive'; this.ondataavailable?.({ data: await (await fetch('/audio/mandarin/polly-nihao.mp3')).blob() }); this.onstop?.(); }
    }
    Object.assign(window, { MediaRecorder: RecorderFixture });
    // Keep the short fixture playing until the learner pauses it, independent of test speed.
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () { if (this.src.startsWith('blob:')) this.loop = true; return play.call(this); };
  });
}

test('compact recording controls preserve autoplay, pause, replay, retake and the next-step lock', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await captureFixture(page);
  await page.goto('/'); await page.getByRole('button', { name: 'Weiterlernen', exact: true }).click();
  await finishAttention(page);await expect(page.locator('.pronunciationMeaning')).toBeVisible();
  await finishAttention(page);await page.getByRole('button', { name: 'Aufnehmen', exact: true }).click();
  await expect(page.getByText(/^Aufnahme läuft/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Weiter', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Aufnahme beenden', exact: true }).click();
  const audio = page.locator('.ownRecording audio');
  await expect(page.getByRole('button', { name: 'Wiedergabe pausieren' })).toBeVisible();
  expect(await audio.evaluate((a: HTMLAudioElement) => !a.controls && !a.paused && a.hidden)).toBe(true);
  await expect(page.getByRole('button', { name: 'Weiter', exact: true })).toBeDisabled();
  await page.screenshot({ path: 'work/c2-after-recording.png', fullPage: true });
  await page.getByRole('button', { name: 'Wiedergabe pausieren' }).click();
  await expect(page.getByRole('button', { name: 'Weiter', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Deine Aufnahme wiedergeben' }).click();
  await expect(page.getByRole('button', { name: 'Wiedergabe pausieren' })).toBeVisible();
  await page.getByRole('button', { name: 'Wiedergabe pausieren' }).click();
  await page.getByRole('button', { name: 'Neu aufnehmen', exact: true }).click();
  await expect(page.getByText(/^Aufnahme läuft/)).toBeVisible(); await expect(audio).toHaveCount(0);
  await page.getByRole('button', { name: 'Aufnahme beenden', exact: true }).click();
  await page.getByRole('button', { name: 'Wiedergabe pausieren' }).click();
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await expect(page.locator('.hanziHero')).toHaveText('我');
  await expect(page.locator('.referenceAudio .audioButton').first()).toBeEnabled();
});

test('compact tones retain comparison, feedback and comfortable named controls at phone widths', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Weiterlernen', exact: true }).waitFor();
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => { const request = indexedDB.open('language-learning-local'); request.onsuccess = () => resolve(request.result); });
    await new Promise<void>(resolve => { const transaction = db.transaction('sessions', 'readwrite'); transaction.objectStore('sessions').put({ id: 'c2-tones', plannerVersion: 'd1', plan: ['tones', 'closure'], index: 0, completed: false, startedAt: Date.now(), updatedAt: Date.now() + 100, script: 'hant' }); transaction.oncomplete = () => resolve(); }); db.close();
  });
  await page.reload(); await page.getByRole('button', { name: 'Weiterlernen', exact: true }).click();
  for(const n of [1,2,3,4]) await page.getByRole('button', {name:`Ton ${n}`,exact:true}).click();
  await page.getByRole('button', { name: 'Bedeutungen aufdecken', exact: true }).click();
  await expect(page.locator('.toneLanguage strong')).toHaveText(['mā', 'má', 'mǎ', 'mà']);
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const controls = page.locator('.audioButton, .toneChoice, .recordButton, .sessionPause');
    for (const control of await controls.all()) {
      await expect(control).toHaveAccessibleName(/\S/); const box = (await control.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44); expect(box.height).toBeGreaterThanOrEqual(44);
    }
    await page.screenshot({ path: `work/c2-after-tones-${width}.png`, fullPage: true });
  }
  const play = page.getByRole('button', { name: 'Anhören', exact: true });
  await page.keyboard.press('Tab'); await play.focus(); expect(await play.evaluate(e => getComputedStyle(e).outlineStyle)).toBe('solid');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Ton 2 wählen', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Ton 2 wählen', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.toneFeedback')).toContainText('Das passt.');
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Ton 2 wählen', exact: true })).toBeDisabled();
});


test('blocked autoplay leaves a usable manual replay control', async ({ page }) => {
  await captureFixture(page);
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play; let blocked = false;
    HTMLMediaElement.prototype.play = function () {
      if (this.src.startsWith('blob:') && !blocked) { blocked = true; return Promise.reject(new DOMException('Test autoplay policy', 'NotAllowedError')); }
      return play.call(this);
    };
  });
  await page.goto('/'); await page.getByRole('button', { name: 'Weiterlernen', exact: true }).click();
  await finishAttention(page);await page.getByRole('button', { name: 'Aufnehmen', exact: true }).click();
  await page.getByRole('button', { name: 'Aufnahme beenden', exact: true }).click();
  await expect(page.getByText('Automatisches Abspielen ist hier gesperrt. Tippe auf Wiedergabe.')).toBeVisible();
  await page.getByRole('button', { name: 'Deine Aufnahme wiedergeben' }).click();
  await expect(page.getByRole('button', { name: 'Wiedergabe pausieren' })).toBeVisible();
  await page.getByRole('button', { name: 'Wiedergabe pausieren' }).click();
  await expect(page.getByRole('button', { name: 'Neu aufnehmen', exact: true })).toBeEnabled();
});
