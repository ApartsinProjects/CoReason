# Session 1 — CRISPR Guide RNA Panel for Sickle Cell Trait (Multiple Choice)

**Challenge Type:** Practice
**Subject:** Molecular Techniques > CRISPR-Cas9
**Response Mode:** Multiple Choice (5 options per question)

---

## Raw Problem

> Design a panel of 5 candidate sgRNAs targeting the human beta-globin locus to correct the sickle cell point mutation (HBB E6V) via homology-directed repair. For each sgRNA, provide the 20-nt spacer sequence, the PAM, the predicted off-target profile, and a ranking with justification. Deliver your output as a formatted comparison table plus a one-page rationale memo recommending the top candidate for a preclinical study in CD34+ hematopoietic stem cells. The delivery vehicle and acceptable off-target hit threshold are not specified; the donor template design is left to you.

---

## PHASE 1 — FRAMING

### Student Response (Multiple Choice)

**Question 1: What is the MOST critical unspecified parameter that affects sgRNA design and ranking?**

A) The brand of Cas9 protein to use
B) The delivery vehicle and format (RNP, plasmid, lentiviral), which constrains guide modification chemistry, toxicity profile, and persistent expression concerns
C) Whether to use SpCas9 or a Cas9 ortholog, since PAM requirements differ
D) The patient's age and sex, which affect CD34+ cell mobilization
E) The sequencing platform for downstream analysis

**Student selects: B**

**Question 2: Which missing information makes the off-target ranking criterion incomplete?**

A) The color of the fluorescent reporter used
B) The total number of genes in the human genome
C) A quantitative threshold for acceptable off-target activity (e.g., maximum indel frequency or CFD score cutoff) and whether computational or empirical profiling is required
D) The number of chromosomes in the human genome
E) The melting temperature of the sgRNA

**Student selects: C**

**Question 3: What unspecified aspect of the editing outcome changes the entire experimental approach?**

A) Whether the experiment is performed on a Tuesday or Wednesday
B) The brand of tissue culture plates
C) Whether the goal is precise knock-in via HDR (requiring a donor template and cell cycle considerations) versus disruption via NHEJ, and the specific donor template design including PAM-blocking mutations
D) The color of the cell culture medium
E) The ambient humidity in the lab

**Student selects: C**

**Question 4: What translational context is underspecified?**

A) The font to use in the final report
B) The number of freezers available in the lab
C) Whether the experiment is ex vivo or in vivo, the regulatory requirements for preclinical studies, and whether the cell source is bone marrow or mobilized peripheral blood
D) The preferred graphing software
E) The time zone of the research institution

**Student selects: C**

### AI Solution (with intentional issues)

**AI Output:**

Here are my 5 recommended sgRNAs for correcting HBB E6V:

| # | Spacer Sequence | PAM | Score | Off-targets | Recommendation |
|---|----------------|-----|-------|-------------|----------------|
| 1 | GTAACGGCAGACTTCTCCTC | AGG | High | Low | Top pick |
| 2 | TCAAACAGACACCATGGTGC | TGG | Medium | Medium | Backup |
| 3 | GAAGTTGGTGGTGAGGCCCT | GGG | Medium | Low | Alternative |
| 4 | CCTGACTCCTGAGGAGAAGT | CGG | Medium | High | Not recommended |
| 5 | AGTGGTCTACCCTTGGACCC | AGG | Low | Very High | Worst option |

Guide 1 is my top recommendation because it has the highest score and lowest off-target profile. I suggest using an ssODN donor to template the correction.

**Issues in AI output:**
- Scores given as qualitative "High/Medium/Low" rather than quantitative values
- No genome build, scoring tool, or algorithm specified
- No strand orientation or distance to the E6V mutation
- No off-target site enumeration or genomic locations
- Ranking does not consider proximity to the target SNP for HDR efficiency
- No donor template sequence or design rationale provided

### Framing Feedback

**Assessment:** The student correctly identified all four critical ambiguities through the MC questions: delivery vehicle (B), off-target quantitative thresholds (C), editing outcome and donor design (C), and translational context (C). All selections were correct and the chosen answers were the most comprehensive options in each case. However, the MC format limited the student's ability to elaborate on interconnections between these ambiguities — for instance, how the delivery vehicle choice constrains the donor template format (ssODN for RNP, AAV6 for long donors).

**Framing Grade: A**
All correct selections demonstrating clear understanding of the key ambiguities in CRISPR experimental design.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**AI Output (from Phase 1 above):**

| # | Spacer Sequence | PAM | Score | Off-targets | Recommendation |
|---|----------------|-----|-------|-------------|----------------|
| 1 | GTAACGGCAGACTTCTCCTC | AGG | High | Low | Top pick |
| ... | ... | ... | ... | ... | ... |

**Question 5 (Judging): What is the MOST significant deficiency in the AI's guide RNA comparison table?**

A) The table does not include the molecular weight of each sgRNA
B) The table uses qualitative descriptors ("High," "Low") instead of quantitative on-target and off-target scores from specified algorithms, making the ranking unverifiable and non-reproducible
C) The table does not include the isoelectric point of Cas9
D) The table should have been presented as a bar chart instead
E) The font size is too small

**Student selects: B**

**Question 6 (Steering): What is the BEST prompt to improve the AI's output?**

A) "Please make the table prettier."
B) "Please add more guides to the panel."
C) "Please replace qualitative scores with quantitative values: report Rule Set 2 on-target scores (0-1 scale), list off-target sites found by Cas-OFFinder (up to 3 mismatches, hg38), and add columns for distance to the E6V codon and PAM strand orientation."
D) "Please add colors to the table."
E) "Please write the sequences in lowercase."

