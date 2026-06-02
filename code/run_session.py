"""CoReasoning educator runner: score a REAL student's co-reasoning session.

This is the educator/researcher entry point to the released scoring engine (the same
sixteen prompts the CoReasoning Lab prototype used). It builds a challenge for any
subject, then scores a real student's Framing, Judging, and Steering responses with the
real evaluators (prompts 08/09/10) and grader (prompt 11), printing the three grades
with per-criterion, rubric-driven feedback. No web app required.

Three modes:
  --interactive            prompt the educator/student for each response at the console
  --responses STUDENT.json score responses supplied in a JSON file (batch / experimenting)
  --demo                   run a built-in strong example end-to-end (smoke test)

Examples:
  python code/run_session.py --subject "Algorithms > Sorting & Searching" --demo
  python code/run_session.py --subject "Microeconomics > Supply & Demand" --interactive
  python code/run_session.py --subject "Statistics > Hypothesis Testing" --responses student.json -o result.json

STUDENT.json format:
  {"framing": [{"section_type": "Assumptions", "content": "..."}, ...],
   "judging": ["a flaw the student found", "another flaw"],
   "steering": ["a correction command", "another command"]}

Requires API keys in ~/.config/coreason/.env.all (OPENAI_API_KEY and/or OPENROUTER_API_KEY).
"""
import os, sys, json, argparse, textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "research/scripts"))
os.environ.setdefault("COREASON_ENV_FILE", str(Path.home() / ".config/coreason/.env.all"))
from e3_pilot import build_challenge
from harness import run_prompt


def wrap(label, text, width=96):
    print(f"\n{'='*width}\n{label}\n{'-'*width}")
    print(textwrap.fill(str(text), width=width) if isinstance(text, str) else json.dumps(text, indent=2, ensure_ascii=False)[:4000])


def ask_sections(prompt):
    print(f"\n{prompt} (one section per line as 'TYPE: content'; blank line to finish):")
    secs = []
    while True:
        line = input("  > ").strip()
        if not line:
            break
        if ":" in line:
            t, c = line.split(":", 1); secs.append({"section_type": t.strip(), "content": c.strip()})
        else:
            secs.append({"section_type": "Note", "content": line})
    return secs


def ask_list(prompt):
    print(f"\n{prompt} (one per line; blank line to finish):")
    out = []
    while True:
        line = input("  > ").strip()
        if not line:
            break
        out.append(line)
    return out


DEMO = {
    "framing": [
        {"section_type": "Assumptions", "content": "Inputs may be unsorted and contain duplicates; data fits in memory."},
        {"section_type": "Constraints", "content": "Target average-case O(n log n); stable ordering is required for ties."},
        {"section_type": "Success metric", "content": "Correct on empty, single-element, all-equal, and reverse-sorted inputs."},
    ],
    "judging": ["The complexity claim ignores the worst case", "No handling of duplicate keys / stability",
                "Edge case of an empty input is not addressed"],
    "steering": ["Prioritize: first add explicit handling for empty and single-element inputs, with a test for each",
                 "State the worst-case complexity separately from the average case and justify it",
                 "Make the tie-breaking rule explicit so the sort is stable"],
}


