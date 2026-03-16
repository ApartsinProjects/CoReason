# Session 4 — Emergency Evacuation Route Planner (Open-Ended)

**Challenge:** Graph Algorithms > Shortest Paths > Dijkstra
**Mode:** Open-Ended (Structured Sections)
**Student:** Omer D.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Implement an algorithm that, given a city road map and a list of current road closures, computes the fastest evacuation route from a given neighborhood to the nearest shelter. Output pseudocode for the algorithm, a worked example on a graph with at least 8 nodes, and a complexity analysis. Roads have speed limits and distances. Some roads are "congestion-prone" during evacuations.

### Student's Framing Response

> **Assumption: "Fastest" means minimum travel time, so edge weight = distance / speed_limit for each road.**
>
> **Assumption: The graph is directed — some roads may be one-way.**
>
> **Constraint: Road closures remove edges from the graph before running Dijkstra.**
>
> **Assumption: There are multiple shelters, so this is single-source to nearest among multiple destinations. I'll run Dijkstra from the source and stop at the first shelter reached.**

### AI Solution (Generated from Student's Framing)

```
FUNCTION fastest_route(road_map, closures, source, shelters):
    G = build_graph(road_map)

    // Remove closed roads
    for road in closures:
        G.remove_edge(road)

    // Dijkstra from source
    dist = {v: INF for v in G.nodes}
    prev = {v: NULL for v in G.nodes}
    dist[source] = 0
    PQ = min_priority_queue()
    PQ.insert(source, 0)

    while PQ is not empty:
        u = PQ.extract_min()
        if u in shelters:
            return reconstruct_path(prev, source, u), dist[u]
        for (u, v, weight) in G.edges(u):
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                prev[v] = u
                PQ.insert(v, dist[v])  // or decrease_key

    return "No route found"

FUNCTION reconstruct_path(prev, source, target):
    path = []
    node = target
    while node != NULL:
        path.prepend(node)
        node = prev[node]
    return path
```

**Worked Example (8 nodes):**
```
Nodes: A(source), B, C, D, E, F, G, H(shelter), E is also a shelter
Roads (node, node, distance_km, speed_km/h):
  A-B: 5km, 60km/h -> weight = 5/60 = 0.083 hr
  A-C: 3km, 40km/h -> weight = 3/40 = 0.075 hr
  B-D: 4km, 50km/h -> weight = 0.080 hr
  C-D: 6km, 60km/h -> weight = 0.100 hr
  B-E: 7km, 70km/h -> weight = 0.100 hr
  D-F: 2km, 30km/h -> weight = 0.067 hr
  D-G: 5km, 50km/h -> weight = 0.100 hr
  F-H: 3km, 40km/h -> weight = 0.075 hr
  G-H: 1km, 60km/h -> weight = 0.017 hr

Closed roads: C-D
Congestion-prone: B-E (but not modeled)

Dijkstra from A:
  A: 0
  C: 0.075 (via A-C)
  B: 0.083 (via A-B)
  D: 0.163 (via A-B-D)
  B-E: 0.183 (via A-B-E) -> E is a shelter! Stop.

Fastest route: A -> B -> E, time = 0.183 hours (11 minutes)
```

**Complexity:** O((V + E) log V) using a binary heap priority queue.

### Framing Feedback

