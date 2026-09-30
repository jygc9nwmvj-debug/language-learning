import { transferKey, reconcileTransfer } from '../../languages/mandarin/transfer-persistence.ts';
import Dexie, { type Table } from 'dexie';
import { z } from 'zod';
import { relationSchema, relationId, updateRelation, type Attempt, type Relation } from './model.ts';

// UI feedback belongs to the current occurrence, not to the research log.
const feedbackSchema = z.object({
  value: z.string(), message: z.string(), kind: z.enum(['success', 'attention', 'error']),
  help: z.boolean().optional(), result: z.enum(['success','failure','unsure']).optional(),
  ink: z.array(z.string()).optional(), inkSize: z.number().positive().optional(), stage: z.number().int().nonnegative().optional(),
  mode: z.string().optional(), selfReport: z.boolean().optional(),
});
export type FeedbackEvent = { type: string; detail: Record<string, string | number | boolean> };
export type Checkpoint = (step: string, feedback?: SavedFeedback, events?: FeedbackEvent[]) => Promise<void>;
export type SavedFeedback = z.infer<typeof feedbackSchema>;
const evaluationSchema = z.object({
  index: z.number().int().nonnegative(), taskId: z.string(), step: z.string(),
  results: z.record(z.string(), feedbackSchema),
});
export type SavedEvaluation = z.infer<typeof evaluationSchema>;
export const sessionSchema = z.object({
  id: z.string(), plannerVersion: z.literal('d1').optional(), plan: z.array(z.string()).max(100), index: z.number().int().nonnegative(),
  completed: z.boolean(), startedAt: z.number(), updatedAt: z.number(),
  script: z.enum(['hant', 'hans']), evaluation: evaluationSchema.optional(),
}).refine(s => s.plan.length > 0 && s.index < s.plan.length, 'Invalid session cursor');
export type Session = z.infer<typeof sessionSchema>;
const eventSchema = z.object({
  id: z.string(), at: z.number(), sessionId: z.string(), taskId: z.string(), type: z.string(),
  contentVersion: z.string(), detail: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
});
export type ResearchEvent = z.infer<typeof eventSchema>;
export class LearningDatabase extends Dexie {
  relations!: Table<Relation, string>;
  sessions!: Table<Session, string>;
  events!: Table<ResearchEvent, string>;
  preferences!: Table<{key: string; value: string}, string>;
  constructor(name = 'language-learning-local') {
    super(name);
    this.version(1).stores({ itemProgress: 'id,itemId,skill', lessonProgress: 'lessonId', preferences: 'key' });
    // Preserve old prototype tables for backup; its button-click "successes" are not valid evidence.
    this.version(2).stores({ relations: 'id,objectId,target,dueAt', sessions: 'id,updatedAt', events: 'id,sessionId,at', preferences: 'key' });
  }
}
export const db = new LearningDatabase();
export async function logEvent(event: Omit<ResearchEvent, 'id' | 'at' | 'contentVersion'>) {
  await db.events.add({ ...event, id: crypto.randomUUID(), at: Date.now(), contentVersion: 'build-d-1' });
}
export async function recordAttempt(attempt: Attempt, event: Omit<ResearchEvent, 'id' | 'at' | 'contentVersion'>) {
  await db.transaction('rw', db.relations, db.events, async () => {
    const old = await db.relations.get(relationId(attempt.objectId, attempt.target));
    await db.relations.put(updateRelation(old, attempt));
    await logEvent(event);
  });
}
const backupSchema = z.object({
  version: z.literal(2), exportedAt: z.string(), relations: z.array(relationSchema),
  sessions: z.array(sessionSchema), events: z.array(eventSchema),
  preferences: z.array(z.object({ key: z.string(), value: z.string() })),
  legacy: z.object({ itemProgress: z.array(z.unknown()), lessonProgress: z.array(z.unknown()) }).optional(),
});
export async function exportLearningState() {
  return db.transaction('r', db.tables, async () => JSON.stringify({
    version: 2, exportedAt: new Date().toISOString(), relations: await db.relations.toArray(),
    sessions: await db.sessions.toArray(), events: await db.events.toArray(), preferences: await db.preferences.toArray(),
    legacy: { itemProgress: await db.table('itemProgress').toArray(), lessonProgress: await db.table('lessonProgress').toArray() },
  }, null, 2));
}
export async function importLearningState(raw: string, validTasks: Set<string>) {
  const backup = backupSchema.parse(JSON.parse(raw));
  if (backup.sessions.some(s => s.plan.some(id => !validTasks.has(id)))) throw new Error('Unknown task');
  if (backup.relations.some(r => r.id !== relationId(r.objectId, r.target))) throw new Error('Invalid relation');
  // Merge is reversible via prior export and does not erase the append-only research history.
  await db.transaction('rw', db.relations, db.sessions, db.events, db.preferences, async () => {
    for (const r of backup.relations) {
      const current = await db.relations.get(r.id);
      if (!current || current.lastAt < r.lastAt) await db.relations.put(r);
    }
    for (const s of backup.sessions) {
      const current = await db.sessions.get(s.id);
      if (!current || current.updatedAt < s.updatedAt) await db.sessions.put(s);
    }
    for (const e of backup.events) if (!(await db.events.get(e.id))) await db.events.add(e);
    for (const p of backup.preferences) {
      const current = await db.preferences.get(p.key);
      if (p.key === transferKey) {
        const merged = reconcileTransfer(current ? JSON.parse(current.value) : null, JSON.parse(p.value), await db.events.toArray());
        if (merged) await db.preferences.put({ key: transferKey, value: JSON.stringify(merged) });
      } else if (!current) await db.preferences.add(p);
    }
  });
}

// Explicit learner-requested restart. All learner tables, including legacy history,
// clear together; application/audio caches are intentionally outside this transaction.
export async function resetLearningState() {
  await db.transaction('rw', db.tables, async () => {
    for (const table of db.tables) await table.clear();
  });
}
