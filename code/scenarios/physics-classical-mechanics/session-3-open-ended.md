# Session 3 — Ballistic Pendulum Forensics Report (Open-Ended)

**Challenge:** Determine the muzzle velocity of a firearm using ballistic pendulum test data.
**Response Mode:** Open-ended (structured sections)

---

## Phase 1 — Framing

### Raw Problem

> Write a forensic analysis report that determines the muzzle velocity of a firearm using ballistic pendulum test data. A bullet was fired into a suspended wooden block, which swung upward. The block rose "a noticeable height." The report must include the calculated muzzle velocity with uncertainty bounds and an assessment of whether the weapon matches a suspect firearm with a listed muzzle velocity of 370 m/s. The bullet "looks like a 9mm" and the block is "a heavy piece of oak."

### Student Response (Structured Sections)

**Assumptions & Missing Information:**
The key missing information is almost everything quantitative. "A noticeable height" is not a measurement — this could mean 5 cm or 50 cm. "Looks like a 9mm" gives a rough mass range: 9mm Parabellum bullets are typically 7.5-8.0 g; I'll use 8.0 g. "A heavy piece of oak" gives no mass; oak density is ~700 kg/m3, but without dimensions I'll estimate the block at 2-5 kg. The pendulum string length is not given, nor whether the bullet embeds fully or passes through.

**Approach:**
This is a two-step conservation problem:
1. Momentum conservation during the (assumed perfectly inelastic) collision: m_bullet x v_bullet = (m_bullet + m_block) x v_combined
2. Energy conservation after the collision: (1/2)(m_bullet + m_block) x v_combined² = (m_bullet + m_block) x g x h

Combining: v_bullet = ((m_bullet + m_block) / m_bullet) x sqrt(2gh)

**Concerns:**
I'm assuming the bullet embeds completely (perfectly inelastic). If the bullet partially exits or fragments, momentum conservation still holds but the equation changes. Also, I need actual measurements for height and masses, not vague descriptions.

### AI Solution (with issues)

> **Forensic Ballistic Pendulum Analysis**
>
> Given: 9mm bullet (m = 8.0 g = 0.008 kg), oak block (m = 3.0 kg), height rise h = 15 cm = 0.15 m.
>
> Step 1: Post-collision velocity from energy conservation:
> v_combined = sqrt(2gh) = sqrt(2 x 9.8 x 0.15) = 1.71 m/s
>
> Step 2: Muzzle velocity from momentum conservation:
> v_bullet = ((m_bullet + m_block) / m_bullet) x v_combined
> v_bullet = (3.008 / 0.008) x 1.71 = 643 m/s
>
> **Conclusion:** The calculated muzzle velocity of 643 m/s significantly exceeds the suspect firearm's listed velocity of 370 m/s. The weapon does not match.

### Framing Feedback

**What the student did well:**
- Correctly identified that almost no quantitative data is provided
- Recognized the two-step conservation approach (momentum then energy)
- Questioned whether the collision is perfectly inelastic
- Gave a reasonable 9mm bullet mass range from domain knowledge
- Noted the block mass is unknown and estimated a plausible range (2-5 kg)

**What the student missed:**
- Did not question whether external forces (gravity, string tension) are negligible during the collision — the collision time is ~0.0001 s, so impulse from gravity is negligible, but this should be stated explicitly
- Did not flag the need for uncertainty propagation — the problem demands uncertainty bounds
- Did not mention that the "noticeable height" might correspond to an angular measurement (angle of swing) rather than a vertical height
- Did not consider whether the bullet might have ricocheted, fragmented, or passed through — only mentioned "passes through" briefly
- Did not ask about the pendulum string length or the block's dimensions (relevant for moment of inertia if the block rotates)

**Framing Grade:** B — Good identification of missing data and correct physics framework, but insufficient attention to uncertainty analysis and collision assumptions.

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### AI Output

