import {createHash} from 'node:crypto';
export const hash = value=>createHash('sha256').update(value).digest('hex');
const escape = value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export function pollyRequest(item,variant){
 const tones=item.surfaceToneNumbers??item.toneNumbers;
 const ph=tones.replace(/5\b/g,'0').replaceAll(' ','-');
 const rate=variant==='careful_slow'?75:85;
 const ssml=`<speak><prosody rate="${rate}%"><phoneme alphabet="x-amazon-pinyin" ph="${escape(ph)}">${escape(item.hans)}</phoneme></prosody></speak>`;
 return {ssml,engine:'neural',voice:'Zhiyu',region:'eu-central-1',sampleRate:'24000',fingerprint:hash(JSON.stringify([item.hans,item.toneNumbers,tones,variant,ssml,'neural','Zhiyu','24000']))};
}
export function shouldGenerate(entry,item,request,bytes){
 if(!entry || entry.provider!=='Amazon Polly')return true;
 if(!bytes || hash(bytes)!==entry.sha256)throw Error(`Existing Polly bytes changed/missing: ${entry.path}; refusing automatic replacement`);
 if(entry.inputFingerprint)return entry.inputFingerprint!==request.fingerprint;
 // Preserve accepted A2 synthesis settings; generation is not a blanket style migration.
 if(entry.canonical?.toneNumbers!==item.toneNumbers)throw Error(`Legacy Polly canonical content changed: ${entry.path}; explicit review required`);
 return false;
}
