'use strict';

const { z } = require('zod');
const { VALIDATION, DEFAULTS, VALID_REGISTRATION_ROLES, ROLES } = require('../utils/constants');

// --- Auth schemas ---
const registerBody = z.object({
  email: z.string().email('Invalid email format').trim(),
  password: z.string().min(VALIDATION.MIN_PASSWORD_LENGTH, `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`),
  name: z.string().min(1, 'Name is required').trim(),
  role: z.enum(VALID_REGISTRATION_ROLES).optional().default(ROLES.STUDENT),
  institutionId: z.string().uuid().optional().nullable(),
});

const loginBody = z.object({
  email: z.string().email('Invalid email format').trim(),
  password: z.string().min(1, 'Password is required'),
});

// --- Challenge schemas ---
const createChallengeBody = z.object({
  title: z.string().min(1, 'Title is required').max(VALIDATION.MAX_TITLE_LENGTH, 'Title too long').trim(),
  courseId: z.string().uuid().optional().nullable(),
  subjectPath: z.array(z.string()).optional().default([]),
  challengeType: z.enum(['practice', 'assessment']).optional().default('practice'),
  visibility: z.enum(['public', 'private']).optional().default('private'),
  maxCycles: z.number().int().min(1).max(VALIDATION.MAX_CYCLES_LIMIT).optional().default(DEFAULTS.MAX_CYCLES),
  responseConfig: z.object({
    framing: z.enum(['mc', 'open-ended']).optional(),
    judging: z.enum(['mc', 'open-ended']).optional(),
    steering: z.enum(['mc', 'open-ended']).optional(),
    phase1: z.enum(['mc', 'open-ended']).optional(),
    phase2: z.enum(['mc', 'open-ended']).optional(),
  }).optional().default({}),
  instructions: z.any().optional().default({}),
  description: z.string().optional().default(''),
  rubrics: z.any().optional().nullable(),
}).passthrough();

// --- Course schemas ---
const createCourseBody = z.object({
  name: z.string().min(1, 'Course name is required').max(VALIDATION.MAX_COURSE_NAME_LENGTH).trim(),
  description: z.string().optional().default(''),
  department: z.string().optional().nullable(),
  institutionId: z.string().uuid().optional().nullable(),
  subjectTree: z.array(z.any()).optional().default([]),
  stewardConfig: z.any().optional().default({}),
}).passthrough();

// --- Run schemas ---
const startRunBody = z.object({
  challengeId: z.string().uuid('Invalid challenge ID'),
});

const submitResponseBody = z.object({}).passthrough(); // Accept any response shape

// --- ID param ---
const idParam = z.object({
  id: z.string().uuid('Invalid ID format'),
});

const runIdParam = z.object({
  runId: z.string().uuid('Invalid run ID format'),
});

module.exports = {
  registerBody,
  loginBody,
  createChallengeBody,
  createCourseBody,
  startRunBody,
  submitResponseBody,
  idParam,
  runIdParam,
};
