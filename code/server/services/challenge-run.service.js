'use strict';

const { v4: uuidv4 } = require('uuid');
const { NotFoundError, ValidationError, ForbiddenError } = require('../utils/errors');

class ChallengeRunService {
  constructor(db, logger, llmService) {
    this.db = db;
    this.logger = logger;
    this.llm = llmService;
  }

  async startRun(challengeId, userId) {
    const challenge = await this.db('challenges').where({ id: challengeId }).first();
    if (!challenge) throw new NotFoundError('Challenge', challengeId);
    if (challenge.status === 'archived') throw new ValidationError('Cannot run an archived challenge');

    const responseConfig = typeof challenge.response_config === 'string'
      ? JSON.parse(challenge.response_config) : challenge.response_config || {};

    // Generate problem via LLM (or use cached)
    let generatedContent = challenge.generated_content
      ? (typeof challenge.generated_content === 'string' ? JSON.parse(challenge.generated_content) : challenge.generated_content)
      : null;

    let rawProblem, framingOptions;

    if (generatedContent?.rawProblem) {
      rawProblem = generatedContent.rawProblem;
      framingOptions = generatedContent.framingOptions;
    } else if (this.llm) {
      // Generate via LLM
      const course = challenge.course_id
        ? await this.db('courses').where({ id: challenge.course_id }).first()
        : null;
      const subjectPath = typeof challenge.subject_path === 'string'
        ? JSON.parse(challenge.subject_path) : challenge.subject_path;

      rawProblem = await this.llm.generateProblem({
        course: course?.name || 'General',
        subject: subjectPath?.join(' > ') || 'General',
        instructions: challenge.instructions,
      });

      if (responseConfig.phase1 === 'mc') {
        framingOptions = await this.llm.generateFramingMC({ rawProblem });
      }

      // Cache generated content
      generatedContent = { rawProblem, framingOptions };
      await this.db('challenges').where({ id: challengeId }).update({
        generated_content: JSON.stringify(generatedContent),
      });
    } else {
      rawProblem = 'LLM service not configured. This is a placeholder problem.';
    }

    // Create run record
    const run = {
      id: uuidv4(),
      challenge_id: challengeId,
      user_id: userId,
      status: 'in_progress',
      current_cycle: 0,
      started_at: new Date().toISOString(),
    };
    await this.db('challenge_runs').insert(run);

    this.logger.info('Challenge run started', { runId: run.id, challengeId, userId });

    return {
      runId: run.id,
      challengeId,
      rawProblem,
      framingOptions: framingOptions || null,
      responseType: responseConfig.phase1 || 'mc',
      maxCycles: challenge.max_cycles || 5,
      challengeType: challenge.challenge_type,
    };
  }

  async submitFraming(runId, userId, response) {
    const run = await this._getRunForUser(runId, userId);
    const challenge = await this.db('challenges').where({ id: run.challenge_id }).first();
    const generatedContent = typeof challenge.generated_content === 'string'
      ? JSON.parse(challenge.generated_content) : challenge.generated_content || {};

    let aiSolution, framingFeedback, framingGrade;

    if (this.llm) {
      // Generate AI solution based on framing
      aiSolution = await this.llm.generateAISolution({
        rawProblem: generatedContent.rawProblem,
        studentFraming: response,
      });

      // Evaluate framing
      const evaluation = await this.llm.evaluateFraming({
        rawProblem: generatedContent.rawProblem,
        studentFraming: response,
      });
      framingFeedback = evaluation.feedback;
      framingGrade = evaluation.grade;
    } else {
      aiSolution = 'LLM not configured. Placeholder AI solution with intentional issues for judging practice.';
      framingFeedback = { message: 'LLM not configured' };
      framingGrade = 'B';
    }

    // Update run
    await this.db('challenge_runs').where({ id: runId }).update({
      framing_response: JSON.stringify(response),
      framing_feedback: JSON.stringify(framingFeedback),
      framing_grade: framingGrade,
      ai_solution: aiSolution,
      current_cycle: 1,
      updated_at: new Date().toISOString(),
    });

    // Generate judging MC options if needed
    const responseConfig = typeof challenge.response_config === 'string'
      ? JSON.parse(challenge.response_config) : challenge.response_config || {};
    let judgingOptions = null;
    if (responseConfig.phase2 === 'mc' && this.llm) {
      judgingOptions = await this.llm.generateJudgingMC({ aiSolution });
    }

    this.logger.info('Framing submitted', { runId, grade: framingGrade });

    return {
      aiSolution,
      framingFeedback: challenge.challenge_type === 'practice' ? framingFeedback : null,
      framingGrade: challenge.challenge_type === 'practice' ? framingGrade : null,
      judgingOptions,
      currentCycle: 1,
    };
  }

