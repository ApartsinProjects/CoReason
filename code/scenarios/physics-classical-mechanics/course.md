# Course: Classical Mechanics
**Department:** Physics
**Institution:** ETH Zurich

---

## Subject Tree

```
Classical Mechanics
├── Kinematics
│   ├── Motion in 1D
│   │   ├── Velocity & Acceleration
│   │   └── Free Fall
│   ├── Motion in 2D & 3D
│   │   ├── Projectile Motion
│   │   └── Circular Motion
│   └── Relative Motion
│       ├── Reference Frames
│       └── Galilean Transformations
├── Newton's Laws
│   ├── Force & Equilibrium
│   │   ├── Free Body Diagrams
│   │   └── Static Equilibrium
│   ├── Dynamics
│   │   ├── Friction
│   │   ├── Tension & Normal Forces
│   │   └── Drag Forces
│   └── Non-inertial Frames
│       ├── Centrifugal Force
│       └── Coriolis Effect
├── Energy & Work
│   ├── Work-Energy Theorem
│   ├── Potential Energy
│   │   ├── Gravitational PE
│   │   └── Elastic PE
│   ├── Conservation of Energy
│   └── Power & Efficiency
├── Momentum & Collisions
│   ├── Linear Momentum
│   │   ├── Impulse
│   │   └── Conservation of Momentum
│   ├── Collisions
│   │   ├── Elastic Collisions
│   │   ├── Inelastic Collisions
│   │   └── Center of Mass
│   └── Rocket Propulsion
├── Rotational Mechanics
│   ├── Torque & Moment of Inertia
│   ├── Angular Momentum
│   │   ├── Conservation
│   │   └── Precession
│   ├── Rotational Energy
│   └── Rolling Motion
└── Oscillations & Waves
    ├── Simple Harmonic Motion
    │   ├── Springs
    │   └── Pendulums
    ├── Damped Oscillations
    ├── Forced Oscillations & Resonance
    └── Coupled Oscillators
```

---

## Challenge Examples

### Challenge 1: Trebuchet Range Prediction
**Subject:** Kinematics > Motion in 2D & 3D > Projectile Motion
**Type:** Practice

**Raw Problem (intentionally ill-defined):**
> Build a computational model that predicts the landing distance of a counterweight trebuchet launching a pumpkin at a harvest festival. The organizers say the field is "a few hundred meters long" and want to know where to set up the safety perimeter. Produce a range map showing landing zones for different counterweight masses (100 kg to 500 kg). The trebuchet arm is "about 6 meters" and the pumpkin weighs "around 5 kg." Assume the release happens "near the top of the swing."

**Framing Rubric:**

