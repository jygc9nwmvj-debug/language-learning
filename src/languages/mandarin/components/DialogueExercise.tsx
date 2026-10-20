import {MeaningFeedback} from './MeaningFeedback';
import {useEffect,useRef,useState} from 'react';
import {dialogueDefinition,type DialogueState} from '../dialogue';
import {itemMap} from '../content';
import {AudioButton,stopReferenceAudio} from '../../../core/exercises/AudioButton';
import {ContinueButton,PlaybackControl,ResponseComparison, PrimaryAction} from '../../../core/exercises/Controls';
import {numberedToPinyin} from '../pinyin';
export function DialogueExercise({state,script,disabled,onAction}:{state:DialogueState;script:'hant'|'hans';disabled:boolean;onAction:(action:'heard'|'draft'|'answer'|'next'|'response',answer?:string,turn?:number)=>Promise<void>}){
 const [answer,setAnswer]=useState(state.results[state.turn]?.answer??state.draft),[playing,setPlaying]=useState(false),[speaker,setSpeaker]=useState(''),[error,setError]=useState('');
 const generation=useRef(0),audio=useRef<HTMLAudioElement|null>(null),cancel=useRef<(()=>void)|null>(null),pending=useRef(Promise.resolve());
 const turns=dialogueDefinition.turns,turn=turns[state.turn],item=itemMap.get(turn.itemId)!,result=state.results[state.turn];
 const [transcript,setTranscript]=useState(0);
 const act=(action:Parameters<typeof onAction>[0],value?:string)=>{const n=state.turn;pending.current=pending.current.catch(()=>{}).then(()=>onAction(action,value,n));return pending.current.catch(()=>setError('Noch nicht gespeichert. Bitte erneut versuchen.'));};
 useEffect(()=>{setAnswer(state.results[state.turn]?.answer??state.draft);},[state.turn,state.phase]);
 function stop(){generation.current++;audio.current?.pause();cancel.current?.();setPlaying(false);setSpeaker('');}
 useEffect(()=>()=>{generation.current++;audio.current?.pause();cancel.current?.();},[]);
 async function playAll(){
  if(playing||disabled)return;stopReferenceAudio();const token=++generation.current;setPlaying(true);setError('');
  try{for(const t of turns){if(token!==generation.current)return;setSpeaker(t.speaker);const a=new Audio(itemMap.get(t.itemId)!.audio);audio.current=a;
   await new Promise<void>((resolve,reject)=>{cancel.current=resolve;a.onended=()=>resolve();a.onerror=reject;void a.play().catch(reject);});}
   if(token===generation.current)await act('heard');
  }catch{if(token===generation.current)setError('Die Wiedergabe wurde unterbrochen. Bitte erneut anhören.');}
  finally{if(token===generation.current){setPlaying(false);setSpeaker('');}}
 }
 const next=<ContinueButton disabled={disabled||playing} onClick={()=>{stopReferenceAudio();void act('next');}}>Weiter</ContinueButton>;
 const model=(id:string)=>{const i=itemMap.get(id)!;return <div className="dialogueModel"><p lang="zh" className="dialogueHanzi">{i[script]}</p><p className="pinyin">{numberedToPinyin(i.surfaceToneNumbers??i.toneNumbers)}</p><p>{i.meaning.de}</p></div>;};
 return <section className="dialogueExercise stepStack" data-dialogue-phase={state.phase}>
  <p className="controlLabel" hidden={state.phase!=='turn'}>{state.turn+1}/{turns.length}</p>
  {(state.phase==='listen'||state.phase==='revisit')&&<>
   <h2>{state.phase==='listen'?'Höre das ganze Gespräch.':'Höre das Gespräch noch einmal.'}</h2>
   {state.phase==='listen'&&<p>{dialogueDefinition.context}</p>}
   <PlaybackControl playing={playing} icon={playing?'stop':'speaker'} disabled={disabled} onClick={()=>playing?stop():void playAll()} label={playing?'Gespräch anhalten':'Gespräch anhören'}/>
   <p role="status">{playing?`${speaker} spricht …`:state.heard?'Gespräch vollständig gehört.':''}</p>
   {state.phase==='revisit'&&<div className="dialogueTranscript"><p className="controlLabel">{turns[transcript].speaker} · {transcript+1}/{turns.length}</p>{model(turns[transcript].itemId)}<div className="buttonRow"><button className="textButton" disabled={!transcript} onClick={()=>setTranscript(n=>n-1)}>Vorheriger Satz</button><button className="textButton" disabled={transcript===turns.length-1} onClick={()=>setTranscript(n=>n+1)}>Nächster Satz</button></div></div>}
   {state.heard&&next}
  </>}
  {state.phase==='turn'&&<>
   <h2>{turn.speaker}: Was bedeutet dieser Satz?</h2>
   <AudioButton src={item.audio} emphasis="stimulus" onEnded={()=>void act('heard')}/>
   {!result?<form className="stepStack" onSubmit={e=>{e.preventDefault();(document.activeElement as HTMLElement)?.blur();void act('answer',answer);}}>
    <label className="fieldLabel">Auf Deutsch<input maxLength={180} value={answer} disabled={disabled} onChange={e=>{setAnswer(e.target.value);void act('draft',e.target.value);}} autoComplete="off"/></label>
    <PrimaryAction type="submit" disabled={disabled||!state.heard||!answer.trim()}>Prüfen</PrimaryAction>
   </form>:<>
    <div className="dialogueCorrection" role="status"><MeaningFeedback answer={result.answer} accepted={turn.answers} reference={item.meaning.de} itemId={item.id}/></div>
    {model(turn.itemId)}{next}
   </>}
  </>}
  {state.phase==='respond'&&<>
   <h2>Welche Antwort passt auf „Und dir?“?</h2><AudioButton src={itemMap.get(dialogueDefinition.response.cueItem)!.audio}/>
   {!state.response?<div className="dialogueChoices">{dialogueDefinition.response.options.map(id=><button key={id} className="secondaryButton" disabled={disabled} onClick={()=>void act('response',id)} lang="zh">{itemMap.get(id)![script]}</button>)}</div>:<>
    <div role="status" className="dialogueCorrection"><ResponseComparison answer={state.response.correct?itemMap.get(state.response.answer)![script]:<span className="correctionError">{itemMap.get(state.response.answer)![script]}</span>} reference={dialogueDefinition.response.accepted.map(id=>itemMap.get(id)![script]).join(' / ')}/><p>{state.response.correct?'Das passt zur Rückfrage.':'Die Rückfrage bezieht sich auf dein Befinden.'}</p></div>{next}
   </>}
  </>}
  {state.phase==='complete'&&<><h2>Gespräch abgeschlossen.</h2>{next}</>}
  {error&&<p role="alert">{error}</p>}
 </section>;
}
