'use strict';

const { v4: uuidv4 } = require('uuid');
const { NotFoundError, ValidationError, ForbiddenError } = require('../utils/errors');
const {
  RUN_STATUS, RUN_PHASE, CHALLENGE_STATUS, CHALLENGE_TYPE, RESPONSE_TYPE,
  DEFAULTS, DEFAULT_FALLBACK_GRADE, DEFAULT_AGGREGATE_GRADE,
  GRADES, GRADE_SCORES, GRADE_THRESHOLDS,
  LLM_FALLBACK, LLM_FALLBACK_FRAMING_OPTIONS,
  LLM_FALLBACK_JUDGING_OPTIONS, LLM_FALLBACK_STEERING_OPTIONS,
} = require('../utils/constants');
const { safeParse } = require('../utils/helpers');

class ChallengeRunService {
  constructor(db, logger, llmService) {
    this.db = db;
    this.logger = logger;
    this.llm = llmService;
  }

  /** Look up user's preferred language code (e.g. 'he', 'fr'). */
  async _userLang(userId) {
    const user = await this.db('users').where({ id: userId }).select('preferred_language').first();
    return user?.preferred_language || DEFAULTS.PREFERRED_LANGUAGE;
  }

  async startRun(challengeId, userId) {
    const challenge = await this.db('challenges').where({ id: challengeId }).first();
    if (!challenge) throw new NotFoundError('Challenge', challengeId);
    if (challenge.status === CHALLENGE_STATUS.ARCHIVED) throw new ValidationError('Cannot run an archived challenge');
    if (challenge.status === CHALLENGE_STATUS.DRAFT) throw new ValidationError('Cannot run a draft challenge — publish it first');

    const rawRespCfg = safeParse(challenge.response_config, {});
    // Normalize: support both { phase1, phase2 } (import) and { framing, judging, steering } (UI) keys
    const responseConfig = {
      phase1: rawRespCfg.phase1 || rawRespCfg.framing || DEFAULTS.RESPONSE_TYPE_PHASE1,
      phase2: rawRespCfg.phase2 || rawRespCfg.judging || rawRespCfg.steering || DEFAULTS.RESPONSE_TYPE_PHASE2,
    };

    // Resolve the user's preferred language for LLM prompts
    const language = await this._userLang(userId);

    // Generate problem via LLM (or use cached)
    let generatedContent = safeParse(challenge.generated_content, null);

    let rawProblem, framingOptions;

    if (generatedContent?.rawProblem) {
      rawProblem = generatedContent.rawProblem;
      framingOptions = generatedContent.framingOptions;
      // Ensure cached framingOptions are valid (array with letter/text items)
      if (responseConfig.phase1 === RESPONSE_TYPE.MC &&
          (!Array.isArray(framingOptions) || framingOptions.length === 0 ||
           !framingOptions[0]?.letter)) {
        this.logger.info('Cached framingOptions invalid or missing, regenerating', { challengeId });
        // Try to regenerate from LLM before falling back
        if (this.llm) {
          try {
            framingOptions = await this.llm.generateFramingMC({ rawProblem, language });
          } catch (err) {
            this.logger.warn('generateFramingMC failed during cache repair', { error: err.message });
          }
          if (!framingOptions || !Array.isArray(framingOptions) || framingOptions.length === 0) {
            framingOptions = LLM_FALLBACK_FRAMING_OPTIONS;
          }
        } else {
          framingOptions = LLM_FALLBACK_FRAMING_OPTIONS;
        }
        // Update cache with correct options
        generatedContent.framingOptions = framingOptions;
        await this.db('challenges').where({ id: challengeId }).update({
          generated_content: JSON.stringify(generatedContent),
        });
      }
    } else if (this.llm) {
      // Generate via LLM
      const course = challenge.course_id
        ? await this.db('courses').where({ id: challenge.course_id }).first()
        : null;
      const subjectPath = safeParse(challenge.subject_path, []);

      rawProblem = await this.llm.generateProblem({
        course: course?.name || 'General',
        subject: subjectPath?.join(' > ') || 'General',
        instructions: challenge.instructions,
        language,
      });

      if (responseConfig.phase1 === RESPONSE_TYPE.MC) {
        try {
          framingOptions = await this.llm.generateFramingMC({ rawProblem, language });
        } catch (err) {
          this.logger.warn('generateFramingMC failed, using fallback options', { error: err.message });
        }
        // If LLM returned null or threw, use fallback framing options
        if (!framingOptions || !Array.isArray(framingOptions) || framingOptions.length === 0) {
          framingOptions = LLM_FALLBACK_FRAMING_OPTIONS;
        }
      }

      // Cache generated content
      generatedContent = { rawProblem, framingOptions };
      await this.db('challenges').where({ id: challengeId }).update({
        generated_content: JSON.stringify(generatedContent),
      });
    } else {
      rawProblem = LLM_FALLBACK.NOT_CONFIGURED_PLACEHOLDER;
      if (responseConfig.phase1 === RESPONSE_TYPE.MC) {
        framingOptions = LLM_FALLBACK_FRAMING_OPTIONS;
      }
    }

    // Create run record
    const run = {
      id: uuidv4(),
      challenge_id: challengeId,
      user_id: userId,
      status: RUN_STATUS.IN_PROGRESS,
      current_cycle: 0,
      started_at: new Date().toISOString(),
    };
    await this.db('challenge_runs').insert(run);

    this.logger.info('Run transition: NONE → framing', { runId: run.id, challengeId, userId, phase: RUN_PHASE.FRAMING });

    return {
      runId: run.id,
      challengeId,
      rawProblem,
      framingOptions: framingOptions || null,
      responseType: responseConfig.phase1 || DEFAULTS.RESPONSE_TYPE_PHASE1,
      maxCycles: challenge.max_cycles || DEFAULTS.MAX_CYCLES,
      challengeType: challenge.challenge_type,
    };
  }

