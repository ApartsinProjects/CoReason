# Peer Review — Round 1

**Manuscript:** *Framing, Judging, Steering: An Assessable Competency Model for Reasoning With Generative AI* (CoReasoning)
**Venue:** *Computers & Education: Artificial Intelligence* (Position Paper) / AIED Blue Sky / IJAIED
**Reviewer role:** Senior reviewer, conceptual/position paper with proof-of-concept feasibility demo
**Date:** 2026-06-01

---

## 1. Summary

The paper proposes **CoReasoning**, a competency model that factors productive generative-AI use into three skills the authors claim are temporally, cognitively, and assessably distinct: **Framing** (pre-generation task specification), **Judging** (post-generation evaluation of output), and **Steering** (post-generation iterative correction). The central structural claim is that prior frameworks fuse pre-generation specification and post-generation correction under a single "prompting" construct, whereas CoReasoning separates them, anchors all three in a Nelson–Narens monitor–control architecture seeded by an SRL task-definition phase, advances five testable propositions (P1–P5), and reports a proof-of-concept LLM-based instrument with a single small feasibility result (a simulated expert scored B/A/B and a careless persona C/C/C on 1 challenge).

## 2. Overall assessment and recommendation

**Recommendation: Major Revision.**

The paper is addressing a real and timely gap, the prose is unusually clean and disciplined, the theoretical scaffolding is genuine (not decorative), and the honesty about scope (no learning-outcome claims; simulated learners; human study "prepared, not run") is exactly what a position-paper-with-demo should display. This is a credible foundation for a selective EdTech-AI venue.

However, in its current state it is **not acceptable**, for three reasons that are individually serious and jointly decisive:

1. **The feasibility demonstration is presented as the paper's central empirical defense (the dissociation claim, P3), but the demo as run does not yet contain a single dissociation observation.** Sections 8's dissociation and reliability paragraphs are literally bracketed placeholders ("Numbers forthcoming from the scaled run"). The one real result, a 2-persona × 1-challenge discrimination, is *consistent* with a single underlying competence factor and therefore cannot, even in principle, support separability. The paper's headline novelty rests on evidence that does not yet exist in the manuscript.
2. **The novelty boundary against Tankelevitch et al. (2024) and Dakan & Feller (2025) is asserted more than demonstrated.** The "assessable vs. demands-analysis" distinction is the right line to draw, but the paper leans on the feasibility demo to do the differentiating work, and that demo is currently empty (point 1). Remove the demo and the contribution reduces to a re-partition of constructs that Tankelevitch already enumerates (prompting / output evaluation / workflow iteration as monitoring+control sites).
3. **The Judging/Steering boundary, which the whole framework's diagnostic value depends on, is under-specified at exactly the place where the constructs are most likely to collapse empirically.**

These are fixable. None requires abandoning the thesis. But they require (a) actually running the scaled dissociation experiment the paper already promises, (b) tightening the construct definitions, and (c) rewriting the novelty section so it survives the deletion of the demo. Hence Major, not Minor, and not Reject.

## 3. Strengths

