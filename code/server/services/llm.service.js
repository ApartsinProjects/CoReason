'use strict';

const { LLMError } = require('../utils/errors');
const { PromptEngine } = require('../llm/prompt-engine');
const asyncContext = require('../utils/async-context');
const {
  LLM_PROVIDER, LLM_MODELS, LLM_MODEL_CATALOG, LLM_FALLBACK,
  LLM_FALLBACK_SUBJECT_TREE, DEFAULT_FALLBACK_GRADE, DEFAULTS, RESPONSE_TYPE,
  LANGUAGE_NAMES, MC_PARAMS,
} = require('../utils/constants');

class LLMService {
  constructor(config, logger, tracer) {
    this.config = config;
    this.logger = logger;
    this.tracer = tracer;
    this.promptEngine = new PromptEngine(logger);
    this.client = null;
    this._initClient();
  }

  /** Resolve language code (e.g. 'he') to full name (e.g. 'Hebrew') for LLM prompts. */
  _langName(code) {
    return LANGUAGE_NAMES[code] || DEFAULTS.DEFAULT_LANGUAGE_NAME;
  }

  _initClient() {
    // Initialize all available LLM providers for automatic fallback
    const OpenAI = require('openai');
    this.providers = [];

    try {
      if (process.env.OPENAI_API_KEY) {
        this.providers.push({
          name: LLM_PROVIDER.OPENAI,
          client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
          model: LLM_MODELS.OPENAI_DEFAULT,
        });
        this.logger.info('LLM provider registered: OpenAI');
      }
      if (process.env.GROQ_API_KEY) {
        this.providers.push({
          name: LLM_PROVIDER.GROQ,
          client: new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: LLM_MODELS.GROQ_BASE_URL }),
          model: LLM_MODELS.GROQ_DEFAULT,
        });
        this.logger.info('LLM provider registered: Groq');
      }
    } catch (err) {
      this.logger.warn('Failed to initialize LLM clients:', err.message);
    }

    if (this.providers.length > 0) {
      this.client = this.providers[0].client;
      this.defaultModel = this.providers[0].model;
    } else {
      this.client = null;
      this.logger.warn('No LLM API key configured. LLM features will use fallback responses.');
    }
  }

  async _call(promptId, variables, options = {}) {
    const traceId = asyncContext.getTraceId();
    if (this.providers.length === 0) {
      this.logger.warn(`LLM not available for prompt ${promptId}, returning fallback`, { traceId });
      return null;
    }

    const { messages, temperature, max_tokens } = this.promptEngine.buildMessages(promptId, variables);

    // Try each provider with automatic fallback
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      const model = options.model || provider.model;
      const start = Date.now();

      try {
        this.logger.debug('LLM call', { traceId, promptId, model, provider: provider.name });

        const response = await provider.client.chat.completions.create({
          model,
          messages,
          temperature,
          max_tokens,
        });

        const latency = Date.now() - start;
        const content = response.choices[0]?.message?.content || '';

        if (this.tracer) {
          this.tracer.llmCall(promptId, model, variables, {
            usage: response.usage,
            _latency: latency,
          });
        }

        this.logger.info('LLM response', {
          traceId, promptId, model, provider: provider.name, latency_ms: latency,
          tokens: response.usage?.total_tokens,
        });

        return content;

      } catch (err) {
        const latency = Date.now() - start;
        this.logger.warn('LLM call failed, trying next provider', {
          traceId, promptId, model, provider: provider.name, latency_ms: latency, error: err.message,
        });

        // If this is the last provider, throw
        if (i === this.providers.length - 1) {
          throw new LLMError(`LLM call failed for ${promptId}: ${err.message}`, { promptId, model });
        }
      }
    }
  }

  async generateProblem({ course, subject, instructions, language }) {
    const result = await this._call('01-generate-problem', {
      course_name: course || 'General',
      subject_path: subject || 'General',
      language: this._langName(language),
    });
    return result || `<h3>Problem Statement</h3><p>You are working on a problem in ${course} related to ${subject}. The problem is intentionally vague — your task is to refine it before the AI generates a solution.</p>`;
  }

  async generateAISolution({ rawProblem, studentFraming, subjectPath, language }) {
    const framingText = typeof studentFraming === 'object'
      ? JSON.stringify(studentFraming) : String(studentFraming);
    const result = await this._call('03-generate-ai-solution', {
      raw_problem: rawProblem,
      student_framing: framingText,
      subject_path: subjectPath || '',
      language: this._langName(language),
    });
    return result || LLM_FALLBACK.PLACEHOLDER_AI_SOLUTION;
  }

  async generateUpdatedOutput({ currentSolution, steeringResponse, rawProblem, studentFraming, steeringHistory, cycleNumber, maxCycles, language }) {
    const steeringText = typeof steeringResponse === 'object'
      ? JSON.stringify(steeringResponse) : String(steeringResponse);
    const framingText = studentFraming
      ? (typeof studentFraming === 'object' ? JSON.stringify(studentFraming) : String(studentFraming))
      : '';
    const result = await this._call('04-generate-ai-updated-output', {
      raw_problem: rawProblem || '',
      student_framing: framingText,
      previous_output: currentSolution,
      steering_history: steeringHistory || '',
      steering_command: steeringText,
      cycle_number: cycleNumber || '',
      max_cycles: maxCycles || '',
      language: this._langName(language),
    });
    return result || currentSolution + LLM_FALLBACK.UPDATED_SOLUTION_SUFFIX;
  }

  async generateFramingMC({ rawProblem, subjectPath, framingRubric, language }) {
    const result = await this._call('05-generate-framing-mc', {
      raw_problem: rawProblem,
      subject_path: subjectPath || '',
      framing_rubric: framingRubric || '', // TODO: pass actual rubric when available
      ...MC_PARAMS.FRAMING,
      language: this._langName(language),
    });
    if (!result) return null;
    try { return this._normalizeMCOptions(this._parseJsonResponse(result)); } catch { return null; }
  }

  async generateJudgingMC({ aiSolution, rawProblem, studentFraming, cycleNumber, previousJudgements, judgingRubric, internalIssues, language }) {
    const framingText = studentFraming
      ? (typeof studentFraming === 'object' ? JSON.stringify(studentFraming) : String(studentFraming))
      : '';
    const result = await this._call('06-generate-judging-mc', {
      current_ai_output: aiSolution,
      raw_problem: rawProblem || '',
      student_framing: framingText,
      cycle_number: cycleNumber || 1,
      previous_judgements: previousJudgements || '',
      judging_rubric: judgingRubric || '', // TODO: pass actual rubric when available
      internal_issues: internalIssues || '',
      ...MC_PARAMS.JUDGING,
      language: this._langName(language),
    });
    if (!result) return null;
    try { return this._normalizeMCOptions(this._parseJsonResponse(result)); } catch { return null; }
  }

  async generateSteeringMC({ aiSolution, judgingResponse, rawProblem, studentFraming, steeringHistory, cycleNumber, maxCycles, steeringRubric, internalIssues, language }) {
    const judgingText = typeof judgingResponse === 'object'
      ? JSON.stringify(judgingResponse) : String(judgingResponse);
    const framingText = studentFraming
      ? (typeof studentFraming === 'object' ? JSON.stringify(studentFraming) : String(studentFraming))
      : '';
    const result = await this._call('07-generate-steering-mc', {
      current_ai_output: aiSolution,
      student_judgement: judgingText,
      raw_problem: rawProblem || '',
      student_framing: framingText,
      steering_history: steeringHistory || '',
      cycle_number: cycleNumber || 1,
      max_cycles: maxCycles || DEFAULTS.MAX_CYCLES,
      steering_rubric: steeringRubric || '', // TODO: pass actual rubric when available
      internal_issues: internalIssues || '',
      ...MC_PARAMS.STEERING,
      language: this._langName(language),
    });
    if (!result) return null;
    try { return this._normalizeMCOptions(this._parseJsonResponse(result)); } catch { return null; }
  }

  async evaluateFraming({ rawProblem, studentFraming, responseType, framingRubric, bestFraming, language }) {
    const framingText = typeof studentFraming === 'object'
      ? JSON.stringify(studentFraming) : String(studentFraming);
    const result = await this._call('08-evaluate-framing', {
      raw_problem: rawProblem,
      student_framing: framingText,
      response_type: responseType || RESPONSE_TYPE.MC,
      framing_rubric: framingRubric || '', // TODO: pass actual rubric when available
      best_framing: bestFraming || '', // TODO: pass best framing when available
      language: this._langName(language),
    });
    if (!result) return { grade: DEFAULT_FALLBACK_GRADE, feedback: { message: LLM_FALLBACK.NOT_CONFIGURED_FEEDBACK } };
    try {
      const parsed = JSON.parse(result);
      return { grade: parsed.grade || DEFAULT_FALLBACK_GRADE, feedback: parsed };
    } catch {
      return { grade: DEFAULT_FALLBACK_GRADE, feedback: { message: result } };
    }
  }

  async evaluateJudging({ aiSolution, judgingResponse, rawProblem, aiOutputsPerCycle, judgingResponsesPerCycle, responseType, knownIssuesPerCycle, judgingRubric, numCycles, language }) {
    const judgingText = typeof judgingResponse === 'object'
      ? JSON.stringify(judgingResponse) : String(judgingResponse);
    const result = await this._call('09-evaluate-judging', {
      raw_problem: rawProblem || '',
      ai_outputs_per_cycle: aiOutputsPerCycle || aiSolution,
      judging_responses_per_cycle: judgingResponsesPerCycle || judgingText,
      response_type: responseType || RESPONSE_TYPE.MC,
      known_issues_per_cycle: knownIssuesPerCycle || '', // TODO: pass known issues when available
      judging_rubric: judgingRubric || '', // TODO: pass actual rubric when available
      num_cycles: numCycles || 1,
      language: this._langName(language),
    });
    if (!result) return { grade: DEFAULT_FALLBACK_GRADE, feedback: { message: LLM_FALLBACK.NOT_CONFIGURED_FEEDBACK } };
    try {
      const parsed = JSON.parse(result);
      return { grade: parsed.grade || DEFAULT_FALLBACK_GRADE, feedback: parsed };
    } catch {
      return { grade: DEFAULT_FALLBACK_GRADE, feedback: { message: result } };
    }
  }

  async evaluateSteering({ currentSolution, steeringResponse, updatedSolution, rawProblem, studentFraming, aiOutputsPerCycle, steeringCommandsPerCycle, judgingResponsesPerCycle, responseType, finalRemainingIssues, steeringRubric, doneAtCycle, maxCycles, language }) {
    const steeringText = typeof steeringResponse === 'object'
      ? JSON.stringify(steeringResponse) : String(steeringResponse);
    const framingText = studentFraming
      ? (typeof studentFraming === 'object' ? JSON.stringify(studentFraming) : String(studentFraming))
      : '';
    const result = await this._call('10-evaluate-steering', {
      raw_problem: rawProblem || '',
      student_framing: framingText,
      ai_outputs_per_cycle: aiOutputsPerCycle || currentSolution,
      steering_commands_per_cycle: steeringCommandsPerCycle || steeringText,
      judging_responses_per_cycle: judgingResponsesPerCycle || '',
      response_type: responseType || RESPONSE_TYPE.MC,
      final_remaining_issues: finalRemainingIssues || '', // TODO: pass remaining issues when available
      steering_rubric: steeringRubric || '', // TODO: pass actual rubric when available
      done_at_cycle: doneAtCycle || '',
      max_cycles: maxCycles || DEFAULTS.MAX_CYCLES,
      language: this._langName(language),
    });
    if (!result) return { grade: DEFAULT_FALLBACK_GRADE, feedback: { message: LLM_FALLBACK.NOT_CONFIGURED_FEEDBACK } };
    try {
      const parsed = JSON.parse(result);
      return { grade: parsed.grade || DEFAULT_FALLBACK_GRADE, feedback: parsed };
    } catch {
      return { grade: DEFAULT_FALLBACK_GRADE, feedback: { message: result } };
    }
  }

  async generateSubjectTree({ courseName, courseDescription, institution, existingTree, instructions, language }) {
    const variables = {
      course_name: courseName || 'Untitled Course',
      course_description: courseDescription || '',
      institution: institution || '',
      existing_tree: existingTree ? JSON.stringify(existingTree, null, 2) : '',
      instructions: instructions || '',
      language: this._langName(language),
    };

    const result = await this._call('13-generate-subject-tree', variables);
    if (!result) {
      // Fallback: return a basic tree structure
      return LLM_FALLBACK_SUBJECT_TREE;
    }

    try {
      // Extract JSON from response (handle markdown code fences)
      let jsonStr = result.trim();
      const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (fenceMatch) jsonStr = fenceMatch[1].trim();

      const parsed = JSON.parse(jsonStr);
      if (!Array.isArray(parsed)) throw new Error('Expected array');
      return parsed;
    } catch (err) {
      this.logger.warn('Failed to parse subject tree LLM response', { error: err.message });
      throw new LLMError('Failed to parse generated subject tree. Please try again.');
    }
  }

  async generateRubricPreview({ course, subjects, language }) {
    const result = await this._call('14-generate-rubric-preview', {
      course: course || 'General',
      subjects: Array.isArray(subjects) ? subjects.join(', ') : String(subjects),
      language: this._langName(language),
    });
    if (!result) return null;
    try {
      let jsonStr = result.trim();
      const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (fenceMatch) jsonStr = fenceMatch[1].trim();
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  }

  async generatePreview(data) {
    const result = await this._call('12-generate-example-preview', {
      course_name: data.course || 'General',
      subject_path: data.subject || 'General',
      framing_rubric_summary: data.framingRubricSummary || '',
      judging_rubric_summary: data.judgingRubricSummary || '',
      steering_rubric_summary: data.steeringRubricSummary || '',
      language: this._langName(data.language),
    });
    return result || LLM_FALLBACK.PREVIEW_NOT_AVAILABLE;
  }

  /**
   * Parse a JSON response from LLM, handling markdown code fences.
   */
  _parseJsonResponse(text) {
    let jsonStr = text.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();
    return JSON.parse(jsonStr);
  }

  /**
   * Normalize MC options from LLM response to the frontend-expected format:
   * [{ letter: 'A', text: '...', correct: true/false }]
   *
   * LLM prompts may return:
   *   { options: [{ id, text, is_real_issue, ... }] }  (judging/steering)
   *   { options: [{ id, text, is_correct, ... }] }      (framing)
   *   [{ letter, text, correct }]                       (already normalized)
   */
  _normalizeMCOptions(parsed) {
    if (!parsed) return null;
    // If it's already an array of { letter, text }
    let arr = Array.isArray(parsed) ? parsed : (parsed.options || parsed.items || null);
    if (!Array.isArray(arr) || arr.length === 0) return null;
    // If already has letter/text, return as-is
    if (arr[0].letter && arr[0].text) return arr;
    // Normalize: assign letters A-Z and map correct/is_real_issue/is_correct
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return arr.map((opt, i) => ({
      letter: opt.letter || opt.id || letters[i] || String(i + 1),
      text: opt.text || opt.description || '',
      correct: opt.correct ?? opt.is_real_issue ?? opt.is_correct ?? true,
    }));
  }

  getAvailableModels() {
    const models = [];
    if (process.env.OPENAI_API_KEY) models.push(...LLM_MODEL_CATALOG.openai);
    if (process.env.GROQ_API_KEY) models.push(...LLM_MODEL_CATALOG.groq);
    if (process.env.GEMINI_API_KEY) models.push(...LLM_MODEL_CATALOG.google);
    if (process.env.COHERE_API_KEY) models.push(...LLM_MODEL_CATALOG.cohere);
    return models;
  }
}

module.exports = { LLMService };
