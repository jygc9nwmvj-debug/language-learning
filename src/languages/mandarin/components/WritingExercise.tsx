import type { SavedFeedback } from '../../../core/progress/db';
import { ContinueButton } from '../../../core/exercises/Controls';
import { IconButton } from '../../../core/exercises/Controls';
import { optionalWritingEvent } from '../../../core/progress/optionalPractice';
import { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import {writingTargets as targets,delayed} from '../writing-targets';
import { ui } from '../../../core/i18n/de';

// Hanzi Writer needs concrete colors; SVG learner ink can use CSS variables directly.
function writingColor(token: string, alpha?: number) {
  const color = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  if (alpha === undefined) return color;
  const rgb = color.replace('#', '').match(/.{2}/g)!.map(value => parseInt(value, 16));
  return `rgba(${rgb.join(',')},${alpha})`;
}

type Detail = Record<string, string | number | boolean>;
export type WritingResult = { result: 'success' | 'failure' | 'unsure'; assisted: boolean; mode: string; selfReport: boolean; ink?: string[]; inkSize?: number; stage?: number };
export function WritingExercise({ itemId, recall, onEvent, onComplete, onNext, disabled, restored }: {
  restored?: SavedFeedback; itemId: string; recall: boolean; onEvent: (type: string, detail?: Detail) => void;
  onComplete: (result: WritingResult) => Promise<void>; onNext: () => void | Promise<void>; disabled: boolean;
}) {
  // The existing fixed worksheet shows these characters, including its context line.
  const worksheetHasTarget = ['hao','ni','wo'].includes(itemId);
  const model = targets[itemId as keyof typeof targets];
  const levels = recall ? [delayed] : model.levels;
  const [stage, setStage] = useState(restored?.stage ?? 0), [revision, setRevision] = useState(0);
  const [demo, setDemo] = useState(!restored && !recall), [boosted, setBoosted] = useState(false);
  const [mode, setMode] = useState<'screen' | 'paper'>(restored?.mode === 'paper' ? 'paper' : 'screen');
  const [phase, setPhase] = useState<'demo' | 'preview' | 'writing' | 'success' | 'saved' | 'save_error'>(restored ? 'saved' : recall ? 'writing' : 'demo');
  const [ink, setInk] = useState<string[]>(restored?.ink ?? []), [wrongInk, setWrongInk] = useState('');
  const [reference, setReference] = useState(false), [compared, setCompared] = useState(false);
  const [status, setStatus] = useState(restored?.message ?? ''), [size, setSize] = useState(320);
  const target = useRef<HTMLDivElement>(null), writer = useRef<HanziWriter | null>(null);
  const callbacks = useRef({ onEvent, onComplete }); callbacks.current = { onEvent, onComplete };
  const stats = useRef({ errors: 0, hints: 0, correctStrokes: 0, templateUsed: false, demoUsed: !recall });
  const optionalRepeat = useRef(false);
  const seenDemo = useRef(!recall), resetNotice = useRef('');
  const assisted = useRef(!recall), nextStroke = useRef(0), lastResult = useRef<WritingResult | null>(restored ? { result: restored.result ?? 'unsure', assisted: !!restored.help, mode: restored.mode ?? 'screen', selfReport: !!restored.selfReport } : null);
  const hintAction = useRef<() => void>(() => {}), finishAction = useRef<(result: WritingResult['result']) => void>(() => {});
  const level = levels[stage];
  const drawn = useRef<string[]>(restored?.ink ?? []);
  const detail = (extra: Detail = {}): Detail => ({ itemId, optionalPractice: optionalRepeat.current, scaffold: level.id, category: level.category, stage, mode, ...stats.current, errors: mode === 'paper' ? 'unknown' : stats.current.errors, ...extra });
  async function save(result: WritingResult) {
    lastResult.current = result;
    try { if (!optionalRepeat.current) await callbacks.current.onComplete(result); else callbacks.current.onEvent('optional_writing_result', detail({ result: result.result, assisted: result.assisted })); setPhase('saved'); }
    catch { setPhase('save_error'); setStatus('Noch nicht gespeichert. Bitte erneut versuchen.'); }
  }
  useEffect(() => {
    if (restored && !optionalRepeat.current) { setSize(restored.inkSize ?? target.current!.parentElement!.clientWidth); return; }
    const node = target.current!;
    let active = true, completed = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(() => { if (active) fn(); }, ms)); };
    const width = node.parentElement!.clientWidth;
    setSize(width); drawn.current = []; setInk([]); setWrongInk(''); setReference(false); setCompared(false);
    nextStroke.current = 0;
    stats.current = { errors: 0, hints: 0, correctStrokes: 0, templateUsed: false, demoUsed: seenDemo.current || boosted };
    const outline = writingColor('--writing-ink', boosted ? .38 : level.alpha);
    const instance = HanziWriter.create(node, model.character, {
      width, height: width, padding: 15, showCharacter: false, showOutline: !demo,
      // Quiz accepts strokes internally, but must never redraw them into ideal shapes.
      strokeColor: writingColor('--writing-ink', demo ? 1 : 0), outlineColor: outline,
      drawingColor: writingColor('--writing-ink'), drawingWidth: 7, drawingFadeDuration: 120,
      highlightColor: writingColor('--writing-highlight'), highlightOnComplete: false,
      strokeAnimationSpeed: .7, delayBetweenStrokes: 1000, strokeHighlightSpeed: 1,
      charDataLoader: () => model.data,
    });
    writer.current = instance;
    const emit = (type: string, extra: Detail = {}) => callbacks.current.onEvent(optionalRepeat.current ? optionalWritingEvent(type) : type, detail(extra));
    function hint(automatic = false) {
      if (!active || completed || nextStroke.current >= model.data.strokes.length) return;
      stats.current.hints++; assisted.current = true;
      emit('writing_stroke_hint', { stroke: nextStroke.current, automatic });
      void instance.highlightStroke(nextStroke.current);
    }
    hintAction.current = () => hint();
    function finish(result: WritingResult['result']) {
      if (!active || completed) return;
      completed = true; instance.cancelQuiz(); setPhase('success');
      setStatus(result === 'success' ? 'Geschafft. Die Strichfolge ist vollständig.' : 'Danke für deine Einschätzung. Wir gehen weiter.');
      const selfReport = mode === 'paper';
      emit('writing_stage_result', { result, selfReport, assisted: assisted.current });
      later(() => {
        if (stage + 1 < levels.length) { seenDemo.current = false; setBoosted(false); setStage(stage + 1); }
        else void save({ result, assisted: assisted.current, mode, selfReport, ink: drawn.current, inkSize: width, stage });
      }, 1100);
    }
    finishAction.current = finish;
    function start() {
      if (!active) return;
      setPhase('writing'); setStatus(resetNotice.current || (mode === 'paper' ? 'Schreibe auf deinem Blatt. Vergleiche anschließend selbst.' : 'Du bist dran. Setze den ersten Strich.')); resetNotice.current = '';
      emit('writing_stage_start');
      if (mode === 'paper') return;
      void instance.quiz({ showHintAfterMisses: false, highlightOnComplete: false, acceptBackwardsStrokes: false, markStrokeCorrectAfterMisses: false,
        onCorrectStroke: data => {
          if (!active || completed) return;
          // Public callback returns the actual pointer geometry in display coordinates.
          drawn.current.push(data.drawnPath.pathString); setInk([...drawn.current]); setWrongInk('');
          stats.current.correctStrokes++; nextStroke.current = data.strokeNum + 1;
          emit('writing_stroke_correct', { stroke: data.strokeNum });
          setStatus(`Strich ${data.strokeNum + 1} von ${model.data.strokes.length} angekommen.`);
          if ((level.nextStroke || boosted) && data.strokesRemaining > 0) hint(true);
        },
        onMistake: data => {
          if (!active || completed) return;
          stats.current.errors++; setWrongInk(data.drawnPath.pathString);
          emit('writing_stroke_error', { stroke: data.strokeNum, backwards: data.isBackwards });
          setStatus(data.isBackwards ? 'Versuche diesen Strich in der anderen Richtung.' : 'Dieser Strich passt noch nicht zur Folge oder Form. Versuch ihn noch einmal.');
          later(() => setWrongInk(''), 650);
          if (data.mistakesOnStroke % 2 === 0) hint(true);
        },
        onComplete: () => finish('success'),
      }).then(() => { if (active && (level.nextStroke || boosted)) hint(true); });
    }
    if (demo) {
      setPhase('demo'); setStatus('Schau auf die Strichfolge …'); assisted.current = true;
      emit('stroke_animation');
      void instance.animateCharacter().then(async pending => {
        const result = await pending;
        if (active && !result?.canceled) later(() => setDemo(false), 650);
      });
    } else if (level.preview && !boosted) {
      setPhase('preview'); setStatus('Merke dir die Form. Gleich verschwindet die Vorlage.');
      emit('writing_preview', { previewMs: 2500 });
      void instance.updateColor('outlineColor', writingColor('--writing-outline'), { duration: 0 });
      later(() => {
        void instance.updateColor('outlineColor', outline, { duration: 0 });
        emit('writing_preview_hidden'); start();
      }, 2500);
    } else start();
    // Hanzi Writer handles mouse/touch itself. Cancelled or multi-touch gestures must
    // not finish a half-stroke; restarting the attempt is explicit, never a success.
    const interrupt = (event: Event) => {
      if (!active || completed || demo) return;
      event.stopImmediatePropagation();
      emit('writing_input_interrupted'); resetNotice.current = 'Die Berührung wurde unterbrochen. Beginne diesen Versuch bitte noch einmal.'; setRevision(value => value + 1);
    };
    const multiTouch = (event: TouchEvent) => { if (event.touches.length > 1) interrupt(event); };
    node.addEventListener('touchcancel', interrupt, true); node.addEventListener('touchstart', multiTouch, true);
    // Ignore transient zero/restore layouts (screenshots, hidden tabs); only a stable
    // width change invalidates the pointer coordinate system of this attempt.
    let resizeTimer: number | undefined;
    const resize = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const newWidth = node.parentElement?.clientWidth ?? 0;
        if (active && newWidth > 0 && Math.abs(newWidth - width) > 1) {
          emit('writing_resize', { fromWidth: width, toWidth: newWidth });
          resetNotice.current = 'Die Feldgröße hat sich geändert. Beginne diesen Versuch bitte noch einmal.';
          setRevision(value => value + 1);
        }
      }, 200);
    });
    resize.observe(node.parentElement!);
    return () => {
      active = false; timers.forEach(clearTimeout); resize.disconnect(); window.clearTimeout(resizeTimer); instance.cancelQuiz();
      node.removeEventListener('touchcancel', interrupt, true); node.removeEventListener('touchstart', multiTouch, true);
      node.replaceChildren(); if (writer.current === instance) writer.current = null;
      if (!completed && !demo) emit('writing_stage_interrupted');
    };
  }, [stage, mode, revision, demo, boosted]);
  function toggleReference() {
    const shown = !reference; setReference(shown);
    if (shown) { stats.current.templateUsed = true; stats.current.hints++; assisted.current = true; callbacks.current.onEvent('writing_hint', detail()); }
    void writer.current?.updateColor('outlineColor', shown ? writingColor('--writing-outline') : writingColor('--writing-ink', boosted ? .38 : level.alpha), { duration: 150 });
    setStatus(shown ? 'Die Vorlage liegt jetzt unter deinen Strichen.' : 'Die zusätzliche Vorlage ist ausgeblendet.');
  }
  const writing = phase === 'writing';
  const numbers = !recall && (demo || level.nextStroke) && !compared;
  const scale = (size - 30) / 1024;
  return <section className="stepStack writingExercise" data-character={model.character} data-scaffold={level.id} data-phase={phase} data-task-complete={phase === 'saved' || optionalRepeat.current}>
    <div className="writingIntro"><h3>{demo ? 'Erst zuschauen' : level.title}</h3><p>{demo ? model.intro : phase === 'preview' ? 'Schau dir die Form kurz an. Danach verschwindet die Vorlage.' : level.instruction}</p></div>
    <div className="writingSurface writingGrid" aria-label={demo ? 'Strichfolge' : 'Schreibfeld'}>
      <div className="hanziWriter" ref={target} style={{ pointerEvents: writing && mode === 'screen' && !disabled ? 'auto' : 'none' }} />
      <svg className="writingInk" viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <g fill="none" stroke="var(--writing-ink)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" data-testid="learner-ink">{ink.map((d, i) => <path key={i} d={d} />)}</g>
        {wrongInk && <path d={wrongInk} fill="none" stroke="var(--writing-error)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />}
        {numbers && <g className="strokeNumbers" data-testid="stroke-numbers">{model.data.medians.map((points, i) => <text key={i} x={Math.max(10, 15 + points[0][0] * scale - 12)} y={Math.max(14, 15 + (900 - points[0][1]) * scale - 10)}>{i + 1}</text>)}</g>}
      </svg>
    </div>
    <p className={`writingStatus ${phase === 'success' ? 'writingSuccess' : ''}`} role="status" aria-live="polite">{status}</p>
    {mode === 'paper' && writing && <div className="buttonRow">{!compared
      ? <button type="button" onClick={() => { setCompared(true); void writer.current?.updateColor('outlineColor', writingColor('--writing-outline')); callbacks.current.onEvent('writing_compare', detail()); }}>Ich habe geschrieben – vergleichen</button>
      : (['success', 'unsure', 'failure'] as const).map((result, i) => <button key={result} type="button" disabled={disabled} onClick={() => finishAction.current(result)}>{[ui.secure, ui.unsure, ui.retry][i]}</button>)}
    </div>}
    <div className="writingControls">
      <IconButton icon="eye" label={reference ? 'Vorlage ausblenden' : 'Vorlage zeigen'} disabled={!writing || disabled || compared} aria-pressed={reference} onClick={toggleReference}><span>Vorlage</span></IconButton>
      <IconButton icon="stroke" label="Nächster Strich" disabled={!writing || disabled || compared || mode === 'paper'} onClick={() => hintAction.current()}><span>Strich</span></IconButton>
      <IconButton icon="play" label="Noch einmal ansehen" disabled={!writing || disabled} onClick={() => { assisted.current = true; seenDemo.current = true; setBoosted(true); setDemo(true); }}><span>Ablauf</span></IconButton>
      <IconButton icon="replay" label="Neu ansetzen" disabled={!writing || disabled} onClick={() => { callbacks.current.onEvent('writing_clear', detail()); setRevision(value => value + 1); }}><span>Neu</span></IconButton>
    </div>
    <div className="buttonRow writingSecondary">
      <button type="button" className="textButton" disabled={!writing || disabled} onClick={() => { callbacks.current.onEvent('writing_mode', detail()); setMode(mode === 'paper' ? 'screen' : 'paper'); }}>{mode === 'paper' ? ui.screen : ui.paper}</button>
      <IconButton icon="print" label={ui.worksheet} onClick={() => { if (recall && writing && !compared && worksheetHasTarget) { assisted.current = true; callbacks.current.onEvent('writing_hint', detail({ source: 'worksheet' })); } window.print(); }}/>
    </div>
    {phase === 'saved' && <div className="buttonRow"><ContinueButton type="button" disabled={disabled} onClick={onNext}>Weiter</ContinueButton>{lastResult.current?.result === 'success' && <button type="button" className="secondaryButton" disabled={disabled} onClick={() => { optionalRepeat.current = true; callbacks.current.onEvent('optional_writing_start', detail()); seenDemo.current = false; assisted.current = false; setBoosted(false); setDemo(false); setRevision(value => value + 1); }}>Noch einmal</button>}</div>}
    {optionalRepeat.current && phase !== 'saved' && <ContinueButton type="button" disabled={disabled} onClick={onNext}>Weiter</ContinueButton>}
    {optionalRepeat.current && <p className="muted">Freiwillige Wiederholung · ohne neue Lernbewertung.</p>}
    {phase === 'save_error'  && <button type="button" disabled={disabled} onClick={() => { if (lastResult.current) void save(lastResult.current); }}>Speichern erneut versuchen</button>}
    {mode === 'paper' && <p className="muted">Auf Papier schätzt du Form und Strichfolge selbst ein.{(!recall || !worksheetHasTarget) && <> Das Druckblatt bleibt die Übung für 好; 你 und 我 kannst du in freie Felder schreiben.</>}</p>}
  </section>;
}
