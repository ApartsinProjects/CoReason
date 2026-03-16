# Session 4 — Vibration Isolator for a Rooftop HVAC Unit (Open-Ended)

**Challenge:** Specify the spring stiffness and damping coefficient for vibration isolation mounts under a rooftop HVAC compressor.
**Response Mode:** Open-ended (structured sections)

---

## Phase 1 — Framing

### Raw Problem

> Specify the spring stiffness and damping coefficient for vibration isolation mounts under a rooftop HVAC compressor. Produce a transmissibility curve (force transmitted to roof vs. frequency). Tenants on the top floor complain of "a constant hum" when the unit runs. The compressor "runs at about 1800 RPM" and weighs "several hundred kilograms." The building manager wants vibration transmission reduced to "barely noticeable levels." Select a mount from a catalog of available isolators with stiffnesses ranging from 50 kN/m to 500 kN/m.

### Student Response (Structured Sections)

**Assumptions & Missing Information:**
The compressor mass is vague -- "several hundred kilograms" could mean 200 to 800 kg. I will assume 400 kg as a midpoint. The operating speed of 1800 RPM = 30 Hz is the forcing frequency. "Barely noticeable" is subjective -- I need a quantitative transmissibility target. ISO 2631 suggests perceptible vibration thresholds around 0.01 m/s squared for occupied spaces, but I do not know the input vibration amplitude to set a transmissibility ratio.

**Approach:**
The transmissibility of a single-degree-of-freedom forced oscillator is:

T = sqrt[(1 + (2*zeta*r)^2) / ((1 - r^2)^2 + (2*zeta*r)^2)]

where r = omega/omega_n (frequency ratio) and zeta = damping ratio.

For isolation (T < 1), we need r > sqrt(2), meaning omega_n < omega/sqrt(2) = 30/sqrt(2) = 21.2 Hz. The natural frequency must be well below 21.2 Hz for good isolation.

**Key Equations:**
- omega_n = sqrt(k/m), so k = m * omega_n^2
- For r = 3 (good isolation): omega_n = 10 Hz, k = 400 * (2*pi*10)^2 = 1.58 MN/m
- Wait -- that is above the catalog range (50-500 kN/m). Let me recalculate.

Actually, with k = 200 kN/m and m = 400 kg: omega_n = sqrt(200000/400) = sqrt(500) = 22.4 rad/s = 3.56 Hz. Then r = 30/3.56 = 8.4. T would be very low -- this seems right.

**Concerns:**
I initially confused Hz and rad/s in my calculation -- I need to be more careful with units. Also, I have not considered harmonics of the compressor speed (2x, 3x, etc.) which could excite resonances differently.

### AI Solution (with issues)

> **Vibration Isolation Design:**
>
> Compressor mass: m = 400 kg
> Operating frequency: f = 1800 RPM = 30 Hz, omega = 2*pi*30 = 188.5 rad/s
>
> For transmissibility T < 0.05 (95% isolation):
> Using T approximately equals 1/(r^2 - 1) for light damping:
> 0.05 = 1/(r^2 - 1), so r^2 = 21, r = 4.58
> omega_n = omega/r = 188.5/4.58 = 41.2 rad/s, f_n = 6.55 Hz
>
> Required stiffness: k = m*omega_n^2 = 400 * 41.2^2 = 679 kN/m
>
> This exceeds the catalog maximum (500 kN/m). Using k = 500 kN/m:
> omega_n = sqrt(500000/400) = 35.4 rad/s = 5.63 Hz
> r = 188.5/35.4 = 5.33
> T = 1/(5.33^2 - 1) = 0.037, giving 96.3% isolation
>
> **Recommendation:** Use the stiffest catalog mount (500 kN/m) for 96.3% isolation.
>
> Damping: zeta = 0.1 (typical rubber mount).

### Framing Feedback

**What the student did well:**
- Correctly converted 1800 RPM to 30 Hz
- Identified the transmissibility formula and the r > sqrt(2) condition for isolation
- Caught their own unit confusion (Hz vs. rad/s) -- good self-correction
- Noted the harmonic content issue
- Recognized the need for a quantitative transmissibility target

