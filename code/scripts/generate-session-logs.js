'use strict';

/**
 * Generate Pedagogical Session Logs
 *
 * Runs a complete challenge session for a diverse set of challenges,
 * then writes annotated markdown logs to docs/session-logs/.
 *
 * Usage:  node code/scripts/generate-session-logs.js
 */

process.env.NODE_ENV = 'development';

const path = require('path');
const fs = require('fs');

// Load environment
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.all'), override: true });

const { loadConfig } = require('../server/utils/config');
const { createLogger } = require('../server/utils/logger');
const { TraceRecorder } = require('../server/utils/trace');
const { LLMService } = require('../server/services/llm.service');
const { ChallengeRunService } = require('../server/services/challenge-run.service');
const { createKnex } = require('../server/db/knexfile');

// --- Configuration ---

const STUDENT_USER_ID = 'd7ecd9a2-d75a-4dce-8b5c-415ff29a15e5'; // Noa Cohen

// Hand-picked diverse set: 2 CS/algo MC, 1 CS open-ended, 1 physics, 1 ethics, 1 education
const TARGET_CHALLENGES = [
  { id: '2a9c3150-16fe-4fbd-8b4c-83188fee98e8', slug: 'sorting-pipeline-for-sensor-data' },
  { id: '226895c9-0804-41d5-a3f5-d3fa204be21d', slug: 'optimizing-graph-traversal' },
  { id: 'dfacf4d9-0368-44a4-b96b-269130741636', slug: 'class-hierarchy-for-a-library-system' },
  { id: 'a06b7c6a-5ae4-4f87-9d75-5332346187fe', slug: 'projectile-motion-analysis' },
  { id: '8bdba25d-2627-4b38-971d-dec0cc708a73', slug: 'the-trolley-problem-revisited' },
  { id: '20ccce77-4380-4801-85c9-150d0b13b6e4', slug: 'designing-a-backward-design-unit-plan' },
];

const DOCS_DIR = path.resolve(__dirname, '../../docs/session-logs');

