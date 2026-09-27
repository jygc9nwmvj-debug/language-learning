import { readdir, unlink } from 'node:fs/promises';
import { content } from '../src/languages/mandarin/content/index.ts';
import { build } from 'vite';
// Only this dedicated preview branch enables the harness on Cloudflare.
const test = process.argv[2] === 'test' || process.env.CF_PAGES_BRANCH === 'a1-test-harness';
await build({ mode: test ? 'test' : 'production' });

// Ship only references selected by the current lesson, never archived experiments/test fixtures.
const activeAudio = new Set(content.items.flatMap(i => [i.audio, i.slowAudio]).filter(Boolean));
for (const id of content.toneExamples) activeAudio.add(content.words.find(w => w.id === id).audio);
for (const file of await readdir('dist/audio/mandarin')) {
  if (!activeAudio.has('/audio/mandarin/' + file)) await unlink('dist/audio/mandarin/' + file);
}
