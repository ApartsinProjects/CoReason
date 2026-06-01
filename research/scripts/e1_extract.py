"""E1 extraction + data-quality profiling.
Extracts grade triples (framing per-run; judging/steering aggregated per-run from cycles)
and profiles response text quality to detect degenerate/test rows before any analysis.
"""
import sqlite3, json, re, statistics as st
from collections import Counter

DB = r"code/data/coreason-dev.sqlite3"
GMAP = {"A": 3, "B": 2, "C": 1}

def textof(resp_json):
    """Pull concatenated free-text out of a framing/judging/steering response JSON."""
    if not resp_json:
        return ""
    try:
        d = json.loads(resp_json)
    except Exception:
        return str(resp_json)
    parts = []
    if isinstance(d, dict):
        for sec in d.get("sections", []) or []:
            if isinstance(sec, dict):
                parts.append(str(sec.get("text", "")))
        # MC responses
        if "selected" in d: parts.append("MC:" + str(d.get("selected")))
        if "type" in d and not parts: parts.append("type=" + str(d.get("type")))
    return " ".join(p for p in parts if p).strip()

def main():
    db = sqlite3.connect(DB); c = db.cursor()
    runs = c.execute("""SELECT id, challenge_id, user_id, status, framing_response,
                        framing_grade, grades, current_cycle FROM challenge_runs""").fetchall()
    rows = []
    degenerate = 0
    framing_lens = []
    for rid, cid, uid, status, fresp, fgrade, grades_json, ccyc in runs:
        ftext = textof(fresp)
        framing_lens.append(len(ftext))
        if len(ftext) < 15 or ftext.lower() in ("need more text", "test", "asdf", ""):
            degenerate += 1
        # per-cycle judging/steering grades
        cyc = c.execute("""SELECT judging_grade, steering_grade, judging_response, steering_response
                           FROM challenge_run_cycles WHERE run_id=? ORDER BY cycle_num""", (rid,)).fetchall()
        jgrades = [r[0] for r in cyc if r[0] in GMAP]
        sgrades = [r[1] for r in cyc if r[1] in GMAP]
        # response-type detection (MC vs open-ended)
        rtype = "?"
        try:
            rtype = json.loads(fresp).get("type", "?") if fresp else "?"
        except Exception:
            pass
        rows.append({
            "run_id": rid, "challenge_id": cid, "user_id": uid, "status": status,
            "framing_grade": fgrade,
            "judging_grades": jgrades, "steering_grades": sgrades,
            "n_cycles": len(cyc), "framing_text_len": len(ftext),
            "framing_response_type": rtype,
        })
    db.close()

    # ---- profile ----
    print(f"Total runs: {len(rows)}")
    print(f"Completed: {sum(1 for r in rows if r['status']=='completed')}")
    print(f"Degenerate framing (<15 chars / test strings): {degenerate} ({degenerate/len(rows)*100:.0f}%)")
    print(f"Framing text length: median={st.median(framing_lens)}, mean={st.mean(framing_lens):.0f}, "
          f"max={max(framing_lens)}, p90={sorted(framing_lens)[int(0.9*len(framing_lens))]}")
    print(f"Response types: {Counter(r['framing_response_type'] for r in rows)}")
    print(f"framing_grade dist: {Counter(r['framing_grade'] for r in rows)}")

    # runs usable for construct validity: have all three grades present
    usable = []
    for r in rows:
        if r["framing_grade"] in GMAP and r["judging_grades"] and r["steering_grades"]:
            f = GMAP[r["framing_grade"]]
            j = st.mean(GMAP[g] for g in r["judging_grades"])   # mean across cycles
            s = st.mean(GMAP[g] for g in r["steering_grades"])
            usable.append({**r, "F": f, "J": j, "S": s})
    print(f"\nRuns usable for E1 (all 3 skills graded): {len(usable)}")
    print(f"  ...of which non-degenerate framing: {sum(1 for r in usable if r['framing_text_len']>=15)}")

    # dump
    import csv, os
    os.makedirs("research/data", exist_ok=True)
    with open("research/data/e1_grade_triples.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["run_id","challenge_id","user_id","status","framing_text_len",
                    "response_type","F","J","S","n_cycles"])
        for r in usable:
            w.writerow([r["run_id"], r["challenge_id"], r["user_id"], r["status"],
                        r["framing_text_len"], r["framing_response_type"],
                        r["F"], f"{r['J']:.3f}", f"{r['S']:.3f}", r["n_cycles"]])
    print(f"\nWrote research/data/e1_grade_triples.csv ({len(usable)} rows)")

if __name__ == "__main__":
    main()
