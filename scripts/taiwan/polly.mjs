import {pollyRequest,hash} from '../polly-generation.mjs';
import {pcmWave,readPcm} from './audio.mjs';
export const sampleRate=16000;
export function pollyPlan(canon){
 const words=new Map(canon.words.map(w=>[w.id,w]));const used=new Set(canon.utterances.flatMap(u=>u.words));const jobs=[];
 function add(kind,source,variant){
  const toneNumbers=kind==='word'?source.tones.join(' '):source.toneNumbers;
  const surfaceToneNumbers=kind==='word'?toneNumbers:source.surfaceToneNumbersDraft;
  const model={hans:source.hans,hant:source.hant,toneNumbers,surfaceToneNumbers};
  const request=pollyRequest(model,variant); // Existing voice, phoneme and pace policy.
  const job={id:`${kind}:${source.id}:${variant}`,kind,reference:source.id,variant,provider:'Amazon Polly',voice:request.voice,engine:request.engine,region:request.region,locale:'cmn-CN',sampleRate,format:'pcm',hant:source.hant,hans:source.hans,toneNumbers,surfaceToneNumbers,ssml:request.ssml,path:`/audio/mandarin/tw-polly-${kind}-${source.id}-${variant}.wav`};
  jobs.push({...job,fingerprint:hash(JSON.stringify(job))});
 }
 for(const w of words.values())if(used.has(w.id))add('word',w,'natural');
 for(const u of canon.utterances)for(const variant of ['natural','careful_slow'])add('sentence',u,variant);
 const dialogues=canon.dialogues.flatMap(d=>['natural','careful_slow'].map(variant=>({id:`dialogue:${d.id}:${variant}`,reference:d.id,variant,path:`/audio/mandarin/tw-polly-dialogue-${d.id.toLowerCase()}-${variant}.wav`,sentences:d.turns.flatMap((t,n)=>t.utterances.map(uid=>({turn:n+1,speaker:t.speaker,utterance:uid,source:`sentence:${uid}:${variant}`})))})));
 return {version:1,provider:'Amazon Polly',voice:'Zhiyu',locale:'cmn-CN',vocabularyRegion:'Taiwan',sampleRate,sourceSha256:hash(JSON.stringify(canon)),jobs,dialogues,speakerPolicy:'One AWS Mandarin voice; authored roles remain separate with turn pauses. No Taiwan accent or distinct speakers claimed.'};
}
export function screenPollyPcm(pcm){
 const wav=pcmWave(pcm,sampleRate),m=readPcm(wav,sampleRate);
 if(m.clippingRatio>.0001)throw Error('Polly PCM clipping screen failed');
 const frame=Math.round(sampleRate*.01),levels=[];let peak=0;
 for(let n=0;n<pcm.length/2;n+=frame){let squares=0,count=0;for(let j=n;j<Math.min(n+frame,pcm.length/2);j++){const x=pcm.readInt16LE(j*2)/32768;peak=Math.max(peak,Math.abs(x));squares+=x*x;count++;}levels.push(Math.sqrt(squares/count));}
 const threshold=Math.max(.003,Math.max(...levels)*.035),active=levels.map(x=>x>threshold),first=active.indexOf(true),last=active.lastIndexOf(true);
 if(first<0)throw Error('Polly PCM has no active speech');
 const db=x=>20*Math.log10(Math.max(x,1e-8));const rms=Math.sqrt(levels.filter((_,n)=>active[n]).reduce((s,x)=>s+x*x,0)/active.filter(Boolean).length);
 const warnings=[];if(db(rms)<-32||db(rms)>-9)warnings.push('active_level');if(first*.01>.3)warnings.push('leading_silence');if(m.seconds-(last+1)*.01>.4)warnings.push('trailing_silence');
 return {wav,validation:{status:'passed',scope:'PCM decode, duration, active signal and clipping; levels and margins are warnings. No acoustic or Mandarin-tone certification.',seconds:m.seconds,sampleRate,rmsDbfs:db(rms),peakDbfs:db(peak),clippingRatio:m.clippingRatio,leadingSeconds:first*.01,trailingSeconds:Math.max(0,m.seconds-(last+1)*.01),warnings}};
}
