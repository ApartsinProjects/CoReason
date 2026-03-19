'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { ValidationError, AuthError, ConflictError, NotFoundError } = require('../utils/errors');
const { ROLES, VALID_REGISTRATION_ROLES, DEFAULTS } = require('../utils/constants');

class AuthService {
  constructor(db, logger) {
    this.db = db;
    this.logger = logger;
  }

  async register({ email, password, name, role, institutionId }) {
    // Validate required fields
    if (!email || typeof email !== 'string' || !email.trim()) {
      throw new ValidationError('Email is required');
    }
    if (!password || typeof password !== 'string' || !password.trim()) {
      throw new ValidationError('Password is required');
    }
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new ValidationError('Name is required');
    }

    // Validate role
    if (!VALID_REGISTRATION_ROLES.includes(role)) {
      throw new ValidationError('Invalid role', { role });
    }

    // Check if email already exists
    const existing = await this.db('users').where({ email }).first();
    if (existing) {
      throw new ConflictError('Email already registered', { email });
    }

    // Verify institution exists
    if (institutionId) {
      const inst = await this.db('institutions').where({ id: institutionId }).first();
      if (!inst) throw new NotFoundError('Institution', institutionId);
    }

    // Validate name length and sanitize HTML
    if (name.length > 100) {
      throw new ValidationError('Name must be 100 characters or fewer');
    }
    const sanitizedName = name.replace(/<[^>]*>/g, '').trim();
    if (!sanitizedName) {
      throw new ValidationError('Name cannot contain only HTML tags');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, DEFAULTS.BCRYPT_ROUNDS);

    const user = {
      id: uuidv4(),
      email: email.toLowerCase().trim(),
      password_hash: passwordHash,
      name: sanitizedName,
      role,
      institution_id: institutionId || null,
      preferred_language: DEFAULTS.PREFERRED_LANGUAGE,
      tour_completed: false,
    };

    await this.db('users').insert(user);
    this.logger.info('User registered', { userId: user.id, email: user.email, role });

    // Return user without password hash
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  async login(email, password) {
    if (!email || typeof email !== 'string' || !email.trim()) {
      throw new ValidationError('Email is required');
    }
    if (!password || typeof password !== 'string' || !password.trim()) {
      throw new ValidationError('Password is required');
    }
    const user = await this.db('users').where({ email: email.toLowerCase().trim() }).first();
    if (!user) {
      throw new AuthError('Invalid email or password');
    }
    if (!user.password_hash) {
      throw new AuthError('This account uses SSO login. Please sign in with Google.');
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw new AuthError('Invalid email or password');
    }

    this.logger.info('User logged in', { userId: user.id, email: user.email });
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  async findOrCreateByGoogle(profile) {
    const email = profile.emails?.[0]?.value?.toLowerCase();
    if (!email) throw new ValidationError('Google account has no email');

    // Try to find by google_id first
    let user = await this.db('users').where({ google_id: profile.id }).first();
    if (user) {
      this.logger.info('Google login (existing)', { userId: user.id });
      const { password_hash, ...safeUser } = user;
      return safeUser;
    }

    // Try to find by email (link accounts)
    user = await this.db('users').where({ email }).first();
    if (user) {
      await this.db('users').where({ id: user.id }).update({
        google_id: profile.id,
        profile_image: profile.photos?.[0]?.value || user.profile_image,
      });
      this.logger.info('Google account linked', { userId: user.id });
      const { password_hash, ...safeUser } = user;
      return { ...safeUser, google_id: profile.id };
    }

    // Create new user (default role: student, can be changed in profile)
    const newUser = {
      id: uuidv4(),
      email,
      name: profile.displayName || email.split('@')[0],
      role: ROLES.STUDENT,
      google_id: profile.id,
      profile_image: profile.photos?.[0]?.value || null,
      preferred_language: DEFAULTS.PREFERRED_LANGUAGE,
      tour_completed: false,
    };

    await this.db('users').insert(newUser);
    this.logger.info('New user via Google', { userId: newUser.id, email });
    return newUser;
  }

  async findById(id) {
    const user = await this.db('users')
      .leftJoin('institutions', 'users.institution_id', 'institutions.id')
      .select('users.*', 'institutions.name as institution_name')
      .where('users.id', id)
      .first();
    if (!user) return null;
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  async findByEmail(email) {
    const user = await this.db('users').where({ email: email.toLowerCase().trim() }).first();
    if (!user) return null;
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }
}

module.exports = { AuthService };
