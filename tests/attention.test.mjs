import {test} from 'node:test';
import assert from 'node:assert/strict';
import {attentionAssessment,hasItemAttention,hasToneAttention,attentionPilots} from '../src/languages/mandarin/attention.ts';
import {itemMap,content} from '../src/languages/mandarin/content/index.ts';
const item=itemMap.get('nihao');
const event=(type,detail={},taskId='meet-nihao')=>({id:crypto.randomUUID(),at:1,sessionId:'old',taskId,type,contentVersion:'build-d-1',detail});
const tone=event('tone_attention_confirmed',{item:item.id,toneNumbers:item.toneNumbers,attentionVersion:1});
const notation=event('task_completed',{},'tones');
test('display, hearing, or generic tone lessons cannot unlock item tone assessment',()=>{
 const declared={toneNotation:true,neutralTone:false};
 const old=[event('pinyin_reveal'),event('audio_replay'),event('task_completed'),notation];
 assert.equal(attentionAssessment(declared,item,old).toneNotation,false);
 assert.equal(attentionAssessment(declared,item,[tone]).toneNotation,false);
 assert.equal(attentionAssessment(declared,item,[tone,notation]).toneNotation,true);
 assert.equal(attentionAssessment({toneNotation:false,neutralTone:false},item,[tone,notation]).toneNotation,false);
 assert.equal(attentionAssessment(declared,itemMap.get('hao'),[tone,notation]).toneNotation,false);
 assert.equal(hasToneAttention({...item,toneNumbers:'ni2 hao3'},[tone]),false);
});
test('compact known introduction requires both acknowledged tone and matching script/form, not merely presentation',()=>{
 const finished=event('item_attention_completed',{item:item.id,script:'hant',form:item.hant,attentionVersion:1});
 assert.equal(hasItemAttention(item,'hant',[finished]),false);
 assert.equal(hasItemAttention(item,'hant',[tone,finished]),true);
 assert.equal(hasItemAttention(item,'hans',[tone,finished]),false);
 assert.equal(hasItemAttention(item,'hant',[tone,event('item_attention_completed',{item:item.id,script:'hant',form:'wrong',attentionVersion:1})]),false);
 for(const [id,config] of Object.entries(attentionPilots)){assert.ok(itemMap.has(id));assert.equal(content.tasks.some(t=>t.itemId===id&&t.kind==='writing'&&!t.recall),config.role==='writing');}
});
