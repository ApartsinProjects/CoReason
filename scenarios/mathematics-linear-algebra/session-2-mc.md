# Session 2 — Multiple Choice: Design a Load-Bearing Analysis Solver with Error Reporting

**Challenge:** Write a solver that reads a structural equilibrium system Ax = b, computes member forces x, and outputs a report with condition number assessment and safety verdict.

**Subject:** Systems of Equations > Gaussian Elimination, Numerical Stability

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Write a solver (in Python or MATLAB) that reads a structural equilibrium system Ax = b from a configuration file, computes the member forces x, and outputs a report containing: the solution vector, a condition number assessment, and a pass/fail safety verdict. The solver will be used for a pedestrian bridge with "around 50 to 80 joints." The engineers say some force coefficients are "in Newtons while others are in kilonewtons" and want results "accurate to at least three significant figures."

### Student's Framing Response (Multiple Choice)

**Question:** What is the primary numerical concern raised by coefficients being "in Newtons while others are in kilonewtons"?

| Option | Text |
|--------|------|
| A | The system will be overdetermined since there are too many units |
| B | Large magnitude disparities between coefficients can inflate the condition number and amplify rounding errors during elimination |
| C | Kilonewtons should simply be converted to Newtons before solving; no numerical concern arises |
| D | Mixed units make the system singular |
| E | The solver needs to use integer arithmetic to avoid rounding |

**Student selects:** B *(correct)*

**Question:** Which pivoting strategy is most appropriate for this problem?

| Option | Text |
|--------|------|
| A | No pivoting — the matrix is symmetric so pivoting is unnecessary |
| B | Partial pivoting — select the largest element in the current column below the diagonal |
| C | Complete pivoting — search the entire remaining submatrix for the largest element |
| D | Random pivoting — shuffle rows to avoid worst-case behavior |
| E | Diagonal pivoting — only swap if the diagonal element is exactly zero |

**Student selects:** C *(suboptimal — complete pivoting has O(n³) search overhead; partial pivoting is standard and sufficient for most practical systems)*

**Question:** How should the solver determine whether the computed solution meets the "three significant figures" accuracy requirement?

| Option | Text |
|--------|------|
| A | Check that all solution components have at least 3 decimal places |
| B | Compute cond(A) and verify that 16 − log₁₀(cond(A)) ≥ 3, then confirm with a residual check |
| C | Compare the solution against a known analytical result |
| D | Run the solver twice with different random perturbations and check agreement |
| E | Three significant figures are always guaranteed in double precision |

**Student selects:** B *(correct)*

### AI Solution (Generated from Framing)

```python
import numpy as np

def solve_bridge(filepath):
    A, b = load_config(filepath)
    n = A.shape[0]

    # Complete pivoting Gaussian elimination
    Ab = np.hstack([A, b.reshape(-1, 1)]).astype(float)
    col_perm = np.arange(n)

    for col in range(n):
        # Search entire submatrix for largest element
        sub = np.abs(Ab[col:, col:n])
        max_idx = np.unravel_index(np.argmax(sub), sub.shape)
        pivot_row, pivot_col = max_idx[0] + col, max_idx[1] + col

        Ab[[col, pivot_row]] = Ab[[pivot_row, col]]
        Ab[:, [col, pivot_col]] = Ab[:, [pivot_col, col]]
        col_perm[[col, pivot_col]] = col_perm[[pivot_col, col]]

        for row in range(col + 1, n):
            factor = Ab[row, col] / Ab[col, col]
            Ab[row, col:] -= factor * Ab[col, col:]

    # Back substitution
    y = np.zeros(n)
    for i in range(n - 1, -1, -1):
        y[i] = (Ab[i, -1] - Ab[i, i+1:n] @ y[i+1:]) / Ab[i, i]

    # Undo column permutation
    x = np.zeros(n)
    x[col_perm] = y

    # Condition number and accuracy estimate
    cond = np.linalg.cond(A)
    sig_figs = max(0, int(16 - np.log10(cond)))

    verdict = "PASS" if sig_figs >= 3 else "FAIL"

    print(f"Solution: {x}")
    print(f"cond(A) = {cond:.2e}")
    print(f"Estimated reliable digits: {sig_figs}")
    print(f"Safety verdict: {verdict}")

    return x, cond, verdict
```

