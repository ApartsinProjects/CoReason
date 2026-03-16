'use strict';

exports.up = async function (knex) {
  // --- Institutions ---
  await knex.schema.createTable('institutions', (t) => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.string('name').notNullable().unique();
    t.string('country');
    t.json('departments');  // JSON array of department names
    t.timestamps(true, true);
  });

  // --- Users ---
  await knex.schema.createTable('users', (t) => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.string('email').notNullable().unique();
    t.string('password_hash');  // null for SSO-only users
    t.string('name').notNullable();
    t.enum('role', ['student', 'instructor']).notNullable();
    t.uuid('institution_id').references('id').inTable('institutions');
    t.string('profile_image');
    t.string('google_id').unique();
    t.string('microsoft_id').unique();
    t.string('preferred_language').defaultTo('en');
    t.boolean('tour_completed').defaultTo(false);
    t.json('settings');  // user preferences
    t.timestamps(true, true);
  });

  // --- Courses ---
  await knex.schema.createTable('courses', (t) => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.string('name').notNullable();
    t.text('description');
    t.uuid('institution_id').references('id').inTable('institutions');
    t.json('subject_tree');   // hierarchical subject tree
    t.json('steward_config'); // model overrides, settings
    t.enum('status', ['active', 'archived']).defaultTo('active');
    t.timestamps(true, true);
  });

  // --- Course Subscriptions (student) ---
  await knex.schema.createTable('course_subscriptions', (t) => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.uuid('course_id').notNullable().references('id').inTable('courses').onDelete('CASCADE');
    t.timestamp('subscribed_at').defaultTo(knex.fn.now());
    t.unique(['user_id', 'course_id']);
  });

  // --- Course Instructors ---
  await knex.schema.createTable('course_instructors', (t) => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.uuid('course_id').notNullable().references('id').inTable('courses').onDelete('CASCADE');
    t.timestamp('joined_at').defaultTo(knex.fn.now());
    t.unique(['user_id', 'course_id']);
  });

  // --- Challenges ---
  await knex.schema.createTable('challenges', (t) => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.string('title').notNullable();
    t.uuid('creator_id').notNullable().references('id').inTable('users');
    t.uuid('course_id').references('id').inTable('courses');
    t.json('subject_path');  // array of subject names in hierarchy
    t.enum('challenge_type', ['practice', 'assessment']).defaultTo('practice');
    t.enum('visibility', ['public', 'private']).defaultTo('private');
    t.json('response_config');  // { phase1: 'mc'|'open-ended', phase2: 'mc'|'open-ended' }
    t.integer('max_cycles').defaultTo(5);
    t.string('model_override');  // LLM model override
    t.json('instructions');  // { phase1: '...', phase2: '...' }
    t.json('rubrics');       // generated rubrics { framing: {...}, judging: {...}, steering: {...} }
    t.json('generated_content');  // cached LLM content (problem, MC options, AI solution)
    t.enum('status', ['draft', 'published', 'archived']).defaultTo('draft');
    t.timestamps(true, true);
  });

  // --- Challenge Runs ---
  await knex.schema.createTable('challenge_runs', (t) => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.uuid('challenge_id').notNullable().references('id').inTable('challenges');
    t.uuid('user_id').notNullable().references('id').inTable('users');
    t.enum('status', ['in_progress', 'completed', 'abandoned']).defaultTo('in_progress');
    t.json('framing_response');  // student's framing submission
    t.json('framing_feedback');  // LLM evaluation of framing
    t.string('framing_grade');   // A/B/C
    t.text('ai_solution');       // initial AI-generated solution
    t.integer('current_cycle').defaultTo(0);
    t.json('grades');           // final { framing, judging, steering }
    t.timestamp('started_at').defaultTo(knex.fn.now());
    t.timestamp('completed_at');
    t.timestamps(true, true);
  });

  // --- Challenge Run Cycles ---
  await knex.schema.createTable('challenge_run_cycles', (t) => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.uuid('run_id').notNullable().references('id').inTable('challenge_runs').onDelete('CASCADE');
    t.integer('cycle_num').notNullable();
    t.json('judging_response');   // student's judging submission
    t.json('judging_feedback');   // LLM evaluation
    t.string('judging_grade');    // A/B/C
    t.json('steering_response');  // student's steering submission
    t.json('steering_feedback');  // LLM evaluation
    t.string('steering_grade');   // A/B/C
    t.text('ai_output');          // regenerated AI output after steering
    t.json('mc_options');         // cached MC options for this cycle
    t.timestamps(true, true);
    t.unique(['run_id', 'cycle_num']);
  });

  // --- Prompt Templates ---
  await knex.schema.createTable('prompt_templates', (t) => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.string('filename').notNullable().unique();
    t.text('content').notNullable();
    t.json('variables');  // list of {{placeholder}} names
    t.json('config');     // temperature, output_format, etc.
    t.timestamps(true, true);
  });

  // --- UI Labels (for server-side rendering if needed) ---
  await knex.schema.createTable('ui_labels', (t) => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.string('lang', 5).notNullable();
    t.string('key').notNullable();
    t.text('value').notNullable();
    t.unique(['lang', 'key']);
  });

  // --- Import Jobs ---
  await knex.schema.createTable('import_jobs', (t) => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.enum('status', ['pending', 'running', 'completed', 'failed']).defaultTo('pending');
    t.string('filename');
    t.json('summary');   // { users: 5, courses: 3, ... }
    t.json('errors');    // array of error messages
    t.timestamp('started_at');
    t.timestamp('completed_at');
    t.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('import_jobs');
  await knex.schema.dropTableIfExists('ui_labels');
  await knex.schema.dropTableIfExists('prompt_templates');
  await knex.schema.dropTableIfExists('challenge_run_cycles');
  await knex.schema.dropTableIfExists('challenge_runs');
  await knex.schema.dropTableIfExists('challenges');
  await knex.schema.dropTableIfExists('course_instructors');
  await knex.schema.dropTableIfExists('course_subscriptions');
  await knex.schema.dropTableIfExists('courses');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('institutions');
};
