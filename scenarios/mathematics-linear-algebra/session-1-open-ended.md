# Session 1 — Open-Ended: Build a Movie Genre Clustering Pipeline

**Challenge:** Build a Python pipeline that takes a 5,000-movie × 200-attribute ratings dataset and produces a 2D scatter plot where movies are colored by discovered genre clusters. Use SVD to reduce the attribute space before clustering.

**Subject:** Matrix Decompositions > SVD > Low-rank Approximation

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Build a Python pipeline that takes a 5,000-movie × 200-attribute ratings dataset and produces a 2D scatter plot where movies are colored by discovered genre clusters. Use SVD to reduce the attribute space before clustering. Deliver the script, the final plot as a PNG, and a one-page writeup explaining what each discovered cluster represents. The dataset "has some missing cells" and the attributes include "a mix of critic scores, user tags, and box-office numbers."

### Student's Framing Response (Open-Ended)

**Assumption:** The 5,000 × 200 matrix is dense enough that missing cells can be filled with column means without significantly distorting the SVD.

**Specification:** I will center each column to zero mean and apply SVD, truncating to rank k = 10 to capture the dominant structure, then use k-means clustering on the 10-dimensional projected data.

**Clarification:** The attributes have different units (critic scores 0–100, box-office in dollars, binary user tags). Should we normalize columns to unit variance before computing the SVD?

**Gap:** The problem doesn't specify how many genre clusters to discover. I'll use the elbow method on the k-means inertia curve to select a reasonable number.

### AI Solution (Generated from Framing)

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.impute import SimpleImputer

# Load data (5000 x 200)
data = load_movie_data("movies.csv")

# Handle missing values with mean imputation
imputer = SimpleImputer(strategy='mean')
data_filled = imputer.fit_transform(data)

# Center columns
data_centered = data_filled - data_filled.mean(axis=0)

# Compute full SVD
U, S, Vt = np.linalg.svd(data_centered, full_matrices=False)

# Truncate to rank k=10
k = 10
U_k = U[:, :k]
S_k = np.diag(S[:k])
projected = U_k @ S_k  # 5000 x 10

# K-means with 5 clusters
kmeans = KMeans(n_clusters=5, random_state=42)
labels = kmeans.fit_predict(projected)

# Project to 2D for visualization using first 2 singular components
coords_2d = projected[:, :2]

plt.scatter(coords_2d[:, 0], coords_2d[:, 1], c=labels, cmap='tab10', s=5)
plt.xlabel("Component 1")
plt.ylabel("Component 2")
plt.title("Movie Genre Clusters via SVD + K-Means")
plt.savefig("clusters.png")
```

The SVD decomposes the data matrix as A ≈ U_k Σ_k V_k^T where the top k singular values capture the most important patterns. Each cluster in the 2D plot corresponds to a discovered genre.

*[Subtle issues embedded: no column scaling/normalization despite mixed units; k=10 chosen without examining singular value decay; mean imputation applied before centering without discussion of interaction; no quantification of retained variance; 2D projection for visualization discards components 3–10 that were used for clustering.]*

### Framing Feedback

**Criticism:** The student correctly identified the need to center columns and raised the important question about normalization due to mixed units. However, the student assumed mean imputation is adequate without analyzing the pattern of missingness (random vs. systematic). The choice of k = 10 was stated as an assertion rather than framed as something requiring justification from the singular value spectrum. The student did not mention the Eckart–Young theorem or what "retaining enough information" means quantitatively (e.g., fraction of total Frobenius norm or nuclear norm).

**Better Alternative:** "I would first normalize each column to unit variance since the attributes have incompatible units (box-office dollars vs. 0–100 scores vs. binary tags). The rank k should be chosen by examining the singular value decay — specifically, I would plot σ_1, σ_2, …, σ_200 and choose k such that Σ_{i=1}^{k} σ_i² / Σ_{i=1}^{200} σ_i² ≥ 0.90, retaining at least 90% of the total variance. For missing data, I should consider whether the missingness pattern is random or structured, since mean imputation can bias the covariance structure."

**Grade:** C+

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### Current AI Output

*(Same as above — the initial AI solution with no column scaling, unjustified k=10, mean imputation before centering.)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Error: The AI does not normalize columns to unit variance before SVD"
    description: "Error: The AI does not normalize columns to unit variance before SVD. Since critic scores range 0–100, box-office values can be in millions, and user tags are binary (0/1), the SVD will be dominated by the high-magnitude box-office columns. The singular values will reflect scale differences rather than meaningful data structure. Gap:** There is no analysis of the singular value spectrum. The AI chose k = 10 with no quantitative justification. We don't know whether σ_{10} ≫ σ_{11} (clear gap) or σ_{10} ≈ σ_{11} (arbitrary cutoff)."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Instruction:** Before computing the SVD, standardize"
    description: "Instruction:** Before computing the SVD, standardize each column to zero mean and unit variance using z-score normalization. After computing the SVD, plot the singular value spectrum and choose k so that the cumulative energy ratio Σ_{i=1}^{k} σ_i² / Σ_{i=1}^{200} σ_i² exceeds 0.85. Report this ratio."

#### Updated AI Output

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler

# Load and impute
data = load_movie_data("movies.csv")
imputer = SimpleImputer(strategy='mean')
data_filled = imputer.fit_transform(data)

# Standardize columns to zero mean, unit variance
scaler = StandardScaler()
data_scaled = scaler.fit_transform(data_filled)

# Compute SVD
U, S, Vt = np.linalg.svd(data_scaled, full_matrices=False)

# Singular value spectrum analysis
energy = np.cumsum(S**2) / np.sum(S**2)
k = np.searchsorted(energy, 0.85) + 1
print(f"Chosen k = {k}, retaining {energy[k-1]*100:.1f}% of variance")

# Plot spectrum
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].plot(S, 'o-', markersize=2)
axes[0].set_xlabel("Index i")
axes[0].set_ylabel("σ_i")
axes[0].set_title("Singular Value Spectrum")
axes[1].plot(energy, 'o-', markersize=2)
axes[1].axhline(y=0.85, color='r', linestyle='--')
axes[1].set_xlabel("Rank k")
axes[1].set_ylabel("Cumulative Energy")
axes[1].set_title("Cumulative Variance Ratio")
plt.savefig("sv_spectrum.png")

# Project and cluster
projected = U[:, :k] @ np.diag(S[:k])
kmeans = KMeans(n_clusters=5, random_state=42)
labels = kmeans.fit_predict(projected)

# 2D visualization
coords_2d = projected[:, :2]
plt.figure()
plt.scatter(coords_2d[:, 0], coords_2d[:, 1], c=labels, cmap='tab10', s=5)
plt.title(f"Movie Clusters (rank-{k} SVD, {energy[k-1]*100:.1f}% variance)")
plt.savefig("clusters.png")
```

