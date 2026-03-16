'use strict';

const { v4: uuidv4 } = require('uuid');
const { NotFoundError, ForbiddenError, ValidationError } = require('../utils/errors');

class ChallengeService {
  constructor(db, logger) {
    this.db = db;
    this.logger = logger;
  }

  async list(filters = {}, userId = null) {
    let query = this.db('challenges')
      .leftJoin('courses', 'challenges.course_id', 'courses.id')
      .leftJoin('users as creator', 'challenges.creator_id', 'creator.id')
      .select(
        'challenges.*',
        'courses.name as course_name',
        'creator.name as creator_name'
      )
      .whereNot('challenges.status', 'archived');

    // Visibility: public + own private
    if (userId) {
      query = query.where(function () {
        this.where('challenges.visibility', 'public')
          .orWhere('challenges.creator_id', userId);
      });
    } else {
      query = query.where('challenges.visibility', 'public');
    }

    if (filters.courseId) query = query.where('challenges.course_id', filters.courseId);
    if (filters.type) query = query.where('challenges.challenge_type', filters.type);
    if (filters.visibility) query = query.where('challenges.visibility', filters.visibility);
    if (filters.status) query = query.where('challenges.status', filters.status);
    if (filters.search) query = query.where('challenges.title', 'like', `%${filters.search}%`);

    return query.orderBy('challenges.created_at', 'desc');
  }

  async getById(id) {
    const challenge = await this.db('challenges')
      .leftJoin('courses', 'challenges.course_id', 'courses.id')
      .leftJoin('users as creator', 'challenges.creator_id', 'creator.id')
      .select('challenges.*', 'courses.name as course_name', 'creator.name as creator_name')
      .where('challenges.id', id)
      .first();
    if (!challenge) throw new NotFoundError('Challenge', id);
    return challenge;
  }

  async create(data, userId, userRole) {
    // Students can only create private challenges
    if (userRole === 'student' && data.visibility === 'public') {
      throw new ForbiddenError('Students can only create private challenges');
    }

    const challenge = {
      id: uuidv4(),
      title: data.title,
      creator_id: userId,
      course_id: data.courseId || null,
      subject_path: JSON.stringify(data.subjectPath || []),
      challenge_type: data.challengeType || 'practice',
      visibility: data.visibility || 'private',
      response_config: JSON.stringify({
        phase1: data.phase1ResponseType || 'mc',
        phase2: data.phase2ResponseType || 'mc',
      }),
      max_cycles: data.maxCycles || 5,
      model_override: data.modelOverride || null,
      instructions: JSON.stringify(data.instructions || {}),
      rubrics: data.rubrics ? JSON.stringify(data.rubrics) : null,
      generated_content: data.generatedContent ? JSON.stringify(data.generatedContent) : null,
      status: 'draft',
    };

    await this.db('challenges').insert(challenge);
    this.logger.info('Challenge created', { challengeId: challenge.id, title: challenge.title, userId });
    return this.getById(challenge.id);
  }

  async update(id, data, userId) {
    const challenge = await this.getById(id);
    if (challenge.creator_id !== userId) {
      throw new ForbiddenError('Only the creator can edit this challenge');
    }

    const allowed = ['title', 'course_id', 'subject_path', 'challenge_type', 'visibility',
      'response_config', 'max_cycles', 'model_override', 'instructions', 'rubrics', 'generated_content'];
    const filtered = {};
    for (const key of allowed) {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      if (data[camelKey] !== undefined) {
        filtered[key] = typeof data[camelKey] === 'object' ? JSON.stringify(data[camelKey]) : data[camelKey];
      }
    }
    filtered.updated_at = new Date().toISOString();

    await this.db('challenges').where({ id }).update(filtered);
    return this.getById(id);
  }

  async rename(id, title, userId) {
    const challenge = await this.getById(id);
    if (challenge.creator_id !== userId) throw new ForbiddenError('Only the creator can rename');
    await this.db('challenges').where({ id }).update({ title, updated_at: new Date().toISOString() });
    return this.getById(id);
  }

  async archive(id, userId) {
    const challenge = await this.getById(id);
    if (challenge.creator_id !== userId) throw new ForbiddenError('Only the creator can archive');
    await this.db('challenges').where({ id }).update({ status: 'archived', updated_at: new Date().toISOString() });
    this.logger.info('Challenge archived', { challengeId: id, userId });
  }

  async delete(id, userId) {
    const challenge = await this.getById(id);
    if (challenge.creator_id !== userId) throw new ForbiddenError('Only the creator can delete');

    const [{ count }] = await this.db('challenge_runs').where({ challenge_id: id }).count('id as count');
    if (count > 0) {
      await this.archive(id, userId);
      return { archived: true, message: 'Challenge has run history — archived instead of deleted' };
    }

    await this.db('challenges').where({ id }).del();
    this.logger.info('Challenge deleted', { challengeId: id, userId });
    return { deleted: true };
  }

  async publish(id, userId) {
    const challenge = await this.getById(id);
    if (challenge.creator_id !== userId) throw new ForbiddenError('Only the creator can publish');
    if (!challenge.course_id) throw new ValidationError('Challenge must be assigned to a course before publishing');

    await this.db('challenges').where({ id }).update({
      status: 'published',
      visibility: 'public',
      updated_at: new Date().toISOString(),
    });
    this.logger.info('Challenge published', { challengeId: id, userId });
    return this.getById(id);
  }
}

module.exports = { ChallengeService };
