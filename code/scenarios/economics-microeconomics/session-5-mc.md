# Session 5 — Ghost Kitchen Cost Analysis (Multiple Choice)

**Challenge:** Build a comparative cost model for a traditional restaurant vs. a delivery-only ghost kitchen.
**Subject:** Producer Theory > Cost Structures > Fixed vs Variable Costs
**Response Mode:** Multiple Choice (5 Options)

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Build a comparative cost model for a restaurant chain deciding whether to open a traditional dine-in location or a delivery-only ghost kitchen in a new city. Deliver a financial spreadsheet projecting costs and break-even points for both options over three years, plus a one-page recommendation memo. The chain currently operates "a dozen locations" in other cities and wants to "enter the market quickly and cheaply." Delivery demand in the target city is "growing fast." The chain's menu is "full-service" with items ranging from appetizers to desserts. Real estate in the target city is "expensive downtown but affordable in industrial areas."

### Student Framing Response

**Which of the following best describes the most critical analytical gap in this problem?**

**(A)** The problem does not specify the chain's brand reputation in the new city, which determines initial customer acquisition costs.

**(B)** The problem does not classify which costs are fixed, which are variable, and over what time horizon — and without this classification, the break-even analysis cannot distinguish between costs that scale with output and costs that persist regardless of output.

**(C)** The problem does not provide the chain's current profit margins from existing locations, which are needed to benchmark the new location's expected performance.

**(D)** The problem does not specify whether the ghost kitchen would operate its own delivery fleet or use third-party platforms.

**(E)** The problem does not state the target city's population or demographic profile, which determines total addressable market size.

**Student selects: (B)**

### AI Output (with planted issues)

**Comparative Cost Model:**

**Traditional Restaurant:**
- Setup: $450,000
- Monthly operating: $42,000 (rent $14,000 + staff $18,000 + food $7,000 + other $3,000)
- Break-even: ~16 months at $68,000/month revenue

**Ghost Kitchen:**
- Setup: $120,000
- Monthly operating: $22,000 (rent $4,000 + staff $9,000 + food $5,000 + delivery/packaging $4,000)
- Break-even: ~8 months at $35,000/month revenue

**Analysis:** The ghost kitchen is the obvious choice. Lower startup, lower monthly costs, faster break-even. The chain should enter with a ghost kitchen and convert to a traditional location only if dine-in demand materializes.

The ghost kitchen's cost advantage comes from eliminating expensive downtown rent, front-of-house staff, dining room buildout, and customer-facing decor. These savings compound over the 3-year projection period.

### Framing Feedback

**Grade: A (Correctly identified the core analytical issue)**

**Strengths:**
- Option (B) is the best answer. The cost classification gap is the central analytical problem because every element of the deliverable — the spreadsheet, the break-even analysis, the recommendation memo — depends on understanding which costs behave as fixed and which vary with output. Without this classification, the break-even calculation treats all costs as if they behave the same way, which they do not.

**Why Other Options Are Weaker:**
- **(A)** Brand reputation affects revenue projections, not cost classification — a secondary concern for this challenge.
- **(C)** Existing margins provide a benchmark but do not resolve the cost structure question for the new location with a different format.
- **(D)** This is a relevant operational detail (it affects whether delivery costs are fixed or variable), but it is one specific case of the broader classification problem identified in (B).
- **(E)** Market size affects revenue potential, not cost structure analysis.

**Area for Improvement:**
- The student could have noted that option (D) is actually a sub-case of option (B) — whether the ghost kitchen owns its delivery fleet (fixed fleet costs) or uses platforms (variable per-order fees) is exactly the kind of cost classification question that (B) highlights. Articulating this hierarchy would show deeper analytical precision.

---

## Phase 2 — Judge + Steer Cycles

### Cycle 1

#### AI Output Under Review

*(The AI output from Phase 1 above)*

#### Judging (Internal — Not Sent to AI)

