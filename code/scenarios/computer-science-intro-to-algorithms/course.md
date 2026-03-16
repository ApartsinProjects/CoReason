# Course: Introduction to Algorithms
**Department:** Computer Science
**Institution:** Tel Aviv University

---

## Subject Tree

```
Introduction to Algorithms
├── Sorting & Searching
│   ├── Comparison-based Sorting
│   │   ├── Merge Sort
│   │   └── Quick Sort
│   ├── Non-comparison Sorting
│   │   ├── Counting Sort
│   │   └── Radix Sort
│   └── Binary Search Variants
├── Graph Algorithms
│   ├── Traversal
│   │   ├── BFS
│   │   └── DFS
│   ├── Shortest Paths
│   │   ├── Dijkstra
│   │   └── Bellman-Ford
│   └── Minimum Spanning Trees
│       ├── Kruskal
│       └── Prim
├── Dynamic Programming
│   ├── Memoization vs Tabulation
│   ├── Sequence Problems
│   │   ├── Longest Common Subsequence
│   │   └── Edit Distance
│   └── Optimization Problems
│       ├── Knapsack
│       └── Matrix Chain Multiplication
├── Complexity Analysis
│   ├── Big-O Notation
│   ├── Amortized Analysis
│   └── NP-Completeness
│       ├── Reductions
│       └── Approximation Algorithms
└── Data Structures
    ├── Trees
    │   ├── Binary Search Trees
    │   ├── AVL Trees
    │   └── B-Trees
    ├── Hash Tables
    │   ├── Collision Resolution
    │   └── Universal Hashing
    └── Heaps
        ├── Binary Heaps
        └── Fibonacci Heaps
```

---

## Challenge Examples

### Challenge 1: Sorting Pipeline for Sensor Data
**Subject:** Sorting & Searching > Comparison-based Sorting
**Type:** Practice

**Raw Problem (intentionally ill-defined):**
> Write a sorting module that ingests a live stream of temperature readings from warehouse sensors and outputs a continuously sorted buffer that a monitoring dashboard can poll. Each reading is a (sensor_id, timestamp, temperature) tuple. The warehouse has "a few hundred" sensors reporting every second. Deliver working pseudocode for the module plus a table comparing your chosen algorithm against two alternatives on time complexity, space usage, and latency. The system should "handle spikes" when sensors report in bursts.

**Framing Rubric:**

#### Criterion 1: Unstated assumptions about data ordering and input characteristics
- **Description:** Identifies unstated assumptions about data ordering and input characteristics (e.g., sort key, stability, duplicates)
- **Excellent (A):** Clearly and specifically identifies unstated assumptions about data ordering and input characteristics (e.g., sort key, stability, duplicates)
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Vague performance or scale requirements and seeks concrete bounds or metrics
- **Description:** Questions vague performance or scale requirements and seeks concrete bounds or metrics
- **Excellent (A):** Clearly and specifically questions vague performance or scale requirements and seeks concrete bounds or metrics
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Missing constraints on memory usage
- **Description:** Notes missing constraints on memory usage, input size, or output format that affect algorithm selection
- **Excellent (A):** Clearly and specifically notes missing constraints on memory usage, input size, or output format that affect algorithm selection
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Assumptions about whether the input is static
- **Description:** Formulates assumptions about whether the input is static or dynamic and how that changes the problem structure
- **Excellent (A):** Clearly and specifically formulates assumptions about whether the input is static or dynamic and how that changes the problem structure
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Selects a comparison-based sorting algorithm
- **Description:** Detects if AI selects a comparison-based sorting algorithm without justifying it against the problem's constraints (data distribution, input size, stability needs)
- **Excellent (A):** Accurately detects if AI selects a comparison-based sorting algorithm without justifying it against the problem's constraints (data distribution, input size, stability needs) and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Correctly analyzes the best-case
- **Description:** Identifies whether AI correctly analyzes the best-case, average-case, and worst-case time complexity for the chosen algorithm
- **Excellent (A):** Accurately identifies whether AI correctly analyzes the best-case, average-case, and worst-case time complexity for the chosen algorithm and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Ignores relevant tradeoffs between comparison-based sorting alternatives
- **Description:** Catches if AI ignores relevant tradeoffs between comparison-based sorting alternatives (e.g., merge sort vs. quick sort on space, stability, and cache behavior)
- **Excellent (A):** Accurately catches if AI ignores relevant tradeoffs between comparison-based sorting alternatives (e.g., merge sort vs. quick sort on space, stability, and cache behavior) and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Fails to compare the chosen algorithm against at least one meaningful
- **Description:** Recognizes if AI fails to compare the chosen algorithm against at least one meaningful alternative on the dimensions specified in the problem
- **Excellent (A):** Accurately recognizes if AI fails to compare the chosen algorithm against at least one meaningful alternative on the dimensions specified in the problem and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Resolve a specific ambiguity rather than asking generically for improvement
- **Description:** Commands resolve a specific ambiguity (e.g., sort key, stability requirement) rather than asking generically for improvement
- **Excellent (A):** Effectively commands resolve a specific ambiguity (e.g., sort key, stability requirement) rather than asking generically for improvement with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Justify algorithm choice by connecting problem constraints to algorithm
- **Description:** Guides AI to justify algorithm choice by connecting problem constraints to algorithm properties
- **Excellent (A):** Effectively guides AI to justify algorithm choice by connecting problem constraints to algorithm properties with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Toward concrete complexity analysis grounded in stated input-size assumptions
- **Description:** Drives toward concrete complexity analysis grounded in stated input-size assumptions
- **Excellent (A):** Effectively drives toward concrete complexity analysis grounded in stated input-size assumptions with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Solution that clearly separates the sorting logic from any surrounding
- **Description:** Converges on a solution that clearly separates the sorting logic from any surrounding input/output handling
- **Excellent (A):** Effectively converges on a solution that clearly separates the sorting logic from any surrounding input/output handling with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 2: Mapping Network Outage Blast Radius
**Subject:** Graph Algorithms > Traversal > BFS, DFS
**Type:** Assessment

