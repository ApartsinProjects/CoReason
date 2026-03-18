# Session 3 — Streaming Platform Antitrust Brief (Multiple Choice)

**Challenge:** Assess whether a dominant music streaming platform should be classified as a natural monopoly.
**Subject:** Market Structures > Monopoly > Natural Monopoly
**Response Mode:** Multiple Choice (5 Options)

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Prepare a 5-page economic analysis brief assessing whether a dominant music streaming platform should be classified as a natural monopoly and what regulatory remedies, if any, are warranted. The platform holds "over 70% of streaming subscriptions" in the country, operates at "razor-thin margins," and has exclusive licensing deals with "most major labels." Independent artists say the platform's playlist algorithm "controls who gets heard." The brief will be submitted to a parliamentary committee reviewing digital market competition.

### Student Framing Response

**Which of the following best describes the most critical analytical gap in this problem?**

**(A)** The problem does not specify the platform's founding date, which is needed to assess whether its market position is durable.

**(B)** The problem does not provide evidence on cost subadditivity (whether one firm can serve the market at lower total cost than multiple firms), which is the defining condition for natural monopoly — without this, the 70% market share figure cannot answer the question being asked.

**(C)** The problem does not list the platform's competitors by name, making competitive analysis impossible.

**(D)** The problem does not specify the subscription price, so we cannot assess whether consumers are being harmed.

**(E)** The problem does not state whether the platform is publicly traded, which affects the type of financial data available for analysis.

**Student selects: (B)**

### AI Output (with planted issues)

**Brief Summary:**

The platform holds over 70% of the streaming market, making it a de facto monopoly. Its razor-thin margins indicate it is not earning supernormal profits, which is consistent with natural monopoly pricing at average cost. The exclusive licensing deals create insurmountable barriers to entry. The platform should be regulated as a natural monopoly with price controls and mandatory content sharing requirements.

The key evidence supporting the natural monopoly classification:
1. Dominant market share (>70%)
2. Low margins consistent with average-cost pricing
3. High barriers to entry from licensing exclusivity
4. No credible competitors have emerged despite the market's growth

### Framing Feedback

**Grade: A (Correctly identified the core analytical gap)**

**Strengths:**
- Option (B) precisely identifies the definitional gap. Natural monopoly is a cost-structure concept, not a market-share concept. Without evidence that costs are subadditive, no amount of market share data can establish natural monopoly status. This shows the student understands the distinction between descriptive market dominance and the structural economic condition.

**Why Other Options Are Weaker:**
- **(A)** Founding date correlates with durability but is neither necessary nor sufficient for natural monopoly classification.
- **(C)** Competitor names would enrich the analysis but are not the critical missing element.
- **(D)** Price data matters for consumer harm analysis but not for the natural monopoly classification question itself.
- **(E)** Public listing affects data availability but not the analytical framework.

---

## Phase 2 — Judge + Steer Cycles

### Cycle 1

#### AI Output Under Review

*(The AI output from Phase 1 above)*

#### Judging (Internal — Not Sent to AI)

gaps:
  - name: "Which of the following best describes the most"
    description: "Which of the following best describes the most fundamental error in the AI's analysis? (A) The AI fails to mention the playlist algorithm issue raised by independent artists. (B) The AI equates high market share with natural monopoly without testing for cost subadditivity, and treats exclusive licensing (a contractual barrier) as evidence of natural monopoly (a cost-structure condition). (C) The AI's brief is too short for a 5-page requirement. (D) The AI does not compare the platform to natural monopolies in other industries (utilities, railroads). (E) The AI does not discuss the platform's profitability trend over time. Student selects: (B) Grade: A (Precisely identified the core analytical error)"

#### Steering Command

**Which correction should the student send to the AI?**

**(A)** "Please expand the brief to 5 full pages with more supporting evidence."

**(B)** "Please add a comparison to the EU's regulation of similar platforms."

**(C)** "Please separate your analysis into two distinct arguments: (1) test for cost subadditivity by examining whether the platform's cost structure means one firm produces at lower total cost than multiple firms, and (2) assess whether network effects create demand-side economies of scale that differ from supply-side cost subadditivity. Then reconsider whether the 'natural monopoly' label is accurate."

**(D)** "Please add a section on the history of antitrust enforcement against technology companies."

**(E)** "Please interview industry experts to strengthen the analysis."

**Student selects: (C)**

#### Updated AI Output

**Revised Analysis:**

**Test 1: Cost Subadditivity (Supply-Side)**