gaps:
  - name: "Which of the following best identifies the most"
    description: "Which of the following best identifies the most significant analytical flaw in the AI's cost model? (A) The AI's setup cost estimate for the traditional restaurant ($450,000) seems too high and should be verified against industry benchmarks. (B) The AI does not classify any cost as fixed, variable, or step-fixed — it groups costs into broad categories and uses a single demand assumption to calculate break-even, producing a misleading comparison that ignores how each format's cost structure behaves differently at different output levels. (C) The AI should have included marketing costs in the monthly operating budget. (D) The AI does not account for inflation over the 3-year projection period. (E)** The AI's recommendation to"

#### Steering Command

**Which correction should the student send to the AI?**

**(A)** "Please verify all cost estimates against restaurant industry benchmarks."

**(B)** "Please break down each cost line item and classify it as fixed, variable (per order), or step-fixed. Then run a sensitivity analysis showing break-even under three demand scenarios (base, -20%, +20%) and compare the operating leverage of both formats."

**(C)** "Please add a revenue projection model based on the target city's demographics."

**(D)** "Please include a section on food safety and health code compliance costs."

**(E)** "Please reduce the ghost kitchen's costs by 10% to account for operational efficiencies."

**Student selects: (B)**

#### Updated AI Output

**Revised Cost Model — Line-Item Classification:**

**Traditional Restaurant:**

| Item | Monthly ($) | Type | Notes |
|------|-------------|------|-------|
| Downtown rent | 14,000 | Fixed (lease term) | Locked for lease duration; sunk if chain exits early |
| General manager | 5,500 | Fixed | Salaried; does not vary with covers |
| Kitchen staff | 8,000 | Step-fixed | 4 cooks at <120 orders/day; 6 at 120-200; 8 at 200+ |
| Front-of-house staff | 4,500 | Variable | Servers scheduled by expected covers |
| Food & ingredients | 7,000 | Variable | ~$4.50/order |
| Utilities | 1,800 | Semi-variable | $600 base + usage-linked |
| Insurance | 700 | Fixed | Annual policy |
| Marketing | 500 | Fixed (discretionary) | Set budget, not volume-linked |
| **Total** | **42,000** | | |

**Ghost Kitchen:**

| Item | Monthly ($) | Type | Notes |
|------|-------------|------|-------|
| Industrial rent | 4,000 | Fixed (lease term) | Shorter lease options available (more flexible) |
| Kitchen manager | 4,500 | Fixed | Single manager |
| Kitchen staff | 6,500 | Step-fixed | 3 cooks at <180 orders/day; 5 at 180-350 |
| Food & ingredients | 5,000 | Variable | ~$4.00/order (streamlined menu) |
| Packaging | 2,000 | Variable | ~$1.10/order |
| Delivery platform fees | 2,800 | Variable | 28% of delivery revenue |
| Utilities | 900 | Semi-variable | $300 base + usage |
| Insurance | 400 | Fixed | Lower exposure (no customer-facing space) |
| **Total** | **26,100** | | |

**Sensitivity Analysis — Break-Even (Months):**

| Scenario | Traditional | Ghost Kitchen |
|----------|------------|---------------|
| Optimistic (+20% demand) | 12 | 6 |
| Base case | 16 | 8 |
| Pessimistic (-20% demand) | 26 | 11 |

**Operating Leverage:**
- Traditional: ~50% fixed/step-fixed costs. High operating leverage. Profits swing ±$8,000/month for every 10% demand change.
- Ghost Kitchen: ~34% fixed/step-fixed costs. Lower operating leverage. Profits swing ±$3,500/month for every 10% demand change.

**Revised Assessment:** The ghost kitchen remains the lower-cost and faster-break-even option in all scenarios. However, the traditional restaurant generates higher margins per order once fixed costs are covered (no 28% platform fee), meaning it is more profitable at high volume. The formats have different risk profiles, not just different cost levels.

#### Judging Feedback (Cycle 1)

**Grade: A (Strong improvement with one important gap)**

The revised model is substantially better. Each cost is now classified with a stated rationale, the sensitivity analysis shows how break-even varies with demand, and the operating leverage comparison reveals different risk profiles. The "revised assessment" is more nuanced than the original "ghost kitchen is obviously better" conclusion.

