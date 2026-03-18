# Session 5 — Flywheel Energy Storage Sizing (Open-Ended)

**Challenge:** Calculate the dimensions and mass of a steel flywheel that can power a city bus through a 500-meter segment.
**Response Mode:** Open-ended (structured sections)

---

## Phase 1 — Framing

### Raw Problem

> Calculate the dimensions and mass of a steel flywheel that can power a city bus through a 500-meter segment where overhead electric lines are absent. Produce a specification sheet listing the flywheel diameter, thickness, mass, operating speed range, and gyroscopic loads during turns. The bus "weighs about 12 tonnes fully loaded" and travels this segment "at normal city speed." The flywheel should be "compact enough to fit under the floor" and must deliver "enough energy to cover the gap comfortably."

### Student Response (Structured Sections)

**Assumptions & Missing Information:**
"Normal city speed" is vague -- city buses typically travel at 30-50 km/h. I will use 40 km/h = 11.1 m/s. "Under the floor" constrains the diameter to perhaps 1.0-1.2 m and height to 0.3-0.5 m. "12 tonnes fully loaded" = 12,000 kg.

The energy required depends on rolling resistance, aerodynamic drag, and any grades. Rolling resistance coefficient for bus tires: Cr approximately 0.01. Aerodynamic drag: Cd approximately 0.7, frontal area A approximately 8 m squared. At 40 km/h, aero drag is modest.

The flywheel stores rotational KE = (1/2)*I*omega^2. For a solid disk, I = (1/2)*m*r^2. The usable energy is between omega_max and omega_min -- the flywheel cannot be drained to zero because the drivetrain needs a minimum input speed.

**Key Equations:**
- E_required = (F_roll + F_drag) * d = (Cr*m*g + (1/2)*rho*Cd*A*v^2) * 500
- E_stored = (1/2)*I*(omega_max^2 - omega_min^2)
- For a solid steel disk: I = (1/2)*m*r^2, mass = rho_steel * pi * r^2 * t

**Concerns:**
I have not thought about the maximum safe rotation speed -- centrifugal stress could burst the flywheel. Steel has a tensile strength limit. Also, gyroscopic effects during turns could be significant for a heavy, fast-spinning disk.

### AI Solution (with issues)

> **Flywheel Sizing:**
>
> Energy required: E = F_total * d
> F_roll = 0.01 * 12000 * 9.8 = 1,176 N
> F_drag = (1/2) * 1.2 * 0.7 * 8 * 11.1^2 = 414 N
> F_total = 1,590 N
> E = 1,590 * 500 = 795,000 J, approximately 800 kJ
>
> Flywheel: solid steel disk, diameter 1.0 m, thickness 0.2 m
> Volume = pi*(0.5^2)*(0.2) = 0.157 m^3
> Mass = 7,850 * 0.157 = 1,232 kg
> I = (1/2)*m*r^2 = (1/2) * 1232 * 0.25 = 154 kg*m^2
>
> Required: (1/2)*I*(omega_max^2 - omega_min^2) = 800,000 J
> With omega_min = 0.5 * omega_max: omega_max^2 - omega_min^2 = 0.75 * omega_max^2
> 0.75 * (1/2) * 154 * omega_max^2 = 800,000
> omega_max^2 = 13,853, so omega_max = 117.7 rad/s = 1,124 RPM
>
> **Specification:**
> Diameter: 1.0 m, Thickness: 0.2 m, Mass: 1,232 kg, Max speed: 1,124 RPM

### Framing Feedback

**What the student did well:**
- Correctly identified the need to quantify "normal city speed" and provided a reasonable estimate
- Recognized the geometric constraint ("under the floor") and translated it to dimensions
- Identified that usable energy depends on omega_max and omega_min, not just total stored energy
- Raised the centrifugal stress concern -- this is critical
- Mentioned gyroscopic effects proactively
- Estimated both rolling resistance and aerodynamic drag

**What the student missed:**
- Did not account for drivetrain efficiency -- converting flywheel rotational KE to wheel traction involves CVT/generator losses of 10-20%
- Did not consider acceleration and deceleration within the 500 m segment -- if the bus must also accelerate from a stop, energy requirements increase significantly
- Did not question whether the 500 m segment includes grade (uphill vs. flat)
- The ratio omega_min/omega_max = 0.5 is assumed but not justified -- it depends on the drivetrain operating range
- Did not consider that "comfortably" implies a safety margin on the energy budget

