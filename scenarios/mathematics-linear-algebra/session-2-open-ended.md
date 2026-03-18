# Session 2 — Open-Ended: Design a Load-Bearing Analysis Solver with Error Reporting

**Challenge:** Write a solver that reads a structural equilibrium system Ax = b from a configuration file, computes the member forces x, and outputs a solution report with condition number assessment and safety verdict.

**Subject:** Systems of Equations > Gaussian Elimination, Numerical Stability

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Write a solver (in Python or MATLAB) that reads a structural equilibrium system Ax = b from a configuration file, computes the member forces x, and outputs a report containing: the solution vector, a condition number assessment, and a pass/fail safety verdict. The solver will be used for a pedestrian bridge with "around 50 to 80 joints." The engineers say some force coefficients are "in Newtons while others are in kilonewtons" and want results "accurate to at least three significant figures."

### Student's Framing Response (Open-Ended)

**Assumption:** The system Ax = b is square (n equations, n unknowns) and has a unique solution since we expect one force per structural member determined by equilibrium.

**Specification:** I will use Gaussian elimination with partial pivoting to solve the system, and compute cond(A) = ‖A‖ · ‖A⁻¹‖ in the infinity norm to assess reliability.

**Clarification:** The mixed units (N vs. kN) suggest a factor-of-1000 disparity in coefficient magnitudes. Should the solver automatically detect and correct unit inconsistencies, or should it just flag them via the condition number?

**Gap:** The problem says "50 to 80 joints" but does not specify the number of structural members or whether the system is statically determinate. If the structure is statically indeterminate, the system may be underdetermined.

### AI Solution (Generated from Framing)

```python
import numpy as np

def load_system(filepath):
    """Load A and b from a config file."""
    config = parse_config(filepath)
    A = np.array(config['A'], dtype=float)
    b = np.array(config['b'], dtype=float)
    return A, b

def solve_structural(A, b):
    n = A.shape[0]

    # Gaussian elimination with partial pivoting
    Ab = np.hstack([A, b.reshape(-1, 1)])

    for col in range(n):
        # Partial pivoting: find max in column
        max_row = np.argmax(np.abs(Ab[col:, col])) + col
        Ab[[col, max_row]] = Ab[[max_row, col]]

        # Eliminate below
        for row in range(col + 1, n):
            factor = Ab[row, col] / Ab[col, col]
            Ab[row, col:] -= factor * Ab[col, col:]

    # Back substitution
    x = np.zeros(n)
    for i in range(n - 1, -1, -1):
        x[i] = (Ab[i, -1] - Ab[i, i+1:n] @ x[i+1:]) / Ab[i, i]

    # Condition number
    cond = np.linalg.cond(A, np.inf)

    # Safety verdict
    if cond < 1e6:
        verdict = "PASS"
    else:
        verdict = "FAIL — ill-conditioned system"

    return x, cond, verdict

A, b = load_system("bridge_config.json")
x, cond, verdict = solve_structural(A, b)

print(f"Solution: {x}")
print(f"Condition number: {cond:.2e}")
print(f"Safety verdict: {verdict}")
print(f"Significant figures reliable: ~{max(0, int(16 - np.log10(cond)))}")
```

*[Subtle issues: no column/row scaling despite known unit disparities; condition number threshold of 10^6 is arbitrary without connecting it to the 3-significant-figure requirement; no residual verification (‖Ax − b‖); no check for singular or near-singular pivots during elimination; does not handle rectangular systems.]*

### Framing Feedback

**Criticism:** The student made several strong observations: recognizing that unit mixing creates coefficient magnitude disparities, asking whether the system might be underdetermined if statically indeterminate, and specifying partial pivoting. However, the student assumed the system is square without justification — structural equilibrium can produce rectangular systems (more members than equilibrium equations for indeterminate structures). The student also did not connect the condition number to the accuracy requirement: with double precision (≈16 digits) and cond(A) = κ, the solution is reliable to about 16 − log₁₀(κ) significant figures. The 3-significant-figure requirement therefore demands κ < 10^13, which should have been stated explicitly.

