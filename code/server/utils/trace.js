'use strict';

const { v4: uuidv4 } = require('uuid');

class TraceRecorder {
  constructor(logger) {
    this.logger = logger;
  }

  // Record an LLM routing/execution decision
  llmCall(promptId, model, variables, response) {
    this.logger.trace('llm-call', {
      traceId: uuidv4(),
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
      traceId: uuidv4(),
      challengeId,
      selectedModel,
      reason,
    });
  }

  // Record a grading decision
  grading(runId, cycleNum, skill, grade, reasoning) {
    this.logger.trace('grading', {
      traceId: uuidv4(),
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
      traceId: uuidv4(),
      type,
      count,
      status,
      errors: errors?.length || 0,
    });
  }

  // Generic trace
  record(type, data) {
    this.logger.trace(type, {
      traceId: uuidv4(),
      ...data,
    });
  }
}

module.exports = { TraceRecorder };