The Eckart–Young theorem guarantees that the rank-k approximation A_k = U_k Σ_k V_k^T minimizes ‖A − A_k‖_F over all rank-k matrices. By choosing k to retain 85% of the squared Frobenius norm, we balance compression against information loss.

*[Remaining issues: still uses mean imputation without discussing its impact on covariance; number of clusters (5) is still hardcoded; Eckart–Young invoked but its assumption of a complete matrix is not verified given imputed entries.]*

#### Judging Feedback

**Criticism:** The student correctly identified the most critical issue — the lack of column normalization — and the missing singular value analysis. However, the student did not flag the mean imputation problem: imputing before standardizing means the imputed values (column means) become zeros after centering, which inflates the zero-eigenvalue directions. The student also missed that the Eckart–Young theorem assumes a fully observed matrix, which doesn't strictly hold after imputation.

**Better Alternative:** "Error: The AI applies Eckart–Young optimality without noting that it assumes a complete matrix. Our matrix has imputed entries, so the rank-k approximation is not guaranteed to be optimal in the Frobenius norm over the original (incomplete) data. Gap: The number of clusters is hardcoded at 5 with no justification."

**Grade:** B−

#### Steering Feedback

**Criticism:** The student's instruction to standardize and analyze the singular value spectrum was clear and directly addressed the identified issues. However, the student set the energy threshold at 0.85 without justifying why 85% rather than 90% or 95% is appropriate for this clustering task. The student also did not address the interaction between imputation and standardization, nor the hardcoded cluster count.

**Better Alternative:** "Standardize columns to unit variance. Then compute the SVD and report the cumulative energy curve. Choose k at the largest gap in the singular value spectrum (scree plot elbow) or at the 90% energy threshold, whichever is smaller. Also add a note that imputation should ideally be done after or jointly with the SVD via iterative methods (e.g., soft-impute) rather than simple mean fill."

**Grade:** B

---

### Cycle 2

#### Current AI Output

*(The updated solution from Cycle 1 above.)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap: The number of clusters is hardcoded at 5 without"
    description: "Gap: The number of clusters is hardcoded at 5 without any justification. The solution should use the elbow method or silhouette analysis to determine the optimal number of clusters. Error:** The Eckart–Young theorem is cited as a guarantee, but it requires a complete matrix. Since the data had missing entries that were imputed, the theorem's optimality does not strictly apply. The AI should acknowledge this caveat."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Instruction:** Replace the hardcoded n_clusters=5 with a"
    description: "Instruction:** Replace the hardcoded n_clusters=5 with a silhouette score analysis over k ∈ {2, 3, …, 15}. Also add a comment noting that since the matrix had imputed entries, the Eckart–Young optimality guarantee applies to the imputed matrix, not the original incomplete data, and mention that iterative SVD methods exist for incomplete matrices."

#### Updated AI Output

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

