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
    // Phase 1: Read and validate challenge state within a transaction
    let challenge, responseConfig, needsGeneration, needsFramingRegeneration;
    await this.db.transaction(async (trx) => {
      challenge = await trx('challenges').where({ id: challengeId }).first();
      if (!challenge) throw new NotFoundError('Challenge', challengeId);
      if (challenge.status === CHALLENGE_STATUS.ARCHIVED) throw new ValidationError('Cannot run an archived challenge');
      if (challenge.status === CHALLENGE_STATUS.DRAFT) throw new ValidationError('Cannot run a draft challenge — publish it first');
    });

    const rawRespCfg = safeParse(challenge.response_config, {});
    responseConfig = {
      phase1: rawRespCfg.phase1 || rawRespCfg.framing || DEFAULTS.RESPONSE_TYPE_PHASE1,
      phase2: rawRespCfg.phase2 || rawRespCfg.judging || rawRespCfg.steering || DEFAULTS.RESPONSE_TYPE_PHASE2,
    };

    const language = await this._userLang(userId);

    // Phase 2: Generate content via LLM (outside transaction — slow)
    let generatedContent = safeParse(challenge.generated_content, null);
    let rawProblem, framingOptions;

    if (generatedContent?.rawProblem) {
      rawProblem = generatedContent.rawProblem;
      framingOptions = generatedContent.framingOptions;
      if (responseConfig.phase1 === RESPONSE_TYPE.MC &&
          (!Array.isArray(framingOptions) || framingOptions.length === 0 ||
           !framingOptions[0]?.letter)) {
        this.logger.info('Cached framingOptions invalid or missing, regenerating', { challengeId });
        if (this.llm) {
          const _rubrics1 = safeParse(challenge.rubrics, null);
          framingOptions = await this.llm.generateFramingMC({ rawProblem, framingRubric: _rubrics1?.framing ? JSON.stringify(_rubrics1.framing) : '', language });
          if (!framingOptions || !Array.isArray(framingOptions) || framingOptions.length === 0) {
            throw new ValidationError('Failed to generate framing options. Please try again.');
          }
        } else {
          throw new ValidationError('LLM service is not configured. Cannot generate framing options.');
        }
        generatedContent.framingOptions = framingOptions;
        await this.db('challenges').where({ id: challengeId }).update({
          generated_content: JSON.stringify(generatedContent),
        });
      }
    } else if (this.llm) {
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
        const _rubrics0 = safeParse(challenge.rubrics, null);
        framingOptions = await this.llm.generateFramingMC({ rawProblem, framingRubric: _rubrics0?.framing ? JSON.stringify(_rubrics0.framing) : '', language });
        if (!framingOptions || !Array.isArray(framingOptions) || framingOptions.length === 0) {
          throw new ValidationError('Failed to generate framing options. Please try again.');
        }
      }

      // Cache generated content
      generatedContent = { rawProblem, framingOptions };
      await this.db('challenges').where({ id: challengeId }).update({
        generated_content: JSON.stringify(generatedContent),
      });
    } else {
      throw new ValidationError('LLM service is not configured. Cannot generate problems. Please configure an API key (OPENAI_API_KEY, GROQ_API_KEY, etc.).');
    }

    // Phase 3: Create run record
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
    // Phase 1: Validate and lock state within a transaction
    let challenge, generatedContent, rubrics, language;
    await this.db.transaction(async (trx) => {
      const run = await trx('challenge_runs').where({ id: runId }).first();
      if (!run) throw new NotFoundError('Challenge run', runId);
      if (run.user_id !== userId) throw new ForbiddenError('Not your challenge run');
      if (run.status !== RUN_STATUS.IN_PROGRESS) {
        throw new ValidationError('Cannot submit framing: run is not in progress');
      }
      if (run.framing_response !== null && run.framing_response !== undefined) {
        throw new ValidationError('Framing has already been submitted for this run');
      }
      // Mark as in-progress to prevent duplicate submissions
      await trx('challenge_runs').where({ id: runId }).update({
        framing_response: JSON.stringify({ _pending: true }),
        updated_at: new Date().toISOString(),
      });
      challenge = await trx('challenges').where({ id: run.challenge_id }).first();
    });

    generatedContent = safeParse(challenge.generated_content, {});
    language = await this._userLang(userId);
    rubrics = safeParse(challenge.rubrics, null);

    // Phase 2: LLM calls outside transaction (slow)
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

    // Phase 3: Update with final results
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
        const _rubrics2 = safeParse(challenge.rubrics, null);
        judgingOptions = await this.llm.generateJudgingMC({ aiSolution, rawProblem: generatedContent.rawProblem, judgingRubric: _rubrics2?.judging ? JSON.stringify(_rubrics2.judging) : '', language });
        if (!judgingOptions || !Array.isArray(judgingOptions) || judgingOptions.length === 0) {
          throw new ValidationError('Failed to generate judging options. Please try again.');
        }
      } else {
        throw new ValidationError('LLM service is not configured. Cannot generate judging options.');
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

    // Phase 1: Validate and lock state within a transaction
    let challenge;
    await this.db.transaction(async (trx) => {
      const run = await trx('challenge_runs').where({ id: runId }).first();
      if (!run) throw new NotFoundError('Challenge run', runId);
      if (run.user_id !== userId) throw new ForbiddenError('Not your challenge run');
      if (run.status !== RUN_STATUS.IN_PROGRESS) {
        throw new ValidationError('Cannot submit judging: run is not in progress');
      }
      if (!run.framing_grade) {
        throw new ValidationError('Cannot submit judging: framing has not been completed');
      }

      challenge = await trx('challenges').where({ id: run.challenge_id }).first();

      if (cycleNum > (challenge.max_cycles || DEFAULTS.MAX_CYCLES)) {
        throw new ValidationError('Maximum cycles exceeded');
      }
      if (cycleNum !== (run.current_cycle || 1)) {
        throw new ValidationError(`Expected cycle ${run.current_cycle || 1}, got ${cycleNum}`);
      }

      // Create or get cycle record atomically
      let cycle = await trx('challenge_run_cycles')
        .where({ run_id: runId, cycle_num: cycleNum }).first();
      if (!cycle) {
        const cycleId = uuidv4();
        await trx('challenge_run_cycles').insert({ id: cycleId, run_id: runId, cycle_num: cycleNum });
        cycle = await trx('challenge_run_cycles')
          .where({ run_id: runId, cycle_num: cycleNum }).first();
      }
      if (!cycle) {
        throw new ValidationError('Failed to create cycle record');
      }

      if (cycle.judging_response) {
        throw new ValidationError('Judging has already been submitted for this cycle');
      }

      // Mark judging as in-progress to prevent duplicates
      await trx('challenge_run_cycles')
        .where({ run_id: runId, cycle_num: cycleNum })
        .update({
          judging_response: JSON.stringify(response),
          updated_at: new Date().toISOString(),
        });
    });

    const language = await this._userLang(userId);
    const run = await this._getRunForUser(runId, userId);

    // Generate steering MC options if needed (skip if marked complete)
    const responseConfig3 = this._normalizeResponseConfig(challenge);
    let steeringOptions = null;
    if (!response.markedComplete && responseConfig3.phase2 === RESPONSE_TYPE.MC) {
      if (this.llm) {
        const _rubrics3 = safeParse(challenge.rubrics, null);
        steeringOptions = await this.llm.generateSteeringMC({
          aiSolution: run.ai_solution,
          judgingResponse: response,
          rawProblem: safeParse(challenge.generated_content, {})?.rawProblem || '',
          steeringRubric: _rubrics3?.steering ? JSON.stringify(_rubrics3.steering) : '',
          language,
        });
        if (!steeringOptions || !Array.isArray(steeringOptions) || steeringOptions.length === 0) {
          throw new ValidationError('Failed to generate steering options. Please try again.');
        }
      } else {
        throw new ValidationError('LLM service is not configured. Cannot generate steering options.');
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

    // Phase 1: Validate and lock state within a transaction
    let challenge, rubrics, currentSolution, run, judgingResponseRaw;
    await this.db.transaction(async (trx) => {
      run = await trx('challenge_runs').where({ id: runId }).first();
      if (!run) throw new NotFoundError('Challenge run', runId);
      if (run.user_id !== userId) throw new ForbiddenError('Not your challenge run');
      if (run.status !== RUN_STATUS.IN_PROGRESS) {
        throw new ValidationError('Cannot submit steering: run is not in progress');
      }

      const cycle = await trx('challenge_run_cycles')
        .where({ run_id: runId, cycle_num: cycleNum }).first();
      if (!cycle || !cycle.judging_response) {
        throw new ValidationError('Cannot submit steering: judging has not been submitted for this cycle');
      }
      if (cycle.steering_response) {
        throw new ValidationError('Steering has already been submitted for this cycle');
      }
      judgingResponseRaw = cycle.judging_response;

      // Mark steering as in-progress to prevent duplicates
      await trx('challenge_run_cycles')
        .where({ run_id: runId, cycle_num: cycleNum })
        .update({
          steering_response: JSON.stringify({ _pending: true }),
          updated_at: new Date().toISOString(),
        });

      challenge = await trx('challenges').where({ id: run.challenge_id }).first();

      // Get current AI solution
      const prevCycle = cycleNum > 1
        ? await trx('challenge_run_cycles').where({ run_id: runId, cycle_num: cycleNum - 1 }).first()
        : null;
      currentSolution = (prevCycle && prevCycle.ai_output) || run.ai_solution;
    });

    rubrics = safeParse(challenge.rubrics, null);
    const language = await this._userLang(userId);

    let updatedSolution, judgingFeedback, judgingGrade, steeringFeedback, steeringGrade;

    // Get judging response from the cycle record (fetched during validation transaction)
    const judgingResponse = safeParse(judgingResponseRaw, null);

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
        const _rubrics4 = safeParse(challenge.rubrics, null);
        const _genContent = safeParse(challenge.generated_content, {});
        nextJudgingOptions = await this.llm.generateJudgingMC({ aiSolution: updatedSolution, rawProblem: _genContent?.rawProblem || '', judgingRubric: _rubrics4?.judging ? JSON.stringify(_rubrics4.judging) : '', language });
        if (!nextJudgingOptions || !Array.isArray(nextJudgingOptions) || nextJudgingOptions.length === 0) {
          throw new ValidationError('Failed to generate judging options for next cycle. Please try again.');
        }
      } else {
        throw new ValidationError('LLM service is not configured. Cannot generate judging options.');
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

    // Build feedback summaries from stored feedback
    const framingFb = safeParse(run.framing_feedback, null);
    const judgingFeedbacks = cycles.map(c => safeParse(c.judging_feedback, null)).filter(Boolean);
    const steeringFeedbacks = cycles.map(c => safeParse(c.steering_feedback, null)).filter(Boolean);

    const feedback = {
      framing: this._extractFeedbackSummary(framingFb),
      judging: this._extractFeedbackSummary(judgingFeedbacks[judgingFeedbacks.length - 1]),
      steering: this._extractFeedbackSummary(steeringFeedbacks[steeringFeedbacks.length - 1]),
    };

    grades.feedback = feedback;

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

  async regenerateJudgingOptions(runId, userId, cycleNum) {
    const run = await this._getRunForUser(runId, userId);
    if (run.status !== RUN_STATUS.IN_PROGRESS) {
      throw new ValidationError('Cannot regenerate: run is not in progress');
    }
    const challenge = await this.db('challenges').where({ id: run.challenge_id }).first();
    const language = await this._userLang(userId);

    if (!this.llm) {
      throw new ValidationError('LLM service is not configured. Cannot generate judging options.');
    }

    const _rubrics5 = safeParse(challenge.rubrics, null);
    const judgingOptions = await this.llm.generateJudgingMC({ aiSolution: run.ai_solution, rawProblem: run.raw_problem || '', judgingRubric: _rubrics5?.judging ? JSON.stringify(_rubrics5.judging) : '', language });
    if (!judgingOptions || !Array.isArray(judgingOptions) || judgingOptions.length === 0) {
      throw new ValidationError('Failed to generate judging options. Please try again.');
    }

    return { judgingOptions };
  }

  /**
   * Preview a challenge as a student would see it — generates the raw problem,
   * framing options, and AI solution without creating a database run record.
   * Instructor-only.
   */
  async previewAsStudent(challengeId, userId) {
    const challenge = await this.db('challenges').where({ id: challengeId }).first();
    if (!challenge) throw new NotFoundError('Challenge', challengeId);

    const rawRespCfg = safeParse(challenge.response_config, {});
    const responseConfig = {
      phase1: rawRespCfg.phase1 || rawRespCfg.framing || DEFAULTS.RESPONSE_TYPE_PHASE1,
      phase2: rawRespCfg.phase2 || rawRespCfg.judging || rawRespCfg.steering || DEFAULTS.RESPONSE_TYPE_PHASE2,
    };

    const language = await this._userLang(userId);

    let rawProblem, framingOptions, aiSolution;

    // Try to use cached generated content first
    let generatedContent = safeParse(challenge.generated_content, null);

    try {
      if (generatedContent?.rawProblem) {
        rawProblem = generatedContent.rawProblem;
        framingOptions = generatedContent.framingOptions;
      } else if (this.llm) {
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
          framingOptions = await this.llm.generateFramingMC({ rawProblem, language });
        }
      }

      // Generate a sample AI solution (as if a student submitted a generic framing)
      if (rawProblem && this.llm) {
        aiSolution = await this.llm.generateAISolution({
          rawProblem,
          studentFraming: { text: 'Sample student framing for preview purposes.' },
          language,
        });
      }
    } catch (err) {
      this.logger.warn('Preview LLM call failed, using fallback', { challengeId, error: err.message });
    }

    // If anything failed, provide fallback content
    if (!rawProblem) {
      rawProblem = LLM_FALLBACK.NOT_CONFIGURED_PLACEHOLDER;
    }
    if (!framingOptions && responseConfig.phase1 === RESPONSE_TYPE.MC) {
      framingOptions = LLM_FALLBACK_FRAMING_OPTIONS;
    }
    if (!aiSolution) {
      aiSolution = LLM_FALLBACK.NOT_CONFIGURED_AI_SOLUTION;
    }

    return {
      challengeId,
      title: challenge.title,
      rawProblem,
      framingOptions: framingOptions || null,
      aiSolution,
      responseType: responseConfig.phase1 || DEFAULTS.RESPONSE_TYPE_PHASE1,
      maxCycles: challenge.max_cycles || DEFAULTS.MAX_CYCLES,
      challengeType: challenge.challenge_type,
    };
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
        rubrics: safeParse(challenge.rubrics, null),
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

  async suggest(runId, userId, { phase, cycleNumber }) {
    const run = await this._getRunForUser(runId, userId);
    const challenge = await this.db('challenges').where({ id: run.challenge_id }).first();
    const generatedContent = safeParse(challenge.generated_content, {});

    // Determine language from challenge or user
    const user = await this.db('users').where({ id: userId }).first();
    const language = user?.preferred_language || 'en';

    // Get current solution context
    let currentSolution = '';
    if (phase === 'judging' || phase === 'steering') {
      const cycles = await this.db('challenge_run_cycles')
        .where({ run_id: runId }).orderBy('cycle_num');
      const lastCycle = cycles[cycles.length - 1];
      currentSolution = lastCycle?.ai_output || run.ai_solution || '';
    }

    const suggestions = await this.llm.generateSuggestion({
      phase,
      rawProblem: generatedContent.rawProblem || '',
      currentSolution,
      studentFraming: safeParse(run.framing_response, null),
      cycleNumber,
      language,
    });

    return { suggestions };
  }

  async getReport(runId, userId, { role } = {}) {
    // Instructors can view any student's run report
    let state;
    if (role === 'instructor') {
      state = await this._getRunStateByRunId(runId);
    } else {
      state = await this.getRunState(runId, userId);
    }
    if (state.run.status !== RUN_STATUS.COMPLETED) {
      throw new ValidationError('Run is not yet completed');
    }
    return state;
  }

  async _getRunStateByRunId(runId) {
    const run = await this.db('challenge_runs').where({ id: runId }).first();
    if (!run) throw new NotFoundError('Challenge run', runId);
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
        rubrics: safeParse(challenge.rubrics, null),
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

  /**
   * Override a grade on a completed run (instructor only).
   * Supports overriding framing, judging, or steering grades.
   */
  async overrideGrade(runId, instructorId, { phase, grade, reason }) {
    // Validate grade
    const validGrades = ['A', 'B', 'C'];
    if (!validGrades.includes(grade)) {
      throw new ValidationError('Grade must be A, B, or C');
    }
    if (!['framing', 'judging', 'steering'].includes(phase)) {
      throw new ValidationError('Phase must be framing, judging, or steering');
    }

    const run = await this.db('challenge_runs').where({ id: runId }).first();
    if (!run) throw new NotFoundError('Run', runId);
    if (run.status !== RUN_STATUS.COMPLETED) {
      throw new ValidationError('Can only override grades on completed runs');
    }

    // Verify instructor has access (owns the challenge's course or created the challenge)
    const challenge = await this.db('challenges').where({ id: run.challenge_id }).first();
    if (!challenge) throw new NotFoundError('Challenge', run.challenge_id);
    if (challenge.creator_id !== instructorId) {
      // Check if instructor is in the same course
      const course = challenge.course_id
        ? await this.db('courses').where({ id: challenge.course_id }).first()
        : null;
      if (!course || course.instructor_id !== instructorId) {
        throw new ForbiddenError('Only the challenge creator or course instructor can override grades');
      }
    }

    // Update the grade
    const updates = { updated_at: new Date().toISOString() };
    if (phase === 'framing') {
      updates.framing_grade = grade;
    }

    // Update grades JSON if it exists
    const existingGrades = run.grades ? JSON.parse(run.grades) : {};
    existingGrades[phase] = grade;
    existingGrades[phase + '_override'] = {
      original: phase === 'framing' ? run.framing_grade : existingGrades[phase],
      overridden_by: instructorId,
      overridden_at: new Date().toISOString(),
      reason: reason || '',
    };
    updates.grades = JSON.stringify(existingGrades);

    if (phase === 'framing') {
      updates.framing_grade = grade;
    }

    await this.db('challenge_runs').where({ id: runId }).update(updates);
    this.logger.info('Grade overridden', { runId, phase, grade, instructorId, reason });

    return { success: true, runId, phase, grade, overridden: true };
  }

  _extractFeedbackSummary(feedback) {
    if (!feedback) return '';
    if (typeof feedback === 'string') return feedback;
    // Return the full feedback object — includes criticism, better_alternative, strengths, etc.
    // Let the client decide how to render/truncate it.
    if (feedback.criticism || feedback.better_alternative) {
      return feedback;
    }
    // Legacy format: extract message/summary from object-style feedback
    const text = feedback.message || feedback.summary || feedback.feedback || feedback.text || '';
    return typeof text === 'string' ? text : '';
  }
}

module.exports = { ChallengeRunService };
