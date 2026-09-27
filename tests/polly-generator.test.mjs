import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {content,itemMap} from '../src/languages/mandarin/content/index.ts';import {pollyRequest,shouldGenerate,hash} from '../scripts/polly-generation.mjs';import {validateProductionAudio} from '../scripts/production-audio.mjs';
const manifest=JSON.parse(readFileSync('docs/A2_AUDIO_MANIFEST.json'));
test('SSML is reproducible, uses authored surface tones and separate moderate rates',()=>{
 const i=itemMap.get('say-again');const a=pollyRequest(i,'natural'),b=pollyRequest(i,'careful_slow');assert.equal(a.ssml,pollyRequest(i,'natural').ssml);assert(a.ssml.includes('yi2-bian4'));assert(i.toneNumbers.includes('yi1'));assert.notEqual(a.fingerprint,b.fingerprint);assert(a.ssml.includes('85%'));assert(b.ssml.includes('75%'));
 assert(pollyRequest(itemMap.get('and-you'),'natural').ssml.includes('ne0'));
});
test('unchanged accepted bytes cannot regenerate and corruption does not silently overwrite them',()=>{
 const e=manifest.assets.find(a=>a.qualityState==='user_accepted'),i=itemMap.get(e.item),b=readFileSync('public'+e.path);assert.equal(shouldGenerate(e,i,pollyRequest(i,e.variant),b),false);assert.throws(()=>shouldGenerate(e,i,pollyRequest(i,e.variant),Buffer.from('corrupt')),/changed/);
});
test('production is Polly-only and all newly generated requests are idempotent',()=>{
 validateProductionAudio(content,manifest);assert(manifest.assets.every(a=>a.provider==='Amazon Polly'&&a.productionUse==='polly_reference'));
 for(const e of manifest.assets.filter(a=>a.inputFingerprint)){const i=itemMap.get(e.item),bytes=readFileSync('public'+e.path);assert.equal(hash(bytes),e.sha256);assert.equal(shouldGenerate(e,i,pollyRequest(i,e.variant),bytes),false);assert.equal(e.qualityState,'needs_human_review');}
});
