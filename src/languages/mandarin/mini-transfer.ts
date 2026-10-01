import { db, logEvent, type Session, type ResearchEvent } from '../../core/progress/db.ts';
import { transferCases, transferCase, readyForTransfer, assessTransfer, type TransferAssessment } from './transfer-cases.ts';
import { transferKey, reconcileTransfer } from './transfer-persistence.ts';
export { transferKey } from './transfer-persistence.ts';
export const TRANSFER_SPACING=24*60*60*1000;
export const TRANSFER_MIN_TASKS=8;
export type TransferState={caseId:string;revision:number;sessionId:string;index:number;phase:'listen'|'answer'|'result'|'done';answer:string;heard:boolean;plays:number;firstSeenAt:number;assessment?:TransferAssessment;manualTest?:boolean;knownBefore?:boolean};
export function atTransfer(s:Session,t:TransferState|null){return !!t&&t.sessionId===s.id&&t.index===s.index&&t.phase!=='done'&&!!transferCase(t.caseId);}
export async function transferState():Promise<TransferState|null>{const row=await db.preferences.get(transferKey);return row?reconcileTransfer(JSON.parse(row.value),null,await db.events.toArray()):null;}
export function selectTransfer(s:Session,events:ResearchEvent[],now:number,legacySeen=false){
 if(s.plan[s.index]!=='closure'||s.completed)return null;
 const seen=events.filter(e=>e.type==='transfer_seen');
 if(seen.some(e=>now-e.at<TRANSFER_SPACING))return null;
 const since=Math.max(0,...seen.map(e=>e.at));
 if(events.filter(e=>e.type==='task_completed'&&e.taskId!=='closure'&&e.detail.optionalPractice!==true&&e.at>since).length<TRANSFER_MIN_TASKS)return null;
 const latestAssessment=new Map<string,ResearchEvent>();
 for(const e of events.filter(e=>e.type==='transfer_assessed'&&!e.detail.manualTest).sort((a,b)=>a.at-b.at))latestAssessment.set(String(e.detail.caseId),e);
 const unresolved=transferCases.find(c=>{const d=latestAssessment.get(c.id)?.detail;return !!d&&(d.assisted===true||(d.assisted===undefined&&typeof d.answer==='string'&&!d.answer.trim()))&&readyForTransfer(c,events);});
 return unresolved??transferCases.find(c=>!(legacySeen&&c.id==='name-repeat')&&!seen.some(e=>e.detail.caseId===c.id)&&readyForTransfer(c,events))??null;
}
export async function reserveTransfer(s:Session,now=Date.now(),manualTest=false):Promise<TransferState|null>{
 return db.transaction('rw',db.preferences,db.events,async()=>{
  const current=await transferState();
  if(current&&current.phase!=='done')return current;
  const events=await db.events.toArray();
  const legacy=!!(await db.preferences.get('local-mini-transfer-name-repair-v1'))||events.some(e=>e.type==='mini_transfer_started');
  const selected=manualTest&&s.plan[s.index]==='closure'?transferCases[0]:selectTransfer(s,events,now,legacy);
  if(!selected)return current;
  const value:TransferState={caseId:selected.id,revision:selected.revision,sessionId:s.id,index:s.index,phase:'listen',answer:'',heard:false,plays:0,firstSeenAt:now,manualTest};
  await db.preferences.put({key:transferKey,value:JSON.stringify(value)});
  await logEvent({sessionId:s.id,taskId:`transfer:${selected.id}`,type:'transfer_seen',detail:{caseId:selected.id,revision:selected.revision,index:s.index,firstSeenAt:now,manualTest}});
  return value;
 });
}
export async function saveTransfer(s:Session,patch:Partial<Pick<TransferState,'phase'|'answer'|'heard'|'plays'|'knownBefore'>>){
 return db.transaction('rw',db.preferences,db.events,async()=>{
  const current=await transferState();if(!atTransfer(s,current))throw new Error('Transfer no longer active');
  // A submitted answer is immutable. Draft checkpoints cannot undo a result.
  if(current!.phase==='result')return current!;
  const next={...current!,...patch};
  if(patch.phase==='result'){
   if(!current!.heard)throw new Error('Listen before responding');
   next.assessment=assessTransfer(transferCase(next.caseId)!,next.answer);
   await logEvent({sessionId:s.id,taskId:`transfer:${next.caseId}`,type:'transfer_assessed',detail:{caseId:next.caseId,revision:next.revision,firstSeenAt:next.firstSeenAt,outcome:next.assessment.outcome,cueCoverage:next.assessment.cueCoverage,index:next.index,answer:next.answer,assisted:!next.answer.trim(),recognized:next.assessment.recognized.join(','),missing:next.assessment.missing.join(','),uncertain:next.assessment.uncertain,evidence:'bounded_cues_v2',manualTest:!!next.manualTest,knownBefore:!!next.knownBefore,firstAppExposure:!next.manualTest&&!next.knownBefore}});
  }
  await db.preferences.put({key:transferKey,value:JSON.stringify(next)});return next;
 });
}
export async function finishTransfer(s:Session){
 return db.transaction('rw',db.preferences,db.events,async()=>{
  const current=await transferState();if(current?.phase==='done')return s;
  if(!atTransfer(s,current)||current?.phase!=='result')throw new Error('Transfer answer missing');
  await db.preferences.put({key:transferKey,value:JSON.stringify({...current,phase:'done'})});
  await logEvent({sessionId:s.id,taskId:`transfer:${current.caseId}`,type:'transfer_completed',detail:{caseId:current.caseId,revision:current.revision,index:s.index,firstSeenAt:current.firstSeenAt,manualTest:!!current.manualTest}});
  // Keep the original closure cursor and plan: the normal batch transition still follows.
  return s;
 });
}
