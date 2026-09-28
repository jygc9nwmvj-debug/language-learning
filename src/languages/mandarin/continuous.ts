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
  if(['task_completed','attempt','audio_replay','pinyin_reveal'].includes(e.type))seen.set(t.itemId,Math.max(seen.get(t.itemId)??0,e.at));
 }
 return seen;
}
export function composeContinuous(relations:Relation[],events:ResearchEvent[],script:'hant'|'hans',now:number){
 // Optional inspection/practice never changes due dates, exposure or recall eligibility.
 events=events.filter(e=>e.detail.optionalPractice!==true && !e.type.startsWith('inspection_') && !e.type.startsWith('optional_'));
 const seen=exposure(events),plan:string[]=[];const chosen=new Set<string>();
 const recent=events.filter(e=>e.type==='attempt').sort((a,b)=>b.at-a.at).slice(0,6);
 const weak=recent.filter(e=>e.detail.result!=='success'||e.detail.assisted===true).length>=2;
 const tonesIntroduced=events.some(e=>e.taskId==='tones'&&['task_completed','tone_notation_practice'].includes(e.type));
 const newLimit=weak?DOSING.newFragile:DOSING.newStable;
 // Review is chosen only from exposed objects; unsupported modalities never become due by accident.
 const candidates=content.items.filter(i=>seen.has(i.id)).map(item=>{
  const history=events.filter(e=>taskMap.get(e.taskId)?.itemId===item.id);
  const lastAttempt=history.filter(e=>e.type==='attempt').sort((a,b)=>b.at-a.at)[0];
  const options=content.tasks.filter(t=>t.itemId===item.id&&['read','listen','recall'].includes(t.kind)&&(!t.assess?.toneNotation||tonesIntroduced));
  const previous=lastAttempt?taskMap.get(lastAttempt.taskId)?.kind:undefined;
  const choice=options.find(t=>t.kind!==previous && t.kind===(previous==='listen'?'recall':previous==='recall'?'read':'listen'))??options.find(t=>t.kind!==previous)??options[0];
  if(!choice)return null;
  const objectRelations=relations.filter(r=>r.objectId===objectFor(choice,script)||r.objectId===`cmn:${item.id}`||r.objectId===`cmn:${item.id}:${script}`);
  const due=objectRelations.some(r=>r.dueAt<=now),fragile=lastAttempt&&(lastAttempt.detail.result!=='success'||lastAttempt.detail.assisted===true);
  const last=lastAttempt?.at??seen.get(item.id)!;
  return {item:item.id,id:choice.id,last,priority:due?0:fragile?1:2,valuable:due||!lastAttempt||now-last>=DOSING.consolidationMs};
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
