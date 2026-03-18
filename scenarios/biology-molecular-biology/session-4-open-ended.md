# Session 4 — Bisulfite Sequencing Experiment to Map Promoter Methylation (Open-Ended)

**Challenge Type:** Assessment
**Subject:** Gene Expression > Regulation > Epigenetics
**Response Mode:** Open-Ended (Structured Sections)

---

## Raw Problem

> Design and write a detailed experimental protocol to map CpG methylation across a 2 kb promoter region of the BRCA1 gene in a breast cancer cell line versus a non-tumorigenic control line. Deliver a step-by-step bench protocol (from DNA extraction through library prep), a bioinformatics analysis pipeline outline, and a results interpretation guide specifying what methylation patterns would support or refute the hypothesis that promoter hypermethylation silences BRCA1. The specific cell lines, sequencing platform, and read-depth target are not provided.

---

## PHASE 1 — FRAMING

### Student Response (Open-Ended Sections)

**Model System Specification:**

1. The cell lines are not specified. Breast cancer lines vary dramatically in BRCA1 methylation status — for example, UACC-3199 has documented BRCA1 promoter methylation, while MCF-7 does not. The control non-tumorigenic line (e.g., MCF-10A) must be justified as having a known unmethylated BRCA1 promoter for a valid comparison.
2. Cell passage number and culture conditions can affect epigenetic marks — this should be controlled.

**Assay Design Gaps:**

1. The problem does not specify whether to use locus-specific bisulfite sequencing (BSP or pyrosequencing of the 2 kb region) or genome-wide approaches (WGBS, RRBS). For a single 2 kb promoter, targeted bisulfite sequencing (amplicon-based after bisulfite conversion) is the most cost-effective and provides the deepest coverage.
2. No read-depth target is given. For quantitative methylation at individual CpG sites, at least 100x coverage per CpG is needed to detect 10-20% methylation differences with statistical confidence.

**Interpretation Framework:**

1. The problem asks what methylation patterns "support or refute" the hypothesis, but does not define a threshold for what constitutes biologically meaningful hypermethylation. Is 20% average methylation increase sufficient, or does it require >80% at key CpG sites?

### AI Solution (with intentional issues)

**AI Output:**

**Bench Protocol:**
1. Extract genomic DNA from cancer and control cell lines using a spin-column kit
2. Perform bisulfite conversion using the EZ DNA Methylation Kit
3. Design PCR primers for the BRCA1 promoter region
4. Amplify the converted DNA by PCR
5. Clone PCR products into a TOPO vector and Sanger sequence 10 clones per sample
6. Align sequences to the reference and score CpG methylation

**Bioinformatics Pipeline:**
- Align bisulfite-converted reads to the human genome using Bowtie2
- Call methylation at each CpG using a custom script
- Compare cancer vs. normal using a t-test

**Interpretation:**
If >50% of CpG sites are methylated in cancer but not in normal, this supports promoter hypermethylation silencing BRCA1.

**Issues present in AI output:**
- No bisulfite conversion efficiency control (spike-in of unmethylated lambda DNA or methylated control)
- Clone-based Sanger sequencing of 10 clones is underpowered — provides only 10x coverage, not enough for quantitative methylation analysis
- Bowtie2 is not a bisulfite-aware aligner — should use Bismark, bwa-meth, or BS-Seeker2
- No mention of PCR amplification bias in bisulfite-converted DNA
- Primer design for bisulfite-converted DNA requires degenerate positions at CpG sites — not mentioned
- T-test across CpG sites treats them as independent, ignoring spatial correlation
- "50% of sites methylated" is a binary threshold that ignores quantitative methylation levels per site
- No functional validation (does methylation correlate with BRCA1 expression?)
- No biological replicates mentioned
- Cell lines not specified

### Framing Feedback

**Assessment:** The student identified important gaps: the unspecified cell line models, the assay scale question (targeted vs. genome-wide), and the need for a quantitative interpretation threshold. The recognition that different breast cancer lines have different BRCA1 methylation statuses shows literature awareness. However, the student did not question whether bisulfite conversion efficiency controls are needed (a critical quality control), did not address the number of biological replicates required, and did not flag that primers for bisulfite-converted DNA have special design requirements (degenerate bases at CpG positions). The student also did not mention that the hypothesis requires linking methylation to gene expression — a functional validation step.

