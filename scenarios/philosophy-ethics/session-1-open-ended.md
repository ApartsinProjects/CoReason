# Session 1 — Hospital Triage Protocol During a Pandemic (Open-Ended)

**Challenge:** Applied Ethics > Bioethics > End-of-life Ethics
**Mode:** Open-Ended (Structured Sections)
**Student:** Priya M.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Design a triage protocol for a hospital that has run out of ICU ventilators during a pandemic surge. The hospital has "about 30 ventilators" and expects "many more patients than capacity" over the next two weeks. The chief medical officer wants criteria that are "fair and defensible" for deciding which patients get ventilators and when to re-evaluate ongoing patients. Some patients are healthcare workers. Some are children. Some have been on ventilators for weeks with "limited progress." The hospital board wants a written protocol document with decision criteria, an appeals process, and a public-facing justification statement.

### Student's Framing Response

> **Assumption: "Fair" here means procedurally fair — the protocol should apply consistently regardless of patients' social status, wealth, or personal connections.**
>
> **Assumption: The primary ethical framework is utilitarian — maximize the number of lives saved with the available ventilators.**
>
> **Question: "Limited progress" is vague — I'll assume this means patients who have shown no clinical improvement after 7 days on a ventilator.**
>
> **Constraint: The protocol must comply with existing anti-discrimination law, so criteria like age, race, or disability status cannot be used directly.**

### AI Solution (Generated from Student's Framing)

**PANDEMIC TRIAGE PROTOCOL — VENTILATOR ALLOCATION**

**1. Allocation Criteria (Scored System):**
Each patient receives a priority score (1-4, lower = higher priority):
- Clinical prognosis (SOFA score): likelihood of surviving to discharge
- Expected duration of ventilator need (shorter = higher priority)
- Life-years saved (younger patients score higher)

**2. Priority Categories:**
- Priority 1: High likelihood of survival, short expected ventilator duration
- Priority 2: Moderate likelihood, moderate duration
- Priority 3: Low likelihood or extended duration
- Priority 4: Very low likelihood of survival even with ventilator

**3. Tie-breaking Rules:**
1. Healthcare workers receive priority (to preserve workforce capacity)
2. First-come, first-served among equal scores

**4. Re-evaluation:**
Patients reassessed every 48 hours. If a patient has not improved after 7 days, their ventilator may be reallocated to a Priority 1 or 2 patient.

**5. Appeals:**
Patients or families may appeal to the hospital ethics committee, which will review within 4 hours.

**6. Public Justification:**
"This protocol maximizes the number of lives saved with limited resources. It applies equally to all patients based solely on clinical criteria."

### Framing Feedback

**Criticism:** The student correctly identified procedural fairness and legal constraints, and made a reasonable attempt to operationalize "limited progress." However, the student assumed without justification that utilitarianism is the correct framework — this is a major normative choice that should be flagged as a decision, not treated as a default. The student did not question whether "fair and defensible" might require deontological constraints (e.g., never withdrawing a ventilator from a conscious patient) or justice-based considerations (prioritizing the worst-off, not just maximizing aggregate lives). The student also did not note the tension between using "life-years saved" (which inherently favors younger patients) and the stated constraint against age discrimination.

**Better Alternative Framing:**
> "Question: 'Fair and defensible' could mean utilitarian (maximize lives saved), egalitarian (equal chance regardless of prognosis), or prioritarian (favor the worst-off). The protocol's structure depends on this choice — I'll flag it as a decision point requiring stakeholder input. Assumption: Anti-discrimination law applies, which creates tension with any criterion correlated with protected characteristics (age, disability). Question: Does 're-evaluate ongoing patients' mean the protocol must address ventilator withdrawal, not just initial allocation? This is ethically distinct and more controversial. Missing: No information about community values — has the hospital consulted patients, staff, or the public?"

**Grade: B** — Identified procedural fairness and legal constraints but made an unjustified framework choice and missed the allocation-vs-withdrawal distinction.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "Healthcare worker priority lacks justification"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "The steering was well-targeted: removing the life-years"
    description: "The steering was well-targeted: removing the life-years criterion and demanding a defended rationale with counter-arguments were both precise and productive. The instruction to 'explain why the justif"
  - name: "Expand: Provide an explicit ethical justification for"
    description: "Expand: Provide an explicit ethical justification for healthcare worker priority. Address the strongest objection to this priority — that it creates a class of"

