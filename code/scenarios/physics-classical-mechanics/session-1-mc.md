# Session 1 — Trebuchet Range Prediction (Multiple Choice)

**Challenge:** Kinematics > Motion in 2D & 3D > Projectile Motion
**Mode:** Multiple Choice
**Student:** Priya K.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Build a computational model that predicts the landing distance of a counterweight trebuchet launching a pumpkin at a harvest festival. The organizers say the field is "a few hundred meters long" and want to know where to set up the safety perimeter. Produce a range map showing landing zones for different counterweight masses (100 kg to 500 kg). The trebuchet arm is "about 6 meters" and the pumpkin weighs "around 5 kg." Assume the release happens "near the top of the swing."

### Framing Options Presented

Which assumptions and constraints should you establish before the AI generates a solution?

- **(A)** Assume 45° launch angle for maximum range, ignore air resistance, use the standard range equation R = v₀² sin(2θ)/g, sweep counterweight masses as specified
- **(B)** Identify that launch angle is unspecified ("near the top" is vague), note that air resistance is unmentioned, ask about arm geometry (pivot point, arm ratio), and question whether 100% of counterweight PE converts to pumpkin KE
- **(C)** Identify that launch angle, arm geometry (pivot ratio, sling length), release height, and energy transfer efficiency are all unspecified; question whether air drag matters at the expected speeds and ranges; note that the coordinate system and reference heights for launch vs. landing are undefined; flag that "a few hundred meters" may be inconsistent with the physics if parameters are unfavorable
- **(D)** The problem is well-defined enough — just ask the AI to simulate the trebuchet and plot the results
- **(E)** Assume the trebuchet is ideal, meaning all potential energy converts to kinetic energy. Focus only on checking whether the field length is sufficient.

**Student selects: (B)**

### AI Solution (Generated from Student's Framing)

> Using the projectile range equation R = v₀² sin(2θ)/g with θ = 45°:
>
> Energy conservation: ½Mv₀² = mgh, giving v₀ = √(2mgh/M).
> Taking h = 6 m (full arm length as drop height), M = 5 kg:
>
> | Counterweight (kg) | v₀ (m/s) | Range (m) |
> |---------------------|----------|-----------|
> | 100                 | 15.3     | 23.9      |
> | 200                 | 21.7     | 48.0      |
> | 300                 | 26.5     | 71.6      |
> | 400                 | 30.6     | 95.6      |
> | 500                 | 34.3     | 120.0     |
>
> The safety perimeter should be set at approximately 150 m to account for variations.

### Framing Feedback

**Criticism:** Option (B) is decent — it flags the ambiguous launch angle, unmentioned air resistance, arm geometry, and energy transfer efficiency. However, it misses the undefined coordinate system and reference heights, does not flag that "a few hundred meters" may be inconsistent with realistic trebuchet physics, and does not mention the sling length or release conditions. Option (C) was stronger because it covered all of (B) plus these additional issues.

**Better Alternative:** Option **(C)** — it comprehensively addresses the geometric, energetic, and environmental ambiguities, including consistency checking against the stated field size.

**Grade: B** — Good identification of key ambiguities, but incomplete coverage of geometric and reference-frame issues.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's current solution?

- **(A)** The range equation is wrong — it should use R = v₀ t cos(θ) with t solved from the vertical equation
- **(B)** The AI assumes 100% energy transfer from counterweight to pumpkin and uses h = 6 m (full arm length) as the drop height, both of which overestimate launch speed; it also uses 45° without geometric justification
- **(C)** The AI assumes 100% energy transfer, uses the full arm length as drop height, uses 45° without justification, and neglects air drag which is non-negligible for a pumpkin at these speeds and ranges; the launch height above ground is also ignored making the trajectory asymmetric
- **(D)** The solution is correct — the range equation and energy conversion are standard physics
- **(E)** The only issue is that air resistance is ignored; everything else is fine

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Use a more accurate formula for range"
- **(B)** "The trebuchet arm has mass and rotational inertia — not all counterweight PE goes to the pumpkin. Include the arm's energy share using I_arm = ⅓mL². Also, the counterweight drop height depends on the arm ratio (long arm vs. short arm), not the full arm length. Recalculate with a 3:1 arm ratio."
- **(C)** "Add air resistance to the model"
- **(D)** "The energy conversion is wrong and the drop height is wrong. Fix both. Also estimate drag on the pumpkin (diameter ~0.3 m, Cd ≈ 0.5) and solve the trajectory numerically since launch height differs from landing height."
- **(E)** "Make the table look nicer and add more counterweight values"

**Student selects: (B)**

#### Updated AI Output

> Corrected model:
>
> **Energy partition:** The arm (mass m_arm ≈ 40 kg, length L = 6 m) has moment of inertia I_arm = ⅓ m_arm L². With arm ratio 3:1, long arm = 4.5 m, short arm = 1.5 m. Counterweight drops h = 1.5 m.
>
> Energy balance: m_cw × g × 1.5 = ½(M + m_arm/3) v₀²
>
> v₀ = √(2 × m_cw × g × 1.5 / (M + m_arm/3))
>
> Using θ = 45°:
>
> | Counterweight (kg) | v₀ (m/s) | Range (m) |
> |---------------------|----------|-----------|
> | 100                 | 6.1      | 3.8       |
> | 200                 | 8.6      | 7.5       |
> | 300                 | 10.5     | 11.2      |
> | 400                 | 12.1     | 14.9      |
> | 500                 | 13.5     | 18.6      |
>
> These ranges are significantly shorter than the initial estimate.

