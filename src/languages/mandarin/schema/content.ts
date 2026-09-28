import legacyUnsegmented from '../content/legacy-unsegmented.json' with { type: 'json' };
import { z } from 'zod';
import { targetSchema } from '../../../core/progress/model.ts';
import { numberedToPinyin } from '../pinyin.ts';
const text = z.string().trim().min(1);
const prose = z.string().refine(value => value.trim().length > 0, 'Empty explanation').refine(value => !/\p{Script=Han}/u.test(value), 'Chinese explanation tokens require a canonical reference');
const explanation = z.union([prose, z.array(z.union([prose, z.strictObject({ word: text, gloss: prose })])).min(1)]);
export type Explanation = z.infer<typeof explanation>;
export const introductionDimension = z.enum(['meaning','pronunciation','tone','hanzi','segmentation','writing']);
export type IntroductionDimension = z.infer<typeof introductionDimension>;
const introduction = z.strictObject({ dimensions: z.array(introductionDimension).min(2), role: z.enum(['spoken','recognition','writing']), toneNote: prose.optional() });
const exploration = z.strictObject({ pronunciation: z.enum(['lexical', 'surface']), units: z.array(z.strictObject({
  words: z.array(text).min(1), syllables: z.array(z.string().regex(/^[a-zü]+[1-5]$/)).min(1), gloss: prose,
  audioItem: text.optional(), characters: z.array(z.strictObject({ index: z.number().int().nonnegative(), note: prose })).optional(),
})).min(1) });
const meaning = z.strictObject({ de: z.array(text).min(1), en: z.array(text).min(1) });
const review = z.strictObject({ reviewStatus: text.optional(), sources: z.array(z.string().url()).optional(), reviewDate: text.optional(), notes: text.optional() }).optional();
const asset = z.string().regex(/^\/audio\/mandarin\/[a-z0-9-]+\.(?:wav|mp3)$/);
// Deliberately limited to the existing lesson, not a general Mandarin dictionary.
const lessonSyllables = new Set(['wo','ni','hao','jiao','shen','me','ming','zi','xie','zai','jian','ma','ting','bu','dong','qing','zai','shuo','yi','bian','man','dian','zhi','dao','hen','ne','shi','na','guo','ren','de','zhong','ke','qi','dui','mei','guan','xi','wan','an','er','san','si','wu','liu','ba','jiu']);
const word = z.strictObject({ id: text, hant: z.string().regex(/^\p{Script=Han}+$/u), hans: z.string().regex(/^\p{Script=Han}+$/u),
  audio: asset.optional(), toneNumbers: z.string().regex(/^[a-zü]+[1-5]( [a-zü]+[1-5])*$/), meaning, review });
