# Session 3 — Multiple Choice: Create an Interactive SVD Image Compressor Demo

**Challenge:** Build an interactive demo where a user uploads a grayscale image, selects rank k via a slider, and sees the original vs. rank-k SVD approximation with compression ratio and error metric.

**Subject:** Matrix Decompositions > SVD > Geometric Interpretation

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Build a web-based (or Jupyter notebook) interactive demo where a user uploads a grayscale image, selects a rank k via a slider, and sees side-by-side the original image and the rank-k SVD approximation along with the compression ratio and an error metric. Deliver the working demo and a short technical document explaining the geometric meaning of each singular value. The demo should "work well for typical photos" and show "how the image builds up as you add more singular values."

### Student's Framing Response (Multiple Choice)

**Question:** What does the SVD A = U Sigma V^T represent geometrically?

| Option | Text |
|--------|------|
| A | A decomposition into three rotations applied in sequence |
| B | A decomposition into rotation (V^T), anisotropic scaling (Sigma), and rotation (U) -- mapping the unit sphere to an ellipsoid |
| C | A diagonalization A = P D P^{-1} that reveals the eigenvalues |
| D | A factorization into symmetric and skew-symmetric parts |
| E | A projection onto the column space followed by a scaling |

**Student selects:** B *(correct)*

**Question:** What does each singular value sigma_i represent geometrically?

| Option | Text |
|--------|------|
| A | The eigenvalue of A^T A |
| B | The angle of rotation in the i-th coordinate plane |
| C | The length of the i-th semi-axis of the ellipsoid that is the image of the unit sphere under A |
| D | The i-th diagonal entry of A |
| E | The projection of A onto the i-th coordinate axis |

**Student selects:** A *(incorrect -- sigma_i is the square root of the eigenvalue of A^T A, but the geometric meaning is the semi-axis length; the student picked the algebraic characterization, not the geometric one)*

**Question:** When truncating to rank k, what happens geometrically?

| Option | Text |
|--------|------|
| A | The first k rows of the image are kept and the rest are discarded |
| B | The ellipsoid is projected onto its k longest semi-axes; the remaining dimensions are collapsed to zero |
| C | The matrix is rotated to align with the coordinate axes |
| D | The k smallest singular values are amplified to match the largest |
| E | The transformation becomes invertible |

**Student selects:** B *(correct)*

### AI Solution (Generated from Framing)

```python
import numpy as np
import matplotlib.pyplot as plt
from ipywidgets import interact, IntSlider
from PIL import Image

def svd_compressor(image_path):
    img = np.array(Image.open(image_path).convert('L'), dtype=float)
    m, n = img.shape

    U, S, Vt = np.linalg.svd(img, full_matrices=False)

    def display(k=10):
        Ak = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]

        compression = k * (m + n + 1) / (m * n)
        # Error: eigenvalue of A^T A interpretation
        # sigma_i^2 is the i-th eigenvalue of A^T A
        energy_kept = np.sum(S[:k]**2) / np.sum(S**2)

        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
        ax1.imshow(img, cmap='gray')
        ax1.set_title("Original")
        ax2.imshow(Ak, cmap='gray')
        ax2.set_title(f"Rank {k}")
        plt.suptitle(f"Compression: {compression:.1%} | Energy: {energy_kept:.1%}")
        plt.show()

    interact(display, k=IntSlider(min=1, max=min(m,n), step=1, value=10))

# The singular values are the eigenvalues of A^T A (after taking
# square roots). Each sigma_i measures how much variance the i-th
# component captures.
```

*[Subtle issues: geometric interpretation reduced to eigenvalue/variance language rather than ellipsoidal geometry; no clipping of pixel values; no Frobenius error metric shown; no build-up visualization; conflates SVD geometric meaning with PCA variance language; vmin/vmax not set in imshow.]*

### Framing Feedback

**Criticism:** The student correctly identified the rotation-scaling-rotation decomposition (B) and the rank-k truncation geometry (B). However, the student selected A for the singular value question -- while it is algebraically true that sigma_i^2 is an eigenvalue of A^T A, the question asked for the *geometric* meaning, which is the semi-axis length of the ellipsoid (option C). This distinction matters because the challenge specifically requires a geometric explanation. The AI's solution reflects this confusion, producing an explanation centered on eigenvalues and variance rather than ellipsoidal geometry.

**Better Alternative:** Selecting C would demonstrate that the student distinguishes between algebraic characterizations (eigenvalues of A^T A) and geometric interpretations (semi-axis lengths). This distinction is the core of the challenge.

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
| A | The geometric interpretation describes singular values as eigenvalue-derived quantities rather than as semi-axis lengths of the image ellipsoid |
| B | Pixel values in the reconstruction are not clipped to [0, 255], causing potential display artifacts |
| C | The SVD computation uses full_matrices=False, which loses information |
| D | No Frobenius-norm error metric is displayed -- only "energy" (variance fraction) is shown |
| E | The demo does not show the image "building up" as singular values are added, which the problem requires |