  async submitFraming(runId, userId, response) {
    const run = await this._getRunForUser(runId, userId);
    if (run.status !== RUN_STATUS.IN_PROGRESS) {
      throw new ValidationError('Cannot submit framing: run is not in progress');
    }
    if (run.framing_response !== null && run.framing_response !== undefined) {
      throw new ValidationError('Framing has already been submitted for this run');
    }
    const challenge = await this.db('challenges').where({ id: run.challenge_id }).first();
    const generatedContent = safeParse(challenge.generated_content, {});
    const language = await this._userLang(userId);

    // Parse rubrics for LLM evaluation
    const rubrics = safeParse(challenge.rubrics, null);

    let aiSolution, framingFeedback, framingGrade;

    if (this.llm) {
      // Generate AI solution based on framing
      aiSolution = await this.llm.generateAISolution({
        rawProblem: generatedContent.rawProblem,
        studentFraming: response,
        language,
      });

      // Evaluate framing
      const evaluation = await this.llm.evaluateFraming({
        rawProblem: generatedContent.rawProblem,
        studentFraming: response,
        framingRubric: rubrics?.framing ? JSON.stringify(rubrics.framing) : '',
        language,
      });
      framingFeedback = evaluation.feedback;
      framingGrade = evaluation.grade;
    } else {
      aiSolution = LLM_FALLBACK.NOT_CONFIGURED_AI_SOLUTION;
      framingFeedback = { message: LLM_FALLBACK.NOT_CONFIGURED_FEEDBACK, _isLLMFallback: true };
      framingGrade = DEFAULT_FALLBACK_GRADE;
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
    const responseConfig2 = this._normalizeResponseConfig(challenge);
    let judgingOptions = null;
    if (responseConfig2.phase2 === RESPONSE_TYPE.MC) {
      if (this.llm) {
        try {
          judgingOptions = await this.llm.generateJudgingMC({ aiSolution, language });
        } catch (err) {
          this.logger.warn('generateJudgingMC failed, using fallback options', { error: err.message });
        }
      }
      if (!judgingOptions || !Array.isArray(judgingOptions) || judgingOptions.length === 0) {
        judgingOptions = LLM_FALLBACK_JUDGING_OPTIONS;
      }
    }

    this.logger.info('Run transition: framing → judging', { runId, phase: RUN_PHASE.JUDGING, cycle: 1, framingGrade });

    return {
      aiSolution,
      framingFeedback: challenge.challenge_type === CHALLENGE_TYPE.PRACTICE ? framingFeedback : null,
      framingGrade: challenge.challenge_type === CHALLENGE_TYPE.PRACTICE ? framingGrade : null,
      judgingOptions,
      currentCycle: 1,
    };
  }

  async submitJudging(runId, userId, cycleNum, response) {
    cycleNum = parseInt(cycleNum, 10);
    if (!Number.isFinite(cycleNum) || cycleNum < 1) {
      throw new ValidationError('Invalid cycle number');
    }
    const run = await this._getRunForUser(runId, userId);
    if (run.status !== RUN_STATUS.IN_PROGRESS) {
      throw new ValidationError('Cannot submit judging: run is not in progress');
    }
    if (!run.framing_grade) {
      throw new ValidationError('Cannot submit judging: framing has not been completed');
    }
    const challenge = await this.db('challenges').where({ id: run.challenge_id }).first();
    const language = await this._userLang(userId);

    if (cycleNum > (challenge.max_cycles || DEFAULTS.MAX_CYCLES)) {
      throw new ValidationError('Maximum cycles exceeded');
    }
    // Validate cycle is in sequence (must match run's current_cycle)
    if (cycleNum !== (run.current_cycle || 1)) {
      throw new ValidationError(`Expected cycle ${run.current_cycle || 1}, got ${cycleNum}`);
    }

    // Create or get cycle record (check-then-insert to avoid race condition)
    let cycle = await this.db('challenge_run_cycles')
      .where({ run_id: runId, cycle_num: cycleNum }).first();
    if (!cycle) {
      const cycleId = uuidv4();
      await this.db('challenge_run_cycles').insert({ id: cycleId, run_id: runId, cycle_num: cycleNum });
      cycle = await this.db('challenge_run_cycles')
        .where({ run_id: runId, cycle_num: cycleNum }).first();
    }
    if (!cycle) {
      throw new ValidationError('Failed to create cycle record');
    }

    // Prevent duplicate judging submission
    if (cycle.judging_response) {
      throw new ValidationError('Judging has already been submitted for this cycle');
    }

    await this.db('challenge_run_cycles')
      .where({ run_id: runId, cycle_num: cycleNum })
      .update({
        judging_response: JSON.stringify(response),
        updated_at: new Date().toISOString(),
      });

    // Generate steering MC options if needed
    const responseConfig3 = this._normalizeResponseConfig(challenge);
    let steeringOptions = null;
    if (responseConfig3.phase2 === RESPONSE_TYPE.MC) {
      if (this.llm) {
        try {
          steeringOptions = await this.llm.generateSteeringMC({
            aiSolution: run.ai_solution,
            judgingResponse: response,
            language,
          });
        } catch (err) {
          this.logger.warn('generateSteeringMC failed, using fallback options', { error: err.message });
        }
      }
      if (!steeringOptions || !Array.isArray(steeringOptions) || steeringOptions.length === 0) {
        steeringOptions = LLM_FALLBACK_STEERING_OPTIONS;
      }
    }

    this.logger.info('Run transition: judging → steering', { runId, phase: RUN_PHASE.STEERING, cycle: cycleNum });

    return { steeringOptions };
  }

  async submitSteering(runId, userId, cycleNum, response) {
    cycleNum = parseInt(cycleNum, 10);
    if (!Number.isFinite(cycleNum) || cycleNum < 1) {
      throw new ValidationError('Invalid cycle number');
    }
    const run = await this._getRunForUser(runId, userId);
    if (run.status !== RUN_STATUS.IN_PROGRESS) {
      throw new ValidationError('Cannot submit steering: run is not in progress');
    }
    // Verify judging was submitted for this cycle
    const cycle = await this.db('challenge_run_cycles')
      .where({ run_id: runId, cycle_num: cycleNum }).first();
    if (!cycle || !cycle.judging_response) {
      throw new ValidationError('Cannot submit steering: judging has not been submitted for this cycle');
    }
    if (cycle.steering_response) {
      throw new ValidationError('Steering has already been submitted for this cycle');
    }
    const challenge = await this.db('challenges').where({ id: run.challenge_id }).first();
    const rubrics = safeParse(challenge.rubrics, null);
    const language = await this._userLang(userId);

    // Get current AI solution — use latest cycle's ai_output if available, else run's ai_solution
    const prevCycle = cycleNum > 1
      ? await this.db('challenge_run_cycles').where({ run_id: runId, cycle_num: cycleNum - 1 }).first()
      : null;
    const currentSolution = (prevCycle && prevCycle.ai_output) || run.ai_solution;

    let updatedSolution, judgingFeedback, judgingGrade, steeringFeedback, steeringGrade;

    // Get judging response from the cycle record (already fetched above for validation)
    const judgingResponse = safeParse(cycle?.judging_response, null);

    if (this.llm) {
      // Generate updated AI output
      updatedSolution = await this.llm.generateUpdatedOutput({
        currentSolution,
        steeringResponse: response,
        language,
      });

      // Evaluate judging
      const judgingEval = await this.llm.evaluateJudging({
        aiSolution: currentSolution,
        judgingResponse,
        judgingRubric: rubrics?.judging ? JSON.stringify(rubrics.judging) : '',
        language,
      });
      judgingFeedback = judgingEval.feedback;
      judgingGrade = judgingEval.grade;

      // Evaluate steering
      const steeringEval = await this.llm.evaluateSteering({
        currentSolution,
        steeringResponse: response,
        updatedSolution,
        steeringRubric: rubrics?.steering ? JSON.stringify(rubrics.steering) : '',
        language,
      });
      steeringFeedback = steeringEval.feedback;
      steeringGrade = steeringEval.grade;
    } else {
      updatedSolution = currentSolution + LLM_FALLBACK.NOT_CONFIGURED_STEERING_SUFFIX;
      judgingGrade = DEFAULT_FALLBACK_GRADE;
      steeringGrade = DEFAULT_FALLBACK_GRADE;
      judgingFeedback = { message: LLM_FALLBACK.NOT_CONFIGURED_FEEDBACK, _isLLMFallback: true };
      steeringFeedback = { message: LLM_FALLBACK.NOT_CONFIGURED_FEEDBACK, _isLLMFallback: true };
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
    const responseConfig4 = this._normalizeResponseConfig(challenge);
    let nextJudgingOptions = null;
    if (nextCycle <= (challenge.max_cycles || DEFAULTS.MAX_CYCLES) && responseConfig4.phase2 === RESPONSE_TYPE.MC) {
      if (this.llm) {
        try {
          nextJudgingOptions = await this.llm.generateJudgingMC({ aiSolution: updatedSolution, language });
        } catch (err) {
          this.logger.warn('generateJudgingMC (next cycle) failed, using fallback options', { error: err.message });
        }
      }
      if (!nextJudgingOptions || !Array.isArray(nextJudgingOptions) || nextJudgingOptions.length === 0) {
        nextJudgingOptions = LLM_FALLBACK_JUDGING_OPTIONS;
      }
    }

    const isPractice = challenge.challenge_type === CHALLENGE_TYPE.PRACTICE;

    const atMaxCycles = nextCycle > (challenge.max_cycles || DEFAULTS.MAX_CYCLES);
    this.logger.info(`Run transition: steering → ${atMaxCycles ? 'complete' : 'judging'}`, {
      runId, phase: atMaxCycles ? RUN_PHASE.COMPLETE : RUN_PHASE.JUDGING,
      cycle: nextCycle, judgingGrade, steeringGrade,
    });

    return {
      updatedSolution,
      judgingFeedback: isPractice ? judgingFeedback : null,
      judgingGrade: isPractice ? judgingGrade : null,
      steeringFeedback: isPractice ? steeringFeedback : null,
      steeringGrade: isPractice ? steeringGrade : null,
      nextJudgingOptions,
      currentCycle: nextCycle,
      maxCycles: challenge.max_cycles || DEFAULTS.MAX_CYCLES,
    };
  }

  async markComplete(runId, userId) {
    const run = await this._getRunForUser(runId, userId);
    if (run.status !== RUN_STATUS.IN_PROGRESS) {
      throw new ValidationError('Cannot complete: run is not in progress');
    }

    // Aggregate grades
    const cycles = await this.db('challenge_run_cycles')
      .where({ run_id: runId }).orderBy('cycle_num');

    const grades = {
      framing: run.framing_grade || DEFAULT_AGGREGATE_GRADE,
      judging: this._aggregateGrade(cycles.map(c => c.judging_grade).filter(Boolean)),
      steering: this._aggregateGrade(cycles.map(c => c.steering_grade).filter(Boolean)),
    };

    await this.db('challenge_runs').where({ id: runId }).update({
      status: RUN_STATUS.COMPLETED,
      grades: JSON.stringify(grades),
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    this.logger.info('Run transition: in_progress → completed', {
      runId, phase: RUN_PHASE.COMPLETE, grades,
      cycleCount: cycles.length,
      rawGrades: {
        framing: run.framing_grade,
        judging: cycles.map(c => c.judging_grade),
        steering: cycles.map(c => c.steering_grade),
      },
    });
    return { grades };
  }

  async getRunState(runId, userId) {
    const run = await this._getRunForUser(runId, userId);
    const challenge = await this.db('challenges').where({ id: run.challenge_id }).first();
    const cycles = await this.db('challenge_run_cycles')
      .where({ run_id: runId }).orderBy('cycle_num');

    const generatedContent = safeParse(challenge.generated_content, {});

    return {
      run: {
        ...run,
        framing_response: safeParse(run.framing_response, null),
        framing_feedback: safeParse(run.framing_feedback, null),
        grades: safeParse(run.grades, null),
      },
      challenge: {
        id: challenge.id,
        title: challenge.title,
        challengeType: challenge.challenge_type,
        responseConfig: safeParse(challenge.response_config, {}),
        maxCycles: challenge.max_cycles,
        instructions: safeParse(challenge.instructions, {}),
      },
      rawProblem: generatedContent.rawProblem,
      framingOptions: generatedContent.framingOptions,
      cycles: cycles.map(c => ({
        ...c,
        judging_response: safeParse(c.judging_response, null),
        judging_feedback: safeParse(c.judging_feedback, null),
        steering_response: safeParse(c.steering_response, null),
        steering_feedback: safeParse(c.steering_feedback, null),
        mc_options: safeParse(c.mc_options, null),
      })),
    };
  }

  async getReport(runId, userId) {
    const state = await this.getRunState(runId, userId);
    if (state.run.status !== RUN_STATUS.COMPLETED) {
      throw new ValidationError('Run is not yet completed');
    }
    return state;
  }

  // --- Private helpers ---

  _normalizeResponseConfig(challenge) {
    const raw = safeParse(challenge.response_config, {});
    // Support both { phase1, phase2 } (import) and { framing, judging, steering } (UI) keys
    return {
      phase1: raw.phase1 || raw.framing || DEFAULTS.RESPONSE_TYPE_PHASE1,
      phase2: raw.phase2 || raw.judging || raw.steering || DEFAULTS.RESPONSE_TYPE_PHASE2,
    };
  }

  async _getRunForUser(runId, userId) {
    const run = await this.db('challenge_runs').where({ id: runId }).first();
    if (!run) throw new NotFoundError('Challenge run', runId);
    if (run.user_id !== userId) throw new ForbiddenError('Not your challenge run');
    return run;
  }

  _aggregateGrade(grades) {
    if (!grades.length) return DEFAULT_AGGREGATE_GRADE;
    const avg = grades.reduce((sum, g) => sum + (GRADE_SCORES[g] || 1), 0) / grades.length;
    if (avg >= GRADE_THRESHOLDS.A_MIN) return GRADES.A;
    if (avg >= GRADE_THRESHOLDS.B_MIN) return GRADES.B;
    return GRADES.C;
  }
}

module.exports = { ChallengeRunService };
