import { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import hao from '../data/hao.json';
import { WritingPad } from '../../../core/writing/WritingPad';
import { ui } from '../../../core/i18n/de';
export type WritingResult = { result: 'success' | 'failure' | 'unsure'; assisted: boolean; mode: string };
export function WritingExercise({ recall, onEvent, onComplete, disabled }: {
  recall: boolean; onEvent: (type: string) => void; onComplete: (result: WritingResult) => void; disabled: boolean;
}) {
  const [mode, setMode] = useState<'guided' | 'blank' | 'paper'>(recall ? 'blank' : 'guided');
  const [assisted, setAssisted] = useState(!recall); const [reference, setReference] = useState(false);
  const [drawn, setDrawn] = useState(false); const [compared, setCompared] = useState(false);
  const target = useRef<HTMLDivElement>(null); const writer = useRef<HanziWriter | null>(null);
  const event = useRef(onEvent); event.current = onEvent;
  useEffect(() => {
    if (mode !== 'guided' || !target.current) return;
    const node = target.current;
    const instance = HanziWriter.create(node, '好', { width: 280, height: 280, padding: 15,
      showCharacter: false, showOutline: true, strokeColor: '#263d33', highlightColor: '#658371',
      charDataLoader: () => hao,
    }); writer.current = instance;
    return () => { instance.cancelQuiz(); node.replaceChildren(); writer.current = null; };
  }, [mode]);
  function hint() { setReference(true); setAssisted(true); onEvent('writing_hint'); }
  return <section className="stepStack">
    {mode === 'guided' && <><div className="hanziWriter" ref={target} />
      <div className="buttonRow"><button type="button" className="secondaryButton" onClick={() => { setAssisted(true); onEvent('stroke_animation'); void writer.current?.animateCharacter(); }}>{ui.animate}</button>
        <button type="button" className="secondaryButton" onClick={() => { setAssisted(true); onEvent('guided_start'); void writer.current?.quiz({ onMistake: () => event.current('stroke_hint'), onComplete: () => { setDrawn(true); event.current('guided_complete'); } }); }}>{ui.writeGuide}</button>
        <button type="button" className="textButton" onClick={() => setMode('blank')}>{ui.blank}</button></div></>}
    {mode === 'blank' && <WritingPad onDraw={() => setDrawn(true)} />}
    {mode === 'paper' && <button type="button" className="secondaryButton" onClick={() => setDrawn(true)}>{ui.written}</button>}
    {reference && <p className="hanziLarge" lang="zh">好</p>}
    {!compared && <div className="buttonRow">
      <button type="button" className="textButton" onClick={hint}>{ui.writingHint}</button>
      <button type="button" className="textButton" onClick={() => { setMode(mode === 'paper' ? 'blank' : 'paper'); setDrawn(false); onEvent('writing_mode'); }}>{mode === 'paper' ? ui.screen : ui.paper}</button>
      {!recall && <button type="button" className="textButton" onClick={() => window.print()}>{ui.worksheet}</button>}
    </div>}
    <p className="muted">{ui.writingNote}</p>
    {!compared ? <button type="button" disabled={!drawn} onClick={() => { setCompared(true); onEvent('writing_compare'); }}>{ui.compare}</button>
      : <div className="comparison"><p className="hanziLarge" lang="zh">好</p><div className="buttonRow">
        {(['success', 'unsure', 'failure'] as const).map((result, i) => <button key={result} type="button" disabled={disabled} className="secondaryButton" onClick={() => onComplete({ result, assisted, mode })}>{[ui.secure, ui.unsure, ui.retry][i]}</button>)}
      </div></div>}
  </section>;
}
