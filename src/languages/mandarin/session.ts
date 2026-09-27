import { content, taskMap } from './content/index.ts';
import { relationId, type Relation } from '../../core/progress/model.ts';
import type { Task } from './schema/content.ts';
export function objectFor(task: Task, script: 'hant' | 'hans') {
  return task.target === 'writing' || task.target === 'reading' ? `cmn:${task.itemId}:${script}` : `cmn:${task.itemId}`;
}
export function composeReview(relations: Relation[], script: 'hant' | 'hans', now: number, firstWritingReview = false) {
  const byId = new Map(relations.map(r => [r.id, r]));
  const candidates = content.reviewPlan.map(id => {
    const task = taskMap.get(id)!;
    const relation = byId.get(relationId(objectFor(task, script), task.target!));
    return { id, relation };
  });
  // Reserve one of the six slots for the first next-session recall; later use due dates.
  const due = candidates.filter(c => !c.relation || c.relation.dueAt <= now)
    .sort((a, b) => (a.relation?.dueAt ?? 0) - (b.relation?.dueAt ?? 0));
  const writing = candidates.find(c => c.id === 'write-recall');
  const includeWriting = !!writing && (firstWritingReview || due.includes(writing));
  const selected = due.filter(c => c.id !== 'write-recall').slice(0, includeWriting ? 5 : 6).map(c => c.id);
  return [...selected, ...(includeWriting ? ['write-recall'] : []), 'closure'];
}
export function withSpacedRetry(plan: string[], index: number, taskId: string) {
  if (plan.slice(index + 1).includes(taskId) || plan.filter(id => id === taskId).length >= 2) return plan;
  const closure = plan.indexOf('closure');
  // Never repeat immediately: require two intervening tasks, otherwise next session.
  if (closure - index < 3) return plan;
  const result = [...plan]; result.splice(Math.min(index + 3, closure), 0, taskId); return result;
}
