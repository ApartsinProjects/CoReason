"""E8-STUDYCHAT: external validity on real student-LLM dialogue (no simulated learners).

Scores the StudyChat corpus (McNichols et al., 2025; 16,851 real student-ChatGPT turns)
for the three CoReasoning behaviors, to test whether Framing, Judging, and Steering are
detectable and SEPARABLE in the wild, outside our controlled challenge format.

Two analyses:
  (A) Label-based (no API): map StudyChat's own dialogue-act labels to the three skills
      (questioning -> Framing, verification -> Judging, editing -> Steering), then, per
      student, compute the rate of each behavior and the inter-behavior correlation across
      students. Low cross-behavior correlation = the constructs dissociate in real learners.
  (B) Instrument-based (optional, uses the evaluators): sample gradeable Framing/Steering
      turns and score them with prompts 08/10 to show the instrument generalizes to real text.

The dataset is GATED (CC BY 4.0): accept the terms at
https://huggingface.co/datasets/wmcnicho/StudyChat and `huggingface-cli login` first.

Run:  python research/scripts/e8_studychat.py [--n 400] [--instrument]
"""
import sys, argparse, statistics as st, itertools
from collections import Counter

# label -> skill mapping (StudyChat two-level dialogue-act scheme; broad categories)
SKILL_OF = {
    "contextual questions": "framing", "conceptual questions": "framing", "context": "framing",
    "verification": "judging",
    "editing": "steering", "writing": "steering",
}


def map_label(lbl):
    if not lbl:
        return None
    s = str(lbl).strip().lower()
    for key, sk in SKILL_OF.items():
        if key in s:
            return sk
    return None


def load_studychat():
    try:
        from datasets import load_dataset
    except ImportError:
        sys.exit("pip install datasets")
    try:
        return load_dataset("wmcnicho/StudyChat")
    except Exception as e:
        sys.exit("Could not load wmcnicho/StudyChat (gated dataset).\n"
                 "  1) Accept terms: https://huggingface.co/datasets/wmcnicho/StudyChat\n"
                 "  2) huggingface-cli login (set HF token)\n"
                 f"  raw error: {type(e).__name__}: {str(e)[:160]}")


def corr(xs, ys):
    mx, my = st.mean(xs), st.mean(ys)
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    dx = sum((x - mx) ** 2 for x in xs) ** 0.5
    dy = sum((y - my) ** 2 for y in ys) ** 0.5
    return num / (dx * dy) if dx and dy else float("nan")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--n", type=int, default=400, help="conversations to sample")
    ap.add_argument("--instrument", action="store_true", help="also score sample turns with prompts 08/10")
    args = ap.parse_args()

    ds = load_studychat()
    split = ds[list(ds.keys())[0]]
    rows = list(split.select(range(min(args.n, len(split)))))
    print(f"StudyChat: scoring {len(rows)} conversations for Framing/Judging/Steering behaviors\n")

    # (A) per-student behavior rates from dialogue-act labels
    per_student = []   # (f_rate, j_rate, s_rate)
    total = Counter()
    for r in rows:
        msgs = r.get("messages") or []
        labs = []
        for m in msgs:
            if (m.get("role") == "user"):
                lab = m.get("llm_label") or {}
                sk = map_label(lab.get("label") if isinstance(lab, dict) else lab)
                if sk:
                    labs.append(sk); total[sk] += 1
        if len(labs) >= 3:
            c = Counter(labs); n = len(labs)
            per_student.append((c["framing"] / n, c["judging"] / n, c["steering"] / n))

    print(f"=== (A) Behavior prevalence (turns mapped): {dict(total)} ===")
    if per_student:
        F, J, S = zip(*per_student)
        print(f"  students with >=3 labeled turns: {len(per_student)}")
        print(f"  mean per-student rate  Framing={st.mean(F):.2f}  Judging={st.mean(J):.2f}  Steering={st.mean(S):.2f}")
        print("  inter-behavior correlation across students (low = dissociation in the wild):")
        for (a, an), (b, bn) in itertools.combinations([(F, 'F'), (J, 'J'), (S, 'S')], 2):
            print(f"    {an}-{bn}: rho = {corr(a, b):+.2f}")
    else:
        print("  no conversations had >=3 mappable labeled turns; check the label field name in the schema.")

    if args.instrument:
        print("\n=== (B) instrument scoring of sample turns: see run_session.py evaluators (08/10) ===")
        print("  (wire sampled Framing/Steering turns through harness.run_prompt as in code/run_session.py)")


if __name__ == "__main__":
    main()
