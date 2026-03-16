# Session 1 — Post-Merger Integration Restructuring Plan (Open-Ended)

**Challenge:** Organizational Structure & Design > Structural Forms > Matrix Organizations
**Mode:** Open-Ended (Structured Sections)
**Student:** Priya M.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Design a restructuring plan for a mid-size European pharmaceutical company (about 4,500 employees across R&D, manufacturing, and commercial) that just acquired a biotech startup of "around 200 people." The CEO wants to "preserve the startup's innovative culture" while "capturing synergies" in shared services. Several senior leaders from both organizations have "overlapping roles." Deliver an organizational chart for the integrated entity, a role rationalization framework, and a transition timeline. The board expects "quick wins within 90 days" but also wants a "sustainable long-term structure." Some startup employees have retention bonuses that expire "in about a year."

### Student's Framing Response

> **Assumption: The startup operates primarily in R&D (drug discovery or early-stage pipeline), so integration is heaviest in the R&D function and lightest in manufacturing.**
>
> **Assumption: "Synergies in shared services" means consolidating finance, HR, IT, and legal — not scientific operations.**
>
> **Constraint: The retention bonus timeline (~1 year) creates a hard deadline — any restructuring that causes critical startup talent to leave before bonuses vest defeats the acquisition rationale.**
>
> **Question: "Overlapping roles" — I'll assume this refers to 5-10 senior positions (VP-level) where both organizations have a head of function.**

### AI Solution (Generated from Student's Framing)

**Organizational Chart:**
```
CEO (Pharma)
├── Chief Scientific Officer
│   ├── Pharma R&D (existing teams)
│   └── Biotech Innovation Unit (startup, semi-autonomous)
│       └── Reports dotted-line to CSO, solid-line to Startup Founder (Chief Innovation Officer)
├── Chief Commercial Officer (existing)
├── Chief Manufacturing Officer (existing)
├── Chief Financial Officer (consolidated)
│   ├── Pharma Finance
│   └── Startup Finance (absorbed)
├── CHRO (consolidated)
└── CIO (consolidated)
```

**Role Rationalization Framework:**
1. Map all VP+ roles across both entities
2. Classify as: Retain Both (distinct scope), Merge (same scope), Redeploy, Eliminate
3. For merged roles, select based on competency assessment + strategic fit
4. Offer transition packages to eliminated roles within 60 days

**Transition Timeline:**
- Days 1-30: Announce structure, appoint integration leads
- Days 31-60: Consolidate shared services (finance, HR, IT)
- Days 61-90: Complete role rationalization for overlapping positions
- Months 4-12: Gradually integrate R&D planning processes while preserving biotech unit autonomy

### Framing Feedback

**Criticism:** The student correctly identified that the startup is likely R&D-focused and that shared services are the logical synergy target — both reasonable inferences. The retention bonus constraint was an important catch. However, the student did not question what "preserving innovative culture" means operationally — which specific practices, processes, or structural features of the startup's culture need protection, and which are incompatible with the acquiring company's governance? The student also did not ask how decision rights will be allocated between the semi-autonomous unit and the parent — budget authority, hiring authority, IP ownership, and project prioritization are all unspecified. Additionally, the student failed to note that the problem says nothing about the geographic dimension (are the startup and pharma co-located or distributed?), which fundamentally affects coordination costs.

**Better Alternative Framing:**
> "Assumption: Startup is R&D-focused. Question: What specific startup practices need protection — is it flat hierarchy, rapid prototyping cycles, risk tolerance in project selection, or something else? Without knowing this, 'preserve culture' is meaningless. Question: What decision authority does the biotech unit retain — can it hire independently, allocate budget, kill projects? Assumption: Shared services synergies are finance, HR, IT. Question: Are the two organizations co-located or in different cities/countries? This affects coordination structure. Constraint: Retention bonuses expire in ~1 year, creating a hard window."

