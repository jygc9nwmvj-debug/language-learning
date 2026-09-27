import { test, expect } from '@playwright/test';
import { observe } from './writing-helpers';
import { readFileSync } from 'node:fs';
const hao = JSON.parse(readFileSync('src/languages/mandarin/data/hao.json', 'utf8'));

test('10 consecutive real MediaRecorder captures preserve the beginning, middle, end and replay', async ({ page }, info) => {
  test.setTimeout(180000);
  await page.addInitScript(() => {
    (window as any).captures = [];
    const devices = { getUserMedia: async () => {
      const ctx = new AudioContext(); await ctx.resume();
      const dest = ctx.createMediaStreamDestination(), gain = ctx.createGain(), osc = ctx.createOscillator();
      gain.gain.value = 0; osc.connect(gain).connect(dest); osc.start();
      (window as any).signal = { ctx, gain, osc, stream: dest.stream };
      (window as any).captures.push(dest.stream);
      return dest.stream;
    } };
    Object.defineProperty(navigator, 'mediaDevices', { value: devices, configurable: true });
  });
  await page.goto('/'); await page.getByRole('button', { name: 'Weiterlernen', exact: true }).click();
  const results = [];
  for (const duration of [.12, .25, .8, 3, 6, .12, .45, 1.2, 3, 6]) {
    await page.getByRole('button', { name: 'Aufnehmen', exact: true }).click();
    await expect(page.getByText(/^Aufnahme läuft/)).toBeVisible();
    await page.evaluate(seconds => {
      const { ctx, gain, osc } = (window as any).signal; const now = ctx.currentTime;
      osc.frequency.setValueAtTime(440,now); osc.frequency.setValueAtTime(660,now+seconds/3); osc.frequency.setValueAtTime(880,now+seconds*2/3);
      gain.gain.setValueAtTime(.2,now); gain.gain.setValueAtTime(0,now+seconds);
    }, duration);
    await page.waitForTimeout(duration * 1000);
    await page.getByRole('button', { name: 'Aufnahme beenden', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Aufnehmen', exact: true })).toBeEnabled();
    await expect(page.getByText(/kaum hörbares Signal/)).toHaveCount(0);
    const result = await page.locator('audio').evaluate(async (audio: HTMLAudioElement) => {
      const ctx = new AudioContext();
      const data = await ctx.decodeAudioData(await (await fetch(audio.src)).arrayBuffer());
      const x = data.getChannelData(0), step = Math.round(data.sampleRate * .02);
      const windows = [];
      for (let i = 0; i + step < x.length; i += step) {
        let sum = 0, crosses = 0;
        for (let j=i; j<i+step; j++) { sum += x[j]*x[j]; if (j>i && x[j-1]<0 && x[j]>=0) crosses++; }
        windows.push({ rms: Math.sqrt(sum/step), hz: crosses/.02 });
      }
      const first = windows.findIndex(w => w.rms > .04), last = windows.findLastIndex(w => w.rms > .04);
      const active = windows.slice(first+1,last);
      const result = { duration: data.duration, signalDuration: (last-first+1)*.02, minimumRms: Math.min(...active.map(w=>w.rms)), startHz: active[0].hz, endHz: active.at(-1)!.hz, bytes: (await (await fetch(audio.src)).blob()).size };
      await ctx.close();
      await audio.play(); await new Promise<void>((resolve,reject)=> { audio.onended=()=>resolve(); audio.onerror=()=>reject(new Error('Playback failed')); });
      const { ctx: inputCtx, osc, stream } = (window as any).signal;
      if (!stream.getTracks().every((t: MediaStreamTrack)=>t.readyState==='ended')) throw new Error('Input leaked');
      osc.stop(); await inputCtx.close(); return result;
    });
    expect(result.signalDuration).toBeGreaterThan(duration-.08); expect(result.signalDuration).toBeLessThan(duration+.1);
    expect(result.minimumRms).toBeGreaterThan(.04); expect(result.startHz).toBeGreaterThan(350); expect(result.startHz).toBeLessThan(530);
    expect(result.endHz).toBeGreaterThan(780); expect(result.endHz).toBeLessThan(980);
    results.push(result);
  }
  await info.attach('capture-continuity.json', { body: JSON.stringify(results,null,2), contentType:'application/json' });
});

test('first writing reference visibly toggles in place and retest preserves history', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name:'Weiterlernen',exact:true }).click();
  for (let n=0;n<5;n++) await page.getByRole('button',{name:'Überspringen',exact:true}).click();
  await expect(page.locator('.hanziWriter svg')).toBeVisible();
  await observe(page);
  await page.screenshot({path:'test-results/writing-before.png',fullPage:true});
  const before = await page.locator('.hanziWriter').screenshot();
  await page.getByRole('button',{name:'Vorlage zeigen',exact:true}).click();
  await expect(page.getByRole('button',{name:'Vorlage ausblenden',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.waitForTimeout(500);
  await page.screenshot({path:'test-results/writing-reference.png',fullPage:true});
  expect(Buffer.compare(before,await page.locator('.hanziWriter').screenshot())).not.toBe(0);
  await page.getByRole('button',{name:'Vorlage ausblenden',exact:true}).click();
  await expect(page.getByRole('button',{name:'Vorlage zeigen',exact:true})).toHaveAttribute('aria-pressed','false');
  await page.getByRole('button',{name:'Für jetzt aufhören',exact:true}).click();
  await page.getByText('Einstellungen & Sicherung',{exact:true}).click();
  await page.getByRole('button',{name:'Lesson 1 vollständig erneut testen',exact:true}).click();
  await expect(page.locator('.hanziHero')).toHaveText('你好');
  const counts = await page.evaluate(async()=>{
    const db=await new Promise<IDBDatabase>(r=>{const q=indexedDB.open('language-learning-local');q.onsuccess=()=>r(q.result)});
    return await new Promise<number>(r=>{const q=db.transaction('sessions').objectStore('sessions').count();q.onsuccess=()=>{r(q.result);db.close()}});
  }); expect(counts).toBe(2);
});

for (const variant of ['good','imprecise','wrong'] as const) test(`Hanzi Writer evaluation without outline: ${variant}`, async ({ page }, info) => {
  await page.goto('/');
  await page.addScriptTag({ path:'node_modules/hanzi-writer/dist/hanzi-writer.js' });
  await page.evaluate(data=>{
    document.body.innerHTML='<div id="writing-probe"></div>';
    (window as any).strokeResults={correct:0,mistakes:0,complete:false};
    const writer=(window as any).HanziWriter.create('writing-probe','好',{width:280,height:280,padding:15,showCharacter:false,showOutline:false,charDataLoader:()=>data});
    writer.quiz({showHintAfterMisses:100,highlightOnComplete:false,onCorrectStroke:()=>{(window as any).strokeResults.correct++},onMistake:()=>{(window as any).strokeResults.mistakes++},onComplete:()=>{(window as any).strokeResults.complete=true}});
  },hao);
  await expect(page.locator('#writing-probe svg')).toBeVisible(); await page.waitForTimeout(200);
  const box=(await page.locator('#writing-probe').boundingBox())!;
  // Hanzi Writer data coordinates: 1024 square, baseline -124; padding 15.
  for (let n=0;n<hao.medians.length;n++) {
    const path=variant==='wrong' ? [[100,900],[850,900]] : hao.medians[n];
    const points=path.map(([x,y]:number[],i:number)=>({x:box.x+15+x*250/1024+(variant==='imprecise'?(i%2?9:-9):0),y:box.y+15+(900-y)*250/1024+(variant==='imprecise'?(i%3?6:-6):0)}));
    await page.mouse.move(points[0].x,points[0].y); await page.mouse.down();
    for (const p of points.slice(1)) await page.mouse.move(p.x,p.y,{steps:3});
    await page.mouse.up(); await page.waitForTimeout(350);
  }
  const result=await page.evaluate(()=>(window as any).strokeResults);
  await info.attach('hanzi-writer-result.json',{body:JSON.stringify({variant,...result}),contentType:'application/json'});
  if (variant==='wrong') { expect(result.complete).toBe(false);expect(result.correct).toBe(0);expect(result.mistakes).toBe(6); }
  else { expect(result.complete).toBe(true);expect(result.correct).toBe(6); }
});

test('microphone interruption is visible and reference playback is locked during capture', async ({ page }) => {
  await page.addInitScript(() => {
    const devices = { getUserMedia: async () => {
      const ctx = new AudioContext(); await ctx.resume(); const dest = ctx.createMediaStreamDestination(), osc = ctx.createOscillator();
      osc.connect(dest); osc.start(); (window as any).source = {ctx,osc,stream:dest.stream}; return dest.stream;
    } };
    Object.defineProperty(navigator, 'mediaDevices', { value: devices, configurable: true });
  });
  await page.goto('/'); await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
  await page.getByRole('button',{name:'Aufnehmen',exact:true}).click();
  await expect(page.getByRole('button',{name:'Anhören',exact:true})).toBeDisabled();
  await expect(page.getByText(/^Aufnahme läuft/)).toBeVisible();
  // Allow audible test content before interruption; an immediate interruption may have no decodable frames.
  await page.waitForTimeout(300);
  await page.evaluate(()=>(window as any).source.stream.getAudioTracks()[0].dispatchEvent(new Event('mute')));
  await expect(page.getByText(/Das Mikrofon wurde unterbrochen/)).toBeVisible();
  await expect(page.getByRole('button',{name:'Anhören',exact:true})).toBeEnabled();
  await expect(page.getByLabel('Deine Aufnahme',{exact:true})).toHaveAttribute('src',/^blob:/);
  await page.evaluate(async()=>{ const {ctx,osc,stream}=(window as any).source; if(!stream.getTracks().every((t:MediaStreamTrack)=>t.readyState==='ended'))throw new Error('Leaked microphone');osc.stop();await ctx.close();});
});

test('leaving while microphone permission is pending releases the late stream', async ({ page }) => {
  await page.addInitScript(() => {
    const devices = { getUserMedia: async () => {
      const ctx = new AudioContext(); const dest = ctx.createMediaStreamDestination();
      (window as any).lateCapture={ctx,stream:dest.stream};
      return new Promise<MediaStream>(resolve=>{(window as any).grantLate=()=>resolve(dest.stream)});
    } };
    Object.defineProperty(navigator, 'mediaDevices', { value: devices, configurable: true });
  });
  await page.goto('/'); await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
  await page.getByRole('button',{name:'Aufnehmen',exact:true}).click();
  await expect(page.getByRole('button',{name:'Mikrofon wird angefragt …',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Für jetzt aufhören',exact:true}).click();
  await page.evaluate(()=>(window as any).grantLate());
  await expect.poll(()=>page.evaluate(()=>(window as any).lateCapture.stream.getTracks().every((t:MediaStreamTrack)=>t.readyState==='ended'))).toBe(true);
  await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
  await expect(page.getByRole('button',{name:'Anhören',exact:true})).toBeEnabled();
  await expect(page.locator('audio')).toHaveCount(0);
  await page.evaluate(async()=>await (window as any).lateCapture.ctx.close());
});


test('silence and a click are warned about without discarding the local replay', async ({ page }) => {
  await page.addInitScript(() => {
    const devices = { getUserMedia: async () => {
      const ctx = new AudioContext(); await ctx.resume(); const dest = ctx.createMediaStreamDestination(), gain = ctx.createGain(), osc = ctx.createOscillator();
      gain.gain.value=0; osc.connect(gain).connect(dest); osc.start(); (window as any).quietSource={ctx,gain,osc}; return dest.stream;
    } }; Object.defineProperty(navigator,'mediaDevices',{value:devices,configurable:true});
  });
  await page.goto('/'); await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
  for (const click of [false,true]) {
    await page.getByRole('button',{name:'Aufnehmen',exact:true}).click();
    await expect(page.getByText(/^Aufnahme läuft/)).toBeVisible();
    if (click) await page.evaluate(()=>{ const {ctx,gain}=(window as any).quietSource;gain.gain.setValueAtTime(.3,ctx.currentTime);gain.gain.setValueAtTime(0,ctx.currentTime+.005); });
    await page.getByRole('button',{name:'Aufnahme beenden',exact:true}).click();
    await expect(page.getByText(/kaum hörbares Signal/)).toBeVisible();
    await expect(page.getByLabel('Deine Aufnahme',{exact:true})).toHaveAttribute('src',/^blob:/);
    await page.evaluate(async()=>{const {ctx,osc}=(window as any).quietSource;osc.stop();await ctx.close();});
  }
});
