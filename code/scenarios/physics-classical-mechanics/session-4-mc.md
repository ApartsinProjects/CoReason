# Session 4 — Vibration Isolator for a Rooftop HVAC Unit (Multiple Choice)

**Challenge:** Oscillations & Waves > Forced Oscillations & Resonance
**Mode:** Multiple Choice
**Student:** Anika P.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Specify the spring stiffness and damping coefficient for vibration isolation mounts under a rooftop HVAC compressor. Produce a transmissibility curve (force transmitted to roof vs. frequency). Tenants on the top floor complain of "a constant hum" when the unit runs. The compressor "runs at about 1800 RPM" and weighs "several hundred kilograms." The building manager wants vibration transmission reduced to "barely noticeable levels." Select a mount from a catalog of available isolators with stiffnesses ranging from 50 kN/m to 500 kN/m.

### Framing Options Presented

Which assumptions and constraints should you establish before the AI generates a solution?

- **(A)** The problem is fully specified -- 1800 RPM gives the frequency, and we just need to pick a spring from the catalog that matches.
- **(B)** The mass is vague ("several hundred kilograms"), the transmissibility target ("barely noticeable") must be quantified, and the forcing may contain harmonics beyond the fundamental at 30 Hz.
- **(C)** The mass is vague, the transmissibility target is unquantified, harmonics must be considered, "barely noticeable" should be translated to a standard (ISO 2631 or ASHRAE), the number and arrangement of mounts affects effective stiffness per mount, and startup/shutdown transients will pass through resonance
- **(D)** The only issue is that the compressor mass is vague -- everything else follows from standard engineering practice.
- **(E)** The problem cannot be solved because we need the exact RPM, not "about 1800."

**Student selects: (C)**

### AI Solution (Generated from Student's Framing)

> Mass: 400 kg. Frequency: 30 Hz. For T < 0.05, need r > 4.58.
>
> omega_n = omega/r = 188.5/4.58 = 41.2 rad/s, so k = m*omega_n^2 = 679 kN/m
>
> This exceeds catalog max (500 kN/m). Use k = 500 kN/m:
> f_n = 5.63 Hz, r = 5.33, T = 0.037.
>
> **Recommendation:** Use 500 kN/m mount (stiffest available) with zeta = 0.1.

### Framing Feedback

**Criticism:** Option (C) was the strongest choice -- it identified mass uncertainty, transmissibility quantification, harmonics, vibration standards, mount arrangement, and startup transients. This is a comprehensive framing response.

**Better Alternative:** Option **(C)** was the best choice -- well done.

**Grade: A** -- Comprehensive identification of all relevant framing issues.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's current solution?

- **(A)** The transmissibility formula is wrong -- it should be T = r^2/(r^2 - 1)
- **(B)** The AI recommends the stiffest mount (500 kN/m), but for vibration isolation, softer mounts give lower natural frequency, higher frequency ratio, and better isolation. The stiffest mount is actually the worst choice from the catalog for isolation performance.
- **(C)** The AI recommends the stiffest mount (worst for isolation); the undamped transmissibility formula ignores the damping tradeoff (damping worsens high-frequency isolation); the unbalanced force magnitude F_0 is assumed without basis; and harmonic content of the compressor is not analyzed
- **(D)** The calculation is correct and 96.3% isolation is adequate
- **(E)** The damping ratio of 0.1 is too high -- it should be exactly zero for perfect isolation

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Try k = 400 kN/m instead"
- **(B)** "For isolation, softer mounts give better performance (higher r, lower T). Recalculate using the softest mount (50 kN/m) and compare all catalog options. Include a transmissibility curve from 0 to 100 Hz showing the resonance peak and operating point. Mark the 2nd and 3rd harmonics (60, 90 Hz) on the curve."
- **(C)** "The calculation is fine -- just provide more decimal places"
- **(D)** "Use negative stiffness mounts for zero transmissibility"
- **(E)** "Remove all damping to improve high-frequency isolation"

**Student selects: (B)**

#### Updated AI Output

> **Corrected -- softest mount gives best isolation:**
>
> | k (kN/m) | f_n (Hz) | r (at 30 Hz) | T        | delta_static (cm) |
> |----------|----------|--------------|----------|---------------------|
> | 50       | 1.78     | 16.9         | 0.0035   | 7.8                |
> | 100      | 2.52     | 11.9         | 0.0071   | 3.9                |
> | 200      | 3.56     | 8.43         | 0.014    | 2.0                |
> | 300      | 4.36     | 6.88         | 0.022    | 1.3                |
> | 500      | 5.63     | 5.33         | 0.037    | 0.8                |
>
> The softest mount (50 kN/m) gives 10x better isolation than the stiffest (500 kN/m).
>
> However, delta_static = 7.8 cm for the 50 kN/m mount -- excessive for a rooftop installation.
>
> At harmonics (k = 100 kN/m): T(60 Hz) = 0.0018, T(90 Hz) = 0.00079.

#### Judging Feedback

**Criticism:** The student correctly identified the most critical error -- the AI recommended the worst mount from the catalog. However, option (C) was more comprehensive, also catching the damping tradeoff issue, the unjustified force assumption, and the missing harmonic analysis. The student found the primary error but missed secondary concerns.

**Better Alternative:** Option **(C)** -- includes everything in (B) plus damping tradeoff and harmonic concerns.

**Grade: A** -- Identified the most impactful error immediately, but missed secondary issues.

#### Steering Feedback

**Criticism:** Option (B) was excellent -- it explains the physics principle, requests a comparative analysis across all catalog options, and asks for the transmissibility curve with harmonics. This was the best available option.

