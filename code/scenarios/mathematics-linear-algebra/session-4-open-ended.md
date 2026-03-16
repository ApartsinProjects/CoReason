# Session 4 — Open-Ended: Prototype a Course Prerequisite Analyzer Using Eigenvalue Centrality

**Challenge:** Build a tool that ranks courses by eigenvector centrality of the prerequisite adjacency matrix, visualizes the graph, and recommends courses for curriculum reform.

**Subject:** Eigenvalues & Eigenvectors > Diagonalization

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Build a tool that takes a university's course prerequisite graph (as an adjacency list or matrix) and outputs: (1) a ranking of courses by "importance" using eigenvector centrality of the prerequisite adjacency matrix, (2) a visualization of the graph with node sizes proportional to centrality scores, and (3) a recommendation of which courses to prioritize for curriculum reform. Test it on a dataset of "a few hundred courses across STEM departments." The dean wants to know "which courses matter most."

### Student's Framing Response (Open-Ended)

**Assumption:** The prerequisite graph is a directed acyclic graph (DAG), since prerequisites cannot form cycles (course A requires B requires A is impossible). This means the adjacency matrix is nilpotent and has all eigenvalues equal to zero.

**Specification:** I will compute the eigenvector centrality using the dominant eigenvector of the adjacency matrix A, found via the power method: x_{k+1} = Ax_k / ||Ax_k||.

**Clarification:** If the adjacency matrix is nilpotent (all eigenvalues zero), the standard eigenvector centrality approach will not work because there is no dominant eigenvalue. Should I modify the matrix (e.g., add a damping factor as in PageRank) or use a different centrality measure?

**Gap:** The problem says "a few hundred courses" but doesn't specify whether the graph is strongly connected. Eigenvector centrality is well-defined only for strongly connected graphs (by the Perron-Frobenius theorem). A prerequisite DAG is definitely not strongly connected.

### AI Solution (Generated from Framing)

```python
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt

def prerequisite_analyzer(adj_list):
    G = nx.DiGraph(adj_list)
    A = nx.adjacency_matrix(G).toarray().astype(float)
    n = A.shape[0]

    # Compute eigenvector centrality via power method
    x = np.ones(n) / n
    for _ in range(100):
        x_new = A @ x
        norm = np.linalg.norm(x_new)
        if norm < 1e-15:
            break
        x = x_new / norm

    # Eigenvalues for diagonalizability check
    eigenvalues = np.linalg.eigvals(A)
    is_diagonalizable = True  # Assume diagonalizable

    # Ranking
    ranking = sorted(zip(G.nodes(), x), key=lambda t: -t[1])

    # Visualization
    pos = nx.spring_layout(G)
    sizes = 1000 * x / max(x)
    nx.draw(G, pos, node_size=sizes, with_labels=True, font_size=6)
    plt.title("Course Prerequisite Graph — Eigenvector Centrality")
    plt.savefig("prereq_graph.png")

    return ranking
```

*[Subtle issues: power method on a nilpotent matrix converges to zero vector (all eigenvalues are 0); diagonalizability is "assumed" without verification; a nilpotent matrix is diagonalizable only if it is the zero matrix; the code does not address the DAG/acyclicity issue at all; eigenvector centrality is undefined for DAGs without modification.]*

### Framing Feedback

**Criticism:** This is an exceptionally strong framing response. The student identified the critical mathematical obstacle: a prerequisite DAG has a nilpotent adjacency matrix with all eigenvalues equal to zero, making standard eigenvector centrality undefined. The student correctly connected this to the Perron-Frobenius theorem (requires irreducibility/strong connectivity) and proposed a concrete fix (PageRank-style damping). The only weakness is that the student did not explicitly state the diagonalizability implication: a nilpotent matrix is diagonalizable if and only if it is the zero matrix, so A is almost certainly not diagonalizable, and the standard eigenvector centrality framework based on the dominant eigenvector of A cannot apply.

**Better Alternative:** "Since the prerequisite graph is a DAG, the adjacency matrix A is nilpotent (A^k = 0 for some k). All eigenvalues are zero, the only eigenvector of A is the zero vector (for the eigenvalue 0, the eigenspace may have dimension less than n since A is nilpotent but nonzero), and A is not diagonalizable. Therefore, I should use a modified centrality: either PageRank (A_pr = alpha * A * D^{-1} + (1-alpha)/n * 11^T, which is irreducible and has a unique dominant eigenvector by Perron-Frobenius) or Katz centrality (x = (I - alpha * A)^{-1} * 1)."

**Grade:** A-

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### Current AI Output

