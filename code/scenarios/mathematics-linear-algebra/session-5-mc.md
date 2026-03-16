# Session 5 — Multiple Choice: Build a Multi-Sensor Fusion Calibration Module

**Challenge:** Write a calibration module that fits a correction model to paired LIDAR/laser-tracker readings using least squares and outputs a calibration function with residual diagnostics.

**Subject:** Inner Product Spaces > Projections > Least Squares

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Write a calibration module (Python function or class) that takes in paired readings from a LIDAR sensor and a ground-truth laser tracker, fits a correction model using least squares, and outputs a calibration function that maps raw LIDAR readings to corrected distances. Deliver the module, a diagnostic plot of residuals, and a summary of calibration accuracy. The lab has "several hundred paired measurements" spanning 0.5m to 30m. The engineer notes that "readings get noisier further out" and there may be "a few obviously wrong points from when someone walked through the beam."

### Student's Framing Response (Multiple Choice)

**Question:** What does the least-squares solution beta_hat = argmin ||b - A*beta||_2 represent geometrically?

| Option | Text |
|--------|------|
| A | The vector beta that makes A*beta equal to b |
| B | The projection of b onto the column space of A, with the residual orthogonal to col(A) |
| C | The eigenvector of A^T A corresponding to the largest eigenvalue |
| D | The vector that minimizes the maximum absolute residual |
| E | The centroid of the data points |

**Student selects:** B *(correct)*

**Question:** The engineer says "readings get noisier further out." What does this imply for the least-squares formulation?

| Option | Text |
|--------|------|
| A | The errors are heteroscedastic — ordinary least squares assumptions are violated; weighted least squares should be considered |
| B | More data should be collected at far distances to compensate |
| C | The noise is irrelevant since least squares averages it out |
| D | The design matrix A should include distance-dependent columns |
| E | The problem should be solved using maximum likelihood instead of least squares |

**Student selects:** A *(correct)*

**Question:** What is the most numerically stable way to solve the least-squares problem?

| Option | Text |
|--------|------|
| A | Solve the normal equations A^T A beta = A^T b directly |
| B | Use the QR factorization: A = QR, then solve R*beta = Q^T*b |
| C | Compute the pseudoinverse A^+ = (A^T A)^{-1} A^T and multiply |
| D | Use gradient descent to minimize ||b - A*beta||^2 |
| E | Solve via Cramer's rule applied to the normal equations |

**Student selects:** A *(incorrect -- the normal equations square the condition number; QR is preferred)*

### AI Solution (Generated from Framing)

```python
import numpy as np
import matplotlib.pyplot as plt

class Calibrator:
    def __init__(self):
        self.coeffs = None

    def fit(self, x_lidar, y_truth):
        x = np.array(x_lidar)
        y = np.array(y_truth)
        n = len(x)

        # Design matrix for linear model
        A = np.column_stack([np.ones(n), x])

        # Normal equations (direct solve)
        ATA = A.T @ A
        ATb = A.T @ y
        self.coeffs = np.linalg.solve(ATA, ATb)

        y_pred = A @ self.coeffs
        residuals = y - y_pred
        rms = np.sqrt(np.mean(residuals**2))

        print(f"Model: y = {self.coeffs[0]:.4f} + {self.coeffs[1]:.4f} * x")
        print(f"RMS residual: {rms:.4f} m")

        # Diagnostics
        fig, axes = plt.subplots(1, 3, figsize=(15, 4))

        axes[0].scatter(x, y, s=3, alpha=0.3)
        xline = np.linspace(x.min(), x.max(), 100)
        axes[0].plot(xline, self.coeffs[0] + self.coeffs[1]*xline, 'r-')
        axes[0].set_title("Fit")

        axes[1].scatter(x, residuals, s=3, alpha=0.3)
        axes[1].axhline(0, color='r')
        axes[1].set_title("Residuals vs Distance")

        axes[2].hist(residuals, bins=25)
        axes[2].set_title("Residual Histogram")

        plt.tight_layout()
        plt.savefig("diagnostics.png")

    def predict(self, x_raw):
        return self.coeffs[0] + self.coeffs[1] * x_raw
```

