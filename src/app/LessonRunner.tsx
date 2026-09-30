import { MiniTransfer } from '../languages/mandarin/components/MiniTransfer';
import { reserveTransfer, transferState, atTransfer, saveTransfer, finishTransfer, type TransferState } from '../languages/mandarin/mini-transfer';
import { ActiveTime } from '../core/observability/activeTime';
import { attemptContext } from '../core/observability/evidence';
import { screenlessFor, paperFor, screenlessEvidence } from '../languages/mandarin/hybrid';
import { ScreenlessRecall, PaperRecall } from '../languages/mandarin/components/HybridRecall';
import { introductionForTask, introduced, taskPresentationRole } from '../languages/mandarin/introduction';
import { itemMap } from '../languages/mandarin/content';
import { stopReferenceAudio } from '../core/exercises/AudioButton';
import { previousObjectIndex, inspectionEvent } from '../core/progress/optionalPractice';
import { IconButton } from '../core/exercises/Controls';
import { useEffect, useRef, useState } from 'react';
import { db, resetLearningState, exportLearningState, importLearningState, logEvent, recordAttempt, type Session, type ResearchEvent, type SavedFeedback, type FeedbackEvent } from '../core/progress/db';
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
  const [localTransfer,setLocalTransfer]=useState<TransferState|null>(null);
  const [transferTestArmed,setTransferTestArmed]=useState(false);
  const [ready, setReady] = useState(false), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const [inspecting, setInspecting] = useState(false), [inspectionName,setInspectionName] = useState('');
  const [view, setView] = useState<'home' | 'learn'>('home');
  const [attentionSnapshot, setAttentionSnapshot] = useState<{key: string; events: ResearchEvent[]} | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [script, setScript] = useState<'hant' | 'hans'>('hant'); const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [hasStoredLearning, setHasStoredLearning] = useState(false);
  const [offline, setOffline] = useState(document.documentElement.dataset.offline ?? 'waiting');
  const lock = useRef(false), taskStarted = useRef(Date.now());
  async function load() {
    try {
      await db.open();
      const [latest, storedScript, storedName, relationCount, eventCount] = await Promise.all([db.sessions.orderBy('updatedAt').last(), db.preferences.get('script'), db.preferences.get('name'), db.relations.count(), db.events.count()]);
      setHasStoredLearning(!!latest || relationCount > 0 || eventCount > 0);
      setLocalTransfer(await transferState());
      if(import.meta.env.DEV)setTransferTestArmed((await import('../languages/mandarin/mini-transfer-dev')).isArmed());
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
      const isTransfer=!!session&&atTransfer(session,localTransfer);
  const screenless=screenlessFor(session,history,Date.now()), paper=paperFor(session,history,Date.now());
      const offered=screenless?'screenless_offered':paper.length?'paper_offered':null;
      clock.block('non_learning',t.kind==='closure'&&!paper.length,performance.now());
      if(offered && !history.some(e=>e.sessionId===session.id&&e.detail.index===session.index&&e.type===offered)) {
        await logEvent({sessionId:session.id,taskId:t.id,type:offered,detail:{index:session.index,items:paper.join(','),item:t.itemId??''}});
        history=await db.events.toArray();
      }
      if(cancelled)return;
      clock.block('loading',false,performance.now());setAttentionSnapshot({key:`${session.id}:${session.index}`,events:history}); const previous=t.itemId?exposure(history).get(t.itemId):undefined;
      if(t.kind==='closure'&&!paper.length)return;
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
  const isTransfer=!!session&&atTransfer(session,localTransfer);
  const screenless=!!session&&snapshotReady&&screenlessFor(session,history,Date.now());
  const paper=session&&snapshotReady?paperFor(session,history,Date.now()):[];
  const revealed=(type:string)=>history.some(e=>e.sessionId===session?.id&&e.detail.index===session?.index&&e.type===type);
  const encoding = !!task && !!session && !!introductionForTask(task,session.script,history);
  const writingIntroduction = task?.kind==='writing' && (!task.recall || (!!session && !introduced(itemMap.get(task.itemId!)!,'writing',session.script,history)));
  const previousIndex = session ? previousObjectIndex(session.index) : null;
  const previousTask = !isTransfer && session && previousIndex !== null ? taskMap.get(session.plan[previousIndex]) : undefined;
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
      const savedTransfer=await transferState();
      const pending=savedTransfer&&savedTransfer.phase!=='done'?await db.sessions.get(savedTransfer.sessionId):null;
      if(pending&&atTransfer(pending,savedTransfer))next=pending;
      if (!(next&&atTransfer(next,savedTransfer)) && (replay || !shouldResume(next, Date.now()))) {
        const plan = composeContinuous(await db.relations.toArray(), await db.events.toArray(), script, Date.now());
        next = { id: crypto.randomUUID(), plannerVersion: 'd1', plan, index: 0, completed: false, startedAt: Date.now(), updatedAt: Date.now(), script };
      }
      const chosen = next!;
      await db.transaction('rw', db.sessions, db.preferences, db.events, async () => {
        await db.sessions.put(chosen); await db.preferences.put({ key: 'script', value: chosen.script });
        await logEvent({ sessionId: chosen.id, taskId: chosen.plan[chosen.index], type: replay ? 'learning_continue' : chosen.id === session?.id ? 'session_resume' : 'session_start', detail: { script: chosen.script } });
      });
      setInspecting(false); setAttentionSnapshot(null); setSession(chosen); setScript(chosen.script); setView('learn');
    });
  }
  async function transferSave(patch: Parameters<typeof saveTransfer>[1]) {
    if(session)setLocalTransfer(await saveTransfer(session,patch));
  }
  async function transferNext() {
    if(!session)return;
    await mutation(async()=>{await finishTransfer(session);setLocalTransfer(await transferState());window.scrollTo({top:0});});
  }
  async function next(skip = false) {
    if (!session || !task || inspecting || !interaction.canAdvance()) return;
    await mutation(async () => {
      const completed = session.index >= session.plan.length - 1;
      const updated = { ...session, evaluation: undefined, completed, index: completed ? session.index : session.index + 1, updatedAt: Date.now() };
      await db.transaction('rw', db.sessions, db.preferences, db.events, async () => {
        await db.sessions.put(updated); await db.preferences.put({ key: 'name', value: name.trim() });
        await logEvent({ sessionId: session.id, taskId: task.id, type: completed ? 'session_end' : skip ? 'skip' : 'task_completed', detail: { ...timing(), activeMs: activeTime(), durationMs: Date.now() - taskStarted.current } });
      });
      setAttentionSnapshot(null); setSession(updated); window.scrollTo({ top: 0 });
    });
  }
  async function attempt(e: Evidence, tone?: number) {
    if (!session || !task) return;
    await mutation(async () => {
      const history = await db.events.where('sessionId').equals(session.id).toArray();
      const exposed = history.some(event => event.taskId === task.id && event.detail.index === session.index && ['pinyin_reveal', 'writing_hint', 'writing_stroke_hint', 'writing_preview', 'stroke_animation', 'guided_start', 'answer_clarification', 'previous_object_help', 'attempt'].includes(event.type));
      const comparedBeforeScreenInput = e.detail?.mode === 'screen' && history.some(event => event.taskId === task.id && event.detail.index === session.index && event.type === 'writing_compare');
      const assisted = e.assisted || exposed || comparedBeforeScreenInput;
      const objectId = tone ? `cmn:tone:${tone}` : objectFor(task, session.script);
      const target = tone ? 'perception' as const : task.target!;
      const plan = !tone && ['listen', 'read', 'recall'].includes(task.kind) && (e.result !== 'success' || assisted) ? withSpacedRetry(session.plan, session.index, task.id) : session.plan;
      let updated = { ...session, plan, updatedAt: Date.now() };
      await db.transaction('rw', db.sessions, db.relations, db.events, async () => {
        const stored = await db.sessions.get(session.id);
        if (stored && stored.index !== session.index) { updated = stored; return; }
        const prior = stored?.evaluation;
        const current = prior?.index === session.index && prior.taskId === task.id ? prior : undefined;
        const part = e.part ?? 'main';
        // Durable guard also covers a reload/second tab with a stale component.
        if (e.feedback && current?.results[part]) { updated = stored!; return; }
        if (e.feedback) updated = { ...updated, evaluation: { index: session.index, taskId: task.id,
          step: part, results: { ...current?.results, [part]: e.feedback } } };
        await recordAttempt({ objectId, target, result: e.result, assisted, sessionId: session.id, at: Date.now() }, {
          sessionId: session.id, taskId: task.id, type: 'attempt', detail: { ...timing(), objectId, target, result: e.result, assisted, index: session.index,
            item:task.itemId??'',modality:task.kind,activeMs:activeTime(),responseTimeMs: Date.now() - taskStarted.current, ...attemptContext(task,e.detail) },
        }); await db.sessions.put(updated);
      });
      setSession(updated);
    });
  }
  async function checkpoint(step: string, feedback?: SavedFeedback, events: FeedbackEvent[] = []) {
    if (!session || !task) return;
    await mutation(async () => {
      let updated = session;
      await db.transaction('rw', db.sessions, db.events, async () => {
        const stored = await db.sessions.get(session.id);
        if (stored && stored.index !== session.index) { updated = stored; return; }
        const prior = stored?.evaluation;
        const current = prior?.index === session.index && prior.taskId === task.id ? prior : undefined;
        updated = { ...session, updatedAt: Date.now(), evaluation: { index: session.index, taskId: task.id,
          step, results: { ...current?.results, ...(feedback ? { [step]: feedback } : {}) } } };
        await db.sessions.put(updated);
        for (const { type, detail } of events) await logEvent({sessionId:session.id, taskId:task.id, type,
          detail:{...timing(), item:task.itemId??'', modality:task.kind, activeMs:activeTime(), ...detail, index:session.index}});
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
      setAttentionSnapshot({key:`${session.id}:${session.index}`,events:updatedHistory});
    });
  }
  // Batches remain persistence/planning units, not learner-facing stopping points.
  async function continueBatch() {
    if (!session || task?.kind !== 'closure') return;
    await mutation(async () => {
      const offered=import.meta.env.DEV ? await (await import('../languages/mandarin/mini-transfer-dev')).reserveLocalTransfer(session,await db.events.toArray()) : await reserveTransfer(session);
      setLocalTransfer(offered);
      if(import.meta.env.DEV)setTransferTestArmed((await import('../languages/mandarin/mini-transfer-dev')).isArmed());
      if(atTransfer(session,offered))return;
      let chosen: Session | undefined;
      await db.transaction('rw', db.sessions, db.relations, db.events, async () => {
        const now = Date.now();
        const plan = composeContinuous(await db.relations.toArray(), await db.events.toArray(), session.script, now);
        if (!plan.some(id => taskMap.get(id)?.kind !== 'closure')) throw new Error('No learning task available');
        // load() orders by updatedAt: the successor must sort after its completed batch,
        // even when both writes happen in the same millisecond.
        chosen = {id:crypto.randomUUID(), plannerVersion:'d1', plan, index:0, completed:false, startedAt:now, updatedAt:now + 1, script:session.script};
        await db.sessions.put({...session, completed:true, updatedAt:now});
        await db.sessions.put(chosen);
        await logEvent({sessionId:session.id, taskId:'closure', type:'session_end', detail:{...timing(), reason:'batch_transition', nextSessionId:chosen.id}});
        await logEvent({sessionId:chosen.id, taskId:plan[0], type:'learning_continue', detail:{script:chosen.script, reason:'batch_transition', previousSessionId:session.id}});
      });
      setInspecting(false); setAttentionSnapshot(null); setSession(chosen!); window.scrollTo({top:0});
    });
  }
  useEffect(() => {
    if (view==='learn' && !isTransfer && task?.kind==='closure' && snapshotReady && !paper.length && !busy && !error && !lock.current) {
      void continueBatch().catch(() => {});
    }
  }, [view, session?.id, session?.index, snapshotReady, paper.length, busy, error, isTransfer]);
  async function backup() {
    try { const url = URL.createObjectURL(new Blob([await exportLearningState()], { type: 'application/json' }));
      const a = document.createElement('a'); a.href = url; a.download = `mandarin-${new Date().toISOString().slice(0, 10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setError(ui.storageError); }
  }
  async function restart() {
    if (lock.current || !window.confirm('Wirklich von vorne beginnen? Dein Lernfortschritt, deine Sitzungen, Forschungsnotizen und Einstellungen werden auf diesem Gerät gelöscht. Ohne heruntergeladene Sicherung lässt sich das nicht rückgängig machen.')) return;
    await mutation(async () => {
      await resetLearningState();
      setSession(null); setHasStoredLearning(false); setName(''); setScript('hant');
      setView('home'); setMessage('Dein Lernstand wurde zurückgesetzt. Weiterlernen beginnt wieder mit 你好.');
    });
  }
  async function restore(file: File) {
    try { if (file.size > 20_000_000) throw new Error('Too large'); await importLearningState(await file.text(), new Set(taskMap.keys())); await load(); setMessage(ui.backupDone); }
    catch { setMessage(ui.backupError); }
  }
  const safe = (action: () => Promise<void>) => { void action().catch(() => {}); };
  const settings = <details className="settings"><summary>{ui.settings}</summary>
    <fieldset disabled={busy || (!!session && !session.completed)}><legend>{ui.script}</legend><div className="segmented">{(['hant', 'hans'] as const).map(s => <button type="button" key={s} aria-pressed={script === s} className={script === s ? 'selected' : ''} onClick={() => { setScript(s); }}>{ui[s]}</button>)}</div></fieldset>{session && !session.completed && <p className="muted">Die Schriftwahl bleibt während deines laufenden Lernverlaufs gleich, damit Aufgaben und Lernstand zusammenpassen.</p>}
    <div className="settingsActions"><p className="muted" id="backupNote">Dein Lernstand ist nur in diesem Browser gespeichert. Sichere ihn vor dem Löschen von Browserdaten oder einem Browserwechsel.</p><button aria-describedby="backupNote" type="button" className="textButton" onClick={() => void backup()}>{ui.backup}</button>
      <label className="fileLabel">{ui.restore}<input type="file" accept="application/json,.json" onChange={e => { const file = e.target.files?.[0]; if (file) void restore(file); e.target.value = ''; }} /></label>
      <button type="button" className="textButton" onClick={() => { void navigator.storage?.persist?.().then(ok => setMessage(ok ? ui.persisted : ui.notPersisted)).catch(() => setMessage(ui.notPersisted)); }}>{ui.persist}</button>
      <button type="button" className="textButton" onClick={() => window.print()}>{ui.worksheet}</button>
      <details className="restartLearning"><summary>Von vorne beginnen</summary><p>Setzt deinen gesamten Lernstand einschließlich Verlauf und Einstellungen auf diesem Gerät zurück. Sichere ihn bei Bedarf zuerst über „Lernstand sichern“. Schließe vor dem Zurücksetzen andere geöffnete Fenster dieser App.</p><button type="button" className="textButton" disabled={busy} onClick={() => safe(restart)}>Lernstand zurücksetzen …</button></details></div>{message && <p role="status">{message}</p>}
  </details>;
  const errorBox = error && <p className="feedback error" role="alert">{error}{!ready && <button type="button" onClick={() => void load()}>{ui.reload}</button>}</p>;
  if (!ready) return <main className="shell"><div className="card">{errorBox || <p>{ui.loading}</p>}</div></main>;
  return <InteractionContext.Provider value={{ ...interaction, canStart: () => !lock.current }}><main className={view === 'learn' ? 'lessonShell' : 'shell'}>
    {view === 'home' && <section className="card startCard"><h1 lang="zh">你好</h1><h2>{ui.home}</h2><p className="lead">{ui.homeLead}</p>
      <button type="button" disabled={busy} onClick={() => safe(() => begin())}>{session || hasStoredLearning ? ui.learn : 'Lernen starten'}</button><p className="muted">{ui.noScores}</p>
      <div className="homeMeta"><span>{ui.saved}</span><div className={`offlineStatus offline-${offline}`} role="status"><span>{offline === 'development' ? ui.offlineDevelopment : offline === 'unavailable' ? 'Offline-Speicherung ist in diesem Browser nicht verfügbar.' : offline === 'ready' ? ui.offlineReady : offline === 'failed' ? ui.offlineFailed : ui.offlineWaiting}</span>{offline === 'waiting' && <small>Wörter und Audios werden auf diesem Gerät gespeichert. Du kannst schon beginnen.</small>}{offline === 'failed' && <button type="button" className="utilityButton" onClick={() => prepareOffline(true)}>Vorbereitung erneut versuchen</button>}</div></div>
      {errorBox}{settings}{import.meta.env.DEV && <details className="settings"><summary>Lokale Testfunktion</summary><p>Einmaliger Test an der nächsten Abschnittsgrenze, ohne Änderung des Lernstands.</p><button type="button" disabled={busy || transferTestArmed || !!localTransfer && localTransfer.phase!=='done'} onClick={()=>safe(async()=>{(await import('../languages/mandarin/mini-transfer-dev')).arm();setTransferTestArmed(true);})}>Mini-Transfer im Lernfluss testen</button>{transferTestArmed&&<p role="status">Test vorgemerkt. Lerne normal weiter.</p>}</details>}<p className="prototypeNote">{ui.prototype}</p></section>}
    {view === 'learn' && task && session && <><header className="lessonHeader"><span>{ui.home}</span><div className="sessionTools">{previousTask && <IconButton icon={inspecting ? 'forward' : 'back'} label={inspecting ? 'Zur aktuellen Aufgabe' : 'Vorheriges'} disabled={busy || interaction.busy} onClick={()=>safe(togglePrevious)}/>}<IconButton icon="close" label={ui.pause} disabled={busy} className="sessionPause" onClick={() => safe(pause)}/></div></header>
      <section className="lessonCard" data-learning-state={isTransfer ? 'transfer' : encoding ? 'introduction' : task.kind==='tones' ? 'practice' : writingIntroduction ? 'writing' : task.kind==='encounter' ? 'connection' : 'retrieval'} data-task-kind={isTransfer ? 'transfer' : task.kind} hidden={inspecting} aria-busy={busy}><p className="eyebrow">{isTransfer ? 'IM ZUSAMMENHANG' : encoding ? ui.encounter : task.kind==='tones' ? 'Töne kennenlernen und üben' : task.kind==='tone-recall' ? 'Hören und unterscheiden' : writingIntroduction ? 'Schreiben lernen' : task.kind === 'encounter' ? 'Noch einmal verbinden' : task.kind === 'closure' ? 'Mandarin' : task.kind === 'listen' ? 'Hören' : task.kind === 'read' ? 'Lesen' : 'Aus dem Gedächtnis'}</p>{!isTransfer && (paper.length || screenless || (!encoding && task.kind !== 'encounter' && task.kind !== 'closure' && task.prompt.de !== 'Ein Zeichen selbst schreiben.')) ? <h2>{paper.length ? 'Schreiben aus dem Gedächtnis' : screenless ? 'Sag es laut auf Mandarin.' : task.prompt.de}</h2> : null}{errorBox}
        {isTransfer ? <MiniTransfer key={`${localTransfer!.caseId}:${localTransfer!.firstSeenAt}`} state={localTransfer!} script={session.script} onSave={transferSave} onNext={transferNext} disabled={busy}/> : task.kind === 'closure' && !snapshotReady ? <p role="status">{ui.loading}</p> : paper.length ? <PaperRecall key={`${session.id}:paper`} items={paper} script={session.script} revealedInitially={revealed('paper_revealed')} disabled={busy||interaction.busy} onReveal={()=>hybridReveal('paper_revealed')} onResult={paperResult}/> : task.kind === 'closure' ? <div role="status">{error ? <button type="button" disabled={busy} onClick={()=>setError('')}>Erneut versuchen</button> : ui.loading}</div>
          : screenless ? <><ScreenlessRecall key={`${session.id}:${session.index}:screenless`} item={itemMap.get(task.itemId!)!} script={session.script} revealedInitially={revealed('screenless_revealed')} disabled={busy||interaction.busy} onReveal={()=>hybridReveal('screenless_revealed')} onResult={screenlessResult} onExplore={event}/><button type="button" className="skipButton" disabled={busy||interaction.busy} onClick={()=>safe(()=>next(true))}>{ui.skip}</button></> : <>{attentionSnapshot?.key === `${session.id}:${session.index}` ? <Exercise savedEvaluation={session.evaluation?.index === session.index && session.evaluation.taskId === task.id ? session.evaluation : undefined} onCheckpoint={checkpoint} savedAssessment={(() => {
            const attempts = attentionSnapshot.events.filter(e=>e.type==='attempt' && e.sessionId===session.id && e.taskId===task.id && e.detail.index===session.index);
            const d=attempts.length===1?attempts[0].detail:undefined;
            return d && typeof d.assessToneNotation==='boolean' && typeof d.assessNeutralTone==='boolean' ? {toneNotation:d.assessToneNotation,neutralTone:d.assessNeutralTone} : undefined;
          })()} attentionHistory={attentionSnapshot.events} onIntroduce={introduce} key={`${session.id}:${session.index}:${task.id}`} task={task} script={session.script} name={name} setName={setName} disabled={busy || interaction.busy || inspecting} onEvent={event} onAttempt={attempt} onTone={(tone, correct, part, feedback) => attempt({ result: correct ? 'success' : 'failure', assisted: true, part, feedback }, tone)} onNext={() => task.kind === 'writing' ? next() : safe(() => next())} /> : <p role="status">{ui.loading}</p>}
            <button type="button" className="skipButton" disabled={busy || interaction.busy} onClick={() => safe(() => next(true))}>{ui.skip}</button></>}
      </section>
      {inspecting && previousTask && <section className="lessonCard inspectionSurface"><p className="eyebrow">Noch einmal ansehen</p><p className="inspectionNote">Freiwillige Übung · ohne neue Lernbewertung. Weiter führt zur aktuellen Aufgabe zurück.</p>{task && ['read','listen','recall','tone-recall'].includes(task.kind) && <p className="inspectionNote">Ein noch offener Abruf zählt nach dem Nachschauen als unterstützt.</p>}{previousTask.kind !== 'encounter' && previousTask.kind !== 'closure' && previousTask.prompt.de !== 'Ein Zeichen selbst schreiben.' && <h2>{previousTask.prompt.de}</h2>}{errorBox}
        <Exercise key={`inspection:${session.id}:${previousIndex}`} task={previousTask} script={session.script} name={inspectionName} setName={setInspectionName} disabled={busy || interaction.busy} attentionHistory={attentionSnapshot?.events} onEvent={(type,detail)=>{void inspectEvent(type,detail).catch(()=>setError(ui.storageError));}} onIntroduce={(type,detail)=>mutation(()=>inspectEvent(type,detail))} onAttempt={e=>mutation(()=>inspectEvent('practice_attempt',{result:e.result,assisted:e.assisted,...e.detail}))} onTone={(tone,correct)=>mutation(()=>inspectEvent('practice_tone',{tone,correct}))} onNext={()=>safe(togglePrevious)} />
      </section>}</>}
  </main><Worksheet /></InteractionContext.Provider>;
}
