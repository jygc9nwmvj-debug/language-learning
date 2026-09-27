import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { ui } from '../i18n/de';
export function WritingPad({ onDraw }: { onDraw: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef<number | null>(null); const last = useRef<{x: number; y: number} | null>(null);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const element = canvas.current!; const ctx = element.getContext('2d')!;
    ctx.clearRect(0, 0, 600, 600); ctx.strokeStyle = '#d7d2c5'; ctx.lineWidth = 1;
    ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(300, 0); ctx.lineTo(300, 600); ctx.moveTo(0, 300); ctx.lineTo(600, 300); ctx.stroke(); ctx.setLineDash([]);
  }, [version]);
  function point(e: PointerEvent<HTMLCanvasElement>) {
    const r = e.currentTarget.getBoundingClientRect(); return { x: (e.clientX - r.left) * 600 / r.width, y: (e.clientY - r.top) * 600 / r.height };
  }
  function move(e: PointerEvent<HTMLCanvasElement>) {
    if (drawing.current !== e.pointerId || !last.current) return;
    const p = point(e), ctx = canvas.current!.getContext('2d')!;
    ctx.strokeStyle = '#242c29'; ctx.lineWidth = 5 + 5 * (e.pressure || .5); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(last.current.x, last.current.y); ctx.lineTo(p.x, p.y); ctx.stroke(); last.current = p; onDraw();
  }
  return <div><canvas aria-label="Freies Schreibfeld" className="writingCanvas" width={600} height={600} ref={canvas}
    onPointerDown={e => { if (!e.isPrimary) return; drawing.current = e.pointerId; last.current = point(e); e.currentTarget.setPointerCapture(e.pointerId); }}
    onPointerMove={move} onPointerUp={() => { drawing.current = null; last.current = null; }} onPointerCancel={() => { drawing.current = null; last.current = null; }} />
    <button type="button" className="textButton" onClick={() => { drawing.current = null; last.current = null; setVersion(v => v + 1); }}>{ui.clear}</button>
  </div>;
}
