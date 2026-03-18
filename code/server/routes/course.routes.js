'use strict';
const { Router } = require('express');
const { CourseService } = require('../services/course.service');
const { requireAuth, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createCourseBody } = require('../middleware/schemas');
const { ROLES } = require('../utils/constants');

module.exports = function courseRoutes(db, logger, llmService) {
  const router = Router();
  const courseService = new CourseService(db, logger);

  // GET /api/v1/courses
  router.get('/', async (req, res, next) => {
    try {
      const filters = {
        institutionId: req.query.institutionId,
        search: req.query.search,
        userId: req.user?.id,
        userInstitutionId: req.user?.institution_id,
        instructorOnly: req.query.instructor === 'true',
      };
      const courses = await courseService.list(filters);
      res.json(courses);
    } catch (err) { next(err); }
  });

  // POST /api/v1/courses
  router.post('/', requireAuth, requireRole(ROLES.INSTRUCTOR), validate({ body: createCourseBody }), async (req, res, next) => {
    try {
      logger.info('Course creation requested', { userId: req.user.id, name: req.body.name });
      const course = await courseService.create(req.body, req.user.id);
      res.status(201).json(course);
    } catch (err) {
      logger.error('Course creation failed', { userId: req.user.id, error: err.message });
      next(err);
    }
  });

  // POST /api/v1/courses/generate-subject-tree — Generate subject tree without an existing course
  router.post('/generate-subject-tree', requireAuth, requireRole(ROLES.INSTRUCTOR), async (req, res, next) => {
    try {
      const { courseName, courseDescription, instructions, language } = req.body;
      if (!courseName) {
        return res.status(400).json({ error: 'courseName is required' });
      }

      const tree = await llmService.generateSubjectTree({
        courseName,
        courseDescription: courseDescription || '',
        institution: '',
        existingTree: null,
        instructions: instructions || '',
        language: language || 'English',
      });

      logger.info('Subject tree generated via LLM (pre-creation)', { courseName, nodeCount: countNodes(tree) });
      res.json({ tree, generated: true });
    } catch (err) { next(err); }
  });

  // GET /api/v1/courses/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const course = await courseService.getById(req.params.id);
      res.json(course);
    } catch (err) { next(err); }
  });

  // PUT /api/v1/courses/:id
  router.put('/:id', requireAuth, async (req, res, next) => {
    try {
      logger.info('Course update requested', { userId: req.user.id, courseId: req.params.id });
      const course = await courseService.update(req.params.id, req.body, req.user.id);
      res.json(course);
    } catch (err) {
      logger.error('Course update failed', { userId: req.user.id, courseId: req.params.id, error: err.message });
      next(err);
    }
  });

  // POST /api/v1/courses/:id/subscribe
  router.post('/:id/subscribe', requireAuth, async (req, res, next) => {
    try {
      logger.info('Course subscription requested', { userId: req.user.id, courseId: req.params.id });
      await courseService.subscribe(req.params.id, req.user.id);
      res.json({ message: 'Subscribed successfully' });
    } catch (err) {
      logger.error('Course subscription failed', { userId: req.user.id, courseId: req.params.id, error: err.message });
      next(err);
    }
  });

  // DELETE /api/v1/courses/:id/subscribe
  router.delete('/:id/subscribe', requireAuth, async (req, res, next) => {
    try {
      await courseService.unsubscribe(req.params.id, req.user.id);
      res.json({ message: 'Unsubscribed successfully' });
    } catch (err) {
      logger.error('Course unsubscription failed', { userId: req.user.id, courseId: req.params.id, error: err.message });
      next(err);
    }
  });

  // POST /api/v1/courses/:id/join
  router.post('/:id/join', requireAuth, requireRole(ROLES.INSTRUCTOR), async (req, res, next) => {
    try {
      await courseService.joinAsInstructor(req.params.id, req.user.id);
      res.json({ message: 'Joined as instructor' });
    } catch (err) {
      logger.error('Instructor join failed', { userId: req.user.id, courseId: req.params.id, error: err.message });
      next(err);
    }
  });

  // DELETE /api/v1/courses/:id/leave
  router.delete('/:id/leave', requireAuth, async (req, res, next) => {
    try {
      await courseService.leaveAsInstructor(req.params.id, req.user.id);
      res.json({ message: 'Left course' });
    } catch (err) {
      logger.error('Instructor leave failed', { userId: req.user.id, courseId: req.params.id, error: err.message });
      next(err);
    }
  });

  // GET /api/v1/courses/:id/subjects
  router.get('/:id/subjects', async (req, res, next) => {
    try {
      const subjects = await courseService.getSubjectTree(req.params.id);
      res.json(subjects);
    } catch (err) { next(err); }
  });

  // PUT /api/v1/courses/:id/subjects — requires course instructor
  router.put('/:id/subjects', requireAuth, async (req, res, next) => {
    try {
      const tree = await courseService.updateSubjectTree(req.params.id, req.body.tree, req.user.id);
      res.json(tree);
    } catch (err) { next(err); }
  });

  // POST /api/v1/courses/:id/subjects/generate — Generate subject tree with LLM
  router.post('/:id/subjects/generate', requireAuth, requireRole(ROLES.INSTRUCTOR), async (req, res, next) => {
    try {
      const course = await courseService.getById(req.params.id);
      const institution = course.institution_name || '';
      const existingTree = await courseService.getSubjectTree(req.params.id);

      const tree = await llmService.generateSubjectTree({
        courseName: course.name,
        courseDescription: course.description || '',
        institution,
        existingTree: existingTree.length > 0 ? existingTree : null,
        instructions: req.body.instructions || '',
        language: req.body.language || 'English',
      });

      // Optionally auto-save if requested
      if (req.body.autoSave) {
        await courseService.updateSubjectTree(req.params.id, tree, req.user.id);
      }

      logger.info('Subject tree generated via LLM', { courseId: req.params.id, nodeCount: countNodes(tree) });
      res.json({ tree, generated: true });
    } catch (err) { next(err); }
  });

  return router;
};

function countNodes(tree) {
  if (!Array.isArray(tree)) return 0;
  return tree.reduce((sum, node) => sum + 1 + countNodes(node.children), 0);
};
