# Session 1 — Trebuchet Range Prediction (Open-Ended)

**Challenge:** Build a computational model that predicts the landing distance of a counterweight trebuchet launching a pumpkin at a harvest festival.
**Response Mode:** Open-ended (structured sections)

---

## Phase 1 — Framing

### Raw Problem

> Build a computational model that predicts the landing distance of a counterweight trebuchet launching a pumpkin at a harvest festival. The organizers say the field is "a few hundred meters long" and want to know where to set up the safety perimeter. Produce a range map showing landing zones for different counterweight masses (100 kg to 500 kg). The trebuchet arm is "about 6 meters" and the pumpkin weighs "around 5 kg." Assume the release happens "near the top of the swing."

### Student Response (Structured Sections)

**Assumptions & Missing Information:**
The problem leaves several things unclear. The launch angle is not specified — "near the top of the swing" is vague. I'll assume a 45° launch angle since that maximizes range. The arm length is "about 6 meters" — I'll use 6 m exactly. The release height above the ground is not given; I'll estimate 7 m (arm length plus pivot height ~1 m). Air resistance is not mentioned so I'll ignore it.

**Approach:**
I will use energy conservation to estimate the launch speed from the counterweight potential energy, then apply the standard range equation R = v₀² sin(2θ) / g. I'll sweep counterweight mass from 100 to 500 kg and produce a table of landing distances.

**Key Equations:**
- Energy: mgh = ½Mv₀² → v₀ = √(2mgh/M) where m = counterweight mass, M = pumpkin mass, h = drop height of counterweight
- Range: R = v₀² sin(2θ) / g

**Concerns:**
I'm not sure about the counterweight drop height or the exact geometry of the trebuchet arm (ratio of long arm to short arm). Also, the problem says "a few hundred meters" for the field — I should check if my predictions are consistent with this.

### AI Solution (with issues)

The AI produces:

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

**What the student did well:**
- Identified that the launch angle is ambiguous and flagged it
- Recognized that air resistance is not mentioned
- Noted the arm geometry issue (long arm vs. short arm ratio)
- Attempted to connect the counterweight energy to launch speed

**What the student missed:**
- Did not question the assumption that 100% of the counterweight's PE converts to the pumpkin's KE — real trebuchets have significant inefficiency (arm inertia, counterweight motion at release)
- Accepted the 45° angle without questioning whether the trebuchet's geometry actually permits it; trebuchets typically release at angles well below 45°
- Did not flag that the problem specifies no coordinate system or reference heights for landing vs. launch elevation
- Did not note the missing pivot height or the arm ratio (short arm : long arm), which fundamentally determines the release conditions
- Did not raise the possibility of wind or terrain slope

**Framing Grade:** B- — Several key ambiguities identified but important physics gaps remain, particularly around energy transfer efficiency and geometric constraints on launch angle.

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### AI Output

> I've refined the model. Using θ = 45° and incorporating the release height h_release = 7 m above ground:
>
> R = (v₀² sin(2θ))/g + v₀ cos(θ) × √(2h_release/g)
>
> This accounts for the projectile being launched from above ground level. Updated table:
>
> | Counterweight (kg) | v₀ (m/s) | Range (m) |
> |---------------------|----------|-----------|
> | 100                 | 15.3     | 38.2      |
> | 200                 | 21.7     | 66.5      |
> | 300                 | 26.5     | 93.1      |
> | 400                 | 30.6     | 119.8     |
> | 500                 | 34.3     | 147.5     |
>
> Air drag is neglected since pumpkins are relatively compact objects.

#### Judging (internal — not sent to AI)

gaps:
  - name: "The AI still assumes 100% energy transfer from"
    description: "The AI still assumes 100% energy transfer from counterweight to pumpkin. In practice, the trebuchet arm has significant mass and rotational inertia, absorbing 40–60% of the energy. The ranges are therefore grossly overestimated."
  - name: "The formula for range with elevated launch is incorrect"
    description: "The formula for range with elevated launch is incorrect — it doesn't properly solve the quadratic for time of flight with asymmetric trajectory."
  - name: "Claiming pumpkins are"
    description: "Claiming pumpkins are"

#### Steering (sent to AI)

instructions:
  - name: "Your energy conversion assumes all counterweight PE goes"
    description: "Your energy conversion assumes all counterweight PE goes to the pumpkin. The arm itself has mass and rotational inertia — include the arm's energy share. Also, the range formula for asymmetric trajectory (launch height ≠ landing height) needs the full quadratic solution for flight time: y = h₀ + v₀ sin(θ) t − ½gt² ="
  - name: "Finally, estimate the drag force on the pumpkin"
    description: "Finally, estimate the drag force on the pumpkin (diameter ~0.3 m, Cd ≈ 0.5) and assess whether it significantly reduces range."

#### Updated AI Output

