# Course: Molecular Biology
**Department:** Biology
**Institution:** Stanford University

---

## Subject Tree

```
Molecular Biology
├── DNA & Genome
│   ├── DNA Structure
│   │   ├── Double Helix
│   │   └── Chromatin Organization
│   ├── DNA Replication
│   │   ├── Replication Fork
│   │   └── Error Correction
│   └── Genome Organization
│       ├── Coding vs Non-coding
│       └── Repetitive Elements
├── Gene Expression
│   ├── Transcription
│   │   ├── Promoters & Enhancers
│   │   ├── RNA Polymerase
│   │   └── mRNA Processing
│   ├── Translation
│   │   ├── Ribosome Function
│   │   ├── Codon Usage
│   │   └── Post-translational Modifications
│   └── Regulation
│       ├── Transcription Factors
│       ├── Epigenetics
│       └── RNA Interference
├── Molecular Techniques
│   ├── PCR & qPCR
│   ├── Gel Electrophoresis
│   ├── CRISPR-Cas9
│   └── Sequencing Technologies
│       ├── Sanger Sequencing
│       └── Next-Gen Sequencing
├── Proteins
│   ├── Protein Structure
│   │   ├── Primary to Quaternary
│   │   └── Folding & Misfolding
│   ├── Enzymes
│   │   ├── Enzyme Kinetics
│   │   └── Inhibition
│   └── Protein-Protein Interactions
└── Cell Signaling
    ├── Signal Transduction Pathways
    ├── Receptor Types
    └── Second Messengers
```

---

## Challenge Examples

### Challenge 1: CRISPR Guide RNA Panel for Sickle Cell Trait
**Subject:** Molecular Techniques > CRISPR-Cas9
**Type:** Practice

**Raw Problem (intentionally ill-defined):**
> Design a panel of 5 candidate sgRNAs targeting the human beta-globin locus to correct the sickle cell point mutation (HBB E6V) via homology-directed repair. For each sgRNA, provide the 20-nt spacer sequence, the PAM, the predicted off-target profile, and a ranking with justification. Deliver your output as a formatted comparison table plus a one-page rationale memo recommending the top candidate for a preclinical study in CD34+ hematopoietic stem cells. The delivery vehicle and acceptable off-target hit threshold are not specified; the donor template design is left to you.

**Framing Rubric:**

