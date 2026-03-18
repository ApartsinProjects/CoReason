# Session 3 — Equal Protection Challenge to Algorithmic Sentencing (Open-Ended)

**Challenge:** Individual Rights & Liberties > Equal Protection > Suspect Classifications
**Mode:** Open-Ended (Structured Sections)
**Student:** Elena T.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Draft a plaintiff's complaint and supporting legal memorandum challenging a state's use of an algorithmic risk assessment tool in criminal sentencing. The tool, "RecidiScore," produces a numerical risk score used by judges at sentencing. A civil rights organization has gathered data showing that Black defendants receive scores "about 40% higher" than white defendants with "comparable criminal histories." The state says the algorithm is "race-blind" because it does not use race as an input variable. The tool considers "over 100 factors" including zip code, employment history, and education level. Produce the complaint's factual allegations, the equal protection legal theory, and a proposed discovery plan. The organization wants to "make new law" if possible.

### Student's Framing Response

> **Assumption: The equal protection claim rests on the Fourteenth Amendment. Since race is a suspect classification, any intentional racial discrimination triggers strict scrutiny under Washington v. Davis and Arlington Heights.**
>
> **Question: The key doctrinal challenge is proving discriminatory intent, not just discriminatory impact. Washington v. Davis held that disparate impact alone does not establish an equal protection violation — the plaintiff must show discriminatory purpose. I need to frame the complaint to establish intent, not just statistical disparity.**
>
> **Constraint: The algorithm is facially race-neutral — race is not an input variable. The argument must be that using proxy variables (zip code, employment history) that correlate with race constitutes intentional discrimination through facially neutral means, similar to Yick Wo v. Hopkins.**
>
> **Gap: "Comparable criminal histories" is vague — I'll flag this as needing rigorous statistical methodology to support the disparity claim.**

### AI Solution (Generated from Student's Framing)

**COMPLAINT FOR DECLARATORY AND INJUNCTIVE RELIEF**

**I. Factual Allegations**
1. The State Department of Corrections adopted RecidiScore in 2021 for use in felony sentencing proceedings.
2. RecidiScore produces a numerical risk score from 1-10 based on over 100 input variables, including zip code, employment history, education level, marital status, and prior contacts with law enforcement.
3. Judges are instructed to consider the RecidiScore as one factor in determining sentences within the statutory range.
4. Analysis of 15,000 sentencing records from 2021-2024 shows that Black defendants receive RecidiScore assessments averaging 6.8 compared to 4.9 for white defendants — approximately 40% higher.
5. When controlling for criminal history category, offense severity, and age, the racial disparity persists: Black defendants score an average of 1.4 points higher than similarly situated white defendants.

**II. Legal Theory — Equal Protection (Fourteenth Amendment)**

*A. Discriminatory Intent Through Proxy Variables*
Under Washington v. Davis, the Equal Protection Clause requires a showing of discriminatory purpose. Plaintiffs allege that the state's knowing adoption and continued use of RecidiScore, with awareness of its racially disparate outputs, constitutes deliberate indifference amounting to discriminatory intent under Personnel Administrator of Massachusetts v. Feeney. The use of proxy variables that the state knows correlate with race — particularly zip code and employment history — further supports an inference of discriminatory purpose under the Arlington Heights multi-factor test.

*B. Strict Scrutiny Applies*
Because race is a suspect classification, any state action that classifies on the basis of race is subject to strict scrutiny. RecidiScore's use of race-correlated proxies effectively classifies defendants by race, triggering strict scrutiny.

**III. Proposed Discovery Plan**
1. Full algorithmic source code and training data
2. Internal validation studies and disparate impact analyses
3. Communications regarding known racial disparities
4. Alternative algorithms considered and rejected

### Framing Feedback

**Criticism:** The student's framing was doctrinally strong. Identifying Washington v. Davis as the key hurdle — that disparate impact alone is insufficient and discriminatory purpose must be shown — was exactly the right starting point. The proxy variable theory under Yick Wo and the statistical methodology concern were also well-placed. However, the student did not question whether there is a due process dimension to the challenge. If the algorithm is a "black box" that defendants cannot examine or contest, this raises procedural due process concerns under Mathews v. Eldridge (what process is due before liberty is deprived based on an opaque algorithmic score?). The student also did not flag that the complaint needs to establish state action clearly — if RecidiScore was developed by a private company, there is a question about whether the company's design choices are attributable to the state. Finally, the student did not consider whether Title VI of the Civil Rights Act provides a statutory disparate impact theory that avoids the intent requirement entirely.

**Better Alternative Framing:**
> "Assumption: Equal protection claim under the Fourteenth Amendment, strict scrutiny because race is a suspect classification. Key challenge: Washington v. Davis requires discriminatory intent, not just impact. Question: Can we establish intent through the proxy variable theory plus the state's continued use despite known disparities? Question: Is there a procedural due process claim if defendants cannot examine or challenge the algorithm? Question: Does Title VI provide an alternative statutory theory with a disparate impact standard? Constraint: Must establish state action if the algorithm was developed by a private contractor."

