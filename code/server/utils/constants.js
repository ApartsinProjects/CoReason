'use strict';

// ============================================================
// Centralized constants for the CoReason server.
// Import from here instead of using hardcoded strings/numbers.
// ============================================================

// --- Server defaults ---
const SERVER = {
  DEFAULT_PORT: 3000,
  GRACEFUL_SHUTDOWN_TIMEOUT_MS: 10000,
  JSON_BODY_LIMIT: '1mb',
  SESSION_COOKIE_NAME: 'coreason.sid',
  SESSION_TABLE_NAME: 'user_sessions',
};

// --- User roles ---
const ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
};

const VALID_REGISTRATION_ROLES = [ROLES.STUDENT, ROLES.INSTRUCTOR];
const ALL_ROLES = [ROLES.STUDENT, ROLES.INSTRUCTOR, ROLES.ADMIN];

// --- Challenge statuses ---
const CHALLENGE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

// --- Challenge run statuses ---
const RUN_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
};

// --- Challenge run phases ---
const RUN_PHASE = {
  FRAMING: 'framing',
  JUDGING: 'judging',
  STEERING: 'steering',
  COMPLETE: 'complete',
};

// --- Challenge types ---
const CHALLENGE_TYPE = {
  PRACTICE: 'practice',
  ASSESSMENT: 'assessment',
};

// --- Challenge visibility ---
const VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};

// --- Response types ---
const RESPONSE_TYPE = {
  MC: 'mc',
  OPEN_ENDED: 'open-ended',
};

// --- Course statuses ---
const COURSE_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
};

// --- Import job statuses ---
const IMPORT_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  NOT_FOUND: 'not_found',  // return-only, not a DB value
};

// --- Grades ---
const GRADES = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  F: 'F',
  NA: 'N/A',
};

const GRADE_SCORES = {
  [GRADES.A]: 3,
  [GRADES.B]: 2,
  [GRADES.C]: 1,
};

const GRADE_THRESHOLDS = {
  A_MIN: 2.5,
  B_MIN: 1.5,
};

const GRADE_LETTERS = [GRADES.A, GRADES.B, GRADES.C, GRADES.D, GRADES.F];

// --- Default grade used as fallback ---
const DEFAULT_FALLBACK_GRADE = GRADES.B;
const DEFAULT_AGGREGATE_GRADE = GRADES.C;

// --- Challenge defaults ---
const DEFAULTS = {
  MAX_CYCLES: 5,
  RESPONSE_TYPE_PHASE1: RESPONSE_TYPE.MC,
  RESPONSE_TYPE_PHASE2: RESPONSE_TYPE.MC,
  PREFERRED_LANGUAGE: 'en',
  DEFAULT_LANGUAGE_NAME: 'English',
  BCRYPT_ROUNDS: 12,
};

// --- Language code → name mapping (for LLM prompts) ---
const LANGUAGE_NAMES = {
  en: 'English',
  he: 'Hebrew',
  fr: 'French',
  de: 'German',
  es: 'Spanish',
};

// --- MC question parameters (for LLM-generated multiple-choice) ---
const MC_PARAMS = {
  FRAMING:  { num_options: 5, num_correct: 3, num_incorrect: 2 },
  JUDGING:  { num_options: 5, num_correct: 3, num_incorrect: 2 },
  STEERING: { num_options: 5, num_correct: 2, num_incorrect: 3 },
};

// --- Validation constraints ---
const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_TITLE_LENGTH: 200,
  MAX_COURSE_NAME_LENGTH: 200,
  MAX_CYCLES_LIMIT: 20,
};

// --- PDF layout constants ---
const PDF_LAYOUT = {
  MARGIN: 50,
  RIGHT_BOUNDARY: 545,
  PAGE_BREAK_Y: 720,
  FOOTER_Y: 780,
  TABLE_COLUMNS: { name: 50, challenge: 180, status: 340, framing: 410, judging: 450, steering: 490 },
  TABLE_COLUMN_WIDTHS: { name: 125, challenge: 155, status: 65 },
  CHALLENGE_TITLE_MAX_LENGTH: 25,
};

// --- Pagination ---
const PAGINATION = {
  ADMIN_RUNS_LIMIT: 100,
};

