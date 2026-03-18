'use strict';

/**
 * Comprehensive integration tests for CoReason.
 * Tests all content flows: institutions, courses, challenges, runs, analytics.
 * Uses supertest with session cookies to test authenticated flows end-to-end.
 */
const request = require('supertest');
const { startServer } = require('../../server/index');
const { v4: uuidv4 } = require('uuid');

let app, server, db;
let instructorCookie, studentCookie;
let instructorUser, studentUser;
let testInstitution, testCourse, testChallenge;

// Real LLM calls require more time
jest.setTimeout(120_000);

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'silent';
  process.env.PORT = '0';
  // API keys are loaded from .env.all inside startServer — real LLM calls are made
  const result = await startServer();
  app = result.app;
  server = result.server;
  db = result.db;

  // Run migrations
  await db.migrate.latest();

  // Seed an institution
  testInstitution = {
    id: uuidv4(),
    name: 'Test University',
    country: 'Testland',
    departments: JSON.stringify(['Computer Science', 'Mathematics', 'Physics']),
  };
  await db('institutions').insert(testInstitution);
});

afterAll(async () => {
  server.close();
  await db.destroy();
});

// =============================================
// Helper: extract cookie from response
// =============================================
function extractCookie(res) {
  const raw = res.headers['set-cookie'];
  if (!raw) return '';
  return raw.map(c => c.split(';')[0]).join('; ');
}

