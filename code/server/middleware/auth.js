'use strict';

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { AuthError, ForbiddenError } = require('../utils/errors');

function configurePassport(passport, config, logger, db) {
  const { AuthService } = require('../services/auth.service');
  const authService = new AuthService(db, logger);

  // Serialize/deserialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await authService.findById(id);
      if (!user) return done(null, false);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // --- Local Strategy (email/password) ---
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        logger.info('Local auth attempt', { email });
        const user = await authService.login(email, password);
        done(null, user);
      } catch (err) {
        logger.warn('Local auth failed', { email, error: err.message });
        done(null, false, { message: err.message || 'Invalid credentials' });
      }
    }
  ));

  // --- Google OAuth Strategy ---
  const googleClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

  if (googleClientId && googleClientSecret) {
    passport.use(new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: config.auth.google.callback_url,
        scope: config.auth.google.scope,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          logger.info('Google auth callback', {
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
          });
          const user = await authService.findOrCreateByGoogle(profile);
          done(null, user);
        } catch (err) {
          logger.error('Google auth error', { error: err.message });
          done(err);
        }
      }
    ));
    logger.info('Google OAuth strategy configured');
  } else {
    logger.warn('Google OAuth not configured (missing GOOGLE_OAUTH_CLIENT_ID/SECRET)');
  }
}

// Middleware: require authenticated user
function requireAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  next(new AuthError());
}

// Middleware: require specific role
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthError());
    }
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError(`Requires role: ${roles.join(' or ')}`));
    }
    next();
  };
}

// Middleware: populate req.user if authenticated, but don't block if not
function optionalAuth(req, res, next) {
  // Passport already populates req.user from session if present
  next();
}

module.exports = { configurePassport, requireAuth, requireRole, optionalAuth };
