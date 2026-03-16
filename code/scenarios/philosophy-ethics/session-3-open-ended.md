# Session 3 — Corporate Whistleblower Dilemma (Open-Ended)

**Challenge:** Applied Ethics > Professional Ethics > Engineering Ethics
**Mode:** Open-Ended (Structured Sections)
**Student:** Sofia L.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> A mid-level engineer at an automotive company discovers that the emissions control software has a "defeat device" that produces lower emissions readings during regulatory testing than in real-world driving. The company's vehicles are "significantly" exceeding legal pollution limits on the road. The engineer's manager says the issue is "being handled internally" and warns against "creating problems." The engineer has a family, a mortgage, and signed a non-disclosure agreement. Prepare a structured ethical analysis document (3-4 pages) that lays out the engineer's options, evaluates each against multiple ethical frameworks, recommends a course of action, and includes a section on what institutional safeguards should exist to prevent this situation.

### Student's Framing Response

> **Assumption: The defeat device is intentional — this is deliberate fraud, not an accidental software bug. The "being handled internally" claim is likely a stalling tactic or cover-up.**
>
> **Assumption: The engineer has direct evidence (access to the code or test data) confirming the discrepancy, not just a rumor.**
>
> **Question: "Significantly" exceeding limits — I'll assume this means the pollution levels are high enough to cause measurable health harm in affected communities, not just a marginal technical violation.**
>
> **Constraint: The NDA is a legal constraint but may not be enforceable if it covers illegal activity. I'll flag this as needing legal advice.**
>
> **Assumption: The relevant ethical frameworks are utilitarianism, Kantian ethics, and virtue ethics.**

### AI Solution (Generated from Student's Framing)

**ETHICAL ANALYSIS: WHISTLEBLOWER DECISION IN AUTOMOTIVE EMISSIONS FRAUD**

**1. The Engineer's Options:**
- **Option A — Remain silent:** Continue working, trust management's claim that it is being handled.
- **Option B — Escalate internally:** Go above the direct manager to senior leadership, the compliance department, or the board.
- **Option C — Report externally:** Contact the relevant regulatory agency (e.g., EPA, environmental authority).
- **Option D — Go public:** Leak information to media or advocacy organizations.

**2. Ethical Framework Analysis:**

| Framework | Option A (Silence) | Option B (Internal) | Option C (Regulator) | Option D (Public) |
|-----------|-------------------|--------------------|--------------------|-------------------|
| Utilitarian | Bad — ongoing pollution harms thousands | Uncertain — may work but may be suppressed | Good — stops harm most reliably | Mixed — stops harm but may cause disproportionate collateral damage |
| Kantian | Wrong — silence is complicity in deception | Permissible — fulfills duty while respecting organizational process | Duty — obligation to truthfulness overrides institutional loyalty | Permissible if proportionate — duty to truth, but method matters |
| Virtue | Cowardice — prioritizes self-interest | Prudence — attempts resolution within constraints | Courage — acts on conviction at personal cost | Depends — courage or recklessness depending on context |

**3. Recommendation:**
Option B first (internal escalation with a documented deadline), followed by Option C (regulatory reporting) if internal escalation fails within 30 days. Option D (public disclosure) only as a last resort if regulatory channels prove ineffective.

**4. Institutional Safeguards:**
- Anonymous internal reporting hotlines
- Legal protections for internal whistleblowers
- Independent compliance officers reporting to the board, not management
- Regular third-party emissions audits

### Framing Feedback

**Criticism:** The student made several strong moves: correctly assuming intentionality (the problem strongly implies fraud), requiring direct evidence, and flagging the NDA enforceability question. However, the student's framing has two significant gaps. First, the student assumed the relevant ethical question is "What should the engineer do?" but did not frame the parallel question: "What are the ethical obligations of the institution, and how does institutional responsibility interact with individual responsibility?" The problem asks for institutional safeguards — this requires thinking about where moral responsibility is distributed across an organization, not just what one person should do. Second, the student listed three ethical frameworks without questioning whether they are the right ones for this problem. Professional ethics and role morality are directly relevant — the engineer has obligations that arise specifically from being an engineer — and these are not reducible to the three standard normative theories.

**Better Alternative Framing:**
> "Assumption: Intentional fraud, direct evidence available. Question: The problem requires both individual and institutional analysis — I need to distinguish between the engineer's moral obligations as an individual and the structural conditions that created the dilemma. Missing: What whistleblower legal protections exist in this jurisdiction? This determines the risk profile of external reporting. Question: Beyond the three standard frameworks, professional engineering codes of ethics may impose specific obligations (e.g., NSPE Code: 'hold paramount the safety, health, and welfare of the public'). The NDA may conflict with these professional duties."

