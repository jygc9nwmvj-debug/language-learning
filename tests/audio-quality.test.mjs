import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validateAudio,validateAudioQuality} from '../scripts/audio-validation.mjs';
const manifest=JSON.parse(readFileSync('docs/A2_AUDIO_MANIFEST.json'));
const review=JSON.parse(readFileSync('docs/A2_POLLY_USER_ACCEPTANCE.json'));
test('all 12 user-accepted audio files preserve the exact reviewed bytes',()=>{
 const accepted=manifest.assets.filter(a=>a.qualityState==='user_accepted');assert.equal(accepted.length,12);
 for(const a of accepted){validateAudioQuality(a);const hash=createHash('sha256').update(readFileSync('public'+a.path)).digest('hex');assert.equal(hash,a.sha256);assert(review.assets.some(x=>x.sha256===hash));}
 const pending=manifest.assets.filter(a=>a.qualityState==='needs_human_review');assert(pending.length>=3);assert(pending.some(a=>a.item==='askname'&&a.ssml.includes('80%')));
});
test('quality states cannot claim technical validation or user acceptance without evidence',()=>{
 for(const state of ['technically_validated','user_accepted','needs_human_review'])assert.throws(()=>validateAudioQuality({qualityState:state}),/technical/);
 assert.throws(()=>validateAudioQuality({qualityState:'approved'}),/state/);
 assert.throws(()=>validateAudioQuality({qualityState:'user_accepted',technicalValidation:{status:'passed'},userReview:{ratings:{pronunciation:'yes',tone:'unsure',pace:'yes'}}}),/acceptance/);
 validateAudioQuality({qualityState:'generated'});
 validateAudioQuality({qualityState:'technically_validated',technicalValidation:{status:'passed'}});
});
test('MP3 guard rejects truncated and header-only files',()=>{
 const a=manifest.assets.find(a=>a.path.endsWith('.mp3')),bytes=readFileSync('public'+a.path);
 assert(validateAudio(bytes,a.path)>.1);
 assert.throws(()=>validateAudio(bytes.subarray(0,bytes.length-20),a.path),/MP3/);
 assert.throws(()=>validateAudio(Buffer.from('ID3'),a.path),/MP3/);
});
