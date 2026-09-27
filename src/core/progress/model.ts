import { z } from 'zod';

export const targetSchema = z.enum(['meaning', 'listening', 'reading', 'writing', 'production', 'perception']);
export type Target = z.infer<typeof targetSchema>;
export const relationSchema = z.object({
  id: z.string(), objectId: z.string(), target: targetSchema,
  state: z.enum(['NEW', 'FRAGILE', 'DEVELOPING', 'STABLE', 'DURABLE']),
  attempts: z.number().int().nonnegative(), delayedSuccesses: z.number().int().nonnegative(),
  lastAt: z.number().nonnegative(), lastSession: z.string(), dueAt: z.number().nonnegative(),
});
export type Relation = z.infer<typeof relationSchema>;
export type Attempt = { objectId: string; target: Target; result: 'success' | 'failure' | 'unsure'; assisted: boolean; sessionId: string; at: number };
export const relationId = (objectId: string, target: Target) => `${objectId}|${target}`;
export const DAY = 86_400_000;

// HYPOTHESIS: intervals are deliberately simple; only separated retrieval promotes stability.
export function updateRelation(previous: Relation | undefined, attempt: Attempt): Relation {
  const delayed = !!previous && attempt.sessionId !== previous.lastSession && attempt.at - previous.lastAt >= 20 * 3_600_000;
  const independent = attempt.result === 'success' && !attempt.assisted;
  const successes = independent && delayed ? (previous?.delayedSuccesses ?? 0) + 1 : independent ? previous?.delayedSuccesses ?? 0 : 0;
  const state = !independent ? 'FRAGILE' : successes >= 3 ? 'DURABLE' : successes >= 2 ? 'STABLE' : 'DEVELOPING';
  const interval = state === 'DURABLE' ? 7 * DAY : state === 'STABLE' ? 3 * DAY : DAY;
  return { id: relationId(attempt.objectId, attempt.target), objectId: attempt.objectId, target: attempt.target, state,
    attempts: (previous?.attempts ?? 0) + 1, delayedSuccesses: successes, lastAt: attempt.at,
    lastSession: attempt.sessionId, dueAt: attempt.at + interval };
}
