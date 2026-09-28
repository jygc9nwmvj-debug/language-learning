import { content } from './content/index.ts';
import type { ResearchEvent } from '../../core/progress/db.ts';
import type { Assessment, Item } from './schema/content.ts';
// Historical pilot API retained for existing evidence/tests; runtime profiles now live in canonical content.
export const attentionPilots = Object.fromEntries(content.items.filter(i=>['nihao','hao'].includes(i.id)).map(i=>[i.id,i.introduction]));
export function hasToneAttention(item: Item, events: ResearchEvent[]) {
  return events.some(e => e.type === 'tone_attention_confirmed' && e.detail.item === item.id && e.detail.toneNumbers === item.toneNumbers && e.detail.attentionVersion === 1);
}
export function hasItemAttention(item: Item, script: string, events: ResearchEvent[]) {
  return hasToneAttention(item, events) && events.some(e => e.type === 'item_attention_completed' && e.detail.item === item.id && e.detail.script === script && e.detail.form === item[script === 'hans' ? 'hans' : 'hant'] && e.detail.attentionVersion === 1);
}
export function attentionAssessment(declared: Assessment, item: Item, events: ResearchEvent[]): Assessment {
  const notationIntroduced = events.some(e => e.taskId === 'tones' && ['task_completed', 'tone_notation_introduced'].includes(e.type));
  const toneNotation = declared.toneNotation && notationIntroduced && hasToneAttention(item, events);
  return { toneNotation, neutralTone: toneNotation && declared.neutralTone };
}
