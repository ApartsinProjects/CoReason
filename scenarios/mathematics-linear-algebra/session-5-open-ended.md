# Session 5 — Open-Ended: Build a Multi-Sensor Fusion Calibration Module

**Challenge:** Write a calibration module that fits a correction model to paired LIDAR/laser-tracker readings using least squares and outputs a calibration function with residual diagnostics.

**Subject:** Inner Product Spaces > Projections > Least Squares

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Write a calibration module (Python function or class) that takes in paired readings from a LIDAR sensor and a ground-truth laser tracker, fits a correction model using least squares, and outputs a calibration function that maps raw LIDAR readings to corrected distances. Deliver the module, a diagnostic plot of residuals, and a summary of calibration accuracy. The lab has "several hundred paired measurements" spanning 0.5m to 30m. The engineer notes that "readings get noisier further out" and there may be "a few obviously wrong points from when someone walked through the beam."

### Student's Framing Response (Open-Ended)

**Assumption:** I will start with a linear correction model: y = beta_0 + beta_1 * x, where x is the LIDAR reading and y is the ground-truth distance. The design matrix is A = [1, x], the observation vector is b = y, and the parameter vector is beta = [beta_0, beta_1]^T.

**Specification:** I will solve the normal equations A^T A beta = A^T b to find the least-squares fit. The residuals r = b - A*beta should be examined for patterns indicating model misspecification.

**Clarification:** The engineer says "readings get noisier further out" — this suggests heteroscedastic errors (variance increases with distance). Should I use weighted least squares with weights inversely proportional to the variance at each distance?

**Gap:** The mention of "obviously wrong points" implies outliers. Ordinary least squares is sensitive to outliers. Should I use a robust regression method (e.g., RANSAC, Huber loss) or identify and remove outliers before fitting?

### AI Solution (Generated from Framing)

```python
import numpy as np
import matplotlib.pyplot as plt

class LidarCalibrator:
    def __init__(self):
        self.beta = None

    def fit(self, lidar_readings, ground_truth):
        """Fit linear calibration model via ordinary least squares."""
        x = np.array(lidar_readings)
        y = np.array(ground_truth)
        n = len(x)

        # Design matrix: [1, x]
        A = np.column_stack([np.ones(n), x])

        # Solve normal equations: A^T A beta = A^T b
        ATA = A.T @ A
        ATb = A.T @ y
        self.beta = np.linalg.solve(ATA, ATb)

        # Residuals
        y_pred = A @ self.beta
        residuals = y - y_pred

        # R-squared
        ss_res = np.sum(residuals**2)
        ss_tot = np.sum((y - y.mean())**2)
        r_squared = 1 - ss_res / ss_tot

        print(f"Calibration: y = {self.beta[0]:.4f} + {self.beta[1]:.4f} * x")
        print(f"R² = {r_squared:.6f}")
        print(f"RMS residual = {np.sqrt(ss_res/n):.4f} m")

        return self.beta, residuals

    def calibrate(self, raw_reading):
        return self.beta[0] + self.beta[1] * raw_reading

    def plot_diagnostics(self, lidar_readings, ground_truth):
        x = np.array(lidar_readings)
        y = np.array(ground_truth)
        y_pred = self.beta[0] + self.beta[1] * x
        residuals = y - y_pred

        fig, axes = plt.subplots(2, 2, figsize=(12, 10))

        # Fit plot
        axes[0,0].scatter(x, y, s=5, alpha=0.5)
        x_line = np.linspace(x.min(), x.max(), 100)
        axes[0,0].plot(x_line, self.beta[0] + self.beta[1]*x_line, 'r-')
        axes[0,0].set_xlabel("LIDAR reading (m)")
        axes[0,0].set_ylabel("Ground truth (m)")
        axes[0,0].set_title("Calibration Fit")

        # Residuals vs fitted
        axes[0,1].scatter(y_pred, residuals, s=5, alpha=0.5)
        axes[0,1].axhline(0, color='r', linestyle='--')
        axes[0,1].set_xlabel("Fitted values")
        axes[0,1].set_ylabel("Residuals")
        axes[0,1].set_title("Residuals vs Fitted")

        # Residuals vs distance
        axes[1,0].scatter(x, residuals, s=5, alpha=0.5)
        axes[1,0].axhline(0, color='r', linestyle='--')
        axes[1,0].set_xlabel("LIDAR reading (m)")
        axes[1,0].set_ylabel("Residuals")
        axes[1,0].set_title("Residuals vs Distance")

        # Histogram
        axes[1,1].hist(residuals, bins=30, edgecolor='black')
        axes[1,1].set_xlabel("Residual")
        axes[1,1].set_title("Residual Distribution")

        plt.tight_layout()
        plt.savefig("calibration_diagnostics.png")
        plt.show()
```

