import editorial from '../../../../docs/curriculum/china-travel/editorial/editorial.json' with { type: 'json' };
import { taiwanAudioReady } from './audio.ts';
import { content, taskMap as foundationTasks } from '../content/index.ts';
import { introduced } from '../introduction.ts';
import { composeContinuous, DOSING } from '../continuous.ts';
import type { Task } from '../schema/content.ts';
import type { ResearchEvent } from '../../../core/progress/db.ts';
import type { Relation } from '../../../core/progress/model.ts';

// The approved editorial canon is the only source of Taiwan text. It is compiled
// into the local bundle; there is no runtime generation or remote content fetch.
export const taiwan = editorial;
export const words = new Map(taiwan.words.map(w => [w.id, w]));
export const objects = new Map(taiwan.objects.map(o => [o.id, o]));
export const utterances = new Map(taiwan.utterances.map(u => [u.id, u]));
export const dialogues = new Map(taiwan.dialogues.map(d => [d.id, d]));
export const exercises = new Map(taiwan.exercises.map(x => [x.id, x]));
export type Script = 'hant' | 'hans';
export type Activity = { id: string; kind: 'object' | 'dialogue' | 'exercise' | 'matching' | 'writing' | 'writing-recall' | 'listening-dialogue'; ref: string; stage: number; words: string[] };
const activities: Activity[] = [];
const registeredObjects = new Set<string>(), coveredSentences = new Set<string>();
function add(kind: Activity['kind'], ref: string, stage: number, ids: string[]) {
 activities.push({id:`tw:${kind}:${ref}`, kind, ref, stage, words:[...new Set(ids)]});
}
function introduce(o: typeof taiwan.objects[number]) {
 if (registeredObjects.has(o.id)) return;
 registeredObjects.add(o.id); add('object',o.id,o.stage,o.contextWords);
}
for (let stage=1;stage<=10;stage++) {
 for (const d of taiwan.dialogues.filter(d=>d.stage===stage)) {
  // Introduce objects at their first dialogue use, rather than inventing a lesson
  // completion gate. Missing bound/baseline words get focused attention in-place.
  for (const o of taiwan.objects.filter(o=>o.stage===stage&&o.contextDialogs.includes(d.id))) introduce(o);
  add('dialogue',d.id,stage,d.listeningPrerequisites);
  d.sentenceChecks.forEach(s=>coveredSentences.add(s.utterance));
 }
 taiwan.objects.filter(o=>o.stage===stage).forEach(introduce);
 for (const x of taiwan.exercises) {
  const u='utterance' in x && x.utterance ? utterances.get(x.utterance) : undefined;
  const o='object' in x && x.object ? objects.get(x.object) : undefined;
  const d='dialog' in x && x.dialog ? dialogues.get(x.dialog) : undefined;
  if ((u?.stage??o?.stage??d?.stage)!==stage) continue;
  if (x.type==='sentence_meaning' && u && coveredSentences.has(u.id)) continue;
  const ks=u?.words??o?.contextWords??('correct' in x ? x.correct?.flatMap(k=>utterances.get(k)?.words??[]) : [])??[];
  add('exercise',x.id,stage,ks);
 }
 for (const m of taiwan.matching.filter(m=>m.stage===stage&&(m.relation==='hanzi-meaning'||taiwanAudioReady))) add('matching',m.id,stage,m.pairs.map(p=>p.word));
 for (const w of taiwan.writing.filter(w=>w.stage===stage)) add('writing',w.id,stage,[w.word]);
}
// Stage-zero baseline expressions not otherwise used remain baseline references,
// not a second curriculum of duplicate greeting cards.
for (const x of taiwan.exercises.filter(x=>x.type==='sentence_meaning')) {
 const u=utterances.get(x.utterance!);
 if(u&&!coveredSentences.has(u.id)&&!activities.some(a=>a.ref===x.id))add('exercise',x.id,Math.max(1,u.stage),u.words);
}
export const taiwanActivities = activities;
export const activityMap = new Map(activities.map(a=>[a.id,a]));
export const taiwanTasks: Task[] = activities.map(a=>({id:a.id,kind:'encounter',tone:undefined,prompt:{de:'Reise nach Taiwan'}}));
// Explicit text activity routing. These descriptors never enter the audio-backed
// foundation item parser, audio generator, or ordinary encounter assessment.
export const appTaskMap = new Map<string,Task>([...foundationTasks,...taiwanTasks.map(t=>[t.id,t] as const)]);
export function completedActivities(events:ResearchEvent[],script:Script) {
 return new Set(events.filter(e=>e.type==='taiwan_completed'&&e.detail.script===script).map(e=>e.taskId));
}
export function composeLearning(relations:Relation[],events:ResearchEvent[],script:Script,now:number):string[] {
 const done=completedActivities(events,script),pending=activities.filter(a=>!done.has(a.id));
 const foundation=composeContinuous(relations,events,script,now).filter(id=>id!=='closure');
 // Preserve the existing foundation onboarding. Exposure, not mastery or
 // completed writing, opens the extension; existing learner history is reused.
 if(foundation.some(id=>foundationTasks.get(id)?.kind==='encounter'))return [...foundation,'closure'];
 // Keep genuine due foundation retrievals, but replace its least-recent fallback
 // with new communicative content. Batch size remains a storage boundary only.
 const due=foundation.filter(id=>{
  const t=foundationTasks.get(id); if(!t?.target)return false;
  return relations.some(r=>r.target===t.target&&[ `cmn:${t.itemId}`,`cmn:${t.itemId}:${script}`].includes(r.objectId)&&r.dueAt<=now);
 });
 const lastCompleted=new Map<string,number>();
 for(const e of events)if(e.type==='taiwan_completed'&&e.detail.script===script)lastCompleted.set(e.taskId,Math.max(lastCompleted.get(e.taskId)??0,e.at));
 const review=activities.filter(a=>done.has(a.id)&&['exercise','dialogue'].includes(a.kind)&&now-(lastCompleted.get(a.id)??now)>=24*3_600_000);
 review.sort((a,b)=>(lastCompleted.get(a.id)??0)-(lastCompleted.get(b.id)??0));
 const writingRecall=taiwan.writing.filter(w=>events.some(e=>e.type==='taiwan_completed'&&e.taskId===`tw:writing:${w.id}`&&e.detail.script===script&&now-e.at>=20*3_600_000))
  .map(w=>({id:`tw:writing-recall:${w.id}`,kind:'writing-recall' as const,ref:w.id,stage:w.stage,words:[w.word]}))
  .filter(a=>!events.some(e=>e.taskId===a.id&&e.type==='taiwan_completed'&&e.detail.script===script&&now-e.at<20*3_600_000));
 const hearing=activities.filter(a=>a.kind==='dialogue'&&done.has(a.id)&&!done.has(`tw:listening-dialogue:${a.ref}`)&&!events.some(e=>e.taskId===a.id&&e.type==='taiwan_completed'&&e.detail.script===script&&e.detail.listening===true)).map(a=>`tw:listening-dialogue:${a.ref}`);
 const sequence=[...due,...(taiwanAudioReady?hearing:[]),...review.map(a=>a.id),...writingRecall.map(a=>a.id),...pending.map(a=>a.id)];
 return [...(sequence.length?sequence:foundation).slice(0,DOSING.tasks),'closure'];
}
for (const w of taiwan.writing) {
 const a:Activity={id:`tw:writing-recall:${w.id}`,kind:'writing-recall',ref:w.id,stage:w.stage,words:[w.word]};
 activityMap.set(a.id,a);appTaskMap.set(a.id,{id:a.id,kind:'encounter',tone:undefined,prompt:{de:'Schreiben aus dem Gedächtnis'}});
}
for(const d of taiwan.dialogues){const a:Activity={id:`tw:listening-dialogue:${d.id}`,kind:'listening-dialogue',ref:d.id,stage:d.stage,words:d.listeningPrerequisites};activityMap.set(a.id,a);appTaskMap.set(a.id,{id:a.id,kind:'encounter',tone:undefined,prompt:{de:'Ein Gespräch verstehen'}});}
export function heardWords(events:ResearchEvent[],script:Script){
 const heard=new Set(events.filter(e=>e.type==='taiwan_word_audio_completed').map(e=>String(e.detail.word)));
 for(const i of content.items)if(i.words.length===1&&introduced(i,'pronunciation',script,events))heard.add(i.words[0]);
 return heard;
}
export function knownWords(events:ResearchEvent[],script:Script) {
 const known=new Set(events.filter(e=>e.type==='taiwan_word_introduced'&&e.detail.script===script).map(e=>String(e.detail.word)));
 for(const item of content.items)if(item.words.length===1&&introduced(item,'meaning',script,events)&&introduced(item,'hanzi',script,events))known.add(item.words[0]);
 return known;
}
export function checkTaiwanIntegration() {
 const fail=(message:string)=>{throw Error(`Taiwan content: ${message}`);};
 if(objects.size!==134||dialogues.size!==28||utterances.size!==176||exercises.size!==221)fail('editorial population changed');
 if(new Set(activities.map(a=>a.id)).size!==activities.length)fail('duplicate activity');
 for(const a of activityMap.values())for(const k of a.words)if(!words.has(k))fail(`unknown word ${a.id}/${k}`);
 for(const d of dialogues.values())for(const s of d.sentenceChecks)if(!exercises.has(s.exercise)||!utterances.has(s.utterance))fail(`sentence check ${d.id}`);
 for(const o of objects.values())if(!activities.some(a=>a.kind==='object'&&a.ref===o.id))fail(`unreachable object ${o.id}`);
 for(const x of exercises.values())if(!activities.some(a=>a.kind==='exercise'&&a.ref===x.id)&&!(x.type==='sentence_meaning'&&coveredSentences.has(x.utterance!)))fail(`unreachable exercise ${x.id}`);
 const route=taiwan.exercises.find(x=>x.type==='structured_route');
 if(!route||JSON.stringify(route.map)!==JSON.stringify({start:[2,1],facing:'north',straightPoint:[1,1],exit:[1,2],otherDestination:[1,0]}))fail('route renderer map binding');
 if(taiwan.matching.filter(m=>m.relation==='hanzi-meaning').length!==19)fail('text matching population');
 return {objects:objects.size,dialogues:dialogues.size,utterances:utterances.size,exercises:exercises.size,activities:activities.length,matching:taiwanAudioReady?38:19,deferredAudioMatching:taiwanAudioReady?0:19,writing:10};
}
checkTaiwanIntegration();
