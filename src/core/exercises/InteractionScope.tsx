import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
// Small interaction guard, not a lesson scheduler. Locks are acquired synchronously
// at the gesture, so a fast second click cannot beat React's disabled-state render.
export function useInteractionScope() {
  const owners = useRef(new Set<symbol>());
  const [busy, setBusy] = useState(false);
  const acquire = useCallback(() => {
    const owner = Symbol('interaction'); owners.current.add(owner); setBusy(true);
    return () => { if (owners.current.delete(owner)) setBusy(owners.current.size > 0); };
  }, []);
  const canAdvance = useCallback(() => owners.current.size === 0, []);
  return useMemo(() => ({ acquire, canAdvance, busy }), [acquire, canAdvance, busy]);
}
const fallback = { acquire: () => () => {}, canAdvance: () => true, canStart: () => true, busy: false };
export const InteractionContext = createContext(fallback);
export const useInteraction = () => useContext(InteractionContext);
