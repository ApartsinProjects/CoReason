# Session 1 — CRISPR Guide RNA Panel for Sickle Cell Trait (Open-Ended)

**Challenge Type:** Practice
**Subject:** Molecular Techniques > CRISPR-Cas9
**Response Mode:** Open-Ended (Structured Sections)

---

## Raw Problem

> Design a panel of 5 candidate sgRNAs targeting the human beta-globin locus to correct the sickle cell point mutation (HBB E6V) via homology-directed repair. For each sgRNA, provide the 20-nt spacer sequence, the PAM, the predicted off-target profile, and a ranking with justification. Deliver your output as a formatted comparison table plus a one-page rationale memo recommending the top candidate for a preclinical study in CD34+ hematopoietic stem cells. The delivery vehicle and acceptable off-target hit threshold are not specified; the donor template design is left to you.

---

## PHASE 1 — FRAMING

### Student Response (Open-Ended Sections)

**Identified Ambiguities:**

1. The problem does not specify a delivery vehicle — electroporation of RNP, viral delivery of Cas9+guide, or lipid nanoparticles each impose different constraints on guide length, modification chemistry, and toxicity to CD34+ HSCs.
2. There is no stated threshold for acceptable off-target activity. Without a quantitative cutoff (e.g., <0.1% indel frequency at any off-target site by GUIDE-seq), it is impossible to meaningfully rank candidates.
3. The donor template design is unspecified. Whether to use a single-stranded oligodeoxynucleotide (ssODN) or AAV6-delivered long donor affects how close the cut site must be to the E6V codon and constrains PAM orientation preferences.

**Missing Constraints:**

1. The problem does not state whether the correction must avoid disrupting the reading frame if HDR fails and NHEJ occurs — this is critical for clinical safety.
2. No mention of chromatin accessibility at the HBB locus in CD34+ cells, which affects editing efficiency independent of guide sequence quality.

**Proposed Assumptions:**

1. I will assume ex vivo editing of mobilized peripheral blood CD34+ HSCs with RNP electroporation, which is the current clinical standard.
2. I will assume a 140-nt ssODN donor template centered on the E6V mutation with silent PAM-blocking mutations to prevent re-cutting.
3. Acceptable off-target threshold: fewer than 5 sites with CFD score > 0.2 and no off-targets in coding exons of known tumor suppressors or oncogenes.

### AI Solution (with intentional issues)

**AI Output:**

Here are 5 sgRNAs targeting the HBB E6V locus:

| Rank | Spacer (20-nt) | PAM | On-target Score | Off-target Hits | Notes |
|------|----------------|-----|-----------------|-----------------|-------|
| 1 | GTAACGGCAGACTTCTCCTC | AGG | 0.82 | 3 | Cuts 4 bp from mutation |
| 2 | TCAAACAGACACCATGGTGC | TGG | 0.76 | 7 | Cuts 12 bp from mutation |
| 3 | GAAGTTGGTGGTGAGGCCCT | GGG | 0.71 | 5 | Cuts 8 bp from mutation |
| 4 | CCTGACTCCTGAGGAGAAGT | CGG | 0.68 | 11 | Cuts 2 bp from mutation |
| 5 | AGTGGTCTACCCTTGGACCC | AGG | 0.65 | 15 | Cuts 18 bp from mutation |

I recommend Guide 1 because it has the highest on-target score and fewest off-target hits. The ssODN should encode the wild-type glutamic acid codon at position 6.

**Issues present in AI output:**
- No genome build specified (hg19 vs. hg38)
- Off-target scoring tool and parameters not stated
- On-target scoring algorithm unnamed
- No PAM orientation relative to the mutation shown
- Sequences not verified against a reference genome
- No consideration of chromatin context in CD34+ cells
- Ranking uses only two criteria (on-target score and off-target count) without efficiency predictions

### Framing Feedback

**Assessment:** The student identified several important ambiguities — delivery vehicle, off-target threshold, and donor template design are all genuine gaps in the problem statement. The proposed assumptions (RNP electroporation, ssODN donor, CFD-based off-target filtering) are reasonable and reflect current literature. However, the student missed the need to specify a genome build for guide design and did not question whether the quantification method for off-target scoring (computational vs. empirical) was appropriate. The student also did not flag the regulatory context (IND-enabling study requirements) that would shape the entire validation pipeline.

**Framing Grade: A**
Strong identification of core ambiguities and reasonable assumptions, but missed the genome build specification and regulatory validation requirements that are critical for a preclinical study context.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**AI Output (from Phase 1 above):**

