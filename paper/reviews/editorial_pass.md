# Editorial Pass: coreasoning.md

Scope: line-by-line copy/developmental edit. Five focus areas only — consistency, gaps,
tone, language, narrative. No new experiments, content, or restructuring proposed.

Overall: the manuscript is internally clean and the main result chain (N=80; Framing
own-effect +0.62, Steering +0.43, Judging +2.00; 92% reliability; F-J rho=-0.03 ns,
J-S rho=+0.25 sig; robustness on 40 transcripts; 40-learner ablation subset) is
consistent across abstract, body, Table 2, and figure captions. The issues below are
mostly small polish items; only a few are true MUST-FIX.

---

## (A) MUST-FIX: consistency / gaps / broken references

### A1. Off-diagonal average is arithmetically wrong (Section 8, line 498-499)
Text: *"the off-diagonal (the effect of the *other* skills' competence) averages **+0.008**."*
The six off-diagonal cells in Table 2 are: -0.02, -0.07, +0.00, +0.00, -0.12, +0.27.
Sum = +0.06; mean = +0.06 / 6 = **+0.010**, not +0.008.
Fix: change **+0.008** to **+0.01** (and the diagonal **+1.02** is correct: 3.05/3 = 1.017).

### A2. "all four seeded issues" presupposes a fixed count that the spec does not fix (lines 492-494)
Text: *"a strong judge flags all four seeded issues with no false alarms ... a weak judge flags none"*
and (line 499) *"Judging's own-effect (+2.00) is fixed by construction"*.
But line 440 specifies the output embeds *"two to four non-trivial issues"* (and line 428
says *"two or three unstated gaps"*). "all four" reads as if four is the fixed number.
Fix: replace *"all four seeded issues"* with *"all seeded issues"* (and, if you keep a
number in the Discrimination paragraph, make it match the "two to four" range, e.g.
*"flags every seeded issue"*).

### A3. Ambiguous "Framing's +0.65" in the robustness paragraph (line 567)
Text: *"under the weaker grader Judging's own-effect falls from +2.00 to +0.65, comparable to
Framing's +0.65"*. Framing's headline own-effect everywhere else is **+0.62** (Table 2,
lines 503, 515, 592). The +0.65 here is presumably the re-grade value of Framing on the
40 transcripts under gpt-4o-mini, but that is never stated, so a reader sees "+0.62" four
times and then "+0.65" with no explanation and reads it as a typo for +0.62.
Fix: either (a) confirm and keep +0.65 but add three words making clear it is the re-grade
value, e.g. *"comparable to Framing's own re-graded +0.65"*, or (b) if it is a typo,
change to +0.62. Resolve before submission; right now it is unverifiable from the text.

### A4. Text names three contrast personas; Figure 3 caption says five (lines 533-535 vs 548)
Text enumerates exactly three: *weak-framer/strong-judge*, *strong-framer/weak-judge*,
*weak/weak/strong-steerer*. Figure 3 caption (line 548): *"Mean per-skill grade for **five**
competence profiles."* Not a hard contradiction (the figure can show more than the prose
spells out), but a reader counting will trip.
Fix: either say *"The designed-contrast personas (five shown in Figure 3) make the
separation concrete"* and let the three be illustrative examples, or align the count.

---

## (B) Tone fixes (negative / apologetic / defensive residue)

Tone is largely confident and forward; limitations read as neutral boundary conditions.
A few soft spots:

### B1. "sobering" editorializes against the field's own evidence (line 61)
Quote: *"Meta-analytic evidence is sobering: human-AI teams frequently underperform..."*
"sobering" is a value-laden hedge. Rewrite (neutral, forward):
*"Meta-analytic evidence is pointed: human-AI teams frequently underperform the better of
the human or the AI alone (Vaccaro et al., 2024), which makes the human's skill in
directing the system, not mere access to it, the decisive variable."*

