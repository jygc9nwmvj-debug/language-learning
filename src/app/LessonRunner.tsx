import { ActiveTime } from '../core/observability/activeTime';
import { attemptContext } from '../core/observability/evidence';
import { screenlessFor, paperFor, meaningfulStop, screenlessEvidence } from '../languages/mandarin/hybrid';
import { ScreenlessRecall, PaperRecall } from '../languages/mandarin/components/HybridRecall';
import { introductionForTask, introduced, taskPresentationRole } from '../languages/mandarin/introduction';
import { itemMap } from '../languages/mandarin/content';
import { stopReferenceAudio } from '../core/exercises/AudioButton';
import { previousObjectIndex, inspectionEvent } from '../core/progress/optionalPractice';
import { IconButton } from '../core/exercises/Controls';
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
  const [inspecting, setInspecting] = useState(false), [inspectionName,setInspectionName] = useState('');
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
  const active = useRef(new ActiveTime(performance.now()));
  const activeVisit = useRef('');
  function activeTime(){return active.current.read(performance.now());}
  function timing(){return {observabilityVersion:1,activeVisitId:activeVisit.current,activeTaskMs:activeTime(),script};}
  useEffect(()=>{
    if(view!=='learn'||!session)return;
    const t=taskMap.get(session.plan[session.index]); if(!t)return;
    const clock=new ActiveTime(performance.now()), visit=crypto.randomUUID();
    active.current=clock;activeVisit.current=visit;
    clock.block('hidden',document.hidden,performance.now());
    clock.block('loading',true,performance.now());
    const checkpoint=()=>{void logEvent({sessionId:session.id,taskId:t.id,type:'active_time',detail:{observabilityVersion:1,activeVisitId:visit,activeTaskMs:clock.read(performance.now()),index:session.index,script:session.script}}).catch(()=>{});};
    const touch=()=>clock.touch(performance.now());
    const change=()=>{clock.block('hidden',document.hidden,performance.now());if(document.hidden)checkpoint();};
    document.addEventListener('visibilitychange',change);
    document.addEventListener('pointerdown',touch,{passive:true});document.addEventListener('keydown',touch);document.addEventListener('input',touch);
    window.addEventListener('pagehide',checkpoint);
    let cancelled = false;
    void db.events.toArray().then(async history=>{if(cancelled)return;
      const screenless=screenlessFor(session,history,Date.now()), paper=paperFor(session,history,Date.now());
      const offered=screenless?'screenless_offered':paper.length?'paper_offered':null;
      clock.block('non_learning',t.kind==='closure'&&!paper.length,performance.now());
      if(offered && !history.some(e=>e.sessionId===session.id&&e.detail.index===session.index&&e.type===offered)) {
        await logEvent({sessionId:session.id,taskId:t.id,type:offered,detail:{index:session.index,items:paper.join(','),item:t.itemId??''}});
        history=await db.events.toArray();
      }
      if(meaningfulStop(session,history) && !paper.length && !history.some(e=>e.sessionId===session.id&&e.type==='meaningful_stop_offered'))await logEvent({sessionId:session.id,taskId:t.id,type:'meaningful_stop_offered',detail:{index:session.index}});
      if(cancelled)return;
      clock.block('loading',false,performance.now());setAttentionSnapshot({key:`${session.id}:${session.index}`,events:history}); const previous=t.itemId?exposure(history).get(t.itemId):undefined;
      return logEvent({sessionId:session.id,taskId:t.id,type:'task_presented',detail:{...timing(),item:t.itemId??'',modality:t.kind,role:taskPresentationRole(t,session.script,history),elapsedSincePreviousMs:previous===undefined?-1:Date.now()-previous,index:session.index}});
    }).catch(()=>setError(ui.storageError));
    return ()=>{cancelled=true;checkpoint();document.removeEventListener('visibilitychange',change);document.removeEventListener('pointerdown',touch);document.removeEventListener('keydown',touch);document.removeEventListener('input',touch);window.removeEventListener('pagehide',checkpoint);};
  },[view,session?.id,session?.index]);
  async function mutation(action: () => Promise<void>) {
    if (lock.current) throw new Error('A save is already pending'); lock.current = true; active.current.block('saving',true,performance.now()); setBusy(true); setError('');
    try { await action(); } catch (e) { setError(ui.storageError); throw e; }
    finally { lock.current = false; active.current.block('saving',false,performance.now()); setBusy(false); }
  }
  const task = session ? taskMap.get(session.plan[session.index]) : undefined;
  const history = attentionSnapshot?.events ?? [];
  const snapshotReady=!!session&&attentionSnapshot?.key===`${session.id}:${session.index}`;
  const screenless=!!session&&snapshotReady&&screenlessFor(session,history,Date.now());
  const paper=session&&snapshotReady?paperFor(session,history,Date.now()):[];
  const goodStop=!!session&&snapshotReady&&meaningfulStop(session,history);
  const revealed=(type:string)=>history.some(e=>e.sessionId===session?.id&&e.detail.index===session?.index&&e.type===type);
  const encoding = !!task && !!session && !!introductionForTask(task,session.script,history);
  const writingIntroduction = task?.kind==='writing' && (!task.recall || (!!session && !introduced(itemMap.get(task.itemId!)!,'writing',session.script,history)));
  const previousIndex = session ? previousObjectIndex(session.index) : null;
  const previousTask = session && previousIndex !== null ? taskMap.get(session.plan[previousIndex]) : undefined;
  async function inspectEvent(type: string, detail: Record<string, string | number | boolean> = {}) {
    if (!session || !previousTask) return;
    const {correction:_correction,...safeDetail}=detail;
    await logEvent({ sessionId: session.id, taskId: previousTask.id, type: inspectionEvent(type), detail: { ...timing(), ...safeDetail, optionalPractice: true, item: previousTask.itemId ?? '', index: previousIndex! } });
  }
  async function togglePrevious() {
    if (!session || previousIndex === null || lock.current || !interaction.canAdvance()) return;
    stopReferenceAudio();
    if (inspecting) { active.current.block('inspection',false,performance.now()); setInspecting(false); return; }
    await mutation(async () => {
      await inspectEvent('opened');
      // Looking back during retrieval is explicit assistance, never an extra failure or success.
      if (task && ['read','listen','recall','tone-recall'].includes(task.kind)) await logEvent({sessionId:session.id,taskId:task.id,type:'previous_object_help',detail:{index:session.index}});
      active.current.block('inspection',true,performance.now()); setInspectionName(name); setInspecting(true);
    });
  }
  function event(type: string, detail: Record<string, string | number | boolean> = {}) {
    if (!session) return;
    if(type==='recording_preparing'||type==='recording_finalizing')active.current.block('capture_wait',true,performance.now());
    if(['recording_started','recording_completed_uncertain','recording_failed','microphone_unavailable'].includes(type))active.current.block('capture_wait',false,performance.now());
    void logEvent({ sessionId: session.id, taskId: task?.id ?? 'home', type, detail: { ...timing(), item:task?.itemId??'',modality:task?.kind??'',activeMs:activeTime(),...detail, index: session.index } }).catch(() => setError(ui.storageError));
  }
  async function introduce(type: string, detail: Record<string, string | number | boolean>) {
    if (!session || !task) return;
    await mutation(async () => {
      await logEvent({ sessionId: session.id, taskId: task.id, type, detail: { ...timing(), ...detail, index: session.index } });
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
      setInspecting(false); setAttentionSnapshot(null); setSession(chosen); setScript(chosen.script); setReflectionSaved(false); setReflection(''); setView('learn');
    });
  }
  async function next(skip = false) {
    if (!session || !task || inspecting || !interaction.canAdvance()) return;
    await mutation(async () => {
      const completed = session.index >= session.plan.length - 1;
      const updated = { ...session, completed, index: completed ? session.index : session.index + 1, updatedAt: Date.now() };
      await db.transaction('rw', db.sessions, db.preferences, db.events, async () => {
        await db.sessions.put(updated); await db.preferences.put({ key: 'name', value: name.trim() });
        await logEvent({ sessionId: session.id, taskId: task.id, type: completed ? 'session_end' : skip ? 'skip' : 'task_completed', detail: { ...timing(), activeMs: activeTime(), durationMs: Date.now() - taskStarted.current } });
      });
      setAttentionSnapshot(null); setSession(updated); if (completed) setView('done'); window.scrollTo({ top: 0 });
    });
  }
  async function attempt(e: Evidence, tone?: number) {
    if (!session || !task) return;
    await mutation(async () => {
      const history = await db.events.where('sessionId').equals(session.id).toArray();
      const exposed = history.some(event => event.taskId === task.id && event.detail.index === session.index && ['pinyin_reveal', 'writing_hint', 'writing_stroke_hint', 'writing_preview', 'stroke_animation', 'guided_start', 'answer_clarification', 'previous_object_help', 'attempt'].includes(event.type));
      const assisted = e.assisted || exposed;
      const objectId = tone ? `cmn:tone:${tone}` : objectFor(task, session.script);
      const target = tone ? 'perception' as const : task.target!;
      const plan = !tone && ['listen', 'read', 'recall'].includes(task.kind) && (e.result !== 'success' || assisted) ? withSpacedRetry(session.plan, session.index, task.id) : session.plan;
      const updated = { ...session, plan, updatedAt: Date.now() };
      await db.transaction('rw', db.sessions, db.relations, db.events, async () => {
        await recordAttempt({ objectId, target, result: e.result, assisted, sessionId: session.id, at: Date.now() }, {
          sessionId: session.id, taskId: task.id, type: 'attempt', detail: { ...timing(), objectId, target, result: e.result, assisted, index: session.index,
            item:task.itemId??'',modality:task.kind,activeMs:activeTime(),responseTimeMs: Date.now() - taskStarted.current, ...attemptContext(task,e.detail) },
        }); await db.sessions.put(updated);
      });
      setSession(updated);
    });
  }
  async function pause() {
    if (!session) return;
    await mutation(async () => {
      await db.preferences.put({ key: 'name', value: name.trim() });
      await logEvent({ sessionId: session.id, taskId: task?.id ?? '', type: 'session_pause', detail: { ...timing(), activeMs: activeTime() } });
      setInspecting(false); setView('home');
    });
  }
  async function hybridReveal(type: string) {
    if(!session||!task)return;
    await mutation(()=>logEvent({sessionId:session.id,taskId:task.id,type,detail:{...timing(),index:session.index}}));
  }
  async function screenlessResult(choice:'known'|'unsure'|'revealed') {
    if(!session||!task||!screenless||!interaction.canAdvance())return;
    await mutation(async()=>{
      const evidence=screenlessEvidence(choice), objectId=`cmn:${task.itemId}`;
      const own=await db.events.where('sessionId').equals(session.id).toArray();
      if(own.some(e=>e.type==='screenless_recall'&&e.detail.index===session.index))return;
      const assisted=evidence.assisted||own.some(e=>e.detail.index===session.index&&e.type==='previous_object_help');
      const updated={...session,index:session.index+1,updatedAt:Date.now()};
      await db.transaction('rw',db.relations,db.events,db.sessions,async()=>{
        await recordAttempt({objectId,target:'meaning',result:evidence.result,assisted,sessionId:session.id,at:Date.now()},
          {sessionId:session.id,taskId:task.id,type:'screenless_recall',detail:{...timing(),...evidence,assisted,objectId,target:'meaning',item:task.itemId!,index:session.index,modality:'screenless',activeMs:activeTime()}});
        await logEvent({sessionId:session.id,taskId:task.id,type:'task_completed',detail:{index:session.index,modality:'screenless'}});
        await db.sessions.put(updated);
      });
      stopReferenceAudio();setAttentionSnapshot(null);setSession(updated);window.scrollTo({top:0});
    });
  }
  async function paperResult(result:'success'|'unsure'|'skip') {
    if(!session||!paper.length)return;
    await mutation(async()=>{
      await logEvent({sessionId:session.id,taskId:'closure',type:result==='skip'?'paper_skipped':'paper_recall',detail:{...timing(),items:paper.join(','),index:session.index,result,evidence:'self_report',handwriting:'unknown',assisted:false}});
      // A group answer cannot identify which individual character failed. Keep it as
      // honest group evidence, without promoting or penalizing any writing relation.
      active.current.block('non_learning',true,performance.now());
      const updatedHistory=await db.events.toArray();
      if(meaningfulStop(session,updatedHistory)&&!updatedHistory.some(e=>e.sessionId===session.id&&e.type==='meaningful_stop_offered'))await logEvent({sessionId:session.id,taskId:'closure',type:'meaningful_stop_offered',detail:{index:session.index}});
      setAttentionSnapshot({key:`${session.id}:${session.index}`,events:updatedHistory});
    });
  }
  async function stopChoice(keepGoing:boolean) {
    if(!session)return;
    await mutation(async()=>{
      const updated={...session,completed:true,updatedAt:Date.now()};
      await db.transaction('rw',db.sessions,db.events,async()=>{
        await db.sessions.put(updated);
        await logEvent({sessionId:session.id,taskId:'closure',type:keepGoing?'voluntary_continue_after_stop':'session_stop_accepted',detail:{...timing()}});
        await logEvent({sessionId:session.id,taskId:'closure',type:'session_end',detail:{}});
      });
      setSession(updated);setAttentionSnapshot(null);setView('home');
    });
    if(keepGoing)await begin(true);
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
      {errorBox}{settings}<p className="prototypeNote">Testversion F-light · E · UI1 · C2.3+ · Inhalte D · {ui.prototype}</p></section>}
    {view === 'learn' && task && session && <><header className="lessonHeader"><span>{ui.home}</span><div className="sessionTools">{previousTask && <IconButton icon={inspecting ? 'forward' : 'back'} label={inspecting ? 'Zur aktuellen Aufgabe' : 'Vorheriges'} disabled={busy || interaction.busy} onClick={()=>safe(togglePrevious)}/>}<IconButton icon="close" label={ui.pause} disabled={busy} className="sessionPause" onClick={() => safe(pause)}/></div></header>
      <section className="lessonCard" data-learning-state={encoding ? 'introduction' : task.kind==='tones' ? 'practice' : writingIntroduction ? 'writing' : task.kind==='encounter' ? 'connection' : 'retrieval'} data-task-kind={task.kind} hidden={inspecting} aria-busy={busy}><p className="eyebrow">{encoding ? ui.encounter : task.kind==='tones' ? 'Töne kennenlernen und üben' : task.kind==='tone-recall' ? 'Hören und unterscheiden' : writingIntroduction ? 'Schreiben lernen' : task.kind === 'encounter' ? 'Noch einmal verbinden' : task.kind === 'closure' ? 'Mandarin' : 'Aus dem Gedächtnis'}</p><h2>{paper.length ? 'Schreiben aus dem Gedächtnis' : goodStop ? 'Guter Punkt für eine Pause.' : screenless ? 'Sag es laut auf Mandarin.' : encoding && task.kind !== 'encounter' ? 'Lerne den Ausdruck zuerst kennen.' : task.kind === 'closure' && session.plan.length === 1 ? 'Im Moment ist nichts fällig.' : task.prompt.de}</h2>{errorBox}
        {task.kind === 'closure' && !snapshotReady ? <p role="status">{ui.loading}</p> : paper.length ? <PaperRecall key={`${session.id}:paper`} items={paper} script={session.script} revealedInitially={revealed('paper_revealed')} disabled={busy||interaction.busy} onReveal={()=>hybridReveal('paper_revealed')} onResult={paperResult}/> : goodStop ? <div className="stepStack meaningfulStop"><p className="lead">Du hast Bekanntes abgerufen und weitergelernt. Wir bringen es später wieder.</p><button type="button" disabled={busy} onClick={()=>safe(()=>stopChoice(false))}>Für jetzt beenden</button><button type="button" className="secondaryButton" disabled={busy} onClick={()=>safe(()=>stopChoice(true))}>Weiterüben</button></div> : task.kind === 'closure' ? <div className="stepStack"><p className="lead">{session.plan.length === 1 ? ui.nothingDue : ui.closeBody}</p>{repeatLesson}<p className="muted">Eine weitere kurze Mischung aus Bekanntem und Neuem.</p><button type="button" disabled={busy} onClick={() => safe(() => next())}>{ui.continue}</button></div>
          : screenless ? <><ScreenlessRecall key={`${session.id}:${session.index}:screenless`} item={itemMap.get(task.itemId!)!} script={session.script} revealedInitially={revealed('screenless_revealed')} disabled={busy||interaction.busy} onReveal={()=>hybridReveal('screenless_revealed')} onResult={screenlessResult} onExplore={event}/><button type="button" className="skipButton" disabled={busy||interaction.busy} onClick={()=>safe(()=>next(true))}>{ui.skip}</button></> : <>{attentionSnapshot?.key === `${session.id}:${session.index}` ? <Exercise attentionHistory={attentionSnapshot.events} onIntroduce={introduce} key={`${session.id}:${session.index}:${task.id}`} task={task} script={session.script} name={name} setName={setName} disabled={busy || interaction.busy || inspecting} onEvent={event} onAttempt={attempt} onTone={(tone, correct) => attempt({ result: correct ? 'success' : 'failure', assisted: true }, tone)} onNext={() => task.kind === 'writing' ? next() : safe(() => next())} /> : <p role="status">{ui.loading}</p>}
            <button type="button" className="skipButton" disabled={busy || interaction.busy} onClick={() => safe(() => next(true))}>{ui.skip}</button></>}
      </section>
      {inspecting && previousTask && <section className="lessonCard inspectionSurface"><p className="eyebrow">Noch einmal ansehen</p><p className="inspectionNote">Freiwillige Übung · ohne neue Lernbewertung. Weiter führt zur aktuellen Aufgabe zurück.</p>{task && ['read','listen','recall','tone-recall'].includes(task.kind) && <p className="inspectionNote">Ein noch offener Abruf zählt nach dem Nachschauen als unterstützt.</p>}<h2>{previousTask.prompt.de}</h2>{errorBox}
        <Exercise key={`inspection:${session.id}:${previousIndex}`} task={previousTask} script={session.script} name={inspectionName} setName={setInspectionName} disabled={busy || interaction.busy} attentionHistory={attentionSnapshot?.events} onEvent={(type,detail)=>{void inspectEvent(type,detail).catch(()=>setError(ui.storageError));}} onIntroduce={(type,detail)=>mutation(()=>inspectEvent(type,detail))} onAttempt={e=>mutation(()=>inspectEvent('practice_attempt',{result:e.result,assisted:e.assisted,...e.detail}))} onTone={(tone,correct)=>mutation(()=>inspectEvent('practice_tone',{tone,correct}))} onNext={()=>safe(togglePrevious)} />
      </section>}</>}
    {view === 'done' && <section className="card"><p className="eyebrow">Mandarin</p><h1>{ui.closeTitle}</h1><p className="lead">{ui.closeBody}</p>{errorBox}{repeatLesson}<p className="muted">Eine weitere kurze Mischung aus Bekanntem und Neuem.</p>
      {!reflectionSaved ? <div className="stepStack"><label className="fieldLabel">{ui.note}<textarea maxLength={500} value={reflection} onChange={e => setReflection(e.target.value)} /></label><p>{ui.reflect}</p><div className="buttonRow">{[ui.easy, ui.right, ui.much].map(r => <button type="button" className="secondaryButton" key={r} disabled={busy} onClick={() => safe(() => mutation(async () => { await logEvent({ sessionId: session!.id, taskId: 'closure', type: 'reflection', detail: { rating: r, note: reflection } }); setReflectionSaved(true); }))}>{r}</button>)}</div></div> : <p role="status">{ui.reflectionSaved}</p>}
      <button type="button" className="textButton" onClick={() => setView('home')}>{ui.home}</button>{settings}</section>}
  </main><Worksheet /></InteractionContext.Provider>;
}
