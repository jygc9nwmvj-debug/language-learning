import {readFileSync,writeFileSync,mkdirSync,existsSync,renameSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {audioPlan,azureSpeech,assembleDialogue,readPcm,digest} from './taiwan/audio.mjs';
const canonicalPath='docs/curriculum/china-travel/editorial/editorial.json';
export async function run(args=process.argv.slice(2),env=process.env){
 const plan=audioPlan(JSON.parse(readFileSync(canonicalPath,'utf8')));
 const option=name=>args.includes(name)?args[args.indexOf(name)+1]:undefined;
 const sample=option('--sample');const dialogue=sample?plan.dialogues.find(d=>d.id===sample):undefined;
 if(sample&&!dialogue)throw Error('Unknown sample dialogue');
 const requested=dialogue?new Set(dialogue.sentences.map(s=>s.source)):null;
 const jobs=plan.jobs.filter(j=>!requested||requested.has(j.id));
 const summary={mode:args.includes('--generate')?'generate':'plan',locale:plan.locale,voices:plan.voices,requests:jobs.length,textCharacters:jobs.reduce((n,j)=>n+[...j.text].length,0),dialogues:dialogue?1:plan.dialogues.length,sourceSha256:plan.sourceSha256};
 if(!args.includes('--generate')){
  if(args.includes('--write-plan'))writeFileSync('docs/curriculum/china-travel/AUDIO_PLAN.json',JSON.stringify(plan,null,2)+'\n');
  console.log(JSON.stringify(summary,null,2));return summary;
 }
 if(!sample&&!args.includes('--all'))throw Error('Select --sample G07 or explicit --all; no implicit full synthesis.');
 const key=env.AZURE_SPEECH_KEY??env.SPEECH_KEY,region=env.AZURE_SPEECH_REGION??env.SPEECH_REGION;
 if(!key||!/^[a-z0-9]+$/.test(region??''))throw Error('Azure Speech key and region are missing locally. No synthesis started.');
 // Samples stay in work/, outside app/publication assets. Installing the batch is
 // a separate explicit choice after listening to the connected pilot dialogue.
 const directory='work/taiwan-audio';mkdirSync(directory,{recursive:true});
 const manifestPath=directory+'/manifest.json';let manifest=existsSync(manifestPath)?JSON.parse(readFileSync(manifestPath,'utf8')):{version:1,assets:[],dialogues:[]};
 const bytes=new Map();
 function persist(){writeFileSync(manifestPath+'.tmp',JSON.stringify(manifest,null,2)+'\n');renameSync(manifestPath+'.tmp',manifestPath);}
 for(const job of jobs){
  const file=directory+'/'+job.path.split('/').at(-1),prior=manifest.assets.find(a=>a.id===job.id);
  let wav;
  if(prior?.fingerprint===job.fingerprint&&existsSync(file)&&digest(readFileSync(file))===prior.sha256){wav=readFileSync(file);readPcm(wav);}
  else {
   if(prior?.quality==='accepted')throw Error('Replacing accepted audio needs an explicit separate request.');
   wav=await azureSpeech(job,{key,region});writeFileSync(file+'.tmp',wav);renameSync(file+'.tmp',file);
   const technical=readPcm(wav);
   manifest.assets=manifest.assets.filter(a=>a.id!==job.id);manifest.assets.push({...job,file,sha256:digest(wav),seconds:technical.seconds,rms:technical.rms,clippingRatio:technical.clippingRatio,provider:plan.provider,region,sourceSha256:plan.sourceSha256,quality:'needs_human_listening',technicalOnly:true,generatedAt:new Date().toISOString()});persist();
  }
  bytes.set(job.id,wav);
 }
 for(const d of dialogue?[dialogue]:plan.dialogues){
  const assembled=assembleDialogue(d,bytes),file=directory+'/'+d.path.split('/').at(-1);writeFileSync(file+'.tmp',assembled.wav);renameSync(file+'.tmp',file);
  manifest.dialogues=manifest.dialogues.filter(x=>x.id!==d.id);manifest.dialogues.push({...d,file,sha256:digest(assembled.wav),boundaries:assembled.boundaries,seconds:assembled.seconds,sourceSha256:plan.sourceSha256,quality:'needs_human_listening',technicalOnly:true});persist();
 }
 console.log(JSON.stringify({...summary,filesIn:directory,quality:'technical screens only; not published or installed'},null,2));return summary;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)run().catch(error=>{console.error(error.message);process.exitCode=1;});
