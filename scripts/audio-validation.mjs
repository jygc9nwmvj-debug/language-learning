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