#### Updated AI Output

**PANDEMIC TRIAGE PROTOCOL — VENTILATOR ALLOCATION (Revised)**

**1. Allocation Criteria (Scored System):**
Each patient receives a priority score based on:
- Short-term clinical prognosis (SOFA score): likelihood of surviving to hospital discharge with ventilator support
- Expected duration of ventilator need (shorter = higher priority, to maximize throughput)

Note: "Life-years saved" has been removed as a standalone criterion. While maximizing life-years is sometimes defended on utilitarian grounds, it functionally correlates with age and risks violating anti-discrimination principles. The protocol relies on short-term survival probability, which is clinically rather than demographically determined.

**2. Healthcare Worker Priority — Justification:**
Healthcare workers receive tie-breaking priority on *instrumental* grounds: during a pandemic, each healthcare worker who recovers can return to treating other patients, creating a multiplier effect on lives saved. This is not a claim that healthcare workers' lives have greater intrinsic value.

*Objection:* This creates a precedent for ranking people by social utility, which could extend to other "essential" workers and undermine equal moral worth.

*Response:* The priority is strictly limited to tie-breaking (not a higher score category), applies only during declared crisis conditions, and is justified by the direct causal link between the worker's recovery and additional patient care capacity — a link that does not extend to most other occupations in this context.

**3. Re-evaluation:** Every 48 hours. After 7 days without improvement, a clinical review panel (not the treating physician) assesses whether continued ventilator use meets the survival-to-discharge threshold.

**4. Appeals:** Ethics committee review within 4 hours. The committee includes a patient advocate and a community representative.

**5. Public Justification:**
"This protocol allocates ventilators based on clinical likelihood of survival to discharge. It does not use age, race, disability, or social status as criteria. Healthcare workers receive tie-breaking priority because their recovery directly enables additional patient care."

#### Judging Feedback

**Criticism:** The student correctly identified the life-years/age discrimination tension, which was the most ethically significant flaw in the initial output. Asking for an explicit justification (and counter-argument) for healthcare worker priority was also strong — it pushed the AI toward the kind of reasoned defense that ethical analysis requires. However, the student missed that the protocol still has no process for the most ethically fraught scenario: withdrawing a ventilator from a current patient to give it to a new arrival. The "7-day reassessment" is mentioned but the moral justification for withdrawal (as distinct from withholding) is absent. The student also did not flag that the public justification statement is purely consequentialist and does not acknowledge that reasonable people may disagree with the framework.

**Better Alternative Judgement:**
> "Error: Life-years criterion is a proxy for age discrimination. Gap: Healthcare worker priority lacks justification. Gap: The protocol avoids the withdrawal question — reassessment is mentioned but there is no moral argument for why it is permissible to remove a ventilator from a living patient. Gap: Public justification presents one ethical framework as self-evident."

**Grade: B** — Caught the headline issues but missed the withdrawal distinction and single-framework justification.

#### Steering Feedback

**Criticism:** The steering was well-targeted: removing the life-years criterion and demanding a defended rationale with counter-arguments were both precise and productive. The instruction to "explain why the justification survives the objection or should be modified" was particularly strong — it forced the AI to engage dialectically rather than just assert. However, the steering did not address the withdrawal problem or the public justification tone.

**Grade: A** — Effective and specific, with notable sophistication in requiring objection-response structure.

---

### Cycle 2

