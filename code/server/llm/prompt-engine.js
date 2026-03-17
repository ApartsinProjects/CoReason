'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { PATHS, PROMPT_DEFAULTS } = require('../utils/constants');

class PromptEngine {
  constructor(logger) {
    this.logger = logger;
    this.prompts = {};
    this._loadPrompts();
  }

  _loadPrompts() {
    const promptsDir = path.resolve(__dirname, PATHS.PROMPTS_DIR_FROM_LLM);
    if (!fs.existsSync(promptsDir)) {
      this.logger.warn('Prompts directory not found');
      return;
    }

    const files = fs.readdirSync(promptsDir).filter(f => f.endsWith('.yaml'));
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(promptsDir, file), 'utf8');
        const parsed = yaml.load(content);
        const id = file.replace('.yaml', '');
        this.prompts[id] = parsed;
        this.logger.debug(`Loaded prompt: ${id}`);
      } catch (err) {
        this.logger.error(`Failed to load prompt ${file}:`, err);
      }
    }
    this.logger.info(`Loaded ${Object.keys(this.prompts).length} prompt templates`);
  }

  getPrompt(id) {
    return this.prompts[id] || null;
  }

  fillTemplate(template, variables) {
    let text = typeof template === 'string' ? template : JSON.stringify(template);
    for (const [key, value] of Object.entries(variables)) {
      text = text.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value));
    }
    return typeof template === 'string' ? text : JSON.parse(text);
  }

  buildMessages(promptId, variables) {
    const prompt = this.getPrompt(promptId);
    if (!prompt) {
      throw new Error(`Prompt not found: ${promptId}`);
    }

    const messages = [];

    const systemContent = prompt.system || prompt.system_prompt;
    if (systemContent) {
      messages.push({ role: 'system', content: this.fillTemplate(systemContent, variables) });
    }

    const userContent = prompt.user || prompt.user_prompt;
    if (userContent) {
      messages.push({ role: 'user', content: this.fillTemplate(userContent, variables) });
    }

    // Handle messages array format
    if (prompt.messages) {
      for (const msg of prompt.messages) {
        messages.push({
          role: msg.role,
          content: this.fillTemplate(msg.content, variables),
        });
      }
    }

    // Check both root-level and nested parameters block
    const params = prompt.parameters || {};
    return {
      messages,
      temperature: prompt.temperature || params.temperature || PROMPT_DEFAULTS.TEMPERATURE,
      max_tokens: prompt.max_tokens || params.max_tokens || PROMPT_DEFAULTS.MAX_TOKENS,
      output_format: prompt.output_format || params.output_format || PROMPT_DEFAULTS.OUTPUT_FORMAT,
    };
  }

  listPrompts() {
    return Object.entries(this.prompts).map(([id, p]) => ({
      id,
      description: p.description || id,
      variables: this._extractVariables(p),
    }));
  }

  _extractVariables(prompt) {
    const text = JSON.stringify(prompt);
    const matches = text.match(/\{\{(\w+)\}\}/g) || [];
    return [...new Set(matches.map(m => m.replace(/[{}]/g, '')))];
  }
}

module.exports = { PromptEngine };