**What the student missed:**
- Did not question whether the 1800 RPM compressor also produces harmonics (2nd, 3rd order from reciprocating motion) -- a reciprocating compressor vibration spectrum contains significant harmonic content, not just the fundamental
- "Barely noticeable" should be compared to vibration standards (ISO 2631, ASHRAE) -- mentioned ISO 2631 but did not commit to a specific transmissibility target
- Did not consider that the compressor may have startup and shutdown transients that pass through resonance
- Did not identify that the number of mounts and load distribution matter -- a 400 kg compressor on 4 mounts means 100 kg per mount, changing the effective stiffness per mount
- Did not question whether the building structure has its own resonant frequencies that could interact

**Framing Grade:** B- -- Correct physics framework but incomplete treatment of harmonics, transient behavior, and practical mounting considerations.

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### AI Output

> **Revised design:**
>
> Using k = 500 kN/m (total, 4 mounts at 125 kN/m each):
> f_n = (1/2*pi)*sqrt(k/m) = (1/2*pi)*sqrt(500000/400) = 5.63 Hz
>
> Transmissibility at f = 30 Hz (r = 30/5.63 = 5.33):
> T = 1/(r^2 - 1) = 1/(28.4 - 1) = 0.037
>
> Transmitted force: If unbalanced force F_0 = 500 N (assumed), then F_transmitted = 500 * 0.037 = 18.5 N
>
> This is well-isolated at the fundamental. No further analysis needed.

#### Judging (internal -- not sent to AI)

gaps:
  - name: "The AI says"
    description: "The AI says"
  - name: "The transmissibility formula T = 1/(r^2 - 1) is the"
    description: "The transmissibility formula T = 1/(r^2 - 1) is the undamped approximation. With damping zeta = 0.1, the full formula gives slightly different results, and more importantly, the damped formula shows that increasing damping worsens isolation above resonance -- the AI has not discussed this tradeoff."
  - name: "The AI assumes F_0 = 500 N without any basis"
    description: "The AI assumes F_0 = 500 N without any basis."
  - name: "The stiffest mount (500 kN/m) is recommended, but"
    description: "The stiffest mount (500 kN/m) is recommended, but stiffer springs give higher natural frequency and worse isolation. This is backwards -- for better isolation, use softer springs (lower k gives lower f_n gives higher r)."

#### Steering (sent to AI)

instructions:
  - name: "You recommended the stiffest catalog mount (500 kN/m)"
    description: "You recommended the stiffest catalog mount (500 kN/m), but stiffer springs raise the natural frequency, reducing the frequency ratio r and worsening isolation. The optimal isolator should have the lowest practical stiffness to maximize r. Recalculate using the softest mount (50 kN/m) and compare"
  - name: "plot the full transmissibility curve T(f) for 0-100 Hz"
    description: "plot the full transmissibility curve T(f) for 0-100 Hz with zeta = 0.05, 0.1, and 0.2. Include the 2nd and 3rd harmonics of the compressor (60 Hz, 90 Hz) on the plot"

#### Updated AI Output

> **Corrected analysis -- softer mounts are better:**
>
> Apologies -- I had the logic inverted. For isolation, we want f_n << f_operating, which means low k.
>
> Using k = 50 kN/m (4 mounts at 12.5 kN/m each):
> f_n = (1/2*pi)*sqrt(50000/400) = 1.78 Hz
> r at 30 Hz: r = 30/1.78 = 16.9
> T(30 Hz) = 1/(16.9^2 - 1) = 0.0035, giving 99.65% isolation
>
> Harmonics:
> r at 60 Hz: r = 33.7, T = 0.00088
> r at 90 Hz: r = 50.6, T = 0.00039
>
> **Transmissibility curve (zeta = 0.1):**
> ```
> T
> 10 |    *
>    |   * *
>  1 |--*---*---------  (T = 1 line)
>    | *     *
> 0.1|        *
>    |         *
> .01|          *  *  *  <-- 30, 60, 90 Hz all well-isolated
>    |___________________
>    0  2  5  10  30  60  90  f (Hz)
>       ^
>      f_n = 1.78 Hz
> ```
>
> **However:** f_n = 1.78 Hz means the static deflection is delta = mg/k = 400 * 9.8/50000 = 0.078 m = 7.8 cm. This is a large sag -- the mounts would need to accommodate nearly 8 cm of static deflection, which may cause stability issues.
>
> **Damping comparison at f = 30 Hz:**
> - zeta = 0.05: T = 0.0035
> - zeta = 0.10: T = 0.0036
> - zeta = 0.20: T = 0.0040
>
> Higher damping slightly worsens isolation above resonance, but the effect is small at r = 16.9.

