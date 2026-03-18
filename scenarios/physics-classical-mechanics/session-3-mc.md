# Session 3 — Ballistic Pendulum Forensics Report (Multiple Choice)

**Challenge:** Momentum & Collisions > Collisions > Inelastic Collisions
**Mode:** Multiple Choice
**Student:** James W.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Write a forensic analysis report that determines the muzzle velocity of a firearm using ballistic pendulum test data. A bullet was fired into a suspended wooden block, which swung upward. The block rose "a noticeable height." The report must include the calculated muzzle velocity with uncertainty bounds and an assessment of whether the weapon matches a suspect firearm with a listed muzzle velocity of 370 m/s. The bullet "looks like a 9mm" and the block is "a heavy piece of oak."

### Framing Options Presented

Which assumptions and constraints should you establish before the AI generates a solution?

- **(A)** Assume the bullet mass is 8 g and the block mass is 3 kg; pick a height of 15 cm. These are reasonable estimates and sufficient to solve the problem.
- **(B)** Identify that bullet mass, block mass, and swing height are all unspecified or vague; note that the collision type (perfectly inelastic vs. partial penetration) must be verified; recognize that the problem demands uncertainty bounds but provides no precision information for inputs
- **(C)** Identify all issues in (B), plus: question whether external forces (gravity, string tension) are negligible during the very short collision; ask whether the "height" is measured vertically or as an arc/angle; note that the forensic conclusion requires not just a point estimate but a confidence interval and systematic error assessment; flag that the block rotational inertia may matter if the block is large
- **(D)** Just apply conservation of energy to find the velocity — momentum is not needed for this problem
- **(E)** The problem is clear enough. Use standard ballistic pendulum equations and report the answer.

**Student selects: (B)**

### AI Solution (Generated from Student's Framing)

> **Ballistic Pendulum Analysis**
>
> Given: 9mm bullet (m = 8.0 g), oak block (M = 3.0 kg), height h = 15 cm.
>
> Post-collision velocity: V = sqrt(2gh) = sqrt(2 x 9.8 x 0.15) = 1.715 m/s
>
> Muzzle velocity: v = ((M + m)/m) x V = (3.008/0.008) x 1.715 = 645 m/s
>
> Energy dissipated: 99.7% (typical for ballistic pendulum)
>
> **Finding:** Calculated velocity (645 m/s) exceeds suspect weapon specification (370 m/s) by 74%. The weapon is excluded as a match.

### Framing Feedback

**Criticism:** Option (B) is good but incomplete. It correctly identifies the missing quantitative data, the collision-type question, and the uncertainty gap. However, it misses the external force validity check during collision, the height measurement ambiguity (vertical vs. arc), the need for systematic error assessment (not just random uncertainty), and the block rotational inertia. Option (C) covered all of these additional concerns.

**Better Alternative:** Option **(C)** — provides the most thorough framing for a forensic application where both systematic and random errors matter.

**Grade: B** — Good identification of core issues, but missed forensic-critical details about systematic errors and measurement interpretation.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's current solution?

- **(A)** The sqrt(2gh) formula is wrong — it should be sqrt(gh)
- **(B)** The AI fabricated specific values (M = 3 kg, h = 15 cm) that are not in the problem; the result has no uncertainty bounds; and the forensic conclusion ("weapon excluded") depends entirely on these invented numbers
- **(C)** The AI fabricated input values; there are no uncertainty bounds; the forensic conclusion is unjustified; and the perfectly inelastic collision assumption is unverified — if the bullet fragmented or exited, the momentum balance changes and the calculated velocity would be biased
- **(D)** The only issue is that the energy dissipation percentage should be reported more precisely
- **(E)** The AI should have used kinetic energy conservation across the collision instead of momentum conservation

**Student selects: (C)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Use different numbers for mass and height"
- **(B)** "The block mass and height are unknown — compute v_bullet as a function of both parameters over the ranges M = 2-5 kg and h = 5-30 cm. Present a table showing which (M, h) combinations yield v within plus or minus 10% of 370 m/s. Also state what physical check (bullet recovery, X-ray) would verify the perfectly inelastic collision assumption."
- **(C)** "Redo the calculation with the correct answer of 370 m/s and work backwards to find the height"
- **(D)** "Add more decimal places to the answer for better precision"
- **(E)** "Replace momentum conservation with energy conservation during the collision"

**Student selects: (B)**

#### Updated AI Output

> **Parametric Analysis:**
>
> v_bullet = ((M + m)/m) x sqrt(2gh) with m = 0.008 kg
>
> | Block mass (kg) | h = 5 cm | h = 10 cm | h = 15 cm | h = 20 cm | h = 30 cm |
> |-----------------|----------|-----------|-----------|-----------|-----------|
> | 2.0             | 249      | 352       | 431       | 498       | 610       |
> | 3.0             | 373      | 528       | 646       | 746       | 914       |
> | 4.0             | 497      | 703       | 861       | 994       | 1,217     |
> | 5.0             | 621      | 878       | 1,076     | 1,242     | 1,521     |
>
> Combinations yielding 333 to 407 m/s (370 +/- 10%):
> - M = 2.0 kg, h ~ 10 cm (v = 352) -- near match
> - M = 3.0 kg, h ~ 5 cm (v = 373) -- match
>
> **Collision verification:** Recover the bullet from the block (X-ray to locate, then extract). If the bullet is intact and fully embedded, the perfectly inelastic assumption is justified. If fragmented or if an exit wound is visible, momentum balance must include fragment velocities.
>
> **Revised conclusion:** Without measured values, neither inclusion nor exclusion of the suspect weapon is forensically defensible.

