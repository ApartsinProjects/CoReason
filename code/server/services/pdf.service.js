'use strict';

const PDFDocument = require('pdfkit');
const { RUN_STATUS, GRADE_LETTERS, PDF, PDF_LAYOUT } = require('../utils/constants');

class PDFService {
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * Generate a PDF buffer from instructor analytics data.
   * @param {Object} data - Export data from analyticsService.exportInstructorData()
   * @returns {Buffer} PDF file as buffer
   */
  async generateInstructorReport(data) {
    this.logger.info('PDF generation started', { course: data.course?.name });
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: PDF_LAYOUT.MARGIN, bufferPages: true });
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => {
          const buffer = Buffer.concat(chunks);
          this.logger.info('PDF generation complete', { course: data.course?.name, bytes: buffer.length });
          resolve(buffer);
        });
        doc.on('error', reject);

        // --- Title page ---
        doc.fontSize(24).font('Helvetica-Bold').fillColor('#1a237e')
          .text(PDF.APP_NAME, { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(18).fillColor('#333')
          .text(PDF.REPORT_TITLE, { align: 'center' });
        doc.moveDown(0.3);
        doc.fontSize(14).font('Helvetica').fillColor('#666')
          .text(data.course?.name || 'Unknown Course', { align: 'center' });
        doc.moveDown(0.3);
        doc.fontSize(10).fillColor('#999')
          .text(`Exported: ${new Date(data.exported_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, { align: 'center' });

        doc.moveDown(1);
        doc.moveTo(PDF_LAYOUT.MARGIN, doc.y).lineTo(PDF_LAYOUT.RIGHT_BOUNDARY, doc.y).stroke('#ddd');
        doc.moveDown(1);

        // --- Summary ---
        const runs = data.runs || [];
        const completed = runs.filter(r => r.status === RUN_STATUS.COMPLETED);
        const students = [...new Set(runs.map(r => r.student_email))];

        doc.fontSize(14).font('Helvetica-Bold').fillColor('#1a237e')
          .text('Summary');
        doc.moveDown(0.5);
        doc.fontSize(11).font('Helvetica').fillColor('#333');
        doc.text(`Total Students: ${students.length}`);
        doc.text(`Total Runs: ${runs.length}`);
        doc.text(`Completed Runs: ${completed.length}`);
        doc.text(`Completion Rate: ${runs.length > 0 ? Math.round((completed.length / runs.length) * 100) : 0}%`);

        // --- Grade Distribution ---
        doc.moveDown(1);
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#1a237e')
          .text('Grade Distribution');
        doc.moveDown(0.5);

        const grades = { framing: {}, judging: {}, steering: {} };
        for (const run of completed) {
          // Framing grade is stored directly on the run
          if (run.framing_grade) {
            const g = run.framing_grade;
            grades.framing[g] = (grades.framing[g] || 0) + 1;
          }
          // Judging/steering grades come from cycles array
          const runCycles = run.cycles || [];
          for (const cycle of runCycles) {
            if (cycle.judging_grade) {
              const g = cycle.judging_grade;
              grades.judging[g] = (grades.judging[g] || 0) + 1;
            }
            if (cycle.steering_grade) {
              const g = cycle.steering_grade;
              grades.steering[g] = (grades.steering[g] || 0) + 1;
            }
          }
        }

        doc.fontSize(11).font('Helvetica').fillColor('#333');
        for (const [phase, dist] of Object.entries(grades)) {
          const total = Object.values(dist).reduce((s, v) => s + v, 0);
          if (total === 0) continue;
          const parts = GRADE_LETTERS
            .filter(g => dist[g])
            .map(g => `${g}: ${dist[g]}`)
            .join('  |  ');
          doc.text(`${phase.charAt(0).toUpperCase() + phase.slice(1)}: ${parts}`);
        }

        // --- Per-Student Table ---
        doc.moveDown(1);
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#1a237e')
          .text('Per-Student Results');
        doc.moveDown(0.5);

        // Table header
        const tableTop = doc.y;
        const col = PDF_LAYOUT.TABLE_COLUMNS;

        doc.fontSize(9).font('Helvetica-Bold').fillColor('#666');
        doc.text('Student', col.name, tableTop);
        doc.text('Challenge', col.challenge, tableTop);
        doc.text('Status', col.status, tableTop);
        doc.text('Frm', col.framing, tableTop);
        doc.text('Jdg', col.judging, tableTop);
        doc.text('Str', col.steering, tableTop);

        doc.moveTo(PDF_LAYOUT.MARGIN, doc.y + 4).lineTo(PDF_LAYOUT.RIGHT_BOUNDARY, doc.y + 4).stroke('#ddd');
        doc.moveDown(0.5);

        // Table rows
        doc.font('Helvetica').fontSize(9).fillColor('#333');
        for (const run of runs) {
          if (doc.y > PDF_LAYOUT.PAGE_BREAK_Y) {
            doc.addPage();
            doc.y = PDF_LAYOUT.MARGIN;
          }

          const framingGrade = run.framing_grade || '—';
          let judgingGrade = '—';
          let steeringGrade = '—';
          const runCycles = run.cycles || [];
          if (runCycles.length > 0) {
            const lastCycle = runCycles[runCycles.length - 1];
            if (lastCycle.judging_grade) judgingGrade = lastCycle.judging_grade;
            if (lastCycle.steering_grade) steeringGrade = lastCycle.steering_grade;
          }

          const y = doc.y;
          doc.text(run.student_name || 'Unknown', col.name, y, { width: PDF_LAYOUT.TABLE_COLUMN_WIDTHS.name });
          doc.text((run.challenge_title || '').substring(0, PDF_LAYOUT.CHALLENGE_TITLE_MAX_LENGTH), col.challenge, y, { width: PDF_LAYOUT.TABLE_COLUMN_WIDTHS.challenge });
          doc.text(run.status || '', col.status, y, { width: PDF_LAYOUT.TABLE_COLUMN_WIDTHS.status });
          doc.text(framingGrade, col.framing, y);
          doc.text(judgingGrade, col.judging, y);
          doc.text(steeringGrade, col.steering, y);
          doc.moveDown(0.3);
        }

        if (runs.length === 0) {
          doc.fontSize(11).fillColor('#999').text('No challenge runs recorded yet.', PDF_LAYOUT.MARGIN);
        }

        // --- Footer ---
        const pageCount = doc.bufferedPageRange().count;
        for (let i = 0; i < pageCount; i++) {
          doc.switchToPage(i);
          doc.fontSize(8).fillColor('#999')
            .text(`${PDF.APP_NAME} — Page ${i + 1} of ${pageCount}`, PDF_LAYOUT.MARGIN, PDF_LAYOUT.FOOTER_Y, { align: 'center' });
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = { PDFService };