// =============================================
// 1. AUTH: Register, Login, Me, Logout
// =============================================
describe('Auth Flows', () => {
  it('registers an instructor', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'prof@test-uni.edu',
        password: 'SecurePass123',
        name: 'Prof. Tester',
        role: 'instructor',
        institutionId: testInstitution.id,
      });
    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('prof@test-uni.edu');
    expect(res.body.user.role).toBe('instructor');
    instructorUser = res.body.user;
    instructorCookie = extractCookie(res);
    expect(instructorCookie).toBeTruthy();
  });

  it('registers a student', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'student@test-uni.edu',
        password: 'SecurePass123',
        name: 'Student Tester',
        role: 'student',
        institutionId: testInstitution.id,
      });
    expect(res.status).toBe(201);
    studentUser = res.body.user;
    studentCookie = extractCookie(res);
  });

  it('GET /auth/me returns authenticated user', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', instructorCookie);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('prof@test-uni.edu');
  });

  it('GET /auth/me returns 401 without cookie', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });

  it('POST /auth/login works with correct credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'student@test-uni.edu', password: 'SecurePass123' });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('student@test-uni.edu');
    // Update student cookie
    studentCookie = extractCookie(res);
  });

  it('POST /auth/login rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'student@test-uni.edu', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('rejects registration with missing fields', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'incomplete@test.com' });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('GET /auth/test-users returns demo users', async () => {
    const res = await request(app).get('/api/v1/auth/test-users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// =============================================
// 2. INSTITUTIONS
// =============================================
describe('Institutions', () => {
  it('GET /institutions returns list with parsed departments', async () => {
    const res = await request(app).get('/api/v1/institutions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const inst = res.body.find(i => i.name === 'Test University');
    expect(inst).toBeDefined();
    // departments should be a parsed array, not a JSON string
    expect(Array.isArray(inst.departments)).toBe(true);
    expect(inst.departments).toContain('Computer Science');
  });

  it('GET /institutions/:id returns single institution', async () => {
    const res = await request(app).get('/api/v1/institutions/' + testInstitution.id);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Test University');
    expect(Array.isArray(res.body.departments)).toBe(true);
  });

  it('GET /institutions/:id returns 404 for unknown', async () => {
    const res = await request(app).get('/api/v1/institutions/' + uuidv4());
    expect(res.status).toBe(404);
  });
});

// =============================================
// 3. USER PROFILE
// =============================================
describe('User Profile', () => {
  it('GET /users/me returns profile with institution', async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Cookie', instructorCookie);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Prof. Tester');
    expect(res.body.institution_id).toBe(testInstitution.id);
    expect(res.body.institution_name).toBe('Test University');
  });

  it('PUT /users/me updates name', async () => {
    const res = await request(app)
      .put('/api/v1/users/me')
      .set('Cookie', instructorCookie)
      .send({ name: 'Prof. Updated Tester' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Prof. Updated Tester');
  });

  it('GET /users/me/stats returns counts', async () => {
    const res = await request(app)
      .get('/api/v1/users/me/stats')
      .set('Cookie', studentCookie);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('challenges_created');
    expect(res.body).toHaveProperty('runs_completed');
  });

  it('GET /users/me requires auth', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toBe(401);
  });
});

// =============================================
// 4. COURSES: Create, List, Get, Subscribe, Subjects
// =============================================
describe('Course Flows', () => {
  it('instructor creates a course with subject tree', async () => {
    const res = await request(app)
      .post('/api/v1/courses')
      .set('Cookie', instructorCookie)
      .send({
        name: 'Intro to Algorithms',
        description: 'A test course on algorithms',
        institutionId: testInstitution.id,
        subjectTree: [
          { name: 'Sorting', children: [{ name: 'QuickSort' }, { name: 'MergeSort' }] },
          { name: 'Graph Theory', children: [{ name: 'BFS' }, { name: 'DFS' }] },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Intro to Algorithms');
    testCourse = res.body;
  });

  it('student cannot create a course', async () => {
    const res = await request(app)
      .post('/api/v1/courses')
      .set('Cookie', studentCookie)
      .send({ name: 'Student Course', institutionId: testInstitution.id });
    expect(res.status).toBe(403);
  });

  it('GET /courses lists courses', async () => {
    const res = await request(app).get('/api/v1/courses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(c => c.name === 'Intro to Algorithms')).toBe(true);
  });

  it('GET /courses/:id returns course details', async () => {
    const res = await request(app).get('/api/v1/courses/' + testCourse.id);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Intro to Algorithms');
  });

  it('GET /courses/:id/subjects returns subject tree', async () => {
    const res = await request(app).get('/api/v1/courses/' + testCourse.id + '/subjects');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0].name).toBe('Sorting');
    expect(res.body[0].children).toHaveLength(2);
  });

  it('student subscribes to course', async () => {
    const res = await request(app)
      .post('/api/v1/courses/' + testCourse.id + '/subscribe')
      .set('Cookie', studentCookie);
    expect(res.status).toBe(200);
  });

  it('student cannot subscribe twice', async () => {
    const res = await request(app)
      .post('/api/v1/courses/' + testCourse.id + '/subscribe')
      .set('Cookie', studentCookie);
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('instructor updates subject tree', async () => {
    const newTree = [
      { name: 'Sorting', children: [{ name: 'QuickSort' }, { name: 'MergeSort' }, { name: 'HeapSort' }] },
      { name: 'Graph Theory', children: [{ name: 'BFS' }, { name: 'DFS' }, { name: 'Dijkstra' }] },
      { name: 'Dynamic Programming' },
    ];
    const res = await request(app)
      .put('/api/v1/courses/' + testCourse.id + '/subjects')
      .set('Cookie', instructorCookie)
      .send({ tree: newTree });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  it('POST /courses/generate-subject-tree generates tree via LLM', async () => {
    const res = await request(app)
      .post('/api/v1/courses/generate-subject-tree')
      .set('Cookie', instructorCookie)
      .send({ courseName: 'Machine Learning', courseDescription: 'ML fundamentals' });
    expect(res.status).toBe(200);
    expect(res.body.tree).toBeDefined();
    expect(Array.isArray(res.body.tree)).toBe(true);
    expect(res.body.generated).toBe(true);
  });

  it('student cannot generate subject tree', async () => {
    const res = await request(app)
      .post('/api/v1/courses/generate-subject-tree')
      .set('Cookie', studentCookie)
      .send({ courseName: 'Test' });
    expect(res.status).toBe(403);
  });

  it('student unsubscribes from course', async () => {
    const res = await request(app)
      .delete('/api/v1/courses/' + testCourse.id + '/subscribe')
      .set('Cookie', studentCookie);
    expect(res.status).toBe(200);
  });

  it('student re-subscribes for later tests', async () => {
    const res = await request(app)
      .post('/api/v1/courses/' + testCourse.id + '/subscribe')
      .set('Cookie', studentCookie);
    expect(res.status).toBe(200);
  });
});

// =============================================
// 5. CHALLENGES: Create, List, Get, Edit, Publish, Archive, Delete
// =============================================
describe('Challenge Flows', () => {
  it('instructor creates a challenge (UI-style responseConfig)', async () => {
    const res = await request(app)
      .post('/api/v1/challenges')
      .set('Cookie', instructorCookie)
      .send({
        title: 'Sorting Pipeline',
        courseId: testCourse.id,
        subjectPath: ['Sorting', 'QuickSort'],
        challengeType: 'practice',
        visibility: 'public',
        maxCycles: 3,
        responseConfig: { framing: 'mc', judging: 'mc', steering: 'mc' },
        instructions: {
          framing: 'Frame the sorting problem',
          judging: 'Judge the AI output',
          steering: 'Steer the AI',
        },
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Sorting Pipeline');
    testChallenge = res.body;
  });

  it('student cannot create a public challenge', async () => {
    const res = await request(app)
      .post('/api/v1/challenges')
      .set('Cookie', studentCookie)
      .send({
        title: 'Student Public',
        courseId: testCourse.id,
        subjectPath: ['Sorting'],
        visibility: 'public',
      });
    expect(res.status).toBeGreaterThanOrEqual(403);
  });

  it('student can create a private challenge', async () => {
    const res = await request(app)
      .post('/api/v1/challenges')
      .set('Cookie', studentCookie)
      .send({
        title: 'Student Private Practice',
        courseId: testCourse.id,
        subjectPath: ['Sorting'],
        visibility: 'private',
      });
    expect(res.status).toBe(201);
    expect(res.body.visibility).toBe('private');
  });

  it('GET /challenges lists challenges', async () => {
    const res = await request(app).get('/api/v1/challenges');
    expect(res.status).toBe(200);
    expect(res.body.challenges).toBeDefined();
    expect(Array.isArray(res.body.challenges)).toBe(true);
  });

  it('GET /challenges/:id returns challenge details', async () => {
    const res = await request(app).get('/api/v1/challenges/' + testChallenge.id);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Sorting Pipeline');
    // Verify response_config is stored correctly
    const respCfg = typeof res.body.response_config === 'string'
      ? JSON.parse(res.body.response_config) : res.body.response_config;
    expect(respCfg).toBeDefined();
  });

  it('instructor renames challenge', async () => {
    const res = await request(app)
      .put('/api/v1/challenges/' + testChallenge.id + '/rename')
      .set('Cookie', instructorCookie)
      .send({ title: 'Sorting Pipeline v2' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Sorting Pipeline v2');
  });

  it('instructor publishes challenge', async () => {
    const res = await request(app)
      .post('/api/v1/challenges/' + testChallenge.id + '/publish')
      .set('Cookie', instructorCookie);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('published');
  });

  it('instructor updates challenge settings', async () => {
    const res = await request(app)
      .put('/api/v1/challenges/' + testChallenge.id)
      .set('Cookie', instructorCookie)
      .send({ maxCycles: 5 });
    expect(res.status).toBe(200);
  });
});

// =============================================
// 6. CHALLENGE RUNS: Full lifecycle
// =============================================
describe('Challenge Run — Full Lifecycle', () => {
  let runId, maxCycles;

  it('student starts a run', async () => {
    const res = await request(app)
      .post('/api/v1/challenges/' + testChallenge.id + '/runs')
      .set('Cookie', studentCookie);
    expect(res.status).toBe(201);
    expect(res.body.runId).toBeDefined();
    expect(res.body.rawProblem).toBeDefined();
    expect(res.body.rawProblem.length).toBeGreaterThan(0);
    // Verify real LLM content — must NOT be fallback placeholder
    expect(res.body.rawProblem).not.toMatch(/LLM not configured/i);
    expect(res.body.rawProblem).not.toMatch(/placeholder/i);
    // Because responseConfig has framing: 'mc', framingOptions MUST be present
    expect(res.body.framingOptions).toBeDefined();
    expect(Array.isArray(res.body.framingOptions)).toBe(true);
    expect(res.body.framingOptions.length).toBeGreaterThan(0);
    // Each option should have letter + text
    expect(res.body.framingOptions[0]).toHaveProperty('letter');
    expect(res.body.framingOptions[0]).toHaveProperty('text');
    // Verify framing options are real LLM content (not fallback stubs)
    expect(res.body.framingOptions[0].text).not.toMatch(/Fallback|placeholder/i);
    runId = res.body.runId;
    maxCycles = res.body.maxCycles;
  });

  it('GET /runs/:id returns run state', async () => {
    const res = await request(app)
      .get('/api/v1/runs/' + runId)
      .set('Cookie', studentCookie);
    expect(res.status).toBe(200);
    expect(res.body.run).toBeDefined();
    expect(res.body.run.status).toBe('in_progress');
    expect(res.body.challenge).toBeDefined();
    expect(res.body.rawProblem).toBeDefined();
    expect(res.body.framingOptions).toBeDefined();
  });

  it('student submits framing response', async () => {
    const res = await request(app)
      .put('/api/v1/runs/' + runId + '/framing')
      .set('Cookie', studentCookie)
      .send({ selectedOption: 'A', explanation: 'I chose A because...' });
    expect(res.status).toBe(200);
    expect(res.body.aiSolution).toBeDefined();
    expect(res.body.aiSolution.length).toBeGreaterThan(0);
    // Verify real LLM content — must NOT be fallback
    expect(res.body.aiSolution).not.toMatch(/LLM not configured/i);
    expect(res.body.aiSolution).not.toMatch(/placeholder/i);
    // Practice mode should include feedback
    expect(res.body.framingGrade).toBeDefined();
    expect(['A', 'B', 'C']).toContain(res.body.framingGrade);
    // Should provide judging options since phase2 is MC
    expect(res.body.judgingOptions).toBeDefined();
    expect(Array.isArray(res.body.judgingOptions)).toBe(true);
    // Verify judging options are real LLM content
    expect(res.body.judgingOptions[0]?.text).not.toMatch(/Fallback|placeholder/i);
    expect(res.body.currentCycle).toBe(1);
  });

  it('cannot submit framing twice', async () => {
    const res = await request(app)
      .put('/api/v1/runs/' + runId + '/framing')
      .set('Cookie', studentCookie)
      .send({ selectedOption: 'B' });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('student submits judging for cycle 1', async () => {
    const res = await request(app)
      .put('/api/v1/runs/' + runId + '/cycles/1/judging')
      .set('Cookie', studentCookie)
      .send({ selectedOptions: ['A', 'C'], notes: 'Found issues A and C' });
    expect(res.status).toBe(200);
    // Should return steering options since phase2 is MC
    expect(res.body.steeringOptions).toBeDefined();
    expect(Array.isArray(res.body.steeringOptions)).toBe(true);
  });

  it('student submits steering for cycle 1', async () => {
    const res = await request(app)
      .put('/api/v1/runs/' + runId + '/cycles/1/steering')
      .set('Cookie', studentCookie)
      .send({ selectedOptions: ['B'], command: 'Fix the algorithm efficiency' });
    expect(res.status).toBe(200);
    expect(res.body.updatedSolution).toBeDefined();
    // Verify real LLM content — must NOT be fallback
    expect(res.body.updatedSolution).not.toMatch(/LLM not configured/i);
    // Practice mode returns grades
    expect(res.body.judgingGrade).toBeDefined();
    expect(res.body.steeringGrade).toBeDefined();
    expect(res.body.currentCycle).toBe(2);
    // Should offer next judging options if not at max cycles
    if (res.body.currentCycle <= maxCycles) {
      expect(res.body.nextJudgingOptions).toBeDefined();
    }
  });

  it('cannot submit steering before judging on cycle 2', async () => {
    const res = await request(app)
      .put('/api/v1/runs/' + runId + '/cycles/2/steering')
      .set('Cookie', studentCookie)
      .send({ selectedOptions: ['A'] });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('student completes the run', async () => {
    const res = await request(app)
      .put('/api/v1/runs/' + runId + '/complete')
      .set('Cookie', studentCookie);
    expect(res.status).toBe(200);
    expect(res.body.grades).toBeDefined();
    expect(res.body.grades.framing).toBeDefined();
    expect(res.body.grades.judging).toBeDefined();
    expect(res.body.grades.steering).toBeDefined();
  });

  it('cannot complete an already-completed run', async () => {
    const res = await request(app)
      .put('/api/v1/runs/' + runId + '/complete')
      .set('Cookie', studentCookie);
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('GET /runs/:id/report returns completed report', async () => {
    const res = await request(app)
      .get('/api/v1/runs/' + runId + '/report')
      .set('Cookie', studentCookie);
    expect(res.status).toBe(200);
    expect(res.body.run.status).toBe('completed');
    expect(res.body.run.grades).toBeDefined();
    expect(res.body.cycles).toBeDefined();
    expect(Array.isArray(res.body.cycles)).toBe(true);
  });

  it('another user cannot access the run', async () => {
    const res = await request(app)
      .get('/api/v1/runs/' + runId)
      .set('Cookie', instructorCookie);
    expect(res.status).toBe(403);
  });
});

// =============================================
// 7. CHALLENGE RUN with open-ended response config
// =============================================
describe('Challenge Run — Open-Ended Config', () => {
  let openChallengeId, openRunId;

  it('instructor creates an open-ended challenge', async () => {
    const res = await request(app)
      .post('/api/v1/challenges')
      .set('Cookie', instructorCookie)
      .send({
        title: 'Graph Theory Analysis',
        courseId: testCourse.id,
        subjectPath: ['Graph Theory', 'BFS'],
        challengeType: 'practice',
        visibility: 'public',
        maxCycles: 2,
        responseConfig: { framing: 'open-ended', judging: 'open-ended', steering: 'open-ended' },
      });
    expect(res.status).toBe(201);
    openChallengeId = res.body.id;

    // Publish it
    await request(app)
      .post('/api/v1/challenges/' + openChallengeId + '/publish')
      .set('Cookie', instructorCookie);
  });

  it('student starts an open-ended run — no MC options expected', async () => {
    const res = await request(app)
      .post('/api/v1/challenges/' + openChallengeId + '/runs')
      .set('Cookie', studentCookie);
    expect(res.status).toBe(201);
    expect(res.body.rawProblem).toBeDefined();
    // Verify real LLM content
    expect(res.body.rawProblem).not.toMatch(/LLM not configured/i);
    expect(res.body.rawProblem).not.toMatch(/placeholder/i);
    // Open-ended: no framing MC options
    expect(res.body.framingOptions).toBeNull();
    openRunId = res.body.runId;
  });

  it('student submits open-ended framing', async () => {
    const res = await request(app)
      .put('/api/v1/runs/' + openRunId + '/framing')
      .set('Cookie', studentCookie)
      .send({ text: 'I frame this problem by considering graph traversal...' });
    expect(res.status).toBe(200);
    expect(res.body.aiSolution).toBeDefined();
    // Verify real LLM content
    expect(res.body.aiSolution).not.toMatch(/LLM not configured/i);
    // Open-ended: no judging MC options
    expect(res.body.judgingOptions).toBeNull();
  });
});

// =============================================
// 8. CHALLENGE RUN with import-style config (phase1/phase2 keys)
// =============================================
describe('Challenge Run — Import-style Config (phase1/phase2)', () => {
  let importChallengeId, importRunId;

  it('directly insert a challenge with phase1/phase2 config', async () => {
    importChallengeId = uuidv4();
    await db('challenges').insert({
      id: importChallengeId,
      title: 'Import-style Challenge',
      creator_id: instructorUser.id,
      course_id: testCourse.id,
      subject_path: JSON.stringify(['Sorting', 'MergeSort']),
      challenge_type: 'practice',
      visibility: 'public',
      response_config: JSON.stringify({ phase1: 'mc', phase2: 'mc' }),
      max_cycles: 3,
      status: 'published',
    });
  });

  it('student starts a run — MC options present', async () => {
    const res = await request(app)
      .post('/api/v1/challenges/' + importChallengeId + '/runs')
      .set('Cookie', studentCookie);
    expect(res.status).toBe(201);
    expect(res.body.framingOptions).toBeDefined();
    expect(Array.isArray(res.body.framingOptions)).toBe(true);
    expect(res.body.framingOptions.length).toBeGreaterThan(0);
    importRunId = res.body.runId;
  });
});

// =============================================
// 9. CHALLENGE MANAGEMENT: Archive, Delete
// =============================================
describe('Challenge Management', () => {
  let tempChallengeId;

  it('instructor creates a temporary challenge', async () => {
    const res = await request(app)
      .post('/api/v1/challenges')
      .set('Cookie', instructorCookie)
      .send({
        title: 'Temp Challenge',
        courseId: testCourse.id,
        subjectPath: ['Sorting'],
        visibility: 'public',
      });
    expect(res.status).toBe(201);
    tempChallengeId = res.body.id;
  });

  it('instructor archives challenge', async () => {
    const res = await request(app)
      .put('/api/v1/challenges/' + tempChallengeId + '/archive')
      .set('Cookie', instructorCookie);
    expect(res.status).toBe(200);
    expect(res.body.archived).toBe(true);
  });

  it('instructor creates and deletes a challenge with no runs', async () => {
    const createRes = await request(app)
      .post('/api/v1/challenges')
      .set('Cookie', instructorCookie)
      .send({
        title: 'To Delete',
        courseId: testCourse.id,
        subjectPath: ['DFS'],
        visibility: 'public',
      });
    const delRes = await request(app)
      .delete('/api/v1/challenges/' + createRes.body.id)
      .set('Cookie', instructorCookie);
    expect(delRes.status).toBe(200);
    expect(delRes.body.deleted).toBe(true);
  });

  it('student cannot delete instructor challenge', async () => {
    const createRes = await request(app)
      .post('/api/v1/challenges')
      .set('Cookie', instructorCookie)
      .send({
        title: 'Not Yours',
        courseId: testCourse.id,
        subjectPath: ['Sorting'],
        visibility: 'public',
      });
    const delRes = await request(app)
      .delete('/api/v1/challenges/' + createRes.body.id)
      .set('Cookie', studentCookie);
    expect(delRes.status).toBe(403);
  });
});

// =============================================
// 10. ANALYTICS
// =============================================
describe('Analytics', () => {
  it('student gets their analytics', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/student')
      .set('Cookie', studentCookie);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('runs');
    expect(Array.isArray(res.body.runs)).toBe(true);
    // Should have at least 1 completed run from our lifecycle test
    expect(res.body.runs.length).toBeGreaterThan(0);
  });

  it('student analytics requires auth', async () => {
    const res = await request(app).get('/api/v1/analytics/student');
    expect(res.status).toBe(401);
  });

  it('instructor gets course analytics', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/instructor/' + testCourse.id)
      .set('Cookie', instructorCookie);
    expect(res.status).toBe(200);
  });
});

// =============================================
// 11. PROTECTED ROUTE CHECKS
// =============================================
describe('Protected Routes', () => {
  const authRequired = [
    ['POST', '/api/v1/courses'],
    ['PUT', '/api/v1/users/me'],
    ['GET', '/api/v1/users/me/stats'],
    ['GET', '/api/v1/analytics/student'],
  ];

  test.each(authRequired)('%s %s requires auth', async (method, path) => {
    const res = await request(app)[method.toLowerCase()](path).send({});
    expect(res.status).toBe(401);
  });

  it('student cannot access instructor analytics', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/instructor/' + testCourse.id)
      .set('Cookie', studentCookie);
    expect(res.status).toBe(403);
  });
});

// =============================================
// 12. EDGE CASES
// =============================================
describe('Edge Cases', () => {
  it('GET /challenges/nonexistent returns 404', async () => {
    const res = await request(app).get('/api/v1/challenges/' + uuidv4());
    expect(res.status).toBe(404);
  });

  it('cannot start a run on archived challenge', async () => {
    // Create and archive a challenge
    const ch = await request(app)
      .post('/api/v1/challenges')
      .set('Cookie', instructorCookie)
      .send({ title: 'Will Archive', courseId: testCourse.id, subjectPath: ['Sorting'], visibility: 'public' });
    await request(app)
      .put('/api/v1/challenges/' + ch.body.id + '/archive')
      .set('Cookie', instructorCookie);

    const res = await request(app)
      .post('/api/v1/challenges/' + ch.body.id + '/runs')
      .set('Cookie', studentCookie);
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('cannot publish challenge without course', async () => {
    const ch = await request(app)
      .post('/api/v1/challenges')
      .set('Cookie', instructorCookie)
      .send({ title: 'No Course', subjectPath: ['Test'], visibility: 'public' });
    const res = await request(app)
      .post('/api/v1/challenges/' + ch.body.id + '/publish')
      .set('Cookie', instructorCookie);
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('cannot start a run on draft challenge', async () => {
    // Create a draft challenge (not published)
    const ch = await request(app)
      .post('/api/v1/challenges')
      .set('Cookie', instructorCookie)
      .send({ title: 'Draft Only', courseId: testCourse.id, subjectPath: ['Test'] });
    expect(ch.status).toBe(201);
    expect(ch.body.status).toBe('draft');

    const res = await request(app)
      .post('/api/v1/runs')
      .set('Cookie', studentCookie)
      .send({ challengeId: ch.body.id });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.error.message).toMatch(/draft/i);
  });

  it('cannot submit judging twice on same cycle', async () => {
    // Create, publish, start a run, submit framing, then try double judging
    const ch = await request(app)
      .post('/api/v1/challenges')
      .set('Cookie', instructorCookie)
      .send({ title: 'Dup Judging Test', courseId: testCourse.id, subjectPath: ['Test'], visibility: 'public' });
    await request(app).post('/api/v1/challenges/' + ch.body.id + '/publish').set('Cookie', instructorCookie);

    const run = await request(app)
      .post('/api/v1/runs')
      .set('Cookie', studentCookie)
      .send({ challengeId: ch.body.id });
    expect(run.status).toBe(201);

    await request(app)
      .put('/api/v1/runs/' + run.body.runId + '/framing')
      .set('Cookie', studentCookie)
      .send({ response: 'my framing' });

    const j1 = await request(app)
      .put('/api/v1/runs/' + run.body.runId + '/cycles/1/judging')
      .set('Cookie', studentCookie)
      .send({ response: 'judging 1' });
    expect(j1.status).toBe(200);

    const j2 = await request(app)
      .put('/api/v1/runs/' + run.body.runId + '/cycles/1/judging')
      .set('Cookie', studentCookie)
      .send({ response: 'judging again' });
    expect(j2.status).toBeGreaterThanOrEqual(400);
    expect(j2.body.error.message).toMatch(/already been submitted/i);
  });

  it('cannot submit steering twice on same cycle', async () => {
    // Re-use the challenge from above
    const ch = await request(app)
      .post('/api/v1/challenges')
      .set('Cookie', instructorCookie)
      .send({ title: 'Dup Steering Test', courseId: testCourse.id, subjectPath: ['Test'], visibility: 'public' });
    await request(app).post('/api/v1/challenges/' + ch.body.id + '/publish').set('Cookie', instructorCookie);

    const run = await request(app)
      .post('/api/v1/runs')
      .set('Cookie', studentCookie)
      .send({ challengeId: ch.body.id });
    await request(app).put('/api/v1/runs/' + run.body.runId + '/framing')
      .set('Cookie', studentCookie).send({ response: 'framing' });
    await request(app).put('/api/v1/runs/' + run.body.runId + '/cycles/1/judging')
      .set('Cookie', studentCookie).send({ response: 'judging' });

    const s1 = await request(app)
      .put('/api/v1/runs/' + run.body.runId + '/cycles/1/steering')
      .set('Cookie', studentCookie)
      .send({ response: 'steering 1' });
    expect(s1.status).toBe(200);

    const s2 = await request(app)
      .put('/api/v1/runs/' + run.body.runId + '/cycles/1/steering')
      .set('Cookie', studentCookie)
      .send({ response: 'steering again' });
    expect(s2.status).toBeGreaterThanOrEqual(400);
    expect(s2.body.error.message).toMatch(/already been submitted/i);
  });

  it('validation rejects invalid challengeId on run start', async () => {
    const res = await request(app)
      .post('/api/v1/runs')
      .set('Cookie', studentCookie)
      .send({ challengeId: 'not-a-uuid' });
    expect(res.status).toBe(400);
  });

  it('validation rejects missing course name', async () => {
    const res = await request(app)
      .post('/api/v1/courses')
      .set('Cookie', instructorCookie)
      .send({ description: 'No name provided' });
    expect(res.status).toBe(400);
  });

  it('rejects invalid cycle number (NaN) on judging', async () => {
    // Start a run and submit framing first
    const run = await request(app)
      .post('/api/v1/runs')
      .set('Cookie', studentCookie)
      .send({ challengeId: testChallenge.id });
    expect(run.status).toBe(201);

    await request(app)
      .put('/api/v1/runs/' + run.body.runId + '/framing')
      .set('Cookie', studentCookie)
      .send({ response: 'test framing' });

    // Submit judging with invalid cycle number
    const res = await request(app)
      .put('/api/v1/runs/' + run.body.runId + '/cycles/abc/judging')
      .set('Cookie', studentCookie)
      .send({ response: 'test judging' });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.error.message).toMatch(/invalid cycle/i);
  });

  it('rejects zero cycle number on judging', async () => {
    const run = await request(app)
      .post('/api/v1/runs')
      .set('Cookie', studentCookie)
      .send({ challengeId: testChallenge.id });
    expect(run.status).toBe(201);

    await request(app)
      .put('/api/v1/runs/' + run.body.runId + '/framing')
      .set('Cookie', studentCookie)
      .send({ response: 'test framing' });

    const res = await request(app)
      .put('/api/v1/runs/' + run.body.runId + '/cycles/0/judging')
      .set('Cookie', studentCookie)
      .send({ response: 'test judging' });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.error.message).toMatch(/invalid cycle/i);
  });

  it('instructor cannot view analytics for course they do not own', async () => {
    // Create a second instructor
    const reg = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'other-prof@test.com', password: 'pass1234pass', name: 'Other Prof', role: 'instructor' });
    const otherCookie = extractCookie(reg);

    // Other instructor tries to access original instructor's course analytics
    const res = await request(app)
      .get('/api/v1/analytics/instructor/' + testCourse.id)
      .set('Cookie', otherCookie);
    expect(res.status).toBe(403);
  });

  it('rejects invalid institution_id on profile update', async () => {
    const res = await request(app)
      .put('/api/v1/users/me')
      .set('Cookie', studentCookie)
      .send({ institution_id: uuidv4() }); // Non-existent institution
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
