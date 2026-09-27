import { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import hao from '../data/hao.json';
import { WritingPad } from '../../../core/writing/WritingPad';
import { ui } from '../../../core/i18n/de';

type Detail = Record<string, string | number | boolean>;
export type WritingResult = { result: 'success' | 'failure' | 'unsure'; assisted: boolean; mode: string };
// V0.1 hypothesis: three scaffolded productions, then one brief memory attempt.
// Keep the sequence local; future characters can start later once the method is familiar.
const levels = ['observe', 'full_guided', 'full_reduced', 'faint_outline', 'brief_recall', 'delayed_recall'] as const;
const titles = ['1 · Erst zuschauen', '2 · Mit voller Vorlage', '3 · Mit weniger Strichhilfe', '4 · Mit blasser Vorlage', '5 · Kurz merken, dann schreiben', 'Aus dem Gedächtnis'];
const instructions = [
  'Schau einmal zu, wie das Zeichen entsteht. Danach schreibst du selbst.',
  'Ziehe die Striche nach. Der nächste Strich wird dir jeweils vorgemacht.',
  'Die Vorlage bleibt sichtbar. Versuche, die Strichfolge selbst zu finden.',
  'Jetzt hilft nur noch eine blasse Vorlage. Strichhilfe gibt es auf Wunsch.',
  'Schau dir das Zeichen drei Sekunden an. Schreibe danach auf dem leeren Feld.',
  'Schreibe das Zeichen für „gut“ ohne Vorlage. Vergleiche erst danach.',
];
export function WritingExercise({ recall, onEvent, onComplete, disabled }: {
  recall: boolean; onEvent: (type: string, detail?: Detail) => void; onComplete: (result: WritingResult) => void; disabled: boolean;
}) {
  const [stage, setStage] = useState(recall ? 5 : 0);
  const [mode, setMode] = useState<'screen' | 'paper'>('screen');
  const [assisted, setAssisted] = useState(!recall), [reference, setReference] = useState(false);
  const [started, setStarted] = useState(false), [drawn, setDrawn] = useState(false), [compared, setCompared] = useState(false);
  const [observed, setObserved] = useState(false), [animating, setAnimating] = useState(false);
  const [peek, setPeek] = useState<'ready' | 'showing' | 'hidden'>('ready');
  const target = useRef<HTMLDivElement>(null), writer = useRef<HanziWriter | null>(null);
  const event = useRef(onEvent); event.current = onEvent;
  const stats = useRef({ errors: 0, hints: 0, correctStrokes: 0 });
  const nextStroke = useRef(0), finished = useRef(false);
  const guided = stage > 0 && stage < 4;
  const outline = stage === 3 ? 'rgba(38,61,51,0.13)' : 'rgba(38,61,51,0.55)';
  function detail(extra: Detail = {}): Detail {
    return { scaffold: levels[stage], stage, mode, ...stats.current, errors: guided && mode === 'screen' ? stats.current.errors : 'unknown', ...extra };
  }
  useEffect(() => {
    stats.current = { errors: 0, hints: 0, correctStrokes: 0 }; nextStroke.current = 0; finished.current = false;
    event.current('writing_stage_start', { scaffold: levels[stage], stage, mode });
    return () => {
      if (!finished.current) event.current('writing_stage_interrupted', { scaffold: levels[stage], stage, mode, ...stats.current });
    };
  }, [stage, mode]);
  useEffect(() => {
    if (stage > 3 || !target.current) return;
    const node = target.current;
    const instance = HanziWriter.create(node, '好', { width: 280, height: 280, padding: 15,
      showCharacter: false, showOutline: stage !== 0, outlineColor: outline,
      strokeColor: '#263d33', highlightColor: '#658371', highlightOnComplete: false,
      charDataLoader: () => hao,
    }); writer.current = instance;
    return () => { instance.cancelQuiz(); node.replaceChildren(); if (writer.current === instance) writer.current = null; };
  }, [stage, mode, outline]);
  useEffect(() => {
    if (peek !== 'showing') return;
    const timer = window.setTimeout(() => { setPeek('hidden'); event.current('writing_preview_hidden', { scaffold: levels[stage], stage, mode, previewMs: 3000 }); }, 3000);
    return () => window.clearTimeout(timer);
  }, [peek, stage, mode]);
  function logResult(result: string, selfReport: boolean) {
    if (finished.current) return;
    finished.current = true;
    onEvent('writing_stage_result', detail({ result, selfReport, assisted: stage < 5 || assisted }));
  }
  function hintStroke(stroke = nextStroke.current, automatic = false) {
    if (stroke >= 6) return;
    stats.current.hints++; setAssisted(true);
    onEvent('writing_stroke_hint', detail({ stroke, automatic }));
    void writer.current?.highlightStroke(stroke);
  }
  function startQuiz() {
    const instance = writer.current; if (!instance || started) return;
    setStarted(true); setReference(false); onEvent('guided_start', detail());
    const hintAfter = stage === 1 ? 1 : stage === 2 ? 3 : false;
    void instance.quiz({ showHintAfterMisses: hintAfter, highlightOnComplete: false,
      onCorrectStroke: data => {
        stats.current.correctStrokes++; nextStroke.current = data.strokeNum + 1;
        event.current('writing_stroke_correct', detail({ stroke: data.strokeNum }));
        if (stage === 1 && data.strokesRemaining > 0) hintStroke(data.strokeNum + 1, true);
      },
      onMistake: data => {
        stats.current.errors++; event.current('writing_stroke_error', detail({ stroke: data.strokeNum }));
        if (hintAfter !== false && data.mistakesOnStroke >= hintAfter) {
          stats.current.hints++; event.current('writing_stroke_hint', detail({ stroke: data.strokeNum, automatic: true }));
        }
      },
      onComplete: () => { setDrawn(true); logResult('success', false); },
    }).then(() => { if (writer.current === instance && stage === 1) hintStroke(0, true); });
  }
  function hint() {
    const shown = !reference; setReference(shown);
    if (shown) { stats.current.hints++; setAssisted(true); onEvent('writing_hint', detail()); }
    // Change only the outline; showing/hiding the main character would disrupt the quiz.
    if (guided) void writer.current?.updateColor('outlineColor', shown ? '#263d33' : outline);
  }
  function advance() {
    setStage(s => s + 1); setStarted(false); setDrawn(false); setCompared(false); setReference(false); setPeek('ready');
  }
  function rate(result: WritingResult['result']) {
    logResult(result, true);
    if (guided) advance();
    else onComplete({ result, assisted, mode: mode === 'paper' ? 'paper' : 'blank' });
  }
  const canWrite = guided || stage === 5 || (stage === 4 && peek === 'hidden');
  return <section className="stepStack" data-scaffold={levels[stage]}>
    <h3>{titles[stage]}</h3><p>{stage === 4 && peek === 'hidden' ? 'Schreibe jetzt das Zeichen für „gut“ aus dem Gedächtnis.' : instructions[stage]}</p>
    {stage < 4 && <div className="hanziWriter writingGrid" ref={target} aria-label="Schreibvorlage" />}
    {stage === 0 && <>
      <button type="button" disabled={animating || observed} onClick={() => {
        const instance = writer.current; if (!instance) return;
        setAnimating(true); onEvent('stroke_animation', detail());
        void instance.animateCharacter().then(async pending => {
          const result = await pending;
          if (writer.current !== instance || result?.canceled) return;
          setAnimating(false); setObserved(true); logResult('observed', false);
        });
      }}>{animating ? 'Schau auf die Strichfolge …' : observed ? 'Strichfolge angesehen' : ui.animate}</button>
      <button type="button" disabled={!observed} onClick={advance}>Jetzt selbst schreiben</button>
    </>}
    {stage === 4 && peek !== 'hidden' && <>
      {peek === 'showing' ? <div className="reference" role="status"><p className="hanziLarge" lang="zh">好</p><p>Gleich verschwindet die Vorlage.</p></div>
        : <button type="button" onClick={() => { setPeek('showing'); onEvent('writing_preview', detail({ previewMs: 3000 })); }}>Zeichen kurz ansehen</button>}
    </>}
    {canWrite && <>
      {stage >= 4 && reference && <div className="reference" role="status"><span>Vorlage</span><p className="hanziLarge" lang="zh">好</p></div>}
      {guided && mode === 'screen' && !drawn && <div className="buttonRow">
        {!started ? <button type="button" onClick={startQuiz}>{ui.writeGuide}</button>
          : <button type="button" className="textButton" onClick={() => hintStroke()}>Nächsten Strich zeigen</button>}
      </div>}
      {stage >= 4 && mode === 'screen' && <WritingPad disabled={compared} onDraw={() => setDrawn(true)} onClear={() => { setDrawn(false); onEvent('writing_clear', detail()); }} />}
      {mode === 'paper' && !drawn && <button type="button" className="secondaryButton" onClick={() => setDrawn(true)}>{ui.written}</button>}
      {!compared && !drawn && <div className="buttonRow">
        <button type="button" className="textButton" aria-pressed={reference} onClick={hint}>{reference ? 'Vorlage ausblenden' : ui.writingHint}</button>
        <button type="button" className="textButton" onClick={() => { writer.current?.cancelQuiz(); setMode(mode === 'paper' ? 'screen' : 'paper'); setStarted(false); setDrawn(false); setReference(false); onEvent('writing_mode', detail()); }}>{mode === 'paper' ? ui.screen : ui.paper}</button>
        {!recall && <button type="button" className="textButton" onClick={() => window.print()}>{ui.worksheet}</button>}
      </div>}
      {guided && mode === 'screen' ? drawn && <><p role="status">Die sechs Striche sind geschafft.</p><button type="button" onClick={advance}>Weiter mit weniger Hilfe</button></>
        : <><p className="muted">{ui.writingNote}</p>
          {!compared ? <button type="button" disabled={!drawn} onClick={() => { setCompared(true); setReference(false); onEvent('writing_compare', detail()); }}>{ui.compare}</button>
            : <div className="comparison"><p className="hanziLarge" lang="zh">好</p><div className="buttonRow">
              {(['success', 'unsure', 'failure'] as const).map((result, i) => <button key={result} type="button" disabled={disabled} className="secondaryButton" onClick={() => rate(result)}>{[ui.secure, ui.unsure, ui.retry][i]}</button>)}
            </div></div>}
        </>}
    </>}
  </section>;
}
