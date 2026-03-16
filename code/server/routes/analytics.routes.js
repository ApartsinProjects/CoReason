'use strict';
const { Router } = require('express');
const { AnalyticsService } = require('../services/analytics.service');
const { PDFService } = require('../services/pdf.service');
const { requireAuth } = require('../middleware/auth');

module.exports = function analyticsRoutes(db, logger) {
  const router = Router();
  const analyticsService = new AnalyticsService(db, logger);
  const pdfService = new PDFService(logger);

  // GET /api/v1/analytics/student
  router.get('/student', requireAuth, async (req, res, next) => {
    try {
      const overview = await analyticsService.getStudentOverview(req.user.id);
      res.json(overview);
    } catch (err) { next(err); }
  });

  // GET /api/v1/analytics/student/challenge/:id
  router.get('/student/challenge/:id', requireAuth, async (req, res, next) => {
    try {
      const analytics = await analyticsService.getStudentChallengeAnalytics(req.user.id, req.params.id);
      res.json(analytics);
    } catch (err) { next(err); }
  });

  // GET /api/v1/analytics/instructor/:courseId
  router.get('/instructor/:courseId', requireAuth, async (req, res, next) => {
    try {
      const analytics = await analyticsService.getInstructorAnalytics(req.params.courseId);
      res.json(analytics);
    } catch (err) { next(err); }
  });

  // GET /api/v1/analytics/instructor/:courseId/export
  router.get('/instructor/:courseId/export', requireAuth, async (req, res, next) => {
    try {
      const data = await analyticsService.exportInstructorData(req.params.courseId);
      res.json(data);
    } catch (err) { next(err); }
  });

  // GET /api/v1/analytics/instructor/:courseId/export/pdf
  router.get('/instructor/:courseId/export/pdf', requireAuth, async (req, res, next) => {
    try {
      const data = await analyticsService.exportInstructorData(req.params.courseId);
      const pdfBuffer = await pdfService.generateInstructorReport(data);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="analytics-${data.course?.name || 'report'}-${new Date().toISOString().slice(0, 10)}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      res.send(pdfBuffer);
    } catch (err) { next(err); }
  });

  return router;
};
