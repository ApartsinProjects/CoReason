# Session 4 — Crop Insurance Scheme for Smallholder Farmers (Multiple Choice)

**Challenge:** Design a crop insurance product for smallholder farmers in a developing region.
**Subject:** Market Failures > Information Asymmetry > Adverse Selection
**Response Mode:** Multiple Choice (5 Options)

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Design a crop insurance product for smallholder farmers in a developing region and produce a product specification document. The regional development bank wants to "protect farmers from catastrophic losses" while keeping the scheme "financially sustainable without permanent subsidies." Roughly 200,000 farmers grow "various crops" on plots ranging from "half a hectare to five hectares." Previous insurance programs in the region "had very low uptake." Weather data is available from "a few stations" but individual farm yield records are "mostly nonexistent."

### Student Framing Response

**Which of the following best describes the most critical analytical challenge in designing this product?**

**(A)** The region lacks sufficient banking infrastructure to process premium payments from 200,000 farmers.

**(B)** Without individual farm yield records, the insurer cannot distinguish high-risk from low-risk farmers, creating adverse selection: a voluntary scheme will attract disproportionately high-risk enrollees, driving up claims and premiums until the scheme becomes unsustainable or requires permanent subsidies.

**(C)** The development bank has not specified a target rate of return, making it impossible to determine whether the product is financially viable.

**(D)** Weather data from "a few stations" is insufficient to predict the exact timing of rainfall, which is needed to set planting-date-dependent coverage windows.

**(E)** The variety of crops grown means the insurer would need to develop separate actuarial models for each crop, which is too complex for a single product.

**Student selects: (B)**

### AI Output (with planted issues)

**Product Specification:**

**Coverage:** Insures 80% of expected yield value. Payout triggered when individual farm yield falls below 50% of the regional five-year average.

**Premium:** Flat rate of 6% of coverage value for all participants.

**Enrollment:** Voluntary and open to all farmers. Marketing campaign through village cooperatives.

**Loss Verification:** Extension officers conduct individual farm visits to estimate yield losses for all claims.

**Financial Model:** At 6% premium and an estimated catastrophic loss frequency of 1 in 8 years, the scheme breaks even with a reserve fund equal to 18 months of premium income. The flat premium is fair because risk is averaged across the full farming population.

### Framing Feedback

**Grade: A (Correctly identified the core information asymmetry problem)**

**Strengths:**
- Option (B) precisely identifies the adverse selection mechanism. The absence of individual yield data prevents risk classification, and voluntary enrollment allows high-risk farmers to self-select into the pool. The student correctly traced the consequence: escalating premiums, low-risk exit, pool deterioration, and eventual unsustainability. This is the textbook adverse selection spiral applied to a real-world context.

**Why Other Options Are Weaker:**
- **(A)** raises a practical concern but is a logistics problem, not an economic design challenge. Mobile money and cooperative-based collection can address this without changing the product design.
- **(C)** is relevant but secondary — the financial sustainability constraint implicitly defines the return target (break even without permanent subsidies).
- **(D)** overstates the precision needed. Index insurance does not require exact rainfall timing predictions, only aggregate measurements over defined periods.
- **(E)** is an implementation complexity concern, not the core analytical challenge. Multi-crop coverage can be addressed through product segmentation.

**Area for Improvement:**
- The student could have noted that the previous programs' low uptake is itself evidence of an adverse selection or design problem — either premiums were too high for low-risk farmers, or the product did not match farmers' actual risk exposure. Connecting the historical failure to the adverse selection diagnosis would have strengthened the framing.

---

## Phase 2 — Judge + Steer Cycles

### Cycle 1

#### AI Output Under Review

*(The AI output from Phase 1 above)*

#### Judging (Internal — Not Sent to AI)

gaps:
  - name: "Which of the following best describes the most"
    description: "Which of the following best describes the most significant flaw in the AI's product design? (A) The reserve fund of 18 months is too small to cover a catastrophic loss event. (B) The AI designs the product with voluntary enrollment and a flat premium for all farmers, completely ignoring the adverse selection problem: high-risk farmers will disproportionately enroll, the risk pool will deteriorate, and the flat premium will be insufficient to cover claims. (C) The AI does not specify which crops are covered by the insurance product. (D) The AI relies on extension officer visits for loss verification, which is expensive but not the most significant economic flaw. (E) The marketing strategy through village cooperatives may not reach isolated farmers. Student selects: (B) Grade: A (Correctly identified the fundamental design failure)"

#### Steering Command

**Which correction should the student send to the AI?**

