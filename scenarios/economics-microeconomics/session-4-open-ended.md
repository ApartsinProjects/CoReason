# Session 4 — Crop Insurance Scheme for Smallholder Farmers (Open-Ended)

**Challenge:** Design a crop insurance product for smallholder farmers in a developing region.
**Subject:** Market Failures > Information Asymmetry > Adverse Selection
**Response Mode:** Open-Ended (Structured Sections)

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Design a crop insurance product for smallholder farmers in a developing region and produce a product specification document. The regional development bank wants to "protect farmers from catastrophic losses" while keeping the scheme "financially sustainable without permanent subsidies." Roughly 200,000 farmers grow "various crops" on plots ranging from "half a hectare to five hectares." Previous insurance programs in the region "had very low uptake." Weather data is available from "a few stations" but individual farm yield records are "mostly nonexistent."

### Student Framing Response

**Ambiguities and Missing Information:**

1. **No definition of "catastrophic loss."** The trigger event for payouts is unspecified. Is it a yield loss exceeding 50%? Total crop failure? A revenue decline below a threshold? Without a clear definition of the insured event, we cannot price the product, estimate payout frequency, or evaluate adverse selection risk. I would ask the development bank to define the loss threshold that triggers a payout.

2. **Individual farm yield data is nonexistent.** This is the core adverse selection problem. If we cannot observe each farmer's historical yields, we cannot distinguish high-risk farmers from low-risk ones. High-risk farmers will disproportionately seek coverage (adverse selection), driving up claims and premiums, which in turn drives low-risk farmers away. The scheme will either lose money or price out the farmers it is meant to help. I would ask whether any proxy data exists — satellite imagery, soil maps, village-level yield aggregates — that could partially substitute for individual records.

3. **"Various crops" is too vague for product design.** Different crops have different risk profiles, growing seasons, and loss distributions. A single insurance product cannot reasonably cover maize and coffee under the same terms. I would ask for a breakdown of crops by acreage and farmer count, and whether the scheme should be designed per crop or as a multi-peril blanket policy.

**What I Would Not Flag:**

The 200,000 farmer count is an adequate planning number. The plot size range (0.5-5 hectares) is useful context and does not need further precision.

### AI Output (with planted issues)

**Crop Insurance Product Specification:**

**Product Design:**
- Coverage: 80% of expected yield value, triggered when farm-level yields fall below 60% of the regional average.
- Premium: 5% of coverage value, payable at planting time.
- Enrollment: Voluntary, open to all farmers in the region.
- Payout: Cash transfer within 30 days of verified loss.

**Loss Verification:** Local agricultural extension officers visit each claiming farmer's plot to assess damage. Payouts are based on the officer's field estimate of yield loss.

**Financial Sustainability:** The premium rate of 5% is calibrated to the regional average loss frequency of approximately 1 in 10 years for catastrophic events. A reserve fund equal to 2 years of premium income provides a buffer for above-average loss years.

**Participation Strategy:** To address historical low uptake, the scheme will partner with agricultural input suppliers to bundle insurance with seed and fertilizer purchases.

The scheme is financially sustainable because premiums are actuarially fair for the average farmer, and the bundling strategy ensures broad participation.

### Framing Feedback

**Grade: A (Strong identification of key gaps, missed one important dimension)**

**Strengths:**
- Excellent identification of the core adverse selection mechanism. The student correctly linked the absence of individual yield data to the classic adverse selection spiral: high-risk farmers self-select in, premiums rise, low-risk farmers exit, the pool deteriorates. This is the central economic challenge of this problem.
- Good recognition that the trigger event is undefined and that different crop types require different risk assessments. Both are essential design parameters.
- Asking about proxy data (satellite imagery, soil maps) shows practical awareness of how to mitigate information gaps.

**Areas for Improvement:**
- Did not address the tension between voluntary participation and adverse selection. The problem says previous programs had low uptake, which suggests voluntary schemes attract a skewed pool. The student should have questioned whether participation should be mandatory or incentivized, since voluntary enrollment is the mechanism through which adverse selection operates.
- Did not note that the absence of individual yield data also creates moral hazard — if payouts are based on self-reported or locally verified losses, farmers may underinvest in crop care or overstate losses. While the challenge emphasizes adverse selection, moral hazard is a closely related information asymmetry problem that any insurance design must address.