*[Subtle issues: uses normal equations (squaring condition number); no WLS despite heteroscedasticity being identified; no outlier handling; linear model assumed without justification; projection interpretation not developed beyond the framing answer; no model comparison.]*

### Framing Feedback

**Criticism:** The student correctly identified the projection interpretation (B) and the heteroscedasticity concern (A) — both strong selections. However, the student chose A (normal equations) for the numerical stability question instead of B (QR factorization). The normal equations form A^T A, which has condition number cond(A)^2. For a calibration problem with x ranging from 0.5 to 30, cond(A) might be moderate, but squaring it is unnecessary when QR provides the same answer with cond(A) conditioning. This is a standard result in numerical linear algebra and an important practical consideration.

**Better Alternative:** Selecting B (QR factorization) demonstrates understanding that the normal equations are a mathematically equivalent but numerically inferior formulation. The QR approach preserves the conditioning of A itself.

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
| A | The normal equations A^T A beta = A^T b square the condition number of A, risking numerical precision loss |
| B | No outlier detection is implemented despite the problem mentioning "obviously wrong points" |
| C | The model is ordinary least squares, ignoring the heteroscedastic noise the student correctly identified |
| D | The design matrix includes only a linear term; no model comparison is performed |
| E | The residual histogram is not meaningful for assessing model quality |

**Student selects:** A, B, C *(correct -- D is also valid but the student catches the three most critical issues; E is incorrect)*

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Question:** What correction should be sent to the AI?

| Option | Text |
|--------|------|
| A | Switch to QR-based solving, add 3-sigma outlier detection, and implement weighted least squares with weights estimated from residual variance vs. distance |
| B | Switch to QR but keep OLS — weighting is not necessary for calibration |
| C | Add outlier detection only — the normal equations are fine for this problem size |
| D | Implement RANSAC for robust fitting, replacing the least-squares framework entirely |
| E | Use SVD-based pseudoinverse instead of both normal equations and QR |

**Student selects:** A

#### Updated AI Output

```python
import numpy as np
import matplotlib.pyplot as plt

class Calibrator:
    def __init__(self):
        self.coeffs = None
        self.outliers = None

    def fit(self, x_lidar, y_truth):
        x = np.array(x_lidar, dtype=float)
        y = np.array(y_truth, dtype=float)
        n = len(x)

        # Step 1: Initial OLS via QR for outlier detection
        A = np.column_stack([np.ones(n), x])
        Q, R = np.linalg.qr(A)
        beta0 = np.linalg.solve(R, Q.T @ y)

        resid0 = y - A @ beta0
        sigma0 = np.std(resid0)
        self.outliers = np.abs(resid0) > 3 * sigma0
        print(f"Outliers: {self.outliers.sum()} / {n}")

        # Clean data
        xc = x[~self.outliers]
        yc = y[~self.outliers]
        nc = len(xc)

        # Step 2: Estimate variance function from binned residuals
        Ac = np.column_stack([np.ones(nc), xc])
        Qc, Rc = np.linalg.qr(Ac)
        beta_ols = np.linalg.solve(Rc, Qc.T @ yc)
        resid_ols = yc - Ac @ beta_ols

        # Bin by distance
        n_bins = 8
        edges = np.linspace(xc.min(), xc.max(), n_bins + 1)
        bin_sigma = []
        bin_x = []
        for i in range(n_bins):
            mask = (xc >= edges[i]) & (xc < edges[i+1])
            if mask.sum() > 5:
                bin_sigma.append(np.std(resid_ols[mask]))
                bin_x.append((edges[i] + edges[i+1]) / 2)

        # Fit sigma(x) = a * x^b
        from scipy.optimize import curve_fit
        def power_law(x, a, b):
            return a * np.power(x, b)
        popt, _ = curve_fit(power_law, bin_x, bin_sigma, p0=[0.001, 1])
        print(f"Noise model: sigma(x) = {popt[0]:.4e} * x^{popt[1]:.2f}")

        # Step 3: WLS
        sigma_est = power_law(xc, *popt)
        W_sqrt = np.diag(1.0 / sigma_est)
        Aw = W_sqrt @ Ac
        bw = W_sqrt @ yc

        Qw, Rw = np.linalg.qr(Aw)
        self.coeffs = np.linalg.solve(Rw, Qw.T @ bw)

        resid_wls = yc - Ac @ self.coeffs
        rms = np.sqrt(np.mean(resid_wls**2))
        print(f"\nWLS model: y = {self.coeffs[0]:.6f} + {self.coeffs[1]:.6f} * x")
        print(f"RMS residual: {rms:.5f} m")

        # Projection interpretation
        # The WLS solution projects W^{1/2}b onto col(W^{1/2}A).
        # The weighted residual W^{1/2}r is orthogonal to col(W^{1/2}A).
        # If standardized residuals show no pattern, the projection
        # is well-captured by the current column space.

        return self.coeffs

    def predict(self, x_raw):
        return self.coeffs[0] + self.coeffs[1] * np.array(x_raw)
```

