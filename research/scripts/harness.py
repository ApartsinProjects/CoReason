"""CoReason instrument-validation harness.
Loads the 16 surviving production prompts, runs them via Groq llama-3.3-70b-versatile
(the original engine), with disk caching for reproducibility + cost control.
Also defines the STUDENT-SIMULATOR apparatus (experimental scaffolding, NOT a
production prompt) used to generate controlled-competence learner responses.
"""
import os, json, yaml, hashlib, time, re, threading
from pathlib import Path
from openai import OpenAI

ROOT = Path(__file__).resolve().parents[2]
PROMPT_DIR = ROOT / "code/artifacts/prompt-debug/originals"
CACHE_DIR = ROOT / "research/data/llm_cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)
ENV = ROOT / "code/.env.all"

GMAP = {"A": 3, "B": 2, "C": 1}
MODEL = "llama-3.3-70b-versatile"

def _load_key(name):
    for line in open(ENV, encoding="utf-8"):
        line = line.strip()
        if line.startswith(name + "="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None

_groq = OpenAI(api_key=_load_key("GROQ_API_KEY"), base_url="https://api.groq.com/openai/v1")
_openrouter = OpenAI(api_key=_load_key("OPENROUTER_API_KEY"), base_url="https://openrouter.ai/api/v1")
_lock = threading.Lock()

# ---- prompt loading ----
_PROMPTS = {}
def load_prompt(stem):
    if stem not in _PROMPTS:
        f = next(PROMPT_DIR.glob(f"{stem}*.yaml"))
        _PROMPTS[stem] = yaml.safe_load(open(f, encoding="utf-8"))
    return _PROMPTS[stem]

def _render(tmpl, vars):
    out = tmpl
    for k, v in vars.items():
        if not isinstance(v, str):
            v = json.dumps(v, ensure_ascii=False)
        out = out.replace("{{" + k + "}}", v)
    return out

def _extract_json(text):
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    try:
        return json.loads(text)
    except Exception:
        pass
    # grab first balanced {...}
    start = text.find("{")
    if start >= 0:
        depth = 0
        for i in range(start, len(text)):
            if text[i] == "{": depth += 1
            elif text[i] == "}":
                depth -= 1
                if depth == 0:
                    try: return json.loads(text[start:i+1])
                    except Exception: break
    raise ValueError("no JSON parsed:\n" + text[:400])

def _chat(system, user, temperature, max_tokens, seed, json_mode=False):
    last = None
    for client, name in ((_groq, "groq"), (_openrouter, "openrouter")):
        model = MODEL if name == "groq" else "meta-llama/llama-3.3-70b-instruct"
        for attempt in range(5):
            try:
                kw = dict(model=model,
                          messages=[{"role": "system", "content": system},
                                    {"role": "user", "content": user}],
                          temperature=temperature, max_tokens=max_tokens)
                if seed is not None: kw["seed"] = seed
                if json_mode: kw["response_format"] = {"type": "json_object"}
                r = client.chat.completions.create(**kw)
                return r.choices[0].message.content
            except Exception as e:
                last = e
                msg = str(e)
                if "429" in msg or "rate" in msg.lower():
                    # respect Groq's "try again in 12.34s" hint when present
                    m = re.search(r"try again in ([\d.]+)s", msg)
                    wait = float(m.group(1)) + 1 if m else 8 * (attempt + 1)
                    time.sleep(min(wait, 30))
                else:
                    time.sleep(2 * (attempt + 1))
        # fall through to next provider
    raise RuntimeError(f"all providers failed: {last}")

def run_prompt(stem, vars, temperature=None, max_tokens=None, seed=None, use_cache=True):
    """Run a production prompt YAML with variable substitution. Returns parsed dict."""
    p = load_prompt(stem)
    params = p.get("parameters", {})
    temp = temperature if temperature is not None else params.get("temperature", 0.4)
    mt = max_tokens if max_tokens is not None else params.get("max_tokens", 1000)
    # Append the output_schema as an explicit JSON directive (production harness did this;
    # prompts 01/02/11/14 omit the inline 'respond with JSON' line that 03/08/09/10 carry).
    schema = p.get("output_schema", {})
    system = p["system_prompt"] + (
        "\n\nYou MUST respond with ONLY a single valid JSON object matching this schema "
        "(no markdown fences, no prose outside the JSON):\n" + json.dumps(schema)
        if schema else "")
    user = _render(p["user_prompt"], vars)
    key = hashlib.sha256(json.dumps(
        {"stem": stem, "system": system, "user": user, "temp": temp, "mt": mt, "seed": seed},
        sort_keys=True).encode()).hexdigest()[:20]
    cf = CACHE_DIR / f"{stem}_{key}.json"
    if use_cache and cf.exists():
        return json.load(open(cf, encoding="utf-8"))
    raw = _chat(system, user, temp, mt, seed, json_mode=bool(schema))
    parsed = _extract_json(raw)
    with _lock:
        json.dump({"_vars": vars, "_temp": temp, **parsed}, open(cf, "w", encoding="utf-8"),
                  ensure_ascii=False, indent=2)
    return parsed

# ---- student simulator (EXPERIMENTAL APPARATUS, not a production prompt) ----
SIM_SYS = """You are simulating a university student of a specified COMPETENCE LEVEL working on a
co-reasoning exercise. Produce ONLY what a student at that exact level would actually write —
do not be better or worse than the level dictates. Respond with valid JSON only, no code fences.

COMPETENCE LEVELS:
- expert: deep domain mastery; precise, complete, well-justified; addresses all real gaps/issues.
- proficient: solid but imperfect; addresses most key points, some depth missing.
- novice: superficial understanding; vague, generic, misses several key points; some errors.
- careless: minimal effort; near-empty, off-target, or "looks fine to me" responses.
Stay strictly in character for the given level."""

def simulate_framing(raw_problem, subject_path, level, language="English", seed=None):
    user = f"""TASK: Frame this ill-defined problem (add refinement sections that turn it into a
well-defined task). You are a **{level}** student.

Raw problem: {raw_problem}
Subject: {subject_path}
Language: {language}

Return JSON: {{"refinement_sections":[{{"section_type": str, "content": str}}]}}
A {level} student produces refinements consistent with that level."""
    return _sim(SIM_SYS, user, level, seed)

def simulate_steering(raw_problem, ai_solution, identified_issues, level, language="English", seed=None):
    user = f"""TASK: Send steering/correction commands to improve the AI output. You are a **{level}** student.

Raw problem: {raw_problem}
AI solution to improve: {ai_solution}
Issues you (the student) noticed: {json.dumps(identified_issues, ensure_ascii=False)}
Language: {language}

Return JSON: {{"commands":[str, ...]}}  — the correction commands a {level} student would send.
expert: precise, targets each critical issue. novice: vague/generic. careless: "make it better" or marks done."""
    return _sim(SIM_SYS, user, level, seed)

def _sim(system, user, level, seed):
    temp = {"expert": 0.4, "proficient": 0.5, "novice": 0.6, "careless": 0.7}.get(level, 0.5)
    key = hashlib.sha256(json.dumps({"sim": True, "system": system, "user": user,
                                     "temp": temp, "seed": seed}, sort_keys=True).encode()).hexdigest()[:20]
    cf = CACHE_DIR / f"sim_{level}_{key}.json"
    if cf.exists():
        return json.load(open(cf, encoding="utf-8"))
    raw = _chat(system, user, temp, 900, seed)
    parsed = _extract_json(raw)
    with _lock:
        json.dump(parsed, open(cf, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    return parsed
