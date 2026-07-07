#!/usr/bin/env bash
# Build the ETHE submission deliverables: HTML pages + DOCX files.
#   docs/index.html            <- coreasoning.md (identified, with download links)
#   docs/cover-letter.html     <- cover-letter.md
#   docs/supplementary.html    <- supplementary.md
#   docs/coreasoning.docx      <- identified manuscript
#   docs/coreasoning-blinded.docx <- anonymized manuscript (for double-anonymous submission)
#   docs/supplementary.docx    <- supplementary material
#   docs/cover-letter.docx     <- cover letter
# Usage: bash paper/build_ethe.sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILL="${HTML2DOC_SKILL:-/c/Users/apart/.claude/skills/html2doc}"
PY="${PYEXE:-/c/Python314/python}"
cd "$ROOT"

MTITLE="CoRe-3: A Competency Model for Reasoning With Generative AI in Higher Education"

# ---- HTML pages (web) ----
$PY paper/build_html.py --src paper/coreasoning.md          --out docs/index.html         --title "$MTITLE"
$PY paper/build_html.py --src paper/cover-letter.md         --out docs/cover-letter.html   --title "Cover letter" --plain
$PY paper/build_html.py --src paper/supplementary.md        --out docs/supplementary.html  --title "Supplementary Material" --plain
# transient link-free HTML for the DOCX builds (the download-links sidebar must not leak into Word)
$PY paper/build_html.py --src paper/coreasoning.md          --out docs/_ms.html            --title "$MTITLE" --plain
$PY paper/build_html.py --src paper/coreasoning-blinded.md  --out docs/_blinded.html       --title "Anonymized manuscript" --plain

# ---- DOCX via html2doc (KaTeX->MathML +SVG raster, ->OMML, ->academic style) ----
cd "$ROOT/docs"
conv () { # $1 = input html, $2 = output docx, $3 = profile (default camera-ready-generic), $4 = font (default Georgia)
  P="${3:-camera-ready-generic}"; F="${4:-Georgia}"
  NODE_PATH="$SKILL/node_modules" node "$SKILL/scripts/katex_to_mathml.js" --input "$1" --output _m.html
  $PY "$SKILL/scripts/convert_to_docx.py"      --input _m.html --output _c.docx --profile "$P"
  $PY "$SKILL/scripts/apply_academic_style.py" --input _c.docx --output "$2" --profile "$P" --font-family "$F"
  rm -f _m.html _c.docx
}
conv _ms.html           coreasoning.docx
# the anonymized manuscript is the submission file: ETHE review format -> review-manuscript
# profile (Times New Roman 12 pt, double-spaced, line + page numbered).
conv _blinded.html      coreasoning-blinded.docx review-manuscript "Times New Roman"
conv supplementary.html supplementary.docx
# The cover letter is a letter, not a paper: the academic styler would treat it as
# all-front-matter. Convert the Markdown straight to a clean Word doc via pandoc.
$PY -c "import pypandoc; pypandoc.convert_file('../paper/cover-letter.md','docx',outputfile='cover-letter.docx')"
rm -f _blinded.html _ms.html

# ETHE tables must not use colour/shading -> strip header fill from the submitted files
# (headers stay distinguished by bold + the booktabs rules). Keep the identified
# coreasoning.docx shaded (it is the web/records copy, not the submission).
$PY - coreasoning-blinded.docx supplementary.docx <<'PYX'
import sys, docx
from docx.oxml.ns import qn
for f in sys.argv[1:]:
    d = docx.Document(f); n = 0
    for t in d.tables:
        for row in t.rows:
            for c in row.cells:
                tcPr = c._tc.tcPr
                if tcPr is not None:
                    for shd in tcPr.findall(qn('w:shd')):
                        tcPr.remove(shd); n += 1
    d.save(f); print(f"  stripped {n} shaded cells from {f}")
PYX

echo "Built: index.html, cover-letter.html, supplementary.html + 4 DOCX deliverables."
