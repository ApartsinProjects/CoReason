# Session 4 — Bisulfite Sequencing Experiment to Map Promoter Methylation (Multiple Choice)

**Challenge Type:** Assessment
**Subject:** Gene Expression > Regulation > Epigenetics
**Response Mode:** Multiple Choice (5 options per question)

---

## Raw Problem

> Design and write a detailed experimental protocol to map CpG methylation across a 2 kb promoter region of the BRCA1 gene in a breast cancer cell line versus a non-tumorigenic control line. Deliver a step-by-step bench protocol (from DNA extraction through library prep), a bioinformatics analysis pipeline outline, and a results interpretation guide specifying what methylation patterns would support or refute the hypothesis that promoter hypermethylation silences BRCA1. The specific cell lines, sequencing platform, and read-depth target are not provided.

---

## PHASE 1 — FRAMING

### Student Response (Multiple Choice)

**Question 1: What is the MOST critical unspecified variable that affects the validity of the comparison?**

A) The brand of DNA extraction kit
B) The specific cell lines to use — breast cancer lines have highly variable BRCA1 methylation status (e.g., UACC-3199 has documented methylation, MCF-7 does not), so the model system choice determines whether the experiment can test the hypothesis at all
C) The color of the cell culture flasks
D) The incubator CO2 percentage
E) The passage number notation system

**Student selects: B**

**Question 2: Which assay design choice is left open and has major cost/depth implications?**

A) The label maker for tube labeling
B) Whether to use targeted bisulfite amplicon sequencing (cost-effective, deep coverage of the 2 kb region) versus whole-genome bisulfite sequencing (expensive, shallow coverage at any single locus), which determines the sequencing platform, library prep, and achievable read depth
C) The type of gloves to wear
D) The brand of thermal cycler
E) The freezer temperature for sample storage

**Student selects: B**

**Question 3: What quantitative threshold is missing from the interpretation framework?**

A) The number of pages in the results section
B) The minimum number of clones to sequence
C) An operational definition of "hypermethylation" — what magnitude of methylation difference (e.g., >30% gain at consecutive CpG sites) constitutes a biologically meaningful change, and whether this should be assessed per-site or per-region
D) The font size for figures
E) The number of colors in the heatmap

**Student selects: C**

**Question 4: What is underspecified about the sequencing and analysis approach?**

A) The file naming convention
B) The sequencing platform (MiSeq vs. HiSeq vs. NovaSeq), the target read depth per CpG site (which determines the precision of methylation fraction estimates), and whether the bioinformatics pipeline will use bisulfite-aware alignment tools
C) The bioinformatics server operating system
D) The programming language for scripts
E) The version control system for code

**Student selects: B**

### AI Solution (with intentional issues)

**AI Output:**

**Protocol:** Extract DNA, bisulfite convert (EZ DNA Methylation Kit), PCR amplify BRCA1 promoter, clone into TOPO vector, Sanger sequence 10 clones per sample.

**Bioinformatics:** Align with Bowtie2, call methylation with custom script, compare with t-test.

**Interpretation:** If >50% of CpG sites are methylated in cancer, BRCA1 is silenced by methylation.

**Issues:** 10 clones = ~10x coverage (underpowered), Bowtie2 not bisulfite-aware, no conversion control, binary interpretation, no biological replicates, no functional validation.

### Framing Feedback

**Assessment:** The student correctly identified all four critical gaps: cell line model choice (B), assay scale and depth (B), quantitative hypermethylation threshold (C), and sequencing platform and pipeline requirements (B). The selections demonstrate understanding that bisulfite sequencing experiments are constrained by model system validity, assay depth, and the need for quantitative interpretation. However, the MC format did not allow the student to raise additional concerns about bisulfite conversion efficiency controls or the need to link methylation to gene expression functionally.

**Framing Grade: A**
All correct selections, but the student chose the weaker option for Question 3 — while quantitative thresholds are important, the lack of functional validation (connecting methylation to expression) is arguably a more fundamental omission. Still, all answers were substantively correct.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**AI Output (from Phase 1 above):**

**Question 5 (Judging): What is the MOST critical methodological error in the AI's protocol?**

A) The TOPO cloning step uses the wrong vector
B) Sanger sequencing of only 10 clones provides ~10x coverage, which is far too low for quantitative CpG methylation analysis, AND the AI uses Bowtie2 for alignment, which is not bisulfite-aware and will misalign C-to-T converted reads as mismatches
C) The DNA extraction kit should be a different brand
D) The bisulfite conversion should use a different chemical
E) The PCR should use a high-fidelity polymerase

