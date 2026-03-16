# Session 5 — Flywheel Energy Storage Sizing (Multiple Choice)

**Challenge:** Rotational Mechanics > Rotational Energy
**Mode:** Multiple Choice
**Student:** Diego M.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Calculate the dimensions and mass of a steel flywheel that can power a city bus through a 500-meter segment where overhead electric lines are absent. Produce a specification sheet listing the flywheel diameter, thickness, mass, operating speed range, and gyroscopic loads during turns. The bus "weighs about 12 tonnes fully loaded" and travels this segment "at normal city speed." The flywheel should be "compact enough to fit under the floor" and must deliver "enough energy to cover the gap comfortably."

### Framing Options Presented

Which assumptions and constraints should you establish before the AI generates a solution?

- **(A)** Just calculate (1/2)*I*omega^2 for a 1 m steel disk at 3000 RPM and check if it is enough energy. The problem is straightforward.
- **(B)** Quantify "normal city speed" (30-50 km/h), estimate the energy needed (rolling resistance + aerodynamic drag over 500 m), note that usable energy depends on the omega_max to omega_min ratio, and flag the centrifugal stress limit on maximum rotation speed
- **(C)** Identify all issues in (B), plus: account for drivetrain efficiency losses (10-20%); question whether the 500 m includes stops, grades, or acceleration phases; note that "comfortably" implies an energy margin; flag that "under the floor" constrains both diameter and thickness; and recognize that the problem explicitly asks for gyroscopic loads, which require specifying the flywheel axis orientation and typical turn geometry
- **(D)** The problem is unsolvable without knowing the exact route profile and traffic conditions
- **(E)** Assume the flywheel replaces the engine entirely and must power the bus for its full daily route

**Student selects: (B)**

### AI Solution (Generated from Student's Framing)

> **Flywheel Sizing:**
>
> Speed: 40 km/h = 11.1 m/s
> F_roll = 0.01 * 12000 * 9.8 = 1,176 N
> F_drag = (1/2) * 1.2 * 0.7 * 8 * 11.1^2 = 414 N
> E = (1176 + 414) * 500 = 795,000 J ~ 800 kJ
>
> Solid steel disk: diameter 1.0 m, thickness 0.2 m
> Mass: 1,232 kg, I = 154 kg*m^2
> With omega_min = 0.5*omega_max: usable E = 0.75 * (1/2) * I * omega_max^2
> omega_max = 1,124 RPM
>
> **Specification:** 1.0 m x 0.2 m, 1232 kg, 1124 RPM max.

### Framing Feedback

**Criticism:** Option (B) is good -- it quantifies speed, estimates energy correctly, identifies the usable energy concept, and flags centrifugal stress. However, it misses drivetrain efficiency losses, the possibility of stops/grades within the segment, the "comfortably" margin requirement, the physical size constraint translation, and the gyroscopic load analysis that the problem explicitly requests. Option (C) covered all of these additional concerns.

**Better Alternative:** Option **(C)** -- comprehensively addresses energy, efficiency, geometry, margin, and gyroscopic requirements.

**Grade: B** -- Good physics but missed practical engineering considerations and problem-specific requirements.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's current solution?

- **(A)** The rolling resistance coefficient of 0.01 is too low -- it should be 0.1
- **(B)** No centrifugal stress check; no gyroscopic load analysis; the flywheel mass increases bus weight (circular dependency); and no drivetrain efficiency factor
- **(C)** No centrifugal stress check; no gyroscopic load analysis; the flywheel mass increases bus weight; no drivetrain efficiency factor; the 1,232 kg flywheel is 10% of bus mass which significantly affects the energy calculation; and the omega_min/omega_max = 0.5 ratio is assumed without drivetrain justification
- **(D)** The solution is correct and complete
- **(E)** The aerodynamic drag formula is applied incorrectly

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Make the flywheel bigger"
- **(B)** "Check centrifugal stress: compute sigma = rho * v_rim^2 at maximum rim speed and verify it is below the yield strength of steel. Also compute the gyroscopic torque during a turn (radius 20 m at 40 km/h): tau = I*omega * Omega_turn. Apply 15% drivetrain loss to the energy budget."
- **(C)** "Check centrifugal stress using the solid disk formula (include Poisson ratio). Compute gyroscopic torque during a turn at radius 20 m. Account for the flywheel mass increasing the bus weight (iterative calculation). Apply 15% drivetrain loss. And verify the physical dimensions fit the underfloor space constraint (approximately 2.5 m x 1.5 m x 0.5 m)."
- **(D)** "Just increase RPM to 10,000 to store more energy in a smaller flywheel"
- **(E)** "Replace the steel flywheel with a carbon fiber one"

