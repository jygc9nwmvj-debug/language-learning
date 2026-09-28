import type { ResearchEvent } from '../../core/progress/db.ts';
import type { Assessment, Item } from './schema/content.ts';
// Small pilot configuration. Canonical forms/tones/audio continue to come from content.
export const attentionPilots: Record<string, { role: 'recognition' | 'writing'; toneNote: string }> = {
  nihao: { role: 'recognition', toneNote: 'Geschrieben werden beide Silben mit dem 3. Ton. Zusammen gesprochen steigt die erste Silbe: ní hǎo. Das ist kein Widerspruch zum geschriebenen nǐ hǎo.' },
  hao: { role: 'writing', toneNote: 'hǎo hat den 3. Ton. Achte auf die tiefe Stimme. Die volle Einzelkontur fällt und steigt; im Gespräch bleibt der Ton oft tief.' },
};
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
