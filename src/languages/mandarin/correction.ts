import {evaluateAnswer} from './answer.ts';
import {numberedToPinyin} from './pinyin.ts';
import type {Item,Assessment} from './schema/content';
export type CorrectionRange={start:number;end:number;kind:'spelling'|'tone'|'missing'|'extra'};
export type CorrectionComparison={original:string;accepted:string;originalRanges:CorrectionRange[];acceptedRanges:CorrectionRange[];localized:boolean};
type Glyph={text:string;start:number;end:number;base:string;tone?:number};
type Token={text:string;start:number;end:number;glyphs:Glyph[];base:string};
const marks:Record<string,number>={'\u0304':1,'\u0301':2,'\u030c':3,'\u0300':4};
function glyphs(text:string,offset=0):Glyph[]{
 return [...new Intl.Segmenter('zh',{granularity:'grapheme'}).segment(text)].map(s=>{
  const decomposed=s.segment.toLowerCase().normalize('NFD'),tone=[...decomposed].map(c=>marks[c]).find(Boolean);
  return {text:s.segment,start:offset+s.index,end:offset+s.index+s.segment.length,base:decomposed.replace(/[\u0300\u0301\u0304\u030c0-5]/g,'').normalize('NFC').replace('v','ü'),tone};
 });
}
const token=(text:string,start:number):Token=>{const gs=glyphs(text,start);return {text,start,end:start+text.length,glyphs:gs,base:gs.map(g=>g.base).join('').replace(/u:/g,'ü')};};
function splitCanonical(item:Item):Token[]|null{
 const gs=glyphs(item.pinyin);let cursor=0;const out:Token[]=[];
 for(const syllable of item.syllables){while(cursor<gs.length&&/[\s'’]/.test(gs[cursor].text))cursor++;const start=cursor;let base='';
  while(cursor<gs.length&&base.length<syllable.length)base+=gs[cursor++].base;
  if(base!==syllable||!gs[start])return null;out.push(token(item.pinyin.slice(gs[start].start,gs[cursor-1].end),gs[start].start));
 }
 return out;
}
function originalTokens(input:string,item:Item):Token[]|null{
 const spaced=[...input.matchAll(/[^\s]+/gu)].map(m=>token(m[0],m.index));
 if(spaced.some(t=>!/^[a-züv:0-5\u0300-\u036f]+$/iu.test(t.text.normalize('NFD'))))return null;
 if(spaced.length>1)return spaced;
 // Compact Pinyin may be split only by exact canonical bases, never fuzzy syllabification.
 const full=spaced[0];if(!full||full.base!==item.syllables.join(''))return spaced;
 const gs=full.glyphs;let cursor=0;const out:Token[]=[];
 for(const syllable of item.syllables){const start=cursor;let base='';while(cursor<gs.length&&base.length<syllable.length)base+=gs[cursor++].base;
  while(cursor<gs.length&&/^[0-5]$/.test(gs[cursor].text))cursor++;
  if(base!==syllable||!gs[start])return null;const a=gs[start].start,b=gs[cursor-1].end;out.push(token(input.slice(a,b),a));
 }
 return out;
}
type Pair={a?:number;b?:number};
function align(actual:Token[],target:Token[]):Pair[]|null{
 const same=(a:number,b:number)=>actual[a].base===target[b].base;
 // Explicit learner whitespace provides boundaries for equal-length aligned diagnosis.
 // Known syllables moved to a different position invalidate positional attribution.
 if(actual.length===target.length){
  if(!actual.some((_,i)=>same(i,i)))return null;
  if(actual.some((a,i)=>!same(i,i)&&target.some((t,j)=>i!==j&&a.base===t.base)))return null;
  return actual.map((_,i)=>({a:i,b:i}));
 }
 type Path={cost:number;paths:Pair[][]};const cache=new Map<string,Path>();
 function visit(a:number,b:number):Path{
  if(a===actual.length&&b===target.length)return {cost:0,paths:[[]]};const key=a+':'+b;if(cache.has(key))return cache.get(key)!;
  const choices:Path[]=[];const add=(next:Path,p:Pair,cost:number)=>choices.push({cost:next.cost+cost,paths:next.paths.map(path=>[p,...path])});
  if(a<actual.length&&b<target.length&&same(a,b))add(visit(a+1,b+1),{a,b},0);
  if(a<actual.length)add(visit(a+1,b),{a},1);if(b<target.length)add(visit(a,b+1),{b},1);
  const cost=Math.min(...choices.map(c=>c.cost)),result={cost,paths:choices.filter(c=>c.cost===cost).flatMap(c=>c.paths).slice(0,2)};cache.set(key,result);return result;
 }
 const d=visit(0,0);return d.paths.length===1&&d.paths[0].some(p=>p.a!==undefined&&p.b!==undefined)?d.paths[0]:null;
}
function toneRange(t:Token,canonical:boolean):{start:number;end:number}{
 const numbered=t.glyphs.filter(g=>/^[0-5]$/.test(g.text)),marked=t.glyphs.filter(g=>g.tone);
 const g=canonical?marked[0]:numbered.length===1&&!marked.length?numbered[0]:marked.length===1&&!numbered.length?marked[0]:undefined;
 return g??t;
}
// Range output is presentation-only. Every offset refers to the original UTF-16
// string and ends at a grapheme boundary (including decomposed vowel+tone marks).
export function correctionComparison(input:string,item:Item,assessment?:Assessment):CorrectionComparison{
 const fallback={original:input,accepted:item.pinyin+(item.slot==='name'?' + dein Name':''),originalRanges:[],acceptedRanges:[],localized:false};
 if(!assessment||item.slot)return fallback;
 const actual=originalTokens(input,item),target=splitCanonical(item);if(!actual||!target)return fallback;
 const pairs=align(actual,target);if(!pairs)return fallback;
 const result:CorrectionComparison={...fallback,localized:true,originalRanges:[],acceptedRanges:[]};
 for(const p of pairs){
  if(p.a===undefined){const b=target[p.b!];result.acceptedRanges.push({start:b.start,end:b.end,kind:'missing'});continue;}
  const a=actual[p.a];if(p.b===undefined){result.originalRanges.push({start:a.start,end:a.end,kind:'extra'});continue;}
  const b=target[p.b];if(a.base!==b.base){result.originalRanges.push({start:a.start,end:a.end,kind:'spelling'});result.acceptedRanges.push({start:b.start,end:b.end,kind:'spelling'});continue;}
  const part={...item,syllables:[item.syllables[p.b]],tones:[item.tones[p.b]],toneNumbers:item.syllables[p.b]+item.tones[p.b],pinyin:numberedToPinyin(item.syllables[p.b]+item.tones[p.b])};
  const canonical=evaluateAnswer(a.text,part,{toneNotation:true,neutralTone:true}),assessed=evaluateAnswer(a.text,part,assessment);
  if(canonical.toneNotation==='different'){
   const ra=toneRange(a,false),rb=toneRange(b,true);result.originalRanges.push({start:ra.start,end:ra.end,kind:'tone'});result.acceptedRanges.push({start:rb.start,end:rb.end,kind:'tone'});
  }else if(assessed.toneNotation==='omitted'){const rb=toneRange(b,true);result.acceptedRanges.push({start:rb.start,end:rb.end,kind:'missing'});}
 }
 return result;
}
