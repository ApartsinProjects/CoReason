# CoReasoning: Master Framework & Paper Design

**Type:** Theory-forward conceptual/position paper + proof-of-concept feasibility demonstration.
**Targets:** arXiv preprint → *Computers & Education: AI* (Position Paper type) and/or AIED 2027
Blue Sky; *IJAIED* position paper; Frontiers in Education (Hypothesis & Theory) as fallback.

---

## 1. The contribution (one paragraph)

We propose **CoReasoning**, a theoretically-grounded competency model that decomposes *productive
work with generative AI* into three **temporally and cognitively distinct, independently-assessable
skills**: **Framing** (transform an ill-defined problem into a well-specified task *before*
invoking AI), **Judging** (critically evaluate AI output for errors, gaps, unstated assumptions,
and risk), and **Steering** (iteratively redirect the AI toward a better solution *across cycles*).
Unlike prior AI-/prompt-literacy frameworks that bundle "specify" and "iterate" into a single
"prompting" competency, CoReasoning separates the **pre-generation** skill (Framing) from the
**post-generation corrective** skill (Steering), and treats Judging as a distinct epistemic
gatekeeper between them. We ground each skill in established theory, state testable propositions
about their relationships, and give a proof-of-concept instrument (rubric-driven LLM grader) plus
a feasibility demonstration that the three skills **dissociate**.

## 2. Why a framework, not a taxonomy (the Gilson & Goldberg 2015 bar)

A publishable conceptual paper must propose **new relationships among constructs**, not just list
categories. Our core **propositions** (testable, diagnostic):

- **P1 (Ordering / gating):** Framing causally precedes and bounds the achievable quality of
  Judging and Steering; a poorly framed task yields output whose "errors" are ill-defined, so
  Judging has no stable referent. *Framing failures are not recoverable by Steering.*
- **P2 (Judging gates Steering):** Steering quality is upper-bounded by Judging quality — you
  cannot correct what you did not detect. High Steering effort on top of poor Judging produces
  confident misdirection (maps to over-reliance, Cluster-2 lit).
- **P3 (Dissociation / orthogonality):** The three skills are separable competencies: a learner
  may be strong in one and weak in another (e.g., frames well but cannot judge domain errors).
  *This is the empirically testable claim and the central defense against "relabeling."*
- **P4 (Asymmetric internalization):** Per ZPD, the skills differ in transferability — Judging
  (epistemic vigilance) transfers across domains less than Framing (task-structuring) because
  Judging is bounded by domain knowledge (the calibration trap).
- **P5 (Inverse of offloading):** Each skill re-inserts a self-regulatory loop that cognitive
  offloading short-circuits; the framework converts "offloading cognition" into "offloading
  execution while retaining cognition."

## 3. Theoretical grounding (anchor map)

| Skill | Primary anchor | Secondary anchors |
|------|----------------|-------------------|
| **Framing** | SRL **task definition** (Winne & Hadwin 1998); forethought (Zimmerman 2000) | Bloom *Create*; metacognitive task knowledge (Flavell 1979); problem-finding |
| **Judging** | Metacognitive **monitoring** (Nelson & Narens 1990) | Critical thinking (Facione 1990 Delphi; Paul-Elder); **epistemic vigilance** (Sperber et al. 2010); **AIR / apt epistemic performance** (Barzilai & Chinn 2018); appropriate reliance (Lee & See 2004) |
| **Steering** | Metacognitive **control** (Nelson & Narens 1990) | SRL control/adapt; cognitive apprenticeship coaching (Collins, Brown & Newman 1989); formative feed-forward (Hattie & Timperley 2007) |
| **Whole loop** | Monitor→Control cycle = Judge→Steer | ICAP *Interactive* mode (Chi & Wylie 2014); AI-as-mediator / ZPD (Vygotsky 1978) |
| **Pedagogical stance** | **Productive struggle / desirable difficulties** (Bjork & Bjork 2011; Kapur 2008) | "don't optimize for speed-to-answer" |

**Structural backbone for the paper:** the Nelson–Narens two-level (object/meta) architecture, with
Judge = monitoring (object→meta) and Steer = control (meta→object), and Framing as the upstream
*task-definition* that sets the standards the monitor compares against (Winne & Hadwin COPES
"Standards"). This gives a single coherent cognitive architecture, not a loose list.

## 4. Novelty positioning (confront the nearest priors EXPLICITLY)

