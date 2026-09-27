# Learning Engine Decision Model v0.1

**Status:** IMPLEMENTATION MODEL  
**Purpose:** Compress the pedagogical specs into a small programmable loop.

## The engine asks only five questions

### 1. What does the next curriculum step require?
Identify the prerequisite learning relations, not an entire prerequisite lesson.

Examples:
- understand a phrase;
- retrieve a construction;
- discriminate a sound;
- recognize a grapheme.

If a required prerequisite is unavailable:
→ reactivate it with appropriate scaffold.

If not:
→ continue.

---

### 2. What is currently due or fragile?
Look for target relations that:
- are due/overdue;
- failed recently;
- were only successful with strong help;
- are needed soon by the curriculum.

Select a **small number** with highest relevance.

Do not review everything that is imperfect.

---

### 3. Can useful new material be added now?
Check:
- prerequisite availability;
- current novelty/load;
- recent failure pattern;
- amount of genuinely new material already introduced.

If yes:
→ introduce the next controlled curriculum target.

If no:
→ consolidate/transfer rather than adding novelty.

Weakness in an unrelated skill does not block new material.

---

### 4. What learning operation gives the best evidence now?
Choose based on current state:

**NEW**
→ clear encounter + scaffold.

**FRAGILE**
→ supported retrieval / focused discrimination.

**DEVELOPING**
→ independent recall with less help.

**STABLE**
→ delayed recall + controlled variation / transfer.

**DURABLE**
→ natural reappearance in communication; isolated drill only when due/error occurs.

For writing:
guided → reduced scaffold → free recall → delayed recall.

For pronunciation:
perception → contrast → short production → connected use.

---

### 5. Is continuing still useful?
Estimate:
- unresolved prerequisite difficulty;
- amount of new material;
- repeated errors/fatigue;
- whether a meaningful closure has been reached;
- next useful spacing opportunity.

If marginal value is low:
→ close session and recommend next return.

If useful learning remains:
→ continue loop.

---

# Candidate priority

When several exercises are possible, prefer approximately:

1. prerequisite needed immediately;
2. high-value due/fragile relation;
3. current curriculum target;
4. transfer of recently developing material;
5. optional discovery/enrichment.

This is a priority heuristic, not a fixed queue.

---

# Exercise selection rules

After choosing the target relation:

1. choose the least scaffold that is likely to succeed productively;
2. avoid answer-bearing help during recall;
3. avoid identical immediate retry after ordinary memory error;
4. vary only when variation serves transfer;
5. switch modality only for a learning reason;
6. culminate component work in meaningful language use when possible.

---

# Feedback loop

Attempt produces evidence:

`target relation + task + help level + result + timing + error type`

Then:

- update stability conservatively;
- record specific weak relation;
- schedule later retrieval;
- do not globally downgrade the item;
- do not punish UI/task misunderstanding as language failure.

---

# Minimal pseudocode

```text
while session_is_useful:

    prerequisites = prerequisites_for(next_curriculum_target)

    if required_prerequisite_unavailable:
        target = most_relevant_prerequisite
    elif high_value_due_relation_exists:
        target = high_value_due_relation
    elif novelty_budget_allows_new_material:
        target = next_curriculum_target
    else:
        target = best_transfer_or_consolidation_target

    operation = choose_operation(target.stability, target.skill)
    scaffold = choose_minimum_useful_scaffold(target)
    prompt = choose_controlled_example(target, learner_known_inventory)

    result = run(prompt, operation, scaffold)

    record_evidence(result)
    update_target_state_conservatively()

    if error:
        give_minimal_corrective_feedback()
        schedule_spaced_retry()

    if meaningful_closure_reached and marginal_value_low:
        break

close_session()
recommend_next_useful_return()
```

---

# What is deliberately NOT inside this loop

- XP/rewards/streaks;
- “complete every exercise type” rules;
- one global mastery score;
- fixed number of screens;
- fixed 20/80 review-new ratio;
- AI-generated curriculum;
- mandatory writing for every word;
- automatic blocking of the whole course after one weak skill;
- mathematically “optimal” thresholds claimed without data.

---

# Evidence status

## EVIDENCE
Underlying principles include:
- distributed practice;
- retrieval with feedback;
- adaptive scaffolding;
- importance of prior knowledge/cognitive load;
- value of transfer/varied retrieval after sufficient acquisition.

## DERIVED
- prerequisite-specific gating rather than lesson-level gating;
- skill-relation-specific remediation;
- dense early scaffolding → increasing interleaving;
- priority ordering above;
- stop when marginal learning value is low.

## HYPOTHESIS
To calibrate in prototype:
- exact stability transitions;
- exact due intervals;
- novelty-budget thresholds;
- how many errors trigger a focused micro-block;
- session stopping thresholds;
- precise exercise ordering.

---

# V0.1 success test

The decision model is good enough if it can run Lesson 1 without:
- obvious repetition;
- overload;
- arbitrary modality switching;
- false mastery from recognition;
- blocking progress unnecessarily;
- requiring the learner to manage their own study plan.

If that works, keep the model small. Do not add sophistication merely because it is possible.