**Student selects: C**

**Updated AI Output:**

Using hg38 reference genome, Rule Set 2 (Doench et al. 2016) for on-target scoring, and Cas-OFFinder (3 mismatches, 1 bulge) with CFD filtering:

| Rank | Spacer (20-nt) | PAM | On-target Score | Off-targets (CFD>0.2) | Distance to E6V | Strand | Exonic Off-targets |
|------|----------------|-----|-----------------|----------------------|------------------|--------|--------------------|
| 1 | CCTGACTCCTGAGGAGAAGT | CGG | 0.68 | 4 | 2 bp | Anti | 0 |
| 2 | GTAACGGCAGACTTCTCCTC | AGG | 0.82 | 3 | 4 bp | Sense | 1 (HMGA2) |
| 3 | GAAGTTGGTGGTGAGGCCCT | GGG | 0.71 | 5 | 8 bp | Anti | 0 |
| 4 | TCAAACAGACACCATGGTGC | TGG | 0.76 | 7 | 12 bp | Sense | 2 |
| 5 | AGTGGTCTACCCTTGGACCC | AGG | 0.65 | 15 | 18 bp | Sense | 3 |

Note: Guide previously ranked #4 is now #1 due to optimal 2 bp proximity to the E6V codon for HDR, and zero exonic off-targets despite a slightly lower on-target score.

**Judging Feedback:**
The student correctly identified that qualitative scoring is the most critical deficiency — it renders the entire ranking non-reproducible. Good recognition that quantitative values from named algorithms are essential.

**Judging Grade: A**

**Steering Feedback:**
Option C was the ideal prompt — it specified exact tools, parameters, genome build, and requested concrete additional columns. This is precisely the kind of actionable, specific steering that produces meaningful AI output improvement.

**Steering Grade: A**

---

### Cycle 2

**Question 7 (Judging): Looking at the improved table, what critical gap STILL remains?**

A) The table needs more decimal places
B) The table should include protein sequences instead of DNA
C) The AI has not addressed whether the target sites are in accessible chromatin in CD34+ HSPCs, nor has it proposed a donor template with PAM-blocking mutations to prevent Cas9 re-cutting after successful HDR
D) The table should be sorted alphabetically by sequence
E) The AI should have included guides targeting a different gene

**Student selects: C**

**Question 8 (Steering): What steering prompt best addresses the remaining gaps?**

A) "Please redo everything from scratch."
B) "Please check ATAC-seq data from CD34+ HSPCs (e.g., Corces et al. 2016) for chromatin accessibility at the top guide's cut site, design a 140-nt ssODN donor with the corrected GAG codon and a silent CGG-to-CGC PAM-blocking mutation, and outline a validation plan using amplicon sequencing and GUIDE-seq."
C) "Please add more references."
D) "Tell me about sickle cell disease history."
E) "Please change the PAM sequences."

**Student selects: B**

**Updated AI Output:**

**Chromatin Accessibility:** The HBB locus (chr11:5,225,000–5,229,000) shows a strong ATAC-seq peak in CD34+ HSPCs (Corces et al., Nature Genetics 2016). The top guide's cut site at ~chr11:5,227,000 falls within this accessible region, supporting high editing efficiency.

**Donor Template (140-nt ssODN, antisense orientation):**
- Correction: GTG → GAG at codon 6 (Val → Glu, reverting the sickle mutation)
- PAM block: CGG → CGC (silent, preserves Arg) to prevent Cas9 re-cutting
- 67-nt homology arms flanking the edit site
- 2x phosphorothioate bonds at each terminus

**Validation Plan:**
1. On-target quantification: Amplicon NGS (>10,000x) at HBB exon 1 — report %HDR, %NHEJ, %unedited
2. Off-target profiling: GUIDE-seq in CD34+ cells, followed by targeted amplicon-seq at top 20 nominated sites
3. Functional validation: Erythroid differentiation + hemoglobin HPLC (HbA vs. HbS quantification)

**Judging Feedback:**
Excellent identification of the two most impactful remaining gaps: chromatin accessibility (which directly predicts editing efficiency in the target cell type) and donor template engineering (which determines whether successful HDR is stable). The student correctly recognized that preventing re-cutting is essential for clinical applications.

**Judging Grade: A**

**Steering Feedback:**
Option B was comprehensive and precisely targeted — it named a specific dataset, specified the donor engineering details, and requested a multi-level validation strategy. This level of specificity extracts maximum value from the AI.

**Steering Grade: A**

---

## COMPLETION

### Final Grades

| Skill | Grade | Rationale |
|-------|-------|-----------|
| **Framing** | **A-** | Correctly identified all critical ambiguities across 4 MC questions. |
| **Judging** | **A-/A** | Accurately pinpointed the most impactful deficiencies in each cycle, progressing from methodological gaps to biological and translational concerns. |
| **Steering** | **A/A** | Consistently selected the most specific, actionable prompts that produced substantial improvements in AI output quality. |

### Summary

The student performed at a high level throughout this MC-format session. Framing responses showed clear understanding of what information is missing from an underspecified CRISPR design brief. Judging consistently identified the most impactful deficiencies rather than superficial issues. Steering selections were uniformly excellent, demonstrating the ability to craft precise, tool-specific, biologically grounded prompts. The MC format constrained the depth of reasoning visible, but the pattern of correct selections indicates strong command of CRISPR guide design principles and experimental validation requirements.
