# Session 2 — Factory Emissions Permit Allocation (Open-Ended)

**Challenge:** Design a cap-and-trade permit system for a river basin with around 40 factories.
**Subject:** Market Failures > Externalities > Cap-and-Trade
**Response Mode:** Open-Ended (Structured Sections)

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Design a cap-and-trade permit system for a river basin with "around 40 factories" that discharge wastewater. The regional authority wants to cut total discharge "significantly" over the next decade. Produce a draft policy document that specifies the initial permit allocation method, the annual cap reduction schedule, trading rules, and a monitoring framework. Some factories are old and "would need expensive upgrades," while newer ones already meet "modern standards." Several factories are the sole employer in their town.

### Student Framing Response

**Ambiguities and Missing Information:**

1. **Undefined reduction target.** "Significantly" is not a quantitative goal. The policy cannot specify a cap reduction schedule without a defined endpoint — is the authority targeting a 30% reduction, 50%, or 80%? The feasibility and cost of the system depend entirely on this number. I would ask the authority to specify a numerical discharge reduction target and a deadline.

2. **No baseline emissions inventory.** We do not know current discharge levels for any factory, so we cannot set an initial cap or allocate permits. Without a baseline, any allocation method — whether auction or grandfathering — has no factual anchor. I would request a verified emissions inventory for each facility covering at least the last three years.

3. **Allocation method not specified.** The problem leaves open whether permits are auctioned, grandfathered based on historical discharge, or allocated on an output basis. Each method has different efficiency and equity implications, especially given that some factories are old and high-emitting while others are new and clean. Grandfathering rewards past pollution; auctioning raises revenue but may bankrupt marginal factories.

**What I Would Not Flag:**

The "around 40 factories" approximation seems fine for a policy design exercise. I also would not question the decade-long time horizon — it is a reasonable planning window for environmental regulation.

### AI Output (with planted issues)

**AI Draft Policy Document:**

**1. Initial Permit Allocation:** All 40 factories receive permits equal to their current discharge levels (grandfathering). This ensures no factory faces immediate economic disruption.

**2. Cap Reduction Schedule:** Total permits are reduced by 5% annually for 10 years, achieving a 50% total reduction. Each factory's allocation is cut proportionally.

**3. Trading Rules:** Factories may buy and sell permits freely. Prices are determined by the market. There are no restrictions on who can trade or how many permits a single entity can hold.

**4. Monitoring:** Factories self-report discharge levels quarterly, with random government audits of 10% of facilities per year.

**Economic Rationale:** Cap-and-trade is superior to command-and-control regulation because it allows emissions reductions to occur where they are cheapest. Factories with low abatement costs will reduce emissions and sell surplus permits; those with high costs will buy permits rather than invest in expensive upgrades. This minimizes the total cost of achieving the environmental target.

The system guarantees the 50% reduction target will be met as long as the cap is enforced, making it environmentally effective regardless of market dynamics.

### Framing Feedback

**Grade: B (Solid identification of major gaps, missed key dimensions)**

**Strengths:**
- Correctly identified the undefined reduction target as the most critical missing parameter. Without a numerical goal, no cap schedule can be designed. This shows an understanding that environmental policy requires quantitative thresholds.
- Good recognition that the allocation method is not neutral — the comparison between grandfathering and auctioning shows awareness of equity-efficiency trade-offs.
- Requesting a baseline emissions inventory is essential and practical.

**Areas for Improvement:**
- Did not address distributional concerns. The problem explicitly states that some factories are the sole employer in their town. This raises questions about who bears the cost burden, whether adjustment assistance is needed, and whether the allocation method should account for community dependence. This is a core issue, not a secondary one.
- Did not question what data would be needed to evaluate the system — specifically, marginal abatement cost curves for different factory types. Without knowing how much it costs each factory to reduce a unit of discharge, we cannot predict trading patterns or assess whether the market will function efficiently.
- Missed the monitoring infrastructure gap. The problem implies limited existing monitoring capacity, which directly affects whether any cap-and-trade system is enforceable.

---

## Phase 2 — Judge + Steer Cycles

### Cycle 1

#### AI Output Under Review

*(The AI output from Phase 1 above)*

#### Judging (Internal — Not Sent to AI)

gaps:
  - name: "The AI applies a uniform 5% annual cut to all factories"
    description: "The AI applies a uniform 5% annual cut to all factories, ignoring the stated heterogeneity between old (high-cost abatement) and new (low-cost) factories. The entire economic advantage of cap-and-trade — allowing reductions where they are cheapest — is undermined if the initial allocation does not account for cost differences."
  - name: "The AI proposes unrestricted trading with no price"
    description: "The AI proposes unrestricted trading with no price floor, price ceiling, or limits on permit accumulation. With only 40 participants, the market is thin — a single large factory could acquire a dominant permit position and exercise market power. The AI ignores standard design elements."
  - name: "Auditing only 10% of facilities per year means a factory"
    description: "Auditing only 10% of facilities per year means a factory could evade compliance for years before detection. The monitoring framework lacks credibility — no penalties for misreporting are specified, and there is no third-party verification."