### B2. "is not, by itself, a discovered separation" undersells own result (lines 589-591)
Quote: *"its clean diagonal (+2.00, with zero cross-effects) confirms the grader correctly
rewards recall/precision but is not, by itself, a discovered separation."*
The point (Judging's effect is built-in) is worth stating, but the phrasing apologizes.
Rewrite: *"its clean diagonal (+2.00, with zero cross-effects) confirms the grader
correctly rewards recall/precision; the **discovered** separation rests on the blind-graded
skills, whose positive own-effects (+0.62, +0.43) with near-zero cross-effects carry the
claim."* (This keeps the caveat but ends on the strength.)

### B3. "only partly established" x2 reads thin where it could read scoped (lines 594, 674)
Quote (674): *"so cross-vendor robustness is only partly established."* This is fine as a
boundary condition; just ensure it is not the closing note of its sentence cluster. It
currently is acceptable — flagging only so it is not weakened further in edits.

---

## (C) Language fixes (grammar / parse / flow)

### C1. Run-on in the abstract's diagnostic sentence (lines 17-19)
Quote: *"...folded into a single "prompting" score that cannot diagnose *why* a given
learner's AI use succeeds or fails, whether they specified the task poorly, missed the
flaws in the output, or failed to correct them."*
The comma before "whether" splices a clause. Rewrite:
*"...folded into a single "prompting" score that cannot diagnose *why* a given learner's
AI use succeeds or fails: whether they specified the task poorly, missed the flaws in the
output, or failed to correct them."* (comma -> colon)

### C2. Comma splice / appositive overload (lines 127-129)
Quote: *"These are three different failures with three different remedies, teaching problem
specification, teaching critical evaluation, and teaching corrective communication, and an
instrument that cannot separate them cannot guide instruction."*
Two coordinate "and"s plus an embedded list make this hard to parse. Rewrite:
*"These are three different failures with three different remedies — teaching problem
specification, teaching critical evaluation, and teaching corrective communication — and an
instrument that cannot separate them cannot guide instruction."*
NOTE: global style forbids em dashes. Use parentheses instead:
*"These are three different failures with three different remedies (teaching problem
specification, teaching critical evaluation, and teaching corrective communication), and an
instrument that cannot separate them cannot guide instruction."*

### C3. Same em-dash-by-comma pattern, body (lines 92-93, contribution 1)
Quote: *"three temporally and cognitively distinct, independently-assessable skills,
Framing, Judging, and Steering, whose defining novelty is the separation..."*
The skill list is set off by bare commas, colliding with the preceding comma. Rewrite:
*"...independently-assessable skills (Framing, Judging, and Steering), whose defining
novelty is the separation of the pre-generation skill (Framing) from the post-generation
corrective skill (Steering) that prior frameworks fuse."*

### C4. Dangling / heavy parenthetical (line 482-486, Judging operationalization)
Quote: *"Judging is operationalized by a competence-conditioned selection over the
challenge's ground-truth seeded issues (a strong judge flags all real issues and no false
ones; a weak judge flags few real issues and some false ones)."*
Fine grammatically, but "all real issues" here again implies a clean binary; align with A2
wording ("all seeded issues" vs "all four"). Cosmetic.

### C5. "the issued total is below the 560 nominal" is terse to the point of opacity (line 481)
Quote: *"...so the issued total is below the 560 nominal."*
Rewrite for readability: *"...so the number of grader calls actually issued is below the
560 nominal (80 learners x 7 calls)."* (Spelling out 80x7 also pre-empts the reader's
mental arithmetic and confirms the figure.)

### C6. Repeated "recent ... recent" (line 234-236)
Quote: *"...underscored by recent evidence that metacognitive monitoring can decouple from
performance in human-AI reasoning (Fernandes et al., 2024), and by recent work on whether
learners can evaluate AI output quality as experts do (Nazaretsky et al., 2025)."*
Two "recent" in one sentence. Rewrite second to *"and by emerging work on whether..."* or
drop the second "recent".

