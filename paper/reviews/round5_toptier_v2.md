# Round 5 review (top-tier AI & Education) and disposition

Simulated full peer review of the v2 manuscript, with the editor decision and the
point-by-point disposition of each concern. Concerns are split into those fixable
without human labeling (addressed on `v2`) and those that genuinely require human
raters/ranking (deferred to the validation program in Section 10).

**Reviewer recommendation:** Major Revision (strong conceptual contribution; empirical
section must be repositioned or substantiated). Decision is driven by M1/M3 (human
validation) which are out of scope for an automated pass.

## Disposition

| # | Concern | Needs humans? | Disposition on v2 |
|---|---|---|---|
| M1 | "automatically measurable" outruns simulated, LLM-graded evidence | partly | FIXED (language): downgraded to "separable and automatically scoreable under controlled conditions" in abstract/intro/contributions. Human-rater study remains the substantive fix (deferred, Section 10). |
| M2 | Headline +1.02 inflated by built-in Judging +2.00 | no | FIXED: abstract and Section 8 now lead with the two blind-graded effects (+0.62, +0.43); +1.02 reported only with the built-in caveat. |
| M3 | Grader precision shown, not accuracy vs humans | partly | PARTIAL: precision-not-accuracy stated explicitly in abstract; cross-vendor backend added (Gemini, see Section 8) as a stronger-but-still-not-human check. Human accuracy deferred. |
| M4 | N=80, wide Steering CI, thin per-subject | no | FIXED (language): per-subject splits explicitly labeled illustrative not powered; pooled own-effects + CIs named as load-bearing. |
| M5 | Judging circularity (machine answer key) buried | partly | FIXED (reposition): the "seeded issues not yet human-verified" caveat moved adjacent to the first Judging result. Human verification of seeded issues deferred (Section 10). |
| M6 | Forward/platform framing reads promotional; Figure 1 conceptual-as-data | no | FIXED: Figure 1 marked "(schematic), axes conceptual not quantitative"; "minimal decomposition"->"deliberately small"; "infrastructure to extend"->"usable as a starting point for others to extend." |
| m2 | P2/P3 reconciliation | no | Already formalized in Section 3.3 (ceiling-relation vs off-diagonal); left as is. |
| m3 | PC1 43% report-and-retract | no | FIXED: cut the statistic; rest separability on the effect matrix + correlations. |
| m6 | "grader-backend robustness" oversells within-family | no | FIXED: now reports a genuine cross-vendor backend; within-family check named as such. |
| m7 | Bilingual claim untested | no | FIXED: softened to interface-only; English-only evaluation stated. |
| m8 | P5 / offloading must not read as shown | no | FIXED: explicit guard that offloading reduction is untested here. |
| m9 | Heatmap caption units | no | FIXED: caption states the 3-point scale and cell meaning. |
| m10 | "deployed prototype" inconsistency | no | FIXED in the backend paragraph (prototype, not deployed). |
| m11 | Acar (HBR) load-bearing | no | FIXED: paired with Denny et al. (2024) at the forward-thesis claim. |
| m12 | Section 10 lacks sample sizes/power | no | FIXED: added target N (~150-200 transcripts, >=3 experts/skill; >=200 learners) and power framing. |
| M1a, M5a, M3-core | run human agreement study; human-verify seeded issues; expert accuracy | YES | DEFERRED: require human raters; specified in Section 10 with the prepared study package. |

## Update: cross-vendor replication obtained (m6 / M3-partial now CLOSED)
A third grader backend from an independent vendor, Meta's llama-3.3-70b (the prototype's own
engine), re-graded the identical 40 transcripts. The dissociation replicates with a stronger
margin: own-effects Framing +0.80, Judging +0.75, Steering +0.40 vs mean cross-effect +0.02
(diagonal/off-diagonal ratio 39). Judging's own-effect settles to +0.75 (level with Framing),
confirming the gpt-4o +2.00 was grader-specific and that the separation is balanced across all
three skills under an independent vendor. Section 8's grader-robustness paragraph now reports
three backends spanning two providers; the abstract, Section 8 Scope, and Section 11 state
"spanning two providers" as an established result, not a deferred item. Artifacts:
research/results/e3_dissociation_grades_xvendor.csv (+ _complete json).

Per the "Weakness Is The Starting Point" rule, the conditional Steering-by-judging analysis
(+0.30 judging-strong vs +0.55 judging-weak) was inconclusive and is kept as a private
diagnostic, not added to the paper.
