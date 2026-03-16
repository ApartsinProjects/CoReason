# Course: Linear Algebra
**Department:** Mathematics
**Institution:** MIT

---

## Subject Tree

```
Linear Algebra
├── Vector Spaces
│   ├── Subspaces
│   ├── Linear Independence
│   ├── Basis & Dimension
│   └── Change of Basis
├── Linear Transformations
│   ├── Matrix Representations
│   ├── Kernel & Image
│   ├── Rank-Nullity Theorem
│   └── Isomorphisms
├── Systems of Equations
│   ├── Gaussian Elimination
│   ├── LU Decomposition
│   ├── Solution Spaces
│   └── Numerical Stability
├── Eigenvalues & Eigenvectors
│   ├── Characteristic Polynomial
│   ├── Diagonalization
│   ├── Jordan Normal Form
│   └── Spectral Theorem
├── Inner Product Spaces
│   ├── Orthogonality
│   │   ├── Gram-Schmidt Process
│   │   └── QR Decomposition
│   ├── Projections
│   │   ├── Least Squares
│   │   └── Orthogonal Projections
│   └── Norms
└── Matrix Decompositions
    ├── Singular Value Decomposition (SVD)
    │   ├── Geometric Interpretation
    │   └── Low-rank Approximation
    ├── Cholesky Decomposition
    └── Spectral Decomposition
```

---

## Challenge Examples

### Challenge 1: Build a Movie Genre Clustering Pipeline
**Subject:** Matrix Decompositions > SVD > Low-rank Approximation
**Type:** Practice

**Raw Problem (intentionally ill-defined):**
> Build a Python pipeline that takes a 5,000-movie x 200-attribute ratings dataset and produces a 2D scatter plot where movies are colored by discovered genre clusters. Use SVD to reduce the attribute space before clustering. Deliver the script, the final plot as a PNG, and a one-page writeup explaining what each discovered cluster represents. The dataset "has some missing cells" and the attributes include "a mix of critic scores, user tags, and box-office numbers."

**Framing Rubric:**

#### Criterion 1: What rank truncation means in the context of the data
- **Description:** Identifies what rank truncation means in the context of the data and what information is lost when singular values are discarded
- **Excellent (A):** Clearly and specifically identifies what rank truncation means in the context of the data and what information is lost when singular values are discarded
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Determine the appropriate rank k for a low-rank approximation given the
- **Description:** Questions how to determine the appropriate rank k for a low-rank approximation given the problem's accuracy or compression requirements
- **Excellent (A):** Clearly and specifically questions how to determine the appropriate rank k for a low-rank approximation given the problem's accuracy or compression requirements
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Any assumptions about the matrix structure that affect whether a low-rank
- **Description:** Notes any assumptions about the matrix structure (sparsity, missing entries, scaling) that affect whether a low-rank approximation is meaningful
- **Excellent (A):** Clearly and specifically notes any assumptions about the matrix structure (sparsity, missing entries, scaling) that affect whether a low-rank approximation is meaningful
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Tradeoff between approximation quality
- **Description:** Recognizes the tradeoff between approximation quality and rank, and that the choice of error metric for evaluating the approximation needs justification
- **Excellent (A):** Clearly and specifically recognizes the tradeoff between approximation quality and rank, and that the choice of error metric for evaluating the approximation needs justification
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Selects a truncation rank
- **Description:** Detects if AI selects a truncation rank without any quantitative justification such as singular value decay analysis or reconstruction error bounds
- **Excellent (A):** Accurately detects if AI selects a truncation rank without any quantitative justification such as singular value decay analysis or reconstruction error bounds and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Ignores data preprocessing requirements that affect the validity of the SVD
- **Description:** Identifies if AI ignores data preprocessing requirements (scaling, centering, handling missing entries) that affect the validity of the SVD factorization
- **Excellent (A):** Accurately identifies if AI ignores data preprocessing requirements (scaling, centering, handling missing entries) that affect the validity of the SVD factorization and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Conflates the mathematical low-rank approximation with downstream interpretation
- **Description:** Catches if AI conflates the mathematical low-rank approximation with downstream interpretation, or fails to explain what the retained and discarded components represent
- **Excellent (A):** Accurately catches if AI conflates the mathematical low-rank approximation with downstream interpretation, or fails to explain what the retained and discarded components represent and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Applies the Eckart-Young theorem
- **Description:** Recognizes if AI applies the Eckart-Young theorem or optimality guarantees without verifying that their assumptions (e.g., norm choice, matrix completeness) hold
- **Excellent (A):** Accurately recognizes if AI applies the Eckart-Young theorem or optimality guarantees without verifying that their assumptions (e.g., norm choice, matrix completeness) hold and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Direct the AI to justify the chosen rank by analyzing the singular value spectrum
- **Description:** Commands direct the AI to justify the chosen rank by analyzing the singular value spectrum and quantifying retained versus lost variance or energy
- **Excellent (A):** Effectively commands direct the AI to justify the chosen rank by analyzing the singular value spectrum and quantifying retained versus lost variance or energy with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Address how the input matrix should be prepared before computing the SVD for
- **Description:** Guides AI to address how the input matrix should be prepared (centering, normalization, imputation) before computing the SVD for low-rank approximation
- **Excellent (A):** Effectively guides AI to address how the input matrix should be prepared (centering, normalization, imputation) before computing the SVD for low-rank approximation with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Interpretation of the dominant singular vectors
- **Description:** Addresses interpretation of the dominant singular vectors and their relationship to the original features or structure of the data
- **Excellent (A):** Effectively addresses interpretation of the dominant singular vectors and their relationship to the original features or structure of the data with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Solution that clearly separates the approximation step from any downstream analysis
- **Description:** Converges on a solution that clearly separates the approximation step from any downstream analysis and documents the approximation quality with appropriate error metrics
- **Excellent (A):** Effectively converges on a solution that clearly separates the approximation step from any downstream analysis and documents the approximation quality with appropriate error metrics with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 2: Design a Load-Bearing Analysis Solver with Error Reporting
**Subject:** Systems of Equations > Gaussian Elimination, Numerical Stability
**Type:** Assessment