**Grade: B** — Good practical instincts on synergies and retention, but missed the core ambiguity around what cultural preservation actually requires structurally.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Error"
    description: "Role rationalization criteria are too vague"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Add: Define a decision rights matrix for the Biotech Innovation Unit"
    description: "Add: Define a decision rights matrix for the Biotech Innovation Unit — specify which decisions it can make autonomously (hiring, project selection, budget allocation within cap) and which require CSO or CEO approval (budget above threshold, IP licensing, external partnerships)."
  - name: "Revise"
    description: "Specific role rationalization criteria"

#### Updated AI Output

**Decision Rights Matrix — Biotech Innovation Unit:**

| Decision Domain | Unit Autonomy | Requires CSO Approval | Requires CEO/Board Approval |
|---|---|---|---|
| Hiring (below director) | Yes | No | No |
| Hiring (director+) | Recommend | Yes | No |
| Project initiation (< EUR 500K) | Yes | Inform only | No |
| Project initiation (> EUR 500K) | Propose | Yes | No |
| Project termination | Yes | Inform only | No |
| Budget reallocation within cap | Yes | No | No |
| External partnerships / licensing | Propose | Co-approve | Above EUR 2M |
| IP assignment | No | Propose | Yes |

**Revised Role Rationalization Criteria:**

| Dimension | Weight | Assessment Method |
|---|---|---|
| Technical/functional depth | 30% | Panel review of track record |
| Integration leadership capability | 25% | Behavioral interview + references |
| Stakeholder relationship capital | 20% | 360 input from both organizations |
| Adaptability to new operating model | 15% | Structured scenario exercise |
| Cultural bridge potential | 10% | Interview on cross-organizational collaboration history |

**Updated Org Chart:** *(same structure, with decision rights matrix attached to the Biotech Innovation Unit box)*

#### Judging Feedback

**Criticism:** The student correctly identified the two most critical gaps — the missing governance mechanism and the vague role rationalization criteria. The decision rights question was particularly important because dual reporting without clear decision authority is the primary failure mode of matrix structures. However, the student did not flag that the transition timeline collapses shared services consolidation (days 31-60) into a 30-day window, which is unrealistically fast for finance and IT integration and likely to create operational disruption. The student also missed that the org chart places the startup founder as "Chief Innovation Officer" without addressing whether this is a real C-suite role with board access or a courtesy title.

**Better Alternative Judgement:**
> "Gap: No governance mechanism for dual-reporting conflicts. Error: Role rationalization criteria are too vague. Error: 30-day window for shared services consolidation is unrealistic — finance integration alone typically takes 3-6 months. Gap: CIO title for startup founder is undefined — is this a real C-suite seat or a retention title?"

**Grade: A** — Strong identification of the governance gap, missed timeline feasibility and title ambiguity.

#### Steering Feedback

**Criticism:** The steering was well-targeted — the decision rights matrix and evaluation criteria requests directly addressed the identified issues and produced concrete, usable output. The student could have also asked the AI to stress-test the transition timeline against industry benchmarks for post-merger integration.

**Better Alternative Steering:**
> "Add: Decision rights matrix for biotech unit. Revise: Specific role rationalization criteria. Validate: Test the 30-day shared services consolidation window against typical pharma integration timelines and flag if it's unrealistic."

**Grade: A** — Good specificity, missed an opportunity to pressure-test the timeline.

---

### Cycle 2

**Current AI Output:** *(updated version with decision rights matrix and role rationalization criteria)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "No communication plan for a 4,700-person restructuring"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Fix: Revise the transition timeline to distinguish between"
    description: "Fix: Revise the transition timeline to distinguish between"
  - name: "Add: Include a stakeholder communication sequence for"
    description: "Add: Include a stakeholder communication sequence for the first 30 days — specify which groups (board, senior leaders, all employees, external partners, regulators) are informed in what order, through what channel, and with what key message."

#### Updated AI Output

**Revised Transition Timeline — Dual Track:**

