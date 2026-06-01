# Final Readiness Review — CoReasoning manuscript

**Reviewer role:** Final holistic submission gate, held to both an education-sciences and a
computers-in-education standard.
**Manuscript:** `paper/coreasoning.md`
**Target venue:** Computers & Education: AI — Position Paper
**Date:** 2026-06-01

---

## 1. Overall verdict

**Ready after one minor fix.** This is a coherent, honestly-scoped, well-positioned conceptual /
position paper with a feasibility demonstration that is now internally consistent across the abstract,
Section 8, and Table 2 at the headline N=80 level (Framing +0.62, Steering +0.43, Judging +2.00;
diagonal +1.02 vs off-diagonal +0.008; F-J ρ=−0.03 ns; J-S ρ=+0.25 significant; reliability 92%).
The ablations are correctly run on, and labelled as, the original 40-learner subset, and the E4
answer-key finding plus the harsher-steering and grader-backend robustness checks are presented
without over-claiming. The argument integrity is strong: the dissociation is framed as instrument
behaviour over simulated learners, the blind-graded skills are correctly foregrounded as the strongest
evidence, the E4 finding that Judging is essentially answer-key agreement is stated plainly and folded
into the limitations, and the no-learning-outcome boundary is repeated consistently. The single
must-fix is a stale pair of N=40 own-effect numbers (+0.60, +0.50) carried into the Section 8 "Scope
and caveats" paragraph, which now reads as if summarising the main N=80 result; left as-is it is the
one internal-consistency snag an attentive reviewer would catch. Everything else is nice-to-have
polish.

---

## 2. MUST-FIX (1 item)

### M1. Stale N=40 own-effect numbers in the Section 8 "Scope and caveats" paragraph

The headline result is N=80 with **Framing +0.62** and **Steering +0.43** (abstract line 33
"+0.6 and +0.4"; Table 2 line 511-513). But the "Scope and caveats" list reverts to the N=40
subset values when summarising the *main* finding:

- Line 594: *"Framing and Steering responses are free-text and blind-graded, so their positive
  own-effects **(+0.60, +0.50)** with near-zero cross-effects are the stronger evidence."*
- Line 599: *"(iv) Steering shows the weakest own-effect **(+0.50)**."*

These +0.60 / +0.50 figures are the N=40 subset numbers (the legitimate baseline for the E4 and
strict-steering ablations elsewhere in the section), but here they appear in caveats (i) and (iv)
that are about the headline dissociation result, contradicting Table 2 and the abstract.

**Fix:** change both to the N=80 values — "(+0.62, +0.43)" at line 594 and "weakest own-effect
(+0.43)" at line 599. Note that the immediately following strict-steering ablation sentence
("the steering own-effect was +0.40, statistically indistinguishable from +0.50") is correct *as an
ablation comparison* because that ablation runs on the 40-subset; if M1 is applied, add a half-clause
so the +0.50 there is unambiguously the 40-subset baseline (e.g. "indistinguishable from that
subset's +0.50 baseline") to avoid a reader bouncing between +0.43 and +0.50 within one paragraph.

---

## 3. Nice-to-have polish (non-blocking)

- **P-1 (off-diagonal rounding).** Text says the off-diagonal averages **+0.008** (line 499); the six
  Table 2 off-diagonal cells average **+0.010**. The +0.008 is presumably computed from raw grades
  rather than the rounded table cells; both round to the same story, but a careful reader recomputing
  from Table 2 will get +0.010. Either footnote that the matrix means are computed from unrounded
  grades, or state "+0.01".
- **P-2 (caveat iii redundancy).** Section 8 caveat (iii) (under-identified factor model, line 597)
  restates verbatim the point already made at lines 526-528. Consider trimming one to avoid the
  reader feeling the same hedge twice in two pages.
- **P-3 (E4 ratio vs strict-steer ratio).** The section reports dissociation "ratio 29" (E4, line 584)
  and "ratio 27.5" (strict steering, line 604) but the main result is given as a +1.02 / +0.008 pair
  without an explicit ratio. For parallelism a reader may want the main ratio stated once (≈127:1 at
  N=80, or the more conservative blind-graded-only ratio). Optional; the prose is already clear that
  the off-diagonal is near zero.
- **P-4 (one long sentence).** Lines 579-583 (the E4 "sharply skill-specific" sentence chain) pack
  three numeric contrasts into a dense block. Splitting after "carry it." would improve readability;
  purely stylistic.
- **P-5 (Paul & Elder year).** In-text "Paul-Elder intellectual standards" (line 227) has no year;
  the reference is dated 2006. Adding "(Paul & Elder, 2006)" at first mention would match the
  citation style used elsewhere. Minor.

---

## 4. Checks that PASSED (for the record)

- **Numbers internally consistent (headline):** abstract, Section 8, Table 2 agree on N=80 Framing
  +0.62 / Steering +0.43 / Judging +2.00; diagonal +1.02 (= (0.62+2.00+0.43)/3); F-J ρ=−0.03 (ns),
  F-S ρ=−0.12 (ns), J-S ρ=+0.25 (p=0.02); reliability 92% / flip 0.08 / blind-graded ~0.12; first PC
  43%. All match `research/experiments/PROJECT_LOG.md` (C8/C9) and `INDEX.md`.
- **Ablations correctly scoped to N=40:** E4 ground-truth ablation and strict-steering ablation both
  explicitly state "the original 40-learner subset" and "that subset's own baseline (+0.60 / +2.00 /
  +0.50)". This is honest and correct — the only leak is M1 above, where those subset numbers escaped
  into the main-result caveats.
- **Grader-backend robustness:** diag +0.47 vs off-diag +0.07 (ratio ≈ 6.7, log says 7.0 — consistent
  rounding); J own-effect 2.00→0.65 correctly interpreted as gpt-4o-specific strictness, not a
  construct artifact.
- **Cross-references:** Figures 1, 2, 3, A1, A2 and Tables 1, 2 all referenced and all five image
  assets present in `paper/assets/`. No broken figure/table pointers. Propositions P1-P5 referenced
  consistently; P2/P3 reconciliation (ceiling vs dissociation) is handled cleanly at lines 200-206.
- **No stale numbers from earlier rounds:** the old "+1.03 / 60:1" and "255/280-call" figures from
  C6 are gone; current text uses N=80 +1.02 / +0.008 and "below the 560 nominal".
- **Argument integrity / over-claiming:** dissociation consistently framed as *instrument behaviour
  over simulated learners*; blind-graded Framing+Steering correctly foregrounded as strongest evidence
  and Judging's +2.00 explicitly de-emphasised as built-in; E4 "Judging ≈ answer-key agreement"
  stated in both Section 8 and Limitations; "precision not accuracy" and "no learning-outcome claims"
  repeated in abstract, Sections 8, 10, 11, 12. Nothing over-claimed for the evidence on hand.
- **Em-dash / double-dash discipline:** none present (C7 purge held).

---

## 5. Bottom line

One numeric edit (M1) stands between this and submit-ready. Apply M1, optionally sweep P-1 through
P-5, and the manuscript is ready for Computers & Education: AI as a Position Paper.
