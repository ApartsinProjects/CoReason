'use strict';

const { v4: uuidv4 } = require('uuid');
const { NotFoundError, ForbiddenError, ValidationError } = require('../utils/errors');

class ChallengeRunService {
  constructor(db, logger, llmService) {
    this.db = db;
    this.logger = logger;
    this.llmService = llmService;
  }

  async startRun(challengeId, userId) {
    // Verify challenge exists and is published
    const challenge = await this.db('challenges').where({ id: challengeId }).first();
    if (!challenge) throw new NotFoundError('Challenge', challengeId);

    const run = {
      id: uuidv4(),
      challenge_id: challengeId,
      user_id: userId,
      status: 'in_progress',
      current_phase: 'framing',
      current_cycle: 0,
      max_cycles: challenge.max_cycles || 3,
      phases: JSON.stringify({}),
    };

    // Generate the raw problem via LLM
    const course = await this.db('courses').where({ id: challenge.course_id }).first();
    const rawProblem = await this.llmService.generateProblem({
      course: course?.name,
      subject: challenge.subject,
      instructions: challenge.instructions ? JSON.parse(challenge.instructions) : {},
    });

    run.raw_problem = rawProblem;
    await this.db('challenge_runs').insert(run);
    this.logger.info('Challenge run started', { runId: run.id, challengeId, userId });

    return run;
  }

  async getRun(runId, userId) {
    const run = await this.db('challenge_runs').where({ id: runId }).first();
    if (!run) throw new NotFoundError('ChallengeRun', runId);
    if (run.user_id !== userId) throw new ForbiddenError('Access denied to this run');
    return run;
  }

  async submitFraming(runId, userId, framingData) {
    const run = await this.getRun(runId, userId);
    if (run.current_phase !== 'framing') {
      throw new ValidationError('Run is not in the framing phase');
    }

    // Evaluate framing
    const evaluation = await this.llmService.evaluateFraming({
      rawProblem: run.raw_problem,
      studentFraming: framingData,
    });

    // Generate AI solution based on framing
    const aiSolution = await this.llmService.generateAISolution({
      rawProblem: run.raw_problem,
      studentFraming: framingData,
    });

    const phases = JSON.parse(run.phases || '{}');
    phases.framing = {
      response: framingData,
      evaluation,
      ai_solution: aiSolution,
      submitted_at: new Date().toISOString(),
    };

    await this.db('challenge_runs').where({ id: runId }).update({
      phases: JSON.stringify(phases),
      current_phase: 'judging',
      current_cycle: 1,
      updated_at: new Date().toISOString(),
    });

    this.logger.info('Framing submitted', { runId, grade: evaluation.grade });
    return { evaluation, aiSolution, nextPhase: 'judging' };
  }

  async submitJudging(runId, userId, cycleNum, judgingData) {
    const run = await this.getRun(runId, userId);
    if (run.current_phase !== 'judging') {
      throw new ValidationError('Run is not in the judging phase');
    }

    const phases = JSON.parse(run.phases || '{}');
    const currentSolution = phases.framing?.ai_solution || '';

    // Evaluate judging
    const evaluation = await this.llmService.evaluateJudging({
      aiSolution: currentSolution,
      judgingResponse: judgingData,
    });

    if (!phases.cycles) phases.cycles = {};
    if (!phases.cycles[cycleNum]) phases.cycles[cycleNum] = {};

    phases.cycles[cycleNum].judging = {
      response: judgingData,
      evaluation,
      submitted_at: new Date().toISOString(),
    };

    await this.db('challenge_runs').where({ id: runId }).update({
      phases: JSON.stringify(phases),
      current_phase: 'steering',
      updated_at: new Date().toISOString(),
    });

    this.logger.info('Judging submitted', { runId, cycleNum, grade: evaluation.grade });
    return { evaluation, nextPhase: 'steering' };
  }

  async submitSteering(runId, userId, cycleNum, steeringData) {
    const run = await this.getRun(runId, userId);
    if (run.current_phase !== 'steering') {
      throw new ValidationError('Run is not in the steering phase');
    }

    const phases = JSON.parse(run.phases || '{}');
    const currentSolution = phases.framing?.ai_solution || '';

    // Generate updated output based on steering
    const updatedSolution = await this.llmService.generateUpdatedOutput({
      currentSolution,
      steeringResponse: steeringData,
    });

    // Evaluate steering
    const evaluation = await this.llmService.evaluateSteering({
      currentSolution,
      steeringResponse: steeringData,
      updatedSolution,
    });

    if (!phases.cycles) phases.cycles = {};
    if (!phases.cycles[cycleNum]) phases.cycles[cycleNum] = {};

    phases.cycles[cycleNum].steering = {
      response: steeringData,
      evaluation,
      updated_solution: updatedSolution,
      submitted_at: new Date().toISOString(),
    };

    const nextCycle = parseInt(cycleNum) + 1;
    const isLastCycle = nextCycle > run.max_cycles;

    await this.db('challenge_runs').where({ id: runId }).update({
      phases: JSON.stringify(phases),
      current_phase: isLastCycle ? 'complete' : 'judging',
      current_cycle: isLastCycle ? run.current_cycle : nextCycle,
      status: isLastCycle ? 'completed' : 'in_progress',
      updated_at: new Date().toISOString(),
    });

    this.logger.info('Steering submitted', { runId, cycleNum, grade: evaluation.grade, isLastCycle });
    return { evaluation, updatedSolution, nextPhase: isLastCycle ? 'complete' : 'judging' };
  }

  async completeRun(runId, userId) {
    const run = await this.getRun(runId, userId);
    await this.db('challenge_runs').where({ id: runId }).update({
      status: 'completed',
      current_phase: 'complete',
      updated_at: new Date().toISOString(),
    });
    this.logger.info('Run completed', { runId });
    return { message: 'Run completed' };
  }

  async getReport(runId, userId) {
    const run = await this.getRun(runId, userId);
    const challenge = await this.db('challenges').where({ id: run.challenge_id }).first();
    const phases = JSON.parse(run.phases || '{}');

    return {
      run: {
        id: run.id,
        status: run.status,
        started_at: run.created_at,
        completed_at: run.updated_at,
      },
      challenge: {
        id: challenge?.id,
        title: challenge?.title,
        subject: challenge?.subject,
      },
      phases,
    };
  }
}

module.exports = { ChallengeRunService };
