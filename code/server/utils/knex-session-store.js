'use strict';

/**
 * Minimal session store backed by Knex (works with better-sqlite3 and pg).
 * Implements the express-session Store interface.
 */
module.exports = function (session) {
  const Store = session.Store;

  class KnexSessionStore extends Store {
    constructor(options = {}) {
      super(options);
      this.knex = options.knex;
      this.tableName = options.tableName || 'sessions';
      this.createTable = options.createTable !== false;
      this._ready = this._init();
    }

    async _init() {
      if (!this.createTable) return;
      const exists = await this.knex.schema.hasTable(this.tableName);
      if (!exists) {
        await this.knex.schema.createTable(this.tableName, (t) => {
          t.string('sid').primary();
          t.text('sess').notNullable();
          t.timestamp('expired_at').index();
        });
      }
    }

    get(sid, callback) {
      this._ready
        .then(() => this.knex(this.tableName).where({ sid }).first())
        .then((row) => {
          if (!row) return callback(null, null);
          if (row.expired_at && new Date(row.expired_at) < new Date()) {
            return this.destroy(sid, () => callback(null, null));
          }
          const sess = typeof row.sess === 'string' ? JSON.parse(row.sess) : row.sess;
          callback(null, sess);
        })
        .catch(callback);
    }

    set(sid, sess, callback) {
      const maxAge = sess.cookie && sess.cookie.maxAge;
      const now = new Date();
      const expiredAt = maxAge
        ? new Date(now.getTime() + maxAge)
        : new Date(now.getTime() + 86400000); // default 1 day

      const data = {
        sid,
        sess: JSON.stringify(sess),
        expired_at: expiredAt.toISOString(),
      };

      this._ready
        .then(() =>
          this.knex(this.tableName)
            .insert(data)
            .onConflict('sid')
            .merge()
        )
        .then(() => callback && callback(null))
        .catch((err) => callback && callback(err));
    }

    destroy(sid, callback) {
      this._ready
        .then(() => this.knex(this.tableName).where({ sid }).del())
        .then(() => callback && callback(null))
        .catch((err) => callback && callback(err));
    }

    touch(sid, sess, callback) {
      const maxAge = sess.cookie && sess.cookie.maxAge;
      const expiredAt = maxAge
        ? new Date(Date.now() + maxAge)
        : new Date(Date.now() + 86400000);

      this._ready
        .then(() =>
          this.knex(this.tableName)
            .where({ sid })
            .update({ expired_at: expiredAt.toISOString() })
        )
        .then(() => callback && callback(null))
        .catch((err) => callback && callback(err));
    }

    clearExpired(callback) {
      this._ready
        .then(() =>
          this.knex(this.tableName)
            .where('expired_at', '<', new Date().toISOString())
            .del()
        )
        .then(() => callback && callback(null))
        .catch((err) => callback && callback(err));
    }
  }

  return KnexSessionStore;
};