*[Remaining issues: linear model only, no model comparison; 3-sigma outlier rule not robust to masking; projection interpretation mentioned in comments but not connected to diagnostics.]*

#### Judging Feedback

**Criticism:** The student correctly identified three of four significant issues (A, B, C) and avoided the false positive (E). This is a solid performance. Missing D (no model comparison) is an important gap — the linear model is assumed without justification, and LIDAR calibration errors often have a nonlinear component. The student will need to address this in the next cycle.

**Better Alternative:** Selecting A, B, C, D would be complete. D is particularly relevant because the residual-vs-distance plot may reveal curvature that a linear model cannot capture.

**Grade:** B+

#### Steering Feedback

**Criticism:** Option A is the strongest choice and addresses all three identified issues. The QR factorization, outlier detection, and empirical variance estimation are all well-specified. However, option A uses a "3-sigma" outlier rule, which is not robust — if there are many outliers, they inflate sigma and mask themselves. Also, the instruction does not include model comparison (linear vs. polynomial). Option E (SVD pseudoinverse) is a valid alternative to QR but is not strictly better.

**Better Alternative:** Option A is correct. To strengthen: "Use MAD-based outlier detection instead of 3-sigma. After WLS, compare linear vs. quadratic models using AIC to verify the linear assumption."

**Grade:** B+

---

### Cycle 2

#### Current AI Output

*(The updated solution from Cycle 1.)*

#### Judging Sub-step

**Question:** Which issues remain? (Select all that apply)

| Option | Text |
|--------|------|
| A | The linear model is assumed without comparing against polynomial alternatives |
| B | The 3-sigma outlier detection rule is not robust to masking (many outliers inflate sigma) |
| C | The projection interpretation is in a comment but not connected to the diagnostic plots |
| D | The variance estimation uses only 8 bins, which may be too coarse |
| E | The QR factorization does not handle rank-deficient design matrices |

**Student selects:** A, B *(catches the two most important; C is valid but subtle; D and E are minor)*

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Question:** What correction should be sent?

| Option | Text |
|--------|------|
| A | Compare linear, quadratic, and cubic models using AIC; replace 3-sigma with MAD-based outlier detection |
| B | Just add quadratic terms to the design matrix without comparing |
| C | Replace OLS outlier detection with RANSAC and keep the linear model |
| D | Use cross-validation instead of AIC for model selection |
| E | Increase the number of variance bins to 20 |

**Student selects:** A

#### Updated AI Output

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit

