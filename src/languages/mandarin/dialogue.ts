import {z} from 'zod';
import {content,itemMap} from './content/index.ts';
import {introduced} from './introduction.ts';
import {normalizeText} from './answer.ts';
import {db,type ResearchEvent,type Session} from '../../core/progress/db.ts';

// Closed, authored interpretation checks; no semantic similarity or token-level translation claims.
const turnSchema=z.object({id:z.string(),speaker:z.string().min(1),itemId:z.string(),intent:z.literal('guided_listening_translation'),answers:z.array(z.string().min(1)).min(2)});
const definitionSchema=z.object({id:z.string(),revision:z.literal(1),title:z.string(),context:z.string(),turns:z.array(turnSchema).min(2),response:z.object({cueItem:z.string(),options:z.array(z.string()).min(3),accepted:z.array(z.string()).min(1),intent:z.literal('contextual_response_recognition')})}).superRefine((d,c)=>{
 const fail=(message:string)=>c.addIssue({code:'custom',message});
 if(new Set(d.turns.map(t=>t.id)).size!==d.turns.length)fail('Duplicate dialogue turn');
 for(const t of d.turns){if(!itemMap.has(t.itemId))fail('Unknown dialogue item');}
 if(!d.response.options.includes(d.response.cueItem)&&!itemMap.has(d.response.cueItem))fail('Unknown response cue');
 if(new Set(d.response.options).size!==d.response.options.length||d.response.options.some(id=>!itemMap.has(id))||d.response.accepted.some(id=>!d.response.options.includes(id)))fail('Invalid contextual choices');
});
export const dialogueDefinition=definitionSchema.parse({id:'wellbeing-dialogue-v1',revision:1,title:'Ein vertrautes Gespräch',context:'Zwei Bekannte erkundigen sich nacheinander, wie es ihnen geht.',turns:[
 {id:'question',speaker:'Person A',itemId:'how-are-you',intent:'guided_listening_translation',answers:itemMap.get('how-are-you')!.answers},
 {id:'reply',speaker:'Person B',itemId:'im-fine',intent:'guided_listening_translation',answers:itemMap.get('im-fine')!.answers},
 {id:'return-question',speaker:'Person B',itemId:'and-you',intent:'guided_listening_translation',answers:itemMap.get('and-you')!.answers},
 {id:'return-reply',speaker:'Person A',itemId:'im-fine',intent:'guided_listening_translation',answers:itemMap.get('im-fine')!.answers},
],response:{cueItem:'and-you',options:['im-fine','zaijian','dont-know'],accepted:['im-fine'],intent:'contextual_response_recognition'}});
export type DialogueDefinition=z.infer<typeof definitionSchema>;
export const dialogueDefinitions:readonly DialogueDefinition[]=[dialogueDefinition];
export type DialoguePhase='listen'|'turn'|'revisit'|'respond'|'complete';
export type DialogueState={runId:string;sessionId:string;index:number;plannedAt:number;phase:DialoguePhase;turn:number;results:{answer:string;correct:boolean}[];heard:boolean;draft:string;response?:{answer:string;correct:boolean};done:boolean};
export function dialogueEligible(events:ResearchEvent[],script:'hant'|'hans'){
 const history=events.filter(e=>e.detail.optionalPractice!==true&&!e.type.startsWith('inspection_')&&!e.type.startsWith('optional_'));
 return [...new Set([...dialogueDefinition.turns.map(t=>t.itemId),...dialogueDefinition.response.options])].every(id=>{const i=itemMap.get(id)!;return introduced(i,'meaning',script,history)&&introduced(i,'pronunciation',script,history);});
}
export const translationCorrect=(turn:number,answer:string)=>dialogueDefinition.turns[turn]?.answers.some(a=>normalizeText(a)===normalizeText(answer))??false;
export function dialogueState(events:ResearchEvent[],session?:Session):DialogueState|null{
 for(const start of events.filter(e=>e.type==='dialogue_started'&&e.detail.dialogueId===dialogueDefinition.id&&e.detail.revision===dialogueDefinition.revision&&(!session||e.sessionId===session.id&&e.detail.index===session.index)).sort((a,b)=>b.at-a.at)){
  const own=events.filter(e=>e.detail.runId===start.id),done=own.some(e=>e.type==='dialogue_completed');if(!session&&done)continue;
  const ordered=own.filter(e=>e.type==='dialogue_step').sort((a,b)=>Number(a.detail.sequence)-Number(b.detail.sequence));
  const phase=(ordered.at(-1)?.detail.phase as DialoguePhase)??'listen',turn=Number(ordered.at(-1)?.detail.turn??0);
  const results=dialogueDefinition.turns.flatMap((_,n)=>{const e=own.find(e=>e.type==='dialogue_answer'&&e.detail.turn===n);return e?[{answer:String(e.detail.answer),correct:e.detail.correct===true}]:[];});
  const draft=own.filter(e=>e.type==='dialogue_draft'&&e.detail.turn===turn).sort((a,b)=>b.at-a.at)[0];
  const response=own.find(e=>e.type==='dialogue_response');
  return {runId:start.id,sessionId:start.sessionId,index:Number(start.detail.index),plannedAt:start.at,phase,turn,results,heard:own.some(e=>e.type==='dialogue_heard'&&e.detail.phase===phase&&e.detail.turn===turn),draft:String(draft?.detail.answer??''),response:response?{answer:String(response.detail.answer),correct:response.detail.correct===true}:undefined,done};
 }
 return null;
}
export const atDialogue=(s:Session,d:DialogueState|null)=>!!d&&!d.done&&s.id===d.sessionId&&s.index===d.index&&s.plan[s.index]==='closure';
async function append(s:Session,runId:string,id:string,type:string,detail:ResearchEvent['detail'],at=Date.now()){
 await db.events.add({id,at,sessionId:s.id,taskId:`dialogue:${dialogueDefinition.id}`,type,contentVersion:content.version,detail:{...detail,index:s.index,runId,dialogueId:dialogueDefinition.id,revision:dialogueDefinition.revision,evidence:'guided_dialogue',masteryEffect:false}});
}
export async function reserveDialogue(s:Session,now=Date.now()){
 return db.transaction('rw',db.events,async()=>{const events=await db.events.toArray(),current=dialogueState(events,s);if(current)return current;
  if(s.completed||s.plan[s.index]!=='closure'||events.some(e=>e.type==='dialogue_started'&&e.detail.dialogueId===dialogueDefinition.id)||!dialogueEligible(events,s.script))return null;
  const id=crypto.randomUUID();await append(s,id,id,'dialogue_started',{},now);return dialogueState(await db.events.toArray(),s);
 });
}
export async function updateDialogue(s:Session,runId:string,action:'heard'|'draft'|'answer'|'next'|'response',answer='',expectedTurn?:number,expectedPhase?:DialoguePhase){
 return db.transaction('rw',db.events,async()=>{const events=await db.events.toArray(),d=dialogueState(events,s);if(!d||d.runId!==runId||d.done||expectedTurn!==undefined&&d.turn!==expectedTurn||expectedPhase!==undefined&&d.phase!==expectedPhase)return d;
  if(action==='draft'&&d.phase==='turn'&&!d.results[d.turn])await append(s,runId,crypto.randomUUID(),'dialogue_draft',{turn:d.turn,answer});
  if(action==='heard')await append(s,runId,crypto.randomUUID(),'dialogue_heard',{phase:d.phase,turn:d.turn});
  if(action==='answer'&&d.phase==='turn'&&d.heard&&!d.results[d.turn])await append(s,runId,`${runId}:answer:${d.turn}`,'dialogue_answer',{turn:d.turn,answer,correct:translationCorrect(d.turn,answer),assessmentIntent:dialogueDefinition.turns[d.turn].intent,assisted:true,spokenProduction:false});
  if(action==='response'&&d.phase==='respond'&&!d.response&&dialogueDefinition.response.options.includes(answer))await append(s,runId,`${runId}:response`,'dialogue_response',{answer,correct:dialogueDefinition.response.accepted.includes(answer),assessmentIntent:dialogueDefinition.response.intent,assisted:true,spokenProduction:false});
  if(action==='next'){
   let phase:DialoguePhase=d.phase,turn=d.turn;
   if(d.phase==='listen'&&d.heard){phase='turn';turn=0;}
   else if(d.phase==='turn'&&d.results[d.turn]){if(d.turn+1<dialogueDefinition.turns.length)turn++;else phase='revisit';}
   else if(d.phase==='revisit'&&d.heard)phase='respond';
   else if(d.phase==='respond'&&d.response)phase='complete';
   else if(d.phase==='complete'){await append(s,runId,`${runId}:complete`,'dialogue_completed',{});return dialogueState(await db.events.toArray(),s);}
   else return d;
   const sequence=events.filter(e=>e.detail.runId===runId&&e.type==='dialogue_step').length;
   await append(s,runId,`${runId}:step:${sequence}`,'dialogue_step',{phase,turn,sequence});
  }
  return dialogueState(await db.events.toArray(),s);
 });
}
