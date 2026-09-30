import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function setup(page: Page, diagnostic = false, blockAutoplay = false) {
  const readFileContent = diagnostic ? await readFile('tools/recording-diagnostic/index.html','utf8') : '';
  await page.addInitScript((blockAutoplay) => {
    const originalPlay = HTMLMediaElement.prototype.play;
    let blocked = false;
    HTMLMediaElement.prototype.play = function() {
      if (blockAutoplay && !blocked && this.src.startsWith('blob:')) { blocked = true; return Promise.reject(new DOMException('Blocked', 'NotAllowedError')); }
      return originalPlay.call(this);
    };
    const w = window as any;
    w.mediaEvents = [];
    for (const type of ['play', 'playing', 'pause', 'ended', 'error']) document.addEventListener(type, event => {
      const a = event.target as HTMLAudioElement;
      if (a?.src?.startsWith('blob:')) w.mediaEvents.push({type, ended:a.ended, paused:a.paused, time:a.currentTime, duration:a.duration});
    }, true);
    // Exercise each engine's real encoder/container with a reproducible microphone substitute.
    Object.defineProperty(navigator, 'mediaDevices', {value:{getUserMedia:async () => {
      const ctx = new AudioContext(); await ctx.resume();
      const source = ctx.createOscillator(), gain = ctx.createGain(), dest = ctx.createMediaStreamDestination();
      source.frequency.value = 440; gain.gain.value = .1;
      source.connect(gain).connect(dest); source.start();
      w.fixture = {ctx, source, stream:dest.stream};
      return dest.stream;
    }}});
  }, blockAutoplay);
  if (diagnostic) {
    await page.route('**/recording-diagnostic', route => route.fulfill({contentType:'text/html',body:readFileContent}));
    await page.goto('/recording-diagnostic'); return;
  }
  await page.goto('/');
  await page.getByRole('button', {name:/^(Lernen starten|Weiterlernen)$/}).click();
  const intro=page.locator('.attentionIntroduction');
  await expect(intro).toBeVisible();
  await expect(intro).not.toHaveAttribute('data-focus','hear',{timeout:15000});
  while(await intro.getAttribute('data-focus')!=='connect'){
    const phase=await intro.getAttribute('data-focus');
    await page.getByRole('button',{name:/^(Schriftbild ansehen|Bedeutung dazunehmen)$/}).click();
    await expect(intro).not.toHaveAttribute('data-focus',phase!);
  }
}
async function record(page: Page, retake = false) {
  await page.getByRole('button', {name:retake?'Neu aufnehmen':'Aufnehmen · freiwillig',exact:true}).click();
  await expect(page.getByText(/^Aufnahme läuft/)).toBeVisible();
  await page.waitForTimeout(700); // fixture audio length, not a production completion timer
  await page.getByRole('button', {name:'Aufnahme beenden',exact:true}).click();
  await expect(page.locator('.ownRecording audio')).toHaveAttribute('src', /^blob:/);
}
async function complete(page: Page) {
  await expect(page.locator('.recordingPanel')).toHaveAttribute('data-state','complete');
  await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeEnabled();
}
test('real recorded blob: automatic end, replay end, manual pause and repeat unlock Continue', async ({page}, info) => {
  await setup(page); await record(page);
  await complete(page);
  for(const width of [320,390,1280]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`work/resolution/${info.project.name}-${width}-recording-result.png`,fullPage:true});}
  const source = await page.locator('.ownRecording audio').getAttribute('src');
  for (let i=0;i<2;i++) {
    await page.getByRole('button',{name:'Deine Aufnahme wiedergeben',exact:true}).click();
    await expect(page.locator('.recordingPanel')).toHaveAttribute('data-state','playback');
    await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeDisabled();
    await page.locator('.ownRecording audio').evaluate(a => { a.dispatchEvent(new Event('ended')); a.dispatchEvent(new Event('pause')); });
    await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeDisabled();
    await complete(page);
  }
  await page.getByRole('button',{name:'Deine Aufnahme wiedergeben',exact:true}).click();
  await page.getByRole('button',{name:'Wiedergabe pausieren',exact:true}).click();
  await complete(page);
  expect(await page.locator('.ownRecording audio').getAttribute('src')).toBe(source);
  await info.attach('media-events',{body:JSON.stringify(await page.evaluate(()=>(window as any).mediaEvents)),contentType:'application/json'});
  await page.getByRole('button',{name:'Weiter',exact:true}).click();
  await expect(page.locator('.ownRecording')).toHaveCount(0);
});
test('old playback events cannot release a new capture or affect an exited component', async ({page}) => {
  await setup(page); await record(page); await complete(page);
  await page.evaluate(() => { (window as any).oldAudio = document.querySelector('.ownRecording audio'); });
  await page.getByRole('button',{name:'Neu aufnehmen',exact:true}).click();
  await expect(page.getByText(/^Aufnahme läuft/)).toBeVisible();
  await page.evaluate(() => { for(const type of ['ended','pause','play','error']) (window as any).oldAudio.dispatchEvent(new Event(type)); });
  await expect(page.locator('.recordingPanel')).toHaveAttribute('data-state','recording');
  await expect(page.getByRole('button',{name:'Weiter',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Aufnahme beenden',exact:true}).click(); await complete(page);
  await page.getByRole('button',{name:'Deine Aufnahme wiedergeben',exact:true}).click();
  await page.evaluate(() => { (window as any).exitedAudio = document.querySelector('.ownRecording audio'); });
  await page.getByRole('button',{name:'Für jetzt aufhören',exact:true}).click();
  await expect(page.getByRole('button',{name:/^(Lernen starten|Weiterlernen)$/})).toBeVisible();
  expect(await page.evaluate(()=>(window as any).exitedAudio.paused)).toBe(true);
  await page.evaluate(() => { for(const type of ['ended','pause','play','error']) (window as any).exitedAudio.dispatchEvent(new Event(type)); });
  await page.getByRole('button',{name:/^(Lernen starten|Weiterlernen)$/}).click();
  await expect(page.locator('.recordingPanel')).toHaveAttribute('data-state','ready');
});

test('rejected automatic playback releases the lock and manual replay still completes', async ({page}) => {
  await setup(page, false, true); await record(page); await complete(page);
  await expect(page.getByText('Automatisches Abspielen ist hier gesperrt. Tippe auf Wiedergabe.')).toBeVisible();
  await page.getByRole('button',{name:'Deine Aufnahme wiedergeben',exact:true}).click();
  await expect(page.locator('.recordingPanel')).toHaveAttribute('data-state','playback');
  await complete(page);
});
test('local diagnostic measures known input and encoded blob, preserving native playback', async ({page},info) => {
  await setup(page, true);
  await page.getByRole('button',{name:'Record',exact:true}).click();
  await expect(page.locator('#status')).toHaveText('Recording — speak now');
  await page.waitForTimeout(1200);
  await page.getByRole('button',{name:'Stop',exact:true}).click();
  await expect(page.locator('#status')).toHaveText('Ready to replay');
  await page.getByRole('button',{name:'Replay',exact:true}).click();
  await expect.poll(()=>page.locator('#audio').evaluate((a:HTMLAudioElement)=>a.ended)).toBe(true);
  const result = JSON.parse(await page.locator('#report').innerText());
  for (const stage of ['input','blob']) {
    expect(result[stage].peakDbFS).toBeGreaterThan(-23);
    expect(result[stage].peakDbFS).toBeLessThan(-17);
    expect(result[stage].rmsDbFS).toBeGreaterThan(-27);
    expect(result[stage].rmsDbFS).toBeLessThan(-21);
    expect(result[stage].clippingSampleFraction).toBe(0);
  }
  expect(result.playback).toMatchObject({volume:1,muted:false,playbackRate:1,sameBlob:true});
  await info.attach('level-diagnostic',{body:JSON.stringify(result,null,2),contentType:'application/json'});
  console.log(info.project.name, 'level-diagnostic', JSON.stringify(result));
  await page.getByRole('button',{name:'Discard',exact:true}).click();
  await expect(page.locator('#audio')).not.toHaveAttribute('src');
});
