import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { validateAudio, validateAudioQuality } from './audio-validation.mjs';
import { content } from '../src/languages/mandarin/content/index.ts';
import { validateProductionAudio } from './production-audio.mjs';
const manifest = JSON.parse(readFileSync('docs/A2_AUDIO_MANIFEST.json','utf8'));
const assets = validateProductionAudio(content, manifest).map(ref => ref.path);
for (const asset of assets) {
  if (!existsSync(`public${asset}`)) throw new Error(`Missing asset: ${asset}`);
  validateAudio(readFileSync(`public${asset}`), asset);
}
console.log(`Validated ${content.words.length} canonical words, ${content.items.length} items, ${content.tasks.length} tasks and ${assets.length} audio references (${content.qaStatus}).`);

// Tiny provenance manifest: file identity and canonical item mapping, not an asset manager.
for (const entry of manifest.assets) validateAudioQuality(entry);
for (const asset of assets) {
  const entries=manifest.assets.filter(entry=>entry.path===asset);
  if(entries.length!==1) throw new Error(`Missing/duplicate audio provenance: ${asset}`);
  if(createHash('sha256').update(readFileSync(`public${asset}`)).digest('hex')!==entries[0].sha256) throw new Error(`Audio differs from reviewed technical manifest: ${asset}`);
}
for(const item of content.items) for(const [variant,path] of [['natural',item.audio],['careful_slow',item.slowAudio]]) {
 if(!manifest.assets.some(entry=>entry.item===item.id&&entry.variant===variant&&entry.path===path)) throw new Error(`Audio variant mapping: ${item.id}/${variant}`);
}

for(const entry of manifest.assets){
 const item=[...content.items,...content.detailAudio].find(i=>i.id===entry.item)??content.words.find(w=>w.id===entry.item);
 if(!item || entry.canonical?.toneNumbers!==item.toneNumbers || entry.canonical?.hans.replace(/[？。！？]/g,'')!==item.hans.replace(/[？。！？]/g,'') || entry.canonical?.hant.replace(/[？。！？]/g,'')!==item.hant.replace(/[？。！？]/g,''))throw Error(`Canonical audio mismatch: ${entry.item}`);
}
