import {readFileSync,writeFileSync,existsSync,mkdirSync,renameSync,rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pollyPlan,screenPollyPcm,sampleRate} from './taiwan/polly.mjs';
import {assembleDialogue,digest} from './taiwan/audio.mjs';
const exec=promisify(execFile),canon=JSON.parse(readFileSync('docs/curriculum/china-travel/editorial/editorial.json','utf8')),plan=pollyPlan(canon);
const args=process.argv.slice(2),generate=args.includes('--generate'),sample=args.includes('--sample')?args[args.indexOf('--sample')+1]:undefined;
const manifestPath='docs/curriculum/china-travel/POLLY_AUDIO_MANIFEST.json';
let manifest=existsSync(manifestPath)?JSON.parse(readFileSync(manifestPath,'utf8')):{...plan,jobs:undefined,assets:[],dialogues:[]};
const selected=sample?plan.dialogues.filter(d=>d.reference===sample):plan.dialogues;
if(sample&&!selected.length)throw Error('Unknown sample dialogue');
const wanted=sample?new Set(selected.flatMap(d=>d.sentences.map(s=>s.source))):null;
const jobs=plan.jobs.filter(j=>!wanted||wanted.has(j.id));
if(!generate){console.log(JSON.stringify({provider:plan.provider,voice:plan.voice,locale:plan.locale,requests:jobs.length,dialogues:selected.length,textCharacters:jobs.reduce((n,j)=>n+[...j.hans].length,0)},null,2));process.exit(0);}
if(!sample&&!args.includes('--all'))throw Error('Explicit --all or --sample required');
mkdirSync('work/taiwan-polly',{recursive:true});mkdirSync('public/audio/mandarin',{recursive:true});
let done=0,failed=false;const queue=[...jobs],bytes=new Map();
function persist(){manifest={...manifest,sourceSha256:plan.sourceSha256,voice:plan.voice,locale:plan.locale,vocabularyRegion:'Taiwan',sampleRate,speakerPolicy:plan.speakerPolicy};writeFileSync(manifestPath+'.tmp',JSON.stringify(manifest,null,2)+'\n');renameSync(manifestPath+'.tmp',manifestPath);}
async function worker(){while(queue.length&&!failed){const j=queue.shift(),file='public'+j.path,prior=manifest.assets.find(a=>a.id===j.id);
 try{
  if(prior?.fingerprint===j.fingerprint&&existsSync(file)&&digest(readFileSync(file))===prior.sha256){bytes.set(j.id,readFileSync(file));done++;continue;}
  if(prior)throw Error(`Existing Taiwan audio differs: ${j.id}; refusing automatic overwrite`);
  const stem=resolve('work/taiwan-polly/'+j.id.replaceAll(':','-'));writeFileSync(stem+'.ssml',j.ssml);
  let completed=false;
  for(let retry=0;retry<3&&!completed;retry++){
   try{await exec('aws',['polly','synthesize-speech','--profile',process.env.AWS_PROFILE||'mandarin-a2','--region',j.region,'--engine',j.engine,'--voice-id',j.voice,'--language-code','cmn-CN','--output-format','pcm','--sample-rate',String(sampleRate),'--text-type','ssml','--text','file://'+stem+'.ssml',stem+'.pcm','--no-cli-pager','--cli-connect-timeout','10','--cli-read-timeout','45'],{timeout:90000,maxBuffer:200000});completed=true;}
   catch(e){if(retry===2||!/Throttl|TooMany|ServiceUnavailable/i.test(e.stderr??''))throw Error(`AWS synthesis failed for ${j.id}; local AWS login/permissions or provider response require attention. No credentials logged.`);await new Promise(r=>setTimeout(r,1000*2**retry));}
  }
  const {wav,validation}=screenPollyPcm(readFileSync(stem+'.pcm'));writeFileSync(file+'.tmp',wav);renameSync(file+'.tmp',file);bytes.set(j.id,wav);
  manifest.assets.push({...j,sha256:digest(wav),technicalValidation:validation,qualityState:'needs_human_review',generatedAt:new Date().toISOString()});persist();rmSync(stem+'.pcm');done++;
  if(done%25===0)console.log(`Taiwan references ${done}/${jobs.length}`);
 }catch(e){failed=true;throw e;}
}}
const results=await Promise.allSettled(Array.from({length:3},worker));const failure=results.find(r=>r.status==='rejected');if(failure){console.error(failure.reason.message);process.exit(1);}
for(const d of selected){const assembled=assembleDialogue(d,bytes,sampleRate),file='public'+d.path,prior=manifest.dialogues.find(a=>a.id===d.id);
 if(prior&&prior.sha256!==digest(assembled.wav))throw Error('Existing dialogue assembly differs; refusing overwrite');
 writeFileSync(file,assembled.wav);manifest.dialogues=manifest.dialogues.filter(a=>a.id!==d.id);manifest.dialogues.push({...d,sampleRate,sha256:digest(assembled.wav),seconds:assembled.seconds,boundaries:assembled.boundaries,qualityState:'needs_human_review',technicalValidation:{status:'passed',scope:'Assembly of screened PCM references with exact sentence boundaries; no acoustic review.'}});persist();}
console.log(`Taiwan audio complete: ${manifest.assets.length} reference files, ${manifest.dialogues.length} dialogue files. No deployment or merge.`);