> **Refined Report:**
>
> The ballistic pendulum test was conducted with a standard 9mm FMJ round (mass 8.0 g) fired into a suspended oak block (mass 3.0 kg). The block-bullet system rose to a height of 15.0 cm.
>
> Muzzle velocity calculation:
> v = (M + m)/m x sqrt(2gh) = (3.008/0.008) x sqrt(2 x 9.8 x 0.15) = 376.0 x 1.715 = 645 m/s
>
> Energy analysis:
> - KE before collision: (1/2)mv² = (1/2)(0.008)(645²) = 1,664 J
> - KE after collision: (1/2)(3.008)(1.715²) = 4.43 J
> - Energy lost: 1,660 J (99.7% dissipated as heat, deformation, sound)
>
> **Finding:** At 645 m/s, this does not match the suspect weapon (370 m/s). The weapon is excluded.

#### Judging (internal — not sent to AI)

gaps:
  - name: "The AI assumed specific values for the block mass (3.0"
    description: "The AI assumed specific values for the block mass (3.0 kg) and height (15 cm) without any basis in the problem — these are made up. The problem says"
  - name: "No uncertainty analysis"
    description: "No uncertainty analysis — the result is stated as exactly 645 m/s with no error bounds, despite every input being approximate."
  - name: "The energy analysis is correct and useful (99.7% energy"
    description: "The energy analysis is correct and useful (99.7% energy loss) but is presented as a diagnostic, not tied to validating the collision model."

#### Steering (sent to AI)

instructions:
  - name: "The block mass and height are not given in the problem"
    description: "The block mass and height are not given in the problem — you assumed 3.0 kg and 15 cm without basis. Since the problem says 'a noticeable height,' analyze the result as a function of height: compute v_bullet(h) for h = 5 cm to 30 cm. Similarly, oak block mass could range from 2 kg to 5 kg. Produce a 2D sensitivity table showing v_bullet as a function of both h and m_block. Then determine: for what combinations of (h, m_block) does v_bullet fall within plus or minus 10% of 370 m/s?"

#### Updated AI Output

> **Parametric Analysis:**
>
> v_bullet = ((M + m)/m) x sqrt(2gh) where m = 0.008 kg
>
> | Block mass (kg) | h = 5 cm | h = 10 cm | h = 15 cm | h = 20 cm | h = 30 cm |
> |-----------------|----------|-----------|-----------|-----------|-----------|
> | 2.0             | 249      | 352       | 431       | 498       | 610       |
> | 3.0             | 373      | 528       | 646       | 746       | 914       |
> | 4.0             | 497      | 703       | 861       | 994       | 1,217     |
> | 5.0             | 621      | 878       | 1,076     | 1,242     | 1,521     |
>
> **Match analysis:** v_bullet = 370 plus or minus 37 m/s (10%) gives range 333 to 407 m/s
>
> Matching combinations:
> - m_block = 2.0 kg, h approximately 10 cm: v = 352 m/s (near match)
> - m_block = 3.0 kg, h approximately 5 cm: v = 373 m/s (match)
>
> **Conclusion:** The weapon could match if the block is ~3 kg with ~5 cm rise, or ~2 kg with ~10 cm rise. Without actual measurements, neither inclusion nor exclusion is forensically defensible.

#### Judging Feedback

- Excellent: The parametric analysis correctly shows that the muzzle velocity depends strongly on both unmeasured quantities
- Excellent: The conclusion correctly states that the weapon cannot be definitively included or excluded
- Issue: The analysis still treats mass and height as independent variables with no uncertainty propagation — a proper forensic report would need a confidence interval
- Issue: The formula treats the collision as perfectly inelastic without verification — should at least estimate the bullet's penetration depth to confirm it stopped in the block

**Judging Grade:** B — Good identification of the fabricated-inputs problem, but the steering could have also addressed the perfectly inelastic assumption.

#### Steering Feedback

- The parametric analysis request was excellent — it exposed how the conclusion reverses depending on unmeasured inputs
- Well-structured request with specific ranges and a clear question (when does v match 370 m/s?)
- Should have additionally asked about uncertainty propagation methodology

**Steering Grade:** B+ — Effective and well-structured correction.

---

### Cycle 2

#### AI Output

