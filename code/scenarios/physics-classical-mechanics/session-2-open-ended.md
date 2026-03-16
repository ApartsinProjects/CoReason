# Session 2 — Elevator Emergency Braking System (Open-Ended)

**Challenge:** Design the braking force profile for an elevator emergency braking system.
**Response Mode:** Open-ended (structured sections)

---

## Phase 1 — Framing

### Raw Problem

> Design the braking force profile for an elevator emergency braking system and produce a force-vs-time diagram. The elevator services a 20-story building and carries "up to 10 people." The brake must stop the elevator within one floor of travel after cable failure. The building owner says passengers should not experience "dangerous deceleration." Specify the required brake pad normal force and minimum coefficient of friction for the rail clamp mechanism.

### Student Response (Structured Sections)

**Assumptions & Missing Information:**
The problem is underspecified in several ways. "Up to 10 people" doesn't give an exact mass — I'll assume average person mass of 75 kg, so max passenger load is 750 kg. The elevator car mass is not given; I'll assume 1000 kg. Total max mass: 1750 kg. A 20-story building with ~3.5 m per floor gives a total height of 70 m. One floor of stopping distance means d = 3.5 m. "Dangerous deceleration" is vague — I recall that fighter pilots sustain ~9g, so maybe 5g is the limit here.

**Approach:**
After cable failure, the elevator accelerates under gravity. Using kinematics, I'll find the velocity at the instant braking begins (assuming braking starts immediately). Then I'll find the constant braking force needed to stop within 3.5 m. Finally, I'll check if the deceleration is within human tolerance.

**Key Equations:**
- Free-fall velocity: v = sqrt(2gd_fall), but d_fall is approximately 0 if brakes engage immediately, so v is approximately 0 at brake engagement
- Braking: F_brake - mg = ma, so a = (F_brake/m) - g
- Stopping distance: v²/(2a) must be within 3.5 m

**Concerns:**
Wait — if the brakes engage instantly after cable failure, the elevator hasn't accelerated yet, so the problem is just about preventing it from falling at all. But realistically there's a detection delay. Also, I set the deceleration limit at 5g, which seems very high for an elevator.

### AI Solution (with issues)

> **Solution:**
>
> Assume cable failure at the top floor (worst case for speed). The elevator is in free fall for a detection/activation time of t_delay = 0.5 s before brakes engage.
>
> Speed at brake engagement: v = g x t_delay = 9.8 x 0.5 = 4.9 m/s
>
> Required deceleration to stop in d = 3.5 m:
> v² = 2ad, so a = v²/(2d) = 4.9²/(2 x 3.5) = 3.43 m/s²
>
> Net upward force: F_net = m(a + g) = 1750 x (3.43 + 9.8) = 23,153 N
>
> This is the friction force from brakes: F_friction = mu x N = 23,153 N
>
> With mu = 0.3 (steel on steel): N = 23,153 / 0.3 = 77,175 N per rail
>
> Deceleration experienced by passengers: a = 3.43 m/s² is approximately 0.35g — well within safe limits.

### Framing Feedback

**What the student did well:**
- Recognized that the number of people must be converted to a mass estimate
- Identified the elevator car mass as missing
- Noted that "dangerous deceleration" needs quantification
- Correctly observed that detection delay matters

**What the student missed:**
- The 5g deceleration limit is unreasonable for elevator passengers — building codes and standards (EN 81, ASME A17.1) typically limit emergency deceleration to 1g–2.5g. The student should have considered that passengers include elderly, children, and people with medical conditions
- Did not distinguish between static and kinetic friction — during braking, the pads slide against rails, so kinetic friction applies. The coefficient changes with speed and temperature
- Did not identify that the problem requires analysis across a range of loads (empty car to fully loaded) — the braking system must work for all cases
- Did not note that "within one floor" might mean the total distance including any free-fall distance during detection delay
- The worst-case scenario was not clearly defined — is it worst case for stopping distance or worst case for passenger deceleration?

**Framing Grade:** C+ — Good awareness of missing parameters but significant gaps in understanding safety standards, friction regimes, and the need for multi-condition analysis.

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### AI Output

> **Refined analysis:**
>
> Parameters:
> - Car mass: 1000 kg, max passenger mass: 750 kg
> - Floor height: 3.5 m
> - Detection delay: 0.5 s
> - Friction coefficient: mu = 0.3 (steel brake pads on steel rail)
>
> At brake engagement: v = 4.9 m/s
>
> During braking, remaining stopping distance: d_stop = 3.5 - (1/2)g(0.5)² = 3.5 - 1.225 = 2.275 m
>
> Required deceleration: a = v²/(2 x 2.275) = 24.01/4.55 = 5.28 m/s²
>
> Net brake force: F = m(a + g) = 1750(5.28 + 9.8) = 26,390 N
>
> Normal force per rail (2 rails): N = 26,390 / (2 x 0.3) = 43,983 N per rail
>
> Passenger deceleration: 5.28 m/s² is approximately 0.54g — acceptable.

