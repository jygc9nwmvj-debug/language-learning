import {test,expect} from '@playwright/test';
test('ten Mandarin reference captures keep speech envelopes and play to completion',async({page},info)=>{
 test.setTimeout(180000);
 await page.addInitScript(()=>{
  Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:async()=>{
   const ctx=new AudioContext();await ctx.resume();const dest=ctx.createMediaStreamDestination();
   const silence=ctx.createOscillator(),gain=ctx.createGain();gain.gain.value=0;silence.connect(gain).connect(dest);silence.start();
   (window as any).speechInput={ctx,dest};return dest.stream;
  }}});
 });
 await page.goto('/');await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
 const rows=[];
 for(const [file,repeats] of [['wo',1],['ni',1],['hao',1],['xiexie',1],['wojiao',1],['nijiaoshenmemingzi',3],['nihao',1],['zaijian',1],['nijiaoshenmemingzi',4],['wo',1]] as const){
  await page.getByRole('button',{name:'Aufnehmen',exact:true}).click();await expect(page.getByText(/^Aufnahme läuft/)).toBeVisible();
  await page.evaluate(async({file,repeats})=>{
   const {ctx,dest}=(window as any).speechInput;const data=await ctx.decodeAudioData(await(await fetch(file==='zaijian'?'/audio/mandarin/zaijian.wav':`/audio/mandarin/polly-${file==='nijiaoshenmemingzi'?'askname':file}.mp3`)).arrayBuffer());
   const buffer=ctx.createBuffer(1,data.length*repeats,ctx.sampleRate);for(let n=0;n<repeats;n++)buffer.copyToChannel(data.getChannelData(0),0,n*data.length);
   (window as any).originalSpeech=Array.from(buffer.getChannelData(0));
   const source=ctx.createBufferSource();source.buffer=buffer;source.connect(dest);source.start();await new Promise(r=>source.onended=r);
  },{file,repeats});
  await page.getByRole('button',{name:'Aufnahme beenden',exact:true}).click();await expect(page.getByRole('button',{name:'Aufnehmen',exact:true})).toBeEnabled();
  const row=await page.getByLabel('Deine Aufnahme',{exact:true}).evaluate(async(audio:HTMLAudioElement)=>{
   const {ctx}=(window as any).speechInput;const decoded=await ctx.decodeAudioData(await(await fetch(audio.src)).arrayBuffer());
   const envelope=(x:ArrayLike<number>)=>{const step=Math.round(ctx.sampleRate*.02),values=[];for(let i=0;i+step<x.length;i+=step){let sum=0;for(let j=i;j<i+step;j++)sum+=x[j]*x[j];values.push(Math.sqrt(sum/step));}const start=values.findIndex(x=>x>.01),end=values.findLastIndex(x=>x>.01);return values.slice(start,end+1);};
   const a=envelope((window as any).originalSpeech),b=envelope(decoded.getChannelData(0));
   // Compare the energy envelope of the controlled source, not pronunciation or tone correctness.
   const count=Math.min(a.length,b.length),peak=Math.max(...a),error=a.slice(0,count).reduce((s,v,i)=>s+Math.abs(v-b[i]),0)/count/peak;
   await audio.play();await new Promise<void>((r,j)=>{audio.onended=()=>r();audio.onerror=()=>j(new Error('Playback'));});await ctx.close();
   return {sourceSeconds:a.length*.02,recordedSeconds:b.length*.02,meanEnvelopeError:error};
  });
  expect(Math.abs(row.sourceSeconds-row.recordedSeconds)).toBeLessThan(.10);expect(row.meanEnvelopeError).toBeLessThan(.15);rows.push({file,repeats,...row});
 }
 await info.attach('mandarin-capture-envelopes.json',{body:JSON.stringify(rows,null,2),contentType:'application/json'});
});
