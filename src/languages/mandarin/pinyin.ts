// Number keys are an input convention; they never provide spoken-tone evidence.
export function numberedToPinyin(value: string) {
  return value.replace(/([a-zü:]+)([0-5])/gi, (_, raw: string, n: string) => {
    const syllable = raw.toLowerCase().replace(/u:/g, 'ü').replace(/v/g, 'ü');
    const tone = Number(n); if (tone === 0 || tone === 5) return syllable;
    let i = syllable.indexOf('a');
    if (i < 0) i = syllable.indexOf('e');
    if (i < 0 && syllable.includes('ou')) i = syllable.indexOf('o');
    if (i < 0) for (let j = syllable.length - 1; j >= 0; j--) if ('iouü'.includes(syllable[j])) { i = j; break; }
    if (i < 0) return syllable + n;
    return (syllable.slice(0, i + 1) + ['','\u0304','\u0301','\u030c','\u0300'][tone] + syllable.slice(i + 1)).normalize('NFC');
  });
}
