#!/usr/bin/env bash
# Build docs/coreasoning.docx from docs/index.html via the html2doc skill.
# The skill (>= commit 61f6479) automatically: strips the web-only "Download .docx"
# button (it is an <a download> link), rasterizes the SVG figures so they embed,
# and resolves figure paths against docs/. No paper-specific pre-processing needed.
# Usage: bash paper/build_docx.sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILL="${HTML2DOC_SKILL:-/c/Users/apart/.claude/skills/html2doc}"
cd "$ROOT/docs"

# html2doc pipeline: KaTeX -> MathML (+chrome-strip +SVG rasterize) -> DOCX (OMML) -> styling
NODE_PATH="$SKILL/node_modules" node "$SKILL/scripts/katex_to_mathml.js" --input index.html --output _mathml.html
python "$SKILL/scripts/convert_to_docx.py"      --input _mathml.html   --output _converted.docx --profile camera-ready-generic
python "$SKILL/scripts/apply_academic_style.py" --input _converted.docx --output coreasoning.docx --profile camera-ready-generic

rm -f _mathml.html _converted.docx
echo "Built docs/coreasoning.docx (download button stripped, SVG figures embedded, native Word equations)"
