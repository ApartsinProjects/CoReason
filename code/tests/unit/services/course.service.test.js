'use strict';

const knex = require('knex');
const { CourseService } = require('../../../server/services/course.service');
const { v4: uuidv4 } = require('uuid');

const silentLogger = { info: () => {}, warn: () => {}, error: () => {}, debug: () => {} };

describe('CourseService', () => {
  let db, courseService, instructorId, studentId, instId;

  beforeAll(async () => {
    db = knex({
      client: 'better-sqlite3',
      connection: { filename: ':memory:' },
      useNullAsDefault: true,
    });
    const migration = require('../../../server/db/migrations/001_initial_schema');
    await migration.up(db);
    courseService = new CourseService(db, silentLogger);

    instId = uuidv4();
    instructorId = uuidv4();
    studentId = uuidv4();

    await db('institutions').insert({ id: instId, name: 'Test University', departments: '[]' });
    await db('users').insert([
      { id: instructorId, email: 'prof@test.com', name: 'Prof', role: 'instructor', institution_id: instId },
      { id: studentId, email: 'student@test.com', name: 'Student', role: 'student', institution_id: instId },
    ]);
  });

  afterAll(async () => { await db.destroy(); });

  afterEach(async () => {
    await db('course_subscriptions').del();
    await db('course_instructors').del();
    await db('courses').del();
  });

  it('creates a course and adds creator as instructor', async () => {
    const course = await courseService.create({
      name: 'Test Course',
      institutionId: instId,
      subjectTree: [{ name: 'Topic 1' }],
    }, instructorId);

    expect(course.id).toBeDefined();
    expect(course.name).toBe('Test Course');

    const membership = await db('course_instructors')
      .where({ course_id: course.id, user_id: instructorId }).first();
    expect(membership).toBeDefined();
  });

  it('student subscribes and unsubscribes', async () => {
    const course = await courseService.create({ name: 'Sub Test' }, instructorId);
    await courseService.subscribe(course.id, studentId);

    const subs = await courseService.getSubscribedCourses(studentId);
    expect(subs.length).toBe(1);

    await courseService.unsubscribe(course.id, studentId);
    const subsAfter = await courseService.getSubscribedCourses(studentId);
    expect(subsAfter.length).toBe(0);
  });

  it('prevents duplicate subscription', async () => {
    const course = await courseService.create({ name: 'Dup Sub' }, instructorId);
    await courseService.subscribe(course.id, studentId);
    await expect(courseService.subscribe(course.id, studentId)).rejects.toThrow('Already subscribed');
  });

  it('manages subject tree', async () => {
    const course = await courseService.create({ name: 'Tree Test' }, instructorId);
    const tree = [
      { name: 'Topic 1', children: [{ name: 'Subtopic 1.1' }] },
      { name: 'Topic 2' },
    ];
    await courseService.updateSubjectTree(course.id, tree, instructorId);
    const result = await courseService.getSubjectTree(course.id);
    expect(result.length).toBe(2);
    expect(result[0].children[0].name).toBe('Subtopic 1.1');
  });

  it('lists courses with institution name', async () => {
    await courseService.create({ name: 'Listed Course', institutionId: instId }, instructorId);
    const courses = await courseService.list();
    expect(courses.length).toBeGreaterThan(0);
    expect(courses[0].institution_name).toBe('Test University');
  });
});
