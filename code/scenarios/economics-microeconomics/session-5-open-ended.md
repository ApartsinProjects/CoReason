# Session 5 — Ghost Kitchen Cost Analysis (Open-Ended)

**Challenge:** Build a comparative cost model for a restaurant chain deciding between a dine-in location and a delivery-only ghost kitchen.
**Subject:** Producer Theory > Cost Structures > Fixed vs Variable Costs
**Response Mode:** Open-Ended (Structured Sections)

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Build a comparative cost model for a restaurant chain deciding whether to open a traditional dine-in location or a delivery-only ghost kitchen in a new city. Deliver a financial spreadsheet projecting costs and break-even points for both options over three years, plus a one-page recommendation memo. The chain currently operates "a dozen locations" in other cities and wants to "enter the market quickly and cheaply." Delivery demand in the target city is "growing fast." The chain's menu is "full-service" with items ranging from appetizers to desserts. Real estate in the target city is "expensive downtown but affordable in industrial areas."

### Student Framing Response

**Ambiguities and Missing Information:**

1. **No cost data provided.** The problem asks for a cost model but provides no itemized costs — no rent figures, labor rates, equipment costs, food cost percentages, or delivery platform commission rates. Without these inputs, any projection is a guess. I would request the chain's existing P&L statements from comparable locations to establish baseline cost structures.

2. **"Growing fast" is undefined.** Delivery demand growth could mean 5% per year or 50% per year, and the break-even analysis depends heavily on volume projections. I would ask for the current delivery order volume in the target city and the annual growth rate over the past three years.

3. **The time horizon matters for cost classification.** A three-year model blurs the fixed/variable distinction. A lease is fixed within a one-year term but becomes variable (or at least avoidable) at renewal. Kitchen equipment is a fixed cost in Year 1 but may require replacement or upgrades by Year 3. The problem does not specify whether costs should be classified at a monthly, annual, or three-year horizon.

4. **No output measure defined.** What is the "unit" in this cost model — meals served? Revenue dollars? Orders per day? The choice of output measure affects which costs appear fixed and which appear variable. Labor, for example, is often treated as variable (more staff for more orders) but has a fixed component (minimum staffing for an open kitchen).

**What I Would Not Flag:**

The "dozen locations" in other cities is useful context suggesting the chain has operational experience to draw on. I would not question the three-year projection window — it is standard for a market entry decision.

### AI Output (with planted issues)

**Comparative Cost Model:**

| Cost Category | Dine-In | Ghost Kitchen |
|--------------|---------|---------------|
| Rent | $15,000/month (downtown) | $4,000/month (industrial area) |
| Build-out/Renovation | $250,000 (one-time) | $80,000 (one-time) |
| Equipment | $120,000 (one-time) | $60,000 (one-time) |
| Staff | 25 employees ($45,000/year avg) | 8 employees ($38,000/year avg) |
| Food costs | 30% of revenue | 30% of revenue |
| Delivery platform fees | N/A | 25% of delivery revenue |
| Marketing | $5,000/month | $8,000/month (higher digital spend) |
| Utilities | $3,500/month | $1,800/month |

**Break-Even Analysis:**

Dine-In: $2.4M annual revenue needed to break even.
Ghost Kitchen: $1.1M annual revenue needed to break even.

**Recommendation:** The ghost kitchen is the clear winner. It has lower fixed costs, lower break-even point, and aligns with the chain's goal to enter the market quickly and cheaply. The dine-in model requires more than double the revenue to break even and carries higher risk in a new market.

### Framing Feedback

**Grade: A (Good identification of key gaps, strong on time-horizon insight)**

**Strengths:**
- Correctly identified the absence of actual cost data as the most fundamental gap. A cost model without cost inputs is a framework, not an analysis.
- The time-horizon point is the most analytically sophisticated observation. Recognizing that the fixed/variable classification depends on the decision horizon — and that a three-year model may reclassify some "fixed" costs — shows deeper understanding of cost theory than simply listing missing numbers.
- Good catch on the undefined output measure. The choice of unit (meals, orders, revenue) determines how costs are classified and how the break-even is calculated.

