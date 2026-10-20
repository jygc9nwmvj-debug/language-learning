import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { PlaybackControl } from './Controls';
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
export function AudioButton({ src, label = ui.listen, onPlay, autoPlay = false, emphasis = 'reference', onPlaybackChange, onEnded, slow=false, onActivate }: { onActivate?:()=>void; slow?:boolean; src: string; emphasis?: 'reference' | 'stimulus'; label?: string; onPlay?: () => void; autoPlay?: boolean; onPlaybackChange?: (playing: boolean) => void; onEnded?: () => void }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const callbacks = useRef({ onPlay, onPlaybackChange, onEnded }); callbacks.current = { onPlay, onPlaybackChange, onEnded };
  const blocked = useSyncExternalStore(subscribeCapture, () => captures > 0, () => false);
  const [loading,setLoading]=useState(false);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(false);
  async function play(automatic = false) {
    const audio = ref.current;
    if (!audio || captures > 0) return;
    if (automatic && document.hidden) { setError('Zum Anhören auf das Lautsprechersymbol tippen.'); return; }
    setLoading(true);stopReferenceAudio(); active = audio; audio.currentTime = 0; setError('');
    try {
      await audio.play();
      if (ref.current !== audio) return;
      setLoading(false);callbacks.current.onPlay?.();
    } catch (reason) {
      if (ref.current !== audio) return;
      setLoading(false);setPlaying(false); callbacks.current.onPlaybackChange?.(false);
      setError(automatic && reason instanceof DOMException && reason.name === 'NotAllowedError' ? 'Zum Anhören auf das Lautsprechersymbol tippen.' : ui.audioError);
    }
  }
  useEffect(() => {
    const audio = new Audio(src); ref.current = audio; setError(''); setPlaying(false); setLoading(false);
    const changed = (value: boolean) => { if (ref.current === audio) { setPlaying(value); callbacks.current.onPlaybackChange?.(value); } };
    audio.onplaying = () => changed(true); audio.onpause = () => changed(false); audio.onended = () => { changed(false); if (ref.current === audio) callbacks.current.onEnded?.(); };
    audio.onerror = () => { changed(false); if (ref.current === audio) setError(ui.audioError); };
    // Defer once so StrictMode's setup/cleanup probe cannot play twice. Never retry on rerender.
    const timer = autoPlay ? window.setTimeout(() => void play(true), 0) : undefined;
    return () => { window.clearTimeout(timer); ref.current = null; audio.onplaying = audio.onpause = audio.onended = audio.onerror = null; audio.pause(); if (active === audio) active = undefined; audio.removeAttribute('src'); audio.load(); };
  }, [src, autoPlay]);
  const canPause = playing;
  const isSlow=slow||label===ui.slow;
  const accessibleLabel = canPause ? isSlow?'Langsames Audio pausieren':label===ui.listen?'Audio pausieren':`${label} pausieren` : label;
  return <PlaybackControl emphasis={emphasis} playing={playing} loading={loading} variant={isSlow?'slow':'normal'} icon={canPause?'pause':isSlow?'turtle':'speaker'} label={accessibleLabel} disabled={blocked||loading} onClick={()=>{onActivate?.();if(canPause)ref.current?.pause();else void play();}} error={error}/>;
}