*(The initial AI solution above.)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Error: The power method x_{k+1} = Ax_k / ||Ax_k||"
    description: "Error: The power method x_{k+1} = Ax_k / ||Ax_k|| applied to a nilpotent matrix will produce ||Ax_k|| -> 0, causing the iteration to either converge to the zero vector or fail with division by zero. The code has a `break` when the norm is below 1e-15, but the resulting x will be meaningless — it reflects the last non-degenerate iterate, which depends on the number of iterations before convergence to zero, not on any eigenvector. Error: The code sets `is_diagonalizable = True` without any verification. A nilpotent matrix (nonzero) is never diagonalizable: its only eigenvalue is 0, and its Jordan form has Jordan blocks of size > 1. The geometric multiplicity of eigenvalue 0 equals dim(ker A), which is strictly less than n for a nonzero nilpotent matrix. So the algebraic multiplicity (n) exceeds the geometric multiplicity, and diagonalization fails. Gap:** No alternative centrality measure is implemented. The code should use Katz centrality or PageRank, which are well-defined for DAGs."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Instruction:** Replace the eigenvector centrality with"
    description: "Instruction:** Replace the eigenvector centrality with Katz centrality: x = (I - alpha * A^T)^{-1} * 1, where alpha < 1/rho(A). Since A is nilpotent with rho(A) = 0, any positive alpha works. Use alpha = 0.1 as a default. Also remove the `is_diagonalizable = True` assumption and instead compute the Jordan structure: find eigenvalues, check if the geometric multiplicity of each equals its algebraic multiplicity, and report whether A is diagonalizable."

#### Updated AI Output

```python
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
from scipy.linalg import inv

def prerequisite_analyzer(adj_list):
    G = nx.DiGraph(adj_list)
    A = nx.adjacency_matrix(G).toarray().astype(float)
    n = A.shape[0]
    courses = list(G.nodes())

    # --- Diagonalizability analysis ---
    eigenvalues = np.linalg.eigvals(A)
    unique_eigs, counts = np.unique(np.round(eigenvalues, 8), return_counts=True)

    diag_report = []
    is_diagonalizable = True
    for eig, alg_mult in zip(unique_eigs, counts):
        geo_mult = n - np.linalg.matrix_rank(A - eig * np.eye(n))
        diag_report.append({
            'eigenvalue': eig,
            'algebraic_multiplicity': int(alg_mult),
            'geometric_multiplicity': int(geo_mult)
        })
        if geo_mult < alg_mult:
            is_diagonalizable = False

    print("Diagonalizability Analysis:")
    for d in diag_report:
        print(f"  lambda = {d['eigenvalue']:.4f}: "
              f"alg. mult. = {d['algebraic_multiplicity']}, "
              f"geo. mult. = {d['geometric_multiplicity']}")
    print(f"  Diagonalizable: {is_diagonalizable}")

    if not is_diagonalizable:
        print("  NOTE: A is nilpotent (DAG adjacency matrix). All eigenvalues")
        print("  are 0, but the Jordan form has blocks of size > 1.")
        print("  Standard eigenvector centrality is undefined.")
        print("  Using Katz centrality instead.")

    # --- Katz centrality ---
    # x = (I - alpha * A^T)^{-1} * 1
    # For nilpotent A, rho(A) = 0, so any alpha > 0 works.
    # alpha controls how far "upstream" influence propagates.
    alpha = 0.1
    katz = inv(np.eye(n) - alpha * A.T) @ np.ones(n)

    # Normalize to [0, 1]
    katz_norm = katz / katz.max()

    # Ranking
    ranking = sorted(zip(courses, katz_norm), key=lambda t: -t[1])

    print("\nTop 20 courses by Katz centrality:")
    for i, (course, score) in enumerate(ranking[:20]):
        print(f"  {i+1}. {course}: {score:.4f}")

    # Visualization
    pos = nx.kamada_kawai_layout(G)
    sizes = 300 + 2000 * katz_norm
    colors = katz_norm

    plt.figure(figsize=(14, 10))
    nx.draw(G, pos, node_size=sizes, node_color=colors,
            cmap='YlOrRd', with_labels=True, font_size=5,
            arrows=True, edge_color='gray', alpha=0.8)
    plt.title("Course Prerequisites — Katz Centrality")
    sm = plt.cm.ScalarMappable(cmap='YlOrRd',
                                norm=plt.Normalize(0, 1))
    sm.set_array([])
    plt.colorbar(sm, label='Centrality')
    plt.savefig("prereq_graph.png", dpi=150, bbox_inches='tight')

    return ranking, diag_report
```

*[Remaining issues: Katz centrality uses A^T which assumes the "importance flows upstream" convention -- should be justified; alpha = 0.1 is arbitrary; the nilpotency observation means (I - alpha A^T)^{-1} = I + alpha A^T + alpha^2 (A^T)^2 + ... which terminates in finitely many terms, but this is not mentioned; curriculum reform recommendations are not generated.]*

