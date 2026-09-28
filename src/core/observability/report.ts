import { itemMap, taskMap } from '../../languages/mandarin/content/index.ts';
import type { ResearchEvent } from '../progress/db.ts';
import { assistanceEvents } from './evidence.ts';
type Row={eventId:string;sessionId:string;at:number;item:string;script:string;dimension:string;phase:string;provenance:string;result:string;assistance:string;outcome:string;introductionEventIds:string[];introductionAt:number|null;sinceIntroductionMs:number|null;previousEventId:string|null;sincePreviousRetrievalMs:number|null;delayMs:number|null;band:string};
const optional=(e:ResearchEvent)=>e.detail.optionalPractice===true||e.type.startsWith('inspection_')||e.type.startsWith('optional_');
export function learningReport(input:ResearchEvent[]) {
 const ids=new Set<string>();
 for(const e of input){if(!e.id||ids.has(e.id)||!Number.isFinite(e.at)||e.at<0||!e.detail||!e.type||!e.sessionId)throw new Error('Invalid or duplicate learning event');ids.add(e.id);}
 const events=[...input].sort((a,b)=>a.at-b.at||a.id.localeCompare(b.id));
 const introductions:{eventId:string;item:string;dimension:string;at:number;script:string}[]=[];
 const rows:Row[]=[];const previous=new Map<string,Row>();const visits=new Map<string,number>();const timeSources=new Map<string,string[]>();
 const assistance:Record<string,string[]>={},behaviors:Record<string,string[]>={};
 for(const e of events){const d=e.detail,task=taskMap.get(e.taskId);
  if(d.observabilityVersion===1&&typeof d.activeVisitId==='string'&&d.activeVisitId&&typeof d.activeTaskMs==='number'&&Number.isFinite(d.activeTaskMs)&&d.activeTaskMs>=0){const k=e.sessionId+':'+d.activeVisitId;visits.set(k,Math.max(visits.get(k)??0,d.activeTaskMs));timeSources.set(k,[...(timeSources.get(k)??[]),e.id]);}
  if(optional(e))continue;
  if(assistanceEvents.includes(e.type)){(assistance[e.type]??=[]).push(e.id);}
  if(['screenless_offered','screenless_revealed','screenless_recall','paper_offered','paper_revealed','paper_recall','paper_skipped','meaningful_stop_offered','session_stop_accepted','voluntary_continue_after_stop','recording_completed_uncertain'].includes(e.type))(behaviors[e.type]??=[]).push(e.id);
  const item=String(d.item??task?.itemId??'unknown'),canonical=itemMap.get(item);
  if(e.type==='introduction_dimensions'&&canonical&&d.introductionVersion===1&&d.toneNumbers===canonical.toneNumbers){
   for(const dimension of String(d.dimensions).split(',')){
    const visual=['hanzi','writing','segmentation'].includes(dimension);
    if(!['meaning','pronunciation','hanzi','writing','segmentation'].includes(dimension)||visual&&((d.script!=='hant'&&d.script!=='hans')||d.form!==canonical[d.script]))continue;
    introductions.push({eventId:e.id,item,dimension,at:e.at,script:visual?String(d.script):'any'});
   }
  }
  if(e.type==='tone_attention_confirmed'&&canonical&&d.attentionVersion===1&&d.toneNumbers===canonical.toneNumbers)introductions.push({eventId:e.id,item,dimension:'tone',at:e.at,script:'any'});
  if(e.type==='tone_notation_introduced')introductions.push({eventId:e.id,item:'all',dimension:'notation_convention',at:e.at,script:'any'});
  // Old explicitly completed guided writing is an existing C2.3 compatibility rule.
  if(e.type==='attempt'&&task?.kind==='writing'&&!task.recall&&canonical&&d.objectId===`cmn:${item}:${String(d.objectId).split(':').at(-1)}`){
   const sc=String(d.objectId).split(':').at(-1)!;
   if(['hant','hans'].includes(sc))introductions.push({eventId:e.id,item,dimension:'writing',at:e.at,script:sc});
  }
  if(!['attempt','screenless_recall','paper_recall'].includes(e.type))continue;
  let dimension='unknown',phase='retrieval',requirements:string[]=[],result=String(d.result??'unknown');
  let provenance=typeof d.evidence==='string'?d.evidence:d.selfReport===true?'self_report':'unknown';
  let assistanceClass=d.revealedBeforeAttempt===true?'revealed':d.assisted===true?'assisted':d.assisted===false?'unaided':'unknown';
  let script=typeof d.script==='string'?d.script:typeof d.objectId==='string'&&/:(hant|hans)$/.test(d.objectId)?d.objectId.split(':').at(-1)!:'unknown';
  let rowItem=item;
  if(e.type==='screenless_recall'){dimension='spoken_form_retrieval';requirements=['meaning','pronunciation'];provenance='self_report';}
  else if(e.type==='paper_recall'){dimension='paper_writing_group';rowItem=String(d.items??'unknown');provenance='self_report';phase='group_recall';}
  else if(task?.kind==='read'){dimension='hanzi_recognition';requirements=['meaning','hanzi'];}
  else if(task?.kind==='listen'){dimension='listening_comprehension';requirements=['meaning','pronunciation'];}
  else if(task?.kind==='recall'){dimension='written_phrase_retrieval';requirements=['meaning','pronunciation'];}
  else if(task?.kind==='writing'){
   dimension=d.writingRecall===true?'independent_writing':d.writingRecall===false?'guided_writing':'writing_mode_unknown';
   phase=d.writingRecall===false?'guided_production':d.writingRecall===true?'retrieval':'unknown';requirements=['writing'];
   if(d.selfReport===true||d.mode==='paper')provenance='self_report';
  }
  else if(task?.kind==='tone-recall'){dimension='tone_perception';requirements=['tone','pronunciation'];}
  else if(task?.kind==='tones'){dimension='tone_perception';rowItem=String(d.objectId??'unknown');phase='guided_practice';}
  else if(task?.kind==='sequence'){dimension='hanzi_sequence';rowItem=String(d.sequence??'unknown');phase='group_recall';}
  // Historical app-checked tasks are identified only where task + explicit result
  // genuinely support it. Guided/independent writing is never guessed from task ID.
  if(provenance==='unknown'&&task&&['read','listen','recall','tone-recall','tones','sequence'].includes(task.kind)&&['success','failure','unsure'].includes(result))provenance='app_checked';
  function add(dim:string,res:string,needs:string[]){
   const found=needs.map(need=>introductions.filter(i=>i.dimension===need&&(i.item===rowItem||i.item==='all')&&i.at<=e.at&&(i.script==='any'||i.script===script)).at(-1));
   const complete=needs.length>0&&found.every(Boolean);
   const introductionAt=complete?Math.max(...found.map(i=>i!.at)):null;
   const key=`${rowItem}|${['hanzi_recognition','independent_writing','guided_writing','writing_mode_unknown'].includes(dim)?script:'any'}|${dim}`;
   const prev=previous.get(key);const sincePreviousRetrievalMs=prev?e.at-prev.at:null;
   const intervals=[sincePreviousRetrievalMs,introductionAt===null?null:e.at-introductionAt].filter((n):n is number=>n!==null);
   const delayMs=intervals.length?Math.min(...intervals):null;
   const outcome=assistanceClass==='revealed'?'revealed':res==='failure'||res==='unsure'?'failed_or_unsure':res==='success'&&assistanceClass==='unaided'?'unaided_success':res==='success'&&assistanceClass==='assisted'?'assisted_success':'unknown';
   const row:Row={eventId:e.id,sessionId:e.sessionId,at:e.at,item:rowItem,script,dimension:dim,phase,provenance,result:res,assistance:assistanceClass,outcome,introductionEventIds:found.filter(Boolean).map(i=>i!.eventId),introductionAt,sinceIntroductionMs:introductionAt===null?null:e.at-introductionAt,previousEventId:prev?.eventId??null,sincePreviousRetrievalMs,delayMs,band:delayMs===null?'unknown':delayMs<20*3_600_000?'<20h':delayMs<48*3_600_000?'20–48h':'≥48h'};
   rows.push(row);if(phase==='retrieval')previous.set(key,row);
  }
  add(dimension,result,requirements);
  if(task?.kind==='recall'&&d.assessToneNotation===true){
   const toneResult=d.toneNotation==='correct'?'success':['omitted','different'].includes(String(d.toneNotation))?'failure':'unknown';
   add('tone_notation',toneResult,['tone','notation_convention']);
  }
 }
 const groups:Record<string,{total:number;counts:Record<string,number>;eventIds:string[]}>={};
 for(const row of rows){const key=`${row.dimension} | ${row.provenance} | ${row.phase} | ${row.band}`;const g=groups[key]??={total:0,counts:{},eventIds:[]};g.total++;g.counts[row.outcome]=(g.counts[row.outcome]??0)+1;g.eventIds.push(row.eventId);}
 return {version:1,events:events.length,sessions:new Set(events.map(e=>e.sessionId)).size,activeMs:[...visits.values()].reduce((a,b)=>a+b,0),timedVisits:visits.size,activeVisitEvidence:[...visits].map(([visit,activeMs])=>({visit,activeMs,eventIds:timeSources.get(visit)!})),introductions,rows,groups,assistance,behaviors};
}
export function reportMarkdown(r:ReturnType<typeof learningReport>){
 const lines=['# Learning evidence — F-light','',`Events: ${r.events} · Sessions represented: ${r.sessions}`,`Active foreground time (estimate): ${(r.activeMs/60_000).toFixed(1)} min across ${r.timedVisits} timed visits. Legacy activeMs is excluded.`, '',`Explicit introduction evidence: ${new Set(r.introductions.map(i=>`${i.item}|${i.dimension}|${i.script}`)).size} distinct item/dimension/script combinations from ${r.introductions.length} entries, ${new Set(r.introductions.map(i=>i.item)).size} items (including a global convention where present).`,'','## Retrieval / practice counts','', 'Bands are descriptive only; actual intervals and source event IDs are in the JSON. Guided/group practice is identified separately. Self-report never verifies pronunciation.','', '| Dimension / provenance / phase / elapsed band | Unaided success | Assisted success | Failed / unsure | Revealed | Unknown |','| --- | --- | --- | --- | --- | --- |'];
 for(const [key,g] of Object.entries(r.groups))lines.push(`| ${key.replaceAll(' | ',' / ')} | ${g.counts.unaided_success??0}/${g.total} | ${g.counts.assisted_success??0}/${g.total} | ${g.counts.failed_or_unsure??0}/${g.total} | ${g.counts.revealed??0}/${g.total} | ${g.counts.unknown??0}/${g.total} |`);
 if(!r.rows.length)lines.push('','No retrieval evidence available.');
 lines.push('','## Help / reveal events','','Raw events, not automatically assisted attempts; replay/exploration is not classified as help.');
 for(const [type,ids] of Object.entries(r.assistance))lines.push(`- ${type}: ${ids.length}`);
 lines.push('','## Hybrid / unscored activity','');for(const [type,ids] of Object.entries(r.behaviors))lines.push(`- ${type}: ${ids.length}`);
 lines.push('','Unknown historical fields stay unknown. Timing stops after 60 seconds without activity and excludes hidden/identified waiting states. Off-screen effort and optional previous-item inspection may be undercounted; abrupt termination can lose the latest timing checkpoint. No causal conclusions, modality ranking, efficiency score or scheduler recommendations.','');
 return lines.join('\n');
}