**Student selects:** A, B, D, E *(correct -- C is wrong since full_matrices=False is fine for the economy SVD)*

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Question:** What correction should be sent to the AI?

| Option | Text |
|--------|------|
| A | Rewrite the geometric explanation to describe sigma_i as the semi-axis length of the ellipsoid A(S^{n-1}), add pixel clipping, show ||A - A_k||_F / ||A||_F as the error, and add a build-up grid |
| B | Just fix the pixel clipping issue; the rest is fine |
| C | Replace the SVD with eigendecomposition of A^T A since the student identified the eigenvalue connection |
| D | Add a build-up animation only; the geometric explanation is adequate |
| E | Switch to full_matrices=True for better accuracy |

**Student selects:** A

#### Updated AI Output

```python
import numpy as np
import matplotlib.pyplot as plt
from ipywidgets import interact, IntSlider
from PIL import Image

def svd_compressor(image_path):
    img = np.array(Image.open(image_path).convert('L'), dtype=float)
    m, n = img.shape

    U, S, Vt = np.linalg.svd(img, full_matrices=False)

    # === Interactive slider ===
    def display(k=10):
        Ak = np.clip(U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :], 0, 255)
        compression = k * (m + n + 1) / (m * n)
        rel_error = np.sqrt(np.sum(S[k:]**2)) / np.sqrt(np.sum(S**2))

        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
        ax1.imshow(img, cmap='gray', vmin=0, vmax=255)
        ax1.set_title("Original")
        ax2.imshow(Ak, cmap='gray', vmin=0, vmax=255)
        ax2.set_title(f"Rank-{k}")
        plt.suptitle(
            f"Storage: {compression:.1%} of original | "
            f"||A-A_k||_F / ||A||_F = {rel_error:.4f}"
        )
        plt.show()

    interact(display, k=IntSlider(min=1, max=min(m,n), step=1, value=10))

    # === Build-up grid ===
    ranks = [1, 2, 5, 10, 25, 50, 100, min(m, n)]
    ranks = [r for r in ranks if r <= min(m, n)]
    fig, axes = plt.subplots(2, len(ranks)//2, figsize=(16, 8))
    for ax, r in zip(axes.flat, ranks):
        Ar = np.clip(U[:, :r] @ np.diag(S[:r]) @ Vt[:r, :], 0, 255)
        ax.imshow(Ar, cmap='gray', vmin=0, vmax=255)
        ax.set_title(f"k={r}")
        ax.axis('off')
    plt.suptitle("Build-Up: How the Image Emerges as Singular Values Are Added")
    plt.tight_layout()
    plt.show()
```

**Geometric Meaning of Singular Values:**

The SVD decomposes A = U Sigma V^T into three geometric operations applied to any vector x:
1. V^T rotates/reflects x in R^n (domain)
2. Sigma stretches along each axis by factor sigma_i
3. U rotates/reflects the result in R^m (codomain)

The image of the unit sphere under A is an ellipsoid. The singular value sigma_i is the length of the i-th semi-axis of this ellipsoid. The directions of these semi-axes in the output space are the columns of U; the corresponding input directions are the columns of V.

Truncating to rank k keeps the k longest semi-axes and collapses the rest. By the Eckart-Young theorem:

||A - A_k||_F^2 = sigma_{k+1}^2 + ... + sigma_r^2

The error is precisely the sum of the squared lengths of the discarded semi-axes.

*[Remaining issues: does not distinguish SVD from eigendecomposition; no singular value spectrum plot; does not discuss what happens for rank-deficient images.]*

#### Judging Feedback

**Criticism:** Excellent judging -- the student correctly identified four of four real issues and avoided the false positive (C). Identifying all of A, B, D, and E shows both geometric understanding and practical awareness. This is a significant improvement from the framing phase, where the student confused the algebraic and geometric characterizations of singular values.

**Better Alternative:** The selection is already optimal for the given options.

**Grade:** A

#### Steering Feedback

**Criticism:** Option A is the comprehensive choice and the student correctly selected it. It addresses all four identified issues in a single coherent instruction. The resulting AI output is substantially improved: proper geometric explanation, clipped pixels, Frobenius error metric, and a build-up grid. Well done.

**Better Alternative:** Option A is the best available. To go further, the student could have also requested a singular value spectrum plot and a note distinguishing SVD from eigendecomposition.

**Grade:** A-

---

### Cycle 2

#### Current AI Output

*(The updated solution from Cycle 1.)*

#### Judging Sub-step

**Question:** Which issues remain? (Select all that apply)