**Grade: A** — Strong equal protection analysis but missed due process, Title VI, and state action issues.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "No procedural due process claim for opaque algorithm"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Revise: The strict scrutiny trigger is too conclusory"
    description: "Revise: The strict scrutiny trigger is too conclusory. Restructure the discriminatory intent argument using the Arlington Heights multi-factor framework: (1) statistical evidence of disproportionate impact, (2) the historical background of the decision, (3) the specific sequence of events leading to the challenged action, (4) departures from normal procedural sequence, and (5) legislative or administrative history. Show how each factor supports an inference of discriminatory purpose in the state's adoption and continued use of RecidiScore."
  - name: "Add: Include a procedural due process claim under Mathews v"
    description: "Add: Include a procedural due process claim under Mathews v. Eldridge. Argue that defendants have a liberty interest at stake (sentence length), that the risk of erroneous deprivation is high when the scoring methodology is opaque, and that the government's interest does not justify withholding the algorithm from adversarial testing."
  - name: "Revise: Expand the discovery plan to specifically target"
    description: "Revise: Expand the discovery plan to specifically target (1) the algorithm's training data demographics, (2) pre-adoption validation studies including any disparate impact testing, and (3) post-adoption monitoring data showing whether the state tracked and addressed racial disparities."

#### Updated AI Output

**II. Legal Theory (Revised)**

*A. Discriminatory Intent Under the Arlington Heights Framework*
Plaintiffs establish discriminatory purpose through the multi-factor test of Village of Arlington Heights v. Metropolitan Housing Development Corp.:

1. *Statistical evidence:* The 40% disparity in scores between Black and white defendants with comparable criminal histories constitutes a stark pattern unexplainable on grounds other than race. Under Yick Wo, statistics this extreme can alone establish discriminatory intent.
2. *Historical background:* The criminal justice system has a well-documented history of racial disparities in sentencing, of which the state was aware when adopting RecidiScore.
3. *Sequence of events:* The state adopted RecidiScore without conducting a racial impact assessment despite the availability of such tools and despite publicly available research showing algorithmic bias in criminal justice contexts.
4. *Departures from normal procedure:* The state bypassed its standard procurement process for criminal justice tools, which requires an equity impact assessment under state administrative code.
5. *Legislative/administrative history:* Internal communications (to be obtained in discovery) may reveal awareness of racial disparities.

*B. Strict Scrutiny Analysis*
If discriminatory intent is established, strict scrutiny applies. The state must demonstrate that RecidiScore serves a compelling interest and is narrowly tailored. While public safety is compelling, the state must show that RecidiScore — with its demonstrated racial disparities — is the least restrictive means of achieving that interest, and that race-neutral alternatives were considered and rejected.

*C. Procedural Due Process (Mathews v. Eldridge)*
Defendants have a protected liberty interest in avoiding increased incarceration. Under the Mathews three-factor test:
1. *Private interest:* Physical liberty is the most fundamental interest protected by the Due Process Clause.
2. *Risk of erroneous deprivation:* RecidiScore's proprietary methodology prevents defendants from examining, challenging, or rebutting the factors that generated their score. This opacity creates an unacceptable risk of error.
3. *Government interest:* The government's interest in protecting proprietary algorithms does not outweigh defendants' right to examine evidence used against them at sentencing.

**III. Revised Discovery Plan**
1. Full algorithmic source code, feature weights, and training data
2. Demographic composition of the training dataset
3. Pre-adoption validation studies, including any disparate impact or fairness testing
4. Post-adoption monitoring data on racial disparities in scores
5. Internal communications regarding known racial disparities and decisions to continue using the tool
6. Documentation of alternative algorithms considered and rejected
7. State procurement records showing whether standard equity impact assessment procedures were followed

#### Judging Feedback

**Criticism:** The student's judgement was strong on all three counts. Catching the conclusory strict scrutiny assertion was the most important correction — the complaint would have been vulnerable to a motion to dismiss for failure to adequately plead discriminatory intent. The procedural due process addition was also valuable — it provides an independent constitutional theory that does not require proving intent. The discovery plan improvements were specific and targeted. The student could have additionally noted that the AI fabricated the procedural departure (bypassing equity impact assessment) — this fact is not in the original problem and should be flagged as an assumption. The student also did not consider whether a Title VI statutory claim should be added as an alternative theory.

**Better Alternative Judgement:**
> "Error: Strict scrutiny trigger is conclusory — need Arlington Heights framework. Gap: No procedural due process claim for opaque algorithm. Gap: Discovery plan does not target training data demographics or pre-adoption fairness testing. Error: AI fabricated the procurement bypass — not in original facts. Gap: No Title VI alternative theory."

**Grade: A** — Comprehensive issue identification on the three most important points; missed fabricated facts and statutory alternative.

#### Steering Feedback

