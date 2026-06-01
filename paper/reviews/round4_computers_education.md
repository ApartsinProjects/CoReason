# Review (Round 4): *Framing, Judging, Steering: An Assessable Competency Model for Teaching Students to Reason With Generative AI*

**Venue:** Computers & Education / Computers & Education: Artificial Intelligence / IEEE TLT.
**Reviewer perspective:** computing-in-education systems + LLM-evaluation methods.
**Manuscript:** `paper/coreasoning.md` (read line by line).
**Artifacts re-inspected this round:** `research/README.md`, `research/experiments/PROJECT_LOG.md`, `research/results/*` (effect matrix recomputed from `e3_dissociation_grades.csv`; reliability JSON; construct-validity JSON; the in-progress `robustness_gpt4omini_log.txt`).
**Prior review:** `paper/reviews/journal_education_computing.md` (Round 1, Major Revision).

---

## 1. Summary

The paper couples (1) **CoReasoning**, a competency model decomposing productive generative-AI use into three temporally distinct, independently-assessable skills — Framing (pre-generation task specification), Judging (post-generation epistemic evaluation), Steering (post-generation iterative correction) — grounded in a Nelson–Narens monitor–control architecture plus a Winne–Hadwin SRL task-definition phase, with five propositions (P1–P5) and a precise novelty boundary against the nearest priors; and (2) **CoReasoning Lab**, a prototype platform whose released 16-prompt LLM instrument auto-generates ill-defined problems with seeded flaws, presents deliberately-imperfect output, runs judge-and-steer cycles, and scores the three skills via rubric-driven LLM evaluators. The empirical core is an explicitly-scoped feasibility demonstration: simulated learners (gpt-4o-mini) graded by a different model (gpt-4o), in a 2³ per-skill factorial × 5 subjects (N=40, 255 grading calls), reporting an own-vs-cross effect matrix (diagonal +1.03, off-diagonal −0.017), bootstrap CIs excluding zero for Framing (+0.60) and Steering (+0.50), near-zero inter-skill correlations, and a grader 92% self-consistent on test-retest. No learning claims.

**Reproducibility (re-checked this round):** I recomputed the full effect matrix from `e3_dissociation_grades.csv`: diagonal mean +1.033, off-diagonal −0.017, and every Table 2 cell matches to the digit (Framing row +0.60/+0.00/−0.10; Judging +0.00/+2.00/+0.00; Steering −0.20/+0.20/+0.50). Reliability JSON gives overall flip-rate 0.083 → 91.7% ≈ 92%, with per-skill flips Framing 0.15 / Judging 0.00 / Steering 0.10. Construct-validity JSON gives factor-1 variance 42.4%. All headline numbers reproduce exactly. This remains unusually honest, reproducible work.

**Round-1 → Round-4 progress.** The revision has addressed the four Round-1 must-fixes well: (M2) the headline now leads with the two blind-graded skills and explicitly de-emphasizes the built-in Judging +2.00; (M6) §7 now discloses the interface figures are "representative mockups … rather than screenshots of a running deployment" and that "all quantitative results come from the released prompt engine, not from platform usage logs"; (M1) the abstract and §8 now hard-label 92% as precision-not-accuracy; per-subject breakdown was added (§8). These are real, well-executed fixes. **One Round-1 must-fix remains genuinely open: M3, the grader-backend robustness check.** The brief lists it as "in progress," and the repo confirms it is *not yet complete*: `research/results/robustness_gpt4omini_log.txt` stops at learner 34/40 with no results JSON and no analysis, and the paper correctly does not report it. The paper's deferral language (§8(ii), §10, §11) is honest, so this is not an overclaim — but it is the last substantive gap, and I flag below exactly where it lands.

---

## 2. Recommendation

**Minor Revision** (leaning Accept), positioned as a system-and-instrument / conceptual paper with a feasibility demonstration.

Rationale: the conceptual contribution is genuine and tightly argued; the artifact is real, released, and exactly reproducible; the empirical claims are conservatively and correctly scoped; and the Round-1 structural concerns (headline-inflation, platform-overclaim, precision-vs-accuracy conflation) are now fixed in the prose. What keeps this at Minor rather than Accept is a short list of *wording-level* residual overclaims and underspecifications (Style/Methods below) plus the still-open grader-backend check (M3). None of these is a structural blocker for a feasibility/position framing; all are closable without new conceptual work. If the venue's Position-Paper track is used (C&E:AI has one), this is a clean Minor.

