'use strict';

const { NotFoundError } = require('../utils/errors');
const { RUN_STATUS, GRADE_LETTERS } = require('../utils/constants');

class AnalyticsService {
  constructor(db, logger) {
    this.db = db;
    this.logger = logger;
  }

  async getStudentOverview(userId) {
    const runs = await this.db('challenge_runs')
      .leftJoin('challenges', 'challenge_runs.challenge_id', 'challenges.id')
      .leftJoin('courses', 'challenges.course_id', 'courses.id')
      .select(
        'challenge_runs.*',
        'challenges.title as challenge_title',
        'challenges.subject_path',
        'challenges.challenge_type',
        'challenges.course_id',
        'courses.name as course_name'
      )
      .where('challenge_runs.user_id', userId)
      .orderBy('challenge_runs.created_at', 'desc');

    // Fetch all cycles for the user's runs to get judging/steering grades
    const runIds = runs.map(r => r.id);
    let allCycles = [];
    if (runIds.length > 0) {
      allCycles = await this.db('challenge_run_cycles')
        .whereIn('run_id', runIds)
        .orderBy('cycle_num');
    }
    const cyclesByRun = {};
    for (const c of allCycles) {
      if (!cyclesByRun[c.run_id]) cyclesByRun[c.run_id] = [];
      cyclesByRun[c.run_id].push(c);
    }

    const completed = runs.filter(r => r.status === RUN_STATUS.COMPLETED);
    const framingGrades = [];
    const judgingGrades = [];
    const steeringGrades = [];

    for (const run of completed) {
      // Framing grade is stored directly on the run
      if (run.framing_grade) framingGrades.push(run.framing_grade);

      // Judging/steering grades come from challenge_run_cycles
      const runCycles = cyclesByRun[run.id] || [];
      for (const cycle of runCycles) {
        if (cycle.judging_grade) judgingGrades.push(cycle.judging_grade);
        if (cycle.steering_grade) steeringGrades.push(cycle.steering_grade);
      }
    }

    return {
      total_runs: runs.length,
      completed_runs: completed.length,
      in_progress_runs: runs.filter(r => r.status === RUN_STATUS.IN_PROGRESS).length,
      runs: runs.map(r => {
        const runCycles = cyclesByRun[r.id] || [];
        // Aggregate judging/steering grades from cycles
        const jGrades = runCycles.map(c => c.judging_grade).filter(Boolean);
        const sGrades = runCycles.map(c => c.steering_grade).filter(Boolean);
        return {
          id: r.id,
          challenge_id: r.challenge_id,
          challenge_title: r.challenge_title,
          course_name: r.course_name,
          challenge_type: r.challenge_type,
          status: r.status,
          started_at: r.started_at || r.created_at,
          completed_at: r.completed_at,
          grades: {
            framing: r.framing_grade || null,
            judging: jGrades.length > 0 ? jGrades[jGrades.length - 1] : null,
            steering: sGrades.length > 0 ? sGrades[sGrades.length - 1] : null,
          },
        };
      }),
      distributions: {
        framing: this._gradeDistribution(framingGrades),
        judging: this._gradeDistribution(judgingGrades),
        steering: this._gradeDistribution(steeringGrades),
      },
    };
  }

  async getStudentChallengeAnalytics(userId, challengeId) {
    const runs = await this.db('challenge_runs')
      .where({ user_id: userId, challenge_id: challengeId })
      .orderBy('created_at', 'desc');

    const challenge = await this.db('challenges').where({ id: challengeId }).first();
    if (!challenge) throw new NotFoundError('Challenge', challengeId);

    // Fetch cycles for all runs to get judging/steering grades
    const runIds = runs.map(r => r.id);
    let cycles = [];
    if (runIds.length > 0) {
      cycles = await this.db('challenge_run_cycles')
        .whereIn('run_id', runIds)
        .orderBy('cycle_num');
    }
    const cyclesByRun = {};
    for (const c of cycles) {
      if (!cyclesByRun[c.run_id]) cyclesByRun[c.run_id] = [];
      cyclesByRun[c.run_id].push(c);
    }

    return {
      challenge: { id: challenge.id, title: challenge.title, subject_path: challenge.subject_path },
      runs: runs.map(r => {
        const runCycles = cyclesByRun[r.id] || [];
        return {
          id: r.id,
          status: r.status,
          created_at: r.created_at,
          framing_grade: r.framing_grade || null,
          cycles: runCycles.map(c => ({
            cycle_num: c.cycle_num,
            judging_grade: c.judging_grade || null,
            steering_grade: c.steering_grade || null,
          })),
        };
      }),
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

    const completedRuns = runs.filter(r => r.status === RUN_STATUS.COMPLETED);

    return {
      course: { id: course.id, name: course.name },
      total_challenges: challenges.length,
      total_runs: runs.length,
      completed_runs: completedRuns.length,
      active_students: [...new Set(runs.map(r => r.user_id))].length,
      challenges: challenges.map(c => ({
        id: c.id,
        title: c.title,
        subject_path: c.subject_path,
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

    // Fetch all cycles for these runs to get judging/steering grades
    const runIds = runs.map(r => r.id);
    let allCycles = [];
    if (runIds.length > 0) {
      allCycles = await this.db('challenge_run_cycles')
        .whereIn('run_id', runIds)
        .orderBy('cycle_num');
    }
    const cyclesByRun = {};
    for (const c of allCycles) {
      if (!cyclesByRun[c.run_id]) cyclesByRun[c.run_id] = [];
      cyclesByRun[c.run_id].push(c);
    }

    return {
      course: analytics.course,
      exported_at: new Date().toISOString(),
      runs: runs.map(r => {
        const runCycles = cyclesByRun[r.id] || [];
        return {
          run_id: r.id,
          student_name: r.student_name,
          student_email: r.student_email,
          challenge_title: r.challenge_title,
          status: r.status,
          created_at: r.created_at,
          framing_grade: r.framing_grade || null,
          cycles: runCycles.map(c => ({
            cycle_num: c.cycle_num,
            judging_grade: c.judging_grade || null,
            steering_grade: c.steering_grade || null,
          })),
        };
      }),
    };
  }

  _gradeDistribution(grades) {
    const dist = {};
    for (const letter of GRADE_LETTERS) { dist[letter] = 0; }
    for (const g of grades) {
      const letter = String(g).charAt(0).toUpperCase();
      if (dist[letter] !== undefined) dist[letter]++;
    }
    return dist;
  }
}

module.exports = { AnalyticsService };
