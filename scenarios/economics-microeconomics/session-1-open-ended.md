# Session 1 — Concert Ticket Pricing Model (Open-Ended)

**Challenge:** Build a tiered pricing model for a mid-size music venue launching a new season of concerts.
**Subject:** Supply & Demand > Elasticity > Price Elasticity of Demand
**Response Mode:** Open-Ended (Structured Sections)

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Build a tiered pricing model for a mid-size music venue launching a new season of concerts. The venue has "about 3,000 seats" across several sections. Management wants to "maximize revenue" while keeping attendance "high enough to create a good atmosphere." Deliver a pricing spreadsheet with at least three ticket tiers, a dynamic adjustment rule for how prices change as the show date approaches, and a one-page memo explaining the economic rationale. Some past shows sold out instantly; others had "lots of empty seats."

### Student Framing Response

**Ambiguities and Missing Information:**

1. The problem says "maximize revenue" but does not define whether this means total revenue per show, per season, or revenue net of costs. There is also no stated minimum attendance threshold — "good atmosphere" is subjective. I would ask management to define a minimum fill rate (e.g., 70% of capacity) as a hard constraint.

2. We lack data on demand responsiveness. Without historical price-quantity pairs, we cannot estimate the price elasticity of demand for each tier. The problem assumes we can set dynamic prices but gives us no basis for knowing whether a $5 price cut adds 50 or 500 ticket sales. I would request at least two seasons of past ticket sales data broken down by section and show date proximity.

3. The problem doesn't address substitutes. Are there competing venues, free outdoor events, or streaming alternatives? The availability of close substitutes would make demand more elastic, and this matters for whether raising prices loses many or few customers.

**What I Would Not Flag:**

I think the three-tier structure is reasonable and wouldn't question it. I also wouldn't flag the "several sections" language — three tiers mapped to front, middle, and back seems standard.

### AI Output (with planted issues)

**AI Pricing Model:**

I recommend the following three-tier model:

| Tier | Seats | Base Price | Dynamic Rule |
|------|-------|-----------|--------------|
| Premium (Front) | 500 | $120 | +15% per week in final 4 weeks |
| Standard (Middle) | 1,500 | $75 | +10% per week in final 4 weeks |
| Economy (Back) | 1,000 | $40 | No change |

**Dynamic Adjustment:** Prices increase as the show date approaches because demand always rises closer to the event. For shows that historically sold out, apply a 1.5x surge multiplier starting 2 weeks before the show.

**Economic Rationale:** Higher prices for better seats capture consumer surplus from fans willing to pay more. The tiered structure ensures revenue maximization across all segments. Dynamic pricing allows the venue to respond to demand signals in real time.

This model will maximize revenue because raising prices captures more per ticket, and the venue's strong brand means attendance will remain high regardless of price changes.

### Framing Feedback

**Grade: A (Good identification of key gaps, missed some important dimensions)**

**Strengths:**
- Correctly identified the missing elasticity data as the central gap — without price-quantity history, any pricing model is guesswork. This shows strong economic intuition.
- Good catch on the vague "good atmosphere" objective and the suggestion to operationalize it as a minimum fill rate.
- Appropriate mention of substitute availability as a determinant of elasticity.

**Areas for Improvement:**
- Did not question which elasticity concept is most relevant. Own-price elasticity matters most here, but income elasticity (are concerts a luxury or necessity for the target demographic?) and cross-price elasticity (how does competitor pricing affect demand?) also shape the optimal pricing strategy. Flagging these would have shown deeper analytical sophistication.
- Missed the time-horizon dimension of elasticity. Demand responsiveness differs between the short run (single show) and the long run (full season or multi-season). If the venue prices aggressively now, it may lose repeat customers over time — a long-run elasticity effect the problem implicitly requires but never states.
- Did not note that the problem assumes elasticity is constant, when in reality elasticity varies along the demand curve. At high prices, demand is typically more elastic; at low prices, less so. This is critical for the dynamic pricing rule.

---

## Phase 2 — Judge + Steer Cycles

### Cycle 1

#### AI Output Under Review

*(The AI output from Phase 1 above)*

#### Judging (Internal — Not Sent to AI)

gaps:
  - name: "The AI sets prices and dynamic rules without ever"
    description: "The AI sets prices and dynamic rules without ever quantifying or even estimating price elasticity. The base prices and adjustment percentages appear arbitrary — there is no connection between the chosen numbers and any demand analysis."
  - name: "This is not universally true"
    description: "This is not universally true. For less popular acts, last-minute demand may be low, and rising prices would further suppress attendance. The AI treats all shows identically rather than conditioning the dynamic rule on demand signals."
  - name: "Claims"
    description: "Claims"
  - name: "The 15% and 10% weekly increases assume the same demand"
    description: "The 15% and 10% weekly increases assume the same demand response at every price level. No acknowledgment that elasticity varies along the demand curve. Grade: C (Multiple substantive errors in economic reasoning)"

