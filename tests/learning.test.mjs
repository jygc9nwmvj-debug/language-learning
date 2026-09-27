import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import { updateRelation, DAY } from '../src/core/progress/model.ts';
import { db, recordAttempt, exportLearningState, importLearningState } from '../src/core/progress/db.ts';
import { content, itemMap, taskMap } from '../src/languages/mandarin/content/index.ts';
import rawContent from '../src/languages/mandarin/content/lesson-001.json' with { type: 'json' };
import { contentSchema } from '../src/languages/mandarin/schema/content.ts';
import { interpretAnswer, numberedToPinyin } from '../src/languages/mandarin/answer.ts';
import { composeReview, objectFor, withSpacedRetry } from '../src/languages/mandarin/session.ts';

test('Pinyin variants preserve content and never claim spoken tone evidence', () => {
  const item = itemMap.get('wojiao');
  for (const value of ['wo jiao Wolfram','wǒ jiào Wolfram','wo3 jiao4 Wolfram','我叫 Wolfram。']) {
    const result = interpretAnswer(value, item, 'Wolfram');
    assert.equal(result.result, 'success', value); assert.equal(result.spokenTones, 'unknown');
  }
  assert.equal(interpretAnswer('wo jiao Wolfram', item, 'Wolfram').toneNotation, 'omitted');
  assert.equal(interpretAnswer('wo2 jiao1 Wolfram', item, 'Wolfram').toneNotation, 'different');
  assert.equal(interpretAnswer('wo3 jiao4 Wolfram', item, 'Wolfram').toneNotation, 'correct');
  assert.equal(interpretAnswer('wo jiao Paul', item, 'Wolfram').result, 'success');
  assert.equal(interpretAnswer('wo jio Wolfram', item, 'Wolfram').needsClarification, false);
  assert.equal(interpretAnswer('wo jio Wolfram', item, 'Wolfram').result, 'failure');
  assert.equal(interpretAnswer('ni5 hao3', itemMap.get('nihao')).result, 'success');
  assert.equal(interpretAnswer('xie4 xie5', itemMap.get('xiexie')).toneNotation, 'correct');
  assert.equal(interpretAnswer('ni3 jiao4 shen2 me5 ming2 zi5', itemMap.get('askname')).toneNotation, 'correct');
  assert.equal(interpretAnswer('good', itemMap.get('hao')).result, 'failure');
});
test('only delayed independent evidence promotes stability; failures are relation-local', () => {
  let at = DAY; const base = { objectId: 'cmn:hao:hant', target: 'writing', result: 'success', assisted: false, sessionId: 'first', at };
  let state = updateRelation(undefined, base);
  for (let i = 0; i < 10; i++) state = updateRelation(state, { ...base, at: ++at });
  assert.equal(state.state, 'DEVELOPING'); assert.equal(state.delayedSuccesses, 0);
  state = updateRelation(state, { ...base, at: at + DAY, sessionId: 'second' });
  assert.equal(state.delayedSuccesses, 1);
  state = updateRelation(state, { ...base, at: at + 2 * DAY, sessionId: 'third' });
  assert.equal(state.state, 'STABLE');
  state = updateRelation(state, { ...base, at: at + 3 * DAY, sessionId: 'fourth', assisted: true });
  assert.equal(state.state, 'FRAGILE'); assert.equal(state.objectId, 'cmn:hao:hant');
});
test('review is due-only, bounded, script-sensitive; errors are spaced', () => {
  const now = 5 * DAY;
  const relations = content.reviewPlan.map(id => { const task = taskMap.get(id); return updateRelation(undefined, { objectId: objectFor(task, 'hant'), target: task.target, result: 'success', assisted: false, sessionId: 'x', at: now }); });
  assert.deepEqual(composeReview(relations, 'hant', now), ['closure']);
  assert.ok(composeReview(relations, 'hans', now).includes('write-recall'));
  assert.ok(composeReview(relations, 'hant', now + DAY).length <= 7);
  const plan = ['a','b','c','d','closure'];
  assert.deepEqual(withSpacedRetry(plan, 0, 'a'), ['a','b','c','a','d','closure']);
  assert.deepEqual(withSpacedRetry(plan, 2, 'c'), plan);
  assert.deepEqual(withSpacedRetry(['a','b','c','a','closure'], 0, 'a'), ['a','b','c','a','closure']);
});
test('content rejects broken references, duplicate IDs, and published prototype audio', () => {
  const invalid = structuredClone(rawContent); invalid.tasks[0].itemId = 'missing';
  assert.equal(contentSchema.safeParse(invalid).success, false);
  const duplicate = structuredClone(rawContent); duplicate.items.push(duplicate.items[0]);
  assert.equal(contentSchema.safeParse(duplicate).success, false);
  assert.equal(contentSchema.safeParse({ ...rawContent, qaStatus: 'published' }).success, false);
});
test('database attempts and research log are atomic; backup validates before merge', async () => {
  await db.delete(); await db.open();
  const attempt = { objectId: 'cmn:hao:hant', target: 'writing', result: 'failure', assisted: false, sessionId: 'test', at: DAY };
  await recordAttempt(attempt, { sessionId: 'test', taskId: 'write-recall', type: 'attempt', detail: { result: 'failure' } });
  assert.equal(await db.relations.count(), 1); assert.equal(await db.events.count(), 1);
  const backup = await exportLearningState();
  await assert.rejects(importLearningState('{"version":200}', new Set(taskMap.keys())));
  assert.equal(await db.relations.count(), 1);
  await db.relations.clear(); await db.events.clear();
  await importLearningState(backup, new Set(taskMap.keys()));
  await importLearningState(backup, new Set(taskMap.keys()));
  assert.equal(await db.relations.count(), 1); assert.equal(await db.events.count(), 1);
  assert.equal((await db.relations.toArray())[0].state, 'FRAGILE');
  await db.delete();
});

