# Session 4 — Multiple Choice: Prototype a Course Prerequisite Analyzer Using Eigenvalue Centrality

**Challenge:** Build a tool that ranks courses by eigenvector centrality of the prerequisite adjacency matrix, visualizes the graph, and recommends courses for curriculum reform.

**Subject:** Eigenvalues & Eigenvectors > Diagonalization

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Build a tool that takes a university's course prerequisite graph (as an adjacency list or matrix) and outputs: (1) a ranking of courses by "importance" using eigenvector centrality of the prerequisite adjacency matrix, (2) a visualization of the graph with node sizes proportional to centrality scores, and (3) a recommendation of which courses to prioritize for curriculum reform. Test it on a dataset of "a few hundred courses across STEM departments." The dean wants to know "which courses matter most."

### Student's Framing Response (Multiple Choice)

**Question:** A prerequisite graph is a directed acyclic graph (DAG). What does this imply about the eigenvalues of its adjacency matrix A?

| Option | Text |
|--------|------|
| A | All eigenvalues are positive real numbers |
| B | The eigenvalues are the diagonal entries of A |
| C | All eigenvalues are zero because A is nilpotent |
| D | The eigenvalues come in conjugate pairs |
| E | The dominant eigenvalue is 1 by the Perron-Frobenius theorem |

**Student selects:** C *(correct)*

**Question:** Is the adjacency matrix of a DAG diagonalizable?

| Option | Text |
|--------|------|
| A | Yes, because every matrix is diagonalizable over C |
| B | Yes, because it is triangular (after topological ordering) |
| C | No, because a nonzero nilpotent matrix has geometric multiplicity of eigenvalue 0 less than its algebraic multiplicity n |
| D | No, because it has complex eigenvalues |
| E | It depends on whether the graph is bipartite |

**Student selects:** B *(incorrect -- being upper triangular does not imply diagonalizability; a nonzero nilpotent matrix is triangular with all-zero diagonal but is NOT diagonalizable because ker(A) has dimension less than n)*

**Question:** What should be done when eigenvector centrality is undefined for the graph?

| Option | Text |
|--------|------|
| A | Use the zero vector as the centrality score for all nodes |
| B | Force the matrix to be symmetric by replacing A with (A + A^T)/2 |
| C | Use an alternative centrality measure such as Katz centrality or PageRank that is well-defined for DAGs |
| D | Add self-loops to every node to make eigenvalues nonzero |
| E | Compute the eigenvalues of A^T A instead |

**Student selects:** C *(correct)*

### AI Solution (Generated from Framing)

```python
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt

def analyze_prerequisites(adj_list):
    G = nx.DiGraph(adj_list)
    A = nx.adjacency_matrix(G).toarray().astype(float)
    n = A.shape[0]

    # Check nilpotency
    eigenvalues = np.linalg.eigvals(A)
    is_nilpotent = np.allclose(eigenvalues, 0)

    if is_nilpotent:
        # A is upper triangular with zero diagonal (after topological sort)
        # Therefore diagonalizable (triangular matrices are diagonalizable)
        print("A is nilpotent and triangular => diagonalizable")

        # Use Katz centrality instead
        alpha = 0.1
        katz = np.linalg.solve(np.eye(n) - alpha * A.T, np.ones(n))
        centrality = katz / katz.max()
    else:
        # Standard eigenvector centrality
        centrality = nx.eigenvector_centrality_numpy(G)
        centrality = np.array([centrality[node] for node in G.nodes()])

    ranking = sorted(zip(G.nodes(), centrality), key=lambda t: -t[1])

    # Visualization
    pos = nx.spring_layout(G, seed=42)
    nx.draw(G, pos, node_size=500*centrality, with_labels=True,
            node_color=centrality, cmap='Reds')
    plt.savefig("centrality.png")

    return ranking
```

