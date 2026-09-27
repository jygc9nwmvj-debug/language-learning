let generation = 0;
let cancelPrevious = () => {};
function status(value: string) {
  document.documentElement.dataset.offline = value;
  window.dispatchEvent(new Event('offline-ready'));
}
// Ready means the active worker verified its complete offline cache, not merely
// that navigator.serviceWorker.ready found some (possibly old) active worker.
export function prepareOffline(repair = false) {
  cancelPrevious(); const token = ++generation;
  if (!('serviceWorker' in navigator)) { status('unavailable'); return; }
  status('waiting');
  let settled = false, registration: ServiceWorkerRegistration | undefined;
  const cleanups: Array<() => void> = [];
  const finish = (value: string) => {
    if (settled || token !== generation) return;
    settled = true; cleanups.forEach(fn => fn()); status(value);
  };
  const deadline = window.setTimeout(() => finish('failed'), 45000);
  cleanups.push(() => clearTimeout(deadline));
  cancelPrevious = () => { settled = true; cleanups.forEach(fn => fn()); };
  let probing: ServiceWorker | undefined, repairSent = false;
  async function check() {
    const worker = registration?.active;
    if (settled || !worker || worker.state !== 'activated' || probing === worker) return;
    probing = worker;
    const channel = new MessageChannel();
    const timeout = window.setTimeout(() => { channel.port1.close(); probing = undefined;
      if (registration?.active !== worker) void check();
      else if (!registration?.installing && !registration?.waiting) finish('failed');
    }, 4000);
    cleanups.push(() => { clearTimeout(timeout); channel.port1.close(); });
    channel.port1.onmessage = event => {
      if (settled || event.data?.type !== 'OFFLINE_STATUS') return;
      clearTimeout(timeout); channel.port1.close(); probing = undefined;
      if (event.data.ready) finish('ready'); else finish('failed');
    };
    const type = repair && !repairSent ? 'REPAIR_OFFLINE' : 'CHECK_OFFLINE';
    if (type === 'REPAIR_OFFLINE') repairSent = true;
    // Repair may need the full preparation window, not the short status timeout.
    if (type === 'REPAIR_OFFLINE') clearTimeout(timeout);
    try { worker.postMessage({ type }, [channel.port2]); } catch { finish('failed'); }
  }
  const watch = (worker: ServiceWorker | null) => {
    if (!worker) return;
    const changed = () => {
      if (worker.state === 'activated') void check();
      else if (worker.state === 'redundant' && !registration?.active) finish('failed');
    };
    worker.addEventListener('statechange', changed);
    cleanups.push(() => worker.removeEventListener('statechange', changed));
  };
  const controllerChanged = () => void check();
  navigator.serviceWorker.addEventListener('controllerchange', controllerChanged);
  cleanups.push(() => navigator.serviceWorker.removeEventListener('controllerchange', controllerChanged));
  void navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then(reg => {
    if (settled) return;
    registration = reg;
    const found = () => watch(reg.installing);
    reg.addEventListener('updatefound', found); cleanups.push(() => reg.removeEventListener('updatefound', found));
    watch(reg.installing); watch(reg.waiting); watch(reg.active);
    void reg.update().catch(() => { if (!reg.active) finish('failed'); });
    void check();
  }).catch(() => finish('failed'));
}