**Student selects: B**

**Question 6 (Steering): What is the BEST prompt to fix the sequencing and alignment approach?**

A) "Sequence more clones."
B) "Use a different aligner."
C) "Replace clone-based Sanger sequencing with targeted bisulfite amplicon sequencing on Illumina MiSeq (2x300 bp) to achieve >500x coverage per CpG. Use Bismark (with Bowtie2 backend) for bisulfite-aware alignment, followed by bismark_methylation_extractor for per-CpG methylation fraction quantification. Report methylation as a continuous variable (0.0-1.0) at each CpG site."
D) "Try nanopore sequencing instead."
E) "Increase the number of PCR cycles."

**Student selects: C**

**Updated AI Output:**

**Revised Sequencing:**
- Platform: Illumina MiSeq, 2x300 bp paired-end
- Target: 3-4 overlapping amplicons covering the 2 kb BRCA1 promoter
- Expected depth: >500x per CpG site
- Library prep: Bisulfite amplicon-seq with indexed adapters

**Revised Bioinformatics:**
1. Trim adapters (Trim Galore)
2. Align to hg38 with Bismark (directional, Bowtie2 backend)
3. Deduplicate (deduplicate_bismark)
4. Extract per-CpG methylation (bismark_methylation_extractor)
5. Output: methylation fraction (0.0-1.0) at each CpG across the 2 kb region

**Statistical comparison:** Fisher's exact test per CpG, Benjamini-Hochberg correction.

**Judging Feedback:**
Correct identification of both critical errors in a single answer — the coverage depth problem and the aligner problem. These two issues together would render the data both imprecise (10x coverage) and inaccurate (wrong aligner). Good prioritization.

**Judging Grade: A**

**Steering Feedback:**
Option C was excellent — it specified the platform, target depth, correct alignment software with the appropriate wrapper, and requested continuous rather than binary methylation output. This prompt produced a fundamentally sound revised pipeline.

**Steering Grade: A**

---

### Cycle 2

**Question 7 (Judging): What essential quality control is MISSING from the revised protocol?**

A) A positive control for the MiSeq instrument
B) A bisulfite conversion efficiency control (e.g., spiked-in unmethylated lambda DNA to verify >99% C-to-T conversion), biological replicates (the protocol uses a single replicate per cell line), and bisulfite-specific primer design rules (avoiding CpG sites in primer binding regions)
C) A negative control for the DNA extraction
D) A blank well on the sequencing run
E) A control for the adapter ligation step

**Student selects: B**

**Question 8 (Steering): What prompt best addresses the missing controls and replicates?**

A) "Add more controls."
B) "Please add: (1) 1% unmethylated lambda DNA spike-in as a bisulfite conversion control (acceptance: >99% conversion); (2) 3 independent biological replicates per cell line from separate culture passages; (3) bisulfite PCR primer design using MethPrimer or BiSearch, placing primers in CpG-free regions or using degenerate Y/R bases at unavoidable CpG positions to prevent methylation-biased amplification."
C) "Run the experiment three times."
D) "Add a water-only control."
E) "Use a methylated DNA control sample."

**Student selects: B**

**Updated AI Output:**

**Conversion Control:**
- Spike 1% unmethylated lambda phage DNA into each gDNA sample
- After sequencing, check lambda CpGs: expect >99% unmethylated (= successful conversion)
- Reject samples with <99% conversion

**Biological Replicates:**
- 3 independent replicates per cell line (UACC-3199 and MCF-10A)
- Each from a separate passage (minimum 3 passages apart)
- Total: 6 samples through the full protocol

**Primer Design:**
- Design using MethPrimer 2.0
- Place primers in CpG-free zones flanking target amplicons
- If CpG unavoidable: forward primer uses Y (C/T), reverse uses R (A/G)
- Tm range: 52-58C (lower for bisulfite DNA due to reduced complexity)
- Validate specificity with BiSearch against bisulfite-converted hg38

**Judging Feedback:**
The student correctly identified all three missing quality elements in a single answer. The conversion efficiency control is the single most important QC metric for bisulfite experiments — without it, apparent methylation could reflect incomplete conversion. Biological replicates are essential for statistical comparison. Primer design rules for bisulfite DNA are often overlooked but critical for avoiding methylation-biased amplification. Strong performance.

