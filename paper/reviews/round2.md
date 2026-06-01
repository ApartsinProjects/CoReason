# Peer Review — Round 2

**Manuscript:** *Framing, Judging, Steering: An Assessable Competency Model for Reasoning With Generative AI* (CoReasoning)
**Venue:** *Computers & Education: Artificial Intelligence* (Position Paper) / AIED Blue Sky / IJAIED
**Reviewer role:** Senior reviewer, conceptual/position paper with proof-of-concept feasibility demo
**Round:** 2 (prior decision: Major Revision)
**Date:** 2026-06-01

---

## 1. Summary of changes since Round 1

The authors have substantially and seriously revised. The headline change is that the
feasibility demonstration (Section 8), which in Round 1 was a 2-persona × 1-challenge
discrimination gate with the dissociation and reliability panels left as literal
`[Numbers forthcoming]` placeholders, now reports a **crossed-factorial dissociation
experiment**: each of the three skills is independently set strong/weak ($2^3 = 8$
profiles) crossed with five subjects, giving N=40 simulated learners and 255 blind
grading calls. The central result is an effect matrix (Table 2) whose diagonal
(own-skill effect on own grade) averages **+1.03** and whose off-diagonal (cross-skill
effect) averages **−0.02**, plus two new figures (a heatmap and a designed-contrast bar
chart) and a "designed-contrast personas" paragraph. This is exactly the experiment
Round 1 demanded (MC-1, blocking item #1), and it has been run rather than promised.

Other concrete changes I verified against the manuscript and the prior review:

- **Novelty (Section 6).** A construct-mapping table (Table 1) now maps each nearest
  prior framework onto Framing/Judging/Steering, with the "fused into" cells made
  explicit. The section now directly confronts 4D AI Fluency (Dakan & Feller 2025),
  Tankelevitch et al. 2024, Tour & Zadorozhnyy 2025 (the closest prompt-literacy
  decomposition), Di Santi 2026, GenAIComp/GLAT, and a collaborative-AI-literacy line.
  A "One-line novelty" statement closes the section. This addresses Round-1 MC-2.
- **Judging/Steering boundary (Section 3.3).** A new subsection defines
  "Judging is assessment; Steering is action," casts Judging as the monitor read-out
  and Steering as the controller write, and explicitly reconciles P2 (gating ⇒
  correlation) with P3 (dissociation) via a ceiling-relation argument, committing to
  pairwise dissociation testing. This addresses Round-1 MC-3.
- **Related work (2024–2026).** Acar 2023, Denny et al. 2024, Kim et al. 2025,
  Srinath et al. 2025, Clerc et al. 2026, Gu & Ericson 2025, Li et al. 2026, Feng et al.
  2025 (LLM-judge reliability), GenAIComp, GLAT, and the collaborative-AI-literacy work
  are now present. The "2024 essay-writing literature" gesture and the uncited
  LLM-judge-reliability claim from Round 1 are now anchored (Feng et al. 2025 carries the
  κ≈0.1–0.3 caution in Section 10). This addresses Round-1 MC-6.
- **Scope honesty (Section 8 "Scope and caveats").** The manuscript now states plainly
  that Judging's clean diagonal is *partly built in* (programmatic selection over
  ground-truth issues), that Framing and Steering are the blind-graded evidence, that the
  grader is a single model family, that there is no human validation yet, and that a
  3-indicator factor model is under-identified so an effect matrix is reported instead of
  an EFA. The abstract's Round-1 overclaim ("the three skills dissociate") is now backed
  by an actual dissociation result rather than a placeholder.
- **Figures and tables.** A framework architecture figure (Figure 1), Table 1
  (novelty mapping), Table 2 (effect matrix), the heatmap (Figure 2), the contrast
  chart (Figure 3), and an appendix system walkthrough (A1, A2) are present. The
  Round-1 complaint of "no figures or tables at all" is fully resolved.
