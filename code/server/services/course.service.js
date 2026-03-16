'use strict';

const { v4: uuidv4 } = require('uuid');
const { NotFoundError, ForbiddenError, ConflictError } = require('../utils/errors');

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
      .where('courses.status', 'active');

    if (filters.institutionId) {
      query = query.where('courses.institution_id', filters.institutionId);
    }
    if (filters.search) {
      query = query.where('courses.name', 'like', `%${filters.search}%`);
    }

    return query.orderBy('courses.name');
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

  async create({ name, description, institutionId, subjectTree, stewardConfig }, userId) {
    const course = {
      id: uuidv4(),
      name,
      description: description || null,
      institution_id: institutionId || null,
      subject_tree: JSON.stringify(subjectTree || []),
      steward_config: JSON.stringify(stewardConfig || {}),
      status: 'active',
    };
    await this.db('courses').insert(course);

    // Add creator as instructor
    await this.db('course_instructors').insert({
      id: uuidv4(),
      user_id: userId,
      course_id: course.id,
    });

    this.logger.info('Course created', { courseId: course.id, name, userId });
    return course;
  }

  async update(id, updates, userId) {
    // Verify instructor
    await this._requireInstructor(id, userId);

    const allowed = ['name', 'description', 'subject_tree', 'steward_config', 'status'];
    const filtered = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        filtered[key] = typeof updates[key] === 'object' ? JSON.stringify(updates[key]) : updates[key];
      }
    }
    filtered.updated_at = new Date().toISOString();

    await this.db('courses').where({ id }).update(filtered);
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
  }

  async getSubjectTree(courseId) {
    const course = await this.getById(courseId);
    const tree = typeof course.subject_tree === 'string'
      ? JSON.parse(course.subject_tree) : course.subject_tree;
    return tree || [];
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
