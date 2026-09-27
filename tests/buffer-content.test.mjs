import test from 'node:test';import assert from 'node:assert/strict';
import raw from '../src/languages/mandarin/content/lesson-001.json' with {type:'json'};
import buffer from '../src/languages/mandarin/content/buffer-d.json' with {type:'json'};
import {contentSchema} from '../src/languages/mandarin/schema/content.ts';import {content,itemMap} from '../src/languages/mandarin/content/index.ts';
import {evaluateAnswer} from '../src/languages/mandarin/answer.ts';
const authored=()=>({...raw,words:[...structuredClone(raw.words),...structuredClone(buffer.words)],items:[...structuredClone(raw.items),...structuredClone(buffer.items)]});
test('28 new objects have safe assessment, writing eligibility and valid prerequisites',()=>{
 assert.equal(buffer.items.length,28);assert.equal(buffer.items.filter(i=>i.learning.writing).length,5);
 for(const t of content.tasks.filter(t=>t.id.startsWith('d-recall-'))){assert(!t.assess.toneNotation&&!t.assess.neutralTone);const i=itemMap.get(t.itemId);assert.equal(evaluateAnswer(i.toneNumbers.replace(/[1-5]/g,''),i,t.assess).result,'success');}
 assert.equal(itemMap.get('wanan').pinyin,"wǎn'ān");
});
test('bad script pairs, malformed syllables, swapped prerequisite order and invented surface syllables fail',()=>{
 for(const mutate of [c=>c.words.at(-1).hans='错',c=>c.words.at(-1).toneNumbers='nonsense2',c=>c.items[8].learning.prerequisites=['shi-number'],c=>c.items[8].surfaceToneNumbers='wo3 nonsense1']){const c=authored();mutate(c);assert.throws(()=>contentSchema.parse(c));}
});
