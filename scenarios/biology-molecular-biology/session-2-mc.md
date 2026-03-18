# Session 2 — Codon-Optimized Construct for Antibody Fragment Expression (Multiple Choice)

**Challenge Type:** Assessment
**Subject:** Gene Expression > Translation > Codon Usage
**Response Mode:** Multiple Choice (5 options per question)

---

## Raw Problem

> Build a codon-optimized DNA sequence for expressing a human anti-TNF-alpha single-chain variable fragment (scFv) in E. coli BL21(DE3). Deliver the full optimized nucleotide sequence (FASTA format), an annotated plasmid map (showing promoter, RBS, tag, terminator), and a 2-page expression and purification protocol predicting a yield target. The specific fusion tag, induction conditions, and whether the scFv has disulfide bonds that require special handling are not stated.

---

## PHASE 1 — FRAMING

### Student Response (Multiple Choice)

**Question 1: What structural feature of the scFv most critically constrains the expression strategy?**

A) The molecular weight of the scFv determines which column to use
B) The scFv contains intra-domain disulfide bonds (typically one per VH and one per VL) that require an oxidizing environment for proper folding, meaning the expression compartment (periplasm vs. cytoplasm) and potentially the host strain must be specified
C) The GC content of the scFv gene affects transcription speed
D) The isoelectric point of the scFv determines buffer pH
E) The number of methionine residues affects protein stability

**Student selects: B**

**Question 2: Which unspecified parameter most affects the construct design?**

A) The brand of competent cells to use
B) The color of the antibiotic stock solution
C) The choice of fusion tag (His, MBP, GST, SUMO) and its position (N- or C-terminal), which affects solubility, purification strategy, and whether it must be removed for functional studies
D) The type of pipette tips used for cloning
E) The incubator manufacturer

**Student selects: C**

**Question 3: What missing information makes the expression protocol incomplete?**

A) The lab notebook format
B) The induction conditions (IPTG concentration, temperature, duration) and culture medium, which are critical for soluble expression of difficult-to-fold proteins and directly affect yield
C) The color of the culture medium
D) The shape of the Erlenmeyer flasks
E) The brand of the shaking incubator

**Student selects: B**

**Question 4: What success criterion is absent from the problem statement?**

A) The number of pages in the final report
B) The font size for the plasmid map
C) A quantitative yield target (mg/L) and a functional activity requirement (e.g., binding affinity to TNF-alpha by ELISA or SPR) to define what constitutes a successful expression
D) The number of figures to include
E) The file format for the plasmid map image

**Student selects: C**

### AI Solution (with intentional issues)

**AI Output:**

Here is the codon-optimized anti-TNF-alpha scFv construct:

**Construct:** pET-28a(+) with N-terminal His6 tag, T7 promoter, kanamycin resistance.

**Optimized Sequence (truncated):**
```
>scFv_antiTNFa_Ecoli_opt
ATGGCAGAAGTTCAGCTGGTGGAATCTGGTGGTGGTCTGGTGCAGCCG...
```

**Protocol Summary:**
1. Transform BL21(DE3), grow at 37C in LB + kan
2. Induce at OD 0.6 with 1 mM IPTG, express 4 h at 37C
3. Lyse by sonication, Ni-NTA purification
4. Expected yield: ~20 mg/L

**Issues in AI output:**
- No signal peptide — cytoplasmic expression will not support disulfide bond formation
- 37C / 1 mM IPTG will likely produce inclusion bodies
- N-terminal His tag may interfere with VH domain folding
- No codon optimization metrics (CAI) or tool named
- Plasmid map not provided (only text description)
- No QC steps (SDS-PAGE, Western, activity assay)
- 20 mg/L yield is unrealistic without solubility enhancement
- Missing essential plasmid elements in annotation (RBS, terminator, origin)

### Framing Feedback

**Assessment:** The student correctly identified all four critical gaps: disulfide bond constraints (B), fusion tag choice (C), induction conditions (B), and quantitative success criteria (C). Each selection was the most comprehensive option. However, the MC format did not allow the student to elaborate on how these constraints interact — for example, the disulfide bond requirement constrains not just the compartment but also the tag position (C-terminal to avoid blocking the signal peptide).

**Framing Grade: A**
All correct selections demonstrating clear understanding of recombinant protein expression design constraints.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**AI Output (from Phase 1 above):**

**Question 5 (Judging): What is the MOST critical error in the AI's construct design?**

A) The kanamycin concentration is not specified
B) The AI designed a cytoplasmic expression construct without a signal peptide, meaning the scFv's disulfide bonds will not form in the reducing environment, leading to misfolded, non-functional protein or inclusion bodies
C) The sequence should have been provided in GenBank format instead of FASTA
D) The construct should use chloramphenicol resistance instead of kanamycin
E) The promoter should be tac instead of T7

**Student selects: B**

**Question 6 (Steering): What is the BEST prompt to fix the construct design?**

