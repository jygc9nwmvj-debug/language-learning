import {test,expect} from '@playwright/test';
import content from '../../src/languages/mandarin/content/lesson-001.json' with {type:'json'};
test('audio harness plays all tone references and separate item variants at rate one',async({page})=>{
 test.setTimeout(90000);
 await page.addInitScript(()=>{
  const play=HTMLMediaElement.prototype.play;(window as any).audioPlays=[];
  HTMLMediaElement.prototype.play=function(){
   const row={src:this.src,rate:this.playbackRate,ended:false,error:false};(window as any).audioPlays.push(row);
   this.addEventListener('ended',()=>row.ended=true,{once:true});this.addEventListener('error',()=>row.error=true,{once:true});return play.call(this);
  };
 });
 await page.goto('/__test/a1#audio');
 for(let tone=1;tone<=4;tone++){
  await page.getByRole('button',{name:`Referenz Ton ${tone}`,exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>(window as any).audioPlays.at(-1)?.ended)).toBe(true);
 }
 for(const item of content.items){
  await page.getByLabel('Audio-Paar').selectOption(item.id);
  for(const label of ['Natural','Careful slow']){
   await page.getByRole('button',{name:label,exact:true}).click();
   await expect.poll(()=>page.evaluate(()=>(window as any).audioPlays.at(-1)?.ended)).toBe(true);
  }
 }
 const plays=await page.evaluate(()=>(window as any).audioPlays);expect(plays).toHaveLength(20);
 for(const row of plays){expect(row.rate).toBe(1);expect(row.error).toBe(false);}
 await page.getByRole('button',{name:'Audio-Test zurücksetzen',exact:true}).click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
