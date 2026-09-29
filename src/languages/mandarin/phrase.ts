import { content, itemMap, taskMap } from './content/index.ts';
import type { Explanation, Item } from './schema/content.ts';
import type { ResearchEvent } from '../../core/progress/db.ts';
import { numberedToPinyin } from './pinyin.ts';
const words = new Map(content.words.map(w => [w.id,w]));
export function phraseUnits(item: Item, script: 'hant' | 'hans') {
  return item.exploration?.units.map(unit => {
    const form = unit.words.map(id => words.get(id)![script]).join('');
    return { ...unit, form, characters: [...form].map((hanzi,index) => ({ hanzi, pinyin: numberedToPinyin(unit.syllables[index]), note: unit.characters?.find(c => c.index === index)?.note,
      writingTarget: content.tasks.some(t => t.kind === 'writing' && !t.recall && itemMap.get(t.itemId!)?.[script] === hanzi) })), audio: unit.audio.kind === 'item' ? itemMap.get(unit.audio.item)!.audio : unit.audio.kind === 'reference' ? unit.audio.src : undefined, audioContext: unit.audio.kind === 'phrase' ? unit.audio.reason : undefined };
  });
}
export function familiarItem(item: Item | undefined, history: ResearchEvent[] = []) {
  if (!item) return false;
  return history.some(e => ['task_completed','item_attention_completed'].includes(e.type) && (e.detail.item === item.id || taskMap.get(e.taskId)?.itemId === item.id));
}
export function explanationParts(copy: Explanation, script: 'hant' | 'hans') {
  return (typeof copy === 'string' ? [copy] : copy).map(part => typeof part === 'string' ? part : { form: words.get(part.word)![script], pinyin: words.get(part.word)!.pinyin, gloss: part.gloss });
}
export function explanationText(copy: Explanation, script: 'hant' | 'hans') {
  return explanationParts(copy,script).map(p => typeof p === 'string' ? p : `${p.form} ${p.pinyin} (${p.gloss})`).join('');
}