---

## 3. Line-by-line issues

Grouped Hook / Focus / Style / Methods / Recent-work. Format: quote → problem → fix.

### HOOK (title, abstract, introduction)

**H1 — Abstract buries the reusable artifact, which is the venue's primary currency.**
Quote (abstract): "We instantiate the model in **CoReasoning Lab**, a learning platform that generates ill-defined problems, confronts students with deliberately flawed AI output…". The release of a 16-prompt instrument + controlled-generation harness + data + datasheet — the thing a computing-in-education reader most wants — is not mentioned anywhere in the abstract; it only surfaces in contribution 6. For C&E:AI / TLT, the *reusable, reproducible artifact* is a headline asset, not a footnote.
Fix: add one sentence near the end of the abstract, e.g. "We release the instrument as an open artifact — a 16-prompt scoring engine, a controlled-generation harness with a deterministic cache, the demonstration data, and a Gebru-style datasheet — together with a prepared human-rater validation protocol." This both strengthens the hook and front-loads the contribution the venue rewards.

**H2 — Title does not signal the system/instrument contribution.**
Quote (title): "An Assessable Competency Model for Teaching Students to Reason With Generative AI." The title reads as pure conceptual model; a reader scanning a systems-leaning ed-tech TOC will not see "instrument" or "platform." Given the paper's dual contribution, consider surfacing the artifact, e.g. "…: A Competency Model and an Open Auto-Scoring Instrument…". Optional, but it would help the paper reach the readers most likely to reuse the artifact.

**H3 — "255 blind grading calls" appears in the abstract-adjacent framing without the arithmetic ever closing.**
Quote (§8): "40 simulated learners and 255 blind grading calls (each learner is scored by up to seven grader calls … with identical inputs cached across profiles)." 40 × 7 = 280, not 255; the text says "up to seven" and "cached across profiles" but never states what the cache collapses, so the reader cannot verify 255. This was flagged in Round 1 (minor item) and is still unreconciled.
Fix: state the reduction explicitly, e.g. "(Judging inputs are deterministic selections shared across the four profiles that fix the other two skills, so 25 of the would-be 280 calls are cache hits, giving 255 distinct calls)" — or whatever the true caching is. One clause closes it.

### FOCUS (scope, drift, redundancy, feasible-vs-validated boundary)

**F1 — The feasible-vs-validated boundary is crisp and well maintained.** §1 (last line), §7.1 (closing caveat), §8 ("These results establish feasibility, not validity"), §10 (Messick/Kane scoring-vs-extrapolation framing), and §11 all draw the line consistently. No drift here; this is a strength worth preserving verbatim through copyedit.

**F2 — Minor redundancy: the "which cognitive operation failed" diagnostic motif is stated three times in near-identical form.**
Quote (§1): "whether they specified the task badly, failed to detect the flaws in the output, or knew the flaws but could not correct them." Quote (§2): "did the learner specify the task badly … did they fail to detect the flaws … or did they see the flaws but issue corrections too vague to fix them?" The §1 and §2 statements are nearly verbatim. Keep the §2 (longer, with the "three remedies" payoff) and compress the §1 instance to a single clause, so the motif lands once with force rather than twice.

**F3 — §3.3's P2/P3 reconciliation is excellent and on-message** (ceiling-relation vs off-diagonal-below-reliability). No change needed; this is the paper's sharpest conceptual passage. The Round-1 suggestion to add a one-line empirical Steering≤Judging ceiling check (the CSV does contain cells where this is testable) would convert the prose into evidence — optional but strengthening.

**F4 — Appendix A slightly re-litigates §7.** Quote (App. A): "the interface-level expression of the framework's central claim that productive AI use is not one skill but three" duplicates §7's "is the framework's central claim made operational." Trim one. Not a blocker.

### STYLE (prose, precision, over/under-claiming, house style)

