import { useEffect, useRef, useState } from 'react';
import { db, exportLearningState, importLearningState, logEvent, recordAttempt, type Session } from '../core/progress/db';
import { ui } from '../core/i18n/de';
import { content, taskMap } from '../languages/mandarin/content';
import { composeReview, objectFor, withSpacedRetry } from '../languages/mandarin/session';
import { Exercise, type Evidence } from '../languages/mandarin/components/Exercise';
import { Worksheet } from '../languages/mandarin/components/Worksheet';
export function LessonRunner() {
  const [ready, setReady] = useState(false), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const [view, setView] = useState<'home' | 'learn' | 'done'>('home');
  const [session, setSession] = useState<Session | null>(null);
  const [script, setScript] = useState<'hant' | 'hans'>('hant'); const [name, setName] = useState('');
  const [message, setMessage] = useState(''), [reflection, setReflection] = useState(''), [reflectionSaved, setReflectionSaved] = useState(false);
  const [offline, setOffline] = useState(document.documentElement.dataset.offline ?? 'waiting');
  const lock = useRef(false), taskStarted = useRef(Date.now());
  async function load() {
    try {
      await db.open();
      const [latest, storedScript, storedName] = await Promise.all([db.sessions.orderBy('updatedAt').last(), db.preferences.get('script'), db.preferences.get('name')]);
      setSession(latest ?? null); setScript(storedScript?.value === 'hans' ? 'hans' : 'hant'); setName(storedName?.value ?? ''); setReady(true); setError('');
    } catch { setError(ui.storageError); }
  }
  useEffect(() => { void load(); const listener = () => setOffline(document.documentElement.dataset.offline ?? 'waiting'); window.addEventListener('offline-ready', listener); return () => window.removeEventListener('offline-ready', listener); }, []);
  useEffect(() => { taskStarted.current = Date.now(); }, [session?.index, session?.id]);
  async function mutation(action: () => Promise<void>) {
    if (lock.current) throw new Error('A save is already pending'); lock.current = true; setBusy(true); setError('');
    try { await action(); } catch (e) { setError(ui.storageError); throw e; }
    finally { lock.current = false; setBusy(false); }
  }
  const task = session ? taskMap.get(session.plan[session.index]) : undefined;
  function event(type: string, detail: Record<string, string | number | boolean> = {}) {
    if (!session) return;
    void logEvent({ sessionId: session.id, taskId: task?.id ?? 'home', type, detail: { ...detail, index: session.index } }).catch(() => setError(ui.storageError));
  }
  async function begin(replay = false) {
    await mutation(async () => {
      let next = session;
      if (replay || !next || next.completed) {
        const plan = replay || !next ? content.initialPlan : composeReview(await db.relations.toArray(), script, Date.now(), next.plan.includes('write-guided'));
        next = { id: crypto.randomUUID(), plan, index: 0, completed: false, startedAt: Date.now(), updatedAt: Date.now(), script };
      }
      const chosen = next;
      await db.transaction('rw', db.sessions, db.preferences, db.events, async () => {
        await db.sessions.put(chosen); await db.preferences.put({ key: 'script', value: chosen.script });
        await logEvent({ sessionId: chosen.id, taskId: chosen.plan[chosen.index], type: replay ? 'lesson_retest' : session && !session.completed ? 'session_resume' : 'session_start', detail: { script: chosen.script } });
      });
      setSession(chosen); setScript(chosen.script); setReflectionSaved(false); setView('learn');
    });
  }
  async function next(skip = false) {
    if (!session || !task) return;
    await mutation(async () => {
      const completed = session.index >= session.plan.length - 1;
      const updated = { ...session, completed, index: completed ? session.index : session.index + 1, updatedAt: Date.now() };
      await db.transaction('rw', db.sessions, db.preferences, db.events, async () => {
        await db.sessions.put(updated); await db.preferences.put({ key: 'name', value: name.trim() });
        await logEvent({ sessionId: session.id, taskId: task.id, type: completed ? 'session_end' : skip ? 'skip' : 'task_completed', detail: { durationMs: Date.now() - taskStarted.current } });
      });
      setSession(updated); if (completed) setView('done'); window.scrollTo({ top: 0 });
    });
  }
  async function attempt(e: Evidence, tone?: number) {
    if (!session || !task) return;
    await mutation(async () => {
      const history = await db.events.where('sessionId').equals(session.id).toArray();
      const exposed = history.some(event => event.taskId === task.id && event.detail.index === session.index && ['pinyin_reveal', 'writing_hint', 'stroke_animation', 'guided_start', 'answer_clarification', 'attempt'].includes(event.type));
      const assisted = e.assisted || exposed;
      const objectId = tone ? `cmn:tone:${tone}` : objectFor(task, session.script);
      const target = tone ? 'perception' as const : task.target!;
      const plan = !tone && ['listen', 'read', 'recall'].includes(task.kind) && (e.result !== 'success' || assisted) ? withSpacedRetry(session.plan, session.index, task.id) : session.plan;
      const updated = { ...session, plan, updatedAt: Date.now() };
      await db.transaction('rw', db.sessions, db.relations, db.events, async () => {
        await recordAttempt({ objectId, target, result: e.result, assisted, sessionId: session.id, at: Date.now() }, {
          sessionId: session.id, taskId: task.id, type: 'attempt', detail: { objectId, target, result: e.result, assisted, index: session.index,
            responseTimeMs: Date.now() - taskStarted.current, ...e.detail },
        }); await db.sessions.put(updated);
      });
      setSession(updated);
    });
  }
  async function pause() {
    if (!session) return;
    await mutation(async () => {
      await db.preferences.put({ key: 'name', value: name.trim() });
      await logEvent({ sessionId: session.id, taskId: task?.id ?? '', type: 'session_pause', detail: { durationMs: Date.now() - session.startedAt } });
      setView('home');
    });
  }
  async function backup() {
    try { const url = URL.createObjectURL(new Blob([await exportLearningState()], { type: 'application/json' }));
      const a = document.createElement('a'); a.href = url; a.download = `mandarin-${new Date().toISOString().slice(0, 10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setError(ui.storageError); }
  }
  async function restore(file: File) {
    try { if (file.size > 20_000_000) throw new Error('Too large'); await importLearningState(await file.text(), new Set(taskMap.keys())); await load(); setMessage(ui.backupDone); }
    catch { setMessage(ui.backupError); }
  }
  const safe = (action: () => Promise<void>) => { void action().catch(() => {}); };
  const settings = <details className="settings"><summary>{ui.settings}</summary>
    <fieldset disabled={busy || (!!session && !session.completed)}><legend>{ui.script}</legend><div className="segmented">{(['hant', 'hans'] as const).map(s => <button type="button" key={s} aria-pressed={script === s} className={script === s ? 'selected' : ''} onClick={() => { setScript(s); }}>{ui[s]}</button>)}</div></fieldset>
    <div className="settingsActions"><button type="button" className="textButton" disabled={busy} onClick={() => safe(() => begin(true))}>Lesson 1 vollständig erneut testen</button><p className="muted">Beginnt eine neue Testrunde. Dein bisheriger Lernverlauf bleibt erhalten.</p><button type="button" className="textButton" onClick={() => void backup()}>{ui.backup}</button>
      <label className="fileLabel">{ui.restore}<input type="file" accept="application/json,.json" onChange={e => { const file = e.target.files?.[0]; if (file) void restore(file); e.target.value = ''; }} /></label>
      <button type="button" className="textButton" onClick={() => { void navigator.storage?.persist?.().then(ok => setMessage(ok ? ui.persisted : ui.notPersisted)).catch(() => setMessage(ui.notPersisted)); }}>{ui.persist}</button>
      <button type="button" className="textButton" onClick={() => window.print()}>{ui.worksheet}</button></div>{message && <p role="status">{message}</p>}
  </details>;
  const errorBox = error && <p className="feedback error" role="alert">{error}{!ready && <button type="button" onClick={() => void load()}>{ui.reload}</button>}</p>;
  if (!ready) return <main className="shell"><div className="card">{errorBox || <p>{ui.loading}</p>}</div></main>;
  return <><main className={view === 'learn' ? 'lessonShell' : 'shell'}>
    {view === 'home' && <section className="card startCard"><p className="eyebrow">Mandarin · Foundation 01</p><h1 lang="zh">你好</h1><h2>{ui.home}</h2><p className="lead">{ui.homeLead}</p>
      <button type="button" disabled={busy} onClick={() => safe(() => begin())}>{ui.learn}</button><p className="muted">{ui.noScores}</p>
      <div className="homeMeta"><span>{ui.saved}</span><span role="status">{offline === 'development' ? ui.offlineDevelopment : offline === 'ready' ? ui.offlineReady : offline === 'failed' ? ui.offlineFailed : ui.offlineWaiting}</span></div>
      {errorBox}{settings}<p className="prototypeNote">Testversion A1 · {ui.prototype}</p></section>}
    {view === 'learn' && task && session && <><header className="lessonHeader"><span>{ui.home}</span><button type="button" disabled={busy} className="textButton" onClick={() => safe(pause)}>{ui.pause}</button></header>
      <section className="lessonCard" aria-busy={busy}><p className="eyebrow">{task.kind === 'writing' && !task.recall ? 'Schreiben lernen' : task.kind === 'encounter' ? ui.encounter : task.kind === 'read' ? ui.recognition : task.kind === 'closure' ? 'Mandarin · 01' : ui.recall}</p><h2>{task.prompt.de}</h2>{errorBox}
        {task.kind === 'closure' ? <div className="stepStack"><p className="lead">{session.plan.length === 1 ? ui.nothingDue : ui.closeBody}</p><button type="button" disabled={busy} onClick={() => safe(() => next())}>{ui.continue}</button></div>
          : <><Exercise key={`${session.id}:${session.index}:${task.id}`} task={task} script={session.script} name={name} setName={setName} disabled={busy} onEvent={event} onAttempt={attempt} onTone={(tone, correct) => attempt({ result: correct ? 'success' : 'failure', assisted: true }, tone)} onNext={() => safe(() => next())} />
            <button type="button" className="skipButton" disabled={busy} onClick={() => safe(() => next(true))}>{ui.skip}</button></>}
      </section></>}
    {view === 'done' && <section className="card"><p className="eyebrow">Mandarin · 01</p><h1>{ui.closeTitle}</h1><p className="lead">{ui.closeBody}</p>{errorBox}
      {!reflectionSaved ? <div className="stepStack"><label className="fieldLabel">{ui.note}<textarea maxLength={500} value={reflection} onChange={e => setReflection(e.target.value)} /></label><p>{ui.reflect}</p><div className="buttonRow">{[ui.easy, ui.right, ui.much].map(r => <button type="button" className="secondaryButton" key={r} disabled={busy} onClick={() => safe(() => mutation(async () => { await logEvent({ sessionId: session!.id, taskId: 'closure', type: 'reflection', detail: { rating: r, note: reflection } }); setReflectionSaved(true); }))}>{r}</button>)}</div></div> : <p role="status">{ui.reflectionSaved}</p>}
      <button type="button" className="textButton" onClick={() => setView('home')}>{ui.home}</button>{settings}</section>}
  </main><Worksheet /></>;
}
