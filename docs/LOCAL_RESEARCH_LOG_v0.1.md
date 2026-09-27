# Local Research Log v0.1

**Status:** BUILD SPEC for V0.1 development mode

## Purpose

Support `Build while learning` without third-party analytics or hidden monitoring.

Keep two separate local data layers:

### Learner State
The minimum current state needed to adapt learning:
- object/skill stability
- due state
- recent evidence
- preferences
- curriculum frontier

### Research Log
Append-only development events used to evaluate whether the learning engine and UX behave well.

The Research Log is not required for ordinary public learning and can later be disabled or reduced.

## Example event

```json
{
  "timestamp": "2026-09-27T12:34:56+02:00",
  "sessionId": "local-id",
  "objectId": "lexeme:ni",
  "target": "reading",
  "operation": "free_recall",
  "scaffoldLevel": 0,
  "result": "failure",
  "errorType": "meaning_confusion",
  "responseTimeMs": 4200,
  "helpUsed": [],
  "contentVersion": "lesson1-v0.2"
}
```

Later success is a separate event, preserving the trajectory.

## Useful events

Only log events that answer learning/UX questions:
- task presented/completed/skipped
- result/evidence
- help/Pinyin reveal
- audio replay
- careful-slow audio request
- writing attempt/hint
- microphone attempt / analysis confidence
- voluntary session stop/continue
- session duration
- offline/persistence failure
- explicit learner feedback

Do not add generic surveillance events merely because they are technically available.

## Explicitly avoid

- advertising identifiers
- third-party analytics SDKs
- background location
- contact/device profiling
- continuous screen recording
- heatmaps
- unnecessary raw microphone retention
- unnecessary raw handwriting retention

## Session reflection

At most a very small optional post-session check, e.g.:

`How was this session?`
- too easy
- about right
- too much

Optional free text:
`Anything confusing or annoying?`

Do not interrupt every exercise for subjective ratings.

## Export

Development mode provides:

`Export research data`

Output:
- structured JSON
- human-readable session summary if useful
- no automatic upload

User explicitly chooses when to share it.

## Longitudinal analysis

Research value comes especially from separated retrieval:
- immediate
- next session/day
- later days/weeks

Analyze:
- retention
- scaffold dependence
- recurring error relations
- audio replay patterns
- writing friction
- session-length/fatigue patterns
- engine decisions vs later outcomes

## Privacy principle

**Local by default, explicit export by choice.**

Public product analytics, if ever considered, require a separate product/privacy decision and are not implied by this development log.
