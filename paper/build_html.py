"""Build docs/index.html (GitHub Pages) from paper/coreasoning.md with KaTeX math.
Usage: python paper/build_html.py
"""
from pathlib import Path
import markdown

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "paper/coreasoning.md"
OUT = ROOT / "docs/index.html"
OUT.parent.mkdir(parents=True, exist_ok=True)

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CoReasoning: A Competency Model for Productive Work with Generative AI</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
  integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+" crossorigin="anonymous">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"
  integrity="sha384-7zkQWkzuo3B5mTepMUcHkMB5jZaolc2xDwL6VFqjFALcbeS9Ggm/Yr2r3Dy4lfFg" crossorigin="anonymous"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
  integrity="sha384-43gviWU0YVjaDtb/GhzOouOXtZMP/7XUzwPTstBeZFe/+rCMvRwr4yROQP43s0Xk" crossorigin="anonymous"
  onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false},{left:'\\\\(',right:'\\\\)',display:false},{left:'\\\\[',right:'\\\\]',display:true}]});"></script>
<style>
:root{--ink:#1a1a1a;--muted:#555;--accent:#2a5db0;--line:#e2e2e2;--bg:#fff;}
*{box-sizing:border-box}
body{font-family:Georgia,'Times New Roman',serif;color:var(--ink);background:var(--bg);
  max-width:820px;margin:0 auto;padding:3rem 1.5rem 6rem;line-height:1.62;font-size:18px}
h1{font-size:2.0rem;line-height:1.2;margin:0 0 .4rem}
.subtitle{color:var(--muted);font-style:italic;margin:0 0 1.2rem}
h2{font-size:1.4rem;margin:2.6rem 0 .8rem;padding-top:.6rem;border-top:1px solid var(--line)}
h3{font-size:1.13rem;margin:1.8rem 0 .5rem;color:#222}
p{margin:0 0 1rem;text-align:justify;hyphens:auto}
li{text-align:justify}
a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
code{font-family:'SF Mono',Consolas,monospace;font-size:.86em;background:#f4f4f4;padding:.1em .35em;border-radius:3px}
pre{background:#f7f7f7;border:1px solid var(--line);border-radius:6px;padding:1rem;overflow:auto;font-size:.85em}
pre code{background:none;padding:0}
table{border-collapse:collapse;width:100%;margin:1.2rem 0;font-size:.92rem}
th,td{border:1px solid var(--line);padding:.5rem .7rem;text-align:left;vertical-align:top}
th{background:#f3f6fb}
blockquote{border-left:3px solid var(--accent);margin:1rem 0;padding:.3rem 1rem;color:var(--muted)}
.banner{background:#fff8e6;border:1px solid #f0d98c;border-radius:6px;padding:.7rem 1rem;font-size:.9rem;color:#6a5400;margin:0 0 2rem}
.abstract{background:#f7f9fc;border:1px solid var(--line);border-radius:8px;padding:1.2rem 1.5rem;margin:1.5rem 0}
.abstract h2{border:none;margin:0 0 .5rem;padding:0;font-size:1.1rem}
hr{border:none;border-top:1px solid var(--line);margin:2rem 0}
img{max-width:100%;display:block;margin:1.6rem auto 0.4rem}
img[src$=".png"]{border:1px solid var(--line);border-radius:6px}
.docxlink{position:fixed;top:14px;right:16px;background:var(--accent);color:#fff;
  padding:.4rem .8rem;border-radius:6px;font-size:.8rem;font-family:Arial,sans-serif;
  text-decoration:none;box-shadow:0 1px 4px rgba(0,0,0,.2);z-index:100}
.docxlink:hover{text-decoration:none;background:#1e4a94}
@media print{
  .docxlink,.banner{display:none}
  body{max-width:none;font-size:11pt;padding:0;color:#000}
  @page{margin:2cm}
  h2,h3{break-after:avoid}
  img,table,figure{break-inside:avoid;page-break-inside:avoid}
  pre,blockquote{break-inside:avoid}
  .references p{break-inside:avoid}
  a{color:#000;text-decoration:none}
}
.authors{text-align:center;font-size:1.1rem;margin:.6rem 0 .2rem}
.affil{text-align:center;color:#666;font-size:.92rem;margin:.1rem 0}
.availability{text-align:center;font-size:.85rem;margin:.3rem 0 1.6rem}
.references{font-size:.86rem;line-height:1.5}
.references p{padding-left:2em;text-indent:-2em;margin:0 0 .55rem}
footer{margin-top:4rem;padding-top:1rem;border-top:1px solid var(--line);color:var(--muted);font-size:.85rem}
</style>
</head>
<body>
<a class="docxlink" href="https://github.com/ApartsinProjects/CoReason" style="right:140px;background:#24292f">&#9733; GitHub</a>
<a class="docxlink" href="coreasoning.docx" download>&#8595; Download .docx</a>
{body}
</body>
</html>
"""

def main():
    text = SRC.read_text(encoding="utf-8")
    html = markdown.markdown(text, extensions=["tables", "fenced_code", "toc", "sane_lists",
                                               "attr_list", "md_in_html"])
    # promote the first H1's following italic line to a subtitle look (handled by CSS via em)
    OUT.write_text(TEMPLATE.replace("{body}", html), encoding="utf-8")
    (OUT.parent / ".nojekyll").write_text("", encoding="utf-8")
    print(f"Wrote {OUT} ({len(html)} chars)")

if __name__ == "__main__":
    main()
