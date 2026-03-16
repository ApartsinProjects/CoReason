'use strict';

const { LLMError } = require('../utils/errors');
const { PromptEngine } = require('../llm/prompt-engine');

class LLMService {
  constructor(config, logger, tracer) {
    this.config = config;
    this.logger = logger;
    this.tracer = tracer;
    this.promptEngine = new PromptEngine(logger);
    this.client = null;
    this._initClient();
  }

  _initClient() {
    // Try to initialize OpenAI-compatible client
    // ModelMesh provides OpenAI-compatible interface
    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;

    if (!apiKey) {
      this.logger.warn('No LLM API key configured. LLM features will use fallback responses.');
      return;
    }

    // Use OpenAI SDK directly (ModelMesh provides same interface)
    try {
      // Try OpenAI first
      if (process.env.OPENAI_API_KEY) {
        const OpenAI = require('openai');
        this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        this.defaultModel = 'gpt-4o-mini';
        this.logger.info('LLM client initialized (OpenAI)');
      } else if (process.env.GROQ_API_KEY) {
        const OpenAI = require('openai');
        this.client = new OpenAI({
          apiKey: process.env.GROQ_API_KEY,
          baseURL: 'https://api.groq.com/openai/v1',
        });
        this.defaultModel = 'llama-3.1-70b-versatile';
        this.logger.info('LLM client initialized (Groq)');
      }
    } catch (err) {
      this.logger.warn('Failed to initialize LLM client:', err.message);
    }
  }

  async _call(promptId, variables, options = {}) {
    if (!this.client) {
      this.logger.warn(`LLM not available for prompt ${promptId}, returning fallback`);
      return null;
    }

    const start = Date.now();
    const model = options.model || this.defaultModel;

    try {
      const { messages, temperature, max_tokens } = this.promptEngine.buildMessages(promptId, variables);

      this.logger.debug('LLM call', { promptId, model, variableKeys: Object.keys(variables) });

      const response = await this.client.chat.completions.create({
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
        promptId, model, latency_ms: latency,
        tokens: response.usage?.total_tokens,
      });

      return content;

    } catch (err) {
      const latency = Date.now() - start;
      this.logger.error('LLM call failed', { promptId, model, latency_ms: latency, error: err.message });
      throw new LLMError(`LLM call failed for ${promptId}: ${err.message}`, { promptId, model });
    }
  }

  async generateProblem({ course, subject, instructions }) {
    const result = await this._call('01-generate-problem', {
      course: course || 'General',
      subject: subject || 'General',
      instructions: instructions?.phase1 || '',
      language: 'English',
    });
    return result || `<h3>Problem Statement</h3><p>You are working on a problem in ${course} related to ${subject}. The problem is intentionally vague — your task is to refine it before the AI generates a solution.</p>`;
  }

  async generateAISolution({ rawProblem, studentFraming }) {
    const framingText = typeof studentFraming === 'object'
      ? JSON.stringify(studentFraming) : String(studentFraming);
    const result = await this._call('03-generate-ai-solution', {
      raw_problem: rawProblem,
      student_framing: framingText,
      language: 'English',
    });
    return result || 'Placeholder AI solution. The LLM service is not configured.';
  }

  async generateUpdatedOutput({ currentSolution, steeringResponse }) {
    const steeringText = typeof steeringResponse === 'object'
      ? JSON.stringify(steeringResponse) : String(steeringResponse);
    const result = await this._call('04-generate-ai-updated-output', {
      current_solution: currentSolution,
      steering_corrections: steeringText,
      language: 'English',
    });
    return result || currentSolution + '\n\n[Updated based on corrections]';
  }

  async generateFramingMC({ rawProblem }) {
    const result = await this._call('05-generate-framing-mc', {
      raw_problem: rawProblem,
      language: 'English',
    });
    if (!result) return null;
    try { return JSON.parse(result); } catch { return null; }
  }

  async generateJudgingMC({ aiSolution }) {
    const result = await this._call('06-generate-judging-mc', {
      ai_solution: aiSolution,
      language: 'English',
    });
    if (!result) return null;
    try { return JSON.parse(result); } catch { return null; }
  }

  async generateSteeringMC({ aiSolution, judgingResponse }) {
    const judgingText = typeof judgingResponse === 'object'
      ? JSON.stringify(judgingResponse) : String(judgingResponse);
    const result = await this._call('07-generate-steering-mc', {
      ai_solution: aiSolution,
      judging_response: judgingText,
      language: 'English',
    });
    if (!result) return null;
    try { return JSON.parse(result); } catch { return null; }
  }

  async evaluateFraming({ rawProblem, studentFraming }) {
    const framingText = typeof studentFraming === 'object'
      ? JSON.stringify(studentFraming) : String(studentFraming);
    const result = await this._call('08-evaluate-framing', {
      raw_problem: rawProblem,
      student_framing: framingText,
      language: 'English',
    });
    if (!result) return { grade: 'B', feedback: { message: 'LLM not configured' } };
    try {
      const parsed = JSON.parse(result);
      return { grade: parsed.grade || 'B', feedback: parsed };
    } catch {
      return { grade: 'B', feedback: { message: result } };
    }
  }

  async evaluateJudging({ aiSolution, judgingResponse }) {
    const judgingText = typeof judgingResponse === 'object'
      ? JSON.stringify(judgingResponse) : String(judgingResponse);
    const result = await this._call('09-evaluate-judging', {
      ai_solution: aiSolution,
      judging_response: judgingText,
      language: 'English',
    });
    if (!result) return { grade: 'B', feedback: { message: 'LLM not configured' } };
    try {
      const parsed = JSON.parse(result);
      return { grade: parsed.grade || 'B', feedback: parsed };
    } catch {
      return { grade: 'B', feedback: { message: result } };
    }
  }

  async evaluateSteering({ currentSolution, steeringResponse, updatedSolution }) {
    const steeringText = typeof steeringResponse === 'object'
      ? JSON.stringify(steeringResponse) : String(steeringResponse);
    const result = await this._call('10-evaluate-steering', {
      current_solution: currentSolution,
      steering_corrections: steeringText,
      updated_solution: updatedSolution,
      language: 'English',
    });
    if (!result) return { grade: 'B', feedback: { message: 'LLM not configured' } };
    try {
      const parsed = JSON.parse(result);
      return { grade: parsed.grade || 'B', feedback: parsed };
    } catch {
      return { grade: 'B', feedback: { message: result } };
    }
  }

  async generatePreview(data) {
    const result = await this._call('12-generate-example-preview', {
      course: data.course || 'General',
      subject: data.subject || 'General',
      response_type: data.responseType || 'mc',
      language: 'English',
    });
    return result || 'Preview not available. LLM service is not configured.';
  }

  getAvailableModels() {
    const models = [];
    if (process.env.OPENAI_API_KEY) models.push({ id: 'gpt-4o-mini', provider: 'openai', name: 'GPT-4o Mini' }, { id: 'gpt-4o', provider: 'openai', name: 'GPT-4o' });
    if (process.env.GROQ_API_KEY) models.push({ id: 'llama-3.1-70b-versatile', provider: 'groq', name: 'Llama 3.1 70B' });
    if (process.env.GEMINI_API_KEY) models.push({ id: 'gemini-2.0-flash', provider: 'google', name: 'Gemini 2.0 Flash' });
    if (process.env.COHERE_API_KEY) models.push({ id: 'command-r-plus', provider: 'cohere', name: 'Command R+' });
    return models;
  }
}

module.exports = { LLMService };
