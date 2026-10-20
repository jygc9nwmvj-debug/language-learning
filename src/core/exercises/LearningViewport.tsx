import {useLayoutEffect,useRef,type ReactNode} from 'react';

// Shared visible-viewport shell. Controls retain their React and native form ancestry.
// Exceptionally long content scrolls inside this region; the action never does.
export function LearningViewport({children,identity}:{children:ReactNode;identity:string}){
 const root=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{
  const node=root.current!;let frame=0,disposed=false;
  const resize=new ResizeObserver(()=>queue());
  function measure(){
   if(disposed)return;
   // A previous-item view shares the shell. Only its visible region owns the dock.
   if(!node.getClientRects().length){node.querySelector('[data-primary-dock]')?.removeAttribute('data-primary-dock');return;}
   const viewport=window.visualViewport,height=viewport?.height??innerHeight,offset=viewport?.offsetTop??0;
   const shell=node.closest<HTMLElement>('main')!;
   shell.style.setProperty('--learning-height',`${height}px`);shell.style.setProperty('--learning-top',`${offset}px`);
   shell.dataset.keyboard=String(height<innerHeight*.78);
   const prior=node.querySelector<HTMLElement>('[data-primary-dock]');
   const candidates=[...node.querySelectorAll<HTMLElement>('[data-primary-action],.responseActions,.practiceNext,.continueButton,button[type=submit]')].filter(e=>e.getClientRects().length&&!e.closest('[hidden]'));
   const chosen=candidates.find(e=>e.matches('.responseActions'))??candidates.find(e=>e.matches('.practiceNext'))??candidates.at(-1);
   if(prior!==chosen){prior?.removeAttribute('data-primary-dock');if(prior)resize.unobserve(prior);if(chosen){chosen.dataset.primaryDock='true';resize.observe(chosen);}}
   const actionHeight=chosen?.getBoundingClientRect().height??0;
   shell.style.setProperty('--learning-action-height',`${actionHeight?Math.ceil(actionHeight)+16:0}px`);
   node.dataset.contentOverflow=String(node.scrollHeight>node.clientHeight+1);
  }
  function queue(){cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);}
  measure();resize.observe(node);
  const observer=new MutationObserver(queue);observer.observe(node,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['open','hidden','data-phase','data-focus','data-task-complete']});
  window.addEventListener('resize',queue);window.visualViewport?.addEventListener('resize',queue);window.visualViewport?.addEventListener('scroll',queue);
  void document.fonts.ready.then(queue);
  return()=>{disposed=true;cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();window.removeEventListener('resize',queue);window.visualViewport?.removeEventListener('resize',queue);window.visualViewport?.removeEventListener('scroll',queue);node.querySelector('[data-primary-dock]')?.removeAttribute('data-primary-dock');};
 },[identity]);
 return <div className="viewportFlow" ref={root} tabIndex={-1} role="region" aria-label="Lernaufgabe">{children}</div>;
}
