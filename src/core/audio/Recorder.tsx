import { Resolution } from '../exercises/Resolution';
import { IconButton, InfoDisclosure } from '../exercises/Controls';
import { useEffect, useRef, useState } from 'react';
import { useInteraction } from '../exercises/InteractionScope';
import { Icon } from '../exercises/Icon';
import { ui } from '../i18n/de';
import { stopReferenceAudio, acquireAudioCapture } from '../exercises/AudioButton';
type Status = 'idle' | 'requesting' | 'preparing' | 'recording' | 'finalizing';
// Keep the input alive until the recorder has delivered its final dataavailable + stop.
export function Recorder({ onEvent }: { onEvent: (type: string, detail?: Record<string, string | number | boolean>) => void }) {
  const interaction = useInteraction();
  const releaseInteraction = useRef<() => void>(() => {});
  const autoPlayed = useRef('');
  const [playbackNotice, setPlaybackNotice] = useState('');
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [url, setUrl] = useState(''), [error, setError] = useState('');
  const generation = useRef(0), busy = useRef(false), currentURL = useRef('');
  const releaseCaptureRef = useRef<() => void>(() => {});
  const cleanup = useRef<() => void>(() => {}), stop = useRef<() => void>(() => {});
  const playback = useRef<HTMLAudioElement>(null);
  useEffect(() => () => { generation.current++; cleanup.current(); releaseCaptureRef.current(); releaseInteraction.current(); playback.current?.pause(); URL.revokeObjectURL(currentURL.current); }, []);
  useEffect(() => {
    if (!url || status !== 'idle' || autoPlayed.current === url) return;
    autoPlayed.current = url;
    const audio = playback.current, token = generation.current;
    if (!audio) { releaseInteraction.current(); return; }
    if (document.hidden) { releaseInteraction.current(); setPlaybackNotice('Deine Aufnahme ist bereit. Du kannst sie hier abspielen.'); return; }
    void audio.play().catch((error: unknown) => {
      if (token !== generation.current) return;
      setPlaying(false); releaseInteraction.current();
      setPlaybackNotice(error instanceof DOMException && error.name === 'NotAllowedError' ? 'Automatisches Abspielen ist hier gesperrt. Tippe auf Wiedergabe.' : 'Automatisches Abspielen hat nicht geklappt. Tippe auf Wiedergabe oder nimm erneut auf.');
      onEvent('recording_autoplay_blocked');
    });
  }, [url, status]);
  function isCurrentPlayback(audio: HTMLAudioElement) {
    return !busy.current && playback.current === audio && currentURL.current === audio.getAttribute('src');
  }
  function playbackFinished(audio: HTMLAudioElement) {
    if (!isCurrentPlayback(audio)) return;
    // WebKit can reach ended=true on a recorded-blob replay without dispatching
    // ended/pause, leaving paused=false. Reconcile the actual media state, never
    // an estimated duration, and put the element in a replayable paused state.
    if (audio.ended && !audio.paused) audio.pause();
    setPlaying(false); releaseInteraction.current(); setPlaybackNotice('Zum Vergleichen kannst du beide Aufnahmen noch einmal hören.');
  }
  async function start() {
    if (busy.current || !interaction.canStart()) return;
    busy.current = true; onEvent('recording_preparing');
    playback.current?.pause(); releaseInteraction.current();
    releaseInteraction.current = interaction.acquire();
    setPlaying(false); setPlaybackNotice('');
    const token = ++generation.current;
    const current = () => token === generation.current;
    const releaseCapture = acquireAudioCapture(); releaseCaptureRef.current = releaseCapture; setStatus('requesting'); setError(''); stopReferenceAudio(); playback.current?.pause();
    URL.revokeObjectURL(currentURL.current); currentURL.current = ''; setUrl('');
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
        if (current()) { setStatus('finalizing'); onEvent('recording_finalizing'); }
        later(() => { if (recorder.state !== 'inactive') recorder.stop(); }, tail ? 200 : 0);
        // A broken browser must not leave the microphone active forever.
        later(() => { release(); if (current()) { busy.current = false; setStatus('idle'); setError(ui.recordingFailed); onEvent('recording_failed', { interrupted: true }); releaseInteraction.current(); generation.current++; } }, 5000);
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
        finally { if (context) await context.close(); if (current()) { setStatus('idle'); busy.current = false; if (!currentURL.current) releaseInteraction.current(); } }
      };
      setStatus('preparing');
      const startTimeout = later(() => { interrupted = true; finish(false); }, 10000);
      recorder.start(200);
    } catch {
      cleanup.current();
      stream?.getTracks().forEach(t => t.stop()); releaseCapture();
      if (current()) { busy.current = false; releaseInteraction.current(); setError(ui.micError); setStatus('idle'); onEvent('microphone_unavailable'); }
    }
  }
  async function replay() {
    const audio = playback.current, token = generation.current;
    if (!audio || busy.current) return;
    if (playing) { audio.pause(); return; }
    audio.currentTime = 0;
    try { await audio.play(); }
    catch { if (token === generation.current) { setError(ui.recordingPlaybackError); playbackFinished(audio); } }
  }
  const recordLabel = status === 'recording' ? ui.stop : status === 'requesting' ? ui.requesting : status === 'preparing' ? ui.preparing : status === 'finalizing' ? ui.finalizing : url ? 'Neu aufnehmen' : ui.record;
  const recordControl = <button className={`recordButton ${status === 'recording' ? 'isRecording' : ''} ${url ? 'isRetake' : ''}`} type="button" aria-label={recordLabel} title={recordLabel} disabled={(status === 'idle' && !interaction.canStart()) || (status !== 'idle' && status !== 'recording')} onClick={() => status === 'recording' ? stop.current() : void start()}><Icon name={status === 'recording' ? 'stop' : 'mic'} /><span className={url ? 'srOnly' : undefined}>{status === 'recording' ? 'Stopp' : recordLabel}</span></button>;
  return <section className="toolPanel recordingPanel" data-state={status === 'idle' ? url ? playing ? 'playback' : 'complete' : 'ready' : status}>
    <div className="recordingHeading">{url ? <strong>Deine Aufnahme</strong> : recordControl}<InfoDisclosure className="recordingInfo" label="Zur Aufnahme"><p>{ui.micNote}</p></InfoDisclosure></div>
    <p role="status" className="captureStatus">{status === 'recording' ? ui.recording : status === 'preparing' ? ui.recordingWait : status === 'finalizing' ? ui.finalizing : ''}</p>
    {url && <Resolution operation="recording" parts={{recording: <div className="ownRecording"><audio key={url} ref={playback} aria-label={ui.replayOwn} hidden src={url}
      onPlay={event => { const audio = event.currentTarget; if (!isCurrentPlayback(audio) || audio.paused || audio.ended) return; stopReferenceAudio(audio); setPlaying(true); setPlaybackNotice(''); releaseInteraction.current(); releaseInteraction.current = interaction.acquire(); }}
      onPause={event => { if (event.currentTarget.paused) playbackFinished(event.currentTarget); }}
      onEnded={event => { if (event.currentTarget.ended) playbackFinished(event.currentTarget); }}
      onTimeUpdate={event => { if (event.currentTarget.ended) playbackFinished(event.currentTarget); }}
      onError={event => { const audio = event.currentTarget; if (!isCurrentPlayback(audio) || !audio.error) return; setError(ui.recordingPlaybackError); playbackFinished(audio); }} />
      <div className="buttonRow"><IconButton icon={playing ? 'pause' : 'replay'} label={playing ? 'Wiedergabe pausieren' : 'Deine Aufnahme wiedergeben'} onClick={() => void replay()}/>{recordControl}</div>
      <p className="muted" role="status">{playing ? 'Deine Aufnahme wird abgespielt …' : playbackNotice === 'Zum Vergleichen kannst du beide Aufnahmen noch einmal hören.' ? '' : playbackNotice}</p></div>,}}/>}
    {error && <p role="status" className="feedback attention">{error}</p>}
  </section>;
}