// --- Database table names (for admin db-tables endpoint) ---
const DB_TABLES = [
  'institutions',
  'users',
  'courses',
  'course_subscriptions',
  'course_instructors',
  'challenges',
  'challenge_runs',
  'challenge_run_cycles',
  'prompt_templates',
  'ui_labels',
  'import_jobs',
];

// --- LLM provider names ---
const LLM_PROVIDER = {
  OPENAI: 'openai',
  GROQ: 'groq',
  GOOGLE: 'google',
  COHERE: 'cohere',
};

// --- Default LLM models ---
const LLM_MODELS = {
  OPENAI_DEFAULT: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  OPENAI_FULL: process.env.OPENAI_MODEL_FULL || 'gpt-4o',
  GROQ_DEFAULT: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  GROQ_BASE_URL: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
  GEMINI_DEFAULT: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  COHERE_DEFAULT: process.env.COHERE_MODEL || 'command-r-plus',
};

// --- Available LLM model definitions for getAvailableModels() ---
const LLM_MODEL_CATALOG = {
  openai: [
    { id: LLM_MODELS.OPENAI_DEFAULT, provider: LLM_PROVIDER.OPENAI, name: 'GPT-4o Mini' },
    { id: LLM_MODELS.OPENAI_FULL, provider: LLM_PROVIDER.OPENAI, name: 'GPT-4o' },
  ],
  groq: [
    { id: LLM_MODELS.GROQ_DEFAULT, provider: LLM_PROVIDER.GROQ, name: 'Llama 3.3 70B' },
  ],
  google: [
    { id: LLM_MODELS.GEMINI_DEFAULT, provider: LLM_PROVIDER.GOOGLE, name: 'Gemini 2.0 Flash' },
  ],
  cohere: [
    { id: LLM_MODELS.COHERE_DEFAULT, provider: LLM_PROVIDER.COHERE, name: 'Command R+' },
  ],
};

// --- Prompt engine defaults ---
const PROMPT_DEFAULTS = {
  TEMPERATURE: 0.7,
  MAX_TOKENS: 2000,
  OUTPUT_FORMAT: 'text',
};

// --- Paths (relative to server root) ---
const PATHS = {
  PROMPTS_DIR_FROM_LLM: '../../prompts',
  PROMPTS_DIR_FROM_ROUTES: '../../../prompts',
  PROMPTS_DIR_FROM_SERVICES: '../../prompts',
  CONTENT_DIR_FROM_SERVICES: '../../content/en',
};

// --- Error handler defaults ---
const ERROR_HANDLER = {
  CACHE_MAX: 1000,
  CACHE_TTL_MS: 3600000, // 1 hour
};

// --- Logger defaults ---
const LOGGER_DEFAULTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10 MB
  MAX_FILES: 5,
  SERVICE_NAME: 'coreason',
};

// --- LLM stub/fallback messages ---
const LLM_FALLBACK = {
  SERVICE_NOT_AVAILABLE: 'LLM service not available',
  NOT_CONFIGURED_PLACEHOLDER: 'LLM not configured. This is a placeholder problem.',
  NOT_CONFIGURED_FEEDBACK: 'LLM not configured',
  NOT_CONFIGURED_AI_SOLUTION: 'LLM not configured. Placeholder AI solution with intentional issues for judging practice.',
  NOT_CONFIGURED_STEERING_SUFFIX: '\n\n[Updated based on steering - LLM not configured]',
  PREVIEW_NOT_AVAILABLE: 'Preview not available. LLM service is not configured.',
  PLACEHOLDER_AI_SOLUTION: 'Placeholder AI solution. The LLM service is not configured.',
  UPDATED_SOLUTION_SUFFIX: '\n\n[Updated based on corrections]',
  NOT_AVAILABLE_SUFFIX: '\n\n[LLM not available]',
};

// --- LLM stub MC options for fallback ---
const LLM_STUB_MC_OPTIONS = {
  options: [
    { label: GRADES.A, text: 'Option A' },
    { label: GRADES.B, text: 'Option B' },
  ],
};

