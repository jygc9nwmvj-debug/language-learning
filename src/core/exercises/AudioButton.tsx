import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Icon } from './Icon';
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
export function AudioButton({ src, label = ui.listen, onPlay, autoPlay = false, onPlaybackChange, onEnded }: { src: string; label?: string; onPlay?: () => void; autoPlay?: boolean; onPlaybackChange?: (playing: boolean) => void; onEnded?: () => void }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const callbacks = useRef({ onPlay, onPlaybackChange, onEnded }); callbacks.current = { onPlay, onPlaybackChange, onEnded };
  const blocked = useSyncExternalStore(subscribeCapture, () => captures > 0, () => false);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(false);
  async function play(automatic = false) {
    const audio = ref.current;
    if (!audio || captures > 0) return;
    if (automatic && document.hidden) { setError('Zum Anhören auf Play tippen.'); return; }
    stopReferenceAudio(); active = audio; audio.currentTime = 0; setError('');
    try {
      await audio.play();
      if (ref.current !== audio) return;
      callbacks.current.onPlay?.();
    } catch (reason) {
      if (ref.current !== audio) return;
      setPlaying(false); callbacks.current.onPlaybackChange?.(false);
      setError(automatic && reason instanceof DOMException && reason.name === 'NotAllowedError' ? 'Zum Anhören auf Play tippen.' : ui.audioError);
    }
  }
  useEffect(() => {
    const audio = new Audio(src); ref.current = audio; setError(''); setPlaying(false);
    const changed = (value: boolean) => { if (ref.current === audio) { setPlaying(value); callbacks.current.onPlaybackChange?.(value); } };
    audio.onplaying = () => changed(true); audio.onpause = () => changed(false); audio.onended = () => { changed(false); if (ref.current === audio) callbacks.current.onEnded?.(); };
    audio.onerror = () => { changed(false); if (ref.current === audio) setError(ui.audioError); };
    // Defer once so StrictMode's setup/cleanup probe cannot play twice. Never retry on rerender.
    const timer = autoPlay ? window.setTimeout(() => void play(true), 0) : undefined;
    return () => { window.clearTimeout(timer); ref.current = null; audio.onplaying = audio.onpause = audio.onended = audio.onerror = null; audio.pause(); if (active === audio) active = undefined; audio.removeAttribute('src'); audio.load(); };
  }, [src, autoPlay]);
  const canPause = autoPlay && playing;
  const accessibleLabel = canPause ? 'Vorlage pausieren' : label;
  return <span className="audioControl"><button className="utilityButton audioButton" type="button" aria-label={accessibleLabel} title={accessibleLabel} disabled={blocked} onClick={() => canPause ? ref.current?.pause() : void play()}><Icon name={canPause ? 'pause' : 'play'} />{label !== ui.listen ? <span>{label === ui.slow ? 'langsam' : label}</span> : error && <span>Anhören</span>}</button>{error && <span role="status">{error}</span>}</span>;
}