**S1 — House-style violation: the manuscript is saturated with em-dashes.** The body uses the em-dash glyph extensively (e.g. §3.1 "*external*, the AI's generative process, rather than"; §6 "not individually new; what is new"; §8 "to report. We make no" passages render with —). A direct scan of the markdown shows numerous "—" occurrences (e.g. the section headers "monitor–control", and inline dashes throughout §3.1, §3.3, §6, §8). House style forbids em-dashes and double-hyphens.
Fix: global replace. Note two distinct cases: (a) the *en-dash in "monitor–control" / "Judge→Steer" / "Nelson–Narens" / "Framing–Judging"* compound terms — these are en-dashes (–), arguably acceptable as range/relation glyphs, but if the house rule is strict, convert to hyphen ("monitor-control") for consistency with the many places the paper already writes "monitor-control" with a hyphen (the manuscript is currently *inconsistent*: §3.1 uses both "monitor–control" and "monitor-control"). (b) Any true em-dash (—) used as a sentence break must become a comma, semicolon, colon, or parenthesis. Do a pass for both. This is the single most pervasive copyedit item.

**S2 — "the automated grader is 92% self-consistent" — precision label is present but one phrase still over-reaches.**
Quote (§8 Reliability): "This addresses the documented self-inconsistency of LLM judges, though it measures *precision* (repeatability), not *accuracy* against humans." Good — the caveat is correct. But the abstract still says "the grader is also internally consistent across repeats" immediately after the dissociation result, in a sentence whose rhetorical weight reads as reliability-in-the-validity-sense. The Round-1 fix asked for the precision label to travel into the abstract.
Fix: in the abstract, change "the grader is also internally consistent across repeats" to "the grader is also *test–retest consistent* (a precision check, not yet validated against human raters)." This closes the last place a skimming reader could over-read 92% as validity.

**S3 — "92% self-consistent" pools a deterministic-by-construction term.**
Quote (§8): "The grader is **92% self-consistent** overall: the mean grade-flip rate across repeats is 0.08, with Judging deterministic (0.00, by construction), Framing 0.15, and Steering 0.10." Averaging Judging's mechanical 0.00 into the pooled 92% inflates the headline self-consistency: the *blind-graded* skills flip at 0.15 and 0.10, i.e. the precision a reader should weight is ~87–90%, not 92%. The text is honest (it discloses the 0.00 is by construction) but the *headline number* still benefits from the built-in term, exactly the M2-style inflation the authors fixed for the dissociation ratio.
Fix: report the blind-graded self-consistency (Framing+Steering ≈ 87.5%) as the load-bearing figure and present the 92% pooled with the same "dominated by a by-construction term" caveat already applied to the +1.03 ratio. Also state the reliability cell count in-text: per the JSON it is 4 profiles × 3 skills × 5 repeats = 12 cells on a small fixed transcript set; readers should not have to infer N.

**S4 — Under-specified: the model identity tension between paper and repo.**
Quote (§11): "learners are generated by one model (gpt-4o-mini) and graded by a different one (gpt-4o); the deployed prototype's engine is llama-3.3-70b." This is correctly disclosed, but a reader who opens `research/README.md` ("Engine: `llama-3.3-70b` … the deployed prototype's model") may be briefly confused that the README describes the *prototype* engine while the *paper's numbers* come from gpt-4o. Not an error — just add a one-line note in README or §7.1 that the released demonstration decontaminates to gpt-4o-mini/gpt-4o and that llama is the prototype/robustness target, so the two documents are obviously reconciled.

**S5 — "near-zero" used loosely for −0.22.**
Quote (§8): "near-zero inter-skill correlations" and Table-2 prose. Framing–Steering ρ = −0.22 is described as "near-zero" / "essentially flat." −0.22 is small and non-significant (p>0.17 at N=40), but "near-zero" is a stretch for a point estimate that size; the honest framing is "small and statistically non-significant." Fix: replace "near-zero" with "small and non-significant (all p>0.17)" where the −0.22 is in scope. Keeps the claim defensible against a methods reviewer who notices −0.22 is not near zero.

**S6 — "drive the AI energetically toward the wrong target" / "issue fluent, confident commands" — colloquial register spikes.** Minor: a few vivid phrases (§3.2 "drive the AI energetically"; §3.3 "fluent, confident commands") sit slightly above the surrounding academic register. Acceptable, but tighten if the copyeditor flags tone.

### METHODS RIGOR