**Grade: B** — Good factual assumptions, but missed the individual-vs-institutional responsibility distinction and the relevance of professional role morality.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "Safeguards are generic, not connected to this case's failure modes"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Deepen: Replace the framework table with developed"
    description: "Deepen: Replace the framework table with developed arguments for each framework on the key question — is external reporting morally obligatory or merely permissible? For Kant, apply both the universalizability test (could we will that all engineers in this situation remain silent?) and the humanity formula (does silence treat pollution victims as mere means?)."
  - name: "Revise: The institutional safeguards section should"
    description: "Revise: The institutional safeguards section should diagnose the specific organizational failure that enabled the fraud (culture of silence, diffused responsibility, managerial pressure) and propose safeguards that address those root causes, not just generic compliance mechanisms."

#### Updated AI Output

**ETHICAL ANALYSIS (Revised)**

**2. Ethical Framework Analysis — Is External Reporting Obligatory?**

**Kantian Analysis:**
- *Universalizability:* Could we coherently will that all engineers who discover safety-relevant fraud remain silent and defer to management? No — if universalized, this maxim would make internal fraud undetectable, undermining the very institution of regulatory compliance that the company relies on for its license to operate. The maxim is self-defeating.
- *Humanity formula:* Remaining silent treats the communities exposed to illegal pollution levels as mere means to the company's profit and the engineer's job security. Their health is instrumentalized without their knowledge or consent. External reporting restores their status as persons whose interests count.
- *Conclusion:* External reporting is morally obligatory under Kantian ethics if internal channels fail, because silence violates both the universalizability test and the duty to treat affected persons as ends.

**Consequentialist Analysis:**
The consequentialist case for external reporting depends on the scale of harm. If vehicles are "significantly" exceeding limits across a large fleet, the aggregate health damage (respiratory illness, premature deaths) likely outweighs the personal costs to the engineer and economic costs to the company. However, consequentialism also demands considering second-order effects: will external reporting deter future fraud (positive) or deter future engineers from entering the field (likely negligible)?

**Virtue Ethics Analysis:**
The virtue of courage requires acting rightly despite personal risk. But virtue ethics also values practical wisdom (phronesis) — the ability to judge the right action in context. A virtue ethicist would distinguish between reckless disclosure (going public without evidence or preparation) and courageous disclosure (reporting to a regulator after documenting evidence and exhausting internal channels). The virtuous engineer acts with both courage and prudence.

**4. Institutional Failure Diagnosis & Safeguards:**

**Root cause analysis:**
The defeat device was not the work of one rogue engineer — it required design, implementation, testing, and deployment, meaning multiple people at multiple levels knew or should have known. This indicates:
- **Diffused responsibility:** Each participant could tell themselves someone else was responsible for the ethical decision.
- **Normalization of deviance:** Incremental compromises became routine, making the defeat device seem like "how things are done."
- **Managerial pressure without accountability:** Managers set emissions targets without asking how they were met, creating plausible deniability.

**Targeted safeguards:**
- **Mandatory individual sign-off:** Each engineer involved in emissions compliance must personally certify that their component meets regulatory standards, making responsibility non-diffusible.
- **Separation of testing authority:** Emissions testing should be conducted by an independent internal team that does not report to the product development chain.
- **Ethical culture audits:** Regular anonymous surveys assessing whether employees feel pressure to cut corners, with results reported to the board.
- **Protected escalation channels:** An ombudsperson with legal protection and direct board access, not just a hotline.

#### Judging Feedback

**Criticism:** The student's two observations were both well-targeted. The demand for deeper framework application was exactly right — the original table was superficial, and the revised output demonstrates how framework application should work. The institutional safeguards critique was also strong: connecting safeguards to specific organizational failure modes is far more valuable than a generic compliance checklist. However, the student missed one important issue: the AI's recommendation (internal first, then external) assumes that internal escalation is safe and in good faith, but the manager's warning to not "create problems" is itself a red flag suggesting the internal channel may be compromised. The analysis should address when internal escalation is futile or dangerous.

**Better Alternative Judgement:**
> "Gap: Framework analysis is superficial — needs developed Kantian and consequentialist arguments. Gap: Safeguards are generic, not connected to this case's failure modes. Gap: The recommendation assumes internal escalation is viable, but the manager's warning suggests internal channels may be compromised."

**Grade: A** — Strong on the two issues identified, missed the compromised-channel concern.

#### Steering Feedback

**Criticism:** The steering was precise and philosophically productive. Asking for specific Kantian tests (universalizability and humanity formula) rather than a vague "deepen the analysis" showed real philosophical literacy. The institutional safeguards instruction — requiring root cause diagnosis before proposing solutions — was structurally excellent. The steering could have also addressed the safety of internal escalation.

**Grade: A** — Philosophically specific and structurally sound.

---

### Cycle 2