**Raw Problem (intentionally ill-defined):**
> Write a solver (in Python or MATLAB) that reads a structural equilibrium system Ax = b from a configuration file, computes the member forces x, and outputs a report containing: the solution vector, a condition number assessment, and a pass/fail safety verdict. The solver will be used for a pedestrian bridge with "around 50 to 80 joints." The engineers say some force coefficients are "in Newtons while others are in kilonewtons" and want results "accurate to at least three significant figures."

**Framing Rubric:**

#### Criterion 1: System Ax = b is likely to be well-conditioned
- **Description:** Identifies whether the system Ax = b is likely to be well-conditioned or ill-conditioned, and what properties of A (scaling, sparsity, structure) affect numerical stability
- **Excellent (A):** Clearly and specifically identifies whether the system Ax = b is likely to be well-conditioned or ill-conditioned, and what properties of A (scaling, sparsity, structure) affect numerical stability
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: System is consistent, overdetermined
- **Description:** Questions whether the system is consistent, overdetermined, or underdetermined, and what the implications are for solution existence and uniqueness
- **Excellent (A):** Clearly and specifically questions whether the system is consistent, overdetermined, or underdetermined, and what the implications are for solution existence and uniqueness
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Any assumptions about coefficient magnitudes
- **Description:** Notes any assumptions about coefficient magnitudes, units, or scaling that could cause large entry disparities and amplify rounding errors during elimination
- **Excellent (A):** Clearly and specifically notes any assumptions about coefficient magnitudes, units, or scaling that could cause large entry disparities and amplify rounding errors during elimination
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Accuracy requirements impose constraints on which algorithmic variants are
- **Description:** Recognizes that accuracy requirements (e.g., significant figures) impose constraints on which algorithmic variants (pivoting strategies, iterative refinement) are appropriate
- **Excellent (A):** Clearly and specifically recognizes that accuracy requirements (e.g., significant figures) impose constraints on which algorithmic variants (pivoting strategies, iterative refinement) are appropriate
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Applies Gaussian elimination
- **Description:** Detects if AI applies Gaussian elimination without a pivoting strategy when the problem context suggests potential for large element growth or poorly scaled coefficients
- **Excellent (A):** Accurately detects if AI applies Gaussian elimination without a pivoting strategy when the problem context suggests potential for large element growth or poorly scaled coefficients and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Ignores the conditioning of the system
- **Description:** Identifies if AI ignores the conditioning of the system and fails to compute or interpret a condition number to assess solution reliability
- **Excellent (A):** Accurately identifies if AI ignores the conditioning of the system and fails to compute or interpret a condition number to assess solution reliability and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Does not verify the computed solution via residual analysis
- **Description:** Catches if AI does not verify the computed solution via residual analysis or backward error estimation
- **Excellent (A):** Accurately catches if AI does not verify the computed solution via residual analysis or backward error estimation and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Fails to handle special cases
- **Description:** Recognizes if AI fails to handle special cases (singular, near-singular, or rectangular systems) and does not discuss what the solution space looks like in those cases
- **Excellent (A):** Accurately recognizes if AI fails to handle special cases (singular, near-singular, or rectangular systems) and does not discuss what the solution space looks like in those cases and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Direct the AI to select
- **Description:** Commands direct the AI to select and justify an appropriate pivoting or scaling strategy based on the structure and conditioning of the coefficient matrix
- **Excellent (A):** Effectively commands direct the AI to select and justify an appropriate pivoting or scaling strategy based on the structure and conditioning of the coefficient matrix with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Compute and interpret the condition number and to explain its implications for
- **Description:** Guides AI to compute and interpret the condition number and to explain its implications for the accuracy of the solution
- **Excellent (A):** Effectively guides AI to compute and interpret the condition number and to explain its implications for the accuracy of the solution with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: What the solver should do when the system is singular
- **Description:** Addresses what the solver should do when the system is singular or nearly singular, including reporting the null space or least-norm solutions as appropriate
- **Excellent (A):** Effectively addresses what the solver should do when the system is singular or nearly singular, including reporting the null space or least-norm solutions as appropriate with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Solution that includes residual verification
- **Description:** Converges on a solution that includes residual verification, condition number reporting, and explicit handling of numerical stability concerns throughout the elimination process
- **Excellent (A):** Effectively converges on a solution that includes residual verification, condition number reporting, and explicit handling of numerical stability concerns throughout the elimination process with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 3: Create an Interactive SVD Image Compressor Demo
**Subject:** Matrix Decompositions > SVD > Geometric Interpretation
**Type:** Practice