#### Criterion 1: Ambiguous or missing initial conditions that are required to define the
- **Description:** Identifies ambiguous or missing initial conditions (launch angle, initial velocity, initial position) that are required to define the projectile trajectory
- **Excellent (A):** Clearly and specifically identifies ambiguous or missing initial conditions (launch angle, initial velocity, initial position) that are required to define the projectile trajectory
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Unstated assumptions about the geometry
- **Description:** Questions unstated assumptions about the geometry and coordinate system, including reference heights, ranges, and dimensionality of the motion
- **Excellent (A):** Clearly and specifically questions unstated assumptions about the geometry and coordinate system, including reference heights, ranges, and dimensionality of the motion
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Missing environmental and physical parameters that affect trajectory predictions
- **Description:** Notes missing environmental and physical parameters (air resistance, wind, gravitational field variations) that affect trajectory predictions
- **Excellent (A):** Clearly and specifically notes missing environmental and physical parameters (air resistance, wind, gravitational field variations) that affect trajectory predictions
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Stated constraints or targets may be inconsistent with the physical limits of
- **Description:** Recognizes when stated constraints or targets may be inconsistent with the physical limits of projectile motion given the unspecified parameters
- **Excellent (A):** Clearly and specifically recognizes when stated constraints or targets may be inconsistent with the physical limits of projectile motion given the unspecified parameters
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Applies projectile motion equations
- **Description:** Detects if AI applies projectile motion equations without verifying that the assumptions (uniform gravity, negligible drag, point-mass projectile) are valid for the scenario
- **Excellent (A):** Accurately detects if AI applies projectile motion equations without verifying that the assumptions (uniform gravity, negligible drag, point-mass projectile) are valid for the scenario and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Neglects the distinction between launch height
- **Description:** Identifies if AI neglects the distinction between launch height and landing height, or assumes symmetric trajectory when conditions are asymmetric
- **Excellent (A):** Accurately identifies if AI neglects the distinction between launch height and landing height, or assumes symmetric trajectory when conditions are asymmetric and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Uses a fixed or idealized launch angle
- **Description:** Catches if the AI uses a fixed or idealized launch angle (e.g., 45 degrees) without justifying it from the problem's geometry or optimality conditions
- **Excellent (A):** Accurately catches if the AI uses a fixed or idealized launch angle (e.g., 45 degrees) without justifying it from the problem's geometry or optimality conditions and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Omits drag or other dissipative forces when the projectile's speed
- **Description:** Recognizes if AI omits drag or other dissipative forces when the projectile's speed, size, or range makes them non-negligible
- **Excellent (A):** Accurately recognizes if AI omits drag or other dissipative forces when the projectile's speed, size, or range makes them non-negligible and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Address the decomposition of motion into independent horizontal
- **Description:** Commands address the decomposition of motion into independent horizontal and vertical components with appropriate initial conditions for each
- **Excellent (A):** Effectively commands address the decomposition of motion into independent horizontal and vertical components with appropriate initial conditions for each with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Express trajectory parameters as functions of launch angle
- **Description:** Guides AI to express trajectory parameters (range, maximum height, flight time) as functions of launch angle and speed, and to explore sensitivity to each
- **Excellent (A):** Effectively guides AI to express trajectory parameters (range, maximum height, flight time) as functions of launch angle and speed, and to explore sensitivity to each with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Impact of air resistance
- **Description:** Addresses the impact of air resistance and other real-world corrections on idealized projectile predictions, including when such corrections matter
- **Excellent (A):** Effectively addresses the impact of air resistance and other real-world corrections on idealized projectile predictions, including when such corrections matter with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Quantitative predictions with clearly stated assumptions
- **Description:** Converges on quantitative predictions with clearly stated assumptions, parameter dependencies, and uncertainty or sensitivity analysis
- **Excellent (A):** Effectively converges on quantitative predictions with clearly stated assumptions, parameter dependencies, and uncertainty or sensitivity analysis with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 2: Elevator Emergency Braking System
**Subject:** Newton's Laws > Dynamics > Friction
**Type:** Assessment

**Raw Problem (intentionally ill-defined):**
> Design the braking force profile for an elevator emergency braking system and produce a force-vs-time diagram. The elevator services a 20-story building and carries "up to 10 people." The brake must stop the elevator within one floor of travel after cable failure. The building owner says passengers should not experience "dangerous deceleration." Specify the required brake pad normal force and minimum coefficient of friction for the rail clamp mechanism.

**Framing Rubric:**