*[Subtle issues: complete pivoting implemented but partial pivoting would be more practical (O(n²) less search overhead); no matrix scaling/equilibration; no residual verification despite the student correctly identifying it as needed; no handling of singular or rectangular systems.]*

### Framing Feedback

**Criticism:** The student correctly identified the unit disparity concern (B) and the condition-number-based accuracy verification method (B). However, the student chose complete pivoting (C) over partial pivoting (B). While complete pivoting provides marginally better numerical stability, it requires O(n²) comparisons per elimination step (vs. O(n) for partial pivoting) and is rarely used in practice because partial pivoting is nearly always sufficient. For an 80-joint bridge system (likely 150–250 unknowns), the difference is modest, but the choice suggests the student may not appreciate the practical trade-offs. The student also did not address scaling/equilibration, which is the more impactful intervention for mixed-unit systems.

**Better Alternative:** Selecting B (partial pivoting) combined with requesting row/column equilibration would be the standard industrial approach. Partial pivoting with equilibration is more effective than complete pivoting without equilibration.

**Grade:** B

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### Current AI Output

*(The initial AI solution above.)*

#### Judging Sub-step

**Question:** Which issues are present in the AI's solution? (Select all that apply)

| Option | Text |
|--------|------|
| A | The solver does not scale/equilibrate the matrix despite known unit disparities |
| B | There is no residual check (‖b − Ax‖) to verify the computed solution |
| C | The complete pivoting implementation incorrectly handles the column permutation |
| D | The condition number is computed using the 2-norm; the ∞-norm would be more appropriate for elementwise-scaled systems |
| E | The solver does not handle the case where a pivot is zero or near-zero (singular system) |

**Student selects:** A, B, E *(misses D; C is incorrect — the implementation is fine)*

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Question:** What correction should be sent to the AI?

| Option | Text |
|--------|------|
| A | Add row equilibration, compute ‖b − Ax‖∞ / ‖b‖∞ as a residual check, and raise an error if any pivot is below a threshold |
| B | Switch to numpy.linalg.solve and skip the manual Gaussian elimination entirely |
| C | Add only the residual check; scaling is not needed since complete pivoting handles magnitude disparities |
| D | Convert all units to kilonewtons in the input file and rerun |
| E | Add column equilibration only, since row scaling changes the equations' physical meaning |

**Student selects:** A

#### Updated AI Output

```python
import numpy as np

def solve_bridge(filepath):
    A, b = load_config(filepath)
    m, n = A.shape

    if m != n:
        raise ValueError(f"System is {m}x{n}, expected square. "
                         f"Use least squares for non-square systems.")

    # Row equilibration: scale each equation to unit ∞-norm
    row_scales = np.max(np.abs(A), axis=1)
    row_scales[row_scales == 0] = 1.0
    D = np.diag(1.0 / row_scales)
    A_eq = D @ A
    b_eq = D @ b

    # Partial pivoting (switched from complete for efficiency)
    Ab = np.hstack([A_eq, b_eq.reshape(-1, 1)])

    for col in range(n):
        max_row = np.argmax(np.abs(Ab[col:, col])) + col
        Ab[[col, max_row]] = Ab[[max_row, col]]

        if np.abs(Ab[col, col]) < 1e-14:
            raise ValueError(
                f"Near-zero pivot at step {col}: system is singular or "
                f"nearly singular. Rank ≈ {col}.")

        for row in range(col + 1, n):
            factor = Ab[row, col] / Ab[col, col]
            Ab[row, col:] -= factor * Ab[col, col:]

    # Back substitution
    x = np.zeros(n)
    for i in range(n - 1, -1, -1):
        x[i] = (Ab[i, -1] - Ab[i, i+1:n] @ x[i+1:]) / Ab[i, i]

    # Diagnostics
    cond = np.linalg.cond(A_eq, np.inf)
    residual = b - A @ x
    rel_res = np.linalg.norm(residual, np.inf) / np.linalg.norm(b, np.inf)
    sig_figs = max(0, int(16 - np.log10(max(cond, 1))))

    if sig_figs < 3:
        verdict = f"FAIL — only ~{sig_figs} reliable digits (need 3)"
    elif rel_res > 1e-10:
        verdict = f"FAIL — relative residual {rel_res:.2e} too large"
    else:
        verdict = "PASS"

    report = {
        'x': x, 'cond': cond, 'rel_residual': rel_res,
        'sig_figs': sig_figs, 'verdict': verdict
    }
    return report
```

