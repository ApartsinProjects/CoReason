# Session 3 — RT-qPCR Validation Panel for RNA-Seq Hits (Multiple Choice)

**Challenge Type:** Practice
**Subject:** Molecular Techniques > PCR & qPCR
**Response Mode:** Multiple Choice (5 options per question)

---

## Raw Problem

> Design a complete RT-qPCR validation experiment to confirm 8 differentially expressed genes identified by RNA-seq in human pancreatic ductal adenocarcinoma (PDAC) tissue versus matched adjacent normal tissue. Deliver a primer table (forward/reverse sequences, amplicon size, Tm), a plate layout diagram for a 96-well run, and a statistical analysis plan. The number of patient samples available, the reference genes to use, and the quantification method (absolute vs. relative) are not specified.

---

## PHASE 1 — FRAMING

### Student Response (Multiple Choice)

**Question 1: What is the MOST critical unspecified parameter that affects statistical power and plate layout?**

A) The brand of qPCR instrument to use
B) The number of biological replicates (patient-matched pairs), which determines statistical power to detect fold-changes, and the number of technical replicates per sample, which determines plate space requirements
C) The color of the PCR plates (white vs. clear)
D) The type of seal used on the plate
E) The location of the thermal cycler in the lab

**Student selects: B**

**Question 2: Which missing information makes the normalization strategy unreliable?**

A) The melting temperature of water
B) The reference genes have not been specified or validated for stability in PDAC vs. normal tissue — commonly used housekeepers like GAPDH and ACTB may be differentially regulated in cancer, requiring validation with tools like geNorm or NormFinder
C) The weight of the tissue samples
D) The age of the qPCR reagents
E) The humidity in the lab

**Student selects: B**

**Question 3: What unspecified variable affects primer and amplicon design?**

A) The font used to display sequences
B) The RNA source quality (fresh-frozen vs. FFPE tissue) and integrity threshold (RIN score), which constrain amplicon length — degraded RNA from FFPE requires shorter amplicons (<100 bp) versus fresh-frozen (up to 200 bp)
C) The color of the RNA pellet
D) The diameter of the microcentrifuge tubes
E) The brand of nuclease-free water

**Student selects: B**

**Question 4: What aspect of the quantification strategy is left open?**

A) The number of decimal places for Ct values
B) Whether to report raw Ct values or normalized values
C) Whether to use relative quantification (delta-delta Ct or Pfaffl method, requiring stable reference genes) or absolute quantification (requiring standard curves with known copy numbers), and which statistical test and multiple-testing correction to apply across 8 genes
D) The number of significant figures in fold-change calculations
E) The spreadsheet software for data analysis

**Student selects: C**

### AI Solution (with intentional issues)

**AI Output:**

**Primer Table:** 8 target gene primers + GAPDH (reference), amplicons ranging from 150-452 bp, Tm values 57-61C.

**Plate Layout:** 9 genes in columns, 8 patients in rows, single replicate per well. No controls.

**Analysis:** Delta-delta Ct with GAPDH normalization. "Fold change > 2 is considered significant."

**Issues in AI output:**
- Only 1 unvalidated reference gene (GAPDH)
- GAPDH amplicon (452 bp) too long for qPCR
- No exon-junction spanning for primers
- No NTC or no-RT controls
- Single replicate (no technical replicates)
- No statistical test or multiple-testing correction
- No primer specificity verification
- No efficiency validation

### Framing Feedback

**Assessment:** The student correctly identified all four critical gaps: sample size and replicates (B), reference gene validation (B), RNA quality constraints (B), and quantification method (C). All selections were accurate and chose the most scientifically rigorous option. The student demonstrated understanding that RT-qPCR experimental design is constrained by sample quality, normalization strategy, and statistical rigor. However, the MC format did not allow the student to note that negative control genes (genes expected NOT to change) should be included as internal validation checks.

**Framing Grade: A**
All correct selections showing strong grasp of RT-qPCR experimental design requirements.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**AI Output (from Phase 1 above):**

**Question 5 (Judging): What is the MOST critical deficiency in the AI's experimental design?**

A) The primer sequences are not color-coded
B) The AI uses only GAPDH as a reference gene without validating its stability in PDAC tissue, and the GAPDH amplicon (452 bp) is too long for reliable qPCR — proper normalization requires 2-3 reference genes validated by geNorm or NormFinder for the specific tissue comparison
C) The primer table should include GC content
D) The plate should be 384-well instead of 96-well
E) The Tm values should all be exactly 60C

**Student selects: B**

**Question 6 (Steering): What is the BEST prompt to improve the reference gene strategy and controls?**

A) "Please add more reference genes."
B) "Please use ACTB instead of GAPDH."
C) "Please replace the single GAPDH reference with 3 candidate reference genes (HPRT1, TBP, PPIA) validated for pancreatic tissue. Include a pre-experiment stability assessment using geNorm (M < 0.5). Redesign all amplicons to 80-150 bp. Add NTC and no-RT controls to the plate layout. Specify that primers must span exon-exon junctions."
D) "Please add 18S rRNA as a second reference."
E) "Please run each sample twice."

