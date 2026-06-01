"""E3-DISSOCIATION: the experiment that supports P3 (the three skills are separable).
Uses CROSSED per-skill competence profiles (full 2^3 factorial: each of Framing/Judging/
Steering independently strong or weak). If each grade tracks its OWN skill's level and is
~flat in the OTHER skills' levels, the constructs dissociate (refutes a single-competence-factor
account). Includes the designed contrast personas the reviewer asked for (e.g. strong-framer/
weak-judge). Grade with gpt-4o; simulate with gpt-4o-mini (different models -> no self-grading).

Run:  COREASON_GRADER=openai:gpt-4o python research/scripts/e3_dissociation.py
"""
import os, json, sys, csv, itertools, statistics as st
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, str(Path(__file__).resolve().parent))
from e3_pilot import build_challenge, grade_one
from harness import GMAP, ROOT, _provider_use

OUT = ROOT / "research/results"; OUT.mkdir(parents=True, exist_ok=True)
TAG = os.environ.get("COREASON_TAG", "")  # output suffix for grader-robustness runs
STRONG, WEAK = "expert", "novice"          # per-skill levels
SKILLS = ["framing", "judging", "steering"]

SPECS = [
    {"course_name": "Algorithms", "subject_path": "Algorithms > Sorting & Searching"},
    {"course_name": "Microeconomics", "subject_path": "Microeconomics > Supply & Demand"},
    {"course_name": "Machine Learning", "subject_path": "ML > Model Evaluation & Overfitting"},
    {"course_name": "Databases", "subject_path": "Databases > Indexing & Query Optimization"},
    {"course_name": "Statistics", "subject_path": "Statistics > Hypothesis Testing"},
]

def main():
    n_ch = int(sys.argv[1]) if len(sys.argv) > 1 else len(SPECS)
    specs = SPECS[:n_ch]
    print(f"Building {len(specs)} challenges...", flush=True)
    with ThreadPoolExecutor(max_workers=3) as ex:
        challenges = list(ex.map(build_challenge, specs))
    for i, ch in enumerate(challenges):
        print(f"  ch{i} [{ch['spec']['subject_path']}] {len(ch['internal_issues'])} issues", flush=True)

    profiles = [dict(zip(SKILLS, combo)) for combo in itertools.product([STRONG, WEAK], repeat=3)]
    jobs = [(i, p) for i in range(len(challenges)) for p in profiles]
    print(f"\n{len(profiles)} profiles x {len(challenges)} challenges = {len(jobs)} learners", flush=True)

    def run_job(job):
        i, p = job
        r = grade_one(challenges[i], p)
        return {"challenge": i, "subject": challenges[i]["spec"]["subject_path"], **r}

    rows = []
    with ThreadPoolExecutor(max_workers=4) as ex:
        for k, r in enumerate(ex.map(run_job, jobs)):
            rows.append(r)
            print(f"  [{k+1}/{len(jobs)}] ch{r['challenge']} "
                  f"F:{r['framing_level'][:1]}->{r['framing_grade']} "
                  f"J:{r['judging_level'][:1]}->{r['judging_grade']} "
                  f"S:{r['steering_level'][:1]}->{r['steering_grade']}", flush=True)

    # save
    fields = ["challenge","subject","framing_level","judging_level","steering_level",
              "framing_grade","judging_grade","steering_grade",
              "judging_real_flagged","judging_false_flagged","judging_total_real"]
    with open(OUT / f"e3_dissociation_grades{TAG}.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=fields, extrasaction="ignore"); w.writeheader(); w.writerows(rows)
    json.dump(rows, open(OUT / f"e3_dissociation_complete{TAG}.json", "w", encoding="utf-8"),
              ensure_ascii=False, indent=2, default=str)

    # ---- dissociation analysis: own-effect vs cross-effects ----
    def num(g): return GMAP.get(g)
    print("\n=== OWN-EFFECT vs CROSS-EFFECTS (grade delta strong-minus-weak, A=3..C=1) ===")
    print(f"{'grade of':10} | {'F-level':>8} {'J-level':>8} {'S-level':>8}")
    eff = {}
    for graded in SKILLS:
        line = {}
        for manip in SKILLS:
            strong = [num(r[graded+"_grade"]) for r in rows if r[manip+"_level"]==STRONG]
            weak   = [num(r[graded+"_grade"]) for r in rows if r[manip+"_level"]==WEAK]
            line[manip] = (st.mean(strong) - st.mean(weak)) if strong and weak else float("nan")
        eff[graded] = line
        print(f"{graded:10} | " + " ".join(f"{line[m]:+8.2f}" for m in SKILLS) +
              ("   <- own-effect should dominate the diagonal" if graded=='framing' else ""))
    diag = st.mean(eff[s][s] for s in SKILLS)
    offdiag = st.mean(eff[g][m] for g in SKILLS for m in SKILLS if g!=m)
    print(f"\nmean DIAGONAL (own-skill) effect : {diag:+.2f}")
    print(f"mean OFF-DIAGONAL (cross) effect : {offdiag:+.2f}")
    print(f"DISSOCIATION RATIO (diag/|offdiag|): {diag/abs(offdiag) if offdiag else float('inf'):.1f}"
          "   (>>1 = skills separable)")

    # designed contrast personas
    print("\n=== DESIGNED CONTRASTS (mean grade profile) ===")
    for name, p in [("strong-framer/weak-judge", {"framing":STRONG,"judging":WEAK,"steering":WEAK}),
                    ("weak-framer/strong-judge", {"framing":WEAK,"judging":STRONG,"steering":WEAK}),
                    ("weak-framer/weak-judge/strong-steer", {"framing":WEAK,"judging":WEAK,"steering":STRONG})]:
        sel = [r for r in rows if all(r[s+"_level"]==p[s] for s in SKILLS)]
        if sel:
            print(f"  {name:38}: F={st.mean(num(r['framing_grade']) for r in sel):.2f} "
                  f"J={st.mean(num(r['judging_grade']) for r in sel):.2f} "
                  f"S={st.mean(num(r['steering_grade']) for r in sel):.2f}")
    print(f"\ngrader provider mix: {dict(_provider_use)}")
    print(f"Saved {OUT/'e3_dissociation_grades.csv'}")

if __name__ == "__main__":
    main()
