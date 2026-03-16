# Session 2 — Emergency Executive Power Memorandum (Open-Ended)

**Challenge:** Separation of Powers > Executive Power > Executive Orders & Unilateral Action
**Mode:** Open-Ended (Structured Sections)
**Student:** Jordan W.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Prepare an Office of Legal Counsel-style memorandum analyzing whether the President may, without congressional authorization, order the military to seize and operate privately owned semiconductor fabrication facilities during a declared national security emergency. A foreign adversary has imposed an export ban that cuts off "critical chip supplies," and the President's national security advisors say the shortage will "cripple defense systems within six months." The memo should address the constitutional basis for such action, applicable statutory frameworks, and relevant precedent. Congress has "not acted" on proposed emergency procurement legislation. Some members of Congress have publicly opposed executive seizure.

### Student's Framing Response

> **Assumption: This is fundamentally a Youngstown Sheet & Tube problem — presidential seizure of private property during a national security crisis without explicit congressional authorization.**
>
> **Assumption: Congress has "not acted" — I need to determine whether this places the action in Youngstown Category 2 (congressional silence) or Category 3 (congressional disapproval). The fact that members have "publicly opposed" seizure suggests Category 3, but public statements alone may not constitute formal congressional action.**
>
> **Question: Does the Defense Production Act (DPA) provide statutory authority that might move this from Category 3 to Category 1? I'll need to analyze whether the DPA authorizes physical seizure of facilities or only priority ordering and allocation.**
>
> **Constraint: An OLC memo requires presenting the best legal argument for executive authority while acknowledging significant counterarguments — it is not a brief advocating one side.**

### AI Solution (Generated from Student's Framing)

**OFFICE OF LEGAL COUNSEL MEMORANDUM**

**RE:** Presidential Authority to Seize Semiconductor Fabrication Facilities During National Security Emergency

**I. Question Presented**
Whether the President may order the military to seize and operate privately owned semiconductor fabrication facilities without congressional authorization during a declared national security emergency caused by a foreign adversary's export ban.

**II. Brief Answer**
The President likely possesses sufficient constitutional authority to order temporary seizure under the Commander-in-Chief and Take Care clauses, particularly given the declared national security emergency. However, this conclusion is not free from doubt, and the strongest analogy — Youngstown Sheet & Tube Co. v. Sawyer — suggests significant vulnerability to judicial challenge.

**III. Analysis**

*A. Constitutional Basis*
The President's authority to act unilaterally in national security emergencies derives from Article II: the Commander-in-Chief clause, the executive vesting clause, and the Take Care clause. Historical practice supports broad presidential emergency action, including Lincoln's suspension of habeas corpus, FDR's seizure of industrial plants during WWII under statutory authority, and Truman's attempted steel seizure.

*B. Youngstown Framework*
Under Justice Jackson's tripartite framework:
- Category 1 (express or implied congressional authorization): The Defense Production Act authorizes the President to require priority performance of contracts and to allocate materials. However, the DPA does not explicitly authorize physical seizure and operation of facilities.
- Category 2 (congressional silence): The President may act on independent constitutional authority. Congress's failure to pass proposed emergency procurement legislation may indicate acquiescence or disapproval — the inference is ambiguous.
- Category 3 (contrary to congressional will): If congressional opposition is construed as disapproval, executive power is at its "lowest ebb" and the seizure is sustainable only if the power is exclusively presidential.

*C. Conclusion*
The seizure is most defensible as a Category 2 action, supported by inherent Commander-in-Chief authority in the national defense context. However, the Youngstown precedent — which struck down Truman's steel seizure under closely analogous facts — presents a substantial obstacle.

### Framing Feedback

**Criticism:** The student's framing was strong. Identifying Youngstown as the controlling framework was exactly right, and the nuanced treatment of congressional silence vs. disapproval (Category 2 vs. 3) demonstrates sophisticated understanding of the Jackson concurrence. Noting the OLC memo's distinctive genre conventions was also important. However, the student did not question the Takings Clause dimension — seizure of private property implicates the Fifth Amendment regardless of the separation of powers analysis. The student also did not ask whether the National Emergencies Act or International Emergency Economic Powers Act (IEEPA) might provide alternative statutory bases, and did not flag the distinction between temporary seizure and permanent taking, which affects both the constitutional analysis and the remedy.

**Better Alternative Framing:**
> "Assumption: Youngstown is the controlling framework. Question: Does congressional opposition rise to the level of Category 3, or is it merely Category 2? Question: Beyond the DPA, do the National Emergencies Act or IEEPA provide statutory hooks? Critical gap: The problem does not address the Takings Clause — seizure of private property requires just compensation under the Fifth Amendment regardless of the source of authority. Question: Is this a temporary seizure or permanent taking? The distinction affects both the constitutional analysis and available remedies."