#### Criterion 1: Unspecified parameters in the CRISPR design brief that constrain guide RNA selection
- **Description:** Identifies unspecified parameters in the CRISPR design brief (e.g., delivery format, model system, repair pathway) that constrain guide RNA selection and experimental feasibility
- **Excellent (A):** Clearly and specifically identifies unspecified parameters in the CRISPR design brief (e.g., delivery format, model system, repair pathway) that constrain guide RNA selection and experimental feasibility
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Missing acceptance criteria for off-target activity
- **Description:** Questions missing acceptance criteria for off-target activity and editing efficiency that are needed to rank candidate guides
- **Excellent (A):** Clearly and specifically questions missing acceptance criteria for off-target activity and editing efficiency that are needed to rank candidate guides
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Ambiguities in the desired editing outcome that change the entire experimental
- **Description:** Notes ambiguities in the desired editing outcome (knock-out vs. knock-in, template design, selection strategy) that change the entire experimental approach
- **Excellent (A):** Clearly and specifically notes ambiguities in the desired editing outcome (knock-out vs. knock-in, template design, selection strategy) that change the entire experimental approach
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Translational context is underspecified and shapes design trade-offs
- **Description:** Recognizes that the translational context (cell type, in vivo vs. ex vivo, regulatory requirements) is underspecified and shapes design trade-offs
- **Excellent (A):** Clearly and specifically recognizes that the translational context (cell type, in vivo vs. ex vivo, regulatory requirements) is underspecified and shapes design trade-offs
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Proposes guide sequences
- **Description:** Detects if AI proposes guide sequences without verifying them against a reference genome and confirming correct PAM orientation
- **Excellent (A):** Accurately detects if AI proposes guide sequences without verifying them against a reference genome and confirming correct PAM orientation and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Presents off-target or on-target scores
- **Description:** Identifies if AI presents off-target or on-target scores without specifying the computational tools, scoring algorithms, and parameter settings used
- **Excellent (A):** Accurately identifies if AI presents off-target or on-target scores without specifying the computational tools, scoring algorithms, and parameter settings used and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Ranks candidates using incomplete criteria
- **Description:** Catches if AI ranks candidates using incomplete criteria (e.g., off-target counts alone without on-target efficiency predictions or sequence-feature analysis)
- **Excellent (A):** Accurately catches if AI ranks candidates using incomplete criteria (e.g., off-target counts alone without on-target efficiency predictions or sequence-feature analysis) and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Omits key biological considerations for the target system that affect
- **Description:** Recognizes if AI omits key biological considerations for the target system (e.g., chromatin accessibility, delivery constraints, immune considerations) that affect real-world editing performance
- **Excellent (A):** Accurately recognizes if AI omits key biological considerations for the target system (e.g., chromatin accessibility, delivery constraints, immune considerations) that affect real-world editing performance and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Prompts direct the AI to declare the genome build
- **Description:** Prompts direct the AI to declare the genome build, scoring tools, and quantitative thresholds underlying its guide selection
- **Excellent (A):** Effectively addresses Prompts direct the AI to declare the genome build, scoring tools, and quantitative thresholds underlying its guide selection with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Explicitly compare alternative editing strategies with stated trade-offs
- **Description:** Guides the AI to explicitly compare alternative editing strategies (repair pathways, template designs, delivery methods) with stated trade-offs
- **Excellent (A):** Effectively guides the AI to explicitly compare alternative editing strategies (repair pathways, template designs, delivery methods) with stated trade-offs with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Need for a functional validation plan appropriate to the editing goal
- **Description:** Addresses the need for a functional validation plan appropriate to the editing goal (sequencing-based confirmation, phenotypic readout, controls)
- **Excellent (A):** Effectively addresses the need for a functional validation plan appropriate to the editing goal (sequencing-based confirmation, phenotypic readout, controls) with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Structured deliverable with quantitative ranking criteria
- **Description:** Converges on a structured deliverable with quantitative ranking criteria, justified recommendations, and clearly stated assumptions
- **Excellent (A):** Effectively converges on a structured deliverable with quantitative ranking criteria, justified recommendations, and clearly stated assumptions with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 2: Codon-Optimized Construct for Antibody Fragment Expression
**Subject:** Gene Expression > Translation > Codon Usage
**Type:** Assessment

**Raw Problem (intentionally ill-defined):**
> Build a codon-optimized DNA sequence for expressing a human anti-TNF-alpha single-chain variable fragment (scFv) in E. coli BL21(DE3). Deliver the full optimized nucleotide sequence (FASTA format), an annotated plasmid map (showing promoter, RBS, tag, terminator), and a 2-page expression and purification protocol predicting a yield target. The specific fusion tag, induction conditions, and whether the scFv has disulfide bonds that require special handling are not stated.

**Framing Rubric:**

