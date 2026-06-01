"""E3 PILOT (make-or-break GATE): does the instrument discriminate learner competence?
Generates fresh challenges with full ground truth, then for 4 competence levels
(expert/proficient/novice/careless) produces controlled learner responses for
Framing/Judging/Steering, grades them blind via the production prompts, and checks
whether grades are monotone in competence. Saves COMPLETE data.
"""
import json, sys, csv, random, hashlib
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, str(Path(__file__).resolve().parent))
from harness import run_prompt, simulate_framing, simulate_steering, _chat, _extract_json, GMAP, ROOT

def stable_seed(*parts):
    h = hashlib.sha256("|".join(str(p) for p in parts).encode()).hexdigest()
    return int(h[:8], 16)

LEVELS = ["expert", "proficient", "novice", "careless"]
OUT = ROOT / "research/results"; OUT.mkdir(parents=True, exist_ok=True)

# Fresh challenge specs (domain spread, English for clean pilot)
SPECS = [
    {"course_name": "Algorithms", "subject_path": "Algorithms > Sorting & Searching"},
    {"course_name": "Microeconomics", "subject_path": "Microeconomics > Supply & Demand"},
    {"course_name": "Machine Learning", "subject_path": "ML > Model Evaluation & Overfitting"},
]

def gen_distractors(solution_text, n=4):
    """Plausible-but-FALSE issues (things actually fine) — for judging false-positive control."""
    raw = _chat(
        "You output valid JSON only, no fences.",
        f"Here is an AI solution:\n{solution_text}\n\nList {n} plausible-sounding but FALSE criticisms "
        f"someone might WRONGLY make about it (aspects that are actually fine). "
        f'Return JSON: {{"false_issues":[str,...]}}',
        0.7, 500, None)
    return _extract_json(raw).get("false_issues", [])[:n]

def build_challenge(spec):
    lang = "English"
    prob = run_prompt("01-generate-problem", {**spec, "language": lang})
    raw_problem = prob["problem_text"]; gaps = prob.get("internal_gaps", [])
    rubrics = run_prompt("02-generate-rubrics", {**spec, "language": lang})
    best = run_prompt("14-generate-best-framing", {
        **spec, "raw_problem": raw_problem,
        "framing_rubric": rubrics["framing_rubric"], "internal_gaps": gaps, "language": lang})
    # one fixed AI solution (from a neutral framing) -> ground-truth internal_issues
    sol = run_prompt("03-generate-ai-solution", {
        "raw_problem": raw_problem,
        "student_framing": json.dumps(best.get("refinement_sections", []), ensure_ascii=False),
        "subject_path": spec["subject_path"], "language": lang})
    issues = [i["issue"] if isinstance(i, dict) else str(i) for i in sol.get("internal_issues", [])]
    distractors = gen_distractors(sol["solution_text"])
    return {"spec": spec, "lang": lang, "raw_problem": raw_problem, "gaps": gaps,
            "rubrics": rubrics, "best_framing": best, "ai_solution": sol["solution_text"],
            "internal_issues": issues, "distractors": distractors}

def judging_selection(issues, distractors, level):
    """Programmatic competence-controlled issue selection (ground-truth anchored)."""
    n = len(issues)
    if level == "expert":      real, false = issues, []
    elif level == "proficient":real, false = issues[:max(1, round(0.7*n))], []
    elif level == "novice":    real, false = issues[:max(1, round(0.35*n))], distractors[:1]
    else:                      real, false = [], distractors[:2]   # careless / marks complete
    flagged = real + false
    return flagged, (real, false)

def remaining_after_steering(issues, level):
    n = len(issues)
    if level == "expert":      return []
    if level == "proficient":  return issues[max(1, round(0.7*n)):]
    if level == "novice":      return issues[max(1, round(0.4*n)):]
    return issues  # careless: nothing fixed

