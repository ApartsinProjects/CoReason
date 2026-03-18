# Session 3 — Budget Allocation Optimizer (Multiple Choice)

**Challenge:** Dynamic Programming > Optimization Problems > Knapsack
**Mode:** Multiple Choice
**Student:** Maya S.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Design a function that takes a list of proposed marketing campaigns (each with a cost and projected revenue) and a total budget, and returns the selection of campaigns that maximizes profit. Output the function signature, the DP recurrence relation, a filled-in DP table for a small example (at least 4 campaigns), and the backtracking logic to recover the chosen set. Some campaigns require other campaigns to run first.

### Framing Options Presented

Which assumptions and clarifications best prepare the AI to solve this problem?

- **(A)** This is a fractional knapsack — campaigns can be partially funded. Use a greedy approach sorted by profit/cost ratio. Ignore dependencies.
- **(B)** This is 0/1 knapsack with integer costs. Profit = revenue - cost. Dependencies exist but treat them as a note for later.
- **(C)** This is 0/1 knapsack with integer costs. Profit = revenue - cost. Dependencies mean "B requires A" implies selecting B forces A's inclusion. Model dependencies as grouped items: valid subsets are {}, {A}, {A+B}. Ask whether dependencies form chains or trees.
- **(D)** This is the unbounded knapsack — each campaign can be run multiple times. Dependencies are irrelevant since we always run everything.
- **(E)** Use a greedy algorithm — sort campaigns by revenue and pick from the top until budget is exhausted. Dependencies just mean run them in order.

**Student selects: (B)**

### AI Solution (Generated from Student's Framing)

```
FUNCTION max_profit(campaigns, budget):
    n = len(campaigns)
    dp = array[n+1][budget+1], initialized to 0

    for i from 1 to n:
        cost_i = campaigns[i-1].cost
        profit_i = campaigns[i-1].revenue - campaigns[i-1].cost
        for w from 0 to budget:
            dp[i][w] = dp[i-1][w]
            if cost_i <= w:
                dp[i][w] = max(dp[i][w], dp[i-1][w - cost_i] + profit_i)

    chosen = []
    w = budget
    for i from n down to 1:
        if dp[i][w] != dp[i-1][w]:
            chosen.append(campaigns[i-1])
            w -= campaigns[i-1].cost
    return dp[n][budget], chosen
```

**Example (budget=10):**

| Campaign | Cost | Revenue | Profit |
|----------|------|---------|--------|
| A        | 3    | 7       | 4      |
| B        | 4    | 9       | 5      |
| C        | 5    | 11      | 6      |
| D        | 6    | 13      | 7      |

Dependency: B requires A.

**DP Table (standard 0/1, no dependency enforcement):**

| i\w | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|-----|---|---|---|---|---|---|---|---|---|---|---|
| 0   | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0  |
| A   | 0 | 0 | 0 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4  |
| B   | 0 | 0 | 0 | 4 | 5 | 5 | 5 | 9 | 9 | 9 | 9  |
| C   | 0 | 0 | 0 | 4 | 5 | 6 | 6 | 9 | 10| 11| 11 |
| D   | 0 | 0 | 0 | 4 | 5 | 6 | 7 | 9 | 10| 11| 12 |

**Result: {B, D}, profit=12, cost=10.** *(Note: B requires A but A is not selected — dependency violated.)*

### Framing Feedback

**Criticism:** Option (B) correctly identifies 0/1 knapsack and the profit formula, but defers the dependency constraint to "later" — which means the AI generates a solution that ignores it entirely. Option (C) was stronger because it proposes a concrete modeling strategy (grouped items) and asks about dependency structure (chains vs trees), which would have given the AI the information needed to handle dependencies from the start.

**Better Alternative:** Option **(C)** — addresses the dependency head-on with a workable modeling strategy.

**Grade: B** — Correct problem classification but deferred the hardest constraint.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's solution?

- **(A)** The DP table has arithmetic errors in multiple cells
- **(B)** The solution selects {B, D} but B requires A — the dependency is completely ignored in the recurrence; the backtracking is correct for standard knapsack but produces an invalid result
- **(C)** The DP table is correct and the dependency is properly handled
- **(D)** The solution ignores dependencies; the backtracking is inconsistent with the DP table; the example should use a greedy approach instead
- **(E)** The DP should use revenue as the value, not profit (revenue - cost)

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send?

- **(A)** "Add an if-statement to check dependencies during backtracking"
- **(B)** "Enforce the dependency by grouping dependent campaigns: for the A->B dependency, the DP items become Group1 with options {skip, A-only cost=3 profit=4, A+B cost=7 profit=9}, plus C and D as independent items. Rebuild the DP table with these grouped items."
- **(C)** "Sort campaigns by dependency order, then run the same DP"
- **(D)** "Just remove B from the campaign list since it has a dependency"
- **(E)** "Use a constraint satisfaction solver instead of DP"

**Student selects: (B)**

#### Updated AI Output

```
// Grouped items:
//   Group1: {skip}, {A: cost=3, profit=4}, {A+B: cost=7, profit=9}
//   C: cost=5, profit=6
//   D: cost=6, profit=7

FUNCTION max_profit_with_deps(campaigns, deps, budget):
    groups = build_groups(campaigns, deps)
    dp = array[len(groups)+1][budget+1], init 0

    for g from 1 to len(groups):
        for w from 0 to budget:
            dp[g][w] = dp[g-1][w]
            for option in groups[g].options:
                if option.cost <= w:
                    dp[g][w] = max(dp[g][w], dp[g-1][w - option.cost] + option.profit)

    // Backtrack
    chosen = []
    w = budget
    for g from len(groups) down to 1:
        for option in groups[g].options (by cost desc):
            if option.cost <= w AND dp[g][w] == dp[g-1][w - option.cost] + option.profit:
                chosen.extend(option.campaigns)
                w -= option.cost
                break
    return dp[len(groups)][budget], chosen
```

