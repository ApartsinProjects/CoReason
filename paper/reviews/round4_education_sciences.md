# Review (Round 4): *Framing, Judging, Steering: An Assessable Competency Model for Teaching Students to Reason With Generative AI*

**Venue:** Top learning-sciences / educational-psychology journal (*Educational Psychology Review*, *Journal of the Learning Sciences*, *BJET*). Reviewed as a **conceptual / position contribution** with a proof-of-concept instrument over simulated learners.

**Reviewer stance:** learning sciences (metacognition, SRL, epistemic cognition, assessment / psychometrics, instructional design).

**Pass type:** fresh line-by-line read of the revised manuscript, cross-checked against my prior review (`journal_education_sciences.md`) and the experiment record (`research/experiments/PROJECT_LOG.md`).

---

## 1. Summary

CoReasoning decomposes "productive work with generative AI" into three temporally and cognitively distinct, independently-assessable skills: **Framing** (pre-generation task specification), **Judging** (post-generation epistemic evaluation), and **Steering** (post-generation iterative correction). The structural wedge is the separation of the *pre-generation* skill (Framing) from the *post-generation* corrective skill (Steering), which prior frameworks fuse into one "prompting/iteration" competency, with Judging as the epistemic gate between them. The decomposition is mapped onto a Nelson–Narens monitor–control architecture (now explicitly framed as an *exo-directed* extension onto a fallible external object level), seeded by a Winne–Hadwin SRL task-definition phase, with Judging anchored in epistemic vigilance / apt epistemic performance and appropriate-reliance theory. Five propositions (P1–P5) are stated, each with a named falsifier and a clear scoping of which the demo tests (P3 directly; P2 partially; P1/P4/P5 deferred). The model is instantiated in CoReasoning Lab and a 16-prompt LLM instrument. A feasibility demonstration over 40 *simulated* learners (8 crossed competence profiles × 5 subjects; learners by gpt-4o-mini, graded by gpt-4o) reports that the per-skill grades dissociate; the paper now leads with the two **blind-graded** skills (Framing +0.60, Steering +0.50, near-zero cross-effects) and the Framing–Judging ρ = 0.00, and explicitly subordinates Judging's +2.00 as a built-in manipulation check. Messick/Kane argument-based validity framing is added; the errors-as-instruction literature (Große & Renkl; Durkin & Rittle-Johnson) is integrated; the interface figures are disclosed as mockups. No learning-outcome claim is made.

**This is a substantially improved manuscript.** Every blocking concern from my prior reviews has been addressed at the level of the central result: the "60:1" headline is gone from the abstract and body; the abstract now leads with the blind-graded effects and the ρ = 0.00 pair, states "simulated learners" up front, and scopes the contribution as "construct separability and automatic measurability of the instrument, not of human learning." The exo-directed extension of Nelson–Narens is now named as an extension rather than asserted as a literal fit. Messick/Kane is in §10. The erroneous-examples literature is in §7.1. The remaining issues are refinements, not structural blockers.

---

## 2. Recommendation

**Minor Revision.**

The conceptual contribution is real, the scoping is now honest, and the prior over-claim is corrected. What remains is a tier of precision-and-currency fixes (the J–S partial-confound concession should be stated where the correlation is first reported, not only in a late caveat; two house-style em-dashes; a handful of residual learner-vs-instrument slippages; one or two recent must-cite works). None requires new data or restructuring. I would move to Accept on a clean pass that addresses the Hook, the J–S framing, and the style/currency items below.

---

## 3. What the revision fixed (verification against prior review)

