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
  return { base, tones, valid: !/[^a-zü\u0300-\u036f0-9\s'’.,!?。，！？-]/i.test(normalized.normalize('NFD')) };
}
export { numberedToPinyin } from './pinyin.ts';
import { numberedToPinyin } from './pinyin.ts';
export type Interpretation = {
  result: 'success' | 'failure' | 'unsure'; content: 'correct' | 'partial' | 'incorrect';
  syllables: 'correct' | 'incorrect' | 'unknown'; toneNotation: 'correct' | 'omitted' | 'different' | 'unknown';
  construction: 'complete' | 'incomplete' | 'unknown'; fullyCorrect: boolean; correction: string;
  spokenTones: 'unknown'; script: 'hanzi' | 'pinyin' | 'unknown'; confidence: 'high' | 'low'; needsClarification: boolean;
};
export function interpretAnswer(input: string, item: Item, _name = ''): Interpretation {
  let value = normalizeText(input.replace(/u:/gi, 'ü'));
  let construction: Interpretation['construction'] = 'complete';
  const base: Interpretation = { result: 'failure', content: 'incorrect', syllables: 'incorrect', toneNotation: 'unknown', construction, fullyCorrect: false,
    correction: `${item.toneNumbers} (${item.pinyin})`, spokenTones: 'unknown', script: 'unknown', confidence: 'high', needsClarification: false };
  if (item.slot === 'name') {
    // A personal name is an open slot, not a Mandarin vocabulary test against a saved preference.
    const hanzi = [item.hant,item.hans].map(normalizeText).find(h => value.startsWith(h));
    const syllablePattern = item.syllables.map(s => [...s].map(c => `${c}[\\u0300-\\u036f0-9]*`).join('')).join("[\\s'’]*");
    const matched = value.normalize('NFD').match(new RegExp(`^${syllablePattern}`, 'u'))?.[0];
    const prefix = hanzi ?? matched;
    if (prefix) {
      const normalized = hanzi ? value : value.normalize('NFD');
      const suppliedName = normalized.slice(prefix.length).trim();
      construction = /[\p{L}]/u.test(suppliedName) ? 'complete' : 'incomplete';
      value = prefix.normalize('NFC');
    } else {
      const tokens = value.split(' ');
      // Only isolate a visibly separate name; do not fuzzy-correct the Mandarin expression.
      if (tokens.length > item.syllables.length && /\p{L}/u.test(tokens.at(-1)!)) value = tokens.slice(0,-1).join(' ');
      else construction = 'unknown';
    }
  }
  if ([item.hant,item.hans].map(normalizeText).includes(value)) return { ...base, result: construction === 'complete' ? 'success' : 'failure', content: 'correct', syllables: 'unknown', script: 'hanzi', construction,
    fullyCorrect: construction === 'complete', correction: construction === 'incomplete' ? 'Ergänze nach dem Ausdruck deinen Namen.' : '' };
  const expected = pinyin(item.pinyin), actual = pinyin(value);
  if (actual.valid && actual.base === expected.base) {
    const tones = writtenTones(value,item);
    return { ...base, ...tones, result: construction === 'complete' ? 'success' : 'failure', content: 'correct', syllables: 'correct', script: 'pinyin', construction,
      fullyCorrect: construction === 'complete' && tones.toneNotation === 'correct',
      correction: [construction === 'incomplete' ? 'Ergänze nach dem Ausdruck deinen Namen.' : '', tones.correction].filter(Boolean).join(' ') };
  }
  const incomplete = !!actual.base && actual.valid && expected.base.startsWith(actual.base);
  // For aligned typed syllables, correct only the wrong syllables; otherwise show the canonical phrase.
  const tokens = value.split(/\s+/);
  const corrections = tokens.length === item.syllables.length ? tokens.flatMap((s,i) => {
    if (pinyin(s).base !== item.syllables[i]) return [`„${s}“ → ${item.syllables[i]}${item.tones[i]} (${numberedToPinyin(item.syllables[i]+item.tones[i])})`];
    const part = { ...item, syllables: [item.syllables[i]], tones: [item.tones[i]], toneNumbers: item.syllables[i]+item.tones[i], pinyin: numberedToPinyin(item.syllables[i]+item.tones[i]) };
    const correction = writtenTones(s,part).correction;
    return correction ? [correction] : [];
  }) : [];
  return { ...base, content: incomplete ? 'partial' : 'incorrect', construction: incomplete ? 'incomplete' : construction, correction: corrections.join('; ') || base.correction };
}
function writtenTones(value: string, item: Item): Pick<Interpretation,'toneNotation' | 'correction'> {
  const marksNeeded: string[] = [];
  const chars = [...value.toLowerCase().replace(/u:/g,'ü').replace(/v/g,'ü').normalize('NFD').replace(/[\s'’.,!?。，！？-]/g,'')];
  let cursor = 0, missing = false, different = false;
  const malformed = () => ({ toneNotation: 'different' as const, correction: `${item.toneNumbers} (${item.pinyin})` });
  for (let i = 0; i < item.syllables.length; i++) {
    const start = cursor;
    let tone: number | undefined;
    for (const letter of item.syllables[i].normalize('NFD')) {
      if (chars[cursor++] !== letter) return malformed();
      if (marks[chars[cursor]]) { if (tone) return malformed(); tone = marks[chars[cursor++]]; }
    }
    if (tone && chars.slice(start,cursor).join('').normalize('NFC') !== numberedToPinyin(item.syllables[i]+tone)) return malformed();
    if (/^[0-5]$/.test(chars[cursor] ?? '')) {
      const digit = Number(chars[cursor++]) || 5; if (tone && tone !== digit) return malformed(); tone = digit;
    }
    const omitted = tone === undefined && item.tones[i] !== 5;
    const wrong = !omitted && (tone ?? 5) !== item.tones[i];
    missing ||= omitted; different ||= wrong;
    if (omitted || wrong) marksNeeded.push(`${item.syllables[i]}${item.tones[i]} (${numberedToPinyin(item.syllables[i]+item.tones[i])})`);
  }
  return cursor !== chars.length ? malformed() : { toneNotation: different ? 'different' : missing ? 'omitted' : 'correct', correction: marksNeeded.join(' · ') };
}
export function answerFeedback(result: Interpretation) {
  if (result.fullyCorrect) return 'Richtig.';
  const parts: string[] = [];
  if (result.content === 'correct') {
    parts.push('Der Ausdruck stimmt.');
    if (result.toneNotation === 'omitted') parts.push('Tonangaben fehlen:');
    if (result.toneNotation === 'different') parts.push('Diese Tonnotation braucht eine Korrektur:');
  } else parts.push(result.construction === 'incomplete' ? 'Der Ausdruck ist noch unvollständig:' : 'Die Schreibweise des Ausdrucks stimmt noch nicht:');
  parts.push(result.correction);
  if (['omitted','different'].includes(result.toneNotation)) parts.push('Deine Aussprache wurde nicht bewertet.');
  return parts.join(' ');
}
