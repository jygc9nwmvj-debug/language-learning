import { Recorder } from '../core/audio/Recorder';
import { AudioButton } from '../core/exercises/AudioButton';
import { useState } from 'react';
import { content, taskMap, itemMap } from '../languages/mandarin/content';
import { Exercise } from '../languages/mandarin/components/Exercise';
import { evaluateAnswer, answerFeedback, type Interpretation } from '../languages/mandarin/answer';

const tasks = content.tasks.filter(task => task.kind !== 'closure');
export function A1Harness() {
  const [audioRun, setAudioRun] = useState(0);
  const [audioItem, setAudioItem] = useState('nihao');
  const [audioEvents, setAudioEvents] = useState<unknown[]>([]);
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
    <details open={window.location.hash === '#audio'}>
      <summary>A2 – Audio direkt testen</summary>
      <p>Zehn Aufnahmen ohne Reload: wǒ · nǐ · hǎo · xièxie · wǒ jiào Wolfram · nǐ hǎo · nǐ jiào shénme míngzi · kurzer Satz · längerer Satz · nochmals wǒ. Erst bei „Jetzt sprechen“ beginnen. Jede Aufnahme vollständig anhören. Reset verwirft nur diesen Test.</p>
      <Recorder key={audioRun} onEvent={(type, detail) => setAudioEvents(previous => [...previous, {type, detail}])} />
      <button type="button" onClick={() => { setAudioRun(n => n + 1); setAudioEvents([]); }}>Audio-Test zurücksetzen</button>
      <p>Hörtest-Kandidaten: <a href="/licenses/mandarin-speech.html" target="_blank" rel="noreferrer">Sprachquelle und Lizenz</a>. Natürlicher und sorgfältiger Sprechstil müssen noch menschlich abgenommen werden.</p><p>Vier isolierte, gezielt bearbeitete Lehrkonturen:</p>
      <div className="buttonRow">{content.toneExamples.map((id,i) => <AudioButton key={id} src={content.words.find(w => w.id === id)!.audio!} label={`Referenz Ton ${i+1}`} />)}</div>
      <label className="fieldLabel">Audio-Paar<select style={{width:'100%'}} value={audioItem} onChange={e => setAudioItem(e.target.value)}>{content.items.map(item => <option key={item.id} value={item.id}>{item.hans} — {item.pinyin}</option>)}</select></label>
      <div className="buttonRow"><AudioButton key={audioItem+'natural'} src={itemMap.get(audioItem)!.audio} label="Natural" /><AudioButton key={audioItem+'slow'} src={itemMap.get(audioItem)!.slowAudio!} label="Careful slow" /></div>
      <details><summary>Aufnahme-Ereignisse (nur lokal)</summary><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{JSON.stringify(audioEvents,null,2)}</pre></details>
    </details>
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
      <p>Prüft Mandarin-Texteingaben, auch für Wörter ohne eigene Text-Recall-Aufgabe. Keine Bewertung gesprochener Aussprache. Aktueller Prüfstand: Tonnotation 1–4 aktiv, neutraler Ton noch nicht bewertet.</p>
      <label className="fieldLabel">Erwartetes Item<select style={{ width: '100%', minWidth: 0, padding: 8 }} value={itemId} onChange={event => { setItemId(event.target.value); setInput(''); setResult(null); }}>
        {content.items.map(item => <option key={item.id} value={item.id}>{item.hans} — {item.pinyin}{item.slot ? ' …' : ''}</option>)}
      </select></label>
      <form onSubmit={event => { event.preventDefault(); setResult(evaluateAnswer(input, itemMap.get(itemId)!, content.introducedAssessment, name)); }}>
        <label className="fieldLabel">Testeingabe<input value={input} onChange={event => { setInput(event.target.value); setResult(null); }} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} /></label>
        <button type="submit">Interpreter prüfen</button>{' '}<button type="button" onClick={() => { setInput(''); setResult(null); }}>Interpreter zurücksetzen</button>
      </form>
      {result && <><p role="status">{answerFeedback(result)}</p><pre data-testid="interpreter-result" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify(result, null, 2)}</pre></>}
    </section>
  </main>;
}
