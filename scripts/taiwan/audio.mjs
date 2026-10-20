import {createHash} from 'node:crypto';
export const voices={A:'zh-TW-HsiaoChenNeural',B:'zh-TW-YunJheNeural'};
const digest=value=>createHash('sha256').update(value).digest('hex');
const xml=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
export function speechJob(kind,id,text,role='A'){
 if(!/^[a-z0-9-]+$/i.test(id)||!voices[role]||!text.trim())throw Error('Invalid authored speech reference');
 const ssml=`<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-TW"><voice name="${voices[role]}">${xml(text)}</voice></speak>`;
 const request={id:`${kind}:${id}:${role}`,kind,reference:id,role,voice:voices[role],locale:'zh-TW',text,ssml,format:'riff-24khz-16bit-mono-pcm',path:`/audio/mandarin/taiwan-${kind}-${id.toLowerCase()}-${role.toLowerCase()}.wav`};
 return {...request,fingerprint:digest(JSON.stringify(request))};
}
export function audioPlan(canon){
 const jobs=new Map();const usedWords=new Set(canon.utterances.flatMap(u=>u.words));
 for(const w of canon.words.filter(w=>usedWords.has(w.id))){const j=speechJob('word',w.id,w.hant);jobs.set(j.id,j);}
 for(const u of canon.utterances){const j=speechJob('sentence',u.id,u.hant);jobs.set(j.id,j);}
 const dialogues=canon.dialogues.map(d=>({id:d.id,path:`/audio/mandarin/taiwan-dialogue-${d.id.toLowerCase()}.wav`,sentences:d.turns.flatMap((t,n)=>t.utterances.map(uid=>{
  const u=canon.utterances.find(u=>u.id===uid);if(!u)throw Error('Unknown dialogue utterance');
  const j=speechJob('sentence',uid,u.hant,t.speaker);jobs.set(j.id,j);
  return {turn:n+1,speaker:t.speaker,utterance:uid,source:j.id};
 }))}));
 return {version:1,locale:'zh-TW',provider:'Azure Speech',voices,sourceSha256:digest(JSON.stringify(canon)),jobs:[...jobs.values()],dialogues,quality:'planned; no synthesis or acoustic approval',assembly:'PCM sentence models with explicit boundaries; transitions require listening to the pilot'};
}
export function readPcm(wav,sampleRate=24000){
 if(wav.toString('ascii',0,4)!=='RIFF'||wav.toString('ascii',8,12)!=='WAVE')throw Error('Expected RIFF/WAVE audio');
 let pcm,valid=false;
 for(let offset=12;offset+8<=wav.length;){const kind=wav.toString('ascii',offset,offset+4),size=wav.readUInt32LE(offset+4),start=offset+8;
  if(start+size>wav.length)throw Error('Truncated WAV chunk');
  if(kind==='fmt '){valid=size>=16&&wav.readUInt16LE(start)===1&&wav.readUInt16LE(start+2)===1&&wav.readUInt32LE(start+4)===sampleRate&&wav.readUInt16LE(start+14)===16;}
  if(kind==='data')pcm=wav.subarray(start,start+size);
  offset=start+size+(size%2);
 }
 if(!valid||!pcm?.length||pcm.length%2)throw Error('Unexpected PCM sample rate, channels or sample width');
 let squares=0,clipped=0;
 for(let i=0;i<pcm.length;i+=2){const x=pcm.readInt16LE(i);squares+=x*x;if(Math.abs(x)>=32760)clipped++;}
 const samples=pcm.length/2,rms=Math.sqrt(squares/samples),seconds=samples/sampleRate;
 if(seconds<.08||seconds>120||rms<1||clipped/samples>.02)throw Error('PCM technical screen failed (duration, silence or clipping)');
 return {pcm,seconds,rms,clippingRatio:clipped/samples};
}
export function pcmWave(pcm,sampleRate=24000){
 const header=Buffer.alloc(44);header.write('RIFF');header.writeUInt32LE(36+pcm.length,4);header.write('WAVE',8);header.write('fmt ',12);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(1,22);header.writeUInt32LE(sampleRate,24);header.writeUInt32LE(sampleRate*2,28);header.writeUInt16LE(2,32);header.writeUInt16LE(16,34);header.write('data',36);header.writeUInt32LE(pcm.length,40);return Buffer.concat([header,pcm]);
}
export function assembleDialogue(dialogue,assets,sampleRate=24000){
 const chunks=[],boundaries=[];let samples=0;
 for(const [n,s]of dialogue.sentences.entries()){
  const asset=assets.get(s.source);if(!asset)throw Error('Missing sentence for dialogue assembly');
  const {pcm}=readPcm(asset,sampleRate);const start=samples;chunks.push(pcm);samples+=pcm.length/2;
  boundaries.push({...s,startSample:start,endSample:samples,startMs:start/(sampleRate/1000),endMs:samples/(sampleRate/1000)});
  if(n<dialogue.sentences.length-1){const pause=dialogue.sentences[n+1].turn===s.turn?180:350;const silence=Buffer.alloc(Math.round(pause*sampleRate/1000)*2);chunks.push(silence);samples+=silence.length/2;}
 }
 return {wav:pcmWave(Buffer.concat(chunks),sampleRate),boundaries,seconds:samples/sampleRate};
}
export async function azureSpeech(job,{key,region},fetcher=fetch){
 if(!key||!/^[a-z0-9]+$/.test(region??''))throw Error('Azure Speech requires a locally configured key and region. No synthesis started.');
 const result=await fetcher(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,{method:'POST',headers:{'Ocp-Apim-Subscription-Key':key,'Content-Type':'application/ssml+xml','X-Microsoft-OutputFormat':job.format,'User-Agent':'mandarin-taiwan-local-authoring'},body:job.ssml,signal:AbortSignal.timeout(60000)});
 // Do not print provider response bodies or credential-bearing request objects.
 if(!result.ok)throw Error(`Azure synthesis failed (HTTP ${result.status}); no response body logged.`);
 const wav=Buffer.from(await result.arrayBuffer());readPcm(wav);return wav;
}
export {digest};