#### Steering Command Sent to AI

instructions:
  - name: "Your policy treats all 40 factories identically and"
    description: "Your policy treats all 40 factories identically and ignores the cost heterogeneity described in the problem. Please revise:"
  - name: "Differentiate between old/high-cost and new/low-cost"
    description: "Differentiate between old/high-cost and new/low-cost factories in the initial allocation — compare grandfathering versus auctioning and explain which is more equitable and which is more efficient."
  - name: "Address market design risks for a 40-participant market"
    description: "Address market design risks for a 40-participant market: should there be a price floor, price ceiling, or position limits to prevent market manipulation?"
  - name: "Strengthen the monitoring framework with specific"
    description: "Strengthen the monitoring framework with specific enforcement mechanisms."

#### Updated AI Output

**Revised Policy Document:**

**1. Allocation Mechanism Comparison:**

| Feature | Grandfathering | Auctioning |
|---------|---------------|------------|
| Initial cost to factories | Zero | Significant (must purchase all permits) |
| Treatment of old vs. new factories | Rewards historical polluters with more free permits | Neutral — all pay market price regardless of history |
| Efficiency | Identical long-run efficiency if trading is costless | Same, but generates government revenue that can fund transitional support |
| Political feasibility | Higher (industry support) | Lower (industry opposition), but revenue can fund offsetting measures |

**Recommended Hybrid:** Allocate 60% of initial permits via grandfathering (ensuring political viability and avoiding immediate factory closures) and auction the remaining 40%. Auction revenue is earmarked for a transition fund that subsidizes upgrade investments for sole-employer factories.

**2. Market Design Safeguards:**

- **Price floor:** $15 per permit unit. If the market price falls below this, the authority purchases permits at the floor price. This ensures abatement investment remains economically rational.
- **Price ceiling:** $80 per permit unit. If the market price exceeds this, the authority sells additional permits at the ceiling price. This prevents cost spikes that could force factory closures.
- **Permit reserve:** 5% of total permits held in reserve to intervene if market manipulation is detected.
- **Market monitoring:** All trades must be registered with the authority within 48 hours. Concentration limits: no single entity may hold more than 15% of total outstanding permits.

**3. Strengthened Monitoring:**

- Continuous discharge monitoring (CDM) sensors required at each factory outfall within 2 years of program start.
- Third-party annual audits of emissions data, funded by a per-permit fee.
- Penalties: 3x the market price for each permit-unit of excess discharge, plus mandatory remediation.
- Whistleblower program with financial rewards for reporting violations.

#### Judging Feedback (Cycle 1)

**Grade: A (Major improvement in design sophistication)**

**What Improved:**
- The allocation comparison is balanced and analytically sound. The hybrid approach shows practical judgment — pure auctioning is economically optimal but politically unrealistic; pure grandfathering is inequitable. The 60/40 split with earmarked revenue is a credible compromise.
- Market design safeguards are substantive. The price floor and ceiling create a "safety valve" that bounds cost uncertainty, which is essential in a thin market with only 40 participants. The concentration limit directly addresses market power concerns.
- The monitoring overhaul is a significant upgrade. Continuous monitoring, third-party audits, and meaningful penalties create a credible enforcement framework.

**Remaining Issues:**
- No mention of permit banking or borrowing. Can factories save unused permits for future years (banking) or use future permits now (borrowing)? These provisions dramatically affect compliance flexibility and cost smoothing.
- The 5% annual cap reduction schedule was not revisited. It remains disconnected from any assessment of technological feasibility or abatement cost trajectories.

#### Steering Feedback (Cycle 1)

**Grade: A (Effective multi-pronged correction)**

**What Worked:**
- The three-part steering command addressed distinct design flaws simultaneously, which was efficient and productive.
- Asking for a comparison (grandfathering vs. auctioning) rather than prescribing a solution forced the AI to reason through trade-offs rather than just implementing an instruction.

**What Could Improve:**
- The steering did not address the cap reduction schedule, which was identified as an issue during judging but was not included in the correction. This is a missed opportunity — the judge-steer connection should be tighter, with every major judging finding translated into a steering action.

---

### Cycle 2

#### Steering Command Sent to AI

instructions:
  - name: "Two remaining design gaps"
    description: "Two remaining design gaps:"
  - name: "Address permit banking and borrowing"
    description: "Address permit banking and borrowing. Should factories be allowed to save permits for future years or borrow against future allocations? What are the trade-offs for environmental integrity and cost management?"
  - name: "Revise the cap reduction schedule"
    description: "Revise the cap reduction schedule. Instead of a fixed 5% annual cut, propose a schedule that accounts for the time factories need to install upgrades. Consider a slower start with accelerating reductions later, and justify the shape you choose."

#### Updated AI Output

**Permit Banking and Borrowing:**