**Student selects: C**

**Updated AI Output:**

**Revised Reference Genes:** HPRT1, TBP, PPIA — stability validated by geNorm across 4 PDAC/normal pairs before main experiment. Normalize to geometric mean of 2 most stable.

**Revised Primer Table:** All amplicons 80-150 bp, exon-junction spanning confirmed for each, Tm within 59-61C range.

**Revised Plate Layout:** 11 genes (8 target + 3 reference), 3 technical replicates, NTC per gene, no-RT control wells included.

**Judging Feedback:**
Correct identification of the most impactful deficiency. Using a single unvalidated reference gene in cancer tissue comparison is a well-known pitfall that can produce systematically biased results. The amplicon length issue compounds the problem.

**Judging Grade: A**

**Steering Feedback:**
Option C was comprehensive — it specified replacement genes, a validation method with quantitative criteria, amplicon length constraints, control requirements, and primer design rules in a single prompt. This level of specificity drives substantial improvement.

**Steering Grade: A**

---

### Cycle 2

**Question 7 (Judging): What critical gap remains in the revised experimental plan?**

A) The plate should be a different color
B) The experiment lacks primer efficiency validation (standard curves with acceptance criteria) and the plate layout has not been checked for feasibility — 11 genes x 3 replicates x 16 samples = 528 wells, which far exceeds a single 96-well plate capacity
C) The analysis should use absolute quantification
D) More target genes should be added
E) The experiment should be done in triplicate biological replicates only

**Student selects: B**

**Question 8 (Steering): What steering prompt best addresses the efficiency validation and plate capacity problem?**

A) "Please use more plates."
B) "Please add a primer efficiency validation step: 5-point 1:4 serial dilution of pooled cDNA in triplicate per primer pair, with acceptance criteria of 90-110% efficiency and R-squared > 0.98. Also, recalculate the plate layout — the current design requires 528 wells across multiple 96-well plates. Design a multi-plate layout with inter-plate calibrators (pooled cDNA on every plate) and specify how many plates are needed."
C) "Please switch to digital PCR."
D) "Please reduce the number of replicates."
E) "Please use a 384-well plate instead."

**Student selects: B**

**Updated AI Output:**

**Primer Efficiency Protocol:**
- 5-point 1:4 serial dilution of pooled cDNA (tumor + normal)
- Triplicate per dilution per primer pair
- Acceptance: efficiency 90-110%, R-squared > 0.98
- Failed primers redesigned and retested

**Multi-Plate Layout (6 plates):**
- Plates 1-5: 2-3 genes per plate, each with 16 samples x 3 reps + reference gene(s) on every plate + NTC + IPC
- Plate 6: Efficiency validation (serial dilutions for all 11 primer pairs)
- Inter-plate calibrator: pooled cDNA on all plates for cross-plate normalization
- No-RT controls: 1 per plate

**Statistical Analysis (updated):**
- Pfaffl method with efficiency correction
- Paired Wilcoxon signed-rank test per gene
- Benjamini-Hochberg FDR correction (q < 0.05)
- Concordance: Spearman correlation of log2FC(qPCR) vs. log2FC(RNA-seq)

**Judging Feedback:**
The student caught the plate capacity arithmetic error — a critical practical issue that the AI overlooked. Without this correction, the experiment could not be physically executed as described. The efficiency validation request was also appropriate; without confirmed efficiencies, efficiency-corrected relative quantification is invalid. However, the student did not notice that the AI still has not specified primer specificity verification (BLAST, in-silico PCR) or melt curve analysis parameters.

**Judging Grade: A**

**Steering Feedback:**
Option B was well-constructed, combining the mathematical correction with a specific efficiency validation protocol. The request for inter-plate calibrators shows awareness of practical multi-plate qPCR design. Missing: primer specificity verification and melt curve parameters.

**Steering Grade: A**

---

## COMPLETION

### Final Grades

| Skill | Grade | Rationale |
|-------|-------|-----------|
| **Framing** | **A-** | All four MC selections correct, covering sample size, reference genes, RNA quality, and quantification method. |
| **Judging** | **B+/A-** | Correctly identified unvalidated reference gene and plate capacity error. Did not catch missing primer specificity verification. |
| **Steering** | **A-/A** | Selected comprehensive, specific prompts with quantitative acceptance criteria. Drove substantial protocol improvements. |

### Summary

The student (Aisha Patel) performed well across the MC-format session. Framing demonstrated clear understanding of what makes an RT-qPCR experiment rigorous. The standout judging moment was catching the plate layout arithmetic error — a practical issue that would derail the experiment at the bench. Steering selections were consistently strong, choosing options that combined specific tools, quantitative criteria, and practical considerations. The main gap was not catching the absence of primer specificity verification (BLAST) and melt curve analysis, which are standard quality checks that should have been identified in the final cycle. Overall, the student shows strong experimental design sensibility with room to grow in primer-level quality control awareness.