- **A real diagnostic gap, crisply stated.** The Section 2 argument that a single "prompting" score conflates three distinct failure modes (mis-specified task / undetected flaw / vague correction) with three distinct remedies is the paper's strongest and most original move. This is the genuine contribution and it is well argued.
- **Principled architecture, not an ad-hoc list.** Grounding Judging=monitoring / Steering=control in Nelson & Narens (1990) and Framing in Winne & Hadwin's (1998) COPES task-definition phase gives the decomposition a non-arbitrary spine. The "Standards" link (Framing sets the referent the monitor compares against) is elegant and does real work in motivating the ordering propositions.
- **The propositions are framed as a framework, not a taxonomy**, which is the correct response to the Gilson & Goldberg (2015) bar the authors themselves invoke. P1 and P2 in particular state directional, falsifiable relations among constructs.
- **Exemplary scope honesty.** The repeated, explicit disavowal of learning-outcome claims, the labeling of simulated learners as apparatus, and the framing of the human-rater study as prepared-but-unrun are precisely calibrated. This will earn reviewer trust at a serious venue.
- **The tensions section (9) is intellectually honest** and confronts the offloading/productive-struggle and standards-regress problems head-on rather than burying them.
- **Concrete, runnable validation agenda (Section 10)** with named statistics (Cohen's/Fleiss' κ, ordinal Krippendorff's α) and a realistic agreement bar.

## 4. Major concerns

### MC-1. The feasibility demonstration does not yet support the dissociation claim (P3), and P3 is load-bearing.

**Problem.** The paper repeatedly designates dissociation as "the central empirically-testable claim and the primary defense against the charge that the decomposition merely relabels 'prompting'" (P3; echoed in §6 and §8). Yet the only result actually in the manuscript is the discrimination gate: expert = B/A/B, careless = C/C/C on a single challenge (§8 "Discrimination"). The dissociation and reliability paragraphs are placeholders: *"Numbers forthcoming from the scaled run."* The PROJECT_LOG confirms (C2, C3) that only the 1-challenge, 2-persona gate has been run; E1 (the construct-validity / dissociation experiment) is scoped but not executed.

This is not merely "incomplete." The discrimination result, expert high on all three, careless low on all three, is the data pattern you would expect under a **single** competence factor. A monotone-in-competence gradient on every skill is fully consistent with the null hypothesis P3 is meant to defeat (one "general AI-use ability"). The one result the paper has *weakly argues against its own central proposition.* To support dissociation you need at least one persona that is **high on skill X and low on skill Y**, and ideally a population-level inter-skill correlation matrix showing off-diagonal correlations well below the reliability ceiling.

**Why it matters.** Without a genuine dissociation observation, the paper's primary defense against "this is just a relabeling of prompting" is an unkept promise. A skeptical reader can accept every theoretical argument and still conclude the three skills are facets of one ability. For a selective venue, a position paper that stakes its novelty on a demo whose key panel is `[Numbers forthcoming]` cannot be accepted.

**Concrete fix.**
- Run the scaled experiment the paper already promises: ≥4 competence personas × ≥15–20 challenges, cross-model (gpt-4o-mini learners, llama-3.3-70b grader, per current design). Report the **3×3 inter-skill grade correlation matrix with bootstrap 95% CIs**, and a dimensionality check (the paper says "factor analysis"; with 3 indicators an EFA is under-identified, so instead report parallel analysis or simply the correlation matrix + a reliability ceiling, and state explicitly that 3 grades cannot yield a stable factor model).
- **Engineer at least one designed dissociation persona**: e.g., a "strong-framer / weak-judge" learner who specifies tasks well but lacks the domain knowledge to detect seeded issues, and a "fluent-but-misdirected steerer" who issues energetic but off-target corrections. A worked transcript of such a learner scoring, say, Framing A / Judging C / Steering C is worth more than any correlation table for convincing readers the constructs separate. This also directly instantiates P1/P2's error modes.
- Add the promised **Table X** (four levels × three skills, grades monotone per skill) with the actual numbers, not a forward reference.

### MC-2. The novelty defense vs. Tankelevitch (2024), 4D Fluency (2025), and prompt-literacy is asserted, not yet demonstrated.

**Problem.** The cleanest differentiator the paper offers, "their contribution is a demands analysis … whereas ours is an assessable competency model with explicit rubrics, propositions, and feasibility evidence that the components dissociate" (§6) — depends on two things the manuscript does not yet deliver: (a) the dissociation evidence (see MC-1), and (b) the rubrics themselves, which are described in prose (§7) but never shown. Strip those away and CoReasoning's partition is close to Tankelevitch's own enumeration of *prompting, output evaluation, and workflow iteration* as sites of metacognitive monitoring/control. Tankelevitch already locates these on the monitor–control architecture; the paper's "we share the metacognitive foundation but differ in goal" concedes the overlap is large.

Similarly, the wedge against 4D Fluency, "Description bundles specification + iteration; we split the time axis", is a genuine and defensible distinction, but the paper never shows that the split *buys* anything an instructor could not get from 4D plus a note. The payoff of the temporal split must be cashed out as a measurable consequence (divergent Framing vs. Steering grades), which again routes back to MC-1.

**Why it matters.** "Highest novelty risk" is the correct self-diagnosis. At this venue, a position paper lives or dies on whether the nearest neighbor (Tankelevitch) is convincingly distinguished. Currently the distinction is logically stated but empirically and instrumentally unsupported within the manuscript.

**Concrete fix.**
- Make the novelty *consequential*, not just *definitional*. State a prediction that CoReasoning makes and Tankelevitch/4D do not, and then satisfy it: e.g., "because Framing and Steering are distinct skills, a learner's Framing and Steering grades will be only weakly correlated (r < ceiling), whereas a 'prompting'-as-one-skill model predicts they co-vary." Then report that correlation (MC-1). This converts the boundary from a claim into a result.
- **Show the rubrics.** Include at least one full per-skill rubric (Framing, Judging, Steering) with its 3–5 criteria and excellent/poor anchors as an appendix or figure. The rubrics are the concrete artifact that distinguishes "assessable competency model" from "demands analysis"; hiding them undercuts the central novelty claim.
- Add a **direct mapping table**: each Tankelevitch demand → which CoReasoning skill(s), and each 4D dimension → which CoReasoning skill(s), with the cells where CoReasoning splits a single prior construct visibly highlighted. The §6 prose gestures at this; a table makes the boundary auditable.
- Engage Tankelevitch more deeply than one paragraph. They also discuss *metacognitive sensitivity* and *confidence*, which bear directly on the paper's Judging-as-calibration argument (§4, Lee & See). Right now the closest neighbor gets the thinnest treatment.

### MC-3. The Judging vs. Steering boundary is the framework's most vulnerable seam and is under-defined.

**Problem.** The paper's diagnostic value rests entirely on the three skills being separable in practice, yet Judging and Steering are operationally entangled. Judging is defined as detecting "errors, gaps, unstated assumptions, and risks" (§1); Steering is "targeted corrective feedback that moves the output measurably closer to an adequate solution" (§1). But a good corrective command *names the flaw it corrects* — i.e., it embeds a judgment. Conversely, the scoring design (§7) evaluates Judging "against the seeded ground-truth issues" (recall/precision) and Steering "against the trajectory of the output across cycles." A learner who detects an issue but corrects it vaguely, and a learner who never articulates the issue but issues a lucky corrective that happens to fix it, will be scored very differently, yet the construct definitions do not tell us which behaviors belong to which skill at the boundary.

P2 ("Judging gates Steering") actually *predicts* a strong positive correlation between Judging and Steering. That is in direct tension with P3 (dissociation) for this particular pair. The paper needs to reconcile: if Judging upper-bounds Steering (P2), then Judging and Steering should be *correlated*, and the dissociation evidence for the J/S pair will be the hardest to obtain. The framework owes the reader a precise statement of what residual variance in Steering is *not* explained by Judging (presumably: the quality of corrective *communication* given a correct diagnosis), and the rubric must isolate exactly that.

**Why it matters.** If Judging and Steering cannot be measured apart in practice, the three-skill model collapses to a two-skill model (Framing + a fused Judge-Steer), which is much closer to prior work and weakens the novelty claim. This is the single most likely empirical failure mode and the paper does not pre-empt it.

**Concrete fix.**
- Add an explicit **boundary definition**: Judging = the diagnosis (what is wrong and how much it matters); Steering = the corrective act *conditional on* a diagnosis (does the command, regardless of whether the learner verbalized the flaw, move the artifact toward correctness, and is it targeted vs. a re-roll). State that Steering's assessable residual is *communicative/strategic quality given detection*.
- Reconcile P2 and P3 in the text: predict that Framing⊥Judging and Framing⊥Steering are the clean dissociations, while Judging→Steering is a *bounded* (gated) relation, so the dissociation evidence should be reported **pairwise**, not as a single "they don't collapse to one factor" claim.
- The dissociation experiment (MC-1) should specifically include the J/S decoupling case: a persona with strong Judging (flags all issues) but weak Steering (vague corrections) to show the pair separates.

### MC-4. The propositions vary in testability; two are near-tautological as stated, and one is currently untestable by design.

**Problem.**
- **P1** ("framing failures are not recoverable by downstream steering") and **P2** ("undetected flaws cannot be corrected") risk being *analytic* rather than *empirical*: if the instrument *defines* Steering quality relative to a referent set by Framing, and *defines* corrected-issues relative to detected-issues, then P1/P2 may be true by construction of the measurement rather than as facts about learners. The paper must show these are contingent claims that could be observed false.
- **P5** ("inverse of offloading") is explicitly outside the demo's reach (the paper concedes only an efficacy study with real learners can test it, §10). Listing it as a "testable proposition" of *this* paper overstates; it is a hypothesis the framework licenses, not one the paper engages.
- **P4** (asymmetric transfer; Judging transfers less than Framing) requires cross-domain data the demo does not have and the paper does not commit to producing.

**Why it matters.** Gilson & Goldberg ask for new, testable relationships among constructs. Propositions that are true-by-measurement-construction or untestable-in-principle-here dilute that contribution and invite the charge that the "framework" is a taxonomy with predictions bolted on.

**Concrete fix.**
- For P1/P2, state the **operationalization that makes them falsifiable**: e.g., P1 is falsified if learners with low Framing grades nonetheless reach high final-artifact quality through steering alone; provide the measurement (final-artifact quality scored independently of Framing) that could show this. Show that the instrument does *not* tautologically guarantee P1.
- Demote P5 (and arguably P4) to "framework-licensed hypotheses for the efficacy agenda" and keep P1–P3 as the propositions this paper's demo speaks to. Be explicit about which propositions the feasibility demo touches (P3, partially P1/P2) and which it cannot (P4, P5).
- Add at least one **quantitative or directional** sharpening to each retained proposition (e.g., P2: "Steering grade ≤ Judging grade within-learner in ≥X% of cases").

### MC-5. The calibration-trap and standards-regress tensions are acknowledged but not resolved into the framework's claims.

**Problem.** Section 9 honestly raises the calibration trap (Judging bounded by domain knowledge) and standards-regress (when the AI out-performs the learner, the learner's standards are inferior to the artifact). But these are conceded as boundary conditions without being integrated into the propositions or the instrument. In particular, standards-regress is corrosive to the *measurement*: the instrument scores Judging against seeded ground-truth issues, which presumes the rubric-writer (here, an LLM) holds correct standards. If the same calibration trap that limits learners also limits the *grader*, the instrument's Judging signal is bounded by the grader's domain competence, an internal-validity threat the paper does not name.

**Why it matters.** The grader is itself an AI subject to the very over-reliance and miscalibration the framework studies. A reviewer will immediately ask: who judges the judge? The paper's appeal to epistemic vigilance (§4) applies recursively to its own instrument and is unaddressed.

**Concrete fix.**
- Add a paragraph on **grader calibration as an internal-validity threat**: because Judging is scored against seeded issues whose severity is LLM-assigned, the instrument's Judging ceiling is the grader's own domain competence. Mitigate by (a) human-verified seeded issues in a subset, (b) the planned human-rater agreement study reported per-skill (Judging agreement will be the most diagnostic).
- Connect standards-regress to a **scope statement**: the framework is calibrated for the regime where the learner's standards meet or exceed the artifact's domain difficulty; flag the expert-frontier regime as out of scope and note it bounds P4.

### MC-6. Missing related work and unsupported empirical citations.

**Problem.** Several relevant bodies of work are absent or thin:
- **AI-literacy *assessment* instruments specifically** (not just frameworks): the paper critiques "current AI-literacy assessment" (§2) but cites mainly *frameworks* (Long & Magerko; UNESCO). It should engage actual validated AI-literacy *scales/instruments* (e.g., the recent MAILS / AI-literacy scale literature) to substantiate the claim that existing *assessment* conflates the three failures.
- **Self-regulated-learning-with-AI** is a fast-moving 2024–2025 area directly adjacent to the Framing/Steering loop and is uncited beyond the foundational SRL theory.
- **LLM-as-judge reliability** is invoked ("documented self-inconsistency of LLM judges," §8) without a single citation; this is a large, citable literature and the reliability claim needs grounding.
- The "2024 essay-writing literature" on metacognitive laziness (§1) is referred to but **not cited** — a vague gesture where a specific reference is needed.

**Why it matters.** §2's gap claim ("assessment can tell us *that* not *why*") is the paper's motivating premise; it must be substantiated against the actual assessment instruments, not only against conceptual frameworks. Otherwise the gap may be a strawman.

**Concrete fix.** Add the AI-literacy *instrument/scale* literature and at least one SRL-with-GenAI 2024–25 reference; cite specific LLM-as-judge reliability work where §8 invokes it; replace "the 2024 essay-writing literature" and "the 2024 essay-writing literature" gestures with named citations.

## 5. Minor issues

- **Bibliography is incomplete and will fail a reference check.** `Randazzo et al., 2025` is cited twice in the manuscript (§1 line 44, §6 line 246) but has **no entry** in `references.bib`. `Paul-Elder` (§4) is cited with no `.bib` entry. The FRAMEWORK_DESIGN working set lists `Pea 1993`, `Risko & Gilbert 2016`, `Black & Wiliam 1998`, `Chee et al. 2025`, and `Salomon et al. 1991` as intended anchors; of these only Salomon is in the `.bib`, and Salomon/Pea/Risko/Black-Wiliam are *not cited in the manuscript body at all* (orphan entries or missing as needed). Run a citation/key audit (e.g., the `bibtest` tooling) before resubmission.
- **`kosmyna2025brain` uses `author = {Kosmyna, Nataliya and others}`.** The `and others` placeholder will render as "et al." but signals an unverified author list; complete the author list. Verify the arXiv ID (2506.08872) resolves; "Your Brain on ChatGPT" needs a verified canonical reference.
- **No figures or tables at all.** A conceptual framework paper of this ambition needs, at minimum: (1) a **framework diagram** (timeline: Framing pre-generation → [generate] → Judge↔Steer loop, with monitor/control arrows and the COPES "Standards" referent); (2) the **anchor map** (currently only in FRAMEWORK_DESIGN.md) as a table in the paper; (3) the **novelty-boundary table** (currently only in FRAMEWORK_DESIGN.md); (4) **Table X** (discrimination); (5) the **inter-skill correlation matrix**. Migrate the two tables from the design doc into the manuscript.
- **Forward references to nonexistent content.** §8 cites "Table X" and "[Numbers forthcoming]" three times. These bracketed placeholders must be resolved before the paper is reviewable as a finished artifact, not left in the submitted version.
- **"sixteen prompts" (§7) vs. "8-call per-learner chain" (PROJECT_LOG C2).** The manuscript says the instrument has sixteen prompts; the log describes an 8-call chain. Reconcile and state the exact instrument architecture (how many prompts, which run per skill) precisely, ideally with a pipeline figure.
- **Single grader model is a stated limitation but the demo also uses a single *learner* model** (gpt-4o-mini). §11 mentions only the single grader family (llama-3.3-70b); it should also disclose that all simulated learners come from one model, which bounds the diversity/realism of the "population."
- **The abstract claims the demo shows "that the three skills dissociate"** (line 23–24) and "showing … that they dissociate" (contribution 5, lines 81–83). Given §8 contains no dissociation numbers yet, this is currently **an overclaim in the abstract.** Soften to "a feasibility demonstration that the skills can be scored automatically and discriminate competence, with a dissociation study specified" until MC-1 is satisfied.
- **Gilson & Goldberg (2015) is cited in the design doc as the bar but not invoked in the manuscript itself.** Bring the conceptual-paper-methodology framing (Gilson & Goldberg; Jaakkola 2020) explicitly into the paper so reviewers see the authors are meeting a known standard for conceptual contributions.
- **Style/precision:** §4 "the Paul-Elder intellectual standards" should carry a citation. §1 "(the 2024 essay-writing literature)" is informal for a manuscript. "[Compiled in references.bib]" (line 391) must become a real reference list.

## 6. Required experiments / artifacts (prioritized)

1. **(Blocking) Scaled dissociation run** — ≥4 personas × ≥15–20 challenges, cross-model (gpt-4o-mini learners / llama-3.3-70b grader). Deliver the **3×3 inter-skill grade correlation matrix with bootstrap 95% CIs** and a dimensionality statement. This is the minimum bar to support P3 and the novelty claim. (Addresses MC-1, MC-2.)
2. **(Blocking) A designed single/double-dissociation worked example** — at least one persona scoring high-on-one / low-on-another (strong-frame/weak-judge; strong-judge/weak-steer), with the actual transcript and per-criterion grader notes shown. One vivid dissociation is more persuasive than the correlation table. (MC-1, MC-3.)
3. **(High) Table X — full discrimination matrix** — 4 competence levels × 3 skills, grades monotone per skill, with the recall/precision detail for Judging across levels. Replace the forward reference with data. (MC-1.)
4. **(High) Reliability run** — re-grade fixed transcripts N times at production temperature; report per-skill grade-flip rate and per-criterion variance. Resolve the §8 reliability placeholder. (MC-1.)
5. **(High) Publish the rubrics** — at least one full per-skill rubric (criteria + excellent/poor anchors) as an appendix/figure; this is the artifact that substantiates "assessable competency model." (MC-2.)
6. **(High) Framework diagram + migrate the two tables** (anchor map; novelty boundary) from FRAMEWORK_DESIGN.md into the manuscript. (Minor issues; MC-2.)
7. **(Medium) Grader-calibration / internal-validity subsection** — human-verify seeded issues on a subset; report Judging agreement as the most diagnostic per-skill κ when the human study runs. (MC-5.)
8. **(Medium, can remain "prepared")** the human-rater instrument-validity study (codebook, blinded task files, scoring scripts already prepared per §10/PROJECT_LOG). For *this* submission, running even a small (n=2 raters, ~30 transcripts) pilot of Judging-agreement would materially strengthen the paper; full study can remain future work.

## 7. Actionable revision checklist (prioritized)

**Tier 1 — required for the paper to be reviewable/acceptable:**
- [ ] Run the scaled dissociation experiment; replace every `[Numbers forthcoming]` and `Table X` placeholder in §8 with real results + CIs. (MC-1)
- [ ] Add at least one designed dissociation persona with a shown transcript demonstrating high-on-one/low-on-another. (MC-1, MC-3)
- [ ] Soften the abstract and contribution 5 so they do not claim demonstrated dissociation until §8 contains it. (Minor / MC-1)
- [ ] Rewrite §6 so the novelty survives deletion of the demo: add the Tankelevitch→skill and 4D→skill mapping table, and state a *consequential* prediction CoReasoning makes that the neighbors do not. (MC-2)
- [ ] Add explicit Judging vs. Steering boundary definition; reconcile P2 (gating ⇒ correlation) with P3 (dissociation) by reporting dissociations **pairwise**. (MC-3)

**Tier 2 — substantive quality:**
- [ ] Re-classify the propositions: keep P1–P3 as demo-relevant (and make P1/P2 demonstrably non-tautological by specifying an independent final-artifact-quality measure); demote P4/P5 to "framework-licensed hypotheses for the efficacy agenda." (MC-4)
- [ ] Add the grader-as-fallible-judge internal-validity paragraph; tie standards-regress to an explicit scope statement. (MC-5)
- [ ] Add AI-literacy *assessment-instrument* literature, SRL-with-GenAI (2024–25), and specific LLM-as-judge reliability citations; replace the "2024 essay-writing literature" gesture with named references. (MC-6)
- [ ] Publish ≥1 full per-skill rubric as an appendix. (MC-2)

**Tier 3 — presentation and hygiene:**
- [ ] Add the framework timeline diagram (Framing → generate → Judge↔Steer loop with monitor/control arrows and the Standards referent).
- [ ] Migrate the anchor-map and novelty-boundary tables from FRAMEWORK_DESIGN.md into the manuscript.
- [ ] Fix the bibliography: add `Randazzo et al. 2025` and a `Paul-Elder` entry; remove orphan/uncited keys or cite them; complete the `kosmyna2025brain` author list and verify the arXiv ID; run `bibtest` for hallucinated/placeholder detection.
- [ ] Reconcile "sixteen prompts" (§7) with the "8-call chain" (log); state exact pipeline, ideally as a figure.
- [ ] Disclose single-*learner*-model (gpt-4o-mini) alongside single-grader-model in §11.
- [ ] Bring Gilson & Goldberg (2015) / Jaakkola (2020) conceptual-paper framing into the manuscript body.
- [ ] Replace the placeholder reference list (line 391) with the compiled bibliography.

---

*Reviewer's note to the editor:* The underlying idea, separating pre-generation Framing from post-generation Steering with Judging as the epistemic gate, is a worthwhile and publishable contribution for this venue, and the theoretical grounding is sound. The gap between the paper's claims and its current evidence is entirely closable with the scaled run the authors have already designed and the construct-tightening above. I would be glad to review a revised version.
