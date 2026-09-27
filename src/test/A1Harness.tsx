import { useState } from 'react';
import { content, taskMap, itemMap } from '../languages/mandarin/content';
import { Exercise } from '../languages/mandarin/components/Exercise';
import { interpretAnswer, answerFeedback, type Interpretation } from '../languages/mandarin/answer';

const tasks = content.tasks.filter(task => task.kind !== 'closure');
export function A1Harness() {
  const [taskId, setTaskId] = useState('recall-wojiao');
  const [run, setRun] = useState(0);
  const [name, setName] = useState('Wolfram');
  const [script, setScript] = useState<'hant' | 'hans'>('hans');
  const [events, setEvents] = useState<unknown[]>([]);
  const [itemId, setItemId] = useState('wojiao');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Interpretation | null>(null);
  const task = taskMap.get(taskId)!;
  const record = (event: unknown) => setEvents(previous => [...previous, event]);
  const reset = () => { setRun(value => value + 1); setEvents([]); };
  return <main style={{ maxWidth: 760, margin: 'auto', padding: 20 }}>
    <h1>A1 Test Harness</h1>
    <p>Nur Development/Test. Alle Eingaben und Ergebnisse bleiben im Arbeitsspeicher dieser Seite. Kein Lernstand und kein Research Log werden gespeichert.</p>
    <label className="fieldLabel">Lernschritt<select aria-label="Lernschritt" style={{ width: '100%', minWidth: 0, padding: 8 }} value={taskId} onChange={event => { setTaskId(event.target.value); reset(); }}>
      {tasks.map(task => <option key={task.id} value={task.id}>{task.id} — {task.itemId ? itemMap.get(task.itemId)?.hans : ''} — {task.prompt.de}</option>)}
    </select></label>
    <label className="fieldLabel">Testname<input value={name} onChange={event => { setName(event.target.value); reset(); }} /></label>
    <label className="fieldLabel">Schrift<select style={{ width: '100%', minWidth: 0, padding: 8 }} value={script} onChange={event => { setScript(event.target.value as 'hant' | 'hans'); reset(); }}><option value="hans">Vereinfacht</option><option value="hant">Traditionell</option></select></label>
    <button type="button" onClick={reset}>Reset / erneut testen</button>
    <section aria-label="Ausgewählter Lernschritt" style={{ border: '1px solid', padding: 16, marginTop: 20 }}>
      <h2>{task.prompt.de}</h2>
      <Exercise key={`${taskId}-${run}`} task={task} script={script} name={name} setName={setName} disabled={false}
        onEvent={(type, detail) => record({ type, detail })}
        onAttempt={async evidence => { record({ type: 'attempt', ...evidence }); }}
        onTone={async (tone, correct) => { record({ type: 'tone', tone, correct }); }}
        onNext={() => record({ type: 'finished', message: 'Schritt beendet. Reset startet ihn erneut.' })} />
    </section>
    <details><summary>Lokale Test-Ereignisse ({events.length})</summary><pre data-testid="test-events" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify(events, null, 2)}</pre></details>
    <section aria-label="Direkter Answer Interpreter" style={{ marginTop: 32 }}>
      <h2>Answer Interpreter direkt testen</h2>
      <p>Prüft Mandarin-Texteingaben, auch für Wörter ohne eigene Text-Recall-Aufgabe. Keine Bewertung gesprochener Aussprache.</p>
      <label className="fieldLabel">Erwartetes Item<select style={{ width: '100%', minWidth: 0, padding: 8 }} value={itemId} onChange={event => { setItemId(event.target.value); setInput(''); setResult(null); }}>
        {content.items.map(item => <option key={item.id} value={item.id}>{item.hans} — {item.pinyin}{item.slot ? ' …' : ''}</option>)}
      </select></label>
      <form onSubmit={event => { event.preventDefault(); setResult(interpretAnswer(input, itemMap.get(itemId)!, name)); }}>
        <label className="fieldLabel">Testeingabe<input value={input} onChange={event => { setInput(event.target.value); setResult(null); }} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} /></label>
        <button type="submit">Interpreter prüfen</button>{' '}<button type="button" onClick={() => { setInput(''); setResult(null); }}>Interpreter zurücksetzen</button>
      </form>
      {result && <><p role="status">{answerFeedback(result)}</p><pre data-testid="interpreter-result" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify(result, null, 2)}</pre></>}
    </section>
  </main>;
}
