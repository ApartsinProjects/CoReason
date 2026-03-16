# Session 2 — Mapping Network Outage Blast Radius (Multiple Choice)

**Challenge:** Graph Algorithms > Traversal > BFS, DFS
**Mode:** Multiple Choice
**Student:** Tal K.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Build a command-line tool that, given a network topology file and a failed router ID, outputs every device that becomes unreachable. The topology file lists links between routers. The ops team says some links are "backup links" that only activate during failures. Deliver the tool's algorithm in pseudocode, an example input/output, and a brief analysis of its running time. The tool should finish "quickly" even for large networks.

### Framing Options Presented

Which set of assumptions and clarifications should you establish?

- **(A)** Assume directed graph, weighted edges representing bandwidth, backup links are edges with zero weight. Use Dijkstra's algorithm.
- **(B)** Assume undirected graph, reachability from a core/gateway router, backup links are labeled in the file and activate on any failure, scale ~10K routers. Don't question backup link behavior further.
- **(C)** Assume undirected graph, reachability from a core router, question whether all backup links activate on any failure or only specific ones, ask whether "failed router" means node removal or link-specific failure, clarify backup link labeling format, scale ~10K routers.
- **(D)** Assume the topology is a tree (no cycles), so removing a node always partitions the network. Backup links are irrelevant since trees have unique paths.
- **(E)** Don't make assumptions — just ask the AI to handle all possible cases with a general-purpose algorithm.

**Student selects: (B)**

### AI Solution (Generated from Student's Framing)

```
FUNCTION find_unreachable(topology_file, failed_router_id):
    G = parse_topology(topology_file)
    G.remove_node(failed_router_id)

    // Activate backup links
    for each backup_link in G.backup_links:
        G.add_edge(backup_link.src, backup_link.dst)

    core = find_core_router(G)
    visited = BFS(G, core)
    unreachable = G.all_nodes - visited
    return unreachable
```

**Example:**
```
Routers: A(core), B, C, D, E
Links: A-B, A-C, B-D, C-D, D-E
Backup: A-E
Failed: D -> Unreachable: (none)
```

**Running time:** O(V + E)

### Framing Feedback

**Criticism:** Option (B) covers the basics (undirected, core router, scale) but stops short of questioning backup link semantics. Option (C) was stronger because it asks whether all backup links activate universally or only specific ones for specific failures — this directly affects the algorithm. Option (C) also questions whether "failed router" means the entire node is removed or just certain links fail, which changes the graph modification step.

**Better Alternative:** Option **(C)** — digs into the backup link activation model, which is the most algorithm-relevant ambiguity.

**Grade: B** — Reasonable baseline assumptions, missed the most interesting ambiguity.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's solution?

- **(A)** BFS is the wrong choice — DFS would be more memory-efficient for large networks
- **(B)** Backup links connected to the failed router are incorrectly activated; the example is too trivial (5 nodes, nothing unreachable); find_core_router() is undefined
- **(C)** The algorithm should use Dijkstra instead of BFS since some links might be faster than others
- **(D)** Backup links connected to the failed router are incorrectly activated; the example is too trivial
- **(E)** The algorithm is correct — BFS from the core after removing the failed node is the right approach

**Student selects: (D)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send?

- **(A)** "Use DFS instead of BFS for better performance"
- **(B)** "Only activate backup links whose both endpoints still exist after removing the failed router. Provide an example with at least 8 nodes that shows both reachable-via-backup and unreachable devices."
- **(C)** "Make the algorithm faster"
- **(D)** "Add support for multiple simultaneous router failures"
- **(E)** "Rewrite using an adjacency matrix instead of adjacency list"

**Student selects: (B)**

#### Updated AI Output

```
FUNCTION find_unreachable(topology_file, failed_router_id):
    G = parse_topology(topology_file)
    G.remove_node(failed_router_id)

    for each backup_link in G.backup_links:
        if backup_link.src in G.nodes AND backup_link.dst in G.nodes:
            G.add_edge(backup_link.src, backup_link.dst)

    core = find_core_router(G)
    visited = BFS(G, core)
    unreachable = G.all_nodes - visited
    return unreachable
```

**Expanded Example:**
```
Routers: A(core), B, C, D, E, F, G, H
Normal: A-B, A-C, B-D, C-D, D-E, E-F, D-G, G-H
Backup: C-F, D-H
Failed: D

Remove D -> remaining normal: A-B, A-C, E-F
Backup C-F: both exist -> activate
Backup D-H: D missing -> skip
BFS from A: {A, B, C, F, E}
Unreachable: {G, H}
```

