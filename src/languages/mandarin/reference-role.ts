import { content, itemMap } from './content/index.ts';
import type { Item } from './schema/content';
export type ReferencePurpose = 'introduction'|'comprehension'|'production';
// Reviewed roles of existing assets; this is not new learning content or generated speech.
const fixedSlotAudio: Record<string, readonly string[]> = { wojiao: ['wo','detail-jiao'] };
export function referenceRole(item: Pick<Item,'slot'>, purpose: ReferencePurpose) {
 return !item.slot ? 'target' : purpose === 'production' ? 'fixed-components' : 'example';
}
export function fixedReferenceParts(item: Item) {
 const ids=fixedSlotAudio[item.id];
 if(!item.slot || !ids)throw Error('Missing reviewed fixed-slot reference: '+item.id);
 return ids.map(id=>{
  const part=itemMap.get(id) ?? content.detailAudio.find(a=>a.id===id);
  if(!part || ('slot' in part && part.slot) || part.words.some(w=>!item.words.includes(w)) || part.audio===item.audio || part.audio===item.slowAudio)throw Error('Invalid fixed-slot audio: '+id);
  return {id,audio:part.audio,hant:part.hant,hans:part.hans,words:part.words};
 });
}