The remaining gap: the analysis tests only demand-side sensitivity. The ghost kitchen's heavy dependence on delivery platform fees (28% of revenue as a variable cost) creates cost-side vulnerability. If the platform raises its commission from 28% to 35%, how does that change the comparison? Similarly, if the traditional restaurant's rent increases at lease renewal, what happens? Cost-side sensitivity is missing.

#### Steering Feedback (Cycle 1)

**Grade: A (Comprehensive, well-structured command)**

Option (B) was the clear best choice. Its three components (classify, sensitivity, leverage) created a logical analytical progression from granular detail to strategic insight. The other options addressed either superficial concerns (A, D), revenue rather than cost analysis (C), or would introduce unsupported changes (E). The command produced exactly the kind of analytical depth the challenge requires.

---

### Cycle 2

#### Judging (of Updated AI Output)

**Which remaining analytical gap most needs to be addressed?**

**(A)** The model should include employee benefits and payroll taxes as separate line items.

**(B)** The model needs cost-side sensitivity analysis — specifically, how the ghost kitchen's break-even changes if delivery platform fees increase, and how the traditional restaurant's break-even changes if rent increases at lease renewal.

**(C)** The model should project revenue growth based on the city's population growth rate.

**(D)** The model needs a section on the environmental impact of delivery packaging.

**(E)** The model should compare the quality of food served in each format.

**Student selects: (B)**

**Grade: A (Correct identification of the highest-priority gap)**

#### Steering Command

**Which command best addresses the identified gap?**

**(A)** "Please lower the delivery platform fee assumption to 20% to be more optimistic."

**(B)** "Please run a cost-side sensitivity analysis: show how the ghost kitchen's break-even and 3-year profitability change if delivery platform fees increase from 28% to 35%, and how the traditional restaurant's metrics change if rent increases 15% at Year 2 lease renewal. Identify which format is more vulnerable to its key cost risk."

**(C)** "Please negotiate lower delivery platform fees on behalf of the restaurant chain."

**(D)** "Please add inflation adjustments to all cost projections."

**(E)** "Please compare the chain's cost structure to publicly available data from McDonald's and Domino's."

**Student selects: (B)**

#### Updated AI Output

**Cost-Side Sensitivity Analysis:**

**Ghost Kitchen — Platform Fee Increase (28% to 35%):**

| Metric | At 28% Fee | At 35% Fee | Change |
|--------|-----------|-----------|--------|
| Variable cost per order | $6.30 | $7.50 | +$1.20/order |
| Monthly operating cost | $26,100 | $28,400 | +$2,300/month |
| Break-even | Month 8 | Month 12 | +4 months |
| 3-year cumulative profit | $350,000 | $195,000 | -44% |

**Traditional Restaurant — Rent Increase (15% at Year 2 renewal):**

| Metric | Original Rent | +15% Rent (Year 2+) | Change |
|--------|--------------|---------------------|--------|
| Monthly rent | $14,000 | $16,100 | +$2,100/month |
| Break-even | Month 16 (before renewal) | Month 16 (unchanged) | No change to break-even |
| 3-year cumulative profit | $430,000 | $379,800 | -12% |

**Key Finding:**

The ghost kitchen is MORE vulnerable to its key cost risk than the traditional restaurant is to its key cost risk:
- A 7-percentage-point increase in platform fees (28% to 35%) cuts ghost kitchen profit by 44%.
- A 15% increase in rent cuts traditional restaurant profit by only 12%.

**Why?** Platform fees are variable — they compound with every order. Rent is fixed — the increase is a flat monthly amount regardless of volume. At higher volumes, the platform fee increase costs more; the rent increase costs the same. This asymmetry reveals that the ghost kitchen trades demand risk (lower operating leverage) for cost-side risk (dependence on third-party platform pricing).

**Revised Strategic Matrix:**

| Uncertainty | Ghost Kitchen Advantage | Traditional Advantage |
|-------------|------------------------|----------------------|
| Demand risk (will customers come?) | Lower fixed costs limit losses | - |
| Cost risk (will platform fees rise?) | - | No platform dependency |
| Growth upside (what if demand booms?) | - | Higher contribution margin per order |
| Speed to market | Faster setup and break-even | - |

