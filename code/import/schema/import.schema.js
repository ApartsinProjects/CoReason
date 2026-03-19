'use strict';

const { z } = require('zod');

const InstitutionSchema = z.object({
  name: z.string().min(1),
  country: z.string().optional(),
  departments: z.array(z.string()).optional(),
});

const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(['student', 'instructor']),
  institution: z.string().optional(),
  password: z.string().min(6).optional(),
  language: z.string().length(2).optional(),
});

const SubjectNodeSchema = z.object({
  name: z.string().min(1),
  children: z.lazy(() => z.array(SubjectNodeSchema)).optional(),
});

const CourseSchema = z.object({
  name: z.string().min(1),
  institution: z.string().optional(),
  instructors: z.array(z.string().email()).optional(),
  description: z.string().optional(),
  subject_tree: z.array(SubjectNodeSchema).optional(),
  steward_config: z.record(z.any()).optional(),
});

const SubscriptionSchema = z.object({
  user: z.string().email(),
  course: z.string().min(1),
});

const ChallengeSchema = z.object({
  title: z.string().min(1),
  course: z.string().optional(),
  creator: z.string().email(),
  type: z.enum(['practice', 'assessment']).optional(),
  visibility: z.enum(['public', 'private']).optional(),
  phase1_response: z.enum(['mc', 'open-ended']).optional(),
  phase2_response: z.enum(['mc', 'open-ended']).optional(),
  max_cycles: z.number().int().min(1).max(10).optional(),
  subject_path: z.array(z.string()).optional(),
  instructions: z.record(z.string()).optional(),
});

const ImportSchema = z.object({
  version: z.string().optional(),
  import: z.object({
    institutions: z.array(InstitutionSchema).optional(),
    users: z.array(UserSchema).optional(),
    courses: z.array(CourseSchema).optional(),
    challenges: z.array(ChallengeSchema).optional(),
    subscriptions: z.array(SubscriptionSchema).optional(),
  }),
});

module.exports = { ImportSchema, InstitutionSchema, UserSchema, CourseSchema, ChallengeSchema, SubjectNodeSchema, SubscriptionSchema };