A) "Please use a different vector."
B) "Please add more restriction sites."
C) "Please redesign the construct for periplasmic expression: add a pelB or OmpA signal peptide for Sec-dependent export, move the His-tag to the C-terminus to avoid blocking signal peptide processing, switch to pET-22b(+) or equivalent periplasmic expression vector, and reduce induction to 0.1 mM IPTG at 16-18C overnight. Report the CAI of the optimized sequence."
D) "Please try expressing in yeast instead."
E) "Please remove the His-tag entirely."

**Student selects: C**

**Updated AI Output:**

**Revised Construct:**
- Vector: pET-22b(+) with pelB signal peptide
- Tag: C-terminal 6xHis (after VL domain)
- Promoter: T7/lac; Terminator: T7
- Resistance: Ampicillin; Origin: pBR322
- CAI: 0.87 (JCat, E. coli K12 codon table)
- GC content: 51.2%; rare codons eliminated

**Revised Protocol:**
1. Transform BL21(DE3), grow in TB + ampicillin at 37C to OD 0.8
2. Shift to 18C, induce with 0.1 mM IPTG for 16 h
3. Harvest periplasmic fraction by osmotic shock
4. Ni-NTA IMAC purification
5. SEC polishing (Superdex 75)
6. Expected yield: 2-5 mg/L

**Judging Feedback:**
Correct identification of the most critical error. The disulfide bond / expression compartment mismatch is the single issue most likely to cause total experimental failure.

**Judging Grade: A**

**Steering Feedback:**
Option C was excellent — it specified the signal peptide, tag repositioning, vector change, revised induction conditions, and requested CAI metrics, all in a single actionable prompt. This produced a comprehensive revision.

**Steering Grade: A**

---

### Cycle 2

**Question 7 (Judging): What important element is STILL missing from the revised protocol?**

A) The protocol should include a prayer for good results
B) The protocol should specify the exact brand of IPTG
C) The protocol lacks quality control checkpoints: no SDS-PAGE to verify expression and solubility, no Western blot for identity confirmation, and no functional assay (e.g., ELISA against TNF-alpha) to verify that the purified scFv retains antigen-binding activity
D) The protocol should be sorted alphabetically by step
E) The AI should have included guides targeting a different protein

**Student selects: C**

**Question 8 (Steering): What steering prompt best addresses the remaining gaps?**

A) "Please make the protocol longer."
B) "Please add QC checkpoints at each purification step: SDS-PAGE plus anti-His Western blot to confirm the ~28 kDa band (after pelB cleavage), analytical SEC to verify monodispersity and rule out aggregation, and a functional ELISA (coat with recombinant TNF-alpha, detect bound scFv with anti-His HRP) to confirm binding activity. Include expected yield and purity at each step with acceptance criteria."
C) "Please add more buffer recipes."
D) "Please include troubleshooting tips."
E) "Please add a safety section."

**Student selects: B**

**Updated AI Output:**

**QC Workflow:**

| Step | Method | Expected Result | Acceptance Criterion |
|------|--------|-----------------|---------------------|
| Post-osmotic shock | SDS-PAGE (12%) | ~28 kDa band in periplasmic fraction | Band visible; >50% in soluble fraction |
| Post-IMAC | SDS-PAGE + anti-His Western | ~28 kDa, enriched | >80% purity by densitometry |
| Post-IMAC | A280 measurement | Yield quantification | 2-5 mg/L target |
| Post-SEC | Analytical SEC (Superdex 75) | Single peak at ~28 kDa elution volume | <10% aggregate peak |
| Final product | Anti-TNF-alpha ELISA | Dose-dependent binding curve | EC50 < 50 nM |
| Final product | Reducing vs. non-reducing SDS-PAGE | Mobility shift under reducing conditions | Confirms intact disulfide bonds |
| Final product | Endotoxin (LAL assay) | Low endotoxin | <1 EU/mg for cell-based assays |

**Judging Feedback:**
Correct identification that a protocol without QC is essentially a recipe with no way to verify success. The student chose the option encompassing all three levels of QC: purity tracking, biophysical characterization, and functional validation.

**Judging Grade: A**

**Steering Feedback:**
Option B was comprehensive — it specified exact methods, expected results, and quantitative acceptance criteria at each step. This level of specificity makes the QC actionable rather than aspirational.

**Steering Grade: A**

---

## COMPLETION

### Final Grades

| Skill | Grade | Rationale |
|-------|-------|-----------|
| **Framing** | **A-** | Correctly identified all four critical constraints through MC selections. |
| **Judging** | **A-/A** | Accurately identified the disulfide bond / compartment error and missing QC steps in successive cycles. |
| **Steering** | **A/A** | Consistently selected the most specific, comprehensive prompts that produced substantial improvements. |

### Summary

The student (Marcus Chen) performed at a high level throughout this MC-format session. Framing selections demonstrated clear understanding of the constraints governing recombinant antibody fragment expression — particularly the critical role of disulfide bonds in determining expression strategy. Judging accurately prioritized the most impactful deficiencies in each cycle, progressing from the fundamental construct design error to the absence of quality control. Steering selections were uniformly excellent, choosing prompts that specified tools, parameters, and acceptance criteria rather than vague requests. The MC format constrained the depth of reasoning visible, but the pattern of optimal selections indicates strong command of protein expression, purification, and quality control principles.
