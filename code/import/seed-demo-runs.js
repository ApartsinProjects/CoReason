'use strict';

/**
 * Seed script: populate demo students with completed challenge runs
 * so that analytics pages show meaningful data.
 *
 * Idempotent: skips users who already have completed runs.
 *
 * Usage:  cd code && node import/seed-demo-runs.js
 */

const path = require('path');
const { v4: uuidv4 } = require('uuid');

const knexConfig = require(path.resolve(__dirname, '../server/db/knexfile'));
const knex = require('knex')(knexConfig);

// Demo student emails (non-test accounts)
const DEMO_STUDENT_EMAILS = [
  'noa.cohen@tau.ac.il',
  'ahmed.hassan@tau.ac.il',
  'maria.garcia@mit.edu',
  'li.wei@tsinghua.edu.cn',
  'sarah.miller@oxford.ac.uk',
  'noa.cohen.he@tau.ac.il',
  'yael.katz@tau.ac.il',
  'dan.mor@technion.ac.il',
];

// Grade distribution presets to get interesting analytics patterns
const GRADE_PRESETS = [
  // Strong student
  { framing: 'A', judging: 'A', steering: 'B' },
  { framing: 'A', judging: 'B', steering: 'A' },
  { framing: 'B', judging: 'A', steering: 'A' },
  // Average student
  { framing: 'B', judging: 'B', steering: 'C' },
  { framing: 'B', judging: 'C', steering: 'B' },
  { framing: 'C', judging: 'B', steering: 'B' },
  // Weaker student
  { framing: 'C', judging: 'C', steering: 'B' },
  { framing: 'C', judging: 'B', steering: 'C' },
  { framing: 'B', judging: 'C', steering: 'C' },
  // Mixed
  { framing: 'A', judging: 'C', steering: 'B' },
  { framing: 'C', judging: 'A', steering: 'B' },
  { framing: 'B', judging: 'B', steering: 'A' },
  { framing: 'A', judging: 'A', steering: 'A' },
  { framing: 'D', judging: 'C', steering: 'C' },
  { framing: 'B', judging: 'D', steering: 'B' },
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysAgo) {
  const now = Date.now();
  const start = now - daysAgo * 24 * 60 * 60 * 1000;
  return new Date(start + Math.random() * (now - start));
}

function computeOverallGrade(framing, judging, steering) {
  const scores = { A: 4, B: 3, C: 2, D: 1, F: 0 };
  const avg = (scores[framing] + scores[judging] + scores[steering]) / 3;
  if (avg >= 3.5) return 'A';
  if (avg >= 2.5) return 'B';
  if (avg >= 1.5) return 'C';
  if (avg >= 0.5) return 'D';
  return 'F';
}