**Areas for Improvement:**
- Did not identify that some costs listed as "fixed" may actually be step-fixed or semi-variable. Labor is the most obvious example: a ghost kitchen with 8 employees is not truly variable — the first employee is needed before the first order is filled (a fixed component), and additional staff are added in discrete increments as volume grows (step-fixed). The problem implicitly asks the student to think about these classifications, not just note that data is missing.
- Did not question whether the "full-service" menu is appropriate for a ghost kitchen. A full menu with appetizers through desserts may be operationally complex for a delivery-only format, affecting variable costs per order (packaging, preparation time, ingredient waste). This is a cost structure question disguised as an operational one.
- Did not note that delivery platform fees (typically 15-30% of order value) fundamentally change the variable cost structure of the ghost kitchen relative to the dine-in model. This is a major cost component that shifts the cost mix heavily toward variable costs, with strategic implications for operating leverage and risk.

---

## Phase 2 — Judge + Steer Cycles

### Cycle 1

#### AI Output Under Review

*(The AI output from Phase 1 above)*

#### Judging (Internal — Not Sent to AI)

gaps:
  - name: "The AI lists"
    description: "The AI lists"
  - name: "The AI states break-even revenue for each option but"
    description: "The AI states break-even revenue for each option but does not test how the break-even shifts under different volume assumptions. If delivery demand grows slower than expected (or faster), the relative attractiveness of the two options changes. No sensitivity analysis is provided."
  - name: "Rent is listed as fixed, but a dine-in lease may have a"
    description: "Rent is listed as fixed, but a dine-in lease may have a percentage-of-revenue clause. Food costs are listed as 30% of revenue (purely variable), but there is a fixed component (minimum inventory, waste on unpurchased items). The AI does not acknowledge that most real-world costs are mixed."
  - name: "The ghost kitchen has lower fixed costs and higher"
    description: "The ghost kitchen has lower fixed costs and higher variable costs (25% delivery platform fees). The dine-in has higher fixed costs but no platform fees. This means the dine-in model has higher operating leverage — more risk at low volumes, but higher margins at high volumes. The AI's recommendation does not account for this crossover effect."

#### Steering Command Sent to AI

instructions:
  - name: "Your cost model lists costs in broad categories but does"
    description: "Your cost model lists costs in broad categories but does not classify each as fixed, variable, or semi-variable. Please revise:"
  - name: "For each cost line, explicitly state whether it is"
    description: "For each cost line, explicitly state whether it is fixed, variable, or semi-variable. For semi-variable costs, specify the fixed and variable components separately (e.g., labor: $X fixed base + $Y per additional 100 orders)."
  - name: "Instead of a single break-even point, show how the"
    description: "Instead of a single break-even point, show how the break-even and profitability change across three demand scenarios: pessimistic (50% of base case), base case, and optimistic (150% of base case). Include a crossover analysis showing at what volume the dine-in model becomes more profitable than the ghost kitchen."
  - name: "Discuss operating leverage for each option"
    description: "Discuss operating leverage for each option — which model carries more risk at low volumes, and which is more profitable at high volumes?"

#### Updated AI Output

**Revised Cost Classification:**

**Dine-In Location:**

| Cost | Classification | Fixed Component | Variable Component |
|------|---------------|----------------|-------------------|
| Rent | Fixed (3-year lease) | $15,000/month | None (flat lease) |
| Build-out | Sunk cost | $250,000 (one-time) | None |
| Equipment | Fixed (with step increments) | $120,000 base | +$30,000 if volume exceeds 500 orders/day (second prep line) |
| Labor | Semi-variable | $25,000/month (base staff of 12) | +$2,500/month per additional 3 staff as volume grows |
| Food costs | Variable | None | 30% of revenue |
| Marketing | Semi-variable | $3,000/month (base brand maintenance) | +$100 per 1,000 additional impressions |
| Utilities | Semi-variable | $2,000/month (base) | +$0.50 per order (incremental energy) |

**Ghost Kitchen:**