**Grade: A** — Excellent Youngstown analysis, but missed the Takings Clause and alternative statutory bases.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Error"
    description: "Category 2 default is unjustified — facts support Category 3"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Add: Insert a section analyzing the Fifth Amendment Takings Clause"
    description: "Add: Insert a section analyzing the Fifth Amendment Takings Clause. Address whether the seizure constitutes a per se taking under Loretto v. Teleprompter Manhattan CATV Corp. (physical occupation of private property), whether the temporary nature of the seizure affects the takings analysis, and what compensation obligations arise. Note that the takings issue is independent of the separation of powers question — the President might have authority to seize but still owe just compensation."
  - name: "Revise: Strengthen the Category 3 analysis"
    description: "Revise: Strengthen the Category 3 analysis. The memo currently defaults to Category 2, but the facts support Category 3. Analyze whether congressional members' public opposition plus the failure to pass enabling legislation constitutes sufficient"

#### Updated AI Output

**III. Analysis (Revised)**

*(Section A retained)*

*B. Youngstown Framework (Revised)*
The most honest assessment places this action in Category 3. Congress had before it proposed emergency procurement legislation and declined to act, while individual members publicly opposed executive seizure. Under Dames & Moore v. Regan, legislative inaction in the face of a specific proposal can constitute implied disapproval. At its lowest ebb, presidential power is sustainable only if the seized authority is exclusively presidential — a heavy burden. The Commander-in-Chief power provides the strongest basis, but Youngstown itself rejected the argument that the Commander-in-Chief clause authorizes domestic seizure of industrial facilities. The critical distinction the President would need to draw is that semiconductor fabrication is directly integrated into the defense supply chain in a way that steel mills in 1952 were not — chips are literal components of weapons systems, not merely inputs to military production.

*C. Fifth Amendment Takings Analysis*
Even if Article II authority supports the seizure, the Fifth Amendment independently requires just compensation. Under Loretto v. Teleprompter Manhattan CATV Corp., a physical occupation of private property constitutes a per se taking regardless of the government's purpose or the economic impact on the owner. Military seizure and operation of a fabrication facility is unambiguously a physical occupation. The temporary nature of the seizure does not eliminate the compensation obligation but may reduce the measure of damages — the government would owe fair rental value plus any diminution in the facility's value during the period of occupation, rather than the full market value of the facility. This creates a practical constraint: the government must be prepared to fund compensation, which requires either an existing appropriation or a supplemental appropriation from Congress — reintroducing the very congressional cooperation the President is attempting to bypass.

*D. Revised Conclusion*
The seizure faces substantial legal obstacles: Category 3 status under Youngstown, adverse precedent from the steel seizure case, and Fifth Amendment compensation obligations that may require congressional appropriation. The strongest path would be for the President to invoke existing DPA authority for priority ordering and allocation — a less aggressive action with clearer statutory support — while simultaneously requesting emergency legislation for direct seizure authority.

#### Judging Feedback

**Criticism:** The student's judgement was excellent on both counts. The Takings Clause omission was the most significant gap in the original memo — a real OLC memorandum that ignored the Fifth Amendment dimension of a property seizure would be professionally deficient. The Category 3 correction was also well-reasoned, and the student's argument about congressional inaction plus vocal opposition was doctrinally sound. The student could have additionally flagged that the AI's original memo did not address whether existing emergency declarations satisfy the procedural requirements of the National Emergencies Act, but this is a secondary concern.

**Better Alternative Judgement:**
> "Gap: No Takings Clause analysis — physical seizure is a per se taking under Loretto. Error: Category 2 default is unjustified — facts support Category 3. Gap: No analysis of National Emergencies Act procedural requirements."

**Grade: A** — Identified the two most significant issues with clear doctrinal reasoning.

#### Steering Feedback

**Criticism:** The steering was outstanding. The Takings Clause instruction was specific (citing Loretto, addressing temporal limitations, noting the compensation-appropriation circularity) and produced a nuanced analysis. The Category 3 instruction correctly pushed the memo toward intellectual honesty. The compensation-appropriation circularity point — that funding compensation may itself require Congress — was a sophisticated insight that enriched the analysis substantially.

**Grade: A** — Precise, doctrinally rich steering that produced a materially stronger memo.

---

### Cycle 2

