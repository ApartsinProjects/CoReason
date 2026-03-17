'use strict';

const { v4: uuidv4 } = require('uuid');
const asyncContext = require('./async-context');

class TraceRecorder {
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * Get current request traceId from async context, or generate a standalone one.
   */
  _getTraceId() {
    return asyncContext.getTraceId() || uuidv4().slice(0, 8);
  }

  // Record an LLM routing/execution decision
  llmCall(promptId, model, variables, response) {
    this.logger.trace('llm-call', {
      traceId: this._getTraceId(),
      promptId,
      model,
      variables: Object.keys(variables),
      tokens: response?.usage || null,
      latency_ms: response?._latency || null,
    });
  }

  // Record a model selection decision
  modelSelection(challengeId, selectedModel, reason) {
    this.logger.trace('model-selection', {
      traceId: this._getTraceId(),
      challengeId,
      selectedModel,
      reason,
    });
  }

  // Record a grading decision
  grading(runId, cycleNum, skill, grade, reasoning) {
    this.logger.trace('grading', {
      traceId: this._getTraceId(),
      runId,
      cycleNum,
      skill,
      grade,
      reasoning,
    });
  }

  // Record an import operation
  import(type, count, status, errors) {
    this.logger.trace('import', {
      traceId: this._getTraceId(),
      type,
      count,
      status,
      errors: errors?.length || 0,
    });
  }

  // Generic trace
  record(type, data) {
    this.logger.trace(type, {
      traceId: this._getTraceId(),
      ...data,
    });
  }
}

module.exports = { TraceRecorder };
