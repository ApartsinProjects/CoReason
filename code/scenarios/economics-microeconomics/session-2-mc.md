# Session 2 — Factory Emissions Permit Allocation (Multiple Choice)

**Challenge:** Design a cap-and-trade permit system for a river basin with around 40 factories.
**Subject:** Market Failures > Externalities > Cap-and-Trade
**Response Mode:** Multiple Choice (5 Options)

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Design a cap-and-trade permit system for a river basin with "around 40 factories" that discharge wastewater. The regional authority wants to cut total discharge "significantly" over the next decade. Produce a draft policy document that specifies the initial permit allocation method, the annual cap reduction schedule, trading rules, and a monitoring framework. Some factories are old and "would need expensive upgrades," while newer ones already meet "modern standards." Several factories are the sole employer in their town.

### Student Framing Response

**Which of the following best identifies the most critical set of missing information for designing this system?**

**(A)** The exact chemical composition of each factory's wastewater discharge, which determines the type of treatment technology required.

**(B)** The number of employees at each factory and their average wages, which determines the social cost of any factory closure.

**(C)** The baseline emissions inventory, target cap level, and marginal abatement cost curves for different factory types — without these, the cap level, reduction schedule, and expected trading patterns cannot be determined.

**(D)** The current market price of wastewater treatment equipment, which determines whether a cap-and-trade system is more cost-effective than direct regulation.

**(E)** The legal framework governing water rights in the river basin, which determines whether a permit trading system is legally permissible.

**Student selects: (C)**

### AI Output (with planted issues)

**Draft Cap-and-Trade System:**

**Allocation:** Each factory receives permits equal to its current discharge level (full grandfathering). This approach is fair because each factory keeps what it currently has.

**Cap Schedule:** Total permits decrease by 5% per year for 10 years (50% total reduction). The linear schedule is simple and transparent.

**Trading:** Permits are freely tradable. No price controls. The market will find the efficient price.

**Monitoring:** Annual self-reporting with random audits of 5 factories per year.

**Analysis:** Cap-and-trade ensures that pollution reduction occurs where it is cheapest. Factories with low abatement costs will reduce and sell permits. Factories with high abatement costs will buy permits. The system achieves the environmental goal at minimum total cost. All factories benefit from the flexibility that trading provides.

### Framing Feedback

**Grade: A (Correctly identified the most critical analytical gaps)**

**Strengths:**
- Option (C) is the strongest answer. The three elements — baseline inventory, target cap, and MAC curves — form the analytical foundation for every design decision. Without knowing current total discharge, you cannot set a meaningful cap. Without MAC curves for different factory types, you cannot predict trading patterns, assess compliance costs, or evaluate whether the reduction schedule is technologically feasible.

**Why Other Options Are Weaker:**
- **(A)** is operationally relevant but secondary — the cap-and-trade system operates on aggregate discharge, not chemical-specific regulation.
- **(B)** matters for distributional analysis but does not affect the core design of the trading system.
- **(D)** is one component of abatement cost data, not the full picture; MAC curves (option C) encompass equipment costs and more.
- **(E)** is a legitimate institutional question but is a precondition check, not a design parameter.

**Area for Improvement:**
- The student could have noted that option (C) encompasses but goes beyond option (D) — equipment costs feed into MAC curves. Articulating this hierarchy would demonstrate deeper analytical precision.

---

## Phase 2 — Judge + Steer Cycles

### Cycle 1

#### AI Output Under Review

*(The AI output from Phase 1 above)*

#### Judging (Internal — Not Sent to AI)

gaps:
  - name: "Which of the following best identifies the most"
    description: "Which of the following best identifies the most significant flaw in the AI's policy design? (A) The 50% reduction target may be too aggressive for some factory types. (B) The AI designs the entire system assuming all 40 factories are identical — it does not account for heterogeneous abatement costs, does not address thin-market risks with only 40 participants, and relies on weak self-reporting enforcement. (C) The AI should have recommended a carbon tax instead of cap-and-trade. (D) The AI does not specify which government agency administers the program. (E) The AI's writing style is too informal for a policy document. Student selects: (B) Grade: A (Comprehensive identification of multiple interrelated flaws)"