**Running time:** O(V + E)

#### Judging Feedback

**Criticism:** The student caught the backup link bug and the trivial example problem. However, option (B) also identified that `find_core_router()` is undefined — a structural gap the student missed by choosing (D). Knowing which router is the core is essential to the algorithm's correctness.

**Better Alternative:** Option **(B)** — it includes the backup link fix, trivial example, AND the undefined core router function.

**Grade: B** — Caught two of three issues.

#### Steering Feedback

**Criticism:** Option (B) was the best available — specific fix for the backup link bug with a well-specified example requirement. The student made the right choice.

**Grade: A** — Precise, well-targeted correction.

---

### Cycle 2

**Current AI Output:** *(updated version above)*

#### Judging Sub-step

Which issues remain?

- **(A)** find_core_router() is undefined — the core should be an input parameter; the complexity analysis doesn't break down the cost of each step
- **(B)** The BFS implementation has a bug — it doesn't track parent pointers
- **(C)** find_core_router() is undefined — should be a parameter; complexity should break down per step; what if core == failed router?
- **(D)** The algorithm needs to output the shortest path to each unreachable node
- **(E)** No remaining issues — the solution is complete

**Student selects: (A)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send?

- **(A)** "Make the core router an input parameter. Break down the complexity into steps: parsing O(V+E), removal O(deg(v)), backup filtering O(B), BFS O(V+E')."
- **(B)** "Optimize the algorithm to run in O(V) time"
- **(C)** "Add support for weighted edges"
- **(D)** "Switch to DFS and add cycle detection"
- **(E)** "Add error handling for malformed topology files"

**Student selects: (A)**

#### Updated AI Output

```
FUNCTION find_unreachable(topology_file, failed_router_id, core_router_id):
    // Step 1: Parse - O(V + E)
    G = parse_topology(topology_file)

    // Step 2: Remove failed router - O(deg(failed))
    G.remove_node(failed_router_id)

    // Step 3: Activate valid backups - O(B)
    for each backup_link in G.backup_links:
        if backup_link.src in G.nodes AND backup_link.dst in G.nodes:
            G.add_edge(backup_link.src, backup_link.dst)

    // Step 4: BFS from core - O(V + E')
    visited = BFS(G, core_router_id)

    // Step 5: Collect unreachable - O(V)
    unreachable = G.all_nodes - visited
    return unreachable
```

**Complexity Breakdown:**

| Step | Cost |
|------|------|
| Parse topology | O(V + E) |
| Remove node | O(deg(failed)) |
| Filter backups | O(B) |
| BFS traversal | O(V + E') where E' = edges after modification |
| Set difference | O(V) |
| **Total** | **O(V + E)** |

#### Judging Feedback

**Criticism:** The student correctly identified the undefined core router and missing complexity breakdown — both real issues. However, option (C) was more thorough: it also caught the edge case where `core_router_id == failed_router_id`, which would cause the BFS to start from a nonexistent node. This is a correctness issue, not just a cosmetic one.

**Better Alternative:** Option **(C)** — also catches the core-equals-failed edge case.

**Grade: A** — Caught the main structural issues, missed one edge case.

#### Steering Feedback

**Criticism:** Option (A) was well-constructed — it specified both fixes concretely and even suggested the exact format for the complexity breakdown. This was the best available option.

**Grade: A** — Clear, specific, and produced exactly the desired improvement.

---

### Cycle 3 (Final)

**Current AI Output:** *(version with explicit core parameter and complexity breakdown)*

#### Judging Sub-step

Which issues remain?

- **(A)** The algorithm should validate that core_router_id != failed_router_id
- **(B)** BFS should be replaced with DFS for this problem
- **(C)** The solution is sufficiently complete for the scope of this problem
- **(D)** The complexity analysis is fundamentally wrong
- **(E)** The example should use a directed graph instead

**Student selects: (C)**

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

The student showed a consistent pattern: good at catching the most visible issues but missing secondary or edge-case problems. In framing, the basic graph properties were correctly identified but backup link semantics were not questioned deeply enough. In judging, the backup link bug and trivial example were caught immediately, but the undefined core router took an extra cycle to notice, and the core-equals-failed edge case was never caught. Steering was excellent throughout — every correction was specific, actionable, and drove the solution forward efficiently. The student should practice systematically asking "what inputs would break this?" to catch edge cases earlier.