*[Remaining issues: no column scaling; condition number of equilibrated matrix only; no backward error analysis; hardcoded pivot threshold 1e-14.]*

#### Judging Feedback

**Criticism:** The student correctly identified three of four issues (A, B, E) and avoided the false positive (C). Missing D (norm choice for condition number) is a subtle point — the 2-norm condition number is rotationally invariant but the ∞-norm is more natural when the matrix has been row-equilibrated in the ∞-norm, since it directly bounds the componentwise relative error.

**Better Alternative:** Selecting A, B, D, E would be complete. The norm choice matters because cond_∞(A) directly relates to the ∞-norm residual bound used in the safety check.

**Grade:** B

#### Steering Feedback

**Criticism:** Option A is the strongest available choice and the student selected it. It addresses all three identified issues: equilibration, residual verification, and singularity detection. The AI's response also sensibly switched from complete to partial pivoting. One weakness: the student did not request column scaling in addition to row scaling.

**Better Alternative:** Option A is correct. To strengthen it further: "Add both row and column equilibration (D₁AD₂ = Ā), compute the condition number of Ā in the ∞-norm, compute the residual on the original system, and detect near-singular pivots."

**Grade:** B+

---

### Cycle 2

#### Current AI Output

*(The updated solution from Cycle 1.)*

#### Judging Sub-step

**Question:** Which issues remain? (Select all that apply)

| Option | Text |
|--------|------|
| A | The pivot threshold (1e-14) is hardcoded rather than adapted to the matrix scale |
| B | Only row scaling is applied; column scaling is also needed for the mixed-unit force coefficients |
| C | The solver does not perform iterative refinement to recover lost significant figures |
| D | The backward error ‖ΔA‖/‖A‖ is not computed to assess stability of the elimination |
| E | The solver handles non-square systems by raising an error rather than solving them |

**Student selects:** A, B *(misses C, D, E)*

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Question:** What correction should be sent?

| Option | Text |
|--------|------|
| A | Add column scaling and replace the fixed 1e-14 threshold with a scale-dependent threshold such as n · ε · max|A_eq| |
| B | Replace the entire solver with scipy.linalg.lu_solve for production reliability |
| C | Add iterative refinement and backward error analysis alongside column scaling |
| D | Remove the pivot threshold check entirely — partial pivoting alone prevents zero pivots |
| E | Make the pivot threshold a user-configurable parameter |

**Student selects:** A

#### Updated AI Output

