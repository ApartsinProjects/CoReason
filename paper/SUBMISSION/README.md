# Submission package

Contents for submitting **"Framing, Judging, Steering: An Assessable Competency Model for Teaching
Students to Reason With Generative AI"** (Apartsin & Aperstein).

## Files
- `cover_letter.md` - cover letter (target: Computers & Education: AI, Position Paper).
- `anticipated_reviewer_response.md` - 10 likely reviewer concerns mapped to where the paper answers them.
- The manuscript: `../coreasoning.md` (source), `../../docs/index.html` (rendered, KaTeX), `../../docs/coreasoning.docx` (Word).
- Figures: `../assets/*.{png,svg}` (also in `../../docs/assets/`).
- Bibliography: `../references.bib` (55 entries, validated with bibtest; 1 HBR article is real but not Crossref-indexed).

## Producing a PDF
No LaTeX/cairo toolchain is installed on the build host, so a PDF is produced by one of:
1. Open `docs/coreasoning.docx` in Word/LibreOffice and "Save as PDF" (native Word equations, embedded figures).
2. Open the live page <https://apartsinprojects.github.io/CoReason/> and Print -> Save as PDF (the
   print stylesheet hides UI chrome and avoids breaking figures/tables across pages).

## Pre-submission checklist
- [x] Title, authors, affiliations, abstract, sections 1-12, appendix, references all present.
- [x] No learning-outcome claims; simulated learners labeled; mockup figures disclosed.
- [x] Numbers consistent (N=80 main result; ablations on the 40-learner subset; reliability 92%).
- [x] Bibliography validated (bibtest); no em-dashes (house style).
- [x] Figures render; tables numbered; cross-references resolve.
- [ ] Human-rater agreement study run (Section 10) - REQUIRES human graders; the only open item.
- [ ] Final author proofread + venue-specific formatting (line numbers, blinding if required).