**Raw Problem (intentionally ill-defined):**
> Build a web-based (or Jupyter notebook) interactive demo where a user uploads a grayscale image, selects a rank k via a slider, and sees side-by-side the original image and the rank-k SVD approximation along with the compression ratio and an error metric. Deliver the working demo and a short technical document explaining the geometric meaning of each singular value. The demo should "work well for typical photos" and show "how the image builds up as you add more singular values."

**Framing Rubric:**

#### Criterion 1: SVD decomposes a matrix into a product of three matrices
- **Description:** Identifies that the SVD decomposes a matrix into a product of three matrices, and that each singular value and its associated vectors define a geometric action (stretching along principal directions)
- **Excellent (A):** Clearly and specifically identifies that the SVD decomposes a matrix into a product of three matrices, and that each singular value and its associated vectors define a geometric action (stretching along principal directions)
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Geometric interpretation changes depending on the properties of the matrix
- **Description:** Questions how the geometric interpretation changes depending on the properties of the matrix (rectangular vs. square, rank-deficient vs. full-rank)
- **Excellent (A):** Clearly and specifically questions how the geometric interpretation changes depending on the properties of the matrix (rectangular vs. square, rank-deficient vs. full-rank)
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Understanding the SVD geometrically requires distinguishing between the domain
- **Description:** Notes that understanding the SVD geometrically requires distinguishing between the domain and codomain transformations encoded by V and U respectively
- **Excellent (A):** Clearly and specifically notes that understanding the SVD geometrically requires distinguishing between the domain and codomain transformations encoded by V and U respectively
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Singular values define the semi-axes of the ellipsoid that is the image of the
- **Description:** Recognizes that the singular values define the semi-axes of the ellipsoid that is the image of the unit sphere under the linear transformation
- **Excellent (A):** Clearly and specifically recognizes that the singular values define the semi-axes of the ellipsoid that is the image of the unit sphere under the linear transformation
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Describes singular values only as abstract "importance weights"
- **Description:** Detects if AI describes singular values only as abstract "importance weights" without connecting them to the geometric stretching factors along principal directions
- **Excellent (A):** Accurately detects if AI describes singular values only as abstract "importance weights" without connecting them to the geometric stretching factors along principal directions and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Fails to distinguish between the left
- **Description:** Identifies if AI fails to distinguish between the left and right singular vectors and their respective roles in the domain and codomain geometry
- **Excellent (A):** Accurately identifies if AI fails to distinguish between the left and right singular vectors and their respective roles in the domain and codomain geometry and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Omits the connection between the SVD
- **Description:** Catches if AI omits the connection between the SVD and the ellipsoidal image of the unit ball, or does not explain how rank deficiency manifests geometrically as collapsed dimensions
- **Excellent (A):** Accurately catches if AI omits the connection between the SVD and the ellipsoidal image of the unit ball, or does not explain how rank deficiency manifests geometrically as collapsed dimensions and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Conflates the SVD with eigendecomposition
- **Description:** Recognizes if AI conflates the SVD with eigendecomposition or applies geometric intuitions that only hold for symmetric matrices to general rectangular matrices
- **Excellent (A):** Accurately recognizes if AI conflates the SVD with eigendecomposition or applies geometric intuitions that only hold for symmetric matrices to general rectangular matrices and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Direct the AI to explain the SVD as a sequence of geometric operations: rotation
- **Description:** Commands direct the AI to explain the SVD as a sequence of geometric operations: rotation (V^T), scaling (Sigma), rotation (U), and to illustrate each step
- **Excellent (A):** Effectively commands direct the AI to explain the SVD as a sequence of geometric operations: rotation (V^T), scaling (Sigma), rotation (U), and to illustrate each step with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Connect the singular values to concrete geometric quantities such as semi-axis lengths
- **Description:** Guides AI to connect the singular values to concrete geometric quantities such as semi-axis lengths, maximum stretching factors, and the operator norm
- **Excellent (A):** Effectively guides AI to connect the singular values to concrete geometric quantities such as semi-axis lengths, maximum stretching factors, and the operator norm with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Geometric interpretation extends to rank-k approximation — which directions are preserved
- **Description:** Addresses how the geometric interpretation extends to rank-k approximation — which directions are preserved and which are collapsed, and what this means visually or structurally
- **Excellent (A):** Effectively addresses how the geometric interpretation extends to rank-k approximation — which directions are preserved and which are collapsed, and what this means visually or structurally with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Explanation that ties the algebraic factorization to geometric intuition
- **Description:** Converges on an explanation that ties the algebraic factorization to geometric intuition, covering both the full SVD and the truncated case with appropriate examples or visualizations
- **Excellent (A):** Effectively converges on an explanation that ties the algebraic factorization to geometric intuition, covering both the full SVD and the truncated case with appropriate examples or visualizations with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 4: Prototype a Course Prerequisite Analyzer Using Eigenvalue Centrality
**Subject:** Eigenvalues & Eigenvectors > Diagonalization
**Type:** Assessment

