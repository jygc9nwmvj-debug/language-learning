import { useEffect, useRef, useState } from 'react';
import { ui } from '../i18n/de';
let active: HTMLAudioElement | undefined;
export function AudioButton({ src, label = ui.listen, onPlay }: { src: string; label?: string; onPlay?: () => void }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => () => { ref.current?.pause(); }, [src]);
  async function play() {
    active?.pause();
    const audio = new Audio(src); ref.current = audio; active = audio;
    setError(false);
    try { await audio.play(); onPlay?.(); } catch { setError(true); }
  }
  return <span className="audioControl"><button className="secondaryButton" type="button" onClick={() => void play()}><span aria-hidden="true">▶ </span>{label}</button>{error && <span role="status">{ui.audioError}</span>}</span>;
}