**Better Alternative:** "The mixed units create coefficient disparities of O(10³), which could inflate cond(A) artificially. I will apply diagonal scaling D₁AD₂ = Ā to equilibrate the matrix before solving. The 3-significant-figure requirement, combined with double-precision arithmetic (≈16 digits), means the system is safe to solve directly if cond(A) < 10^13 after scaling. I should verify whether the system is determined, overdetermined, or underdetermined, and handle each case appropriately."

**Grade:** B−

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### Current AI Output

*(The initial AI solution above.)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Error: The solver does not scale the matrix despite the"
    description: "Error: The solver does not scale the matrix despite the known factor-of-1000 unit disparity between Newtons and kilonewtons. This means the condition number reflects the unit mismatch rather than the intrinsic difficulty of the problem. A system that is well-conditioned after equilibration may appear ill-conditioned due to poor scaling. Gap:** There is no residual check. After computing x, the solver should compute r = b − Ax and verify that ‖r‖ / ‖b‖ is small. Without this, a solution could be inaccurate due to accumulated rounding errors and the solver would not detect it."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Instruction:** Add row equilibration before solving"
    description: "Instruction:** Add row equilibration before solving: scale each row of A by 1/‖row_i‖_∞ so that all rows have comparable magnitude. After solving, compute the relative residual ‖b − Ax‖_∞ / ‖b‖_∞ and report it. If the relative residual exceeds 10^{-10}, flag a potential numerical issue."

#### Updated AI Output

```python
import numpy as np

def solve_structural(A, b):
    n = A.shape[0]

    # Row equilibration
    row_norms = np.max(np.abs(A), axis=1)
    row_norms[row_norms == 0] = 1.0  # avoid division by zero
    D = np.diag(1.0 / row_norms)
    A_scaled = D @ A
    b_scaled = D @ b

    # Gaussian elimination with partial pivoting
    Ab = np.hstack([A_scaled, b_scaled.reshape(-1, 1)])

    for col in range(n):
        max_row = np.argmax(np.abs(Ab[col:, col])) + col
        Ab[[col, max_row]] = Ab[[max_row, col]]

        if np.abs(Ab[col, col]) < 1e-15:
            raise ValueError(f"Near-zero pivot at column {col}: system may be singular")

        for row in range(col + 1, n):
            factor = Ab[row, col] / Ab[col, col]
            Ab[row, col:] -= factor * Ab[col, col:]

    # Back substitution
    x = np.zeros(n)
    for i in range(n - 1, -1, -1):
        x[i] = (Ab[i, -1] - Ab[i, i+1:n] @ x[i+1:]) / Ab[i, i]

    # Condition number of SCALED matrix
    cond = np.linalg.cond(A_scaled, np.inf)

    # Residual check on ORIGINAL system
    residual = b - A @ x
    rel_residual = np.linalg.norm(residual, np.inf) / np.linalg.norm(b, np.inf)

    # Significant figures estimate
    sig_figs = max(0, int(16 - np.log10(cond)))

    verdict = "PASS" if sig_figs >= 3 else "FAIL — insufficient accuracy"
    if rel_residual > 1e-10:
        verdict = "FAIL — large residual detected"

    return {
        'solution': x,
        'condition_number': cond,
        'relative_residual': rel_residual,
        'estimated_sig_figs': sig_figs,
        'verdict': verdict
    }
```

*[Remaining issues: only row scaling, no column scaling; condition-number-based sig_figs estimate is a rough heuristic; does not handle rectangular systems; no iterative refinement.]*

#### Judging Feedback

**Criticism:** The student identified the two most critical issues — missing scaling and missing residual verification. The scaling concern was directly tied to the problem context (N vs. kN), showing practical awareness. However, the student only asked for row equilibration, not column scaling. In a structural system, column scaling matters too: if some members have much larger force coefficients than others, column equilibration is needed. The student also did not question the arbitrary condition number threshold of 10^6 from the original code.