**Decision Framework:** Choose the ghost kitchen if the primary risk is demand uncertainty. Choose the traditional restaurant if the primary risk is cost-structure instability or if the chain is confident in strong demand.

#### Judging Feedback (Cycle 2)

**Grade: A (Clear, well-supported analysis that changes the strategic conclusion)**

The cost-side sensitivity analysis is the most valuable output of the session. The 44% vs. 12% profit impact comparison is stark and decision-relevant. The explanation of why platform fees are more damaging than rent increases (variable costs compound with volume; fixed costs do not) demonstrates genuine economic reasoning. The strategic matrix cleanly summarizes the decision framework without oversimplifying.

The minor remaining gap is that the analysis does not address how step-fixed costs (kitchen staffing) create non-linear break-even behavior — at certain order volumes, the need to hire additional staff creates a cost jump that a smooth model would miss. This is a secondary concern relative to the cost-side sensitivity finding.

#### Steering Feedback (Cycle 2)

**Grade: A (Precisely targeted, high-impact command)**

Option (B) was the strongest choice. It specified exact scenarios, demanded a direct vulnerability comparison, and produced the session's most strategically important finding: that the ghost kitchen's lower demand risk comes at the cost of higher cost-side risk. The other options were either directionally wrong (A), impractical (C), marginally relevant (D), or off-topic (E).

---

### Cycle 3

#### Judging (of Updated AI Output)

**Which aspect of the analysis would most benefit from one final refinement?**

**(A)** The analysis should model the ghost kitchen-to-traditional conversion pathway, including transition costs.

**(B)** The analysis should include a customer lifetime value calculation for each format.

**(C)** The analysis should address how the step-fixed nature of kitchen staffing creates non-linear break-even behavior at hiring thresholds.

**(D)** The analysis should compare food quality between dine-in and delivery formats.

**(E)** The analysis should model how costs change if the chain negotiates a direct ordering app to bypass platform fees.

**Student selects: (E)**

**Grade: B (Valid strategic thinking, but lower analytical priority)**

Option (E) is a relevant strategic consideration — building a direct ordering channel could reduce platform fee dependence, which the analysis identifies as the ghost kitchen's key vulnerability. However, it introduces a new revenue channel model rather than refining the existing cost structure analysis. Option (C) would have deepened the core cost analysis by showing how step-fixed labor costs create discontinuities in the break-even trajectory — this is more directly aligned with the challenge's focus on fixed vs. variable cost classification. Option (A) would also have high strategic value, since the staged entry approach was recommended but not modeled.

#### Steering Command

**Which command best addresses the need for final refinement?**

**(A)** "Please model the cost impact of the chain developing a direct ordering app: what are the development costs, how does it change the variable cost structure, and at what order volume does it become more cost-effective than relying on third-party platforms?"

**(B)** "Please show how kitchen staffing steps create cost discontinuities at specific order volumes, and demonstrate how this affects the break-even trajectory for both formats."

**(C)** "Please add a customer acquisition cost comparison for dine-in versus delivery customers."

**(D)** "Please simplify the analysis into an executive summary for non-financial stakeholders."

**(E)** "Please model the costs of converting a ghost kitchen into a traditional restaurant after Year 1."

**Student selects: (A)**

#### Updated AI Output

**Direct Ordering App — Cost-Benefit Analysis:**

**Development and Operating Costs:**
- App development: $80,000-$120,000 (one-time; outsourced development)
- Annual maintenance and updates: $15,000
- Payment processing: 2.5-3% of order value (vs. 28% platform fee)
- Marketing to drive app downloads: $3,000-$5,000/month initially; $1,500/month ongoing

**Variable Cost Comparison Per Order (at $25 average order value):**

| Cost Component | Via Platform | Via Direct App |
|----------------|------------|---------------|
| Commission/processing | $7.00 (28%) | $0.75 (3%) |
| Food cost | $10.00 (40%) | $10.00 (40%) |
| Packaging | $1.10 | $1.10 |
| Delivery (own driver vs. platform) | Included in commission | $3.50 (own driver) or $5.00 (contracted) |
| **Total variable cost** | **$18.10** | **$15.35 (own driver) / $16.85 (contracted)** |