**Framing Grade:** B -- Good identification of key physics parameters and constraints. Missed drivetrain efficiency, grade, and the acceleration profile.

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### AI Output

> **Refined specification:**
>
> Energy requirement: 800 kJ (rolling + aero drag over 500 m at constant 40 km/h)
>
> Flywheel: 1.0 m diameter, 0.2 m thick solid steel disk
> Mass: 1,232 kg, I = 154 kg*m^2
> Operating range: 1,124 RPM down to 562 RPM
> Stored energy at max speed: (1/2) * 154 * 117.7^2 = 1,067 kJ
> Usable energy (to omega_min = (1/2)*omega_max): 800 kJ
>
> The flywheel adds 1,232 kg to the bus, increasing total mass to 13,232 kg.
> Revised energy: F_roll = 0.01 * 13,232 * 9.8 = 1,297 N, F_drag unchanged
> E_revised = (1,297 + 414) * 500 = 855,500 J
>
> Need to increase flywheel size slightly. Using diameter 1.05 m, thickness 0.22 m:
> Mass = 1,500 kg, I = 207 kg*m^2, omega_max = 1,020 RPM.

#### Judging (internal -- not sent to AI)

gaps:
  - name: "The AI correctly noted that the flywheel mass increases"
    description: "The AI correctly noted that the flywheel mass increases the bus weight, creating a circular dependency -- good iterative approach."
  - name: "No centrifugal stress check"
    description: "No centrifugal stress check. At 1,020 RPM with a 1.05 m diameter, the rim speed is v_rim = omega * r = 107 * 0.525 = 56.1 m/s. Hoop stress sigma = rho * v^2 = 7,850 * 56.1^2 = 24.7 MPa. Steel yield strength ~250 MPa, so safety factor is ~10 -- the stress is fine here, but this check was not performed."
  - name: "No drivetrain efficiency"
    description: "No drivetrain efficiency -- if 15% losses, need 855/0.85 approximately 1,006 kJ usable energy."
  - name: "A 1,500 kg flywheel on a 12,000 kg bus is 12.5% of the bus mass"
    description: "A 1,500 kg flywheel on a 12,000 kg bus is 12.5% of the bus mass -- significant but possibly acceptable."
  - name: "No gyroscopic analysis as requested by the problem"
    description: "No gyroscopic analysis as requested by the problem."

#### Steering (sent to AI)

instructions:
  - name: "Two critical checks are missing: (1) Centrifugal stress"
    description: "Two critical checks are missing: (1) Centrifugal stress -- compute the hoop stress sigma = rho * v_rim^2 at the maximum rim speed and verify it is well below the yield strength of steel (~250 MPa for mild steel, ~700 MPa for high-strength alloy). (2) Gyroscopic torque during turns -- if the bus turns a corner (radius ~20 m at 40 km/h), the precession torque is tau = I*omega * Omega_turn. Calculate this and assess whether it destabilizes the bus"
  - name: "apply a 15% drivetrain loss factor to the energy budget"
    description: "apply a 15% drivetrain loss factor to the energy budget"

#### Updated AI Output

> **1. Centrifugal stress check:**
>
> Rim speed: v_rim = omega * r = 107 * 0.525 = 56.1 m/s
> Hoop stress (solid disk, maximum at center):
> sigma_max = (3 + nu)/8 * rho * omega^2 * r^2 = (3.3/8) * 7,850 * 107^2 * 0.525^2
> = 0.4125 * 7,850 * 11,449 * 0.276 = 10.2 MPa
>
> This is far below yield strength (250 MPa). Safety factor > 24. OK.
>
> **2. Gyroscopic torque:**
>
> Bus turning: v = 11.1 m/s, R = 20 m, so Omega_turn = v/R = 0.555 rad/s
> Angular momentum: L = I*omega = 207 * 107 = 22,149 kg*m^2/s
> Gyroscopic torque: tau = L * Omega_turn = 22,149 * 0.555 = 12,293 N*m, approximately 12.3 kN*m
>
> This is a large torque applied as a roll or pitch moment depending on flywheel axis orientation. For a vertically-oriented flywheel spinning in the horizontal plane, turning produces a pitching torque.
>
> At 12.3 kN*m, with a track width of ~2.5 m: delta_F_per_wheel approximately 12,300/2.5 = 4,920 N, approximately 500 kg equivalent. On a 13,000 kg bus with ~3,200 kg per wheel, this is a 15% load transfer -- significant but manageable.
>
> **Mitigation:** Use two counter-rotating flywheels to cancel gyroscopic effects.
>
> **3. With 15% drivetrain loss:**
>
> E_usable_required = 855,500/0.85 = 1,006,500 J
> (1/2) * 207 * 0.75 * omega_max^2 = 1,006,500
> omega_max = sqrt(1,006,500/77.6) = 113.9 rad/s = 1,088 RPM
>
> Stress check at 1,088 RPM: sigma = 11.6 MPa -- still far below yield. OK.

