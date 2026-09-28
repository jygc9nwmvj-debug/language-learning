import test from 'node:test';
import assert from 'node:assert/strict';
import raw from '../src/languages/mandarin/content/lesson-001.json' with {type:'json'};
import buffer from '../src/languages/mandarin/content/buffer-d.json' with {type:'json'};
import {contentSchema} from '../src/languages/mandarin/schema/content.ts';
import {itemMap} from '../src/languages/mandarin/content/index.ts';
import {phraseUnits,explanationText,familiarItem} from '../src/languages/mandarin/phrase.ts';
import {composeContinuous} from '../src/languages/mandarin/continuous.ts';
const authored=()=>({...structuredClone(raw),words:[...structuredClone(raw.words),...structuredClone(buffer.words)],items:[...structuredClone(raw.items),...structuredClone(buffer.items)]});
test('authored units align both scripts, contextual surface tones and neutral syllables',()=>{
 const slow=itemMap.get('speak-slowly');
 assert.deepEqual(phraseUnits(slow,'hant').map(u=>u.form),['請','說','慢','一點']);
 assert.deepEqual(phraseUnits(slow,'hans').map(u=>u.form),['请','说','慢','一点']);
 assert.deepEqual(phraseUnits(slow,'hant').at(-1).characters.map(c=>c.pinyin),['yì','diǎn']);
 assert.equal(phraseUnits(slow,'hant')[0].audio,itemMap.get('qing').audio);
 assert.equal(phraseUnits(slow,'hant').at(-1).audio,undefined);
 assert.deepEqual(phraseUnits(itemMap.get('askname'),'hant').slice(-2).flatMap(u=>u.characters.map(c=>c.pinyin)),['shén','me','míng','zi']);
 assert.equal(itemMap.get('askname').punctuation,'？');
 assert.match(explanationText(slow.learning.note,'hant'),/請 qǐng \(bitte\) macht/);
 assert.match(explanationText(slow.learning.note,'hans'),/请 qǐng/);
});
test('reject incomplete/reordered segmentation, wrong syllables, unknown references and mismatched audio',()=>{
 for(const mutate of [
 i=>i.exploration.units.pop(),
 i=>i.exploration.units.reverse(),
 i=>i.exploration.units[0].syllables=['qing3','qing3'],
 i=>i.exploration.units[0].syllables=['ni3'],
 i=>i.exploration.units[0].syllables=['qing1'],
 i=>i.exploration.units[0].words=['unknown'],
 i=>i.exploration.units[0].audioItem='ni',
 i=>i.exploration.units[0].characters=[{index:2,note:'bitte'}],
 i=>i.learning.note=[{word:'unknown',gloss:'bitte'}],
 i=>i.learning.note='Mit 请 höflicher.',
 i=>i.exploration.units[0].gloss='請 heißt bitte',
 ]){const c=authored();mutate(c.items.find(i=>i.id==='speak-slowly'));assert.equal(contentSchema.safeParse(c).success,false);}
 const c=authored();c.words.find(w=>w.id==='qing').hans='請';assert.equal(contentSchema.safeParse(c).success,false);
});
test('new multi-character content must be annotated; existing explicit legacy list remains valid',()=>{
 assert(contentSchema.safeParse(authored()).success);
 const c=authored();const item=structuredClone(c.items.find(i=>i.id==='xiexie'));item.id='future-phrase';c.items.push(item);assert.equal(contentSchema.safeParse(c).success,false);
});
test('familiarity is not inferred from exploration; optional events cannot change scheduling',()=>{
 const e={id:'x',at:1,sessionId:'s',taskId:'meet-nihao',type:'phrase_explore',detail:{item:'nihao'}};
 assert.equal(familiarItem(itemMap.get('nihao'),[e]),false);
 assert.equal(familiarItem(itemMap.get('nihao'),[{...e,type:'task_completed'}]),true);
 const now=100_000_000;
 const history=[{...e,taskId:'write-guided',type:'attempt',detail:{item:'hao',result:'success'}},{...e,id:'y',taskId:'meet-hao',type:'task_completed',detail:{item:'hao'}}];
 const base=composeContinuous([],history,'hant',now);
 const extras=['inspection_opened','inspection_practice_attempt','optional_writing_result'].map((type,n)=>({...e,id:`opt${n}`,at:now,taskId:'write-recall',type,detail:{item:'hao',optionalPractice:true,result:'success'}}));
 assert.deepEqual(composeContinuous([],history.concat(extras),'hant',now),base);
});
