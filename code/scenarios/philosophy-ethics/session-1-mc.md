# Session 1 — Hospital Triage Protocol During a Pandemic (Multiple Choice)

**Challenge:** Applied Ethics > Bioethics > End-of-life Ethics
**Mode:** Multiple Choice
**Student:** Priya M.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Design a triage protocol for a hospital that has run out of ICU ventilators during a pandemic surge. The hospital has "about 30 ventilators" and expects "many more patients than capacity" over the next two weeks. The chief medical officer wants criteria that are "fair and defensible" for deciding which patients get ventilators and when to re-evaluate ongoing patients. Some patients are healthcare workers. Some are children. Some have been on ventilators for weeks with "limited progress." The hospital board wants a written protocol document with decision criteria, an appeals process, and a public-facing justification statement.

### Framing Options Presented

Which assumptions and clarifications should you establish before the AI generates a solution?

- **(A)** Assume "fair" means first-come-first-served, since that avoids making judgments about the value of different lives. No further clarification needed — the problem is straightforward.
- **(B)** Assume utilitarian framework (maximize lives saved), define "limited progress" as no improvement after 7 days, note that anti-discrimination law constrains criteria. Accept that the protocol covers both initial allocation and re-evaluation.
- **(C)** Question what "fair and defensible" means — it could imply utilitarian, egalitarian, or prioritarian frameworks, and the choice must be flagged as a decision point. Ask whether the protocol must address ventilator withdrawal (not just withholding), which is ethically distinct. Note that criteria correlated with protected characteristics (age, disability) raise legal and moral problems. Identify missing information: community values, legal precedent, clinical prognostic data.
- **(D)** Assume the problem is about cost minimization — allocate ventilators to patients who require the shortest treatment duration to free resources quickly.
- **(E)** Assume a deontological framework — every patient has an equal right to treatment, so allocate by random lottery. No clinical criteria should be used.

**Student selects: (B)**

### AI Solution (Generated from Student's Framing)

**PANDEMIC TRIAGE PROTOCOL**

**Allocation Criteria (Scored):** Priority score based on SOFA score (survival probability), expected ventilator duration, and life-years saved (younger = higher priority).

**Healthcare Worker Priority:** Tie-breaking advantage for healthcare workers.

**Re-evaluation:** Every 48 hours. After 7 days without improvement, ventilator may be reallocated.

**Appeals:** Ethics committee review within 4 hours.

**Public Justification:** "This protocol maximizes lives saved and applies equally based on clinical criteria."

### Framing Feedback

**Criticism:** Option (B) is reasonable but incomplete. It correctly sets a framework and operationalizes "limited progress," but it assumes utilitarianism without flagging this as a contested choice. Option (C) was stronger because it treats the framework selection as a decision point, distinguishes withdrawal from withholding, flags the age/disability correlation problem, and identifies missing community input. These are not peripheral concerns — they are central to whether the protocol is genuinely "defensible."

**Better Alternative:** Option **(C)** — treats the ethical framework as a choice to be justified rather than a default, and surfaces the withdrawal distinction.

**Grade: B** — Reasonable but accepted a major normative assumption uncritically.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's current solution?

- **(A)** The protocol is well-reasoned and comprehensive — no significant issues
- **(B)** "Life-years saved" is an age proxy that contradicts anti-discrimination principles; healthcare worker priority lacks justification
- **(C)** The protocol should use a random lottery instead of clinical criteria
- **(D)** "Life-years saved" is an age proxy; healthcare worker priority lacks justification; no ethical argument for ventilator withdrawal vs withholding; public justification presents one framework as self-evident without acknowledging alternatives
- **(E)** The SOFA score is unreliable, so the entire scoring approach is flawed

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Make the protocol shorter and simpler"
- **(B)** "Remove life-years saved as a criterion since it functions as age discrimination. Provide an explicit ethical justification for healthcare worker priority, including the strongest objection to it and a response."
- **(C)** "Replace all clinical criteria with a random lottery"
- **(D)** "Add more medical details to the scoring system"
- **(E)** "Remove the appeals process — it will slow down urgent decisions"

**Student selects: (B)**

#### Updated AI Output

*(Protocol revised: life-years criterion removed, healthcare worker priority justified on instrumental grounds with objection/response, scoring based on short-term survival probability and expected ventilator duration only.)*

**Healthcare Worker Priority Justification:** Instrumental value — recovered healthcare workers treat additional patients, creating a multiplier effect. This is not a claim of greater intrinsic worth. *Objection:* Creates a precedent for ranking by social utility. *Response:* Limited to tie-breaking, crisis conditions only, justified by direct causal link to patient care capacity.