- **M1 (over-claimed dissociation): RESOLVED.** "Sixty to one" no longer appears anywhere (verified). The abstract (lines 32–34) and §8 (lines 497–500) lead with the blind-graded Framing/Steering own-effects and present Judging's +2.00 as "fixed by construction." The §8 dissociation paragraph explicitly states "we therefore do not lead with it."
- **M3 (learner vs instrument): MOSTLY RESOLVED.** The abstract closes (lines 36–38) with "this is evidence of *construct separability and automatic measurability of the instrument*, not of human learning." Residual slippage remains in two spots (see Focus F2 below).
- **M4 (theory mappings): RESOLVED.** §3.1 (lines 144–150) now names the exo-directed extension as "a deliberate extension … from intrapersonal monitoring to … exo-directed monitoring" and flags the added epistemic-vigilance burden. §7.1 (lines 432–435) adds erroneous-examples / learning-from-errors (Große & Renkl 2007; Durkin & Rittle-Johnson 2012) as the matching paradigm.
- **M5 (J–S confound): PARTIALLY RESOLVED.** §3.3 reconciles P2/P3; §8 caveat (iv) concedes the P2 confound. But the concession is not stated where the +0.17 J–S correlation is first reported (see Theory T1).
- **M6 (validity theory): RESOLVED.** §10 (lines 607–612) frames the agenda as an argument-based validity case (Messick 1995; Kane 2013), correctly mapping present evidence to the scoring/generalization inferences and deferring extrapolation/implication.

---

## 4. Line-by-line issues

### HOOK

**H1 — Title is accurate but flat; consider a sharper diagnostic hook.** (line 1)
> "Framing, Judging, Steering: An Assessable Competency Model for Teaching Students to Reason With Generative AI"

The title names the three skills (good, concrete) but the colon-clause is generic ("An Assessable Competency Model for Teaching Students…"). The paper's true distinctive claim is *diagnostic separability* — knowing *which* of three operations failed. Consider surfacing that: e.g., "Framing, Judging, Steering: A Diagnostic Competency Model for Reasoning With Generative AI." This is optional, but "diagnostic" is the word that differentiates this from every AI-literacy title and matches the strongest argument in §2.

**H2 — Abstract opening: strong, keep it.** (lines 11–12)
> "Generative AI makes it trivial to obtain an answer and difficult to obtain understanding."

This is an excellent first sentence: crisp, accurate, and frames the educational stakes precisely for a learning-sciences audience. No change. The second sentence ("As large language models are absorbed into education, the dominant design objective has been speed-to-answer…") is also well-judged. The hook is correctly calibrated — it does not overclaim.

**H3 — Abstract "decisive evidence" wording is good but lands one clause too strong.** (lines 32–34)
> "The decisive evidence is the two blind-graded skills, Framing and Steering, which show positive own-competence effects (+0.6 and +0.5 grade points) with near-zero cross-effects and near-zero inter-skill correlations…"

"Decisive evidence" is a strong phrase for N=40 simulated transcripts from a single grader family. It is *internally* decisive (it is the strongest evidence in the paper), but a learning-sciences reader will read "decisive" as decisive-for-the-construct-claim. Suggest "the strongest evidence" or "the load-bearing evidence" to avoid the over-reach connotation. This is the one residual whiff of the old 60:1 register.

**H4 — Introduction opening is excellent.** (lines 42–47)
> "Most AI-in-education tools optimize for the wrong variable. They shorten the path from question to answer, when the answer was never the point of education."

Strong, declarative, correctly framed. The topic sentence does real work and the paragraph earns its claim. No change.

---

### FOCUS

**F1 — The through-line is sustained; the diagnostic decomposition is the spine from abstract to conclusion.** §2 (diagnostic failure modes), §3.2 (temporal separation), §6 (Table 1 novelty boundary), §8 (dissociation), §12 (conclusion) all return to the same thesis. This is a focused paper. No drift of consequence.

**F2 — Two residual learner-vs-instrument slips dilute the carefully-scoped claim.** The paper is now disciplined almost everywhere about saying "the instrument's grades dissociate" rather than "the skills dissociate in learners." Two sentences still slip:
- §6, lines 314–315: "Treating them separately is not a cosmetic relabeling: it predicts, and our feasibility demonstration supports, that a learner's Framing and Steering grades can diverge." No *learner* produced those grades — they are simulated personas. Fix: "that the Framing and Steering grades of a simulated learner can diverge," or "that Framing and Steering are separately scorable."
- §8, line 500: "so a learner's three model-assigned grades move independently." Same issue. Fix: "so the three model-assigned grades move independently across the simulated profiles."