*[Subtle issues: solves normal equations via A^T A which squares the condition number (cond(A^T A) = cond(A)^2) -- should use QR factorization instead; no outlier handling despite the problem mentioning beam interruptions; no weighted least squares despite the heteroscedasticity concern the student raised; no model comparison (linear vs. quadratic vs. higher); the projection interpretation (b is projected onto col(A)) is not discussed.]*

### Framing Feedback

**Criticism:** The student made strong observations about heteroscedasticity and outliers, directly connecting the engineer's comments to mathematical concerns. The design matrix formulation is correct, and the student correctly identified that the normal equations give the least-squares solution. However, the student did not discuss the numerical stability of solving A^T A beta = A^T b directly — forming A^T A squares the condition number of A, which can cause loss of precision. The QR factorization approach (solving R beta = Q^T b) avoids this. The student also did not discuss the projection interpretation: the least-squares solution projects b onto the column space of A, and the residual r = b - A*beta is orthogonal to col(A). This geometric perspective is central to the challenge's subject (Inner Product Spaces > Projections).

**Better Alternative:** "The least-squares solution beta_hat minimizes ||b - A*beta||_2, which is equivalent to projecting b onto col(A). The residual r = b - A*beta_hat lies in col(A)^perp, and ||r||_2 = ||b||_2 * sin(theta) where theta is the angle between b and col(A). I will solve via QR factorization (A = QR, then R*beta = Q^T*b) rather than the normal equations, since cond(A^T A) = cond(A)^2 can amplify rounding errors. Given the heteroscedastic noise, I should use weighted least squares with W = diag(1/sigma_i^2)."

**Grade:** B

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### Current AI Output

*(The initial AI solution above.)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Error: The code solves the normal equations A^T A beta ="
    description: "Error: The code solves the normal equations A^T A beta = A^T b by forming A^T A explicitly. This squares the condition number: if cond(A) = 10^4, then cond(A^T A) = 10^8, losing 8 digits of precision instead of 4. For a well-scaled calibration problem this may be acceptable, but it is poor practice. The QR factorization approach (A = QR, solve R*beta = Q^T*b) is numerically superior and should be used. Gap:** The engineer explicitly said"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Instruction:** Replace the normal equations with"
    description: "Instruction:** Replace the normal equations with QR-based solving: compute A = QR via `numpy.linalg.qr`, then solve R*beta = Q^T*b via back-substitution. Add outlier detection: flag points where |residual| > 3*sigma and refit without them. Then implement weighted least squares with weights w_i = 1/x_i^2 (variance proportional to distance squared) for the clean data."

#### Updated AI Output

