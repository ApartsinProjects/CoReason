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

    // Retry configuration (from config or defaults)
    const maxRetries = (this.config?.retry?.max_retries) || parseInt(process.env.LLM_MAX_RETRIES || '3', 10);
    const backoffMs = (this.config?.retry?.backoff_ms) || parseInt(process.env.LLM_BACKOFF_MS || '1000', 10);

    // Try each provider with automatic fallback + retries per provider
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      const model = options.model || provider.model;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const start = Date.now();

        try {
          this.logger.debug('LLM call', { traceId, promptId, model, provider: provider.name, attempt });

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
            attempt,
          });

          return content;

        } catch (err) {
          const latency = Date.now() - start;
          const isLastAttempt = attempt === maxRetries;
          const isLastProvider = i === this.providers.length - 1;

          this.logger.warn('LLM call failed', {
            traceId, promptId, model, provider: provider.name, latency_ms: latency,
            error: err.message, attempt, maxRetries, isLastProvider,
          });

          if (isLastAttempt && isLastProvider) {
            // All retries on all providers exhausted — throw to caller
            throw new LLMError(
              `LLM call failed for ${promptId} after ${maxRetries} retries on ${this.providers.length} provider(s): ${err.message}`,
              { promptId, model, attempts: maxRetries, providers: this.providers.length }
            );
          }

          if (isLastAttempt) {
            // Move to next provider
            this.logger.info('Switching to next LLM provider', { traceId, promptId, nextProvider: this.providers[i + 1]?.name });
            break;
          }

          // Exponential backoff before retry: backoffMs * 2^(attempt-1)
          const delay = backoffMs * Math.pow(2, attempt - 1);
          this.logger.info('Retrying LLM call', { traceId, promptId, attempt: attempt + 1, delay_ms: delay });
          await new Promise(resolve => setTimeout(resolve, delay));
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
    if (!result) throw new LLMError('Failed to generate problem. LLM service is not available.');
    return result;
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
    if (!result) throw new LLMError('Failed to generate AI solution. LLM service is not available.');
    return result;
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
    if (!result) throw new LLMError('Failed to generate updated solution. LLM service is not available.');
    return result;
  }

  async generateFramingMC({ rawProblem, subjectPath, framingRubric, language }) {
    const parsed = await this._callWithJsonRetry('05-generate-framing-mc', {
      raw_problem: rawProblem,
      subject_path: subjectPath || '',
      framing_rubric: framingRubric || '',
      ...MC_PARAMS.FRAMING,
      language: this._langName(language),
    });
    if (!parsed) return null;
    const normalized = this._normalizeMCOptions(parsed);
    if (!normalized) {
      this.logger.warn('Framing MC normalization returned null', { parsedKeys: parsed ? Object.keys(parsed) : null });
    }
    return normalized;
  }

  async generateJudgingMC({ aiSolution, rawProblem, studentFraming, cycleNumber, previousJudgements, judgingRubric, internalIssues, language }) {
    const framingText = studentFraming
      ? (typeof studentFraming === 'object' ? JSON.stringify(studentFraming) : String(studentFraming))
      : '';
    const parsed = await this._callWithJsonRetry('06-generate-judging-mc', {
      current_ai_output: aiSolution,
      raw_problem: rawProblem || '',
      student_framing: framingText,
      cycle_number: cycleNumber || 1,
      previous_judgements: previousJudgements || '',
      judging_rubric: judgingRubric || '',
      internal_issues: internalIssues || '',
      ...MC_PARAMS.JUDGING,
      language: this._langName(language),
    });
    if (!parsed) return null;
    const normalized = this._normalizeMCOptions(parsed);
    if (!normalized) {
      this.logger.warn('Judging MC normalization returned null', { parsedKeys: parsed ? Object.keys(parsed) : null });
    }
    return normalized;
  }

  async generateSteeringMC({ aiSolution, judgingResponse, rawProblem, studentFraming, steeringHistory, cycleNumber, maxCycles, steeringRubric, internalIssues, language }) {
    const judgingText = typeof judgingResponse === 'object'
      ? JSON.stringify(judgingResponse) : String(judgingResponse);
    const framingText = studentFraming
      ? (typeof studentFraming === 'object' ? JSON.stringify(studentFraming) : String(studentFraming))
      : '';
    const parsed = await this._callWithJsonRetry('07-generate-steering-mc', {
      current_ai_output: aiSolution,
      student_judgement: judgingText,
      raw_problem: rawProblem || '',
      student_framing: framingText,
      steering_history: steeringHistory || '',
      cycle_number: cycleNumber || 1,
      max_cycles: maxCycles || DEFAULTS.MAX_CYCLES,
      steering_rubric: steeringRubric || '',
      internal_issues: internalIssues || '',
      ...MC_PARAMS.STEERING,
      language: this._langName(language),
    });
    if (!parsed) return null;
    const normalized = this._normalizeMCOptions(parsed);
    if (!normalized) {
      this.logger.warn('Steering MC normalization returned null', { parsedKeys: parsed ? Object.keys(parsed) : null });
    }
    return normalized;
  }

  async evaluateFraming({ rawProblem, studentFraming, responseType, framingRubric, bestFraming, language }) {
    const framingText = typeof studentFraming === 'object'
      ? JSON.stringify(studentFraming) : String(studentFraming);
    const result = await this._call('08-evaluate-framing', {
      raw_problem: rawProblem,
      student_framing: framingText,
      response_type: responseType || RESPONSE_TYPE.MC,
      framing_rubric: framingRubric || '',
      best_framing: bestFraming || '',
      language: this._langName(language),
    });
    if (!result) throw new LLMError('LLM evaluation service is not available. Please try again later.');
    try {
      const parsed = this._parseJsonResponse(result);
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
      known_issues_per_cycle: knownIssuesPerCycle || '',
      judging_rubric: judgingRubric || '',
      num_cycles: numCycles || 1,
      language: this._langName(language),
    });
    if (!result) throw new LLMError('LLM evaluation service is not available. Please try again later.');
    try {
      const parsed = this._parseJsonResponse(result);
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
      final_remaining_issues: finalRemainingIssues || '',
      steering_rubric: steeringRubric || '',
      done_at_cycle: doneAtCycle || '',
      max_cycles: maxCycles || DEFAULTS.MAX_CYCLES,
      language: this._langName(language),
    });
    if (!result) throw new LLMError('LLM evaluation service is not available. Please try again later.');
    try {
      const parsed = this._parseJsonResponse(result);
      return { grade: parsed.grade || DEFAULT_FALLBACK_GRADE, feedback: parsed };
    } catch {
      return { grade: DEFAULT_FALLBACK_GRADE, feedback: { message: result } };
    }
  }

  async generateSuggestion({ phase, rawProblem, currentSolution, studentFraming, cycleNumber, language }) {
    const phaseVal = phase || 'framing';
    const variables = {
      phase: phaseVal,
      raw_problem: rawProblem || '',
      current_solution: currentSolution || '',
      student_framing: studentFraming ? (typeof studentFraming === 'object' ? JSON.stringify(studentFraming) : String(studentFraming)) : '',
      cycle_number: cycleNumber || '',
      is_framing: phaseVal === 'framing' ? 'true' : '',
      language: this._langName(language),
    };

    const result = await this._call('15-suggest-response', variables);
    if (!result) {
      throw new LLMError('AI suggestion service is not available. Please try again later.', { phase });
    }

    try {
      const parsed = this._parseJsonResponse(result);
      if (Array.isArray(parsed)) return parsed;
      if (parsed.sections) return parsed.sections;
      if (parsed.suggestions) return parsed.suggestions;
      return [{ title: 'Suggestion', text: String(result).substring(0, 500) }];
    } catch {
      return [{ title: 'Suggestion', text: String(result).substring(0, 500) }];
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

  async generateRubrics({ courseName, subjectPath, language }) {
    const result = await this._call('02-generate-rubrics', {
      course_name: courseName || 'General',
      subject_path: subjectPath || 'General',
      language: this._langName(language),
    });
    if (!result) return null;
    try {
      const parsed = this._parseJsonResponse(result);
      // Normalize to { framing, judging, steering } keys
      return {
        framing: parsed.framing_rubric || parsed.framing || null,
        judging: parsed.judging_rubric || parsed.judging || null,
        steering: parsed.steering_rubric || parsed.steering || null,
      };
    } catch (err) {
      this.logger.warn('Failed to parse rubrics LLM response', { error: err.message });
      return null;
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
   * Call LLM and parse the response as JSON, with retry logic for parse failures.
   *
   * On parse failure:
   *   1. Strip markdown fences, trailing text, and common artifacts, then retry parse
   *   2. If still failing, retry the full LLM call (up to maxParseRetries times)
   *   3. Return parsed JSON or null as a last resort
   *
   * @param {string} promptId   - prompt template identifier
   * @param {object} variables  - template variables
   * @param {object} [options]  - options forwarded to _call()
   * @param {number} [options.maxParseRetries=2] - max full-LLM retries on parse failure
   * @returns {object|null} parsed JSON or null
   */
  async _callWithJsonRetry(promptId, variables, options = {}) {
    const traceId = asyncContext.getTraceId();
    const maxParseRetries = options.maxParseRetries ?? 2;

    for (let attempt = 0; attempt <= maxParseRetries; attempt++) {
      const raw = await this._call(promptId, variables, options);
      if (!raw) return null;

      // Attempt 1: standard parse (handles markdown fences)
      try {
        return this._parseJsonResponse(raw);
      } catch (firstErr) {
        this.logger.warn('MC JSON parse failed (attempt 1/2 local)', {
          traceId, promptId, attempt: attempt + 1, error: firstErr.message,
          rawSnippet: raw.substring(0, 300),
        });
      }

      // Attempt 2: aggressive cleanup then re-parse
      try {
        const cleaned = this._extractJsonFromText(raw);
        if (cleaned) return JSON.parse(cleaned);
      } catch (secondErr) {
        this.logger.warn('MC JSON parse failed after cleanup (attempt 2/2 local)', {
          traceId, promptId, attempt: attempt + 1, error: secondErr.message,
        });
      }

      // If we still have retries left, log and loop to re-call the LLM
      if (attempt < maxParseRetries) {
        this.logger.info('Retrying LLM call due to JSON parse failure', {
          traceId, promptId, parseRetry: attempt + 1, maxParseRetries,
        });
      }
    }

    // All retries exhausted
    this.logger.warn('MC JSON parse retries exhausted, returning null', {
      traceId, promptId, maxParseRetries,
    });
    return null;
  }

  /**
   * Attempt to extract a JSON object or array from free-form LLM text.
   * Strips markdown fences, leading/trailing prose, and common artifacts.
   * Returns the cleaned JSON string or null if no JSON structure is found.
   */
  _extractJsonFromText(text) {
    if (!text) return null;
    let s = text.trim();

    // Strip markdown code fences (```json ... ``` or ``` ... ```)
    const fenceMatch = s.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) s = fenceMatch[1].trim();

    // Remove any leading non-JSON prose (find first { or [)
    const objStart = s.indexOf('{');
    const arrStart = s.indexOf('[');
    let start = -1;
    if (objStart >= 0 && arrStart >= 0) start = Math.min(objStart, arrStart);
    else if (objStart >= 0) start = objStart;
    else if (arrStart >= 0) start = arrStart;

    if (start < 0) return null;
    s = s.substring(start);

    // Find matching closing bracket by scanning for balanced braces/brackets
    const openChar = s[0];
    const closeChar = openChar === '{' ? '}' : ']';
    let depth = 0;
    let inString = false;
    let escaped = false;
    let end = -1;

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (escaped) { escaped = false; continue; }
      if (c === '\\') { escaped = true; continue; }
      if (c === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (c === openChar) depth++;
      else if (c === closeChar) {
        depth--;
        if (depth === 0) { end = i; break; }
      }
    }

    if (end < 0) return null;
    return s.substring(0, end + 1);
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
      correct: opt.correct ?? opt.is_correct ?? opt.is_real_issue ?? opt.is_relevant ?? opt.is_effective ?? true,
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