These are small but they matter precisely because the rest of the paper is so careful; an adversarial reviewer will quote them as evidence the over-claim leaked back in.

**F3 — §7 (system) vs §7.1 (instrument): the boundary is now clean, good.** The disclosure that Figures A1–A2 are "representative mockups … rather than screenshots of a running deployment" (lines 389–391) is correctly placed and removes a prior integrity risk. The bilingual (English/Hebrew) claim (line 387) is still asserted with no supporting evidence and the challenges are English-only (line 641). Either cut "and bilingual (English and Hebrew)" or flag it as an untested platform capability. Minor, but it is an unsupported empirical-sounding claim in a paper that is otherwise scrupulous.

**F4 — §9 "Tensions" is well-placed and does not dilute.** The four tensions (offloading vs struggle; calibration trap; interactive-not-automatically-productive; standards-can-regress) are genuine boundary conditions, each tied to a proposition. This section strengthens rather than dilutes. Keep.

---

### STYLE

**S1 — HOUSE-STYLE VIOLATION: two em-dashes (U+2014).** House style forbids em-dashes. Two slipped in:
- Line 401: "*Phase 1 — Framing.*"
- Line 405: "*Phase 2 — Judge/Steer cycles.*"

Fix: replace with a colon or restructure, e.g. "*Phase 1, Framing.*" / "*Phase 1: Framing.*". (Note: the many en-dashes "–" used in "Judge–Steer", "monitor–control", and page ranges are U+2013, not em-dashes, and are acceptable; only the two U+2014 above violate the rule. Verified: no double-hyphens "--" in prose.)

**S2 — Run-on / overloaded sentence in §8 design paragraph.** (lines 477–481)
> "for 40 simulated learners and 255 blind grading calls (each learner is scored by up to seven grader calls, three skill evaluators plus a grading pass each and one steering-update call, with identical inputs cached across profiles)."

The parenthetical packs the 7-call decomposition, caching, and the 255 total into one breathless clause; "three skill evaluators plus a grading pass each and one steering-update call" is hard to parse (is it 3+3+1=7?). Break into two sentences and make the arithmetic explicit: "Each learner is scored by up to seven grader calls: three skill evaluators, a grading pass for each, and one steering-update call. Identical inputs are cached across profiles, giving 255 distinct blind grading calls in total."

**S3 — "near-100%" strawman was flagged before and appears to be removed — good.** The §8 PCA sentence now reads (lines 520–523) "The first principal component accounts for 42% of the variance, but with only three indicators a formal factor model is under-identified, so we report this descriptively…". This is the correctly hedged version; the prior strawman ("far below the near-100% a single account would predict") is gone. No further change needed.

**S4 — Topic sentences are strong throughout.** Each section opens with a clear claim sentence (e.g., §3.1 "The three skills are not an arbitrary list; they instantiate a well-understood cognitive architecture."; §6 "The constructs that compose CoReasoning are not individually new; what is new is their separation…"). Transitions between sections are smooth. Hedging is now well-calibrated. No systemic prose problems.

**S5 — Minor: "the 2024 essay-writing literature" is an informal in-text reference.** (line 53)
> "Controlled studies of AI-assisted writing report "metacognitive laziness," in which learners bypass the self-regulatory processes of diagnosing, evaluating, and revising (the 2024 essay-writing literature)…"

"(the 2024 essay-writing literature)" is a non-citation; for an education journal this needs an actual reference. The "metacognitive laziness" construct is from Fan et al. (2025, *BJET*, "Beware of metacognitive laziness") — cite it directly. As written it reads as a placeholder and a copy-editor will flag it.

**S6 — Minor: passive/abstract nominalization is occasionally dense but acceptable.** E.g., §3.1 line 147–150 ("The extension is non-trivial because exo-directed monitoring adds an epistemic-vigilance burden absent from self-monitoring…") is a long sentence but it is correct and readable. No action required; flagging only that the §3.1 register is the densest in the paper and a single split there would help the median reader.