```python
import numpy as np
import matplotlib.pyplot as plt

class LidarCalibrator:
    def __init__(self):
        self.beta = None
        self.outlier_mask = None

    def fit(self, lidar_readings, ground_truth):
        x = np.array(lidar_readings, dtype=float)
        y = np.array(ground_truth, dtype=float)
        n = len(x)

        A = np.column_stack([np.ones(n), x])

        # --- Step 1: Initial OLS fit via QR ---
        Q, R = np.linalg.qr(A)
        beta_init = np.linalg.solve(R, Q.T @ y)

        # --- Step 2: Outlier detection ---
        resid_init = y - A @ beta_init
        sigma = np.std(resid_init)
        self.outlier_mask = np.abs(resid_init) > 3 * sigma
        n_outliers = np.sum(self.outlier_mask)
        print(f"Detected {n_outliers} outliers (|residual| > 3σ = {3*sigma:.4f} m)")

        # Clean data
        x_clean = x[~self.outlier_mask]
        y_clean = y[~self.outlier_mask]
        n_clean = len(x_clean)

        # --- Step 3: Weighted least squares on clean data ---
        # Weights: w_i = 1/x_i^2 (variance ~ distance^2)
        # WLS: minimize sum w_i * (y_i - a - b*x_i)^2
        # Equivalent to OLS on W^{1/2} A beta = W^{1/2} b
        W_sqrt = np.diag(1.0 / x_clean)  # sqrt of w_i = 1/x_i
        A_clean = np.column_stack([np.ones(n_clean), x_clean])
        A_w = W_sqrt @ A_clean
        b_w = W_sqrt @ y_clean

        Q_w, R_w = np.linalg.qr(A_w)
        self.beta = np.linalg.solve(R_w, Q_w.T @ b_w)

        # Diagnostics on original scale
        y_pred = A_clean @ self.beta
        residuals = y_clean - y_pred
        rms = np.sqrt(np.mean(residuals**2))

        print(f"\nWLS Calibration: y = {self.beta[0]:.6f} + {self.beta[1]:.6f} * x")
        print(f"RMS residual (clean data): {rms:.4f} m")
        print(f"Condition number of A: {np.linalg.cond(A_clean):.1f}")
        print(f"Condition number of A^T A: {np.linalg.cond(A_clean.T @ A_clean):.1f}")

        return self.beta

    def calibrate(self, raw_reading):
        return self.beta[0] + self.beta[1] * raw_reading

    def plot_diagnostics(self, lidar_readings, ground_truth):
        x = np.array(lidar_readings)
        y = np.array(ground_truth)
        y_pred = self.beta[0] + self.beta[1] * x
        residuals = y - y_pred

        fig, axes = plt.subplots(2, 2, figsize=(12, 10))

        # Fit with outliers highlighted
        axes[0,0].scatter(x[~self.outlier_mask], y[~self.outlier_mask],
                         s=5, alpha=0.5, label='Clean')
        axes[0,0].scatter(x[self.outlier_mask], y[self.outlier_mask],
                         s=20, c='red', marker='x', label='Outliers')
        xline = np.linspace(x.min(), x.max(), 100)
        axes[0,0].plot(xline, self.beta[0] + self.beta[1]*xline, 'r-')
        axes[0,0].set_xlabel("LIDAR (m)")
        axes[0,0].set_ylabel("Ground truth (m)")
        axes[0,0].legend()
        axes[0,0].set_title("Calibration Fit")

        # Residuals vs distance (clean only)
        clean = ~self.outlier_mask
        axes[0,1].scatter(x[clean], residuals[clean], s=5, alpha=0.5)
        axes[0,1].axhline(0, color='r', linestyle='--')
        axes[0,1].set_xlabel("Distance (m)")
        axes[0,1].set_ylabel("Residual (m)")
        axes[0,1].set_title("Residuals vs Distance")

        # Standardized residuals
        std_resid = residuals[clean] / np.std(residuals[clean])
        axes[1,0].scatter(x[clean], std_resid, s=5, alpha=0.5)
        axes[1,0].axhline(0, color='r', linestyle='--')
        axes[1,0].axhline(2, color='gray', linestyle=':')
        axes[1,0].axhline(-2, color='gray', linestyle=':')
        axes[1,0].set_xlabel("Distance (m)")
        axes[1,0].set_ylabel("Standardized residual")
        axes[1,0].set_title("Standardized Residuals")

        # QQ plot
        from scipy.stats import probplot
        probplot(residuals[clean], plot=axes[1,1])
        axes[1,1].set_title("Normal Q-Q Plot")

        plt.tight_layout()
        plt.savefig("calibration_diagnostics.png")
        plt.show()
```

The least-squares solution projects b onto the column space of A: beta_hat = argmin ||b - A*beta||_2, and the residual r = b - A*beta_hat is orthogonal to col(A). Using QR factorization preserves the condition number (cond(R) = cond(A)) rather than squaring it.

