'use strict';

exports.up = async function (knex) {
  // Add department column to courses
  await knex.schema.alterTable('courses', (t) => {
    t.string('department');
  });

  // Add indexes on frequently queried columns
  await knex.schema.alterTable('challenges', (t) => {
    t.index('creator_id');
    t.index('course_id');
    t.index('status');
  });

  await knex.schema.alterTable('challenge_runs', (t) => {
    t.index('challenge_id');
    t.index('user_id');
    t.index('status');
  });

  await knex.schema.alterTable('courses', (t) => {
    t.index('institution_id');
    t.index('status');
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('courses', (t) => {
    t.dropColumn('department');
    t.dropIndex('institution_id');
    t.dropIndex('status');
  });

  await knex.schema.alterTable('challenge_runs', (t) => {
    t.dropIndex('challenge_id');
    t.dropIndex('user_id');
    t.dropIndex('status');
  });

  await knex.schema.alterTable('challenges', (t) => {
    t.dropIndex('creator_id');
    t.dropIndex('course_id');
    t.dropIndex('status');
  });
};