A natural monopoly requires that C(Q) < C(Q₁) + C(Q₂) for all ways to divide total output Q. For the streaming platform:

- **Fixed costs:** High — licensing advances ($1B+), server infrastructure ($300M+), algorithm R&D ($200M+). These are spread across the user base, creating declining average costs.
- **Marginal costs:** Very low — incremental bandwidth and per-stream royalties cost fractions of a cent per play.

This cost structure produces economies of scale, but subadditivity is not guaranteed. A second platform using cloud infrastructure could achieve comparable marginal costs and, if it reached sufficient scale, could spread its fixed costs comparably. The key question is the minimum efficient scale (MES): how large must a platform be to exhaust most scale economies? If MES is 30% of the market, two firms could coexist efficiently. If MES is 70%+, single-firm production is likely most efficient.

**Assessment:** Without proprietary cost data, subadditivity cannot be confirmed. The available evidence (razor-thin margins, high fixed costs) is *consistent with* but does not *prove* natural monopoly.

**Test 2: Network Effects (Demand-Side)**

- **Direct network effects:** Weak. Users do not directly benefit from other users' presence (unlike social media platforms).
- **Indirect network effects:** Strong. More subscribers attract more content (labels prefer the platform with the largest audience), and more content attracts more subscribers. This creates a demand-side feedback loop that advantages the incumbent independently of its cost structure.

**Key Insight:** The platform's dominance is better explained by indirect network effects (demand-side) than by cost subadditivity (supply-side). A competitor could potentially match the platform's costs by using cloud infrastructure, but it cannot easily replicate the content library and user base that drive the network effect.

**Revised Conclusion:** Labeling the platform a "natural monopoly" in the strict economic sense is not supported by available evidence. Its dominance stems primarily from demand-side network effects and contractual barriers (exclusive licensing), not from cost subadditivity. The regulatory implications differ: natural monopoly warrants utility-style regulation; demand-side dominance warrants pro-competitive intervention (mandated interoperability, non-exclusive licensing).

#### Judging Feedback (Cycle 1)

**Grade: A (Strong revision, gaps remain)**

The separation of supply-side and demand-side arguments is the key improvement. Correctly identifying that network effects — not cost subadditivity — drive dominance reframes the entire regulatory analysis. The minimum efficient scale question is well-posed and directly relevant. However, two gaps remain: (1) the remedies section has not been updated to reflect the revised diagnosis, and (2) there is no assessment of market contestability — whether potential entrants face barriers that make the dominance durable versus temporary.

#### Steering Feedback (Cycle 1)

**Grade: A (Excellent precision and analytical depth)**

Option (C) was the strongest available command. It targeted the exact error identified in judging and provided specific analytical structure (two separate tests) that guided the AI toward a rigorous revision. The other options were either cosmetic (A), tangential (B, D), or impractical (E). The command's strength was its specificity: rather than saying "fix the natural monopoly analysis," it told the AI exactly what analytical framework to apply.

---

### Cycle 2

#### Judging (of Updated AI Output)

**Which remaining issue most needs to be addressed in the next steering command?**

**(A)** The analysis needs more real-world data points about streaming platform costs.

**(B)** The regulatory recommendations need to be revised to match the new diagnosis (demand-side dominance, not natural monopoly), and each remedy should be evaluated for feasibility and unintended consequences.

**(C)** The analysis should include a formal mathematical proof of subadditivity.

**(D)** The brief needs a section on consumer satisfaction survey data.

**(E)** The analysis should address whether the platform's dominance is likely to increase or decrease over time.

**Student selects: (E)**

**Grade: B (Valid concern but not the highest priority)**

Option (E) raises a relevant question — market dynamics and trend analysis inform whether intervention is urgent. However, option (B) is the higher priority. The brief's remedies still do not match its revised diagnosis. Recommending price controls and mandatory content sharing (appropriate for a natural monopoly) when the analysis concludes the platform is NOT a natural monopoly creates an internal contradiction. Fixing this inconsistency is more urgent than adding trend analysis.

#### Steering Command

**Which command best addresses the remaining analytical needs?**

**(A)** "Please add trend data showing whether the platform's market share is growing or declining."

**(B)** "Please revise the regulatory recommendations to match your revised diagnosis. If the platform dominates through network effects and contracts rather than cost subadditivity, recommend pro-competitive remedies (such as non-exclusive licensing mandates or data portability) rather than utility-style price regulation. Evaluate each remedy's costs and potential unintended consequences."

**(C)** "Please shorten the brief to make it more accessible to non-economists."

**(D)** "Please add a section on the platform's corporate governance structure."

