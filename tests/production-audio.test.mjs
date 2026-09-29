import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {content} from '../src/languages/mandarin/content/index.ts';
import {validateProductionAudio} from '../scripts/production-audio.mjs';
const manifest=JSON.parse(readFileSync('docs/A2_AUDIO_MANIFEST.json'));
test('production inventory includes all item variants and all four canonical tone references',()=>{
 const refs=validateProductionAudio(content,manifest);assert.equal(refs.length,content.items.length*2+4+content.detailAudio.length);assert.equal(new Set(refs.map(r=>r.path)).size,refs.length);
});
test('unknown or ineligible audio fails even with an existing provenance entry',()=>{
 for(const path of ['/audio/mandarin/nihao.wav','/audio/mandarin/unknown.mp3']){
  const c=structuredClone(content);c.items[0].audio=path;assert.throws(()=>validateProductionAudio(c,manifest),/Unknown/);
 }
 for(const change of [a=>delete a.productionUse,a=>a.provider='Qwen',a=>a.qualityState='generated']){
  const m=structuredClone(manifest);change(m.assets.find(a=>a.item==='nihao'&&a.variant==='natural'));assert.throws(()=>validateProductionAudio(content,m),/Non-production/);
 }
});
test('swapped variants, wrong tone audio and hidden word audio fail closed',()=>{
 const c=structuredClone(content);[c.items[0].audio,c.items[0].slowAudio]=[c.items[0].slowAudio,c.items[0].audio];assert.throws(()=>validateProductionAudio(c,manifest),/mapping/);
 const d=structuredClone(content);d.words.find(w=>w.id===d.toneExamples[0]).audio=d.words.find(w=>w.id===d.toneExamples[1]).audio;assert.throws(()=>validateProductionAudio(d,manifest),/mapping/);
 const e=structuredClone(content);e.words.find(w=>!w.audio).audio='/audio/mandarin/experimental.wav';assert.throws(()=>validateProductionAudio(e,manifest),/Unknown/);
});
test('legacy exceptions cannot be expanded by labeling another experiment as legacy',()=>{
 const c=structuredClone(content),m=structuredClone(manifest);c.items[0].audio='/audio/mandarin/experiment.wav';m.assets.push({item:c.items[0].id,variant:'natural',path:c.items[0].audio,productionUse:'legacy_exception',productionReason:'experiment'});assert.throws(()=>validateProductionAudio(c,m),/Non-production/);
});
