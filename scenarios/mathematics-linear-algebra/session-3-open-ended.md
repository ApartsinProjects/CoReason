# Session 3 — Open-Ended: Create an Interactive SVD Image Compressor Demo

**Challenge:** Build an interactive demo where a user uploads a grayscale image, selects rank k via a slider, and sees the original vs. rank-k SVD approximation with compression ratio and error metric.

**Subject:** Matrix Decompositions > SVD > Geometric Interpretation

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Build a web-based (or Jupyter notebook) interactive demo where a user uploads a grayscale image, selects a rank k via a slider, and sees side-by-side the original image and the rank-k SVD approximation along with the compression ratio and an error metric. Deliver the working demo and a short technical document explaining the geometric meaning of each singular value. The demo should "work well for typical photos" and show "how the image builds up as you add more singular values."

### Student's Framing Response (Open-Ended)

**Assumption:** A grayscale image of size m x n has full rank min(m, n) in general, so any k < min(m, n) is a valid truncation.

**Specification:** The demo will compute U, Sigma, V^T via `numpy.linalg.svd` and reconstruct rank-k approximations as A_k = sum_{i=1}^{k} sigma_i u_i v_i^T. The compression ratio will be computed as k(m + n + 1) / (m * n), and the error will be the relative Frobenius norm ||A - A_k||_F / ||A||_F.

**Gap:** The problem asks for the "geometric meaning of each singular value" but does not specify the audience's background. I assume an undergraduate linear algebra level.

### AI Solution (Generated from Framing)

```python
import numpy as np
import matplotlib.pyplot as plt
from ipywidgets import interact, IntSlider
from PIL import Image

def svd_demo(image_path):
    img = np.array(Image.open(image_path).convert('L'), dtype=float)
    m, n = img.shape

    U, S, Vt = np.linalg.svd(img, full_matrices=False)

    def show_rank_k(k=10):
        # Rank-k approximation
        Ak = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]

        # Compression ratio
        original_storage = m * n
        compressed_storage = k * (m + n + 1)
        ratio = compressed_storage / original_storage

        # Error
        error = np.linalg.norm(img - Ak, 'fro') / np.linalg.norm(img, 'fro')

        fig, axes = plt.subplots(1, 2, figsize=(12, 5))
        axes[0].imshow(img, cmap='gray', vmin=0, vmax=255)
        axes[0].set_title("Original")
        axes[1].imshow(Ak, cmap='gray', vmin=0, vmax=255)
        axes[1].set_title(f"Rank-{k} Approximation")
        plt.suptitle(f"Compression: {ratio:.2%} of original | Error: {error:.4f}")
        plt.show()

    interact(show_rank_k, k=IntSlider(min=1, max=min(m, n), step=1, value=10))

# Geometric interpretation:
# Each singular value sigma_i represents the "importance" of the i-th
# component. Larger singular values correspond to more significant
# patterns in the image.
```

*[Subtle issues: geometric interpretation is vague ("importance") -- does not mention stretching, ellipsoids, unit sphere mapping, or rotation/scaling/rotation decomposition; does not distinguish roles of U and V geometrically; error formula is correct but the geometric reason WHY ||A - A_k||_F = sqrt(sum_{i>k} sigma_i^2) is not explained; pixel values may go outside [0, 255] in the reconstruction; no discussion of the image building up incrementally as k increases.]*

### Framing Feedback

**Criticism:** The student provided a correct formula for the compression ratio and chose an appropriate error metric (relative Frobenius norm). The observation that a generic image matrix has full rank is reasonable. However, the student's framing completely omitted the geometric interpretation, which is the core mathematical content of the challenge. The problem explicitly asks for "the geometric meaning of each singular value," and the student merely noted the audience concern without engaging with the geometry: the SVD as a sequence of rotation, scaling, rotation; the unit sphere mapping to an ellipsoid; singular values as semi-axis lengths.

**Better Alternative:** "The SVD of the image matrix A = U Sigma V^T decomposes the linear transformation x -> Ax into three geometric steps: (1) V^T rotates/reflects in the domain R^n, (2) Sigma stretches along coordinate axes by factors sigma_1, ..., sigma_r, (3) U rotates/reflects in the codomain R^m. Each singular value sigma_i is the length of the i-th semi-axis of the ellipsoid that is the image of the unit sphere under A. Truncating to rank k means collapsing the ellipsoid to a k-dimensional cross-section, discarding the shortest n-k axes."

**Grade:** C

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### Current AI Output

*(The initial AI solution above.)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "** Adding a third issue: 'Gap: The problem asks to show"
    description: "** Adding a third issue: 'Gap: The problem asks to show 'how the image builds up as you add more singular values,' but the demo only shows rank-k snapshots, not the incremental contribution of each singular value (i.e., sigma_i u_i v_i^T added to the running sum)."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Add"
    description: "'Also include a 'build-up' mode that shows A_1, A_2, ..., A_k as an animation or film strip so the user can see each sigma_i u_i v_i^T contribution. And note that ||A - A_k||_F^2 = sigma_{k+1}^2 + ... + sigma_r^2, which is the sum of squared semi-axis lengths of the discarded dimensions"