> Corrected model:
>
> **Energy partition:** The arm (mass m_arm ≈ 40 kg, length L = 6 m) has moment of inertia I_arm = ⅓ m_arm L². The total KE at release is split: ½Mv₀² + ½I_arm ω², where v₀ = ωL. Solving: mgh = ½(M + m_arm/3)v₀², giving v₀ = √(2mgh/(M + m_arm/3)).
>
> **Trajectory:** Solving y = 7 + v₀ sin(θ) t − ½gt² = 0 for t > 0, then R = v₀ cos(θ) t.
>
> **Drag estimate:** F_drag = ½ρCdAv² ≈ ½(1.2)(0.5)(0.07)(30²) ≈ 19 N. Compared to weight (49 N), drag is ~39% of weight — significant. Applying a rough drag correction factor of 0.7:
>
> | Counterweight (kg) | v₀ (m/s) | Range no drag (m) | Range w/ drag (m) |
> |---------------------|----------|--------------------|---------------------|
> | 100                 | 12.1     | 24.3               | 17.0                |
> | 200                 | 17.1     | 45.8               | 32.1                |
> | 300                 | 20.9     | 66.2               | 46.3                |
> | 400                 | 24.2     | 87.1               | 61.0                |
> | 500                 | 27.0     | 107.5              | 75.3                |

#### Judging Feedback

- Correctly incorporated arm inertia into the energy balance — good improvement
- Drag estimation is reasonable in order of magnitude
- However, applying a constant "drag correction factor of 0.7" is physically unjustified; drag depends on velocity which changes throughout flight, requiring numerical integration
- The arm mass of 40 kg is assumed without stating it as an assumption
- Still uses 45° launch angle without geometric justification

**Judging Grade:** B- — Key issues identified (energy partition, drag significance) but the correction methods applied are oversimplified.

#### Steering Feedback

- The steering command correctly targeted the energy transfer issue — this was the highest-priority error
- Appropriately directed the AI to assess drag quantitatively rather than dismiss it
- Could have also challenged the 45° launch angle assumption, which remains unaddressed
- The trajectory formula fix was well-directed

**Steering Grade:** B — Effective prioritization of the energy issue, but left the launch angle assumption unchallenged.

---

### Cycle 2

#### AI Output

> Addressing remaining concerns — the launch angle for a trebuchet is set by geometry, not optimization. For a typical trebuchet with sling, release occurs when the arm is ~30–40° past vertical. With a sling of length ≈ 0.7L, the effective launch angle is typically 40–55°. I'll use θ = 40° as representative.
>
> For drag, I'll integrate numerically using Euler's method with Δt = 0.01 s:
>
> ax = −(½ρCdA/m) × vx × |v|
> ay = −g − (½ρCdA/m) × vy × |v|
>
> Using ρ = 1.2 kg/m³, Cd = 0.47 (sphere), A = π(0.15)² = 0.071 m², m = 5 kg:
>
> | Counterweight (kg) | v₀ (m/s) | θ = 40° | Range w/ drag (m) | Max height (m) |
> |---------------------|----------|---------|---------------------|----------------|
> | 100                 | 12.1     | 40°     | 14.8                | 10.4           |
> | 200                 | 17.1     | 40°     | 27.6                | 17.1           |
> | 300                 | 20.9     | 40°     | 39.8                | 23.3           |
> | 400                 | 24.2     | 40°     | 52.1                | 29.7           |
> | 500                 | 27.0     | 40°     | 63.5                | 35.5           |
>
> **Safety perimeter recommendation:** Set perimeter at 80 m to provide margin over the maximum predicted range of 63.5 m with the largest counterweight. Add ±15° lateral scatter zone for crosswind or asymmetric release.

#### Judging (internal — not sent to AI)

gaps:
  - name: "Good: Now uses a geometrically motivated launch angle"
    description: "Good: Now uses a geometrically motivated launch angle (40°) instead of the idealized 45° - Good: Numerical integration of drag is the correct approach - Issue: The counterweight drop height h is still assumed to equal the full arm length (6 m), but if the arm ratio is, say, 4:2 (long:short), the counterweight only drops ~2 m. This dramatically reduces launch speed. - Issue: No sensitivity analysis or uncertainty bounds on the range predictions — the problem has many uncertain parameters"

#### Steering (sent to AI)

instructions:
  - name: "Good progress on the launch angle and drag integration"
    description: "Good progress on the launch angle and drag integration. However, the counterweight drop height depends on the arm ratio (long arm : short arm), which you've left unspecified. If the pivot splits the 6 m arm as 4.5 m (long, projectile side) and 1.5 m (short, counterweight side), the counterweight drops only ~1.5 m, not 6 m. Recalculate with a realistic arm ratio"
  - name: "given the many uncertain parameters, provide a"
    description: "given the many uncertain parameters, provide a sensitivity analysis: how does range vary with ±20% in counterweight mass, ±10° in launch angle, and ±30% in arm ratio?"