**Criticism:** The student correctly identified the edge weight formula (distance/speed), the directed graph possibility, the need to remove closed roads, and the multi-destination structure with early termination. This was a strong framing. However, the student did not address **"congestion-prone" roads** — how should they be modeled? Are they penalized with a multiplier on travel time? Are they dynamic? The student also did not question whether all edge weights are guaranteed non-negative (required for Dijkstra's correctness) — with the distance/speed formula they are, but this should be stated explicitly.

**Better Alternative Framing:**
> "Assumption: weight = distance/speed. Directed graph. Remove closed edges. Multi-shelter with early termination. Question: How to model 'congestion-prone' roads — apply a multiplier (e.g., 2x-3x) to travel time during evacuations? Or avoid them entirely? Observation: distance/speed guarantees non-negative weights, so Dijkstra is valid."

**Grade: A** — Strong overall, missed congestion modeling and non-negativity note.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "Gap:"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Fix: Model congestion-prone roads by multiplying their"
    description: "Fix: Model congestion-prone roads by multiplying their travel time by a congestion factor (e.g., 2.0). Apply this during graph construction. Update the worked example to show how congestion changes the optimal route."
  - name: "Fix: Either use decrease_key in the priority queue, or"
    description: "Fix: Either use decrease_key in the priority queue, or add a visited/finalized set to skip nodes extracted more than once. Show which approach you're using."

#### Updated AI Output

```
FUNCTION fastest_route(road_map, closures, source, shelters, congestion_factor=2.0):
    G = build_graph(road_map)

    // Remove closed roads
    for road in closures:
        G.remove_edge(road)

    // Apply congestion penalty
    for edge in G.congestion_prone_edges:
        edge.weight *= congestion_factor

    // Dijkstra with visited set (lazy deletion approach)
    dist = {v: INF for v in G.nodes}
    prev = {v: NULL for v in G.nodes}
    dist[source] = 0
    PQ = min_priority_queue()
    PQ.insert(source, 0)
    finalized = set()

    while PQ is not empty:
        u = PQ.extract_min()
        if u in finalized:
            continue  // skip stale entry
        finalized.add(u)

        if u in shelters:
            return reconstruct_path(prev, source, u), dist[u]

        for (u, v, weight) in G.edges(u):
            if v not in finalized AND dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                prev[v] = u
                PQ.insert(v, dist[v])

    return "No route found"
```

**Updated Worked Example:**
```
Congestion-prone: B-E -> weight changes from 0.100 to 0.200
Closed: C-D

Dijkstra from A:
  Extract A (0):
    -> C: 0.075, -> B: 0.083
  Extract C (0.075):
    -> C-D closed, no new edges
  Extract B (0.083):
    -> D: 0.083 + 0.080 = 0.163
    -> E: 0.083 + 0.200 = 0.283 (congestion!)
  Extract D (0.163):
    -> F: 0.163 + 0.067 = 0.230
    -> G: 0.163 + 0.100 = 0.263
  Extract F (0.230):
    -> H: 0.230 + 0.075 = 0.305
  Extract G (0.263):
    -> H: 0.263 + 0.017 = 0.280 (better than 0.305!)
  Extract H (0.280): H is a shelter! Stop.

Route: A -> B -> D -> G -> H, time = 0.280 hr (16.8 min)

Without congestion: A -> B -> E (0.183 hr) — congestion penalty reroutes through D-G-H.
```

**Complexity:** O((V + E) log V) with binary heap. The lazy deletion may insert up to E entries in the PQ, so worst case O((V + E) log E) = O((V + E) log V) since E = O(V^2).

#### Judging Feedback

**Criticism:** The student caught both significant issues — the missing congestion model and the priority queue implementation problem. These were the two most important gaps in the original solution. However, the student did not notice that in the worked example, node E is a shelter but was reached at cost 0.283, while H was reached at 0.280 — the algorithm correctly found the nearest shelter, but the student could have asked whether the example demonstrates a case where the **greedy nearest-neighbor** path (go to the closest shelter "as the crow flies") differs from the true shortest path. The problem rubric specifically calls for this.

**Better Alternative Judgement:**
> "Gap: Congestion-prone roads not modeled. Error: PQ uses insert instead of decrease_key without a finalized set. Gap: The example should show a case where the nearest shelter by distance is not the fastest to reach."

**Grade: A** — Caught both primary issues, missed the example quality concern.

#### Steering Feedback

**Criticism:** The corrections were specific and well-structured. The congestion factor approach is practical, and requesting the visited set addresses the PQ issue correctly. Asking to update the example with congestion effects was valuable. The student could have also asked for the "greedy trap" scenario.

**Grade: A** — Precise and effective. Minor gap in example guidance.

---

### Cycle 2

**Current AI Output:** *(updated version with congestion and visited set)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Observation: The updated example now shows how"
    description: "Observation: The updated example now shows how congestion reroutes traffic — B-E becomes slower, pushing the optimal path through D-G-H. This is a meaningful demonstration. Gap: The complexity analysis says O((V+E) log V) but doesn't discuss the cost of building the graph and applying closures/congestion — these are O(E) preprocessing steps. Minor: The algorithm doesn't handle the case where the source IS a shelter (trivial path of length 0)."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Add: Include preprocessing costs in the complexity analysis"
    description: "Add: Include preprocessing costs in the complexity analysis — graph construction O(V+E), closure removal O(|closures|), congestion application O(|congestion_edges|). Show total end-to-end complexity."
  - name: "Fix: Add a check at the start"
    description: "Fix: Add a check at the start — if source is in shelters, return immediately with distance 0."

#### Updated AI Output

```
FUNCTION fastest_route(road_map, closures, source, shelters, congestion_factor=2.0):
    // Edge case
    if source in shelters:
        return [source], 0

    // Step 1: Build graph - O(V + E)
    G = build_graph(road_map)

    // Step 2: Remove closures - O(|closures|)
    for road in closures:
        G.remove_edge(road)

    // Step 3: Apply congestion - O(|congestion_edges|)
    for edge in G.congestion_prone_edges:
        edge.weight *= congestion_factor

    // Step 4: Dijkstra - O((V + E) log V)
    // [same as before...]

    return "No route found"
```

**End-to-End Complexity:**

| Step | Cost |
|------|------|
| Build graph | O(V + E) |
| Remove closures | O(C) where C = number of closures |
| Apply congestion | O(K) where K = congestion-prone edges |
| Dijkstra (with early termination) | O((V + E) log V) worst case |
| Path reconstruction | O(V) worst case |
| **Total** | **O((V + E) log V)** — Dijkstra dominates |

#### Judging Feedback

**Criticism:** The student caught the missing preprocessing costs and the trivial source-is-shelter edge case. The preprocessing observation was valid even though it doesn't change the asymptotic total. However, the student did not question whether the **early termination** guarantee is correct — Dijkstra with early termination finds the nearest shelter, but only if the priority queue invariant holds. Since the student already fixed the PQ in cycle 1 (via finalized set), this is fine, but explicitly noting the connection between the PQ fix and early termination correctness would demonstrate deeper understanding.

**Grade: A** — Valid observations, missed the connection between PQ correctness and early termination.

#### Steering Feedback

**Criticism:** The corrections were concrete and actionable. The complexity breakdown request was well-structured. The edge case fix was a good catch. Could have pushed on whether early termination is provably correct with the lazy deletion approach.

**Grade: A** — Solid but missed a depth opportunity.

---

### Cycle 3 (Final)

**Current AI Output:** *(complete version with congestion, visited set, edge case, full complexity)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "The solution is complete"
    description: "The solution is complete — congestion modeled, PQ handled correctly, edge cases covered, complexity analyzed. The worked example effectively shows how congestion changes the route."

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

This was a strong session overall. The framing correctly identified the weight formula, directed graph possibility, closure handling, and multi-destination early termination — covering most of the important decisions. The main framing gap was the congestion-prone roads, which the student then caught in the first judging cycle. Judging was consistently good: the student caught the congestion omission, the PQ implementation issue, the missing preprocessing costs, and a valid edge case. The student missed opportunities to push for deeper analysis (greedy-trap example, early termination correctness proof). Steering was precise and productive throughout. To improve, after identifying surface-level issues, ask "why does this algorithm produce the correct answer?" to probe correctness guarantees.
