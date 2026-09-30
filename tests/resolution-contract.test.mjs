import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {resolutionContracts,validateResolution,operationForTask} from '../src/core/exercises/resolution-contract.ts';
import {enumerateResolutions,checkResolutionCoverage,renderers} from '../scripts/resolution-coverage.mjs';
import {content} from '../src/languages/mandarin/content/index.ts';
for(const [operation,c] of Object.entries(resolutionContracts))test(`${operation}: mandatory roles enforced; internal data rejected`,()=>{
 const parts=Object.fromEntries(c.required.map(k=>[k,'rendered learner content']));validateResolution(operation,parts);
 for(const role of c.required)assert.throws(()=>validateResolution(operation,{...parts,[role]:null}),/missing/);
 for(const internal of ['evidence','assessment','confidence','qa','recognized','missing','children'])assert.throws(()=>validateResolution(operation,{...parts,[internal]:'data'}),/forbidden/);
 assert.throws(()=>validateResolution(operation,parts,true,true),/assistance/);
 validateResolution(operation,{...parts,assistance:'Existing help explicitly shown'},true,true);
 for(const role of c.optional)validateResolution(operation,{...parts,[role]:'optional enrichment'});
});
test('131 task definitions accounted for with explicit compatibility/boundary cases; unknown kinds fail closed',()=>{
 const current=enumerateResolutions(),ledger=JSON.parse(readFileSync('qa/resolution/coverage.json'));
 assert.equal(current.tasks.length,131);assert.equal(new Set(current.tasks.map(t=>t.id)).size,131);
 assert.deepEqual(checkResolutionCoverage(current,ledger),[]);assert.throws(()=>operationForTask('future-operation'));
 assert.equal(current.tasks.filter(t=>t.kind==='tone-recall').length,3);assert.equal(current.tasks.filter(t=>!t.operation).length,1);
 assert(checkResolutionCoverage({...current,tasks:current.tasks.slice(1)},ledger).length);
 assert(checkResolutionCoverage({...current,sources:{...current.sources,[Object.keys(renderers)[0]]:'changed'}},ledger).length);
});
test('mandatory text resolution independent of every optional item field, including seed exploration difference',()=>{
 const assignments=enumerateResolutions().tasks.filter(t=>t.kind==='listen');
 assert.equal(assignments.length,32);
 for(const a of assignments)assert.deepEqual(a.base,resolutionContracts.listen.required);
 for(const id of ['xiexie','dont-understand'])assert(assignments.some(t=>content.tasks.find(x=>x.id===t.id).itemId===id));
 const source=readFileSync('src/languages/mandarin/components/Exercise.tsx','utf8');
 assert(!source.includes('answered && item.exploration'));assert(!source.includes('item.exploration && form'));
});
test('transfer renderer never reads internal assessment, retains own response/solution/transcript',()=>{
 const source=readFileSync('src/languages/mandarin/components/MiniTransfer.tsx','utf8');
 assert(!/state\.assessment|recognized|cueCoverage|Wortmuster|Antwortmerkmale|confidence/.test(source));
 for(const role of ['response:','reference:','enrichment:','next:'])assert(source.includes(role));
});

test('every productive slot separates complete examples from fixed production reference; no unknown fallback',async()=>{
 const {referenceRole,fixedReferenceParts}=await import('../src/languages/mandarin/reference-role.ts');
 const slots=content.items.filter(i=>i.slot);assert.equal(slots.length,1);
 const tasks=enumerateResolutions().tasks.filter(t=>t.slotReference);assert.equal(tasks.length,3);
 for(const item of slots){
  assert.equal(referenceRole(item,'production'),'fixed-components');
  for(const purpose of ['introduction','comprehension'])assert.equal(referenceRole(item,purpose),'example');
  const parts=fixedReferenceParts(item);assert.deepEqual(parts.flatMap(p=>p.words),item.words);
  for(const part of parts){assert.notEqual(part.audio,item.audio);assert.notEqual(part.audio,item.slowAudio);}
  assert.deepEqual(fixedReferenceParts({...item,exploration:undefined}),parts);
  assert.throws(()=>fixedReferenceParts({...item,id:'unreviewed-slot'}),/Missing reviewed/);
 }
});