*[Remaining issues: linear model assumed without comparison to quadratic; 3-sigma outlier rule is simplistic (not robust to masking effect); the weight function w_i = 1/x_i^2 assumes variance scales as x^2 without verification; no model selection comparison; the projection interpretation is mentioned but not fully developed.]*

#### Judging Feedback

**Criticism:** The student identified the three most important issues: numerical stability (normal equations vs. QR), heteroscedasticity, and outliers. Each was clearly explained with the correct mathematical reasoning (condition number squaring, variance growing with distance, squared-loss sensitivity to outliers). This is strong, technically precise judging. The student could have additionally questioned whether a linear model is adequate or whether a quadratic or higher-order model should be compared.

**Better Alternative:** Adding: "Gap: The model is assumed linear (y = beta_0 + beta_1 * x) without comparing against quadratic (y = beta_0 + beta_1 * x + beta_2 * x^2) or other models. LIDAR systematic errors often have nonlinear components. The choice of design matrix columns should be justified by comparing residual patterns and using AIC/BIC for model selection."

**Grade:** A-

#### Steering Feedback

**Criticism:** The QR instruction was technically correct and specific. The outlier detection (3-sigma rule) is a reasonable first approach, though it is not robust — if there are many outliers, they inflate sigma and mask themselves. A more robust approach would use median absolute deviation (MAD) or an iterative method. The WLS weights w_i = 1/x_i^2 are a reasonable assumption (variance proportional to distance squared) but were stated as fact rather than as a hypothesis to be verified from the residual plot. The student did not request model comparison.

**Better Alternative:** "Use QR for numerical stability. For outlier detection, use an iterative approach or MAD-based threshold rather than a simple 3-sigma rule. For WLS, fit the variance function from the residuals (e.g., plot |residuals| vs. x and fit a power law) rather than assuming 1/x^2. Compare linear, quadratic, and cubic models using AIC or cross-validation."

**Grade:** B

---

### Cycle 2

#### Current AI Output

