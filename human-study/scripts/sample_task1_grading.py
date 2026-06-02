"""Task 1 sampler: per-skill (Framing/Judging/Steering) human re-grading.

Joins the real learner transcripts (research/results/e3_dissociation_complete.json)
with the reconstructed challenge context (problem, rubric, AI output, seeded issues)
and emits, for each of 3 raters, a shuffled CSV with the rater-viewable context and
BLANK grade columns. Also writes a public manifest and a hidden _truth.json holding
the automated (LLM) grades for the human-vs-LLM comparison.

Run:  python human-study/scripts/sample_task1_grading.py [--n 40]
Reproducible (seed 42). Challenge reconstruction uses the deterministic LLM cache.
"""
import os, sys, json, argparse, html
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "research/scripts"))
os.environ.setdefault("COREASON_ENV_FILE", str(Path.home() / ".config/coreason/.env.all"))
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import _common as C

from e3_dissociation import SPECS          # the 5-subject challenge specs
from e3_pilot import build_challenge


import re


def flagged_real(internal_issues, issues_missed):
    missed = set(map(str, issues_missed or []))
    return [i for i in internal_issues if str(i) not in missed]


def render_framing(ft):
    """Render the learner's framing sections, tolerating truncated/malformed JSON in storage."""
    if not isinstance(ft, str):
        secs = ft
    else:
        try:
            secs = json.loads(ft)
        except Exception:
            pairs = re.findall(r'"section_type"\s*:\s*"([^"]*)".*?"content"\s*:\s*"((?:[^"\\]|\\.)*)"', ft)
            if pairs:
                return "\n".join(f"- {st}: {ct}" for st, ct in pairs)
            return ft.strip().lstrip("[").rstrip("]")
    return "\n".join(f"- {s.get('section_type','')}: {s.get('content','')}" for s in secs)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--n", type=int, default=40, help="number of transcripts to sample (default: all 40)")
    args = ap.parse_args()

    recs = json.load(open(ROOT / "research/results/e3_dissociation_complete.json", encoding="utf-8"))
    # reconstruct the 5 challenges (cached -> free, deterministic)
    print(f"Reconstructing {len(SPECS)} challenges from cache...", flush=True)
    ch_by_idx = {i: build_challenge(SPECS[i]) for i in range(len(SPECS))}

    items = []
    for r in recs:
        ci = r["challenge"]; ch = ch_by_idx[ci]
        rub = ch["rubrics"]
        fr = flagged_real(ch["internal_issues"], r.get("issues_missed", []))
        fp = r.get("false_positives", []) or []
        learner_framing = render_framing(r["framing_text"])
        profile = f"F{r['framing_level'][0]}-J{r['judging_level'][0]}-S{r['steering_level'][0]}"
        items.append({
            "item_id": f"T1-c{ci}-{profile}",
            "subject": r["subject"],
            "profile": profile,
            "problem": ch["raw_problem"],
            "ai_output": ch["ai_solution"],
            "seeded_issues": " | ".join(map(str, ch["internal_issues"])),
            "framing_rubric": rub["framing_rubric"],
            "learner_framing": learner_framing,
            "judging_rubric": rub["judging_rubric"],
            "learner_judging_flagged_real": " | ".join(map(str, fr)),
            "learner_judging_flagged_false": " | ".join(map(str, fp)) or "(none)",
            "steering_rubric": rub["steering_rubric"],
            "learner_steering": " | ".join(map(str, r.get("steering_cmds", []) or [])) or "(none)",
            # hidden truth (not written into rater files):
            "_llm_framing": r["framing_grade"], "_llm_judging": r["judging_grade"], "_llm_steering": r["steering_grade"],
        })

    # stratified by profile: round-robin across the 8 profiles up to n
    by_prof = {}
    for it in items:
        by_prof.setdefault(it["profile"], []).append(it)
    ordered = []
    while len(ordered) < min(args.n, len(items)):
        for p in sorted(by_prof):
            if by_prof[p]:
                ordered.append(by_prof[p].pop(0))
            if len(ordered) >= min(args.n, len(items)):
                break
    sample = ordered

    out = ROOT / "human-study/tasks/task1"
    # manifest (public) + truth (hidden)
    C.write_csv(out / "manifest.csv",
                [{"item_id": it["item_id"], "subject": it["subject"], "profile": it["profile"]} for it in sample],
                ["item_id", "subject", "profile"])
    C.write_json(out / "_truth.json",
                 {it["item_id"]: {"framing": it["_llm_framing"], "judging": it["_llm_judging"],
                                  "steering": it["_llm_steering"]} for it in sample})

    ctx_cols = ["item_id", "subject", "problem", "framing_rubric", "learner_framing", "framing_grade",
                "ai_output", "seeded_issues", "judging_rubric", "learner_judging_flagged_real",
                "learner_judging_flagged_false", "judging_grade",
                "steering_rubric", "learner_steering", "steering_grade"]
    for L in C.rater_letters(3):
        shuffled = C.deterministic_shuffle(sample, C.per_rater_seed(L))
        rows = [{**{k: it.get(k, "") for k in ctx_cols},
                 "framing_grade": "", "judging_grade": "", "steering_grade": ""} for it in shuffled]
        C.write_csv(out / f"rater_{L}.csv", rows, ctx_cols)
    print(f"Task 1: wrote {len(sample)} items x 3 raters -> {out}")
    print(f"  manifest.csv, _truth.json (hidden), rater_A/B/C.csv  (blank grade columns)")


if __name__ == "__main__":
    main()
