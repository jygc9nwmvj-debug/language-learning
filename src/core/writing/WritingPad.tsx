import { useEffect, useRef, useState } from 'react';

type Point = { x: number; y: number; pressure: number };
type Stroke = Point[];

type Props = {
  character: string;
  onComplete?: (strokeCount: number) => void;
};

export function WritingPad({ character, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentRef = useRef<Stroke | null>(null);
  const [showGuide, setShowGuide] = useState(true);
  const [paperMode, setPaperMode] = useState(false);

  const resize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const box = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(box.width * dpr);
    canvas.height = Math.round(box.height * dpr);
    const ctx = canvas.getContext('2d');
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw();
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(24,24,22,.12)';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(width / 2, 0); ctx.lineTo(width / 2, height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2); ctx.stroke();
    ctx.setLineDash([]);
    if (showGuide) {
      ctx.fillStyle = 'rgba(24,24,22,.10)';
      ctx.font = `${Math.min(width, height) * .7}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(character, width / 2, height / 2 + 4);
    }
    ctx.strokeStyle = '#181816';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const stroke of strokesRef.current) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (const p of stroke.slice(1)) {
        ctx.lineWidth = 5 + p.pressure * 4;
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }
  };

  useEffect(() => {
    resize();
    const onResize = () => resize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character, showGuide]);

  const coordinates = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      pressure: event.pressure || .5,
    };
  };

  const pointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const stroke: Stroke = [coordinates(event)];
    strokesRef.current.push(stroke);
    currentRef.current = stroke;
  };

  const pointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!currentRef.current) return;
    currentRef.current.push(coordinates(event));
    redraw();
  };

  const pointerUp = () => {
    currentRef.current = null;
    redraw();
  };

  const clear = () => {
    strokesRef.current = [];
    currentRef.current = null;
    redraw();
  };

  if (paperMode) {
    return (
      <section className="paperMode toolPanel">
        <p className="paperCharacter">{character}</p>
        <p>Write this character on paper. Use the reference only when you need it.</p>
        <div className="buttonRow">
          <button type="button" onClick={() => window.print()}>Print worksheet</button>
          <button className="secondaryButton" type="button" onClick={() => setShowGuide((v) => !v)}>
            {showGuide ? 'Hide reference' : 'Show reference'}
          </button>
          <button className="secondaryButton" type="button" onClick={() => setPaperMode(false)}>Back to screen</button>
        </div>
        <button type="button" onClick={() => onComplete?.(0)}>I checked it myself</button>
      </section>
    );
  }

  return (
    <section className="writingTool toolPanel">
      <canvas
        ref={canvasRef}
        className="writingCanvas"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        style={{ touchAction: 'none' }}
      />
      <div className="buttonRow">
        <button className="secondaryButton" type="button" onClick={clear}>Clear</button>
        <button className="secondaryButton" type="button" onClick={() => setShowGuide((v) => !v)}>
          {showGuide ? 'Hide guide' : 'Show guide'}
        </button>
        <button className="secondaryButton" type="button" onClick={() => setPaperMode(true)}>Use paper</button>
      </div>
      <button type="button" onClick={() => onComplete?.(strokesRef.current.length)}>Done</button>
    </section>
  );
}