**Framing Grade: B**
Good model system and assay scale considerations, but missed key technical controls (conversion efficiency), replicate requirements, and the need to link epigenetic marks to functional consequences.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**AI Output (from Phase 1 above):**

**Student Judging (internal, not sent to AI):**

gaps:
  - name: "The AI proposes Sanger sequencing of 10 clones, which"
    description: "The AI proposes Sanger sequencing of 10 clones, which provides only 10x coverage. This is far too low for quantitative CpG methylation analysis — at least 100x is needed to detect modest methylation differences. - Bowtie2 is not a bisulfite-aware aligner. Bisulfite conversion creates C-to-T changes that a standard aligner will misinterpret as mismatches. The correct tools are Bismark (with Bowtie2 backend, but the Bismark wrapper is needed) or bwa-meth."
  - name: "The AI's interpretation framework treats methylation as"
    description: "The AI's interpretation framework treats methylation as binary ("

**Student Steering Prompt (sent to AI):**

instructions:
  - name: "Three critical issues: (1) Replace clone-based Sanger"
    description: "Three critical issues: (1) Replace clone-based Sanger sequencing with targeted bisulfite amplicon sequencing on an Illumina platform (e.g., MiSeq) to achieve >500x coverage per CpG site for robust quantitative methylation calling. (2) Replace Bowtie2 with Bismark, which is specifically designed for bisulfite-converted read alignment and handles the C-to-T conversion computationally. (3) Revise the interpretation to treat methylation as a quantitative, per-site measurement (0-100% methylation fraction at each CpG) rather than binary present/absent."

**Updated AI Output:**

**Revised Sequencing Strategy:**
- Perform targeted bisulfite amplicon sequencing on Illumina MiSeq (2x300 bp paired-end)
- Target: 2 kb BRCA1 promoter region (chr17:43,124,000-43,126,000 in hg38)
- Design 3-4 overlapping amplicons (400-500 bp each) to cover the full 2 kb region
- Expected depth: >500x per CpG site after PCR and sequencing

**Revised Bioinformatics Pipeline:**
1. Trim adapters and low-quality bases (Trim Galore)
2. Align to hg38 using Bismark (Bowtie2 backend, directional library mode)
3. Deduplicate reads (Bismark deduplicate_bismark)
4. Extract methylation: bismark_methylation_extractor (CpG context)
5. Per-CpG methylation fraction: methylated reads / total reads at each CpG
6. Statistical comparison: Fisher's exact test per CpG site, Benjamini-Hochberg correction

**Revised Interpretation Framework:**
- For each CpG site, report methylation fraction (0.0 to 1.0) in cancer vs. normal
- Define hypermethylation as: methylation gain > 30 percentage points (e.g., 10% in normal to 40%+ in cancer) at multiple consecutive CpG sites
- Correlate methylation pattern with known BRCA1 promoter CpG island boundaries and transcription factor binding sites
- Regional methylation: calculate mean methylation across sliding 200 bp windows

**Judging Feedback:**
The student correctly identified the three most critical technical errors: insufficient sequencing depth (10 clones), wrong aligner (Bowtie2 vs. Bismark), and binary interpretation of quantitative data. These represent fundamental methodological problems that would invalidate the entire experiment. However, the student did not catch the absence of a bisulfite conversion efficiency control (critical for data quality) or the lack of biological replicates.

**Judging Grade: A**

**Steering Feedback:**
The steering prompt was well-structured with three clearly delineated corrections, each with specific technical alternatives. The sequencing depth target (>500x) and the quantitative interpretation framework were good additions. However, the prompt did not address conversion efficiency controls, biological replicates, or the special requirements for bisulfite PCR primer design (degenerate CpG positions). The prompt also did not ask for a functional link between methylation and BRCA1 expression.

**Steering Grade: B**

---

### Cycle 2

**Student Judging (internal):**

