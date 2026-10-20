import { readdir, unlink } from 'node:fs/promises';
import { content } from '../src/languages/mandarin/content/index.ts';
import { productionAudioReferences } from './production-audio.mjs';
import { taiwanAudioPaths } from '../src/languages/mandarin/taiwan/audio.ts';
import { build } from 'vite';
// Only this dedicated preview branch enables the harness on Cloudflare.
const test = process.argv[2] === 'test' || process.env.CF_PAGES_BRANCH === 'a1-test-harness';
await build({ mode: test ? 'test' : 'production' });

// Ship only references selected by the current lesson, never archived experiments/test fixtures.
const activeAudio = new Set([...productionAudioReferences(content).map(ref=>ref.path),...taiwanAudioPaths]);
for (const file of await readdir('dist/audio/mandarin')) {
  if (!activeAudio.has('/audio/mandarin/' + file)) await unlink('dist/audio/mandarin/' + file);
}