  async submitJudging(runId, userId, cycleNum, response) {
    const run = await this._getRunForUser(runId, userId);
    const challenge = await this.db('challenges').where({ id: run.challenge_id }).first();

    // Create or update cycle record
    let cycle = await this.db('challenge_run_cycles')
      .where({ run_id: runId, cycle_num: cycleNum }).first();

    if (!cycle) {
      cycle = {
        id: uuidv4(),
        run_id: runId,
        cycle_num: cycleNum,
      };
      await this.db('challenge_run_cycles').insert(cycle);
    }

    await this.db('challenge_run_cycles')
      .where({ run_id: runId, cycle_num: cycleNum })
      .update({
        judging_response: JSON.stringify(response),
        updated_at: new Date().toISOString(),
      });

    // Generate steering MC options if needed
    const responseConfig = typeof challenge.response_config === 'string'
      ? JSON.parse(challenge.response_config) : challenge.response_config || {};
    let steeringOptions = null;
    if (responseConfig.phase2 === 'mc' && this.llm) {
      steeringOptions = await this.llm.generateSteeringMC({
        aiSolution: run.ai_solution,
        judgingResponse: response,
      });
    }

    this.logger.info('Judging submitted', { runId, cycleNum });

    return { steeringOptions };
  }

  async submitSteering(runId, userId, cycleNum, response) {
    const run = await this._getRunForUser(runId, userId);
    const challenge = await this.db('challenges').where({ id: run.challenge_id }).first();

    // Get current AI solution
    const currentSolution = run.ai_solution;

    let updatedSolution, judgingFeedback, judgingGrade, steeringFeedback, steeringGrade;

    // Get judging response from cycle
    const cycle = await this.db('challenge_run_cycles')
      .where({ run_id: runId, cycle_num: cycleNum }).first();
    const judgingResponse = cycle?.judging_response
      ? (typeof cycle.judging_response === 'string' ? JSON.parse(cycle.judging_response) : cycle.judging_response)
      : null;

    if (this.llm) {
      // Generate updated AI output
      updatedSolution = await this.llm.generateUpdatedOutput({
        currentSolution,
        steeringResponse: response,
      });

      // Evaluate judging
      const judgingEval = await this.llm.evaluateJudging({
        aiSolution: currentSolution,
        judgingResponse,
      });
      judgingFeedback = judgingEval.feedback;
      judgingGrade = judgingEval.grade;

      // Evaluate steering
      const steeringEval = await this.llm.evaluateSteering({
        currentSolution,
        steeringResponse: response,
        updatedSolution,
      });
      steeringFeedback = steeringEval.feedback;
      steeringGrade = steeringEval.grade;
    } else {
      updatedSolution = currentSolution + '\n\n[Updated based on steering - LLM not configured]';
      judgingGrade = 'B';
      steeringGrade = 'B';
      judgingFeedback = { message: 'LLM not configured' };
      steeringFeedback = { message: 'LLM not configured' };
    }

    // Update cycle
    await this.db('challenge_run_cycles')
      .where({ run_id: runId, cycle_num: cycleNum })
      .update({
        steering_response: JSON.stringify(response),
        steering_feedback: JSON.stringify(steeringFeedback),
        steering_grade: steeringGrade,
        judging_feedback: JSON.stringify(judgingFeedback),
        judging_grade: judgingGrade,
        ai_output: updatedSolution,
        updated_at: new Date().toISOString(),
      });

    // Update run's current AI solution and cycle count
    const nextCycle = cycleNum + 1;
    await this.db('challenge_runs').where({ id: runId }).update({
      ai_solution: updatedSolution,
      current_cycle: nextCycle,
      updated_at: new Date().toISOString(),
    });

    // Generate next judging MC if needed and not at max cycles
    const responseConfig = typeof challenge.response_config === 'string'
      ? JSON.parse(challenge.response_config) : challenge.response_config || {};
    let nextJudgingOptions = null;
    if (nextCycle <= (challenge.max_cycles || 5) && responseConfig.phase2 === 'mc' && this.llm) {
      nextJudgingOptions = await this.llm.generateJudgingMC({ aiSolution: updatedSolution });
    }

    const isPractice = challenge.challenge_type === 'practice';

    this.logger.info('Steering submitted', { runId, cycleNum, judgingGrade, steeringGrade });

    return {
      updatedSolution,
      judgingFeedback: isPractice ? judgingFeedback : null,
      judgingGrade: isPractice ? judgingGrade : null,
      steeringFeedback: isPractice ? steeringFeedback : null,
      steeringGrade: isPractice ? steeringGrade : null,
      nextJudgingOptions,
      currentCycle: nextCycle,
      maxCycles: challenge.max_cycles || 5,
    };
  }

