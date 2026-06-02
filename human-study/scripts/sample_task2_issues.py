"""Task 2 sampler: human verification of the machine-seeded Judging issues.

The Judging construct is scored against machine-seeded "ground-truth" issues. This
task asks 3 experts whether each seeded issue is a genuine flaw in the AI output.
Real seeded issues and an equal number of distractors are mixed and shuffled; the
hidden _truth.json records which were intended real vs distractor. Scoring reports
(a) inter-rater agreement on the genuine/not judgment and (b) the rate at which the
seeded real issues are confirmed genuine (the validity of the Judging ground truth).

Run:  python human-study/scripts/sample_task2_issues.py
Reproducible (seed 42). Uses the deterministic LLM cache for challenge reconstruction.
"""
import os, sys, json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "research/scripts"))
os.environ.setdefault("COREASON_ENV_FILE", str(Path.home() / ".config/coreason/.env.all"))
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import _common as C
from e3_dissociation import SPECS
from e3_pilot import build_challenge


def main():
    print(f"Reconstructing {len(SPECS)} challenges from cache...", flush=True)
    items = []
    for ci in range(len(SPECS)):
        ch = build_challenge(SPECS[ci])
        ctx = {"problem": ch["raw_problem"], "ai_output": ch["ai_solution"]}
        for j, iss in enumerate(ch["internal_issues"]):
            items.append({"item_id": f"T2-c{ci}-real{j}", "kind": "real", "issue": str(iss), **ctx,
                          "_intended": "genuine"})
        # equal number of distractors as a control
        for j, dis in enumerate((ch.get("distractors") or [])[:len(ch["internal_issues"])]):
            items.append({"item_id": f"T2-c{ci}-dist{j}", "kind": "distractor", "issue": str(dis), **ctx,
                          "_intended": "not_genuine"})

    out = ROOT / "human-study/tasks/task2"
    C.write_csv(out / "manifest.csv",
                [{"item_id": it["item_id"], "kind": it["kind"]} for it in items],
                ["item_id", "kind"])
    C.write_json(out / "_truth.json", {it["item_id"]: it["_intended"] for it in items})

    cols = ["item_id", "problem", "ai_output", "issue", "is_genuine_flaw"]  # rater fills is_genuine_flaw
    for L in C.rater_letters(3):
        shuffled = C.deterministic_shuffle(items, C.per_rater_seed(L, salt=2))
        rows = [{"item_id": it["item_id"], "problem": it["problem"], "ai_output": it["ai_output"],
                 "issue": it["issue"], "is_genuine_flaw": ""} for it in shuffled]
        C.write_csv(out / f"rater_{L}.csv", rows, cols)
    n_real = sum(it["kind"] == "real" for it in items)
    print(f"Task 2: wrote {len(items)} items ({n_real} real + {len(items)-n_real} distractors) x 3 raters -> {out}")
    print("  rater marks is_genuine_flaw in {genuine, not_genuine, unclear}")


if __name__ == "__main__":
    main()
