# Review: *Framing, Judging, Steering: An Assessable Competency Model for Teaching Students to Reason With Generative AI*

**Venue framing:** Computing-in-education / educational-technology journal (Computers & Education, *Computers & Education: AI*, IEEE TLT).
**Reviewer perspective:** computing / ed-tech systems and LLM-evaluation methods.
**Manuscript:** `paper/coreasoning.md`. Artifacts inspected: `research/README.md`, `research/scripts/*.py`, `research/results/*`, `research/data/`, `research/DATASHEET.md`, `human-study/CODEBOOK.md` + `score_agreement.py`, `code/artifacts/prompt-debug/originals/*.yaml` (16 prompts), `research/experiments/PROJECT_LOG.md`.

---

## 1. Summary

The paper makes two coupled contributions. (1) **CoReasoning**, a competency model that decomposes productive work with generative AI into three skills — **Framing** (pre-generation task specification), **Judging** (post-generation epistemic evaluation), and **Steering** (post-generation iterative correction) — grounded in a metacognitive monitor–control architecture (Nelson & Narens) plus an upstream SRL task-definition phase (Winne & Hadwin). The stated novelty wedge is the *temporal separation* of Framing from Steering, which prior frameworks (4D AI Fluency, CLEAR/prompt-literacy, Tankelevitch et al. metacognitive-demands) fuse under "prompting/iteration." Five propositions (P1–P5) are stated; only P3 (dissociation) is claimed as demonstrated. (2) **CoReasoning Lab**, an open-source platform whose 16-prompt LLM pipeline auto-generates ill-defined problems with seeded flaws, presents deliberately-imperfect AI output, runs judge-and-steer cycles, and scores the three skills via rubric-driven LLM evaluators.

The empirical core is an explicitly-scoped **feasibility demonstration** (no human-subjects data, no learning claims): simulated learners of crossed per-skill competence (gpt-4o-mini) graded by a *different* model (gpt-4o), in a $2^3$ factorial $\times$ 5 subjects ($N=40$, 255 grading calls). Headline results: an own-vs-cross effect matrix with diagonal **+1.03** / off-diagonal **−0.017** (≈60:1), near-zero inter-skill correlations (first factor only 42% of variance), bootstrap CIs excluding zero for Framing (+0.60) and Steering (+0.50), and a grader **92% self-consistent** on test-retest. A human-rater validation study is prepared (codebook + scoring script) but not run.

**Reproducibility check (I ran it):** every headline number reproduces *exactly* from the released CSVs. Recomputing the effect matrix from `e3_dissociation_grades.csv` yields diagonal +1.033, off-diagonal −0.017, ratio 62.0 (paper: "+1.03 / −0.017 … about 60 to 1" — correct). The reliability JSON gives overall flip-rate 0.0833 → 91.7% self-consistent (paper: 92% — correct), with per-skill flips Framing 0.15, Judging 0.00, Steering 0.10 (matches §8 verbatim). Factor-1 variance 42.4% matches. The 16 prompts, harness with deterministic SHA-keyed disk cache, datasheet (Gebru-style), and human-study package all exist as described. This is unusually honest, reproducible work for the genre.

---

## 2. Recommendation

**Major Revision** (leaning favorable), for a computing-in-education venue — specifically appropriate as a **system-and-instrument / position paper** with a feasibility demonstration. I emphasize this is a recommendation to *revise*, not reject: the conceptual contribution is genuine, the artifact is real and reusable, and the empirical claims are correctly and conservatively scoped. What blocks acceptance now is that the single most consequential validity question for an LLM-as-judge instrument — **does the automated grader agree with humans?** — is deferred rather than answered, and the feasibility evidence has structural soft spots (programmatic Judging anchor, single grader family, $N=40$ at one temperature) that a methods reviewer will not wave through even for a feasibility claim. Most of these are addressable with compute the authors already have wired up; one (human agreement) is the real bar.

If this venue has a *Position Paper* / *Blue Sky* track that explicitly does not require new empirical validation, the bar drops to **Minor Revision**, because the conceptual + system contribution stands on its own and the demo is correctly labeled non-validating. I review against the stronger (regular-paper) bar below and flag which concerns relax under the position-paper track.

