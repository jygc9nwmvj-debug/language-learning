export function validateWav(buffer, filename = 'audio') {
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WAVE') throw new Error(`Not WAV: ${filename}`);
  let data, byteRate = 0;
  for (let offset = 12; offset + 8 <= buffer.length;) {
    const tag = buffer.toString('ascii', offset, offset + 4), length = buffer.readUInt32LE(offset + 4);
    if (offset + 8 + length > buffer.length) throw new Error(`Truncated WAV: ${filename}`);
    if (tag === 'fmt ' && length >= 16) byteRate = buffer.readUInt32LE(offset + 16);
    if (tag === 'data') data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += 8 + length + (length % 2);
  }
  if (!data || !byteRate || data.length / byteRate < .1 || !data.some(byte => byte !== 0)) throw new Error(`Empty or silent WAV: ${filename}`);
  return data.length / byteRate;
}

// Container integrity only; audibility/phonetics are checked separately.
export function validateAudio(buffer, filename = 'audio') {
  if (!filename.endsWith('.mp3')) return validateWav(buffer, filename);
  let offset = 0, frames = 0, duration = 0;
  if (buffer.toString('ascii', 0, 3) === 'ID3') {
    if (buffer.length < 10) throw new Error(`Truncated MP3: ${filename}`);
    offset = 10 + ((buffer[6]&127)*2097152+(buffer[7]&127)*16384+(buffer[8]&127)*128+(buffer[9]&127));
    if (buffer[5]&16) offset += 10;
  }
  while (offset + 4 <= buffer.length) {
    if (buffer.length-offset===128 && buffer.toString('ascii',offset,offset+3)==='TAG') { offset+=128; break; }
    const h=buffer.readUInt32BE(offset), version=(h>>>19)&3, layer=(h>>>17)&3, rateIndex=(h>>>10)&3, bitIndex=(h>>>12)&15;
    if ((h>>>21)!==2047 || version===1 || layer!==1 || rateIndex===3 || bitIndex===0 || bitIndex===15) throw new Error(`Invalid MP3 frame: ${filename}`);
    const rate=[44100,48000,32000][rateIndex]/(version===3?1:version===2?2:4);
    const kbps=(version===3?[0,32,40,48,56,64,80,96,112,128,160,192,224,256,320]:[0,8,16,24,32,40,48,56,64,80,96,112,128,144,160])[bitIndex];
    const size=Math.floor((version===3?144:72)*kbps*1000/rate)+((h>>>9)&1);
    if(offset+size>buffer.length) throw new Error(`Truncated MP3: ${filename}`);
    offset+=size;frames++;duration+=(version===3?1152:576)/rate;
  }
  if(offset!==buffer.length || frames<2 || duration<.1) throw new Error(`Empty or truncated MP3: ${filename}`);
  return duration;
}

export function validateAudioQuality(entry) {
  if (!['generated','technically_validated','user_accepted','needs_human_review'].includes(entry.qualityState)) throw new Error('Invalid audio quality state');
  if (entry.qualityState !== 'generated' && entry.technicalValidation?.status !== 'passed') throw new Error('Missing technical validation');
  if (entry.qualityState === 'user_accepted' && !['pronunciation','tone','pace'].every(k => entry.userReview?.ratings?.[k] === 'yes')) throw new Error('Missing complete user acceptance');
}
