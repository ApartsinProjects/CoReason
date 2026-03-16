# Session 1 — Concert Ticket Pricing Model (Multiple Choice)

**Challenge:** Build a tiered pricing model for a mid-size music venue launching a new season of concerts.
**Subject:** Supply & Demand > Elasticity > Price Elasticity of Demand
**Response Mode:** Multiple Choice (5 Options)

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Build a tiered pricing model for a mid-size music venue launching a new season of concerts. The venue has "about 3,000 seats" across several sections. Management wants to "maximize revenue" while keeping attendance "high enough to create a good atmosphere." Deliver a pricing spreadsheet with at least three ticket tiers, a dynamic adjustment rule for how prices change as the show date approaches, and a one-page memo explaining the economic rationale. Some past shows sold out instantly; others had "lots of empty seats."

### Student Framing Response

**Which of the following best describes the most critical issue with this problem as stated?**

**(A)** The venue capacity of 3,000 seats is too vague — we need an exact count for each section before any pricing analysis can begin.

**(B)** The problem asks to "maximize revenue" but provides no data on demand responsiveness (price elasticity), so the pricing model has no empirical basis for determining whether raising or lowering prices increases total revenue.

**(C)** The problem fails to specify the genre of music, which determines the target demographic and therefore the appropriate price range.

**(D)** Dynamic pricing is unethical and the student should flag that the problem's premise is flawed on normative grounds.

**(E)** The problem omits cost data, and without knowing fixed and variable costs, we cannot determine profitability for any pricing scenario.

**Student selects: (B)**

### AI Output (with planted issues)

**AI Pricing Model:**

Here is a tiered pricing model optimized for maximum revenue:

| Tier | Seats | Base Price | Dynamic Rule |
|------|-------|-----------|--------------|
| VIP | 400 | $150 | +20% in final 2 weeks |
| Standard | 1,800 | $80 | +10% in final 2 weeks |
| Budget | 800 | $35 | Flat |

**Rationale:** Since the venue wants to maximize revenue, prices should be set as high as the market will bear. The VIP tier captures the highest willingness-to-pay. Dynamic pricing ensures no money is left on the table for popular shows. For shows that historically had empty seats, the Budget tier provides an accessible entry point that maintains atmosphere.

The model assumes demand is relatively constant regardless of price for the VIP segment, while Budget buyers are more price-conscious. Total projected revenue per sold-out show: $228,000.

### Framing Feedback

**Grade: A (Correct identification of the core issue)**

**Strengths:**
- Option (B) is the best answer. The absence of elasticity data is the most critical analytical gap because the entire pricing model — base prices, tier differentials, and dynamic adjustment rules — depends on how quantity demanded responds to price changes. Without this data, the model is economically unfounded.
- The student correctly distinguished this from option (E), which concerns costs. While cost data matters for profitability, the problem specifically asks about revenue maximization, which depends on the demand side. This shows precise reading of the objective.

**Why Other Options Are Weaker:**
- **(A)** is not critical — approximate seat counts are sufficient for a pricing model; precision in capacity does not resolve the fundamental elasticity question.
- **(C)** is relevant but secondary — genre affects demographics, which in turn affects elasticity, but the deeper issue is the missing elasticity data itself, not the demographic pathway to it.
- **(D)** is normative, not analytical — the problem asks for economic analysis, not ethical evaluation.
- **(E)** is important for profitability but secondary for the revenue maximization objective as stated.

**Area for Improvement:**
- The MC format limits depth, but ideally the student would also recognize that the problem conflates short-run and long-run elasticity. A stronger framing would note that aggressive dynamic pricing might maximize single-show revenue but erode long-run demand if customers perceive prices as unfair.

---

## Phase 2 — Judge + Steer Cycles

### Cycle 1

#### AI Output Under Review

*(The AI output from Phase 1 above)*

#### Judging (Internal — Not Sent to AI)

gaps:
  - name: "Which of the following best describes the most"
    description: "Which of the following best describes the most significant economic error in the AI's output? (A) The AI uses round numbers for seat counts, which suggests the model lacks precision. (B) The AI calculates total projected revenue but does not discount it to present value. (C)** The AI applies pricing rules without stating or justifying any elasticity estimate, and implicitly assumes VIP demand is perfectly inelastic ("

#### Steering Command

**Which correction should the student send to the AI to address the identified issue?**

**(A)** "Please add a fourth pricing tier between Standard and VIP."

**(B)** "Please state an explicit price elasticity of demand estimate for each tier and demonstrate how total revenue changes if elasticity is -0.5 versus -1.5 for the Standard tier."

**(C)** "Please add a cost analysis to accompany the revenue projections."

**(D)** "Please cite real-world examples of successful concert pricing models."

**(E)** "Please explain why dynamic pricing is fair to consumers."

**Student selects: (B)**

#### Updated AI Output

**Revised Model with Elasticity Assumptions:**

| Tier | Seats | Base Price | Assumed PED | Dynamic Rule |
|------|-------|-----------|-------------|--------------|
| VIP | 400 | $150 | -0.4 | Increase price if >80% sold 2 weeks out |
| Standard | 1,800 | $80 | -1.0 | Adjust ±10% based on sales pace |
| Budget | 800 | $35 | -2.0 | Decrease price if <50% sold 1 week out |

**Revenue Sensitivity — Standard Tier (1,800 seats at $80 base):**

- If PED = -0.5: 10% price increase → 5% quantity decrease. Revenue moves from $144,000 to $150,480. **Revenue rises.** Raising prices is optimal.
- If PED = -1.5: 10% price increase → 15% quantity decrease. Revenue moves from $144,000 to $134,640. **Revenue falls.** Holding or lowering prices is optimal.

