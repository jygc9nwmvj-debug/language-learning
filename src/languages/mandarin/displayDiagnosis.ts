import { evaluateAnswer, normalizeText } from './answer.ts';
import { numberedToPinyin } from './pinyin.ts';
import type { Assessment, Item } from './schema/content';

export type DisplayElement = { toneOmitted?: boolean; original: string; target: string; correction: string; kind: 'spelling' | 'tone' | 'missing' | 'extra' | null };
export type DisplayDiagnosis = { mode: 'inline'; elements: DisplayElement[]; hasTone: boolean } | { mode: 'comparison' };
// Presentation only. Never consumed by scoring, persistence or telemetry.
export function displayDiagnosis(input: string, item: Item, assessment?: Assessment): DisplayDiagnosis {
  const fallback = { mode: 'comparison' } as const;
  if (!assessment || item.slot) return fallback;
  const tokens = input.trim().split(/\s+/);
  if (tokens.length !== item.syllables.length || tokens.some(t => !/^[a-züv:0-5\u0300-\u036f]+$/iu.test(t.normalize('NFD')))) return fallback;
  const parts = item.syllables.map((s,i) => ({...item, syllables:[s],tones:[item.tones[i]],pinyin:numberedToPinyin(s+item.tones[i]),toneNumbers:s+item.tones[i]}));
  const checks = tokens.map((t,i)=>evaluateAnswer(t,parts[i],assessment));
  // No positional explanation for a wholly unrelated answer or a moved known syllable.
  if (!checks.some(c=>c.content==='correct')) return fallback;
  for (let i=0;i<tokens.length;i++) {
    if (checks[i].content==='correct') continue;
    if (parts.some((p,j)=>j!==i && evaluateAnswer(tokens[i],p,{toneNotation:false,neutralTone:false}).content==='correct')) return fallback;
    // Same segmentation as the existing aligned-syllable diagnosis; broad errors use the whole model.
    const plain = normalizeText(tokens[i]).normalize('NFD').replace(/[\u0300-\u036f0-5]/g,'');
    const target=item.syllables[i];
    const row=Array.from({length:target.length+1},(_,n)=>n);
    for(let a=1;a<=plain.length;a++){let prev=row[0];row[0]=a;for(let b=1;b<=target.length;b++){const old=row[b];row[b]=Math.min(row[b]+1,row[b-1]+1,prev+(plain[a-1]===target[b-1]?0:1));prev=old;}}
    if(row[target.length]>2) return fallback;
  }
  const elements = tokens.map((original,i):DisplayElement=>({original,target:item.syllables[i],correction:parts[i].pinyin,
    toneOmitted:checks[i].toneNotation==='omitted',
    kind:checks[i].content!=='correct'?'spelling':!checks[i].fullyCorrect?'tone':null}));
  if(!elements.some(e=>e.kind)) return fallback;
  return {mode:'inline',elements,hasTone:elements.some(e=>e.kind==='tone')};
}