#### Criterion 1: Ambiguous or missing parameters that determine frictional forces
- **Description:** Identifies ambiguous or missing parameters that determine frictional forces (normal force magnitude, surface materials, contact area, relative velocity)
- **Excellent (A):** Clearly and specifically identifies ambiguous or missing parameters that determine frictional forces (normal force magnitude, surface materials, contact area, relative velocity)
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Vague qualitative descriptions that must be translated into quantitative
- **Description:** Questions vague qualitative descriptions that must be translated into quantitative friction-related constraints (e.g., coefficient values, force thresholds, deceleration limits)
- **Excellent (A):** Clearly and specifically questions vague qualitative descriptions that must be translated into quantitative friction-related constraints (e.g., coefficient values, force thresholds, deceleration limits)
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Missing information about the physical context: mass
- **Description:** Notes missing information about the physical context: mass or weight of objects, applied forces, geometry of contact surfaces, and whether static or kinetic friction applies
- **Excellent (A):** Clearly and specifically notes missing information about the physical context: mass or weight of objects, applied forces, geometry of contact surfaces, and whether static or kinetic friction applies
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Problem requires analysis across a range of operating conditions
- **Description:** Recognizes when the problem requires analysis across a range of operating conditions (varying loads, speeds, or surface states) rather than a single-point calculation
- **Excellent (A):** Clearly and specifically recognizes when the problem requires analysis across a range of operating conditions (varying loads, speeds, or surface states) rather than a single-point calculation
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Uses a single fixed friction coefficient
- **Description:** Detects if AI uses a single fixed friction coefficient without acknowledging that friction depends on surface conditions, speed, temperature, and normal force variations
- **Excellent (A):** Accurately detects if AI uses a single fixed friction coefficient without acknowledging that friction depends on surface conditions, speed, temperature, and normal force variations and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Conflates static and kinetic friction
- **Description:** Identifies if AI conflates static and kinetic friction or applies the wrong regime for the motion state described in the problem
- **Excellent (A):** Accurately identifies if AI conflates static and kinetic friction or applies the wrong regime for the motion state described in the problem and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Solution neglects other forces acting simultaneously with friction that alter
- **Description:** Catches if the solution neglects other forces acting simultaneously with friction (gravity, applied forces, inertial effects) that alter the net dynamics
- **Excellent (A):** Accurately catches if the solution neglects other forces acting simultaneously with friction (gravity, applied forces, inertial effects) that alter the net dynamics and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Ignores the variability
- **Description:** Recognizes if AI ignores the variability and uncertainty inherent in friction coefficients and their effect on predicted outcomes
- **Excellent (A):** Accurately recognizes if AI ignores the variability and uncertainty inherent in friction coefficients and their effect on predicted outcomes and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Address the correct application of Newton's second law with friction as one
- **Description:** Commands address the correct application of Newton's second law with friction as one component of the net force, including proper free-body diagram construction
- **Excellent (A):** Effectively commands address the correct application of Newton's second law with friction as one component of the net force, including proper free-body diagram construction with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Distinguish between static
- **Description:** Guides AI to distinguish between static and kinetic friction regimes and to check whether the system transitions between them during the scenario
- **Excellent (A):** Effectively guides AI to distinguish between static and kinetic friction regimes and to check whether the system transitions between them during the scenario with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Changes in normal force
- **Description:** Addresses how changes in normal force, surface conditions, or loading affect frictional behavior and the resulting dynamics across the full operating envelope
- **Excellent (A):** Effectively addresses how changes in normal force, surface conditions, or loading affect frictional behavior and the resulting dynamics across the full operating envelope with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Quantitative outputs with explicit treatment of parameter ranges
- **Description:** Converges on quantitative outputs (forces, accelerations, stopping distances, or required coefficients) with explicit treatment of parameter ranges and worst-case analysis
- **Excellent (A):** Effectively converges on quantitative outputs (forces, accelerations, stopping distances, or required coefficients) with explicit treatment of parameter ranges and worst-case analysis with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 3: Ballistic Pendulum Forensics Report
**Subject:** Momentum & Collisions > Collisions > Inelastic Collisions
**Type:** Practice

**Raw Problem (intentionally ill-defined):**
> Write a forensic analysis report that determines the muzzle velocity of a firearm using ballistic pendulum test data. A bullet was fired into a suspended wooden block, which swung upward. The block rose "a noticeable height." The report must include the calculated muzzle velocity with uncertainty bounds and an assessment of whether the weapon matches a suspect firearm with a listed muzzle velocity of 370 m/s. The bullet "looks like a 9mm" and the block is "a heavy piece of oak."

**Framing Rubric:**