| Rank | Spacer (20-nt) | PAM | On-target Score | Off-target Hits | Notes |
|------|----------------|-----|-----------------|-----------------|-------|
| 1 | GTAACGGCAGACTTCTCCTC | AGG | 0.82 | 3 | Cuts 4 bp from mutation |
| 2 | TCAAACAGACACCATGGTGC | TGG | 0.76 | 7 | Cuts 12 bp from mutation |
| 3 | GAAGTTGGTGGTGAGGCCCT | GGG | 0.71 | 5 | Cuts 8 bp from mutation |
| 4 | CCTGACTCCTGAGGAGAAGT | CGG | 0.68 | 11 | Cuts 2 bp from mutation |
| 5 | AGTGGTCTACCCTTGGACCC | AGG | 0.65 | 15 | Cuts 18 bp from mutation |

**Student Judging (internal, not sent to AI):**

gaps:
  - name: "The AI did not state which genome build or scoring"
    description: "The AI did not state which genome build or scoring algorithm produced these scores. Without that, the numbers are unverifiable."
  - name: "The off-target"
    description: "The off-target"
  - name: "No strand orientation is specified for any guide"
    description: "No strand orientation is specified for any guide relative to the coding strand."

**Student Steering Prompt (sent to AI):**

instructions:
  - name: "Please specify the genome build (hg19 or hg38) and the"
    description: "Please specify the genome build (hg19 or hg38) and the exact scoring tools (e.g., Cas-OFFinder for off-targets, Rule Set 2 or DeepCas9 for on-target) you used to generate these scores"
  - name: "please add a column indicating each guide's distance and"
    description: "please add a column indicating each guide's distance and orientation (sense/antisense) relative to the E6V codon (chr11:5227002 in hg38)"
  - name: "reconsider your ranking: proximity to the target SNP"
    description: "reconsider your ranking: proximity to the target SNP should be a major criterion for HDR efficiency, and Guide 4 at 2 bp distance deserves re-evaluation"

**Updated AI Output:**

All guides were designed against hg38 (GRCh38.p14) and scored using the Doench 2016 Rule Set 2 for on-target activity and Cas-OFFinder (up to 3 mismatches + 1 DNA/RNA bulge) for off-target enumeration. Off-target sites were further filtered using the CFD scoring matrix.

| Rank | Spacer (20-nt) | PAM | On-target (Rule Set 2) | Off-targets (CFD > 0.2) | Distance to E6V | Strand | Notes |
|------|----------------|-----|------------------------|-------------------------|------------------|--------|-------|
| 1 | CCTGACTCCTGAGGAGAAGT | CGG | 0.68 | 4 (0 exonic) | 2 bp | Antisense | Ideal HDR proximity |
| 2 | GTAACGGCAGACTTCTCCTC | AGG | 0.82 | 3 (1 exonic) | 4 bp | Sense | High on-target, but 1 exonic off-target |
| 3 | GAAGTTGGTGGTGAGGCCCT | GGG | 0.71 | 5 (0 exonic) | 8 bp | Antisense | Moderate distance |
| 4 | TCAAACAGACACCATGGTGC | TGG | 0.76 | 7 (2 exonic) | 12 bp | Sense | Higher off-target burden |
| 5 | AGTGGTCTACCCTTGGACCC | AGG | 0.65 | 15 (3 exonic) | 18 bp | Sense | Poor candidate overall |

**Judging Feedback:**
The student correctly identified that the AI failed to declare its genome build and scoring tools, which made the initial output unverifiable. The observation that Guide 4 (now re-ranked as Guide 1) was undervalued due to its proximity to the target SNP was insightful and reflects understanding of HDR biology. However, the student did not catch that the AI still has not addressed chromatin accessibility data for these guide sites in CD34+ cells, nor has it discussed potential for re-cutting after correction.

**Judging Grade: A**

**Steering Feedback:**
The steering prompt was specific and actionable — it named exact tools, requested a concrete column addition, and provided a biological rationale for re-ranking. The inclusion of the hg38 coordinate was a strong touch. However, the prompt could have also asked the AI to address the ssODN donor design (PAM-blocking silent mutations) and to comment on whether any guides overlap with known SNPs in diverse populations.

**Steering Grade: A**

---

### Cycle 2

**Student Judging (internal):**

