# Session 3 — False Memory Susceptibility Study for Eyewitness Testimony Reform (Open-Ended)

**Challenge:** Memory > False Memory & Misinformation Effect
**Mode:** Open-Ended (Structured Sections)
**Student:** Sofia K.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> A national law reform commission wants a research proposal to investigate how false memories form during police interviews and whether current interviewing practices "make things worse." Design a study and deliver a full research proposal including hypotheses, method, stimuli, procedure, and analysis plan. The commission mentions that witnesses "often change their stories between interviews" and wonders whether this indicates "unreliable witnesses or bad interview techniques." They want results that are "admissible as scientific evidence" in court. The study should somehow be "ethical" while still testing how easily false memories can be implanted.

### Student's Framing Response

> **Assumption: "False memory" in this context means the misinformation effect — post-event information alters the original memory trace, as shown in Loftus's paradigm.**
>
> **Assumption: "Admissible as scientific evidence" means the study must meet Daubert criteria: testable hypothesis, peer-reviewable methodology, known error rates, and general acceptance in the field.**
>
> **Question: "Ethical" means I cannot implant traumatic false memories. I'll use a mock crime video paradigm where misinformation is introduced through suggestive interview questions about peripheral details.**
>
> **Constraint: The study must have ecological validity — lab-based word lists (DRM paradigm) would not satisfy the commission's interest in police interview practices.**

### AI Solution (Generated from Student's Framing)

**Research Proposal: Misinformation Effects in Simulated Witness Interviews**

**Hypotheses:**
1. Witnesses exposed to misleading post-event information will report more false details than control witnesses
2. Repeated interviews with suggestive questions will increase false memory rates compared to a single neutral interview

**Method:**
- Design: 2 (misinformation: present/absent) x 2 (interview type: suggestive/neutral) between-subjects
- Participants: 200 undergraduate students
- Stimuli: 5-minute mock crime video (staged robbery)

**Procedure:**
1. All participants watch the mock crime video
2. 48-hour delay
3. Misinformation group reads a "witness summary" containing 4 false details about the video
4. Control group reads an accurate summary
5. Interviewed using either suggestive or neutral questioning protocols
6. Memory test: free recall + 30-item recognition test (including 8 critical misinformation items)