- **Bibliography.** `randazzo2025cyborgs`, `paulelder`, `clerc2026question`,
  `feng2025judge`, `tour2025prompt`, `disanti2026amplification`, `gilson2015conceptual`,
  and `jaakkola2020conceptual` now have `.bib` entries (50 `@`-records). The Round-1
  missing-citation list is largely cleared.

The revision is genuine, not cosmetic. The single most important Round-1 blocker (run the
dissociation experiment) has been satisfied with a clean, well-designed factorial.

## 2. Recommendation

**Recommendation: Minor Revision** (borderline Minor / light Major; closer to Minor).

Justification, calibrated to a selective venue. The two structural Round-1 blockers
(empty dissociation panel; asserted-not-demonstrated novelty) are now resolved at the
level a Position Paper requires: there is a real crossed-factorial result whose strongest
arm (the *blind-graded* Framing and Steering own-effects of +0.60 and +0.50 against
near-zero cross-effects) is exactly the evidence that the constructs separate and is *not*
an artifact of the programmatic Judging selection. The novelty section now does the
differentiating work in prose and in a table rather than outsourcing it to a missing demo.
For a Position Paper / Blue Sky track, the conceptual contribution plus a feasibility
demonstration of separability is publishable.

I stop short of Accept because three remaining issues are concrete and individually cheap
to fix, but two of them (a stale model-family sentence that contradicts the experiment, and
a figure-path break that means the central evidentiary figures will not render from the
manuscript directory) are the kind of factual/asset defects a selective venue should not
print. There is also one substantive interpretive gap (the Steering own-effect is weak
*and* the contrast figure reveals a Steering leniency floor that the text does not fully
own). None requires new large-scale computation. Hence Minor, contingent on the Tier-1
checklist below; if the authors decline to address the model-family contradiction and the
weak-Steering interpretation, it would slip back to Major.

## 3. Round-1 concerns: RESOLVED / PARTIALLY / UNRESOLVED

