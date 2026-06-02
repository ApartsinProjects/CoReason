"""Shared helpers for the CoReasoning 3-rater agreement study (stdlib only).

Stats: percent agreement, Cohen's kappa (pairwise), Fleiss' kappa (3+ raters),
ordinal Krippendorff's alpha (the primary metric for the A/B/C ordinal grades).
"""
import csv, json, random
from pathlib import Path
from collections import Counter
from itertools import combinations

GRADES = ["A", "B", "C"]
GNUM = {"A": 3, "B": 2, "C": 1}
SEED = 42


def rater_letters(n):
    return [chr(ord("A") + i) for i in range(n)]


def per_rater_seed(letter, salt=0):
    return SEED + ord(letter) + 1009 * salt


def deterministic_shuffle(items, seed):
    out = list(items)
    random.Random(seed).shuffle(out)
    return out


def read_csv(path):
    with open(path, encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def write_csv(path, rows, fields):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=fields, extrasaction="ignore")
        w.writeheader(); w.writerows(rows)


def write_json(path, data):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    json.dump(data, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)


def majority_vote(values):
    c = Counter(values)
    top = max(c.values())
    return sorted(k for k, v in c.items() if v == top)[0]


def percent_agreement(cols):
    """cols: list of equal-length rater label lists. Mean fraction of rater pairs that agree per item."""
    n = len(cols[0]); pairs = list(combinations(range(len(cols)), 2))
    return sum(sum(cols[i][k] == cols[j][k] for i, j in pairs) / len(pairs) for k in range(n)) / n


def cohen_kappa(a, b):
    labels = sorted(set(a) | set(b)); n = len(a)
    po = sum(x == y for x, y in zip(a, b)) / n
    pe = sum((a.count(l) / n) * (b.count(l) / n) for l in labels)
    return (po - pe) / (1 - pe) if pe < 1 else 1.0


def fleiss_kappa(cols):
    """cols: list of R rater label lists (same items, all raters). Returns Fleiss' kappa."""
    R = len(cols); n = len(cols[0]); cats = sorted({l for c in cols for l in c})
    P = []
    for k in range(n):
        counts = Counter(cols[r][k] for r in range(R))
        P.append((sum(v * v for v in counts.values()) - R) / (R * (R - 1)))
    Pbar = sum(P) / n
    pj = {c: sum(cols[r][k] == c for r in range(R) for k in range(n)) / (R * n) for c in cats}
    Pe = sum(v * v for v in pj.values())
    return (Pbar - Pe) / (1 - Pe) if Pe < 1 else 1.0


def krippendorff_alpha_ordinal(cols):
    """Ordinal Krippendorff's alpha. cols: list of rater label lists (A/B/C), missing allowed as None."""
    vals = {"A": 3, "B": 2, "C": 1}
    R = len(cols); n = len(cols[0])
    # ordinal metric: squared difference of cumulative ranks
    order = [1, 2, 3]
    def delta(a, b):
        lo, hi = sorted((a, b))
        s = sum(c for c in order if lo <= c <= hi)
        return (s - (a + a) / 2.0) ** 2 if False else (s - lo / 2.0 - hi / 2.0) ** 2
    units = []
    for k in range(n):
        vs = [vals[cols[r][k]] for r in range(R) if cols[r][k] in vals]
        if len(vs) >= 2:
            units.append(vs)
    Do = 0.0; npairs = 0
    for vs in units:
        for a, b in combinations(vs, 2):
            Do += delta(a, b); npairs += 1
    Do /= npairs
    allv = [v for vs in units for v in vs]
    De = 0.0; m = len(allv)
    for a, b in combinations(allv, 2):
        De += delta(a, b)
    De /= (m * (m - 1) / 2)
    return 1 - Do / De if De else 1.0


def interpret(k):
    if k < 0: return "poor (below chance)"
    if k < 0.20: return "slight"
    if k < 0.40: return "fair"
    if k < 0.60: return "moderate"
    if k < 0.80: return "substantial"
    return "almost perfect"
