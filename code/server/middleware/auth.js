'use strict';

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { AuthError, ForbiddenError } = require('../utils/errors');

function configurePassport(passport, config, logger) {
  // Serialize/deserialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      // This will be wired to the database once models are ready
      // For now, store full user object in session
      done(null, { id });
    } catch (err) {
      done(err);
    }
  });

  // --- Local Strategy (email/password) ---
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        // Will be wired to UserService.findByEmail
        logger.info('Local auth attempt', { email });
        done(null, false, { message: 'Not yet implemented' });
      } catch (err) {
        done(err);
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
          // Will be wired to UserService.findOrCreateByGoogle
          const user = {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            profileImage: profile.photos?.[0]?.value,
            provider: 'google',
          };
          done(null, user);
        } catch (err) {
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

module.exports = { configurePassport, requireAuth, requireRole };