#### Steering Command

**Which correction should the student send to the AI?**

**(A)** "Please rewrite the policy in more formal language suitable for a government document."

**(B)** "Please add a section on the history of cap-and-trade systems globally."

**(C)** "Please differentiate between old and new factories in your allocation design, add market safeguards (price floor/ceiling) to address thin-market risks, and replace self-reporting with continuous monitoring and third-party verification."

**(D)** "Please convert the cap-and-trade proposal into a Pigouvian tax proposal instead."

**(E)** "Please add more detail about the types of pollutants being discharged."

**Student selects: (C)**

#### Updated AI Output

**Revised Policy Design:**

**1. Differentiated Allocation:**
- **Old factories (high MAC):** Receive permits at 100% of current discharge for Years 1-3, declining to 80% by Year 5. Extended timeline reflects longer upgrade cycles and higher capital requirements.
- **New factories (low MAC):** Receive permits at 90% of current discharge immediately. These factories can comply with modest operational adjustments and are expected to be net sellers of permits.
- **Sole-employer factories:** Receive supplementary transition permits (10% above standard allocation) for Years 1-5, funded by withholding 10% of total permits for government auction. Auction revenue funds a community transition fund.

**2. Market Safeguards:**
- Price floor: $20/permit unit (authority buys permits at floor if market price drops below). Prevents collapse of abatement incentives.
- Price ceiling: $100/permit unit (authority sells reserve permits at ceiling). Prevents cost spikes that could force factory closures.
- Trading registry: All transactions recorded within 24 hours. No single entity may hold >12% of total permits.

**3. Monitoring and Enforcement:**
- Continuous effluent monitoring systems (CEMS) required at all discharge points within 18 months.
- Annual third-party audits by accredited environmental firms.
- Non-compliance penalty: 4x the current market permit price per unit of excess discharge.
- Public disclosure of all factory compliance data on a government portal.

#### Judging Feedback (Cycle 1)

**Grade: A (Substantial improvement, some issues remain)**

The revised output is dramatically better. The differentiated allocation acknowledges factory heterogeneity, the market safeguards address thin-market risks, and the monitoring framework has teeth. However, two issues remain: (1) The cap reduction schedule is still the unrevised linear 5% per year — it was not adjusted to account for the differentiated treatment or the time factories need to install upgrades. (2) There is no mention of permit banking or borrowing, which are standard design elements for any cap-and-trade system.

#### Steering Feedback (Cycle 1)

**Grade: A (Effective multi-part correction)**

Option (C) was the strongest choice by a wide margin. It addressed three distinct design flaws in a single, actionable command, and each element produced a substantive revision. The other options were either cosmetic (A, E), off-topic (B), or would have replaced rather than improved the analysis (D). The minor weakness is that the student's steering did not also address the cap reduction schedule, which was part of the original judging concern.

---

### Cycle 2

#### Judging (of Updated AI Output)

**Which remaining gap in the revised policy most needs to be addressed?**

**(A)** The policy should include provisions for permit banking and borrowing, and the cap reduction schedule should be revised to align with the time factories need to install upgrades.

**(B)** The policy needs a section on international trade implications for the affected factories.

**(C)** The $20 floor and $100 ceiling are arbitrary and need to be justified with empirical data.

**(D)** The policy should specify which brand of continuous monitoring equipment to use.

**(E)** The public disclosure requirement may violate factory privacy rights and should be removed.

**Student selects: (A)**

**Grade: A (Correct priority, incomplete reasoning)**

Option (A) correctly identifies the two most important remaining gaps. Banking and borrowing are standard cap-and-trade features that affect compliance flexibility and cost smoothing — their absence is a significant design omission. The cap reduction schedule also needs revision since the differentiated allocation in Cycle 1 implicitly changed the compliance timeline. However, option (C) also has merit — the price floor and ceiling values need justification, not just assertion. A complete answer would acknowledge both (A) and (C) as priorities.

#### Steering Command

**Which command best addresses the identified gaps?**

