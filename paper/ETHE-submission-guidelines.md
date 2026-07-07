# ETHE submission requirements — checklist and compliance

**Journal:** *International Journal of Educational Technology in Higher Education* (ETHE), SpringerOpen (Springer Nature journal 41239).
**Source:** the live Research Articles guidelines page, read via a logged-in browser session (the page is bot-gated to anonymous fetch): <https://link.springer.com/journal/41239/submission-guidelines/research-articles> (mirror: <https://educationaltechnologyjournal.springeropen.com/submission-guidelines/preparing-your-manuscript/research-articles>).
**Compiled:** July 2026. Re-check the live page at final submission; SpringerOpen revises details occasionally.

Legend: ✅ done · ⚠️ author action · ℹ️ note.

---

## 1. Article type and length
- Research article: reports original research and assesses its contribution to the field.
- Length: **no strict word count, but research articles should be 4,500–8,000 words.**
  - Ours: ~8,040-word main text ✅ (at the upper edge; "not strict").

## 2. Title page
- Title that includes the research design (or, for non-research, what the article reports). ✅
- Full names and institutional addresses for all authors. ✅ (identified copy)
- Indicate the **corresponding author**. ✅ Dr. Yehudit Aperstein (Afeka College of Engineering).
- ⚠️ Add corresponding-author **email** (and optionally ORCID) in the submission portal / title page.
- ℹ️ LLM policy: LLMs (e.g., ChatGPT) **cannot be authors**. Any LLM use must be documented in the Methods section (or a suitable alternative part). Our LLM instrument is documented in §7.1/§8; disclose any AI writing assistance there too.

## 3. Abstract
- **Unstructured, 150–250 words.** No undefined abbreviations, no unspecified references.
  - Ours: **248 words**, unstructured, no citations, abbreviations (CoRe-3, FJS) defined ✅.

## 4. Keywords
- **Three to ten** keywords.
  - Ours: 6 (generative AI; AI literacy; competency assessment; metacognition; self-regulated learning; higher education) ✅.

## 5. Main text
- Body of the article; may be broken into subsections with short, informative headings. ✅

## 6. Abbreviations
- Define each abbreviation at first use; provide a **List of abbreviations** if abbreviations are used.
  - ℹ️ Optional to add a short abbreviations list (CoRe-3, FJS, MTMM). ⚠️ consider adding.

## 7. Declarations (required heading; the 5 subsections below)
Write "Not applicable" under any heading that is not relevant.
1. **Availability of data and materials** — required statement; give repository name + persistent link (DOI/URL) or state access conditions. ✅ (URL withheld for anonymous review; to editors on request.)
2. **Competing interests** — declare all; use author initials. ✅ "no competing interests."
3. **Funding** — declare all sources; state role if any. ✅ no funding.
4. **Authors' contributions** — specify each author's contribution using initials; "All authors read and approved the final manuscript." ✅ ⚠️ convert to initials (AA/YA) if desired.
5. **Acknowledgements** — acknowledge non-author contributors, or "Not applicable." ✅
- Optional: **Authors' information**.
- ℹ️ Ethics approval / Consent for publication are **not** in ETHE's list (education, no human subjects). We keep them as "Not applicable" because the submission portal usually asks; strip if you prefer to match the 5 exactly.
- ℹ️ "Code availability" is **not** an ETHE declaration — code is covered by Availability of data and materials (we removed our earlier erroneous one).

## 8. Footnotes
- Superscript numbers in text; **not** for references/citations.

## 9. References — APA (author–date)
- American Psychological Association style (author, year). Examples on the page confirm APA form.
- Web links/URLs get a reference-number entry (title + URL + access date), not inline in body text.
- Only published / in-press / public-preprint works may be cited; unpublished data / personal communications go in text only.
  - Ours: APA sentence-case titles, italic volume, roman publishers, alphabetical ✅ (bibtest: valid).

## 10. General formatting (quick points)
- **Double line spacing.** ⚠️ Submission copy uses **1.5** (review-manuscript profile) — bump to exact double if required.
- **Include line and page numbering.** ✅ on the anonymized submission copy (`coreasoning-blinded.docx`).
- **Do not use page breaks.** ℹ️ verify none inserted.
- Use SI units; embed special characters.
- Concise English.

## 11. File formats
- Main manuscript: **DOC/DOCX, RTF, or TeX/LaTeX** (editable files required for production). ✅ DOCX.
- LaTeX users: Springer Nature LaTeX template encouraged (not required): <https://www.overleaf.com/latex/templates/springer-nature-latex-template/myxmhdsbzkyd>.
- ℹ️ **No mandatory Word template** at initial submission.

## 12. Figures
- Titles ≤ 15 words, legends ≤ 300 words, provided **in the main manuscript** (not in the graphic).
- Tables must NOT be submitted as figures.
- Numbered in citation order; multi-panel = single composite file.
- At production: separate files, formats EPS/PDF/TIFF/PNG/JPEG/Word/PowerPoint; web 600 px (1200 hi-res); PDF 85 mm (half) / 170 mm (full), ~300 dpi; embed fonts; ≤ 10 MB each.
  - Ours: figures embedded in the DOCX (fine for initial submission). ⚠️ export separates if accepted.

## 13. Tables
- Numbered, cited as Table 1, 2 … (Arabic).
- Built with the word-processor **Table object** (not images/spreadsheets). ✅
- **No colour or shading** — highlight via superscript/bold; explain in legend. ⚠️ our tables use light header shading; remove/convert to bold at revision if the editor requires.
- Title ≤ 15 words above the table; legend ≤ 300 words below.
- No commas in numerical values.

## 14. Additional files (supplementary)
- Datasets/tables/movies/other as Additional files; each cited in sequence; ≤ 20 MB each.
- Do not include consent forms, editing certificates, or tracked-changes manuscripts.
  - Ours: `supplementary.docx` = Additional file 1 (system walkthrough, robustness/ablations, cross-disciplinary showcase). ✅

## 15. Peer review
- **Double-anonymous.** Submit the anonymized manuscript.
  - Ours: `coreasoning-blinded.docx` (+ `supplementary.md` blinded) — no author/platform identifiers ✅.

---

## Deliverables (docs/)
| File | Purpose |
|---|---|
| `coreasoning-blinded.docx` | **Manuscript for submission** (double-anonymous, line/page-numbered) |
| `supplementary.docx` (blinded via `supplementary-blinded.md`) | **Additional file 1** |
| `cover-letter.docx` | Cover letter (names Dr. Aperstein as corresponding author) |
| `coreasoning.docx` | Identified camera-ready copy (records / web page) |
| `index.html` + `cover-letter.html` + `supplementary.html` | Published web versions (GitHub Pages) |

## Author actions before submitting
- [ ] Corresponding-author email + ORCID (portal / title page).
- [ ] Confirm double-spacing requirement (1.5 vs 2.0); regenerate if 2.0 is mandatory.
- [ ] Author contributions in initials (AA / YA), if preferred.
- [ ] Optional: abbreviations list (CoRe-3, FJS, MTMM).
- [ ] At revision/acceptance: export figures as separate files; reconsider table shading.
- [ ] Provide the real repository URL (currently withheld for anonymous review).