**Student selects: (B)**

#### Updated AI Output

> **1. Centrifugal stress:**
> Rim speed: v_rim = omega * r = 117.7 * 0.5 = 58.9 m/s
> Hoop stress: sigma_max = (3+nu)/8 * rho * omega^2 * r^2
> = 0.4125 * 7850 * 117.7^2 * 0.25 = 11.2 MPa
> Yield strength (mild steel): 250 MPa. Safety factor: 22. OK.
>
> **2. Gyroscopic torque:**
> Turn: Omega_turn = v/R = 11.1/20 = 0.555 rad/s
> L = I*omega = 154 * 117.7 = 18,126 kg*m^2/s
> tau = L * Omega = 18,126 * 0.555 = 10,060 N*m ~ 10 kN*m
>
> This produces a pitching moment. With track width 2.5 m:
> Load transfer: 10,060/2.5 = 4,024 N per side (~410 kg equivalent)
> On a ~13,000 kg bus: ~6% load transfer -- noticeable but manageable.
>
> **3. With 15% drivetrain loss:**
> E_required = 800,000/0.85 = 941,000 J
> New omega_max = sqrt(941,000 / (0.75*0.5*154)) = 127.8 rad/s = 1,220 RPM

#### Judging Feedback

**Criticism:** The student identified four of the key issues (stress, gyroscopic, mass circularity, efficiency). However, option (C) was more comprehensive -- it also caught the unjustified omega ratio and the physical dimension constraint. The student found the primary issues but missed secondary concerns.

**Better Alternative:** Option **(C)** -- includes everything in (B) plus omega ratio justification and dimension check.

**Grade: A** -- Good identification of critical missing checks, but incomplete.

#### Steering Feedback

**Criticism:** Option (B) was good -- specific formulas, concrete scenario (R = 20 m), and the efficiency correction. However, option (C) was stronger -- it also addressed the mass circularity explicitly, the physical envelope, and used the more accurate stress formula with Poisson ratio. The student's steering addressed the most important issues.

**Better Alternative:** Option **(C)** -- more comprehensive while still actionable.

**Grade: A** -- Specific and effective, but missed some scope.

---

### Cycle 2

**Current AI Output:** *(stress and gyro checked version as shown above)*

#### Judging Sub-step

Which issues remain?

- **(A)** The flywheel should be made of titanium instead of steel for better performance
- **(B)** The gyroscopic torque of 10 kN*m is significant and should be mitigated; the physical dimensions have not been verified against the underfloor constraint; and windage losses at 1,220 RPM have not been estimated
- **(C)** The gyroscopic torque should be mitigated (counter-rotating flywheels); windage losses need estimation; the physical envelope needs verification; and a 30% energy margin should be added for the "comfortably" requirement, potentially including a stop-start cycle
- **(D)** The solution is now complete
- **(E)** The bus should use a battery instead of a flywheel

**Student selects: (C)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Add counter-rotating flywheels"
- **(B)** "Redesign with two counter-rotating flywheels to cancel gyroscopic torque. Estimate windage losses over the 45 s traversal (if in air vs. vacuum housing). Verify the total package fits under the bus floor (envelope ~2.5 x 1.5 x 0.5 m). Add 30% energy margin to the budget to cover the gap 'comfortably,' including one regenerative stop-start cycle."
- **(C)** "The design is complete -- write the final spec sheet"
- **(D)** "Increase the flywheel speed to 5,000 RPM to reduce size"
- **(E)** "Add a backup diesel engine for the 500 m segment"

**Student selects: (B)**

#### Updated AI Output