**(A)** "Please add permit banking and borrowing rules, and revise the cap reduction schedule to use a back-loaded shape that accounts for upgrade installation timelines."

**(B)** "Please reduce the cap reduction to 3% per year to make compliance easier."

**(C)** "Please remove the cap reduction schedule entirely and let the market determine the optimal pollution level."

**(D)** "Please add a section comparing this system to the EU Emissions Trading System."

**(E)** "Please model the expected permit price trajectory over 10 years."

**Student selects: (A)**

#### Updated AI Output

**Banking and Borrowing Rules:**

**Banking:** Fully permitted. Factories may carry unused permits forward to any future compliance period. Banking creates price stability (factories buy and save when prices are low, reducing price volatility) and does not compromise environmental integrity (total cumulative emissions remain within the cap).

**Borrowing:** Permitted with limits. Factories may borrow up to 15% of next year's allocation at a 1.15x repayment rate (borrow 100, repay 115). This prevents factories from deferring compliance indefinitely while providing genuine flexibility for factories mid-upgrade.

**Revised Cap Reduction Schedule:**

| Period | Annual Reduction | Cumulative | Logic |
|--------|-----------------|-----------|-------|
| Years 1-2 | 2% | 4% | Administrative setup; factories install monitoring equipment |
| Years 3-5 | 4% | 16% | Factories begin implementing upgrade plans; permit trading becomes active |
| Years 6-8 | 7% | 37% | Most upgrades complete; falling MACs enable steeper cuts |
| Years 9-10 | 6.5% | 50% | Final convergence toward 50% reduction target |

**Interaction with Differentiated Allocation:** The transition permits for sole-employer factories expire after Year 5. By design, the back-loaded schedule imposes only 16% cumulative reduction through Year 5, giving these factories time to use transition fund support and complete upgrades before the steep Years 6-8 reductions.

#### Judging Feedback (Cycle 2)

**Grade: A (Strong design with minor gap)**

The banking and borrowing rules are well-designed — full banking with limited borrowing at a penalty rate is the standard best-practice configuration used in systems like RGGI and California's cap-and-trade. The revised cap schedule is a major improvement: the back-loaded shape is economically justified, and the explicit connection to the sole-employer transition timeline shows integrative policy design thinking. The remaining minor gap is that the borrowing limit (15%) and repayment rate (1.15x) are stated without justification — why these numbers rather than 10% at 1.2x or 20% at 1.1x?

#### Steering Feedback (Cycle 2)

**Grade: A (Good direction, could be more specific)**

Option (A) was the correct choice and produced a substantive revision. The instruction to use a "back-loaded shape" gave the AI enough guidance to produce a well-reasoned schedule without being overly prescriptive. However, the command could have been more specific — for instance, asking the AI to justify the borrowing parameters or to show how the schedule interacts with the transition fund timeline. Option (E) would also have been a productive complement (modeling expected price trajectories), but (A) correctly prioritized the structural gaps.

---

## Completion

### Final Grades

| Skill | Grade | Summary |
|-------|-------|---------|
| **Framing** | A | Correctly identified the baseline-MAC-cap triad as the critical data gap. Strong analytical precision. |
| **Judging** | A | Reliably identified major design flaws. Occasionally missed secondary issues (e.g., unjustified parameter values). |
| **Steering** | A | Selected effective corrections that produced significant improvements. Could have been more specific in targeting remaining parameter justification gaps. |

### Session Summary

The student demonstrated strong analytical instincts throughout the session. The framing was nearly ideal, correctly identifying the three-part data gap (baseline inventory, MAC curves, target cap) that underpins every design decision. During judging, the student reliably distinguished between fundamental design flaws (homogeneous treatment, missing safeguards) and superficial concerns (formatting, agency designation). The steering selections were consistently appropriate, producing a policy document that evolved from a simplistic textbook sketch to a nuanced design with differentiated allocation, market safeguards, phased reduction, and banking/borrowing provisions. The main area for growth is pushing beyond structural corrections to demand parameter justification — the student accepted stated numbers (price floors, borrowing limits) without questioning their basis, which would be a critical gap in a real policy review.
