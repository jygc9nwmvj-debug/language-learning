import { useEffect, useMemo, useState } from 'react';
import { StepRenderer } from '../core/exercises/steps';
import { getLessonProgress, getPreference, saveLessonProgress, setPreference } from '../core/progress/db';
import { lesson001 } from '../languages/mandarin/content/lessons/001-hello';

type ScriptChoice = 'traditional' | 'simplified';

export function LessonRunner() {
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [script, setScript] = useState<ScriptChoice>('traditional');
  const [displayName, setDisplayName] = useState('');
  const [revisitCount, setRevisitCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    void (async () => {
      const [storedScript, name, progress] = await Promise.all([
        getPreference('script', 'traditional'),
        getPreference('displayName', ''),
        getLessonProgress(lesson001.id),
      ]);
      setScript(storedScript === 'simplified' ? 'simplified' : 'traditional');
      setDisplayName(name);
      if (progress) {
        setStepIndex(Math.min(progress.currentStep, lesson001.steps.length - 1));
        setRevisitCount(progress.revisitCount);
        setCompleted(progress.completed);
      }
      setReady(true);
    })();
  }, []);

  const steps = useMemo(() => {
    if (revisitCount === 0) return lesson001.steps;
    // On revisit we deliberately remove some scaffolding and move recall earlier.
    const core = [...lesson001.steps];
    const recall = core.find((s) => s.id === 'recall');
    const without = core.filter((s) => s.id !== 'recall' && s.id !== 'first-listen');
    return recall ? [without[0], recall, ...without.slice(1)] : without;
  }, [revisitCount]);

  useEffect(() => {
    if (!ready) return;
    void setPreference('script', script);
  }, [script, ready]);

  useEffect(() => {
    if (!ready) return;
    void setPreference('displayName', displayName);
  }, [displayName, ready]);

  const next = async () => {
    if (stepIndex >= steps.length - 1) {
      setCompleted(true);
      await saveLessonProgress(lesson001.id, 0, true, revisitCount);
      return;
    }
    const nextIndex = stepIndex + 1;
    setStepIndex(nextIndex);
    await saveLessonProgress(lesson001.id, nextIndex, false, revisitCount);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const restart = async () => {
    const nextRevisit = revisitCount + 1;
    setRevisitCount(nextRevisit);
    setCompleted(false);
    setStepIndex(0);
    setStarted(true);
    await saveLessonProgress(lesson001.id, 0, false, nextRevisit);
  };

  if (!ready) return <main className="shell"><p>Loading local progress…</p></main>;

  if (!started && !completed) {
    return (
      <main className="shell">
        <section className="card startCard">
          <p className="eyebrow">Foundation · Lesson 1</p>
          <h1>你好</h1>
          <p className="lead">Say hello. Say your name. Hear what tone does.</p>
          <div className="settingBlock">
            <span>Characters</span>
            <div className="segmented">
              <button className={script === 'traditional' ? 'selected' : ''} onClick={() => setScript('traditional')}>Traditional</button>
              <button className={script === 'simplified' ? 'selected' : ''} onClick={() => setScript('simplified')}>Simplified</button>
            </div>
          </div>
          <p className="muted">About 15–20 minutes · works offline after the first load · progress stays on this device.</p>
          <button type="button" onClick={() => setStarted(true)}>Start</button>
        </section>
      </main>
    );
  }

  if (completed) {
    return (
      <main className="shell">
        <section className="card centerText">
          <p className="eyebrow">Lesson complete</p>
          <h1>你好。</h1>
          <p className="lead">You can already greet someone, say your name and recognize 我 · 你 · 好.</p>
          <p>Your progress is stored locally in this browser.</p>
          <div className="buttonRow centeredRow">
            <button type="button" onClick={() => void restart()}>Do it again — differently</button>
            <button className="secondaryButton" type="button" onClick={() => { setStarted(false); setCompleted(false); }}>Back</button>
          </div>
        </section>
      </main>
    );
  }

  const step = steps[stepIndex];
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

  return (
    <main className="lessonShell">
      <header className="lessonHeader">
        <button className="textButton" type="button" onClick={() => setStarted(false)}>Lesson 1</button>
        <div className="progressTrack" aria-label={`${progress}% through lesson`}><span style={{ width: `${progress}%` }} /></div>
        <span className="stepCount">{stepIndex + 1}/{steps.length}</span>
      </header>
      <section className="lessonCard">
        <StepRenderer
          step={step}
          script={script}
          displayName={displayName}
          setDisplayName={setDisplayName}
          onNext={() => void next()}
        />
      </section>
    </main>
  );
}