| Timeframe | Track 1: Quick Wins (Governance) | Track 2: Deep Integration (Systems) |
|---|---|---|
| Days 1-7 | Board approval, leadership team announced | Integration PMO established |
| Days 8-30 | Decision rights matrix published, interim reporting lines active | IT systems inventory and gap analysis |
| Days 31-60 | Role rationalization decisions communicated | Finance chart-of-accounts mapping |
| Days 61-90 | First integrated leadership offsite, cross-unit projects launched | Shared services operating model designed |
| Months 4-6 | Governance review and adjustment | Finance and HR system migration begins |
| Months 7-12 | Culture integration assessment | IT platform consolidation, process harmonization |

**Communication Sequence — First 30 Days:**

| Day | Audience | Channel | Key Message | Delivered By |
|---|---|---|---|---|
| Day 1 | Board of Directors | Board meeting | Integration plan rationale, leadership appointments, timeline | CEO |
| Day 1 | Senior leaders (VP+), both orgs | In-person / video town hall | Vision, structure, their specific roles, what changes and what doesn't | CEO + Startup Founder |
| Day 2 | All employees, acquiring company | Company-wide email + town hall | Acquisition rationale, no immediate changes to day-to-day work, timeline for updates | CEO |
| Day 2 | All employees, startup | In-person all-hands (startup founder leads) | Commitment to preserving unit identity, retention commitments, what changes in reporting | Startup Founder + CHRO |
| Day 3-5 | Key clients and partners | Personal outreach by account leads | Business continuity assurance, combined capabilities narrative | CCO + account teams |
| Day 7 | Regulators (if applicable) | Formal filing | Compliance with merger notification requirements | General Counsel |
| Day 14 | All employees | FAQ document + manager talking points | Answers to common questions, next milestones | CHRO + Communications |
| Day 30 | All employees | Progress update town hall | What has been decided, what is still in process, how to provide input | CEO |

#### Judging Feedback

**Criticism:** The student caught both important issues — the unrealistic consolidation timeline and the missing communication plan. The distinction between governance quick wins and systems deep integration was particularly insightful and showed understanding of what boards actually mean by "quick wins" in post-merger contexts. However, the student did not notice that the AI's decision rights matrix assigns project termination authority entirely to the biotech unit ("Yes, inform only"), which means the parent company has no ability to redirect resources from a failing project in the startup pipeline. For an acquisition, this degree of autonomy may be strategically dangerous.

**Better Alternative Judgement:**
> "Gap: Timeline is unrealistic for systems integration — split into governance and systems tracks. Gap: No communication plan for a 4,700-person restructuring. Issue: Project termination authority rests entirely with the biotech unit — the parent needs some mechanism to redirect capital from underperforming pipeline assets."

**Grade: A** — Strong practical judgement on timeline and communication, missed a strategic governance issue.

#### Steering Feedback

**Criticism:** The dual-track timeline request was well-conceived and the communication sequence request was appropriately specific. Both produced concrete, actionable deliverables. The student could have also asked the AI to add risk triggers or escalation criteria to the timeline.

**Grade: A** — Clear, actionable corrections that significantly improved the deliverable.

---

### Cycle 3 (Final)

**Current AI Output:** *(dual-track timeline and communication sequence as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Minor: The decision rights matrix gives the biotech unit"
    description: "Minor: The decision rights matrix gives the biotech unit full authority over project termination with"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done**

---

## COMPLETION

### Final Grades

| Skill    | Grade |
|----------|-------|
| Framing  | B     |
| Judging  | A     |
| Steering | A     |

### Summary Feedback

The student demonstrated strong practical instincts throughout the session — correctly identifying synergy targets, catching the retention bonus constraint, and surfacing critical gaps in governance and communication. The framing would have been stronger with deeper questioning of what "preserving innovative culture" means in structural terms and how decision rights should be allocated. In judging, the student consistently improved across cycles, moving from governance gaps to timeline feasibility to strategic authority issues, though the most important observations were sometimes delayed by one cycle. Steering was the strongest skill — each correction was specific enough to produce concrete, usable output rather than generic principles. To improve, the student should practice asking "what does this abstract goal require structurally?" when framing, and "who has authority to do what?" as a default diagnostic question when judging organizational designs.