class Calibrator:
    def __init__(self):
        self.coeffs = None
        self.degree = None
        self.outliers = None
        self.noise_params = None

    def fit(self, x_lidar, y_truth):
        x = np.array(x_lidar, dtype=float)
        y = np.array(y_truth, dtype=float)
        n = len(x)

        # --- Step 1: MAD-based outlier detection ---
        A_init = np.column_stack([np.ones(n), x])
        Q, R = np.linalg.qr(A_init)
        beta_init = np.linalg.solve(R, Q.T @ y)
        resid_init = y - A_init @ beta_init

        median_resid = np.median(resid_init)
        mad = np.median(np.abs(resid_init - median_resid))
        sigma_mad = 1.4826 * mad  # MAD to sigma conversion
        self.outliers = np.abs(resid_init - median_resid) > 4 * sigma_mad
        print(f"Outliers (MAD-based, 4σ): {self.outliers.sum()} / {n}")

        xc = x[~self.outliers]
        yc = y[~self.outliers]
        nc = len(xc)

        # --- Step 2: Model selection via AIC ---
        print("\nModel comparison:")
        best_aic = np.inf
        best_deg = 1

        for deg in [1, 2, 3]:
            cols = [xc**j for j in range(deg + 1)]
            A = np.column_stack(cols)
            Q, R = np.linalg.qr(A)
            beta = np.linalg.solve(R, Q.T @ yc)
            resid = yc - A @ beta
            rss = np.sum(resid**2)
            p = deg + 1
            aic = nc * np.log(rss / nc) + 2 * p
            print(f"  Degree {deg}: AIC={aic:.1f}, RMS={np.sqrt(rss/nc):.5f} m")
            if aic < best_aic:
                best_aic, best_deg = aic, deg

        self.degree = best_deg
        print(f"  Selected: degree {best_deg}")

        # --- Step 3: Variance estimation ---
        cols = [xc**j for j in range(self.degree + 1)]
        A = np.column_stack(cols)
        Q, R = np.linalg.qr(A)
        beta_ols = np.linalg.solve(R, Q.T @ yc)
        resid_ols = yc - A @ beta_ols

        n_bins = 10
        edges = np.linspace(xc.min(), xc.max(), n_bins + 1)
        bin_s, bin_c = [], []
        for i in range(n_bins):
            mask = (xc >= edges[i]) & (xc < edges[i+1])
            if mask.sum() > 5:
                bin_s.append(np.std(resid_ols[mask]))
                bin_c.append((edges[i] + edges[i+1]) / 2)

        def plaw(x, a, b):
            return a * np.power(x, b)
        popt, _ = curve_fit(plaw, bin_c, bin_s, p0=[0.001, 1])
        self.noise_params = popt
        print(f"Noise: σ(x) = {popt[0]:.4e} · x^{popt[1]:.2f}")

        # --- Step 4: WLS ---
        sigma_x = plaw(xc, *popt)
        W_sqrt = np.diag(1.0 / sigma_x)
        Aw = W_sqrt @ A
        bw = W_sqrt @ yc
        Qw, Rw = np.linalg.qr(Aw)
        self.coeffs = np.linalg.solve(Rw, Qw.T @ bw)

        resid_final = yc - A @ self.coeffs
        rms = np.sqrt(np.mean(resid_final**2))
        print(f"\nFinal WLS (degree {self.degree}):")
        for j, c in enumerate(self.coeffs):
            print(f"  β_{j} = {c:.8f}")
        print(f"RMS: {rms:.5f} m")

        # The least-squares solution projects b onto col(A).
        # The residual r = b - A*beta_hat lies in col(A)^⊥.
        # Structured residuals indicate model misspecification:
        # b has components outside the current column space.

    def predict(self, x_raw):
        x = np.array(x_raw)
        return sum(self.coeffs[j] * x**j for j in range(self.degree + 1))

    def plot_diagnostics(self, x_lidar, y_truth):
        x = np.array(x_lidar)
        y = np.array(y_truth)
        clean = ~self.outliers

        y_pred = self.predict(x)
        resid = y - y_pred

        fig, axes = plt.subplots(2, 3, figsize=(18, 10))

        # Fit plot
        axes[0,0].scatter(x[clean], y[clean], s=3, alpha=0.3, label='Clean')
        axes[0,0].scatter(x[self.outliers], y[self.outliers],
                         s=15, c='red', marker='x', label='Outlier')
        xline = np.linspace(x.min(), x.max(), 200)
        axes[0,0].plot(xline, self.predict(xline), 'r-', lw=2)
        axes[0,0].legend()
        axes[0,0].set_title(f"Degree-{self.degree} WLS Fit")

        # Raw residuals
        axes[0,1].scatter(x[clean], resid[clean], s=3, alpha=0.3)
        axes[0,1].axhline(0, color='r', linestyle='--')
        axes[0,1].set_title("Residuals vs Distance")

        # Standardized residuals
        sigma_x = self.noise_params[0] * x[clean]**self.noise_params[1]
        std_resid = resid[clean] / sigma_x
        axes[0,2].scatter(x[clean], std_resid, s=3, alpha=0.3)
        axes[0,2].axhline(0, color='r', linestyle='--')
        axes[0,2].axhline(2, color='gray', linestyle=':')
        axes[0,2].axhline(-2, color='gray', linestyle=':')
        axes[0,2].set_title("Standardized Residuals (should be flat)")

        # Histogram
        axes[1,0].hist(resid[clean], bins=30, edgecolor='black')
        axes[1,0].set_title("Residual Distribution")

        # Q-Q plot
        from scipy.stats import probplot
        probplot(std_resid, plot=axes[1,1])
        axes[1,1].set_title("Q-Q Plot")

        # Noise model
        axes[1,2].scatter(x[clean], np.abs(resid[clean]), s=3, alpha=0.3)
        xp = np.linspace(x.min(), x.max(), 100)
        axes[1,2].plot(xp, self.noise_params[0] * xp**self.noise_params[1],
                      'r-', lw=2, label=f'σ={self.noise_params[0]:.3e}·x^{self.noise_params[1]:.1f}')
        axes[1,2].legend()
        axes[1,2].set_title("Noise Model Fit")

        plt.tight_layout()
        plt.savefig("calibration_diagnostics.png", dpi=150)
        plt.show()