**Raw Problem (intentionally ill-defined):**
> Build a command-line tool that, given a network topology file and a failed router ID, outputs every device that becomes unreachable. The topology file lists links between routers. The ops team says some links are "backup links" that only activate during failures. Deliver the tool's algorithm in pseudocode, an example input/output, and a brief analysis of its running time. The tool should finish "quickly" even for large networks.

**Framing Rubric:**

#### Criterion 1: Ambiguity in the traversal's starting point
- **Description:** Identifies ambiguity in the traversal's starting point, termination conditions, or reachability definition
- **Excellent (A):** Clearly and specifically identifies ambiguity in the traversal's starting point, termination conditions, or reachability definition
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Unstated properties of the graph
- **Description:** Questions unstated properties of the graph (directed vs. undirected, weighted vs. unweighted, presence of special edge types or node states)
- **Excellent (A):** Clearly and specifically questions unstated properties of the graph (directed vs. undirected, weighted vs. unweighted, presence of special edge types or node states)
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Missing information about graph size
- **Description:** Notes missing information about graph size, input format, and scale that affect algorithm choice and complexity claims
- **Excellent (A):** Clearly and specifically notes missing information about graph size, input format, and scale that affect algorithm choice and complexity claims
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Problem requires a single traversal
- **Description:** Clarifies whether the problem requires a single traversal or multiple traversals under varying graph conditions
- **Excellent (A):** Clearly and specifically clarifies whether the problem requires a single traversal or multiple traversals under varying graph conditions
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Applies BFS or DFS without justifying the choice relative to the problem's
- **Description:** Detects if AI applies BFS or DFS without justifying the choice relative to the problem's structural requirements (e.g., shortest path in unweighted graphs favors BFS)
- **Excellent (A):** Accurately detects if AI applies BFS or DFS without justifying the choice relative to the problem's structural requirements (e.g., shortest path in unweighted graphs favors BFS) and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Correctly defines the source
- **Description:** Identifies whether AI correctly defines the source and scope of the traversal rather than leaving them implicit
- **Excellent (A):** Accurately identifies whether AI correctly defines the source and scope of the traversal rather than leaving them implicit and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: States O complexity without accounting for any graph preprocessing
- **Description:** Catches if AI states O(V+E) complexity without accounting for any graph preprocessing or modification steps the problem requires
- **Excellent (A):** Accurately catches if AI states O(V+E) complexity without accounting for any graph preprocessing or modification steps the problem requires and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Provided examples are too trivial to demonstrate the traversal's behavior on
- **Description:** Recognizes if provided examples are too trivial to demonstrate the traversal's behavior on the problem's distinguishing features
- **Excellent (A):** Accurately recognizes if provided examples are too trivial to demonstrate the traversal's behavior on the problem's distinguishing features and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Resolve a specific structural ambiguity
- **Description:** Commands resolve a specific structural ambiguity (e.g., traversal source, edge semantics) rather than broadly requesting a better answer
- **Excellent (A):** Effectively commands resolve a specific structural ambiguity (e.g., traversal source, edge semantics) rather than broadly requesting a better answer with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Clearly separate graph construction
- **Description:** Guides AI to clearly separate graph construction or modification steps from the traversal itself
- **Excellent (A):** Effectively guides AI to clearly separate graph construction or modification steps from the traversal itself with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Examples that are large enough
- **Description:** Presses for examples that are large enough and varied enough to expose non-trivial traversal behavior
- **Excellent (A):** Effectively presses for examples that are large enough and varied enough to expose non-trivial traversal behavior with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Pseudocode that makes the traversal order
- **Description:** Converges on pseudocode that makes the traversal order, visited tracking, and output construction explicit
- **Excellent (A):** Effectively converges on pseudocode that makes the traversal order, visited tracking, and output construction explicit with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 3: Budget Allocation Optimizer
**Subject:** Dynamic Programming > Optimization Problems > Knapsack
**Type:** Practice

