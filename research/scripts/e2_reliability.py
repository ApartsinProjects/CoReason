"""E2: grader test-retest reliability (addresses LLM-judge self-inconsistency).
Holds the learner transcript FIXED (cached sims + cached AI-update) and re-runs the
evaluation+grading prompts (08/09/10/11) N times per skill, measuring how often the
final A/B/C grade flips. Pre-empts the Rating-Roulette critique.

Run:  COREASON_GRADER=openai:gpt-4o python research/scripts/e2_reliability.py
"""
import sys, json, csv, statistics as st
from collections import Counter
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import harness
from harness import GMAP, ROOT
from e3_pilot import build_challenge, grade_one, SPECS

# re-grade on fixed inputs: bypass cache ONLY for the eval+grade prompts (sims, 03, 04 stay fixed)
harness.NO_CACHE_STEMS = {"08", "09", "10", "11"}

N = 5
PROFILES = {
    "all-strong":  {"framing": "expert", "judging": "expert", "steering": "expert"},
    "all-weak":    {"framing": "novice", "judging": "novice", "steering": "novice"},
    "SF/WJ":       {"framing": "expert", "judging": "novice", "steering": "novice"},
    "WF/SJ":       {"framing": "novice", "judging": "expert", "steering": "novice"},
}
SKILLS = ["framing", "judging", "steering"]
OUT = ROOT / "research/results"

def main():
    print("Building challenge (cached)...", flush=True)
    ch = build_challenge(SPECS[0])
    rows = []
    for pname, prof in PROFILES.items():
        reps = {s: [] for s in SKILLS}
        for r in range(N):
            g = grade_one(ch, prof)
            for s in SKILLS:
                reps[s].append(g[s + "_grade"])
            print(f"  {pname} rep{r+1}: F={g['framing_grade']} J={g['judging_grade']} S={g['steering_grade']}", flush=True)
        for s in SKILLS:
            seq = reps[s]
            mode, mcount = Counter(seq).most_common(1)[0]
            flip = 1 - mcount / len(seq)
            sd = st.pstdev([GMAP[x] for x in seq])
            rows.append({"profile": pname, "skill": s, "grades": "".join(seq),
                         "mode": mode, "flip_rate": round(flip, 2), "sd": round(sd, 2)})

    with open(OUT / "e2_reliability.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)

    print("\n=== GRADER TEST-RETEST RELIABILITY (N=%d per cell) ===" % N)
    print(f"{'skill':10} {'mean flip-rate':>15} {'mean SD(grade)':>15}")
    for s in SKILLS:
        fr = st.mean(r["flip_rate"] for r in rows if r["skill"] == s)
        sd = st.mean(r["sd"] for r in rows if r["skill"] == s)
        print(f"{s:10} {fr:>15.2f} {sd:>15.2f}")
    overall = st.mean(r["flip_rate"] for r in rows)
    print(f"\nOverall grade-flip rate: {overall:.2f}  (exact-agreement across repeats: {1-overall:.0%})")
    json.dump(rows, open(OUT / "e2_reliability.json", "w"), indent=2)
    print(f"Saved {OUT/'e2_reliability.csv'}")

if __name__ == "__main__":
    main()
