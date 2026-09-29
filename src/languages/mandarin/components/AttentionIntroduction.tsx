import { PhraseForm, ExplanationText } from './PhraseForm';
import { useRef, useState } from 'react';
import { AudioButton, stopReferenceAudio } from '../../../core/exercises/AudioButton';
import { SpeakingPractice } from '../../../core/exercises/SpeakingPractice';
import type { Item } from '../schema/content';
import { numberedToPinyin } from '../pinyin';
import { missingIntroduction, introductionDetail, knownHanziComponents } from '../introduction';
import type { ResearchEvent } from '../../../core/progress/db';
type Detail = Record<string, string | number | boolean>;
export type Introduce = (type: string, detail: Detail) => Promise<void>;
export function FocusedPinyin({ value }: { value: string }) {
  return <>{[...value].map((letter, i) => /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(letter) ? <em key={i}>{letter}</em> : <span key={i}>{letter}</span>)}</>;
}
export function ToneFocus({ item }: { item: Item }) {
  return <div className="toneFocus"><p className="controlLabel">Achte auf die Tonzeichen</p><div className="focusedSyllables">{item.syllables.map((s, i) => <div key={i}><strong><FocusedPinyin value={numberedToPinyin(s + item.tones[i])} /></strong><span>{item.tones[i] === 5 ? 'Neutraler Ton' : `${item.tones[i]}. Ton`}</span></div>)}</div>
    {item.introduction.toneNote && <p className="focusNote">{item.introduction.toneNote}</p>}</div>;
}
export function AttentionIntroduction({ item, script, disabled, onIntroduce, onEvent, onNext, history = [], name = '', setName }: {
  item: Item; script: 'hant' | 'hans'; disabled: boolean; onIntroduce: Introduce; history?: ResearchEvent[];
  name?: string; setName?: (value:string)=>void;
  onEvent: (type: string, detail?: Detail) => void; onNext: () => void | Promise<void>;
}) {
  const [missing] = useState(() => missingIntroduction(item,script,history));
  const [noticedForm] = useState(() => history.some(e=>e.type==='hanzi_attention_confirmed' && e.detail.item===item.id && e.detail.script===script && e.detail.form===item[script] && e.detail.introductionVersion===1));
  const formPhase = missing.includes('hanzi') && !noticedForm ? 'hanzi' : 'connect';
  const followingAudio = missing.includes('tone') ? 'tone' : formPhase;
  const [phase,setPhase] = useState<'hear'|'tone'|'hanzi'|'connect'>(missing.includes('pronunciation')?'hear':followingAudio);
  const [saving,setSaving] = useState(false);
  const lock=useRef(false), audioConfirmed=useRef(!missing.includes('pronunciation'));
  const knownParts=knownHanziComponents(item,script,history) && item.words.length>1;
  async function save(action:()=>Promise<void>) {
    if(lock.current||disabled)return;lock.current=true;setSaving(true);
    try { await action(); } catch { /* Parent displays the save error. Keep current focus for retry. */ }
    finally {lock.current=false;setSaving(false);}
  }
  function heard() {
    if(audioConfirmed.current)return;
    void save(async()=>{await onIntroduce('introduction_dimensions',introductionDetail(item,script,['pronunciation'],phase==='hear'?'focused_audio_completed':'linked_reference_completed'));audioConfirmed.current=true;if(phase==='hear')setPhase(followingAudio);});
  }
  async function finish() {
    await save(async()=>{
      const dimensions=missing.filter(d=>['meaning','hanzi','segmentation'].includes(d));
      if(dimensions.length)await onIntroduce('introduction_dimensions',introductionDetail(item,script,dimensions,'form_sound_meaning_connection'));
      await onNext();
    });
  }
  const audio = <><AudioButton emphasis={phase==='hear' ? 'stimulus' : 'reference'} src={item.audio} autoPlay={missing.includes('pronunciation')} onEnded={heard} onPlay={()=>onEvent('attention_audio_replay')} /><AudioButton src={item.slowAudio!} label="Langsam gesprochen" onEnded={heard} onPlay={()=>onEvent('attention_slow_audio')} /></>;
  return <div className="attentionIntroduction" data-focus={phase}>
    <SpeakingPractice allowPractice={phase==='connect'} disabled={disabled||saving||(item.slot==='name'&&!name.trim())} onEvent={onEvent} onNext={finish} audio={audio} reference={<div className="attentionFocus" aria-live="polite">
      {phase==='hear'&&<><h3>Erst nur hören.</h3><p className="muted">{knownParts?'Die Wörter kennst du schon. Achte auf ihren Klang zusammen.':'Lerne den Klang kennen. Die Bedeutung kommt gleich dazu.'}</p></>}
      {phase==='tone'&&<ToneFocus item={item} />}
      {phase==='hanzi'&&<><p className="controlLabel">Jetzt nur das Schriftbild</p><p className="hanziHero" lang="zh">{item[script]}</p><p className="focusNote">Schau auf Form und Anordnung.{item.introduction.role==='writing'?' Dieses Zeichen übst du später auch beim Schreiben.':' Hier geht es ums Wiedererkennen, nicht ums Schreiben.'}</p></>}
      {phase==='connect'&&<>{(knownParts || missing.includes('hanzi')) && <p className="controlLabel">{knownParts?'Bekannte Wörter, neue Verbindung':'Verbinde Schrift, Klang und Bedeutung'}</p>}<PhraseForm item={item} script={script} showPinyin interactive onExplore={onEvent} /><div className="pronunciationMeaning"><p className="meaning">{item.meaning.de}</p></div></>}
    </div>}>
      {phase==='hear'&&<button className="utilityButton" disabled={disabled||saving} onClick={()=>{stopReferenceAudio();setPhase(followingAudio);}}>Schrift ohne Warten ansehen</button>}
      {phase==='tone'&&<button disabled={disabled||saving} onClick={()=>void save(async()=>{stopReferenceAudio();await onIntroduce('tone_attention_confirmed',{item:item.id,toneNumbers:item.toneNumbers,attentionVersion:1});setPhase(formPhase);})}>{formPhase==='hanzi'?'Schriftbild ansehen':'Bedeutung dazunehmen'}</button>}
      {phase==='hanzi'&&<button disabled={disabled||saving} onClick={()=>void save(async()=>{stopReferenceAudio();await onIntroduce('hanzi_attention_confirmed',introductionDetail(item,script,[],'visual_focus'));setPhase('connect');})}>Bedeutung dazunehmen</button>}
      {phase==='connect'&&<>{missing.includes('segmentation')&&<p className="focusNote">Lies die Wortgruppen mit: Jede Silbe steht bei ihrem Zeichen. Tippe eine Gruppe an, wenn du sie genauer verstehen möchtest.</p>}{item.learning&&<p className="muted"><ExplanationText value={item.learning.note} script={script}/></p>}{item.learning?.discovery&&<details><summary>Eine kleine Entdeckung</summary><p><ExplanationText value={item.learning.discovery} script={script}/></p></details>}{item.slot==='name'&&setName&&<label className="fieldLabel">Dein Name<input value={name} onChange={e=>setName(e.target.value)} maxLength={60} autoComplete="given-name"/></label>}</>}
    </SpeakingPractice>
  </div>;
}