**Better Alternative:** Option **(B)** was the best choice -- well done.

**Grade: A** -- Comprehensive, physics-based correction that transformed a wrong answer into a useful design tool.

---

### Cycle 2

**Current AI Output:** *(corrected comparison table as shown above)*

#### Judging Sub-step

Which issues remain?

- **(A)** Whether the building structure natural frequency could coincide with f_n = 2.52 Hz, causing coupled resonance
- **(B)** The mass uncertainty -- "several hundred kilograms" spans 200-800 kg. With k = 100 kN/m, this changes f_n from 1.78 Hz (800 kg) to 3.56 Hz (200 kg), and static deflection from 7.8 cm to 2.0 cm. The mount selection depends critically on the actual mass.
- **(C)** Whether the vibration isolation addresses the tenants' complaint -- a "constant hum" might be airborne acoustic noise rather than structure-borne vibration
- **(D)** All of the above -- mass sensitivity, structural resonance, and airborne noise path should all be investigated
- **(E)** Nothing -- the design is complete

**Student selects: (D)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Check the building structural resonance frequency"
- **(B)** "Three issues remain: (1) The compressor mass is uncertain (200-800 kg) -- show how f_n, T, and delta_static change across this range for k = 100 kN/m. (2) Verify that the building roof structural frequency is not close to f_n. (3) Assess whether the 'constant hum' could be airborne acoustic noise rather than structure-borne vibration -- if so, vibration isolation alone will not solve the problem."
- **(C)** "Just pick a mass and finish the design"
- **(D)** "Add a second set of isolators for redundancy"
- **(E)** "The design is complete -- write the specification sheet"

**Student selects: (B)**

#### Updated AI Output

> **1. Mass sensitivity (k = 100 kN/m):**
>
> | Mass (kg) | f_n (Hz) | delta_static (cm) | T at 30 Hz | Comment |
> |-----------|----------|---------------------|------------|---------|
> | 200       | 3.56     | 2.0                | 0.014      | Good    |
> | 400       | 2.52     | 3.9                | 0.0071     | Good    |
> | 600       | 2.06     | 5.9                | 0.0048     | Deflection marginal |
> | 800       | 1.78     | 7.8                | 0.0035     | Deflection excessive |
>
> **Action:** Weigh the compressor before finalizing mount selection. For m > 500 kg, use k = 200 kN/m.
>
> **2. Structural resonance:**
> Typical concrete roof deck: first vertical mode 15-30 Hz. If f_roof approximates 30 Hz (coinciding with compressor), the isolator helps by decoupling the source. If f_roof approximates f_n = 2.5 Hz, the isolated system could excite the roof -- unlikely since 2.5 Hz is well below typical roof frequencies.
>
> **3. Airborne vs. structure-borne:**
> At 30 Hz, structure-borne transmission dominates for rooftop equipment. However, if isolation is installed and the hum persists, the path is airborne. Diagnostic: support compressor on thick foam temporarily -- if hum decreases, path is structural.
>
> **Specification:**
> - Mount: k = 100-200 kN/m (selected after weighing), 4 mounts
> - Damping: zeta = 0.15
> - Expected T at 30 Hz: 0.007-0.014 (99%+ isolation)
> - Verify by post-installation vibration measurement on roof deck

#### Judging Feedback

**Criticism:** The student correctly identified that all three issues (mass sensitivity, structural resonance, airborne noise) should be investigated. This shows excellent engineering judgment -- real design problems rarely have a single remaining issue.

**Better Alternative:** Option **(D)** was the best choice -- well done.

**Grade: A** -- Comprehensive issue identification.

#### Steering Feedback

**Criticism:** Option (B) was the optimal correction -- it addresses all three issues with specific analysis requests and leads to actionable design outputs.

**Better Alternative:** Option **(B)** was the best choice -- well done.

**Grade: A** -- Well-structured, multi-issue correction that drove the design to a practical conclusion.

---

### Cycle 3 (Final)

**Current AI Output:** *(specification as shown above)*

#### Judging Sub-step

Is the final specification adequate?

- **(A)** No -- it needs to specify the exact bolt pattern and mount dimensions
- **(B)** Yes -- it provides key design parameters (stiffness, damping, transmissibility), addresses the operating range and harmonics, includes the transient concern, and requires post-installation verification. The conditional approach (measure before selecting) is appropriate given the uncertain mass.
- **(C)** No -- the specification should include a full finite element analysis of the roof structure
- **(D)** No -- the damping ratio should be exactly 0.1, not 0.15
- **(E)** No -- the specification does not address the color of the mounts

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done**

#### Judging Feedback

**Criticism:** Option (B) is correct -- the specification is adequate for a preliminary engineering recommendation. It covers essential parameters, acknowledges uncertainties, and includes a verification step.

**Better Alternative:** Option **(B)** was the best choice -- well done.

**Grade: A** -- Appropriate assessment of specification completeness.

---

## COMPLETION

### Final Grades

| Skill    | Grade |
|----------|-------|
| Framing  | A     |
| Judging  | A     |
| Steering | A     |

### Summary Feedback

Outstanding performance across all three skills. The student demonstrated a deep understanding of forced oscillation physics and its engineering applications. The key insight -- that softer springs give better isolation -- was caught immediately when the AI got it backwards. The framing was exceptionally thorough, identifying mass uncertainty, harmonics, vibration standards, mount configuration, and startup transients. Steering was consistently precise and multi-faceted, combining physics principles with practical engineering concerns. This session illustrates strong CoReason performance: comprehensive framing, precise judging that catches both primary and secondary issues, and well-structured steering that converges on a physically sound and practically implementable design.
