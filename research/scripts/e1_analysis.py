"""E1 construct validity: are Framing/Judging/Steering statistically separable?
Runs on E3-generated controlled grade data. Computes:
  - per-skill grade distributions
  - inter-skill correlations (Spearman, since grades are ordinal A/B/C)
  - exploratory factor analysis (1-factor vs 3-factor fit; sklearn FactorAnalysis)
  - within-level variance (do skills dissociate even at fixed competence?)
Dissociation (low inter-skill r, >1 meaningful factor) = headline.
Collapse (high r, 1 dominant factor) = weakens the tri-skill novelty claim.
"""
import sys, csv, json
from pathlib import Path
import numpy as np
from scipy.stats import spearmanr
from sklearn.decomposition import FactorAnalysis

GMAP = {"A": 3, "B": 2, "C": 1}
CSV = sys.argv[1] if len(sys.argv) > 1 else "research/results/e3_full_grades.csv"

def load(path):
    rows = list(csv.DictReader(open(path, encoding="utf-8")))
    F = np.array([GMAP[r["framing_grade"]] for r in rows], float)
    J = np.array([GMAP[r["judging_grade"]] for r in rows], float)
    S = np.array([GMAP[r["steering_grade"]] for r in rows], float)
    levels = [r.get("level", "") for r in rows]
    return rows, F, J, S, levels

def main():
    rows, F, J, S, levels = load(CSV)
    X = np.column_stack([F, J, S])
    names = ["Framing", "Judging", "Steering"]
    print(f"N = {len(rows)} runs from {CSV}\n")

    print("Grade means (A=3,B=2,C=1):", {n: round(float(x.mean()), 2) for n, x in zip(names, [F, J, S])})
    print("Grade stds:             ", {n: round(float(x.std()), 2) for n, x in zip(names, [F, J, S])})

    print("\n--- Inter-skill Spearman correlations ---")
    for i in range(3):
        for j in range(i + 1, 3):
            r, p = spearmanr(X[:, i], X[:, j])
            print(f"  {names[i]:9} ~ {names[j]:9}: rho={r:+.3f}  p={p:.3g}")

    # within-level dissociation: at a FIXED competence level, do the 3 skills still vary independently?
    print("\n--- Within-level mean grade (dissociation across skills at fixed competence) ---")
    for lv in ["expert", "proficient", "novice", "careless"]:
        idx = [k for k, l in enumerate(levels) if l == lv]
        if idx:
            print(f"  {lv:11}: F={F[idx].mean():.2f} J={J[idx].mean():.2f} S={S[idx].mean():.2f}")

    # Factor analysis: compare 1-factor vs 2-factor log-likelihood
    print("\n--- Exploratory factor analysis (sklearn) ---")
    Xz = (X - X.mean(0)) / (X.std(0) + 1e-9)
    for nf in (1, 2):
        if nf < X.shape[1]:
            fa = FactorAnalysis(n_components=nf, random_state=0).fit(Xz)
            ll = fa.score(Xz)
            print(f"  {nf}-factor: avg log-likelihood = {ll:.3f}")
            if nf == 1:
                load1 = fa.components_[0]
                print(f"    1-factor loadings: " +
                      ", ".join(f"{n}={l:+.2f}" for n, l in zip(names, load1)))
    # proportion of variance explained by 1st principal factor
    C = np.corrcoef(X.T)
    eig = np.sort(np.linalg.eigvalsh(C))[::-1]
    print(f"  Correlation-matrix eigenvalues: {[round(float(e),2) for e in eig]}")
    print(f"  Variance in 1st factor: {eig[0]/eig.sum()*100:.0f}%  (3 separable skills => well below 100%)")

    json.dump({"N": len(rows), "means": {n: float(x.mean()) for n, x in zip(names, [F, J, S])},
               "eigenvalues": [float(e) for e in eig],
               "var_factor1_pct": float(eig[0] / eig.sum() * 100)},
              open("research/results/e1_construct_validity.json", "w"), indent=2)
    print("\nSaved research/results/e1_construct_validity.json")

if __name__ == "__main__":
    main()
