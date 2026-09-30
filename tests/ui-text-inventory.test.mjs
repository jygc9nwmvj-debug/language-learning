import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {enumerate,check,root} from '../scripts/ui-text-inventory.mjs';
const ledger=JSON.parse(readFileSync(join(root,'qa/ui-text/inventory.json'),'utf8'));
test('reviewed production source envelope has no unclassified entries',()=>assert.deepEqual(check(enumerate(),ledger),[]));
test('new, changed and removed sources cannot silently inherit classifications',()=>{
 const current=enumerate();
 assert.ok(check({...current,entries:[...current.entries,{id:'new',file:'src/new.tsx',locations:[1],text:'Unexpected label'}]},ledger).some(x=>x.startsWith('Unclassified:')));
 assert.ok(check({...current,sources:{...current.sources,'src/new.tsx':'new'}},ledger).some(x=>x.includes('Source contract')));
 assert.ok(check({...current,sources:{...current.sources,'src/app/LessonRunner.tsx':'changed'}},ledger).some(x=>x.includes('Source contract')));
 assert.ok(check({...current,entries:current.entries.slice(1)},ledger).some(x=>x.startsWith('Stale decision:')));
});
test('AST extraction includes single-word labels, arbitrary dynamic sinks and nested generator templates',()=>{
 const base=mkdtempSync(join(tmpdir(),'ui-text-inventory-'));
 try {
  mkdirSync(join(base,'src'));mkdirSync(join(base,'public'));
  writeFileSync(join(base,'index.html'),'<title>Test</title>');writeFileSync(join(base,'public/manifest.webmanifest'),'{}');
  writeFileSync(join(base,'src/example.tsx'),"const generated = `Say ${name ? 'Alice' : 'Bob'}`; export const view = <><button aria-label={label}>{externalValue}</button><p>Go</p></>;");
  const entries=enumerate(base).entries;
  for(const text of ['Go','Alice','Bob','externalValue','label'])assert.ok(entries.some(e=>e.text===text),text);
  assert.ok(entries.some(e=>e.kind==='template'&&e.text.includes('Say')));
 }finally{rmSync(base,{recursive:true,force:true});}
});
test('every resolved task prompt has a reviewed disposition, including generated encounters and legacy tasks',()=>{
 const entries=enumerate().entries.filter(e=>e.kind.startsWith('task-prompt:'));
 assert.equal(entries.length,131);
 assert.equal(entries.filter(e=>e.taskKind==='encounter').length,36);
 for(const e of entries.filter(e=>e.taskKind==='encounter'))assert.equal(ledger.decisions[e.id].scope,'suppressed',e.locations[0]);
 for(const e of entries.filter(e=>e.taskKind==='tone-recall'))assert.equal(ledger.decisions[e.id].scope,'compatibility');
});
test('redundancy decisions are explicit and resolved rather than silently whitelisted',()=>{
 const changes=JSON.parse(readFileSync(join(root,'qa/ui-text/changes.json'),'utf8'));
 assert.equal(changes.length,11);
 for(const change of changes){assert.ok(change.reason);assert.ok(['remove','condense'].includes(change.decision));assert.ok(change.functions.includes('redundant'));}
 const bad=structuredClone(ledger);const id=Object.keys(bad.decisions).find(id=>bad.decisions[id].functions?.includes('redundant'));
 bad.decisions[id].disposition='retain';
 assert.ok(check(enumerate(),bad).some(f=>f.startsWith('Redundancy without correction')));
});
