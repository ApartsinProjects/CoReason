'use strict';

const { v4: uuidv4 } = require('uuid');

class InstitutionService {
  constructor(db, logger) {
    this.db = db;
    this.logger = logger;
  }

  async list() {
    return this.db('institutions').select('*').orderBy('name');
  }

  async getById(id) {
    return this.db('institutions').where({ id }).first();
  }

  async create({ name, country, departments }) {
    const institution = {
      id: uuidv4(),
      name,
      country: country || null,
      departments: JSON.stringify(departments || []),
    };
    await this.db('institutions').insert(institution);
    this.logger.info('Institution created', { id: institution.id, name });
    return { ...institution, departments: departments || [] };
  }

  async upsertByName(name, data = {}) {
    let inst = await this.db('institutions').where({ name }).first();
    if (inst) return inst;
    return this.create({ name, ...data });
  }
}

module.exports = { InstitutionService };
