import { useEffect, useRef, useState } from 'react';
import { ui } from '../i18n/de';
export function Recorder({ onEvent }: { onEvent: (type: string) => void }) {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'recording'>('idle');
  const [url, setUrl] = useState(''); const [error, setError] = useState(false);
  const cleanup = useRef<() => void>(() => {}); const currentURL = useRef('');
  const generation = useRef(0); const busy = useRef(false);
  useEffect(() => () => { generation.current++; cleanup.current(); URL.revokeObjectURL(currentURL.current); }, []);
  async function start() {
    if (busy.current) return; busy.current = true;
    const token = ++generation.current;
    setStatus('requesting'); setError(false);
    URL.revokeObjectURL(currentURL.current); setUrl('');
    let stream: MediaStream | undefined;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (token !== generation.current) { stream.getTracks().forEach(t => t.stop()); return; }
      const recorder = new MediaRecorder(stream); const chunks: Blob[] = [];
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      const timer = window.setTimeout(() => cleanup.current(), 15000);
      cleanup.current = () => { window.clearTimeout(timer); if (recorder.state !== 'inactive') recorder.stop(); stream?.getTracks().forEach(t => t.stop()); };
      recorder.onstop = () => {
        if (token !== generation.current) return;
        const next = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType }));
        currentURL.current = next; setUrl(next); setStatus('idle'); busy.current = false;
        onEvent('recording_completed_uncertain');
      };
      recorder.start(); setStatus('recording'); onEvent('recording_started');
    } catch {
      stream?.getTracks().forEach(t => t.stop());
      busy.current = false;
      if (token === generation.current) { setError(true); setStatus('idle'); onEvent('microphone_unavailable'); }
    }
  }
  return <section className="toolPanel">
    <button className="secondaryButton" type="button" disabled={status === 'requesting'} onClick={() => status === 'recording' ? cleanup.current() : void start()}>{status === 'recording' ? ui.stop : status === 'requesting' ? ui.requesting : ui.record}</button>
    {status === 'recording' && <p role="status">{ui.recording}</p>}
    {url && <audio aria-label={ui.replayOwn} controls src={url} />}
    {error && <p role="status">{ui.micError}</p>}
    <p className="privacyNote">{ui.micNote}</p>
  </section>;
}