**Raw Problem (intentionally ill-defined):**
> Design a function that takes a list of proposed marketing campaigns (each with a cost and projected revenue) and a total budget, and returns the selection of campaigns that maximizes profit. Output the function signature, the DP recurrence relation, a filled-in DP table for a small example (at least 4 campaigns), and the backtracking logic to recover the chosen set. Some campaigns require other campaigns to run first.

**Framing Rubric:**

#### Criterion 1: Item values and weights are integer
- **Description:** Identifies whether item values and weights are integer or continuous, and how that affects the feasibility of a tabular DP approach
- **Excellent (A):** Clearly and specifically identifies whether item values and weights are integer or continuous, and how that affects the feasibility of a tabular DP approach
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Any constraints beyond standard knapsack and how they alter the DP state space
- **Description:** Questions any constraints beyond standard knapsack (e.g., item dependencies, grouping, or mutual exclusions) and how they alter the DP state space
- **Excellent (A):** Clearly and specifically questions any constraints beyond standard knapsack (e.g., item dependencies, grouping, or mutual exclusions) and how they alter the DP state space
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Missing information about whether items are divisible
- **Description:** Notes missing information about whether items are divisible (fractional knapsack) or indivisible (0/1 knapsack), and whether items can be selected more than once
- **Excellent (A):** Clearly and specifically notes missing information about whether items are divisible (fractional knapsack) or indivisible (0/1 knapsack), and whether items can be selected more than once
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Unstated assumptions about the objective function
- **Description:** Recognizes unstated assumptions about the objective function (maximize value, minimize cost, or a multi-criteria tradeoff)
- **Excellent (A):** Clearly and specifically recognizes unstated assumptions about the objective function (maximize value, minimize cost, or a multi-criteria tradeoff)
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Applies a standard knapsack recurrence
- **Description:** Detects if AI applies a standard knapsack recurrence without incorporating additional constraints that the problem specifies
- **Excellent (A):** Accurately detects if AI applies a standard knapsack recurrence without incorporating additional constraints that the problem specifies and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Fails to state or justify assumptions about value/weight granularity that are
- **Description:** Identifies if AI fails to state or justify assumptions about value/weight granularity that are essential for the DP table dimensions
- **Excellent (A):** Accurately identifies if AI fails to state or justify assumptions about value/weight granularity that are essential for the DP table dimensions and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Backtracking or solution-recovery logic is incomplete or inconsistent with the
- **Description:** Catches if the backtracking or solution-recovery logic is incomplete or inconsistent with the recurrence relation
- **Excellent (A):** Accurately catches if the backtracking or solution-recovery logic is incomplete or inconsistent with the recurrence relation and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Worked DP table example is too simple to demonstrate the effect of the
- **Description:** Recognizes if the worked DP table example is too simple to demonstrate the effect of the problem's distinguishing constraints
- **Excellent (A):** Accurately recognizes if the worked DP table example is too simple to demonstrate the effect of the problem's distinguishing constraints and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Point to a specific constraint
- **Description:** Commands point to a specific constraint or assumption gap rather than broadly asking for a better solution
- **Excellent (A):** Effectively commands point to a specific constraint or assumption gap rather than broadly asking for a better solution with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Explicitly define the DP state
- **Description:** Guides AI to explicitly define the DP state, transition, and base cases before filling in a table
- **Excellent (A):** Effectively guides AI to explicitly define the DP state, transition, and base cases before filling in a table with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Worked example that includes at least one case where a naive greedy choice
- **Description:** Presses for a worked example that includes at least one case where a naive greedy choice would differ from the optimal DP solution
- **Excellent (A):** Effectively presses for a worked example that includes at least one case where a naive greedy choice would differ from the optimal DP solution with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Complete solution: stated assumptions
- **Description:** Converges on a complete solution: stated assumptions, recurrence relation, filled table, and backtracking logic
- **Excellent (A):** Effectively converges on a complete solution: stated assumptions, recurrence relation, filled table, and backtracking logic with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 4: Emergency Evacuation Route Planner
**Subject:** Graph Algorithms > Shortest Paths > Dijkstra
**Type:** Assessment