gaps:
  - name: "The revised pipeline is much improved with Bismark"
    description: "The revised pipeline is much improved with Bismark alignment and quantitative methylation calling. However, there is no bisulfite conversion efficiency control — without spiking in unmethylated lambda DNA (or a similarly unmethylated control), there is no way to verify that the conversion was >99% complete. Incomplete conversion inflates apparent methylation levels."
  - name: "The protocol does not mention biological replicates"
    description: "The protocol does not mention biological replicates. Running a single replicate per cell line makes statistical comparison meaningless — at minimum, 3 independent biological replicates (separate passages/cultures) are needed."
  - name: "The AI has not addressed whether the bisulfite PCR"
    description: "The AI has not addressed whether the bisulfite PCR primers are designed correctly — primers for bisulfite-converted DNA must not overlap CpG sites (or use degenerate bases at those positions) to avoid biasing amplification toward methylated or unmethylated alleles."

**Student Steering Prompt:**

instructions:
  - name: "Three remaining gaps: (1) Add a bisulfite conversion"
    description: "Three remaining gaps: (1) Add a bisulfite conversion efficiency control — spike 1% unmethylated lambda phage DNA into each sample before bisulfite treatment and measure the conversion rate at lambda CpGs (should be >99% non-methylation = >99% C-to-T conversion). (2) Specify that 3 independent biological replicates per cell line are required (cells harvested from separate passages). (3) Note that bisulfite PCR primers must be designed in CpG-free regions or use degenerate Y/R bases at CpG positions to avoid methylation-dependent amplification bias."

**Updated AI Output:**

**Conversion Efficiency Control:**
- Spike 1% (w/w) unmethylated lambda phage DNA (Promega) into each gDNA sample before bisulfite conversion
- After sequencing, align reads to the lambda genome and calculate C-to-T conversion rate
- Acceptance criterion: >99.0% conversion efficiency
- If <99%, repeat bisulfite treatment or use fresh reagents

**Biological Replicates:**
- 3 independent biological replicates per cell line (e.g., UACC-3199 and MCF-10A)
- Each replicate from a separate cell culture passage (minimum 3 passages apart)
- Extract DNA independently for each replicate
- Run all 6 samples (3 cancer + 3 control) through the same bisulfite conversion and library prep protocol

**Bisulfite Primer Design Rules:**
- Design primers in regions with no CpG dinucleotides (CpG-free zones flanking the target)
- If CpG sites cannot be avoided, use degenerate bases: Y (C/T) in the forward primer, R (A/G) in the reverse primer at CpG positions
- Validate primer specificity using BiSearch or MethPrimer
- Tm for bisulfite primers: 52-58C (lower than standard due to reduced sequence complexity)

**Judging Feedback:**
Excellent identification of three critical technical gaps. The conversion efficiency control is the single most important quality metric for any bisulfite experiment — without it, apparent methylation levels are unreliable. The biological replicate requirement is essential for statistical comparison. The primer design rules show deep understanding of bisulfite-specific PCR artifacts. The student has progressed from catching obvious errors to identifying sophisticated technical requirements. One remaining gap: the student has not asked for a functional validation step linking methylation to BRCA1 expression.

**Judging Grade: A**

**Steering Feedback:**
Highly targeted steering that addressed three distinct but interconnected quality control issues. Each correction was specific: lambda DNA spike with a quantitative threshold, passage-separated biological replicates, and CpG-aware primer design with named tools. This prompt significantly strengthened the experimental rigor. The remaining gap is functional validation — does the observed methylation actually correlate with BRCA1 silencing?

**Steering Grade: A**

---

### Cycle 3

**Student Judging (internal):**

gaps:
  - name: "The protocol is now technically sound for measuring methylation"
    description: "The protocol is now technically sound for measuring methylation. However, the problem asks about whether methylation"
  - name: "The statistical comparison (Fisher's exact test per CpG)"
    description: "The statistical comparison (Fisher's exact test per CpG) does not account for the spatial correlation between adjacent CpG sites — a regional test or smoothing approach would be more appropriate."

**Student Steering Prompt:**

