"""Score LLM-judge vs human-rater agreement for the CoReasoning validation study.
Reads completed rater CSVs (human grades) + the master key (LLM grades), computes per skill:
  - pairwise Cohen's kappa (human-human, human-LLM)
  - Fleiss' kappa (all human raters)
  - Krippendorff's alpha (ordinal; the headline) with bootstrap CI
  - exact-agreement and adjacent (off-by-one is impossible on a 3-pt scale, so just exact)
No external deps beyond numpy. Usage:
  python score_agreement.py --key master_key.csv --raters rater_*.csv
"""
import argparse, glob, csv, itertools, json
import numpy as np

SKILLS = ["framing", "judging", "steering"]
ORD = {"A": 3, "B": 2, "C": 1}

def read_grades(path, col_prefix="grade_"):
    out = {}
    for r in csv.DictReader(open(path, encoding="utf-8")):
        iid = r["item_id"]
        out[iid] = {s: r.get(col_prefix + s, "").strip().upper() for s in SKILLS}
    return out

def cohen_kappa(a, b):
    """a,b: lists of categorical labels (paired)."""
    cats = sorted(set(a) | set(b))
    idx = {c: i for i, c in enumerate(cats)}
    n = len(a); k = len(cats)
    if n == 0 or k < 2: return float("nan")
    obs = sum(1 for x, y in zip(a, b) if x == y) / n
    ca = np.zeros(k); cb = np.zeros(k)
    for x in a: ca[idx[x]] += 1
    for y in b: cb[idx[y]] += 1
    exp = sum((ca[i]/n)*(cb[i]/n) for i in range(k))
    return (obs - exp) / (1 - exp) if exp < 1 else 1.0

def fleiss_kappa(matrix):
    """matrix: items x categories counts."""
    M = np.array(matrix, float)
    n_items, k = M.shape
    n_raters = M.sum(1)[0]
    if n_raters < 2: return float("nan")
    p = M.sum(0) / (n_items * n_raters)
    P = (((M**2).sum(1) - n_raters) / (n_raters*(n_raters-1)))
    Pbar = P.mean(); Pe = (p**2).sum()
    return (Pbar - Pe) / (1 - Pe) if Pe < 1 else 1.0

def krippendorff_alpha_ordinal(data):
    """data: list of {unit: value} per coder; values ordinal ints. Standard alpha with ordinal delta."""
    units = {}
    for coder in data:
        for u, v in coder.items():
            if v is None: continue
            units.setdefault(u, []).append(v)
    units = {u: vs for u, vs in units.items() if len(vs) >= 2}
    if not units: return float("nan")
    vals = sorted({v for vs in units.values() for v in vs})
    # ordinal metric: delta^2 between ranks weighted by marginal counts
    n_total = sum(len(vs) for vs in units.values())
    freq = {v: sum(vs.count(v) for vs in units.values()) for v in vals}
    cum = {}
    run = 0
    for v in vals:
        cum[v] = run + freq[v]/2.0
        run += freq[v]
    def d2(a, b):
        lo, hi = sorted((a, b))
        s = sum(freq[v] for v in vals if lo <= v <= hi)
        return (s - (freq[lo]+freq[hi])/2.0)**2
    Do = 0.0; npairs = 0
    for u, vs in units.items():
        m = len(vs)
        for a, b in itertools.permutations(vs, 2):
            Do += d2(a, b)
        npairs += m*(m-1)
    Do /= npairs
    De = 0.0
    allv = [v for vs in units.values() for v in vs]
    for a in allv:
        for b in allv:
            if a != b: De += d2(a, b)
    De /= (n_total*(n_total-1))
    return 1 - Do/De if De > 0 else float("nan")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--key", required=True, help="master_key.csv with LLM grades")
    ap.add_argument("--raters", nargs="+", required=True, help="completed rater CSVs (globs ok)")
    ap.add_argument("--boot", type=int, default=2000)
    args = ap.parse_args()

    rater_paths = [p for g in args.raters for p in glob.glob(g)]
    llm = read_grades(args.key, col_prefix="llm_grade_")
    raters = [read_grades(p) for p in rater_paths]
    items = sorted(set(llm) & set.intersection(*[set(r) for r in raters])) if raters else []
    print(f"Raters: {len(raters)} | shared items: {len(items)}\n")

    report = {}
    for s in SKILLS:
        print(f"=== {s.upper()} ===")
        # human-human pairwise Cohen
        hh = []
        for i, j in itertools.combinations(range(len(raters)), 2):
            a = [raters[i][it][s] for it in items]; b = [raters[j][it][s] for it in items]
            kp = cohen_kappa(a, b); hh.append(kp)
            print(f"  Cohen kappa rater{i+1}~rater{j+1}: {kp:+.3f}")
        # human-LLM
        hl = []
        for i in range(len(raters)):
            a = [raters[i][it][s] for it in items]; b = [llm[it][s] for it in items]
            kp = cohen_kappa(a, b); hl.append(kp)
            print(f"  Cohen kappa rater{i+1}~LLM:    {kp:+.3f}")
        # Fleiss among humans
        cats = ["A", "B", "C"]
        mat = [[sum(1 for r in raters if r[it][s] == c) for c in cats] for it in items]
        fk = fleiss_kappa(mat)
        # Krippendorff ordinal incl. LLM as a coder
        coders = [{it: ORD.get(r[it][s]) for it in items} for r in raters] + \
                 [{it: ORD.get(llm[it][s]) for it in items}]
        ka = krippendorff_alpha_ordinal(coders)
        # bootstrap CI for alpha
        boots = []
        rng = np.random.default_rng(0)
        for _ in range(args.boot):
            samp = list(rng.choice(items, len(items), replace=True))
            cb = [{it: ORD.get(r[it][s]) for it in samp} for r in raters] + \
                 [{it: ORD.get(llm[it][s]) for it in samp}]
            boots.append(krippendorff_alpha_ordinal(cb))
        lo, hi = np.nanpercentile(boots, [2.5, 97.5])
        print(f"  Fleiss kappa (humans):  {fk:+.3f}")
        print(f"  Krippendorff alpha (humans+LLM, ordinal): {ka:+.3f}  [95% CI {lo:+.3f}, {hi:+.3f}]")
        print(f"  mean human-LLM kappa: {np.nanmean(hl):+.3f} | mean human-human: {np.nanmean(hh):+.3f}\n")
        report[s] = {"cohen_hh": hh, "cohen_hl": hl, "fleiss": fk, "alpha": ka, "alpha_ci": [lo, hi]}

    json.dump(report, open("human-study/agreement_report.json", "w"), indent=2, default=float)
    print("Saved human-study/agreement_report.json")

if __name__ == "__main__":
    main()
