import { useRef, useState } from 'react';

type PitchPoint = { t: number; hz: number };

type Props = {
  target?: 'rising' | 'falling' | 'low' | 'high' | 'free';
  onRecorded?: (points: PitchPoint[]) => void;
};

function autoCorrelate(buffer: Float32Array, sampleRate: number): number | null {
  let rms = 0;
  for (let i = 0; i < buffer.length; i += 1) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / buffer.length);
  if (rms < 0.015) return null;

  const minHz = 70;
  const maxHz = 420;
  const minLag = Math.floor(sampleRate / maxHz);
  const maxLag = Math.min(Math.floor(sampleRate / minHz), buffer.length - 1);

  let bestLag = -1;
  let best = -Infinity;
  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let corr = 0;
    for (let i = 0; i < buffer.length - lag; i += 1) {
      corr += buffer[i] * buffer[i + lag];
    }
    if (corr > best) {
      best = corr;
      bestLag = lag;
    }
  }
  return bestLag > 0 ? sampleRate / bestLag : null;
}

function normalize(points: PitchPoint[]) {
  if (points.length < 2) return [];
  const hz = points.map((p) => p.hz);
  const min = Math.min(...hz);
  const max = Math.max(...hz);
  const span = Math.max(max - min, 1);
  return points.map((p, i) => ({ x: i / Math.max(points.length - 1, 1), y: (p.hz - min) / span }));
}

function simpleFeedback(points: PitchPoint[], target: Props['target']) {
  if (points.length < 5) return 'I could not detect a stable pitch yet. Try once more, a little closer to the microphone.';
  if (!target || target === 'free') return 'Pitch captured locally. Compare the shape rather than the absolute height.';
  const norm = normalize(points);
  const first = norm[0]?.y ?? 0;
  const last = norm[norm.length - 1]?.y ?? 0;
  const delta = last - first;
  if (target === 'rising') return delta > 0.25 ? 'Clear rise.' : 'The contour stayed fairly flat. Try a more obvious rise.';
  if (target === 'falling') return delta < -0.25 ? 'Clear fall.' : 'The fall was not very clear yet.';
  if (target === 'high') return 'For tone 1, aim for a high, relatively level contour rather than a large movement.';
  return 'For tone 3, focus first on getting low. A full dip-and-rise is not required in every context.';
}

export function PitchRecorder({ target = 'free', onRecorded }: Props) {
  const [recording, setRecording] = useState(false);
  const [points, setPoints] = useState<PitchPoint[]>([]);
  const [feedback, setFeedback] = useState('');
  const stopRef = useRef<(() => void) | null>(null);

  const start = async () => {
    setFeedback('');
    setPoints([]);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      const data = new Float32Array(analyser.fftSize);
      const startedAt = performance.now();
      const captured: PitchPoint[] = [];
      let raf = 0;
      let lastSample = 0;

      const tick = (now: number) => {
        if (now - lastSample > 45) {
          analyser.getFloatTimeDomainData(data);
          const hz = autoCorrelate(data, context.sampleRate);
          if (hz) captured.push({ t: (now - startedAt) / 1000, hz });
          lastSample = now;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      setRecording(true);

      stopRef.current = () => {
        cancelAnimationFrame(raf);
        stream.getTracks().forEach((track) => track.stop());
        void context.close();
        setRecording(false);
        setPoints(captured);
        setFeedback(simpleFeedback(captured, target));
        onRecorded?.(captured);
      };
    } catch {
      setFeedback('Microphone access was unavailable. You can continue without automatic pitch feedback.');
    }
  };

  const normalized = normalize(points);
  const polyline = normalized.map((p) => `${p.x * 300},${90 - p.y * 70}`).join(' ');

  return (
    <section className="toolPanel" aria-label="Local pitch recorder">
      <div className="buttonRow">
        {!recording ? (
          <button type="button" onClick={() => void start()}>Record locally</button>
        ) : (
          <button type="button" onClick={() => stopRef.current?.()}>Stop</button>
        )}
      </div>
      {points.length > 0 && (
        <svg className="pitchGraph" viewBox="0 0 300 100" role="img" aria-label="Your pitch contour">
          <line x1="0" y1="90" x2="300" y2="90" />
          <polyline points={polyline} fill="none" stroke="currentColor" strokeWidth="4" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      {feedback && <p className="feedback">{feedback}</p>}
      <p className="privacyNote">Audio is analyzed in this browser and is not uploaded.</p>
    </section>
  );
}
