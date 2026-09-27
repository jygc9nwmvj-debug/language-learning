// Explicit production eligibility is separate from perceived speech quality.
const legacy = new Map([
 ['wo:careful_slow','/audio/mandarin/wo-slow.wav'],
 ['ni:careful_slow','/audio/mandarin/ni-slow.wav'],
 ['hao:careful_slow','/audio/mandarin/hao-slow.wav'],
 ['zaijian:natural','/audio/mandarin/zaijian.wav'],
 ['zaijian:careful_slow','/audio/mandarin/zaijian-slow.wav'],
]);
export function productionAudioReferences(content) {
 return [
  ...content.items.flatMap(i=>[['natural',i.audio],['careful_slow',i.slowAudio]].filter(([,path])=>path).map(([variant,path])=>({item:i.id,variant,path}))),
  ...content.words.filter(w=>w.audio).map(w=>({item:w.id,variant:'natural',path:w.audio})),
 ];
}
export function validateProductionAudio(content,manifest) {
 const refs=productionAudioReferences(content);
 for(const ref of refs){
  const entries=manifest.assets.filter(a=>a.path===ref.path);
  if(entries.length!==1)throw Error(`Unknown/duplicate production audio: ${ref.path}`);
  const entry=entries[0];
  if(entry.item!==ref.item || entry.variant!==ref.variant)throw Error(`Production audio mapping: ${ref.item}/${ref.variant}`);
  const polly=entry.productionUse==='polly_reference' && entry.provider==='Amazon Polly' &&
   ['technically_validated','user_accepted','needs_human_review'].includes(entry.qualityState);
  const retained=entry.productionUse==='legacy_exception' && legacy.get(`${ref.item}:${ref.variant}`)===ref.path && !!entry.productionReason;
  if(!polly && !retained)throw Error(`Non-production/experimental audio: ${ref.path}`);
 }
 return refs;
}
