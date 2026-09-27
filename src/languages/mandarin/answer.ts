import type { Item } from './schema/content.ts';
const marks: Record<string, number> = { '\u0304': 1, '\u0301': 2, '\u030c': 3, '\u0300': 4 };
export function normalizeText(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase().replace(/[，。！？,.!?;:]/g, ' ').replace(/\s+/g, ' ').trim();
}
function pinyin(value: string) {
  const normalized = value.toLowerCase().normalize('NFC').replace(/u:/g, 'ü').replace(/v/g, 'ü');
  const tones: number[] = [];
  let base = '';
  for (const char of normalized.normalize('NFD')) {
    if (marks[char]) tones.push(marks[char]);
    else if (/[0-5]/.test(char)) tones.push(Number(char) || 5);
    else if (char === '\u0308') base += ':';
    else if (/[a-z]/.test(char)) base += char;
  }
  return { base, tones, valid: !/[^a-zü\u0300-\u036f0-5\s'’.,!?。，！？-]/i.test(normalized.normalize('NFD')) };
}
export type Interpretation = {
  result: 'success' | 'failure' | 'unsure'; content: 'correct' | 'partial' | 'unknown';
  syllables: 'correct' | 'unknown'; toneNotation: 'correct' | 'omitted' | 'different' | 'unknown';
  spokenTones: 'unknown'; script: 'hanzi' | 'pinyin' | 'unknown'; confidence: 'high' | 'low';
  needsClarification: boolean;
};
export function interpretAnswer(input: string, item: Item, name = ''): Interpretation {
  let value = normalizeText(input.replace(/u:/gi, 'ü'));
  const base: Interpretation = { result: 'failure', content: 'unknown', syllables: 'unknown', toneNotation: 'unknown', spokenTones: 'unknown', script: 'unknown', confidence: 'low', needsClarification: false };
  if (item.id === 'wojiao') {
    const slot = normalizeText(name);
    if (!slot || !value.endsWith(slot)) return { ...base, content: 'partial' };
    value = value.slice(0, -slot.length).trim();
  }
  if ([item.hant, item.hans].map(normalizeText).includes(value)) return { ...base, result: 'success', content: 'correct', script: 'hanzi', confidence: 'high' };
  const expected = pinyin(item.pinyin), actual = pinyin(value);
  if (actual.valid && actual.base === expected.base) return {
    ...base, result: 'success', content: 'correct', syllables: 'correct', script: 'pinyin', confidence: 'high',
    toneNotation: writtenTones(value, item),
  };
  // A possible typo asks for a new attempt; it never earns independent credit automatically.
  if (actual.valid && actual.base.length >= 4 && editDistance(actual.base, expected.base) === 1) return { ...base, result: 'unsure', needsClarification: true };
  return base;
}
function editDistance(a: string, b: string) {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) next[j] = Math.min(next[j - 1] + 1, row[j] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    row = next;
  }
  return row[b.length];
}

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
function writtenTones(value: string, item: Item): Interpretation['toneNotation'] {
  const chars = [...value.toLowerCase().replace(/u:/g, 'ü').replace(/v/g, 'ü').normalize('NFD').replace(/[\s'’.,!?。，！？-]/g, '')];
  let cursor = 0, missing = false;
  for (let i = 0; i < item.syllables.length; i++) {
    let tone: number | undefined;
    for (const letter of item.syllables[i].normalize('NFD')) {
      if (chars[cursor++] !== letter) return 'different';
      if (marks[chars[cursor]]) { if (tone) return 'different'; tone = marks[chars[cursor++]]; }
    }
    if (/^[0-5]$/.test(chars[cursor] ?? '')) {
      const digit = Number(chars[cursor++]) || 5;
      if (tone && tone !== digit) return 'different'; tone = digit;
    }
    if (tone === undefined && item.tones[i] !== 5) missing = true;
    else if ((tone ?? 5) !== item.tones[i]) return 'different';
  }
  return cursor !== chars.length ? 'different' : missing ? 'omitted' : 'correct';
}