**(A)** "Please increase the reserve fund to 3 years of premium income to better handle catastrophic events."

**(B)** "Please address adverse selection by: (1) classifying farmers into risk tiers using observable characteristics such as location, crop type, and plot size; (2) replacing individual farm loss verification with index-based insurance triggered by rainfall measurements; and (3) considering mandatory or quasi-mandatory enrollment to prevent risk pool deterioration."

**(C)** "Please reduce the premium from 6% to 4% to attract more participants."

**(D)** "Please add separate coverage options for each major crop type in the region."

**(E)** "Please partner with international reinsurers to transfer catastrophic risk off the scheme's balance sheet."

**Student selects: (B)**

#### Updated AI Output

**Revised Product Specification:**

**1. Risk Tiering Based on Observable Characteristics:**

| Risk Tier | Criteria | Premium Rate |
|-----------|----------|-------------|
| Low | Irrigated land; drought-resistant crop varieties; >2 hectares | 3.5% |
| Medium | Rain-fed; standard varieties; 1-2 hectares | 6% |
| High | Rain-fed; drought-sensitive crops; <1 hectare; drought-prone zone | 9% |

Observable proxies partially reveal hidden risk types. While imperfect, this classification reduces the cross-subsidization that drives adverse selection under a flat premium.

**2. Index-Based Insurance:**

Payouts are triggered by a rainfall index measured at the nearest weather station, not by individual farm yield assessment:
- Trigger: Growing-season rainfall below 65% of 20-year average.
- Payout: Graduated scale from 15% of coverage (at 65% rainfall) to 100% (at 25% rainfall or below).
- Advantage: Eliminates moral hazard in loss reporting, enables rapid payouts, and scales to 200,000 farmers.
- Limitation: Basis risk — the weather station measurement may not reflect conditions at every farm.

**3. Quasi-Mandatory Enrollment:**

Insurance is bundled with the development bank's seasonal credit facility. Farmers accessing subsidized loans must enroll in crop insurance. This broadens the risk pool beyond self-selecting high-risk farmers without requiring a legal mandate.

#### Judging Feedback (Cycle 1)

**Grade: A (Substantial improvement, one key gap)**

The revised design directly addresses the three main flaws identified. Risk tiering reduces adverse selection by charging risk-appropriate premiums. Index insurance eliminates moral hazard in verification and enables scalability. Quasi-mandatory enrollment through credit bundling broadens the pool. The remaining significant gap is basis risk: the index may not reflect actual conditions at individual farms, particularly those far from weather stations. This is the primary criticism of index insurance in developing regions and needs a mitigation strategy.

#### Steering Feedback (Cycle 1)

**Grade: A (Comprehensive, well-structured correction)**

Option (B) was the strongest choice because it addressed all three dimensions of the design failure simultaneously: risk classification (adverse selection), verification method (moral hazard and scalability), and enrollment mechanism (pool composition). The command was specific enough to guide the AI toward established solutions (risk tiers, index insurance, mandatory enrollment) while leaving room for the AI to develop the details. The other options addressed secondary concerns (A, D, E) or would have worsened adverse selection by lowering premiums without fixing the underlying problem (C).

---

### Cycle 2

#### Judging (of Updated AI Output)

**Which remaining issue most needs to be addressed?**

**(A)** The scheme needs a formal governance structure with a board of directors representing farmer interests.

**(B)** Basis risk — the gap between the rainfall index and actual farm conditions — is the primary weakness of the index design and needs specific mitigation measures, such as additional weather stations or satellite vegetation indices.

**(C)** The premium rates (3.5%, 6%, 9%) need to be validated against actuarial data.

**(D)** The scheme should offer coverage for livestock in addition to crops.

**(E)** The credit bundling mechanism may exclude farmers who do not use the development bank's loan program.

**Student selects: (E)**

**Grade: B (Valid concern but not the highest priority)**

Option (E) raises a legitimate design issue — credit bundling only reaches farmers who borrow from the development bank, potentially excluding subsistence farmers who do not access formal credit. However, option (B) is the higher priority. Basis risk is the fundamental weakness of index insurance: if the index does not reflect farm-level conditions, farmers may pay premiums but receive no payout when they experience losses (or receive payouts when they have no losses). This undermines trust, reduces willingness to re-enroll, and may explain the "very low uptake" of previous programs. Addressing basis risk is essential to the product's credibility and survival.

#### Steering Command

**Which command best addresses the identified remaining gap?**

**(A)** "Please add a mobile-based enrollment option for farmers who do not use the development bank."

