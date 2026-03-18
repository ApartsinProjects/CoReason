# Session 3 — RT-qPCR Validation Panel for RNA-Seq Hits (Open-Ended)

**Challenge Type:** Practice
**Subject:** Molecular Techniques > PCR & qPCR
**Response Mode:** Open-Ended (Structured Sections)

---

## Raw Problem

> Design a complete RT-qPCR validation experiment to confirm 8 differentially expressed genes identified by RNA-seq in human pancreatic ductal adenocarcinoma (PDAC) tissue versus matched adjacent normal tissue. Deliver a primer table (forward/reverse sequences, amplicon size, Tm), a plate layout diagram for a 96-well run, and a statistical analysis plan. The number of patient samples available, the reference genes to use, and the quantification method (absolute vs. relative) are not specified.

---

## PHASE 1 — FRAMING

### Student Response (Open-Ended Sections)

**Sample Size and Power:**

1. The number of patient samples (biological replicates) is not stated. This is critical because it determines statistical power — with only 3 paired samples, we cannot detect moderate fold-changes with adequate power, while 10+ samples would be needed for robust validation of RNA-seq hits.
2. No mention of whether technical replicates should be run and how many — typically 2-3 technical replicates per biological sample per gene.

**Quantification and Normalization:**

1. The quantification method is unspecified. Relative quantification (delta-delta Ct) is standard for fold-change validation but requires stable reference genes, while absolute quantification requires calibration curves and is more appropriate when exact copy numbers matter.
2. Reference genes are not specified. Common housekeepers like GAPDH and ACTB may be differentially regulated in PDAC, so reference gene stability must be validated for this specific tissue comparison.

**RNA Quality:**

1. RNA quality requirements are not stated. FFPE tissue versus fresh-frozen tissue requires very different primer/amplicon design strategies (shorter amplicons for degraded FFPE RNA).
2. No RNA integrity threshold (e.g., RIN score cutoff) is specified.

### AI Solution (with intentional issues)

**AI Output:**

**Primer Table:**

| Gene | Forward (5'-3') | Reverse (5'-3') | Amplicon | Tm |
|------|-----------------|-----------------|----------|-----|
| KRAS | ATGACTGAATATAAACTTGTGG | TCAAAGAATGGTCCTGGACC | 185 bp | 58C |
| TP53 | GCCATCTACAAGCAGTCACAG | CATCCAAATACTCCACACGC | 220 bp | 60C |
| SMAD4 | TGAATCCATATCACTACGAAC | GCTGCAATTGATCTCTAATGG | 198 bp | 57C |
| MUC1 | ACCATCCTATGAGCGAGTACC | GACGTGCCCCTACAAGTTGG | 175 bp | 61C |
| S100P | ATGACGGAACTAGAGACAGCC | TCATTTGAGTCCTGCCTTCTC | 150 bp | 59C |
| MSLN | GCAGCCTCTCCTTCAACATC | CTCAGGGCTTAATAACCATGC | 210 bp | 59C |
| CLDN18 | AGTGGACTCAGGTCTTCAAGG | CATGATGTACTGCGATGACGG | 165 bp | 60C |
| MMP7 | GAGTGAGCTACAGTGGGAACA | CTATGACGCGGGAGTTTAACAT | 190 bp | 59C |
| GAPDH | ACCACAGTCCATGCCATCAC | TCCACCACCCTGTTGCTGTA | 452 bp | 60C |

**Plate Layout:** All 8 genes + GAPDH across 9 columns, 8 patients in rows, single replicate per well.

**Analysis:** Use delta-delta Ct with GAPDH as reference. Fold change > 2 is significant.

**Issues in AI output:**
- Only 1 reference gene (GAPDH), not validated for PDAC tissue stability
- No exon-junction spanning confirmed for any primer
- No BLAST verification or in-silico PCR mentioned
- GAPDH amplicon at 452 bp is too long (should be 80-200 bp for qPCR)
- Single replicate per well — no technical replicates
- No no-template controls (NTC) or no-RT controls in plate layout
- "Fold change > 2 is significant" — no statistical test specified, no multiple testing correction
- Tm values not verified; some primers may have significant Tm mismatch within pairs
- No primer efficiency validation mentioned

### Framing Feedback

**Assessment:** The student identified the three most important ambiguities: sample number (statistical power), quantification method and reference gene selection, and RNA quality requirements. The recognition that FFPE vs. fresh-frozen tissue demands different amplicon design strategies shows practical awareness. However, the student did not question whether the 8 target genes were already filtered for statistical significance and fold-change cutoffs from the RNA-seq data, or whether the qPCR validation should include any genes expected NOT to change (negative controls for the validation itself). The student also did not flag that primer design should consider known SNPs in the amplicon region that could affect primer binding in different patient samples.