| Option | Text |
|--------|------|
| A | The geometric explanation does not clarify how SVD differs from eigendecomposition for non-symmetric matrices |
| B | There is no plot of the singular value spectrum sigma_1, sigma_2, ..., to show the decay rate |
| C | The build-up grid hardcodes specific rank values rather than spacing them adaptively based on the spectrum |
| D | The Eckart-Young theorem is stated without noting it requires the Frobenius norm (it also holds for the 2-norm but with a different formula) |
| E | The demo does not handle color images |

**Student selects:** A, B *(reasonable -- C and D are minor; E is out of scope)*

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Question:** What correction should be sent?

| Option | Text |
|--------|------|
| A | Add a note: "Unlike eigendecomposition (A = PDP^{-1}), the SVD uses two different orthonormal bases U and V. Eigendecomposition requires A to be square and uses a single basis of eigenvectors; the SVD works for any m x n matrix." Also add a singular value spectrum plot. |
| B | Replace the SVD explanation with an eigendecomposition explanation since they are equivalent |
| C | Add color image support |
| D | Remove the Eckart-Young reference to simplify the explanation |
| E | Add only the spectrum plot; the eigendecomposition distinction is not important |

**Student selects:** A

#### Updated AI Output

*(Previous code plus the following additions:)*

```python
    # === Singular value spectrum ===
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
    ax1.semilogy(S, 'b-', linewidth=0.5)
    ax1.set_xlabel("Index i")
    ax1.set_ylabel("sigma_i (log scale)")
    ax1.set_title("Singular Value Spectrum")

    cumulative = np.cumsum(S**2) / np.sum(S**2)
    ax2.plot(cumulative, 'r-')
    ax2.set_xlabel("Rank k")
    ax2.set_ylabel("Fraction of ||A||_F^2 retained")
    ax2.set_title("Cumulative Energy")
    ax2.axhline(y=0.95, color='gray', linestyle='--', label='95%')
    ax2.legend()
    plt.tight_layout()
    plt.show()
```

**SVD vs. Eigendecomposition:**

Unlike eigendecomposition A = P D P^{-1}, which requires A to be square and diagonalizable, the SVD exists for *any* m x n matrix. The SVD uses two different orthonormal bases: V for the domain R^n and U for the codomain R^m. Eigendecomposition uses a single basis of eigenvectors and produces eigenvalues that can be negative or complex. Singular values are always real and non-negative, which is why they admit a clean geometric interpretation as stretching factors.

For a symmetric positive-definite matrix, the SVD and eigendecomposition coincide: sigma_i = lambda_i and U = V = P. For general matrices, they are distinct decompositions with different geometric meanings.

#### Judging Feedback

**Criticism:** The student correctly identified the two most pedagogically important remaining gaps: the SVD/eigendecomposition distinction and the missing spectrum plot. Both are directly relevant to the challenge's educational goals. The student appropriately skipped the minor issues (C, D, E).

**Better Alternative:** The selection is strong. Adding D (Eckart-Young norm specificity) would be a nice touch but is a minor point for this context.

**Grade:** B+

#### Steering Feedback

**Criticism:** Option A is the best choice and the student selected it. The resulting additions -- the SVD vs. eigendecomposition note and the singular value spectrum plot -- are exactly what was needed. The note correctly highlights the key differences (two bases vs. one, any matrix vs. square diagonalizable, non-negative real vs. complex).

**Better Alternative:** The selection is optimal for the available options.

**Grade:** A-

---

### Cycle 3 — Final

#### Current AI Output

*(The fully updated solution from Cycle 2.)*

#### Judging Sub-step

**Question:** Is the solution now adequate?

| Option | Text |
|--------|------|
| A | Yes -- the demo has interactive visualization, build-up grid, spectrum plot, proper geometric explanation, and SVD/eigendecomposition distinction |
| B | No -- it needs to handle rank-deficient images specially |
| C | No -- it needs PSNR as an additional error metric |
| D | No -- it needs an animation instead of a grid |
| E | No -- the technical document is not formatted as a separate file |

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

The student showed a striking improvement arc. Framing was hampered by confusing the algebraic characterization of singular values (eigenvalues of A^T A) with the geometric one (semi-axis lengths), resulting in an AI solution that echoed this confusion. However, the student quickly corrected course in the Judge+Steer phase. Cycle 1 judging was excellent -- identifying all four real issues while avoiding the false positive. Steering selections were consistently the strongest available option. By the end, the solution includes proper geometric interpretation, pixel clipping, Frobenius error, build-up grid, singular value spectrum, and SVD/eigendecomposition distinction. The key lesson: algebraic characterizations ("sigma_i^2 is an eigenvalue of A^T A") and geometric interpretations ("sigma_i is a semi-axis length") are different things, and the problem context determines which is appropriate.
