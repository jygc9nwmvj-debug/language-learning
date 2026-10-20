import {correctionComparison} from './correction.ts';
import { evaluateAnswer } from './answer.ts';
import { numberedToPinyin } from './pinyin.ts';
import type { Assessment, Item } from './schema/content';

// Canonical written-tone corrections are presentation, not assessment evidence.
// Missing tones still follow the occurrence's effective assessment contract.
export function displayInterpretation(input:string,item:Item,assessment:Assessment){
  const assessed=evaluateAnswer(input,item,assessment);
  const canonical=evaluateAnswer(input,item,{toneNotation:true,neutralTone:true});
  return canonical.content==='correct' && canonical.toneNotation==='different'
    ? {...assessed,toneNotation:'different' as const,fullyCorrect:false,correction:canonical.correction}
    : assessed;
}

export type DisplayElement = { toneOmitted?: boolean; original: string; target: string; correction: string; kind: 'spelling' | 'tone' | 'missing' | 'extra' | null };
export type DisplayDiagnosis = { mode: 'inline'; elements: DisplayElement[]; hasTone: boolean } | { mode: 'comparison' };
// Compatibility adapter for existing diagnostic callers. The renderer consumes the
// authoritative grapheme-safe range contract in correction.ts; no message parsing.
export function displayDiagnosis(input:string,item:Item,assessment?:Assessment):DisplayDiagnosis {
 const tokens=input.trim().split(/\s+/),comparison=correctionComparison(input,item,assessment);
 if(!assessment||item.slot||tokens.length!==item.syllables.length||!comparison.localized||!comparison.originalRanges.length&&!comparison.acceptedRanges.length)return {mode:'comparison'};
 let offset=input.indexOf(tokens[0]);
 const elements=tokens.map((original,i):DisplayElement=>{
  const start=input.indexOf(original,offset),end=start+original.length;offset=end;
  const range=comparison.originalRanges.find(r=>r.start>=start&&r.end<=end);
  const part={...item,syllables:[item.syllables[i]],tones:[item.tones[i]],toneNumbers:item.syllables[i]+item.tones[i],pinyin:numberedToPinyin(item.syllables[i]+item.tones[i])};
  const check=displayInterpretation(original,part,assessment);
  return {original,target:item.syllables[i],correction:part.pinyin,kind:range?.kind==='spelling'?'spelling':range?.kind==='tone'||check.toneNotation==='omitted'?'tone':null,toneOmitted:check.toneNotation==='omitted'};
 });
 return {mode:'inline',elements,hasTone:elements.some(e=>e.kind==='tone')};
}