---

### THEORY & RIGOR

**T1 — The J–S partial-confound concession should appear where the correlation is first reported, not only in §8 caveat (iv).** (lines 513–518 vs 566–571)

§8 reports "Judging–Steering ρ = +0.17" (line 514) and immediately notes it is the pair *not* led with because P2 predicts a ceiling relation (lines 517–518). Good. But the deeper point my prior review raised — that because P2 makes Steering quality *partly a function of* Judging quality, the Steering indicator is *contaminated by design*, so its low observed J–S correlation is weak evidence of separability — is only stated in caveat (iv) (lines 566–571) and there framed as a grader-leniency-plus-P2 issue. The logical consequence (J–S is the *weakest* of the three dissociation pairs, and F–J ρ = 0.00 is the *strongest* because there is no gating relation between a pre- and a post-generation skill) is implied but never stated cleanly. Add one sentence at lines 517–518: "Because P2 makes Steering quality partly a function of Judging quality by construction, the Judging–Steering pair is the *least* informative test of separability; the Framing–Judging pair, which has no gating relation, is the cleanest." This is the single most valuable remaining theory clarification.

**T2 — The exo-directed reading is now sound, but one phrase still over-claims fit.** (lines 144–147)
> "In CoReasoning, the learner's meta level supervises an object level that is *external*, the AI's generative process, rather than the learner's own cognition. This is a deliberate extension…"

This is correctly framed as an extension. Good. One residual: the claim that "the same metacognitive machinery is turned outward onto a fallible cognitive artifact" (line 147) asserts identity of machinery ("the same"). Whether monitoring an external agent recruits the *same* cognitive machinery as monitoring one's own memory is an open empirical question (the distributed/socially-shared metacognition literature, e.g., Hadwin/Järvelä on socially shared regulation, treats other-directed regulation as related-but-distinct). Soften "the same metacognitive machinery" to "metacognitive machinery of the same monitor–control form," or cite the socially-shared-regulation literature as the bridge. This keeps the (good) extension honest about whether it is identity or analogy.

**T3 — P2/P3 reconciliation in §3.3 is logically sound.** (lines 198–204) The "ceiling relation induces correlation without identity" argument is correct and well-stated, and the manuscript now correctly tests dissociation pairwise rather than via a global factor. This addresses the prior M5 logic concern at the argument level. The only gap is propagating it to §8 (see T1).

**T4 — Messick/Kane mapping is correctly stated.** (lines 607–612) "the present evidence supports the *scoring* and *generalization* inferences … while the *extrapolation* inference … and the *implication* inference … remain to be established." This is a correct use of Kane's inference chain. One precision note: the present evidence supports the *scoring* inference (consistent scoring) and arguably the *internal/structural* aspect of construct validity; "generalization" in Kane's sense (across tasks, occasions, raters) is only weakly supported here (single grader family, 5 subjects, simulated personas). Consider tempering "supports the scoring and generalization inferences" to "supports the scoring inference and bears on generalization (across the five subjects), while a full generalization case across raters and backends, and the extrapolation and implication inferences, remain for the studies below." Otherwise a psychometrically-literate reviewer will note that single-rater-family evidence is thin for a generalization claim.

**T5 — Propositions are correctly scoped.** (lines 273–280) The explicit statement that the demo "directly supports P3 … and bears partly on P2 … P1, P4, and P5 are stated here as falsifiable hypotheses" is exactly the right calibration, and each falsifier is concrete. No overreach. This is a model of how to scope a conceptual paper's empirical reach.

**T6 — Discrimination claim wording.** (lines 485–489) "the all-weak profile averages C on every skill, the all-strong profile averages between B and A" — correct and modest. The judging-signal description ("a strong judge flags all four seeded issues with no false alarms and is graded A") correctly foregrounds that Judging's behavior is mechanistic. Consistent with the PROJECT_LOG (C4: "+2.00 own / 0.00 cross — but note judging selection is PROGRAMMATIC"). Honest. No change.

