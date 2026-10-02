import {useState} from 'react';
import {itemMap} from '../content';
import {matchingSets,type MatchingState} from '../matching';
import {AudioButton} from '../../../core/exercises/AudioButton';
import {ContinueButton} from '../../../core/exercises/Controls';
import {Resolution} from '../../../core/exercises/Resolution';

export function MatchingExercise({state,disabled,onPair,onAudio,onNext}:{state:MatchingState;disabled:boolean;onPair:(left:string,right:string)=>Promise<void>;onAudio:(item:string)=>Promise<void>;onNext:()=>Promise<void>}){
 const [selected,setSelected]=useState<string|null>(null);
 const set=matchingSets.find(s=>s.id===state.setId)!,audio=set.relation==='audio-form',complete=state.matched.length===set.items.length;
 const choose=(id:string)=>{if(!state.matched.includes(id))setSelected(id);};
 const board=<fieldset className="matchingBoard" disabled={disabled} aria-label="Paare zuordnen">
  <div className="matchingColumn" role="group" aria-label={audio?'Audio auswählen':'Schriftform auswählen'}>{state.left.map((id,i)=>{
   const item=itemMap.get(id)!,matched=state.matched.includes(id),wrong=!state.last?.correct&&state.last?.left===id&&!selected;
   return <div key={id} className="matchingCell" data-selected={selected===id} data-matched={matched} data-wrong={wrong}>
    {audio?<AudioButton src={item.audio} label={`Audio ${i+1}`} onPlay={()=>{choose(id);void onAudio(id).catch(()=>{});}}/>:<button type="button" lang="zh" aria-pressed={selected===id} disabled={disabled||matched} onClick={()=>choose(id)}>{item[state.script]}</button>}
    {matched&&<span className="matchingConfirmation">Zugeordnet</span>}
   </div>;
  })}</div>
  <div className="matchingColumn" role="group" aria-label={audio?'Passende Schriftform':'Passende Bedeutung'}>{state.right.map(id=>{
   const item=itemMap.get(id)!,matched=state.matched.includes(id),wrong=!state.last?.correct&&state.last?.right===id&&!selected;
   return <div key={id} className="matchingCell" data-matched={matched} data-wrong={wrong}><button type="button" lang={audio?'zh':'de'} disabled={disabled||matched||!selected} onClick={()=>{const left=selected!;setSelected(null);void onPair(left,id).catch(()=>{});}}>{audio?item[state.script]:item.meaning.de}</button>{matched&&<span className="matchingConfirmation">Zugeordnet</span>}</div>;
  })}</div>
 </fieldset>;
 return <div className="matchingExercise" data-relation={set.relation} data-phase={complete?'complete':'matching'}>
  <h2>{audio?'Ordne jedem Audio die passende Schriftform zu.':'Ordne jeder Schriftform die passende Bedeutung zu.'}</h2>
  <Resolution operation="matching" resolved={complete} parts={{reference:board,feedback:<p className="matchingFeedback" role="status">{complete?'Alle Paare sind zugeordnet.':selected?'Wähle rechts das passende Gegenstück.':state.last?state.last.correct?'Richtig zugeordnet.':'Das passt noch nicht. Versuche es noch einmal.':audio?'Höre links ein Audio an und wähle rechts.':'Wähle links eine Schriftform und dann rechts die Bedeutung.'}</p>,next:complete&&<ContinueButton disabled={disabled} onClick={()=>void onNext().catch(()=>{})}>Weiter</ContinueButton>}}/>
 </div>;
}