**Current AI Output:** *(revised version as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap: The protocol addresses initial allocation and"
    description: "Gap: The protocol addresses initial allocation and reassessment, but never explicitly justifies the moral permissibility of withdrawing a ventilator from a patient who is still alive. Withholding treatment from a new patient and withdrawing treatment from a current patient are ethically distinct, and the protocol treats them as the same. Gap: The public justification is written as though the utilitarian framework is the only defensible option. It should acknowledge that this is a contested ethical choice and explain why the hospital adopted it."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Add: Include a section explicitly addressing the ethics"
    description: "Add: Include a section explicitly addressing the ethics of ventilator withdrawal (not just withholding). Present the argument that withholding and withdrawing are morally equivalent (standard bioethics position) AND the counter-argument that they are not (patient trust, sanctity-of-life objection). State which position the protocol adopts and why."
  - name: "Revise: Rewrite the public justification to acknowledge"
    description: "Revise: Rewrite the public justification to acknowledge that the protocol involves genuine ethical trade-offs, that the utilitarian framework was chosen for stated reasons, and that the hospital recognizes other perspectives as reasonable."

#### Updated AI Output

**PANDEMIC TRIAGE PROTOCOL — VENTILATOR ALLOCATION (Final Revision)**

*(Sections 1-4 as above, plus:)*

**5. Ethics of Ventilator Withdrawal:**

This protocol treats withholding a ventilator from a new patient and withdrawing a ventilator from a current patient as morally equivalent, following the consensus position in bioethics (endorsed by the BMA, AMA, and WHO pandemic guidance). The reasoning: the morally relevant factor is the clinical assessment at the time of decision, not the historical fact of whether the patient is already receiving treatment.

*Counter-argument:* Withdrawing a ventilator from a conscious patient may violate the duty of non-abandonment, undermine patient trust in the healthcare system, and create moral distress for clinical staff. From a sanctity-of-life perspective, actively removing life support is categorically different from never providing it.

*Protocol position:* We adopt the equivalence position because the alternative — never withdrawing — would mean that the first patients to arrive permanently occupy ventilators regardless of prognosis, preventing patients with better survival prospects from receiving treatment. This produces worse aggregate outcomes and is itself unfair to later-arriving patients. However, we acknowledge the moral seriousness of withdrawal and require: (a) the decision is made by a review panel, not the treating physician; (b) the patient or family is informed and given the appeals process; (c) palliative care is provided immediately upon withdrawal.

**6. Public Justification (Revised):**
"This protocol allocates ventilators to maximize the number of patients who survive to hospital discharge. We recognize this reflects a utilitarian ethical framework — one that prioritizes aggregate outcomes — and that other frameworks (equal lottery, prioritizing the sickest, first-come-first-served) are held by thoughtful people for defensible reasons. We adopted this approach because, in conditions of extreme scarcity, we believe saving the greatest number of lives is the most defensible use of public healthcare resources. We welcome public scrutiny and have established an appeals process and community review board to ensure accountability."

#### Judging Feedback

**Criticism:** The student identified the two most significant remaining gaps: the withdrawal/withholding distinction and the single-framework public justification. Both corrections were philosophically precise and led to substantially improved output. The student could have also noted that the protocol still lacks guidance for a specific hard case: what happens when two patients have identical clinical scores and neither is a healthcare worker? The tie-breaking defaults to first-come-first-served, which may not be defensible (it advantages patients with better access to healthcare).

**Better Alternative Judgement:**
> "Gap: No moral justification for withdrawal vs withholding. Gap: Public justification is mono-framework. Gap: First-come-first-served as final tie-breaker may be unfair to patients with less healthcare access — a lottery might be more equitable."

**Grade: A** — Strong philosophical identification of the two key remaining issues. Minor gap on tie-breaking.

#### Steering Feedback

**Criticism:** The steering was excellent. Requiring both the bioethics consensus position AND the counter-argument created a dialectical structure that demonstrates genuine ethical reasoning. The public justification revision request was well-specified — acknowledging trade-offs and alternative frameworks is precisely what ethical transparency requires. This was the strongest steering in the session.

**Grade: A** — Sophisticated, precise, and philosophically grounded corrections.

---

### Cycle 3 (Final)

**Current AI Output:** *(final revision as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Minor: The final tie-breaker (first-come-first-served)"
    description: "Minor: The final tie-breaker (first-come-first-served) may disadvantage patients with less access to the healthcare system, but this is a reasonable pragmatic choice under crisis conditions. The protocol is otherwise well-structured."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done**

---

## COMPLETION

### Final Grades

| Skill    | Grade |
|----------|-------|
| Framing  | B     |
| Judging  | A     |
| Steering | A     |

### Summary Feedback

The student showed improvement across the session. The framing was the weakest phase: adopting utilitarianism as an unquestioned default and missing the allocation-vs-withdrawal distinction are significant oversights for an ethics analysis. However, the student's judging improved substantially — from catching the life-years/age tension in Cycle 1 to identifying the philosophically sophisticated withdrawal/withholding distinction in Cycle 2. Steering was consistently strong and became excellent by Cycle 2, where the instruction to present both the consensus position and counter-argument demonstrated mature ethical reasoning. To improve framing, the student should practice asking: "Which ethical framework am I assuming, and what would change if I assumed a different one?" before accepting any problem as well-defined.
