#!/usr/bin/env bash
# Build docs/coreasoning.docx from docs/index.html via the html2doc skill.
# Strips the on-page "Download .docx" button so it does NOT appear in the Word file.
# Usage: bash paper/build_docx.sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILL="${HTML2DOC_SKILL:-/c/Users/apart/.claude/skills/html2doc}"
cd "$ROOT/docs"

# 1. strip the floating download button (web-only chrome) from a working copy
python -c "import re,io; h=open('index.html',encoding='utf-8').read(); open('_for_docx.html','w',encoding='utf-8').write(re.sub(r'<a class=\"docxlink\".*?</a>\s*','',h,flags=re.S))"

# 2. html2doc pipeline: KaTeX -> MathML -> DOCX (native OMML) -> academic styling
NODE_PATH="$SKILL/node_modules" node "$SKILL/scripts/katex_to_mathml.js" --input _for_docx.html --output _mathml.html
python "$SKILL/scripts/convert_to_docx.py"   --input _mathml.html   --output _converted.docx --profile camera-ready-generic
python "$SKILL/scripts/apply_academic_style.py" --input _converted.docx --output coreasoning.docx --profile camera-ready-generic

rm -f _for_docx.html _mathml.html _converted.docx
echo "Built docs/coreasoning.docx (download button stripped, native Word equations)"