#### Judging Feedback

**Criticism:** Excellent judging. The student identified all three critical issues: the power method failure on nilpotent matrices, the unjustified diagonalizability assumption, and the missing alternative centrality. The explanation of why nilpotent matrices are not diagonalizable — geometric multiplicity of eigenvalue 0 is strictly less than algebraic multiplicity n — is mathematically precise. One missed observation: since A is nilpotent, (I - alpha A^T)^{-1} expands as a finite Neumann series I + alpha A^T + alpha^2 (A^T)^2 + ..., which has a nice interpretation (direct prerequisites, 2-step prerequisites, etc.).

**Better Alternative:** Adding: "Note: since A is nilpotent, the matrix inverse (I - alpha A^T)^{-1} can be computed as a finite polynomial in A^T, where the k-th term alpha^k (A^T)^k counts k-step prerequisite paths. This avoids the matrix inversion entirely."

**Grade:** A-

#### Steering Feedback

**Criticism:** The instruction was well-structured: Katz centrality as the replacement, Jordan structure analysis for the diagonalizability report, and a specific default for alpha. However, the student did not justify why A^T (transpose) is used in the Katz formula — this determines the direction of influence flow. In a prerequisite graph, using A^T means "courses that are prerequisites for many others score high," which is the correct convention for curriculum reform. This should be stated explicitly. Also, the instruction did not request curriculum reform recommendations, which the problem requires.

**Better Alternative:** "Use Katz centrality x = (I - alpha A^T)^{-1} 1 where A^T is used because centrality should flow from courses that serve as prerequisites to many others. Note that since A is nilpotent, the inverse is a finite Neumann series. Also generate curriculum reform recommendations: courses in the top 10% of Katz centrality whose prerequisites have low centrality are bottleneck candidates."

**Grade:** B+

---

### Cycle 2

#### Current AI Output

*(The updated solution from Cycle 1.)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap:** The tool does not generate curriculum reform"
    description: "Gap:** The tool does not generate curriculum reform recommendations, which is one of the three required outputs. The ranking identifies"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Instruction:** Add a curriculum reform recommendation"
    description: "Instruction:** Add a curriculum reform recommendation section: identify bottleneck courses (top 10% centrality with high fan-out in the graph) and flag courses where removing them would disconnect large portions of the graph. Also add a brief note explaining that alpha controls how much weight is given to indirect prerequisites (higher alpha = more weight on long chains) and show results for alpha in {0.01, 0.1, 0.5} to demonstrate sensitivity."

#### Updated AI Output

```python
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
from scipy.linalg import inv

def prerequisite_analyzer(adj_list):
    G = nx.DiGraph(adj_list)
    A = nx.adjacency_matrix(G).toarray().astype(float)
    n = A.shape[0]
    courses = list(G.nodes())

    # --- Diagonalizability analysis ---
    eigenvalues = np.linalg.eigvals(A)
    is_nilpotent = np.allclose(eigenvalues, 0)
    geo_mult_0 = n - np.linalg.matrix_rank(A)
    is_diagonalizable = (geo_mult_0 == n)  # Only if A = 0

    print(f"Eigenvalues all zero (nilpotent): {is_nilpotent}")
    print(f"Geometric multiplicity of 0: {geo_mult_0}, Algebraic: {n}")
    print(f"Diagonalizable: {is_diagonalizable}")
    if not is_diagonalizable:
        print("A is nilpotent but nonzero => not diagonalizable.")
        print("Jordan form has blocks of size > 1.")

    # --- Katz centrality with sensitivity analysis ---
    # Since A is nilpotent, (I - alpha A^T)^{-1} = I + alpha A^T + ... + alpha^k (A^T)^k
    # where k is the nilpotency index. The parameter alpha controls how much
    # weight is placed on indirect (multi-step) prerequisites.
    alphas = [0.01, 0.1, 0.5]
    katz_results = {}

    for alpha in alphas:
        katz = inv(np.eye(n) - alpha * A.T) @ np.ones(n)
        katz_results[alpha] = katz / katz.max()

    # Default ranking uses alpha = 0.1
    katz_default = katz_results[0.1]
    ranking = sorted(zip(courses, katz_default), key=lambda t: -t[1])

    print(f"\nSensitivity analysis (top 5 courses for each alpha):")
    for alpha in alphas:
        top5 = sorted(zip(courses, katz_results[alpha]), key=lambda t: -t[1])[:5]
        print(f"  alpha={alpha}: {[c for c, _ in top5]}")

    # --- Curriculum reform recommendations ---
    print("\n=== CURRICULUM REFORM RECOMMENDATIONS ===")

    # Bottleneck courses: high centrality AND high out-degree
    out_degrees = dict(G.out_degree())
    centrality_threshold = np.percentile(katz_default, 90)

    bottlenecks = []
    for course, score in zip(courses, katz_default):
        if score >= centrality_threshold and out_degrees.get(course, 0) >= 3:
            bottlenecks.append((course, score, out_degrees[course]))

    bottlenecks.sort(key=lambda t: -t[1])
    print("\nBottleneck courses (high centrality + high fan-out):")
    for course, score, deg in bottlenecks:
        print(f"  {course}: centrality={score:.3f}, out-degree={deg}")

    # Disconnection analysis
    print("\nDisconnection impact (courses whose removal isolates the most nodes):")
    for course in [c for c, _ in ranking[:10]]:
        G_reduced = G.copy()
        G_reduced.remove_node(course)
        components = list(nx.weakly_connected_components(G_reduced))
        isolated = sum(1 for c in components if len(c) == 1)
        print(f"  Remove {course}: {len(components)} components, "
              f"{isolated} isolated nodes")

    # Visualization
    pos = nx.kamada_kawai_layout(G)
    sizes = 300 + 2000 * katz_default
    plt.figure(figsize=(14, 10))
    nx.draw(G, pos, node_size=sizes, node_color=katz_default,
            cmap='YlOrRd', with_labels=True, font_size=5,
            arrows=True, edge_color='gray', alpha=0.8)
    plt.title("Course Prerequisites — Katz Centrality (alpha=0.1)")
    plt.colorbar(plt.cm.ScalarMappable(cmap='YlOrRd'), label='Centrality')
    plt.savefig("prereq_graph.png", dpi=150, bbox_inches='tight')

    return ranking, bottlenecks
```

