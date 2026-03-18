# Pedagogical Foundations of CoReason

> A comprehensive mapping of learning theories to CoReason's AI co-reasoning assessment platform.

CoReason is an AI co-reasoning assessment platform built around a three-phase interaction model: **Framing**, **Judging**, and **Steering**. Students engage with ill-defined problems alongside an AI partner, developing critical thinking through structured collaboration rather than passive consumption. This document maps established and emerging pedagogical theories to CoReason's design, evaluates current alignment, and proposes theory-driven improvements.

---

## 1. Bloom's Revised Taxonomy (Anderson & Krathwohl, 2001)

**What it is.** The revised taxonomy organizes cognitive processes into six hierarchical levels: Remember, Understand, Apply, Analyze, Evaluate, and Create. Higher-order thinking (Analyze, Evaluate, Create) is the target of meaningful assessment.

**How it maps to CoReason.** Each phase targets distinct taxonomic levels:

| Phase | Primary Levels | Activity |
|-------|---------------|----------|
| Framing | Analyze, Evaluate | Identifying ambiguities, unstated assumptions, and missing constraints requires decomposing a problem and judging what information is absent |
| Judging | Evaluate | Critically assessing AI-generated solutions for gaps, errors, and logical flaws |
| Steering | Create, Evaluate | Formulating specific corrections and improvement directions constitutes generative, constructive thinking |

**Alignment: Strong.** CoReason operates almost exclusively at the upper three levels of the taxonomy. The platform deliberately avoids testing recall or comprehension in isolation. The open-ended response mode pushes students further up the taxonomy than the MC-scaffolded mode, since students must generate rather than select responses.

---

## 2. Constructivism (Piaget & Vygotsky)

**What it is.** Constructivism holds that learners actively build knowledge through experience rather than passively receiving it. Piaget emphasized individual cognitive construction through assimilation and accommodation. Vygotsky stressed the social and dialogic nature of learning, where knowledge is co-constructed through interaction with more capable others.

**How it maps to CoReason.** The entire platform embodies constructivist principles. Students do not receive answers; they construct understanding by interrogating a problem (Framing), evaluating an AI-generated attempt (Judging), and reshaping it (Steering). The AI functions as a Vygotskian "more knowledgeable other" in a specific sense: it provides material for the student to work with, not answers to memorize. The iterative judging-steering cycles mirror Piaget's equilibration process, where learners encounter cognitive conflict (the AI's imperfect output) and must accommodate their thinking.

**Alignment: Strong.** CoReason is fundamentally constructivist. Knowledge is never transmitted; it is always built through active student engagement with the problem and the AI's responses.

---

## 3. Zone of Proximal Development & Scaffolding (Vygotsky, 1978; Wood, Bruner & Ross, 1976)

**What it is.** The ZPD is the space between what a learner can do independently and what they can achieve with guidance. Scaffolding provides temporary support structures that are gradually removed as competence grows.

**How it maps to CoReason.** The MC-scaffolded mode functions as explicit scaffolding: students who cannot yet articulate their own framing or critique can select from AI-generated options. As students develop competence, they transition to open-ended mode where scaffolds are removed. Practice mode (with per-phase feedback) provides additional scaffolding that assessment mode withdraws. The AI itself serves as a ZPD partner, operating at a level just beyond the student's current ability, generating solutions that contain identifiable but non-trivial flaws for students to find.

Recent research confirms this framing: AI, through a Vygotskian lens, serves as a "more capable partner" that offers adaptive scaffolding critical for cognitive development (Frontiers in Education, 2025).

**Alignment: Strong.** The dual-mode design (MC vs. open-ended) and dual-context design (practice vs. assessment) map directly onto scaffolding theory. However, the transition between modes is currently instructor-controlled rather than adaptive.

---

## 4. Metacognition and Self-Regulated Learning (Flavell, 1979; Zimmerman, 2002)

**What it is.** Metacognition is "thinking about thinking" -- the ability to monitor, evaluate, and regulate one's own cognitive processes. Self-regulated learning (SRL) involves setting goals, selecting strategies, monitoring progress, and reflecting on outcomes.