**Criticism:** The steering was excellent. The Arlington Heights instruction was specific (enumerating all five factors) and doctrinally precise. The Mathews v. Eldridge instruction correctly identified all three factors of the balancing test. The discovery plan revisions were targeted and practical. The resulting output was substantially improved across all three areas. The student could have additionally directed the AI to flag assumed facts versus facts in the record.

**Grade: A** — Precise, multi-dimensional steering that produced a markedly improved complaint.

---

### Cycle 2

**Current AI Output:** *(revised complaint with Arlington Heights framework, due process claim, and expanded discovery)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "No Title VI alternative theory for disparate impact. Minor: Sandoval/§ 1983 pathway is contested in some circuits — should note circuit split"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Revise: Under Arlington Heights factor 4, change the"
    description: "Revise: Under Arlington Heights factor 4, change the procurement bypass allegation to an allegation"
  - name: "Add: Include a Title VI claim as an alternative theory"
    description: "Add: Include a Title VI claim as an alternative theory. Allege that the state receives federal funding for its corrections programs and that RecidiScore's use violates Title VI's prohibition on racial discrimination by federally funded programs. Note the Sandoval limitation on private disparate impact actions but argue that the implementing regulations can be enforced via § 1983."

#### Updated AI Output

**II. Legal Theory (Further Revised)**

*(Sections A, B, C retained with the following modifications)*

Arlington Heights factor 4 revised: "Upon information and belief, the state did not conduct the equity impact assessment typically required under its procurement procedures for criminal justice tools. Plaintiffs will seek confirmation of this allegation through discovery of procurement records."

*D. Title VI of the Civil Rights Act of 1964*
The State Department of Corrections receives federal funding through Bureau of Justice Assistance grants. Title VI (42 U.S.C. § 2000d) prohibits racial discrimination by programs receiving federal financial assistance. While Alexander v. Sandoval held that no private right of action exists for disparate impact claims directly under Title VI, plaintiffs may enforce Title VI implementing regulations — which do prohibit disparate impact — through 42 U.S.C. § 1983. See, e.g., DOJ Title VI regulations, 28 C.F.R. § 42.104(b)(2). This provides an alternative theory that does not require proof of discriminatory intent.

#### Judging Feedback

**Criticism:** The student caught two important issues. The fabricated facts correction was essential — a complaint that asserts unverified facts as established exposes the filing attorney to Rule 11 sanctions. The Title VI addition was a sophisticated move that adds a claim with a lower burden (disparate impact rather than intent). The student could have also flagged that the Sandoval/§ 1983 pathway is doctrinally contested in some circuits, and the complaint should acknowledge this uncertainty. Overall, this was strong and precise judgement.

**Better Alternative Judgement:**
> "Error: Factor 4 fabricates procurement irregularities — must be 'upon information and belief.' Gap: No Title VI alternative theory for disparate impact. Minor: Sandoval/§ 1983 pathway is contested in some circuits — should note circuit split."

**Grade: A** — Correctly identified the fabrication issue and added a doctrinally valuable alternative theory.

#### Steering Feedback

**Criticism:** The steering was precise and produced exactly the needed corrections. The "upon information and belief" instruction showed awareness of pleading standards — a practical lawyering skill. The Title VI instruction was specific about the Sandoval limitation and the § 1983 workaround, demonstrating doctrinal sophistication. The resulting output was more professionally responsible and doctrinally comprehensive.

**Grade: A** — Professionally precise steering with both doctrinal and practical lawyering awareness.

---

### Cycle 3 (Final)

**Current AI Output:** *(fully revised complaint with all four theories and corrected factual allegations)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Minor: The complaint could benefit from a section on remedies"
    description: "Minor: The complaint could benefit from a section on remedies — specifically requesting injunctive relief (enjoin RecidiScore's use), declaratory relief, and resentencing for affected defendants. But the overall legal framework is now comprehensive. The complaint presents four distinct theories: (1) equal protection intent under Arlington Heights, (2) strict scrutiny for race-based classification, (3) procedural due process under Mathews, and (4) Title VI disparate impact via § 1983. This is a strong multi-theory approach."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done**

---

## COMPLETION

### Final Grades

| Skill    | Grade |
|----------|-------|
| Framing  | A     |
| Judging  | A     |
| Steering | A     |

### Summary Feedback

The student demonstrated strong and improving performance across all three skills. The framing correctly identified the central doctrinal challenge — the intent requirement under Washington v. Davis — and the proxy variable theory, but initially missed the due process dimension and the Title VI alternative. In judging, the student showed excellent development: Cycle 1 caught the conclusory strict scrutiny trigger (the most critical error), and Cycle 2 demonstrated both professional responsibility awareness (catching fabricated facts) and doctrinal creativity (adding Title VI). Steering was consistently outstanding: the Arlington Heights five-factor instruction and the Mathews v. Eldridge three-factor instruction were precisely structured and produced a markedly improved complaint. The "upon information and belief" correction showed practical lawyering instincts that go beyond doctrinal analysis. To improve further, the student should practice identifying all potential theories at the framing stage rather than discovering them during later cycles.
