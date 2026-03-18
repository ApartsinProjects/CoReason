# Session 1 — Multiple Choice: Build a Movie Genre Clustering Pipeline

**Challenge:** Build a Python pipeline that takes a 5,000-movie × 200-attribute ratings dataset and produces a 2D scatter plot where movies are colored by discovered genre clusters. Use SVD to reduce the attribute space before clustering.

**Subject:** Matrix Decompositions > SVD > Low-rank Approximation

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Build a Python pipeline that takes a 5,000-movie × 200-attribute ratings dataset and produces a 2D scatter plot where movies are colored by discovered genre clusters. Use SVD to reduce the attribute space before clustering. Deliver the script, the final plot as a PNG, and a one-page writeup explaining what each discovered cluster represents. The dataset "has some missing cells" and the attributes include "a mix of critic scores, user tags, and box-office numbers."

### Student's Framing Response (Multiple Choice)

**Question:** What is the most important preprocessing concern before applying SVD to this dataset?

| Option | Text |
|--------|------|
| A | The dataset should be transposed so that movies are columns, not rows |
| B | Missing cells should be removed by deleting incomplete rows entirely |
| C | Columns should be normalized to comparable scales since attributes have different units |
| D | The matrix should be converted to binary (0/1) values before SVD |
| E | No preprocessing is needed; SVD handles raw data directly |

**Student selects:** C

**Question:** How should the truncation rank k be chosen?

| Option | Text |
|--------|------|
| A | Always use k = 2 since the final plot is 2-dimensional |
| B | Use k = 200 (keep all singular values) to avoid losing information |
| C | Pick the smallest k such that the cumulative squared singular values exceed a threshold (e.g., 85–95% of total) |
| D | Use k = number of expected genres (e.g., k = 10 for 10 genres) |
| E | Set k = √n where n is the number of movies |

**Student selects:** C

**Question:** What concern does the presence of missing data raise for the SVD computation?

| Option | Text |
|--------|------|
| A | SVD cannot be computed at all if any entries are missing |
| B | Missing entries make the Eckart–Young optimality guarantee inapplicable to the original data; imputation method matters |
| C | Missing entries only affect the last few singular values and can be safely ignored |
| D | Missing entries should be set to zero since zero means "no information" |
| E | The SVD automatically skips missing entries during computation |

**Student selects:** D *(incorrect)*

### AI Solution (Generated from Framing)

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans

data = load_movie_data("movies.csv")

# Fill missing entries with 0
data_filled = np.nan_to_num(data, nan=0.0)

# Normalize columns to unit variance
data_norm = (data_filled - data_filled.mean(axis=0)) / data_filled.std(axis=0)

# SVD
U, S, Vt = np.linalg.svd(data_norm, full_matrices=False)

# Choose k via energy threshold
energy = np.cumsum(S**2) / np.sum(S**2)
k = np.searchsorted(energy, 0.90) + 1

# Project and cluster
projected = U[:, :k] * S[:k]
kmeans = KMeans(n_clusters=6, random_state=42)
labels = kmeans.fit_predict(projected)

