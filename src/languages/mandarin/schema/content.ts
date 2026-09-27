import { z } from 'zod';
import { targetSchema } from '../../../core/progress/model.ts';
import { numberedToPinyin } from '../pinyin.ts';
const text = z.string().trim().min(1);
const meaning = z.strictObject({ de: z.array(text).min(1), en: z.array(text).min(1) });
const review = z.strictObject({ reviewStatus: text.optional(), sources: z.array(z.string().url()).optional(), reviewDate: text.optional(), notes: text.optional() }).optional();
const asset = z.string().regex(/^\/audio\/mandarin\/[a-z0-9-]+\.wav$/);
// Deliberately limited to the existing lesson, not a general Mandarin dictionary.
const lessonSyllables = new Set(['wo','ni','hao','jiao','shen','me','ming','zi','xie','zai','jian','ma']);
const word = z.strictObject({ id: text, hant: z.string().regex(/^\p{Script=Han}+$/u), hans: z.string().regex(/^\p{Script=Han}+$/u),
  audio: asset.optional(), toneNumbers: z.string().regex(/^[a-zü]+[1-5]( [a-zü]+[1-5])*$/), meaning, review });
export const assessmentSchema = z.strictObject({ toneNotation: z.boolean(), neutralTone: z.boolean() });
export type Assessment = z.infer<typeof assessmentSchema>;
const authoredSchema = z.strictObject({
  introducedAssessment: assessmentSchema,
  version: text, qaStatus: z.enum(['draft', 'source_checked', 'language_reviewed', 'audio_reviewed', 'published']), audioStatus: z.enum(['prototype', 'reviewed']),
  words: z.array(word).min(1), toneExamples: z.array(text).length(4),
  items: z.array(z.strictObject({ id: text, words: z.array(text).min(1), meaning: meaning.optional(), punctuation: z.enum(['？']).optional(), slot: z.literal('name').optional(), audio: asset, slowAudio: asset.optional(), review })),
  tasks: z.array(z.strictObject({ id: text, kind: z.enum(['encounter', 'listen', 'read', 'recall', 'writing', 'tones', 'tone-recall', 'closure']),
    assess: assessmentSchema.optional(), itemId: text.optional(), target: targetSchema.optional(), prompt: z.strictObject({ de: text, en: text.optional() }), toneIndex: z.number().int().min(0).optional(), recall: z.boolean().optional() })),
  initialPlan: z.array(text), reviewPlan: z.array(text),
}).superRefine((c, ctx) => {
  const issue = (message: string) => ctx.addIssue({ code: 'custom', message });
  const words = new Map(c.words.map(w => [w.id,w])), items = new Map(c.items.map(i => [i.id,i])), tasks = new Set(c.tasks.map(t => t.id));
  if (words.size !== c.words.length || items.size !== c.items.length || tasks.size !== c.tasks.length) issue('Duplicate ID');
  const forms = new Set<string>();
  for (const w of c.words) {
    const form = `${w.hant}|${w.hans}`; if (forms.has(form)) issue(`Duplicate canonical word: ${w.id}`); forms.add(form);
    const tokens = w.toneNumbers.split(' ');
    if (tokens.length !== [...w.hant].length || tokens.length !== [...w.hans].length) issue(`Character/syllable count: ${w.id}`);
    for (const token of tokens) if (!lessonSyllables.has(token.slice(0,-1))) issue(`Invalid Lesson-1 Pinyin syllable: ${token}`);
  }
  for (const i of c.items) {
    if (!i.slowAudio || i.audio === i.slowAudio) issue(`Distinct natural/careful_slow assets required: ${i.id}`);
    for (const id of i.words) if (!words.has(id)) issue(`Unknown word: ${id}`);
    if (i.words.length > 1 && !i.meaning) issue(`Missing phrase meaning: ${i.id}`);
    if (i.words.length === 1 && i.meaning) issue(`Duplicate word meaning: ${i.id}`);
  }
  c.toneExamples.forEach((id,n) => { if (!words.get(id)?.audio) issue(`Missing tone audio: ${id}`); if (words.get(id)?.toneNumbers !== `ma${n+1}`) issue(`Invalid tone example: ${id}`); });
  for (const t of c.tasks) {
    const item = items.get(t.itemId ?? '');
    if (t.kind === 'recall' && !t.assess) issue(`Missing assessment declaration: ${t.id}`);
    if (t.assess) {
      if (t.kind !== 'recall') issue(`Assessment declaration only supported for text recall: ${t.id}`);
      for (const dimension of ['toneNotation', 'neutralTone'] as const) {
        if (t.assess[dimension] && !c.introducedAssessment[dimension]) issue(`Assessment not introduced: ${t.id}/${dimension}`);
      }
      if (t.assess.neutralTone && !t.assess.toneNotation) issue(`Neutral tone requires tone notation: ${t.id}`);
    }
    if (t.itemId && !item) issue(`Unknown item: ${t.itemId}`);
    if (!['tones','closure'].includes(t.kind) && !t.itemId) issue(`Missing item: ${t.id}`);
    if (['listen','read','recall','writing'].includes(t.kind) && !t.target) issue(`Missing target: ${t.id}`);
    const tones = item?.words.flatMap(id => words.get(id)?.toneNumbers.split(' ').map(s => Number(s.at(-1))) ?? []);
    if (t.kind === 'tone-recall' && (t.target !== 'perception' || t.toneIndex === undefined || !tones?.[t.toneIndex] || tones[t.toneIndex] > 4)) issue(`Invalid tone task: ${t.id}`);
  }
  for (const id of [...c.initialPlan,...c.reviewPlan]) if (!tasks.has(id)) issue(`Unknown task: ${id}`);
  if (c.qaStatus === 'published' && c.audioStatus !== 'reviewed') issue('Published audio needs review');
});
export const contentSchema = authoredSchema.transform(c => {
  const words = c.words.map(w => ({ ...w, pinyin: numberedToPinyin(w.toneNumbers).replaceAll(' ', '') }));
  const map = new Map(words.map(w => [w.id,w]));
  const items = c.items.map(i => {
    const parts = i.words.map(id => map.get(id)!);
    const meanings = i.meaning ?? parts[0].meaning;
    const tokens = parts.flatMap(w => w.toneNumbers.split(' '));
    return { ...i, hant: parts.map(w => w.hant).join('') + (i.punctuation ?? ''), hans: parts.map(w => w.hans).join('') + (i.punctuation ?? ''),
      pinyin: parts.map(w => w.pinyin).join(' '), toneNumbers: tokens.join(' '), syllables: tokens.map(s => s.slice(0,-1)), tones: tokens.map(s => Number(s.at(-1))),
      meaning: { de: meanings.de[0], en: meanings.en[0] }, answers: [...meanings.de,...meanings.en] };
  });
  return { ...c, words, items, tasks: c.tasks.map(t => ({ ...t, tone: t.toneIndex === undefined ? undefined : items.find(i => i.id === t.itemId)!.tones[t.toneIndex] })) };
});
export type Content = z.infer<typeof contentSchema>;
export type Task = Content['tasks'][number];
export type Item = Content['items'][number];
