"""E7-MTMM: full Campbell-Fiske multitrait-multimethod analysis of the LLM grader.

Traits  = Framing, Judging, Steering.
Methods = three grader backends (gpt-4o, gpt-4o-mini, Meta llama-3.3-70b) on the SAME
40 transcripts. Builds the trait x method correlation matrix and reports the four
Campbell-Fiske comparisons plus a halo check (heterotrait-monomethod = does one grader
rate all three skills alike?). No human data.

Run:  python research/scripts/e7_mtmm.py
"""
import csv, statistics as st, itertools, os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RES = ROOT / "research/results"
G = {"A": 3, "B": 2, "C": 1}
TRAITS = ["framing", "judging", "steering"]
METHODS = {"gpt4o": "e3_dissociation_grades.csv",
           "mini": "e3_dissociation_grades_gpt4omini.csv",
           "llama": "e3_dissociation_grades_xvendor.csv"}
key = lambda r: (r["subject"], r["framing_level"], r["judging_level"], r["steering_level"])
load = lambda f: list(csv.DictReader(open(RES / f, encoding="utf-8")))


def corr(xs, ys):
    mx, my = st.mean(xs), st.mean(ys)
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    dx = sum((x - mx) ** 2 for x in xs) ** 0.5
    dy = sum((y - my) ** 2 for y in ys) ** 0.5
    return num / (dx * dy) if dx and dy else float("nan")


def main():
    idx = {m: {key(r): r for r in load(f)} for m, f in METHODS.items()}
    keys = sorted(set.intersection(*[set(d) for d in idx.values()]))
    print(f"Methods: {list(METHODS)} | shared transcripts n={len(keys)}\n")

    # value vector for each (trait, method)
    vec = {(t, m): [G[idx[m][k][t + "_grade"]] for k in keys] for t in TRAITS for m in METHODS}
    cells = list(itertools.product(TRAITS, METHODS))

    # classify every off-diagonal correlation
    convergent, het_mono, het_het = [], [], []   # Campbell-Fiske blocks
    for (t1, m1), (t2, m2) in itertools.combinations(cells, 2):
        r = corr(vec[(t1, m1)], vec[(t2, m2)])
        if t1 == t2 and m1 != m2:      convergent.append(r)   # same trait, diff method (validity)
        elif t1 != t2 and m1 == m2:    het_mono.append(r)     # diff trait, same method (HALO)
        elif t1 != t2 and m1 != m2:    het_het.append(r)      # diff trait, diff method

    mc, mhm, mhh = st.mean(convergent), st.mean(het_mono), st.mean(het_het)
    print("=== Campbell-Fiske summary ===")
    print(f"  Convergent  (monotrait-heteromethod, same skill across graders): mean r = {mc:+.2f}  n={len(convergent)}")
    print(f"  Halo        (heterotrait-monomethod, diff skills within a grader): mean r = {mhm:+.2f}  n={len(het_mono)}")
    print(f"  Hetero-hetero (diff skill, diff grader)                          : mean r = {mhh:+.2f}  n={len(het_het)}")
    print("\n=== Criteria ===")
    print(f"  C1 convergent > 0                          : {'PASS' if mc > 0 else 'FAIL'} ({mc:+.2f})")
    print(f"  C2 convergent > heterotrait-heteromethod   : {'PASS' if mc > mhh else 'FAIL'} ({mc:+.2f} > {mhh:+.2f})")
    print(f"  C3 convergent > heterotrait-monomethod (no halo): {'PASS' if mc > mhm else 'FAIL'} ({mc:+.2f} > {mhm:+.2f})")

    # per-grader halo (heterotrait-monomethod within each method)
    print("\n=== Per-grader halo (mean |r| between different skills, within one grader) ===")
    for m in METHODS:
        rs = [abs(corr(vec[(a, m)], vec[(b, m)])) for a, b in itertools.combinations(TRAITS, 2)]
        print(f"  {m:7}: mean |r| across skills = {st.mean(rs):.2f}  (low = no halo)")

    # convergent per skill (already the headline)
    print("\n=== Convergent per skill (same skill across 3 graders) ===")
    for t in TRAITS:
        rs = [corr(vec[(t, a)], vec[(t, b)]) for a, b in itertools.combinations(METHODS, 2)]
        print(f"  {t:9}: mean r = {st.mean(rs):+.2f}")


if __name__ == "__main__":
    main()