| Round-1 concern | Status | Note |
|---|---|---|
| **MC-1** Demo does not support dissociation (P3); panels are placeholders | **RESOLVED** | Crossed factorial N=40, effect matrix, two figures, designed contrasts. The blind-graded Framing/Steering own-effects are the genuine dissociation signal. |
| **MC-2** Novelty vs Tankelevitch / 4D / prompt-literacy asserted not shown | **RESOLVED (with one residual)** | Table 1 mapping + consequential prediction (Framing/Steering grades diverge) now satisfied by the demo. Residual: Tankelevitch is still a single paragraph; their *metacognitive sensitivity/confidence* construct (which bears on the Judging-as-calibration argument) is still not engaged. |
| **MC-3** Judging/Steering boundary under-defined; P2 vs P3 tension | **RESOLVED** | Section 3.3 defines the boundary, casts the residual Steering variance as "communicative/strategic quality given detection," and reconciles P2 (ceiling relation ⇒ correlation) with P3 (off-diagonal below ceiling). Coherent. |
| **MC-4** Propositions vary in testability; P1/P2 near-tautological; P4/P5 untestable here | **PARTIALLY** | Section 8 ties Steering's weak own-effect to P2, and Section 10 brands P4/P5 as the efficacy agenda. But the propositions block (Section 5) still lists P1–P5 flat as "testable propositions"; P1/P2 are not yet shown to be non-tautological by construction (no independent final-artifact-quality measure is reported), and P4/P5 are not visibly demoted to "framework-licensed hypotheses." |
| **MC-5** Grader-calibration / "who judges the judge" internal-validity threat | **PARTIALLY** | Section 7.1 now carries the "the grader is itself a fallible language model" caveat and Section 10 cites Feng et al. 2025 on LLM-judge unreliability. But the specific recursive threat (Judging is scored against LLM-assigned seeded-issue severities, so the Judging ceiling is the grader's own domain competence) is still not named as such, and no human-verified-seeded-issue subset is reported. |
| **MC-6** Missing related work; unsupported empirical citations | **RESOLVED** | 2024–2026 coverage added; LLM-judge reliability and essay-writing gestures now cited. |
| **Minor (R1)**: abstract overclaim; sixteen-prompts vs 8-call; single learner model; figures/tables; bib | **MOSTLY RESOLVED**; two **new/residual** defects (see §4.1, §4.2) | |

## 4. Remaining major concerns

### MC2-1. (Blocking factual defect) The single-model-family sentence in Section 11 contradicts the experiment in Section 8.

Section 8 states the dissociation result was produced with learners
"generated by one model (gpt-4o-mini) and graded by a *different* model (gpt-4o), so that
no model grades its own output" (lines 423–424). Section 11 then states the instrument is
"exercised with a single model family (llama-3.3-70b) on English-language challenges"
(line 543). These cannot both describe the reported N=40 run. The project log (C4)
confirms the dissociation experiment used sim=gpt-4o-mini / grade=gpt-4o; the
llama-3.3-70b sentence is stale from the earlier discrimination gate (C2/C3). As printed,
a reader cannot tell which model produced Table 2, and the cross-model decontamination
claim (a genuine strength) is undercut by the contradiction.

**Fix.** Make Section 11 consistent with Section 8: state that the dissociation run used
gpt-4o-mini learners and a gpt-4o grader (one provider family, OpenAI, hence the
"single grader family" caveat still stands), and note separately that the earlier
discrimination gate used a llama-3.3-70b grader if you wish to keep it. Better still,
report the grader/learner provenance in one consolidated sentence so the limitation
("grader and learner share a provider lineage; cross-provider robustness is deferred to
Section 10") is stated exactly once and correctly.

### MC2-2. (Blocking asset defect) The two central evidentiary figures will not render: the manuscript points at `assets/` but the files live in `docs/assets/`.

Lines 466 and 471 embed `assets/fig_dissociation_heatmap.png` and
`assets/fig_contrasts.png`, but there is no `paper/assets/` directory; the PNG/SVG pairs
exist only under `docs/assets/`. Figure 1, A1, A2 (the `.svg` files) have the same path
prefix and the same problem. For the *empirical* figures this is serious: the dissociation
heatmap and the contrast chart are the paper's primary visual evidence for its central
claim, and they are currently broken links relative to the manuscript. (I verified the
PNGs themselves are correct: the heatmap reproduces Table 2 cell-for-cell, and the contrast
bars match the persona descriptions in the text.)

**Fix.** Either copy/symlink the assets into `paper/assets/` or rewrite the manuscript
paths to `../docs/assets/...`, and confirm the rendered PDF/HTML actually shows all five
figures. This is a build-hygiene fix, not a content change, but it must be done before the
camera-ready or reviewers/readers will see five broken images.

### MC2-3. (Substantive) The weak Steering own-effect (+0.50) plus a visible Steering leniency floor needs a more honest interpretation than P2 alone provides.

The Steering own-effect (+0.50) is the weakest diagonal cell, half the Framing effect and a
quarter of Judging's. The manuscript attributes this entirely to P2 ("steering quality is
bounded, and partly confounded, by the judging it follows," lines 485–486). That is one
valid reading, but the contrast figure (Figure 3) reveals a second mechanism the text does
not acknowledge: in the **All-weak** profile, Steering sits visibly *above* C (≈ 1.6 on the
A=3/B=2/C=1 scale) while Framing and Judging sit at C, and the same elevated-Steering
pattern recurs in the strong-framer/weak-judge profile. In other words, weak Steering is
not being graded down to C the way weak Framing and weak Judging are; the grader appears to
have a **leniency floor for Steering**. A floor on the weak end mechanically compresses the
strong−weak own-effect, which is at least as plausible an explanation for the +0.50 as the
P2 ceiling. This matters because it is an *instrument* property (the Steering rubric or
grader is reluctant to assign C), not a property of the construct, and the paper currently
reads it as the latter.

**Fix.** Add one or two sentences acknowledging that the small Steering own-effect has two
candidate causes, the P2 ceiling *and* a grader leniency floor for Steering visible in the
weak-profile grades, and state that disentangling them is a target for the
grader-robustness study (Section 10). If the underlying per-profile Steering grade
distribution is available, report the weak-Steering grade distribution (how often does weak
Steering actually receive C?) so the floor is quantified rather than left to the figure.
Also report a CI or per-challenge spread on the diagonal cells: with N=40 and 5 challenges,
the +0.50 and +0.60 cells rest on small per-cell samples, and the manuscript currently
reports point estimates with no dispersion, which Round 1 explicitly asked for ("bootstrap
95% CIs").

### MC2-4. (Substantive) The propositions block (Section 5) still over-claims testability relative to what the demo touches.

Round-1 MC-4 asked that P1/P2 be shown non-tautological and that P4/P5 be demoted to
efficacy-agenda hypotheses. The reconciliation prose in 3.3 and 8 is good, but Section 5
itself is unchanged in framing: all five are presented as "testable propositions," yet the
demo speaks only to P3 (and, indirectly and confoundedly, P2). P1 ("framing failures are
not recoverable by downstream steering") is asserted with no measurement in this paper that
could falsify it, because no final-artifact-quality score independent of Framing is
reported; as written it risks being true by the instrument's construction (Steering is
scored against a trajectory whose target Framing sets). P4 and P5 are explicitly outside
the demo (Section 10 concedes P5 needs an efficacy study; P4 needs cross-domain data not
collected).

**Fix.** In Section 5 (or a one-line preamble to it), label which propositions the
feasibility demo addresses (P3 directly; P2 partially and confoundedly) and which are
"framework-licensed hypotheses for the validation agenda" (P1, P4, P5). For P1
specifically, either state the falsifying measurement (low-Framing learners reaching high
independent final-artifact quality via Steering alone) and note it is deferred, or
acknowledge that as currently instrumented P1 is partly definitional.

### MC2-5. (Substantive, smaller) The recursive grader-calibration threat (MC-5) is still not named precisely.

The paper now says the grader is fallible (7.1) and cites Feng et al. on LLM-judge
unreliability (10), which is progress. But the *specific* internal-validity point from
Round 1 remains unstated: because Judging is scored against seeded-issue severities that an
LLM assigned, the instrument's Judging ceiling is bounded by the grader's own domain
competence, the same calibration trap (P4) the framework attributes to learners applies
recursively to the grader. This is the "who judges the judge" point and it is the most
diagnostic place for the planned human-agreement study to land.

**Fix.** Add two sentences to Section 8's caveats or Section 10: name the recursive
calibration threat explicitly, and commit to human-verifying a subset of seeded issues
(and reporting Judging κ as the most diagnostic per-skill agreement) in the prepared study.

## 5. Minor issues

- **Ratio "roughly 60 to 1" is loose.** +1.03 / 0.02 ≈ 51, and the off-diagonal mean is
  −0.0167 before rounding, so the literal ratio is ≈ 62 against the rounded −0.02 but ≈ 51
  against the unrounded value. Either say "roughly 50:1" or "on the order of 50–60×," or
  state it as "diagonal +1.03 vs off-diagonal −0.02" and let readers form the ratio. A
  precise paper should not advertise a headline number that depends on a rounding artifact.
- **N reporting.** "40 simulated learners and 255 blind grading calls" (line 430): 8
  profiles × 5 challenges = 40 learners, good; but 255 is not 40 × an integer, so state how
  255 decomposes (per-skill evaluator calls + grader calls per learner) so the count is
  auditable. A pipeline/call-count figure would resolve both this and the Round-1
  "sixteen prompts vs 8-call chain" reconciliation in one stroke.
- **Section 11 still says "single model family (llama-3.3-70b)"** — same defect as MC2-1,
  flagged here too because it is also a limitations-section accuracy issue, not only a
  consistency issue.
- **Tankelevitch depth.** As noted in MC2-2's residual, the closest neighbor still gets one
  paragraph. Round 1 asked for deeper engagement with their metacognitive-sensitivity /
  confidence constructs; consider one or two added sentences linking their confidence
  analysis to the Judging-as-calibration argument (Lee & See; Section 4).
- **Figure 2/Figure 3 numbering collision.** Figure 2 is used both for the architecture-area
  dashboard reference in Section 7 ("a dashboard of assigned challenges (Figure 2)", line
  358) and for the dissociation heatmap in Section 8 (line 466). Likewise "Figure 3" is the
  Judge/Steer phase screen (Section 7) and the contrast chart (Section 8). The figure
  numbers are reused for different artifacts. Renumber so each figure label is unique
  (the Section 7 references appear to point at system mockups that are actually A1/A2).
  This is a real cross-reference bug, not cosmetic.
- **References line.** Line 589 still reads "[Rendered from `references.bib` (43 entries,
  validated)]" but the `.bib` now has 50 `@`-records; reconcile the count and ensure the
  camera-ready carries an actual rendered reference list, not a bracketed note.
- **`disanti2026amplification` and `tour2025prompt`** are load-bearing novelty citations
  for 2025–2026 claims; run `bibtest` once more to confirm none are placeholder/hallucinated
  and that DOIs/venues resolve, since the novelty argument leans on them being real recent
  competitors.
- **"between B and A" / "averages C"** (Section 8 Discrimination, lines 437–441) is prose
  where the reader would benefit from the actual mean grades; consider a one-line
  discrimination table (the Round-1 "Table X") so discrimination and dissociation are both
  backed by numbers, not one by numbers and one by prose.

## 6. Prioritized checklist to reach Accept

**Tier 1 — required before camera-ready (cheap, factual/asset):**
- [ ] Fix the model-family contradiction: Section 11 must match Section 8
  (gpt-4o-mini learners / gpt-4o grader). (MC2-1)
- [ ] Fix the figure paths so all five figures render from the manuscript; verify in the
  built PDF/HTML. (MC2-2)
- [ ] Resolve the Figure-2 / Figure-3 numbering collision between Section 7 and Section 8.
  (Minor)
- [ ] Correct or soften the "60 to 1" ratio; report diagonal vs off-diagonal directly.
  (Minor)
- [ ] Reconcile the "43 entries" references note with the actual 50-record `.bib` and
  render a real reference list. (Minor)

**Tier 2 — substantive, no new large compute:**
- [ ] Add the dual-cause interpretation of the weak Steering own-effect (P2 ceiling *and*
  grader leniency floor visible in Figure 3), and add dispersion (bootstrap CI or
  per-challenge spread) to the diagonal cells of Table 2. (MC2-3)
- [ ] Re-frame Section 5: label which propositions the demo touches (P3; partial P2) and
  demote P1/P4/P5 to validation-agenda hypotheses; state the falsifying measurement for
  P1. (MC2-4)
- [ ] Name the recursive grader-calibration threat explicitly and commit to a
  human-verified seeded-issue subset with per-skill Judging κ. (MC2-5)
- [ ] Add a pipeline/call-count figure that decomposes the 255 grading calls and reconciles
  "sixteen prompts." (Minor)

**Tier 3 — strengthening, optional for Accept:**
- [ ] Deepen the Tankelevitch engagement (metacognitive sensitivity / confidence → Judging
  calibration). (MC2-2 residual)
- [ ] Add the small discrimination table (the old "Table X") so discrimination is numeric.
- [ ] Run even a 2-rater × ~30-transcript pilot of Judging agreement to convert Section 10
  from "prepared" to "preliminary," which would push the paper toward Accept-without-revision
  at the next round.

---

*Reviewer's note to the editor:* This is a strong revision. The authors ran the
crossed-factorial dissociation experiment Round 1 made the central blocker, and the
blind-graded Framing/Steering own-effects (with the honest concession that the Judging
diagonal is programmatically anchored) are the right evidence honestly framed. The novelty
section and the Judging/Steering boundary are now defensible. The remaining items are a
stale sentence that contradicts the experiment, a broken figure path for the two key
figures, an under-interpreted weak-Steering result, and proposition-scope tidying — all
closable without new computation. I would expect to recommend Accept on a clean Tier-1 +
Tier-2 pass.
