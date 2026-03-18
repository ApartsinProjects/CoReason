# Session 2 — Codon-Optimized Construct for Antibody Fragment Expression (Open-Ended)

**Challenge Type:** Assessment
**Subject:** Gene Expression > Translation > Codon Usage
**Response Mode:** Open-Ended (Structured Sections)

---

## Raw Problem

> Build a codon-optimized DNA sequence for expressing a human anti-TNF-alpha single-chain variable fragment (scFv) in E. coli BL21(DE3). Deliver the full optimized nucleotide sequence (FASTA format), an annotated plasmid map (showing promoter, RBS, tag, terminator), and a 2-page expression and purification protocol predicting a yield target. The specific fusion tag, induction conditions, and whether the scFv has disulfide bonds that require special handling are not stated.

---

## PHASE 1 — FRAMING

### Student Response (Open-Ended Sections)

**Protein Folding Constraints:**

1. Anti-TNF-alpha scFvs contain intra-domain disulfide bonds (typically one per VH and one per VL domain). These will not form correctly in the reducing cytoplasm of standard E. coli strains, so the expression compartment must be specified — periplasm via a signal peptide, or cytoplasm using an oxidizing strain such as SHuffle.
2. The scFv linker length and composition (commonly (G4S)3) affect folding but are not specified.

**Expression System Gaps:**

1. No fusion tag is specified. The choice (e.g., His6, MBP, SUMO) affects solubility, purification strategy, and whether a cleavage step is needed.
2. Induction conditions — IPTG concentration, temperature, and duration — are critical for soluble expression of disulfide-containing proteins but are left open.

**Missing Success Criteria:**

1. No target yield is stated (mg/L of culture), so there is no way to evaluate whether the protocol is adequate.
2. No functional activity assay is mentioned — the scFv must bind TNF-alpha, so an ELISA or SPR binding check should be included as a quality criterion.

### AI Solution (with intentional issues)

**AI Output:**

Here is a codon-optimized sequence for the anti-TNF-alpha scFv in E. coli:

**Optimized Sequence (partial, first 120 nt shown):**
```
>scFv_antiTNFa_optimized
ATGGCAGAAGTTCAGCTGGTGGAATCTGGTGGTGGTCTGGTGCAGCCGGGTGGTTCTCTG
CGTCTGTCTTGTGCAGCATCTGGTTTCACCTTCAGCAGCTATGCAATGAGCTGGGTGCGT
...
```

**Plasmid Design:**
- Vector: pET-28a(+)
- Promoter: T7
- Tag: N-terminal His6
- Resistance: Kanamycin

**Expression Protocol:**
1. Transform into BL21(DE3)
2. Grow at 37 degrees C to OD600 = 0.6
3. Induce with 1 mM IPTG
4. Express for 4 hours at 37 degrees C
5. Lyse cells, purify by Ni-NTA affinity chromatography
6. Expected yield: ~5 mg/L

**Issues present in AI output:**
- No signal peptide for periplasmic export — disulfide bonds will not form in reducing cytoplasm
- Expression at 37 degrees C with 1 mM IPTG will likely produce inclusion bodies for a disulfide-containing protein
- No codon optimization metrics reported (CAI, GC content, rare codon frequency)
- The optimization tool/algorithm is not named
- Plasmid map is missing essential elements (RBS details, terminator, origin of replication)
- No solubility assessment step in the purification protocol
- No quality control (SDS-PAGE, Western blot, activity assay)
- Yield prediction of 5 mg/L is stated without justification

### Framing Feedback

**Assessment:** The student identified the most critical gap — that disulfide bond formation requires either periplasmic targeting or a specialized strain — which fundamentally changes the construct design. The identification of missing fusion tag choice and induction conditions was appropriate. However, the student did not question whether the codon optimization algorithm itself was specified (different tools produce different sequences), nor did they flag that the plasmid backbone choice (copy number, antibiotic resistance) was unspecified. The student also missed the question of whether the scFv requires glycosylation (it does not in this case, but the reasoning should be stated).

**Framing Grade: A**
Good identification of disulfide bond and expression condition gaps, but missed codon optimization tool specification and did not systematically address all construct design elements.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**AI Output (from Phase 1 above):**

