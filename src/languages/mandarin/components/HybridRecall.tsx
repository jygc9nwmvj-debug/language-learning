import { useState } from 'react';
import { itemMap } from '../content';
import { PhraseForm } from './PhraseForm';
import { AudioButton } from '../../../core/exercises/AudioButton';
import type { Item } from '../schema/content';
type Choice = 'known'|'unsure'|'revealed';
export function ScreenlessRecall({item,script,revealedInitially,disabled,onReveal,onResult,onExplore}:{item:Item;script:'hant'|'hans';revealedInitially:boolean;disabled:boolean;onReveal:()=>Promise<void>;onResult:(choice:Choice)=>Promise<void>;onExplore:(type:string,detail:Record<string,string|number|boolean>)=>void}) {
 const [revealed,setRevealed]=useState(revealedInitially);
 return <div className="stepStack hybridRecall" data-revealed={revealed}>
 {!revealed ? <><p className="meaning">{item.meaning.de}</p><p className="muted">Schau kurz weg und sag den Ausdruck laut aus dem Gedächtnis.</p><button type="button" disabled={disabled} onClick={()=>void onReveal().then(()=>setRevealed(true)).catch(()=>{})}>Aufdecken</button></>
 : <><PhraseForm item={item} script={script} showPinyin interactive onExplore={onExplore}/><div className="referenceAudio" role="group" aria-label="Referenz anhören"><AudioButton src={item.audio}/>{item.slowAudio&&<AudioButton src={item.slowAudio} label="Langsam gesprochen"/>}</div><p>Hattest du den Ausdruck vor dem Aufdecken selbst gesagt?</p><div className="buttonRow"><button type="button" className="secondaryButton" disabled={disabled} onClick={()=>void onResult('known').catch(()=>{})}>Ja, gewusst</button><button type="button" className="secondaryButton" disabled={disabled} onClick={()=>void onResult('unsure').catch(()=>{})}>Unsicher / nicht gewusst</button></div><button type="button" className="textButton" disabled={disabled} onClick={()=>void onResult('revealed').catch(()=>{})}>Direkt nachgesehen</button><p className="privacyNote">Deine Selbsteinschätzung zum Erinnern. Die Aussprache wird nicht bewertet.</p></>}
 </div>;
}
export function PaperRecall({items,script,revealedInitially,disabled,onReveal,onResult}:{items:string[];script:'hant'|'hans';revealedInitially:boolean;disabled:boolean;onReveal:()=>Promise<void>;onResult:(result:'success'|'unsure'|'skip')=>Promise<void>}) {
 const [revealed,setRevealed]=useState(revealedInitially);
 return <div className="stepStack hybridRecall" data-revealed={revealed}>
 {!revealed ? <><p>Nimm Papier und Stift. Schreib diese bekannten Zeichen aus dem Gedächtnis:</p><ul className="paperPrompts">{items.map(id=><li key={id}>{itemMap.get(id)!.meaning.de}</li>)}</ul><button type="button" disabled={disabled} onClick={()=>void onReveal().then(()=>setRevealed(true)).catch(()=>{})}>Fertig – vergleichen</button></>
 : <><p>Vergleiche mit deinem Blatt.</p><div className="paperAnswers">{items.map(id=><div key={id}><span className="hanziHero" lang="zh">{itemMap.get(id)![script]}</span><span className="controlLabel">{itemMap.get(id)!.meaning.de}</span></div>)}</div><div className="buttonRow"><button type="button" className="secondaryButton" disabled={disabled} onClick={()=>void onResult('success').catch(()=>{})}>Alle aus dem Gedächtnis geschrieben</button><button type="button" className="secondaryButton" disabled={disabled} onClick={()=>void onResult('unsure').catch(()=>{})}>Eins / mehrere unsicher</button></div><p className="privacyNote">Dein eigener Vergleich, keine automatische Schriftbewertung.</p></>}
 <button type="button" className="textButton" disabled={disabled} onClick={()=>void onResult('skip').catch(()=>{})}>Später</button>
 </div>;
}
