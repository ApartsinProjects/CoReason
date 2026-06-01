"""Minimal OpenAI Batch API utility for CoReasoning experiments.
Batches are 50% cheaper and ideal for bulk grading (E2 reliability = re-grade each
transcript N times). OpenAI-only, so used as an INDEPENDENT cross-model grader
(gpt-4o-mini) to test grader-model robustness; the deployed-engine grader stays llama.

Usage as a library:
    from batch_openai import submit_batch, wait_and_fetch
    reqs = [{"custom_id": "r1", "system": "...", "user": "...", "temperature": 0.2,
             "max_tokens": 200, "json_mode": True}, ...]
    bid = submit_batch(reqs, model="gpt-4o-mini")
    results = wait_and_fetch(bid)   # {custom_id: parsed_or_text}
"""
import sys, json, time, io
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from harness import _openai, _extract_json, ROOT

BATCH_DIR = ROOT / "research/data/batches"
BATCH_DIR.mkdir(parents=True, exist_ok=True)

def _line(req, model):
    body = {"model": model,
            "messages": [{"role": "system", "content": req["system"]},
                         {"role": "user", "content": req["user"]}],
            "temperature": req.get("temperature", 0.2),
            "max_tokens": req.get("max_tokens", 400)}
    if req.get("json_mode"):
        body["response_format"] = {"type": "json_object"}
    return {"custom_id": req["custom_id"], "method": "POST",
            "url": "/v1/chat/completions", "body": body}

def submit_batch(reqs, model="gpt-4o-mini", tag="e2"):
    jsonl = "\n".join(json.dumps(_line(r, model)) for r in reqs)
    f = _openai.files.create(file=io.BytesIO(jsonl.encode()), purpose="batch")
    b = _openai.batches.create(input_file_id=f.id, endpoint="/v1/chat/completions",
                               completion_window="24h", metadata={"tag": tag})
    (BATCH_DIR / f"{tag}_{b.id}.json").write_text(json.dumps({"batch_id": b.id, "n": len(reqs)}), encoding="utf-8")
    print(f"submitted batch {b.id} ({len(reqs)} requests, model={model})")
    return b.id

def poll(batch_id):
    b = _openai.batches.retrieve(batch_id)
    return b.status, (b.request_counts.completed if b.request_counts else 0), \
           (b.request_counts.total if b.request_counts else 0), b.output_file_id

def wait_and_fetch(batch_id, parse_json=True, poll_s=30, max_wait_s=86400):
    waited = 0
    while waited < max_wait_s:
        status, done, total, out_id = poll(batch_id)
        print(f"  batch {batch_id[:18]}... {status} {done}/{total}")
        if status in ("completed", "failed", "expired", "cancelled"):
            break
        time.sleep(poll_s); waited += poll_s
    if status != "completed":
        raise RuntimeError(f"batch ended {status}")
    content = _openai.files.content(out_id).read().decode()
    out = {}
    for line in content.splitlines():
        if not line.strip(): continue
        rec = json.loads(line)
        cid = rec["custom_id"]
        try:
            txt = rec["response"]["body"]["choices"][0]["message"]["content"]
            out[cid] = _extract_json(txt) if parse_json else txt
        except Exception as e:
            out[cid] = {"_error": str(e)}
    return out

if __name__ == "__main__":
    # smoke test: 2 trivial requests
    reqs = [{"custom_id": f"t{i}", "system": "Output JSON only.",
             "user": f'Return JSON {{"n":{i}}}', "json_mode": True, "max_tokens": 20} for i in (1, 2)]
    bid = submit_batch(reqs, tag="smoke")
    print(wait_and_fetch(bid))