#### Judging Feedback

**Criticism:** The student correctly caught the two most visible issues: the age-proxy criterion and unjustified healthcare worker priority. However, option (D) was more thorough — it also identified the missing withdrawal/withholding distinction and the single-framework public justification. These are philosophically significant gaps that affect the protocol's defensibility.

**Better Alternative:** Option **(D)** — captures all four issues, not just the two most obvious ones.

**Grade: B** — Caught the headline problems but missed the deeper structural issues.

#### Steering Feedback

**Criticism:** Option (B) was the best available steering choice and closely matched the issues the student identified. The instruction to include "the strongest objection and a response" was particularly strong — it models dialectical ethical reasoning. The student made the right call.

**Grade: A** — Precise, well-targeted, and philosophically sophisticated.

---

### Cycle 2

**Current AI Output:** *(revised protocol with life-years removed and healthcare worker priority justified)*

#### Judging Sub-step

Which issues remain in the AI's updated solution?

- **(A)** The protocol is now complete and defensible
- **(B)** The protocol does not address the ethics of withdrawing a ventilator from a current patient; the public justification treats utilitarianism as the only option
- **(C)** The protocol needs to include cost data for each ventilator
- **(D)** The protocol still does not justify ventilator withdrawal; the public justification is mono-framework; first-come-first-served as final tie-breaker may disadvantage patients with less healthcare access
- **(E)** The appeals process is too slow — 4 hours is too long in a crisis

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Add a section on the ethics of ventilator withdrawal, presenting both the bioethics consensus (withdrawal and withholding are morally equivalent) and the counter-argument. Revise the public justification to acknowledge the protocol reflects a contested ethical framework and that alternatives are reasonable."
- **(B)** "Make the protocol apply to all medical equipment, not just ventilators"
- **(C)** "Add religious perspectives to the appeals process"
- **(D)** "Remove the re-evaluation clause — once a patient has a ventilator, they should keep it"
- **(E)** "Shorten the public justification to one sentence"

**Student selects: (A)**

#### Updated AI Output

*(Protocol expanded with withdrawal ethics section: presents equivalence thesis and counter-argument, adopts equivalence with safeguards including panel decision-making, family notification, and immediate palliative care. Public justification revised to acknowledge utilitarian framing, recognize alternative frameworks as reasonable, invite public scrutiny.)*

#### Judging Feedback

**Criticism:** The student correctly identified the two most important remaining gaps. The withdrawal/withholding distinction is the central ethical controversy in ventilator reallocation, and the mono-framework public justification undermined the protocol's claim to be "defensible." Option (D) was marginally stronger — it also caught the tie-breaker access problem — but the student identified the two issues with the greatest philosophical weight.

**Better Alternative:** Option **(D)** — adds the tie-breaker equity concern.

**Grade: A** — Strong identification of the key remaining issues.

#### Steering Feedback

**Criticism:** Option (A) was excellent — it specified exactly what to add (withdrawal ethics with both sides of the debate) and exactly how to revise the justification (acknowledge contested framework, name alternatives). This was the best available option and produced a substantially improved output.

**Grade: A** — Comprehensive and philosophically precise.

---

### Cycle 3 (Final)

**Current AI Output:** *(final protocol with withdrawal ethics and revised justification)*

#### Judging Sub-step

Which issues remain?

- **(A)** The tie-breaker (first-come-first-served) may disadvantage patients with less healthcare access, but this is a minor issue given the protocol's overall quality
- **(B)** The entire protocol should be scrapped — no triage system is ethically defensible
- **(C)** The protocol is sufficiently complete for the scope of this problem
- **(D)** The withdrawal section needs more religious perspectives
- **(E)** The SOFA scoring system needs to be validated with clinical data before deployment

**Student selects: (C)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done**

---

## COMPLETION

### Final Grades

| Skill    | Grade |
|----------|-------|
| Framing  | B     |
| Judging  | B     |
| Steering | A     |

### Summary Feedback

The student demonstrated a recurring pattern of catching the most visible ethical issues while missing deeper structural ones. In framing, accepting utilitarianism as a default rather than a contested choice is a fundamental error in ethical analysis — frameworks must be justified, not assumed. In judging, the student consistently identified two of the four major issues but missed the withdrawal/withholding distinction until later and never caught the tie-breaker equity concern. Steering was the strongest skill: every correction was precise, productive, and showed genuine philosophical sensitivity, particularly the recurring instruction to present objections and responses. To improve, the student should practice systematically asking: "What ethical framework am I assuming? What would the analysis look like under a different framework? Which distinctions does the problem treat as equivalent that might not be?"
