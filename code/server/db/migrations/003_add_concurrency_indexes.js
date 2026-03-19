'use strict';

exports.up = async function (knex) {
  // Add composite index on challenge_run_cycles for efficient cycle lookups
  await knex.schema.alterTable('challenge_run_cycles', (t) => {
    t.index(['run_id', 'cycle_num']);
  });

  // Add index on users.google_id for OAuth login lookups
  await knex.schema.alterTable('users', (t) => {
    t.index('google_id');
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('challenge_run_cycles', (t) => {
    t.dropIndex(['run_id', 'cycle_num']);
  });

  await knex.schema.alterTable('users', (t) => {
    t.dropIndex('google_id');
  });
};