**M-A — The effect matrix, CIs, correlations, and 92% all reproduce exactly and are correctly stated.** I recomputed the matrix from the released CSV (diagonal +1.033, off-diagonal −0.017, every Table 2 cell exact). The bootstrap CIs (Framing [+0.38,+0.81], Steering [+0.18,+0.82]) and the deterministic Judging +2.00 are correctly characterized. No statistical errors. The decision to report a manipulation-based effect matrix + inter-skill correlations rather than a 3-indicator factor model is the right call and is correctly justified (under-identification). This is methodologically disciplined.

**M-B — The "leading with blind-graded skills" fix is correctly executed but the abstract's "+0.6 and +0.5" should name them as the *blind-graded* pair right there.**
Quote (abstract): "The decisive evidence is the two blind-graded skills, Framing and Steering, which show positive own-competence effects (+0.6 and +0.5 grade points)…". Good. This is exactly the M2 fix. Verify the body and abstract agree on rounding: abstract "+0.6/+0.5", §8 "+0.60/+0.50" — fine, but Table 2 and §8 should be internally consistent (they are).

**M-C — Programmatic-Judging-anchor caveat is correctly and repeatedly stated** (§8 Discrimination "mechanistically transparent," §8(i), §8 Dissociation "fixed by construction"). The headline ratio is no longer led with Judging. This fully addresses Round-1 M2.

**M-D — The 92% precision/accuracy distinction is stated, but the seeded-issue ground-truth verification is still framed as a *future* step rather than a *blocking prerequisite* for the Judging recall/precision signal.**
Quote (§10): "a stratified subset of those seeded issues will be verified by human domain experts to confirm they are genuine, non-spurious flaws before the recall/precision signal can be trusted." This is good — but §8 reports the Judging recall/precision (4/4 flagged, 0 false → A) as a clean result without re-stating that the "ground truth" it scores against is itself LLM-generated (problem-gen prompt) and the distractors are an LLM call at temp 0.7 (per the harness). A methods reviewer will note the recall/precision signal is measured against *unverified* machine ground truth.
Fix: add a half-sentence in §8 Discrimination/§8(i) noting the seeded issues and distractors are machine-generated and not yet human-verified (cross-referencing §10), so the +2.00 Judging diagonal is explicitly contingent on that verification. This is consistency, not new work.

**M-E — Grader-backend robustness (Round-1 M3) is still open and the paper is honest about it; recommend completing it if at all possible.**
The repo shows the gpt-4o-mini-backend robustness run was started but stopped at 34/40 (`robustness_gpt4omini_log.txt`), with no results JSON. The paper defers this correctly (§8(ii) "whether the dissociation replicates across grader backends … are the validity questions deferred to Section 10"; §11 same; §10 "a grader-robustness study across multiple model backends"). So this is *not* an overclaim. But it is the single most valuable addition still available, and the harness already supports it (the run was 85% done). If a second-backend effect matrix can be produced before camera-ready and the dissociation survives, that converts §8(ii) from a deferral into a strengthening result and closes the deploy-vs-validate gap (prototype = llama; numbers = gpt-4o). Strong recommendation, not a blocker for a feasibility framing.

**M-F — Reproducibility claims are accurate.** "released prompt engine, not platform usage logs," the deterministic SHA-keyed cache, the datasheet, and the prepared human-study package all exist as described. The README's three-command reproduction path is real. No overreach in the reproducibility claims.

**M-G — Steering own-effect (+0.50) honesty.** §8(iv) reads the weak +0.50 as a grader-leniency floor + the P2 confound, not spinning it. Correct and conservative. The CI [+0.18,+0.82] barely excludes zero; the paper does not over-read it. The promised harsher-rubric ablation (§8(iv)) is still unrun; fine to leave as future work given the feasibility framing, but if the robustness re-run happens, folding in a stricter steering rubric would address both M3 and M-G at once.

### RECENT-WORK CURRENCY

**R1 — 2024–2026 coverage is strong and correctly used.** The paper cites the right recent anchors: Gerlich 2025 (cognitive offloading), Kosmyna et al. 2025 (cognitive debt), Dell'Acqua et al. 2023 + Randazzo et al. 2025 (skill-conditional AI value), Vaccaro et al. 2024 (human-AI teams underperform), Fernandes et al. 2024 + Nazaretsky et al. 2025 (metacognition/performance decouple; can students judge like experts), Feng et al. 2025 (LLM-judge κ falls to 0.1–0.3), Clerc et al. 2026 (behavioral regulation predicts use), Li et al. 2026 (cognitive-impact review), Gu & Ericson 2025 (integrative AI-literacy review). The novelty positioning (Dakan & Feller 2025 4D Fluency; Tankelevitch et al. 2024; Tour & Zadorozhnyy 2025; Lee et al. 2025 GenAIComp; Jin et al. 2024 GLAT; Sidra & Mason 2025) is current and precise. This is above field norm.