#### Judging Feedback

- Excellent: The corrected logic (softer = better for isolation) is now right
- Good: Harmonics are checked and well-isolated
- Good: The static deflection concern (7.8 cm) is a real practical limitation
- Good: Damping tradeoff is quantified and correctly shows minor effect at high r
- Issue: The transmissibility curve is only sketched -- the resonance peak amplitude at f_n should be quantified. At zeta = 0.1, T_peak = 1/(2*zeta) = 5.0. During startup/shutdown, the compressor passes through resonance and the force amplification is 5x.
- Issue: The stability concern from 7.8 cm deflection is raised but not resolved

**Judging Grade:** B+ -- Correctly caught the inverted logic and identified the static deflection concern.

#### Steering Feedback

- Excellent steering -- caught the fundamental error (stiffest mount recommended when softest is needed) and corrected it immediately
- The harmonic content request was well-targeted
- The transmissibility curve request produced useful visual output

**Steering Grade:** A -- Identified and corrected the most impactful error with clear, specific instructions.

---

### Cycle 2

#### AI Output

> **Startup/shutdown transient analysis:**
>
> During startup, the compressor speed ramps from 0 to 1800 RPM, passing through f_n = 1.78 Hz at ~107 RPM.
>
> At resonance (r = 1): T_peak = (1 + (2*zeta)^2) / (2*zeta) approximately equals 1/(2 * 0.1) = 5.0 for zeta = 0.1
>
> The force transmitted is amplified 5x at resonance. If the compressor reaches 107 RPM quickly (< 1 s), the transient peak is reduced because the system does not have time to build up to steady-state resonance. But if the startup is slow, full resonance can develop.
>
> **Design tradeoff:**
> - zeta = 0.05: Better steady-state isolation (T = 0.0035 at 30 Hz), worse resonance (T_peak = 10)
> - zeta = 0.10: Good isolation (T = 0.0036), moderate resonance (T_peak = 5)
> - zeta = 0.20: Slightly worse isolation (T = 0.004), better resonance (T_peak = 2.7)
>
> **Recommendation:** zeta = 0.15 as a compromise. T at 30 Hz = 0.0038, T_peak = 3.4.
>
> **Practical mount selection:**
> The 50 kN/m mount gives excessive static deflection (7.8 cm). Using k = 100 kN/m:
> - f_n = 2.52 Hz, static deflection = 3.9 cm (more manageable)
> - r at 30 Hz = 11.9, T = 0.0071, giving 99.3% isolation (still excellent)
> - T_peak at resonance (zeta = 0.15) = 3.4
>
> | Mount k (kN/m) | f_n (Hz) | delta_static (cm) | T at 30 Hz | T_peak |
> |----------------|----------|---------------------|------------|--------|
> | 50              | 1.78     | 7.8                | 0.0035     | 5.0    |
> | 100             | 2.52     | 3.9                | 0.0071     | 5.0    |
> | 200             | 3.56     | 2.0                | 0.025      | 5.0    |
> | 500             | 5.63     | 0.8                | 0.037      | 5.0    |

#### Judging (internal -- not sent to AI)

gaps:
  - name: "Good: The startup transient analysis is physically"
    description: "Good: The startup transient analysis is physically correct - Good: The damping tradeoff is well-quantified - Good: The practical comparison across catalog stiffnesses is useful - Issue: T_peak is shown as 5.0 for all mounts because it depends only on zeta, not on k -- this is correct but the table should clarify this - Issue: The mass was assumed as exactly 400 kg. Since it could be 200-800 kg, the natural frequency could be very different. With k = 100 kN/m and m = 200 kg: f_n = 3.56 Hz (still well-isolated). With m = 800 kg: f_n = 1.78 Hz, delta_static = 7.8 cm (deflection problem returns) - Issue: Has not discussed whether the"

