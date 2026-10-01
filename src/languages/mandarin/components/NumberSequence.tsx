import { Resolution } from '../../../core/exercises/Resolution';
import { ContinueButton, ResponseComparison } from '../../../core/exercises/Controls';
import type { SavedFeedback } from '../../../core/progress/db';
import {useState} from 'react';
import {itemMap} from '../content';
import type {Task} from '../schema/content';
export function NumberSequence({task,script,disabled,onAttempt,onNext,restored}:{restored?:SavedFeedback;task:Task;script:'hant'|'hans';disabled:boolean;onAttempt:(e:{result:'success'|'failure';assisted:boolean;feedback?:SavedFeedback;detail?:Record<string,string|number|boolean>})=>Promise<void>;onNext:()=>void|Promise<void>}){
 const ids=task.sequence!;const [chosen,setChosen]=useState<string[]>(restored?.value.split(',') ?? []),[done,setDone]=useState(!!restored),[saving,setSaving]=useState(false);
 const correct=chosen.join('|')===ids.join('|');
 return <div className="stepStack numberSequence" data-task-complete={done}>{!done && <><p>Tippe die Zeichen der Reihe nach an.</p><p className="hanziSentence" lang="zh">{chosen.map(id=>itemMap.get(id)![script]).join(' · ')||'…'}</p></>}
 {!done&&<><div className="buttonRow">{[...ids].reverse().map(id=><button key={id} className="secondaryButton" disabled={disabled||saving||chosen.includes(id)} onClick={()=>setChosen(v=>[...v,id])}>{itemMap.get(id)![script]}</button>)}</div><div className="buttonRow"><button className="utilityButton" disabled={disabled||saving} onClick={()=>setChosen([])}>Neu ordnen</button><button disabled={disabled||saving||chosen.length!==ids.length} onClick={()=>{if(saving)return;setSaving(true);void onAttempt({result:correct?'success':'failure',assisted:false,feedback:{value:chosen.join(','),message:'',kind:correct?'success':'attention'},detail:{sequence:ids.join(','),response:chosen.join(',')}}).then(()=>setDone(true)).catch(()=>{}).finally(()=>setSaving(false));}}>Prüfen</button></div></>}
 {done&&<Resolution operation="sequence" parts={{reference: <ResponseComparison answer={<span className="sequenceComparison" lang="zh">{chosen.map((id,index)=><span key={index} data-different={id!==ids[index]}>{itemMap.get(id)![script]}<small>{itemMap.get(id)!.pinyin}</small></span>)}</span>} reference={<span className="sequenceComparison" lang="zh">{ids.map((id,index)=><span key={index}>{itemMap.get(id)![script]}<small>{itemMap.get(id)!.pinyin}</small></span>)}</span>}/>,feedback: <p className={`feedback ${correct?'success':'attention'}`} role="status">{correct?'Die Reihenfolge stimmt.':'Vergleiche die Reihenfolge:'}</p>,next: <ContinueButton disabled={disabled} onClick={onNext}>Weiter</ContinueButton>,}}/>}
 </div>;
}