---

## 3. Strengths

1. **A real, reusable artifact, not a paper-only system.** The 16-prompt instrument, the controlled-generation harness, the cached deterministic LLM outputs, the analysis scripts, the datasheet, and a fully-prepared human-rater package (codebook + `score_agreement.py` computing Cohen's/Fleiss' κ and ordinal Krippendorff's α) are all released and internally consistent. The deliberately-flawed-output generator (prompt 03 + `internal_issues`) and the recall/precision Judging signal are concretely implemented, not hand-waved. This is the level of artifact maturity TLT and C&E:AI reviewers want and rarely get.

2. **Reproducibility is exemplary for the genre.** Keys live outside the repo; the disk cache is SHA-keyed on (stem, system, user, temp, seed); the README gives a three-command reproduction path; the datasheet honestly documents that the *deployed app's stored responses were demo placeholders and are excluded*. I reproduced all four headline numbers from the released data without re-calling any API.

3. **The dissociation design is the right answer to the right objection.** A crossed $2^3$ per-skill factorial is exactly the design that separates "monotone-on-all-skills" (consistent with one competence factor) from genuine construct separation. The own-vs-cross effect matrix is a clean, legible operationalization, and reporting it *alongside* inter-skill correlations and a factor note (rather than over-claiming a factor model on three indicators) is methodologically disciplined.

4. **Honest, well-bounded claims.** The paper repeatedly and correctly refuses learning-outcome claims, names the "who grades the grader" recursion, flags that Judging's dissociation is "partly built in," and reads the weak Steering own-effect as a grader-leniency artifact rather than spinning it. The §8 "Scope and caveats" paragraph pre-empts most of what a hostile reviewer would raise.

5. **Strong, current positioning.** Table 1 maps each nearest prior framework (4D Fluency, Tankelevitch metacognitive-demands, CLEAR, Long & Magerko/UNESCO, Cyborg/Centaur) onto the triad and shows the recurring fuse-or-omit pattern. The novelty claim ("first theory-grounded decomposition separating pre- from post-generation control with dissociation evidence") is precisely stated and defended, not asserted.

6. **Theory grounding is coherent, not decorative.** The monitor (Judging) / control (Steering) / task-definition (Framing) mapping is principled and reused consistently to derive the J/S boundary (§3.3) and to reconcile the apparent P2-vs-P3 tension (ceiling correlation vs. off-diagonal below the reliability ceiling).

---

## 4. Major concerns

Each is numbered with a concrete fix.

### M1. The decisive validity question (human–grader agreement) is deferred, yet the abstract leans on grader reliability.
The instrument is an LLM-as-judge. Its scientific load-bearing claim — that the automated grades *mean* what the rubric says (Framing/Judging/Steering quality) — rests entirely on **internal** behavior (discrimination, dissociation, self-consistency). The paper is candid that "the automated grades have not yet been validated against human experts" and that 92% self-consistency "measures *precision* (repeatability), not *accuracy*." But the abstract foregrounds "the automated grader is 92% self-consistent" as a headline, which a reader will over-read as reliability-in-the-validity sense. For a venue whose readership runs LLM-as-judge studies, a deferred human-agreement study is the single biggest gap: an instrument that is highly self-consistent *and* systematically wrong is the classic LLM-judge failure mode, and the paper's own cited Feng et al. (2025) shows κ can fall to 0.1–0.3 on hard rubric judgments.
**Fix (strongest):** run the prepared human-rater study on the stratified transcript subset (the codebook and `score_agreement.py` are ready; this is the obvious highest-leverage addition) and report per-skill Cohen's/Fleiss' κ and ordinal Krippendorff's α before camera-ready. **Fix (minimum, if positioned as a position/feasibility paper):** (a) move "92% self-consistent" out of any sentence that could read as a validity claim and re-label it "test–retest precision" in the abstract; (b) add one explicit sentence in the abstract and §1 that *no* human-agreement evidence exists yet; (c) state the seeded-issue human-verification (currently promised in §10) as a *blocking prerequisite* for trusting the Judging recall/precision signal, not a later nicety.

### M2. Judging's "dissociation" is mechanically built in and inflates the headline ratio.
The 60:1 ratio is dominated by Judging's deterministic +2.00 own-effect with exactly 0.00 cross-effects. But Judging competence is not a free-text learner behavior graded blind — it is a **programmatic selection over ground-truth issues** (`judging_selection()` in `e3_pilot.py`: expert flags all real + 0 false; novice flags ~35% + 1 distractor; careless flags 0 + 2). So the Judging row of Table 2 confirms only that *the grader correctly rewards a recall/precision vector it is handed* — it is a grader sanity check, not a discovered separation among learner behaviors. The paper acknowledges this in §8(i), but the **headline +1.03 / 60:1 still pools the built-in Judging diagonal with the two genuinely-earned ones**, so the most-quoted number is partly an artifact of the anchor.
**Fix:** report the headline ratio computed on the **free-text, blind-graded skills only** (Framing +0.60, Steering +0.50) as the primary evidence, with the Judging diagonal shown separately as the controlled anchor. Recomputing on Framing+Steering alone gives a much more honest (and still positive) own-vs-cross contrast; lead with that. Do not let the deterministic +2.00 carry the abstract's "sixty to one."

### M3. Single grader model family; the central claim's robustness is untested.
All grades come from one model (gpt-4o), and §8(ii)/§11 correctly flag that "whether the dissociation replicates across grader backends" is open. For a methods venue this is not a minor caveat: grader-backend sensitivity is *the* known confound in LLM-as-judge work, and the deployed prototype's actual engine is `llama-3.3-70b`, a *different* model from the one that produced every number in the paper. So the paper validates an instrument it does not deploy and deploys an instrument it does not validate.
**Fix:** run the $N=40$ dissociation under at least one additional grader backend (the harness already supports `COREASON_GRADER=...` and llama-3.3-70b is wired in via OpenRouter). Report whether the effect matrix and the F/J/S correlations are stable across backends. If the dissociation survives a llama grader, that is a *strengthening* result and directly closes the deploy-vs-validate gap; if it does not, that itself is the paper's most important finding. This is a few hours of cached compute, not a new study.

### M4. $N=40$ at production temperature; the CIs are real but the design is thin where it matters most.
The bootstrap CIs are correctly computed and the Framing/Steering diagonals exclude zero, which is the load-bearing inference. But the design has only **5 challenges** and **5 simulated personas per cell** for the reliability run, and the free-text skills (the ones that count) rest on a handful of cells. Steering's own-effect (+0.50, CI [+0.18, +0.82]) is barely separated from zero and the paper itself attributes the compression to a grader-leniency floor — i.e., the instrument may not discriminate weak Steering at all, which is a measurement gap, not just an effect-size note.
**Fix:** (a) expand to more challenges/personas (the harness is cached and cheap on re-run); (b) for Steering specifically, run the "harsher rubric" ablation the paper promises in §8(iv) and show whether a stricter steering evaluator separates weak from strong; (c) report per-subject effect matrices (you have 5 subjects) so the reader can see whether dissociation holds within each domain or only pooled. Per-bucket breakdown is where a methods reviewer looks for fragility.

### M5. Prompt-sensitivity / construct-leakage of the grader is unmeasured.
The dissociation argument depends on each evaluator interrogating a *different referent* (Framing↔gold framing, Judging↔seeded issues, Steering↔trajectory). The harness shows real engineering to prevent leakage (no competence-label in grader inputs; schema-echo guards; separate sim vs. grader providers). But there is no experiment showing the grades are *insensitive to prompt perturbation* or that a deliberately-cross-contaminated input (e.g., a strong-framing transcript fed to the Steering evaluator) does not bleed into the off-diagonal. The near-zero off-diagonal is asserted as evidence of separation; it could partly reflect that the three evaluators simply read disjoint fields.
**Fix:** add a small prompt-sensitivity ablation (paraphrase each evaluator's rubric, or perturb temperature) and report effect-matrix stability; and add an adversarial cross-feed control showing the off-diagonal stays near zero when a high-quality response in skill X is injected into skill Y's evaluator. This converts "the grades dissociate" from a property of disjoint inputs into a property of the constructs.

### M6. The system (CoReasoning Lab) is described but not evidenced as deployed/usable.
§7 and Appendix A describe a role-based bilingual platform with authoring/learner flows and analytics, illustrated by SVG mockups (`system-mockup.svg`, `interface-gallery.svg`). But the PROJECT_LOG states "App source GONE; 16 prompt YAMLs survive," and the released artifact is the *prompt engine + harness*, not a runnable platform. The paper's framing ("a deployed web platform," "the engine of a deployed prototype") risks over-claiming a running system when what is reproducible is the instrument pipeline. For a systems-leaning ed-tech venue this matters: reviewers distinguish "released system" from "released prompts + analysis harness."
**Fix:** either (a) release/point to the runnable platform (even a minimal harness UI) and label the SVGs as illustrative of *that*, or (b) soften §7/Appendix-A language to make explicit that the platform is a prior prototype whose *instrument* is what is released and validated here, and that the figures are design mockups of the prototype's interface, not screenshots of a re-runnable system. Right now a careful reader who opens the repo will find a contradiction between "deployed web platform" and the released artifact set.

---

## 5. Minor issues

- **Abstract metric phrasing.** "the automated grader is 92% self-consistent, with simulated learners generated and graded by different models" packs a precision claim and a decontamination claim into one clause; split and label the 92% as test–retest precision (see M1).
- **"60 to 1" precision.** State it as the ratio of the *pooled* diagonal to the *pooled* off-diagonal and note it is dominated by the deterministic Judging term (see M2). The exact value (62.0) is fine; the interpretation needs the caveat inline, not only in §8.
- **Reliability $N$.** §8 reports 92% from 4 profiles × 3 skills × 5 repeats = 12 cells; the cell count (and that it is one challenge only) should be stated in-text, not only inferable. Judging's 0.00 flip is deterministic-by-construction and should not be averaged into the "92%" without a footnote, since it mechanically lowers the flip rate.
- **Factor analysis on three indicators.** §8(iii) correctly notes under-identification; good. But "first principal factor accounts for only 42%" invites the counter that with 3 standardized indicators the *maximum* a single factor can explain is bounded by the inter-correlations, so 42% is near the floor an uncorrelated set would give — make that explicit so the number is not read as a surprisingly-low result on an unconstrained scale.
- **P2 vs. P3 reconciliation (§3.3)** is elegant but currently rests on prose; if any cell shows the predicted ceiling relation (Steering ≤ Judging within a learner), show it as a one-line empirical aside.
- **Distractor generation** (`gen_distractors`) is itself an LLM call at temp 0.7; the false-positive control for Judging therefore depends on LLM-generated "plausible-but-false" issues whose actual falsity is unverified. Note this; it feeds the seeded-issue human-verification in M1.
- **Bilingual (Hebrew) claim** in §7 is untested in the demo (challenges are English-only per §11). Either show one Hebrew run or scope the claim to the prototype's feature set.
- **Citation hygiene:** several references are 2025–2026 arXiv preprints (Feng et al. 2025; Clerc et al. 2026; Di Santi 2026; Srinath et al. 2025). For a journal, verify these are the versions you intend and flag preprint status; a couple carry future-dated arXiv IDs (e.g., 2604.*, 2603.*, 2512.*) that a copyeditor will query.
- **Figure provenance.** Figures 2/3 are PNGs regenerated by `make_figures.py` from the CSVs — good. State the seed/commit so the figures are reproducible from the released data.
- **"255 blind grading calls"** decomposition in §8 ("up to seven grader calls … three skill evaluators plus a grading pass each and one steering-update call") does not obviously multiply to 255 over 40 learners (40×7=280); reconcile the arithmetic or explain the caching that reduces it.

---

## 6. Positioning vs. LLM-as-judge / automated-assessment literature

The grader-validity discussion is **adequate in awareness but thin in execution**. The paper cites the right anchors (Feng et al. 2025 on LLM-judge–human κ; the self-inconsistency / "rating roulette" concern is addressed by the test-retest run) and names the recursive "who grades the grader" threat explicitly — better than most ed-tech LLM-judge papers. What is missing is the *standard* LLM-as-judge validation battery that this literature now expects: (i) human-agreement κ/α (deferred — M1); (ii) position/verbosity/self-preference bias checks (the cross-model design mitigates self-preference but verbosity bias on free-text Framing/Steering is unchecked); (iii) grader-backend robustness (M3); (iv) prompt-sensitivity (M5). The datasheet (Gebru-style) and the prepared human-study package are above the field norm for data-release/ethics quality, and the no-PII / fully-synthetic / no-human-subjects framing is clean. Net: the *reproducibility and ethics* story is a strength; the *grader-validity* story is correctly scoped but currently one experiment (human agreement) short of what a methods reviewer will accept as "validated," and the paper should stop short of any phrasing that implies validation.

---

## 7. Technical soundness & clarity

- **Soundness:** All quantitative claims I could check reproduce exactly from the released code/data (effect matrix, ratio, self-consistency, per-skill flips, factor variance). The analysis code is correct (own-minus-weak means; pstdev for grade SD; bootstrap CIs). No statistical errors found.
- **Overclaim risk** concentrates in three phrasings: "deployed web platform" (M6), "92% self-consistent" in the abstract (M1), and the pooled "60 to 1" leading with a built-in term (M2). All three are fixable with wording + one re-tabulation; none reflect a flaw in the underlying analysis.
- **Underspecification:** the in-text call-count arithmetic (255 vs 280); the reliability-run cell count and single-challenge basis; the Hebrew/bilingual scope; and the relationship between the released instrument and the (lost) deployed app.
- **Clarity:** the manuscript is well written and well organized; §3.3's J/S boundary and the P2/P3 reconciliation are genuinely clarifying. Figures 1–3 + A1/A2 are appropriate. The novelty table is the paper's clearest asset.

---

## 8. Prioritized revision checklist

**Must-fix before acceptance (regular-paper bar):**
1. **(M1)** Run the prepared human-rater agreement study (or, if position-paper track, hard-label every grader number as precision-not-validity and add explicit "no human agreement yet" sentences to abstract + §1).
2. **(M3)** Report the dissociation matrix under a second grader backend (llama-3.3-70b is wired in) to close the deploy-vs-validate gap.
3. **(M2)** Re-lead the headline with the Framing+Steering (blind-graded) own-vs-cross contrast; present Judging's +2.00 separately as the controlled anchor, not pooled into "60:1."
4. **(M6)** Reconcile "deployed web platform" language with the actually-released artifact (prompt engine + harness); relabel SVGs as design mockups of the prior prototype.

**Should-fix:**
5. **(M4)** Expand challenges/personas; add per-subject effect matrices; run the promised harsher-Steering-rubric ablation.
6. **(M5)** Add a prompt-sensitivity + adversarial cross-feed control showing the off-diagonal is a property of the constructs, not of disjoint input fields.
7. Verify and human-spot-check the seeded issues and distractors (LLM-generated ground truth) before trusting the recall/precision signal.

**Nice-to-have / polish:**
8. Fix the 255-vs-280 call arithmetic; state reliability cell count and single-challenge basis; footnote Judging's deterministic 0.00 flip.
9. Clarify the 42%-factor-variance floor interpretation; add the one-line empirical Steering≤Judging ceiling check.
10. Scope or demonstrate the bilingual claim; verify 2025–2026 preprint citations and flag preprint status; record figure seed/commit.

---

*Overall:* a conceptually genuine, unusually reproducible contribution whose system and instrument are real and whose feasibility claims are correctly and conservatively scoped. The gap between "feasible instrument" and "validated instrument" — chiefly the unrun human-agreement study and the single-grader-family evidence — is what stands between this and acceptance, and most of it is closable with compute the authors have already wired up.
