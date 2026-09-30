import { reserveTransfer, transferState, atTransfer } from './mini-transfer';
import type { Session, ResearchEvent } from '../../core/progress/db';

// Dynamically imported only behind Vite's compile-time DEV guard.
const key='mandarin-dev-mini-transfer-armed';
export function isArmed() { return import.meta.env.DEV && localStorage.getItem(key)==='yes'; }
export function arm() {
  if(!import.meta.env.DEV)throw new Error('Local testing only');
  localStorage.setItem(key,'yes');
}
export async function reserveLocalTransfer(session:Session,events:ResearchEvent[]) {
  if(!import.meta.env.DEV)return null;
  const before=await transferState();
  const armed=isArmed();
  const state=await reserveTransfer(session,Date.now(),armed);
  if(armed && atTransfer(session,state) && (!before || before.phase==='done'))localStorage.removeItem(key);
  return state;
}
