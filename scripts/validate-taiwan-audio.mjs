import {readFileSync,existsSync} from 'node:fs';
import {productionAudioBindings,explorationAudioBindings} from '../src/languages/mandarin/taiwan/audio-bindings.ts';
import {pollyPlan,sampleRate} from './taiwan/polly.mjs';
import {readPcm,digest,assembleDialogue} from './taiwan/audio.mjs';
const canon=JSON.parse(readFileSync('docs/curriculum/china-travel/editorial/editorial.json','utf8'));
const manifest=JSON.parse(readFileSync('docs/curriculum/china-travel/POLLY_AUDIO_MANIFEST.json','utf8'));
const plan=pollyPlan(canon),bytes=new Map();
if(manifest.sourceSha256!==plan.sourceSha256||manifest.assets.length!==plan.jobs.length||manifest.dialogues.length!==plan.dialogues.length)throw Error('Incomplete/stale Taiwan audio manifest');
if(new Set(manifest.assets.map(a=>a.id)).size!==plan.jobs.length||new Set(manifest.dialogues.map(a=>a.id)).size!==56)throw Error('Duplicate Taiwan audio IDs');
for(const job of plan.jobs){const entry=manifest.assets.find(a=>a.id===job.id);if(!entry||entry.fingerprint!==job.fingerprint||entry.path!==job.path||entry.technicalValidation?.status!=='passed'||!['needs_human_review','user_accepted'].includes(entry.qualityState))throw Error(`Invalid Taiwan audio reference: ${job.id}`);const path='public'+entry.path;if(!existsSync(path))throw Error(`Missing Taiwan asset ${path}`);const raw=readFileSync(path);if(digest(raw)!==entry.sha256)throw Error(`Taiwan bytes changed: ${job.id}`);readPcm(raw,sampleRate);bytes.set(job.id,raw);}
for(const d of plan.dialogues){const entry=manifest.dialogues.find(a=>a.id===d.id),expected=assembleDialogue(d,bytes,sampleRate);if(!entry||JSON.stringify(entry.boundaries)!==JSON.stringify(expected.boundaries)||digest(readFileSync('public'+d.path))!==entry.sha256||digest(expected.wav)!==entry.sha256)throw Error(`Taiwan dialogue assembly mismatch: ${d.id}`);readPcm(expected.wav,sampleRate);}
console.log(`Taiwan audio: ${plan.jobs.length}/${plan.jobs.length} references and ${plan.dialogues.length}/${plan.dialogues.length} dialogue files; exact canonical mapping/bytes/PCM/boundaries. Technical checks, not acoustic certification.`);

const references=new Set(manifest.assets.map(a=>a.id));
const productions=productionAudioBindings(canon),details=explorationAudioBindings(canon);
for(const b of [...productions,...details])if(!references.has(`${b.audio.kind}:${b.audio.reference}:natural`))throw Error('Missing didactic audio binding: '+JSON.stringify(b));
if(productions.length!==33||details.length!==614)throw Error('Didactic audio population changed');
console.log(`Didactic coverage: ${productions.length}/33 complete production models, ${details.length}/614 context-aware exploration bindings.`);