instructions:
  - name: "The hypothesis is about methylation SILENCING BRCA1, but"
    description: "The hypothesis is about methylation SILENCING BRCA1, but the protocol only measures methylation — it does not test whether methylation correlates with reduced expression. Please add: (1) RT-qPCR for BRCA1 mRNA in both cell lines (and all replicates) to test whether hypermethylated samples show reduced expression. (2) A demethylation rescue experiment: treat the cancer cell line with 5-azacytidine (5-aza, DNA methyltransferase inhibitor) and measure whether BRCA1 expression is restored, which would causally link methylation to silencing. (3) Use a regional methylation statistical test (e.g., DSS or dmrseq) that accounts for spatial CpG correlation, rather than independent per-site Fisher tests."

**Updated AI Output:**

**Functional Validation — BRCA1 Expression:**
1. RT-qPCR: Measure BRCA1 mRNA levels in all 6 samples (3 cancer + 3 control replicates) using validated primers spanning exon 10-11 junction. Normalize to 2 stable reference genes (TBP, PPIA). Calculate fold-change (cancer vs. control).
2. Western blot: Anti-BRCA1 antibody (clone D-9, Santa Cruz) with beta-actin loading control. Compare protein levels between cell lines.

**Demethylation Rescue:**
1. Treat cancer cell line with 1 uM 5-azacytidine for 72 hours (refresh medium and drug every 24 h)
2. Include DMSO vehicle control
3. Measure BRCA1 mRNA by RT-qPCR and BRCA1 protein by Western blot
4. Simultaneously perform bisulfite sequencing on 5-aza-treated cells to confirm demethylation
5. Expected result if methylation silences BRCA1: 5-aza treatment restores BRCA1 expression AND reduces promoter methylation

**Regional Methylation Analysis:**
- Replace per-site Fisher test with DSS (Dispersion Shrinkage for Sequencing data)
- DSS models biological variation across replicates and accounts for spatial CpG correlation
- Call differentially methylated regions (DMRs) with: minimum 5 CpG sites, minimum 30% methylation difference, adjusted p < 0.01
- Alternatively, use dmrseq for region-level testing with smoothing

**Judging Feedback:**
The student identified the most important remaining gap — the disconnect between measuring an epigenetic mark and testing its functional consequence. The demethylation rescue experiment (5-azacytidine) is the gold-standard approach for causally linking methylation to gene silencing. The suggestion to replace per-site testing with a regional approach (DSS/dmrseq) shows statistical sophistication. At this point, the experimental design is comprehensive and publication-quality. The student could have further suggested ChIP-qPCR for H3K27me3 or H3K4me3 at the BRCA1 promoter to characterize the broader chromatin state.

**Judging Grade: A**

**Steering Feedback:**
Outstanding steering in the final cycle. The prompt addressed the fundamental logical gap (measuring methylation without testing its functional consequence), proposed two complementary approaches (correlation via RT-qPCR and causation via 5-aza rescue), and improved the statistical framework. This is the strongest steering prompt of the session, demonstrating the ability to identify not just technical gaps but conceptual gaps in experimental logic.

**Steering Grade: A**

---

## COMPLETION

### Final Grades

| Skill | Grade | Rationale |
|-------|-------|-----------|
| **Framing** | **B-** | Identified model system and assay scale issues, but missed conversion efficiency controls, replicate requirements, and functional validation. |
| **Judging** | **B+/A-/A** | Strong progression across cycles — from catching sequencing depth and aligner errors, to identifying conversion controls and primer design rules, to spotting the functional validation gap. |
| **Steering** | **B/A-/A** | Started with good but incomplete corrections, then improved to highly targeted technical specifications, and finished with a conceptually sophisticated prompt linking epigenetics to gene expression. |

### Summary

The student (James Weatherford) showed substantial growth across the session. Framing was the weakest phase — while the student correctly identified model system and assay design questions, several critical technical controls were missed. However, judging and steering improved dramatically across three cycles. The student progressed from catching obvious errors (wrong aligner, insufficient depth) to identifying sophisticated quality requirements (conversion efficiency, primer CpG bias) and finally to spotting the conceptual gap between measuring methylation and demonstrating its functional consequence. The demethylation rescue experiment request in Cycle 3 was the highlight of the session, showing the ability to reason about experimental logic at a high level. Growth areas include more thorough framing (conversion controls and replicates should be identified upfront) and engaging with chromatin context (histone modifications, DNase sensitivity) beyond DNA methylation alone.
