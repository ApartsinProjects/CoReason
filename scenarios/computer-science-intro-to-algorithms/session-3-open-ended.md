# Session 3 — Budget Allocation Optimizer (Open-Ended)

**Challenge:** Dynamic Programming > Optimization Problems > Knapsack
**Mode:** Open-Ended (Structured Sections)
**Student:** Maya S.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Design a function that takes a list of proposed marketing campaigns (each with a cost and projected revenue) and a total budget, and returns the selection of campaigns that maximizes profit. Output the function signature, the DP recurrence relation, a filled-in DP table for a small example (at least 4 campaigns), and the backtracking logic to recover the chosen set. Some campaigns require other campaigns to run first.

### Student's Framing Response

> **Assumption: This is a 0/1 knapsack problem — each campaign is either fully funded or not (no partial funding).**
>
> **Assumption: Costs and budget are integers (or can be discretized to integers), so a tabular DP approach is feasible.**
>
> **Assumption: "Profit" means revenue minus cost, so the objective is to maximize total (revenue - cost) subject to total cost <= budget.**
>
> **Question: The problem says "some campaigns require other campaigns to run first" — this is a dependency constraint. I'll assume it's a simple prerequisite: if campaign B depends on campaign A, then selecting B requires also selecting A.**

### AI Solution (Generated from Student's Framing)

```
FUNCTION max_profit(campaigns, budget):
    // campaigns: list of (name, cost, revenue)
    // budget: integer total budget
    n = len(campaigns)

    // DP table: dp[i][w] = max profit using campaigns 0..i-1 with budget w
    dp = array[n+1][budget+1], initialized to 0

    for i from 1 to n:
        cost_i = campaigns[i-1].cost
        profit_i = campaigns[i-1].revenue - campaigns[i-1].cost
        for w from 0 to budget:
            dp[i][w] = dp[i-1][w]  // don't take campaign i
            if cost_i <= w:
                dp[i][w] = max(dp[i][w], dp[i-1][w - cost_i] + profit_i)

    // Backtrack to find chosen campaigns
    chosen = []
    w = budget
    for i from n down to 1:
        if dp[i][w] != dp[i-1][w]:
            chosen.append(campaigns[i-1].name)
            w -= campaigns[i-1].cost

    return dp[n][budget], chosen
```

**Example (4 campaigns, budget = 10):**

| Campaign | Cost | Revenue | Profit |
|----------|------|---------|--------|
| A        | 3    | 7       | 4      |
| B        | 4    | 9       | 5      |
| C        | 5    | 11      | 6      |
| D        | 6    | 13      | 7      |

Dependency: B requires A.

**DP Table:**

| i\w | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|-----|---|---|---|---|---|---|---|---|---|---|---|
| 0   | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0  |
| A   | 0 | 0 | 0 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4  |
| B   | 0 | 0 | 0 | 4 | 5 | 5 | 5 | 9 | 9 | 9 | 9  |
| C   | 0 | 0 | 0 | 4 | 5 | 6 | 6 | 9 | 10| 11| 11 |
| D   | 0 | 0 | 0 | 4 | 5 | 6 | 7 | 9 | 10| 11| 12 |

**Optimal:** Budget 10, profit = 12, chosen = {A, B, C} (cost 3+4+5=12... wait, that exceeds budget).
Actually chosen = {A, D} (cost 3+6=9, profit 4+7=11) or {B, C} (cost 4+5=9, profit 5+6=11).
The table says 12 at dp[4][10]... let me check: {A, B, D} costs 3+4+6=13 > 10. Hmm. The answer is {A, C} cost=8, profit=10 or {B, D} cost=10, profit=12. Selected: {B, D}, profit=12.

**Backtrack:** dp[4][10]=12 != dp[3][10]=11, so D chosen, w=10-6=4. dp[2][4]=5 != dp[1][4]=4, so B chosen. Result: {B, D}.

*Note: The dependency constraint (B requires A) is not enforced in the DP.*

### Framing Feedback

