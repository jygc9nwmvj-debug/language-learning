type InstallNavigator = Pick<Navigator, 'userAgent' | 'platform' | 'maxTouchPoints'> & {
  userAgentData?: { mobile: boolean };
  standalone?: boolean;
};
type InstallPrompt = Event & { prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }> };
type InstallAccess = 'native' | 'safari' | null;

// No standard API identifies Safari's Home Screen menu. Keep the UA fallback
// confined to mobile/browser eligibility; Chromium installability is event-led.
export function installEnvironment(nav: InstallNavigator) {
  const ios = /iPhone|iPad|iPod/.test(nav.userAgent) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1);
  const mobile = nav.userAgentData?.mobile ?? (ios || /Android/.test(nav.userAgent));
  const safari = ios && /Version\/[\d.]+.*Safari\//.test(nav.userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(nav.userAgent);
  return { mobile, safari };
}

let pending: InstallPrompt | null = null;
let access: InstallAccess = null;
let started = false, installed = false, attempted = false;
const listeners = new Set<() => void>();
export const getInstallAccess = () => access;
export function subscribeInstall(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function publish(next: InstallAccess) {
  if (access === next) return;
  access = next;
  listeners.forEach(listener => listener());
}

// Called before the lazy App import so an early prompt is retained even while
// IndexedDB/the first screen is loading. State lasts only for this document.
export function captureInstall() {
  if (started) return;
  started = true;
  const nav = navigator as InstallNavigator;
  const { mobile, safari } = installEnvironment(nav);
  const standalone = window.matchMedia('(display-mode: standalone)');
  const fullscreen = window.matchMedia('(display-mode: fullscreen)');
  const runningInstalled = () => nav.standalone === true || standalone.matches || fullscreen.matches;
  const refresh = () => {
    if (runningInstalled()) { installed = true; pending = null; }
    publish(!mobile || installed ? null : pending ? 'native' : safari ? 'safari' : null);
  };
  window.addEventListener('beforeinstallprompt', event => {
    const candidate = event as InstallPrompt;
    if (!mobile || runningInstalled() || installed || typeof candidate.prompt !== 'function') return;
    event.preventDefault();
    if (!attempted) pending = candidate;
    refresh();
  });
  window.addEventListener('appinstalled', () => { installed = true; pending = null; refresh(); });
  standalone.addEventListener('change', refresh);
  fullscreen.addEventListener('change', refresh);
  window.addEventListener('pageshow', refresh);
  refresh();
}

// Consume once, synchronously in the click handler (preserving user activation).
export async function promptInstall() {
  const prompt = pending;
  if (!prompt || access !== 'native') return;
  pending = null; attempted = true; publish(null);
  try {
    const result = await prompt.prompt();
    if (result.outcome === 'accepted') installed = true;
  } catch {
    // A rejected/expired browser prompt must not interrupt learning or retry itself.
  }
}