---

## Phase 2 — Judge + Steer Cycles

### Cycle 1

#### AI Output Under Review

*(The AI output from Phase 1 above)*

#### Judging (Internal — Not Sent to AI)

gaps:
  - name: "The AI proposes voluntary enrollment with a single"
    description: "The AI proposes voluntary enrollment with a single premium rate for all farmers. This is a textbook setup for adverse selection: high-risk farmers (those on marginal land, growing fragile crops, or in drought-prone areas) will enroll at higher rates than low-risk farmers. The uniform 5% premium is actuarially fair only for the average farmer — it is too expensive for low-risk farmers and too cheap for high-risk ones. The resulting pool will be skewed toward high-risk, making the scheme unsustainable."
  - name: "With 200,000 potential participants, individual plot"
    description: "With 200,000 potential participants, individual plot visits by extension officers are logistically impossible and invite corruption. The loss verification mechanism does not scale and creates moral hazard (officers can be bribed, farmers can stage damage)."
  - name: "The AI uses"
    description: "The AI uses"
  - name: "Bundling increases enrollment but does not change the"
    description: "Bundling increases enrollment but does not change the risk composition of the pool. If anything, it may worsen selection by enrolling farmers who would not otherwise buy insurance and who may represent above-average risk."

#### Steering Command Sent to AI

instructions:
  - name: "Your design proposes voluntary enrollment with a uniform"
    description: "Your design proposes voluntary enrollment with a uniform premium and does not address adverse selection. This is the core challenge: without individual yield data, how do you prevent the insurance pool from being dominated by high-risk farmers? Please revise:"
  - name: "Address adverse selection directly"
    description: "Address adverse selection directly. Should enrollment be mandatory, or can you design screening mechanisms that separate high-risk from low-risk farmers using observable characteristics (location, crop type, plot size, proximity to weather stations)?"
  - name: "Replace individual farm-level loss verification with a"
    description: "Replace individual farm-level loss verification with a scalable alternative. Consider index-based insurance (payouts triggered by a measurable index like rainfall rather than individual yield assessment)."
  - name: "Show how the premium structure accounts for"
    description: "Show how the premium structure accounts for heterogeneous risk rather than using a single rate for all farmers."

#### Updated AI Output

**Revised Product Specification:**

**1. Addressing Adverse Selection — Risk Classification:**

Rather than a single pool, farmers are classified into risk tiers based on observable characteristics:

| Risk Tier | Criteria | Premium Rate | Rationale |
|-----------|----------|-------------|-----------|
| Low Risk | Within 10km of irrigation source; growing drought-resistant varieties; plot >2 hectares | 3% of coverage | Lower loss probability due to water access and crop resilience |
| Medium Risk | Rain-fed agriculture; standard crop varieties; plot 1-2 hectares | 5% of coverage | Baseline risk consistent with regional averages |
| High Risk | Rain-fed; drought-sensitive crops; plot <1 hectare; in historically drought-prone zone | 8% of coverage | Higher loss probability and lower capacity to self-insure |

**Observable proxies for hidden risk types:** Since individual yield histories are unavailable, the classification uses geographic (distance to water), agronomic (crop variety), and scale (plot size) data that are verifiable and correlate with loss probability. This is an imperfect screen — some farmers within each tier will be higher or lower risk than the tier average — but it is substantially better than uniform pricing.

**2. Index-Based Insurance Design:**

Payouts are triggered by a rainfall index rather than individual yield assessment:
- **Index:** Total rainfall during the growing season, measured at the nearest weather station.
- **Trigger:** If rainfall falls below 70% of the 20-year average, payouts are activated.
- **Payout scale:** Linear from 10% of coverage value (at 70% rainfall) to 100% of coverage value (at 30% rainfall or below).

**Advantages:** Eliminates the need for individual farm visits, removes moral hazard from loss verification, enables rapid payouts (based on weather data, not damage assessment), and is transparent to farmers.

**Disadvantage — Basis Risk:** The index may not reflect individual farm conditions. A farmer 30km from the weather station may experience drought that the station does not record, or may have adequate rainfall while the station records a deficit. Basis risk is the primary weakness of index insurance.

**3. Participation Mechanism:**

