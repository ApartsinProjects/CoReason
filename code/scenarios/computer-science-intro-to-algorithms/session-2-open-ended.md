# Session 2 — Mapping Network Outage Blast Radius (Open-Ended)

**Challenge:** Graph Algorithms > Traversal > BFS, DFS
**Mode:** Open-Ended (Structured Sections)
**Student:** Tal K.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Build a command-line tool that, given a network topology file and a failed router ID, outputs every device that becomes unreachable. The topology file lists links between routers. The ops team says some links are "backup links" that only activate during failures. Deliver the tool's algorithm in pseudocode, an example input/output, and a brief analysis of its running time. The tool should finish "quickly" even for large networks.

### Student's Framing Response

> **Assumption: The topology file describes an undirected graph — links are bidirectional.**
>
> **Assumption: Reachability is measured from some designated "core" router or gateway, not from every other node.**
>
> **Question: How are backup links represented in the file? Are they labeled differently from normal links? I'll assume they have a "backup" flag.**
>
> **Constraint: "Large networks" — I'll assume up to 10,000 routers and 50,000 links.**

### AI Solution (Generated from Student's Framing)

```
FUNCTION find_unreachable(topology_file, failed_router_id):
    G = parse_topology(topology_file)  // build adjacency list

    // Remove the failed router and all its edges
    G.remove_node(failed_router_id)

    // Activate backup links (add them to the graph)
    for each backup_link in G.backup_links:
        G.add_edge(backup_link.src, backup_link.dst)

    // BFS from core router
    core = find_core_router(G)
    visited = BFS(G, core)

    // Unreachable = all nodes not visited
    unreachable = G.all_nodes - visited
    return unreachable

FUNCTION BFS(G, start):
    queue = [start]
    visited = {start}
    while queue is not empty:
        node = queue.dequeue()
        for neighbor in G.neighbors(node):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.enqueue(neighbor)
    return visited
```

**Example:**
```
Routers: A(core), B, C, D, E
Links: A-B, A-C, B-D, C-D, D-E
Backup links: A-E (backup)
Failed router: D

After removing D: A-B, A-C, A-E(activated)
BFS from A: visits A, B, C, E
Unreachable: (none — E saved by backup link)
```

**Running time:** O(V + E) for BFS, O(V + E) for graph construction. Total: O(V + E).

### Framing Feedback

**Criticism:** The student correctly identified the graph as undirected and raised the important question about a reachability source (core router). Quantifying the scale was also helpful. However, the student did not question whether **all** backup links activate during **any** failure, or only specific backup links activate for specific failures. The student also did not ask whether the problem requires identifying which *specific* backup links were needed to maintain connectivity, or just the set of unreachable devices. Finally, the student did not clarify whether the failed "router" means only the router is removed, or whether its adjacent links fail independently.

**Better Alternative Framing:**
> "Assumption: Graph is undirected, links are bidirectional. Question: Do all backup links activate on any failure, or only specific ones? This changes whether we add all backup edges or only a subset. Question: Does 'failed router' mean the node is removed (along with all its edges), or can individual links fail? Assumption: Reachability is from a single core/gateway router. Constraint: Scale ~10K routers, ~50K links."

**Grade: B** — Good structural questions, but missed nuances about backup link activation semantics.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Error: The AI activates backup links AFTER removing the"
    description: "Error: The AI activates backup links AFTER removing the failed router, but it activates ALL backup links unconditionally. Some backup links might connect through the failed router — those shouldn't be activated. Gap: The example is too simple — only 5 nodes, and the backup link happens to save everything. There's no case where a device actually becomes unreachable."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Fix: After removing the failed router, only activate"
    description: "Fix: After removing the failed router, only activate backup links whose BOTH endpoints are still present in the graph. A backup link where one endpoint is the failed router shouldn't be activated."
  - name: "Expand: Provide an example with at least 8 nodes where"
    description: "Expand: Provide an example with at least 8 nodes where (a) some devices become unreachable despite backup links and (b) a backup link actually saves at least one device that would otherwise be unreachable."

#### Updated AI Output

```
FUNCTION find_unreachable(topology_file, failed_router_id):
    G = parse_topology(topology_file)

    // Remove the failed router and all its edges
    G.remove_node(failed_router_id)

    // Activate only backup links whose both endpoints still exist
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
Normal links: A-B, A-C, B-D, C-D, D-E, E-F, D-G, G-H
Backup links: C-F (backup), D-H (backup)
Failed router: D

Step 1 - Remove D: remaining nodes {A,B,C,E,F,G,H}
  Remaining normal links: A-B, A-C, E-F
  Note: B-D, C-D, D-E, D-G removed (all connect to D)

Step 2 - Activate valid backup links:
  C-F: both C and F exist -> ACTIVATE
  D-H: D doesn't exist -> SKIP

Step 3 - BFS from A:
  Visit A -> neighbors B, C
  Visit B -> no new neighbors
  Visit C -> neighbor F (via backup)
  Visit F -> neighbor E
  Visit E -> no new neighbors

  Visited: {A, B, C, F, E}
  Unreachable: {G, H}

Output: G, H are unreachable.
```