**Revised DP Table (3 groups, budget=10):**

| g\w  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|------|---|---|---|---|---|---|---|---|---|---|---|
| 0    | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0  |
| G1   | 0 | 0 | 0 | 4 | 4 | 4 | 4 | 9 | 9 | 9 | 9  |
| C    | 0 | 0 | 0 | 4 | 4 | 6 | 6 | 9 | 10| 10| 10 |
| D    | 0 | 0 | 0 | 4 | 4 | 6 | 7 | 9 | 10| 11| 11 |

**Backtrack:** dp[3][10]=11. D: dp[2][4]=4, 4+7=11. Take D, w=4. C: 5>4, skip. G1: A cost=3, dp[0][1]=0, 0+4=4=dp[1][4]. Take A, w=1. **Result: {A, D}, profit=11, cost=9. Dependency respected.**

#### Judging Feedback

**Criticism:** The student correctly identified the dependency violation as the primary issue — the most critical bug. The backtracking observation (correct for standard knapsack but producing invalid output) showed good analytical depth. Option (B) was the best available choice.

**Grade: A** — Precise identification of the core issue with good analysis.

#### Steering Feedback

**Criticism:** Option (B) was excellent — it proposed the exact grouped-items modeling strategy, specified the group options concretely, and asked for a rebuilt DP table. This was the best possible correction.

**Grade: A** — Specific, algorithmically sound, and directly actionable.

---

### Cycle 2

**Current AI Output:** *(grouped DP version above)*

#### Judging Sub-step

Which issues remain?

- **(A)** The DP table has errors — the grouped approach doesn't work
- **(B)** The solution is correct for pair dependencies but doesn't explain how to handle longer chains (A->B->C) or tree-shaped dependencies; no complexity analysis provided
- **(C)** build_groups is undefined and the complexity impact of multiple options per group is not analyzed
- **(D)** The backtracking logic is wrong — it should iterate options by profit, not cost
- **(E)** No issues — the solution is complete

**Student selects: (C)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send?

- **(A)** "Rewrite the entire solution using a different DP formulation"
- **(B)** "Define build_groups: for a chain of length k, valid options are the k+1 prefixes. State the overall complexity as O(G * budget * max_options) and note the impact on runtime."
- **(C)** "Add comments to the code"
- **(D)** "Switch to memoization instead of tabulation"
- **(E)** "Use a different programming language"

**Student selects: (B)**

#### Updated AI Output

*(AI adds to the solution)*

```
FUNCTION build_groups(campaigns, deps):
    // Build dependency DAG
    // For each connected component, enumerate valid subsets:
    //   Chain A->B->C: prefixes {}, {A}, {A,B}, {A,B,C}
    //   Each prefix has cumulative cost and profit
    groups = []
    components = find_connected_components(deps)
    for comp in components:
        chain = topological_sort(comp)
        options = [Option(cost=0, profit=0, campaigns=[])]  // skip option
        cumulative_cost = 0
        cumulative_profit = 0
        for idx, node in enumerate(chain):
            cumulative_cost += node.cost
            cumulative_profit += node.profit
            options.append(Option(cumulative_cost, cumulative_profit, chain[:idx+1]))
        groups.append(Group(options))

    // Independent campaigns are singleton groups with 2 options: skip or take
    for camp in campaigns if not in any dependency:
        groups.append(Group([Option(0,0,[]), Option(camp.cost, camp.profit, [camp])]))

    return groups
```

**Complexity:** O(G * B * K) where G = number of groups, B = budget, K = max options per group. For chains of length k, K = k+1. For n independent items with no dependencies, G = n, K = 2, giving standard O(n * B).

#### Judging Feedback

**Criticism:** The student correctly identified that build_groups was undefined and that the complexity analysis was missing. Option (C) was the right choice. However, the student could have also noted that the solution assumes dependencies form chains, not trees — for tree-shaped dependencies, the number of valid subsets could be exponential.

**Better Alternative:** Option (B) would have been more comprehensive — it also flags the chain-vs-tree limitation.

**Grade: A** — Caught the structural gaps, missed the chain assumption limitation.

#### Steering Feedback

**Criticism:** Option (B) was well-targeted — it specified both what build_groups should do for chains and the complexity formula. The student made the right choice.

**Grade: A** — Clear and actionable with the right level of specificity.

---

### Cycle 3 (Final)

**Current AI Output:** *(complete grouped DP with build_groups and complexity)*

#### Judging Sub-step

Which issues remain?

- **(A)** The solution only handles chain dependencies, not tree-shaped ones — but this is adequate for the stated problem
- **(B)** The entire DP approach is wrong
- **(C)** The complexity analysis is incorrect
- **(D)** The solution is complete for the problem scope
- **(E)** The hash function needs to be specified

**Student selects: (D)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done**

---

## COMPLETION

### Final Grades

| Skill    | Grade |
|----------|-------|
| Framing  | B     |
| Judging  | A     |
| Steering | A     |

### Summary Feedback

The student correctly identified the 0/1 knapsack framework and caught the critical dependency violation in the first judging cycle. Steering was consistently strong — the grouped-items suggestion was algorithmically sophisticated and directly resolved the core issue. The main weakness was in framing: deferring the dependency constraint led to a fundamentally flawed initial solution. In judging, the student caught primary issues (dependency violation, undefined functions, missing complexity) but missed secondary concerns (chain-vs-tree generalization, exponential blowup for tree dependencies). To improve, address hard constraints during framing rather than hoping they resolve themselves.