**Conclusion:** The optimal pricing strategy depends critically on the elasticity regime. Without observed data, the venue should test prices across early-season shows to estimate actual elasticity before committing to a season-wide pricing structure.

#### Judging Feedback (Cycle 1)

**Grade: A (Correctly identified the core flaw)**

The student correctly identified that the AI's most significant error was applying pricing rules without any elasticity foundation. Option (C) captures this precisely — the AI treated VIP demand as near-perfectly inelastic without justification and set dynamic rules without connecting them to demand responsiveness. The other options identify real but secondary issues that do not address the fundamental analytical gap.

#### Steering Feedback (Cycle 1)

**Grade: A (Precise, actionable correction)**

Option (B) is the strongest steering command because it:
1. Demands explicit assumptions rather than implicit ones.
2. Specifies a concrete comparison (PED = -0.5 vs -1.5) that forces the AI to demonstrate the total revenue test.
3. Targets the exact flaw identified in judging, creating a coherent judge-then-steer sequence.

The other options would not have addressed the elasticity gap: (A) adds complexity without fixing the reasoning, (C) shifts focus to costs, (D) requests examples rather than analysis, and (E) moves to normative territory.

---

### Cycle 2

#### Judging (of Updated AI Output)

**Which remaining issue in the revised AI output most needs correction?**

**(A)** The elasticity values are stated but not sourced — they could be arbitrary numbers that happen to look reasonable.

**(B)** The model does not account for seasonal variation in concert demand.

**(C)** The AI should have used a regression model rather than simple percentage calculations.

**(D)** The AI does not address how to handle group bookings or corporate purchases.

**(E)** The dynamic rule thresholds (80%, 50%) are stated without explaining how they were chosen.

**Student selects: (A)**

**Grade: A (Good identification, slightly incomplete)**

The student correctly identified that unsourced elasticity estimates are a significant weakness — stated assumptions without justification are only marginally better than unstated assumptions. Option (E) is also a valid concern (the thresholds are arbitrary), but (A) is more fundamental because the entire model's validity depends on the elasticity values being defensible. A complete answer would have noted both (A) and (E) as related problems.

#### Steering Command

**Which follow-up command best addresses the identified issue?**

**(A)** "Use different elasticity values — the current ones seem too low."

**(B)** "Justify each elasticity estimate by citing comparable industry data or proposing a method to empirically estimate them from the venue's own sales history."

**(C)** "Run a regression analysis on the venue's historical data."

**(D)** "Replace the elasticity assumptions with a machine learning demand forecasting model."

**(E)** "Ask the venue management what elasticity values they think are correct."

**Student selects: (B)**

#### Updated AI Output

**Sourced Elasticity Justification:**

- **VIP (PED = -0.4):** Consistent with Huntington (1993) estimates for premium performing arts tickets (range: -0.2 to -0.6). VIP buyers exhibit low price sensitivity due to experiential exclusivity and income levels that make ticket cost a small budget share.
- **Standard (PED = -1.0):** Near-unit elasticity is the midpoint finding in Throsby (1994) and subsequent meta-analyses of general admission live entertainment. These buyers have meaningful substitution options (other entertainment, other venues).
- **Budget (PED = -2.0):** High elasticity reflects price-sensitive segments documented in Seaman (2006) for discount and student ticket categories. Budget buyers readily substitute toward free or low-cost alternatives.

**Empirical Estimation Plan:** Conduct controlled pricing experiments over 6 early-season shows: randomize Standard tier prices across $70, $80, and $90 for comparable shows and measure ticket sales at each price point. Calculate arc elasticity from observed price-quantity pairs.

**Memo Update:** The client-facing memo now includes an "Assumptions and Limitations" appendix listing each elasticity source, the estimation plan, and a clear statement that pricing recommendations should be updated as observed data replaces assumed values.

#### Judging Feedback (Cycle 2)

**Grade: A (Good improvement, one gap remains)**

The revised output substantially improves credibility by grounding elasticity estimates in published research and proposing an empirical estimation plan. The remaining gap is that the analysis focuses entirely on own-price elasticity without considering cross-price elasticity (how competitor pricing affects demand) or income elasticity (how the target market's economic conditions affect concert attendance). For a complete pricing model, these additional elasticity dimensions would need to be addressed.

#### Steering Feedback (Cycle 2)

**Grade: A (Effective and well-targeted)**

Option (B) was the strongest choice because it required the AI to either cite evidence or propose methodology — both of which strengthen the analysis. It avoided the trap of options (A) and (E), which would have introduced unsupported changes, and options (C) and (D), which demand capabilities beyond the scope of a memo-style deliverable.

---

## Completion

### Final Grades

| Skill | Grade | Summary |
|-------|-------|---------|
| **Framing** | A | Correctly identified the missing elasticity data as the core problem. Would benefit from noting additional elasticity dimensions. |
| **Judging** | A | Consistently identified the most significant analytical flaws in each AI output. Slight incompleteness in not flagging secondary issues. |
| **Steering** | A | Selected precise, actionable corrections that produced meaningful improvements in each cycle. Strong coherence between judging and steering. |

### Session Summary

The student demonstrated excellent diagnostic skills throughout this session, consistently selecting the most analytically important option at each decision point. In framing, the student correctly prioritized the elasticity data gap over secondary concerns like cost data or ethical considerations. During judging, the student reliably distinguished between fundamental analytical errors (missing elasticity assumptions) and surface-level issues (rounding, formatting). The steering choices were consistently well-targeted, each producing a substantial improvement in the AI's output. The main area for growth is breadth: the student focused effectively on own-price elasticity but did not push the analysis toward cross-price or income elasticity, which would have produced a more complete pricing framework.