async function main() {
  console.log('Seeding demo challenge runs...\n');

  // Load all demo students
  const students = await knex('users')
    .whereIn('email', DEMO_STUDENT_EMAILS)
    .andWhere('role', 'student');

  if (students.length === 0) {
    console.log('No demo students found. Run the full import first.');
    process.exit(1);
  }
  console.log(`Found ${students.length} demo students.`);

  // Load all challenges with their courses
  const challenges = await knex('challenges')
    .leftJoin('courses', 'challenges.course_id', 'courses.id')
    .select('challenges.id as id', 'challenges.title', 'challenges.course_id',
            'courses.institution_id');

  console.log(`Found ${challenges.length} challenges.\n`);

  let totalRunsInserted = 0;
  let totalCyclesInserted = 0;
  let skippedStudents = 0;

  for (const student of students) {
    // Idempotency: check if student already has completed runs
    const existingCompleted = await knex('challenge_runs')
      .where({ user_id: student.id, status: 'completed' })
      .count('* as cnt');

    if (existingCompleted[0].cnt >= 5) {
      console.log(`  SKIP ${student.name} — already has ${existingCompleted[0].cnt} completed runs`);
      skippedStudents++;
      continue;
    }

    // Find challenges from the student's institution
    let availableChallenges = challenges.filter(
      c => c.institution_id === student.institution_id
    );

    // Fallback: if student has fewer than 5 institution-matched challenges,
    // supplement with challenges from other institutions
    if (availableChallenges.length < 5) {
      const remaining = challenges.filter(
        c => c.institution_id !== student.institution_id
      );
      const shuffledRemaining = [...remaining].sort(() => Math.random() - 0.5);
      availableChallenges = [
        ...availableChallenges,
        ...shuffledRemaining.slice(0, 8 - availableChallenges.length),
      ];
    }

    // Exclude challenges the student already has runs for
    const existingRunChallenges = await knex('challenge_runs')
      .where({ user_id: student.id })
      .select('challenge_id');
    const existingChallengeIds = new Set(existingRunChallenges.map(r => r.challenge_id));
    availableChallenges = availableChallenges.filter(c => !existingChallengeIds.has(c.id));

    // Pick enough to reach 5-8 total completed runs
    const existingCount = existingCompleted[0].cnt;
    const targetTotal = randomInt(5, Math.min(8, existingCount + availableChallenges.length));
    const numRuns = targetTotal - existingCount;
    if (numRuns <= 0) {
      console.log(`  SKIP ${student.name} (${student.email}) — already has ${existingCount} completed runs`);
      skippedStudents++;
      continue;
    }
    const shuffled = [...availableChallenges].sort(() => Math.random() - 0.5);
    const selectedChallenges = shuffled.slice(0, numRuns);

    let studentRunCount = 0;

    for (const challenge of selectedChallenges) {
      const preset = pickRandom(GRADE_PRESETS);
      const overallGrade = computeOverallGrade(preset.framing, preset.judging, preset.steering);

      // Spread runs over the past 30 days
      const startedAt = randomDate(30);
      // Completed 10 min to 2 hours after starting
      const completedAt = new Date(startedAt.getTime() + randomInt(10, 120) * 60 * 1000);

      const runId = uuidv4();

      // Build framing response/feedback stubs
      const framingResponse = JSON.stringify({
        type: 'submitted',
        answer: 'Demo framing response for analytics seeding.',
      });
      const framingFeedback = JSON.stringify({
        message: 'Demo framing feedback.',
        grade: preset.framing,
      });

      // Insert the run
      await knex('challenge_runs').insert({
        id: runId,
        challenge_id: challenge.id,
        user_id: student.id,
        status: 'completed',
        framing_response: framingResponse,
        framing_feedback: framingFeedback,
        framing_grade: preset.framing,
        ai_solution: 'Demo AI solution for analytics seeding.',
        current_cycle: randomInt(1, 3),
        grades: JSON.stringify({
          framing: preset.framing,
          judging: preset.judging,
          steering: preset.steering,
          overall: overallGrade,
        }),
        started_at: startedAt.toISOString(),
        completed_at: completedAt.toISOString(),
        created_at: startedAt.toISOString(),
        updated_at: completedAt.toISOString(),
      });

      // Insert 1-3 cycles per run
      const numCycles = randomInt(1, 3);
      for (let cycleNum = 1; cycleNum <= numCycles; cycleNum++) {
        const cycleJudging = cycleNum === numCycles ? preset.judging : pickRandom(['A', 'B', 'C']);
        const cycleSteering = cycleNum === numCycles ? preset.steering : pickRandom(['A', 'B', 'C']);

        await knex('challenge_run_cycles').insert({
          id: uuidv4(),
          run_id: runId,
          cycle_num: cycleNum,
          judging_response: JSON.stringify({ type: 'submitted', answer: 'Demo judging response.' }),
          judging_feedback: JSON.stringify({ message: 'Demo judging feedback.', grade: cycleJudging }),
          judging_grade: cycleJudging,
          steering_response: JSON.stringify({ type: 'submitted', answer: 'Demo steering response.' }),
          steering_feedback: JSON.stringify({ message: 'Demo steering feedback.', grade: cycleSteering }),
          steering_grade: cycleSteering,
          ai_output: 'Demo regenerated AI output for cycle ' + cycleNum + '.',
          created_at: new Date(startedAt.getTime() + cycleNum * 5 * 60 * 1000).toISOString(),
          updated_at: new Date(startedAt.getTime() + cycleNum * 5 * 60 * 1000).toISOString(),
        });

        totalCyclesInserted++;
      }

      studentRunCount++;
      totalRunsInserted++;
    }

    console.log(`  OK ${student.name} (${student.email}) — ${studentRunCount} runs inserted`);
  }

  console.log(`\nDone! Inserted ${totalRunsInserted} runs and ${totalCyclesInserted} cycles.`);
  if (skippedStudents > 0) {
    console.log(`Skipped ${skippedStudents} student(s) who already had completed runs.`);
  }

  // Summary query
  const summary = await knex('challenge_runs')
    .join('users', 'challenge_runs.user_id', 'users.id')
    .where('challenge_runs.status', 'completed')
    .whereIn('users.email', DEMO_STUDENT_EMAILS)
    .select('users.name')
    .count('challenge_runs.id as runs')
    .groupBy('users.name');

  console.log('\nVerification — completed runs per demo student:');
  for (const row of summary) {
    console.log(`  ${row.name}: ${row.runs}`);
  }

  process.exit(0);
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
