import {useState,type CSSProperties} from 'react';
import {itemMap} from '../content';
import {matchingSets,type MatchingState} from '../matching';
import {AudioButton} from '../../../core/exercises/AudioButton';
import {ContinueButton} from '../../../core/exercises/Controls';
import {Resolution} from '../../../core/exercises/Resolution';
import {Icon} from '../../../core/exercises/Icon';

export function MatchingExercise({state,disabled,onPair,onAudio,onNext}:{state:MatchingState;disabled:boolean;onPair:(left:string,right:string)=>Promise<void>;onAudio:(item:string)=>Promise<void>;onNext:()=>Promise<void>}){
 const [selected,setSelected]=useState<string|null>(null);
 const set=matchingSets.find(s=>s.id===state.setId)!,audio=set.relation==='audio-form',pinyin=set.relation==='pinyin-form',complete=state.matched.length===set.items.length;
 const correctionLeft=selected??(state.last&&!state.last.correct?state.last.left:undefined);
 const showCorrection=correctionLeft!==undefined&&!state.matched.includes(correctionLeft)&&(state.errorsByLeft[correctionLeft]??0)>=2;
 const choose=(id:string)=>{setSelected(state.matched.includes(id)?null:id);};
 const board=<fieldset className="matchingBoard" style={{'--matching-count':set.items.length} as CSSProperties} disabled={disabled} aria-label="Paare zuordnen">
  <div className="matchingColumn" role="group" aria-label={audio?'Audio auswählen':pinyin?'Pinyin auswählen':'Schriftform auswählen'}>{state.left.map((id,i)=>{
   const item=itemMap.get(id)!,matched=state.matched.includes(id),wrong=!state.last?.correct&&state.last?.left===id&&!selected;
   return <div key={id} className="matchingCell" data-selected={selected===id} data-matched={matched} data-wrong={wrong}>
    {audio?<AudioButton src={item.audio} label={`Audio ${i+1}`} onActivate={()=>{if(state.heard.includes(id))choose(id);}} onPlay={()=>{choose(id);void onAudio(id).catch(()=>{});}}/>:<button type="button" lang={pinyin?'zh-Latn':'zh'} aria-pressed={selected===id} disabled={disabled||matched} onClick={()=>choose(id)}>{pinyin?item.pinyin:item[state.script]}</button>}
    {selected===id&&!matched&&<span className="matchingConfirmation" aria-hidden="true">Ausgewählt</span>}
    {matched&&<span className="matchingConfirmation matchingMatched"><Icon name="check"/><span className="srOnly">Zugeordnet</span></span>}
    {wrong&&<span className="matchingErrorMark"><Icon name="close"/></span>}
   </div>;
  })}</div>
  <div className="matchingColumn" role="group" aria-label={audio||pinyin?'Passende Schriftform':'Passende Bedeutung'}>{state.right.map(id=>{
   const item=itemMap.get(id)!,matched=state.matched.includes(id),wrong=!state.last?.correct&&state.last?.right===id&&!selected;
   return <div key={id} className="matchingCell" data-matched={matched} data-wrong={wrong} data-correct-alternative={showCorrection&&correctionLeft===id}><button type="button" lang={audio||pinyin?'zh':'de'} disabled={disabled||matched||!selected} onClick={()=>{const left=selected!;setSelected(null);void onPair(left,id).catch(()=>{});}}>{audio||pinyin?item[state.script]:item.meaning.de}</button>{matched&&<span className="matchingConfirmation matchingMatched"><Icon name="check"/><span className="srOnly">Zugeordnet</span></span>}{wrong&&<span className="matchingErrorMark"><Icon name="close"/></span>}</div>;
  })}</div>
 </fieldset>;
 return <div className="matchingExercise" data-relation={set.relation} data-phase={complete?'complete':'matching'}>
  <h2>{audio?'Ordne jedem Audio die passende Schriftform zu.':pinyin?'Ordne dem Pinyin die passende Schriftform zu.':'Ordne jeder Schriftform die passende Bedeutung zu.'}</h2>
  <Resolution operation="matching" resolved={complete} parts={{reference:board,feedback:<p className="matchingFeedback" role="status">{complete?'Alle Paare sind zugeordnet.':showCorrection?`Passend ist: ${audio||pinyin?itemMap.get(correctionLeft!)![state.script]:itemMap.get(correctionLeft!)!.meaning.de}.`:selected?'Wähle rechts das passende Gegenstück.':state.last?state.last.correct?'Richtig zugeordnet.':'Das passt noch nicht. Versuche es noch einmal.':audio?'Höre links ein Audio an und wähle rechts.':pinyin?'Wähle links Pinyin und dann rechts die Schriftform.':'Wähle links eine Schriftform und dann rechts die Bedeutung.'}</p>,next:complete&&<ContinueButton disabled={disabled} onClick={()=>void onNext().catch(()=>{})}>Weiter</ContinueButton>}}/>
 </div>;
}