**Framing Grade: A**
Solid identification of the core quantitative ambiguities and RNA quality concern, but missed experimental design considerations (negative control genes, SNP avoidance in primer regions).

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**AI Output (from Phase 1 above)**

**Student Judging (internal, not sent to AI):**

gaps:
  - name: "The primer table provides sequences but no evidence that"
    description: "The primer table provides sequences but no evidence that they span exon-exon junctions. Without this, genomic DNA contamination could produce false signals. - GAPDH is the only reference gene. GAPDH is known to vary in PDAC vs. normal tissue. At minimum, 2-3 reference genes should be used, validated by geNorm or NormFinder."
  - name: "The GAPDH amplicon is 452 bp"
    description: "The GAPDH amplicon is 452 bp — far too long for efficient qPCR amplification. Standard qPCR amplicons should be 80-200 bp."
  - name: "The plate layout has no NTC or no-RT controls, which are"
    description: "The plate layout has no NTC or no-RT controls, which are essential for detecting contamination and genomic DNA carryover. -"

**Student Steering Prompt (sent to AI):**

instructions:
  - name: "Several issues need correction: (1) Replace GAPDH as the"
    description: "Several issues need correction: (1) Replace GAPDH as the sole reference gene with 3 candidates (e.g., HPRT1, TBP, PPIA) and include a plan to validate their stability across PDAC/normal pairs using geNorm or NormFinder. (2) All primers must span exon-exon junctions to exclude genomic DNA — please confirm this for each primer and note which exons are joined. (3) Redesign the GAPDH amplicon to be <200 bp if it is retained. (4) Add no-template controls (NTC) and no-reverse-transcriptase (no-RT) controls to the plate layout — at least one NTC and one no-RT per gene. (5) Replace"

**Updated AI Output:**

**Revised Reference Gene Strategy:**
Candidate reference genes: HPRT1, TBP, PPIA (selected for reported stability in pancreatic tissues). Before the main experiment, run all 3 candidates across a subset of 4 PDAC/normal pairs and analyze stability using geNorm (M-value < 0.5) and NormFinder. Normalize target genes to the geometric mean of the 2 most stable references.

**Revised Primer Table:**

| Gene | Forward | Reverse | Amplicon | Tm (F/R) | Exon Junction |
|------|---------|---------|----------|----------|---------------|
| KRAS | ATGACTGAATATAAACTTGTGG | TCAAAGAATGGTCCTGGACC | 142 bp | 58/59C | Exon 2-3 |
| TP53 | GCCATCTACAAGCAGTCACAG | CATCCAAATACTCCACACGC | 128 bp | 60/59C | Exon 5-6 |
| SMAD4 | TGAATCCATATCACTACGAAC | GCTGCAATTGATCTCTAATGG | 156 bp | 57/58C | Exon 8-9 |
| MUC1 | ACCATCCTATGAGCGAGTACC | GACGTGCCCCTACAAGTTGG | 134 bp | 61/61C | Exon 2-3 |
| S100P | ATGACGGAACTAGAGACAGCC | TCATTTGAGTCCTGCCTTCTC | 118 bp | 59/58C | Exon 2-3 |
| MSLN | GCAGCCTCTCCTTCAACATC | CTCAGGGCTTAATAACCATGC | 145 bp | 59/58C | Exon 7-8 |
| CLDN18 | AGTGGACTCAGGTCTTCAAGG | CATGATGTACTGCGATGACGG | 131 bp | 60/60C | Exon 3-4 |
| MMP7 | GAGTGAGCTACAGTGGGAACA | CTATGACGCGGGAGTTTAACAT | 127 bp | 59/59C | Exon 4-5 |
| HPRT1 | TGACACTGGCAAAACAATGCA | GGTCCTTTTCACCAGCAAGCT | 94 bp | 60/61C | Exon 6-7 |
| TBP | TGCACAGGAGCCAAGAGTGAA | CACATCACAGCTCCCCACCA | 132 bp | 61/62C | Exon 3-4 |
| PPIA | GTCAACCCCACCGTGTTCTTC | TTTCTGCTGTCTTTGGGACCTTG | 101 bp | 62/61C | Exon 2-3 |

**Revised Plate Layout (96-well):**
- Rows A-H: 8 patient pairs (tumor in wells 1-33, normal in wells 34-66)
- 11 genes x 3 technical replicates = 33 wells per sample type
- Row H, columns 10-11: NTC (1 per gene, pooled across plate)
- Row H, column 12: No-RT controls (pooled RNA, no reverse transcriptase)

**Statistical Plan:**
- Paired Wilcoxon signed-rank test (non-parametric, appropriate for n=8 pairs)
- Benjamini-Hochberg FDR correction across 8 target genes (alpha = 0.05)
- Report adjusted p-values and 95% confidence intervals for fold-change
- Concordance with RNA-seq: Pearson correlation of log2FC(qPCR) vs. log2FC(RNA-seq)