gaps:
  - name: "The revised table is much improved with genome build"
    description: "The revised table is much improved with genome build, tools, and strand orientation. However, the AI still has not addressed whether these guide sites are in accessible chromatin in CD34+ HSCs (ATAC-seq data exists for this cell type)."
  - name: "The AI does not mention whether the recommended ssODN"
    description: "The AI does not mention whether the recommended ssODN donor should include silent mutations to block re-cutting after HDR."
  - name: "No functional validation plan is proposed (e.g., T7"
    description: "No functional validation plan is proposed (e.g., T7 endonuclease assay, amplicon sequencing, GUIDE-seq for empirical off-target detection)."

**Student Steering Prompt:**

instructions:
  - name: "Two remaining gaps: (1) Please check whether the"
    description: "Two remaining gaps: (1) Please check whether the top-ranked guide's target site falls in an accessible chromatin region in CD34+ HSPCs — reference the Corces et al. 2016 ATAC-seq dataset if possible. (2) Include a donor template design for the top guide showing the silent PAM-blocking mutation and the HDR-templated correction, and propose a validation strategy (e.g., amplicon deep sequencing for on-target HDR vs. NHEJ quantification, plus GUIDE-seq for empirical off-target profiling)."

**Updated AI Output:**

**Chromatin Accessibility:**
The HBB locus at chr11:5,225,000–5,229,000 shows strong ATAC-seq signal in CD34+ HSPCs (Corces et al., Nature Genetics 2016), confirming open chromatin at the target site. The top guide's cut site at chr11:5,227,000 falls within a called peak, supporting high editing efficiency in this cell type.

**Donor Template Design (140-nt ssODN, antisense strand):**
- Center: wild-type GAG codon (Glu) replacing GTG (Val) at E6V position
- PAM-blocking: CGG → CGC silent mutation (Arg codon preserved) 3 bp downstream of cut site
- Homology arms: 67 nt upstream, 67 nt downstream of the correction site
- Phosphorothioate modifications on terminal 2 nucleotides at each end for stability

**Validation Strategy:**
1. On-target editing: Amplicon deep sequencing (>10,000x coverage) at HBB exon 1 to quantify HDR, NHEJ, and unedited alleles
2. Off-target profiling: GUIDE-seq in CD34+ cells with the top guide RNP, followed by targeted amplicon sequencing at nominated off-target sites
3. Functional readout: In vitro erythroid differentiation of edited CD34+ cells followed by hemoglobin HPLC to quantify HbA vs. HbS

**Judging Feedback:**
The student identified the two most critical remaining gaps — chromatin accessibility validation and donor template design with re-cutting prevention. Requesting the specific ATAC-seq dataset by name demonstrates strong literature awareness. However, the student did not ask whether the phosphorothioate-modified ssODN could affect HDR fidelity, nor did they question the 140-nt length choice (shorter or asymmetric donors may have higher efficiency).

**Judging Grade: A**

**Steering Feedback:**
Excellent targeted steering that filled specific gaps without being overly prescriptive. The prompt correctly prioritized chromatin context and donor engineering, and the request for a validation strategy (amplicon sequencing + GUIDE-seq + functional readout) was comprehensive. The response from the AI is now much closer to a preclinical-grade deliverable. Minor gap: the student could have asked for quantitative success criteria (e.g., >30% HDR, <5% NHEJ at off-target sites).

**Steering Grade: A**

---

## COMPLETION

### Final Grades

| Skill | Grade | Rationale |
|-------|-------|-----------|
| **Framing** | **B+** | Strong identification of delivery vehicle, off-target threshold, and donor template ambiguities. Missed genome build and regulatory context. |
| **Judging** | **B+/A-** | Caught missing tool declarations and flawed ranking logic in Cycle 1. Improved to catch chromatin and donor gaps in Cycle 2, but missed some secondary concerns (ssODN length optimization, population-specific SNPs). |
| **Steering** | **B+/A-** | Prompts were specific, actionable, and biologically grounded. Progressed from tool/parameter requests to integrative validation strategy. Could have pushed harder on quantitative success criteria. |

### Summary

The student demonstrated solid competence in critically evaluating an AI-generated CRISPR guide RNA design. Framing identified the most impactful ambiguities but left some clinical-translation gaps unaddressed. Judging improved across cycles, moving from surface-level issues (missing tool names) to deeper biological concerns (chromatin context, re-cutting prevention). Steering was consistently specific and effective, producing meaningful improvements in the AI output. The main area for growth is pushing toward quantitative acceptance criteria and considering population genetics and regulatory requirements for preclinical applications.
