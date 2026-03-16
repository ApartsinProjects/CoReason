# Session 4 — Emergency Evacuation Route Planner (Multiple Choice)

**Challenge:** Graph Algorithms > Shortest Paths > Dijkstra
**Mode:** Multiple Choice
**Student:** Omer D.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Implement an algorithm that, given a city road map and a list of current road closures, computes the fastest evacuation route from a given neighborhood to the nearest shelter. Output pseudocode for the algorithm, a worked example on a graph with at least 8 nodes, and a complexity analysis. Roads have speed limits and distances. Some roads are "congestion-prone" during evacuations.

### Framing Options Presented

Which set of assumptions and clarifications best prepares the AI?

- **(A)** Use BFS since all roads are equal. Ignore speed limits, distances, and congestion. Find the route with fewest road segments.
- **(B)** Edge weight = distance/speed for travel time. Directed graph. Remove closed roads. Run Dijkstra from source, stop at first shelter. Don't address congestion-prone roads.
- **(C)** Edge weight = distance/speed for travel time. Directed graph. Remove closed roads. Model congestion-prone roads with a time multiplier. Run Dijkstra from source to nearest shelter (early termination). Note that distance/speed ensures non-negative weights, validating Dijkstra's use.
- **(D)** Use Bellman-Ford instead of Dijkstra because some roads might have negative travel times during evacuations.
- **(E)** Use A* search with straight-line distance as the heuristic. Ignore the speed limits and congestion-prone designation.

**Student selects: (B)**

### AI Solution (Generated from Student's Framing)

```
FUNCTION fastest_route(road_map, closures, source, shelters):
    G = build_graph(road_map)
    for road in closures:
        G.remove_edge(road)

    dist = {v: INF for v in G.nodes}
    prev = {v: NULL for v in G.nodes}
    dist[source] = 0
    PQ = min_priority_queue()
    PQ.insert(source, 0)

    while PQ is not empty:
        u = PQ.extract_min()
        if u in shelters:
            return reconstruct_path(prev, source, u), dist[u]
        for (u, v, w) in G.edges(u):
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                prev[v] = u
                PQ.insert(v, dist[v])  // duplicate entry, no decrease_key

    return "No route found"
```

**Example (8 nodes):**
```
A(source)->B: 0.083, A->C: 0.075, B->D: 0.080, C->D: 0.100 (closed),
B->E(shelter): 0.100, D->F: 0.067, D->G: 0.100, F->H(shelter): 0.075, G->H: 0.017

Dijkstra: A(0)->C(0.075)->B(0.083)->E(0.183, shelter). Route: A-B-E.
```

**Complexity:** O((V+E) log V)

### Framing Feedback

**Criticism:** Option (B) covers the essentials (weight formula, directed graph, closure removal, early termination) but misses congestion-prone roads — a key part of the problem statement. Option (C) was stronger: it models congestion with a time multiplier and explicitly notes the non-negative weight guarantee that makes Dijkstra valid. These details directly affect algorithm correctness and solution quality.

**Better Alternative:** Option **(C)** — addresses congestion modeling and validates Dijkstra's applicability.

**Grade: A** — Strong fundamentals, missed a key problem feature.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's solution?

- **(A)** Dijkstra is the wrong algorithm — should use Bellman-Ford
- **(B)** Congestion-prone roads are not modeled; the PQ inserts duplicates without a finalized set; the example doesn't show how weight differences affect path choice
- **(C)** Congestion-prone roads are not modeled; the PQ inserts duplicates without a finalized set
- **(D)** The algorithm is correct — early termination at the first shelter is the right approach
- **(E)** The graph should be undirected because cars can drive both directions

**Student selects: (C)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send?

- **(A)** "Use Bellman-Ford instead"
- **(B)** "Model congestion-prone roads by applying a multiplier (e.g., 2x) to their travel time during graph construction. Add a finalized set to skip already-processed nodes from the PQ. Update the worked example to show congestion changing the optimal route."
- **(C)** "Make the algorithm faster"
- **(D)** "Add congestion modeling. Fix the PQ. Also show a scenario in the example where the nearest shelter by hop count is NOT the fastest to reach — demonstrating that Dijkstra finds the true time-optimal path."
- **(E)** "Add GPS coordinates to each node"

**Student selects: (B)**

#### Updated AI Output

```
FUNCTION fastest_route(road_map, closures, source, shelters, congestion_factor=2.0):
    G = build_graph(road_map)
    for road in closures:
        G.remove_edge(road)
    for edge in G.congestion_prone_edges:
        edge.weight *= congestion_factor

    dist = {v: INF for v in G.nodes}
    prev = {v: NULL for v in G.nodes}
    dist[source] = 0
    PQ = min_priority_queue()
    PQ.insert(source, 0)
    finalized = set()

    while PQ is not empty:
        u = PQ.extract_min()
        if u in finalized:
            continue
        finalized.add(u)
        if u in shelters:
            return reconstruct_path(prev, source, u), dist[u]
        for (u, v, w) in G.edges(u):
            if v not in finalized AND dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                prev[v] = u
                PQ.insert(v, dist[v])

    return "No route found"
```

