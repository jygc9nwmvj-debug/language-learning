import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pollyPlan,sampleRate} from '../scripts/taiwan/polly.mjs';
import {assembleDialogue,readPcm,digest} from '../scripts/taiwan/audio.mjs';
import {taiwanAudio,taiwanAudioPaths,taiwanAudioReady} from '../src/languages/mandarin/taiwan/audio.ts';
const canon=JSON.parse(readFileSync('docs/curriculum/china-travel/editorial/editorial.json'));
const manifest=JSON.parse(readFileSync('docs/curriculum/china-travel/POLLY_AUDIO_MANIFEST.json'));
const plan=pollyPlan(canon);
test('AWS population and app routing bind exact approved Taiwan wording to every available file',()=>{
 assert.equal(plan.jobs.length,517);assert.equal(plan.dialogues.length,56);assert.equal(taiwanAudioReady,true);assert.equal(taiwanAudioPaths.length,573);
 for(const j of plan.jobs){const source=j.kind==='model'?canon.exercises.find(x=>x.id.replaceAll(':','-')===j.reference).expected[0]:(j.kind==='word'?canon.words:canon.utterances).find(x=>x.id===j.reference);assert.equal(j.hant,source.hant);assert.equal(j.hans,source.hans);assert.equal(j.voice,'Zhiyu');assert.equal(j.locale,'cmn-CN');assert.equal(taiwanAudio(j.kind,j.reference,j.variant),j.path);const entry=manifest.assets.find(a=>a.id===j.id);assert.equal(entry.fingerprint,j.fingerprint);assert.equal(digest(readFileSync('public'+j.path)),entry.sha256);}
});
test('all dialogue variants preserve canonical turn order and use exact sentence bytes at 16kHz',()=>{
 const bytes=new Map(manifest.assets.map(a=>[a.id,readFileSync('public'+a.path)]));
 for(const d of plan.dialogues){const source=canon.dialogues.find(x=>x.id===d.reference);assert.deepEqual(d.sentences.map(s=>[s.turn,s.speaker,s.utterance]),source.turns.flatMap((t,n)=>t.utterances.map(u=>[n+1,t.speaker,u])));const expected=assembleDialogue(d,bytes,sampleRate),entry=manifest.dialogues.find(a=>a.id===d.id);assert.deepEqual(expected.boundaries,entry.boundaries);assert.equal(digest(expected.wav),entry.sha256);assert.ok(readPcm(expected.wav,16000).seconds>0);assert.equal(taiwanAudio('dialogue',d.reference,d.variant),d.path);}
});

import {productionAudioBindings,explorationAudioBindings} from '../src/languages/mandarin/taiwan/audio-bindings.ts';
test('every production has one audible full model; only the exact missing time model requires synthesis',()=>{
 const bindings=productionAudioBindings(canon);assert.equal(bindings.length,33);
 assert.deepEqual(bindings.filter(b=>b.generated).map(b=>[b.exercise,b.model.hant]),[['produce:E08.C02','下午兩點半']]);
 for(const b of bindings)assert.ok(taiwanAudio(b.audio.kind,b.audio.reference));
});
test('all exploration references bind the actual word; contextual tone cases use the original sentence',()=>{
 const bindings=explorationAudioBindings(canon);assert.equal(bindings.length,614);assert.equal(bindings.filter(b=>b.decision==='context_sentence').length,113);
 for(const b of bindings)assert.ok(taiwanAudio(b.audio.kind,b.audio.reference));
 assert.equal(bindings.find(b=>b.utterance==='welcome'&&b.word==='bu').audio.kind,'sentence');
 assert.equal(bindings.find(b=>b.utterance==='hello'&&b.word==='ni').audio.kind,'sentence');
 assert.equal(bindings.find(b=>b.utterance==='thanks'&&b.word==='xiexie').audio.kind,'word');
 const changed=structuredClone(canon);changed.utterances[0].exploration[0].word='wo';assert.throws(()=>explorationAudioBindings(changed),/mismatch/);
});