**(B)** "Please address basis risk by proposing specific mitigation measures — for example, increasing weather station density, supplementing rainfall data with satellite vegetation indices, or designing a hybrid trigger that combines the index with localized verification for disputed claims."

**(C)** "Please conduct a pilot program in one district before scaling to the full region."

**(D)** "Please add a complaint mechanism for farmers who disagree with payout decisions."

**(E)** "Please calculate the expected number of false negatives (farmers with losses who do not receive payouts) under the current weather station coverage."

**Student selects: (B)**

#### Updated AI Output

**Basis Risk Mitigation Strategy:**

**1. Weather Station Expansion:**
Deploy 40 additional automated weather stations (cost: ~$8,000 each, total: $320,000). This reduces average farm-to-station distance from approximately 35km to 12km, substantially improving the correlation between measured rainfall and farm-level conditions.

**2. Satellite Vegetation Index (NDVI) Supplement:**
Integrate NDVI (Normalized Difference Vegetation Index) satellite data as a secondary trigger. NDVI measures crop health at approximately 10-meter resolution from freely available Sentinel-2 satellite imagery. When the rainfall index does not trigger but NDVI data shows significant vegetation stress in a farmer's area, a secondary payout pathway is activated.

**3. Hybrid Trigger Protocol:**
- **Primary pathway (80% of payouts):** Automatic payout based on rainfall index. No individual verification needed. Fast and scalable.
- **Secondary pathway (20% of payouts):** For farmers in areas where NDVI contradicts the rainfall index, localized verification by extension officers confirms or denies the claim. Payouts capped at 60% of coverage value through this pathway to limit moral hazard.

**4. Residual Basis Risk Acknowledgment:**
Even with these measures, some basis risk remains. The product disclosure document will include a clear explanation that the index may not perfectly match every farm's experience. This transparency manages expectations and reduces the trust erosion that undermined previous insurance programs.

#### Judging Feedback (Cycle 2)

**Grade: A (Practical, well-layered mitigation strategy)**

The basis risk mitigation is comprehensive. The three-layer approach (more stations, satellite data, hybrid triggers) progressively addresses spatial mismatch between the index and farm conditions. The NDVI integration is particularly strong — it leverages freely available data to provide near-farm-level crop health estimates. The hybrid trigger design balances scalability (primary pathway) with individual accuracy (secondary pathway). The residual risk acknowledgment is a practical addition that should improve farmer trust. The minor remaining gap is that the scheme still lacks a reinsurance or backstop arrangement for region-wide catastrophic events — if drought affects the entire region simultaneously, the reserve fund may be insufficient.

#### Steering Feedback (Cycle 2)

**Grade: A (Recovered from imperfect judging with a strong steering selection)**

The student initially prioritized a lower-ranked issue in judging (credit access exclusion over basis risk), but selected the correct steering command to address basis risk. This partial self-correction shows adaptive reasoning — the student recognized during the steering phase that basis risk was the more critical concern. The command itself was well-structured, offering three specific mitigation approaches that gave the AI productive starting points. The main lesson is to prioritize issues that affect the product's core economic mechanism (basis risk undermines the fundamental insurance value proposition) over issues that affect access channels (credit bundling exclusion is an enrollment logistics concern).

---

## Completion

### Final Grades

| Skill | Grade | Summary |
|-------|-------|---------|
| **Framing** | A | Correctly identified the adverse selection mechanism as the core design challenge. |
| **Judging** | B | Strong first-cycle identification of the adverse selection design failure. Second-cycle prioritization was slightly off (enrollment access over basis risk). |
| **Steering** | A | Consistently selected the most analytically productive corrections. Strong first-cycle command addressed all three dimensions simultaneously. |

### Session Summary

The student demonstrated strong understanding of adverse selection as the central economic challenge in crop insurance design. The framing was precise, correctly linking the absence of individual yield data to the classic adverse selection spiral. The first judge-steer cycle was excellent: the student identified all three major design failures (no risk classification, impractical verification, voluntary enrollment) and selected a comprehensive correction that addressed each simultaneously. The second cycle showed a minor prioritization error — choosing enrollment access over basis risk — but the student recovered by selecting the correct steering command. The progression from a flat-premium voluntary scheme to a tiered index-based product with satellite monitoring and hybrid triggers represents genuine analytical advancement. The main growth areas are: (1) developing more systematic issue prioritization during judging (distinguishing economic mechanism failures from implementation logistics concerns), and (2) addressing catastrophic covariate risk, which requires reinsurance arrangements beyond the scheme's own reserves.
