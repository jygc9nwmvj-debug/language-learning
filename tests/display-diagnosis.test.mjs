import test from 'node:test';
import assert from 'node:assert/strict';
import {displayDiagnosis} from '../src/languages/mandarin/displayDiagnosis.ts';
import {itemMap} from '../src/languages/mandarin/content/index.ts';
const item=itemMap.get('dont-know'),assessment={toneNotation:false,neutralTone:false};
test('presentation uses canonical syllables and retains original correct tokens',()=>{
 const d=displayDiagnosis('wo3 bu4 dzi dap',item,assessment);
 assert.equal(d.mode,'inline');assert.deepEqual(d.elements.map(x=>[x.original,x.correction,x.kind]),[['wo3','wǒ',null],['bu4','bù',null],['dzi','zhī','spelling'],['dap','dao','spelling']]);
});
test('unknown historical context, moved syllables, omissions, extra tokens and open names fall back',()=>{
 for(const input of ['wo3 zhi1 bu4 dao','wo3 bu4 dao','wo3 bu4 zhi1 dao ma','banana orange','我不知道'])assert.equal(displayDiagnosis(input,item,assessment).mode,'comparison');
 assert.equal(displayDiagnosis('wo3 bu4 dzi dap',item).mode,'comparison');
 assert.equal(displayDiagnosis('wo jiao Alex',itemMap.get('wojiao'),assessment).mode,'comparison');
});
test('unassessed tones stay quiet; assessed tones show a notation correction',()=>{
 const n=itemMap.get('nihao');assert.equal(displayDiagnosis('ni2 hao3',n,assessment).mode,'comparison');
 const d=displayDiagnosis('ni2 hao3',n,{toneNotation:true,neutralTone:true});assert.equal(d.mode,'inline');assert.equal(d.elements[0].kind,'tone');assert.equal(d.elements[1].kind,null);
});