export const assessmentSchema = z.strictObject({ toneNotation: z.boolean(), neutralTone: z.boolean() });
export type Assessment = z.infer<typeof assessmentSchema>;
const authoredSchema = z.strictObject({
  introducedAssessment: assessmentSchema,
  version: text, qaStatus: z.enum(['draft', 'source_checked', 'language_reviewed', 'audio_reviewed', 'published']), audioStatus: z.enum(['prototype', 'reviewed']),
  words: z.array(word).min(1), toneExamples: z.array(text).length(4),
  items: z.array(z.strictObject({ id: text, words: z.array(text).min(1), meaning: meaning.optional(), punctuation: z.enum(['？']).optional(), slot: z.literal('name').optional(), audio: asset, slowAudio: asset.optional(), surfaceToneNumbers: text.optional(), exploration: exploration.optional(), introduction, learning: z.strictObject({ function: z.enum(['repair','personal','social','numbers']), order: z.number().int().nonnegative(), prerequisites: z.array(text), writing: z.boolean(), note: explanation, concepts: z.array(text), reviewStatus: z.literal('source_checked'), discovery: explanation.optional() }).optional(), review })),
  tasks: z.array(z.strictObject({ id: text, kind: z.enum(['encounter', 'listen', 'read', 'recall', 'writing', 'tones', 'tone-recall', 'sequence', 'closure']),
    sequence: z.array(text).min(2).optional(), assess: assessmentSchema.optional(), itemId: text.optional(), target: targetSchema.optional(), prompt: z.strictObject({ de: text, en: text.optional() }), toneIndex: z.number().int().min(0).optional(), recall: z.boolean().optional() })),
  initialPlan: z.array(text), reviewPlan: z.array(text),
}).superRefine((c, ctx) => {
  const issue = (message: string) => ctx.addIssue({ code: 'custom', message });
  const words = new Map(c.words.map(w => [w.id,w])), items = new Map(c.items.map(i => [i.id,i])), tasks = new Set(c.tasks.map(t => t.id));
  if (words.size !== c.words.length || items.size !== c.items.length || tasks.size !== c.tasks.length) issue('Duplicate ID');
  const forms = new Set<string>();
  for (const w of c.words) {
    const form = `${w.hant}|${w.hans}`; if (forms.has(form)) issue(`Duplicate canonical word: ${w.id}`); forms.add(form);
    const scriptPairs:Record<string,string>={'聽':'听','請':'请','說':'说','點':'点','嗎':'吗','國':'国','氣':'气','對':'对','沒':'没','關':'关','係':'系','麼':'么','媽':'妈','馬':'马','罵':'骂','謝':'谢','見':'见'};
    if([...w.hant].map(c=>scriptPairs[c]??c).join('')!==w.hans)issue(`Script pair mismatch: ${w.id}`);
    const tokens = w.toneNumbers.split(' ');
    if (tokens.length !== [...w.hant].length || tokens.length !== [...w.hans].length) issue(`Character/syllable count: ${w.id}`);
    for (const token of tokens) if (!lessonSyllables.has(token.slice(0,-1))) issue(`Invalid Lesson-1 Pinyin syllable: ${token}`);
  }
  for (const i of c.items) {
    const dimensions = i.introduction.dimensions;
    if (new Set(dimensions).size !== dimensions.length || !dimensions.includes('meaning') || !dimensions.includes('pronunciation')) issue(`Introduction dimensions: ${i.id}`);
    if (dimensions.includes('segmentation') && !i.exploration) issue(`Introduction needs segmentation: ${i.id}`);
    if ((i.introduction.role !== 'spoken') !== dimensions.includes('hanzi')) issue(`Recognition introduction: ${i.id}`);
    if ((i.introduction.role === 'writing') !== dimensions.includes('writing')) issue(`Writing introduction: ${i.id}`);
    if (i.learning && i.learning.writing !== dimensions.includes('writing')) issue(`Writing eligibility mismatch: ${i.id}`);
    const lexical = i.words.flatMap(id => words.get(id)?.toneNumbers.split(' ') ?? []);
    if (lexical.length > 1 && !i.exploration && !legacyUnsegmented.includes(i.id)) issue(`Missing canonical phrase segmentation: ${i.id}`);
    for (const copy of [i.learning?.note, i.learning?.discovery]) if (Array.isArray(copy)) for (const part of copy) if (typeof part !== 'string' && !words.has(part.word)) issue(`Unknown explanation word: ${i.id}/${part.word}`);
    if (i.exploration) {
      const units = i.exploration.units;
      if (units.flatMap(u => u.words).join('|') !== i.words.join('|')) issue(`Phrase segmentation coverage/order: ${i.id}`);
      const expected = i.exploration.pronunciation === 'surface' ? i.surfaceToneNumbers?.split(' ') : lexical;
      if (!expected || units.flatMap(u => u.syllables).join(' ') !== expected.join(' ')) issue(`Phrase pronunciation mapping: ${i.id}`);
      for (const unit of units) {
        const parts = unit.words.map(id => words.get(id));
        if (parts.some(w => !w)) { issue(`Unknown lexical reference: ${i.id}`); continue; }
        const tokens = parts.flatMap(w => w!.toneNumbers.split(' '));
        if (unit.syllables.length !== tokens.length || unit.syllables.some((s,n) => s.slice(0,-1) !== tokens[n]?.slice(0,-1))) issue(`Hanzi/syllable mapping: ${i.id}`);
        if (parts.some(w => [...w!.hant].length !== [...w!.hans].length)) issue(`Exploration script mapping: ${i.id}`);
        const positions = unit.characters?.map(char => char.index) ?? [];
        if (new Set(positions).size !== positions.length || positions.some(n => n >= tokens.length)) issue(`Character exploration index: ${i.id}`);
        if (unit.audioItem) {
          const source = items.get(unit.audioItem);
          if (!source || source.words.join('|') !== unit.words.join('|')) issue(`Lexical audio mismatch: ${i.id}/${unit.audioItem}`);
        }
      }
    }

    if(i.learning) {
      for(const id of i.learning.prerequisites) {
        const prerequisite=items.get(id);
        if(!prerequisite || (prerequisite.learning && prerequisite.learning.order>=i.learning.order)) issue(`Curriculum prerequisite/order: ${i.id}/${id}`);
      }
      if(i.learning.writing && [...words.get(i.words[0])?.hans ?? ''].length!==1) issue(`Writing target must be one character: ${i.id}`);
    }
    if(i.surfaceToneNumbers) {
      const lexical=i.words.flatMap(id=>words.get(id)?.toneNumbers.split(' ')??[]);
      const surface=i.surfaceToneNumbers.split(' ');
      if(surface.length!==lexical.length || surface.some((s,n)=>!/[1-5]$/.test(s)||s.slice(0,-1)!==lexical[n]?.slice(0,-1))) issue(`Surface pronunciation syllables: ${i.id}`);
    }

    if (!i.slowAudio || i.audio === i.slowAudio) issue(`Distinct natural/careful_slow assets required: ${i.id}`);
    for (const id of i.words) if (!words.has(id)) issue(`Unknown word: ${id}`);
    if (i.words.length > 1 && !i.meaning) issue(`Missing phrase meaning: ${i.id}`);
    if (i.words.length === 1 && i.meaning) issue(`Duplicate word meaning: ${i.id}`);
  }
  c.toneExamples.forEach((id,n) => { if (!words.get(id)?.audio) issue(`Missing tone audio: ${id}`); if (words.get(id)?.toneNumbers !== `ma${n+1}`) issue(`Invalid tone example: ${id}`); });
  for (const t of c.tasks) {
    const item = items.get(t.itemId ?? '');
    if(t.kind==='sequence' && t.sequence?.some(id=>!items.get(id)?.introduction.dimensions.includes('hanzi'))) issue(`Sequence requires Hanzi introduction: ${t.id}`);
    if(t.kind==='sequence' && (!t.sequence || t.sequence.some(id=>!items.has(id)))) issue(`Invalid sequence: ${t.id}`);
    if(t.kind==='writing' && item && item.introduction.role!=='writing') issue(`Not a writing target: ${t.id}`);
    if(t.kind==='read' && item && !item.introduction.dimensions.includes('hanzi')) issue(`Reading needs Hanzi introduction: ${t.id}`);
    if(t.kind==='writing' && item?.learning && !item.learning.writing) issue(`Writing not introduced: ${t.id}`);
    if (t.kind === 'recall' && !t.assess) issue(`Missing assessment declaration: ${t.id}`);
    if (t.assess) {
      if(item && t.assess.toneNotation && !item.introduction.dimensions.includes('tone'))issue(`Tone assessment needs declared introduction: ${t.id}`);
      if(item?.learning && t.assess.toneNotation && !item.learning.concepts.includes('tone_notation'))issue(`Untaught item assessment: ${t.id}`);
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
  const words = c.words.map(w => ({ ...w, pinyin: numberedToPinyin(w.toneNumbers.replace(/ (?=[aeo])/g,"'")).replaceAll(' ', '') }));
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
