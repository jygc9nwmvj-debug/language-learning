import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {audioPlan,speechJob,pcmWave,readPcm,assembleDialogue,azureSpeech} from '../scripts/taiwan/audio.mjs';
const canon=JSON.parse(readFileSync('docs/curriculum/china-travel/editorial/editorial.json','utf8'));
const plan=audioPlan(canon);
// In-memory PCM test signal only, never a learner/audio asset or TTS request.
const pcm=Buffer.alloc(4800);for(let n=0;n<2400;n++)pcm.writeInt16LE(Math.round(1000*Math.sin(n/10)),n*2);
const wav=pcmWave(pcm);
test('Azure plan accounts for every canonical sentence and each exact dialogue sentence/role',()=>{
 assert.equal(plan.jobs.length,404);assert.equal(plan.dialogues.length,28);
 assert.equal(new Set(plan.jobs.map(j=>j.id)).size,404);assert.ok(plan.jobs.every(j=>j.locale==='zh-TW'&&j.voice.startsWith('zh-TW-')));
 for(const u of canon.utterances)assert.ok(plan.jobs.some(j=>j.kind==='sentence'&&j.reference===u.id&&j.text===u.hant));
 for(const d of canon.dialogues){const model=plan.dialogues.find(x=>x.id===d.id);assert.deepEqual(model.sentences.map(s=>[s.turn,s.speaker,s.utterance]),d.turns.flatMap((t,n)=>t.utterances.map(k=>[n+1,t.speaker,k])));for(const s of model.sentences)assert.ok(plan.jobs.some(j=>j.id===s.source));}
});
test('fingerprints bind exact SSML/voice and credentials remain only in request headers',async()=>{
 const j=speechJob('sentence','test','你好。','A');const other=speechJob('sentence','test','你好。','B');assert.notEqual(j.fingerprint,other.fingerprint);
 let called=0;const result=await azureSpeech(j,{key:'local-test-key',region:'westeurope'},async(url,options)=>{called++;assert.equal(url,'https://westeurope.tts.speech.microsoft.com/cognitiveservices/v1');assert.equal(options.headers['Ocp-Apim-Subscription-Key'],'local-test-key');assert.equal(options.body,j.ssml);return new Response(wav,{status:200});});assert.equal(called,1);assert.equal(readPcm(result).seconds,.1);assert.equal(JSON.stringify(j).includes('local-test-key'),false);
});
test('missing access stops before any network call; provider errors do not leak body',async()=>{
 let called=false;await assert.rejects(()=>azureSpeech(plan.jobs[0],{},async()=>{called=true;}),/locally configured/);assert.equal(called,false);
 await assert.rejects(()=>azureSpeech(plan.jobs[0],{key:'test',region:'westeurope'},async()=>new Response('provider-private-body',{status:401})),/^Error: Azure synthesis failed \(HTTP 401\); no response body logged\.$/);
 assert.throws(()=>readPcm(Buffer.from('not audio')),/RIFF/);
});
test('dialogue mounting has exact sample boundaries and distinct sentence/turn pauses',()=>{
 const d={sentences:[{turn:1,speaker:'A',utterance:'a',source:'a'},{turn:1,speaker:'A',utterance:'b',source:'b'},{turn:2,speaker:'B',utterance:'c',source:'c'}]};
 const result=assembleDialogue(d,new Map([['a',wav],['b',wav],['c',wav]]));assert.equal(result.boundaries[0].startMs,0);assert.equal(result.boundaries[1].startMs,280);assert.equal(result.boundaries[2].startMs,730);assert.equal(readPcm(result.wav).seconds,.83);
});