#### Criterion 1: Protein's structural features constrain which expression host
- **Description:** Identifies that the protein's structural features (disulfide bonds, glycosylation, multimeric assembly) constrain which expression host and compartment are viable, and flags when this is unspecified
- **Excellent (A):** Clearly and specifically identifies that the protein's structural features (disulfide bonds, glycosylation, multimeric assembly) constrain which expression host and compartment are viable, and flags when this is unspecified
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Missing choices about fusion tags
- **Description:** Questions missing choices about fusion tags, signal peptides, or expression vectors that affect solubility, yield, and downstream functionality
- **Excellent (A):** Clearly and specifically questions missing choices about fusion tags, signal peptides, or expression vectors that affect solubility, yield, and downstream functionality
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Quantitative success criteria are absent, leaving optimization open-ended
- **Description:** Notes that quantitative success criteria (target yield, purity, activity threshold) are absent, leaving optimization open-ended
- **Excellent (A):** Clearly and specifically notes that quantitative success criteria (target yield, purity, activity threshold) are absent, leaving optimization open-ended
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Codon optimization depends on the host organism's codon bias
- **Description:** Recognizes that codon optimization depends on the host organism's codon bias and that induction and culture conditions are critical unspecified variables
- **Excellent (A):** Clearly and specifically recognizes that codon optimization depends on the host organism's codon bias and that induction and culture conditions are critical unspecified variables
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Performs codon optimization without addressing host-specific pitfalls
- **Description:** Detects if AI performs codon optimization without addressing host-specific pitfalls (rare-codon clusters, cryptic regulatory elements, mRNA secondary structure near the translation start)
- **Excellent (A):** Accurately detects if AI performs codon optimization without addressing host-specific pitfalls (rare-codon clusters, cryptic regulatory elements, mRNA secondary structure near the translation start) and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Ignores protein folding requirements that determine whether the expressed
- **Description:** Identifies if AI ignores protein folding requirements (disulfide bonds, chaperone needs, compartment redox environment) that determine whether the expressed protein will be functional
- **Excellent (A):** Accurately identifies if AI ignores protein folding requirements (disulfide bonds, chaperone needs, compartment redox environment) that determine whether the expressed protein will be functional and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Produces a construct or plasmid map missing essential genetic elements or uses
- **Description:** Catches if AI produces a construct or plasmid map missing essential genetic elements (origin, resistance marker, terminator) or uses incompatible parts for the chosen host
- **Excellent (A):** Accurately catches if AI produces a construct or plasmid map missing essential genetic elements (origin, resistance marker, terminator) or uses incompatible parts for the chosen host and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Expression and purification protocol lacks quality-control checkpoints
- **Description:** Recognizes if the expression and purification protocol lacks quality-control checkpoints (gel-based size verification, solubility assessment, activity assay)
- **Excellent (A):** Accurately recognizes if the expression and purification protocol lacks quality-control checkpoints (gel-based size verification, solubility assessment, activity assay) and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Prompts push the AI to compare alternative expression strategies with explicit
- **Description:** Prompts push the AI to compare alternative expression strategies (host strains, compartments, tags) with explicit trade-offs for the protein class in question
- **Excellent (A):** Effectively addresses Prompts push the AI to compare alternative expression strategies (host strains, compartments, tags) with explicit trade-offs for the protein class in question with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Report codon optimization metrics
- **Description:** Guides the AI to report codon optimization metrics (e.g., CAI) and the tool or algorithm used to generate the optimized sequence
- **Excellent (A):** Effectively guides the AI to report codon optimization metrics (e.g., CAI) and the tool or algorithm used to generate the optimized sequence with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Purification workflow end-to-end
- **Description:** Addresses the purification workflow end-to-end, with expected yield and purity at each step and appropriate analytical controls
- **Excellent (A):** Effectively addresses the purification workflow end-to-end, with expected yield and purity at each step and appropriate analytical controls with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Complete deliverable set: optimized sequence
- **Description:** Converges on a complete deliverable set: optimized sequence, annotated construct map, and an expression/purification protocol with quantitative benchmarks
- **Excellent (A):** Effectively converges on a complete deliverable set: optimized sequence, annotated construct map, and an expression/purification protocol with quantitative benchmarks with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 3: RT-qPCR Validation Panel for RNA-Seq Hits
**Subject:** Molecular Techniques > PCR & qPCR
**Type:** Practice

**Raw Problem (intentionally ill-defined):**
> Design a complete RT-qPCR validation experiment to confirm 8 differentially expressed genes identified by RNA-seq in human pancreatic ductal adenocarcinoma (PDAC) tissue versus matched adjacent normal tissue. Deliver a primer table (forward/reverse sequences, amplicon size, Tm), a plate layout diagram for a 96-well run, and a statistical analysis plan. The number of patient samples available, the reference genes to use, and the quantification method (absolute vs. relative) are not specified.

**Framing Rubric:**