#### Judging Feedback

- Excellent centrifugal stress check -- correctly used the solid disk formula with Poisson ratio
- Good gyroscopic torque calculation with practical interpretation (15% wheel load transfer)
- The counter-rotating flywheel mitigation is the standard engineering solution -- good
- The drivetrain loss correction appropriately increased the energy budget
- Minor: the hoop stress formula used is for an unperforated disk; the actual flywheel would have a shaft hole that increases stress concentration

**Judging Grade:** B+ -- Correctly identified both missing checks and provided quantitative steering.

#### Steering Feedback

- Excellent steering -- targeted the two most important unchecked safety issues
- The specific formula for hoop stress and the turning scenario (R = 20 m) gave the AI concrete problems to solve
- The drivetrain efficiency correction was a practical improvement

**Steering Grade:** A -- Precise and well-prioritized.

---

### Cycle 2

#### AI Output

> **Counter-rotating flywheel design:**
>
> Two flywheels, each: diameter 0.8 m, thickness 0.15 m
> Mass each: 7,850 * pi * 0.4^2 * 0.15 = 592 kg, total 1,184 kg
> I_each = (1/2) * 592 * 0.16 = 47.4 kg*m^2, total I = 94.8 kg*m^2
>
> This gives much less inertia than the single 1.0 m disk. Need higher speed:
> omega_max = sqrt(1,006,500 / (0.75 * 0.5 * 94.8)) = sqrt(1,006,500/35.55) = 168.3 rad/s = 1,607 RPM
>
> Stress: sigma = 0.4125 * 7,850 * 168.3^2 * 0.16 = 14.7 MPa (safe)
> Rim speed: 168.3 * 0.4 = 67.3 m/s
>
> Gyroscopic torque: Cancels to zero (counter-rotating). OK.
>
> **Revised specification:**
>
> | Parameter | Value |
> |-----------|-------|
> | Configuration | Two counter-rotating solid steel disks |
> | Diameter each | 0.80 m |
> | Thickness each | 0.15 m |
> | Mass each | 592 kg |
> | Total flywheel mass | 1,184 kg |
> | Max speed | 1,607 RPM |
> | Min speed | 804 RPM |
> | Usable energy | 1,007 kJ |
> | Max hoop stress | 14.7 MPa (SF > 17) |
> | Gyroscopic torque | Cancelled (counter-rotating) |

#### Judging (internal -- not sent to AI)

gaps:
  - name: "Good: counter-rotating design eliminates gyroscopic"
    description: "Good: counter-rotating design eliminates gyroscopic issues - Good: stress remains well within limits - Issue: Total flywheel mass is 1,184 kg, which is ~10% of bus mass. This is heavy but comparable to battery packs on electric buses (~500-1,500 kg). - Issue: No consideration of bearing losses and windage (aerodynamic drag on the spinning disk). At 1,600 RPM in a sealed housing, windage can consume 1-5% of stored energy during the ~45 s traversal (500 m at 40 km/h). - Issue: The specification is missing the energy available for acceleration vs. constant speed -- if the bus stops and restarts within the 500 m segment, additional energy is needed. - Issue:"

#### Steering (sent to AI)

instructions:
  - name: "The dual-flywheel specification is reasonable but"
    description: "The dual-flywheel specification is reasonable but missing practical considerations: (1) Estimate bearing friction and windage losses during the ~45 s traversal at 1,600 RPM. (2) Check the physical envelope -- two 0.8 m disks plus bearings, housings, vacuum enclosure, and CVT need to fit in a space perhaps 2.5 m x 1.5 m x 0.5 m under the bus floor. Is this feasible? (3) Add a 30% energy margin for 'comfortably' covering the gap, which may include one stop-and-start cycle."

#### Updated AI Output