**Current AI Output:** *(revised version with developed arguments and root cause analysis)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "NDA moral weight is unexamined"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Add: Address when internal escalation should be skipped"
    description: "Add: Address when internal escalation should be skipped — identify specific indicators that internal channels are compromised (e.g., retaliation threats, prior whistleblower treatment, management involvement in the fraud). Apply this to the manager's warning in the problem."
  - name: "Add: Analyze the moral weight of the NDA separately from"
    description: "Add: Analyze the moral weight of the NDA separately from its legal enforceability. Under what ethical conditions is breaking a promise (the NDA) justified? Apply the Kantian distinction between perfect and imperfect duties, and the consequentialist analysis of promise-breaking."

#### Updated AI Output

**ETHICAL ANALYSIS (Final Revision)**

*(Previous sections retained, plus:)*

**3a. When Internal Escalation Should Be Bypassed:**

Internal escalation assumes that the organization has functioning mechanisms for self-correction. This assumption fails when:
- **Management is complicit:** The manager's warning to not "create problems" suggests awareness of the fraud and active discouragement of reporting. If the direct manager knew, higher management likely did too.
- **Prior retaliation:** If the company has a history of punishing internal dissenters, internal escalation exposes the engineer without protecting the public.
- **Time-sensitivity:** If the ongoing harm is severe and immediate, a 30-day internal window may allow significant additional pollution and health damage.

*Applied to this case:* The manager's warning is a strong indicator that internal channels are compromised. The "being handled internally" claim, without evidence of corrective action, is a standard organizational deflection. The revised recommendation: the engineer should document evidence, secure legal counsel, and report to the regulatory authority directly. Internal escalation above the manager is permissible as a parallel step but should not be treated as a prerequisite.

**3b. The Moral Weight of the NDA:**

The NDA is a promise — and promises carry moral weight. Kant's analysis of promises distinguishes between perfect duties (which admit no exceptions) and the duty of fidelity. However, a promise extracted under conditions where the promisor could not have known the full moral implications (signing an NDA without knowing the company was committing fraud) may not bind in the way an informed, voluntary promise does.

*Consequentialist analysis:* The social practice of promise-keeping depends on promises being made in good faith. An NDA that covers illegal activity is itself a breach of good faith by the employer — the company used the NDA to create complicity, not to protect legitimate trade secrets. Breaking such a promise does not undermine the general practice of promise-keeping because the promise was made under deceptive conditions.

*Conclusion:* The NDA does not create a moral obligation to remain silent about illegal activity. However, the engineer should disclose only information necessary to establish the fraud, not unrelated proprietary information protected by the NDA for legitimate purposes.

#### Judging Feedback

**Criticism:** The student identified two genuinely important gaps. The compromised-channel analysis addresses the most dangerous practical assumption in the original recommendation, and the NDA moral analysis engages with a question most students would treat as purely legal. The student's identification of both issues showed philosophical maturity. One remaining gap: the analysis still focuses entirely on the individual engineer's choice and does not address the moral responsibility of the other engineers and managers who knew about the defeat device and remained silent. The problem implies a collective action dimension that the analysis has not engaged with.

**Better Alternative Judgement:**
> "Gap: Internal escalation may be compromised — the manager's warning is evidence. Gap: NDA moral weight is unexamined. Gap: The analysis treats this as one engineer's dilemma, but the defeat device required collective participation — what are the moral obligations of the other engineers and managers who knew?"

**Grade: A** — Excellent issue identification with one remaining structural gap.

#### Steering Feedback

**Criticism:** The steering was highly effective. The instruction to identify specific indicators for bypassing internal channels was practical and well-calibrated. The NDA analysis instruction — requiring both Kantian and consequentialist treatment, and distinguishing legal from moral enforceability — was philosophically sophisticated and produced a genuinely insightful output. This was the strongest steering in the session.

**Grade: A** — Philosophically rigorous and practically relevant.

---

### Cycle 3 (Final)

**Current AI Output:** *(final version with channel-bypass criteria and NDA analysis)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Minor gap: The analysis focuses on the individual"
    description: "Minor gap: The analysis focuses on the individual engineer's moral choice but does not examine collective moral responsibility — the defeat device required many people to participate or stay silent. However, the document is strong within its stated scope."

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

The student demonstrated strong and improving performance. The framing correctly identified key factual assumptions (intentionality, direct evidence) and the NDA question, but missed the individual-vs-institutional responsibility distinction and the relevance of professional role morality — both central to engineering ethics. Judging was consistently good: the student identified the superficiality of the framework table, the generic safeguards, the compromised internal channels, and the NDA moral weight across successive cycles. The collective responsibility dimension was noted only at the end. Steering was excellent throughout — philosophically specific instructions (naming particular Kantian tests, requiring root cause diagnosis) that produced substantial improvements. To strengthen framing, the student should practice distinguishing between "What should this person do?" and "What institutional structures created the conditions for this dilemma?"