| Cost | Classification | Fixed Component | Variable Component |
|------|---------------|----------------|-------------------|
| Rent | Fixed (1-year lease, renewable) | $4,000/month | None |
| Build-out | Sunk cost | $80,000 (one-time) | None |
| Equipment | Fixed | $60,000 base | +$15,000 if volume exceeds 300 orders/day |
| Labor | Semi-variable | $12,000/month (base staff of 4) | +$2,000/month per additional 2 staff |
| Food costs | Variable | None | 32% of revenue (higher packaging/waste for delivery) |
| Delivery platform fees | Variable | None | 25% of delivery revenue |
| Marketing | Semi-variable | $5,000/month (digital base) | +$150 per 1,000 impressions |
| Utilities | Semi-variable | $1,000/month (base) | +$0.30 per order |

**Demand Scenario Analysis (Annual):**

| Metric | Pessimistic | Base Case | Optimistic |
|--------|------------|-----------|------------|
| Annual revenue | $800,000 | $1,600,000 | $2,400,000 |
| **Dine-In Profit** | -$420,000 | $180,000 | $620,000 |
| **Ghost Kitchen Profit** | -$80,000 | $130,000 | $280,000 |

**Crossover Point:** At approximately $2,000,000 in annual revenue, the dine-in model becomes more profitable than the ghost kitchen. Below this, the ghost kitchen's lower fixed costs make it more resilient. Above this, the dine-in model's freedom from platform fees (25% of revenue) gives it a margin advantage.

**Operating Leverage Analysis:**

The dine-in model has higher operating leverage: its cost structure is weighted toward fixed costs (rent, larger staff base, higher build-out). This means:
- At low volumes, the dine-in model loses money faster (high fixed costs are spread over fewer orders).
- At high volumes, the dine-in model captures more of each incremental revenue dollar because it does not pay 25% platform fees.

The ghost kitchen has lower operating leverage: more costs are variable (platform fees are the largest single cost component at scale). This means:
- At low volumes, losses are contained because variable costs scale down with revenue.
- At high volumes, platform fees cap the margin per order, limiting upside.

**Strategic Implication:** The ghost kitchen is the lower-risk entry strategy. The dine-in model is the higher-reward strategy — but only if the chain is confident demand will exceed the crossover point.

#### Judging Feedback (Cycle 1)

**Grade: A (Significant improvement, some gaps persist)**

**What Improved:**
- Cost classifications are now explicit and granular. The separation of fixed, variable, and semi-variable components for each line item (especially labor and utilities) is exactly what a rigorous cost analysis requires.
- The three-scenario analysis replaces the single-point break-even with a range that reflects demand uncertainty. The crossover analysis ($2M revenue) directly answers the strategic question.
- The operating leverage discussion correctly identifies the fundamental trade-off: the ghost kitchen minimizes downside risk; the dine-in model maximizes upside potential. This is the most strategically useful insight in the entire analysis.

**Remaining Issues:**
- The analysis does not address how the cost structure changes over the three-year horizon. In Year 1, build-out costs are incurred; by Year 3, they are sunk. The ghost kitchen's one-year lease becomes renegotiable annually, while the dine-in's three-year lease is locked in. These temporal dynamics affect the fixed/variable classification and should be modeled by year, not just as static annual figures.
- Food cost for the ghost kitchen is listed at 32% (vs. 30% for dine-in) with a brief note about packaging, but this is not explored. Delivery-specific costs — packaging, third-party delivery errors, refund rates for cold/damaged food — may push the effective variable cost well above 32%.

#### Steering Feedback (Cycle 1)

**Grade: A (Well-structured command that produced substantial analytical improvement)**

**What Worked:**
- The three-part structure (classify costs, test scenarios, discuss operating leverage) addressed the three main analytical gaps in the original output.
- Asking for a crossover analysis was the most strategic element — it forced the AI to move beyond "which is cheaper?" to "under what conditions does the answer change?" This is the central question for any comparative cost decision.

**What Could Improve:**
- Could have explicitly asked the AI to model costs by year (Year 1, Year 2, Year 3) rather than as static annual figures. The three-year projection window is a key part of the problem, and cost classifications change over time.

---

### Cycle 2

#### Steering Command Sent to AI