#### Criterion 1: Number of biological and technical replicates is unspecified
- **Description:** Identifies that the number of biological and technical replicates is unspecified, which determines statistical power and plate layout feasibility
- **Excellent (A):** Clearly and specifically identifies that the number of biological and technical replicates is unspecified, which determines statistical power and plate layout feasibility
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Reference genes are appropriate
- **Description:** Questions whether the reference genes are appropriate and validated for the tissue or condition under study, since common housekeepers may be differentially regulated
- **Excellent (A):** Clearly and specifically questions whether the reference genes are appropriate and validated for the tissue or condition under study, since common housekeepers may be differentially regulated
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Quantification method is unspecified
- **Description:** Notes that the quantification method (absolute vs. relative) is unspecified and affects whether standard curves, calibrators, or efficiency corrections are required
- **Excellent (A):** Clearly and specifically notes that the quantification method (absolute vs. relative) is unspecified and affects whether standard curves, calibrators, or efficiency corrections are required
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: RNA source quality is unstated and constrains primer/amplicon design choices
- **Description:** Recognizes that RNA source quality (tissue type, preservation method, integrity) is unstated and constrains primer/amplicon design choices
- **Excellent (A):** Clearly and specifically recognizes that RNA source quality (tissue type, preservation method, integrity) is unstated and constrains primer/amplicon design choices
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Provides primer sequences without confirming specificity
- **Description:** Detects if AI provides primer sequences without confirming specificity (e.g., exon-junction spanning to exclude genomic DNA, BLAST verification, in-silico PCR)
- **Excellent (A):** Accurately detects if AI provides primer sequences without confirming specificity (e.g., exon-junction spanning to exclude genomic DNA, BLAST verification, in-silico PCR) and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Selects reference genes
- **Description:** Identifies if AI selects reference genes without justifying their expression stability across the experimental conditions using an appropriate validation method
- **Excellent (A):** Accurately identifies if AI selects reference genes without justifying their expression stability across the experimental conditions using an appropriate validation method and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Plate layout omits essential controls
- **Description:** Catches if the plate layout omits essential controls (no-template controls, no-reverse-transcriptase controls, inter-plate calibrators where applicable)
- **Excellent (A):** Accurately catches if the plate layout omits essential controls (no-template controls, no-reverse-transcriptase controls, inter-plate calibrators where applicable) and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Statistical analysis plan is missing multiple-testing correction
- **Description:** Recognizes if the statistical analysis plan is missing multiple-testing correction, power justification, or clearly stated effect-size assumptions
- **Excellent (A):** Accurately recognizes if the statistical analysis plan is missing multiple-testing correction, power justification, or clearly stated effect-size assumptions and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Prompts direct the AI to specify primer design tools
- **Description:** Prompts direct the AI to specify primer design tools, thermodynamic parameters, and sequence verification steps used
- **Excellent (A):** Effectively addresses Prompts direct the AI to specify primer design tools, thermodynamic parameters, and sequence verification steps used with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Include primer efficiency validation
- **Description:** Guides the AI to include primer efficiency validation (standard curves with stated acceptance criteria for R-squared and efficiency range)
- **Excellent (A):** Effectively guides the AI to include primer efficiency validation (standard curves with stated acceptance criteria for R-squared and efficiency range) with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: MIQE-compliant reporting requirements
- **Description:** Addresses MIQE-compliant reporting requirements (RNA quality thresholds, reverse transcription details, data normalization strategy)
- **Excellent (A):** Effectively addresses MIQE-compliant reporting requirements (RNA quality thresholds, reverse transcription details, data normalization strategy) with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Integrated deliverables: a primer specification table
- **Description:** Converges on integrated deliverables: a primer specification table, a labeled plate layout with sample and control assignments, and a statistical analysis plan with power and normalization rationale
- **Excellent (A):** Effectively converges on integrated deliverables: a primer specification table, a labeled plate layout with sample and control assignments, and a statistical analysis plan with power and normalization rationale with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 4: Bisulfite Sequencing Experiment to Map Promoter Methylation
**Subject:** Gene Expression > Regulation > Epigenetics
**Type:** Assessment

**Raw Problem (intentionally ill-defined):**
> Design and write a detailed experimental protocol to map CpG methylation across a 2 kb promoter region of the BRCA1 gene in a breast cancer cell line versus a non-tumorigenic control line. Deliver a step-by-step bench protocol (from DNA extraction through library prep), a bioinformatics analysis pipeline outline, and a results interpretation guide specifying what methylation patterns would support or refute the hypothesis that promoter hypermethylation silences BRCA1. The specific cell lines, sequencing platform, and read-depth target are not provided.

**Framing Rubric:**

