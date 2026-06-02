"""Score Task 2: human verification of the seeded Judging issues.

Reads human-study/responses/task2/rater_{A,B,C}_complete.csv (item_id +
is_genuine_flaw in {genuine, not_genuine, unclear}). Reports:
  - inter-rater agreement on the genuine/not judgment (Fleiss kappa, % agreement);
  - confirmation rate: among the seeded REAL issues, the fraction the human
    consensus marks genuine (the validity of the Judging ground truth);
  - false-flaw rate on the distractor controls (consensus genuine on a distractor).

Run:  python human-study/scripts/score_task2_issues.py
"""
import sys, json
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import _common as C

ROOT = HERE.parents[1]
RESP = ROOT / "human-study/responses/task2"
TRUTH = ROOT / "human-study/tasks/task2/_truth.json"


def main():
    files = {L: RESP / f"rater_{L}_complete.csv" for L in C.rater_letters(3)}
    present = {L: p for L, p in files.items() if p.exists()}
    if len(present) < 2:
        print(f"Need >=2 rater files in {RESP}. Found: {sorted(present)}.")
        print("Collect rater_A/B/C_complete.csv (item_id + is_genuine_flaw), then re-run.")
        return
    resp = {L: {r["item_id"]: r["is_genuine_flaw"].strip().lower() for r in C.read_csv(p)} for L, p in present.items()}
    items = sorted(set.intersection(*[set(d) for d in resp.values()]))
    truth = json.load(open(TRUTH, encoding="utf-8")) if TRUTH.exists() else {}

    cols = [[resp[L][it] for it in items] for L in sorted(present)]
    fk = C.fleiss_kappa(cols) if len(cols) >= 3 else C.cohen_kappa(cols[0], cols[1])
    pa = C.percent_agreement(cols)
    print(f"Raters: {sorted(present)} | items: {len(items)}")
    print(f"Inter-rater agreement on genuine/not: Fleiss k={fk:+.2f} ({C.interpret(fk)})  %agree={pa*100:.0f}\n")

    maj = {it: C.majority_vote([resp[L][it] for L in sorted(present)]) for it in items}
    real = [it for it in items if truth.get(it) == "genuine"]
    dist = [it for it in items if truth.get(it) == "not_genuine"]
    if real:
        conf = sum(maj[it] == "genuine" for it in real) / len(real)
        print(f"Seeded REAL issues confirmed genuine by consensus: {conf*100:.0f}%  (n={len(real)})")
        print("  -> this is the validity rate of the Judging ground truth.")
    if dist:
        fpr = sum(maj[it] == "genuine" for it in dist) / len(dist)
        print(f"Distractor controls wrongly marked genuine: {fpr*100:.0f}%  (n={len(dist)})")


if __name__ == "__main__":
    main()
