"""Camera-ready bibliography: cross-check in-text citations against references.bib,
report mismatches, and emit a formatted alphabetical reference list (Markdown).
"""
import re, sys
from pathlib import Path
import bibtexparser

ROOT = Path(__file__).resolve().parents[2]
BIB = ROOT / "paper/references.bib"
MD = ROOT / "paper/coreasoning.md"

db = bibtexparser.load(open(BIB, encoding="utf-8"))
entries = db.entries

_LATEX = {
    r"{\c{c}}": "ç", r"{\c c}": "ç", r"{\v{s}}": "š", r"{\v{z}}": "ž", r"{\v{c}}": "č",
    r"{\'e}": "é", r"{\'c}": "ć", r"{\'o}": "ó", r"{\'a}": "á", r"{\'\i}": "í",
    r'{\"a}': "ä", r'{\"o}': "ö", r'{\"u}': "ü", r'{\"e}': "ë",
    r"{\`e}": "è", r"{\`a}": "à", r"{\^o}": "ô", r"{\~n}": "ñ", r"{\ss}": "ß",
    r"{\o}": "ø", r"{\aa}": "å",
}
def _delatex(s):
    for k, v in _LATEX.items():
        s = s.replace(k, v)
    s = s.replace(r"\&", "&").replace(r"\%", "%").replace(r"\_", "_").replace(r"\$", "$")
    # strip corporate-author / capitalization braces, leftover backslash-accents
    s = re.sub(r"\\[a-zA-Z]+", "", s)
    return s.replace("{", "").replace("}", "")

def first_surname(author):
    # author field is "Surname, First and Surname2, First2 and ..."
    first = author.split(" and ")[0].strip()
    return first.split(",")[0].strip() if "," in first else first.split()[-1]

def authors_short(author):
    al = [a.strip() for a in author.split(" and ")]
    surnames = [a.split(",")[0].strip() if "," in a else a.split()[-1] for a in al]
    if len(surnames) == 1: return surnames[0]
    if len(surnames) == 2: return f"{surnames[0]} & {surnames[1]}"
    return f"{surnames[0]} et al."

def fmt_authors(author):
    al = [a.strip() for a in author.split(" and ")]
    out = []
    for a in al:
        if "," in a:
            sur, giv = a.split(",", 1)
            initials = " ".join(p[0] + "." for p in giv.split())
            out.append(f"{sur.strip()}, {initials}")
        else:
            out.append(a)
    if len(out) == 1: return out[0]
    return ", ".join(out[:-1]) + ", & " + out[-1]

# ---- cross-check ----
bib_by_key = {e["ID"]: e for e in entries}
bib_anchors = {}  # (surname_lower, year) -> key
for e in entries:
    if "author" in e and "year" in e:
        bib_anchors[(first_surname(e["author"]).lower(), e["year"])] = e["ID"]

text = MD.read_text(encoding="utf-8")
# strip the existing References block from citation scan
text_body = text.split("## References")[0]
# in-text patterns: "(Surname ..., YYYY)" and "Surname (YYYY)"
cites = set()
for m in re.finditer(r"\(([A-Z][A-Za-z'’-]+(?:\s+(?:&|and|et al\.)\s+[A-Za-z'’-]+)*),?\s*(\d{4})[a-z]?\)", text_body):
    cites.add((m.group(1), m.group(2)))
for m in re.finditer(r"\b([A-Z][A-Za-z'’-]+(?:\s+(?:&|and)\s+[A-Z][A-Za-z'’-]+)?(?:\s+et al\.)?)\s+\((\d{4})[a-z]?\)", text_body):
    cites.add((m.group(1), m.group(2)))

def cite_surname(c):
    return re.split(r"\s+(?:&|and|et al\.)", c.strip())[0].strip().lower()

missing = []
for name, yr in sorted(cites):
    sur = cite_surname(name)
    if (sur, yr) not in bib_anchors:
        # tolerate year off-by mismatch within same surname
        if not any(s == sur for (s, y) in bib_anchors):
            missing.append(f"{name}, {yr}")

cited_suryears = {(cite_surname(n), y) for n, y in cites}
uncited = [e["ID"] for e in entries
           if "author" in e and "year" in e
           and (first_surname(e["author"]).lower(), e["year"]) not in cited_suryears]

print(f"In-text citations found: {len(cites)}")
print(f"Bib entries: {len(entries)}")
print(f"\nIN-TEXT CITATIONS WITH NO BIB ENTRY ({len(missing)}):")
for m in missing: print("  -", m)
print(f"\nBIB ENTRIES NEVER CITED ({len(uncited)}):")
for u in uncited: print("  -", u)

# ---- render formatted alphabetical reference list ----
def render(e):
    a = fmt_authors(e.get("author", e.get("ID")))
    y = e.get("year", "n.d.")
    t = e.get("title", "").strip("{}")
    venue = e.get("journal") or e.get("booktitle") or e.get("howpublished") or e.get("institution") or e.get("publisher") or ""
    venue = venue.strip("{}")
    s = f"{a} ({y}). {t}."
    if venue: s += f" *{venue}*"
    if e.get("volume"):
        s += f", {e['volume']}"
        if e.get("number"): s += f"({e['number']})"
    if e.get("pages"): s += f", {e['pages'].replace('--','–')}"
    s += "."
    if e.get("doi"): s += f" https://doi.org/{e['doi']}"
    return _delatex(re.sub(r"\s+", " ", s).replace(" .", "."))

ordered = sorted(entries, key=lambda e: (first_surname(e.get("author", e["ID"])).lower(), e.get("year", "")))
out_lines = [render(e) for e in ordered]
(ROOT / "paper/_refs_rendered.md").write_text("\n\n".join(out_lines), encoding="utf-8")
print(f"\nWrote paper/_refs_rendered.md ({len(out_lines)} formatted refs)")

if __name__ == "__main__":
    pass