#### Criterion 1: Ambiguous or missing information about the masses
- **Description:** Identifies ambiguous or missing information about the masses, velocities, and physical configuration of the colliding objects before and after impact
- **Excellent (A):** Clearly and specifically identifies ambiguous or missing information about the masses, velocities, and physical configuration of the colliding objects before and after impact
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Collision is fully inelastic
- **Description:** Questions whether the collision is fully inelastic, partially inelastic, or whether material passes through, since the degree of inelasticity determines the post-collision state
- **Excellent (A):** Clearly and specifically questions whether the collision is fully inelastic, partially inelastic, or whether material passes through, since the degree of inelasticity determines the post-collision state
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Missing parameters needed for analysis: object masses
- **Description:** Notes missing parameters needed for analysis: object masses, initial velocities, post-collision measurements, and any geometric or constraint details
- **Excellent (A):** Clearly and specifically notes missing parameters needed for analysis: object masses, initial velocities, post-collision measurements, and any geometric or constraint details
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Inelastic collision analysis requires both momentum conservation
- **Description:** Recognizes that inelastic collision analysis requires both momentum conservation and an energy accounting (kinetic energy lost to deformation, heat, sound)
- **Excellent (A):** Clearly and specifically recognizes that inelastic collision analysis requires both momentum conservation and an energy accounting (kinetic energy lost to deformation, heat, sound)
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Applies momentum conservation
- **Description:** Detects if AI applies momentum conservation without verifying that external forces are negligible during the collision interval
- **Excellent (A):** Accurately detects if AI applies momentum conservation without verifying that external forces are negligible during the collision interval and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Assumes a perfectly inelastic collision
- **Description:** Identifies if AI assumes a perfectly inelastic collision (objects stick together) without justifying this assumption from the problem's physical details
- **Excellent (A):** Accurately identifies if AI assumes a perfectly inelastic collision (objects stick together) without justifying this assumption from the problem's physical details and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Neglects the kinetic energy lost in the collision
- **Description:** Catches if AI neglects the kinetic energy lost in the collision or incorrectly applies energy conservation across the inelastic impact itself
- **Excellent (A):** Accurately catches if AI neglects the kinetic energy lost in the collision or incorrectly applies energy conservation across the inelastic impact itself and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Solution omits uncertainty propagation when input measurements have ranges
- **Description:** Recognizes if the solution omits uncertainty propagation when input measurements have ranges or tolerances, producing unjustified precision in results
- **Excellent (A):** Accurately recognizes if the solution omits uncertainty propagation when input measurements have ranges or tolerances, producing unjustified precision in results and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Address the correct sequential application of conservation laws: momentum
- **Description:** Commands address the correct sequential application of conservation laws: momentum conservation during the collision, then energy methods for any subsequent motion
- **Excellent (A):** Effectively commands address the correct sequential application of conservation laws: momentum conservation during the collision, then energy methods for any subsequent motion with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Quantify the energy dissipated in the collision
- **Description:** Guides AI to quantify the energy dissipated in the collision and to distinguish between quantities conserved (momentum) and not conserved (kinetic energy)
- **Excellent (A):** Effectively guides AI to quantify the energy dissipated in the collision and to distinguish between quantities conserved (momentum) and not conserved (kinetic energy) with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Sensitivity of computed results to uncertain input parameters
- **Description:** Addresses the sensitivity of computed results to uncertain input parameters (masses, velocities, collision geometry) and requires propagation of those uncertainties
- **Excellent (A):** Effectively addresses the sensitivity of computed results to uncertain input parameters (masses, velocities, collision geometry) and requires propagation of those uncertainties with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Quantitative results with explicit uncertainty bounds
- **Description:** Converges on quantitative results (velocities, energy losses, or derived quantities) with explicit uncertainty bounds and clearly stated assumptions about collision type
- **Excellent (A):** Effectively converges on quantitative results (velocities, energy losses, or derived quantities) with explicit uncertainty bounds and clearly stated assumptions about collision type with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 4: Vibration Isolator for a Rooftop HVAC Unit
**Subject:** Oscillations & Waves > Forced Oscillations & Resonance
**Type:** Assessment

**Raw Problem (intentionally ill-defined):**
> Specify the spring stiffness and damping coefficient for vibration isolation mounts under a rooftop HVAC compressor. Produce a transmissibility curve (force transmitted to roof vs. frequency). Tenants on the top floor complain of "a constant hum" when the unit runs. The compressor "runs at about 1800 RPM" and weighs "several hundred kilograms." The building manager wants vibration transmission reduced to "barely noticeable levels." Select a mount from a catalog of available isolators with stiffnesses ranging from 50 kN/m to 500 kN/m.

**Framing Rubric:**