**Quasi-mandatory enrollment:** Insurance is bundled with access to the development bank's subsidized credit program. Farmers who want low-interest loans must enroll in crop insurance. This links participation to a service farmers already want, broadening the risk pool beyond high-risk self-selectors without making insurance legally mandatory.

#### Judging Feedback (Cycle 1)

**Grade: A (Strong improvement, key gaps remain)**

**What Improved:**
- The risk classification system is a meaningful step toward addressing adverse selection. Using observable proxies (location, crop type, plot size) to screen farmers into risk tiers is the standard approach when individual loss histories are unavailable. The tiered premium structure correctly charges higher premiums to higher-risk groups, reducing cross-subsidization.
- The index-based insurance design is a significant practical improvement. It eliminates the moral hazard of individual loss verification and enables scalable operations. Correctly identifying basis risk as the main drawback shows balanced analysis.
- The quasi-mandatory enrollment through credit bundling is a clever participation mechanism that addresses the low-uptake problem while broadening the risk pool.

**Remaining Issues:**
- The basis risk problem is identified but not addressed. How can the scheme mitigate basis risk? More weather stations? Satellite-based vegetation indices as supplementary triggers? Hybrid products that combine index triggers with localized spot checks for borderline cases?
- No discussion of whether adverse selection persists within the risk tiers. Even with three tiers, there is heterogeneity within each group. The "medium risk" tier, for example, still pools farmers with meaningfully different loss probabilities. What residual selection effects should the scheme expect, and how does the reserve fund account for this?

#### Steering Feedback (Cycle 1)

**Grade: A (Well-structured command that produced substantial improvement)**

**What Worked:**
- The three-part command addressed the three main flaws systematically: adverse selection, verification, and pricing. This structure made it easy for the AI to respond comprehensively.
- Suggesting index-based insurance as a specific alternative to individual verification was the right level of guidance — it pointed the AI toward a well-established solution without being overly prescriptive about the details.

**What Could Improve:**
- The command could have explicitly asked the AI to address basis risk as a known limitation of index insurance. Since the student was knowledgeable enough to suggest index insurance, pushing for a discussion of its main weakness would have produced a more complete analysis in a single round.

---

### Cycle 2

#### Steering Command Sent to AI

instructions:
  - name: "Two remaining issues"
    description: "Two remaining issues:"
  - name: "Basis risk is identified but not mitigated"
    description: "Basis risk is identified but not mitigated. What practical steps can reduce the gap between the index measurement and actual farm-level losses? Consider increasing weather station density, using satellite vegetation indices as supplementary data, or designing a hybrid trigger that combines index measurements with localized verification for claims above a threshold."
  - name: "Adverse selection may persist within risk tiers"
    description: "Adverse selection may persist within risk tiers. Even with three tiers, farmers within each tier differ. How does the scheme account for this residual heterogeneity? Consider experience rating (adjusting premiums based on claims history over time) and waiting periods for new enrollees."

#### Updated AI Output

**Basis Risk Mitigation:**

**Strategy 1: Increased Measurement Density**
- Deploy 50 additional low-cost automated weather stations across the region (estimated cost: $500,000 total, $10,000 per station). This reduces the average distance from farm to station from ~30km to ~10km, substantially reducing spatial basis risk.
- Supplement ground stations with satellite-derived vegetation indices (NDVI). Satellite data provides plot-level estimates of crop health at 10-meter resolution, available every 5 days. When NDVI data contradicts the rainfall index (e.g., station shows adequate rainfall but NDVI shows crop stress), a localized field verification is triggered.

**Strategy 2: Hybrid Trigger Design**
- **Primary trigger:** Rainfall index (fast, cheap, transparent).
- **Secondary trigger:** For claims where the rainfall index does not activate but NDVI data shows significant vegetation loss in the claimant's area, a localized assessment by extension officers is triggered. This hybrid approach limits costly field visits to disputed cases (~5-10% of claims) rather than requiring them for all.
- **Payout cap:** Hybrid-triggered payouts are capped at 50% of coverage value to limit exposure from the less-standardized verification pathway.

**Residual Adverse Selection — Within-Tier Heterogeneity:**

