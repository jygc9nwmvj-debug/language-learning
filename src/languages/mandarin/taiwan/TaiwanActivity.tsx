import { useRef, useState } from 'react';
import { taiwan, words, objects, utterances, dialogues, exercises, knownWords, type Activity, type Script } from './course';
import { numberedToPinyin } from '../pinyin';
import { Resolution } from '../../../core/exercises/Resolution';
import { WritingExercise, type WritingResult } from '../components/WritingExercise';
import type { Checkpoint, ResearchEvent, SavedEvaluation, SavedFeedback, FeedbackEvent } from '../../../core/progress/db';

import { restoreTextState, type TextState } from './state';
const pinyin=(k:string)=>numberedToPinyin(words.get(k)!.tones.join(' ').replace(/ (?=[aeo])/g,"'")).replaceAll(' ','');
const normalize=(v:string)=>v.normalize('NFD').replace(/[\u0300-\u036f1-5\s，。？！、,.?!'’]/g,'').toLowerCase();
const hash=(s:string)=>[...s].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,17);
const shuffled=(values:string[],key:string)=>[...values].sort((a,b)=>hash(key+a)-hash(key+b));
export function TaiwanActivity({activity:a,script,history,saved,onSave,onNext,disabled}:{activity:Activity;script:Script;history:ResearchEvent[];saved?:SavedEvaluation;onSave:Checkpoint;onNext:()=>Promise<void>;disabled:boolean}) {
 const [state,setState]=useState<TextState>(()=>{
  const value=saved?.results.taiwan?.value;
  const restored=restoreTextState(value);
  if(restored&&restored.pendingWords.every(k=>words.has(k))&&restored.sentenceChecks.every(k=>utterances.has(k)))return restored;
  const known=knownWords(history,script);
  const already=new Set(history.filter(e=>e.type==='taiwan_sentence_checked'&&e.detail.script===script&&e.detail.result==='success'&&Date.now()-e.at<20*3_600_000).map(e=>String(e.detail.utterance)));
  const sentenceChecks=a.kind==='dialogue'?[...new Set(dialogues.get(a.ref)!.sentenceChecks.map(s=>s.utterance))].filter(k=>!already.has(k)):[];
  return {pendingWords:a.words.filter(k=>!known.has(k)),sentenceChecks,wordIndex:0,phase:'work',position:0,input:'',selected:[],matched:[],left:'',notice:'',revealed:false,feedback:false,result:'unsure'};
 });
 const [saving,setSaving]=useState(false),[pinyinVisible,setPinyinVisible]=useState(false),[meaningVisible,setMeaningVisible]=useState(false);
 const lock=useRef(false);const blocked=disabled||saving;
 const currentWord=state.pendingWords[state.wordIndex];
 async function save(patch:Partial<TextState>,events:FeedbackEvent[]=[]){
  if(lock.current)return;lock.current=true;setSaving(true);
  const next={...state,...patch};
  try {await onSave('taiwan',{value:JSON.stringify(next),message:next.notice,kind:next.result==='failure'?'error':'attention'},events);setState(next);}
  finally{lock.current=false;setSaving(false);}
 }
 async function finish(){
  if(lock.current)return;
  await save({phase:'done'},[{type:'taiwan_completed',detail:{activity:a.id,script,kind:a.kind,evidence:'text_only',listening:false}}]);
  // Completion is durable before advancing; a reload can safely resume the saved card.
  await onNext();
 }
 function attempt(result:TextState['result'],target:'reading'|'production'|'writing',key:string,assisted=true):FeedbackEvent{
  const x=exercises.get(key);
  const object=target==='writing'?taiwan.writing.find(w=>w.id===a.ref)?.object:x&&'object'in x?x.object:undefined;
  // Sentence/variant work is event evidence, not a new mastery object. Only an
  // authored object production or writing target updates its skill relation.
  return {type:'taiwan_attempt',detail:{objectId:object?`cmn:tw:${object}${target==='writing'?':'+script:''}`:'',target,result,assisted,script,step:key,evidence:target==='writing'?'writing':target==='production'?'written_mandarin':'text_comprehension',listening:false}};
 }
 function form(k:string){const w=words.get(k)!;return w[script];}
 function sentence(k:string,meaning=false){const u=utterances.get(k)!;return <div className="twSentence"><p lang="zh" className="twHanzi">{u[script]}</p>{pinyinVisible&&<p>{u.pinyinLexical}</p>}{meaning&&<p>{u.de}</p>}</div>;}
 const support=<button type="button" className="textButton" disabled={blocked} onClick={()=>{setPinyinVisible(v=>!v);if(a.kind==='exercise'&&!pinyinVisible)void save({revealed:true});}}>{pinyinVisible?'Pinyin ausblenden':'Pinyin anzeigen'}</button>;
 const continuation=<button type="button" disabled={blocked} onClick={()=>void onNext()}>Weiter</button>;
 if(state.phase==='done')return <div className="twActivity"><p role="status">Für dieses Anliegen hast du den Text bearbeitet.</p>{continuation}</div>;
 if(currentWord){const w=words.get(currentWord)!;return <div className="twActivity" data-taiwan-mode="introduction"><p className="muted">Reise nach Taiwan · Textfassung</p><p>Ein benötigter Ausdruck</p><p className="twFocus" lang="zh">{w[script]}</p><p>{w.de}</p>{support}{pinyinVisible&&<p>{pinyin(currentWord)}</p>}{'note' in w&&w.note&&<p>{w.note}</p>}<button type="button" disabled={blocked} onClick={()=>void save({wordIndex:state.wordIndex+1},[{type:'taiwan_word_introduced',detail:{word:currentWord,script,form:w[script],meaning:true,hanzi:true,pronunciation:false}}])}>Weiter</button></div>;}
 if(a.kind==='object'){
  const o=objects.get(a.ref)!;const examples='examples' in o&&o.examples?o.examples:'example' in o&&o.example?[o.example]:[];
  return <div className="twActivity" data-taiwan-mode="object"><p className="muted">Reise nach Taiwan · Textfassung</p><h2>{o.title}</h2><p>{o.learningText}</p>{support}{examples.map(k=><div key={k}>{sentence(k,true)}<details><summary>Teile dieses Ausdrucks</summary><dl>{utterances.get(k)!.exploration.map((p,i)=><div key={i}><dt lang="zh">{p[script]}</dt><dd>{p.gloss}</dd></div>)}</dl></details></div>)}<button type="button" disabled={blocked} onClick={()=>void finish()}>Weiter</button></div>;
 }
 if(a.kind==='writing'||a.kind==='writing-recall'){
  const w=taiwan.writing.find(w=>w.id===a.ref)!;
  async function written(r:WritingResult){const feedback:SavedFeedback={value:'',message:'Schreibversuch gespeichert.',kind:r.result==='success'?'success':'attention',help:r.assisted,result:r.result,ink:r.ink,inkSize:r.inkSize,stage:r.stage,mode:r.mode,selfReport:r.selfReport};await save({writing:feedback},[attempt(r.result,'writing',`writing:${r.stage}`,r.assisted||r.selfReport)]);}
  return <div className="twActivity" data-taiwan-mode="writing"><h2>{w.meaning}</h2><WritingExercise itemId={w.word} meaning={w.meaning} pinyin={pinyin(w.word)} recall={a.kind==='writing-recall'} restored={state.writing} disabled={blocked} onComplete={written} onNext={finish} onEvent={()=>{}}/></div>;
 }
 if(a.kind==='matching'){
  const m=taiwan.matching.find(m=>m.id===a.ref)!;const selected=m.pairs.find(p=>p.word===state.left);
  return <div className="twActivity" data-taiwan-mode="matching"><h2>Schrift und Bedeutung verbinden</h2><p>Wähle links einen Ausdruck und rechts seine Bedeutung.</p><div className="twMatching"><div>{m.pairs.map(p=><button key={p.word} lang="zh" type="button" className={state.left===p.word?'selected':''} disabled={blocked||state.matched.includes(p.word)} onClick={()=>void save({left:p.word,notice:''})}>{form(p.word)}</button>)}</div><div>{shuffled(m.pairs.map(p=>p.word),a.id).map(k=>{const p=m.pairs.find(p=>p.word===k)!;return <button key={k} type="button" disabled={blocked||!selected||state.matched.includes(k)} onClick={()=>void save(selected?.word===k?{matched:[...state.matched,k],left:'',notice:'Das passt.'}:{notice:'Diese Bedeutung passt noch nicht. Versuche eine andere Verbindung.'})}>{p.de}</button>;})}</div></div><p role="status">{state.notice}</p>{state.matched.length===m.pairs.length&&<button type="button" disabled={blocked} onClick={()=>void finish()}>Weiter</button>}</div>;
 }
 if(a.kind==='dialogue'){
  const d=dialogues.get(a.ref)!;
  const checks=state.sentenceChecks;
  if(state.phase==='work')return <div className="twActivity" data-taiwan-mode="dialogue"><h2>{d.title}</h2><p>{d.context}</p><p className="muted">Lies das Gespräch. Die Fragen danach prüfen Textverständnis.</p>{support}<button type="button" className="textButton" disabled={blocked} onClick={()=>setMeaningVisible(v=>!v)}>{meaningVisible?'Bedeutungen ausblenden':'Bedeutungen anzeigen'}</button><div className="twDialogue">{d.turns.map((t,i)=><article key={i} className={`twTurn twTurn${t.speaker}`}><p className="twRole">{d.roles[t.speaker as keyof typeof d.roles]}</p>{t.utterances.map(k=><div key={k}>{sentence(k,meaningVisible)}</div>)}</article>)}</div><button type="button" disabled={blocked} onClick={()=>void save({phase:checks.length?'questions':'recap',position:0})}>Zum Verständnis</button></div>;
  if(state.phase==='recap')return <div className="twActivity" data-taiwan-mode="recap"><h2>{d.recap.question}</h2><label>Deine Zusammenfassung<textarea value={state.input} disabled={blocked} onChange={e=>setState({...state,input:e.target.value})}/></label>{!state.revealed?<button type="button" disabled={blocked} onClick={()=>void save({revealed:true})}>Mit dem Modell vergleichen</button>:<><p>Vergleiche selbst. Deine freie Zusammenfassung wird nicht automatisch bewertet.</p>{d.recap.expected.map(s=><p key={s}>{s}</p>)}<button type="button" disabled={blocked} onClick={()=>void finish()}>Weiter</button></>}</div>;
  const uid=checks[state.position];
  if(!uid)return <button type="button" disabled={blocked} onClick={()=>void save({phase:'recap'})}>Zum Zusammenhang</button>;
  const x=exercises.get(`sense:${uid}`)!;
  return question(x,uid,()=>save({position:state.position+1,feedback:false,selected:[],revealed:false,notice:'',phase:state.position+1>=checks.length?'recap':'questions'}));
 }
 const x=exercises.get(a.ref)!;
 return question(x,'utterance' in x?x.utterance:undefined,finish);

 function question(x:typeof taiwan.exercises[number],uid:string|undefined,advance:()=>Promise<void>){
  const type=x.type,production=type==='communicative_text_production',reply=type==='contextual_reply_selection',structured=type==='structured_value',route=type==='structured_route';
  const variants='expected' in x&&Array.isArray(x.expected)&&production?x.expected:[];
  const options=route&&'expected' in x?shuffled([x.expected,...('incorrect'in x?x.incorrect??[]:[])].map(v=>JSON.stringify(v)),x.id):'correct'in x?shuffled([...(x.correct??[]),...('incorrect'in x?x.incorrect??[]:[])].filter((s):s is string=>typeof s==='string'),x.id):[];
  const d=reply&&'dialog'in x&&x.dialog?dialogues.get(x.dialog):null;
  const after=reply&&'afterTurn'in x?x.afterTurn:undefined;
  const contextTurn=d&&after?d.turns[after-1]:null;
  async function check(){
   let result:TextState['result']='failure';let notice=x.feedback;
   if(production){
    const known=variants.some(v=>typeof v==='object'&&v!==null&&'hant'in v&&[v.hant,v.hans,v.pinyinLexical,v.toneNumbers].some(s=>typeof s==='string'&&normalize(s)===normalize(state.input)));
    result=known?'success':'unsure';notice=known?'Diese Form passt zum hinterlegten Modell. Aussprache und Töne sind damit nicht geprüft.':'Diese Antwort ist nicht als Variante hinterlegt. Vergleiche sie mit dem Modell; sie wird nicht pauschal als falsch bewertet.';
   }else if(structured&&'expected'in x){result=String(x.expected).trim()===state.input.trim()||(typeof x.expected==='number'&&state.input.trim()!==''&&Number(state.input)===x.expected)?'success':'failure';}
   else if(route&&'expected'in x){result=state.selected[0]===JSON.stringify(x.expected)?'success':'failure';}
   else if('correct'in x){const correct=x.correct??[];result=reply?(state.selected.length===correct.length&&state.selected.every(s=>correct.includes(s))?'success':'failure'):(correct.includes(state.selected[0])?'success':'failure');}
   const events:FeedbackEvent[]=[attempt(result,production?'production':'reading',x.id,a.kind==='dialogue'||state.pendingWords.length>0||state.revealed||(!production&&pinyinVisible))];
   if(uid)events.push({type:'taiwan_sentence_checked',detail:{utterance:uid,script,result,listening:false}});
   await save({feedback:true,result,notice},events);
  }
  function optionLabel(s:string){
   if(reply&&utterances.has(s))return utterances.get(s)![script];
   if(route){const values=JSON.parse(s) as string[];return values.map(v=>({straight:'geradeaus',right:'rechts',left:'links'}[v]??v)).join(' → ');}
   return s;
  }
  return <div className="twActivity" data-taiwan-mode="question"><p className="muted">Reise nach Taiwan · Textverständnis</p><h2>{type==='sentence_meaning'?'Welche Bedeutung hat dieser Satz?':structured?'Welchen Wert nennt der Text? Gib Betrag oder Dauer als Zahl, eine Uhrzeit als HH:MM an.':route?'Welchen Weg nennt der Text? Du blickst im Lageplan nach oben.':x.prompt}</h2>{uid&&!production&&sentence(uid)}{!production&&support}{route&&<svg className="twRouteMap" viewBox="0 0 240 220" role="img" aria-label="Lageplan: Start unten, Blick nach oben; Ausgang am rechten Ende der Querstraße."><path d="M30 90 H210 M120 90 V170" fill="none" stroke="currentColor" strokeWidth="3"/><circle cx="120" cy="170" r="5"/><text x="120" y="152" textAnchor="middle">↑</text><text x="120" y="200" textAnchor="middle">Start</text><text x="210" y="70" textAnchor="end">Ausgang</text></svg>}{uid&&utterances.get(uid)?.context&&<p>{utterances.get(uid)!.context}</p>}{contextTurn&&<div className="twQuestionContext"><p>Vorheriger Gesprächszug:</p>{contextTurn.utterances.map(k=><div key={k}>{sentence(k)}</div>)}</div>}{reply&&<p>Wähle alle passenden Antworten.</p>}
   {(production||structured)?<label>{production?'Deine Mandarinformulierung (Hanzi oder Pinyin)':'Deine Antwort'}<input autoComplete="off" value={state.input} disabled={blocked||state.feedback} onChange={e=>setState({...state,input:e.target.value})}/></label>:<div className="twChoices">{options.map(s=><button type="button" key={s} disabled={blocked||state.feedback} aria-pressed={state.selected.includes(s)} className={state.selected.includes(s)?'selected':''} onClick={()=>{const selected=reply?(state.selected.includes(s)?state.selected.filter(v=>v!==s):[...state.selected,s]):[s];setState({...state,selected});}}>{optionLabel(s)}</button>)}</div>}
   {!state.feedback?<button type="button" disabled={blocked||((production||structured)?!state.input.trim():!state.selected.length)} onClick={()=>void check()}>Prüfen</button>:<div className="twFeedback" role="status"><Resolution operation="text" parts={{response:<p>{production||structured?state.input:state.selected.map(optionLabel).join(' / ')}</p>,feedback:<p>{state.notice}</p>,reference:production?<div>{variants.map((v,i)=>typeof v==='object'&&v!==null&&'hant'in v?<div key={i}><p lang="zh">{v[script]}</p><p>{v.pinyinLexical}</p></div>:null)}</div>:uid?sentence(uid,true):'correct'in x?<p>{(x.correct??[]).map(optionLabel).join(' / ')}</p>:<p>{'expected'in x?route?optionLabel(JSON.stringify(x.expected)):String(x.expected):null}</p>,next:<button type="button" disabled={blocked} onClick={()=>void advance()}>Weiter</button>}}/></div>}
  </div>;
 }
}
