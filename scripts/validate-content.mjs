import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { validateWav } from './audio-validation.mjs';
import { content } from '../src/languages/mandarin/content/index.ts';
const assets = content.items.flatMap(i => [i.audio, i.slowAudio].filter(Boolean));
assets.push(...content.toneExamples.map(id => content.words.find(w => w.id === id).audio));
for (const asset of assets) {
  if (!existsSync(`public${asset}`)) throw new Error(`Missing asset: ${asset}`);
  validateWav(readFileSync(`public${asset}`), asset);
}
console.log(`Validated ${content.words.length} canonical words, ${content.items.length} items, ${content.tasks.length} tasks and ${assets.length} audio references (${content.qaStatus}).`);

// Tiny provenance manifest: file identity and canonical item mapping, not an asset manager.
const manifest = JSON.parse(readFileSync('docs/A2_AUDIO_MANIFEST.json','utf8'));
for (const asset of assets) {
  const entries=manifest.assets.filter(entry=>entry.path===asset);
  if(entries.length!==1) throw new Error(`Missing/duplicate audio provenance: ${asset}`);
  if(createHash('sha256').update(readFileSync(`public${asset}`)).digest('hex')!==entries[0].sha256) throw new Error(`Audio differs from reviewed technical manifest: ${asset}`);
}
for(const item of content.items) for(const [variant,path] of [['natural',item.audio],['careful_slow',item.slowAudio]]) {
 if(!manifest.assets.some(entry=>entry.item===item.id&&entry.variant===variant&&entry.path===path)) throw new Error(`Audio variant mapping: ${item.id}/${variant}`);
}
