# Session 2 — Elevator Emergency Braking System (Multiple Choice)

**Challenge:** Newton's Laws > Dynamics > Friction
**Mode:** Multiple Choice
**Student:** Sofia L.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Design the braking force profile for an elevator emergency braking system and produce a force-vs-time diagram. The elevator services a 20-story building and carries "up to 10 people." The brake must stop the elevator within one floor of travel after cable failure. The building owner says passengers should not experience "dangerous deceleration." Specify the required brake pad normal force and minimum coefficient of friction for the rail clamp mechanism.

### Framing Options Presented

Which assumptions and constraints should you establish before the AI generates a solution?

- **(A)** Assume the elevator weighs 2000 kg total, use mu = 0.3 for steel on steel, and calculate the stopping force. The problem is mostly specified already.
- **(B)** Identify that car mass, passenger mass range, floor height, and operating speed are all unspecified; note that "dangerous deceleration" must be quantified using safety codes; question whether static or kinetic friction applies during braking
- **(C)** Identify all parameters in (B), plus: the brake must work across a range of loads (empty to full) and must satisfy the deceleration constraint at both extremes; the friction coefficient varies with speed and temperature; detection delay before braking begins must be estimated; the force profile shape (constant vs. progressive) affects jerk and passenger comfort
- **(D)** The problem is straightforward — just calculate F = mu * mg and check if it stops within one floor
- **(E)** Focus only on maximum load — brakes are always designed for the heaviest case and lighter loads are safe automatically

**Student selects: (E)**

### AI Solution (Generated from Student's Framing)

> Assuming 10 passengers x 75 kg = 750 kg, car mass 1000 kg, total 1750 kg.
> Floor height 3.5 m. Detection delay 0.5 s, so v = 4.9 m/s at brake engagement.
> Free-fall distance during delay: 1.225 m. Remaining stopping distance: 2.275 m.
>
> Required deceleration: a = v²/(2d) = 5.28 m/s²
> Brake force: F = m(a + g) = 1750 x 15.08 = 26,390 N
> With mu = 0.3: N = 26,390/(2 x 0.3) = 43,983 N per rail
>
> Passenger deceleration: 0.54g — safe.

### Framing Feedback

**Criticism:** Option (E) is incorrect. Designing brakes for maximum load only is dangerous — the same brake force applied to an empty car (1000 kg) produces a deceleration of (26,390/1000 - 9.8) = 16.6 m/s² = 1.69g, which may exceed safety limits. The critical insight is that a braking system must satisfy two constraints simultaneously: sufficient force to stop a heavy car within one floor, AND limited force to avoid injuring passengers in a light car. Option (C) was the strongest choice, covering load range, friction regimes, detection delay, and force profile shape.

**Better Alternative:** Option **(C)** — comprehensively identifies all design-critical ambiguities including the dual-constraint load-range problem.

**Grade: C** — Selected an answer that misses the fundamental dual-constraint nature of the problem.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's current solution?

- **(A)** The force profile should be sinusoidal, not constant — all braking systems oscillate
- **(B)** The AI only analyzed the fully loaded case. At this brake force, an empty car (1000 kg) would decelerate at (26,390/1000 - 9.8) = 16.6 m/s² = 1.69g, which may exceed safety limits
- **(C)** The friction coefficient of 0.3 is too high — steel on steel has mu = 0.01
- **(D)** The AI only analyzed the fully loaded case and the empty-car deceleration exceeds limits; additionally, the step-function force profile is unrealistic (no physical actuator achieves zero ramp time) and mu = 0.3 for steel-on-steel is for clean, dry conditions — contamination, speed, and heating all reduce the effective kinetic friction
- **(E)** The solution is correct and complete — no significant issues

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Reduce the brake force by 50% to protect empty-car passengers"
- **(B)** "Analyze both the fully loaded (1750 kg) and empty car (1000 kg) cases with the same brake force. Verify that stopping distance < 3.5 m for the loaded case AND deceleration < 1g for the empty case. If both cannot be satisfied, propose a load-adaptive braking strategy."
- **(C)** "Add more passengers to the empty car to solve the deceleration problem"
- **(D)** "Switch from friction brakes to magnetic brakes to eliminate load sensitivity"
- **(E)** "The 1.69g deceleration is fine — astronauts handle 8g routinely"

**Student selects: (B)**

#### Updated AI Output

> **Dual-constraint analysis:**
>
> Constraint 1 (loaded): F_brake >= m_max(a_min + g) where a_min = v²/(2d) = 5.28 m/s²
> F_brake >= 1750 x 15.08 = 26,390 N
>
> Constraint 2 (empty): F_brake <= m_min(a_max + g) where a_max = 1g = 9.8 m/s²
> F_brake <= 1000 x 19.6 = 19,600 N
>
> **Conflict:** F_brake must be >= 26,390 N AND <= 19,600 N — impossible with constant force!
>
> **Solution: Load-sensing progressive brake**
> - Load cell measures car weight and adjusts brake spring pre-load
> - Loaded: F_brake = 26,400 N (a = 0.54g for passengers)
> - Empty: F_brake = 19,600 N (a = 1.0g, no passengers at risk)
> - Half-loaded (1375 kg): F_brake = 22,000 N (a = 0.78g)

#### Judging Feedback

