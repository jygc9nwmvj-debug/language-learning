import test from 'node:test';import assert from 'node:assert/strict';import 'fake-indexeddb/auto';
import {correctionComparison} from '../src/languages/mandarin/correction.ts';import {meaningFinding} from '../src/languages/mandarin/meaning.ts';
import {itemMap,content} from '../src/languages/mandarin/content/index.ts';import {evaluateAnswer} from '../src/languages/mandarin/answer.ts';
import {db,exportLearningState,importLearningState} from '../src/core/progress/db.ts';import {dialogueDefinition,dialogueState,reserveDialogue,updateDialogue} from '../src/languages/mandarin/dialogue.ts';
import {reserveMatching,matchingState,matchingSets} from '../src/languages/mandarin/matching.ts';import {introductionDetail} from '../src/languages/mandarin/introduction.ts';import {composeContinuous,firstRetrievalAges} from '../src/languages/mandarin/continuous.ts';
const assessment={toneNotation:true,neutralTone:true};const compare=(input,id='nihao')=>correctionComparison(input,itemMap.get(id),assessment);
const originalHighlights=d=>d.originalRanges.map(r=>d.original.slice(r.start,r.end));
test('1: vowel + combining marks and tone digits have original grapheme-safe ranges',()=>{
 for(const text of ['ní hao3','ni\u0301 hao3','NÍ hao3'])assert.deepEqual(originalHighlights(compare(text)),[text.includes('\u0301')?'i\u0301':text.includes('Í')?'Í':'í']);
 assert.deepEqual(originalHighlights(compare('ni2 hao3')),['2']);assert.deepEqual(originalHighlights(compare('nìhǎo')),['ì']);
 const d=compare('ni\u0301 hao3');assert.deepEqual(d.acceptedRanges.map(r=>d.accepted.slice(r.start,r.end)),['ǐ']);
});
test('2: several errors preserve the complete original exactly; no edit-distance word splitting',()=>{
 const text='  Wo3  bu4\t dzi  dap  ',d=compare(text,'dont-know');assert.equal(d.original,text);assert.deepEqual(originalHighlights(d),['dzi','dap']);assert.equal(d.accepted,itemMap.get('dont-know').pinyin);
 const longer=compare('  qing3 ZAI4  shou1 yi2 BIAN4  ','say-again');assert.equal(longer.original,'  qing3 ZAI4  shou1 yi2 BIAN4  ');assert.deepEqual(originalHighlights(longer),['shou1','2']);
});
test('3: unique missing/extra alignment only; repeated syllables and moved words fall back',()=>{
 assert.deepEqual(compare('wo3 bu4 dao','dont-know').acceptedRanges.map(r=>r.kind),['missing']);assert.deepEqual(originalHighlights(compare('wo3 bu4 zhi1 dao ma','dont-know')),['ma']);
 const repeated={...itemMap.get('nihao'),pinyin:'mā mā',syllables:['ma','ma'],tones:[1,1],toneNumbers:'ma1 ma1'};
 assert.equal(correctionComparison('ma1',repeated,assessment).localized,false);assert.equal(compare('wo3 zhi1 bu4 dao','dont-know').localized,false);assert.equal(compare('banana orange').localized,false);
});
test('4: every accepted existing German/English meaning remains accepted; unlisted paraphrase uncertain',()=>{
 for(const item of content.items)for(const a of item.answers)assert.equal(meaningFinding(a,item.answers,item.id),'accepted');
 assert.equal(meaningFinding('Das ist eine freundliche Begrüßung',itemMap.get('nihao').answers,'nihao'),'uncertain');assert.equal(meaningFinding('auf Wiedersehen',itemMap.get('nihao').answers,'nihao'),'incorrect');
 assert.equal(meaningFinding('gut',itemMap.get('im-fine').answers,'im-fine'),'uncertain');
 const item=itemMap.get('dont-understand'),a={toneNotation:false,neutralTone:false};assert.equal(evaluateAnswer('wo3 ting1 bu4 dong4',item,a).result,'success');assert.deepEqual(originalHighlights(correctionComparison('wo3 ting1 bu4 dong4',item,a)),['4']);
});
const s={id:'v2',plan:['meet-wo','meet-hao','read-ni','closure'],index:2,completed:false,plannerVersion:'d1',script:'hant',startedAt:1,updatedAt:100};
const intro=(id,index=1)=>({id:'intro-'+id,at:10,sessionId:s.id,taskId:'meet-'+id,type:'introduction_dimensions',contentVersion:'test',detail:{...introductionDetail(itemMap.get(id),'hant',['meaning','pronunciation','hanzi'],'test'),index}});
test('6: early matching is additional immediately after actual introduction; selection creates no relation or recall',async()=>{
 await db.delete();await db.open();await db.sessions.put(s);await db.events.bulkPut([intro('wo',0),intro('ni')]);
 const events=await db.events.toArray(),plan=composeContinuous([],events,'hant',100),ages=firstRetrievalAges(events);
 assert.equal(await reserveMatching(s,100,{taskId:'read-ni',index:1}),null);
 const m=await reserveMatching(s,100,{taskId:'meet-ni',index:1});assert(m);assert(m.setId.startsWith('early-'));assert.deepEqual(await db.sessions.get(s.id),s);assert.deepEqual(await db.relations.toArray(),[]);assert.deepEqual(firstRetrievalAges(await db.events.toArray()),ages);assert.deepEqual(composeContinuous([],await db.events.toArray(),'hant',100),plan);assert.deepEqual(matchingState(await db.events.toArray(),s),m);
});
test('5/6: complete dialogue, interruption, atomic answers, stale phase guard and backup roundtrip',async()=>{
 await db.delete();await db.open();const session={...s,index:3};await db.sessions.put(session);
 const ids=[...new Set([...dialogueDefinition.turns.map(t=>t.itemId),...dialogueDefinition.response.options])];await db.events.bulkPut(ids.map(id=>intro(id)));
 const initialEvents=await db.events.toArray(),plan=composeContinuous([],initialEvents,'hant',100);let d=await reserveDialogue(session,100);assert(d);
 const action=async(kind,answer='')=>{d=await updateDialogue(session,d.runId,kind,answer,d.turn,d.phase);};
 await action('heard');await action('next');
 for(let n=0;n<dialogueDefinition.turns.length;n++){
  await action('draft','Entwurf '+n);db.close();await db.open();d=dialogueState(await db.events.toArray(),session);assert.equal(d.draft,'Entwurf '+n);
  await action('heard');const accepted=dialogueDefinition.turns[n].answers[0];const a=()=>updateDialogue(session,d.runId,'answer',accepted,n,'turn');await Promise.all([a(),a()]);d=dialogueState(await db.events.toArray(),session);assert(d.results[n].correct);await action('next');
 }
 assert.equal(d.phase,'revisit');await action('heard');await action('next');await action('response',dialogueDefinition.response.accepted[0]);await action('next');
 assert.equal(d.phase,'complete');const stale=await updateDialogue(session,d.runId,'next','',d.turn,'respond');assert.equal(stale.done,false);
 await action('next');await action('next');const backup=await exportLearningState();await importLearningState(backup,new Set(content.tasks.map(t=>t.id)));
 const events=await db.events.toArray();assert.equal(events.filter(e=>e.type==='dialogue_answer').length,dialogueDefinition.turns.length);assert.equal(events.filter(e=>e.type==='dialogue_completed').length,1);assert.equal(events.filter(e=>e.type==='attempt').length,0);assert.deepEqual(await db.relations.toArray(),[]);assert.deepEqual(composeContinuous([],events,'hant',100),plan);assert.equal(dialogueState(events,session).done,true);
});
test('unapproved curriculum is not in active content or matching/dialogue population',()=>{
 assert.equal(content.items.length,36);assert.equal(content.tasks.length,131);assert(!itemMap.has('order-tea'));assert(matchingSets.every(s=>s.items.every(id=>itemMap.has(id))));assert(dialogueDefinition.turns.every(t=>itemMap.has(t.itemId)));
});

test('correction colors maintain accessible normal-text contrast',()=>{
 const luminance=hex=>{const v=hex.match(/../g).map(x=>parseInt(x,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return .2126*v[0]+.7152*v[1]+.0722*v[2];};
 for(const ink of ['a23d32','286344'])assert((luminance('f7f5ef')+.05)/(luminance(ink)+.05)>=4.5);
});