**Better Alternative:** "Error: No equilibration despite 10³× unit disparities — both row and column scaling are needed to get a meaningful condition number. Gap: No residual check to validate the computed solution. Error: The safety threshold cond(A) < 10^6 is not connected to the 3-significant-figure requirement; with 16-digit arithmetic, the actual bound should be cond(A) < 10^{13}."

**Grade:** B

#### Steering Feedback

**Criticism:** The row equilibration instruction was concrete and well-specified. The residual check with a specific threshold (10^{-10}) was actionable. However, the student should have also requested column scaling to address the structural member force coefficient disparities, not just the equation-level scaling. The 10^{-10} residual threshold is reasonable but was not justified — it should be connected to the 3-significant-figure accuracy requirement.

**Better Alternative:** "Apply both row and column equilibration: D₁AD₂ = Ā where D₁ and D₂ are diagonal matrices that scale rows and columns to unit infinity norm. Solve Āy = D₁b, then recover x = D₂y. Compute the relative residual ‖b − Ax‖∞ / ‖b‖∞ and the estimated reliable significant figures as 16 − log₁₀(cond(Ā)). Report 'PASS' only if estimated sig figs ≥ 3."

**Grade:** B−

---

### Cycle 2

#### Current AI Output

*(The updated solution from Cycle 1.)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Error:** The solver still assumes the system is square (n×n)"
    description: "Error:** The solver still assumes the system is square (n×n). The problem says"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Instruction:** Add a check at the start: if A is not"
    description: "Instruction:** Add a check at the start: if A is not square, or if A is square but singular (detected by a zero pivot), report the rank of A, the dimension of the null space, and either compute a least-norm solution (underdetermined) or a least-squares solution (overdetermined). For the square well-conditioned case, add one step of iterative refinement after the initial solve."

#### Updated AI Output

```python
import numpy as np

def solve_structural(A, b):
    m, n = A.shape

    # Row equilibration
    row_norms = np.max(np.abs(A), axis=1)
    row_norms[row_norms == 0] = 1.0
    D = np.diag(1.0 / row_norms)
    A_scaled = D @ A
    b_scaled = D @ b

    report = {}

    if m == n:
        # Square system: attempt direct solve
        rank = np.linalg.matrix_rank(A_scaled)
        if rank < n:
            report['warning'] = f"Singular system: rank {rank} < {n}"
            report['null_space_dim'] = n - rank
            # Fall through to least-norm solution
            x, res, rank_lstsq, sv = np.linalg.lstsq(A, b, rcond=None)
            report['solution_type'] = 'least-norm (singular square system)'
        else:
            # Full rank: Gaussian elimination with partial pivoting
            Ab = np.hstack([A_scaled, b_scaled.reshape(-1, 1)])
            for col in range(n):
                max_row = np.argmax(np.abs(Ab[col:, col])) + col
                Ab[[col, max_row]] = Ab[[max_row, col]]
                for row in range(col + 1, n):
                    factor = Ab[row, col] / Ab[col, col]
                    Ab[row, col:] -= factor * Ab[col, col:]

            x = np.zeros(n)
            for i in range(n - 1, -1, -1):
                x[i] = (Ab[i, -1] - Ab[i, i+1:n] @ x[i+1:]) / Ab[i, i]

            # Iterative refinement (one step)
            r = b_scaled - A_scaled @ x
            Ab_r = np.hstack([A_scaled, r.reshape(-1, 1)])
            for col in range(n):
                max_row = np.argmax(np.abs(Ab_r[col:, col])) + col
                Ab_r[[col, max_row]] = Ab_r[[max_row, col]]
                for row in range(col + 1, n):
                    factor = Ab_r[row, col] / Ab_r[col, col]
                    Ab_r[row, col:] -= factor * Ab_r[col, col:]
            e = np.zeros(n)
            for i in range(n - 1, -1, -1):
                e[i] = (Ab_r[i, -1] - Ab_r[i, i+1:n] @ e[i+1:]) / Ab_r[i, i]
            x = x + e
            report['solution_type'] = 'direct + iterative refinement'

    elif m > n:
        # Overdetermined: least squares
        x, res, rank_lstsq, sv = np.linalg.lstsq(A, b, rcond=None)
        report['solution_type'] = 'least squares (overdetermined)'
    else:
        # Underdetermined: minimum norm
        x, res, rank_lstsq, sv = np.linalg.lstsq(A, b, rcond=None)
        report['solution_type'] = 'least-norm (underdetermined)'

    # Diagnostics
    cond = np.linalg.cond(A_scaled)
    residual = b - A @ x
    rel_residual = np.linalg.norm(residual, np.inf) / max(np.linalg.norm(b, np.inf), 1e-30)
    sig_figs = max(0, int(16 - np.log10(max(cond, 1))))

    report.update({
        'solution': x,
        'condition_number': cond,
        'relative_residual': rel_residual,
        'estimated_sig_figs': sig_figs,
        'verdict': 'PASS' if (sig_figs >= 3 and rel_residual < 1e-10) else 'FAIL'
    })

    return report
```

