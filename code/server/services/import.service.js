'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { ValidationError } = require('../utils/errors');
const {
  ROLES, DEFAULTS, IMPORT_STATUS, CHALLENGE_TYPE, VISIBILITY,
  RESPONSE_TYPE, CHALLENGE_STATUS, COURSE_STATUS, PATHS,
} = require('../utils/constants');
const { safeParse } = require('../utils/helpers');

class ImportService {
  constructor(db, logger) {
    this.db = db;
    this.logger = logger;
  }

  async importFromYAML(content, options = {}) {
    const jobId = uuidv4();
    await this.db('import_jobs').insert({
      id: jobId,
      status: IMPORT_STATUS.RUNNING,
      filename: options.filename || 'inline',
      started_at: new Date().toISOString(),
    });

    const summary = { institutions: 0, users: 0, courses: 0, challenges: 0, prompts: 0 };
    const errors = [];

    try {
      let data;
      try {
        data = typeof content === 'string' ? yaml.load(content) : content;
      } catch (parseErr) {
        this.logger.error('Import: YAML parse failed', { error: parseErr.message });
        return { summary: { institutions: 0, users: 0, courses: 0, challenges: 0, prompts: 0 }, errors: [`YAML parse error: ${parseErr.message}`] };
      }
      const importData = data.import || data;

      // Import institutions
      if (importData.institutions) {
        for (const inst of importData.institutions) {
          try {
            const existing = await this.db('institutions').where({ name: inst.name }).first();
            if (!existing) {
              await this.db('institutions').insert({
                id: uuidv4(),
                name: inst.name,
                country: inst.country || null,
                departments: JSON.stringify(inst.departments || []),
              });
              summary.institutions++;
            }
          } catch (err) {
            this.logger.error('Import: institution failed', { name: inst.name, error: err.message });
            errors.push(`Institution "${inst.name}": ${err.message}`);
          }
        }
      }

      // Import users
      if (importData.users) {
        for (const userData of importData.users) {
          try {
            let institutionId = null;
            if (userData.institution) {
              const inst = await this.db('institutions').where({ name: userData.institution }).first();
              institutionId = inst?.id || null;
            }
            const existing = await this.db('users').where({ email: userData.email }).first();
            if (!existing) {
              await this.db('users').insert({
                id: uuidv4(),
                email: userData.email,
                name: userData.name,
                role: userData.role || ROLES.STUDENT,
                institution_id: institutionId,
                password_hash: userData.password ? await bcrypt.hash(userData.password, DEFAULTS.BCRYPT_ROUNDS) : null,
                preferred_language: userData.language || DEFAULTS.PREFERRED_LANGUAGE,
                tour_completed: false,
              });
              summary.users++;
            }
          } catch (err) {
            this.logger.error('Import: user failed', { email: userData.email, error: err.message });
            errors.push(`User "${userData.email}": ${err.message}`);
          }
        }
      }

      // Import courses
      if (importData.courses) {
        for (const courseData of importData.courses) {
          try {
            let institutionId = null;
            if (courseData.institution) {
              const inst = await this.db('institutions').where({ name: courseData.institution }).first();
              institutionId = inst?.id || null;
            }
            const existing = await this.db('courses').where({ name: courseData.name }).first();
            if (!existing) {
              const courseId = uuidv4();
              await this.db('courses').insert({
                id: courseId,
                name: courseData.name,
                description: courseData.description || null,
                institution_id: institutionId,
                department: courseData.department || null,
                subject_tree: JSON.stringify(courseData.subject_tree || []),
                steward_config: JSON.stringify(courseData.steward_config || {}),
                status: COURSE_STATUS.ACTIVE,
              });

              // Link instructors
              if (courseData.instructors) {
                for (const rawEmail of courseData.instructors) {
                  const email = (rawEmail || '').toLowerCase().trim();
                  const user = await this.db('users').where({ email }).first();
                  if (user) {
                    await this.db('course_instructors').insert({
                      id: uuidv4(),
                      user_id: user.id,
                      course_id: courseId,
                    });
                  } else {
                    this.logger.warn('Import: instructor not found, skipping link', { email, course: courseData.name });
                    errors.push(`Course "${courseData.name}": instructor "${email}" not found — skipped`);
                  }
                }
              }
              summary.courses++;
            }
          } catch (err) {
            this.logger.error('Import: course failed', { name: courseData.name, error: err.message });
            errors.push(`Course "${courseData.name}": ${err.message}`);
          }
        }
      }

      // Import challenges
      if (importData.challenges) {
        for (const chData of importData.challenges) {
          try {
            const creatorEmail = (chData.creator || '').toLowerCase().trim();
            const creator = await this.db('users').where({ email: creatorEmail }).first();
            const course = chData.course
              ? await this.db('courses').where({ name: chData.course }).first()
              : null;
            if (!creator) throw new Error(`Creator not found: ${chData.creator}`);

            // Skip if challenge with same title+course already exists
            const existingChallenge = await this.db('challenges')
              .where({ title: chData.title, course_id: course?.id || null })
              .first();
            if (existingChallenge) {
              this.logger.info('Import: challenge already exists, skipping', { title: chData.title });
              continue;
            }

            await this.db('challenges').insert({
              id: uuidv4(),
              title: chData.title,
              creator_id: creator.id,
              course_id: course?.id || null,
              subject_path: JSON.stringify(chData.subject_path || []),
              challenge_type: chData.type || CHALLENGE_TYPE.PRACTICE,
              visibility: chData.visibility || VISIBILITY.PUBLIC,
              response_config: JSON.stringify({
                phase1: chData.phase1_response || DEFAULTS.RESPONSE_TYPE_PHASE1,
                phase2: chData.phase2_response || DEFAULTS.RESPONSE_TYPE_PHASE2,
              }),
              max_cycles: chData.max_cycles || DEFAULTS.MAX_CYCLES,
              instructions: JSON.stringify(chData.instructions || {}),
              status: chData.status || CHALLENGE_STATUS.PUBLISHED,
            });
            summary.challenges++;
          } catch (err) {
            this.logger.error('Import: challenge failed', { title: chData.title, error: err.message });
            errors.push(`Challenge "${chData.title}": ${err.message}`);
          }
        }
      }

      // Import prompt templates from files
      if (options.importPrompts) {
        const promptsDir = path.resolve(__dirname, PATHS.PROMPTS_DIR_FROM_SERVICES);
        if (fs.existsSync(promptsDir)) {
          const files = fs.readdirSync(promptsDir).filter(f => f.endsWith('.yaml'));
          for (const file of files) {
            try {
              const promptContent = fs.readFileSync(path.join(promptsDir, file), 'utf8');
              const existing = await this.db('prompt_templates').where({ filename: file }).first();
              if (!existing) {
                await this.db('prompt_templates').insert({
                  id: uuidv4(),
                  filename: file,
                  content: promptContent,
                  variables: JSON.stringify(this._extractVariables(promptContent)),
                });
                summary.prompts++;
              }
            } catch (err) {
              errors.push(`Prompt "${file}": ${err.message}`);
            }
          }
        }
      }

      await this.db('import_jobs').where({ id: jobId }).update({
        status: IMPORT_STATUS.COMPLETED,
        summary: JSON.stringify(summary),
        errors: JSON.stringify(errors),
        completed_at: new Date().toISOString(),
      });

      this.logger.info('Import completed', { jobId, summary, errorCount: errors.length });
      return { jobId, summary, errors };

    } catch (err) {
      await this.db('import_jobs').where({ id: jobId }).update({
        status: IMPORT_STATUS.FAILED,
        errors: JSON.stringify([err.message]),
        completed_at: new Date().toISOString(),
      });
      throw err;
    }
  }