**Judging Feedback:**
The student identified 5 distinct issues, correctly prioritizing the reference gene problem and the missing controls. The observation about the 452 bp GAPDH amplicon shows practical qPCR knowledge — amplicons that long have poor efficiency and are problematic with degraded RNA. However, the student did not check whether the primer Tm values are compatible with a single annealing temperature (some pairs show 3-4C Tm differences), and did not ask about primer specificity verification (BLAST, UCSC in-silico PCR).

**Judging Grade: A**

**Steering Feedback:**
Comprehensive steering prompt that addressed all 5 identified issues with specific remedies. The reference gene strategy (geNorm/NormFinder with specific M-value cutoff) was well-specified. The statistical plan improvement (Wilcoxon + BH correction) was appropriate for the sample size. However, the prompt did not request primer efficiency validation (standard curves) or MIQE compliance details.

**Steering Grade: A**

---

### Cycle 2

**Student Judging (internal):**

gaps:
  - name: "The revised protocol is much improved but still lacks"
    description: "The revised protocol is much improved but still lacks primer efficiency validation. Each primer pair should be tested with a 5-point serial dilution to confirm efficiency between 90-110% and R-squared > 0.98."
  - name: "No mention of MIQE (Minimum Information for Publication"
    description: "No mention of MIQE (Minimum Information for Publication of Quantitative Real-Time PCR Experiments) guidelines, which are the field standard for reporting qPCR data."
  - name: "The plate layout is described but not clearly diagrammed"
    description: "The plate layout is described but not clearly diagrammed — it is difficult to verify that 11 genes x 3 replicates x 2 conditions x 8 patients fits on a 96-well plate (that would be 528 wells — it does NOT fit on one plate)."

**Student Steering Prompt:**

instructions:
  - name: "Two issues: (1) Please add a primer efficiency validation step"
    description: "Two issues: (1) Please add a primer efficiency validation step — for each primer pair, run a 5-point 1:4 serial dilution of pooled cDNA in triplicate, calculate efficiency from the standard curve slope (acceptable range 90-110%, R-squared > 0.98), and report the efficiency for each gene. (2) The plate layout math does not work: 11 genes x 3 replicates x 16 samples (8 pairs) = 528 wells, which exceeds a single 96-well plate. Please recalculate the number of plates needed and design a multi-plate layout with inter-plate calibrators for normalization."

**Updated AI Output:**

**Primer Efficiency Validation Protocol:**
1. Pool equal volumes of cDNA from 4 tumor + 4 normal samples
2. Prepare 5-point 1:4 serial dilution series (undiluted to 1:256)
3. Run each dilution in triplicate for all 11 primer pairs
4. Plot Ct vs. log(dilution); calculate slope
5. Efficiency = (10^(-1/slope) - 1) x 100%
6. Acceptance: 90-110% efficiency, R-squared > 0.98
7. Reject and redesign any primer pair outside this range

**Multi-Plate Layout (6 plates):**

Plate capacity: 96 wells per plate.

- **Plates 1-3:** Target genes — 3 genes per plate, 16 samples x 3 reps = 48 wells for target genes + 16 x 3 = 48 wells for 1 reference gene per plate = 96 wells
- **Plates 4-5:** Remaining 2 target genes + reference genes (same distribution)
- **Plate 6:** Efficiency validation plate (serial dilutions for all 11 primer pairs)

Each plate includes:
- 3 NTC wells (1 per gene on that plate)
- 1 inter-plate calibrator (IPC): pooled cDNA run on every plate for cross-plate Ct normalization
- 1 no-RT control well per plate

**MIQE Compliance Checklist:**
- RNA quality: RIN > 7 (Agilent Bioanalyzer)
- RNA quantity: 500 ng input per RT reaction (Nanodrop A260/280 between 1.8 and 2.0)
- Reverse transcription: oligo-dT + random hexamer mix, specified RT kit and conditions
- Data normalization: geometric mean of 2 most stable reference genes (validated by geNorm)
- All primer efficiencies reported with R-squared values
- Melt curve analysis after each run to confirm single-product amplification

**Judging Feedback:**
Excellent catch on the plate layout arithmetic — the original layout was physically impossible, and this kind of practical error would waste time and reagents if not caught before setup. The primer efficiency validation request was well-targeted; without confirmed efficiencies, the Pfaffl correction cannot be properly applied. However, the student did not address primer specificity verification (BLAST against the human transcriptome, UCSC in-silico PCR) or ask for melt curve analysis parameters.

**Judging Grade: A**

**Steering Feedback:**
Strong steering that caught a critical mathematical error and requested a specific validation protocol with quantitative acceptance criteria. The request for inter-plate calibrators shows awareness of multi-plate experimental design. However, the student could have also requested melt curve analysis to confirm amplicon specificity, and could have asked whether any primer pairs produce alternative splice variant amplicons in PDAC tissue.