#### Criterion 1: Ambiguous or missing parameters that determine the system's natural frequency
- **Description:** Identifies ambiguous or missing parameters that determine the system's natural frequency and resonance behavior (mass, stiffness, damping coefficient)
- **Excellent (A):** Clearly and specifically identifies ambiguous or missing parameters that determine the system's natural frequency and resonance behavior (mass, stiffness, damping coefficient)
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Forcing function is a single frequency
- **Description:** Questions whether the forcing function is a single frequency or contains harmonics, subharmonics, or broadband excitation that could excite resonance
- **Excellent (A):** Clearly and specifically questions whether the forcing function is a single frequency or contains harmonics, subharmonics, or broadband excitation that could excite resonance
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Missing information about acceptable response amplitude
- **Description:** Notes missing information about acceptable response amplitude, transmissibility targets, or vibration tolerance criteria needed to define the design goal
- **Excellent (A):** Clearly and specifically notes missing information about acceptable response amplitude, transmissibility targets, or vibration tolerance criteria needed to define the design goal
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Qualitative descriptions of acceptable vibration levels must be translated into
- **Description:** Recognizes that qualitative descriptions of acceptable vibration levels must be translated into quantitative transmissibility or amplitude thresholds
- **Excellent (A):** Clearly and specifically recognizes that qualitative descriptions of acceptable vibration levels must be translated into quantitative transmissibility or amplitude thresholds
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Fails to compare the forcing frequency to the system's natural frequency
- **Description:** Detects if AI fails to compare the forcing frequency to the system's natural frequency, which is the fundamental requirement for predicting resonance or isolation behavior
- **Excellent (A):** Accurately detects if AI fails to compare the forcing frequency to the system's natural frequency, which is the fundamental requirement for predicting resonance or isolation behavior and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Neglects harmonic content in the forcing function that may excite resonance
- **Description:** Identifies if AI neglects harmonic content in the forcing function that may excite resonance even when the fundamental frequency does not
- **Excellent (A):** Accurately identifies if AI neglects harmonic content in the forcing function that may excite resonance even when the fundamental frequency does not and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Model omits damping effects
- **Description:** Catches if the model omits damping effects, producing physically unrealistic predictions of infinite amplitude at resonance
- **Excellent (A):** Accurately catches if the model omits damping effects, producing physically unrealistic predictions of infinite amplitude at resonance and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Does not assess the tradeoff between damping and isolation performance
- **Description:** Recognizes if AI does not assess the tradeoff between damping (which limits resonance amplitude) and isolation performance (which worsens with increased damping above resonance)
- **Excellent (A):** Accurately recognizes if AI does not assess the tradeoff between damping (which limits resonance amplitude) and isolation performance (which worsens with increased damping above resonance) and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Address the transmissibility relationship between forcing frequency ratio
- **Description:** Commands address the transmissibility relationship between forcing frequency ratio, damping ratio, and response amplitude for a forced, damped oscillator
- **Excellent (A):** Effectively commands address the transmissibility relationship between forcing frequency ratio, damping ratio, and response amplitude for a forced, damped oscillator with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Construct a transmissibility
- **Description:** Guides AI to construct a transmissibility or frequency response curve and identify the regimes of amplification (near resonance) and isolation (well above resonance)
- **Excellent (A):** Effectively guides AI to construct a transmissibility or frequency response curve and identify the regimes of amplification (near resonance) and isolation (well above resonance) with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Role of damping as a design parameter: its benefit near resonance versus its
- **Description:** Addresses the role of damping as a design parameter: its benefit near resonance versus its cost to high-frequency isolation effectiveness
- **Excellent (A):** Effectively addresses the role of damping as a design parameter: its benefit near resonance versus its cost to high-frequency isolation effectiveness with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Quantitative design outputs with justification rooted in the forced oscillation
- **Description:** Converges on quantitative design outputs (natural frequency, damping ratio, transmissibility at key frequencies) with justification rooted in the forced oscillation model
- **Excellent (A):** Effectively converges on quantitative design outputs (natural frequency, damping ratio, transmissibility at key frequencies) with justification rooted in the forced oscillation model with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 5: Flywheel Energy Storage Sizing
**Subject:** Rotational Mechanics > Rotational Energy
**Type:** Practice

**Raw Problem (intentionally ill-defined):**
> Calculate the dimensions and mass of a steel flywheel that can power a city bus through a 500-meter segment where overhead electric lines are absent. Produce a specification sheet listing the flywheel diameter, thickness, mass, operating speed range, and gyroscopic loads during turns. The bus "weighs about 12 tonnes fully loaded" and travels this segment "at normal city speed." The flywheel should be "compact enough to fit under the floor" and must deliver "enough energy to cover the gap comfortably."

**Framing Rubric:**