#### Judging (internal — not sent to AI)

gaps:
  - name: "The AI correctly subtracted the free-fall distance"
    description: "The AI correctly subtracted the free-fall distance during delay from the stopping budget — good."
  - name: "But it only analyzed the fully loaded case"
    description: "But it only analyzed the fully loaded case. An empty car (1000 kg) would decelerate much faster under the same brake force, potentially causing dangerously high deceleration. This is the critical dual-constraint: stop fast enough when heavy, gentle enough when light."
  - name: "Uses a single friction coefficient (0.3) without"
    description: "Uses a single friction coefficient (0.3) without discussing whether this is static or kinetic, and whether heating from friction changes the coefficient during braking."
  - name: "The force-vs-time diagram was requested but not produced"
    description: "The force-vs-time diagram was requested but not produced — only a constant force scenario is described."

#### Steering (sent to AI)

instructions:
  - name: "You've only analyzed the fully loaded case"
    description: "You've only analyzed the fully loaded case. The brake system applies the same normal force regardless of load. Analyze two bounding cases: (1) fully loaded (1750 kg) — must stop within one floor, and (2) empty car (1000 kg) — must not exceed a safe deceleration limit. Use 1g (9.8 m/s²) as the passenger deceleration limit per elevator safety standards. Show that a single brake force can satisfy both constraints simultaneously, or explain why a variable-force design is needed."

#### Updated AI Output

> **Dual-constraint analysis:**
>
> Case 1 — Fully loaded (m = 1750 kg):
> Required minimum deceleration: a_min = v²/(2 x 2.275) = 5.28 m/s²
> Required brake friction force: F_brake >= m(a_min + g) = 1750 x 15.08 = 26,390 N
>
> Case 2 — Empty car (m = 1000 kg) with same F_brake = 26,390 N:
> Deceleration: a = F_brake/m - g = 26,390/1000 - 9.8 = 16.59 m/s² = 1.69g
>
> This exceeds the 1g limit!
>
> **Resolution options:**
> 1. Load-sensing brake: Adjust normal force based on car weight
> 2. Progressive braking: Ramp force over time — start gentle, increase if needed
> 3. Accept 1.69g for empty car (may be permissible since no passengers)
>
> **For a progressive profile:** Start at F1 = m_empty x (1g + g) = 1000 x 19.6 = 19,600 N, ramp to F2 = 26,390 N over the first 0.3 s.
>
> This gives a_empty = 19,600/1000 - 9.8 = 9.8 m/s² = 1g (at limit)
> And a_loaded = 19,600/1750 - 9.8 = 1.4 m/s² (may not stop in time if ramp is too slow)

#### Judging Feedback

- Good: The dual-constraint analysis correctly reveals that a constant-force brake cannot simultaneously satisfy both the stopping distance and deceleration limits for all loads
- Good: Three resolution options are physically reasonable
- Issue: The progressive braking analysis is incomplete — need to integrate the full velocity and position profiles over the ramp to verify stopping distance
- Issue: Option 3 (accept 1.69g for empty car) is questionable — the car could be empty of passengers but maintenance workers might be present
- Missing: Still no force-vs-time diagram as originally requested

**Judging Grade:** B — Correctly identified the load-dependent constraint conflict, but the resolution analysis is incomplete.

#### Steering Feedback

- Effective steering — directing the AI to consider both bounding cases revealed a critical design conflict
- The 1g deceleration limit was a reasonable engineering standard to impose
- Could have also asked about the force-vs-time diagram and friction coefficient variability

**Steering Grade:** B+ — Well-targeted correction that exposed a fundamental design issue.

---

### Cycle 2

#### AI Output

> **Complete force-vs-time profile with numerical integration:**
>
> Phase 0 (0 < t < 0.5 s): Free fall, a = g, v increases from 0 to 4.9 m/s, distance fallen = 1.225 m
>
> Phase 1 (0.5 < t < 0.8 s): Ramp-up, F_brake increases linearly from 0 to F_max
> Phase 2 (0.8 s < t < t_stop): Constant F_brake = F_max until stopped
>
> For the fully loaded case, using Euler integration (dt = 0.01 s):
> With F_max = 26,400 N, ramp time 0.3 s:
> - Stopping time: t_stop = 1.32 s (0.82 s of braking)
> - Total distance: 1.225 + 2.18 = 3.41 m (within 3.5 m budget)
>
> For empty car with same profile:
> - Peak deceleration during constant phase: 16.6 m/s² = 1.69g (exceeds limit)
>
> **Load-sensing solution:** Use a load cell to set F_max:
> - F_max = m_measured x (a_target + g), where a_target = min(v²/(2 x d_remaining), 1g)
>
> **Friction requirements:**
> - Maximum F_brake needed: 26,400 N
> - With mu_kinetic = 0.25 (conservative for steel-on-steel with oil contamination):
>   N_required = 26,400 / (2 x 0.25) = 52,800 N per rail
> - With mu_kinetic = 0.35 (clean, dry steel):
>   N_required = 26,400 / (2 x 0.35) = 37,714 N per rail