**Steering Grade: A**

---

### Cycle 3

**Student Judging (internal):**

gaps:
  - name: "The multi-plate layout is now feasible and includes"
    description: "The multi-plate layout is now feasible and includes inter-plate calibrators. The MIQE checklist is a good addition. - However, the AI still has not performed or mentioned BLAST verification of primer specificity — primers could bind to pseudogenes, processed pseudogenes, or highly similar family members (e.g., KRAS vs. HRAS/NRAS). - Melt curve analysis is mentioned in the MIQE checklist but no parameters are specified (e.g., 65-95C ramp, 0.5C increments)."

**Student Steering Prompt:**

instructions:
  - name: "Please add primer specificity verification: (1) BLAST"
    description: "Please add primer specificity verification: (1) BLAST each primer pair against the human RefSeq transcript database (NCBI Primer-BLAST) and confirm no unintended amplicons <1000 bp from other transcripts, especially for gene families with high homology (e.g., confirm KRAS primers do not amplify HRAS or NRAS). (2) Specify melt curve parameters: 65-95C ramp at 0.5C per step, hold 5 seconds per step. A single sharp peak confirms a single product; shoulder peaks or multiple peaks indicate non-specific amplification and require primer redesign."

**Updated AI Output:**

**Primer Specificity Verification:**

| Gene | BLAST Result | Potential Cross-reactivity | Status |
|------|-------------|---------------------------|--------|
| KRAS | Unique; no HRAS/NRAS amplicon | None detected (<1000 bp) | Pass |
| TP53 | Unique; no TP53-related pseudogene amplicon | TP63/TP73 checked — no match | Pass |
| SMAD4 | Unique | None | Pass |
| MUC1 | Unique; MUC family members checked | MUC16 — no match | Pass |
| S100P | Unique; S100 family checked | S100A1-A16 — no match | Pass |
| MSLN | Unique | None | Pass |
| CLDN18 | Unique; claudin family checked | CLDN3/4 — no match | Pass |
| MMP7 | Unique; MMP family checked | MMP1/2/9 — no match | Pass |
| HPRT1 | Unique; known processed pseudogenes avoided by exon-junction spanning | Pass | Pass |
| TBP | Unique | None | Pass |
| PPIA | Unique; PPIB/PPIC checked | No match | Pass |

**Melt Curve Parameters:**
- Ramp: 65C to 95C, 0.5C increments, 5-second hold per step
- Acceptance: single sharp peak at expected Tm (within 2C of predicted)
- Rejection: shoulder peaks, broad peaks, or secondary peaks indicate non-specific products

**Judging Feedback:**
The student correctly identified the primer specificity gap — for gene families with high sequence homology (RAS family, MMP family, S100 family), cross-amplification is a real risk that BLAST verification addresses. The melt curve parameter specification was a practical addition. At this stage, the experimental design is comprehensive. The student could have further pushed for a data analysis pipeline (software for Ct calling, outlier exclusion criteria, data export format).

**Judging Grade: A**

**Steering Feedback:**
Targeted and practical steering that addressed the remaining primer QC gap. Naming specific gene family members to check (HRAS/NRAS for KRAS primers) demonstrates deep knowledge of the target genes. The melt curve specification was precise and actionable. The deliverable set is now close to complete. Minor remaining gap: the student did not ask about data analysis software or Ct calling parameters.

**Steering Grade: A**

---

## COMPLETION

### Final Grades

| Skill | Grade | Rationale |
|-------|-------|-----------|
| **Framing** | **B+** | Identified core ambiguities (sample size, reference genes, quantification method, RNA quality) but missed negative control genes and SNP considerations. |
| **Judging** | **B+/A-** | Strong progression: caught reference gene issues and missing controls in Cycle 1, identified the impossible plate layout in Cycle 2, and caught the primer specificity gap in Cycle 3. |
| **Steering** | **B+/A-** | Improved across cycles from comprehensive but incomplete (missing efficiency validation) to targeted and precise (BLAST specificity, melt curves). |

### Summary

The student (Daniela Ortiz) demonstrated solid and improving competence in evaluating an AI-designed RT-qPCR experiment. The most impressive moment was catching the plate layout arithmetic error in Cycle 2 — the AI proposed a layout that was physically impossible, and the student correctly identified this and requested a realistic multi-plate design with inter-plate calibrators. Framing was adequate but could have been more thorough in questioning the experimental design philosophy (negative control genes, SNP avoidance). Judging and steering both improved across three cycles, moving from identifying obvious missing elements (reference genes, controls) to catching subtle errors (plate capacity, primer specificity in gene families). Growth areas include engaging with MIQE reporting requirements from the start and considering the data analysis pipeline beyond the bench protocol.
