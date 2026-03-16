'use strict';

const { NotFoundError, ValidationError } = require('../utils/errors');

class UserService {
  constructor(db, logger) {
    this.db = db;
    this.logger = logger;
  }

  async getProfile(userId) {
    const user = await this.db('users')
      .leftJoin('institutions', 'users.institution_id', 'institutions.id')
      .select(
        'users.id', 'users.email', 'users.name', 'users.role',
        'users.profile_image', 'users.preferred_language',
        'users.tour_completed', 'users.created_at',
        'institutions.name as institution_name',
        'institutions.id as institution_id'
      )
      .where('users.id', userId)
      .first();

    if (!user) throw new NotFoundError('User', userId);
    return user;
  }

  async updateProfile(userId, updates) {
    const allowed = ['name', 'profile_image', 'preferred_language', 'tour_completed', 'role', 'institution_id'];
    const filtered = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) filtered[key] = updates[key];
    }

    if (Object.keys(filtered).length === 0) {
      throw new ValidationError('No valid fields to update');
    }

    filtered.updated_at = new Date().toISOString();
    await this.db('users').where({ id: userId }).update(filtered);
    this.logger.info('Profile updated', { userId, fields: Object.keys(filtered) });
    return this.getProfile(userId);
  }

  async getStats(userId) {
    const [challengesCreated] = await this.db('challenges').where({ creator_id: userId }).count('id as count');
    const [runsCompleted] = await this.db('challenge_runs').where({ user_id: userId, status: 'completed' }).count('id as count');
    const [runsInProgress] = await this.db('challenge_runs').where({ user_id: userId, status: 'in_progress' }).count('id as count');
    const [coursesSubscribed] = await this.db('course_subscriptions').where({ user_id: userId }).count('id as count');

    return {
      challenges_created: challengesCreated.count,
      runs_completed: runsCompleted.count,
      runs_in_progress: runsInProgress.count,
      courses_subscribed: coursesSubscribed.count,
    };
  }
}

module.exports = { UserService };
