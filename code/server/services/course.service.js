'use strict';

const { v4: uuidv4 } = require('uuid');
const { NotFoundError, ForbiddenError, ConflictError } = require('../utils/errors');
const { COURSE_STATUS } = require('../utils/constants');
const { safeParse } = require('../utils/helpers');

class CourseService {
  constructor(db, logger) {
    this.db = db;
    this.logger = logger;
  }

  async list(filters = {}) {
    let query = this.db('courses')
      .leftJoin('institutions', 'courses.institution_id', 'institutions.id')
      .select(
        'courses.*',
        'institutions.name as institution_name'
      )
      .where('courses.status', COURSE_STATUS.ACTIVE);

    // When instructor=true, only show courses the user is assigned to
    if (filters.instructorOnly && filters.userId) {
      query = query
        .join('course_instructors', 'courses.id', 'course_instructors.course_id')
        .where('course_instructors.user_id', filters.userId);
    }

    if (filters.institutionId) {
      query = query.where('courses.institution_id', filters.institutionId);
    } else if (filters.userInstitutionId) {
      // Auto-filter by user's institution when no explicit filter
      query = query.where('courses.institution_id', filters.userInstitutionId);
    }
    if (filters.search) {
      query = query.where('courses.name', 'like', `%${filters.search}%`);
    }

    const courses = await query.orderBy('courses.name');

    // Enrich with aggregate counts
    if (courses.length > 0) {
      const courseIds = courses.map(c => c.id);

      const challengeCounts = await this.db('challenges')
        .whereIn('course_id', courseIds)
        .where('status', 'published')
        .groupBy('course_id')
        .select('course_id')
        .count('* as cnt');
      const challengeMap = {};
      challengeCounts.forEach(r => { challengeMap[r.course_id] = r.cnt; });

      const instructorCounts = await this.db('course_instructors')
        .whereIn('course_id', courseIds)
        .groupBy('course_id')
        .select('course_id')
        .count('* as cnt');
      const instructorMap = {};
      instructorCounts.forEach(r => { instructorMap[r.course_id] = r.cnt; });

      const studentCounts = await this.db('course_subscriptions')
        .whereIn('course_id', courseIds)
        .groupBy('course_id')
        .select('course_id')
        .count('* as cnt');
      const studentMap = {};
      studentCounts.forEach(r => { studentMap[r.course_id] = r.cnt; });

      // Add subscription status if userId provided
      let subSet = new Set();
      if (filters.userId) {
        const subs = await this.db('course_subscriptions')
          .where('user_id', filters.userId)
          .whereIn('course_id', courseIds)
          .select('course_id');
        subs.forEach(s => subSet.add(s.course_id));
      }

      courses.forEach(c => {
        c.challenge_count = challengeMap[c.id] || 0;
        c.instructor_count = instructorMap[c.id] || 0;
        c.student_count = studentMap[c.id] || 0;
        if (filters.userId) {
          c.is_subscribed = subSet.has(c.id);
        }
      });
    }

    return courses;
  }

  async getById(id) {
    const course = await this.db('courses')
      .leftJoin('institutions', 'courses.institution_id', 'institutions.id')
      .select('courses.*', 'institutions.name as institution_name')
      .where('courses.id', id)
      .first();
    if (!course) throw new NotFoundError('Course', id);
    return course;
  }

  async create({ name, description, institutionId, department, subjectTree, stewardConfig }, userId) {
    const course = {
      id: uuidv4(),
      name,
      description: description || null,
      institution_id: institutionId || null,
      department: department || null,
      subject_tree: JSON.stringify(subjectTree || []),
      steward_config: JSON.stringify(stewardConfig || {}),
      status: COURSE_STATUS.ACTIVE,
    };

    // Use transaction to ensure both course and instructor membership are created atomically
    await this.db.transaction(async (trx) => {
      await trx('courses').insert(course);
      await trx('course_instructors').insert({
        id: uuidv4(),
        user_id: userId,
        course_id: course.id,
      });
    });

    this.logger.info('Course created', { courseId: course.id, name, userId });
    return course;
  }

  async update(id, updates, userId) {
    // Verify instructor
    await this._requireInstructor(id, userId);

    const allowed = ['name', 'description', 'department', 'subject_tree', 'steward_config', 'status'];
    const filtered = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        filtered[key] = typeof updates[key] === 'object' ? JSON.stringify(updates[key]) : updates[key];
      }
    }
    filtered.updated_at = new Date().toISOString();

    await this.db('courses').where({ id }).update(filtered);
    this.logger.info('Course updated', { courseId: id, userId, fields: Object.keys(filtered) });
    return this.getById(id);
  }

  async subscribe(courseId, userId) {
    await this.getById(courseId); // verify exists
    const existing = await this.db('course_subscriptions')
      .where({ user_id: userId, course_id: courseId }).first();
    if (existing) throw new ConflictError('Already subscribed');

    await this.db('course_subscriptions').insert({
      id: uuidv4(),
      user_id: userId,
      course_id: courseId,
    });
    this.logger.info('Course subscribed', { courseId, userId });
  }

  async unsubscribe(courseId, userId) {
    const deleted = await this.db('course_subscriptions')
      .where({ user_id: userId, course_id: courseId }).del();
    if (!deleted) throw new NotFoundError('Subscription', `${userId}/${courseId}`);
    this.logger.info('Course unsubscribed', { courseId, userId });
  }

  async joinAsInstructor(courseId, userId) {
    await this.getById(courseId);
    const existing = await this.db('course_instructors')
      .where({ user_id: userId, course_id: courseId }).first();
    if (existing) throw new ConflictError('Already joined as instructor');

    await this.db('course_instructors').insert({
      id: uuidv4(),
      user_id: userId,
      course_id: courseId,
    });
    this.logger.info('Instructor joined course', { courseId, userId });
  }

  async leaveAsInstructor(courseId, userId) {
    const deleted = await this.db('course_instructors')
      .where({ user_id: userId, course_id: courseId }).del();
    if (!deleted) throw new NotFoundError('Instructor membership', `${userId}/${courseId}`);
    this.logger.info('Instructor left course', { courseId, userId });
  }

  async getSubjectTree(courseId) {
    const course = await this.getById(courseId);
    return safeParse(course.subject_tree, []);
  }

  async updateSubjectTree(courseId, tree, userId) {
    await this._requireInstructor(courseId, userId);
    await this.db('courses').where({ id: courseId }).update({
      subject_tree: JSON.stringify(tree),
      updated_at: new Date().toISOString(),
    });
    return tree;
  }

  async getSubscribedCourses(userId) {
    return this.db('courses')
      .join('course_subscriptions', 'courses.id', 'course_subscriptions.course_id')
      .where('course_subscriptions.user_id', userId)
      .select('courses.*');
  }

  async getInstructorCourses(userId) {
    return this.db('courses')
      .join('course_instructors', 'courses.id', 'course_instructors.course_id')
      .where('course_instructors.user_id', userId)
      .select('courses.*');
  }

  async _requireInstructor(courseId, userId) {
    const membership = await this.db('course_instructors')
      .where({ user_id: userId, course_id: courseId }).first();
    if (!membership) {
      throw new ForbiddenError('Must be a course instructor');
    }
  }
}

module.exports = { CourseService };
