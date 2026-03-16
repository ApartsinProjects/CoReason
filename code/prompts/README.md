# AI CoReasoning Lab — Prompt Library

All prompts are YAML-configured templates (REQ-PLAT-04). Each file contains one or more prompt templates with placeholders in `{{double_braces}}` notation.

## Prompt Inventory

| File | REQ Trace | Used In | Purpose |
|------|-----------|---------|---------|
| `01-generate-problem.yaml` | REQ-STEP-01 | FLOW-03 step 2 | Generate ill-defined raw problem with intentional gaps |
| `02-generate-rubrics.yaml` | REQ-EVAL-01 | FLOW-02 step 9 | Generate 3 rubrics (Frame, Judge, Steer) |
| `03-generate-ai-solution.yaml` | REQ-STEP-02 | FLOW-03 step 5 | AI produces solution based on student framing |
| `04-generate-ai-updated-output.yaml` | REQ-STEP-04 | FLOW-03 step 11 | AI produces updated output after steering |
| `05-generate-framing-mc.yaml` | REQ-RESP-02 | FLOW-03 step 4 | MC options for framing phase |
| `06-generate-judging-mc.yaml` | REQ-RESP-05 | FLOW-03 step 8 | MC options for judging sub-step |
| `07-generate-steering-mc.yaml` | REQ-RESP-04 | FLOW-03 step 10 | MC steering command options |
| `08-evaluate-framing.yaml` | REQ-EVAL-03 | FLOW-03 step 6 | Evaluate student framing (feedback) |
| `09-evaluate-judging.yaml` | REQ-EVAL-03 | FLOW-03 step 14 | Evaluate student judging quality |
| `10-evaluate-steering.yaml` | REQ-EVAL-03 | FLOW-03 step 14 | Evaluate student steering quality |
| `11-grade.yaml` | REQ-EVAL-04 | FLOW-03 steps 6,14,16 | Generic A-D grading prompt |
| `12-generate-example-preview.yaml` | REQ-LIFE-01 | FLOW-02 step 10 | Preview problem during definition |
| `13-generate-distractor-explanations.yaml` | REQ-RESP-02, REQ-EVAL-02 | FLOW-03 | Explanations for MC options (shown after submission) |
