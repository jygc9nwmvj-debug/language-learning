import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,mkdirSync,symlinkSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import raw from '../src/languages/mandarin/content/lesson-001.json' with {type:'json'};
import buffer from '../src/languages/mandarin/content/buffer-d.json' with {type:'json'};
import {contentSchema} from '../src/languages/mandarin/schema/content.ts';
import {content,itemMap} from '../src/languages/mandarin/content/index.ts';
import {phraseUnits} from '../src/languages/mandarin/phrase.ts';
import {pollyRequest} from '../scripts/polly-generation.mjs';
import {productionAudioReferences,validateProductionAudio} from '../scripts/production-audio.mjs';
const authored=()=>structuredClone({...raw,words:[...raw.words,...buffer.words],items:[...raw.items,...buffer.items]});
const unit=(c,id,n)=>c.items.find(i=>i.id===id).exploration.units[n];

test('eight independent media references use authored contextual pronunciation, never create learning items',()=>{
 const expected={'detail-jiao':'jiao4','detail-mingzi':'ming2 zi5','detail-tingbudong':'ting1 bu5 dong3','detail-zai':'zai4','detail-shuo':'shuo1','detail-yibian':'yi2 bian4','detail-man':'man4','detail-yidian':'yi4 dian3'};
 assert.equal(content.items.length,36);assert.equal(content.tasks.length,131);assert.equal(content.detailAudio.length,8);
 for(const reference of content.detailAudio){
  assert.equal(reference.surfaceToneNumbers,expected[reference.id]);assert(!itemMap.has(reference.id));assert(!content.tasks.some(t=>t.itemId===reference.id));assert.equal(reference.slowAudio,undefined);
  const source=itemMap.get(reference.sourceItem).exploration.units[reference.sourceUnit];
  assert.equal(reference.surfaceToneNumbers,source.syllables.join(' '));
  assert(pollyRequest(reference,'natural').ssml.includes(expected[reference.id].replaceAll('5','0').replaceAll(' ','-')));
 }
 assert.equal(phraseUnits(itemMap.get('askname'),'hant')[2].audio,itemMap.get('what').audio);
 assert.equal(phraseUnits(itemMap.get('wojiao'),'hant')[1].audio,phraseUnits(itemMap.get('askname'),'hant')[1].audio);
 assert.equal(phraseUnits(itemMap.get('say-again'),'hant')[2].audio,phraseUnits(itemMap.get('speak-slowly'),'hant')[1].audio);
});
test('audio decisions are required; explicit phrase-only explanations are allowed',()=>{
 for(const change of [u=>delete u.audio,u=>u.audio={kind:'reference',id:'detail-jiao'},u=>u.audio={kind:'phrase',reason:''},u=>u.audio={kind:'item',item:'absent'}]){
  const c=authored();change(unit(c,'wojiao',1));assert.equal(contentSchema.safeParse(c).success,false);
 }
 const c=authored();unit(c,'wojiao',1).audio={kind:'phrase',reason:'Die Aussprache wird hier nur im Satz modelliert.'};
 const parsed=contentSchema.parse(c),resolved=phraseUnits(parsed.items.find(i=>i.id==='wojiao'),'hant')[1];
 assert.equal(resolved.audio,undefined);assert.match(resolved.audioContext,/nur im Satz/);
});
test('shared media rejects conflicting words, contextual tones, paths and learning IDs',()=>{
 for(const change of [
  c=>unit(c,'wojiao',1).audio.src='/audio/mandarin/other.mp3',
  c=>unit(c,'askname',3).audio={...unit(c,'wojiao',1).audio},
  c=>unit(c,'wojiao',1).audio.id='wo',
  c=>unit(c,'wojiao',1).audio.src=itemMap.get('wo').audio,
  c=>{const u=unit(c,'askname',3);u.audio.src=unit(c,'wojiao',1).audio.src;},
  c=>{c.items.find(i=>i.id==='qing').surfaceToneNumbers='qing2';},
 ]){const c=authored();change(c);assert.equal(contentSchema.safeParse(c).success,false);}
});
test('production validation requires every detail manifest entry and its contextual pronunciation',()=>{
 const manifest=JSON.parse(readFileSync('docs/A2_AUDIO_MANIFEST.json'));
 for(const detail of content.detailAudio){
  const missing=structuredClone(manifest);missing.assets=missing.assets.filter(a=>a.path!==detail.audio);
  assert.throws(()=>validateProductionAudio(content,missing),/Unknown/);
  const wrong=structuredClone(manifest);wrong.assets.find(a=>a.path===detail.audio).surfaceToneNumbers='wo3';
  assert.throws(()=>validateProductionAudio(content,wrong),/Detail pronunciation/);
 }
});
test('content validation fails when a required detail file is missing on disk',()=>{
 const root=mkdtempSync(join(tmpdir(),'mandarin-missing-detail-'));
 try{
  mkdirSync(join(root,'docs'));mkdirSync(join(root,'public/audio/mandarin'),{recursive:true});
  symlinkSync(resolve('docs/A2_AUDIO_MANIFEST.json'),join(root,'docs/A2_AUDIO_MANIFEST.json'));
  const missing=content.detailAudio[0].audio;
  for(const ref of productionAudioReferences(content))if(ref.path!==missing)symlinkSync(resolve('public'+ref.path),join(root,'public'+ref.path));
  const result=spawnSync(process.execPath,[resolve('scripts/validate-content.mjs')],{cwd:root,encoding:'utf8'});
  assert.notEqual(result.status,0);assert(result.stderr.includes(`Missing asset: ${missing}`),result.stderr);
 }finally{rmSync(root,{recursive:true,force:true});}
});