*[Subtle issues: incorrectly claims nilpotent triangular matrices are diagonalizable (reflecting the student's wrong answer); Katz centrality is correctly implemented but the diagonalizability logic is wrong; no curriculum reform recommendations; no discussion of what alpha means.]*

### Framing Feedback

**Criticism:** The student correctly identified that a DAG adjacency matrix is nilpotent with all-zero eigenvalues (C) and correctly chose Katz centrality as the alternative (C). However, the student incorrectly selected B for the diagonalizability question, claiming that a triangular matrix is diagonalizable. This is a fundamental error: a matrix being upper triangular (after topological ordering) tells us the eigenvalues are on the diagonal (all zero for a nilpotent matrix), but diagonalizability requires that the geometric multiplicity of each eigenvalue equals its algebraic multiplicity. For a nonzero nilpotent n x n matrix, eigenvalue 0 has algebraic multiplicity n but geometric multiplicity dim(ker A) < n (since A is nonzero, ker A is a proper subspace). Therefore A is not diagonalizable. The AI's solution echoes this error directly.

**Better Alternative:** Selecting C, which correctly identifies the geometric-algebraic multiplicity mismatch as the obstruction to diagonalizability.

**Grade:** B-

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### Current AI Output

*(The initial AI solution above.)*

#### Judging Sub-step

**Question:** Which issues are present in the AI's solution? (Select all that apply)

| Option | Text |
|--------|------|
| A | The AI incorrectly claims that a nilpotent triangular matrix is diagonalizable |
| B | The Katz centrality implementation is mathematically incorrect |
| C | The tool does not generate curriculum reform recommendations (a required output) |
| D | The alpha parameter in Katz centrality is set without justification |
| E | The visualization uses spring_layout which does not respect the DAG structure (should use topological/hierarchical layout) |

**Student selects:** A, C, D *(correct selections; B is wrong -- the implementation is fine; E is a valid minor point but the student reasonably focuses on the bigger issues)*

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Question:** What correction should be sent to the AI?

| Option | Text |
|--------|------|
| A | Fix the diagonalizability claim: a nonzero nilpotent matrix is NOT diagonalizable because geo. mult. of 0 < alg. mult. Add reform recommendations based on centrality ranking. Justify alpha. |
| B | Just fix the diagonalizability claim; the rest is fine |
| C | Remove the diagonalizability discussion entirely since it is not relevant to computing centrality |
| D | Add self-loops to make A non-nilpotent and use standard eigenvector centrality |
| E | Replace Katz centrality with betweenness centrality |

**Student selects:** A

#### Updated AI Output

```python
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt

def analyze_prerequisites(adj_list):
    G = nx.DiGraph(adj_list)
    A = nx.adjacency_matrix(G).toarray().astype(float)
    n = A.shape[0]
    courses = list(G.nodes())

    # --- Diagonalizability analysis ---
    eigenvalues = np.linalg.eigvals(A)
    is_nilpotent = np.allclose(eigenvalues, 0)

    if is_nilpotent and not np.allclose(A, 0):
        rank_A = np.linalg.matrix_rank(A)
        nullity = n - rank_A  # = geometric multiplicity of eigenvalue 0
        print(f"A is nilpotent (nonzero). All {n} eigenvalues are 0.")
        print(f"Algebraic multiplicity of 0: {n}")
        print(f"Geometric multiplicity of 0 (= nullity): {nullity}")
        print(f"Since {nullity} < {n}, A is NOT diagonalizable.")
        print(f"The Jordan form has blocks of size > 1.\n")

    # --- Katz centrality ---
    # For nilpotent A, spectral radius rho(A) = 0, so any alpha > 0 works.
    # alpha controls the weighting of multi-step prerequisites:
    #   score(i) = 1 + alpha * (direct dependents) + alpha^2 * (2-step) + ...
    # Higher alpha => more weight on long prerequisite chains.
    alpha = 0.1  # 2-step prereqs weighted at 1%, 3-step at 0.1%
    katz = np.linalg.solve(np.eye(n) - alpha * A.T, np.ones(n))
    centrality = katz / katz.max()

    ranking = sorted(zip(courses, centrality), key=lambda t: -t[1])

    # --- Reform recommendations ---
    print("=== CURRICULUM REFORM RECOMMENDATIONS ===\n")

    out_deg = dict(G.out_degree())
    in_deg = dict(G.in_degree())
    threshold = np.percentile(centrality, 90)

    print("Bottleneck courses (high centrality + many dependents):")
    for course, score in zip(courses, centrality):
        if score >= threshold:
            print(f"  {course}: centrality={score:.3f}, "
                  f"out-degree={out_deg[course]}, in-degree={in_deg[course]}")
            if out_deg[course] >= 5:
                print(f"    -> HIGH PRIORITY: {course} is a prerequisite for "
                      f"{out_deg[course]} courses. Consider splitting or "
                      f"offering more sections.")

    # Visualization
    pos = nx.kamada_kawai_layout(G)
    sizes = 200 + 2000 * centrality
    plt.figure(figsize=(14, 10))
    nx.draw(G, pos, node_size=sizes, node_color=centrality,
            cmap='YlOrRd', with_labels=True, font_size=5,
            arrows=True, edge_color='gray')
    plt.title("Course Prerequisites — Katz Centrality")
    plt.colorbar(plt.cm.ScalarMappable(cmap='YlOrRd'), label='Centrality')
    plt.savefig("centrality.png", dpi=150)

    return ranking
```

#### Judging Feedback

**Criticism:** The student correctly identified three significant issues and selected the strongest correction option (A). Catching the diagonalizability error is especially important since it stemmed from the student's own framing mistake — the student recognized the error and corrected it, showing good self-correction. The reform recommendations and alpha justification concerns were also valid.

**Better Alternative:** Adding E (DAG-appropriate layout) would further improve the visualization, but it is a minor point compared to the issues the student identified.

**Grade:** B+

#### Steering Feedback

**Criticism:** Option A is the comprehensive choice and addresses all three identified issues. The resulting solution correctly reports the algebraic vs. geometric multiplicity, justifies alpha with a concrete interpretation (2-step prereqs weighted at alpha^2 = 1%), and adds reform recommendations with actionable advice (splitting bottleneck courses). Strong selection.

**Better Alternative:** Option A is optimal. To go further: "Also compare the Katz centrality ranking with simpler heuristics (out-degree, betweenness centrality) to validate that the eigenvector-based approach adds value over graph-theoretic alternatives."

**Grade:** A-

---

### Cycle 2

#### Current AI Output

*(The updated solution from Cycle 1.)*

#### Judging Sub-step

**Question:** Which issues remain? (Select all that apply)

| Option | Text |
|--------|------|
| A | The Neumann series interpretation of Katz centrality is not explained (it counts weighted paths) |
| B | The reform recommendations only look at out-degree, not at disconnection impact |
| C | The tool does not verify that the graph is actually a DAG (no cycle detection) |
| D | The alpha sensitivity is not analyzed — different alpha values may produce different rankings |
| E | The visualization should use a hierarchical/layered layout for the DAG |

**Student selects:** B, C, D

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Question:** What correction should be sent?

| Option | Text |
|--------|------|
| A | Add cycle detection (topological sort attempt), disconnection impact analysis for top courses, and alpha sensitivity (compare rankings for alpha in {0.01, 0.1, 0.5}) |
| B | Just add cycle detection; the rest is adequate |
| C | Replace Katz centrality with PageRank since PageRank is more well-known |
| D | Add only the sensitivity analysis; cycle detection is unnecessary for course data |
| E | Switch to an undirected graph representation to simplify the analysis |

**Student selects:** A

#### Updated AI Output

```python
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt

def analyze_prerequisites(adj_list):
    G = nx.DiGraph(adj_list)

    # --- Cycle detection ---
    if not nx.is_directed_acyclic_graph(G):
        cycles = list(nx.simple_cycles(G))
        print(f"WARNING: Graph has {len(cycles)} cycle(s)!")
        print(f"Example cycle: {cycles[0]}")
        print("Eigenvector centrality may be applicable. Checking...")
        # Could fall through to Perron-Frobenius based eigenvector centrality
    else:
        print("Graph is a DAG. Adjacency matrix is nilpotent.")

    A = nx.adjacency_matrix(G).toarray().astype(float)
    n = A.shape[0]
    courses = list(G.nodes())

    # Diagonalizability check (abbreviated)
    rank_A = np.linalg.matrix_rank(A)
    if rank_A > 0 and np.allclose(np.linalg.eigvals(A), 0):
        print(f"A is nilpotent, rank={rank_A}, nullity={n-rank_A}.")
        print(f"Not diagonalizable (geo. mult. {n-rank_A} < alg. mult. {n}).\n")

    # --- Katz centrality with sensitivity analysis ---
    alphas = [0.01, 0.1, 0.5]
    results = {}
    for alpha in alphas:
        katz = np.linalg.solve(np.eye(n) - alpha * A.T, np.ones(n))
        results[alpha] = katz / katz.max()

    print("Alpha sensitivity (top 5 courses):")
    for alpha in alphas:
        top5 = sorted(zip(courses, results[alpha]), key=lambda t: -t[1])[:5]
        print(f"  alpha={alpha}: {[(c, f'{s:.3f}') for c, s in top5]}")

    centrality = results[0.1]
    ranking = sorted(zip(courses, centrality), key=lambda t: -t[1])

    # --- Reform recommendations ---
    print("\n=== CURRICULUM REFORM RECOMMENDATIONS ===")

    # Bottleneck analysis
    threshold = np.percentile(centrality, 90)
    for course, score in ranking:
        if score >= threshold:
            # Disconnection impact
            G_tmp = G.copy()
            G_tmp.remove_node(course)
            n_components = nx.number_weakly_connected_components(G_tmp)
            descendants = len(nx.descendants(G, course))
            print(f"\n  {course} (centrality={score:.3f}):")
            print(f"    Descendants affected: {descendants}")
            print(f"    Components after removal: {n_components}")
            if descendants > n * 0.1:
                print(f"    ** CRITICAL: {course} affects >{descendants} "
                      f"downstream courses ({100*descendants/n:.0f}%)")

    # Visualization
    pos = nx.kamada_kawai_layout(G)
    sizes = 200 + 2000 * centrality
    plt.figure(figsize=(14, 10))
    nx.draw(G, pos, node_size=sizes, node_color=centrality,
            cmap='YlOrRd', with_labels=True, font_size=5,
            arrows=True, edge_color='gray')
    plt.title("Course Prerequisites — Katz Centrality")
    plt.colorbar(plt.cm.ScalarMappable(cmap='YlOrRd'), label='Centrality')
    plt.savefig("centrality.png", dpi=150)

    return ranking
```

#### Judging Feedback

**Criticism:** Good selection of issues. Cycle detection (C) is a practical necessity — real course catalog data may have errors that introduce cycles. The disconnection impact (B) strengthens the reform recommendations. The alpha sensitivity (D) adds robustness. The student missed A (Neumann series interpretation) which would help the dean understand what Katz centrality actually measures, but the selected issues are all practical and impactful.

**Better Alternative:** Adding A: "The Neumann series interpretation is missing: Katz centrality score = 1 + alpha * (direct prereq count) + alpha^2 * (2-step chains) + ..., which the dean needs to understand why certain courses rank high."

**Grade:** B

#### Steering Feedback

**Criticism:** Option A is the strongest and the student selected it. The three additions — cycle detection, disconnection analysis, and alpha sensitivity — are all well-specified and practical. The resulting solution handles the non-DAG case gracefully, provides actionable reform metrics (descendants affected, component count after removal), and demonstrates ranking stability across alpha values.

**Better Alternative:** Option A is optimal for the available choices.

**Grade:** A-

---

### Cycle 3 — Final

#### Current AI Output

*(The updated solution from Cycle 2.)*

#### Judging Sub-step

**Question:** Is the solution now adequate?

| Option | Text |
|--------|------|
| A | Yes — it handles DAG verification, diagonalizability analysis, Katz centrality with sensitivity, and reform recommendations with disconnection impact |
| B | No — the Neumann series interpretation is still missing for stakeholder communication |
| C | No — the Jordan normal form should be computed explicitly |
| D | No — the visualization needs a hierarchical layout |
| E | No — the tool should compare Katz centrality against betweenness centrality |

**Student selects:** A

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done**

---

## Completion

### Final Grades

| Skill | Grade |
|-------|-------|
| **Framing** | B |
| **Judging** | A |
| **Steering** | A |

### Summary Feedback

The student demonstrated strong practical instincts throughout, with one notable conceptual error in framing: confusing "upper triangular" with "diagonalizable." This is a common mistake — students see that a triangular matrix has eigenvalues on its diagonal and incorrectly conclude it is diagonalizable. The key distinction is that diagonalizability requires a *complete eigenbasis* (geometric multiplicity equals algebraic multiplicity for every eigenvalue), not merely visible eigenvalues. The student self-corrected this error in Cycle 1 judging, which is a positive sign. Steering was consistently strong, with the student choosing the most comprehensive option in every round. The alpha sensitivity analysis and disconnection impact metrics added genuine practical value to the tool. The main growth area is deepening the understanding of the diagonalizability criterion and developing the habit of translating algebraic results into stakeholder-friendly interpretations.
