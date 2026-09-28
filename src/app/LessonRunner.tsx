import { Icon } from '../core/exercises/Icon';
import { useEffect, useRef, useState } from 'react';
import { db, resetLearningState, exportLearningState, importLearningState, logEvent, recordAttempt, type Session, type ResearchEvent } from '../core/progress/db';
import { ui } from '../core/i18n/de';
import { content, taskMap } from '../languages/mandarin/content';
import { composeContinuous, shouldResume, exposure } from '../languages/mandarin/continuous';
import { objectFor, withSpacedRetry } from '../languages/mandarin/session';
import { Exercise, type Evidence } from '../languages/mandarin/components/Exercise';
import { InteractionContext, useInteractionScope } from '../core/exercises/InteractionScope';
import { prepareOffline } from '../core/offline/prepare';
import { Worksheet } from '../languages/mandarin/components/Worksheet';
export function LessonRunner() {
  const interaction = useInteractionScope();
  const [ready, setReady] = useState(false), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const [view, setView] = useState<'home' | 'learn' | 'done'>('home');
  const [attentionSnapshot, setAttentionSnapshot] = useState<{key: string; events: ResearchEvent[]} | null>(null);
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
  const active = useRef({total:0,since:Date.now()});
  function activeTime(){return active.current.total+(document.hidden?0:Date.now()-active.current.since);}
  useEffect(()=>{
    if(view!=='learn'||!session)return;
    const t=taskMap.get(session.plan[session.index]); if(!t)return;
    active.current={total:0,since:Date.now()};
    const change=()=>{if(document.hidden)active.current.total+=Date.now()-active.current.since;else active.current.since=Date.now();};
    document.addEventListener('visibilitychange',change);
    let cancelled = false;
    void db.events.toArray().then(history=>{if(cancelled)return; setAttentionSnapshot({key:`${session.id}:${session.index}`,events:history}); const previous=t.itemId?exposure(history).get(t.itemId):undefined;
      return logEvent({sessionId:session.id,taskId:t.id,type:'task_presented',detail:{item:t.itemId??'',modality:t.kind,role:previous===undefined?'new':'recall',elapsedSincePreviousMs:previous===undefined?-1:Date.now()-previous,index:session.index}});
    }).catch(()=>setError(ui.storageError));
    return ()=>{cancelled=true; document.removeEventListener('visibilitychange',change);};
  },[view,session?.id,session?.index]);
  async function mutation(action: () => Promise<void>) {
    if (lock.current) throw new Error('A save is already pending'); lock.current = true; setBusy(true); setError('');
    try { await action(); } catch (e) { setError(ui.storageError); throw e; }
    finally { lock.current = false; setBusy(false); }
  }
  const task = session ? taskMap.get(session.plan[session.index]) : undefined;
  function event(type: string, detail: Record<string, string | number | boolean> = {}) {
    if (!session) return;
    void logEvent({ sessionId: session.id, taskId: task?.id ?? 'home', type, detail: { item:task?.itemId??'',modality:task?.kind??'',activeMs:activeTime(),...detail, index: session.index } }).catch(() => setError(ui.storageError));
  }
  async function introduce(type: string, detail: Record<string, string | number | boolean>) {
    if (!session || !task) return;
    await mutation(async () => {
      await logEvent({ sessionId: session.id, taskId: task.id, type, detail: { ...detail, index: session.index } });
      setAttentionSnapshot({ key: `${session.id}:${session.index}`, events: await db.events.toArray() });
    });
  }
  async function begin(replay = false) {
    await mutation(async () => {
      let next = session;
      if (replay || !shouldResume(next, Date.now())) {
        const plan = composeContinuous(await db.relations.toArray(), await db.events.toArray(), script, Date.now());
        next = { id: crypto.randomUUID(), plannerVersion: 'd1', plan, index: 0, completed: false, startedAt: Date.now(), updatedAt: Date.now(), script };
      }
      const chosen = next!;
      await db.transaction('rw', db.sessions, db.preferences, db.events, async () => {
        await db.sessions.put(chosen); await db.preferences.put({ key: 'script', value: chosen.script });
        await logEvent({ sessionId: chosen.id, taskId: chosen.plan[chosen.index], type: replay ? 'learning_continue' : chosen.id === session?.id ? 'session_resume' : 'session_start', detail: { script: chosen.script } });
      });
      setAttentionSnapshot(null); setSession(chosen); setScript(chosen.script); setReflectionSaved(false); setReflection(''); setView('learn');
    });
  }
  async function next(skip = false) {
    if (!session || !task || !interaction.canAdvance()) return;
    await mutation(async () => {
      const completed = session.index >= session.plan.length - 1;
      const updated = { ...session, completed, index: completed ? session.index : session.index + 1, updatedAt: Date.now() };
      await db.transaction('rw', db.sessions, db.preferences, db.events, async () => {
        await db.sessions.put(updated); await db.preferences.put({ key: 'name', value: name.trim() });
        await logEvent({ sessionId: session.id, taskId: task.id, type: completed ? 'session_end' : skip ? 'skip' : 'task_completed', detail: { activeMs: activeTime(), durationMs: Date.now() - taskStarted.current } });
      });
      setAttentionSnapshot(null); setSession(updated); if (completed) setView('done'); window.scrollTo({ top: 0 });
    });
  }
  async function attempt(e: Evidence, tone?: number) {
    if (!session || !task) return;
    await mutation(async () => {
      const history = await db.events.where('sessionId').equals(session.id).toArray();
      const exposed = history.some(event => event.taskId === task.id && event.detail.index === session.index && ['pinyin_reveal', 'writing_hint', 'writing_stroke_hint', 'writing_preview', 'stroke_animation', 'guided_start', 'answer_clarification', 'attempt'].includes(event.type));
      const assisted = e.assisted || exposed;
      const objectId = tone ? `cmn:tone:${tone}` : objectFor(task, session.script);
      const target = tone ? 'perception' as const : task.target!;
      const plan = !tone && ['listen', 'read', 'recall'].includes(task.kind) && (e.result !== 'success' || assisted) ? withSpacedRetry(session.plan, session.index, task.id) : session.plan;
      const updated = { ...session, plan, updatedAt: Date.now() };
      await db.transaction('rw', db.sessions, db.relations, db.events, async () => {
        await recordAttempt({ objectId, target, result: e.result, assisted, sessionId: session.id, at: Date.now() }, {
          sessionId: session.id, taskId: task.id, type: 'attempt', detail: { objectId, target, result: e.result, assisted, index: session.index,
            item:task.itemId??'',modality:task.kind,activeMs:activeTime(),responseTimeMs: Date.now() - taskStarted.current, ...e.detail },
        }); await db.sessions.put(updated);
      });
      setSession(updated);
    });
  }
  async function pause() {
    if (!session) return;
    await mutation(async () => {
      await db.preferences.put({ key: 'name', value: name.trim() });
      await logEvent({ sessionId: session.id, taskId: task?.id ?? '', type: 'session_pause', detail: { activeMs: activeTime() } });
      setView('home');
    });
  }
  async function backup() {
    try { const url = URL.createObjectURL(new Blob([await exportLearningState()], { type: 'application/json' }));
      const a = document.createElement('a'); a.href = url; a.download = `mandarin-${new Date().toISOString().slice(0, 10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setError(ui.storageError); }
  }
  async function restart() {
    if (lock.current || !window.confirm('Wirklich von vorne beginnen? Dein Lernfortschritt, deine Sitzungen, Forschungsnotizen und Einstellungen werden auf diesem Gerät gelöscht. Ohne heruntergeladene Sicherung lässt sich das nicht rückgängig machen.')) return;
    await mutation(async () => {
      await resetLearningState();
      setSession(null); setName(''); setScript('hant'); setReflection(''); setReflectionSaved(false);
      setView('home'); setMessage('Dein Lernstand wurde zurückgesetzt. Weiterlernen beginnt wieder mit 你好.');
    });
  }
  async function restore(file: File) {
    try { if (file.size > 20_000_000) throw new Error('Too large'); await importLearningState(await file.text(), new Set(taskMap.keys())); await load(); setMessage(ui.backupDone); }
    catch { setMessage(ui.backupError); }
  }
  const safe = (action: () => Promise<void>) => { void action().catch(() => {}); };
  const settings = <details className="settings"><summary>{ui.settings}</summary>
    <fieldset disabled={busy || (!!session && !session.completed)}><legend>{ui.script}</legend><div className="segmented">{(['hant', 'hans'] as const).map(s => <button type="button" key={s} aria-pressed={script === s} className={script === s ? 'selected' : ''} onClick={() => { setScript(s); }}>{ui[s]}</button>)}</div></fieldset>
    <div className="settingsActions"><button type="button" className="textButton" onClick={() => void backup()}>{ui.backup}</button>
      <label className="fileLabel">{ui.restore}<input type="file" accept="application/json,.json" onChange={e => { const file = e.target.files?.[0]; if (file) void restore(file); e.target.value = ''; }} /></label>
      <button type="button" className="textButton" onClick={() => { void navigator.storage?.persist?.().then(ok => setMessage(ok ? ui.persisted : ui.notPersisted)).catch(() => setMessage(ui.notPersisted)); }}>{ui.persist}</button>
      <button type="button" className="textButton" onClick={() => window.print()}>{ui.worksheet}</button>
      <details className="restartLearning"><summary>Von vorne beginnen</summary><p>Setzt deinen gesamten Lernstand einschließlich Verlauf und Einstellungen auf diesem Gerät zurück. Sichere ihn bei Bedarf zuerst über „Lernstand sichern“. Schließe vor dem Zurücksetzen andere geöffnete Fenster dieser App.</p><button type="button" className="textButton" disabled={busy} onClick={() => safe(restart)}>Lernstand zurücksetzen …</button></details></div>{message && <p role="status">{message}</p>}
  </details>;
  const repeatLesson = <button type="button" disabled={busy} onClick={() => safe(() => begin(true))}>Weiterlernen</button>;
  const errorBox = error && <p className="feedback error" role="alert">{error}{!ready && <button type="button" onClick={() => void load()}>{ui.reload}</button>}</p>;
  if (!ready) return <main className="shell"><div className="card">{errorBox || <p>{ui.loading}</p>}</div></main>;
  return <InteractionContext.Provider value={{ ...interaction, canStart: () => !lock.current }}><main className={view === 'learn' ? 'lessonShell' : 'shell'}>
    {view === 'home' && <section className="card startCard"><p className="eyebrow">Mandarin</p><h1 lang="zh">你好</h1><h2>{ui.home}</h2><p className="lead">{ui.homeLead}</p>
      <button type="button" disabled={busy} onClick={() => safe(() => begin())}>{ui.learn}</button><p className="muted">{ui.noScores}</p>
      <div className="homeMeta"><span>{ui.saved}</span><div className={`offlineStatus offline-${offline}`} role="status"><span>{offline === 'development' ? ui.offlineDevelopment : offline === 'unavailable' ? 'Offline-Speicherung ist in diesem Browser nicht verfügbar.' : offline === 'ready' ? ui.offlineReady : offline === 'failed' ? ui.offlineFailed : ui.offlineWaiting}</span>{offline === 'ready' && <small>Funktioniert jetzt auch offline.</small>}{offline === 'waiting' && <small>Wörter und Audios werden auf diesem Gerät gespeichert. Du kannst schon beginnen.</small>}{offline === 'failed' && <button type="button" className="utilityButton" onClick={() => prepareOffline(true)}>Vorbereitung erneut versuchen</button>}</div></div>
      {errorBox}{settings}<p className="prototypeNote">Testversion C2.2 · Inhalte D · {ui.prototype}</p></section>}
    {view === 'learn' && task && session && <><header className="lessonHeader"><span>{ui.home}</span><button type="button" disabled={busy} className="sessionPause" aria-label={ui.pause} title={ui.pause} onClick={() => safe(pause)}><Icon name="close" />Pause</button></header>
      <section className="lessonCard" aria-busy={busy}><p className="eyebrow">{task.kind === 'writing' && !task.recall ? 'Schreiben lernen' : task.kind === 'encounter' ? ui.encounter : task.kind === 'read' ? ui.recognition : task.kind === 'closure' ? 'Mandarin' : ui.recall}</p><h2>{task.kind === 'closure' && session.plan.length === 1 ? 'Im Moment ist nichts fällig.' : task.prompt.de}</h2>{errorBox}
        {task.kind === 'closure' ? <div className="stepStack"><p className="lead">{session.plan.length === 1 ? ui.nothingDue : ui.closeBody}</p>{repeatLesson}<p className="muted">Eine weitere kurze Mischung aus Bekanntem und Neuem.</p><button type="button" disabled={busy} onClick={() => safe(() => next())}>{ui.continue}</button></div>
          : <>{attentionSnapshot?.key === `${session.id}:${session.index}` ? <Exercise attentionHistory={attentionSnapshot.events} onIntroduce={introduce} key={`${session.id}:${session.index}:${task.id}`} task={task} script={session.script} name={name} setName={setName} disabled={busy || interaction.busy} onEvent={event} onAttempt={attempt} onTone={(tone, correct) => attempt({ result: correct ? 'success' : 'failure', assisted: true }, tone)} onNext={() => task.kind === 'writing' ? next() : safe(() => next())} /> : <p role="status">{ui.loading}</p>}
            <button type="button" className="skipButton" disabled={busy || interaction.busy} onClick={() => safe(() => next(true))}>{ui.skip}</button></>}
      </section></>}
    {view === 'done' && <section className="card"><p className="eyebrow">Mandarin</p><h1>{ui.closeTitle}</h1><p className="lead">{ui.closeBody}</p>{errorBox}{repeatLesson}<p className="muted">Eine weitere kurze Mischung aus Bekanntem und Neuem.</p>
      {!reflectionSaved ? <div className="stepStack"><label className="fieldLabel">{ui.note}<textarea maxLength={500} value={reflection} onChange={e => setReflection(e.target.value)} /></label><p>{ui.reflect}</p><div className="buttonRow">{[ui.easy, ui.right, ui.much].map(r => <button type="button" className="secondaryButton" key={r} disabled={busy} onClick={() => safe(() => mutation(async () => { await logEvent({ sessionId: session!.id, taskId: 'closure', type: 'reflection', detail: { rating: r, note: reflection } }); setReflectionSaved(true); }))}>{r}</button>)}</div></div> : <p role="status">{ui.reflectionSaved}</p>}
      <button type="button" className="textButton" onClick={() => setView('home')}>{ui.home}</button>{settings}</section>}
  </main><Worksheet /></InteractionContext.Provider>;
}
