'use strict';

const knex = require('knex');
const { ChallengeService } = require('../../../server/services/challenge.service');
const { v4: uuidv4 } = require('uuid');

const silentLogger = { info: () => {}, warn: () => {}, error: () => {}, debug: () => {} };

describe('ChallengeService', () => {
  let db, challengeService, instructorId, studentId, courseId;

  beforeAll(async () => {
    db = knex({
      client: 'better-sqlite3',
      connection: { filename: ':memory:' },
      useNullAsDefault: true,
    });
    const migration001 = require('../../../server/db/migrations/001_initial_schema');
    const migration002 = require('../../../server/db/migrations/002_add_department_and_indexes');
    await migration001.up(db);
    await migration002.up(db);
    challengeService = new ChallengeService(db, silentLogger);

    // Create test users
    instructorId = uuidv4();
    studentId = uuidv4();
    courseId = uuidv4();

    await db('users').insert([
      { id: instructorId, email: 'prof@test.com', name: 'Professor', role: 'instructor' },
      { id: studentId, email: 'student@test.com', name: 'Student', role: 'student' },
    ]);
    await db('courses').insert({
      id: courseId, name: 'Test Course', subject_tree: '[]', steward_config: '{}', status: 'active',
    });
  });

  afterAll(async () => { await db.destroy(); });

  afterEach(async () => {
    await db('challenge_run_cycles').del();
    await db('challenge_runs').del();
    await db('challenges').del();
  });

  describe('create', () => {
    it('creates a public challenge for instructor', async () => {
      const ch = await challengeService.create({
        title: 'Test Challenge',
        courseId,
        visibility: 'public',
        challengeType: 'practice',
        phase1ResponseType: 'mc',
        phase2ResponseType: 'mc',
        maxCycles: 5,
      }, instructorId, 'instructor');

      expect(ch.id).toBeDefined();
      expect(ch.title).toBe('Test Challenge');
      expect(ch.status).toBe('draft');
    });

    it('creates a private challenge for student', async () => {
      const ch = await challengeService.create({
        title: 'Student Challenge',
        visibility: 'private',
      }, studentId, 'student');
      expect(ch.visibility).toBe('private');
    });

    it('rejects public challenge from student', async () => {
      await expect(challengeService.create({
        title: 'Public Student',
        visibility: 'public',
      }, studentId, 'student')).rejects.toThrow('Students can only create private challenges');
    });
  });

  describe('list', () => {
    beforeEach(async () => {
      await challengeService.create({ title: 'Public 1', visibility: 'public', courseId }, instructorId, 'instructor');
      await challengeService.create({ title: 'Public 2', visibility: 'public', courseId }, instructorId, 'instructor');
      await challengeService.create({ title: 'Private', visibility: 'private' }, studentId, 'student');
    });

    it('lists public challenges for anonymous user', async () => {
      const list = await challengeService.list({});
      expect(list.length).toBe(2);
    });

    it('lists public + own private for authenticated user', async () => {
      const list = await challengeService.list({}, studentId);
      expect(list.length).toBe(3);
    });

    it('filters by course', async () => {
      const list = await challengeService.list({ courseId });
      expect(list.length).toBe(2);
    });
  });

  describe('archive/delete', () => {
    it('archives challenge', async () => {
      const ch = await challengeService.create({ title: 'To Archive' }, instructorId, 'instructor');
      await challengeService.archive(ch.id, instructorId);
      const archived = await db('challenges').where({ id: ch.id }).first();
      expect(archived.status).toBe('archived');
    });

    it('deletes challenge without runs', async () => {
      const ch = await challengeService.create({ title: 'To Delete' }, instructorId, 'instructor');
      const result = await challengeService.delete(ch.id, instructorId);
      expect(result.deleted).toBe(true);
    });

    it('archives instead of deleting if runs exist', async () => {
      const ch = await challengeService.create({ title: 'Has Runs' }, instructorId, 'instructor');
      await db('challenge_runs').insert({
        id: uuidv4(), challenge_id: ch.id, user_id: studentId, status: 'completed',
      });
      const result = await challengeService.delete(ch.id, instructorId);
      expect(result.archived).toBe(true);
    });

    it('prevents non-creator from deleting', async () => {
      const ch = await challengeService.create({ title: 'Not Yours' }, instructorId, 'instructor');
      await expect(challengeService.delete(ch.id, studentId)).rejects.toThrow('Only the creator');
    });
  });

  describe('publish', () => {
    it('publishes challenge with course', async () => {
      const ch = await challengeService.create({
        title: 'To Publish', courseId, visibility: 'private',
      }, instructorId, 'instructor');
      const published = await challengeService.publish(ch.id, instructorId);
      expect(published.status).toBe('published');
      expect(published.visibility).toBe('public');
    });

    it('rejects publish without course', async () => {
      const ch = await challengeService.create({ title: 'No Course' }, instructorId, 'instructor');
      await expect(challengeService.publish(ch.id, instructorId)).rejects.toThrow('must be assigned to a course');
    });
  });
});
