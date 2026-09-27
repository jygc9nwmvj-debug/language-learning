import {test,expect} from '@playwright/test';
test('readiness does not wait for a timeslice; final chunks precede stream release', async({page})=>{
 await page.addInitScript(()=>{
  Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:async()=>{
   const ctx=new AudioContext();const dest=ctx.createMediaStreamDestination();
   (window as any).audioFixture={ctx,stream:dest.stream};return dest.stream;
  }}});
  class FixtureRecorder extends EventTarget {
   static isTypeSupported(){return true;}
   state='inactive';mimeType='audio/mpeg';onstart:any;onstop:any;ondataavailable:any;
   start(){this.state='recording';setTimeout(()=>this.onstart?.(),0);}
   async stop(){
    this.state='inactive';const buffer=await(await fetch('/audio/mandarin/polly-nihao.mp3')).arrayBuffer();
    const middle=Math.floor(buffer.byteLength/2);
    this.ondataavailable?.({data:new Blob([buffer.slice(0,middle)],{type:'audio/mpeg'})});
    this.ondataavailable?.({data:new Blob([])});
    await new Promise(r=>setTimeout(r,30));
    (window as any).liveAtFinal=(window as any).audioFixture.stream.getTracks().every((t:MediaStreamTrack)=>t.readyState==='live');
    this.ondataavailable?.({data:new Blob([buffer.slice(middle)],{type:'audio/mpeg'})});
    this.onstop?.();
   }
  }
  (window as any).MediaRecorder=FixtureRecorder;
 });
 await page.goto('/');await page.getByRole('button',{name:'Weiterlernen',exact:true}).click();
 await page.getByRole('button',{name:'Aufnehmen',exact:true}).click();
 await expect(page.getByText(/^Aufnahme läuft/)).toBeVisible();
 await page.getByRole('button',{name:'Aufnahme beenden',exact:true}).click();
 await expect(page.getByLabel('Deine Aufnahme',{exact:true})).toHaveAttribute('src',/^blob:/);
 expect(await page.evaluate(()=>(window as any).liveAtFinal)).toBe(true);
 expect(await page.evaluate(()=>(window as any).audioFixture.stream.getTracks().every((t:MediaStreamTrack)=>t.readyState==='ended'))).toBe(true);
 const same=await page.getByLabel('Deine Aufnahme',{exact:true}).evaluate(async(a:HTMLAudioElement)=>{
  const [a1,a2]=await Promise.all([fetch(a.src).then(r=>r.arrayBuffer()),fetch('/audio/mandarin/polly-nihao.mp3').then(r=>r.arrayBuffer())]);
  return a1.byteLength===a2.byteLength && new Uint8Array(a1).every((v,i)=>v===new Uint8Array(a2)[i]);
 });expect(same).toBe(true);
 await page.evaluate(async()=>await (window as any).audioFixture.ctx.close());
});