```python
import numpy as np

def solve_bridge(filepath):
    A, b = load_config(filepath)
    m, n = A.shape

    if m != n:
        raise ValueError(f"Non-square system ({m}x{n}). Use lstsq for rectangular systems.")

    # Row and column equilibration
    row_scales = np.max(np.abs(A), axis=1)
    row_scales[row_scales == 0] = 1.0
    col_scales = np.max(np.abs(A), axis=0)
    col_scales[col_scales == 0] = 1.0

    D_r = np.diag(1.0 / row_scales)
    D_c = np.diag(1.0 / col_scales)
    A_eq = D_r @ A @ D_c
    b_eq = D_r @ b

    # Scale-dependent pivot threshold
    eps = np.finfo(float).eps
    pivot_tol = n * eps * np.max(np.abs(A_eq))

    # Gaussian elimination with partial pivoting
    Ab = np.hstack([A_eq, b_eq.reshape(-1, 1)])

    for col in range(n):
        max_row = np.argmax(np.abs(Ab[col:, col])) + col
        Ab[[col, max_row]] = Ab[[max_row, col]]

        if np.abs(Ab[col, col]) < pivot_tol:
            raise ValueError(
                f"Pivot {Ab[col,col]:.2e} below threshold {pivot_tol:.2e} at step {col}. "
                f"System is effectively singular.")

        for row in range(col + 1, n):
            factor = Ab[row, col] / Ab[col, col]
            Ab[row, col:] -= factor * Ab[col, col:]

    # Back substitution (in scaled variables y where x = D_c @ y)
    y = np.zeros(n)
    for i in range(n - 1, -1, -1):
        y[i] = (Ab[i, -1] - Ab[i, i+1:n] @ y[i+1:]) / Ab[i, i]

    # Recover original variables
    x = D_c @ y

    # Diagnostics
    cond = np.linalg.cond(A_eq, np.inf)
    residual = b - A @ x
    rel_res = np.linalg.norm(residual, np.inf) / max(np.linalg.norm(b, np.inf), 1e-30)
    sig_figs = max(0, int(16 - np.log10(max(cond, 1))))

    verdict = "PASS" if (sig_figs >= 3 and rel_res < 1e-10) else "FAIL"

    return {
        'x': x, 'cond_equilibrated': cond,
        'rel_residual': rel_res, 'sig_figs': sig_figs,
        'verdict': verdict,
        'row_scaling': row_scales, 'col_scaling': col_scales
    }
```

#### Judging Feedback

**Criticism:** The student caught the column scaling gap and the hardcoded threshold — both practical and important. Missing iterative refinement (C) and backward error analysis (D) are more advanced topics; catching two of four remaining issues is reasonable for this level. The student also did not address the non-square system handling (E), which was flagged in the problem description.

**Better Alternative:** Selecting A, B, C would capture the most impactful remaining issues.

**Grade:** B

#### Steering Feedback

**Criticism:** Option A is good and directly addresses the two identified issues. Option C (which adds iterative refinement and backward error) would have been stronger since the 3-significant-figure requirement makes iterative refinement highly relevant — it can cheaply recover digits lost to rounding. The student's choice is safe and effective but leaves accuracy improvement on the table.

**Better Alternative:** Option C addresses all of A plus iterative refinement, which is the standard technique for recovering accuracy in ill-conditioned systems without resorting to higher precision arithmetic.

**Grade:** B

---

### Cycle 3 — Final

#### Current AI Output

*(The updated solution from Cycle 2.)*

#### Judging Sub-step

**Question:** Is the solution now adequate for the stated requirements?

| Option | Text |
|--------|------|
| A | Yes — the solver correctly handles scaling, pivoting, residual checks, and condition-based accuracy estimation |
| B | No — iterative refinement and backward error analysis are still missing |
| C | No — the solver should use LU decomposition from LAPACK instead of manual elimination |
| D | No — the solver needs to handle rectangular systems |
| E | No — the condition number should be computed before equilibration to reflect the raw system |

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
| **Judging** | B |
| **Steering** | B |

### Summary Feedback

The student showed consistent B-level performance across all three skills. Framing demonstrated good understanding of the core numerical issues (unit disparities, condition-number-based accuracy estimation) but selected complete pivoting over the more practical partial pivoting. Judging was reliable at catching practical issues (scaling, residual checks, pivot thresholds) but tended to miss more theoretical concerns (norm choice, backward error, iterative refinement). Steering selections were consistently reasonable but not optimal — the student repeatedly chose "good" options rather than "best" options, particularly by not requesting iterative refinement when accuracy recovery was a stated requirement. To improve, the student should study the full numerical linear algebra pipeline: equilibrate, factor, solve, refine, verify — and recognize that each step addresses a distinct source of error.