// Open-ended simulated student responses per phase
const OPEN_ENDED_RESPONSES = {
  framing: {
    'sorting-pipeline-for-sensor-data': 'I think we need to clarify the data volume, whether the sensor data arrives in real-time or batch, and what "sorted" means here — sorted by timestamp, by sensor ID, or by value magnitude. The constraints on memory and latency are also unstated.',
    'optimizing-graph-traversal': 'The problem does not specify whether the graph is directed or undirected, weighted or unweighted, and what metric we are optimizing — time complexity, space, or path quality. We also need to know if the graph fits in memory.',
    'class-hierarchy-for-a-library-system': 'We should first identify the core entities: Book, Patron, Loan, Librarian. The problem does not specify whether digital media is included, whether we need to handle inter-library loans, or what inheritance vs. composition trade-offs are preferred.',
    'projectile-motion-analysis': 'The problem leaves air resistance unspecified. We need to know: is this in a vacuum or with drag? What is the launch angle range? Are we solving for max range, max height, or time of flight? The coordinate system and units should be established.',
    'the-trolley-problem-revisited': 'The classic trolley problem needs reframing for modern contexts. Key ambiguities: Are we analyzing from a utilitarian, deontological, or virtue ethics perspective? Does the "revisited" version include autonomous vehicle scenarios? What are the stakeholder categories?',
    'designing-a-backward-design-unit-plan': 'We need to clarify: What subject and grade level? What are the desired learning outcomes before we design assessments? The backward design framework (Wiggins & McTighe) requires specifying Stage 1 goals first. Are we including formative and summative assessments?',
  },
  judging: {
    'sorting-pipeline-for-sensor-data': 'The AI solution correctly identifies merge sort as appropriate for streaming data but fails to address memory constraints for large datasets. The pipeline architecture is reasonable but the complexity analysis omits the cost of I/O operations.',
    'optimizing-graph-traversal': 'The solution proposes Dijkstra\'s algorithm which is correct for weighted graphs but the analysis ignores negative edge weights. The time complexity is stated correctly but the space analysis for the priority queue is missing.',
    'class-hierarchy-for-a-library-system': 'The class hierarchy uses deep inheritance where composition would be more flexible. The Loan class correctly models the borrowing relationship, but the design violates the Open-Closed Principle by hardcoding media types.',
    'projectile-motion-analysis': 'The solution correctly applies kinematic equations but the air resistance model is oversimplified. The numerical integration approach is appropriate but the step size choice is not justified, which could lead to significant errors at high velocities.',
    'the-trolley-problem-revisited': 'The AI analysis covers utilitarian calculus well but underrepresents deontological objections. The autonomous vehicle parallel is insightful but the stakeholder analysis misses the perspective of the decision-maker\'s psychological burden.',
    'designing-a-backward-design-unit-plan': 'The unit plan follows the backward design stages but the assessment tasks do not fully align with the stated learning objectives. The learning activities are engaging but lack differentiation strategies for diverse learners.',
  },
  steering: {
    'sorting-pipeline-for-sensor-data': 'Please add a memory-bounded variant using external merge sort. Include I/O complexity in the analysis and add a comparison table showing trade-offs between different sorting approaches for streaming data.',
    'optimizing-graph-traversal': 'Add a discussion of Bellman-Ford for graphs with negative weights. Include the space complexity for the priority queue and compare with A* when a heuristic is available. Add a decision flowchart for algorithm selection.',
    'class-hierarchy-for-a-library-system': 'Refactor to use composition over inheritance for media types. Apply the Strategy pattern for checkout policies. Add interface segregation so that digital and physical items share a common contract without forcing unnecessary methods.',
    'projectile-motion-analysis': 'Justify the integration step size using error analysis. Add a quadratic drag model comparison alongside the linear model. Include a sensitivity analysis showing how air resistance affects range at different launch angles.',
    'the-trolley-problem-revisited': 'Strengthen the deontological analysis with Kant\'s categorical imperative. Add the moral psychology dimension — research on what people actually choose vs. what they believe is right. Include the doctrine of double effect.',
    'designing-a-backward-design-unit-plan': 'Add differentiated assessment options for English language learners and students with IEPs. Ensure each assessment task maps explicitly to a specific learning objective. Add formative check-points within the learning activities.',
  },
};

// --- Helpers ---

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function formatFeedback(fb) {
  if (!fb) return '_No feedback available._';
  if (typeof fb === 'string') return fb;
  if (fb.message) return fb.message;
  // Try to produce readable text from the feedback object
  const parts = [];
  if (fb.summary) parts.push(fb.summary);
  if (fb.strengths) parts.push('**Strengths:** ' + (Array.isArray(fb.strengths) ? fb.strengths.join('; ') : fb.strengths));
  if (fb.weaknesses) parts.push('**Weaknesses:** ' + (Array.isArray(fb.weaknesses) ? fb.weaknesses.join('; ') : fb.weaknesses));
  if (fb.suggestions) parts.push('**Suggestions:** ' + (Array.isArray(fb.suggestions) ? fb.suggestions.join('; ') : fb.suggestions));
  if (fb.explanation) parts.push(fb.explanation);
  if (parts.length > 0) return parts.join('\n\n');
  // Fallback: JSON
  return '```json\n' + JSON.stringify(fb, null, 2) + '\n```';
}

function responseDescription(response, isMC) {
  if (isMC) {
    if (typeof response === 'string') return `Selected option: **${response}**`;
    if (response && response.letter) return `Selected option **${response.letter}**: ${response.text || ''}`;
    return `Selected: ${JSON.stringify(response)}`;
  }
  return response || '_No response_';
}

// --- Main ---

