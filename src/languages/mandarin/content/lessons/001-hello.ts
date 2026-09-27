import type { Lesson } from '../../../../core/content/types';

export const lesson001: Lesson = {
  id: 'cmn-foundation-001',
  languageId: 'cmn',
  title: { en: '你好 — First contact', de: '你好 — Erster Kontakt' },
  objectives: [
    'Greet someone',
    'Say your name',
    'Recognize that lexical tone changes meaning',
    'Recognize and begin writing 我, 你 and 好',
  ],
  prerequisites: [],
  introduces: [
    'cmn:phrase:nihao', 'cmn:pronoun:wo', 'cmn:pronoun:ni', 'cmn:verb:jiao',
    'cmn:word:hao', 'cmn:phrase:xiexie', 'cmn:phrase:zaijian',
  ],
  reviews: [],
  steps: [
    { id: 'first-listen', type: 'listen_reveal', targets: ['cmn:phrase:nihao'] },
    { id: 'greeting-reveal', type: 'greeting_reveal', targets: ['cmn:phrase:nihao'] },
    { id: 'tone-lab', type: 'tone_discrimination', targets: ['cmn:tone-set:ma'] },
    { id: 'write-wo', type: 'write_guided', targets: ['cmn:pronoun:wo'], config: { itemId: 'cmn:pronoun:wo', traditional: '我', simplified: '我', pinyin: 'wǒ', meaning: 'I / me', audio: '/audio/mandarin/wo.wav' } },
    { id: 'write-ni', type: 'write_guided', targets: ['cmn:pronoun:ni'], config: { itemId: 'cmn:pronoun:ni', traditional: '你', simplified: '你', pinyin: 'nǐ', meaning: 'you', audio: '/audio/mandarin/ni.wav' } },
    { id: 'write-hao', type: 'write_guided', targets: ['cmn:word:hao'], config: { itemId: 'cmn:word:hao', traditional: '好', simplified: '好', pinyin: 'hǎo', meaning: 'good', audio: '/audio/mandarin/hao.wav' } },
    { id: 'compose-nihao', type: 'compose_nihao', targets: ['cmn:phrase:nihao'] },
    { id: 'name-intro', type: 'name_intro', targets: ['cmn:pattern:wo-jiao'] },
    { id: 'name-question', type: 'name_question', targets: ['cmn:dialogue:ask-name'] },
    { id: 'thanks', type: 'phrase', targets: ['cmn:phrase:xiexie'], config: { itemId: 'cmn:phrase:xiexie', traditional: '謝謝', simplified: '谢谢', pinyin: 'xièxie', meaning: 'thank you', audio: '/audio/mandarin/xiexie.wav' } },
    { id: 'goodbye', type: 'phrase', targets: ['cmn:phrase:zaijian'], config: { itemId: 'cmn:phrase:zaijian', traditional: '再見', simplified: '再见', pinyin: 'zàijiàn', meaning: 'goodbye', audio: '/audio/mandarin/zaijian.wav' } },
    { id: 'dialogue', type: 'dialogue', targets: ['cmn:dialogue:first-contact'] },
    { id: 'recall', type: 'recall_check', targets: ['cmn:word:hao'] },
    { id: 'outro', type: 'outro', targets: [] },
  ],
  exitChecks: [],
};