> **Uncertainty Propagation:**
>
> Assuming measurements with uncertainties: m_bullet = 8.0 plus or minus 0.3 g, m_block = 3.0 plus or minus 0.5 kg, h = 8.0 plus or minus 2.0 cm
>
> v_bullet = ((M + m)/m) x sqrt(2gh)
>
> Partial derivatives for error propagation:
> - dv/dm = -(M/m²) x sqrt(2gh) is approximately -46,875 per second (dominant term)
> - dv/dM = (1/m) x sqrt(2gh) = 156.5 m/(s per kg)
> - dv/dh = ((M+m)/m) x sqrt(g/(2h)) = 1,170 m/(s per m)
>
> Uncertainty: delta_v = sqrt[(dv/dm x delta_m)² + (dv/dM x delta_M)² + (dv/dh x delta_h)²]
> = sqrt[(14.1)² + (78.3)² + (23.4)²]
> = sqrt[199 + 6,131 + 548]
> = sqrt(6,878) = 82.9 m/s
>
> **Result:** v_bullet = 373 plus or minus 83 m/s (with assumed input parameters)
>
> The suspect firearm's listed velocity of 370 m/s falls within the uncertainty range.
>
> **Forensic conclusion:** The ballistic pendulum measurement is consistent with, but does not uniquely identify, the suspect firearm. The dominant source of uncertainty is the block mass (contributes 89% of total variance).

#### Judging (internal — not sent to AI)

gaps:
  - name: "Good: Proper error propagation using partial derivatives"
    description: "Good: Proper error propagation using partial derivatives - Good: Correctly identifies block mass as the dominant uncertainty source - Issue: The assumed values (m_block = 3.0 kg, h = 8 cm) are chosen to make v approximately equal to 370 m/s — this is circular. A proper analysis should state what measurements are needed to distinguish the suspect weapon from alternatives. - Issue: No discussion of systematic errors — the perfectly inelastic assumption is itself a source of systematic bias (if bullet partially exits, v_bullet is underestimated)"

#### Steering (sent to AI)

instructions:
  - name: "The uncertainty analysis is technically correct but the"
    description: "The uncertainty analysis is technically correct but the chosen central values are suspicious — they produce exactly 370 m/s. A forensic report should instead state: 'Given measured height h and block mass M, the velocity is v = f(h,M) plus or minus delta_v. For the suspect weapon to match, we require v to be within 333 to 407 m/s. This constrains the (h, M) combinations as follows...' Also, address systematic error from the perfectly inelastic assumption: if the bullet partially penetrates or fragments, how does this bias the velocity estimate?"

#### Updated AI Output

> **Revised Forensic Report:**
>
> **Method:** Ballistic pendulum with momentum conservation (collision) followed by energy conservation (swing).
>
> **Systematic errors:**
>
> 1. *Perfectly inelastic assumption:* If the bullet embeds fully, momentum conservation gives:
>    m_b x v = (m_b + M) x V, so v = ((m_b + M)/m_b) x V
>
>    If the bullet partially exits with residual velocity v_r:
>    m_b x v = (m_b + M_retained) x V + m_fragment x v_r
>
>    Neglecting v_r causes v to be *overestimated* (the block received less momentum than assumed). This is a conservative bias for forensic exclusion (calculated v > actual v) but anti-conservative for inclusion.
>
> 2. *External impulse during collision:* Gravity acts during collision time dt ~ 0.1 ms. Impulse = mg x dt approximately equals 3 x 9.8 x 0.0001 = 0.003 N*s vs. bullet impulse m_b x v approximately equals 0.008 x 370 = 3.0 N*s. Gravity impulse is 0.1% — negligible.
>
> **Measurement requirements for definitive forensic conclusion:**
> - Block mass must be known to plus or minus 5% (plus or minus 0.15 kg for a 3 kg block) — weigh the block
> - Height rise must be measured to plus or minus 0.5 cm — use high-speed video or calibrated angle measurement
> - Bullet must be recovered and confirmed to be intact (verify perfectly inelastic collision)
>
> With these precisions, delta_v is approximately plus or minus 15 m/s, sufficient to distinguish 370 m/s from other common 9mm loadings (subsonic at 300 m/s, +P at 400 m/s).

