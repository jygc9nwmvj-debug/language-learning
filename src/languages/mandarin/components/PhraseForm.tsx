import { IconButton } from '../../../core/exercises/Controls';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Explanation, Item } from '../schema/content';
import { phraseUnits, explanationParts } from '../phrase';
import { AudioButton } from '../../../core/exercises/AudioButton';
export function ExplanationText({ value, script }: { value: Explanation; script: 'hant' | 'hans' }) {
  return <>{explanationParts(value,script).map((part,n) => typeof part === 'string' ? part : <span className="explainedToken" key={n}><span lang="zh">{part.form}</span> {part.pinyin} · {part.gloss}</span>)}</>;
}
// Suppress only the known non-instructional filler in presentation; authored content stays intact.
export function LearningNote({value,script}:{value:Explanation;script:'hant'|'hans'}) {
  const plain = typeof value === 'string' ? value : value.every(part=>typeof part==='string') ? value.join('') : undefined;
  if (plain === 'Ein kurzer Ausdruck für dein nächstes Gespräch.') return null;
  return <p className="muted"><ExplanationText value={value} script={script}/></p>;
}
export function HanziText({value}:{value:string}) {
  return <p className="hanziHero" lang="zh" style={{'--hanzi-count':[...value].length} as CSSProperties}>{value}</p>;
}
export function PhraseForm({ item, script, showPinyin = false, interactive = false, onExplore }: {
  item: Item; script: 'hant' | 'hans'; showPinyin?: boolean; interactive?: boolean;
  onExplore?: (type: string, detail: Record<string, string | number | boolean>) => void;
}) {
  const units = phraseUnits(item,script);
  const [selected,setSelected] = useState<number | null>(null), [character,setCharacter] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const restoreTriggerFocus = () => root.current?.querySelector<HTMLButtonElement>('button.phraseUnit[aria-expanded="true"]')?.focus({preventScroll:true});
  useEffect(() => {
    const dismiss = () => { setSelected(null); setCharacter(null); };
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) dismiss(); };
    // Safari need not focus a clicked button; Escape must also work without that focus.
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && root.current?.querySelector('[aria-expanded="true"]')) { restoreTriggerFocus(); dismiss(); } };
    document.addEventListener('pointerdown',outside); document.addEventListener('keydown',escape);
    return () => { document.removeEventListener('pointerdown',outside); document.removeEventListener('keydown',escape); };
  },[]);
  if (!units) return <><HanziText value={item[script]}/>{showPinyin && <p className="pinyin">{item.pinyin}</p>}</>;
  const current = selected === null ? undefined : units[selected];
  return <div className="phraseForm" data-expanded={selected !== null} data-depth={character !== null ? 'character' : selected !== null ? 'chunk' : 'whole'} ref={root}>
    <div className="phraseUnits" aria-label="Ausdruck">
      {units.map((unit,n) => {
        const text = <>{unit.characters.map((char,k) => <span className="alignedCharacter" key={k}><span className="unitHanzi" lang="zh">{char.hanzi}</span>{showPinyin && <span className="unitPinyin">{char.pinyin}</span>}</span>)}</>;
        return <span className="phraseUnitWrap" key={n}>{interactive ? <button type="button" className="phraseUnit" aria-label={`${unit.form} erkunden`} aria-expanded={selected===n} onClick={() => { setSelected(selected===n?null:n);setCharacter(null);if(selected!==n)onExplore?.('phrase_explore',{unit:n,words:unit.words.join(' ')}); }}>{text}</button> : <span className="phraseUnit">{text}</span>}{n===units.length-1 && item.punctuation && <span className="phrasePunctuation" lang="zh">{item.punctuation}</span>}</span>;
      })}
    </div>
    {interactive && current && <div className="unitExplanation" role="region" aria-label="Worterklärung"><div className="unitTitle"><strong lang="zh">{current.form}</strong><span>{current.characters.map(c=>c.pinyin).join(' ')}</span>{current.audio && <AudioButton src={current.audio} onPlay={() => onExplore?.('optional_reference_audio', { optionalPractice: true, context: 'detail', unit: selected!, words: current.words.join(' '), variant: 'natural' })} />}<IconButton className="explorationClose" icon="close" label="Schließen" onClick={()=>{restoreTriggerFocus();setSelected(null);setCharacter(null);}}/></div><p>{current.gloss}</p>{current.audioContext && <div className="reference"><p className="muted">{current.audioContext}</p><div className="unitTitle"><strong lang="zh">{item[script]}</strong><AudioButton src={item.audio} label="Ganzen Ausdruck anhören" onPlay={() => onExplore?.('optional_reference_audio', { optionalPractice: true, context: 'detail_phrase', unit: selected!, variant: 'natural' })} /></div></div>}
      {current.characters.some(c=>c.note) && <details><summary>Zeichen ansehen</summary><div className="buttonRow">{current.characters.map((char,n)=>char.note && <button type="button" className="utilityButton" key={n} aria-label={`${char.hanzi} ansehen`} aria-pressed={character===n} onClick={()=>{setCharacter(n);onExplore?.('character_explore',{unit:selected!,character:n});}}>{char.hanzi}</button>)}</div>
        {character !== null && <p className="characterNote"><span className="characterForm" lang="zh">{current.characters[character].hanzi}</span> · {current.characters[character].pinyin} — {current.characters[character].note}{current.characters[character].writingTarget && ' Auch ein Schreibziel.'}</p>}</details>}
    </div>}
  </div>;
}
