"""Score Task 1: per-skill human inter-rater agreement and human-vs-LLM agreement.

Reads human-study/responses/task1/rater_{A,B,C}_complete.csv (each: item_id +
framing_grade, judging_grade, steering_grade in {A,B,C}). Reports, per skill:
  - ordinal Krippendorff's alpha (primary), Fleiss' kappa, pairwise Cohen's kappa,
    and percent agreement across the 3 raters;
  - agreement of the human majority vote with the automated LLM grade (_truth.json):
    Cohen's kappa, ordinal alpha, and percent agreement.
Writes gold_labels.csv (human majority) and disagreements.csv.

Run:  python human-study/scripts/score_task1_grading.py
"""
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import _common as C
import json

ROOT = HERE.parents[1]
RESP = ROOT / "human-study/responses/task1"
TRUTH = ROOT / "human-study/tasks/task1/_truth.json"
SKILLS = ["framing", "judging", "steering"]


def main():
    files = {L: RESP / f"rater_{L}_complete.csv" for L in C.rater_letters(3)}
    present = {L: p for L, p in files.items() if p.exists()}
    if len(present) < 2:
        print(f"Need >=2 rater files in {RESP}. Found: {sorted(present)}.")
        print("Collect rater_A/B/C_complete.csv (item_id + the three *_grade columns), then re-run.")
        return
    resp = {L: {r["item_id"]: r for r in C.read_csv(p)} for L, p in present.items()}
    items = sorted(set.intersection(*[set(d) for d in resp.values()]))
    truth = json.load(open(TRUTH, encoding="utf-8")) if TRUTH.exists() else {}
    print(f"Raters: {sorted(present)} | overlapping items: {len(items)}\n")

    gold, disagree = [], []
    for sk in SKILLS:
        cols = [[resp[L][it][f"{sk}_grade"].strip().upper() for it in items] for L in sorted(present)]
        a = C.krippendorff_alpha_ordinal(cols)
        fk = C.fleiss_kappa(cols) if len(cols) >= 3 else float("nan")
        pair = {f"{x}-{y}": C.cohen_kappa(cols[i], cols[j])
                for (i, x), (j, y) in __import__("itertools").combinations(enumerate(sorted(present)), 2)}
        pa = C.percent_agreement(cols)
        print(f"[{sk}] alpha(ord)={a:+.2f} ({C.interpret(a)})  Fleiss k={fk:+.2f}  %agree={pa*100:.0f}")
        print("      pairwise Cohen k: " + ", ".join(f"{k}={v:+.2f}" for k, v in pair.items()))
        # human vs LLM
        maj = [C.majority_vote([resp[L][it][f"{sk}_grade"].strip().upper() for L in sorted(present)]) for it in items]
        if truth:
            llm = [truth[it][sk] for it in items]
            hv = C.cohen_kappa(maj, llm); ha = C.krippendorff_alpha_ordinal([maj, llm])
            hp = sum(m == l for m, l in zip(maj, llm)) / len(items)
            print(f"      human-majority vs LLM: Cohen k={hv:+.2f}  alpha={ha:+.2f}  %agree={hp*100:.0f}")
        for n, it in enumerate(items):
            gold.append({"item_id": it, f"{sk}_human": maj[n], f"{sk}_llm": truth.get(it, {}).get(sk, "")})
        print()
    # merge gold per item
    merged = {}
    for g in gold:
        merged.setdefault(g["item_id"], {"item_id": g["item_id"]}).update(g)
    C.write_csv(ROOT / "human-study/responses/task1/gold_labels.csv", list(merged.values()),
                ["item_id"] + [f"{s}_human" for s in SKILLS] + [f"{s}_llm" for s in SKILLS])
    print("Wrote gold_labels.csv (human majority vs LLM, per skill).")


if __name__ == "__main__":
    main()
