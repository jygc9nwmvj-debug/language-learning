import {readFileSync,writeFileSync,existsSync,mkdirSync,renameSync,rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {content} from '../src/languages/mandarin/content/index.ts';
import {pollyRequest,shouldGenerate,hash} from './polly-generation.mjs';
import {validateAudio} from './audio-validation.mjs';
const manifestPath='docs/A2_AUDIO_MANIFEST.json';
const manifest=JSON.parse(readFileSync(manifestPath));
const dry=process.argv.includes('--dry-run');const python=process.env.AUDIO_QA_PYTHON||'python3';
const profile=process.env.AWS_PROFILE||'mandarin-a2';let count=0;
if(!dry)execFileSync(python,['-c','import soundfile,numpy,parselmouth'],{stdio:['ignore','pipe','pipe']});
mkdirSync('work/polly-d',{recursive:true});
for(const item of content.items)for(const variant of ['natural','careful_slow']){
 const path=variant==='natural'?item.audio:item.slowAudio;if(!path)continue;
 const entry=manifest.assets.find(a=>a.item===item.id&&a.variant===variant);
 const request=pollyRequest(item,variant);const file='public'+path;
 if(!shouldGenerate(entry,item,request,existsSync(file)?readFileSync(file):null))continue;
 if(entry?.qualityState==='user_accepted')throw Error(`Accepted audio requires explicit replacement review: ${path}`);
 count++;if(dry){console.log(`Missing/changed: ${item.id}/${variant}`);continue;}
 const ssmlFile=`work/polly-d/${item.id}-${variant}.ssml`,temp=`work/polly-d/${item.id}-${variant}.mp3`;
 writeFileSync(ssmlFile,request.ssml);
 try{execFileSync('aws',['polly','synthesize-speech','--profile',profile,'--region',request.region,'--engine',request.engine,'--voice-id',request.voice,'--language-code','cmn-CN','--output-format','mp3','--sample-rate',request.sampleRate,'--text-type','ssml','--text',`file://${ssmlFile}`,temp,'--no-cli-pager'],{stdio:['ignore','pipe','pipe']});}catch{throw Error(`Polly request failed for ${item.id}/${variant}. Check local AWS login/permissions; credentials are never logged.`);}
 const bytes=readFileSync(temp);validateAudio(bytes,path);
 const technicalValidation=JSON.parse(execFileSync(python,['scripts/screen-polly.py'],{input:JSON.stringify({file:temp,tones:item.toneNumbers,variant}),encoding:'utf8',stdio:['pipe','pipe','pipe']}));
 if(technicalValidation.status!=='passed'){rmSync(temp);throw Error(`Technical validation failed for ${item.id}/${variant}`);}
 const next={item:item.id,variant,text:item.hans,pinyin:item.pinyin,path,sha256:hash(bytes),seconds:technicalValidation.measurements.durationSeconds,provider:'Amazon Polly',productionUse:'polly_reference',engine:request.engine,voice:request.voice,region:request.region,ssml:request.ssml,inputFingerprint:request.fingerprint,canonical:{item:item.id,hans:item.hans,hant:item.hant,toneNumbers:item.toneNumbers},surfaceToneNumbers:item.surfaceToneNumbers??item.toneNumbers,qualityState:'needs_human_review',stateHistory:['generated','technically_validated','needs_human_review'],technicalValidation,generatedAt:new Date().toISOString()};
 renameSync(temp,file);manifest.assets=manifest.assets.filter(a=>!(a.item===item.id&&a.variant===variant));manifest.assets.push(next);
 writeFileSync(manifestPath+'.tmp',JSON.stringify(manifest,null,2)+'\n');renameSync(manifestPath+'.tmp',manifestPath);
 console.log(`Validated provisional: ${item.id}/${variant}; warnings: ${technicalValidation.measurements.issues.join(',')||'none'}`);
}
console.log(`${dry?'Planned':'Generated'} ${count}; unchanged Polly assets preserved.`);
