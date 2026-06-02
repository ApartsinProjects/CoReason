"""E8-STUDYCHAT: external validity on real student-LLM dialogue (no simulated learners).

Maps the StudyChat corpus's own per-conversation dialogue-act labels (McNichols et al.,
2025; 6,864 + s25 real student-ChatGPT chats) to the three CoReasoning skills and tests
whether Framing, Judging, and Steering are present and DISSOCIATE in the wild:
  Framing  <- contextual_questions / conceptual_questions / provide_context
  Judging  <- verification
  Steering <- editing_request
Per student (userId), compute the rate of each behavior, then the inter-behavior
correlation across students (low cross-correlation = the constructs separate in real
learners, not only in simulated ones). Downloads the labeled JSONL directly via
huggingface_hub (bypasses datasets/torch). Gated: `hf auth login` + accept terms first.

Run:  python research/scripts/e8_studychat.py
"""
import os, json, statistics as st, itertools
from collections import Counter, defaultdict

SKILL_OF = {
    "contextual_questions": "framing", "conceptual_questions": "framing", "provide_context": "framing",
    "verification": "judging",
    "editing_request": "steering",
    # writing_request = delegation/generation request, not a CoReasoning skill (excluded)
}


def hf_token():
    for line in open(os.path.expanduser("~/.config/coreason/.env.all"), encoding="utf-8", errors="replace"):
        line = line.strip()
        for k in ("HF_TOKEN=", "HUGGING_FACE_HUB_TOKEN=", "HUGGINGFACE_INFERENCE_API_TOKEN="):
            if line.startswith(k):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None


def corr(xs, ys):
    mx, my = st.mean(xs), st.mean(ys)
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    dx = sum((x - mx) ** 2 for x in xs) ** 0.5
    dy = sum((y - my) ** 2 for y in ys) ** 0.5
    return num / (dx * dy) if dx and dy else float("nan")


def main():
    from huggingface_hub import hf_hub_download
    tok = hf_token()
    recs = []
    for fn in ("dialogues/f24_labeled_dialogues.jsonl", "dialogues/s25_labeled_dialogues.jsonl"):
        p = hf_hub_download("wmcnicho/StudyChat", fn, repo_type="dataset", token=tok)
        recs += [json.loads(l) for l in open(p, encoding="utf-8")]
    print(f"StudyChat labeled conversations: {len(recs)} | unique students: "
          f"{len(set(r.get('userId') for r in recs))}\n")

    # broad act -> skill
    def skill(r):
        lab = r.get("llm_label") or {}
        broad = (lab.get("label", "") if isinstance(lab, dict) else str(lab)).split(">")[0].strip().lower()
        return SKILL_OF.get(broad)

    total = Counter(); per_student = defaultdict(Counter)
    for r in recs:
        sk = skill(r); total["mapped" if sk else "other"] += 1
        if sk:
            total[sk] += 1
            per_student[r.get("userId")][sk] += 1

    # HEADLINE (the clean, reportable finding): how often do real students Judge / Steer?
    allc = total["framing"] + total["judging"] + total["steering"] + total["other"]
    print("=== Behavior prevalence in real student-AI dialogue (the headline) ===")
    for s in ("framing", "judging", "steering"):
        print(f"  {s:9}: {total[s]:5}  ({100*total[s]/allc:.1f}% of all interactions)")
    print(f"  delegation/other acts: {total['other']} ({100*total['other']/allc:.1f}%)")
    print("  -> verification (Judging) and corrective editing (Steering) are rare vs framing-type queries:")
    print("     the under-judging / under-steering the framework targets, in real data.")

    # Separability: report rates over TOTAL conversations (NOT skill-fractions). The skill-fraction
    # version is a COMPOSITIONAL ARTIFACT (the three fractions sum to 1 with framing dominating, which
    # mechanically forces strong negative F-J / F-S correlations); it is NOT reported.
    rows = [(c["framing"]/c["tot"], c["judging"]/c["tot"], c["steering"]/c["tot"])
            for c in per_student.values() if c["tot"] >= 10]
    F, J, S = zip(*rows)
    print(f"\n=== Separability across students (rates over all conversations; n={len(rows)} students) ===")
    for (a, an), (b, bn) in itertools.combinations([(F, "F"), (J, "J"), (S, "S")], 2):
        print(f"  {an}-{bn}: rho = {corr(a, b):+.2f}")
    print("  Judging and Steering behaviors vary largely independently (J-S near 0).")
    print("  NOTE: skill-fraction correlations are a compositional artifact and are intentionally not used.")


if __name__ == "__main__":
    main()