#### Judging Feedback

**Criticism:** Good improvement in scope. The student identified the rectangular system gap and the value of iterative refinement. However, the student did not notice that the iterative refinement is applied to the scaled system (A_scaled, b_scaled) but the refinement residual should ideally be computed in higher precision or at minimum on the original system for the refinement to be effective. Also, the student still has not flagged the missing column scaling.

**Better Alternative:** "Error: Iterative refinement computes r = b_scaled − A_scaled·x in the same precision as the original solve; for refinement to gain accuracy, the residual should be computed using the original (unscaled) system in extended precision or at minimum with compensated summation. Gap: Column scaling is still absent."

**Grade:** B+

#### Steering Feedback

**Criticism:** The instruction was comprehensive: it addressed rectangular systems with least-norm/least-squares fallbacks and added iterative refinement. The student correctly identified that the solver needs to report rank and null space dimension for singular systems. However, the student did not specify how the iterative refinement residual should be computed (higher precision is essential for refinement to work), and the overall instruction was dense — a more focused correction targeting one issue at a time might have produced a cleaner response.

**Better Alternative:** "Check system dimensions: if m ≠ n or rank(A) < min(m,n), report the rank, null space dimension, and use lstsq. For the square full-rank case, add one step of iterative refinement where the residual r = b − Ax is computed using the original unscaled system (not the equilibrated one) to maximize accuracy gain."

**Grade:** B

---

### Cycle 3 — Final

#### Current AI Output

*(The updated solution from Cycle 2.)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap:** The solver still lacks column scaling"
    description: "Gap:** The solver still lacks column scaling. Only row equilibration is applied, but column scaling is needed when different force unknowns have different natural magnitudes."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done**

The student accepts the solution as sufficiently complete despite the remaining column scaling gap.

---

## Completion

### Final Grades

| Skill | Grade |
|-------|-------|
| **Framing** | B− |
| **Judging** | B |
| **Steering** | B |

### Summary Feedback

The student demonstrated strong practical instincts, identifying the scaling problem and residual verification need early. The progression from basic issues (scaling, residual checks) to structural concerns (rectangular systems, iterative refinement) showed good mathematical maturation across cycles. Weaknesses include: (1) never fully addressing column scaling despite identifying unit disparities in framing, (2) not connecting the condition number threshold to the stated accuracy requirement (3 significant figures → κ < 10^13) until the AI did it, and (3) not recognizing the precision requirements for effective iterative refinement. For structural engineering solvers, the student should internalize the workflow: equilibrate → factor with pivoting → solve → refine → verify residual → report condition-based accuracy estimate.
