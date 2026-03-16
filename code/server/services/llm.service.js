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
    // Initialize all available LLM providers for automatic fallback
    const OpenAI = require('openai');
    this.providers = [];

    try {
      if (process.env.OPENAI_API_KEY) {
        this.providers.push({
          name: 'openai',
          client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
          model: 'gpt-4o-mini',
        });
        this.logger.info('LLM provider registered: OpenAI');
      }
      if (process.env.GROQ_API_KEY) {
        this.providers.push({
          name: 'groq',
          client: new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' }),
          model: 'llama-3.3-70b-versatile',
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
    if (this.providers.length === 0) {
      this.logger.warn(`LLM not available for prompt ${promptId}, returning fallback`);
      return null;
    }

    const { messages, temperature, max_tokens } = this.promptEngine.buildMessages(promptId, variables);

    // Try each provider with automatic fallback
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      const model = options.model || provider.model;
      const start = Date.now();

      try {
        this.logger.debug('LLM call', { promptId, model, provider: provider.name });

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
          promptId, model, provider: provider.name, latency_ms: latency,
          tokens: response.usage?.total_tokens,
        });

        return content;

      } catch (err) {
        const latency = Date.now() - start;
        this.logger.warn('LLM call failed, trying next provider', {
          promptId, model, provider: provider.name, latency_ms: latency, error: err.message,
        });

        // If this is the last provider, throw
        if (i === this.providers.length - 1) {
          throw new LLMError(`LLM call failed for ${promptId}: ${err.message}`, { promptId, model });
        }
      }
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

  async generateSubjectTree({ courseName, courseDescription, institution, existingTree, instructions, language }) {
    const variables = {
      course_name: courseName || 'Untitled Course',
      course_description: courseDescription || '',
      institution: institution || '',
      existing_tree: existingTree ? JSON.stringify(existingTree, null, 2) : '',
      instructions: instructions || '',
      language: language || 'English',
    };

    const result = await this._call('13-generate-subject-tree', variables);
    if (!result) {
      // Fallback: return a basic tree structure
      return [
        { name: 'Foundations', children: [{ name: 'Core Concepts' }, { name: 'Prerequisites' }] },
        { name: 'Main Topics', children: [{ name: 'Topic 1' }, { name: 'Topic 2' }] },
        { name: 'Advanced Topics', children: [{ name: 'Applications' }, { name: 'Research Frontiers' }] },
      ];
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
      language: language || 'English',
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
    if (process.env.GROQ_API_KEY) models.push({ id: 'llama-3.3-70b-versatile', provider: 'groq', name: 'Llama 3.3 70B' });
    if (process.env.GEMINI_API_KEY) models.push({ id: 'gemini-2.0-flash', provider: 'google', name: 'Gemini 2.0 Flash' });
    if (process.env.COHERE_API_KEY) models.push({ id: 'command-r-plus', provider: 'cohere', name: 'Command R+' });
    return models;
  }
}

module.exports = { LLMService };