#### Steering (sent to AI)

instructions:
  - name: "The mass is uncertain"
    description: "The mass is uncertain -- 'several hundred kilograms' could mean 200 to 800 kg. Show how the design changes across this range"
  - name: "consider whether the tenants' 'constant hum' could be"
    description: "consider whether the tenants' 'constant hum' could be airborne noise from the compressor rather than structure-borne vibration. If the dominant transmission path is acoustic, vibration isolation alone will not solve the complaint"

#### Updated AI Output

> **Mass sensitivity analysis (k = 100 kN/m):**
>
> | Mass (kg) | f_n (Hz) | delta_static (cm) | T at 30 Hz | Verdict |
> |-----------|----------|---------------------|------------|---------|
> | 200       | 3.56     | 2.0                | 0.025      | Good    |
> | 400       | 2.52     | 3.9                | 0.0071     | Good    |
> | 600       | 2.06     | 5.9                | 0.0048     | OK (deflection borderline) |
> | 800       | 1.78     | 7.8                | 0.0035     | Deflection excessive |
>
> For m = 800 kg, k = 200 kN/m is better: f_n = 2.52 Hz, delta = 3.9 cm, T = 0.0071.
>
> **The mount stiffness should be matched to the actual compressor mass after weighing.**
>
> **Airborne vs. structure-borne noise:**
>
> A "constant hum" at 30 Hz has wavelength lambda = 343/30 = 11.4 m in air. At this low frequency:
> - Structure-borne path: compressor -> mounts -> roof deck -> ceiling -> room
> - Airborne path: compressor casing -> outdoor air -> roof/walls -> indoor air
>
> For rooftop units, structure-borne transmission typically dominates below 100 Hz because:
> 1. Low-frequency airborne sound is poorly transmitted through building envelope (mass law: TL increases with frequency)
> 2. Direct mechanical coupling through rigid mounts is very efficient
>
> However, if isolation mounts are installed and the hum persists, the transmission path is likely airborne or flanking. Diagnostic: temporarily support the compressor on soft foam and check if the hum decreases.
>
> **Final recommendation:** Install k = 100-200 kN/m mounts (exact value based on measured mass), zeta approximately 0.15. After installation, measure vibration on the roof deck to verify isolation. If hum persists, investigate airborne acoustic path.

#### Judging Feedback

- Excellent mass sensitivity analysis showing the design depends on actual mass
- Good discussion of airborne vs. structure-borne paths with physics reasoning
- The diagnostic test recommendation (foam support) is practical and valuable
- The final recommendation is appropriately conditional on measurements

**Judging Grade:** B+ -- Correctly identified mass sensitivity and acoustic path issues.

#### Steering Feedback

- Strong steering that broadened the analysis from pure vibration isolation to the full diagnostic picture
- The airborne noise question was particularly insightful -- many vibration isolation projects fail because the dominant path is acoustic
- Well-scoped correction that led to actionable recommendations

**Steering Grade:** B+ -- Good broadening of scope to include acoustic transmission.

---

## Final Grades

| Skill     | Grade | Comments |
|-----------|-------|----------|
| Framing   | B  | Correct physics framework but missed harmonics treatment, startup transients, and practical mounting details |
| Judging   | B  | Strong throughout -- caught the inverted stiffness logic, mass sensitivity, and acoustic paths |
| Steering  | A  | Consistently effective corrections that improved the design from incorrect to physically sound and practically useful |

**Summary:** The student started with a correct understanding of the transmissibility formula but initially missed the critical insight that softer springs provide better isolation (higher frequency ratio). This was corrected in the first steering cycle. The strongest aspect of performance was in steering, where well-targeted corrections led the AI from recommending the stiffest mount (worst choice) to a nuanced design considering mass uncertainty, startup transients, damping tradeoffs, and acoustic vs. structural paths. The key lesson is that forced oscillation problems require thinking about the full operating envelope -- not just steady-state at one frequency, but harmonics, transients, and the complete transmission pathway from source to receiver.
