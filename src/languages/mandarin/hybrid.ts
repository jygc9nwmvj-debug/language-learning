import { content, itemMap, taskMap } from './content/index.ts';
import { introduced } from './introduction.ts';
import type { ResearchEvent, Session } from '../../core/progress/db.ts';
// Conservative pilot hypotheses, not optimal learning intervals.
export const HYBRID = { cooldownMs: 20 * 3_600_000, recallDelayMs: 20 * 60_000, paperTargets: 3, minCompleted: 5 };
export const screenlessItems = ['dont-understand', 'say-again', 'speak-slowly', 'askname', 'xiexie'];
const real = (events: ResearchEvent[]) => events.filter(e => !e.detail.optionalPractice && !e.type.startsWith('inspection_') && !e.type.startsWith('optional_'));
const occurrence = (e: ResearchEvent, session: Session) => e.sessionId === session.id && e.taskId === session.plan[session.index] && e.detail.index === session.index;
export function screenlessFor(session: Session, history: ResearchEvent[], now: number): boolean {
 const events=real(history), task=taskMap.get(session.plan[session.index]);
 if(!task?.itemId || task.kind!=='recall' || !screenlessItems.includes(task.itemId))return false;
 if(events.some(e=>occurrence(e,session)&&e.type==='screenless_recall'))return false;
 if(events.some(e=>occurrence(e,session)&&e.type==='screenless_offered'))return true;
 if(session.index<2 || events.some(e=>e.type==='screenless_offered' && (e.sessionId===session.id || now-e.at<HYBRID.cooldownMs)))return false;
 const item=itemMap.get(task.itemId)!;
 const earlier=events.filter(e=>e.sessionId!==session.id && now-e.at>=HYBRID.recallDelayMs);
 return introduced(item,'meaning',session.script,earlier)&&introduced(item,'pronunciation',session.script,earlier);
}
export function paperFor(session: Session, history: ResearchEvent[], now: number): string[] {
 const events=real(history);
 if(session.plan[session.index]!=='closure' || events.some(e=>e.sessionId===session.id && ['paper_recall','paper_skipped'].includes(e.type)))return [];
 const offered=events.find(e=>e.sessionId===session.id && e.type==='paper_offered');
 if(offered)return String(offered.detail.items).split(',').filter(id=>itemMap.has(id));
 if(events.some(e=>['paper_offered','paper_recall','paper_skipped'].includes(e.type)&&now-e.at<HYBRID.cooldownMs))return [];
 if(events.filter(e=>e.sessionId===session.id&&e.type==='task_completed').length<3)return [];
 const earlier=events.filter(e=>e.sessionId!==session.id && now-e.at>=HYBRID.cooldownMs);
 const items=content.items.filter(i=>i.introduction.role==='writing' && introduced(i,'writing',session.script,earlier) && introduced(i,'meaning',session.script,earlier)
   && !events.some(e=>now-e.at<HYBRID.recallDelayMs && taskMap.get(e.taskId)?.itemId===i.id && ['attempt','introduction_dimensions'].includes(e.type)))
   .slice(0,HYBRID.paperTargets).map(i=>i.id);
 return items.length===HYBRID.paperTargets?items:[];
}
// Historical Build E hypothesis, retained for interpreting/testing the pilot rules.
// Production no longer calls this heuristic or emits proactive stop events.
export function meaningfulStop(session: Session, history: ResearchEvent[]): boolean {
 const events=real(history), current=events.filter(e=>e.sessionId===session.id);
 if(session.plan[session.index]!=='closure' || current.some(e=>['session_stop_accepted','voluntary_continue_after_stop'].includes(e.type)))return false;
 const completed=new Set(current.filter(e=>e.type==='task_completed').map(e=>e.taskId));
 const attempts=current.filter(e=>['attempt','screenless_recall'].includes(e.type)).sort((a,b)=>a.at-b.at);
 const successes=attempts.filter(e=>e.detail.result==='success' && e.detail.assisted===false);
 const newItems=new Set(current.filter(e=>e.type==='introduction_dimensions').map(e=>e.detail.item));
 const unresolved=new Map<string,boolean>();
 for(const e of attempts)unresolved.set(String(e.detail.objectId??e.taskId),e.detail.result!=='success'||e.detail.assisted===true);
 if(current.some(e=>e.type==='paper_recall'&&e.detail.result!=='success'))return false;
 return completed.size>=HYBRID.minCompleted && successes.length>=2 && (newItems.size>=1 || successes.length>=4) && ![...unresolved.values()].some(Boolean);
}
export function screenlessEvidence(choice: 'known'|'unsure'|'revealed') {
 return { result: choice==='known'?'success' as const:'unsure' as const, assisted:choice!=='known', evidence:'self_report', pronunciation:'unknown', revealedBeforeAttempt:choice==='revealed' };
}