> **Counter-rotating redesign:**
>
> Two flywheels, each 0.8 m diameter, 0.15 m thick:
> Mass each: 592 kg (total 1,184 kg)
> I_each = 47.4 kg*m^2 (total 94.8 kg*m^2)
> Gyroscopic torque: cancelled. OK.
>
> **Windage analysis:**
> In air at 1,600 RPM: P_wind ~ 2,300 W. Over 45 s: 104 kJ (10% of stored energy).
> In vacuum (~1 mbar): P_wind ~ 2 W. Loss negligible.
> Recommendation: vacuum housing required.
>
> **Energy budget with 30% margin:**
> Base: 941 kJ (with drivetrain loss)
> Stop-start (regenerative, 20% loss): +162 kJ
> Subtotal: 1,103 kJ. With 30% margin: 1,434 kJ.
>
> omega_max = sqrt(1,434,000 / (0.75 * 47.4)) = 200.8 rad/s = 1,917 RPM
> Stress: 19.8 MPa (SF > 12). OK.
>
> **Envelope:** Two units at 0.9 m diameter x 0.25 m tall, side by side with CVT:
> Total: 2.3 x 0.9 x 0.30 m -- fits within 2.5 x 1.5 x 0.5 m. OK.
>
> **Final specification:**
>
> | Parameter | Value |
> |-----------|-------|
> | Configuration | Two counter-rotating steel disks, vacuum housing |
> | Diameter | 0.80 m each |
> | Thickness | 0.15 m each |
> | Mass | 592 kg each (1,184 kg total) |
> | Max speed | 1,917 RPM |
> | Min speed | 959 RPM |
> | Usable energy | 1,434 kJ |
> | Max hoop stress | 19.8 MPa (SF > 12) |
> | Gyroscopic torque | Cancelled |
> | Housing | Vacuum, sealed bearings |
> | Envelope | 2.3 x 0.9 x 0.30 m |

#### Judging Feedback

**Criticism:** The student identified all major remaining issues -- gyroscopic mitigation, windage, envelope, and energy margin. This was the most complete option available.

**Better Alternative:** Option **(C)** was the best choice -- well done.

**Grade: A** -- Comprehensive identification of all remaining design concerns.

#### Steering Feedback

**Criticism:** Option (B) was excellent -- it addressed all four remaining issues with specific parameters and clear success criteria. The result is a complete, physically realistic specification.

**Better Alternative:** Option **(B)** was the best choice -- well done.

**Grade: A** -- Comprehensive, specific, and drove the design to a complete specification.

---

### Cycle 3 (Final)

**Current AI Output:** *(final specification as shown above)*

#### Judging Sub-step

Is the specification adequate?

- **(A)** No -- the specification needs finite element analysis of the flywheel stress distribution before it can be considered
- **(B)** Mostly adequate, but missing one critical safety concern: a 592 kg disk spinning at 1,917 RPM stores over 700 kJ per flywheel. If it fragments, this energy is released as high-velocity shrapnel. The specification should include containment requirements.
- **(C)** Yes -- the specification is complete and covers all necessary parameters
- **(D)** No -- the bus should use batteries instead
- **(E)** No -- the specification needs to account for the color of the housing

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done** (noting containment as a requirement for detailed design phase)

#### Judging Feedback

**Criticism:** Option (B) is correct -- containment is a critical safety requirement for high-energy flywheels. A fragment from a 592 kg disk at 1,917 RPM could penetrate the bus floor and passenger compartment. The specification should at minimum state the containment requirement, even if detailed design is deferred.

**Better Alternative:** Option **(B)** was the best choice -- well done.

**Grade: A** -- Identified the critical safety gap that other options missed.

---

## COMPLETION

### Final Grades

| Skill    | Grade |
|----------|-------|
| Framing  | B     |
| Judging  | A     |
| Steering | A     |

### Summary Feedback

The student delivered a good framing that captured the core physics (energy budget, usable energy, stress limit) but missed practical engineering concerns (drivetrain losses, margin, gyroscopic requirements explicitly requested by the problem). Performance improved significantly through the cycles. In Cycle 1, the student identified the key missing safety checks (stress, gyroscopic) and addressed them effectively. In Cycle 2, the student caught all remaining issues and delivered a comprehensive steering command that produced a complete specification. The final cycle showed excellent judgment in identifying the containment safety gap -- a subtle but critical concern that distinguishes engineering analysis from physics calculation. The key takeaway: rotational energy storage design requires integrating energy capacity, material strength, parasitic losses, gyroscopic effects, packaging constraints, and failure safety into a single coherent specification.