# Load and impute
# NOTE: Mean imputation fills gaps but distorts the covariance structure.
# For a more principled approach, consider iterative SVD imputation
# (e.g., fancyimpute.IterativeSVD) which jointly estimates missing values
# and the low-rank structure.
data = load_movie_data("movies.csv")
imputer = SimpleImputer(strategy='mean')
data_filled = imputer.fit_transform(data)

scaler = StandardScaler()
data_scaled = scaler.fit_transform(data_filled)

U, S, Vt = np.linalg.svd(data_scaled, full_matrices=False)

# Rank selection via energy threshold
energy = np.cumsum(S**2) / np.sum(S**2)
k = np.searchsorted(energy, 0.85) + 1
print(f"Chosen k = {k}, retaining {energy[k-1]*100:.1f}% of variance")

# NOTE: The Eckart–Young theorem guarantees that U_k Σ_k V_k^T is the best
# rank-k approximation in the Frobenius norm — but this guarantee applies
# to the *imputed* matrix, not the original incomplete data. For incomplete
# matrices, nuclear norm minimization or iterative SVD methods provide
# better-justified low-rank recovery.

projected = U[:, :k] @ np.diag(S[:k])

# Cluster selection via silhouette analysis
sil_scores = []
K_range = range(2, 16)
for nc in K_range:
    km = KMeans(n_clusters=nc, random_state=42, n_init=10)
    labs = km.fit_predict(projected)
    sil_scores.append(silhouette_score(projected, labs))

optimal_nc = K_range[np.argmax(sil_scores)]
print(f"Optimal clusters: {optimal_nc} (silhouette = {max(sil_scores):.3f})")

plt.figure()
plt.plot(list(K_range), sil_scores, 'o-')
plt.xlabel("Number of Clusters")
plt.ylabel("Silhouette Score")
plt.title("Cluster Selection")
plt.savefig("silhouette.png")

# Final clustering
kmeans = KMeans(n_clusters=optimal_nc, random_state=42, n_init=10)
labels = kmeans.fit_predict(projected)

coords_2d = projected[:, :2]
plt.figure()
plt.scatter(coords_2d[:, 0], coords_2d[:, 1], c=labels, cmap='tab10', s=5)
plt.title(f"Movie Clusters (k={k}, {optimal_nc} clusters)")
plt.savefig("clusters.png")
```

#### Judging Feedback

**Criticism:** The student correctly identified both remaining issues — the hardcoded cluster count and the misapplied Eckart–Young guarantee. This is a stronger round of judging than Cycle 1. However, the student could have also noted that the 2D visualization (using only the first 2 SVD components) may misrepresent the clustering structure that was discovered in the full k-dimensional projected space — clusters that are well-separated in k dimensions may overlap when projected to 2D.

**Better Alternative:** "Error: Eckart–Young is invoked without the completeness assumption being satisfied. Gap: Cluster count is unjustified. Gap: The 2D scatter plot uses only 2 of k components, so clusters that are separated in higher dimensions will appear merged — consider t-SNE or UMAP for 2D visualization instead of raw SVD component projection."

**Grade:** B+

#### Steering Feedback

**Criticism:** The silhouette analysis instruction was well-specified with a concrete range. The caveat about Eckart–Young and iterative SVD was a good addition. However, the student did not address the 2D visualization problem or ask the AI to explain what the retained singular vectors represent in terms of the original movie attributes (interpreting V_k^T).

**Better Alternative:** "Run silhouette analysis for 2–15 clusters. Add a caveat on Eckart–Young with imputed data. Also: replace the raw 2D SVD projection with t-SNE or UMAP applied to the k-dimensional projected data for better visual cluster separation. Finally, print the top-5 loadings from V_k^T for each component to interpret what each SVD dimension captures."

**Grade:** B

---

### Cycle 3 — Final

#### Current AI Output

*(The updated solution from Cycle 2 above.)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap:** The 2D visualization still uses raw SVD components 1 and 2"
    description: "Gap:** The 2D visualization still uses raw SVD components 1 and 2. Clusters separated in higher dimensions may overlap. A nonlinear embedding like t-SNE would better preserve cluster structure for visualization."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done**

The student accepts the current solution as sufficiently complete.

---

## Completion

### Final Grades

| Skill | Grade |
|-------|-------|
| **Framing** | B |
| **Judging** | B |
| **Steering** | B |

### Summary Feedback

The student demonstrated growing skill across cycles. In framing, the student correctly raised the normalization question but failed to deeply engage with the implications of missing data or the quantitative meaning of rank truncation. During judging, the student progressed from catching the most visible issue (column scaling) to subtler ones (Eckart–Young assumptions, cluster count justification), though the 2D visualization limitation was only caught late. Steering instructions were clear and actionable but tended to address only the issues just identified rather than anticipating downstream problems. The student would benefit from developing a more systematic checklist approach: for any SVD-based pipeline, always verify (1) data completeness assumptions, (2) scaling/preprocessing, (3) rank selection justification, (4) theorem applicability conditions, and (5) downstream interpretation validity.
