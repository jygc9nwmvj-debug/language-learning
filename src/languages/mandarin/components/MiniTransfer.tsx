import { Resolution } from '../../../core/exercises/Resolution';
import { AnswerSummary, ContinueButton, PlaybackControl } from '../../../core/exercises/Controls';
import { useEffect, useRef, useState } from 'react';
import { transferCase } from '../transfer-cases';
import { itemMap } from '../content';
import { numberedToPinyin } from '../pinyin';
import type { TransferState } from '../mini-transfer';

export function MiniTransfer({state,script,onSave,onNext,disabled}:{state:TransferState;script:'hant'|'hans';onSave:(patch:Partial<Pick<TransferState,'phase'|'answer'|'heard'|'plays'|'knownBefore'>>)=>Promise<void>;onNext:()=>Promise<void>;disabled:boolean}) {
  const definition=transferCase(state.caseId)!;
  const turns=definition.turns.map(t=>({...t,item:itemMap.get(t.itemId)!}));
  const {question,solution}=definition;
  const [answer,setAnswer]=useState(state.answer),[playing,setPlaying]=useState(false),[speaker,setSpeaker]=useState('');
  const [transcript,setTranscript]=useState(false),[error,setError]=useState('');
  const audio=useRef<HTMLAudioElement|null>(null),cancel=useRef<(()=>void)|null>(null),generation=useRef(0),lock=useRef(false);
  const pending=useRef(Promise.resolve());
  const persist=(patch:Parameters<typeof onSave>[0])=>{
    const saved=pending.current.catch(()=>{}).then(()=>onSave(patch));pending.current=saved;return saved;
  };
  function stop(){generation.current++;audio.current?.pause();cancel.current?.();lock.current=false;setPlaying(false);}
  useEffect(()=>()=>{generation.current++;audio.current?.pause();cancel.current?.();},[]);
  async function play(){
    if(lock.current||disabled)return;lock.current=true;setPlaying(true);setError('');const token=++generation.current;
    try{
      for(const turn of turns){
        if(token!==generation.current)return;
        setSpeaker(turn.speaker);const a=new Audio(turn.item.audio);audio.current=a;
        await new Promise<void>((resolve,reject)=>{cancel.current=resolve;a.onended=()=>resolve();a.onerror=()=>reject(new Error());a.play().catch(reject);});
      }
      if(token!==generation.current)return;
      await persist({heard:true,plays:state.plays+1,phase:state.phase==='listen'?'answer':state.phase});
    }catch{if(token===generation.current)setError('Die Wiedergabe oder das Speichern wurde unterbrochen. Bitte erneut versuchen.');}
    finally{if(token===generation.current){lock.current=false;setPlaying(false);setSpeaker('');}}
  }
  async function submit(){
    if(lock.current||disabled)return;lock.current=true;setError('');
    try{await persist({answer,phase:'result'});}catch{setError('Deine Antwort konnte nicht gespeichert werden. Bitte erneut abgeben.');}finally{lock.current=false;}
  }
  return <div className="stepStack miniTransfer" data-mini-transfer={state.caseId} data-task-complete={state.phase==='result'}>
    <PlaybackControl emphasis={state.heard?'reference':'stimulus'} playing={playing} icon={playing?'stop':'play'} disabled={disabled} onClick={()=>playing?stop():void play()} label={playing?'Anhalten':state.heard?'Gespräch noch einmal hören':'Gespräch anhören'}/>
    <p className="transferPlaybackStatus controlLabel" role="status">{playing ? `Person ${speaker} spricht …` : ''}</p>
    {state.phase!=='listen'&&<div className="transferQuestion"><h3>{question}</h3>{state.phase==='answer'&&<p className="muted" id="transfer-instruction">Beschreibe auf Deutsch den Zusammenhang, nicht die Mandarin-Formulierung.</p>}</div>}
    {state.phase==='answer'&&<form className="stepStack" onSubmit={e=>{e.preventDefault();void submit();}}>
      <label className="srOnly" htmlFor="transfer-answer">{question}</label>
      <textarea aria-describedby="transfer-instruction" id="transfer-answer" rows={3} maxLength={500} placeholder="Deine Antwort" value={answer} disabled={disabled} onChange={e=>{const value=e.target.value;setAnswer(value);void persist({answer:value}).catch(()=>setError('Deine Eingabe konnte nicht gespeichert werden.'));}}/>
      <label className="transferKnown"><input type="checkbox" checked={!!state.knownBefore} disabled={disabled||playing} onChange={e=>void persist({knownBefore:e.target.checked}).catch(()=>setError('Bitte versuche es noch einmal.'))}/> Dieses Gespräch kenne ich schon.</label>
      <div className="buttonRow"><button disabled={disabled||playing||!answer.trim()}>Antwort abgeben</button><button type="button" className="textButton" disabled={disabled||playing} onClick={()=>void submit()}>Ich weiß es nicht</button></div>
    </form>}
    {state.phase==='result'&&<div className="transferResult">
      <Resolution operation="transfer" parts={{response: <AnswerSummary value={state.answer||'Ich weiß es nicht.'}/>,
      reference: <div className="transferSolution"><h3>Auflösung</h3><p>{solution}</p></div>,
      enrichment: <details open={transcript} onToggle={e=>setTranscript(e.currentTarget.open)}><summary>Transkript ansehen</summary>{transcript&&turns.map(t=><div className="reference" key={t.speaker}><strong>Person {t.speaker}</strong><p className="hanziSentence" lang="zh">{t.item[script]}</p><p>{numberedToPinyin(t.item.surfaceToneNumbers??t.item.toneNumbers)}</p><p>{t.item.meaning.de}</p></div>)}</details>,
      next: <ContinueButton disabled={disabled||playing} onClick={()=>void onNext().catch(()=>setError('Bitte versuche es noch einmal.'))}>Weiter</ContinueButton>,}}/>
    </div>}
    {error&&<p className="feedback error" role="alert">{error}</p>}
  </div>;
}
