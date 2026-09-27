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
    else if (/[1-5]/.test(char)) tones.push(Number(char));
    else if (char === '\u0308') base += ':';
    else if (/[a-z]/.test(char)) base += char;
  }
  return { base, tones, valid: !/[^a-zü\u0300-\u036f1-5\s'’.,!?。，！？-]/i.test(normalized.normalize('NFD')) };
}
export type Interpretation = {
  result: 'success' | 'failure' | 'unsure'; content: 'correct' | 'partial' | 'unknown';
  syllables: 'correct' | 'unknown'; toneNotation: 'correct' | 'omitted' | 'different' | 'unknown';
  spokenTones: 'unknown'; script: 'hanzi' | 'pinyin' | 'unknown'; confidence: 'high' | 'low';
  needsClarification: boolean;
};
export function interpretAnswer(input: string, item: Item, name = ''): Interpretation {
  let value = normalizeText(input);
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
    toneNotation: !actual.tones.length ? 'omitted' : new RegExp('^' + item.tones.map(t => t === 5 ? '5?' : String(t)).join('') + '$').test(actual.tones.join('')) ? 'correct' : 'different',
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
