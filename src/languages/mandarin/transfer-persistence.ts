import type { ResearchEvent } from '../../core/progress/db.ts';
import type { TransferState } from './mini-transfer.ts';

export const transferKey = 'mini-transfer-active-v1';
const final = (t: TransferState) => t.phase === 'result' || t.phase === 'done';
const sameRun = (a: TransferState, b: TransferState) =>
 a.caseId === b.caseId && a.revision === b.revision && a.sessionId === b.sessionId && a.index === b.index && a.firstSeenAt === b.firstSeenAt;

// Only this preference has run-specific merge semantics. Other preferences retain
// their existing import policy. Never combine answers from different occurrences.
export function reconcileTransfer(local: TransferState | null, incoming: TransferState | null, events: ResearchEvent[]): TransferState | null {
 let state = local ?? incoming;
 if (!state) return null;
 if (local && incoming && sameRun(local, incoming) &&
     ((!final(local) && final(incoming)) || (local.phase === 'result' && incoming.phase === 'done'))) state = incoming;
 state = { ...state };
 const matching = events.filter(e => e.sessionId === state!.sessionId && e.detail.caseId === state!.caseId && e.detail.revision === state!.revision);
 const assessed = matching.find(e => e.type === 'transfer_assessed' && e.detail.firstSeenAt === state!.firstSeenAt);
 const completed = matching.some(e => e.type === 'transfer_completed' && e.detail.index === state!.index &&
   (e.detail.firstSeenAt === state!.firstSeenAt || (e.detail.firstSeenAt === undefined && e.at >= state!.firstSeenAt)));
 if (!final(state) && assessed) {
  const split = (value: unknown) => typeof value === 'string' && value ? value.split(',') : [];
  state.phase = 'result';
  if (typeof assessed.detail.answer === 'string') state.answer = assessed.detail.answer;
  state.assessment = { outcome: 'features-only', cueCoverage: 'none', recognized: split(assessed.detail.recognized), missing: split(assessed.detail.missing), uncertain: assessed.detail.uncertain === true };
 }
 if (completed) state.phase = 'done';
 // Old saved classifications are preserved in the append-only event history,
 // but must never regain the old semantic certainty in the current experience.
 if (state.assessment) {
  const a = state.assessment;
  state.assessment = { ...a, outcome: 'features-only', cueCoverage: a.recognized.length ? a.missing.length ? 'some' : 'all' : 'none' };
 }
 return state;
}