#### Judging Feedback

**Criticism:** The student correctly identified the energy transfer and drop height issues — these were the most impactful errors. However, option (C) was more complete: it also caught the neglected air drag (non-negligible for a pumpkin at these speeds) and the asymmetric trajectory from elevated launch. These are real issues the student missed.

**Better Alternative:** Option **(C)** — includes everything in (B) plus drag and trajectory asymmetry.

**Grade: B** — Caught the dominant errors but missed secondary physics.

#### Steering Feedback

**Criticism:** Option (B) was good and specific — it addressed the energy partition with a concrete formula and the arm ratio with a specific value. However, option (D) was stronger because it also addressed drag and the asymmetric trajectory. The student's steering fixed the biggest problems but left drag and trajectory unaddressed.

**Better Alternative:** Option **(D)** — addresses all identified issues in a single correction.

**Grade: A** — Specific and effective on the targeted issues, but incomplete scope.

---

### Cycle 2

**Current AI Output:** *(arm-corrected version as shown above)*

#### Judging Sub-step

Which issues remain in the AI's updated solution?

- **(A)** The arm mass of 40 kg is assumed without justification and should be treated as a parameter
- **(B)** The 45° launch angle is still geometrically unjustified for a trebuchet; air drag is still neglected; the sling (which increases release velocity) is not modeled
- **(C)** The ranges are too short — the model must be wrong
- **(D)** The 45° launch angle is unjustified; drag is neglected; the sling is missing; and there is no sensitivity analysis showing how range depends on uncertain parameters like arm ratio, angle, and mass
- **(E)** The solution is now correct — the geometry fix was the only issue

**Student selects: (D)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Add a sling to the model and change the launch angle"
- **(B)** "Use a geometrically motivated launch angle (trebuchets typically release at 35–45° depending on sling and arm geometry — use 40°). Add the sling effect: sling length ≈ 0.7 × long arm increases tip speed by factor (L_long + L_sling)/L_long. Include drag via numerical integration (Cd = 0.47, pumpkin diameter 0.3 m). Provide a sensitivity analysis: range vs. ±10° launch angle, ±30% arm ratio, ±20% counterweight mass."
- **(C)** "Just tell me the final answer"
- **(D)** "Run a Monte Carlo simulation with 10,000 trials"
- **(E)** "The model is fine, just add error bars to the table"

**Student selects: (B)**

#### Updated AI Output

> **Final corrected model:**
>
> Sling length = 0.7 × 4.5 = 3.15 m. Effective tip speed: v_tip = ω × (4.5 + 3.15) = ω × 7.65 m, so v₀ increases by factor 7.65/4.5 = 1.7.
>
> Launch angle: 40° (geometrically motivated for trebuchet with sling).
>
> Drag: Numerical integration using F_drag = ½ρCdAv², with ρ = 1.2 kg/m³, Cd = 0.47, A = π(0.15)² = 0.071 m².
>
> | Counterweight (kg) | v₀ (m/s) | Range w/ drag (m) | Range band (m) |
> |---------------------|----------|---------------------|-----------------|
> | 100                 | 10.3     | 11.2                | 7 – 16          |
> | 200                 | 14.6     | 21.8                | 14 – 31         |
> | 300                 | 17.9     | 32.0                | 21 – 46         |
> | 400                 | 20.6     | 42.0                | 27 – 60         |
> | 500                 | 23.0     | 51.8                | 34 – 74         |
>
> **Sensitivity analysis (500 kg case):**
> - Launch angle 30°–50°: Range varies 41.2 – 55.3 m (±15%)
> - Counterweight ±20%: Range varies 42.8 – 61.1 m (±18%)
> - Arm ratio 2.5:1 to 3.5:1: Range varies 38.4 – 69.7 m (±33%)
>
> **Safety perimeter:** 80 m radius, 100 m forward. Lateral exclusion ±25°.

#### Judging Feedback

**Criticism:** The student identified all major remaining issues — launch angle justification, drag, sling, and sensitivity analysis. This was the most complete option available and represents a significant improvement in judging over Cycle 1.

**Better Alternative:** Option **(D)** was the best choice — well done.

**Grade: A** — Comprehensive issue identification covering all significant remaining gaps.

#### Steering Feedback

**Criticism:** Option (B) was excellent — specific numerical parameters, concrete formulas, and a well-structured sensitivity analysis request. It addressed all identified issues in a single, actionable command.

**Better Alternative:** Option **(B)** was the best choice — well done.

**Grade: A** — Precise, comprehensive, and drove the model to a physically realistic result.

---

## COMPLETION

### Final Grades

| Skill    | Grade |
|----------|-------|
| Framing  | B     |
| Judging  | B     |
| Steering | A     |

### Summary Feedback

The student started with a solid but incomplete framing that missed geometric and reference-frame issues. In Cycle 1, judging caught the two biggest errors (energy transfer and drop height) but missed drag and trajectory asymmetry; steering was specific but similarly scoped. The strongest performance came in Cycle 2, where the student identified all remaining issues and delivered a comprehensive, well-parameterized steering command that produced a physically realistic final model. The progression from Cycle 1 to Cycle 2 shows effective learning within the session. For future sessions, aim to achieve the Cycle 2 level of completeness from the start — always ask "what other physics is missing?" after finding the first issue.
