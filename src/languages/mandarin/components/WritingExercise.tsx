import { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import hao from '../data/hao.json';
import ni from '../data/ni.json';
import wo from '../data/wo.json';
import { ui } from '../../../core/i18n/de';

type Detail = Record<string, string | number | boolean>;
export type WritingResult = { result: 'success' | 'failure' | 'unsure'; assisted: boolean; mode: string; selfReport: boolean };
type Level = { id: string; category: string; title: string; instruction: string; alpha: number; nextStroke?: boolean; preview?: boolean };
const guided: Level = { id: 'full_guided', category: 'guided_trace', title: 'Mit voller Vorlage', instruction: 'Ziehe die Striche nach. Die kleine Zahl zeigt den Anfang; der nächste Strich wird vorgemacht.', alpha: .38, nextStroke: true };
const reduced: Level = { id: 'full_reduced', category: 'reduced_scaffold', title: 'Mit weniger Hilfe', instruction: 'Die Vorlage bleibt. Finde die Strichfolge jetzt selbst.', alpha: .28 };
const faint: Level = { id: 'faint_outline', category: 'reduced_scaffold', title: 'Mit blasser Vorlage', instruction: 'Schreibe noch einmal. Die blasse Form hilft dir beim Aufbau.', alpha: .12 };
const memory: Level = { id: 'brief_recall', category: 'free_recall', title: 'Kurz merken, dann schreiben', instruction: 'Schreibe jetzt aus dem Gedächtnis. Hilfe ist jederzeit möglich.', alpha: 0, preview: true };
const delayed: Level = { id: 'delayed_recall', category: 'free_recall', title: 'Aus dem Gedächtnis', instruction: 'Schreibe ohne Vorlage. Wenn du sie brauchst, kannst du sie einblenden.', alpha: 0 };
// Authored starting hypothesis, not an adaptive engine or an optimal repetition count.
const targets = {
  hao: { character: '好', data: hao, levels: [guided, reduced, faint, memory], intro: 'Schau auf Reihenfolge und Richtung. Danach schreibst du selbst – erst mit viel, dann mit weniger Hilfe.' },
  ni: { character: '你', data: ni, levels: [{ ...guided, instruction: 'Die Schreibweise kennst du jetzt: erst nachziehen, dann mit weniger Hilfe schreiben.' }, faint, memory], intro: 'Dasselbe Vorgehen für „du“. Schau zuerst auf die sieben Striche.' },
  wo: { character: '我', data: wo, levels: [guided, { ...faint, alpha: .18, instruction: 'Achte auf die Kreuzungen und den langen gebogenen Strich. Die blasse Vorlage bleibt.' }, memory], intro: 'Jetzt „ich“. Achte besonders auf Richtungen, Kreuzungen und Haken.' },
};
export function WritingExercise({ itemId, recall, onEvent, onComplete, disabled }: {
  itemId: string; recall: boolean; onEvent: (type: string, detail?: Detail) => void;
  onComplete: (result: WritingResult) => Promise<void>; disabled: boolean;
}) {
  const model = targets[itemId as keyof typeof targets];
  const levels = recall ? [delayed] : model.levels;
  const [stage, setStage] = useState(0), [revision, setRevision] = useState(0);
  const [demo, setDemo] = useState(!recall), [boosted, setBoosted] = useState(false);
  const [mode, setMode] = useState<'screen' | 'paper'>('screen');
  const [phase, setPhase] = useState<'demo' | 'preview' | 'writing' | 'success' | 'saved' | 'save_error'>(recall ? 'writing' : 'demo');
  const [ink, setInk] = useState<string[]>([]), [wrongInk, setWrongInk] = useState('');
  const [reference, setReference] = useState(false), [compared, setCompared] = useState(false);
  const [status, setStatus] = useState(''), [size, setSize] = useState(320);
  const target = useRef<HTMLDivElement>(null), writer = useRef<HanziWriter | null>(null);
  const callbacks = useRef({ onEvent, onComplete }); callbacks.current = { onEvent, onComplete };
  const stats = useRef({ errors: 0, hints: 0, correctStrokes: 0, templateUsed: false, demoUsed: !recall });
  const seenDemo = useRef(!recall), resetNotice = useRef('');
  const assisted = useRef(!recall), nextStroke = useRef(0), lastResult = useRef<WritingResult | null>(null);
  const hintAction = useRef<() => void>(() => {}), finishAction = useRef<(result: WritingResult['result']) => void>(() => {});
  const level = levels[stage];
  const detail = (extra: Detail = {}): Detail => ({ itemId, scaffold: level.id, category: level.category, stage, mode, ...stats.current, errors: mode === 'paper' ? 'unknown' : stats.current.errors, ...extra });
  async function save(result: WritingResult) {
    lastResult.current = result;
    try { await callbacks.current.onComplete(result); setPhase('saved'); }
    catch { setPhase('save_error'); setStatus('Noch nicht gespeichert. Bitte erneut versuchen.'); }
  }
  useEffect(() => {
    const node = target.current!;
    let active = true, completed = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(() => { if (active) fn(); }, ms)); };
    const width = node.parentElement!.clientWidth;
    setSize(width); setInk([]); setWrongInk(''); setReference(false); setCompared(false);
    nextStroke.current = 0;
    stats.current = { errors: 0, hints: 0, correctStrokes: 0, templateUsed: false, demoUsed: seenDemo.current || boosted };
    const outline = `rgba(38,61,51,${boosted ? .38 : level.alpha})`;
    const instance = HanziWriter.create(node, model.character, {
      width, height: width, padding: 15, showCharacter: false, showOutline: !demo,
      // Quiz accepts strokes internally, but must never redraw them into ideal shapes.
      strokeColor: demo ? '#263d33' : 'rgba(38,61,51,0)', outlineColor: outline,
      drawingColor: '#263d33', drawingWidth: 7, drawingFadeDuration: 120,
      highlightColor: '#718773', highlightOnComplete: false,
      strokeAnimationSpeed: .7, delayBetweenStrokes: 1000, strokeHighlightSpeed: 1,
      charDataLoader: () => model.data,
    });
    writer.current = instance;
    const emit = (type: string, extra: Detail = {}) => callbacks.current.onEvent(type, detail(extra));
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
        else void save({ result, assisted: assisted.current, mode, selfReport });
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
          setInk(paths => [...paths, data.drawnPath.pathString]); setWrongInk('');
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
      void instance.updateColor('outlineColor', '#53695b', { duration: 0 });
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
    void writer.current?.updateColor('outlineColor', shown ? '#708370' : `rgba(38,61,51,${boosted ? .38 : level.alpha})`, { duration: 150 });
    setStatus(shown ? 'Die Vorlage liegt jetzt unter deinen Strichen.' : 'Die zusätzliche Vorlage ist ausgeblendet.');
  }
  const writing = phase === 'writing';
  const numbers = !recall && (demo || level.nextStroke) && !compared;
  const scale = (size - 30) / 1024;
  return <section className="stepStack writingExercise" data-character={model.character} data-scaffold={level.id} data-phase={phase}>
    <div className="writingIntro"><h3>{demo ? 'Erst zuschauen' : level.title}</h3><p>{demo ? model.intro : phase === 'preview' ? 'Schau dir die Form kurz an. Danach verschwindet die Vorlage.' : level.instruction}</p></div>
    <div className="writingSurface writingGrid" aria-label={demo ? 'Strichfolge' : 'Schreibfeld'}>
      <div className="hanziWriter" ref={target} style={{ pointerEvents: writing && mode === 'screen' && !disabled ? 'auto' : 'none' }} />
      <svg className="writingInk" viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <g fill="none" stroke="#263d33" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" data-testid="learner-ink">{ink.map((d, i) => <path key={i} d={d} />)}</g>
        {wrongInk && <path d={wrongInk} fill="none" stroke="#9c654f" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />}
        {numbers && <g className="strokeNumbers" data-testid="stroke-numbers">{model.data.medians.map((points, i) => <text key={i} x={Math.max(10, 15 + points[0][0] * scale - 12)} y={Math.max(14, 15 + (900 - points[0][1]) * scale - 10)}>{i + 1}</text>)}</g>}
      </svg>
    </div>
    <p className={`writingStatus ${phase === 'success' ? 'writingSuccess' : ''}`} role="status" aria-live="polite">{status}</p>
    {mode === 'paper' && writing && <div className="buttonRow">{!compared
      ? <button type="button" onClick={() => { setCompared(true); void writer.current?.updateColor('outlineColor', '#53695b'); callbacks.current.onEvent('writing_compare', detail()); }}>Ich habe geschrieben – vergleichen</button>
      : (['success', 'unsure', 'failure'] as const).map((result, i) => <button key={result} type="button" disabled={disabled} onClick={() => finishAction.current(result)}>{[ui.secure, ui.unsure, ui.retry][i]}</button>)}
    </div>}
    <div className="writingControls">
      <button type="button" className="textButton" disabled={!writing || disabled || compared} aria-pressed={reference} onClick={toggleReference}>{reference ? 'Vorlage ausblenden' : 'Vorlage zeigen'}</button>
      <button type="button" className="textButton" disabled={!writing || disabled || compared || mode === 'paper'} onClick={() => hintAction.current()}>Nächster Strich</button>
      <button type="button" className="textButton" disabled={!writing || disabled} onClick={() => { assisted.current = true; seenDemo.current = true; setBoosted(true); setDemo(true); }}>Noch einmal ansehen</button>
      <button type="button" className="textButton" disabled={!writing || disabled} onClick={() => { callbacks.current.onEvent('writing_clear', detail()); setRevision(value => value + 1); }}>Neu ansetzen</button>
    </div>
    <div className="buttonRow writingSecondary">
      <button type="button" className="textButton" disabled={!writing || disabled} onClick={() => { callbacks.current.onEvent('writing_mode', detail()); setMode(mode === 'paper' ? 'screen' : 'paper'); }}>{mode === 'paper' ? ui.screen : ui.paper}</button>
      <button type="button" className="textButton" onClick={() => window.print()}>{ui.worksheet}</button>
    </div>
    {phase === 'save_error' && <button type="button" disabled={disabled} onClick={() => { if (lastResult.current) void save(lastResult.current); }}>Speichern erneut versuchen</button>}
    {mode === 'paper' && <p className="muted">Auf Papier schätzt du Form und Strichfolge selbst ein. Das Druckblatt bleibt die Übung für 好; 你 und 我 kannst du in freie Felder schreiben.</p>}
  </section>;
}