**T7 — Numbers cross-checked against the experiment record.** Diagonal +1.03 / off-diagonal −0.017; Framing +0.60 [+0.38,+0.81], Steering +0.50 [+0.18,+0.82], Judging +2.00 (deterministic); F–J ρ=0.00, F–S=−0.22, J–S=+0.17 (all p>0.17); first PC 42%; 92% self-consistent (flip-rate 0.08). All match PROJECT_LOG C5/C6. Table 2 (lines 504–508) is internally consistent with the prose. No discrepancies found. One residual reporting-precision point carried from the prior review: ρ values to two decimals on N=40, 3-level grades imply more precision than the data support; "Framing–Judging ρ = 0.00" reads as a suspiciously exact null. Consider "indistinguishable from zero (ρ = 0.00, p > 0.9)" or report with a CI. Minor.

**T8 — Reliability vs validity distinction is now clean.** (lines 553–555) "this addresses the documented self-inconsistency of LLM judges, though it measures *precision* (repeatability), not *accuracy* against humans." Correct separation of reliability from validity, addressing prior M6. Good.

---

### RECENT-WORK CURRENCY

**R1 — The 2024–2026 coverage is strong and largely correctly used.** The paper cites the right recent neighbors: Tankelevitch et al. (2024, CHI), Dakan & Feller (2025), Tour & Zadorozhnyy (2025), Gu & Ericson (2025, ICER), Fernandes et al. (2024), Nazaretsky et al. (2025), Lee et al. (2025, GenAIComp), Jin et al. (2024, GLAT), Sidra & Mason (2025), Feng et al. (2025), Clerc et al. (2026), Li et al. (2026). This is current and venue-appropriate. The novelty positioning in §6 confronts the nearest priors directly and fairly.

**R2 — MISSING must-cite: Fan, Tang, Le & Gašević (2025), "Beware of metacognitive laziness," *BJET*.** The phrase "metacognitive laziness" (line 51) is *their* coinage and is currently attributed to "(the 2024 essay-writing literature)" — an informal non-citation (see S5). For a BJET/EPR/JLS audience this is a near-mandatory citation: it is the canonical recent empirical study of SRL bypass under AI-assisted writing, and it is the direct evidence behind the paper's own framing. Add it and cite at line 51–53.

**R3 — Consider citing the AERA/APA/NCME *Standards for Educational and Psychological Testing* (2014) alongside Messick/Kane.** §10's argument-based validity framing is correct, but for a top education-sciences venue the *Standards* are the field-canonical reference for validity-as-argument and reliability-vs-validity. A one-line citation in §10 would strengthen the validity framing and is what reviewers at this tier expect. Optional but recommended.

**R4 — Preprint vs peer-reviewed flagging (carried from prior review, partially relevant).** Several load-bearing recent sources are arXiv preprints: Clerc et al. (2026, the *only* human-learner evidence, line 532–536), Fernandes et al. (2024), Feng et al. (2025), Srinath et al. (2025), Di Santi (2026), Kosmyna et al. (2025), Jin et al. (2024). Clerc et al. in particular carries real argumentative weight as the sole human-subjects anchor (lines 532–536). For an education-sciences journal, either (a) note in-text that this is a preprint result, or (b) confirm its publication status before submission. The claim built on it ("behavioral regulation of LLM use predicts effective use, whereas self-rated AI expertise does not") is exactly the kind of human-learner result a reviewer will want to confirm is peer-reviewed. Not blocking, but flag the status.

**R5 — Citation use is otherwise accurate.** Spot-checked: Nelson & Narens (monitor/control), Winne & Hadwin (COPES task definition), Sperber et al. (epistemic vigilance), Lee & See (reliance calibration), Chi & Wylie (ICAP Interactive), Große & Renkl + Durkin & Rittle-Johnson (erroneous examples), Acar (problem formulation), Runco & Chand (problem finding separable from problem solving). All are used in a way faithful to the source. The erroneous-examples integration (§7.1) correctly characterizes that paradigm as learning from studying/correcting flawed solutions, which is the right kin for the "deliberately imperfect output" design and resolves the prior M4(b) concern.