**Criticism:** The student correctly identified the load-dependent deceleration issue as the most significant error. However, option (D) was more complete — it also caught the unrealistic step-function force profile and the friction coefficient concerns. The student found the primary issue but missed secondary ones.

**Better Alternative:** Option **(D)** — includes load-range, force profile, and friction concerns.

**Grade: B** — Caught the most critical issue but missed secondary problems.

#### Steering Feedback

**Criticism:** Option (B) was excellent — it explicitly stated both constraints, asked the AI to check feasibility, and requested an alternative if infeasible. This was the best available steering command.

**Better Alternative:** Option **(B)** was the best choice — well done.

**Grade: A** — Well-structured correction that led the AI to discover the fundamental design conflict.

---

### Cycle 2

**Current AI Output:** *(load-sensing design as shown above)*

#### Judging Sub-step

Which issues remain in the AI's updated solution?

- **(A)** The 0.5 s activation time is too slow — spring mechanisms take at least 5 seconds
- **(B)** The design assumes a constant friction coefficient, but during braking the rail surface heats up, potentially causing friction fade; also the step-function engagement produces infinite jerk at the moment of clamping
- **(C)** The gravitational constant should be adjusted for the building's altitude above sea level
- **(D)** The design is complete and correct — no further analysis needed
- **(E)** The spring mechanism will create dangerous resonance in the building structure

**Student selects: (D)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Verify the color scheme of the brake housing matches building aesthetics"
- **(B)** "Perform a thermal analysis: estimate the energy dissipated during braking, calculate the brake pad temperature rise, and verify that friction fade does not compromise stopping performance. Also add a realistic force ramp-up time based on the spring actuator mechanism."
- **(C)** "Check if the brake system is compatible with 5G networks"
- **(D)** "No further analysis needed — submit the design as-is"
- **(E)** "Add a backup parachute system"

**Student selects: (D)**

#### Updated AI Output

> *(AI proceeds without correction, presenting the load-sensing design as final)*
>
> **Final design specification:**
>
> | Parameter | Value |
> |-----------|-------|
> | Brake type | Spring-loaded friction clamp, fail-safe |
> | Normal force per rail | 36,330–43,983 N (load-dependent) |
> | Minimum mu_kinetic | 0.30 |
> | Max stopping distance | 3.41 m |
> | Max passenger deceleration | 0.54g (full load) to 1.0g (empty) |
> | Activation time | 0.5 s |

#### Judging Feedback

**Criticism:** The student selected (D), missing the thermal analysis and force ramp concerns. Option (B) was correct: at 26 kN friction force and ~5 m/s sliding speed, power dissipated is ~130 kW. Surface flash temperatures can reach hundreds of degrees, potentially reducing mu below the assumed 0.30 minimum. Additionally, the step-function engagement produces theoretically infinite jerk, which is both physically unrealistic and could damage the brake mechanism. These are standard engineering checks that should not be skipped for a safety-critical system.

**Better Alternative:** Option **(B)** — addresses thermal verification and force profile realism.

**Grade: C** — Failed to identify physically important remaining concerns for a safety-critical system.

#### Steering Feedback

**Criticism:** The student selected (D), declining to send any correction. Option (B) was the appropriate choice — thermal analysis and actuator ramp-up are standard engineering verifications for friction brakes. Declaring the design complete without these checks is premature for a life-safety system.

**Better Alternative:** Option **(B)** — requests the two most important remaining verifications.

**Grade: C** — Prematurely declared the design complete, missing important safety verifications.

---

### Cycle 3 (Final)

**Current AI Output:** *(unchanged from above)*

#### Judging Sub-step

After instructor feedback highlighting the thermal gap, which assessment is correct?

- **(A)** Thermal analysis is irrelevant for friction brakes
- **(B)** A thermal analysis should verify that friction fade during the ~1 s braking event does not reduce mu below the design minimum, and the force ramp-up should be modeled with a realistic spring engagement time of 0.1–0.2 s
- **(C)** The brake pads should be cryogenically cooled during operation
- **(D)** Only quantum-mechanical friction models are acceptable for safety systems
- **(E)** Thermal effects are negligible because the braking event is short

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done** (after acknowledging the thermal gap)

#### Judging Feedback

**Criticism:** Option (B) is correct. The student recognized the thermal concern after feedback. While the braking event is short (~1 s), the high power density at the pad-rail interface produces significant surface flash temperatures that can reduce friction. A design for a safety-critical system must verify this.

**Better Alternative:** Option **(B)** was the best choice — well done.

**Grade: A** — Correct assessment after feedback, showing ability to learn within the session.

---

## COMPLETION

### Final Grades

| Skill    | Grade |
|----------|-------|
| Framing  | D     |
| Judging  | B     |
| Steering | B     |

### Summary Feedback

The student started with a significant framing error, assuming that designing for maximum load is sufficient and ignoring the load-range constraint. This is a common misconception — heavier loads need more force to stop, but lighter loads experience higher deceleration under the same force. The student recovered well in Cycle 1, correctly identifying the load-range issue and delivering an excellent steering command that exposed the fundamental design conflict. However, Cycle 2 showed premature closure — declaring the design complete without thermal analysis or force profile verification is a serious gap for a safety-critical system. The key lesson: for life-safety engineering, "it looks right" is never sufficient. Always ask: "What failure mode haven't I checked?"