#### Updated AI Output

```python
import numpy as np
import matplotlib.pyplot as plt
from ipywidgets import interact, IntSlider
from PIL import Image

def svd_demo(image_path):
    img = np.array(Image.open(image_path).convert('L'), dtype=float)
    m, n = img.shape

    U, S, Vt = np.linalg.svd(img, full_matrices=False)

    def show_rank_k(k=10):
        Ak = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]
        Ak_clipped = np.clip(Ak, 0, 255)

        original_storage = m * n
        compressed_storage = k * (m + n + 1)
        ratio = compressed_storage / original_storage
        error = np.linalg.norm(img - Ak, 'fro') / np.linalg.norm(img, 'fro')

        fig, axes = plt.subplots(1, 2, figsize=(12, 5))
        axes[0].imshow(img, cmap='gray', vmin=0, vmax=255)
        axes[0].set_title("Original")
        axes[1].imshow(Ak_clipped, cmap='gray', vmin=0, vmax=255)
        axes[1].set_title(f"Rank-{k}")
        plt.suptitle(f"Storage: {ratio:.1%} of original | Rel. error: {error:.4f}")
        plt.show()

    interact(show_rank_k, k=IntSlider(min=1, max=min(m, n), step=1, value=10))
```

**Geometric Interpretation of the SVD:**

The SVD A = U Sigma V^T decomposes the linear transformation x -> Ax into three geometric operations:

1. **V^T (rotation/reflection in the domain R^n):** The right singular vectors v_1, ..., v_n form an orthonormal basis for R^n. Applying V^T rotates (and possibly reflects) the input vector into this basis.

2. **Sigma (anisotropic scaling):** The diagonal matrix Sigma stretches along each coordinate axis by the factor sigma_i. The i-th singular value sigma_i is the factor by which the transformation stretches the i-th principal direction. The image of the unit sphere S^{n-1} under A is an ellipsoid whose semi-axes have lengths sigma_1 >= sigma_2 >= ... >= sigma_r > 0.

3. **U (rotation/reflection in the codomain R^m):** The left singular vectors u_1, ..., u_m form an orthonormal basis for R^m. Applying U maps the scaled coordinate axes to the principal directions of the ellipsoid in the output space.

When we truncate to rank k, we keep only the k longest semi-axes of the ellipsoid and collapse the remaining directions to zero. Visually, this preserves the dominant spatial patterns (corresponding to the largest stretching factors) while discarding fine detail (the shortest semi-axes).

*[Remaining issues: does not show the "build-up" animation as k increases; does not explain WHY ||A - A_k||_F = sqrt(sum_{i>k} sigma_i^2) in terms of the ellipsoid; does not discuss what happens geometrically when the matrix is rank-deficient.]*

#### Judging Feedback

**Criticism:** Excellent identification of the core geometric gap and the pixel clipping issue. The student correctly distinguished the three SVD operations and used precise language (semi-axis lengths, rotation/reflection, principal directions). This is the strongest judging performance in the session. The student could additionally have flagged the missing "build-up" visualization that the problem specifically requested.

**Better Alternative:** Adding a third issue: "Gap: The problem asks to show 'how the image builds up as you add more singular values,' but the demo only shows rank-k snapshots, not the incremental contribution of each singular value (i.e., sigma_i u_i v_i^T added to the running sum)."

**Grade:** A-

#### Steering Feedback

**Criticism:** The instruction was specific, mathematically precise, and directly targeted the identified geometric gap. The explicit mention of S^{n-1} and the ellipsoid provides the right geometric vocabulary. The pixel clipping fix was a clean practical improvement. However, the student did not address the missing "build-up" feature or the connection between the Frobenius error and the discarded singular values.

**Better Alternative:** Add: "Also include a 'build-up' mode that shows A_1, A_2, ..., A_k as an animation or film strip so the user can see each sigma_i u_i v_i^T contribution. And note that ||A - A_k||_F^2 = sigma_{k+1}^2 + ... + sigma_r^2, which is the sum of squared semi-axis lengths of the discarded dimensions."

**Grade:** B+

---

### Cycle 2

#### Current AI Output

*(The updated solution from Cycle 1.)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap:** The problem explicitly asks to show"
    description: "Gap:** The problem explicitly asks to show"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Instruction:** Add a second display mode: a 2x4 grid"
    description: "Instruction:** Add a second display mode: a 2x4 grid showing the rank-1, rank-2, rank-5, rank-10, rank-20, rank-50, rank-100, and full-rank reconstructions side by side, so the user can see the image"

#### Updated AI Output

