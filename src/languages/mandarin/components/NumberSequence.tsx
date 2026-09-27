import {useState} from 'react';
import {itemMap} from '../content';
import type {Task} from '../schema/content';
export function NumberSequence({task,script,disabled,onAttempt,onNext}:{task:Task;script:'hant'|'hans';disabled:boolean;onAttempt:(e:{result:'success'|'failure';assisted:boolean;detail?:Record<string,string|number|boolean>})=>Promise<void>;onNext:()=>void|Promise<void>}){
 const ids=task.sequence!;const [chosen,setChosen]=useState<string[]>([]),[done,setDone]=useState(false),[saving,setSaving]=useState(false);
 const correct=chosen.join('|')===ids.join('|');
 return <div className="stepStack"><p>Wähle die Zeichen der Reihe nach. Du kannst deine Auswahl vor dem Prüfen ändern.</p>
 <p className="hanziSentence" lang="zh">{chosen.map(id=>itemMap.get(id)![script]).join(' · ')||'…'}</p>
 {!done&&<><div className="buttonRow">{[...ids].reverse().map(id=><button key={id} className="secondaryButton" disabled={disabled||saving||chosen.includes(id)} onClick={()=>setChosen(v=>[...v,id])}>{itemMap.get(id)![script]}</button>)}</div><div className="buttonRow"><button className="utilityButton" disabled={disabled||saving} onClick={()=>setChosen([])}>Neu ordnen</button><button disabled={disabled||saving||chosen.length!==ids.length} onClick={()=>{if(saving)return;setSaving(true);void onAttempt({result:correct?'success':'failure',assisted:false,detail:{sequence:ids.join(','),response:chosen.join(',')}}).then(()=>setDone(true)).catch(()=>{}).finally(()=>setSaving(false));}}>Prüfen</button></div></>}
 {done&&<><p className={`feedback ${correct?'success':'attention'}`} role="status">{correct?'Die Reihenfolge stimmt.':'Vergleiche die Reihenfolge:'} {ids.map(id=>{const i=itemMap.get(id)!;return `${i[script]} ${i.pinyin}`;}).join(' → ')}</p><button disabled={disabled} onClick={onNext}>Weiter</button></>}
 </div>;
}