#### Judging (internal — not sent to AI)

gaps:
  - name: "Excellent: Force-vs-time profile now has proper phases"
    description: "Excellent: Force-vs-time profile now has proper phases (delay, ramp, constant) - Good: Uses kinetic friction coefficient and considers surface condition variability - Issue: The ramp-up time of 0.3 s is assumed — what determines this physically? It depends on the brake actuator (spring, hydraulic, electromagnetic). Should be justified. - Issue: No consideration of brake heating — at F = 26 kN sliding at ~5 m/s, power dissipated is ~130 kW. Temperature rise could reduce friction coefficient significantly. - Issue: The problem states"

#### Steering (sent to AI)

instructions:
  - name: "The force-vs-time profile is good but missing thermal analysis"
    description: "The force-vs-time profile is good but missing thermal analysis. At peak braking (F approximately 26 kN, v approximately 5 m/s), power dissipated is ~130 kW. For a brake pad area of perhaps 100 cm², this is an enormous heat flux. Estimate the temperature rise during braking and assess whether friction fade (reduction of mu with temperature) could compromise stopping performance"
  - name: "specify what actuator mechanism achieves the 0.3 s ramp-up"
    description: "specify what actuator mechanism achieves the 0.3 s ramp-up"

#### Updated AI Output

> **Thermal analysis:**
>
> Energy dissipated during braking: E = (1/2)mv² + mgd = (1/2)(1750)(4.9²) + 1750(9.8)(2.275) = 21,000 + 39,000 = 60,000 J
>
> Brake pad mass (estimated): 2 pads x 2 kg each = 4 kg total
> Specific heat of steel: c = 500 J/(kg*K)
> Temperature rise (adiabatic): dT = E / (mc) = 60,000 / (4 x 500) = 30 K
>
> A 30 degree C rise is modest — friction fade is negligible below ~200 degrees C for steel brake materials.
>
> However, the heat is concentrated at the surface — surface flash temperature could be much higher. Using a flash temperature estimate with contact area 50 cm², q = P/A = 130,000/0.005 = 26 MW/m², braking time ~0.8 s:
> Estimated flash temperature rise: ~3800 K
>
> This is unrealistically high — indicates that real contact area is much smaller than apparent area, and surface temperatures may indeed reach concerning levels. Real brake systems use cermet or composite pad materials designed for high flash temperatures.
>
> **Actuator:** A compressed spring mechanism (pre-loaded to ~55 kN, held by electromagnetic latch) provides the fastest response. On power failure, the latch releases and the spring clamps within ~0.1-0.2 s. Using 0.2 s ramp:
>
> Updated stopping distance (fully loaded, 0.2 s ramp): 3.35 m (within budget)

#### Judging Feedback

- Excellent thermal analysis showing the distinction between bulk and surface temperature rise
- The flash temperature calculation reveals a real engineering concern
- Good actuator specification — spring-loaded, fail-safe design is industry standard
- Minor issue: the "unrealistically high" flash temperature could be better contextualized — it indicates the model assumptions (uniform contact) break down, not that the brake literally reaches 3800 K

**Judging Grade:** B+ — Strong identification of thermal and actuator issues, with good quantitative follow-through.

#### Steering Feedback

- Excellent steering — thermal analysis was a non-obvious but critical concern
- Asking for actuator mechanism justification tied the abstract force profile to physical hardware
- Good prioritization of remaining issues

**Steering Grade:** A — Identified a subtle but important failure mode (friction fade) and demanded engineering specificity.

---

## Final Grades

| Skill     | Grade | Comments |
|-----------|-------|----------|
| Framing   | C  | Identified basic missing parameters but missed friction regimes, load-range analysis, and set an unreasonable deceleration limit (5g) |
| Judging   | B  | Improved through cycles; correctly identified load-dependent constraints and thermal concerns |
| Steering  | A  | Consistently well-targeted corrections that drove the design from simplistic to realistic |

**Summary:** The student started with a weak framing performance, setting an unreasonable deceleration limit and missing the critical insight that the braking system must work across all load conditions. However, steering performance was excellent — the student identified the right corrections at the right time, leading the AI through load-range analysis, thermal effects, and actuator specification. The key takeaway is that friction-based safety systems require worst-case analysis across the full operating envelope, not just single-point design.
