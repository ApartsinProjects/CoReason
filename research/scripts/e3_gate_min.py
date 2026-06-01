"""Minimal synchronous discrimination gate: 1 challenge, expert vs careless, verbose.
Fast yes/no on whether the instrument separates competence, no threads, no hang risk.
"""
import sys, time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from e3_pilot import build_challenge, grade_one, SPECS
from harness import GMAP

def main():
    t0 = time.time()
    print("Building 1 challenge (cached)...", flush=True)
    ch = build_challenge(SPECS[0])
    print(f"  built [{ch['spec']['subject_path']}] {len(ch['internal_issues'])} issues "
          f"({time.time()-t0:.0f}s)", flush=True)
    for level in ("expert", "careless"):
        t = time.time()
        r = grade_one(ch, level)
        print(f"  {level:9}: F={r['framing_grade']} J={r['judging_grade']} S={r['steering_grade']}  "
              f"(judge real_flagged={r['judging_real_flagged']}/{r['judging_total_real']} "
              f"false={r['judging_false_flagged']})  [{time.time()-t:.0f}s]", flush=True)

if __name__ == "__main__":
    main()