# 2D plot
plt.scatter(projected[:, 0], projected[:, 1], c=labels, cmap='tab10', s=3)
plt.title(f"Movie Clusters (rank-{k} SVD)")
plt.savefig("clusters.png")
```

The rank-k SVD approximation retains the k most significant patterns in the data. By the Eckart–Young theorem, this is the optimal rank-k approximation in the Frobenius norm.

*[Subtle issues: zero-fill for missing data biases the SVD (zeros are not "missing," they pull the factorization); number of clusters is 6 with no justification; Eckart–Young cited without noting the matrix was modified by imputation; no residual or reconstruction error reported.]*

### Framing Feedback

**Criticism:** The student correctly identified column normalization (C) and energy-based rank selection (C) — both strong choices. However, the student selected D for the missing data question, which is incorrect. Setting missing entries to zero is not neutral: it asserts that the true value is zero, which actively distorts the covariance structure. For box-office revenue, zero means "no revenue" (a meaningful value), not "unknown." The correct answer was B — missing entries invalidate the Eckart–Young guarantee on the original data, and the imputation method substantively affects the SVD result.

**Better Alternative:** Selecting B would demonstrate understanding that the SVD's theoretical guarantees depend on having a complete matrix, and that the choice of imputation strategy (mean, zero, iterative SVD) is a modeling decision with mathematical consequences.

**Grade:** B−

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### Current AI Output

*(The initial AI solution above with zero-imputation, unjustified 6 clusters, and Eckart–Young applied to modified matrix.)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Question:** Which issues are present in the AI's"
    description: "Question:** Which issues are present in the AI's solution? (Select all that apply)"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Question:** What correction should be sent to the AI?

| Option | Text |
|--------|------|
| A | Replace zero-fill with mean imputation and add silhouette analysis to choose the number of clusters |
| B | Remove the SVD entirely and cluster on the raw 200-dimensional data |
| C | Replace zero-fill with iterative SVD imputation, add cluster count selection, and note that Eckart–Young applies to the completed matrix only |
| D | Increase the number of clusters to 20 for finer genre resolution |
| E | Switch from k-means to hierarchical clustering; keep everything else the same |

**Student selects:** A *(reasonable but not the strongest option)*

#### Updated AI Output

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

data = load_movie_data("movies.csv")

# Mean imputation for missing values
imputer = SimpleImputer(strategy='mean')
data_filled = imputer.fit_transform(data)

# Standardize
scaler = StandardScaler()
data_scaled = scaler.fit_transform(data_filled)

# SVD and rank selection
U, S, Vt = np.linalg.svd(data_scaled, full_matrices=False)
energy = np.cumsum(S**2) / np.sum(S**2)
k = np.searchsorted(energy, 0.90) + 1
print(f"Rank k={k}, variance retained: {energy[k-1]*100:.1f}%")

projected = U[:, :k] * S[:k]

# Silhouette analysis for cluster count
best_nc, best_sil = 2, -1
for nc in range(2, 16):
    km = KMeans(n_clusters=nc, random_state=42, n_init=10)
    labs = km.fit_predict(projected)
    s = silhouette_score(projected, labs)
    if s > best_sil:
        best_nc, best_sil = nc, s

print(f"Optimal clusters: {best_nc}, silhouette: {best_sil:.3f}")

kmeans = KMeans(n_clusters=best_nc, random_state=42, n_init=10)
labels = kmeans.fit_predict(projected)

plt.scatter(projected[:, 0], projected[:, 1], c=labels, cmap='tab10', s=3)
plt.title(f"Movie Clusters (k={k}, {best_nc} clusters, sil={best_sil:.2f})")
plt.savefig("clusters.png")
```

*[Remaining issues: Eckart–Young caveat still missing; no interpretation of singular vectors; 2D projection for plotting still uses raw components 1-2.]*

#### Judging Feedback

**Criticism:** The student identified two of four issues (zero-fill and unjustified cluster count) but missed the Eckart–Young assumption violation (D) and the potential division-by-zero in normalization (E). Catching A and B shows practical awareness, but missing D indicates the student is not yet connecting the AI's theoretical claims to their mathematical preconditions.

**Better Alternative:** Selecting A, B, D, and E would demonstrate both practical and theoretical scrutiny. The division-by-zero issue (E) is a real concern if any column (e.g., a rare binary tag) has constant values.

**Grade:** B−

#### Steering Feedback

**Criticism:** Option A (mean imputation + silhouette) is a reasonable improvement but not the strongest. Option C would have been better because it addresses the imputation method more rigorously (iterative SVD jointly estimates missing values and the low-rank structure) and includes the Eckart–Young caveat. The student's choice improves the pipeline but leaves the theoretical gap unaddressed.

**Better Alternative:** Option C directly targets all three identified issues with mathematically grounded solutions.

**Grade:** C+

---

### Cycle 2

#### Current AI Output

*(The updated solution from Cycle 1 above.)*

#### Judging Sub-step

**Question:** Which issues remain in the updated AI solution? (Select all that apply)

| Option | Text |
|--------|------|
| A | The silhouette analysis range (2–15) may be too narrow for 5,000 movies |
| B | The Eckart–Young theorem is still implicitly assumed to hold despite imputed entries |
| C | The 2D visualization uses only the first two SVD components, which may not reflect the k-dimensional cluster structure |
| D | The code does not interpret what the dominant singular vectors represent in terms of movie attributes |
| E | Mean imputation followed by standardization causes imputed values to become exactly zero after centering, creating artificial structure |

**Student selects:** B, C, E *(good selection, catches the subtle imputation-centering interaction)*

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Question:** What correction should be sent to the AI?

| Option | Text |
|--------|------|
| A | Add a caveat about Eckart–Young, use t-SNE for 2D visualization, and note the imputation-centering interaction |
| B | Remove mean imputation and use listwise deletion of incomplete rows instead |
| C | Replace SVD with PCA since PCA handles missing data better |
| D | Only visualize the first two components since that is what the 2D plot requires |
| E | Add a disclaimer that the results are approximate and no changes are needed to the code |

