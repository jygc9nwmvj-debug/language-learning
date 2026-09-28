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
  await page.getByRole('button',{name:'Schriftbild ansehen',exact:true}).click(); await page.screenshot({path:'work/ui1-introduction.png',fullPage:true,animations:'disabled'}); await page.getByRole('button',{name:'Bedeutung dazunehmen',exact:true}).click(); await expect(page.locator('.pronunciationMeaning')).toBeVisible();
  await finishAttention(page);await page.getByRole('button', { name: 'Aufnehmen', exact: true }).click();
  await expect(page.getByText(/^Aufnahme läuft/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Weiter', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Aufnahme beenden', exact: true }).click();
  const audio = page.locator('.ownRecording audio');
  await expect(page.getByRole('button', { name: 'Wiedergabe pausieren' })).toBeVisible();
  expect(await audio.evaluate((a: HTMLAudioElement) => !a.controls && !a.paused && a.hidden)).toBe(true);
  await expect(page.getByRole('button', { name: 'Weiter', exact: true })).toBeDisabled();
  await page.screenshot({ path: 'work/ui1-recording.png', fullPage: true, animations: 'disabled' });
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
  await expect(page.locator('.focusedSyllables')).toContainText('wǒ');
  await expect(page.locator('.referenceAudio .audioButton').first()).toBeEnabled();
});

test('compact tones retain comparison, feedback and comfortable named controls at phone widths', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Weiterlernen', exact: true }).waitFor();
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => { const request = indexedDB.open('language-learning-local'); request.onsuccess = () => resolve(request.result); });
    await new Promise<void>(resolve => { const transaction = db.transaction('sessions', 'readwrite'); transaction.objectStore('sessions').put({ id: 'c2-tones', plannerVersion: 'd1', plan: ['tones', 'closure'], index: 0, completed: false, startedAt: Date.now(), updatedAt: Date.now() + 100, script: 'hant' }); transaction.oncomplete = () => resolve(); }); db.close();
  });
  await page.reload(); await page.getByRole('button', { name: 'Weiterlernen', exact: true }).click();
  for(const n of [1,2,3,4]) { await page.getByRole('button', {name:`Ton ${n}`,exact:true}).click(); await expect(page.locator('.toneLab > .controlLabel')).toContainText(n === 4 ? 'Alle vier' : `${n}/4`); }
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
    await page.screenshot({ path: `work/ui1-tones-${width}.png`, fullPage: true, animations: 'disabled' });
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



test('open language surface, resolved answer and writing tools remain accessible', async ({page}, info) => {
 await page.setViewportSize({width:390,height:844});
 await page.goto('/'); await page.getByRole('button',{name:'Weiterlernen',exact:true}).waitFor();
 await page.screenshot({path:`work/ui1-${info.project.name}-start.png`,fullPage:true,animations:'disabled'});
 async function seed(tasks:string[]) {
  await page.evaluate(async tasks=>{
   const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result);});
   await new Promise<void>(r=>{const t=db.transaction(['sessions','events'],'readwrite');t.objectStore('sessions').clear();t.objectStore('sessions').put({id:'ui',plannerVersion:'d1',plan:[...tasks,'closure'],index:0,completed:false,startedAt:Date.now(),updatedAt:Date.now()+100,script:'hant'});
   for(const [item,form,toneNumbers] of [['nihao','你好','ni3 hao3'],['hao','好','hao3']])t.objectStore('events').put({id:'ui-'+item,at:1,sessionId:'prior',taskId:'fixture',type:'introduction_dimensions',detail:{item,form,toneNumbers,script:'hant',dimensions:'meaning,pronunciation,hanzi,writing',introductionVersion:1}});t.oncomplete=()=>r();});db.close();
  },tasks);await page.reload();await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
 }
 await seed(['recall-nihao']);
 await page.getByRole('textbox',{name:'Deine Antwort',exact:true}).fill('ni3 hao3');
 await page.screenshot({path:`work/ui1-${info.project.name}-recall.png`,fullPage:true,animations:'disabled'});
 await page.getByRole('button',{name:'Prüfen',exact:true}).click();
 await expect(page.locator('.answerSummary')).toContainText('ni3 hao3');
 await expect(page.getByRole('textbox',{name:'Deine Antwort',exact:true})).toHaveCount(0);
 await expect(page.locator('.feedback')).toBeVisible();
 await page.screenshot({path:`work/ui1-${info.project.name}-feedback.png`,fullPage:true,animations:'disabled'});
 await seed(['write-recall']);
 const template=page.getByRole('button',{name:'Vorlage zeigen',exact:true});await template.click();
 await expect(page.getByRole('button',{name:'Vorlage ausblenden',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Neu ansetzen',exact:true}).click();
 await page.screenshot({path:`work/ui1-${info.project.name}-writing.png`,fullPage:true,animations:'disabled'});
 await seed(['d-meet-speak-slowly']);
 await page.getByRole('button',{name:'一點 erkunden',exact:true}).click();
 await expect(page.getByRole('region',{name:'Worterklärung'})).toContainText('ein bisschen');
 for(const width of [320,390,1024]) {
  await page.setViewportSize({width,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const button of await page.locator('button:visible').all()) {
   await expect(button).toHaveAccessibleName(/\S/);const b=(await button.boundingBox())!;
   expect(b.width).toBeGreaterThanOrEqual(44);expect(b.height).toBeGreaterThanOrEqual(44);
  }
  await page.screenshot({path:`work/ui1-${info.project.name}-phrase-${width}.png`,fullPage:true,animations:'disabled'});
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 expect(await page.locator('.unitExplanation').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');
 const close=page.getByRole('button',{name:'Schließen',exact:true});await close.focus();await page.keyboard.press('Enter');
 await expect(page.getByRole('region',{name:'Worterklärung'})).toHaveCount(0);
});