**Banking (saving permits):** Allowed without restriction. Economic rationale: banking smooths compliance costs across years. If a factory over-reduces in Year 3 (perhaps because it installed new equipment), it can bank surplus permits for Year 7 when the cap is tighter. Environmental impact: banking does not increase cumulative pollution — it shifts abatement across time but the total cap is unchanged. Banking also creates a demand-side buffer that stabilizes permit prices.

**Borrowing (using future permits):** Allowed with restrictions. Factories may borrow up to 10% of their next year's allocation, with a 1.1x repayment ratio (borrow 100 permits, repay 110 next year). Unrestricted borrowing risks "compliance procrastination" — factories delay investment hoping future costs will be lower or political changes will weaken the program. The repayment premium discourages excessive borrowing while still providing flexibility.

**Revised Cap Reduction Schedule:**

| Year | Annual Reduction | Cumulative Reduction | Rationale |
|------|-----------------|---------------------|-----------|
| 1-3 | 2% per year | 6% | Ramp-up period: factories install monitoring equipment and plan investments. Minimal physical abatement required. |
| 4-6 | 5% per year | 21% | Investment period: factories that have completed upgrade planning begin implementing. Old factories with high MACs begin purchasing permits. |
| 7-9 | 7% per year | 42% | Acceleration: most upgrades complete; new technology reduces marginal abatement costs. Steeper cuts are now feasible. |
| 10 | 8% | 50% | Final push to reach the 50% target. |

**Justification for Back-Loaded Shape:** Industrial capital stock cannot be replaced overnight. Upgrade projects for wastewater treatment typically require 2-3 years from planning to commissioning. A front-loaded schedule would force factories to buy permits at high prices in early years (before they can physically abate), transferring wealth to already-clean factories without achieving environmental benefit faster. The back-loaded schedule aligns the policy timeline with the engineering timeline.

#### Judging Feedback (Cycle 2)

**Grade: A (Comprehensive design with strong analytical grounding)**

**What Improved:**
- Banking and borrowing rules are well-designed. Unrestricted banking with restricted borrowing is the standard best-practice configuration — it allows cost smoothing without creating compliance loopholes. The 1.1x repayment ratio for borrowing is a reasonable deterrent that preserves flexibility.
- The revised cap reduction schedule is substantially better than the original flat 5% approach. The back-loaded shape is economically justified — it aligns regulatory pressure with capital stock turnover cycles. The year-by-year breakdown with rationale demonstrates sophisticated policy design thinking.

**Minor Remaining Issues:**
- The interaction between the cap reduction schedule and the sole-employer factories is not explicitly addressed. How do the transition fund (from Cycle 1) and the back-loaded schedule work together? Is the transition fund larger in Years 7-10 when reductions accelerate?
- No discussion of how the system interacts with other environmental regulations or water quality standards that may already apply to these factories.

#### Steering Feedback (Cycle 2)

**Grade: A (Well-targeted commands that produced sophisticated revisions)**

**What Worked:**
- The two-part structure was well-scoped — each part addressed a distinct gap identified during judging.
- Asking the AI to "justify the shape" of the reduction schedule was excellent — it forced analytical reasoning rather than arbitrary parameter selection.
- The banking/borrowing prompt correctly anticipated that both provisions have trade-offs, and by asking about both in one prompt, it ensured the AI addressed the design interaction between them.

**What Could Improve:**
- Could have pushed the AI to connect the reduction schedule back to the distributional concerns (sole-employer factories) raised in the original problem. A final steering command linking the schedule to the transition fund would have produced a more integrated policy document.

---

## Completion

### Final Grades

| Skill | Grade | Summary |
|-------|-------|---------|
| **Framing** | B | Identified the core quantitative gaps (undefined target, missing baseline) and allocation trade-offs. Missed distributional concerns and monitoring feasibility despite explicit problem cues. |
| **Judging** | A | Correctly caught the AI's homogeneous treatment of factories, missing market safeguards, and weak monitoring. Could have been more systematic about checking for intertemporal design elements from the start. |
| **Steering** | A | Commands were specific, structured, and produced substantial improvements. Each cycle built on the previous one logically. Minor gap in not pushing for community impact analysis. |

### Session Summary

The student showed solid analytical instincts in identifying the central design challenges of a cap-and-trade system. The framing correctly prioritized the missing quantitative target and baseline data, though it missed the distributional dimension that the problem explicitly flagged through the sole-employer-town detail. During the judge-and-steer cycles, the student effectively moved the AI from a naive uniform-treatment policy to a nuanced design with heterogeneous allocation, market safeguards, non-linear reduction schedules, and intertemporal flexibility mechanisms. The strongest contribution was pushing the AI to compare allocation methods rather than accepting the default grandfathering approach, which demonstrated understanding of equity-efficiency trade-offs. The main area for growth is attending to the socioeconomic and political economy dimensions of environmental policy — the economic theory was well-handled, but real-world policy design requires equally careful attention to affected communities and implementation constraints.