#### Criterion 1: Biological model system is unspecified
- **Description:** Identifies that the biological model system is unspecified and that epigenetic marks vary across cell types, tissues, and disease states, making model choice critical
- **Excellent (A):** Clearly and specifically identifies that the biological model system is unspecified and that epigenetic marks vary across cell types, tissues, and disease states, making model choice critical
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Which epigenetic assay scale is appropriate given the scope of the region of interest
- **Description:** Questions which epigenetic assay scale is appropriate (locus-specific vs. genome-wide) given the scope of the region of interest, and flags cost/depth trade-offs
- **Excellent (A):** Clearly and specifically questions which epigenetic assay scale is appropriate (locus-specific vs. genome-wide) given the scope of the region of interest, and flags cost/depth trade-offs
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Sequencing platform, read-depth targets
- **Description:** Notes that sequencing platform, read-depth targets, and quantitative thresholds for calling epigenetic changes are missing and must be defined for reproducible results
- **Excellent (A):** Clearly and specifically notes that sequencing platform, read-depth targets, and quantitative thresholds for calling epigenetic changes are missing and must be defined for reproducible results
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Interpretation framework must operationally define what magnitude
- **Description:** Recognizes that the interpretation framework must operationally define what magnitude or pattern of epigenetic change constitutes a biologically meaningful finding
- **Excellent (A):** Clearly and specifically recognizes that the interpretation framework must operationally define what magnitude or pattern of epigenetic change constitutes a biologically meaningful finding
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Omits conversion or enrichment efficiency controls that are essential for the
- **Description:** Detects if AI omits conversion or enrichment efficiency controls that are essential for the chosen epigenetic assay (e.g., spike-in controls, input normalization)
- **Excellent (A):** Accurately detects if AI omits conversion or enrichment efficiency controls that are essential for the chosen epigenetic assay (e.g., spike-in controls, input normalization) and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Fails to account for assay-specific biases that distort quantitative
- **Description:** Identifies if AI fails to account for assay-specific biases (e.g., PCR amplification bias, antibody cross-reactivity, incomplete conversion) that distort quantitative measurements
- **Excellent (A):** Accurately identifies if AI fails to account for assay-specific biases (e.g., PCR amplification bias, antibody cross-reactivity, incomplete conversion) that distort quantitative measurements and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Bioinformatics pipeline uses generic alignment
- **Description:** Catches if the bioinformatics pipeline uses generic alignment or peak-calling tools instead of ones designed for the specific epigenetic data type
- **Excellent (A):** Accurately catches if the bioinformatics pipeline uses generic alignment or peak-calling tools instead of ones designed for the specific epigenetic data type and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Interpretation treats epigenetic marks as binary present/absent
- **Description:** Recognizes if the interpretation treats epigenetic marks as binary present/absent rather than as quantitative, site-resolved measurements
- **Excellent (A):** Accurately recognizes if the interpretation treats epigenetic marks as binary present/absent rather than as quantitative, site-resolved measurements and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Prompts push the AI to specify assay-appropriate primer
- **Description:** Prompts push the AI to specify assay-appropriate primer or probe design considerations (e.g., degenerate positions, CpG density, fragment size selection)
- **Excellent (A):** Effectively addresses Prompts push the AI to specify assay-appropriate primer or probe design considerations (e.g., degenerate positions, CpG density, fragment size selection) with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Include a functional validation step that links the observed epigenetic change
- **Description:** Guides the AI to include a functional validation step that links the observed epigenetic change to a downstream gene-expression or phenotypic consequence
- **Excellent (A):** Effectively guides the AI to include a functional validation step that links the observed epigenetic change to a downstream gene-expression or phenotypic consequence with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Statistical framework for comparing conditions
- **Description:** Addresses the statistical framework for comparing conditions (appropriate test per site or region, multiple-testing correction, biological vs. technical replicates)
- **Excellent (A):** Effectively addresses the statistical framework for comparing conditions (appropriate test per site or region, multiple-testing correction, biological vs. technical replicates) with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Integrated deliverables: a bench protocol with reagent
- **Description:** Converges on integrated deliverables: a bench protocol with reagent and cycling details, a bioinformatics pipeline with named tools and parameters, and a results interpretation guide with decision criteria
- **Excellent (A):** Effectively converges on integrated deliverables: a bench protocol with reagent and cycling details, a bioinformatics pipeline with named tools and parameters, and a results interpretation guide with decision criteria with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 5: Enzyme Inhibition Kinetics Characterization Workflow
**Subject:** Proteins > Enzymes > Inhibition
**Type:** Practice

**Raw Problem (intentionally ill-defined):**
> Write a complete experimental workflow to determine the inhibition constant (Ki) and mechanism (competitive, uncompetitive, or mixed) of a novel small-molecule inhibitor against recombinant human cyclooxygenase-2 (COX-2) using a spectrophotometric arachidonic acid oxidation assay. Deliver a protocol covering substrate and inhibitor concentration series, a data-collection spreadsheet template, and a step-by-step kinetic analysis guide that produces Lineweaver-Burk and Dixon plots. The compound's solubility, whether the inhibition is time-dependent, and the assay buffer composition are not given.

**Framing Rubric:**