```

#### Judging Feedback

**Criticism:** The student correctly identified the two most impactful remaining issues: the rigid linear model assumption (A) and the fragile outlier detection (B). Both corrections led to substantive improvements in the solution. Missing C (projection interpretation disconnected from diagnostics) is a conceptual gap rather than a practical one, but it is central to the challenge's mathematical subject. The student has been stronger on practical/statistical concerns than on connecting them to the underlying linear algebra.

**Better Alternative:** Adding C: "The projection interpretation is stated in a comment but not connected to the plots. The standardized residual plot should be labeled 'checking if b has components outside col(A)' to make the geometric connection explicit."

**Grade:** B

#### Steering Feedback

**Criticism:** Option A is the strongest available choice. The MAD-based outlier detection is more robust than 3-sigma, and AIC model comparison is the standard approach for polynomial degree selection. The student has consistently chosen the strongest option throughout the session. The solution now has a complete pipeline: robust outlier detection, model selection, empirical variance estimation, WLS fitting, and comprehensive diagnostics.

**Better Alternative:** The selection is optimal. Minor improvement: "Also connect the standardized residual plot to the projection interpretation — a flat residual plot means b is well-captured by col(A); structure means the column space needs enrichment."

**Grade:** A-

---

### Cycle 3 — Final

#### Current AI Output

*(The updated solution from Cycle 2.)*

#### Judging Sub-step

**Question:** Is the solution now adequate?

| Option | Text |
|--------|------|
| A | Yes — the module handles outliers robustly, selects the model order via AIC, estimates the variance function empirically, and fits via WLS with QR for stability |
| B | No — the column space interpretation of residuals is still not connected to the diagnostics |
| C | No — the module should use cross-validation instead of AIC |
| D | No — the module should support multivariate calibration (multiple sensors) |
| E | No — the WLS should iterate (iteratively reweighted least squares) |

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
| **Steering** | A |

### Summary Feedback

The student demonstrated strong statistical reasoning and practical instincts across all cycles. The framing correctly identified the projection interpretation and the heteroscedasticity concern, though the numerical stability question was answered incorrectly (normal equations chosen over QR). Judging was consistent at the B level — the student reliably caught the most impactful practical issues (outliers, heteroscedasticity, model assumption) but tended to miss the deeper mathematical connections (the projection interpretation as a diagnostic tool). Steering was the strongest skill, with the student consistently selecting the most comprehensive correction option. The overall lesson for this challenge: least squares is fundamentally a projection operation, and every diagnostic (residual patterns, standardized residuals, Q-Q plots) is testing whether the projection onto col(A) adequately captures the structure of b. The student should develop the habit of interpreting practical diagnostics through this geometric lens.
