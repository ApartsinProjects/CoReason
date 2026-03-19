'use strict';
const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { UserService } = require('../services/user.service');
const { requireAuth } = require('../middleware/auth');

module.exports = function userRoutes(db, logger) {
  const router = Router();
  const userService = new UserService(db, logger);

  // --- Avatar upload config ---
  const avatarDir = path.resolve(__dirname, '../../client/uploads/avatars');
  // Ensure directory exists
  if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
  }

  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, avatarDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.png';
      const filename = `${req.user.id}-${Date.now()}${ext}`;
      cb(null, filename);
    },
  });

  const avatarUpload = multer({
    storage: avatarStorage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
      if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
      }
    },
  });

  // GET /api/v1/users/me
  router.get('/me', requireAuth, async (req, res, next) => {
    try {
      const profile = await userService.getProfile(req.user.id);
      res.json(profile);
    } catch (err) { next(err); }
  });

  // PUT /api/v1/users/me
  router.put('/me', requireAuth, async (req, res, next) => {
    try {
      const updated = await userService.updateProfile(req.user.id, req.body);
      res.json(updated);
    } catch (err) { next(err); }
  });

  // POST /api/v1/users/me/avatar — upload profile image
  router.post('/me/avatar', requireAuth, (req, res, next) => {
    avatarUpload.single('avatar')(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: { code: 'FILE_TOO_LARGE', message: 'Image must be 2MB or smaller' } });
          }
          return res.status(400).json({ error: { code: 'UPLOAD_ERROR', message: err.message } });
        }
        return res.status(400).json({ error: { code: 'INVALID_FILE', message: err.message } });
      }

      if (!req.file) {
        return res.status(400).json({ error: { code: 'NO_FILE', message: 'No image file provided' } });
      }

      try {
        const imageUrl = `/uploads/avatars/${req.file.filename}`;

        // Delete old avatar file if it exists and is a local upload
        const oldProfile = await userService.getProfile(req.user.id);
        if (oldProfile.profile_image && oldProfile.profile_image.startsWith('/uploads/avatars/')) {
          const oldPath = path.resolve(__dirname, '../../client', oldProfile.profile_image.slice(1));
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
            logger.info('Deleted old avatar', { path: oldPath });
          }
        }

        // Update user profile_image in database
        const updated = await userService.updateProfile(req.user.id, { profile_image: imageUrl });
        logger.info('Avatar uploaded', { userId: req.user.id, filename: req.file.filename });
        res.json({ profile_image: imageUrl, user: updated });
      } catch (updateErr) {
        next(updateErr);
      }
    });
  });

  // GET /api/v1/users/me/stats
  router.get('/me/stats', requireAuth, async (req, res, next) => {
    try {
      const stats = await userService.getStats(req.user.id);
      res.json(stats);
    } catch (err) { next(err); }
  });

  return router;
};
