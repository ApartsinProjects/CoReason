"""E6-VALIDITY: convergent/discriminant validity (multitrait-multimethod).

Answers the "dissociation is true by construction" objection without human labels:
  (1) Faithfulness: the same instrument returns LOW inter-skill correlation on the
      independent crossed design and HIGH inter-skill correlation on shared-ability
      learners (all three skills at one level), so it recovers the population's
      dependence structure rather than manufacturing dissociation.
  (2) Cross-method (cross-grader) convergent validity: the same skill graded by
      three backends (gpt-4o, gpt-4o-mini, Meta llama-3.3-70b) agrees per-learner.

Run:  python research/scripts/e6_validity.py
Reads research/results/e3_dissociation_grades{,_gpt4omini,_xvendor}.csv .
"""
import csv, statistics as st, itertools, os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RES = ROOT / "research/results"
G = {"A": 3, "B": 2, "C": 1}
SK = ["framing", "judging", "steering"]
load = lambda f: list(csv.DictReader(open(f, encoding="utf-8"))) if os.path.exists(f) else []
key = lambda r: (r["subject"], r["framing_level"], r["judging_level"], r["steering_level"])


def corr(xs, ys):
    mx, my = st.mean(xs), st.mean(ys)
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    dx = sum((x - mx) ** 2 for x in xs) ** 0.5
    dy = sum((y - my) ** 2 for y in ys) ** 0.5
    return num / (dx * dy) if dx and dy else float("nan")


def interskill(rows):
    return {f"{a[0].upper()}-{b[0].upper()}":
            corr([G[r[a + "_grade"]] for r in rows], [G[r[b + "_grade"]] for r in rows])
            for a, b in itertools.combinations(SK, 2)}


def main():
    main_g = load(RES / "e3_dissociation_grades.csv")
    mini = load(RES / "e3_dissociation_grades_gpt4omini.csv")
    llama = load(RES / "e3_dissociation_grades_xvendor.csv")

    # (1) faithfulness: discriminant (independent) vs convergent (shared ability)
    consistent = [r for r in main_g
                  if len({r["framing_level"], r["judging_level"], r["steering_level"]}) == 1]
    disc, conv = interskill(main_g), interskill(consistent)
    print("=== (1) Convergent vs discriminant (gpt-4o, N=%d) ===" % len(main_g))
    print("  DISCRIMINANT independent crossed: " +
          ", ".join(f"{k} {v:+.2f}" for k, v in disc.items()) +
          f"   mean|rho|={st.mean(abs(v) for v in disc.values()):.2f}")
    print("  CONVERGENT  shared-ability (n=%d): " % len(consistent) +
          ", ".join(f"{k} {v:+.2f}" for k, v in conv.items()) +
          f"   mean rho={st.mean(conv.values()):.2f}")

    # (2) cross-grader convergent validity on the shared 40 transcripts
    idx = lambda rows: {key(r): r for r in rows}
    im, il, ig = idx(mini), idx(llama), idx(main_g)
    keys = [k for k in im if k in il and k in ig]
    print("\n=== (2) Cross-grader agreement (gpt-4o / gpt-4o-mini / llama-3.3-70b), n=%d ===" % len(keys))
    for s in SK:
        gr = {"gpt4o": [G[ig[k][s + "_grade"]] for k in keys],
              "mini": [G[im[k][s + "_grade"]] for k in keys],
              "llama": [G[il[k][s + "_grade"]] for k in keys]}
        pairs = list(itertools.combinations(gr, 2))
        exact = st.mean(st.mean(1.0 if a == b else 0 for a, b in zip(gr[x], gr[y])) for x, y in pairs)
        rho = st.mean(corr(gr[x], gr[y]) for x, y in pairs)
        print(f"  {s:9}: exact-agreement={exact*100:.0f}%   mean pairwise rho={rho:+.2f}")


if __name__ == "__main__":
    main()