// --- LLM fallback framing MC options (used when LLM is unavailable or fails) ---
const LLM_FALLBACK_FRAMING_OPTIONS = [
  { letter: 'A', text: 'Define the scope and constraints of the problem more precisely', correct: true },
  { letter: 'B', text: 'Identify the key variables and their relationships', correct: true },
  { letter: 'C', text: 'Skip the analysis and jump to a solution immediately', correct: false },
  { letter: 'D', text: 'Break the problem into smaller, manageable sub-problems', correct: true },
  { letter: 'E', text: 'Assume all unstated constraints are irrelevant', correct: false },
];

// --- LLM fallback judging MC options ---
const LLM_FALLBACK_JUDGING_OPTIONS = [
  { letter: 'A', text: 'The solution correctly addresses the core problem requirements', correct: true },
  { letter: 'B', text: 'The solution makes unsupported assumptions', correct: true },
  { letter: 'C', text: 'The solution is perfectly complete with no issues', correct: false },
  { letter: 'D', text: 'The solution could benefit from additional edge case analysis', correct: true },
  { letter: 'E', text: 'The solution format is the only thing that matters', correct: false },
];

// --- LLM fallback steering MC options ---
const LLM_FALLBACK_STEERING_OPTIONS = [
  { letter: 'A', text: 'Revise the solution to address the identified gaps', correct: true },
  { letter: 'B', text: 'Add more detailed analysis of edge cases', correct: true },
  { letter: 'C', text: 'Remove all constraints to simplify the solution', correct: false },
  { letter: 'D', text: 'Strengthen the reasoning with supporting evidence', correct: true },
  { letter: 'E', text: 'Accept the current output without changes', correct: false },
];

// --- LLM stub subject tree for fallback ---
const LLM_STUB_SUBJECT_TREE = [
  { name: 'Topic 1', children: [{ name: 'Subtopic 1' }] },
];

// --- LLM fallback subject tree (richer, for generateSubjectTree) ---
const LLM_FALLBACK_SUBJECT_TREE = [
  { name: 'Foundations', children: [{ name: 'Core Concepts' }, { name: 'Prerequisites' }] },
  { name: 'Main Topics', children: [{ name: 'Topic 1' }, { name: 'Topic 2' }] },
  { name: 'Advanced Topics', children: [{ name: 'Applications' }, { name: 'Research Frontiers' }] },
];

// --- Auth redirect paths ---
const AUTH_REDIRECTS = {
  GOOGLE_FAILURE: '/login.html',
  GOOGLE_SUCCESS: '/challenge-list.html',
};

// --- PDF report strings ---
const PDF = {
  APP_NAME: 'AI CoReasoning Lab',
  REPORT_TITLE: 'Course Analytics Report',
};

module.exports = {
  SERVER,
  ROLES,
  VALID_REGISTRATION_ROLES,
  ALL_ROLES,
  CHALLENGE_STATUS,
  RUN_STATUS,
  RUN_PHASE,
  CHALLENGE_TYPE,
  VISIBILITY,
  RESPONSE_TYPE,
  COURSE_STATUS,
  IMPORT_STATUS,
  GRADES,
  GRADE_SCORES,
  GRADE_THRESHOLDS,
  GRADE_LETTERS,
  DEFAULT_FALLBACK_GRADE,
  DEFAULT_AGGREGATE_GRADE,
  DEFAULTS,
  PAGINATION,
  DB_TABLES,
  LLM_PROVIDER,
  LLM_MODELS,
  LLM_MODEL_CATALOG,
  PROMPT_DEFAULTS,
  PATHS,
  ERROR_HANDLER,
  LOGGER_DEFAULTS,
  LLM_FALLBACK,
  LLM_STUB_MC_OPTIONS,
  LLM_FALLBACK_FRAMING_OPTIONS,
  LLM_FALLBACK_JUDGING_OPTIONS,
  LLM_FALLBACK_STEERING_OPTIONS,
  LLM_STUB_SUBJECT_TREE,
  LLM_FALLBACK_SUBJECT_TREE,
  AUTH_REDIRECTS,
  PDF,
  PDF_LAYOUT,
  LANGUAGE_NAMES,
  MC_PARAMS,
  VALIDATION,
};