#### Criterion 1: Inhibitor solubility and stability are unstated
- **Description:** Identifies that inhibitor solubility and stability are unstated, which determine the feasible concentration range and whether co-solvent vehicle controls are needed
- **Excellent (A):** Clearly and specifically identifies that inhibitor solubility and stability are unstated, which determine the feasible concentration range and whether co-solvent vehicle controls are needed
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Inhibition is reversible
- **Description:** Questions whether the inhibition is reversible, irreversible, or time-dependent, since each mechanism requires a fundamentally different assay design and analysis
- **Excellent (A):** Clearly and specifically questions whether the inhibition is reversible, irreversible, or time-dependent, since each mechanism requires a fundamentally different assay design and analysis
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Assay buffer composition is unspecified
- **Description:** Notes that assay buffer composition (pH, ionic strength, cofactors, reducing agents) is unspecified and directly affects enzyme kinetic parameters and apparent inhibition constants
- **Excellent (A):** Clearly and specifically notes that assay buffer composition (pH, ionic strength, cofactors, reducing agents) is unspecified and directly affects enzyme kinetic parameters and apparent inhibition constants
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Enzyme's Km for its substrate must be established before designing an inhibitor study
- **Description:** Recognizes that the enzyme's Km for its substrate must be established before designing an inhibitor study, so that substrate concentrations properly bracket Km
- **Excellent (A):** Clearly and specifically recognizes that the enzyme's Km for its substrate must be established before designing an inhibitor study, so that substrate concentrations properly bracket Km
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Proposes an inhibitor concentration series
- **Description:** Detects if AI proposes an inhibitor concentration series without first characterizing baseline enzyme kinetics (Km, Vmax) and an approximate potency (IC50) to set the range
- **Excellent (A):** Accurately detects if AI proposes an inhibitor concentration series without first characterizing baseline enzyme kinetics (Km, Vmax) and an approximate potency (IC50) to set the range and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Fails to test for time-dependent inhibition
- **Description:** Identifies if AI fails to test for time-dependent inhibition (pre-incubation experiments) or assumes reversibility without evidence
- **Excellent (A):** Accurately identifies if AI fails to test for time-dependent inhibition (pre-incubation experiments) or assumes reversibility without evidence and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Kinetic analysis uses too few substrate
- **Description:** Catches if the kinetic analysis uses too few substrate or inhibitor concentrations, or spaces them in a range that cannot distinguish inhibition mechanisms
- **Excellent (A):** Accurately catches if the kinetic analysis uses too few substrate or inhibitor concentrations, or spaces them in a range that cannot distinguish inhibition mechanisms and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Workflow lacks essential controls for compound interference with the detection method
- **Description:** Recognizes if the workflow lacks essential controls for compound interference with the detection method, vehicle effects, and enzyme stability over the assay time course
- **Excellent (A):** Accurately recognizes if the workflow lacks essential controls for compound interference with the detection method, vehicle effects, and enzyme stability over the assay time course and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Prompts direct the AI to include a preliminary substrate kinetics experiment
- **Description:** Prompts direct the AI to include a preliminary substrate kinetics experiment (Km/Vmax determination) before the inhibition characterization
- **Excellent (A):** Effectively addresses Prompts direct the AI to include a preliminary substrate kinetics experiment (Km/Vmax determination) before the inhibition characterization with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Design data-collection templates with columns for raw signal
- **Description:** Guides the AI to design data-collection templates with columns for raw signal, blank-corrected rates, and normalized activity suitable for import into curve-fitting software
- **Excellent (A):** Effectively guides the AI to design data-collection templates with columns for raw signal, blank-corrected rates, and normalized activity suitable for import into curve-fitting software with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Distinction between global nonlinear regression and linearized graphical methods
- **Description:** Addresses the distinction between global nonlinear regression (statistically preferred for mechanism discrimination) and linearized graphical methods (illustrative but less rigorous)
- **Excellent (A):** Effectively addresses the distinction between global nonlinear regression (statistically preferred for mechanism discrimination) and linearized graphical methods (illustrative but less rigorous) with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Integrated deliverables: a bench protocol with volumes
- **Description:** Converges on integrated deliverables: a bench protocol with volumes, timepoints, and controls; a formatted data-collection template; and a step-by-step analysis guide from raw data through Ki determination with model-comparison statistics
- **Excellent (A):** Effectively converges on integrated deliverables: a bench protocol with volumes, timepoints, and controls; a formatted data-collection template; and a step-by-step analysis guide from raw data through Ki determination with model-comparison statistics with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