**R2 — Citation-hygiene flag (carried from Round 1, still applies for a journal).** Several references carry future-dated or unusual arXiv IDs that a copyeditor will query: Clerc et al. 2026 (arXiv:2604.01955), Di Santi 2026 (arXiv:2603.18677), Feng et al. 2025 (arXiv:2512.16041), Srinath et al. 2025 (arXiv:2511.05764). The "2604"/"2603"/"2512"/"2511" prefixes encode submission months that postdate or sit at the present (2026-06); verify each ID resolves and matches the cited title/authors, and mark preprint status explicitly for the journal. Recommend running the `bibtest` pass before submission.

**R3 — One possible-missing-citation, low priority.** The grader-validity discussion (§8 Reliability, §10) leans on Feng et al. 2025 for the LLM-judge κ caution. For a methods venue it would strengthen §10 to also nod to the broader LLM-as-judge *bias* battery (position/verbosity/self-preference), which the cross-model design only partially mitigates (it handles self-preference, not verbosity bias on free-text Framing/Steering). A one-line acknowledgment that verbosity bias on free-text grades is unchecked, citing a standard LLM-judge-bias reference, would pre-empt a methods reviewer. Not a must-cite, but it closes a known gap the current text leaves implicit.

---

## 4. Prioritized fix checklist

**Should-fix before acceptance (Minor):**
1. **(S1)** Global em-dash / double-hyphen pass; reconcile the "monitor–control" vs "monitor-control" inconsistency. House-style blocker.
2. **(S2/S3)** Move the precision-not-accuracy label into the abstract; report the blind-graded self-consistency (~87.5%) as the load-bearing figure and caveat the pooled 92% as dominated by Judging's by-construction 0.00; state the reliability cell count (12) in-text.
3. **(H1)** Add one abstract sentence surfacing the released artifact (instrument + harness + data + datasheet + prepared validation protocol).
4. **(H3)** Close the 255-vs-280 call arithmetic with an explicit caching clause.
5. **(M-D)** Add a half-sentence in §8 noting the Judging ground-truth issues and distractors are machine-generated and not yet human-verified (cross-ref §10), so the +2.00 diagonal is explicitly contingent.
6. **(S5)** Replace "near-zero" with "small and non-significant" where ρ=−0.22 is in scope.
7. **(R2)** Verify the four future-dated arXiv IDs resolve; mark preprint status; run `bibtest`.

**Strongly recommended (would move toward Accept):**
8. **(M-E / M3)** Finish the gpt-4o-mini grader-backend robustness run (it stopped at 34/40) and report the second-backend effect matrix; if dissociation survives, fold it into §8(ii) as a strengthening result and close the deploy-vs-validate gap. Optionally pair with the §8(iv) harsher-steering-rubric ablation (M-G).

**Nice-to-have polish:**
9. **(F2/F4)** Trim the duplicated "which operation failed" motif (§1 vs §2) and the App-A/§7 echo.
10. **(F3)** Add the one-line empirical Steering≤Judging ceiling check from the CSV.
11. **(H2)** Consider a title that signals the instrument contribution.
12. **(S4)** Add a reconciling note (README or §7.1) on the gpt-4o-mini/gpt-4o demo vs llama prototype engine.
13. **(R3)** One-line acknowledgment of unchecked verbosity bias on free-text grades.

---

*Overall:* a conceptually genuine, exactly reproducible contribution whose system and instrument are real and whose feasibility claims are correctly and conservatively scoped. Round-1's structural concerns (headline-inflation, platform-overclaim, precision-vs-accuracy conflation) are now fixed in the prose. What remains is a short copyedit-and-disclosure pass (em-dashes, abstract precision label, artifact hook, call arithmetic, machine-ground-truth caveat) plus, if compute allows, completing the already-85%-done grader-backend robustness run. None blocks a feasibility/position framing; all are closable without new conceptual work. Minor Revision, leaning Accept.