**(E)** "Please recommend breaking up the platform into smaller companies."

**Student selects: (B)**

#### Updated AI Output

**Revised Regulatory Recommendations:**

Given that the platform's dominance stems from network effects and contractual barriers rather than cost subadditivity, utility-style regulation (price controls, rate-of-return regulation) is inappropriate. Instead, the committee should consider pro-competitive remedies that reduce barriers to entry and contestability:

**1. Non-Exclusive Licensing Mandate**
- *Action:* Prohibit exclusive content licensing agreements between platforms and record labels.
- *Benefit:* Removes the most significant artificial barrier to entry. New platforms could offer comparable catalogs, enabling competition on price, user experience, and recommendation quality.
- *Risk:* Labels may reduce upfront investment in artist development if exclusivity premiums disappear. Estimated reduction: 10-20% of current advances.
- *Mitigation:* Transition period of 3 years for existing contracts; new exclusivity agreements prohibited immediately.

**2. Data Portability Standard**
- *Action:* Require platforms to enable users to export and import listening histories, playlists, and preference profiles in a standardized format.
- *Benefit:* Reduces switching costs, enabling consumers to move to competitors without losing their personalized experience.
- *Risk:* Privacy concerns regarding large-scale data transfers. Potential free-riding on the incumbent's data investment.
- *Mitigation:* User consent required for each transfer; anonymized aggregate data excluded from portability.

**3. Algorithm Criteria Disclosure (NOT Full Algorithm)**
- *Action:* Require platforms to publish the general criteria (e.g., popularity weighting, recency, genre matching) used in recommendation algorithms, without disclosing proprietary code.
- *Benefit:* Addresses independent artists' concerns about opaque gatekeeping.
- *Risk:* If criteria disclosure is too detailed, it enables gaming by labels with resources to optimize for the algorithm.
- *Mitigation:* Criteria categories disclosed annually; specific weightings reviewed by a confidential regulatory panel.

**NOT Recommended: Price Controls**
- *Rationale:* The platform's razor-thin margins suggest competitive pricing. Price regulation would add compliance costs, reduce incentives for quality improvement, and address a symptom (pricing) rather than the cause (barriers to entry) of limited competition. Price controls are a natural monopoly remedy; this is not a natural monopoly.

#### Judging Feedback (Cycle 2)

**Grade: A (Coherent, well-reasoned recommendations)**

The revised remedies now match the diagnosis. Rejecting price controls because the platform is not a natural monopoly — and instead targeting the specific sources of dominance (exclusive contracts, switching costs, algorithmic opacity) — demonstrates analytical coherence. Each remedy includes benefit-risk-mitigation analysis, which is appropriate for a parliamentary brief. The minor gap is the absence of a welfare standard discussion: should the committee prioritize consumer welfare, total surplus, or broader stakeholder interests? This choice affects which remedies are justified and how aggressively they should be implemented.

#### Steering Feedback (Cycle 2)

**Grade: A (Effective course correction after imperfect judging)**

The student initially selected a lower-priority judging concern (market trends) over the more urgent remedy-diagnosis mismatch. However, the student then selected the correct steering command (B), which addressed the higher-priority issue. This partial self-correction shows good instincts even if the initial judgment was slightly off. The command was specific, well-structured, and produced a substantive revision that resolved the brief's internal contradiction.

---

## Completion

### Final Grades

| Skill | Grade | Summary |
|-------|-------|---------|
| **Framing** | A | Correctly identified the cost subadditivity gap as the core analytical issue. |
| **Judging** | B | Strong first-cycle identification of the market-share-equals-monopoly error. Second-cycle prioritization was slightly off (chose market trends over remedy-diagnosis mismatch). |
| **Steering** | A | Consistently selected the most analytically productive corrections. First-cycle command was outstanding; second-cycle recovered well from imperfect judging. |

### Session Summary

The student's strongest skill was framing — correctly identifying from the outset that cost subadditivity evidence is the critical missing element for a natural monopoly assessment. This insight carried through the entire session and drove the most important analytical transformation: from "70% share = natural monopoly" to "dominance through network effects and contracts, not cost subadditivity, requiring pro-competitive remedies." The judging skill was strong in the first cycle but slightly weaker in the second, where the student prioritized a valid but lower-priority concern (market dynamics) over the urgent remedy-diagnosis inconsistency. The steering recovered effectively, with each command producing meaningful analytical improvement. The main growth area is developing more systematic judging — checking each element of the output against the diagnosis for consistency rather than identifying issues in isolation.
