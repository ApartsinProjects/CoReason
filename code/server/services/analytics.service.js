'use strict';

const { NotFoundError } = require('../utils/errors');

class AnalyticsService {
  constructor(db, logger) {
    this.db = db;
    this.logger = logger;
  }

  async getStudentOverview(userId) {
    const runs = await this.db('challenge_runs')
      .leftJoin('challenges', 'challenge_runs.challenge_id', 'challenges.id')
      .select(
        'challenge_runs.*',
        'challenges.title as challenge_title',
        'challenges.subject'
      )
      .where('challenge_runs.user_id', userId)
      .orderBy('challenge_runs.created_at', 'desc');

    const completed = runs.filter(r => r.status === 'completed');
    const grades = [];

    for (const run of completed) {
      const phases = typeof run.phases === 'string' ? JSON.parse(run.phases) : (run.phases || {});
      if (phases.framing?.evaluation?.grade) grades.push(phases.framing.evaluation.grade);
      if (phases.cycles) {
        for (const cycle of Object.values(phases.cycles)) {
          if (cycle.judging?.evaluation?.grade) grades.push(cycle.judging.evaluation.grade);
          if (cycle.steering?.evaluation?.grade) grades.push(cycle.steering.evaluation.grade);
        }
      }
    }

    return {
      total_runs: runs.length,
      completed_runs: completed.length,
      in_progress_runs: runs.filter(r => r.status === 'in_progress').length,
      recent_runs: runs.slice(0, 10).map(r => ({
        id: r.id,
        challenge_title: r.challenge_title,
        subject: r.subject,
        status: r.status,
        created_at: r.created_at,
      })),
      grade_distribution: this._gradeDistribution(grades),
    };
  }

  async getStudentChallengeAnalytics(userId, challengeId) {
    const runs = await this.db('challenge_runs')
      .where({ user_id: userId, challenge_id: challengeId })
      .orderBy('created_at', 'desc');

    const challenge = await this.db('challenges').where({ id: challengeId }).first();
    if (!challenge) throw new NotFoundError('Challenge', challengeId);

    return {
      challenge: { id: challenge.id, title: challenge.title, subject: challenge.subject },
      runs: runs.map(r => ({
        id: r.id,
        status: r.status,
        current_phase: r.current_phase,
        created_at: r.created_at,
        phases: typeof r.phases === 'string' ? JSON.parse(r.phases) : r.phases,
      })),
    };
  }

  async getInstructorAnalytics(courseId) {
    const course = await this.db('courses').where({ id: courseId }).first();
    if (!course) throw new NotFoundError('Course', courseId);

    const challenges = await this.db('challenges').where({ course_id: courseId });
    const challengeIds = challenges.map(c => c.id);

    let runs = [];
    if (challengeIds.length > 0) {
      runs = await this.db('challenge_runs')
        .whereIn('challenge_id', challengeIds)
        .leftJoin('users', 'challenge_runs.user_id', 'users.id')
        .select('challenge_runs.*', 'users.name as student_name', 'users.email as student_email');
    }

    const completedRuns = runs.filter(r => r.status === 'completed');

    return {
      course: { id: course.id, name: course.name },
      total_challenges: challenges.length,
      total_runs: runs.length,
      completed_runs: completedRuns.length,
      active_students: [...new Set(runs.map(r => r.user_id))].length,
      challenges: challenges.map(c => ({
        id: c.id,
        title: c.title,
        subject: c.subject,
        runs_count: runs.filter(r => r.challenge_id === c.id).length,
      })),
    };
  }

  async exportInstructorData(courseId) {
    const analytics = await this.getInstructorAnalytics(courseId);

    const challengeIds = analytics.challenges.map(c => c.id);
    let runs = [];
    if (challengeIds.length > 0) {
      runs = await this.db('challenge_runs')
        .whereIn('challenge_id', challengeIds)
        .leftJoin('users', 'challenge_runs.user_id', 'users.id')
        .leftJoin('challenges', 'challenge_runs.challenge_id', 'challenges.id')
        .select(
          'challenge_runs.*',
          'users.name as student_name',
          'users.email as student_email',
          'challenges.title as challenge_title'
        );
    }

    return {
      course: analytics.course,
      exported_at: new Date().toISOString(),
      runs: runs.map(r => ({
        run_id: r.id,
        student_name: r.student_name,
        student_email: r.student_email,
        challenge_title: r.challenge_title,
        status: r.status,
        created_at: r.created_at,
        phases: typeof r.phases === 'string' ? JSON.parse(r.phases) : r.phases,
      })),
    };
  }

  _gradeDistribution(grades) {
    const dist = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    for (const g of grades) {
      const letter = String(g).charAt(0).toUpperCase();
      if (dist[letter] !== undefined) dist[letter]++;
    }
    return dist;
  }
}

module.exports = { AnalyticsService };