#### Steering Command Sent to AI

instructions:
  - name: "Your pricing model sets specific prices and dynamic"
    description: "Your pricing model sets specific prices and dynamic adjustment rules, but nowhere do you state what elasticity of demand you are assuming or how your prices relate to demand responsiveness. Please:"
  - name: "State an explicit elasticity assumption for each tier"
    description: "State an explicit elasticity assumption for each tier (even if estimated)."
  - name: "Show how the revenue outcome changes if elasticity is"
    description: "Show how the revenue outcome changes if elasticity is -0.5 (inelastic) versus -1.5 (elastic) for the Standard tier."
  - name: "Revise the dynamic pricing rule so that it responds to"
    description: "Revise the dynamic pricing rule so that it responds to actual sales velocity rather than assuming demand always increases near the show date."

#### Updated AI Output

**Revised Pricing Model with Elasticity Assumptions:**

| Tier | Seats | Base Price | Assumed PED | Dynamic Rule |
|------|-------|-----------|-------------|--------------|
| Premium (Front) | 500 | $120 | -0.6 (inelastic) | Adjust based on sales velocity (see below) |
| Standard (Middle) | 1,500 | $75 | -1.1 (roughly unit elastic) | Adjust based on sales velocity |
| Economy (Back) | 1,000 | $40 | -1.8 (elastic) | Reduce price if sales pace is below target |

**Elasticity Sensitivity — Standard Tier:**

If PED = -0.5: A 10% price increase reduces quantity demanded by 5%. Revenue per ticket rises more than quantity falls → total revenue increases. Recommendation: raise prices for shows selling well.

If PED = -1.5: A 10% price increase reduces quantity demanded by 15%. Revenue per ticket rises less than quantity falls → total revenue decreases. Recommendation: hold or lower prices to fill seats.

**Revised Dynamic Rule:** Track a "sales pace" metric — cumulative tickets sold as a percentage of expected sales at that point in time (based on historical patterns). If pace > 110% of expected, increase price by 8%. If pace is 90-110%, hold steady. If pace < 90%, decrease price by 5% to stimulate demand.

This approach avoids the assumption that demand always rises near the event date and instead responds to revealed demand signals.

#### Judging Feedback (Cycle 1)

**Grade: B (Significant improvement, some remaining gaps)**

**What Improved:**
- Elasticity assumptions are now explicit and reasonable. The recognition that Premium seats face more inelastic demand (fewer substitutes for front-row experience) and Economy seats face more elastic demand (more price-sensitive buyers with alternatives) shows sound economic reasoning.
- The sensitivity analysis correctly applies the total revenue test: when demand is inelastic (|PED| < 1), raising prices increases revenue; when elastic (|PED| > 1), raising prices decreases revenue.
- The revised dynamic rule based on sales velocity is a major improvement over the blanket "prices always go up" approach.

**Remaining Issues:**
- The elasticity estimates are stated but not justified. Where do -0.6, -1.1, and -1.8 come from? Without citing comparable venues, survey data, or a stated methodology, these are still arbitrary numbers with labels attached.
- No mention of cross-price elasticity. If a competing venue drops prices, the venue's demand may shift — this is distinct from movement along its own demand curve but equally important for a dynamic pricing strategy.

#### Steering Feedback (Cycle 1)

**Grade: A (Effective correction that produced meaningful revision)**

**What Worked:**
- The steering command was specific and actionable — it asked for explicit assumptions, a concrete comparison, and a rule revision. This gave the AI clear targets rather than vague instructions to "improve."
- Asking for a sensitivity analysis at two different elasticity values was well-chosen; it forced the AI to demonstrate the total revenue test rather than just assert a conclusion.

**What Could Improve:**
- The steering did not address the cross-price elasticity dimension. A follow-up command should push the AI to consider how competitor actions or substitute availability affect the optimal pricing strategy.

---

### Cycle 2

#### Steering Command Sent to AI

instructions:
  - name: "Good progress on own-price elasticity"
    description: "Good progress on own-price elasticity. Now address two remaining issues:"
  - name: "Justify your elasticity estimates"
    description: "Justify your elasticity estimates. Cite a methodology — for example, reference comparable industry data, state that you are using a midpoint estimate from concert industry studies, or propose a data collection plan to refine the estimates."
  - name: "Incorporate cross-price elasticity"
    description: "Incorporate cross-price elasticity. If a competing venue 10 miles away is running a similar concert series, how would that affect your pricing recommendations? Show how cross-price elasticity interacts with own-price elasticity in at least one tier."

#### Updated AI Output

