"""Expand-N: run the crossed dissociation on 5 NEW subjects (40 new learners), then
pool with the original 40 to report N=80 effects + bootstrap CIs. Reuses the harness.
Run:  COREASON_GRADER=openai:gpt-4o python research/scripts/e3_expand.py
"""
import json, sys, csv, itertools, statistics as st
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, str(Path(__file__).resolve().parent))
from e3_pilot import build_challenge, grade_one
from harness import GMAP, ROOT
import numpy as np

OUT = ROOT / "research/results"
STRONG, WEAK = "expert", "novice"
SKILLS = ["framing", "judging", "steering"]
NEW_SPECS = [
    {"course_name": "Operating Systems", "subject_path": "Operating Systems > CPU Scheduling"},
    {"course_name": "Calculus", "subject_path": "Calculus > Constrained Optimization"},
    {"course_name": "Organic Chemistry", "subject_path": "Organic Chemistry > Reaction Mechanisms"},
    {"course_name": "Linguistics", "subject_path": "Linguistics > Syntactic Parsing"},
    {"course_name": "Corporate Finance", "subject_path": "Corporate Finance > Capital Budgeting"},
]
PROFILES = [dict(zip(SKILLS, c)) for c in itertools.product([STRONG, WEAK], repeat=3)]

def num(g): return GMAP[g]
def own_effect(rs, sk):
    s=[num(r[sk+"_grade"]) for r in rs if r[sk+"_level"]==STRONG]
    w=[num(r[sk+"_grade"]) for r in rs if r[sk+"_level"]==WEAK]
    return (st.mean(s)-st.mean(w)) if s and w else float("nan")
def cross_effect(rs, graded, manip):
    s=[num(r[graded+"_grade"]) for r in rs if r[manip+"_level"]==STRONG]
    w=[num(r[graded+"_grade"]) for r in rs if r[manip+"_level"]==WEAK]
    return (st.mean(s)-st.mean(w)) if s and w else float("nan")

def main():
    print("Building 5 new challenges...", flush=True)
    with ThreadPoolExecutor(max_workers=3) as ex:
        chs = list(ex.map(build_challenge, NEW_SPECS))
    jobs = [(i, p) for i in range(len(chs)) for p in PROFILES]
    print(f"{len(jobs)} new learners", flush=True)
    rows = []
    with ThreadPoolExecutor(max_workers=4) as ex:
        for k, r in enumerate(ex.map(lambda j: {"challenge": 100+j[0],
                "subject": chs[j[0]]["spec"]["subject_path"], **grade_one(chs[j[0]], j[1])}, jobs)):
            rows.append(r)
            print(f"  [{k+1}/{len(jobs)}] {r['subject'][:22]} "
                  f"F:{r['framing_level'][:1]}->{r['framing_grade']} "
                  f"J:{r['judging_level'][:1]}->{r['judging_grade']} "
                  f"S:{r['steering_level'][:1]}->{r['steering_grade']}", flush=True)
    fields=["challenge","subject","framing_level","judging_level","steering_level",
            "framing_grade","judging_grade","steering_grade"]
    with open(OUT/"e3_dissociation_grades_expand.csv","w",newline="",encoding="utf-8") as fh:
        w=csv.DictWriter(fh,fieldnames=fields,extrasaction="ignore"); w.writeheader(); w.writerows(rows)

    # pool with original 40
    orig=list(csv.DictReader(open(OUT/"e3_dissociation_grades.csv",encoding="utf-8")))
    pooled=orig+rows
    print(f"\n=== POOLED N={len(pooled)} (orig {len(orig)} + new {len(rows)}) ===")
    rng=np.random.default_rng(0)
    print(f"{'skill':9} {'own-effect':>12} {'95% CI':>20} {'max cross':>10}")
    for sk in SKILLS:
        boots=[own_effect([pooled[i] for i in rng.integers(0,len(pooled),len(pooled))], sk) for _ in range(2000)]
        lo,hi=np.nanpercentile(boots,[2.5,97.5])
        maxc=max(abs(cross_effect(pooled,sk,m)) for m in SKILLS if m!=sk)
        print(f"{sk:9} {own_effect(pooled,sk):>12.2f}  [{lo:+.2f}, {hi:+.2f}]   {maxc:>10.2f}")
    json.dump({"N":len(pooled),
               "own":{s:own_effect(pooled,s) for s in SKILLS}},
              open(OUT/"e3_expand_pooled.json","w"),indent=2)
    print(f"Saved pooled analysis (N={len(pooled)})")

if __name__=="__main__":
    main()