test('audio validation rejects header-only files even when the TTS command exits successfully', async () => {
  const { validateWav } = await import('../scripts/audio-validation.mjs');
  const { readFileSync } = await import('node:fs');
  assert.ok(validateWav(readFileSync('public/audio/mandarin/nihao.wav')) > .1);
  const wav = Buffer.alloc(44); wav.write('RIFF'); wav.writeUInt32LE(36, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16); wav.writeUInt32LE(44100, 28); wav.write('data', 36);
  assert.throws(() => validateWav(wav), /Empty or silent/);
});

test('tone numbers convert and incomplete, wrong, neutral and misplaced notation stay distinct', () => {
  assert.equal(numberedToPinyin('ma1 ma2 ma3 ma4 ma5 ma0'), 'mā má mǎ mà ma ma');
  assert.equal(numberedToPinyin('ni3hao3 liu2 gui4 dou1 nv3 nu:3'), 'nǐhǎo liú guì dōu nǚ nǚ');
  for (const [value, expected] of [['ni hao','omitted'], ['ni3 hao','omitted'], ['ni hao3','omitted'], ['ni3hao3','correct'], ['nǐhǎo','correct'], ['ni2 hao','different'], ['n3ihao3','different'], ['ni33 hao3','different']]) {
    const result = interpretAnswer(value,itemMap.get('nihao'));
    assert.equal(result.content,'correct',value); assert.equal(result.toneNotation,expected,value); assert.equal(result.spokenTones,'unknown');
  }
  for (const v of ['xie4xie0','xie4 xie5','xièxie','xie4xie']) assert.equal(interpretAnswer(v,itemMap.get('xiexie')).toneNotation,'correct',v);
});

test('every careful_slow asset is materially longer than natural speech, excluding playback margins', async () => {
  const { validateWav } = await import('../scripts/audio-validation.mjs');
  const { readFileSync } = await import('node:fs');
  for (const item of content.items) {
    const natural=readFileSync('public'+item.audio), slow=readFileSync('public'+item.slowAudio);
    assert.notDeepEqual(natural,slow,item.id);
    assert.ok((validateWav(slow)-.25)/(validateWav(natural)-.25)>1.5,item.id);
  }
});


test('first next-session writing recall has a reserved slot without adding extra workload', () => {
  const now = 5 * DAY;
  const relations = content.reviewPlan.map(id => { const task = taskMap.get(id); return updateRelation(undefined, { objectId: objectFor(task, 'hant'), target: task.target, result: 'success', assisted: false, sessionId: 'first', at: now }); });
  assert.deepEqual(composeReview(relations, 'hant', now, true), ['write-recall', 'closure']);
  const due = composeReview(relations, 'hant', now + DAY, true);
  assert.equal(due.length, 7); assert.equal(due.at(-2), 'write-recall');
  assert.deepEqual(composeReview(relations, 'hant', now, false), ['closure']);
  assert.ok(content.initialPlan.indexOf('write-recall') - content.initialPlan.indexOf('write-guided') > 2);
});
