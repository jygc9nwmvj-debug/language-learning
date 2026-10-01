import {content,taskMap} from './content/index.ts';
import {objectFor} from './session.ts';
import type {Relation} from '../../core/progress/model.ts';
import type {ResearchEvent,Session} from '../../core/progress/db.ts';
// Tunable prototype rules, not calibrated optimal spacing or a mastery score.
export const DOSING={tasks:7,newStable:3,newFragile:1,consolidationMs:20*60_000,resumeMs:4*3_600_000};
const encounters=content.tasks.filter(t=>t.kind==='encounter');
export function exposure(events:ResearchEvent[]){
 const seen=new Map<string,number>();
 for(const e of events){const t=taskMap.get(e.taskId);if(!t?.itemId)continue;
  if(['task_completed','attempt','screenless_recall','audio_replay','pinyin_reveal'].includes(e.type)||(e.type==='introduction_dimensions' && String(e.detail.dimensions).split(',').includes('meaning')))seen.set(t.itemId,Math.max(seen.get(t.itemId)??0,e.at));
 }
 return seen;
}
// Planning preference, not a deadline or a new assessment/interval rule.
export const FIRST_RETRIEVAL_WINDOW=7;
const regularEvents=(events:ResearchEvent[])=>events.filter(e=>e.detail.optionalPractice!==true&&!e.type.startsWith('inspection_')&&!e.type.startsWith('optional_'));
const regularEnd=(e:ResearchEvent)=>['task_completed','skip'].includes(e.type)&&!!taskMap.get(e.taskId)&&taskMap.get(e.taskId)!.kind!=='closure';
export function firstRetrievalAges(events:ResearchEvent[]){
 events=regularEvents(events);
 const ends=events.filter(regularEnd),ages=new Map<string,number>();
 for(const item of content.items){
  const history=events.filter(e=>taskMap.get(e.taskId)?.itemId===item.id);
  const successful=history.some(e=>{
   const t=taskMap.get(e.taskId)!;
   return ['attempt','screenless_recall'].includes(e.type)&&!!t.target&&!(t.kind==='writing'&&!t.recall)&&e.detail.result==='success'&&e.detail.assisted===false;
  });
  if(successful)continue;
  const intro=history.filter(e=>(e.type==='task_completed'&&taskMap.get(e.taskId)?.kind==='encounter')||(e.type==='introduction_dimensions'&&String(e.detail.dimensions).split(',').includes('meaning'))).sort((a,b)=>a.at-b.at)[0];
  if(!intro)continue;
  // The introducing encounter itself is not one of the seven subsequent tasks.
  const ownEnd=ends.filter(e=>e.sessionId===intro.sessionId&&e.taskId===intro.taskId&&e.at>=intro.at).sort((a,b)=>a.at-b.at)[0];
  ages.set(item.id,ends.filter(e=>e.at>intro.at&&e!==ownEnd).length);
 }
 return ages;
}
type ReviewCandidate={item:string;id:string;last:number;priority:number;valuable:boolean;fragile:boolean;guided:boolean};
function prioritizeFirstRetrieval(plan:string[],candidates:ReviewCandidate[],events:ResearchEvent[]){
 const ages=firstRetrievalAges(events),queue=[...plan],result:string[]=[];
 if(!ages.size)return plan;
 // Failed/helped objects stay with the existing repair selection, not extra slots.
 const waiting=candidates.filter(c=>ages.has(c.item)&&(!c.fragile||c.guided)).sort((a,b)=>ages.get(b.item)!-ages.get(a.item)!||a.last-b.last);
 const urgent=candidates.filter(c=>c.valuable&&c.fragile&&queue.includes(c.id));
 const recent=events.filter(regularEnd).sort((a,b)=>a.at-b.at).slice(-2).map(e=>taskMap.get(e.taskId)?.itemId);
 const selected=new Set<string>();
 const spaced=(item:string)=>!recent.slice(-2).includes(item);
 // Rank the shared review/encounter pool. Inserting a review shifts the remaining
 // encounters together, preserving their prerequisite order before truncation.
 while(result.length<DOSING.tasks){
  const repair=urgent.find(c=>!selected.has(c.item)&&spaced(c.item));
  const first=waiting.find(c=>{
   if(selected.has(c.item)||!spaced(c.item))return false;
   const position=queue.indexOf(c.id);
   const distance=position<0?Math.min(queue.length,DOSING.tasks-result.length):position+1;
   return ages.get(c.item)!+result.length+distance>=FIRST_RETRIEVAL_WINDOW;
  });
  const ordinary=queue.find(id=>{
   const item=taskMap.get(id)?.itemId;
   return !item||!ages.has(item)||spaced(item);
  });
  const id=repair?.id??first?.id??ordinary;
  if(!id)break;
  const item=taskMap.get(id)?.itemId;
  result.push(id);recent.push(item);
  if(item)selected.add(item);
  const index=queue.indexOf(id);if(index>=0)queue.splice(index,1);
 }
 return result;
}
export function composeContinuous(relations:Relation[],events:ResearchEvent[],script:'hant'|'hans',now:number){
 // Optional inspection/practice never changes due dates, exposure or recall eligibility.
 events=regularEvents(events);
 const seen=exposure(events),plan:string[]=[];const chosen=new Set<string>();
 const recent=events.filter(e=>['attempt','screenless_recall'].includes(e.type)).sort((a,b)=>b.at-a.at).slice(0,6);
 const weak=recent.filter(e=>e.detail.result!=='success'||e.detail.assisted===true).length>=2;
 const tonesIntroduced=events.some(e=>e.taskId==='tones'&&['task_completed','tone_notation_practice'].includes(e.type));
 const newLimit=weak?DOSING.newFragile:DOSING.newStable;
 // Review is chosen only from exposed objects; unsupported modalities never become due by accident.
 const candidates=content.items.filter(i=>seen.has(i.id)).map(item=>{
  const history=events.filter(e=>taskMap.get(e.taskId)?.itemId===item.id);
  const lastAttempt=history.filter(e=>['attempt','screenless_recall'].includes(e.type)).sort((a,b)=>b.at-a.at)[0];
  const options=content.tasks.filter(t=>t.itemId===item.id&&['read','listen','recall'].includes(t.kind)&&(!t.assess?.toneNotation||tonesIntroduced));
  const previous=lastAttempt?taskMap.get(lastAttempt.taskId)?.kind:undefined;
  const choice=options.find(t=>t.kind!==previous && t.kind===(previous==='listen'?'recall':previous==='recall'?'read':'listen'))??options.find(t=>t.kind!==previous)??options[0];
  if(!choice)return null;
  const objectRelations=relations.filter(r=>r.objectId===objectFor(choice,script)||r.objectId===`cmn:${item.id}`||r.objectId===`cmn:${item.id}:${script}`);
  const due=objectRelations.some(r=>r.dueAt<=now),fragile=!!lastAttempt&&(lastAttempt.detail.result!=='success'||lastAttempt.detail.assisted===true);
  const last=lastAttempt?.at??seen.get(item.id)!;
  return {item:item.id,id:choice.id,last,fragile,guided:previous==='writing'&&!taskMap.get(lastAttempt!.taskId)?.recall,priority:due?0:fragile?1:2,valuable:due||!lastAttempt||now-last>=DOSING.consolidationMs};
 }).filter(x=>x!==null).sort((a,b)=>a.priority-b.priority||a.last-b.last);
 const reviews=candidates.filter(c=>c.valuable).slice(0,weak?4:3);
 for(const c of reviews){plan.push(c.id);chosen.add(c.item);}
 const available=new Set(seen.keys()),fresh:typeof encounters=[];
 for(const t of encounters){if(fresh.length>=newLimit)break;if(available.has(t.itemId!))continue;
  if(!(content.items.find(i=>i.id===t.itemId)!.learning?.prerequisites.every(id=>available.has(id))??true))continue;
  fresh.push(t);available.add(t.itemId!);
 }
 // Interleave rather than replaying a whole module; prerequisites occur earlier in the stream; no retrieval is added for unseen objects.
 for(const [n,t] of fresh.entries()){plan.splice(Math.min(n*2+1,plan.length),0,t.id);chosen.add(t.itemId!);}
 const ranked=prioritizeFirstRetrieval(plan,candidates,events);plan.splice(0,plan.length,...ranked);
 chosen.clear();for(const id of plan){const item=taskMap.get(id)?.itemId;if(item)chosen.add(item);}
 // The first tone introduction precedes assessed old Pinyin retrievals.
 if(!tonesIntroduced){
  for(let n=plan.length-1;n>=0;n--)if(taskMap.get(plan[n])?.assess?.toneNotation)plan.splice(n,1);
  if(seen.has('nihao')&&!events.some(e=>e.taskId==='tones'&&e.type==='skip'))plan.push('tones');
 }
 // One writing slot; only after exposure, and blank recall only after actual guided completion.
 const writing=content.tasks.filter(t=>t.kind==='writing'&&!t.recall&&seen.has(t.itemId!)).find(t=>!events.some(e=>e.taskId===t.id&&e.type==='attempt'));
 if(writing && plan.length<DOSING.tasks && !chosen.has(writing.itemId!))plan.push(writing.id);
 else {
  const recall=content.tasks.find(t=>t.kind==='writing'&&t.recall&&seen.has(t.itemId!)&&events.some(e=>e.type==='attempt'&&taskMap.get(e.taskId)?.kind==='writing'&&taskMap.get(e.taskId)?.itemId===t.itemId&&now-e.at>=20*3_600_000)&&!events.some(e=>e.taskId===t.id&&now-e.at<20*3_600_000));
  if(recall&&plan.length<DOSING.tasks&&!chosen.has(recall.itemId!))plan.push(recall.id);
 }
 const sequence=content.tasks.find(t=>t.kind==='sequence'&&t.sequence!.every(id=>seen.has(id))&&!events.some(e=>e.taskId===t.id&&e.type==='attempt'));
 if(sequence&&plan.length<DOSING.tasks)plan.push(sequence.id);
 // No daily lockout. If the pool is exposed and nothing is due, choose the least recently practised.
 if(!plan.length && candidates.length)plan.push(...candidates.slice(0,3).map(c=>c.id));
 return [...plan.slice(0,DOSING.tasks),'closure'];
}
export function shouldResume(session:Session|null,now:number){return !!session&&session.plannerVersion==='d1'&&!session.completed&&session.plan[session.index]!=='closure'&&now-session.updatedAt<DOSING.resumeMs;}