  async importFromFile(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new ValidationError(`File not found: ${filePath}`);
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return this.importFromYAML(content, {
      filename: path.basename(filePath),
      importPrompts: true,
    });
  }

  async getJobStatus(jobId) {
    const job = await this.db('import_jobs').where({ id: jobId }).first();
    if (!job) return { id: jobId, status: IMPORT_STATUS.NOT_FOUND };
    return {
      ...job,
      summary: safeParse(job.summary, null),
      errors: safeParse(job.errors, []),
    };
  }

  async seedFromContent() {
    const contentDir = path.resolve(__dirname, PATHS.CONTENT_DIR_FROM_SERVICES);
    if (!fs.existsSync(contentDir)) {
      this.logger.warn('Content directory not found, skipping seed');
      return { summary: {}, errors: ['Content directory not found'] };
    }

    const institutionsFile = path.join(contentDir, 'institutions.yaml');
    const importData = { institutions: [], users: [], courses: [], challenges: [] };

    if (fs.existsSync(institutionsFile)) {
      const instData = yaml.load(fs.readFileSync(institutionsFile, 'utf8'));
      if (instData?.institutions) {
        importData.institutions = instData.institutions.map(i => ({
          name: typeof i === 'string' ? i : i.name,
          country: i.country || null,
          departments: i.departments || [],
        }));
      }
    }

    return this.importFromYAML({ import: importData }, {
      filename: 'seed-from-content',
      importPrompts: true,
    });
  }

  _extractVariables(content) {
    const matches = content.match(/\{\{(\w+)\}\}/g) || [];
    return [...new Set(matches.map(m => m.replace(/[{}]/g, '')))];
  }
}

module.exports = { ImportService };