instructions:
  - name: "Good progress on the cost classification and crossover analysis"
    description: "Good progress on the cost classification and crossover analysis. Two remaining gaps:"
  - name: "Show how the cost structure evolves over the three-year"
    description: "Show how the cost structure evolves over the three-year projection period. In Year 1, build-out is incurred; by Year 3, it is sunk. The ghost kitchen's lease is renegotiable annually; the dine-in's is locked in. Model the fixed/variable cost breakdown for each option in Year 1, Year 2, and Year 3 separately."
  - name: "Explore how delivery-specific variable costs affect the"
    description: "Explore how delivery-specific variable costs affect the ghost kitchen model. Beyond the 25% platform fee, what about packaging costs, order error rates (refunds for incorrect/damaged deliveries), and the fact that a"

#### Updated AI Output

**Year-by-Year Cost Structure Evolution:**

**Dine-In:**

| Cost Component | Year 1 | Year 2 | Year 3 |
|---------------|--------|--------|--------|
| Build-out | $250,000 (incurred) | $0 (sunk) | $0 (sunk) |
| Rent | $180,000 (fixed, locked) | $180,000 | $180,000 |
| Equipment | $120,000 (capital) + $5,000 (maintenance) | $8,000 (maintenance) | $12,000 (maintenance, some replacements) |
| Labor (fixed component) | $300,000 | $309,000 (+3% inflation) | $318,000 |
| Total Fixed | $855,000 | $497,000 | $510,000 |
| Variable (food + labor flex) | ~30% of revenue + $2,500/mo per crew increment | Same | Same |

**Ghost Kitchen:**

| Cost Component | Year 1 | Year 2 | Year 3 |
|---------------|--------|--------|--------|
| Build-out | $80,000 (incurred) | $0 (sunk) | $0 (sunk) |
| Rent | $48,000 (fixed, 1-yr lease) | $50,400 (+5% renegotiation) | $52,920 (+5%) |
| Equipment | $60,000 (capital) + $3,000 (maint.) | $4,500 (maint.) | $6,000 (maint.) |
| Labor (fixed component) | $144,000 | $148,300 | $152,800 |
| Total Fixed | $335,000 | $203,200 | $211,720 |
| Variable (food + platform + packaging) | ~59% of revenue (see below) | Same | Same |

**Key Temporal Insight:** The dine-in model's fixed costs drop dramatically from Year 1 ($855K, including build-out) to Year 2 ($497K). This means the dine-in break-even shifts substantially downward after Year 1. A three-year cumulative analysis paints a more favorable picture for dine-in than a single-year snapshot — the high Year 1 costs are amortized across a larger revenue base.

The ghost kitchen's fixed costs also drop (Year 1: $335K to Year 2: $203K) but less dramatically. However, the lease renegotiation risk means Year 2-3 fixed costs are less certain — if industrial rents rise faster than expected, the ghost kitchen's cost advantage narrows.

**Delivery-Specific Variable Cost Breakdown — Ghost Kitchen:**

| Variable Cost Component | % of Revenue | Notes |
|------------------------|-------------|-------|
| Food cost | 32% | Higher than dine-in due to delivery packaging, portion control requirements |
| Delivery platform fees | 25% | Non-negotiable for most third-party platforms; potentially reducible to 15-18% with a direct ordering app |
| Packaging | 2% | Containers, insulation bags, utensils, branded materials |
| Order errors and refunds | 1.5% | Industry average for delivery: 5-8% of orders require partial or full refund |
| Menu inefficiency | Estimated 1-2% | Full-service items (plated desserts, temperature-sensitive appetizers) have higher waste and customer complaint rates when delivered. Simplifying the menu for delivery could save 1-2% of revenue. |
| **Total variable cost** | **~61.5%** | Compared to ~30% variable cost for dine-in (food only) |

**Strategic Implication of Cost Structure:**

The ghost kitchen retains only ~38.5% of revenue after variable costs, compared to ~70% for dine-in. This means:
- Every $1 of additional revenue generates $0.385 of contribution margin in the ghost kitchen vs. $0.70 in the dine-in.
- The ghost kitchen needs $335K / 0.385 = ~$870K in Year 1 revenue to break even.
- The dine-in needs $855K / 0.70 = ~$1.22M in Year 1 revenue to break even.

