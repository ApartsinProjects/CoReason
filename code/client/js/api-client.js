/**
 * CoReason API Client
 * Thin fetch() wrapper for all backend API calls.
 * Handles auth, errors, and base URL configuration.
 */
'use strict';

const API = (() => {
  const baseUrl = window.location.origin + '/api/v1';

  class ApiError extends Error {
    constructor(code, message, status, details, traceId) {
      super(message);
      this.name = 'ApiError';
      this.code = code;
      this.status = status;
      this.details = details;
      this.traceId = traceId;
    }
  }

  async function request(method, path, body, options = {}) {
    const url = baseUrl + path;
    const headers = { 'Content-Type': 'application/json' };
    if (options.language) {
      headers['Accept-Language'] = options.language;
    }

    try {
      const res = await fetch(url, {
        method,
        headers,
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
      });

      if (res.status === 204) return null;

      const data = await res.json();

      if (!res.ok) {
        const err = data.error || {};
        throw new ApiError(
          err.code || 'UNKNOWN',
          err.message || `Request failed: ${res.status}`,
          res.status,
          err.details,
          err.traceId
        );
      }

      return data;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error(`[API] ${method} ${path} failed:`, err);
      throw new ApiError('NETWORK_ERROR', 'Network error: ' + err.message, 0);
    }
  }

  return {
    ApiError,
    get:    (path, opts) => request('GET', path, null, opts),
    post:   (path, body, opts) => request('POST', path, body, opts),
    put:    (path, body, opts) => request('PUT', path, body, opts),
    delete: (path, opts) => request('DELETE', path, null, opts),

    // --- Auth ---
    auth: {
      register: (data) => request('POST', '/auth/register', data),
      login: (email, password) => request('POST', '/auth/login', { email, password }),
      logout: () => request('POST', '/auth/logout'),
      me: () => request('GET', '/auth/me'),
      googleUrl: baseUrl + '/auth/google',
    },

    // --- Users ---
    users: {
      profile: () => request('GET', '/users/me'),
      update: (data) => request('PUT', '/users/me', data),
      stats: () => request('GET', '/users/me/stats'),
    },

    // --- Institutions ---
    institutions: {
      list: () => request('GET', '/institutions'),
    },

    // --- Courses ---
    courses: {
      list: (params) => request('GET', '/courses' + toQuery(params)),
      create: (data) => request('POST', '/courses', data),
      get: (id) => request('GET', `/courses/${id}`),
      update: (id, data) => request('PUT', `/courses/${id}`, data),
      subscribe: (id) => request('POST', `/courses/${id}/subscribe`),
      unsubscribe: (id) => request('DELETE', `/courses/${id}/subscribe`),
      join: (id) => request('POST', `/courses/${id}/join`),
      leave: (id) => request('DELETE', `/courses/${id}/leave`),
      subjects: (id) => request('GET', `/courses/${id}/subjects`),
    },

    // --- Challenges ---
    challenges: {
      list: (params) => request('GET', '/challenges' + toQuery(params)),
      create: (data) => request('POST', '/challenges', data),
      get: (id) => request('GET', `/challenges/${id}`),
      update: (id, data) => request('PUT', `/challenges/${id}`, data),
      rename: (id, title) => request('PUT', `/challenges/${id}/rename`, { title }),
      archive: (id) => request('PUT', `/challenges/${id}/archive`),
      delete: (id) => request('DELETE', `/challenges/${id}`),
      publish: (id) => request('POST', `/challenges/${id}/publish`),
    },

    // --- Challenge Runs ---
    runs: {
      start: (challengeId) => request('POST', `/challenges/${challengeId}/runs`),
      get: (runId) => request('GET', `/runs/${runId}`),
      submitFraming: (runId, response) => request('PUT', `/runs/${runId}/framing`, response),
      submitJudging: (runId, cycle, response) => request('PUT', `/runs/${runId}/cycles/${cycle}/judging`, response),
      submitSteering: (runId, cycle, response) => request('PUT', `/runs/${runId}/cycles/${cycle}/steering`, response),
      complete: (runId) => request('PUT', `/runs/${runId}/complete`),
      report: (runId) => request('GET', `/runs/${runId}/report`),
    },

    // --- Analytics ---
    analytics: {
      student: () => request('GET', '/analytics/student'),
      challengeDetail: (id) => request('GET', `/analytics/student/challenge/${id}`),
      instructor: (courseId) => request('GET', `/analytics/instructor/${courseId}`),
      export: (courseId) => request('GET', `/analytics/instructor/${courseId}/export`),
      exportPdf: (courseId) => {
        // Direct download — open in new tab/download
        window.open(`${BASE_URL}/analytics/instructor/${courseId}/export/pdf`, '_blank');
      },
    },

    // --- Import ---
    import: {
      batch: (yamlContent) => request('POST', '/import/batch', { content: yamlContent }),
      status: (jobId) => request('GET', `/import/status/${jobId}`),
    },

    // --- LLM ---
    llm: {
      preview: (data) => request('POST', '/llm/preview', data),
      models: () => request('GET', '/llm/models'),
    },

    // --- Health ---
    health: () => request('GET', '/../health'),  // /api/health (outside v1)
  };

  function toQuery(params) {
    if (!params) return '';
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') qs.set(k, v);
    }
    const str = qs.toString();
    return str ? '?' + str : '';
  }
})();

// Make available globally
if (typeof window !== 'undefined') {
  window.API = API;
}