**Experience Rating Phase-In:**
- Years 1-3: Pure community rating within each risk tier (all farmers in a tier pay the same premium). This simplifies enrollment and builds the claims database needed for experience rating.
- Years 4+: Introduce experience rating. Farmers with zero claims in the prior 3 years receive a 15% premium discount. Farmers with above-average claims pay a 10% surcharge. This creates a dynamic incentive for risk reduction and partially reveals hidden risk types over time.

**Waiting Period for New Enrollees:**
- New enrollees face a one-season waiting period during which they pay premiums but are not eligible for payouts. This deters strategic enrollment — farmers who anticipate a bad season and enroll only to collect a payout. The waiting period imposes a cost on adverse selectors without affecting farmers who enroll and stay enrolled continuously.

**Residual Risk Acknowledgment:**
Even with tiered pricing, experience rating, and waiting periods, some adverse selection will persist. The scheme's reserve fund should be sized to absorb this residual: a reserve equal to 3 years of premium income (up from the original 2 years) provides a buffer against the expected above-average claims from within-tier selection effects.

#### Judging Feedback (Cycle 2)

**Grade: A (Comprehensive design with strong analytical grounding)**

**What Improved:**
- The basis risk mitigation strategy is practical and multi-layered. Combining ground stations, satellite data, and targeted field visits is the state of the art in developing-region agricultural insurance. The NDVI-based hybrid trigger is particularly well-conceived — it addresses the main criticism of pure index insurance without reverting to the impractical universal-verification model.
- The experience rating phase-in is well-designed. Starting with community rating (to build the database) and transitioning to experience rating (to partially reveal hidden types) reflects an understanding that information problems can be reduced over time even if they cannot be eliminated at the outset.
- The waiting period is the correct mechanism to deter strategic late enrollment, and limiting it to one season balances deterrence with accessibility.

**Minor Remaining Issues:**
- The scheme design does not address what happens if a catastrophic event affects the entire region simultaneously (covariate risk). If all 200,000 farmers claim in the same year, the reserve fund may be insufficient. Reinsurance or government backstop arrangements are standard for managing covariate risk in agricultural insurance.
- The experience rating surcharge (10% for above-average claims) may inadvertently penalize farmers who experienced genuine bad luck rather than those who are systematically higher risk. The design does not distinguish between bad luck and hidden risk type.

#### Steering Feedback (Cycle 2)

**Grade: A (Precisely targeted commands that produced a near-complete design)**

**What Worked:**
- Both commands addressed specific, identified gaps and were specific enough to produce detailed responses.
- The basis risk command provided three concrete options (weather stations, satellite indices, hybrid triggers), which gave the AI productive starting points without dictating the answer.
- The adverse selection command correctly identified that the problem persists within tiers and suggested two established mechanisms (experience rating, waiting periods) that the AI developed effectively.

**What Could Improve:**
- Could have included a prompt about covariate risk (region-wide catastrophic events). Agricultural insurance in developing regions is particularly vulnerable to this, and the absence of a reinsurance or backstop arrangement is a meaningful gap in the final design.

---

## Completion

### Final Grades

| Skill | Grade | Summary |
|-------|-------|---------|
| **Framing** | A | Strong identification of the adverse selection mechanism and missing trigger definition. Missed the voluntary-vs-mandatory tension and moral hazard dimension. |
| **Judging** | A | Correctly identified the AI's failure to address adverse selection, impractical verification, and homogeneous treatment. Missed covariate risk in later rounds. |
| **Steering** | A | Commands were specific, well-structured, and produced substantial design improvements. Each round built logically on identified gaps. Minor gap in not addressing covariate risk. |

### Session Summary

The student demonstrated strong understanding of the adverse selection problem at the core of this challenge. The framing correctly identified the missing yield data as the driver of selection risk and asked practical questions about proxy data availability. During the judge-and-steer cycles, the student effectively guided the AI from a naive single-premium voluntary scheme to a sophisticated multi-tiered design with index-based triggers, satellite monitoring, experience rating, and strategic enrollment deterrents. The strongest contributions were suggesting index-based insurance as an alternative to individual verification (which solved both the scalability and moral hazard problems) and pushing for experience rating to address within-tier adverse selection over time. The main growth areas are: (1) recognizing from the outset that voluntary participation is the mechanism through which adverse selection operates, so the mandatory-vs-voluntary question should appear in framing; and (2) addressing covariate risk, which is the other major threat to financial sustainability in agricultural insurance schemes.
