'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class PromptEngine {
  constructor(logger) {
    this.logger = logger;
    this.prompts = {};
    this._loadPrompts();
  }

  _loadPrompts() {
    const promptsDir = path.resolve(__dirname, '../../prompts');
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

    if (prompt.system) {
      messages.push({ role: 'system', content: this.fillTemplate(prompt.system, variables) });
    }

    if (prompt.user) {
      messages.push({ role: 'user', content: this.fillTemplate(prompt.user, variables) });
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

    return {
      messages,
      temperature: prompt.temperature || 0.7,
      max_tokens: prompt.max_tokens || 2000,
      output_format: prompt.output_format || 'text',
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
