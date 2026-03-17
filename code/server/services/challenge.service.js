'use strict';

const { v4: uuidv4 } = require('uuid');
const { NotFoundError, ForbiddenError, ValidationError } = require('../utils/errors');
const {
  CHALLENGE_STATUS, CHALLENGE_TYPE, VISIBILITY, RESPONSE_TYPE, DEFAULTS, ROLES, RUN_STATUS,
} = require('../utils/constants');

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
      .whereNot('challenges.status', CHALLENGE_STATUS.ARCHIVED);

    // Visibility: public + own private
    if (userId) {
      query = query.where(function () {
        this.where('challenges.visibility', VISIBILITY.PUBLIC)
          .orWhere('challenges.creator_id', userId);
      });
    } else {
      query = query.where('challenges.visibility', VISIBILITY.PUBLIC);
    }

    if (filters.creatorId) query = query.where('challenges.creator_id', filters.creatorId);
    if (filters.courseId) query = query.where('challenges.course_id', filters.courseId);
    if (filters.type) query = query.where('challenges.challenge_type', filters.type);
    if (filters.visibility) query = query.where('challenges.visibility', filters.visibility);
    if (filters.status) query = query.where('challenges.status', filters.status);
    if (filters.search) query = query.where('challenges.title', 'like', `%${filters.search}%`);

    const challenges = await query.orderBy('challenges.created_at', 'desc');

    // Enrich with per-user run status if userId provided
    if (userId && challenges.length > 0) {
      const challengeIds = challenges.map(c => c.id);
      const runs = await this.db('challenge_runs')
        .whereIn('challenge_id', challengeIds)
        .andWhere('user_id', userId)
        .select('id', 'challenge_id', 'status', 'created_at')
        .orderBy('created_at', 'desc');

      // Group by challenge — pick the most recent run per challenge
      const runByChallenge = {};
      for (const r of runs) {
        if (!runByChallenge[r.challenge_id]) {
          runByChallenge[r.challenge_id] = r;
        }
      }

      for (const ch of challenges) {
        const userRun = runByChallenge[ch.id];
        if (userRun) {
          ch.run_id = userRun.id;
          ch.run_status = userRun.status;
          ch.last_attempt_at = userRun.created_at;
        }
      }
    }

    return challenges;
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
    if (userRole === ROLES.STUDENT && data.visibility === VISIBILITY.PUBLIC) {
      throw new ForbiddenError('Students can only create private challenges');
    }

    const challenge = {
      id: uuidv4(),
      title: data.title,
      creator_id: userId,
      course_id: data.courseId || null,
      subject_path: JSON.stringify(data.subjectPath || []),
      challenge_type: data.challengeType || CHALLENGE_TYPE.PRACTICE,
      visibility: data.visibility || VISIBILITY.PRIVATE,
      response_config: JSON.stringify(this._buildResponseConfig(data)),
      max_cycles: data.maxCycles || DEFAULTS.MAX_CYCLES,
      model_override: data.modelOverride || null,
      instructions: JSON.stringify(data.instructions || {}),
      rubrics: data.rubrics ? JSON.stringify(data.rubrics) : null,
      generated_content: data.generatedContent ? JSON.stringify(data.generatedContent) : null,
      status: CHALLENGE_STATUS.DRAFT,
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
    await this.db('challenges').where({ id }).update({ status: CHALLENGE_STATUS.ARCHIVED, updated_at: new Date().toISOString() });
    this.logger.info('Challenge archived', { challengeId: id, userId });
    return { archived: true, id };
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
      status: CHALLENGE_STATUS.PUBLISHED,
      visibility: VISIBILITY.PUBLIC,
      updated_at: new Date().toISOString(),
    });
    this.logger.info('Challenge published', { challengeId: id, userId });
    return this.getById(id);
  }

  /**
   * Build normalized response_config from request data.
   * Supports both explicit phase1/phase2 fields and nested responseConfig object
   * with either { phase1, phase2 } or { framing, judging, steering } keys.
   */
  _buildResponseConfig(data) {
    // Explicit top-level fields take priority
    if (data.phase1ResponseType || data.phase2ResponseType) {
      return {
        phase1: data.phase1ResponseType || DEFAULTS.RESPONSE_TYPE_PHASE1,
        phase2: data.phase2ResponseType || DEFAULTS.RESPONSE_TYPE_PHASE2,
      };
    }
    // Nested responseConfig object (from UI or API)
    const rc = data.responseConfig || {};
    return {
      phase1: rc.phase1 || rc.framing || DEFAULTS.RESPONSE_TYPE_PHASE1,
      phase2: rc.phase2 || rc.judging || rc.steering || DEFAULTS.RESPONSE_TYPE_PHASE2,
    };
  }
}

module.exports = { ChallengeService };
