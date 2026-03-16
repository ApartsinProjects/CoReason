# Session 3 — Equal Protection Challenge to Algorithmic Sentencing (Multiple Choice)

**Challenge:** Individual Rights & Liberties > Equal Protection > Suspect Classifications
**Mode:** Multiple Choice
**Student:** Elena T.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Draft a plaintiff's complaint and supporting legal memorandum challenging a state's use of an algorithmic risk assessment tool in criminal sentencing. The tool, "RecidiScore," produces a numerical risk score used by judges at sentencing. A civil rights organization has gathered data showing that Black defendants receive scores "about 40% higher" than white defendants with "comparable criminal histories." The state says the algorithm is "race-blind" because it does not use race as an input variable. The tool considers "over 100 factors" including zip code, employment history, and education level. Produce the complaint's factual allegations, the equal protection legal theory, and a proposed discovery plan. The organization wants to "make new law" if possible.

### Framing Options Presented

Which assumptions and constraints should you establish before the AI generates the complaint?

- **(A)** Assume the algorithm is unconstitutional because it produces racially disparate outcomes. Disparate impact alone violates the Equal Protection Clause. No need to address discriminatory intent.
- **(B)** Identify Washington v. Davis as the key hurdle — disparate impact alone is insufficient; discriminatory intent must be shown. Frame the proxy variable theory (zip code, employment) as evidence of intent. Flag the need for rigorous statistical methodology.
- **(C)** Identify Washington v. Davis intent requirement. Develop the proxy variable theory under Arlington Heights multi-factor framework. Question whether there is a due process dimension (opaque algorithm, no adversarial testing). Consider Title VI as alternative statutory theory avoiding the intent requirement. Question state action if algorithm was privately developed. Flag statistical methodology needs.
- **(D)** Focus entirely on the Eighth Amendment — algorithmic sentencing constitutes cruel and unusual punishment. Equal protection is the wrong framework.
- **(E)** Assume the state will win because the algorithm is facially race-neutral. The equal protection challenge is too novel to succeed.

**Student selects: (B)**

### AI Solution (Generated from Student's Framing)

**COMPLAINT FOR DECLARATORY AND INJUNCTIVE RELIEF**

**I. Factual Allegations**
RecidiScore adopted in 2021 for felony sentencing. Produces scores 1-10 based on 100+ variables including zip code, employment, education. Black defendants average 6.8 vs white defendants 4.9 (40% higher) when controlling for criminal history.

**II. Legal Theory**
*A. Discriminatory Intent Through Proxy Variables:* Under Washington v. Davis and Feeney, the state's knowing use of race-correlated proxies constitutes discriminatory intent. Strict scrutiny applies because race is a suspect classification.

**III. Discovery Plan**
Source code, training data, internal validation studies, communications about disparities, alternative algorithms considered.

### Framing Feedback

**Criticism:** Option (B) correctly identified Washington v. Davis as the central doctrinal challenge and the proxy variable theory as the path to showing intent. However, option (C) was more comprehensive in several important respects: it identified the Arlington Heights multi-factor framework for structuring the intent argument, flagged the procedural due process dimension (defendants cannot examine a proprietary algorithm used against them), considered Title VI as an alternative statutory theory that avoids the intent requirement entirely, and raised the state action question for a privately developed algorithm. These additional theories and questions significantly strengthen the complaint.

**Better Alternative:** Option **(C)** — covers the intent framework plus due process, Title VI, state action, and methodological concerns.

**Grade: B** — Correct on the core doctrinal challenge but missed multiple theories and dimensions.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's complaint?

- **(A)** The complaint cites too few cases — it needs more precedent
- **(B)** The strict scrutiny assertion is conclusory — the complaint does not show how proxy variables establish discriminatory intent under Arlington Heights; the discovery plan is generic
- **(C)** The strict scrutiny assertion is conclusory without the Arlington Heights framework; no procedural due process claim for opaque algorithm under Mathews v. Eldridge; no Title VI alternative theory; the AI fabricated controlled statistical results not in the problem; discovery plan does not target training data demographics or pre-adoption fairness testing
- **(D)** The complaint should focus on the Thirteenth Amendment instead
- **(E)** The complaint is well-structured and legally sound — no significant issues

**Student selects: (C)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Add more case citations to make the brief look more authoritative"
- **(B)** "Restructure the intent argument using the Arlington Heights five-factor test: (1) statistical evidence, (2) historical background, (3) sequence of events, (4) procedural departures, (5) legislative/administrative history. Add a procedural due process claim under Mathews v. Eldridge (liberty interest in avoiding incarceration, risk of error from opaque algorithm, government interest does not justify opacity). Add Title VI as alternative theory via § 1983. Expand discovery to target training data demographics and pre-adoption fairness testing."
- **(C)** "The complaint is fine — just clean up the formatting"
- **(D)** "Rewrite the entire complaint as a habeas corpus petition"
- **(E)** "Remove the equal protection theory and focus on statutory claims only"

**Student selects: (B)**

#### Updated AI Output

**II. Legal Theory (Revised)**

*A. Arlington Heights Framework for Discriminatory Intent:*
Five factors: (1) 40% statistical disparity constituting stark pattern; (2) historical criminal justice racial disparities; (3) adoption without racial impact assessment; (4) upon information and belief, bypassed standard equity assessment; (5) internal communications to be obtained in discovery.

*B. Strict Scrutiny:* If intent established, race is suspect classification, compelling interest and narrow tailoring required.

*C. Procedural Due Process (Mathews v. Eldridge):* Liberty interest (incarceration length), high risk of error (proprietary opaque algorithm), government interest does not outweigh right to examine sentencing evidence.