| Nearest prior | What it does | How CoReasoning differs |
|---------------|--------------|-------------------------|
| **Dakan & Feller 2025, 4D AI Fluency** (Delegation/Description/Discernment/Diligence) | Practitioner fluency checklist; Description bundles prompt-craft + iteration | We split the **time axis**: Framing (pre) vs Steering (post). 4D folds iteration into "Description." We derive skills from learning theory + assessment, not a fluency heuristic. |
| **Tankelevitch et al. CHI 2024, Metacognitive Demands of GenAI** | Names prompt/evaluate/iterate as **metacognitive demands** (cognitive-load lens) | We turn the same activities into an **assessable competency model** with rubrics + dissociation evidence, not a demands analysis. (Strongest construct-level neighbor; cite as foundation, contrast cleanly.) |
| **Prompt literacy / CLEAR (Lo 2023); Frontiers 2024** | "precise prompt → interpret → iterate" as one skill | We argue Framing ≠ Steering are cognitively/pedagogically distinct (different error modes, different interventions). |
| **Long & Magerko 2020; UNESCO 2024; 12-competencies (Annapureddy 2024)** | Knowledge-oriented AI-literacy; understanding AI | No Framing/Steering constructs; only diffuse "critical evaluation." We are task-execution competencies in a human-AI loop. |
| **Randazzo et al. 2025 Cyborgs/Centaurs; Dell'Acqua Jagged Frontier** | Empirical *modes* of AI use | We provide the assessable skill decomposition underlying the "Cyborg" mode. |

**One-line novelty:** *the first theoretically-grounded decomposition of productive GenAI use into
three independently-assessable competencies that separates pre-generation Framing from
post-generation Steering, with feasibility evidence that the three dissociate.*

## 5. Theoretical tensions to address (a strong paper resolves these)
1. **Offloading vs productive struggle** (Gerlich 2025; Kosmyna et al. 2025 "cognitive debt"):
   resolve via ZPD internalization — mediation aims at eventual independence (P5).
2. **Calibration trap:** Judging is bounded by the learner's domain knowledge (P4) — concede & scope.
3. **Interactive ≠ productive** (ICAP caveat): Steering counts only when corrections are
   knowledge-generating, not re-rolls.
4. **Standards regress:** when the AI out-performs the learner, the learner's standards may be
   inferior to the output — a reversal classical formative-assessment theory doesn't anticipate.

## 6. Paper structure (target ~8–12k words conceptual + demo)
1. **Introduction** — speed-to-answer vs quality-of-thinking; the offloading threat; thesis.
2. **The problem with current AI-literacy assessment** — can say *that* AI use is unproductive,
   not *why*; motivates a diagnostic decomposition.
3. **The CoReasoning framework** — definitions of Framing/Judging/Steering; the monitor/control
   architecture; the temporal separation argument.
4. **Theoretical grounding** — anchor map (§3); each skill ← theory.
5. **Propositions** — P1–P5 with rationale (§2).
6. **Relation to prior frameworks** — §4 table + prose; novelty boundary.
7. **Operationalization (proof-of-concept instrument)** — the rubric-driven LLM grader; the
   deliberately-imperfect-output + judge/steer-cycle design (grounded in cognitive apprenticeship).
8. **Feasibility demonstration** — E3 discrimination (grades monotone in competence) + E1
   dissociation (low inter-skill correlation) + E2 reliability; framed as *evidence the constructs
   are separable and measurable*, NOT as learning-outcome claims.
9. **Tensions & boundary conditions** — §5.
10. **A research & assessment agenda** — the prepared human-rater validation study; classroom path.
11. **Limitations** — synthetic learners, single grader model, no learning-gain data.
12. **Conclusion.**

## 7. Tensions with our own honesty constraints
- NO learning-outcome claims. The demo shows **construct separability + grader feasibility** only.
- Simulated learners are labeled as such; the human-rater study is presented as *planned/prepared*.
- The instrument is a *proof of concept*, explicitly bounded by single-model + synthetic-input caveats.

## 8. Key citations (working set)
Flavell 1979; Nelson & Narens 1990; Zimmerman 2000; Winne & Hadwin 1998; Facione 1990;
Paul & Elder; Anderson & Krathwohl 2001; Collins, Brown & Newman 1989; Bjork & Bjork 2011;
Kapur 2008; Hattie & Timperley 2007; Black & Wiliam 1998; Sadler 1989; Sperber et al. 2010;
Barzilai & Chinn 2018; Vygotsky 1978; Chi & Wylie 2014; Salomon, Perkins & Globerson 1991;
Pea 1993; Lee & See 2004; Bansal et al. 2021; Buçinca et al. 2021; Parasuraman & Manzey 2010;
Risko & Gilbert 2016; Long & Magerko 2020; UNESCO 2024; Annapureddy et al. 2024; Chee et al. 2025;
Lo 2023 (CLEAR); Tankelevitch et al. 2024; Dakan & Feller 2025; Randazzo et al. 2025;
Dell'Acqua et al. 2023/2025; Gerlich 2025; Kosmyna et al. 2025; Vaccaro et al. 2024;
Gilson & Goldberg 2015; Jaakkola 2020.
