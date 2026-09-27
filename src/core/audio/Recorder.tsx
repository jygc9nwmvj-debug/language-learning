import { useEffect, useRef, useState } from 'react';
import { ui } from '../i18n/de';
import { stopReferenceAudio, acquireAudioCapture } from '../exercises/AudioButton';
type Status = 'idle' | 'requesting' | 'preparing' | 'recording' | 'finalizing';
// Keep the input alive until the recorder has delivered its final dataavailable + stop.
export function Recorder({ onEvent }: { onEvent: (type: string, detail?: Record<string, string | number | boolean>) => void }) {
  const [status, setStatus] = useState<Status>('idle');
  const [url, setUrl] = useState(''), [error, setError] = useState('');
  const generation = useRef(0), busy = useRef(false), currentURL = useRef('');
  const releaseCaptureRef = useRef<() => void>(() => {});
  const cleanup = useRef<() => void>(() => {}), stop = useRef<() => void>(() => {});
  const playback = useRef<HTMLAudioElement>(null);
  useEffect(() => () => { generation.current++; cleanup.current(); releaseCaptureRef.current(); URL.revokeObjectURL(currentURL.current); }, []);
  async function start() {
    if (busy.current) return;
    busy.current = true;
    const token = ++generation.current;
    const current = () => token === generation.current;
    const releaseCapture = acquireAudioCapture(); releaseCaptureRef.current = releaseCapture; setStatus('requesting'); setError(''); stopReferenceAudio(); playback.current?.pause();
    URL.revokeObjectURL(currentURL.current); setUrl('');
    let stream: MediaStream | undefined;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: {
        echoCancellation: false, noiseSuppression: false, autoGainControl: false,
      } });
      if (!current()) { stream.getTracks().forEach(t => t.stop()); return; }
      const input = stream;
      const mimeType = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg;codecs=opus'].find(t => MediaRecorder.isTypeSupported(t));
      const recorder = new MediaRecorder(input, mimeType ? { mimeType } : undefined);
      const chunks: Blob[] = [];
      let ready = false, started = false, ending = false, interrupted = false;
      const timers: number[] = [];
      const later = (fn: () => void, ms: number) => { const id = window.setTimeout(fn, ms); timers.push(id); return id; };
      const clearTimers = () => timers.forEach(window.clearTimeout);
      const release = () => { clearTimers(); input.getTracks().forEach(t => t.stop()); document.removeEventListener('visibilitychange', hidden); releaseCapture(); };
      const captureRequestedAt = performance.now();
      const announceReady = () => {
        if (ready || ending || !started || !input.getAudioTracks().length || !input.getAudioTracks().every(t => t.readyState === 'live' && !t.muted)) return;
        ready = true; window.clearTimeout(startTimeout);
        if (current()) { setStatus('recording'); onEvent('recording_started', { mimeType: recorder.mimeType, preparationMs: Math.round(performance.now() - captureRequestedAt) }); }
        later(() => finish(), 60000);
      };
      const finish = (tail = true) => {
        if (ending) return; ending = true; clearTimers();
        if (current()) setStatus('finalizing');
        later(() => { if (recorder.state !== 'inactive') recorder.stop(); }, tail ? 200 : 0);
        // A broken browser must not leave the microphone active forever.
        later(() => { release(); if (current()) { busy.current = false; setStatus('idle'); setError(ui.recordingFailed); generation.current++; } }, 5000);
      };
      cleanup.current = () => finish(false);
      stop.current = () => finish();
      const interrupt = () => { if (ending) return; interrupted = true; finish(false); };
      const hidden = () => { if (document.hidden) interrupt(); };
      document.addEventListener('visibilitychange', hidden);
      input.getAudioTracks().forEach(track => { track.addEventListener('ended', interrupt); track.addEventListener('unmute', announceReady); track.addEventListener('mute', () => { if (ready) interrupt(); }); });
      // start is the browser's recording-start signal; chunk delivery is not a readiness clock.
      recorder.onstart = () => { started = true; announceReady(); };
      recorder.onpause = interrupt;
      recorder.onerror = interrupt;
      recorder.ondataavailable = event => {
        if (!event.data.size) return;
        chunks.push(event.data);

      };
      recorder.onstop = async () => {
        if (!ending) interrupted = true;
        release();
        if (!current()) return;
        let context: AudioContext | undefined;
        try {
          const blob = new Blob(chunks, { type: chunks[0]?.type || recorder.mimeType });
          if (!ready || blob.size === 0) throw new Error('No capture');
          context = new AudioContext();
          const decoded = await context.decodeAudioData(await blob.arrayBuffer());
          if (decoded.duration < .02) throw new Error('Empty capture');
          // A click alone has a peak too: require several short windows with audible energy.
          // This is only a recording-health warning, never speech or pronunciation recognition.
          let activeMs = 0;
          const windowSize = Math.max(1, Math.round(decoded.sampleRate * .02));
          for (let offset = 0; offset < decoded.length; offset += windowSize) {
            let audible = false;
            for (let c = 0; c < decoded.numberOfChannels; c++) {
              const samples = decoded.getChannelData(c); let energy = 0;
              const end = Math.min(offset + windowSize, samples.length);
              for (let i = offset; i < end; i++) energy += samples[i] * samples[i];
              if (Math.sqrt(energy / (end - offset)) > .004) audible = true;
            }
            if (audible) activeMs += 20;
          }
          if (!current()) return;
          currentURL.current = URL.createObjectURL(blob); setUrl(currentURL.current);
          setError(interrupted ? ui.recordingInterrupted : activeMs < 80 ? ui.recordingQuiet : '');
          onEvent('recording_completed_uncertain', { durationMs: Math.round(decoded.duration * 1000), activeMs, chunks: chunks.length, bytes: blob.size, mimeType: blob.type, interrupted });
        } catch { if (current()) { setError(interrupted ? ui.recordingInterrupted : ui.recordingFailed); onEvent('recording_failed', { interrupted }); } }
        finally { if (context) await context.close(); if (current()) { setStatus('idle'); busy.current = false; } }
      };
      setStatus('preparing');
      const startTimeout = later(() => { interrupted = true; finish(false); }, 10000);
      recorder.start(200);
    } catch {
      cleanup.current();
      stream?.getTracks().forEach(t => t.stop()); releaseCapture();
      if (current()) { busy.current = false; setError(ui.micError); setStatus('idle'); onEvent('microphone_unavailable'); }
    }
  }
  return <section className="toolPanel">
    <button className="secondaryButton" type="button" disabled={status !== 'idle' && status !== 'recording'} onClick={() => status === 'recording' ? stop.current() : void start()}>{status === 'recording' ? ui.stop : status === 'requesting' ? ui.requesting : status === 'preparing' ? ui.preparing : status === 'finalizing' ? ui.finalizing : ui.record}</button>
    <p role="status">{status === 'recording' ? ui.recording : status === 'preparing' ? ui.recordingWait : status === 'finalizing' ? ui.finalizing : ''}</p>
    {url && <audio ref={playback} aria-label={ui.replayOwn} controls src={url} onPlay={() => stopReferenceAudio(playback.current)} onError={() => setError(ui.recordingPlaybackError)} />}
    {error && <p role="status">{error}</p>}
    <p className="privacyNote">{ui.micNote}</p>
  </section>;
}