def grade_one(ch, level):
    spec, lang = ch["spec"], ch["lang"]
    rub = ch["rubrics"]; rp = ch["raw_problem"]
    seed = stable_seed(rp[:60], level)   # deterministic per (challenge, level)
    # ---- FRAMING ----
    fram = simulate_framing(rp, spec["subject_path"], level, lang, seed=seed)
    student_framing = json.dumps(fram.get("refinement_sections", []), ensure_ascii=False)
    fe = run_prompt("08-evaluate-framing", {
        "raw_problem": rp, "student_framing": student_framing, "response_type": "open_ended_sections",
        "framing_rubric": rub["framing_rubric"], "best_framing": ch["best_framing"], "language": lang})
    fg = run_prompt("11-grade", {"dimension": "Framing",
        "per_criterion_scores": fe.get("per_criterion_scores", []), "language": lang})
    # ---- JUDGING (programmatic) ----
    flagged, (real, false) = judging_selection(ch["internal_issues"], ch["distractors"], level)
    je = run_prompt("09-evaluate-judging", {
        "raw_problem": rp, "ai_outputs_per_cycle": [ch["ai_solution"]],
        "judging_responses_per_cycle": [{"flagged_issues": flagged}],
        "response_type": "open_ended_gaps",
        "known_issues_per_cycle": [ch["internal_issues"]],
        "judging_rubric": rub["judging_rubric"], "num_cycles": "1", "language": lang})
    jg = run_prompt("11-grade", {"dimension": "Judging",
        "per_criterion_scores": je.get("per_criterion_scores", []), "language": lang})
    # ---- STEERING ----
    steer = simulate_steering(rp, ch["ai_solution"], flagged, level, lang, seed=seed)
    cmds = steer.get("commands", [])
    # FAITHFUL steering: actually run the AI-update prompt on the student's commands; whatever
    # issues remain (per the model) become the ground truth for steering eval (removes circularity).
    upd = run_prompt("04-generate-ai-updated-output", {
        "raw_problem": rp, "student_framing": student_framing,
        "previous_output": ch["ai_solution"], "steering_history": "[]",
        "steering_command": cmds, "cycle_number": "1", "max_cycles": "3", "language": lang})
    rem = upd.get("internal_issues", [])
    ai_after = upd.get("updated_output", ch["ai_solution"])
    se = run_prompt("10-evaluate-steering", {
        "raw_problem": rp, "student_framing": student_framing,
        "ai_outputs_per_cycle": [ch["ai_solution"], ai_after],
        "steering_commands_per_cycle": [cmds],
        "judging_responses_per_cycle": [{"flagged_issues": flagged}],
        "response_type": "open_ended_instructions", "final_remaining_issues": rem,
        "steering_rubric": rub["steering_rubric"],
        "done_at_cycle": "1", "max_cycles": "3", "language": lang})
    sg = run_prompt("11-grade", {"dimension": "Steering",
        "per_criterion_scores": se.get("per_criterion_scores", []), "language": lang})
    return {"level": level,
            "framing_grade": fg["grade"], "judging_grade": jg["grade"], "steering_grade": sg["grade"],
            "framing_percrit": fe.get("per_criterion_scores", []),
            "judging_percrit": je.get("per_criterion_scores", []),
            "steering_percrit": se.get("per_criterion_scores", []),
            "judging_real_flagged": len(real), "judging_false_flagged": len(false),
            "judging_total_real": len(ch["internal_issues"]),
            "issues_missed": je.get("issues_missed", []), "false_positives": je.get("false_positives", []),
            "framing_text": student_framing[:500], "steering_cmds": cmds}

def main():
    print("Building challenges...")
    with ThreadPoolExecutor(max_workers=2) as ex:
        challenges = list(ex.map(build_challenge, SPECS))
    for i, ch in enumerate(challenges):
        print(f"  ch{i} [{ch['spec']['subject_path']}]: {len(ch['internal_issues'])} real issues, "
              f"{len(ch['distractors'])} distractors")

    rows = []
    full = []
    for i, ch in enumerate(challenges):
        print(f"Grading learners for ch{i}...")
        with ThreadPoolExecutor(max_workers=2) as ex:
            results = list(ex.map(lambda lv: grade_one(ch, lv), LEVELS))
        for r in results:
            rows.append({"challenge": i, "subject": ch["spec"]["subject_path"], **{
                k: r[k] for k in ("level","framing_grade","judging_grade","steering_grade",
                                  "judging_real_flagged","judging_false_flagged","judging_total_real")}})
            full.append({"challenge": i, **r})

    # save complete data
    json.dump({"challenges": [{k: v for k, v in c.items()} for c in challenges], "runs": full},
              open(OUT / "e3_pilot_complete.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    with open(OUT / "e3_pilot_grades.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)

    # discrimination summary
    print("\n=== GRADES BY LEVEL (numeric A=3,B=2,C=1) ===")
    print(f"{'level':12} {'Framing':>8} {'Judging':>8} {'Steering':>8}")
    import statistics as st
    lvlnum = {}
    for lv in LEVELS:
        fs = [GMAP[r["framing_grade"]] for r in rows if r["level"]==lv]
        js = [GMAP[r["judging_grade"]] for r in rows if r["level"]==lv]
        ss = [GMAP[r["steering_grade"]] for r in rows if r["level"]==lv]
        lvlnum[lv] = (st.mean(fs), st.mean(js), st.mean(ss))
        print(f"{lv:12} {st.mean(fs):>8.2f} {st.mean(js):>8.2f} {st.mean(ss):>8.2f}")
    # monotonicity check
    print("\nMonotone (expert>=prof>=novice>=careless)?")
    for si, skill in enumerate(["Framing","Judging","Steering"]):
        seq = [lvlnum[lv][si] for lv in LEVELS]
        mono = all(seq[k] >= seq[k+1] - 1e-9 for k in range(len(seq)-1))
        print(f"  {skill:9}: {[round(x,2) for x in seq]}  -> {'YES' if mono else 'NO'}  (range {seq[0]-seq[-1]:+.2f})")
    print(f"\nSaved {OUT/'e3_pilot_complete.json'} and e3_pilot_grades.csv")

if __name__ == "__main__":
    main()