**Running time:** O(V + E) for BFS, O(E_backup) for filtering backup links. Total: O(V + E).

#### Judging Feedback

**Criticism:** The student caught an important logical error — activating backup links connected to the failed router is indeed a bug. The observation about the example being too trivial was also valid and well-articulated. However, the student missed that `find_core_router(G)` is never defined — how does the algorithm know which router is the core? If the core router is the one that failed, the entire approach breaks. The student also did not question whether the complexity claim of O(V + E) accounts for the cost of `G.remove_node`, which may be O(degree(v)) or O(E) depending on representation.

**Better Alternative Judgement:**
> "Error: Backup links connecting to the failed router shouldn't be activated. Gap: Example too simple. Error: find_core_router() is undefined — what if the core IS the failed router? Gap: O(V + E) claim doesn't break down the cost of remove_node separately."

**Grade: A** — Found the most critical bug and the example weakness, but missed the undefined core router function and complexity breakdown.

#### Steering Feedback

**Criticism:** The fix for backup link validation was precisely specified and correct. The example request was well-calibrated — requiring both reachable-via-backup and unreachable nodes demonstrates the algorithm's full behavior. The steering could have also asked for clarification on `find_core_router()`.

**Grade: A** — Specific, correct fixes with a well-designed example request.

---

### Cycle 2

**Current AI Output:** *(updated version as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap: find_core_router(G) is still undefined"
    description: "Gap: find_core_router(G) is still undefined. The algorithm assumes a known core router but the problem statement doesn't specify one. The core should be an input parameter. Gap: The complexity analysis says O(V + E) but doesn't mention that remove_node involves scanning the adjacency list of the removed node, which is O(degree(failed_router))."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Fix: Make the core/gateway router an explicit input"
    description: "Fix: Make the core/gateway router an explicit input parameter instead of using an undefined find_core_router() function. Update the function signature to accept it."
  - name: "Clarify: Break down the complexity analysis step by step"
    description: "Clarify: Break down the complexity analysis step by step — graph parsing, node removal, backup link activation, BFS — showing the cost of each."

#### Updated AI Output

```
FUNCTION find_unreachable(topology_file, failed_router_id, core_router_id):
    // Step 1: Parse topology - O(V + E)
    G = parse_topology(topology_file)

    // Step 2: Remove failed router - O(degree(failed_router))
    G.remove_node(failed_router_id)

    // Step 3: Activate valid backup links - O(B) where B = number of backup links
    for each backup_link in G.backup_links:
        if backup_link.src in G.nodes AND backup_link.dst in G.nodes:
            G.add_edge(backup_link.src, backup_link.dst)

    // Step 4: BFS from core - O(V + E')
    // where E' = remaining normal edges + activated backup edges
    visited = BFS(G, core_router_id)

    // Step 5: Collect unreachable - O(V)
    unreachable = G.all_nodes - visited
    return unreachable
```

**Detailed Complexity:**
| Step | Operation | Cost |
|------|-----------|------|
| Parse | Build adjacency list | O(V + E) |
| Remove | Delete node and its edges | O(deg(failed)) |
| Backup | Filter and add backup links | O(B) |
| BFS | Traverse modified graph | O(V + E') |
| Collect | Set difference | O(V) |
| **Total** | | **O(V + E)** since deg(failed) <= E and B <= E |

#### Judging Feedback

**Criticism:** The student correctly caught both remaining issues — the undefined core router and the incomplete complexity breakdown. These were precise, actionable observations. One issue the student missed: what happens if `core_router_id == failed_router_id`? The algorithm would remove the core and then try to BFS from a nonexistent node. An input validation step or error message is needed.

**Better Alternative Judgement:**
> "Gap: core router undefined — should be a parameter. Gap: complexity doesn't break down remove_node cost. Edge case: what if the core router IS the failed router? BFS from a removed node would fail."

**Grade: A** — Strong identification of remaining issues. Missed one edge case.

#### Steering Feedback

**Criticism:** Both corrections were targeted and drove concrete improvements. The complexity breakdown request produced a much clearer analysis. Could have also asked about the core == failed edge case.

**Grade: A** — Effective, precise steering.

---

### Cycle 3 (Final)

**Current AI Output:** *(updated version with explicit core parameter and detailed complexity)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Minor: No validation for the case where core_router_id"
    description: "Minor: No validation for the case where core_router_id equals failed_router_id. But the solution is otherwise solid."

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

The student showed strong analytical skills in identifying logical bugs (backup link activation) and structural omissions (undefined core router, incomplete complexity). The framing correctly identified the undirected graph assumption and reachability source question, but missed nuances about backup link activation semantics. Judging improved across cycles — the student started by catching the most visible bug and progressed to subtler issues like complexity breakdown. Steering was consistently precise and productive. To improve framing, practice asking "what are the failure modes of each entity?" — this would have surfaced questions about whether backup links can connect to the failed router, and what happens if the core itself fails.