async function main() {
  const config = loadConfig();
  const logger = createLogger({ ...config.logging, file: false, trace: false });
  const db = createKnex(config);
  const tracer = new TraceRecorder(logger);

  let llmService;
  try {
    llmService = new LLMService(config, logger, tracer);
    if (!llmService.providers || llmService.providers.length === 0) {
      logger.warn('No LLM providers available — session logs will use fallback content');
    }
  } catch (err) {
    logger.error('Failed to create LLM service', { error: err.message });
    process.exit(1);
  }

  const runService = new ChallengeRunService(db, logger, llmService);

  // Ensure output directory exists
  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
  }

  // Verify the student user exists
  const user = await db('users').where({ id: STUDENT_USER_ID }).first();
  if (!user) {
    logger.error('Student user not found', { userId: STUDENT_USER_ID });
    await db.destroy();
    process.exit(1);
  }
  logger.info(`Using student: ${user.full_name} (${user.email})`);

  const results = [];

  for (const target of TARGET_CHALLENGES) {
    const { id: challengeId, slug } = target;
    logger.info(`\n========== Processing: ${slug} ==========`);

    try {
      // Look up the challenge to get its details
      const challenge = await db('challenges').where({ id: challengeId }).first();
      if (!challenge) {
        logger.warn(`Challenge not found: ${challengeId}, skipping`);
        continue;
      }

      const respCfg = JSON.parse(challenge.response_config || '{}');
      const phase1Type = respCfg.phase1 || respCfg.framing || 'mc';
      const phase2Type = respCfg.phase2 || respCfg.judging || respCfg.steering || 'mc';
      const isMCPhase1 = phase1Type === 'mc';
      const isMCPhase2 = phase2Type === 'mc';

      // ----- Phase 1: Start Run -----
      logger.info('  [1/5] Starting run...');
      const startResult = await runService.startRun(challengeId, STUDENT_USER_ID);
      const { runId, rawProblem, framingOptions, maxCycles, challengeType } = startResult;
      logger.info(`  Run started: ${runId} (maxCycles=${maxCycles}, type=${challengeType})`);

      // ----- Phase 2: Submit Framing -----
      logger.info('  [2/5] Submitting framing...');
      let framingResponse;
      if (isMCPhase1 && framingOptions && framingOptions.length > 0) {
        framingResponse = framingOptions[0].letter; // pick first option
      } else {
        framingResponse = OPEN_ENDED_RESPONSES.framing[slug] ||
          'I notice several ambiguities in this problem. The scope is unclear, and key constraints are unstated. I would refine the problem by specifying the input format, expected output, and performance requirements.';
      }

      const framingResult = await runService.submitFraming(runId, STUDENT_USER_ID, framingResponse);
      const { aiSolution, framingFeedback, framingGrade, judgingOptions } = framingResult;
      logger.info(`  Framing submitted. Grade: ${framingGrade || 'deferred'}`);

      // ----- Phase 3: Submit Judging (Cycle 1) -----
      logger.info('  [3/5] Submitting judging...');
      let judgingResponse;
      if (isMCPhase2 && judgingOptions && judgingOptions.length > 0) {
        judgingResponse = judgingOptions[0].letter;
      } else {
        judgingResponse = OPEN_ENDED_RESPONSES.judging[slug] ||
          'The AI solution addresses the core problem but contains several gaps. The analysis is incomplete in its treatment of edge cases and the reasoning could be strengthened with more rigorous justification.';
      }

      const judgingResult = await runService.submitJudging(runId, STUDENT_USER_ID, 1, judgingResponse);
      const { steeringOptions } = judgingResult;
      logger.info('  Judging submitted.');

      // ----- Phase 4: Submit Steering (Cycle 1) -----
      logger.info('  [4/5] Submitting steering...');
      let steeringResponse;
      if (isMCPhase2 && steeringOptions && steeringOptions.length > 0) {
        steeringResponse = steeringOptions[0].letter;
      } else {
        steeringResponse = OPEN_ENDED_RESPONSES.steering[slug] ||
          'Please revise the solution to address the identified gaps. Strengthen the analysis with more detailed edge case handling and provide clearer justification for the key design decisions.';
      }

      const steeringResult = await runService.submitSteering(runId, STUDENT_USER_ID, 1, steeringResponse);
      const { updatedSolution, judgingFeedback, judgingGrade, steeringFeedback, steeringGrade } = steeringResult;
      logger.info(`  Steering submitted. Judging grade: ${judgingGrade || 'deferred'}, Steering grade: ${steeringGrade || 'deferred'}`);

      // ----- Phase 5: Mark Complete -----
      logger.info('  [5/5] Marking complete...');
      const completeResult = await runService.markComplete(runId, STUDENT_USER_ID);
      const { grades } = completeResult;
      logger.info(`  Run completed. Grades: F=${grades.framing}, J=${grades.judging}, S=${grades.steering}`);

      // ----- Generate Markdown -----
      const responseMode = isMCPhase1 ? 'MC' : 'open-ended';
      const phase2Mode = isMCPhase2 ? 'MC' : 'open-ended';

      const md = `# Pedagogical Session Log: ${challenge.title}

**Challenge Type**: ${challengeType}
**Response Mode**: Phase 1: ${responseMode}, Phase 2: ${phase2Mode}
**Max Cycles**: ${maxCycles}
**Date**: ${new Date().toISOString().split('T')[0]}

---

## Challenge Overview

This challenge tests the student's ability to engage in co-reasoning with an AI system across three phases: framing (problem definition), judging (critical evaluation of AI output), and steering (directing AI improvement). The "${challenge.title}" challenge focuses on ${getSubjectArea(challenge.title)} and requires students to demonstrate ${challengeType === 'assessment' ? 'summative competency' : 'iterative practice skills'} in human-AI collaboration.

---

## Phase 1: Framing

### Problem Statement (LLM-Generated)

${rawProblem}

**Pedagogical Note**: The problem statement is intentionally open-ended or contains ambiguities that the student must identify and address. This tests the student's ability to recognize unstated assumptions, missing constraints, and scope ambiguities before the AI generates a solution. Strong framing leads to better AI output, teaching students that the quality of AI collaboration depends on the quality of human input.

### Student Response

${responseDescription(framingResponse, isMCPhase1)}

**Pedagogical Note**: ${isMCPhase1
  ? 'In MC mode, the student selects from AI-generated options that represent different approaches to framing the problem. This scaffolds the framing skill by presenting concrete alternatives, helping students learn to distinguish productive from unproductive problem-framing strategies.'
  : 'In open-ended mode, the student must articulate their own framing, demonstrating deeper analytical thinking. This reveals the student\'s ability to identify ambiguities, propose clarifying constraints, and structure the problem space independently.'}

### AI Solution (LLM-Generated)

${aiSolution}

**Pedagogical Note**: The AI solution is generated based on the student's framing. It intentionally may contain gaps, errors, or oversimplifications that the student must identify in the judging phase. This teaches students that AI output is only as good as the input framing and always requires critical evaluation.

### Framing Feedback (LLM-Generated)

${formatFeedback(framingFeedback)}

### Framing Grade: ${framingGrade || grades.framing}

---

## Phase 2: Judging (Cycle 1)

### Student's Judging Response

${responseDescription(judgingResponse, isMCPhase2)}

**Pedagogical Note**: The judging phase tests the student's ability to critically evaluate AI-generated content. ${isMCPhase2
  ? 'MC options include both genuine issues and distractors. Students must distinguish real problems in the AI output from plausible-sounding but incorrect criticisms, developing calibrated critical evaluation skills.'
  : 'Open-ended judging requires the student to independently identify strengths and weaknesses in the AI solution, demonstrating higher-order analytical thinking and domain expertise.'}

---

## Phase 3: Steering (Cycle 1)

### Student's Steering Response

${responseDescription(steeringResponse, isMCPhase2)}

**Pedagogical Note**: Steering tests the student's ability to provide actionable, specific feedback that can improve AI output. ${isMCPhase2
  ? 'MC steering options range from productive corrections to counterproductive suggestions. Students learn to distinguish between feedback that guides AI toward better solutions versus feedback that introduces new problems.'
  : 'Open-ended steering requires the student to formulate clear, specific instructions for improving the AI output. This develops the crucial skill of communicating effectively with AI systems — being precise enough to guide improvement while avoiding over-specification.'}

### Updated AI Solution (LLM-Generated)

${updatedSolution}

**Pedagogical Note**: The updated solution reflects how the AI incorporated the student's steering feedback. Comparing the original and updated solutions helps students see the tangible impact of their guidance, reinforcing the principle that effective steering requires specificity and domain knowledge.

### Judging Feedback: ${formatFeedback(judgingFeedback)}
### Judging Grade: ${judgingGrade || grades.judging}
### Steering Feedback: ${formatFeedback(steeringFeedback)}
### Steering Grade: ${steeringGrade || grades.steering}

---

## Final Grades
- Framing: ${grades.framing}
- Judging: ${grades.judging}
- Steering: ${grades.steering}

## Pedagogical Summary

This session log for "${challenge.title}" demonstrates the co-reasoning assessment model in action. The three-phase structure — framing, judging, and steering — maps to critical competencies for effective human-AI collaboration:

1. **Framing** (problem definition): Tests whether students can identify ambiguities and structure problems before delegating to AI. This prevents the common pitfall of accepting AI output generated from poorly specified prompts.

2. **Judging** (critical evaluation): Tests whether students can identify errors, gaps, and limitations in AI-generated content. This develops the "trust but verify" mindset essential for responsible AI use.

3. **Steering** (directed improvement): Tests whether students can provide actionable feedback to improve AI output. This develops the metacognitive skill of knowing what good output looks like and how to guide AI toward it.

The ${challengeType} mode ${challengeType === 'practice' ? 'provides immediate feedback after each phase, enabling iterative learning' : 'withholds feedback until completion, testing the student\'s independent judgment'}. The ${responseMode}/${phase2Mode} response format ${responseMode === 'MC' ? 'scaffolds the student\'s developing skills with structured options' : 'requires fully independent articulation of analytical reasoning'}.

This challenge, drawn from ${getSubjectArea(challenge.title)}, demonstrates that co-reasoning skills are transferable across domains — the same framing-judging-steering cycle applies whether the student is working with AI on algorithms, physics, ethics, or pedagogy.
`;

      const outPath = path.join(DOCS_DIR, `${slug}.md`);
      fs.writeFileSync(outPath, md, 'utf8');
      logger.info(`  Wrote: ${outPath}`);

      results.push({ slug, success: true, grades });

    } catch (err) {
      logger.error(`  FAILED: ${slug}`, { error: err.message, stack: err.stack });
      results.push({ slug, success: false, error: err.message });
    }
  }

  // Summary
  logger.info('\n========== Summary ==========');
  for (const r of results) {
    if (r.success) {
      logger.info(`  OK  ${r.slug} — Grades: F=${r.grades.framing} J=${r.grades.judging} S=${r.grades.steering}`);
    } else {
      logger.info(`  FAIL ${r.slug} — ${r.error}`);
    }
  }

  await db.destroy();
  logger.info('Done.');
}

function getSubjectArea(title) {
  const t = title.toLowerCase();
  if (t.includes('sort') || t.includes('graph') || t.includes('hash') || t.includes('recursive') || t.includes('bst') || t.includes('class hierarchy') || t.includes('sql') || t.includes('process scheduling')) return 'Computer Science';
  if (t.includes('projectile') || t.includes('motion') || t.includes('physics')) return 'Physics';
  if (t.includes('trolley') || t.includes('ethics')) return 'Ethics and Moral Philosophy';
  if (t.includes('backward design') || t.includes('rubric') || t.includes('multimedia') || t.includes('tutoring') || t.includes('unit plan')) return 'Education and Instructional Design';
  if (t.includes('ehr') || t.includes('ct scan') || t.includes('ecg') || t.includes('lung') || t.includes('arrhythmia')) return 'Health Informatics';
  if (t.includes('eigenvalue') || t.includes('combinatorial') || t.includes('induction')) return 'Mathematics';
  if (t.includes('market') || t.includes('equilibrium')) return 'Economics';
  return 'General';
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