*D. Title VI:* State receives federal corrections funding. Disparate impact claim enforceable via § 1983 despite Sandoval limitation.

**III. Expanded Discovery Plan:**
Source code and feature weights, training data demographics, pre-adoption validation and fairness testing, post-adoption racial disparity monitoring, internal communications, procurement records, alternative algorithms considered.

#### Judging Feedback

**Criticism:** Option (C) was the strongest available choice and the student selected it. The identification of all five issues — conclusory strict scrutiny trigger, missing due process claim, missing Title VI theory, fabricated statistics, and inadequate discovery — was comprehensive and showed the ability to evaluate the complaint across doctrinal, factual, and procedural dimensions. This was excellent issue-spotting.

**Better Alternative:** Option **(C)** was the best option — the student selected correctly.

**Grade: A** — Comprehensive identification of all major issues.

#### Steering Feedback

**Criticism:** Option (B) was outstanding — it specified the exact five-factor Arlington Heights structure, enumerated the three Mathews v. Eldridge factors with application to the facts, identified the Sandoval/§ 1983 pathway for Title VI, and listed specific discovery targets. Every instruction was doctrinally precise and actionable. This was the best available option.

**Grade: A** — Precise, multi-layered, and doctrinally specific steering.

---

### Cycle 2

**Current AI Output:** *(revised complaint with Arlington Heights, due process, Title VI, and expanded discovery)*

#### Judging Sub-step

Which issues remain in the AI's updated complaint?

- **(A)** The Arlington Heights factor 4 fabricates a procurement bypass not in the original problem — should be "upon information and belief" with discovery planned
- **(B)** The complaint fabricates the procurement bypass in factor 4; the Sandoval/§ 1983 pathway for Title VI is contested in some circuits and should acknowledge this uncertainty; the complaint lacks a remedies section
- **(C)** No significant issues remain
- **(D)** The entire Arlington Heights approach is wrong — should use rational basis instead
- **(E)** The complaint should add a First Amendment claim

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "The complaint looks complete — no changes needed"
- **(B)** "Correct Arlington Heights factor 4 to allege procurement irregularities 'upon information and belief' subject to discovery confirmation. Note that the Sandoval/§ 1983 pathway for enforcing Title VI disparate impact regulations is accepted in some circuits but contested in others — acknowledge this uncertainty while arguing the claim should survive a motion to dismiss. Add a remedies section requesting: (1) injunctive relief enjoining RecidiScore's use, (2) declaratory judgment, and (3) resentencing for affected defendants."
- **(C)** "Remove the Title VI claim — it's too risky"
- **(D)** "Add a class certification section"
- **(E)** "Rewrite using simpler language for a non-legal audience"

**Student selects: (B)**

#### Updated AI Output

**II. Legal Theory (Further Revised)**

Arlington Heights factor 4 corrected: "Upon information and belief, the state did not conduct the equity impact assessment typically required under its procurement procedures. Plaintiffs will confirm through discovery."

Title VI section updated: "Plaintiffs acknowledge that the availability of § 1983 as a vehicle for enforcing Title VI disparate impact regulations is the subject of a circuit split. However, the weight of authority supports this pathway, and the claim should survive a motion to dismiss under the plausibility standard of Ashcroft v. Iqbal."

**IV. Requested Relief**
1. Preliminary and permanent injunction enjoining the use of RecidiScore in felony sentencing proceedings.
2. Declaratory judgment that the state's use of RecidiScore violates the Fourteenth Amendment's Equal Protection and Due Process Clauses and Title VI.
3. Order requiring resentencing for defendants sentenced using RecidiScore scores during the period at issue.
4. Attorneys' fees under 42 U.S.C. § 1988.

#### Judging Feedback

**Criticism:** Option (B) was the strongest choice. The student identified three distinct issues: the fabricated factual allegation, the circuit split on Sandoval/§ 1983, and the missing remedies section. Each correction improved the complaint's professional quality and intellectual honesty. The circuit split acknowledgment was a particularly sophisticated catch that makes the Title VI claim more credible by confronting the weakness rather than ignoring it.

**Better Alternative:** Option **(B)** was the best option — the student selected correctly.

**Grade: A** — Precise identification of three issues across factual, doctrinal, and structural dimensions.

#### Steering Feedback

**Criticism:** Option (B) was precisely targeted: it corrected the fabricated allegation with proper pleading language, addressed the circuit split honestly, and added a complete remedies section with appropriate statutory fee request. Every element was doctrinally sound and practically useful.

**Grade: A** — Comprehensive and precise corrections across all identified issues.

---

### Cycle 3 (Final)

**Current AI Output:** *(fully revised complaint with all corrections applied)*

#### Judging Sub-step

Which issues remain?

- **(A)** The complaint needs to address class certification
- **(B)** The statistical methodology for the 40% disparity claim needs more specificity
- **(C)** No significant issues remain for the scope of this assignment
- **(D)** The complaint should include a Thirteenth Amendment theory
- **(E)** The procedural due process claim needs stronger factual support

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
| Judging  | A     |
| Steering | A     |

### Summary Feedback

The student showed strong improvement across the session. The framing correctly identified the core Washington v. Davis challenge but missed several important dimensions (due process, Title VI, state action) that option (C) covered. However, the student compensated effectively in the judging and steering phases, consistently selecting the most comprehensive options and producing precise, multi-layered corrections. The Cycle 1 judgement was outstanding — identifying all five major issues in a single assessment. The Cycle 2 catches (fabricated allegations, circuit split, missing remedies) showed both professional responsibility awareness and doctrinal sophistication. Steering was consistently excellent throughout. To improve, the student should invest more time in the framing phase to identify all potential theories upfront rather than relying on the judging phase to catch what was missed.