#### Judging Feedback

**Criticism:** The student identified all major issues — fabricated values, missing uncertainty, unjustified conclusion, and unverified collision assumption. This was the most complete option available.

**Better Alternative:** Option **(C)** was the best choice — well done.

**Grade: A** — Comprehensive issue identification including the collision assumption, which is specific to this problem type.

#### Steering Feedback

**Criticism:** Option (B) was excellent — it requested a parametric sweep over both unknowns, specified the match criterion, and asked for physical verification of the collision type. This was the best available option.

**Better Alternative:** Option **(B)** was the best choice — well done.

**Grade: A** — Specific, actionable, and directly addressed the most critical gaps.

---

### Cycle 2

**Current AI Output:** *(parametric version as shown above)*

#### Judging Sub-step

Which issues remain in the AI's updated solution?

- **(A)** The table is formatted incorrectly
- **(B)** The analysis still lacks formal uncertainty propagation — how sensitive is v to measurement errors in m, M, and h? The dominant error source should be identified.
- **(C)** The analysis lacks uncertainty propagation; additionally, systematic errors (bullet not fully embedding, energy loss to block rotation, string stretch) are not discussed, and the forensic report should specify what measurement precisions are needed to make a definitive determination
- **(D)** The parametric analysis is sufficient — no further work needed
- **(E)** The formula should include relativistic corrections for the bullet velocity

**Student selects: (D)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Add error bars to the table"
- **(B)** "Propagate uncertainties through the formula using partial derivatives. Assuming realistic measurement precisions (bullet mass +/- 0.1 g, block mass +/- 50 g, height +/- 0.5 cm), compute the resulting uncertainty in v. Identify the dominant error source. Also discuss systematic errors: how does the calculated v change if the bullet partially exits or if the block has non-negligible rotational inertia? State what measurement precisions are needed to distinguish the suspect weapon (370 m/s) from other common 9mm loadings."
- **(C)** "Multiply all velocities by a safety factor of 1.5"
- **(D)** "The analysis is complete"
- **(E)** "Convert all units to imperial"

**Student selects: (D)**

#### Updated AI Output

> *(AI proceeds without correction, presenting parametric table as the final analysis)*
>
> **Final Report:**
>
> The muzzle velocity depends on unmeasured parameters (block mass and swing height). The parametric analysis shows that for certain combinations, the result is consistent with the suspect weapon (370 m/s). Without measurements, no definitive conclusion is possible.

#### Judging Feedback

**Criticism:** The student selected (D), accepting the parametric analysis as complete. Option (C) was the correct choice: the analysis still lacks formal uncertainty propagation, systematic error discussion, and measurement precision requirements. A forensic report must address both random errors (measurement uncertainty) and systematic errors (collision model validity). The parametric table shows sensitivity but does not provide the formal uncertainty bounds the problem demands.

**Better Alternative:** Option **(C)** — includes uncertainty propagation, systematic errors, and measurement specifications.

**Grade: C** — Accepted an incomplete analysis without questioning remaining gaps in uncertainty and systematic error.

#### Steering Feedback

**Criticism:** The student selected (D), sending no correction. Option (B) was the appropriate choice — it would have produced formal uncertainty propagation, systematic error analysis, and actionable measurement requirements. By stopping too early, the student left the forensic report without the uncertainty bounds explicitly required by the problem statement.

**Better Alternative:** Option **(B)** — requests the formal analysis needed to complete the forensic report.

**Grade: C** — Failed to send a needed correction, leaving the report without required uncertainty bounds.

---

### Cycle 3 (Final)

**Current AI Output:** *(unchanged from above)*

#### Judging Sub-step

After instructor feedback highlighting the missing uncertainty analysis, which assessment is correct?

- **(A)** Uncertainty analysis is unnecessary for forensic reports
- **(B)** The report needs formal error propagation showing how measurement uncertainties in m, M, and h translate to uncertainty in v_bullet, identification of the dominant error source, and specification of what measurement precisions would be needed to make a definitive forensic determination
- **(C)** Just adding "+/- 50 m/s" to the answer is sufficient
- **(D)** The uncertainty is zero because the formula is exact
- **(E)** Only the height measurement matters — all other uncertainties are negligible

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done** (after acknowledging the uncertainty gap)

#### Judging Feedback

**Criticism:** Option (B) is correct. The student recognized the need for formal uncertainty propagation after feedback. A proper forensic report must specify how input uncertainties propagate to the output, identify which measurement is most critical, and state what precisions are needed for a conclusive determination.

**Better Alternative:** Option **(B)** was the best choice — good recovery.

**Grade: A** — Correct assessment after feedback, showing ability to recognize gaps when prompted.

---

## COMPLETION

### Final Grades

| Skill    | Grade |
|----------|-------|
| Framing  | B     |
| Judging  | B     |
| Steering | B     |

### Summary Feedback

The student showed strong performance in Cycle 1, correctly identifying all major issues (fabricated inputs, missing uncertainty, unverified collision) and delivering an excellent steering command. However, performance dropped significantly in Cycle 2 when the student prematurely accepted the parametric analysis as complete, missing the need for formal uncertainty propagation and systematic error analysis. This pattern — strong initial identification followed by premature closure — suggests the student needs to practice asking "what does the problem statement actually require that I have not yet delivered?" The problem explicitly demands "uncertainty bounds," which were never formally provided. In forensic and scientific work, parametric sensitivity tables are useful but are not substitutes for formal uncertainty propagation with stated confidence levels.