**Raw Problem (intentionally ill-defined):**
> Build a tool that takes a university's course prerequisite graph (as an adjacency list or matrix) and outputs: (1) a ranking of courses by "importance" using eigenvector centrality of the prerequisite adjacency matrix, (2) a visualization of the graph with node sizes proportional to centrality scores, and (3) a recommendation of which courses to prioritize for curriculum reform. Test it on a dataset of "a few hundred courses across STEM departments." The dean wants to know "which courses matter most."

**Framing Rubric:**

#### Criterion 1: Matrix in question is diagonalizable
- **Description:** Identifies whether the matrix in question is diagonalizable and what conditions (e.g., distinct eigenvalues, symmetry) guarantee or prevent diagonalizability
- **Excellent (A):** Clearly and specifically identifies whether the matrix in question is diagonalizable and what conditions (e.g., distinct eigenvalues, symmetry) guarantee or prevent diagonalizability
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Eigenvalues are real or complex
- **Description:** Questions whether the eigenvalues are real or complex, and how the algebraic and geometric multiplicities of each eigenvalue affect the structure of the diagonalization
- **Excellent (A):** Clearly and specifically questions whether the eigenvalues are real or complex, and how the algebraic and geometric multiplicities of each eigenvalue affect the structure of the diagonalization
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Any special structure of the matrix that determines whether a full eigenbasis
- **Description:** Notes any special structure of the matrix (symmetric, nilpotent, defective, triangular) that determines whether a full eigenbasis exists
- **Excellent (A):** Clearly and specifically notes any special structure of the matrix (symmetric, nilpotent, defective, triangular) that determines whether a full eigenbasis exists
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Diagonalization requires finding both eigenvalues
- **Description:** Recognizes that diagonalization requires finding both eigenvalues and a complete set of linearly independent eigenvectors, and that failure of either step must be addressed
- **Excellent (A):** Clearly and specifically recognizes that diagonalization requires finding both eigenvalues and a complete set of linearly independent eigenvectors, and that failure of either step must be addressed
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Assumes a matrix is diagonalizable
- **Description:** Detects if AI assumes a matrix is diagonalizable without verifying that the geometric multiplicity of each eigenvalue equals its algebraic multiplicity
- **Excellent (A):** Accurately detects if AI assumes a matrix is diagonalizable without verifying that the geometric multiplicity of each eigenvalue equals its algebraic multiplicity and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Applies diagonalization techniques that assume symmetry
- **Description:** Identifies if AI applies diagonalization techniques that assume symmetry or real eigenvalues to matrices that do not have those properties
- **Excellent (A):** Accurately identifies if AI applies diagonalization techniques that assume symmetry or real eigenvalues to matrices that do not have those properties and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Computes eigenvalues but does not verify that the eigenvectors form a basis
- **Description:** Catches if AI computes eigenvalues but does not verify that the eigenvectors form a basis, or ignores the case of repeated eigenvalues with deficient eigenspaces
- **Excellent (A):** Accurately catches if AI computes eigenvalues but does not verify that the eigenvectors form a basis, or ignores the case of repeated eigenvalues with deficient eigenspaces and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Conflates diagonalization with other decompositions
- **Description:** Recognizes if AI conflates diagonalization with other decompositions (e.g., Jordan form, Schur decomposition) or applies results that only hold for diagonalizable matrices to the general case
- **Excellent (A):** Accurately recognizes if AI conflates diagonalization with other decompositions (e.g., Jordan form, Schur decomposition) or applies results that only hold for diagonalizable matrices to the general case and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Direct the AI to verify diagonalizability by checking eigenvalue multiplicities
- **Description:** Commands direct the AI to verify diagonalizability by checking eigenvalue multiplicities and computing the dimension of each eigenspace
- **Excellent (A):** Effectively commands direct the AI to verify diagonalizability by checking eigenvalue multiplicities and computing the dimension of each eigenspace with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Correctly construct the change-of-basis matrix P
- **Description:** Guides AI to correctly construct the change-of-basis matrix P and the diagonal matrix D, and to verify that A = PDP^{-1} holds
- **Excellent (A):** Effectively guides AI to correctly construct the change-of-basis matrix P and the diagonal matrix D, and to verify that A = PDP^{-1} holds with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: What to do when the matrix is not diagonalizable — whether to use Jordan normal form
- **Description:** Addresses what to do when the matrix is not diagonalizable — whether to use Jordan normal form, discuss the defective eigenvalues, or explain why the approach fails
- **Excellent (A):** Effectively addresses what to do when the matrix is not diagonalizable — whether to use Jordan normal form, discuss the defective eigenvalues, or explain why the approach fails with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Solution that clearly distinguishes between the existence of eigenvalues
- **Description:** Converges on a solution that clearly distinguishes between the existence of eigenvalues, the completeness of the eigenbasis, and the validity of diagonalization as a decomposition strategy
- **Excellent (A):** Effectively converges on a solution that clearly distinguishes between the existence of eigenvalues, the completeness of the eigenbasis, and the validity of diagonalization as a decomposition strategy with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 5: Build a Multi-Sensor Fusion Calibration Module
**Subject:** Inner Product Spaces > Projections > Least Squares
**Type:** Practice