---

## 5. Prioritized fix checklist

1. **(Style, must-fix) Remove the two em-dashes** at lines 401 and 405 (house style). Replace with colons.
2. **(Theory, high-value) Propagate the J–S confound to §8** (T1): add one sentence at lines 517–518 stating that P2 makes J–S the *least* informative separability pair and F–J (no gating relation) the cleanest. This is the most valuable single edit.
3. **(Focus, must-fix) Fix the two learner-vs-instrument slips** (F2): §6 line 314–315 and §8 line 500 — reword "a learner's grades" to "a simulated learner's grades" / "the model-assigned grades."
4. **(Currency, must-fix) Cite Fan et al. (2025, BJET) for "metacognitive laziness"** (R2/S5); replace the informal "(the 2024 essay-writing literature)" non-citation at line 51–53.
5. **(Hook, recommended) Soften "decisive evidence" to "the strongest/load-bearing evidence"** in the abstract (H3, line 32).
6. **(Style, recommended) Split the §8 design-paragraph run-on** and make the 7-call arithmetic explicit (S2, lines 477–481).
7. **(Theory, recommended) Soften "the same metacognitive machinery"** to "the same monitor–control form" and/or cite socially-shared-regulation work (T2, line 147).
8. **(Theory, recommended) Temper the Kane "generalization inference"** claim for single-grader-family evidence (T4, lines 607–612).
9. **(Focus, recommended) Cut or flag the unsupported "bilingual (English and Hebrew)"** platform claim (F3, line 387).
10. **(Currency, optional) Add AERA/APA/NCME Standards (2014)** to the §10 validity framing (R3); flag Clerc et al. and other preprints' status (R4).
11. **(Rigor, optional) Report ρ values with CIs or as "indistinguishable from zero"** rather than bare two-decimal exact nulls (T7).

---

## 6. Closing assessment

This revision lands the plane on every blocking concern from the prior rounds. The over-claimed "60:1" dissociation headline is gone; the abstract now leads with the honest blind-graded effects and the clean Framing–Judging ρ = 0.00, states "simulated learners" up front, and scopes the contribution as instrument separability rather than learner cognition. The exo-directed extension of Nelson–Narens is named as an extension; Messick/Kane validity framing is in place; the erroneous-examples literature is correctly integrated; the figures are disclosed as mockups. The conceptual contribution — the pre-/post-generation separation of Framing from Steering as a *diagnostic* decomposition, with a principled monitor–control grounding and falsifiable propositions — is genuine, well-scholared, and would survive even without the demo. What remains is a thin layer of precision work: two em-dashes, two learner-vs-instrument slips, the J–S-confound concession migrated to where the correlation is reported, one missing must-cite, and a few hedge-softenings. These are copy-edit-to-light-revision in scope. **Minor Revision**, on track to Accept.

---

### Executive summary (for the editor)

**Recommendation: Minor Revision** (conceptual / position paper for an education-sciences venue; on track to Accept).

Top 5 fixes:
1. Remove two house-style em-dashes (lines 401, 405).
2. Migrate the Judging–Steering partial-confound concession into §8 where ρ=+0.17 is reported, and state that Framing–Judging (ρ=0.00, no gating relation) is the *cleanest* dissociation pair while J–S is the *least* informative (lines 517–518).
3. Fix two residual learner-vs-instrument slips that re-leak the old over-claim ("a learner's grades" → "a simulated learner's / the model-assigned grades"; §6 line 314, §8 line 500).
4. Replace the informal "(the 2024 essay-writing literature)" with a real citation (Fan et al. 2025, *BJET*, "Beware of metacognitive laziness"), the source of the very phrase used (line 51).
5. Soften "decisive evidence" → "the strongest/load-bearing evidence" in the abstract (line 32), and temper the Kane "generalization inference" claim for single-grader-family evidence (§10).