**Raw Problem (intentionally ill-defined):**
> Implement an algorithm that, given a city road map and a list of current road closures, computes the fastest evacuation route from a given neighborhood to the nearest shelter. Output pseudocode for the algorithm, a worked example on a graph with at least 8 nodes, and a complexity analysis. Roads have speed limits and distances. Some roads are "congestion-prone" during evacuations.

**Framing Rubric:**

#### Criterion 1: Ambiguity in the optimization metric and how edge weights encode it
- **Description:** Identifies ambiguity in the optimization metric (shortest distance, minimum time, fewest edges) and how edge weights encode it
- **Excellent (A):** Clearly and specifically identifies ambiguity in the optimization metric (shortest distance, minimum time, fewest edges) and how edge weights encode it
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Problem is single-source single-destination
- **Description:** Questions whether the problem is single-source single-destination, single-source multi-destination, or requires a different Dijkstra variant
- **Excellent (A):** Clearly and specifically questions whether the problem is single-source single-destination, single-source multi-destination, or requires a different Dijkstra variant
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Missing information about graph properties
- **Description:** Notes missing information about graph properties (directed vs. undirected, presence of non-negative weight guarantee, dynamic vs. static weights)
- **Excellent (A):** Clearly and specifically notes missing information about graph properties (directed vs. undirected, presence of non-negative weight guarantee, dynamic vs. static weights)
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Edge weights are fixed at query time
- **Description:** Clarifies whether edge weights are fixed at query time or may change, which determines whether a single Dijkstra run suffices
- **Excellent (A):** Clearly and specifically clarifies whether edge weights are fixed at query time or may change, which determines whether a single Dijkstra run suffices
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Applies textbook Dijkstra
- **Description:** Detects if AI applies textbook Dijkstra without adapting edge weights or graph structure to reflect the problem's real-world complications
- **Excellent (A):** Accurately detects if AI applies textbook Dijkstra without adapting edge weights or graph structure to reflect the problem's real-world complications and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Uses an inefficient search strategy when the problem structure allows a more
- **Description:** Identifies if AI uses an inefficient search strategy when the problem structure allows a more targeted variant (e.g., early termination, reverse search, multi-source)
- **Excellent (A):** Accurately identifies if AI uses an inefficient search strategy when the problem structure allows a more targeted variant (e.g., early termination, reverse search, multi-source) and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Worked example is too small
- **Description:** Catches if the worked example is too small or too uniform to demonstrate how weight variations affect the shortest path
- **Excellent (A):** Accurately catches if the worked example is too small or too uniform to demonstrate how weight variations affect the shortest path and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Complexity analysis omits graph preprocessing steps
- **Description:** Recognizes if the complexity analysis omits graph preprocessing steps or uses incorrect assumptions about the priority queue implementation
- **Excellent (A):** Accurately recognizes if the complexity analysis omits graph preprocessing steps or uses incorrect assumptions about the priority queue implementation and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Specify how to model edge weights concretely
- **Description:** Commands specify how to model edge weights concretely rather than leaving the weight function ambiguous
- **Excellent (A):** Effectively commands specify how to model edge weights concretely rather than leaving the weight function ambiguous with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Consider Dijkstra variants
- **Description:** Guides AI to consider Dijkstra variants or optimizations suited to the problem's source/destination structure
- **Excellent (A):** Effectively guides AI to consider Dijkstra variants or optimizations suited to the problem's source/destination structure with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Worked example to include a scenario where the greedy nearest-neighbor path is
- **Description:** Requires the worked example to include a scenario where the greedy nearest-neighbor path is not the true shortest path
- **Excellent (A):** Effectively requires the worked example to include a scenario where the greedy nearest-neighbor path is not the true shortest path with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Pseudocode that clearly shows graph construction
- **Description:** Converges on pseudocode that clearly shows graph construction, weight assignment, priority-queue-based search, and path reconstruction
- **Excellent (A):** Effectively converges on pseudocode that clearly shows graph construction, weight assignment, priority-queue-based search, and path reconstruction with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 5: Autocomplete Index
**Subject:** Data Structures > Hash Tables > Collision Resolution
**Type:** Practice