*(The updated solution from Cycle 1.)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap: The model is locked to a linear fit (y = beta_0 + beta_1 * x)"
    description: "Gap: The model is locked to a linear fit (y = beta_0 + beta_1 * x). LIDAR sensors often have nonlinear systematic errors — for instance, a small quadratic term from lens distortion or signal processing. The design matrix should include a quadratic column [1, x, x^2] at minimum, and the choice between linear and quadratic should be justified by comparing residual patterns or information criteria. Error:** The weight function w_i = 1/x_i^2 was assumed without verification. The correct approach is to estimate the variance function from the data: fit |residuals| vs. x and determine the functional form of sigma(x). The weights should then be w_i = 1/sigma(x_i)^2."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Instruction:** Compare three models: linear (A = [1"
    description: "Instruction:** Compare three models: linear (A = [1, x]), quadratic (A = [1, x, x^2]), and cubic (A = [1, x, x^2, x^3]). For each, compute AIC = n*ln(RSS/n) + 2p where p is the number of parameters. Select the model with lowest AIC. Also, instead of assuming w_i = 1/x_i^2, estimate the variance function by binning residuals by distance and fitting sigma(x) = a * x^b to the bin standard deviations."

#### Updated AI Output

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit

class LidarCalibrator:
    def __init__(self):
        self.beta = None
        self.degree = None
        self.outlier_mask = None
        self.variance_params = None

    def fit(self, lidar_readings, ground_truth):
        x = np.array(lidar_readings, dtype=float)
        y = np.array(ground_truth, dtype=float)
        n = len(x)

        # --- Step 1: Initial linear OLS for outlier detection ---
        A_lin = np.column_stack([np.ones(n), x])
        Q, R = np.linalg.qr(A_lin)
        beta_init = np.linalg.solve(R, Q.T @ y)
        resid_init = y - A_lin @ beta_init

        # Outlier detection via MAD (more robust than 3-sigma)
        mad = np.median(np.abs(resid_init - np.median(resid_init)))
        threshold = 5 * 1.4826 * mad  # 1.4826 converts MAD to sigma-equivalent
        self.outlier_mask = np.abs(resid_init - np.median(resid_init)) > threshold
        n_out = np.sum(self.outlier_mask)
        print(f"Outliers detected (MAD-based): {n_out} / {n}")

        x_c = x[~self.outlier_mask]
        y_c = y[~self.outlier_mask]
        nc = len(x_c)

        # --- Step 2: Model selection via AIC ---
        print("\nModel comparison (AIC):")
        best_aic = np.inf
        best_degree = 1

        for degree in [1, 2, 3]:
            cols = [x_c**j for j in range(degree + 1)]
            A = np.column_stack(cols)
            Q, R = np.linalg.qr(A)
            beta = np.linalg.solve(R, Q.T @ y_c)
            resid = y_c - A @ beta
            rss = np.sum(resid**2)
            p = degree + 1
            aic = nc * np.log(rss / nc) + 2 * p

            print(f"  Degree {degree}: AIC = {aic:.2f}, "
                  f"RMS = {np.sqrt(rss/nc):.5f} m, params = {p}")

            if aic < best_aic:
                best_aic = aic
                best_degree = degree

        self.degree = best_degree
        print(f"\nSelected model: degree {best_degree}")

        # --- Step 3: Variance estimation ---
        # Fit initial model to get residuals for variance estimation
        cols = [x_c**j for j in range(self.degree + 1)]
        A = np.column_stack(cols)
        Q, R = np.linalg.qr(A)
        beta_ols = np.linalg.solve(R, Q.T @ y_c)
        resid_ols = y_c - A @ beta_ols

        # Bin residuals by distance
        n_bins = 10
        bin_edges = np.linspace(x_c.min(), x_c.max(), n_bins + 1)
        bin_stds = []
        bin_centers = []
        for i in range(n_bins):
            mask = (x_c >= bin_edges[i]) & (x_c < bin_edges[i+1])
            if np.sum(mask) > 5:
                bin_stds.append(np.std(resid_ols[mask]))
                bin_centers.append((bin_edges[i] + bin_edges[i+1]) / 2)

        # Fit sigma(x) = a * x^b
        def power_law(x, a, b):
            return a * x**b

        popt, _ = curve_fit(power_law, bin_centers, bin_stds, p0=[0.001, 1.0])
        self.variance_params = popt
        print(f"Variance model: σ(x) = {popt[0]:.4e} * x^{popt[1]:.2f}")

        # --- Step 4: Weighted least squares ---
        sigma_est = power_law(x_c, *popt)
        W_sqrt = np.diag(1.0 / sigma_est)
        A_w = W_sqrt @ A
        b_w = W_sqrt @ y_c

        Q_w, R_w = np.linalg.qr(A_w)
        self.beta = np.linalg.solve(R_w, Q_w.T @ b_w)

        y_pred = A @ self.beta
        resid_final = y_c - y_pred
        rms = np.sqrt(np.mean(resid_final**2))

        print(f"\nFinal WLS calibration (degree {self.degree}):")
        for i, b in enumerate(self.beta):
            print(f"  β_{i} = {b:.8f}")
        print(f"RMS residual: {rms:.5f} m")

        return self.beta

    def calibrate(self, raw_reading):
        x = np.array(raw_reading)
        return sum(self.beta[j] * x**j for j in range(self.degree + 1))

    def plot_diagnostics(self, lidar_readings, ground_truth):
        x = np.array(lidar_readings)
        y = np.array(ground_truth)
        y_pred = self.calibrate(x)
        residuals = y - y_pred
        clean = ~self.outlier_mask

        fig, axes = plt.subplots(2, 3, figsize=(18, 10))

        # Fit
        axes[0,0].scatter(x[clean], y[clean], s=3, alpha=0.3, label='Clean')
        axes[0,0].scatter(x[self.outlier_mask], y[self.outlier_mask],
                         s=15, c='red', marker='x', label='Outliers')
        xline = np.linspace(x.min(), x.max(), 200)
        axes[0,0].plot(xline, self.calibrate(xline), 'r-', linewidth=2)
        axes[0,0].legend()
        axes[0,0].set_title(f"Degree-{self.degree} WLS Fit")

        # Residuals vs distance
        axes[0,1].scatter(x[clean], residuals[clean], s=3, alpha=0.3)
        axes[0,1].axhline(0, color='r', linestyle='--')
        axes[0,1].set_title("Residuals vs Distance")

        # Standardized residuals (by estimated sigma)
        from scipy.optimize import curve_fit
        sigma_x = self.variance_params[0] * x[clean]**self.variance_params[1]
        std_resid = residuals[clean] / sigma_x
        axes[0,2].scatter(x[clean], std_resid, s=3, alpha=0.3)
        axes[0,2].axhline(0, color='r', linestyle='--')
        axes[0,2].axhline(2, color='gray', linestyle=':')
        axes[0,2].axhline(-2, color='gray', linestyle=':')
        axes[0,2].set_title("Weighted Standardized Residuals")

        # Variance model
        axes[1,0].set_title("Variance Model")
        # (plot bin stds vs power law fit)

        # Histogram
        axes[1,1].hist(residuals[clean], bins=30, edgecolor='black')
        axes[1,1].set_title("Residual Distribution")

        # QQ plot
        from scipy.stats import probplot
        probplot(std_resid, plot=axes[1,2])
        axes[1,2].set_title("Q-Q Plot (Standardized)")

        plt.tight_layout()
        plt.savefig("calibration_diagnostics.png", dpi=150)
        plt.show()
```

#### Judging Feedback

**Criticism:** The student correctly identified both remaining issues: the rigid linear model and the unverified variance assumption. The AIC-based model comparison is the right tool for selecting polynomial degree, and estimating the variance function from binned residuals is more principled than assuming a specific form. This round of judging shows the student thinking systematically about the statistical modeling pipeline.

**Better Alternative:** The student could additionally have noted that the projection interpretation of least squares is still underdeveloped in the AI's output. The solution mentions it briefly but does not connect it to the diagnostics: e.g., "the residual vector r lies in col(A)^perp, so if we see structure in the residuals (patterns in the residual-vs-distance plot), it means b has a component outside col(A), indicating the model is misspecified."

**Grade:** B+

#### Steering Feedback

**Criticism:** The AIC model comparison instruction was well-specified with concrete formulas and polynomial degrees. The variance estimation approach (binning + power law fit) is statistically sound. However, the student specified w_i = 1/x_i^2 in Cycle 1 and now correctly switched to estimating sigma(x) empirically — this is good self-correction. The student did not address the projection geometry of least squares, which is the core mathematical content of the challenge's subject area (Inner Product Spaces > Projections).

**Better Alternative:** Add: "In the diagnostic output, note that the WLS solution projects W^{1/2}b onto col(W^{1/2}A). If the standardized residuals (after weighting) show patterns, it means the weighted observation vector has components outside the weighted column space, indicating model misspecification. Plot the standardized residuals to verify that the weighting has eliminated the heteroscedasticity."

**Grade:** B+

---

### Cycle 3 — Final

#### Current AI Output

*(The updated solution from Cycle 2.)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap:** The projection interpretation is mentioned in"
    description: "Gap:** The projection interpretation is mentioned in passing but not connected to the diagnostics. The core insight — that the residual r lies in col(A)^perp, and patterns in r indicate components of b outside col(A) — should be explicitly stated and tied to the residual plots. If the standardized residuals show no pattern, the projection is well-captured; if they show structure, the column space needs to be expanded (higher-degree polynomial)."

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
| **Steering** | B |

### Summary Feedback

The student demonstrated solid statistical reasoning throughout, correctly identifying heteroscedasticity, outlier sensitivity, and the normal equations' numerical weakness. The progression from OLS to outlier-robust fitting to WLS with empirical variance estimation to AIC-based model selection shows a mature understanding of the least-squares modeling pipeline. The main weakness is the underemphasis on the projection geometry that is central to the challenge's mathematical subject: the student treated least squares as a computational procedure (minimize ||r||^2) rather than as a geometric operation (project b onto col(A)). The connection between residual diagnostics and the projection — structured residuals mean b has components outside col(A), indicating model misspecification — was identified only in the final cycle and never fully developed. For this subject (Inner Product Spaces > Projections), the framing should lead with the projection interpretation and use it as the lens through which all subsequent analysis (model selection, residual diagnostics, weighted formulations) is understood.