**Raw Problem (intentionally ill-defined):**
> Write a calibration module (Python function or class) that takes in paired readings from a LIDAR sensor and a ground-truth laser tracker, fits a correction model using least squares, and outputs a calibration function that maps raw LIDAR readings to corrected distances. Deliver the module, a diagnostic plot of residuals, and a summary of calibration accuracy. The lab has "several hundred paired measurements" spanning 0.5m to 30m. The engineer notes that "readings get noisier further out" and there may be "a few obviously wrong points from when someone walked through the beam."

**Framing Rubric:**

#### Criterion 1: Structure of the least squares problem: what the design matrix
- **Description:** Identifies the structure of the least squares problem: what the design matrix (A), observation vector (b), and parameter vector (x) represent, and whether A has full column rank
- **Excellent (A):** Clearly and specifically identifies the structure of the least squares problem: what the design matrix (A), observation vector (b), and parameter vector (x) represent, and whether A has full column rank
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Assumptions of ordinary least squares hold — in particular
- **Description:** Questions whether the assumptions of ordinary least squares hold — in particular, whether the errors are homoscedastic, uncorrelated, and normally distributed
- **Excellent (A):** Clearly and specifically questions whether the assumptions of ordinary least squares hold — in particular, whether the errors are homoscedastic, uncorrelated, and normally distributed
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Choice of basis functions for the model determines the columns of A
- **Description:** Notes that the choice of basis functions (linear, polynomial, other) for the model determines the columns of A and must be justified rather than assumed
- **Excellent (A):** Clearly and specifically notes that the choice of basis functions (linear, polynomial, other) for the model determines the columns of A and must be justified rather than assumed
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Projection interpretation of least squares provides geometric insight into the solution
- **Description:** Recognizes that the projection interpretation of least squares (projecting b onto the column space of A) provides geometric insight into the solution and the residual
- **Excellent (A):** Clearly and specifically recognizes that the projection interpretation of least squares (projecting b onto the column space of A) provides geometric insight into the solution and the residual
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Applies ordinary least squares
- **Description:** Detects if AI applies ordinary least squares without checking or discussing whether the standard assumptions (constant variance, independent errors) are met
- **Excellent (A):** Accurately detects if AI applies ordinary least squares without checking or discussing whether the standard assumptions (constant variance, independent errors) are met and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Constructs the design matrix
- **Description:** Identifies if AI constructs the design matrix without justifying the choice of model terms or considering whether the model may be overfitting or underfitting the data
- **Excellent (A):** Accurately identifies if AI constructs the design matrix without justifying the choice of model terms or considering whether the model may be overfitting or underfitting the data and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Solves the normal equations directly
- **Description:** Catches if AI solves the normal equations directly (A^T A x = A^T b) without addressing potential conditioning issues or considering QR-based or SVD-based alternatives
- **Excellent (A):** Accurately catches if AI solves the normal equations directly (A^T A x = A^T b) without addressing potential conditioning issues or considering QR-based or SVD-based alternatives and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Omits residual analysis
- **Description:** Recognizes if AI omits residual analysis or fails to examine whether the residuals exhibit patterns that would indicate model misspecification or violated assumptions
- **Excellent (A):** Accurately recognizes if AI omits residual analysis or fails to examine whether the residuals exhibit patterns that would indicate model misspecification or violated assumptions and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Direct the AI to formulate the problem as a projection onto the column space of A
- **Description:** Commands direct the AI to formulate the problem as a projection onto the column space of A and to explain why the solution minimizes the residual norm
- **Excellent (A):** Effectively commands direct the AI to formulate the problem as a projection onto the column space of A and to explain why the solution minimizes the residual norm with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Examine whether weighted least squares
- **Description:** Guides AI to examine whether weighted least squares or robust alternatives are needed based on the error structure, and to justify whichever formulation is used
- **Excellent (A):** Effectively guides AI to examine whether weighted least squares or robust alternatives are needed based on the error structure, and to justify whichever formulation is used with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Model selection: the AI should compare candidate models of different complexity
- **Description:** Addresses model selection: the AI should compare candidate models of different complexity and use residual diagnostics or information criteria to choose among them
- **Excellent (A):** Effectively addresses model selection: the AI should compare candidate models of different complexity and use residual diagnostics or information criteria to choose among them with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Solution that includes proper formulation of the normal equations
- **Description:** Converges on a solution that includes proper formulation of the normal equations or a numerically stable alternative, residual analysis, and discussion of when the least squares solution is and is not appropriate
- **Excellent (A):** Effectively converges on a solution that includes proper formulation of the normal equations or a numerically stable alternative, residual analysis, and discussion of when the least squares solution is and is not appropriate with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