**Criticism:** The student correctly identified this as 0/1 knapsack and clarified that costs/budget should be integers for tabular DP. The profit definition (revenue - cost) was a good clarification. The student acknowledged the dependency constraint. However, the student did not explore **how** to encode the dependency into the DP state — simply noting it exists without proposing a modeling approach leaves the hardest part of the problem unaddressed. The student also did not question whether dependencies could form chains (A -> B -> C) or trees, or whether there could be mutual exclusions in addition to prerequisites.

**Better Alternative Framing:**
> "Assumption: 0/1 knapsack with integer costs. Profit = revenue - cost. The dependency 'B requires A' means selecting B forces selection of A. Question: Can dependencies form chains (A->B->C) or only pairs? Are there mutual exclusions? Approach: I'll model dependencies by grouping dependent campaigns — if B requires A, the options are: {neither}, {A alone}, {A and B} — effectively creating 'campaign bundles' as items."

**Grade: B** — Identified the right framework but punted on the hardest constraint.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Error: The DP completely ignores the dependency constraint"
    description: "Error: The DP completely ignores the dependency constraint. The solution selects B and D, but B requires A — and A is not selected. This is an invalid solution. Error: The AI's initial backtracking was confused — it first said {A,B,C} which exceeds the budget, then corrected itself. The DP table itself appears correct for standard 0/1 knapsack, but the solution is invalid because it violates the dependency."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Fix: The dependency constraint"
    description: "Fix: The dependency constraint"
  - name: "Fix: Clean up the backtracking"
    description: "Fix: Clean up the backtracking — show it step by step without the false starts."

#### Updated AI Output

```
// Pre-process: group campaigns by dependencies
// B requires A, so group them: options are {}, {A}, {A+B}
// C and D are independent

// Grouped items:
//   Group 1: {skip} or {A: cost=3, profit=4} or {A+B: cost=7, profit=9}
//   Item C: cost=5, profit=6
//   Item D: cost=6, profit=7

FUNCTION max_profit_with_deps(campaigns, dependencies, budget):
    groups = build_dependency_groups(campaigns, dependencies)
    // Each group has multiple "options" (subsets respecting deps)

    dp = array[len(groups)+1][budget+1], initialized to 0

    for g from 1 to len(groups):
        for w from 0 to budget:
            dp[g][w] = dp[g-1][w]  // skip entire group
            for option in groups[g].options:
                if option.cost <= w:
                    dp[g][w] = max(dp[g][w], dp[g-1][w - option.cost] + option.profit)

    // Backtrack
    chosen = []
    w = budget
    for g from len(groups) down to 1:
        for option in groups[g].options (largest first):
            if option.cost <= w AND dp[g][w] == dp[g-1][w - option.cost] + option.profit:
                chosen.extend(option.campaigns)
                w -= option.cost
                break

    return dp[len(groups)][budget], chosen
```

**Revised DP Table (3 "items": Group{A,B}, C, D; budget=10):**

Group 1 options: skip (0,0), A-only (3,4), A+B (7,9)

| g\w  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|------|---|---|---|---|---|---|---|---|---|---|---|
| 0    | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0  |
| G1   | 0 | 0 | 0 | 4 | 4 | 4 | 4 | 9 | 9 | 9 | 9  |
| C    | 0 | 0 | 0 | 4 | 4 | 6 | 6 | 9 | 10| 10| 10 |
| D    | 0 | 0 | 0 | 4 | 4 | 6 | 7 | 9 | 10| 11| 11 |

**Backtrack from dp[3][10] = 11:**
- g=3 (D): dp[3][10]=11, try D (cost=6, profit=7): dp[2][4]=4, 4+7=11. Match! Take D, w=4.
- g=2 (C): dp[2][4]=4, try C (cost=5): 5>4, skip.
- g=1 (Group): dp[1][4]=4, try A+B (cost=7): 7>4, skip. Try A (cost=3): dp[0][1]=0, 0+4=4. Match! Take A, w=1.

**Result: {A, D}, profit = 4 + 7 = 11, cost = 3 + 6 = 9.**

#### Judging Feedback

**Criticism:** The student correctly identified the critical missing dependency constraint — this was the most important issue. Catching the confused backtracking narrative was also valid. However, the student did not question whether the grouping approach scales to longer dependency chains (A -> B -> C -> D), where the number of valid subsets grows exponentially. For this 4-campaign example the grouping works fine, but the student should have flagged the scalability question.

