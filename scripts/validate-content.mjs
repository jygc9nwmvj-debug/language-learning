import { existsSync, readFileSync } from 'node:fs';
import { validateWav } from './audio-validation.mjs';
import { content } from '../src/languages/mandarin/content/index.ts';
const assets = content.items.flatMap(i => [i.audio, i.slowAudio].filter(Boolean));
assets.push(...[1, 2, 3, 4].map(n => `/audio/mandarin/ma${n}.wav`));
for (const asset of assets) {
  if (!existsSync(`public${asset}`)) throw new Error(`Missing asset: ${asset}`);
  validateWav(readFileSync(`public${asset}`), asset);
}
console.log(`Validated ${content.words.length} canonical words, ${content.items.length} items, ${content.tasks.length} tasks and ${assets.length} audio references (${content.qaStatus}).`);