def score_session(subject, resp, lang="en"):
    course = subject.split(">")[0].strip() or "General"
    spec = {"course_name": course, "subject_path": subject}
    print(f"Building challenge for: {subject} ...", flush=True)
    ch = build_challenge(spec)
    rub, rp = ch["rubrics"], ch["raw_problem"]
    wrap("PHASE 1 - The ill-defined problem (shown to the student)", rp)

    # ---- Framing ----
    student_framing = json.dumps(resp["framing"], ensure_ascii=False)
    wrap("Student FRAMING", resp["framing"])
    fe = run_prompt("08-evaluate-framing", {"raw_problem": rp, "student_framing": student_framing,
        "response_type": "open_ended_sections", "framing_rubric": rub["framing_rubric"],
        "best_framing": ch["best_framing"], "language": lang})
    fg = run_prompt("11-grade", {"dimension": "Framing",
        "per_criterion_scores": fe.get("per_criterion_scores", []), "language": lang})

    wrap("PHASE 2 - The deliberately-flawed AI solution (the student must judge and steer)", ch["ai_solution"])

    # ---- Judging ----
    wrap("Student JUDGING (flaws flagged)", resp["judging"])
    je = run_prompt("09-evaluate-judging", {"raw_problem": rp, "ai_outputs_per_cycle": [ch["ai_solution"]],
        "judging_responses_per_cycle": [{"flagged_issues": resp["judging"]}], "response_type": "open_ended_gaps",
        "known_issues_per_cycle": [ch["internal_issues"]], "judging_rubric": rub["judging_rubric"],
        "num_cycles": "1", "language": lang})
    jg = run_prompt("11-grade", {"dimension": "Judging",
        "per_criterion_scores": je.get("per_criterion_scores", []), "language": lang})

    # ---- Steering ----
    wrap("Student STEERING (correction commands)", resp["steering"])
    try:
        upd = run_prompt("04-generate-ai-updated-output", {"raw_problem": rp, "student_framing": student_framing,
            "previous_output": ch["ai_solution"], "steering_history": "[]", "steering_command": resp["steering"],
            "cycle_number": "1", "max_cycles": "3", "language": lang}, max_tokens=3500)
        rem, ai_after = upd.get("internal_issues", ch["internal_issues"]), upd.get("updated_output", ch["ai_solution"])
    except Exception:
        rem, ai_after = ch["internal_issues"], ch["ai_solution"]
    se = run_prompt("10-evaluate-steering", {"raw_problem": rp, "student_framing": student_framing,
        "ai_outputs_per_cycle": [ch["ai_solution"], ai_after], "steering_commands_per_cycle": [resp["steering"]],
        "judging_responses_per_cycle": [{"flagged_issues": resp["judging"]}], "response_type": "open_ended_instructions",
        "final_remaining_issues": rem, "steering_rubric": rub["steering_rubric"],
        "done_at_cycle": "1", "max_cycles": "3", "language": lang})
    sg = run_prompt("11-grade", {"dimension": "Steering",
        "per_criterion_scores": se.get("per_criterion_scores", []), "language": lang})

    return {"subject": subject,
            "framing": {"grade": fg["grade"], "feedback": fe.get("per_criterion_scores", [])},
            "judging": {"grade": jg["grade"], "feedback": je.get("per_criterion_scores", []),
                        "issues_missed": je.get("issues_missed", []), "false_positives": je.get("false_positives", [])},
            "steering": {"grade": sg["grade"], "feedback": se.get("per_criterion_scores", [])}}


def print_report(r):
    W = 96
    print(f"\n{'#'*W}\nCoReasoning per-skill report  ({r['subject']})\n{'#'*W}")
    for sk in ("framing", "judging", "steering"):
        print(f"\n{sk.upper():9}  GRADE: {r[sk]['grade']}")
        for c in r[sk]["feedback"]:
            name = c.get("criterion_name", c.get("criterion", "?")); sc = c.get("score", "?")
            note = c.get("feedback", c.get("internal_note", ""))
            print(f"   - {name} [{sc}]: {textwrap.shorten(str(note), 140)}")
    print(f"\nThree independent grades:  Framing={r['framing']['grade']}  "
          f"Judging={r['judging']['grade']}  Steering={r['steering']['grade']}\n")


def main():
    ap = argparse.ArgumentParser(description="Score a real student's CoReasoning session.")
    ap.add_argument("--subject", default="Algorithms > Sorting & Searching", help='e.g. "Statistics > Hypothesis Testing"')
    g = ap.add_mutually_exclusive_group()
    g.add_argument("--demo", action="store_true", help="run a built-in strong example end-to-end")
    g.add_argument("--interactive", action="store_true", help="prompt for the student's responses")
    g.add_argument("--responses", help="path to a STUDENT.json with framing/judging/steering")
    ap.add_argument("-o", "--out", help="write the JSON report to this path")
    args = ap.parse_args()

    if args.responses:
        resp = json.load(open(args.responses, encoding="utf-8"))
    elif args.interactive:
        resp = {"framing": ask_sections("Enter the student's FRAMING"),
                "judging": ask_list("Enter the flaws the student FLAGGED in the AI output"),
                "steering": ask_list("Enter the student's STEERING commands")}
    else:
        resp = DEMO
        print("(demo mode: scoring a built-in strong example)")
    for k in ("framing", "judging", "steering"):
        resp.setdefault(k, [])

    report = score_session(args.subject, resp)
    print_report(report)
    if args.out:
        json.dump(report, open(args.out, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        print(f"Saved report -> {args.out}")


if __name__ == "__main__":
    main()