**Justification of Elasticity Estimates:**

The estimates are calibrated to published entertainment industry research:

- **Premium (PED = -0.6):** Consistent with Courty (2003) finding that VIP/premium entertainment experiences exhibit low price sensitivity (PED range of -0.3 to -0.8) due to limited substitutes and high willingness-to-pay among enthusiast segments. These buyers value proximity and exclusivity, which are not replicable at home.
- **Standard (PED = -1.1):** Aligned with general admission concert demand studies showing near-unit elasticity for mid-range tickets. At this price point, consumers weigh the concert against dining out, cinema, or other mid-budget entertainment.
- **Economy (PED = -1.8):** Budget-conscious attendees treat concerts as a discretionary leisure option. High substitutability with free or low-cost alternatives (streaming, parks, home entertainment) drives elastic demand.

**Data Collection Plan:** To refine these estimates, I recommend running A/B pricing tests across three early-season shows, varying Standard tier prices by ±10% and tracking quantity response. This yields observed arc elasticity for the venue's specific market.

**Cross-Price Elasticity Analysis — Standard Tier:**

Assume a competing venue offers comparable concerts at $65 (vs. our $75). If the cross-price elasticity of demand between the venues is +1.2 (strong substitutes), then a 10% price cut by the competitor (-$6.50) would reduce our Standard tier demand by approximately 12%.

**Interaction effect:** Our own-price elasticity of -1.1 means we could counter by cutting our price by ~10% ($7.50 reduction to $67.50). This would recover roughly 11% in quantity demanded. Net effect: approximately neutral quantity impact, but lower per-ticket revenue. The strategic takeaway is that in markets with close substitutes, aggressive price competition erodes revenue for both venues. A better strategy may be product differentiation (exclusive acts, bundled experiences) rather than price matching.

**Revised Memo Recommendation:** The memo now includes a section titled "Key Assumptions" listing each elasticity estimate, its source, and how the conclusion changes if the estimate is wrong by ±0.3 units.

#### Judging Feedback (Cycle 2)

**Grade: A (Strong analytical depth with minor gaps)**

**What Improved:**
- Elasticity estimates are now grounded in cited research (even if the student would need to verify the specific references). This transforms the model from guesswork to evidence-informed analysis.
- The A/B testing proposal for refining estimates shows practical awareness of how to move from assumed to observed elasticities.
- The cross-price elasticity analysis correctly identifies the interaction: when substitutes are close (high positive cross-price elasticity), own-price competition becomes a race to the bottom. The recommendation to differentiate rather than price-match demonstrates strategic economic reasoning.
- The "Key Assumptions" section in the memo addresses the rubric requirement to make elasticity assumptions accessible to a non-technical audience.

**Minor Remaining Issues:**
- Does not address income elasticity. If the target city's median income is lower than the chain's existing markets, concert attendance may be more income-sensitive, affecting all tiers.
- The cross-price analysis examines only one scenario. A more complete treatment would show how the optimal pricing strategy varies across low, moderate, and high cross-price elasticity environments.

#### Steering Feedback (Cycle 2)

**Grade: A (Well-targeted follow-up that deepened the analysis)**

**What Worked:**
- Asking for justification of the estimates was the right next step — it moved the AI from "stating numbers" to "defending numbers," which is the core academic skill.
- The cross-price elasticity prompt was specific enough (citing a competitor 10 miles away) to force a concrete rather than abstract response.

**What Could Improve:**
- Could have also asked about income elasticity to round out the three main elasticity concepts relevant to this problem.

---

## Completion

### Final Grades

| Skill | Grade | Summary |
|-------|-------|---------|
| **Framing** | A | Identified the core data gap (missing elasticity estimates) and vague objectives. Missed time-horizon and cross-price dimensions. |
| **Judging** | A | Correctly caught the AI's unstated assumptions, constant-elasticity error, and blanket demand-rise claim. Could have been more systematic in checking all rubric criteria. |
| **Steering** | A | Commands were specific, actionable, and produced substantive improvements. Each round built logically on the previous one. Minor gap in not addressing income elasticity. |

### Session Summary

The student demonstrated strong foundational skills in identifying the central role of elasticity in pricing decisions. The framing correctly zeroed in on the missing demand data, though it could have been more comprehensive in covering all elasticity dimensions. During the judge-and-steer cycles, the student effectively guided the AI from an unsupported pricing model to one with explicit, justified, and sensitivity-tested elasticity assumptions. The most impressive progression was moving the AI from "prices always go up near the show" to a sales-velocity-based dynamic rule — this showed genuine economic reasoning applied to a practical problem. The main area for growth is incorporating the full suite of elasticity concepts (own-price, cross-price, income) into the initial framing, rather than discovering them reactively during steering.