**Student Judging (internal, not sent to AI):**

gaps:
  - name: "The AI chose cytoplasmic expression in standard"
    description: "The AI chose cytoplasmic expression in standard BL21(DE3) without a signal peptide. The scFv has two disulfide bonds that will not form in the reducing cytoplasm, so the protein will almost certainly misfold and aggregate into inclusion bodies. - Expression at 37 degrees C with 1 mM IPTG is aggressive for any recombinant protein and especially problematic for a multi-domain antibody fragment. Lower temperature (16-20 degrees C) and lower IPTG (0.1-0.5 mM) are standard practice."
  - name: "The codon-optimized sequence is presented without"
    description: "The codon-optimized sequence is presented without stating the optimization tool, the codon adaptation index (CAI), or whether problematic elements (rare codon clusters, cryptic Shine-Dalgarno sequences, mRNA secondary structure near the start codon) were addressed."

**Student Steering Prompt (sent to AI):**

instructions:
  - name: "The scFv contains two intradomain disulfide bonds that"
    description: "The scFv contains two intradomain disulfide bonds that will not form in the reducing cytoplasm of BL21(DE3). Please redesign the construct for periplasmic expression by adding a pelB signal peptide, and lower the induction conditions to 0.1 mM IPTG at 16 degrees C overnight"
  - name: "please report the codon adaptation index (CAI) for the"
    description: "please report the codon adaptation index (CAI) for the optimized sequence and name the tool you used for optimization"

**Updated AI Output:**

**Revised Construct Design:**
- Vector: pET-22b(+) (includes pelB signal peptide for periplasmic secretion)
- Promoter: T7/lac
- Signal peptide: pelB leader sequence (22 aa) for Sec-dependent periplasmic export
- Tag: C-terminal His6 (to avoid interfering with signal peptide cleavage)
- Terminator: T7 terminator
- Resistance: Ampicillin (bla)
- Origin: pBR322

**Codon Optimization:**
- Tool: JCat (Java Codon Adaptation Tool) with E. coli K12 codon usage table
- CAI of optimized sequence: 0.87
- GC content: 51.2% (within 40-60% target range)
- Eliminated 3 rare codon clusters (AGG/AGA Arg, CUA Leu) and 1 cryptic Shine-Dalgarno-like sequence

**Revised Expression Protocol:**
1. Transform into BL21(DE3) competent cells
2. Grow in TB medium at 37 degrees C to OD600 = 0.8
3. Induce with 0.1 mM IPTG
4. Express at 16 degrees C for 18 hours
5. Harvest periplasmic fraction by osmotic shock
6. Purify by Ni-NTA chromatography
7. Polish by size exclusion chromatography (Superdex 75)
8. Expected yield: 1-3 mg/L (typical for periplasmic scFv expression)

**Judging Feedback:**
The student correctly identified the most critical flaw — cytoplasmic expression of a disulfide-containing protein — and the aggressive induction conditions. The request for CAI reporting and tool identification was appropriate. However, the student did not notice that the AI's purification protocol still lacks quality control steps (SDS-PAGE to confirm size, Western blot, and a functional binding assay). The student also did not question whether BL21(DE3) is the optimal strain for periplasmic expression or whether strains with enhanced periplasmic chaperones (e.g., Origami 2) would be preferable.

**Judging Grade: A**

**Steering Feedback:**
The steering prompt was well-targeted — it addressed the disulfide bond problem with a specific solution (pelB signal peptide), provided concrete alternative induction conditions, and requested quantitative optimization metrics. However, the prompt was somewhat prescriptive (dictating the exact solution rather than asking the AI to compare alternatives), and it did not address the missing purification QC steps or functional validation.

**Steering Grade: B**

---

### Cycle 2

**Student Judging (internal):**

gaps:
  - name: "The revised protocol is much improved with periplasmic"
    description: "The revised protocol is much improved with periplasmic expression and gentler induction conditions. However, there is still no quality control: no SDS-PAGE confirmation, no Western blot, no functional binding assay (ELISA against TNF-alpha)."
  - name: "The yield estimate of 1-3 mg/L is reasonable for"
    description: "The yield estimate of 1-3 mg/L is reasonable for periplasmic expression but is stated without citing comparable published results."
  - name: "The AI did not discuss whether the scFv linker design"
    description: "The AI did not discuss whether the scFv linker design could affect expression level or folding efficiency."
  - name: "The purification protocol goes directly from osmotic shock to Ni-NTA"
    description: "The purification protocol goes directly from osmotic shock to Ni-NTA — there is no mention of a clarification step, buffer exchange, or size exclusion chromatography polishing."