#### Judging Feedback

**Criticism:** The student correctly identified both missing elements: the reform recommendations and the alpha sensitivity. The bottleneck identification criterion (high centrality + high fan-out) is a reasonable heuristic. However, the student could have noted that the Neumann series interpretation of Katz centrality (counting weighted paths of length 1, 2, ..., k) provides a natural interpretation: alpha controls how much credit a course gets for being an indirect prerequisite. This connection between the algebra and the application was not raised.

**Better Alternative:** Adding: "Gap: The Neumann series (I - alpha A^T)^{-1} = sum_{j=0}^{k} alpha^j (A^T)^j counts weighted j-step prerequisite paths. This interpretation should be stated so the dean understands what alpha means: alpha = 0.5 weights a 3-step indirect prerequisite at 0.5^3 = 12.5% of a direct prerequisite."

**Grade:** B+

#### Steering Feedback

**Criticism:** The sensitivity analysis instruction was well-designed and directly addresses the arbitrary alpha concern. The reform recommendation criteria (top 10% centrality with high fan-out, disconnection analysis) are practical and actionable. The student successfully translated the mathematical analysis into policy-relevant outputs. The main gap is not requesting the Neumann series interpretation, which would make the tool's outputs more interpretable for non-mathematical stakeholders.

**Better Alternative:** Add: "Include a note explaining that Katz centrality counts weighted prerequisite paths: a course's score is 1 + alpha*(direct prerequisite count) + alpha^2*(2-step prerequisite count) + ..., so the dean can understand what drives each course's ranking."

**Grade:** B+

---

### Cycle 3 — Final

#### Current AI Output

*(The updated solution from Cycle 2.)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap:** The tool does not explain the Katz centrality"
    description: "Gap:** The tool does not explain the Katz centrality formula in terms the dean can understand. The Neumann series expansion shows that a course's centrality score is a weighted count of how many courses depend on it directly (weight alpha), indirectly through 2-step chains (weight alpha^2), etc. This interpretation should be included in the output."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done**

---

## Completion

### Final Grades

| Skill | Grade |
|-------|-------|
| **Framing** | A |
| **Judging** | A |
| **Steering** | A |

### Summary Feedback

This was the strongest session overall. The student's framing was excellent — recognizing that a prerequisite DAG produces a nilpotent adjacency matrix, connecting this to the failure of standard eigenvector centrality, and raising the Perron-Frobenius irreducibility requirement. This is rare mathematical insight applied correctly to the problem context. Judging was consistently strong, with precise explanations of why nilpotent matrices are not diagonalizable (algebraic vs. geometric multiplicity) and why the power method fails. Steering was good but not quite at the same level: the Katz centrality replacement was well-chosen, but the student missed opportunities to request the Neumann series interpretation and to connect the mathematical structure to the dean's decision-making needs. The overall pattern: strong on mathematical rigor, slightly weaker on translating mathematical insights into actionable, interpretable outputs for stakeholders.
