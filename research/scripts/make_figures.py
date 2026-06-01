"""Generate paper figures from the dissociation experiment data.
Outputs PNG (for docx) + SVG (for crisp HTML) into docs/assets/.
"""
import csv, statistics as st
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
CSV = ROOT / "research/results/e3_dissociation_grades.csv"
OUT = ROOT / "docs/assets"; OUT.mkdir(parents=True, exist_ok=True)
GMAP = {"A": 3, "B": 2, "C": 1}
SKILLS = ["framing", "judging", "steering"]
STRONG, WEAK = "expert", "novice"
BLUE, GREY = "#2a5db0", "#bbbbbb"

rows = list(csv.DictReader(open(CSV, encoding="utf-8")))
def num(g): return GMAP[g]

# ---- effect matrix: effect of manipulating `manip` on grade of `graded` ----
eff = np.zeros((3, 3))
for gi, graded in enumerate(SKILLS):
    for mi, manip in enumerate(SKILLS):
        s = [num(r[graded+"_grade"]) for r in rows if r[manip+"_level"] == STRONG]
        w = [num(r[graded+"_grade"]) for r in rows if r[manip+"_level"] == WEAK]
        eff[gi, mi] = st.mean(s) - st.mean(w)

# Figure 1: effect heatmap (own-effect diagonal should dominate)
fig, ax = plt.subplots(figsize=(5.0, 4.2))
im = ax.imshow(eff, cmap="RdBu_r", vmin=-2, vmax=2)
ax.set_xticks(range(3)); ax.set_xticklabels([s.capitalize()+"\nlevel" for s in SKILLS])
ax.set_yticks(range(3)); ax.set_yticklabels([s.capitalize()+"\ngrade" for s in SKILLS])
for i in range(3):
    for j in range(3):
        ax.text(j, i, f"{eff[i,j]:+.2f}", ha="center", va="center",
                color="white" if abs(eff[i,j])>1.1 else "black", fontsize=12, fontweight="bold")
ax.set_title("Effect of manipulating each skill's competence\non each skill's grade (A=3..C=1)", fontsize=10)
fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04, label="grade Δ (strong − weak)")
plt.tight_layout()
plt.savefig(OUT/"fig_dissociation_heatmap.png", dpi=160)
plt.savefig(OUT/"fig_dissociation_heatmap.svg")
plt.close()

# Figure 2: designed-contrast grade profiles
contrasts = [
    ("Strong framer /\nweak judge", {"framing":STRONG,"judging":WEAK,"steering":WEAK}),
    ("Weak framer /\nstrong judge", {"framing":WEAK,"judging":STRONG,"steering":WEAK}),
    ("Weak / weak /\nstrong steerer", {"framing":WEAK,"judging":WEAK,"steering":STRONG}),
    ("All strong", {"framing":STRONG,"judging":STRONG,"steering":STRONG}),
    ("All weak", {"framing":WEAK,"judging":WEAK,"steering":WEAK}),
]
prof = []
for name, p in contrasts:
    sel = [r for r in rows if all(r[s+"_level"]==p[s] for s in SKILLS)]
    prof.append([st.mean(num(r[s+"_grade"]) for r in sel) for s in SKILLS])
prof = np.array(prof)
fig, ax = plt.subplots(figsize=(7.2, 4.0))
x = np.arange(len(contrasts)); w = 0.25
colors = ["#2a5db0", "#e07b39", "#3a9d6f"]
for k, s in enumerate(SKILLS):
    ax.bar(x + (k-1)*w, prof[:, k], w, label=s.capitalize(), color=colors[k])
ax.set_xticks(x); ax.set_xticklabels([c[0] for c in contrasts], fontsize=8)
ax.set_ylabel("mean grade (A=3, B=2, C=1)"); ax.set_ylim(0, 3.3)
ax.set_yticks([1,2,3]); ax.set_yticklabels(["C","B","A"])
ax.set_title("Per-skill grades dissociate by competence profile", fontsize=11)
ax.legend(loc="upper right", fontsize=9, ncol=3)
ax.axhline(2, color="#eee", zorder=0)
plt.tight_layout()
plt.savefig(OUT/"fig_contrasts.png", dpi=160)
plt.savefig(OUT/"fig_contrasts.svg")
plt.close()

# numbers for the paper
diag = np.mean(np.diag(eff))
off = np.mean(eff[~np.eye(3, dtype=bool)])
print(f"N={len(rows)} learners")
print(f"effect matrix (rows=grade, cols=manip):\n{np.round(eff,2)}")
print(f"diagonal(own)={diag:+.2f}  offdiag(cross)={off:+.2f}  ratio={diag/abs(off):.1f}")
print("Saved fig_dissociation_heatmap + fig_contrasts (png+svg)")
