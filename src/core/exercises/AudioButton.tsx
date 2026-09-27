import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ui } from '../i18n/de';
let active: HTMLAudioElement | undefined;
let captures = 0;
function subscribeCapture(listener: () => void) {
  window.addEventListener('audio-capture', listener);
  return () => window.removeEventListener('audio-capture', listener);
}
export function acquireAudioCapture() {
  captures++; window.dispatchEvent(new Event('audio-capture')); let released = false;
  return () => { if (released) return; released = true; captures--; window.dispatchEvent(new Event('audio-capture')); };
}
export function stopReferenceAudio(except?: HTMLAudioElement | null) { active?.pause(); document.querySelectorAll('audio').forEach(a => { if (a !== except) a.pause(); }); }
export function AudioButton({ src, label = ui.listen, onPlay }: { src: string; label?: string; onPlay?: () => void }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const blocked = useSyncExternalStore(subscribeCapture, () => captures > 0, () => false);
  const [error, setError] = useState(false);
  useEffect(() => () => { ref.current?.pause(); }, [src]);
  async function play() {
    if (captures > 0) return;
    stopReferenceAudio();
    const audio = new Audio(src); ref.current = audio; active = audio;
    setError(false);
    try { await audio.play(); onPlay?.(); } catch { setError(true); }
  }
  return <span className="audioControl"><button className="utilityButton" type="button" disabled={blocked} onClick={() => void play()}><span aria-hidden="true">▶ </span>{label}</button>{error && <span role="status">{ui.audioError}</span>}</span>;
}