The ghost kitchen breaks even at lower revenue, but the dine-in model generates nearly twice the contribution margin per dollar above break-even. At the three-year level, if the market grows as projected, the cumulative profit from the dine-in model may exceed the ghost kitchen despite its higher initial investment.

**Revised Recommendation:** The choice depends on the chain's confidence in demand. If the chain believes annual revenue will remain below $2M, the ghost kitchen minimizes risk. If the chain expects revenue to exceed $2M by Year 2, the dine-in model yields higher cumulative three-year profit. A staged approach — start with a ghost kitchen to test the market, then open a dine-in location if demand warrants — combines low initial risk with long-term upside.

#### Judging Feedback (Cycle 2)

**Grade: A (Comprehensive, well-structured analysis)**

**What Improved:**
- The year-by-year cost evolution is exactly what was needed. Showing how build-out costs drop out of the fixed cost base in Year 2 and how the dine-in model becomes more competitive over time adds an essential temporal dimension to the analysis.
- The delivery-specific variable cost breakdown is the strongest new element. Decomposing the ghost kitchen's variable costs into food, platform fees, packaging, errors, and menu inefficiency reveals that the ghost kitchen's true variable cost rate (~61.5%) is much higher than the simple 30% food cost figure. This fundamentally changes the contribution margin comparison.
- The staged entry recommendation is strategically sound — it resolves the risk-return trade-off by sequencing the investment rather than making an all-or-nothing bet.

**Minor Remaining Issues:**
- The analysis does not address economies of scale or scope. If the chain opens multiple ghost kitchens in the same city, can they share a central commissary kitchen? Can the dine-in location serve as both a restaurant and a fulfillment hub for delivery orders? These scale/scope questions affect the long-run cost structure.
- The sensitivity analysis from Cycle 1 was not updated with the revised variable cost figures. The crossover point and scenario profitability numbers should be recalculated using the 61.5% variable cost rate.

#### Steering Feedback (Cycle 2)

**Grade: A (Precisely targeted commands that deepened the analysis substantially)**

**What Worked:**
- Asking for year-by-year modeling was the right structural improvement — it transformed a static comparison into a dynamic one that reflects how costs evolve as build-out is amortized and leases are renegotiated.
- The delivery-specific cost prompt was strategically insightful. By pushing the AI to disaggregate the ghost kitchen's variable costs, the student revealed that platform fees and delivery-related costs dramatically change the contribution margin story. This is the kind of cost classification detail that drives the actual business decision.

**What Could Improve:**
- Could have asked the AI to update the sensitivity analysis from Cycle 1 with the revised cost figures. The original crossover point ($2M) was calculated with inaccurate variable cost assumptions and may have shifted.

---

## Completion

### Final Grades

| Skill | Grade | Summary |
|-------|-------|---------|
| **Framing** | A | Strong on missing data, time-horizon, and output measure. Missed semi-variable classifications and delivery-specific cost implications. |
| **Judging** | A | Correctly identified lumped costs, single-scenario analysis, and missing operating leverage. Could have caught delivery cost decomposition earlier. |
| **Steering** | A | Well-structured commands that produced substantial analytical improvements. Year-by-year modeling and delivery cost decomposition were the key contributions. |

### Session Summary

The student demonstrated strong foundational understanding of cost classification and its strategic implications. The framing correctly identified the missing cost data and, most impressively, raised the time-horizon dependence of the fixed/variable distinction — a conceptually sophisticated point that many students miss. During the judge-and-steer cycles, the student effectively guided the AI from a simplistic two-column comparison to a multi-year, multi-scenario analysis with disaggregated cost classifications, operating leverage discussion, and a contribution margin comparison that revealed the ghost kitchen's true variable cost burden. The strongest analytical contribution was pushing the AI to decompose delivery-specific variable costs, which changed the strategic conclusion from "ghost kitchen is obviously better" to "it depends on demand confidence and time horizon." The staged entry recommendation that emerged — ghost kitchen first, dine-in if demand warrants — represents genuine strategic reasoning grounded in cost structure analysis. The main growth area is addressing economies of scale and scope, which become important when the chain considers expanding beyond a single location in the new market.