**Raw Problem (intentionally ill-defined):**
> Build a hash-table-backed index that supports prefix-based autocomplete for a product catalog. Given a user's partial query string, the index should return the top results "instantly." Deliver the hash function design, the collision resolution strategy, the insertion algorithm, the lookup algorithm, and a complexity analysis. The catalog has "millions" of products and the index must support "frequent updates" as products are added and removed.

**Framing Rubric:**

#### Criterion 1: Mismatches between the lookup pattern required by the problem
- **Description:** Identifies mismatches between the lookup pattern required by the problem and the access patterns a hash table naturally supports
- **Excellent (A):** Clearly and specifically identifies mismatches between the lookup pattern required by the problem and the access patterns a hash table naturally supports
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Unstated assumptions about the key space
- **Description:** Questions unstated assumptions about the key space, key distribution, and expected load factor that affect collision behavior
- **Excellent (A):** Clearly and specifically questions unstated assumptions about the key space, key distribution, and expected load factor that affect collision behavior
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Missing information about memory constraints
- **Description:** Notes missing information about memory constraints, expected table size, and the ratio of insertions/deletions to lookups
- **Excellent (A):** Clearly and specifically notes missing information about memory constraints, expected table size, and the ratio of insertions/deletions to lookups
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Tension between dynamic update requirements
- **Description:** Recognizes tension between dynamic update requirements and any assumptions of a static or fixed-size table
- **Excellent (A):** Clearly and specifically recognizes tension between dynamic update requirements and any assumptions of a static or fixed-size table
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Selects a collision resolution strategy
- **Description:** Detects if AI selects a collision resolution strategy without justifying it against the problem's key distribution and load characteristics
- **Excellent (A):** Accurately detects if AI selects a collision resolution strategy without justifying it against the problem's key distribution and load characteristics and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Conflates average-case O hash table performance with guaranteed behavior under
- **Description:** Identifies if AI conflates average-case O(1) hash table performance with guaranteed behavior under adversarial or skewed inputs
- **Excellent (A):** Accurately identifies if AI conflates average-case O(1) hash table performance with guaranteed behavior under adversarial or skewed inputs and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Fails to address how the chosen collision resolution handles clustering
- **Description:** Catches if AI fails to address how the chosen collision resolution handles clustering, chain length growth, or rehashing triggers
- **Excellent (A):** Accurately catches if AI fails to address how the chosen collision resolution handles clustering, chain length growth, or rehashing triggers and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Complexity analysis omits amortized costs for insertions/deletions
- **Description:** Recognizes if the complexity analysis omits amortized costs for insertions/deletions or ignores the impact of table resizing
- **Excellent (A):** Accurately recognizes if the complexity analysis omits amortized costs for insertions/deletions or ignores the impact of table resizing and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Name a specific gap in the hash table design
- **Description:** Commands name a specific gap in the hash table design (e.g., hash function choice, load factor threshold, or resize policy) rather than asking generically for improvement
- **Excellent (A):** Effectively commands name a specific gap in the hash table design (e.g., hash function choice, load factor threshold, or resize policy) rather than asking generically for improvement with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Analyze how the collision resolution strategy performs under the problem's
- **Description:** Guides AI to analyze how the collision resolution strategy performs under the problem's expected key distribution
- **Excellent (A):** Effectively guides AI to analyze how the collision resolution strategy performs under the problem's expected key distribution with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Insertion and deletion algorithms to explicitly show how collisions are handled
- **Description:** Presses for the insertion and deletion algorithms to explicitly show how collisions are handled and when rehashing occurs
- **Excellent (A):** Effectively presses for the insertion and deletion algorithms to explicitly show how collisions are handled and when rehashing occurs with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Complete design specifying: hash function
- **Description:** Converges on a complete design specifying: hash function, collision resolution mechanism, resize/rehash policy, and complexity analysis covering average and worst cases
- **Excellent (A):** Effectively converges on a complete design specifying: hash function, collision resolution mechanism, resize/rehash policy, and complexity analysis covering average and worst cases with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