**Break-Even on App Investment:**
- Cost savings per order via direct app: $1.25-$2.75 depending on delivery method
- App development cost: $100,000 (midpoint)
- Break-even order volume for app: 36,000-80,000 orders
- At 200 orders/day: App pays for itself in 6-13 months

**Strategic Implication:**
A direct ordering app reduces the ghost kitchen's key vulnerability (platform fee dependence) but introduces new fixed costs (development, maintenance) and operational complexity (managing delivery logistics). The app is economically justified when daily order volume exceeds approximately 150 orders/day — below this threshold, the platform's bundled services (marketing, delivery infrastructure, customer base) provide more value than the fee savings.

**Revised Cost Structure with Hybrid Channel:**
The optimal approach is a hybrid: use third-party platforms for customer acquisition (accepting the 28% fee on platform-sourced orders) while gradually migrating repeat customers to the direct app (at 3% processing). Over time, as the app share grows, the blended variable cost rate declines from 28% toward 10-15% of revenue, substantially improving the ghost kitchen's contribution margin and reducing its cost-side vulnerability.

#### Judging Feedback (Cycle 3)

**Grade: A (Useful strategic analysis, somewhat outside the core cost classification focus)**

The direct ordering app analysis is well-executed and strategically relevant. The per-order cost comparison clearly shows the savings, and the break-even calculation for the app investment is practical. The hybrid channel recommendation is sound — it addresses the platform dependency risk without requiring an immediate all-or-nothing shift.

However, this analysis moves the session away from its core focus on fixed vs. variable cost classification and toward channel strategy. A more on-target final cycle would have addressed step-fixed cost discontinuities or the ghost-kitchen-to-traditional conversion pathway — both of which are directly about cost structure analysis. The app analysis is valuable business strategy, but it is adjacent to rather than central to the economic concepts this challenge is designed to test.

#### Steering Feedback (Cycle 3)

**Grade: A (Produced useful output, but slightly off-focus)**

The command was specific and actionable, and the AI's response was well-structured. However, the student chose to explore a strategic mitigation (reducing platform dependency) rather than deepening the cost structure analysis (step-fixed discontinuities or format conversion costs). Both are valid analytical directions, but the challenge's rubric emphasizes cost classification, break-even sensitivity, and the fixed-variable distinction — the step-fixed analysis would have been more directly aligned. The student showed good strategic instincts but slightly lost focus on the challenge's core economic concepts.

---

## Completion

### Final Grades

| Skill | Grade | Summary |
|-------|-------|---------|
| **Framing** | A | Correctly identified the cost classification gap as the core issue. Understood that cost categories depend on time horizon and output measure. |
| **Judging** | A | Consistently identified the most significant analytical flaws. Strong first two cycles; third cycle slightly off-focus. |
| **Steering** | A | Produced substantial improvements in Cycles 1 and 2. Cycle 3 generated useful but tangential analysis. |

### Session Summary

The student demonstrated consistently strong analytical performance, with the first two cycles producing the session's most valuable contributions. The framing correctly identified the cost classification gap, and the Cycle 1 steering command produced a well-classified cost model with sensitivity analysis and operating leverage comparison. The Cycle 2 cost-side sensitivity analysis was the session's standout finding: revealing that a modest platform fee increase devastates ghost kitchen profitability (44% reduction) while a larger rent increase only modestly impacts the traditional restaurant (12% reduction). This insight — that the ghost kitchen trades demand risk for cost-side risk — transformed the analysis from "ghost kitchen is obviously better" to a nuanced decision framework based on the chain's assessment of which uncertainty dominates. The Cycle 3 direct ordering app analysis was strategically sound but moved away from the challenge's core cost classification focus. The main growth area is maintaining analytical discipline in later cycles — the most productive final refinement would have been the step-fixed cost discontinuity analysis or the format conversion model, both of which are more directly aligned with the challenge's economic concepts.