#### Updated AI Output

> **Corrected geometry:** Assuming arm ratio 3:1 → long arm = 4.5 m, short arm = 1.5 m. Counterweight drops h = 1.5 m (short arm length).
>
> v₀ = √(2m_cw × g × 1.5 / (M_pumpkin + m_arm/3))
>
> | Counterweight (kg) | v₀ (m/s) | Range w/ drag (m) |
> |---------------------|----------|---------------------|
> | 100                 | 6.1      | 4.2                 |
> | 200                 | 8.6      | 8.1                 |
> | 300                 | 10.5     | 11.9                |
> | 400                 | 12.1     | 15.5                |
> | 500                 | 13.5     | 19.0                |
>
> These are much shorter than initially predicted. The initial model was overestimating by 3–4×.
>
> **Sensitivity analysis (500 kg counterweight case):**
> - Launch angle 30°–50°: Range varies 15.2 – 19.8 m (±13%)
> - Counterweight ±20%: Range varies 15.7 – 22.4 m (±18%)
> - Arm ratio 2.5:1 to 3.5:1: Range varies 14.1 – 25.3 m (±33%)
>
> The arm ratio is the dominant source of uncertainty. Safety perimeter: 30 m minimum, 50 m recommended with margin.

#### Judging Feedback

- Excellent correction on the arm geometry — this changed predictions by a factor of 3–4, which is exactly the kind of error the student should catch
- Sensitivity analysis correctly identifies arm ratio as the dominant uncertainty
- The ranges now seem physically low for a large trebuchet; the model may be underestimating because it ignores the sling's mechanical advantage, which effectively increases the release velocity
- Still no mention of the counterweight's residual velocity at release (in hinged-counterweight designs, the CW swings, recovering more energy)

**Judging Grade:** B+ — Strong identification of the geometry error and good sensitivity analysis. Minor issue with sling mechanics unaddressed.

#### Steering Feedback

- Excellent steering — targeting the arm ratio was the most impactful correction remaining
- The sensitivity analysis request was well-formulated and yielded actionable results
- Could have additionally probed the sling effect, but the priority was correct

**Steering Grade:** B+ — Well-targeted correction that dramatically improved the model's physical realism.

---

### Cycle 3

#### AI Output

> **Final model with sling correction:**
>
> The sling (length ≈ 0.7 × long arm = 3.15 m) acts as a second lever, increasing the tip speed. Effective release speed: v_tip = ω × (L_long + L_sling) = ω × 7.65 m. This increases v₀ by a factor of 7.65/4.5 = 1.7.
>
> | Counterweight (kg) | v₀ (m/s) | Range w/ drag (m) | Range band (m) |
> |---------------------|----------|---------------------|-----------------|
> | 100                 | 10.3     | 11.2                | 7 – 16          |
> | 200                 | 14.6     | 21.8                | 14 – 31         |
> | 300                 | 17.9     | 32.0                | 21 – 46         |
> | 400                 | 20.6     | 42.0                | 27 – 60         |
> | 500                 | 23.0     | 51.8                | 34 – 74         |
>
> **Safety perimeter recommendation:** 80 m radius from trebuchet, with 100 m in the forward direction. Lateral exclusion zone ±25° from launch direction.
>
> **Key assumptions stated:**
> 1. Arm ratio 3:1, arm mass 40 kg
> 2. Sling length 0.7 × long arm
> 3. Launch angle 40° ± 10°
> 4. 100% energy transfer (upper bound; actual ~60–70%)
> 5. Cd = 0.47, pumpkin diameter 0.3 m

#### Judging (internal — not sent to AI)

gaps:
  - name: "Model is now physically reasonable with multiple"
    description: "Model is now physically reasonable with multiple corrections applied - Range bands provide useful safety information - Assumption #4 is inconsistent — the text says 100% energy transfer but earlier the arm inertia was included. Should clarify this is the arm-corrected transfer, not truly 100% - Overall a good final model with appropriate caveats Final Judging assessment: The student successfully improved the model through three cycles, catching energy partition, geometry, and drag issues."

---

## Final Grades

| Skill     | Grade | Comments |
|-----------|-------|----------|
| Framing   | B  | Identified several ambiguities but missed arm geometry, energy efficiency, and geometric constraints on launch angle |
| Judging   | B  | Caught energy and drag issues in Cycle 1, geometry error in Cycle 2; missed sling effect until Cycle 3 |
| Steering  | B  | Well-prioritized corrections that led to order-of-magnitude improvements in physical realism |

**Summary:** The student demonstrated solid awareness of missing information but initially overlooked the critical role of trebuchet geometry in determining launch conditions. The strongest performance was in steering, where targeted corrections led to substantial model improvements across successive cycles. The key learning outcome is that in real engineering problems, the geometric and mechanical details of the system often matter more than the trajectory physics itself.