> **1. Losses during traversal:**
>
> Traversal time: 500 m / 11.1 m/s = 45 s
>
> Bearing losses: typical magnetic or high-quality ball bearings dissipate ~0.1% of stored energy per minute. Over 45 s: 0.075% * 1,007 kJ = 0.75 kJ -- negligible.
>
> Windage: In air, windage power P_wind = 0.5 * Cd_disk * rho * omega^3 * r^5 approximately 0.5 * 0.08 * 1.2 * 168^3 * 0.4^5 = 2,325 W
> Over 45 s: 2,325 * 45 = 104.6 kJ -- this is 10.4% of stored energy!
>
> **Solution:** Evacuate the flywheel housing to ~1 mbar. Windage reduces by factor of ~1,000. Windage loss with vacuum: ~0.1 kJ -- negligible.
>
> **2. Physical envelope:**
>
> Each flywheel unit: 0.8 m disk + 0.05 m bearing/housing on each side = 0.9 m diameter, 0.25 m tall
> Two units side by side: 1.8 m x 0.9 m x 0.25 m
> Plus CVT/generator: add 0.5 m length
> Total: ~2.3 m x 0.9 m x 0.30 m -- fits within a 2.5 x 1.5 x 0.5 m underfloor space. OK.
>
> **3. Energy margin (30% for stop-start):**
>
> One stop-start cycle: KE = (1/2) * 13,184 * 11.1^2 = 812 kJ
> If the bus decelerates regeneratively back into the flywheel, the stop costs only the braking losses (~20%): 0.2 * 812 = 162 kJ
> Total: 1,007 + 162 = 1,169 kJ. With 30% margin: 1,520 kJ required.
>
> Need to increase flywheel speed: omega_max = sqrt(1,520,000/35.55) = 206.8 rad/s = 1,975 RPM
> Stress: sigma = 0.4125 * 7,850 * 206.8^2 * 0.16 = 22.1 MPa (SF > 11). OK.
>
> **Updated specification:**
>
> | Parameter | Value |
> |-----------|-------|
> | Configuration | Two counter-rotating steel disks in vacuum housing |
> | Diameter | 0.80 m each |
> | Thickness | 0.15 m each |
> | Mass | 592 kg each (1,184 kg total) |
> | Max speed | 1,975 RPM |
> | Min speed | 988 RPM |
> | Stored energy (max) | 2,027 kJ |
> | Usable energy | 1,520 kJ |
> | Max hoop stress | 22.1 MPa (SF > 11 vs. mild steel) |
> | Gyroscopic torque | Cancelled |
> | Housing | Vacuum (~1 mbar), sealed bearings |
> | Envelope | 2.3 x 0.9 x 0.30 m |

#### Judging Feedback

- Excellent: Windage analysis correctly identified that atmospheric operation wastes ~10% of energy, leading to the vacuum housing requirement
- Good: Regenerative braking correctly reduces the energy penalty of a stop-start cycle
- Good: Physical envelope check confirms feasibility
- The stress remains well within limits even at the higher speed
- Minor: no mention of containment in case of flywheel failure -- a 592 kg disk at 2,000 RPM stores lethal energy if it fragments. Safety containment is a critical design requirement.

**Judging Grade:** B -- Good identification of windage and envelope issues, but missed the containment safety concern.

#### Steering Feedback

- Good steering that addressed practical engineering concerns (losses, packaging, margin)
- The 30% margin request with stop-start scenario was well-motivated
- Could have additionally asked about failure containment, but the priority was correct for this stage

**Steering Grade:** B+ -- Practical and well-scoped corrections.

---

## Final Grades

| Skill     | Grade | Comments |
|-----------|-------|----------|
| Framing   | B  | Good identification of energy requirements, usable energy concept, and centrifugal stress concern; missed drivetrain efficiency and acceleration scenarios |
| Judging   | B  | Consistent identification of missing physics (stress, gyroscopic, windage) but missed containment safety |
| Steering  | A  | Well-targeted corrections that evolved the design from a basic disk to a vacuum-enclosed, counter-rotating, margin-inclusive system |

**Summary:** The student demonstrated solid physics understanding of rotational energy storage, correctly identifying the usable energy concept (omega_max to omega_min) and the centrifugal stress constraint from the start. Steering performance was the strongest skill, consistently directing the AI toward physically important improvements -- from stress/gyroscopic checks to windage analysis and practical packaging. The main gap was in not pushing far enough on safety-critical aspects: a flywheel storing ~2 MJ at ~2,000 RPM is a serious hazard if it fails, and containment design should have been raised. The key learning outcome is that rotational energy systems require holistic design thinking: energy storage capacity, material limits, parasitic losses, gyroscopic effects, packaging, and failure containment are all coupled.