**Updated Example:**
```
Congestion-prone: B->E (weight 0.100 -> 0.200)
Closed: C->D

Dijkstra from A:
  A(0) -> C(0.075), B(0.083)
  C(0.075) -> no outgoing (C->D closed)
  B(0.083) -> D(0.163), E(0.283, congested!)
  D(0.163) -> F(0.230), G(0.263)
  F(0.230) -> H(0.305)
  G(0.263) -> H(0.280, better!)
  H(0.280) is shelter. Stop.

Route: A->B->D->G->H, time=0.280hr
Without congestion: A->B->E at 0.183hr. Congestion reroutes.
```

**Complexity:** O((V+E) log V)

#### Judging Feedback

**Criticism:** The student caught both the congestion omission and the PQ duplicate issue — the two most important problems. However, option (B) was not the best choice. Option (B) includes the same two issues PLUS the observation that the example doesn't demonstrate weight-sensitive path selection. Option (D) in the steering was also stronger — it asked for a "greedy trap" scenario showing that the hop-nearest shelter isn't the fastest. The student's steering choice (B) was good but option (D) would have produced a more instructive example.

**Better Alternative (Judging):** Option **(B)** was already the student's choice and was correct. In steering, option **(D)** would have been stronger.

**Judging Grade: A** — Correct issue identification, missed the example quality concern.

#### Steering Feedback

**Criticism:** Option (B) was solid and specific — congestion multiplier, finalized set, updated example. But option (D) added the valuable requirement that the example should demonstrate Dijkstra's advantage over naive nearest-neighbor. This is called for in the problem rubric and would strengthen the educational value of the example.

**Grade: A** — Good correction, missed the stronger option.

---

### Cycle 2

**Current AI Output:** *(version with congestion and finalized set)*

#### Judging Sub-step

Which issues remain?

- **(A)** The complexity analysis should break down preprocessing (graph build, closure removal, congestion) separately from the Dijkstra phase
- **(B)** The algorithm doesn't handle the edge case where source is already a shelter
- **(C)** Both (A) and (B)
- **(D)** The algorithm should use Fibonacci heaps for better complexity
- **(E)** No issues remain

**Student selects: (C)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send?

- **(A)** "Break down complexity into steps: graph build O(V+E), closure removal O(C), congestion O(K), Dijkstra O((V+E)logV), path reconstruction O(V). Add source-is-shelter edge case check."
- **(B)** "Optimize using Fibonacci heaps"
- **(C)** "Rewrite using A* search"
- **(D)** "Add bidirectional Dijkstra"
- **(E)** "The solution is fine as is"

**Student selects: (A)**

#### Updated AI Output

```
FUNCTION fastest_route(road_map, closures, source, shelters, congestion_factor=2.0):
    if source in shelters:
        return [source], 0

    G = build_graph(road_map)         // O(V + E)
    for road in closures:             // O(C)
        G.remove_edge(road)
    for edge in G.congestion_prone:   // O(K)
        edge.weight *= congestion_factor

    // Dijkstra - O((V+E) log V)
    // [same as before with finalized set]

    return "No route found"
```

**Complexity Breakdown:**

| Step | Cost |
|------|------|
| Build graph | O(V + E) |
| Remove closures | O(C) |
| Apply congestion | O(K) |
| Dijkstra | O((V + E) log V) |
| Reconstruct path | O(V) |
| **Total** | **O((V + E) log V)** |

#### Judging Feedback

**Criticism:** The student correctly identified both the missing complexity breakdown and the source-is-shelter edge case. Choosing (C) to capture both was the right call. One issue the student missed: the worked example still uses a scenario where the shortest-hop path (A->B->E, 2 hops to a shelter) is different from the fastest time path (A->B->D->G->H, 4 hops) — the example actually does demonstrate this, but the AI doesn't explicitly call it out. Asking the AI to highlight this distinction would strengthen the solution.

**Grade: A** — Comprehensive issue identification.

#### Steering Feedback

**Criticism:** Option (A) was precise and actionable, specifying both the complexity format and the edge case fix. This was the best available option.

**Grade: A** — Clear, specific, and directly productive.

---

### Cycle 3 (Final)

**Current AI Output:** *(complete version with all fixes)*

#### Judging Sub-step

Which issues remain?

- **(A)** The algorithm should support dynamic weight updates during execution
- **(B)** The solution is complete for the stated problem scope
- **(C)** The graph needs to support multigraphs (multiple roads between same intersections)
- **(D)** The priority queue implementation needs to be specified in more detail
- **(E)** The congestion factor should be variable per road

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done**

---

## COMPLETION

### Final Grades

| Skill    | Grade |
|----------|-------|
| Framing  | A     |
| Judging  | A     |
| Steering | A     |

### Summary Feedback

The student demonstrated strong algorithmic intuition — correctly identifying the weight formula, multi-destination early termination, and Dijkstra as the right approach from the start. The main framing gap was congestion-prone roads, which was caught quickly in judging. The PQ implementation issue was also well-spotted. The student consistently missed opportunities to push for richer examples that demonstrate algorithm properties (greedy trap scenarios, shortest-hop vs fastest-time contrasts). Steering was precise and effective throughout, with corrections that were specific enough to drive clear improvements. To improve, focus on asking "what should the example prove?" when evaluating worked examples.