**Better Alternative Judgement:**
> "Error: Dependencies not enforced — B is selected without A. Error: Backtracking explanation was confused and self-contradicting. Gap: If dependencies form long chains, how many group options are there? For a chain of length k, there are k+1 valid subsets — is that tractable?"

**Grade: A** — Caught the critical bug, missed the scalability question about grouped dependencies.

#### Steering Feedback

**Criticism:** The student's grouped-items approach was an excellent suggestion — it correctly models the dependency as constrained item groups. The step-by-step backtracking request also improved clarity. One gap: the student didn't specify how to handle chains longer than pairs.

**Grade: A** — Strong algorithmic insight, minor gap on generalization.

---

### Cycle 2

**Current AI Output:** *(grouped DP version above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap: The solution correctly handles the A->B dependency"
    description: "Gap: The solution correctly handles the A->B dependency but doesn't discuss how build_dependency_groups works for more complex dependency structures (chains, trees). Observation: The DP table and backtracking are now consistent and correct. The grouped approach is sound for this example."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Add: Briefly describe how build_dependency_groups"
    description: "Add: Briefly describe how build_dependency_groups handles dependency chains (A->B->C): the valid options are {}, {A}, {A,B}, {A,B,C} — each prefix of the chain. Note the number of options per group equals chain length + 1."
  - name: "Add: Include a note in the complexity analysis about how"
    description: "Add: Include a note in the complexity analysis about how the number of group options affects the DP runtime."

#### Updated AI Output

*(AI adds the following to the existing solution)*

```
FUNCTION build_dependency_groups(campaigns, dependencies):
    // Build dependency DAG, find connected components
    // For a chain A -> B -> C, valid subsets are prefixes:
    //   {}, {A}, {A,B}, {A,B,C}
    // For a tree rooted at A with children B, C:
    //   valid subsets include any combination where all ancestors are present

    // For chains of length k: k+1 options per group
    // For trees: 2^(leaves) options in worst case, but bounded by tree structure

    groups = []
    for each connected component in dependency DAG:
        options = enumerate_valid_subsets(component)  // respecting ancestor constraint
        groups.append(Group(options))
    return groups
```

**Complexity:** O(G * budget * max_options) where G = number of groups, max_options = maximum valid subsets in any group. For simple pair dependencies, max_options = 3. For chains of length k, max_options = k+1.

#### Judging Feedback

**Criticism:** The student correctly identified the generalization gap and pushed for clarity on chains. However, the student did not notice that the AI's tree case mentions "2^(leaves) options in worst case" — for a tree with many leaves, this could be exponential, making the DP intractable. The student should have pressed on whether this is NP-hard in the general dependency-DAG case.

**Better Alternative Judgement:**
> "Gap: Need chain/tree generalization. Concern: For tree-structured dependencies, the AI says 2^(leaves) options — this could be exponential. Is the problem NP-hard for general dependency DAGs?"

**Grade: A** — Good generalization question, missed the exponential blowup warning.

#### Steering Feedback

**Criticism:** The steering was well-directed — asking for chain handling and complexity impact. Could have pushed harder on the tree case tractability.

**Grade: A** — Good direction, missed opportunity to probe exponential case.

---

### Cycle 3 (Final)

**Current AI Output:** *(full solution with dependency grouping and complexity notes)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "The solution is complete for the stated problem scope"
    description: "The solution is complete for the stated problem scope. The chain handling is clear, the DP table is correct, and the complexity is documented."

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

The student correctly identified the 0/1 knapsack structure and the dependency constraint but did not propose a modeling approach for dependencies during framing — this left the hardest part of the problem for the AI to handle (or mishandle). In judging, catching the dependency violation in the initial solution was critical and well done. The student also spotted the confused backtracking narrative. However, the student consistently missed "second-order" concerns: the scalability of the grouping approach for long chains, and the potential exponential blowup for tree-structured dependencies. Steering was effective in driving toward the grouped-items model, but could have probed harder on generalization limits. To improve, practice asking "does this approach still work if the input is 10x more complex?"