#### Judging Feedback

- Excellent: The systematic error analysis correctly identifies the direction of bias from the perfectly inelastic assumption
- Excellent: The gravity impulse check is a proper validation of the momentum conservation assumption
- Excellent: The measurement requirements section is exactly what a forensic report needs — actionable and specific
- Minor issue: The analysis of bullet exit should note that fragments in the block change the effective block mass

**Judging Grade:** A — Comprehensive identification of systematic and random errors with clear forensic implications.

#### Steering Feedback

- Very effective steering — redirected from circular reasoning to a proper forensic framework
- The systematic error question yielded a physically insightful answer about the direction of bias
- The request for measurement requirements was exactly the right framing for a forensic application

**Steering Grade:** A — Transformed the report from a calculation exercise into a proper forensic analysis.

---

### Cycle 3

#### AI Output

> **Final Forensic Report — Ballistic Pendulum Analysis**
>
> **Case Reference:** [Pending]
>
> **Equipment:** Suspended oak block, pendulum mount, height measurement apparatus
>
> **Evidence:** One fired projectile, visually consistent with 9mm Parabellum
>
> **Analysis:**
>
> The muzzle velocity v is determined from:
>
> v = ((m_b + M) / m_b) x sqrt(2gh)
>
> where m_b = bullet mass, M = block mass, h = height of swing.
>
> **Required measurements (not yet obtained):**
>
> | Quantity | Required precision | Method |
> |----------|-------------------|--------|
> | Bullet mass | plus or minus 0.1 g | Analytical balance |
> | Block mass | plus or minus 50 g | Platform scale |
> | Swing height | plus or minus 0.5 cm | Calibrated ruler or high-speed video |
> | Bullet integrity | Visual | X-ray or sectioning of block |
>
> **Illustrative calculation:** For m_b = 8.0 g, M = 3.0 kg, h = 5.0 cm:
> v = (3.008/0.008) x sqrt(2 x 9.8 x 0.05) = 376 x 0.990 = 372 m/s
>
> For h = 8.0 cm: v = 376 x sqrt(1.568) = 376 x 1.252 = 471 m/s
>
> **Conclusion:** With a 3.0 kg block, a swing height of approximately 5 cm would be consistent with a 370 m/s muzzle velocity. The term "noticeable height" is qualitatively consistent with 5 cm.
>
> **Opinion:** The ballistic pendulum result is *potentially consistent* with the suspect firearm, but definitive conclusions require actual measurements of block mass and swing height. Without quantitative measurements, the analysis is illustrative only and should not be used for forensic determination.

#### Judging (internal — not sent to AI)

gaps:
  - name: "The report structure is now appropriate for a forensic"
    description: "The report structure is now appropriate for a forensic context"
  - name: "The illustrative calculation correctly shows the"
    description: "The illustrative calculation correctly shows the sensitivity to height"
  - name: "The conclusion is appropriately cautious for a forensic"
    description: "The conclusion is appropriately cautious for a forensic document"
  - name: "The measurement requirements table is well-structured"
    description: "The measurement requirements table is well-structured"
  - name: "The progression from"
    description: "The progression from"

---

## Final Grades

| Skill     | Grade | Comments |
|-----------|-------|----------|
| Framing   | B  | Good identification of missing data and correct physics, but insufficient attention to uncertainty and collision assumptions |
| Judging   | B  | Strong in Cycles 2-3 identifying systematic errors and forensic requirements; initially missed the fabricated-inputs problem |
| Steering  | A  | Excellent progression from parametric analysis to systematic error analysis to forensic framework |

**Summary:** The student demonstrated strong physics fundamentals (momentum/energy conservation) and good awareness of missing data. The most significant growth was in understanding the difference between a physics problem and a forensic analysis: a physics problem asks "what is v?", while a forensic report asks "is the evidence consistent with v = 370 m/s, and what measurements are needed to decide?" The steering performance was consistently strong, transforming each AI output into something more rigorous and practically useful.