**Judging Grade: A**

**Steering Feedback:**
Option B was comprehensive and specific — it named the spike-in control with a threshold, specified replicate requirements, and addressed primer design with named tools and specific degenerate base conventions. This prompt addresses all three gaps simultaneously with actionable detail. The remaining gap: functional validation linking methylation to BRCA1 expression.

**Steering Grade: A**

---

### Cycle 3

**Question 9 (Judging): What fundamental conceptual gap remains in the experimental design?**

A) The experiment needs more sequencing depth
B) The experiment measures methylation but never tests whether methylation actually silences BRCA1 — it lacks functional validation (RT-qPCR for BRCA1 expression, or a demethylation rescue with 5-azacytidine to causally link methylation to gene silencing)
C) The experiment should also measure histone acetylation
D) The experiment should include a male cell line control
E) The experiment needs a larger promoter region

**Student selects: B**

**Question 10 (Steering): What prompt best addresses the functional validation gap?**

A) "Please also measure gene expression."
B) "Please add functional validation: (1) RT-qPCR for BRCA1 mRNA in all 6 samples to test whether hypermethylated samples show reduced expression; (2) a 5-azacytidine demethylation rescue (1 uM, 72 h) in the cancer line to test whether removing methylation restores BRCA1 expression, which would causally link methylation to silencing; (3) use DSS or dmrseq for regional methylation statistics that account for spatial CpG correlation."
C) "Check if BRCA1 is expressed."
D) "Do a Western blot."
E) "Look up BRCA1 expression in a database."

**Student selects: B**

**Updated AI Output:**

**Functional Validation:**

1. **BRCA1 mRNA quantification:** RT-qPCR in all 6 samples (3 cancer + 3 control), primers spanning exon junction, normalized to TBP and PPIA. Expected: reduced BRCA1 mRNA in methylated cancer line.

2. **5-Azacytidine rescue experiment:**
   - Treat UACC-3199 with 1 uM 5-azacytidine for 72 h (refresh daily)
   - DMSO vehicle control in parallel
   - Measure BRCA1 mRNA (RT-qPCR) and protein (Western blot, anti-BRCA1 D-9)
   - Perform bisulfite sequencing on 5-aza-treated cells to confirm demethylation
   - If methylation causes silencing: 5-aza restores BRCA1 expression AND reduces promoter methylation

3. **Regional statistics:** DSS package in R for differentially methylated region (DMR) calling with spatial smoothing, biological replicate modeling, minimum 5 CpGs, >30% methylation difference, adjusted p < 0.01.

**Judging Feedback:**
Correct identification of the conceptual gap — measuring an epigenetic mark without testing its functional consequence is correlation without causation. The 5-azacytidine rescue is the standard approach for establishing this causal link. This was the most important remaining issue in the experimental design.

**Judging Grade: A**

**Steering Feedback:**
Option B was the strongest choice, combining expression quantification, a causal rescue experiment, and improved statistics in a single prompt. The specificity of the 5-aza conditions and the dual readout (expression AND methylation after treatment) make this a rigorous causal test. Excellent final-cycle steering.

**Steering Grade: A**

---

## COMPLETION

### Final Grades

| Skill | Grade | Rationale |
|-------|-------|-----------|
| **Framing** | **B+** | Correctly identified cell line, assay scale, quantitative threshold, and platform gaps. Did not raise conversion controls or functional validation. |
| **Judging** | **A-/A** | Strong progression: identified depth/aligner errors, then conversion controls and primer design, then the functional validation gap. Consistently chose the most impactful deficiency. |
| **Steering** | **A-/A** | Consistently selected the most specific, actionable prompts. Final cycle's functional validation prompt was excellent. |

### Summary

The student (Kenji Nakamura) performed well throughout this MC session, with particular strength in the later cycles. Framing correctly identified the major design constraints but missed some technical controls that were caught later during judging. The most impressive aspect was the steady improvement in judging sophistication — from identifying technical errors (wrong aligner, low depth) to recognizing quality control gaps (conversion efficiency, primer bias) and finally spotting the conceptual gap between measurement and functional validation. Steering selections were uniformly strong, consistently choosing the most comprehensive and specific options. The session demonstrates solid understanding of bisulfite sequencing methodology and the ability to think critically about what an experiment actually proves versus what it merely measures.