**Analysis:**
- 2x2 ANOVA on false recognition rate for critical items
- Signal detection analysis (d' and response bias c) for critical items
- Confidence-accuracy calibration curves

### Framing Feedback

**Criticism:** The student made several strong choices: correctly identifying the misinformation effect as the relevant mechanism, invoking Daubert criteria for legal admissibility, recognizing the ethical constraint on traumatic memories, and noting the ecological validity limitation of DRM paradigms. However, the student did not question whether "changing stories between interviews" might reflect normal memory decay or retrieval variability rather than false memory — the commission's observation could have multiple explanations, and the study should be designed to distinguish them. The student also did not address individual difference moderators that the commission would care about (e.g., age, stress level at encoding, confidence as a predictor of accuracy). Finally, the student did not ask how the study would handle demand characteristics — participants may guess that some information is misleading.

**Better Alternative Framing:**
> "Assumption: Misinformation effect is the primary mechanism, but story changes could also reflect normal forgetting, retrieval variability, or social pressure — the study should include conditions that distinguish these. Assumption: Daubert criteria apply. Constraint: Cannot implant traumatic memories; will use mock crime paradigm. Question: What moderates susceptibility — age, stress at encoding, delay interval, confidence? The commission needs to know which witnesses are most vulnerable. Question: How will I control for demand characteristics — participants guessing the study's purpose?"

**Grade: A** — Strong theoretical grounding and legal/ethical awareness, but missed competing explanations and moderator analysis.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "No source monitoring — can't distinguish false memory from source confusion"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Revise: Justify the sample or propose community sampling"
    description: "Revise: Justify the sample or propose community sampling. If staying with undergraduates, explicitly discuss the limitation and how the commission should interpret generalizability."
  - name: "Add: Include a source monitoring test"
    description: "Add: Include a source monitoring test — after each recognition item, ask participants whether they remember the detail from the video, the summary, or both. This distinguishes genuine false memory (believed to be from the video) from source confusion."

#### Updated AI Output

**Revised Sample:**
- Primary sample: 160 community participants recruited via public advertisement (age 18-65)
- Stratified by age group: 18-30, 31-50, 51-65 (to test age as moderator)
- Supplementary sample: 80 undergraduates (for comparison with prior literature)
- Exclusion: prior knowledge of eyewitness memory research

**Source Monitoring Addition:**
After each recognition item, participants indicate source:
- "I remember this from the video"
- "I remember this from the written summary"
- "I remember this from both"
- "I'm guessing"

Critical misinformation items scored:
- **False memory (source misattribution):** Participant selects "from the video" for a misinformation item → genuine false memory
- **Source monitoring success:** Participant selects "from the summary" → recognized the item but correctly attributes it
- **Blended attribution:** Participant selects "both" → partial source confusion

**Revised Analysis:**
- 2x2 ANOVA on false memory rate (source-misattributed items only)
- Separate analysis of source monitoring accuracy
- Age as a between-subjects moderator in a 2x2x3 factorial
- Signal detection on source judgments

#### Judging Feedback

**Criticism:** The student identified two important issues — the sample's external validity and the need to distinguish false memories from source confusion. The source monitoring addition was particularly insightful and reflects strong theoretical understanding. However, the student did not notice that the study uses a between-subjects design with 4 cells and 200 participants, giving only 50 per cell — this may be underpowered, especially for interaction effects. The student also did not question whether the 48-hour delay is representative of real witness experiences, where delays can be days or weeks.

**Better Alternative Judgement:**
> "Gap: Undergraduate-only sample limits generalizability. Gap: No source monitoring — can't distinguish false memory from source confusion. Gap: 200 participants / 4 cells = 50 per cell, likely underpowered for interactions. Gap: 48-hour delay may be shorter than real witness delays (days to weeks)."

**Grade: A** — Two strong catches, missed power and delay concerns.

#### Steering Feedback

**Criticism:** The steering was well-targeted and theoretically grounded. The source monitoring addition was the single most important methodological improvement. The sample revision request was also well-justified. The student could have pushed for a power analysis.

**Grade: A** — Excellent theoretical improvement, missed one methodological gap.

---

### Cycle 2

**Current AI Output:** *(revised version with community sample and source monitoring)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap: No power analysis"
    description: "Gap: No power analysis. With the addition of age as a moderator (3 levels), the design is now 2x2x3 = 12 cells. At 160 community participants, that's roughly 13 per cell — severely underpowered for three-way interactions. Gap: The confidence-accuracy calibration curves from the original analysis plan have disappeared in the revision. Confidence is particularly important for legal contexts because jurors rely heavily on witness confidence."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Fix: Run a power analysis for the primary effect"
    description: "Fix: Run a power analysis for the primary effect (misinformation on false memory rate). Use effect size estimates from prior misinformation studies (e.g., d=0.5-0.8 from Loftus, 2005). If the 12-cell factorial is underpowered, simplify the design or increase the sample. Restore: Add back the confidence-accuracy analysis. For each recognition response, collect a confidence rating (1-5). Report confidence-accuracy calibration for true memories vs false memories — this is critical for the legal application."

#### Updated AI Output

**Power Analysis:**
- Primary effect (misinformation main effect): Expected d = 0.60 (medium-large, consistent with meta-analyses)
- For 2x2 between-subjects ANOVA, alpha = .05, power = .80: n = 45 per cell → 180 total
- For 2x2x3 with age moderator: n = 20 per cell → 240 total for main effects, but severely underpowered for three-way interaction
- **Design simplification:** Drop age from the factorial; instead test age as a continuous covariate in regression. Core design remains 2x2 with N = 200 community participants (50/cell)

**Confidence-Accuracy Analysis (Restored):**
- Each recognition response accompanied by confidence rating (1 = guessing, 5 = certain)
- Report:
  - Mean confidence for hits (correct recognition of true details)
  - Mean confidence for false alarms (false memory of misinformation items, source-misattributed)
  - Calibration curve: proportion correct at each confidence level
  - Key test: Are participants as confident in their false memories as their true memories? (tests the "compelling" quality of false memories for legal contexts)

#### Judging Feedback

**Criticism:** The student caught two real problems — the underpowered factorial and the missing confidence analysis. The power analysis request was particularly well-motivated, and the design simplification it produced (age as covariate instead of factor) was the right solution. The confidence-accuracy analysis is indeed critical for the legal application. However, the student did not question whether the 48-hour delay adequately represents real witness experiences where delays can span days or weeks, or whether the study should include a delay-interval manipulation.

**Better Alternative Judgement:**
> "Gap: 12-cell factorial is underpowered — need power analysis. Gap: Confidence-accuracy analysis is missing — essential for legal context. Gap: 48-hour delay may not represent real witness delays; consider adding a delay manipulation or acknowledging this as a limitation."

**Grade: A** — Strong catches with good legal reasoning. Missed the delay issue.

#### Steering Feedback

**Criticism:** The steering was precise and productive — the power analysis request with specific effect size guidance produced a useful design revision, and restoring the confidence analysis addressed the legal application directly. Both instructions were specific enough to drive clear improvements.

**Grade: A** — Specific, well-motivated, and effective.

---

### Cycle 3 (Final)

**Current AI Output:** *(version with power analysis, simplified design, and confidence-accuracy analysis)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Minor: The 48-hour delay is shorter than many real"
    description: "Minor: The 48-hour delay is shorter than many real witness experiences, but this is a standard limitation of lab-based studies and is acknowledged in the ecological validity section. The proposal is otherwise comprehensive and well-specified."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done**

---

## COMPLETION

### Final Grades

| Skill    | Grade |
|----------|-------|
| Framing  | A     |
| Judging  | A     |
| Steering | A     |

### Summary Feedback

The student showed excellent theoretical grounding throughout, particularly in the source monitoring addition (Cycle 1) and the confidence-accuracy analysis for legal contexts (Cycle 2). Framing was above average — correctly identifying the misinformation paradigm, Daubert criteria, ethical constraints, and ecological validity — but missed competing explanations for story changes and key moderator variables. Judging was consistently strong, catching sample validity, source monitoring gaps, power issues, and missing analyses, though the delay interval limitation was repeatedly overlooked. Steering was the strongest skill — every correction was specific, theoretically grounded, and drove meaningful improvements. The student should practice listing "what real-world features does my lab design fail to capture?" as a systematic check.