### C7. "near 0.12" vs the stated components (line 560) — wording, not number
Quote: *"the load-bearing figure is the blind-graded skills, whose flip rate is near 0.12."*
The number is correct (mean of Framing 0.15 and Steering 0.10 = 0.125). Consider
*"whose mean flip rate is near 0.12"* for precision; minor.

### C8. Long noun pile-up (lines 415-417)
Quote: *"This separation in the interface, distinct phases, distinct feedback channels, and
distinct grade columns, is the framework's central claim made operational..."*
Comma-fencing of the appositive is awkward. Rewrite (no em dash):
*"This separation in the interface (distinct phases, distinct feedback channels, and
distinct grade columns) is the framework's central claim made operational..."*

---

## (D) Narrative notes

### D1. Through-line holds.
Abstract -> Intro -> Framework (Sec 3-4) -> Propositions (Sec 5) -> Positioning (Sec 6) ->
System/instrument (Sec 7-7.1) -> Feasibility (Sec 8) -> Tensions (Sec 9) -> Agenda (Sec 10)
-> Limitations (Sec 11) -> Conclusion (Sec 12). Each section opens with a clear topic
sentence and the "separate pre-generation Framing from post-generation Steering, Judging as
the gate" spine recurs cleanly. The abstract's "we make no learning-outcome claims" is
honored consistently (lines 36-38, 110-111, 469, 681). Good.

### D2. Minor redundancy: the three-failures motif appears three times.
Abstract (17-19), Intro (71-73), and Sec 2 (124-129) each spell out the
"specified badly / missed flaws / could not correct" triad. This is deliberate scaffolding
and mostly works, but the Sec 2 instance (124-129) is the third near-verbatim repeat. No
fix required; if tightening, vary the Sec 2 phrasing so it reads as a deepening rather than
a re-statement (the surrounding text already does the diagnostic-cost framing, so the list
itself could be compressed).

### D3. Abstract vs Intro framing is consistent, not contradictory.
Abstract opens "Generative AI makes it trivial to obtain an answer and difficult to obtain
understanding"; Intro opens "Most AI-in-education tools optimize for the wrong variable."
Same thesis, different angle — complementary, not redundant. Good.

### D4. Section 3.3 vs Propositions ordering (forward-reference is fine).
Section 3.3 (lines 200-204) invokes P2 and P3 before Section 5 defines them. P2/P4 are
glossed inline (line 152 "Proposition P4", line 200 "P2 (Judging bounds Steering)"), so the
reader is not stranded. This is acceptable scholarly forward-referencing; no gap. (Listed
here only to confirm it was checked and is NOT a defect.)

### D5. "monitor-control" vs "Judge-Steer" terminology — consistent enough.
"monitor-control" is used uniformly (lines 96, 139, 171, 195, 287, 381). The cycle name
appears as "Judge->Steer" (164), "Judge-Steer" (245, 707), and "Judge/Steer" (407, the
Phase-2 label). The slash form at 407 matches the UI phase label, so it is defensible, but
for prose consistency consider standardizing the two narrative mentions (164, 245) to a
single hyphenated "Judge-Steer cycle" and leaving "Judge/Steer cycles" only as the
interface phase name. Low priority.

### D6. Model-ID casing is internally consistent.
gpt-4o, gpt-4o-mini, llama-3.3-70b are uniformly lowercase throughout (lines 471, 562-568,
672-674). No "GPT-4o"/"GPT-4o-mini" variants slipped in. Good — leave as-is.

---

## Priority order for the author
1. A1 (+0.008 -> +0.01) — wrong number, trivially fixable.
2. A3 (Framing +0.65 vs +0.62) — verify which is correct; reader-stopping.
3. A2 ("all four seeded issues") — align with the "two to four" spec.
4. A4 (three personas in text vs five in Figure 3 caption).
5. C1-C3, C5, C8 (parse/comma-splice fixes; several collide with the no-em-dash rule,
   so apply the parenthetical rewrites given).
6. B1-B2 (tone polish).
7. D2/D5 (optional tightening).
