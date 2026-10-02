import { itemMap, taskMap } from './content/index.ts';
import { introduced } from './introduction.ts';
import { composeContinuous } from './continuous.ts';
import { db, type ResearchEvent, type Session } from '../../core/progress/db.ts';

export type MatchingRelation='form-meaning'|'audio-form';
const groups=[['people',['wo','ni','ren']],['greetings',['hao','qing','nihao']],['countries',['deguo','zhongguo']],['numbers-147',['yi','si','qi']],['numbers-258',['er','wu','ba']],['numbers-369',['san','liu','jiu']],['numbers-4810',['si','ba','shi-number']]] as const;
export const matchingSets=groups.flatMap(([group,items])=>(['form-meaning','audio-form'] as const).map(relation=>({id:`${group}:${relation}`,relation,items:[...items],revision:1})));
export type MatchingSet=typeof matchingSets[number];
export type MatchingState={runId:string;setId:string;sessionId:string;index:number;script:'hant'|'hans';plannedAt:number;left:string[];right:string[];matched:string[];heard:string[];attempts:number;hadError:boolean;done:boolean;last?:{left:string;right:string;correct:boolean};};
const regular=(events:ResearchEvent[])=>events.filter(e=>e.detail.optionalPractice!==true&&!e.type.startsWith('inspection_')&&!e.type.startsWith('optional_'));
export function matchingEligible(set:MatchingSet,script:'hant'|'hans',events:ResearchEvent[]){
 const history=regular(events);
 return set.items.every(id=>{const item=itemMap.get(id)!;return introduced(item,'meaning',script,history)&&introduced(item,'hanzi',script,history)&&(set.relation!=='audio-form'||!!item.audio&&introduced(item,'pronunciation',script,history));});
}
export function shuffled<T>(input:readonly T[],random= Math.random){const out=[...input];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
export function selectMatching(s:Session,events:ResearchEvent[],nextPlan:string[],random=Math.random){
 if(s.completed||s.plan[s.index]!=='closure')return null;
 // Existing boundary activities are never pushed behind a new matching set.
 if(events.some(e=>e.sessionId===s.id&&['transfer_seen','paper_offered'].includes(e.type)))return null;
 const history=regular(events);
 for(const id of nextPlan){const item=taskMap.get(id)?.itemId;if(!item)continue;
  const attempt=history.filter(e=>['attempt','screenless_recall'].includes(e.type)&&taskMap.get(e.taskId)?.itemId===item).sort((a,b)=>b.at-a.at)[0];
  if(attempt&&(attempt.detail.result!=='success'||attempt.detail.assisted===true))return null;
 }
 // Finite v1 practice: at most one previously unseen eligible variant at a boundary.
 // No permanent cadence, cap on learning objects, or ordinary planner slot.
 const eligible=matchingSets.filter(set=>!events.some(e=>e.type==='matching_started'&&e.detail.setId===set.id)&&matchingEligible(set,s.script,history));
 return eligible.length?eligible[Math.floor(random()*eligible.length)]:null;
}
export function matchingState(events:ResearchEvent[],s?:Session):MatchingState|null{
 const starts=events.filter(e=>e.type==='matching_started'&&(!s||e.sessionId===s.id&&e.detail.index===s.index)).sort((a,b)=>b.at-a.at||a.id.localeCompare(b.id));
 for(const start of starts){
  const set=matchingSets.find(x=>x.id===start.detail.setId);if(!set)continue;
  const left=String(start.detail.left).split(','),right=String(start.detail.right).split(',');
  if(start.detail.revision!==set.revision||[left,right].some(side=>side.length!==set.items.length||new Set(side).size!==set.items.length||side.some(id=>!set.items.includes(id as never))))continue;
  const own=events.filter(e=>e.detail.runId===start.id),done=own.some(e=>e.type==='matching_completed');
  if(!s&&done)continue;
  const pairs=own.filter(e=>e.type==='matching_pair').sort((a,b)=>Number(a.detail.sequence)-Number(b.detail.sequence));
  const last=pairs.at(-1);
  return {runId:start.id,setId:set.id,sessionId:start.sessionId,index:Number(start.detail.index),script:start.detail.script==='hans'?'hans':'hant',plannedAt:start.at,left,right,matched:pairs.filter(e=>e.detail.correct===true).map(e=>String(e.detail.left)),heard:own.filter(e=>e.type==='matching_audio').map(e=>String(e.detail.item)),attempts:pairs.length,hadError:pairs.some(e=>e.detail.correct===false),done,last:last?{left:String(last.detail.left),right:String(last.detail.right),correct:last.detail.correct===true}:undefined};
 }
 return null;
}
export const atMatching=(s:Session,m:MatchingState|null)=>!!m&&!m.done&&s.plan[s.index]==='closure'&&s.id===m.sessionId&&s.index===m.index;
async function append(s:Pick<MatchingState,'sessionId'|'index'|'setId'|'runId'>,id:string,type:string,detail:ResearchEvent['detail'],at=Date.now()){
 await db.events.add({id,at,sessionId:s.sessionId,taskId:`matching:${s.setId}`,type,contentVersion:'build-d-1',detail:{...detail,runId:s.runId,setId:s.setId,index:s.index,evidence:'recognition_practice'}});
}
export async function reserveMatching(s:Session,now=Date.now()){
 return db.transaction('rw',db.events,db.relations,async()=>{
  const events=await db.events.toArray(),current=matchingState(events,s);if(current)return current;
  const nextPlan=composeContinuous(await db.relations.toArray(),events,s.script,now),set=selectMatching(s,events,nextPlan);
  if(!set)return null;
  const id=crypto.randomUUID();
  await append({sessionId:s.id,index:s.index,setId:set.id,runId:id},id,'matching_started',{revision:set.revision,relation:set.relation,script:s.script,left:shuffled(set.items).join(','),right:shuffled(set.items).join(',')},now);
  return matchingState(await db.events.toArray(),s);
 });
}
export async function matchingAudio(s:Session,runId:string,item:string){
 return db.transaction('rw',db.events,async()=>{
  const state=matchingState(await db.events.toArray(),s);if(!state||state.runId!==runId||state.done||!state.left.includes(item))return state;
  await append(state,crypto.randomUUID(),'matching_audio',{item});return matchingState(await db.events.toArray(),s);
 });
}
export async function commitMatchingPair(s:Session,runId:string,sequence:number,left:string,right:string){
 return db.transaction('rw',db.events,async()=>{
  const state=matchingState(await db.events.toArray(),s);
  if(!state||state.runId!==runId||state.done||sequence!==state.attempts)return state;
  if(!state.left.includes(left)||!state.right.includes(right)||state.matched.includes(left)||state.matched.includes(right))return state;
  const set=matchingSets.find(x=>x.id===state.setId)!;
  if(set.relation==='audio-form'&&!state.heard.includes(left))return state;
  const correct=left===right,elimination=state.matched.length===set.items.length-1;
  await append(state,`${runId}:pair:${sequence}`,'matching_pair',{sequence,left,right,correct,assisted:state.hadError,elimination,independent:correct&&!state.hadError&&!elimination});
  return matchingState(await db.events.toArray(),s);
 });
}
export async function finishMatching(s:Session,runId:string){
 return db.transaction('rw',db.events,async()=>{
  const events=await db.events.toArray(),state=matchingState(events,s);if(!state||state.runId!==runId||state.done)return state;
  if(state.matched.length!==state.left.length)throw Error('Matching not complete');
  const pairs=events.filter(e=>e.type==='matching_pair'&&e.detail.runId===runId);
  await append(state,`${runId}:completed`,'matching_completed',{pairs:state.matched.length,attempts:state.attempts,assisted:state.hadError,independentPairs:pairs.filter(e=>e.detail.independent===true).length,masteryEffect:false});
  return matchingState(await db.events.toArray(),s);
 });
}