  async markComplete(runId, userId) {
    const run = await this._getRunForUser(runId, userId);

    // Aggregate grades
    const cycles = await this.db('challenge_run_cycles')
      .where({ run_id: runId }).orderBy('cycle_num');

    const grades = {
      framing: run.framing_grade || 'C',
      judging: this._aggregateGrade(cycles.map(c => c.judging_grade).filter(Boolean)),
      steering: this._aggregateGrade(cycles.map(c => c.steering_grade).filter(Boolean)),
    };

    await this.db('challenge_runs').where({ id: runId }).update({
      status: 'completed',
      grades: JSON.stringify(grades),
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    this.logger.info('Challenge run completed', { runId, grades });
    return { grades };
  }

  async getRunState(runId, userId) {
    const run = await this._getRunForUser(runId, userId);
    const challenge = await this.db('challenges').where({ id: run.challenge_id }).first();
    const cycles = await this.db('challenge_run_cycles')
      .where({ run_id: runId }).orderBy('cycle_num');

    const generatedContent = challenge.generated_content
      ? (typeof challenge.generated_content === 'string' ? JSON.parse(challenge.generated_content) : challenge.generated_content)
      : {};

    return {
      run: {
        ...run,
        framing_response: run.framing_response ? JSON.parse(run.framing_response) : null,
        framing_feedback: run.framing_feedback ? JSON.parse(run.framing_feedback) : null,
        grades: run.grades ? JSON.parse(run.grades) : null,
      },
      challenge: {
        id: challenge.id,
        title: challenge.title,
        challengeType: challenge.challenge_type,
        responseConfig: typeof challenge.response_config === 'string' ? JSON.parse(challenge.response_config) : challenge.response_config,
        maxCycles: challenge.max_cycles,
        instructions: typeof challenge.instructions === 'string' ? JSON.parse(challenge.instructions) : challenge.instructions,
      },
      rawProblem: generatedContent.rawProblem,
      framingOptions: generatedContent.framingOptions,
      cycles: cycles.map(c => ({
        ...c,
        judging_response: c.judging_response ? JSON.parse(c.judging_response) : null,
        judging_feedback: c.judging_feedback ? JSON.parse(c.judging_feedback) : null,
        steering_response: c.steering_response ? JSON.parse(c.steering_response) : null,
        steering_feedback: c.steering_feedback ? JSON.parse(c.steering_feedback) : null,
        mc_options: c.mc_options ? JSON.parse(c.mc_options) : null,
      })),
    };
  }

  async getReport(runId, userId) {
    const state = await this.getRunState(runId, userId);
    if (state.run.status !== 'completed') {
      throw new ValidationError('Run is not yet completed');
    }
    return state;
  }

  // --- Private helpers ---

  async _getRunForUser(runId, userId) {
    const run = await this.db('challenge_runs').where({ id: runId }).first();
    if (!run) throw new NotFoundError('Challenge run', runId);
    if (run.user_id !== userId) throw new ForbiddenError('Not your challenge run');
    return run;
  }

  _aggregateGrade(grades) {
    if (!grades.length) return 'C';
    const scores = { A: 3, B: 2, C: 1 };
    const avg = grades.reduce((sum, g) => sum + (scores[g] || 1), 0) / grades.length;
    if (avg >= 2.5) return 'A';
    if (avg >= 1.5) return 'B';
    return 'C';
  }
}

module.exports = { ChallengeRunService };
