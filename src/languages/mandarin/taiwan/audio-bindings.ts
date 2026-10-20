// Pure canonical bindings shared by runtime and the asset planner/validator.
// Punctuation is ignored for full-model reuse; lexical tones and both scripts must agree.
export type AudioReference={kind:'word'|'sentence'|'model';reference:string};
type Model={hant:string;hans:string;toneNumbers:string};
type Canon={words:{id:string;hant:string;hans:string;tones:string[]}[];utterances:(Model&{id:string;words:string[];surfaceToneNumbersDraft:string;exploration:{word:string;hant:string;hans:string}[]})[];exercises:{id:string;type:string;expected?:unknown}[]};
const form=(s:string)=>s.replace(/[\p{P}\s]/gu,'');
const tones=(s:string)=>s.trim().replace(/5\b/g,'0').split(/\s+/).join(' ');
export function productionAudioBindings(c:Canon){
 const sources=[...c.utterances.map(u=>({...u,kind:'sentence' as const})),...c.words.map(w=>({...w,kind:'word' as const,toneNumbers:w.tones.join(' ')}))];
 return c.exercises.filter(x=>x.type==='communicative_text_production').map(x=>{
  const variants=x.expected as (Model&{words:string[]})[];
  const found=variants.map((v,index)=>({index,v,source:sources.find(s=>form(s.hant)===form(v.hant)&&form(s.hans)===form(v.hans)&&tones(s.toneNumbers)===tones(v.toneNumbers))})).find(v=>v.source);
  const index=found?.index??0,v=variants[index];
  return {exercise:x.id,index,model:v,audio:found?.source?{kind:found.source.kind,reference:found.source.id}:{kind:'model' as const,reference:x.id.replaceAll(':','-')},generated:!found};
 });
}
export function explorationAudioBindings(c:Canon){
 const words=new Map(c.words.map(w=>[w.id,w]));
 return c.utterances.flatMap(u=>{
  const surface=tones(u.surfaceToneNumbersDraft).split(' ');let offset=0;
  return u.exploration.map((p,index)=>{
   const w=words.get(p.word);
   if(!w||u.words[index]!==p.word||w.hant!==p.hant||w.hans!==p.hans)throw Error('Exploration word/form mismatch: '+u.id+'/'+index);
   const lexical=tones(w.tones.join(' ')).split(' '),part=surface.slice(offset,offset+lexical.length);
   if(part.length!==lexical.length)throw Error('Exploration syllable mismatch: '+u.id+'/'+index);
   // Authored 一/不 changes, neutral-tone changes and adjacent third tones need
   // the existing contextual sentence, rather than claiming the isolated model
   // is the realized pronunciation here. No new tone rules or clips are inferred.
   const contextual=lexical.some((t,i)=>t!==part[i]||(/3$/.test(t)&&(/3$/.test(surface[offset+i-1]??'')||/3$/.test(surface[offset+i+1]??''))));
   offset+=lexical.length;
   return {utterance:u.id,index,word:w.id,decision:contextual?'context_sentence':'isolated_word',audio:contextual?{kind:'sentence' as const,reference:u.id}:{kind:'word' as const,reference:w.id}};
  });
 });
}