#### Criterion 1: Ambiguous or missing parameters that determine the rotational kinetic energy
- **Description:** Identifies ambiguous or missing parameters that determine the rotational kinetic energy: moment of inertia (mass distribution and geometry) and angular velocity range
- **Excellent (A):** Clearly and specifically identifies ambiguous or missing parameters that determine the rotational kinetic energy: moment of inertia (mass distribution and geometry) and angular velocity range
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Vague energy requirements
- **Description:** Questions vague energy requirements or performance targets that must be quantified before the rotational energy can be meaningfully calculated or compared
- **Excellent (A):** Clearly and specifically questions vague energy requirements or performance targets that must be quantified before the rotational energy can be meaningfully calculated or compared
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Missing information about the rotating body's geometry
- **Description:** Notes missing information about the rotating body's geometry, material properties, speed limits, and any constraints on physical dimensions or mass
- **Excellent (A):** Clearly and specifically notes missing information about the rotating body's geometry, material properties, speed limits, and any constraints on physical dimensions or mass
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Usable rotational energy depends on both maximum
- **Description:** Recognizes that the usable (extractable) rotational energy depends on both maximum and minimum operating speeds, not just the total stored energy
- **Excellent (A):** Clearly and specifically recognizes that the usable (extractable) rotational energy depends on both maximum and minimum operating speeds, not just the total stored energy
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Computes rotational kinetic energy using an incorrect
- **Description:** Detects if AI computes rotational kinetic energy using an incorrect or unjustified moment of inertia (e.g., treating a hollow cylinder as a solid disk)
- **Excellent (A):** Accurately detects if AI computes rotational kinetic energy using an incorrect or unjustified moment of inertia (e.g., treating a hollow cylinder as a solid disk) and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Ignores material stress limits that constrain the maximum safe angular velocity
- **Description:** Identifies if AI ignores material stress limits (centrifugal/hoop stress) that constrain the maximum safe angular velocity of the rotating body
- **Excellent (A):** Accurately identifies if AI ignores material stress limits (centrifugal/hoop stress) that constrain the maximum safe angular velocity of the rotating body and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Solution conflates total stored rotational energy with extractable energy
- **Description:** Catches if the solution conflates total stored rotational energy with extractable energy, neglecting the minimum operating speed below which the system cannot function
- **Excellent (A):** Accurately catches if the solution conflates total stored rotational energy with extractable energy, neglecting the minimum operating speed below which the system cannot function and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Omits energy losses that reduce the useful energy delivered
- **Description:** Recognizes if AI omits energy losses (bearing friction, drivetrain inefficiency, aerodynamic drag on the rotor) that reduce the useful energy delivered
- **Excellent (A):** Accurately recognizes if AI omits energy losses (bearing friction, drivetrain inefficiency, aerodynamic drag on the rotor) that reduce the useful energy delivered and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Address the relationship between moment of inertia
- **Description:** Commands address the relationship between moment of inertia, angular velocity, and stored rotational kinetic energy, including how geometry choices affect each
- **Excellent (A):** Effectively commands address the relationship between moment of inertia, angular velocity, and stored rotational kinetic energy, including how geometry choices affect each with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Evaluate material and geometric constraints that limit rotational speed
- **Description:** Guides AI to evaluate material and geometric constraints that limit rotational speed, and to compute the extractable energy between maximum and minimum operating speeds
- **Excellent (A):** Effectively guides AI to evaluate material and geometric constraints that limit rotational speed, and to compute the extractable energy between maximum and minimum operating speeds with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Secondary mechanical effects of rotating bodies that arise from high angular
- **Description:** Addresses secondary mechanical effects of rotating bodies (gyroscopic precession, bearing loads, vibration) that arise from high angular momentum
- **Excellent (A):** Effectively addresses secondary mechanical effects of rotating bodies (gyroscopic precession, bearing loads, vibration) that arise from high angular momentum with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Complete quantitative specification of the rotating system with clearly stated
- **Description:** Converges on a complete quantitative specification of the rotating system (dimensions, mass, speed range, stored and extractable energy) with clearly stated assumptions and safety margins
- **Excellent (A):** Effectively converges on a complete quantitative specification of the rotating system (dimensions, mass, speed range, stored and extractable energy) with clearly stated assumptions and safety margins with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

