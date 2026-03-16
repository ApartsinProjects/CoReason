'use strict';

const PDFDocument = require('pdfkit');

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
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true });
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // --- Title page ---
        doc.fontSize(24).font('Helvetica-Bold').fillColor('#1a237e')
          .text('AI CoReasoning Lab', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(18).fillColor('#333')
          .text('Course Analytics Report', { align: 'center' });
        doc.moveDown(0.3);
        doc.fontSize(14).font('Helvetica').fillColor('#666')
          .text(data.course?.name || 'Unknown Course', { align: 'center' });
        doc.moveDown(0.3);
        doc.fontSize(10).fillColor('#999')
          .text(`Exported: ${new Date(data.exported_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, { align: 'center' });

        doc.moveDown(1);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ddd');
        doc.moveDown(1);

        // --- Summary ---
        const runs = data.runs || [];
        const completed = runs.filter(r => r.status === 'completed');
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
          const phases = run.phases || {};
          if (phases.framing?.evaluation?.grade) {
            const g = phases.framing.evaluation.grade;
            grades.framing[g] = (grades.framing[g] || 0) + 1;
          }
          if (phases.cycles) {
            for (const cycle of Object.values(phases.cycles)) {
              if (cycle.judging?.evaluation?.grade) {
                const g = cycle.judging.evaluation.grade;
                grades.judging[g] = (grades.judging[g] || 0) + 1;
              }
              if (cycle.steering?.evaluation?.grade) {
                const g = cycle.steering.evaluation.grade;
                grades.steering[g] = (grades.steering[g] || 0) + 1;
              }
            }
          }
        }

        doc.fontSize(11).font('Helvetica').fillColor('#333');
        for (const [phase, dist] of Object.entries(grades)) {
          const total = Object.values(dist).reduce((s, v) => s + v, 0);
          if (total === 0) continue;
          const parts = ['A', 'B', 'C', 'D', 'F']
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
        const col = { name: 50, challenge: 180, status: 340, framing: 410, judging: 450, steering: 490 };

        doc.fontSize(9).font('Helvetica-Bold').fillColor('#666');
        doc.text('Student', col.name, tableTop);
        doc.text('Challenge', col.challenge, tableTop);
        doc.text('Status', col.status, tableTop);
        doc.text('Frm', col.framing, tableTop);
        doc.text('Jdg', col.judging, tableTop);
        doc.text('Str', col.steering, tableTop);

        doc.moveTo(50, doc.y + 4).lineTo(545, doc.y + 4).stroke('#ddd');
        doc.moveDown(0.5);

        // Table rows
        doc.font('Helvetica').fontSize(9).fillColor('#333');
        for (const run of runs) {
          if (doc.y > 720) {
            doc.addPage();
            doc.y = 50;
          }

          const phases = run.phases || {};
          const framingGrade = phases.framing?.evaluation?.grade || '—';
          let judgingGrade = '—';
          let steeringGrade = '—';
          if (phases.cycles) {
            const cycleKeys = Object.keys(phases.cycles);
            const lastCycle = phases.cycles[cycleKeys[cycleKeys.length - 1]];
            if (lastCycle?.judging?.evaluation?.grade) judgingGrade = lastCycle.judging.evaluation.grade;
            if (lastCycle?.steering?.evaluation?.grade) steeringGrade = lastCycle.steering.evaluation.grade;
          }

          const y = doc.y;
          doc.text(run.student_name || 'Unknown', col.name, y, { width: 125 });
          doc.text((run.challenge_title || '').substring(0, 25), col.challenge, y, { width: 155 });
          doc.text(run.status || '', col.status, y, { width: 65 });
          doc.text(framingGrade, col.framing, y);
          doc.text(judgingGrade, col.judging, y);
          doc.text(steeringGrade, col.steering, y);
          doc.moveDown(0.3);
        }

        if (runs.length === 0) {
          doc.fontSize(11).fillColor('#999').text('No challenge runs recorded yet.', 50);
        }

        // --- Footer ---
        const pageCount = doc.bufferedPageRange().count;
        for (let i = 0; i < pageCount; i++) {
          doc.switchToPage(i);
          doc.fontSize(8).fillColor('#999')
            .text(`AI CoReasoning Lab — Page ${i + 1} of ${pageCount}`, 50, 780, { align: 'center' });
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = { PDFService };