**Student Steering Prompt:**

instructions:
  - name: "The purification protocol needs quality control checkpoints"
    description: "The purification protocol needs quality control checkpoints. Please add: (1) SDS-PAGE and anti-His Western blot after Ni-NTA elution to confirm the expected ~28 kDa band, (2) a size exclusion chromatography (SEC) polishing step to remove aggregates and confirm monomeric scFv, and (3) a functional ELISA against recombinant TNF-alpha to verify binding activity"
  - name: "please provide expected yield and purity at each step"
    description: "please provide expected yield and purity at each step"

**Updated AI Output:**

**Revised Purification and QC Workflow:**

| Step | Description | Expected Yield | Expected Purity |
|------|-------------|----------------|-----------------|
| 1. Osmotic shock | Periplasmic fraction release | ~80% of periplasmic protein | ~10% target |
| 2. Ni-NTA affinity | IMAC capture (10 mM to 250 mM imidazole gradient) | 2-3 mg/L culture | >80% |
| 3. SDS-PAGE + Western | 12% gel, anti-His HRP conjugate; confirm ~28 kDa band | QC checkpoint | — |
| 4. SEC polishing | Superdex 75 10/300 GL in PBS pH 7.4 | 1.5-2.5 mg/L | >95% |
| 5. ELISA validation | Coat plate with 1 ug/mL recombinant human TNF-alpha, serial dilution of scFv, anti-His HRP detection | Functional QC | EC50 determination |

**Purity Assessment:** Final product should show a single band at ~28 kDa on Coomassie-stained SDS-PAGE under non-reducing conditions (with intact disulfide bonds migrating slightly faster) and reducing conditions (fully denatured).

**Judging Feedback:**
The student identified the critical gap — the absence of quality control checkpoints in the purification workflow. Requesting yield and purity estimates at each step was excellent, as it creates quantitative benchmarks for protocol troubleshooting. However, the student did not question the choice of Superdex 75 for SEC (appropriate for ~28 kDa but should be stated with rationale), and did not ask for endotoxin removal, which is essential if the scFv will be used in any cell-based assay.

**Judging Grade: A**

**Steering Feedback:**
The steering prompt was specific and well-structured, requesting three concrete additions with clear rationale. The request for yield/purity at each step was particularly strong — it forces the AI to make quantitative predictions that can be evaluated against real experimental results. The prompt could have also asked for alternative purification strategies (e.g., Protein L for scFv fragments) and endotoxin considerations.

**Steering Grade: A**

---

## COMPLETION

### Final Grades

| Skill | Grade | Rationale |
|-------|-------|-----------|
| **Framing** | **B+** | Identified the critical disulfide bond / expression compartment issue and tag choice, but missed codon optimization pitfalls and scFv architecture details. |
| **Judging** | **B+/A-** | Caught the disulfide bond oversight and missing QC checkpoints across cycles. Did not probe strain choice alternatives or endotoxin concerns. |
| **Steering** | **B/B+** | First prompt was prescriptive rather than comparative. Improved in Cycle 2 with structured QC requests. Could have pushed for computational verification of the final sequence and endotoxin handling. |

### Summary

The student (Priya Ramanathan) demonstrated good understanding of recombinant protein expression challenges, particularly the critical importance of disulfide bond formation for antibody fragments. Framing correctly identified the most impactful ambiguity (expression compartment) but missed some secondary concerns about codon optimization methodology. Judging was effective at catching the major biological error and the absence of quality control, but did not push into strain optimization or downstream application requirements. Steering drove meaningful improvements but started too prescriptive — dictating solutions rather than asking the AI to compare alternatives. Growth areas include adopting a more comparative steering style, probing codon optimization methodology more deeply, and considering downstream application constraints (endotoxin, storage stability) earlier in the process.