**How it maps to CoReason.** Each phase implicitly demands metacognition. Framing requires students to recognize what they do not know. Judging requires them to evaluate the quality of reasoning (both the AI's and, implicitly, their own). Steering requires strategic thinking about what corrections will be most effective. The iterative cycle (judge, steer, judge again) creates a natural self-regulation loop: students see the consequences of their steering decisions and adjust.

A 2025 bibliometric review found that AI systems increasingly scaffold metacognition by providing real-time feedback and strategic prompts, while learning analytics dashboards help externalize metacognitive processes by tracking learner progress and supporting reflection (PMC, 2025).

**Alignment: Moderate.** CoReason implicitly exercises metacognition but does not explicitly prompt metacognitive reflection. Students are not asked "What strategy did you use?" or "What would you do differently?" The analytics dashboard shows outcomes (grades) but does not surface metacognitive insights.

---

## 5. Formative Assessment Theory (Black & Wiliam, 1998)

**What it is.** Formative assessment is the ongoing collection of evidence about student learning to inform instruction and guide next steps. Black and Wiliam's research showed that formative assessment raises achievement more effectively than most other interventions. Their five key strategies include: clarifying learning intentions, engineering evidence-eliciting tasks, providing feedback that moves learners forward, activating students as learning resources for each other, and activating students as owners of their own learning.

**How it maps to CoReason.** Practice mode is explicitly formative: feedback after each phase tells students where they stand and (implicitly) what to improve. Assessment mode is summative. The A/B/C grading by the LLM provides rapid formative data to both students and instructors. The analytics dashboard with grade distributions and trends provides instructors with class-level formative data to adjust their teaching.

**Alignment: Moderate.** CoReason implements formative assessment through practice mode feedback and analytics. However, the feedback is evaluative (a grade) rather than descriptive (specific guidance on what to improve). Black and Wiliam emphasize that effective formative feedback must be actionable, not merely judgmental.

---

## 6. Assessment FOR Learning vs. Assessment OF Learning

**What it is.** Assessment FOR learning uses assessment as a tool to improve learning during the process. Assessment OF learning measures achievement at the end. The distinction, advanced by the Assessment Reform Group (2002), emphasizes that the two serve fundamentally different purposes and require different designs.

**How it maps to CoReason.** Practice mode is assessment FOR learning; assessment mode is assessment OF learning. The platform cleanly separates these two functions. However, the underlying task structure is identical in both modes -- only the timing of feedback differs.

**Alignment: Moderate.** The separation is clear, but assessment FOR learning should ideally feature different task designs (more scaffolding, more hints, more formative prompts) rather than simply revealing feedback earlier. Currently, the only difference is feedback timing.

---

## 7. Productive Failure (Kapur, 2008, 2016)

**What it is.** Productive Failure is a learning design where students attempt challenging problems before receiving instruction. Initial failure activates prior knowledge, reveals knowledge gaps, and creates "desirable difficulties" that deepen subsequent learning. Kapur identifies four core mechanisms: activation and differentiation of prior knowledge, attention to critical features, organization and elaboration of knowledge, and assembly of canonical solutions.

**How it maps to CoReason.** The Framing phase embodies productive failure: students confront an ill-defined problem and must grapple with its ambiguities before seeing any AI-generated solution. This struggle is by design. The Judging phase then provides a "consolidation" moment -- students see a solution (the AI's) and must evaluate it against the understanding they built during Framing. The iterative steering cycle extends this: students' initial steering attempts may be imperfect (productive failure), and seeing the AI's revised output reveals whether their correction strategy was effective.

Kapur's 2025 SXSW EDU keynote warned that "the promise of generative AI could easily lure us into thinking that we now have tools to skip the struggling phase of learning" -- CoReason's design deliberately preserves the struggle.

**Alignment: Strong.** The three-phase model naturally creates productive failure conditions. Students struggle with framing before seeing solutions, and their steering attempts may fail productively. The key is that the platform does not let students skip the struggle.

---

## 8. Cognitive Apprenticeship (Collins, Brown & Newman, 1989)

**What it is.** Cognitive apprenticeship makes expert thinking visible through six methods: modeling, coaching, scaffolding, articulation, reflection, and exploration. Unlike traditional apprenticeship (focused on physical skills), cognitive apprenticeship externalizes the invisible processes of expert reasoning.

**How it maps to CoReason.** The AI's solution serves as a form of modeling -- it makes one possible reasoning process visible for inspection. The rubric-based feedback provides coaching. The MC mode provides scaffolding. Articulation occurs when students must express their critique (Judging) and corrections (Steering) explicitly. However, reflection and exploration are less directly supported.

**Alignment: Moderate.** CoReason implements modeling, scaffolding, coaching, and articulation well. Reflection and exploration are underrepresented. Students do not have structured opportunities to reflect on their reasoning process or explore alternative approaches beyond the current challenge.

---

## 9. Deliberate Practice (Ericsson, 1993)

**What it is.** Deliberate practice involves focused, effortful practice with clear goals, immediate feedback, and progressive difficulty. It is distinct from mere repetition; it requires concentration on specific aspects of performance that need improvement.

**How it maps to CoReason.** Practice mode aligns with deliberate practice: students receive per-phase feedback and can attempt multiple challenges. The A/B/C grading provides performance benchmarks. However, deliberate practice requires that activities be targeted at specific weaknesses and progressively increase in difficulty.

**Alignment: Weak to Moderate.** CoReason provides the feedback loop necessary for deliberate practice but lacks adaptive difficulty and targeted weakness remediation. All students receive the same challenges regardless of their performance profile. There is no mechanism to say "you struggle with Framing -- here are challenges that specifically exercise that skill."

---

## 10. Self-Determination Theory (Deci & Ryan, 1985, 2000)

**What it is.** SDT identifies three basic psychological needs that drive intrinsic motivation: autonomy (feeling in control of one's actions), competence (feeling effective), and relatedness (feeling connected to others). When these needs are met, intrinsic motivation flourishes.

**How it maps to CoReason.**

- **Autonomy**: Open-ended mode supports autonomy by letting students express their own thinking. Assessment mode somewhat undermines autonomy by constraining the context. Students currently cannot choose which challenges to attempt or set their own goals.
- **Competence**: The A/B/C grading system provides competence feedback. Analytics showing trends over time can build a sense of growing mastery. However, 2025 research suggests competence satisfaction is the most important SDT factor in AI-enriched learning environments (Frontiers in Psychology, 2025).
- **Relatedness**: This is CoReason's weakest SDT dimension. The platform is currently an individual activity. There are no peer interactions, no collaborative challenges, and no community features.

**Alignment: Weak to Moderate.** Competence support is reasonable, autonomy support is partial, and relatedness support is largely absent. SDT research consistently shows that all three needs must be met for sustained intrinsic motivation.

---

## 11. Epistemic Cognition (Hofer & Pintrich, 1997; Chinn, Buckland & Samarapungavan, 2011)

**What it is.** Epistemic cognition concerns how individuals think about the nature of knowledge and knowing -- questions of certainty, justification, sources, and complexity. It is the cognitive prerequisite for critical thinking and is central to evaluating AI-generated content.

**How it maps to CoReason.** The entire platform is an exercise in epistemic cognition. Students must evaluate the AI's output as a knowledge source: Is it reliable? Is its reasoning justified? Are its claims supported? The Framing phase develops epistemic complexity (recognizing that problems have multiple valid framings). The Judging phase develops evaluative judgment about knowledge quality. Recent scholarship emphasizes that reclaiming "epistemic agency" through reflective pedagogy is essential in AI-rich environments (Frontiers in Education, 2025).

**Alignment: Strong (implicit), Moderate (explicit).** CoReason deeply exercises epistemic cognition but does not name it or help students develop explicit awareness of their epistemic reasoning. Students are not prompted to consider why they trust or distrust the AI's output, only whether it is correct.

---

## 12. Human-AI Teaming & AI Literacy Frameworks

**What it is.** Emerging frameworks define the competencies humans need to work effectively alongside AI systems. The European Commission's 2025 AI Literacy Framework outlines essential knowledge, skills, and attitudes for understanding and interacting with AI systems confidently and critically. The GenAI-CT framework (2025) comprises three components: Cognitive Scaffolding, Dialogic Mediation, and Iterative Development.

**How it maps to CoReason.** CoReason is inherently a human-AI teaming platform. Students learn to work with AI as a reasoning partner -- not blindly accepting its output, not ignoring it, but critically engaging with it. This maps directly to AI literacy goals. The three-phase model aligns with the GenAI-CT framework's iterative development component. However, CoReason does not explicitly teach students about how the AI works, its limitations, or its biases.

**Alignment: Moderate.** CoReason builds practical AI collaboration skills (evaluating, directing, correcting AI output) but does not develop conceptual AI literacy (understanding how the AI generates its responses, why it makes certain errors, or what its systematic biases are).

---

## 13. Collaborative Intelligence (Markova & McArthur, 2015; Agrawal et al., 2022)

**What it is.** Collaborative intelligence posits that the combination of human and machine intelligence can exceed either alone. Recent research identifies two interaction patterns in educational settings: AI-led Supported Exploratory Questioning and Learner-Initiated Inquiry, both producing meaningful cognitive and socio-emotional engagement (British Journal of Educational Technology, 2025).

**How it maps to CoReason.** The three-phase model creates a division of cognitive labor: the AI generates solutions (leveraging computational breadth), while the student provides critical evaluation and direction (leveraging human judgment, context-sensitivity, and values). This is collaborative intelligence by design. The iterative judging-steering cycle is a dialogue between human and machine reasoning.

**Alignment: Strong.** CoReason's core interaction model exemplifies collaborative intelligence. The human-AI division of labor is well-designed: the AI does what it does best (generating solutions quickly) while the student does what humans do best (evaluating, contextualizing, and directing).

---

## 14. Transfer-Appropriate Processing & Situated Cognition (Morris et al., 1977; Brown, Collins & Duguid, 1989)

**What it is.** Transfer-appropriate processing holds that learning is most effective when practice conditions match the conditions under which knowledge will be used. Situated cognition argues that knowledge is inseparable from the context in which it is learned and applied.

**How it maps to CoReason.** CoReason's use of ill-defined, realistic problems aligns with situated cognition -- students practice critical thinking in contexts similar to where they will use it (evaluating AI outputs in professional and academic settings). The subject-tree-based challenge system allows instructors to situate problems within specific disciplinary contexts.

**Alignment: Moderate.** Problem authenticity depends heavily on challenge design quality. The platform provides the infrastructure for situated learning but does not guarantee it.

---

## 15. Dialogic Teaching & Accountable Talk (Alexander, 2008; Resnick et al., 2010)

**What it is.** Dialogic teaching uses structured dialogue as the primary vehicle for learning. Students develop understanding through articulating, defending, and refining ideas in conversation. Accountable talk requires students to be accountable to the learning community, to accurate knowledge, and to rigorous thinking.

**How it maps to CoReason.** The judging-steering cycle is a form of asynchronous dialogue between student and AI. Students articulate critiques and corrections; the AI responds. This creates an "accountable" exchange where the student must be precise and specific to get results. However, it is a human-machine dialogue rather than human-human dialogue.

**Alignment: Moderate.** The dialogic structure exists but is limited to student-AI interaction. There is no peer dialogue, no instructor-student dialogue within the platform, and no mechanism for students to compare and debate their framings or judgments.

---

## Summary: Alignment Matrix

| Theory | Alignment | Key Gap |
|--------|-----------|---------|
| Bloom's Revised Taxonomy | Strong | -- |
| Constructivism | Strong | -- |
| ZPD / Scaffolding | Strong | Adaptive scaffolding transitions |
| Metacognition / SRL | Moderate | No explicit metacognitive prompts |
| Formative Assessment | Moderate | Feedback is evaluative, not descriptive |
| Assessment FOR/OF Learning | Moderate | Same task design in both modes |
| Productive Failure | Strong | -- |
| Cognitive Apprenticeship | Moderate | Missing reflection and exploration |
| Deliberate Practice | Weak-Moderate | No adaptive difficulty or targeted practice |
| Self-Determination Theory | Weak-Moderate | Relatedness absent; limited autonomy |
| Epistemic Cognition | Moderate | Implicit but not explicit |
| Human-AI Teaming / AI Literacy | Moderate | No conceptual AI literacy instruction |
| Collaborative Intelligence | Strong | -- |
| Situated Cognition | Moderate | Depends on challenge quality |
| Dialogic Teaching | Moderate | No peer or instructor dialogue |

---

## Top 10 Theory-Driven Improvements

### 1. Add Descriptive Feedback, Not Just Grades
**Theory:** Formative Assessment (Black & Wiliam)
**Current state:** Students receive A/B/C grades per phase.
**Proposal:** Supplement grades with specific, actionable feedback: "Your framing identified the budget constraint but missed the timeline ambiguity. Strong framings in this domain typically consider temporal factors." This transforms evaluative feedback into formative feedback that students can act on.

### 2. Introduce Explicit Metacognitive Prompts
**Theory:** Metacognition / Self-Regulated Learning
**Proposal:** After completing a challenge, prompt students with reflection questions: "Which phase was hardest for you and why?", "What strategy did you use to evaluate the AI's solution?", "What would you do differently next time?" Display metacognitive growth trends alongside grade trends in analytics.

### 3. Implement Adaptive Difficulty Progression
**Theory:** Deliberate Practice (Ericsson), ZPD (Vygotsky)
**Proposal:** Track per-phase performance and automatically recommend challenges that target weak areas. A student who consistently scores A on Framing but C on Steering should receive challenges that emphasize the steering skill. Introduce difficulty levels (beginner, intermediate, advanced) that adjust problem complexity and AI solution quality.

### 4. Add Peer Interaction Features
**Theory:** Self-Determination Theory (relatedness), Dialogic Teaching, Constructivism (Vygotsky)
**Proposal:** Allow students to compare their framings or judgments with anonymized peer responses after submitting their own. Introduce optional "debate mode" where two students independently frame the same problem and then see each other's framings. This addresses the relatedness gap and adds human-human dialogue.

### 5. Build an Epistemic Cognition Layer
**Theory:** Epistemic Cognition, AI Literacy
**Proposal:** Add brief contextual prompts that develop epistemic awareness: "The AI generated this solution in 2 seconds using pattern matching across training data. What kinds of errors might that process produce?" Help students understand not just whether the AI is wrong, but why it might be wrong and what that reveals about the nature of AI-generated knowledge.

### 6. Differentiate Practice Mode Task Design
**Theory:** Assessment FOR Learning, Scaffolding
**Proposal:** Practice mode should not simply be assessment mode with earlier feedback. Redesign practice challenges to include: hints available on demand, worked examples of expert framing/judging/steering, the ability to revise responses after seeing feedback, and progressive scaffold removal as students improve.

### 7. Support Student Goal-Setting and Choice
**Theory:** Self-Determination Theory (autonomy), Self-Regulated Learning
**Proposal:** Let students choose which challenges to attempt from a curated set, set personal improvement goals ("I want to improve my Steering grade this week"), and track progress toward self-set targets. Autonomy-supportive environments consistently produce better learning outcomes and sustained motivation.

### 8. Add a Reflection Phase (Fourth Phase)
**Theory:** Cognitive Apprenticeship (reflection), Metacognition, Productive Failure
**Proposal:** After the Steering phase, add an optional Reflection phase where students review their entire interaction: their initial framing, their judgments, their steering decisions, and the final outcome. Prompt them to identify what they learned and what they would change. This closes the learning loop that cognitive apprenticeship theory identifies as essential.

### 9. Introduce Expert Reasoning Exemplars
**Theory:** Cognitive Apprenticeship (modeling), Deliberate Practice
**Proposal:** After completing a challenge (especially in practice mode), show students an expert-level framing, judgment, or steering response. This makes expert thinking visible and gives students a concrete model to aspire to. Include annotations explaining why the expert response is effective.

### 10. Add AI Transparency and Literacy Content
**Theory:** Human-AI Teaming, Collaborative Intelligence, Epistemic Cognition
**Proposal:** Include brief, contextual information about how the AI generates its responses. When students encounter AI errors in the Judging phase, explain the category of error (hallucination, over-generalization, context neglect, etc.). Over time, students develop a mental model of AI capabilities and limitations, building the AI literacy that 2025 frameworks identify as essential for educated citizens.

---

## References and Further Reading

- Anderson, L. W., & Krathwohl, D. R. (2001). *A Taxonomy for Learning, Teaching, and Assessing*. Longman.
- Black, P., & Wiliam, D. (1998). Assessment and classroom learning. *Assessment in Education*, 5(1), 7-74.
- Brown, J. S., Collins, A., & Duguid, P. (1989). Situated cognition and the culture of learning. *Educational Researcher*, 18(1), 32-42.
- Chinn, C. A., Buckland, L. A., & Samarapungavan, A. (2011). Expanding the dimensions of epistemic cognition. *Educational Psychologist*, 46(3), 141-167.
- Collins, A., Brown, J. S., & Newman, S. E. (1989). Cognitive apprenticeship. In L. B. Resnick (Ed.), *Knowing, Learning, and Instruction*. LEA.
- Deci, E. L., & Ryan, R. M. (2000). The "what" and "why" of goal pursuits. *Psychological Inquiry*, 11(4), 227-268.
- Ericsson, K. A., Krampe, R. T., & Tesch-Romer, C. (1993). The role of deliberate practice. *Psychological Review*, 100(3), 363-406.
- Flavell, J. H. (1979). Metacognition and cognitive monitoring. *American Psychologist*, 34(10), 906-911.
- Kapur, M. (2016). Examining productive failure, productive success, and other conditions. *Instructional Science*, 44(3), 273-286.
- Vygotsky, L. S. (1978). *Mind in Society*. Harvard University Press.
- Wood, D., Bruner, J. S., & Ross, G. (1976). The role of tutoring in problem solving. *Journal of Child Psychology and Psychiatry*, 17(2), 89-100.
- Zimmerman, B. J. (2002). Becoming a self-regulated learner. *Theory Into Practice*, 41(2), 64-70.

### 2025 Sources

- [Critical Thinking in the Age of AI: A Systematic Review](https://files.eric.ed.gov/fulltext/EJ1459623.pdf)
- [Mapping a Multidimensional Framework for GenAI in Education (EDUCAUSE)](https://er.educause.edu/articles/2025/4/mapping-a-multidimensional-framework-for-genai-in-education)
- [GenAI-mediated Scaffolds for Enhanced Critical Thinking](https://learning-gate.com/index.php/2576-8484/article/view/7751)
- [Scaffolding of Metacognition and Learning by AI Tools in STEM (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12653222/)
- [Beyond Efficiency: GenAI's Impact on Cognition, Metacognition and Epistemic Agency](https://bera-journals.onlinelibrary.wiley.com/doi/abs/10.1111/bjet.70000)
- [Epistemic Authority and Generative AI in Learning Spaces](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2025.1647687/pdf)
- [EU AI Literacy Framework (Draft, May 2025)](https://ailiteracyframework.org/wp-content/uploads/2025/05/AILitFramework_ReviewDraft.pdf)
- [Human-AI Collaboration in Hybrid Intelligence Learning Environments](https://www.nature.com/articles/s41599-025-05097-z)
- [Collaborative AI Literacy and Metacognition Scales](https://www.tandfonline.com/doi/full/10.1080/10447318.2025.2543997)
- [Self-Determination Theory and AI: The Human Touch](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1568239/full)
- [Protecting Human Cognition in the Age of AI](https://arxiv.org/html/2502.12447v3)
- [Productive Failure: Four Core Mechanisms (Kapur)](https://www.manukapur.com/productive-failure/)
- [Mapping the Evolution of AI in Education: Toward a Co-Adaptive Paradigm](https://www.sciencedirect.com/science/article/pii/S2666920X25001535)