```python
import numpy as np
import matplotlib.pyplot as plt
from ipywidgets import interact, IntSlider
from PIL import Image

def svd_demo(image_path):
    img = np.array(Image.open(image_path).convert('L'), dtype=float)
    m, n = img.shape

    U, S, Vt = np.linalg.svd(img, full_matrices=False)

    # === Mode 1: Interactive slider ===
    def show_rank_k(k=10):
        Ak = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]
        Ak_clipped = np.clip(Ak, 0, 255)
        ratio = k * (m + n + 1) / (m * n)
        error = np.sqrt(np.sum(S[k:]**2)) / np.linalg.norm(img, 'fro')

        fig, axes = plt.subplots(1, 2, figsize=(12, 5))
        axes[0].imshow(img, cmap='gray', vmin=0, vmax=255)
        axes[0].set_title("Original")
        axes[1].imshow(Ak_clipped, cmap='gray', vmin=0, vmax=255)
        axes[1].set_title(f"Rank-{k}")
        plt.suptitle(f"Storage: {ratio:.1%} | ||A-A_k||_F/||A||_F = {error:.4f}")
        plt.show()

    interact(show_rank_k, k=IntSlider(min=1, max=min(m, n), step=1, value=10))

    # === Mode 2: Build-up grid ===
    ranks = [1, 2, 5, 10, 20, 50, 100, min(m, n)]
    ranks = [r for r in ranks if r <= min(m, n)]

    fig, axes = plt.subplots(2, 4, figsize=(16, 8))
    for idx, (ax, k) in enumerate(zip(axes.flat, ranks)):
        Ak = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]
        ax.imshow(np.clip(Ak, 0, 255), cmap='gray', vmin=0, vmax=255)
        err = np.sqrt(np.sum(S[k:]**2)) / np.linalg.norm(img, 'fro')
        ax.set_title(f"k={k}\nerr={err:.3f}")
        ax.axis('off')
    plt.suptitle("Image Build-Up: Adding Singular Values")
    plt.tight_layout()
    plt.savefig("buildup.png")
    plt.show()
```

**Geometric Interpretation of the SVD:**

The SVD A = U Sigma V^T decomposes x -> Ax into rotation (V^T), scaling (Sigma), rotation (U).

- Each sigma_i is the stretching factor along the i-th principal direction: the image of the unit sphere under A is an ellipsoid with semi-axis lengths sigma_1 >= sigma_2 >= ... >= sigma_r > 0.
- v_i is the i-th principal direction in the domain (input space); u_i is the corresponding direction in the codomain (output space).

**Error and the ellipsoid:** The Eckart-Young theorem tells us that the rank-k approximation A_k minimizes the Frobenius-norm error over all rank-k matrices, and:

||A - A_k||_F^2 = sigma_{k+1}^2 + sigma_{k+2}^2 + ... + sigma_r^2

Geometrically, the squared approximation error is exactly the sum of the squared lengths of the semi-axes we discard. The build-up grid shows how the image progressively sharpens as we include more semi-axes of the ellipsoid.

#### Judging Feedback

**Criticism:** Good identification of both missing elements. The build-up visualization was explicitly requested in the problem and the student correctly flagged it. Connecting the error formula to the geometric semi-axis interpretation shows the student is now thinking in the right mathematical register. The student could have also noted that the current SVD explanation does not address the distinction from eigendecomposition, which is a common source of confusion.

**Better Alternative:** Adding: "Error: The explanation does not clarify how the SVD differs from eigendecomposition geometrically. For non-symmetric A, the SVD uses two different orthonormal bases (U and V), whereas eigendecomposition uses one. Students often conflate these."

**Grade:** B+

#### Steering Feedback

**Criticism:** The build-up grid instruction was well-designed with a sensible selection of ranks (1, 2, 5, 10, 20, 50, 100, full). The error formula instruction directly targeted the mathematical gap. Both instructions were precise and actionable. The student could have additionally asked for a singular value decay plot alongside the build-up grid to visually connect the sigma_i magnitudes to the visual quality improvements.

**Better Alternative:** "Also add a singular value decay bar chart next to the build-up grid, showing sigma_1, sigma_2, ..., with vertical lines at each rank displayed in the grid, so the user can see which singular values are being added at each step and how rapidly they decay."

**Grade:** B+

---

### Cycle 3 — Final

#### Current AI Output

*(The updated solution from Cycle 2.)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap:** The demo does not include a singular value decay plot"
    description: "Gap:** The demo does not include a singular value decay plot. Showing sigma_1, sigma_2, ..., sigma_r alongside the build-up grid would help users connect the algebraic magnitudes to the visual quality changes."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done**

---

## Completion

### Final Grades

| Skill | Grade |
|-------|-------|
| **Framing** | C |
| **Judging** | A |
| **Steering** | A |

### Summary Feedback

The student's framing was weak -- the core mathematical content of the challenge (geometric interpretation of the SVD) was barely addressed. The student focused on coding mechanics (compression ratio formula, error metric) while neglecting the conceptual heart of the problem. However, performance improved significantly during the Judge+Steer phase. The Cycle 1 judging was excellent, correctly identifying the rotation-scaling-rotation decomposition and the ellipsoidal interpretation as the missing geometric content. Steering instructions were specific and mathematically grounded throughout. The main growth area is engaging with mathematical concepts during framing rather than deferring them to later cycles. When a problem asks for geometric interpretation, the framing response should lead with geometry, not code.