**Student selects:** A

#### Updated AI Output

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
from sklearn.manifold import TSNE

data = load_movie_data("movies.csv")

# NOTE: Mean imputation fills missing cells with column means. After
# centering (subtracting column means), all imputed values become exactly 0.
# This creates artificial concentration at the origin in the centered data.
# For a more principled approach, consider iterative SVD imputation.
imputer = SimpleImputer(strategy='mean')
data_filled = imputer.fit_transform(data)

scaler = StandardScaler()
data_scaled = scaler.fit_transform(data_filled)

U, S, Vt = np.linalg.svd(data_scaled, full_matrices=False)

energy = np.cumsum(S**2) / np.sum(S**2)
k = np.searchsorted(energy, 0.90) + 1
print(f"Rank k={k}, variance retained: {energy[k-1]*100:.1f}%")

# NOTE: The Eckart–Young theorem guarantees optimality of the rank-k
# approximation in the Frobenius norm for the *completed* matrix.
# Since missing entries were imputed, this guarantee applies to the
# imputed matrix, not the original incomplete data.
projected = U[:, :k] * S[:k]

# Cluster selection
best_nc, best_sil = 2, -1
for nc in range(2, 16):
    km = KMeans(n_clusters=nc, random_state=42, n_init=10)
    labs = km.fit_predict(projected)
    s = silhouette_score(projected, labs)
    if s > best_sil:
        best_nc, best_sil = nc, s

kmeans = KMeans(n_clusters=best_nc, random_state=42, n_init=10)
labels = kmeans.fit_predict(projected)

# t-SNE for 2D visualization (preserves cluster structure better than
# raw SVD component projection)
tsne = TSNE(n_components=2, random_state=42, perplexity=30)
coords_2d = tsne.fit_transform(projected)

plt.scatter(coords_2d[:, 0], coords_2d[:, 1], c=labels, cmap='tab10', s=3)
plt.title(f"Movie Clusters via t-SNE (k={k}, {best_nc} clusters)")
plt.savefig("clusters.png")
```

#### Judging Feedback

**Criticism:** Strong round of judging. The student caught three significant issues including the subtle imputation-centering interaction (E), which shows mathematical depth. Missing D (interpretation of singular vectors) is understandable as it is more about the writeup than the code correctness.

**Better Alternative:** Adding D would complete the assessment: "The AI does not explain what V_k^T rows represent — i.e., which original attributes load most heavily on each SVD component, which is essential for the required writeup interpreting what each cluster represents."

**Grade:** B+

#### Steering Feedback

**Criticism:** Option A is the strongest choice and the student selected it correctly. It addresses all three identified issues: the Eckart–Young caveat, the visualization method, and the imputation interaction. This is a well-targeted correction.

**Better Alternative:** The selection is strong. To be even better, the student could have additionally requested interpretation of the V_k^T matrix to explain cluster meanings.

**Grade:** A−

---

### Cycle 3 — Final

#### Current AI Output

*(The updated solution from Cycle 2 above.)*

#### Judging Sub-step

**Question:** Which issues remain? (Select all that apply)

| Option | Text |
|--------|------|
| A | The solution is now mathematically sound and complete |
| B | The code still does not interpret the singular vectors in terms of original attributes |
| C | t-SNE perplexity should be tuned based on dataset size |
| D | The reconstruction error ‖A − A_k‖_F is not reported |
| E | The pipeline lacks cross-validation of the clustering results |

**Student selects:** B, D

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done**

---

## Completion

### Final Grades

| Skill | Grade |
|-------|-------|
| **Framing** | B− |
| **Judging** | B |
| **Steering** | B− |

### Summary Feedback

The student showed solid practical instincts throughout — correctly identifying scaling issues, cluster count justification needs, and visualization concerns. The initial framing error on missing data handling (choosing zero-fill as neutral) carried through into Cycle 1 steering, where the student chose mean imputation over iterative SVD. Judging improved markedly from Cycle 1 to Cycle 2, with the student catching the subtle imputation-centering interaction in the later round. The primary area for growth is connecting AI's theoretical claims to their mathematical preconditions: the Eckart–Young assumption violation was missed in Cycle 1 judging and only caught in Cycle 2. The student should develop the habit of asking "what assumptions does this theorem require, and are they satisfied here?" whenever the AI invokes a named result.