**Current AI Output:** *(revised memo with Takings Clause and Category 3 analysis)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "IEEPA not considered as complementary authority. Minor: Conclusion blurs legal analysis with policy recommendation — these should be separated. Minor: DPA 'national defense' definition may not clearly encompass chip supply disruptions"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Revise: Expand the DPA recommendation with specific"
    description: "Revise: Expand the DPA recommendation with specific statutory provisions. Explain that Title I (50 U.S.C. § 4511) authorizes priority performance of contracts for national defense, and Title III (50 U.S.C. § 4533) authorizes government investment to expand productive capacity — but neither authorizes physical seizure. Clarify the gap between what the DPA permits and what the President seeks to do."
  - name: "Add: Briefly note whether IEEPA (50 U.S.C"
    description: "Add: Briefly note whether IEEPA (50 U.S.C. § 1701 et seq.) provides authority for complementary actions such as blocking adversary-nation entities' access to U.S. chip technology, which might reduce the urgency of domestic seizure."

#### Updated AI Output

*D. Revised Conclusion (Expanded)*

The seizure faces substantial legal obstacles under both Article II and the Fifth Amendment. The most legally defensible approach is a graduated response using existing statutory authority:

First, invoke DPA Title I (50 U.S.C. § 4511) to issue priority ratings requiring semiconductor fabrication facilities to prioritize defense contracts over commercial orders. This is well within established DPA practice and does not require physical seizure. Second, invoke DPA Title III (50 U.S.C. § 4533) to provide government loans, loan guarantees, or direct investment to expand domestic fabrication capacity — again, within clear statutory authority. Third, invoke IEEPA (50 U.S.C. § 1701 et seq.) to impose sanctions on the adversary nation's semiconductor sector, blocking its entities from accessing U.S. technology and intellectual property.

The critical gap: none of these authorities permits the physical seizure and government operation of a private facility. If the President determines that seizure is operationally necessary, the legally sound path is to request emergency legislation — which also addresses the Fifth Amendment compensation funding problem. Unilateral seizure without congressional authorization would face Category 3 Youngstown scrutiny and almost certain judicial challenge, with Youngstown itself as adverse controlling precedent.

#### Judging Feedback

**Criticism:** The student's focus on statutory specificity was well-placed — an OLC memo that recommends using the DPA without specifying which provisions apply would be unhelpful to its audience. The IEEPA suggestion was a useful addition. However, the student could have pushed further on the memo's tone: the revised conclusion now reads more like a policy recommendation than a legal analysis. An OLC memo should state the legal conclusion (authority likely does not exist for unilateral seizure) and separately present the policy alternatives. The student also did not flag that the AI's DPA analysis does not address whether the DPA's existing definitions of "national defense" encompass semiconductor supply chain disruptions.

**Better Alternative Judgement:**
> "Gap: DPA recommendation lacks statutory specificity. Gap: IEEPA not considered as complementary authority. Minor: Conclusion blurs legal analysis with policy recommendation — these should be separated. Minor: DPA 'national defense' definition may not clearly encompass chip supply disruptions."

**Grade: A** — Good statutory focus but missed the genre and definitional issues.

#### Steering Feedback

**Criticism:** The steering was specific and productive — citing exact U.S. Code sections and asking the AI to "clarify the gap between what the DPA permits and what the President seeks" was precise direction. The IEEPA addition enriched the analysis. The instruction could have been stronger by asking the AI to separate the legal conclusion from the policy recommendation, maintaining the OLC memo's analytical genre.

**Grade: A** — Specific and productive, minor genre gap.

---

### Cycle 3 (Final)

**Current AI Output:** *(fully revised memo with statutory analysis and graduated response framework)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "The memo now provides a comprehensive analysis"
    description: "The memo now provides a comprehensive analysis: Youngstown framework with honest Category 3 assessment, Takings Clause with Loretto analysis, specific statutory alternatives under the DPA and IEEPA, and a clear legal conclusion. The remaining issue — separating legal conclusion from policy recommendation — is a presentational concern rather than a substantive gap."

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

The student demonstrated exceptional command of separation of powers doctrine throughout this session. The framing immediately identified Youngstown as the controlling framework and made the sophisticated Category 2 vs. Category 3 distinction — exactly the right analytical move. In judging, the student's strongest contribution was identifying the Takings Clause omission, which was both the most significant gap and the kind of cross-doctrinal issue that separates strong constitutional analysis from adequate analysis. The Category 3 correction showed intellectual honesty — pushing the memo toward a less favorable but more defensible position. Steering was consistently excellent: the Takings Clause instruction produced a nuanced analysis including the compensation-appropriation circularity, and the statutory specificity instruction gave the memo practical value. Minor area for improvement: the student should attend to genre conventions (OLC memos separate legal conclusions from policy recommendations) and definitional questions (does "national defense" under the DPA cover chip supply disruptions?).
