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
# Keys live OUTSIDE the repo (never committed). Override with COREASON_ENV_FILE.
ENV = Path(os.environ.get("COREASON_ENV_FILE",
                          Path.home() / ".config" / "coreason" / ".env.all"))

GMAP = {"A": 3, "B": 2, "C": 1}
MODEL = "llama-3.3-70b-versatile"

def _load_key(name):
    for line in open(ENV, encoding="utf-8"):
        line = line.strip()
        if line.startswith(name + "="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None

_groq = OpenAI(api_key=_load_key("GROQ_API_KEY"), base_url="https://api.groq.com/openai/v1",
               timeout=45.0, max_retries=0)
_openrouter = OpenAI(api_key=_load_key("OPENROUTER_API_KEY"), base_url="https://openrouter.ai/api/v1",
                     timeout=45.0, max_retries=0)
_openai = OpenAI(api_key=_load_key("OPENAI_API_KEY"), timeout=45.0, max_retries=0)
SIM_MODEL = "gpt-4o-mini"   # learners simulated by a DIFFERENT model than the grader (decontamination)
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
        # salvage TRUNCATED json: drop trailing partial token, close open string + braces
        frag = text[start:]
        cut = max(frag.rfind('",'), frag.rfind('],'), frag.rfind('},'), frag.rfind('": '))
        if cut > 0:
            for tail in ('"}', '}', ']}', '"]}', '"}}'):
                try: return json.loads(frag[:cut] + tail)
                except Exception: continue
    raise ValueError("no JSON parsed:\n" + text[:400])

# grader provider chain: llama via OpenRouter primary (deployed-engine fidelity), with retries;
# OpenAI gpt-4o-mini as a reliability fallback; Groq llama last (free-tier TPD often exhausted).
# Override with COREASON_GRADER=openai:gpt-4o (reliable single-provider grading for big runs).
_grader_env = os.environ.get("COREASON_GRADER", "")
_PROV = {"openai": _openai, "openrouter": _openrouter, "groq": _groq}
if ":" in _grader_env and _grader_env.split(":", 1)[0] in _PROV:
    _pv, _mdl = _grader_env.split(":", 1)
    # primary = chosen backend; keep OpenAI gpt-4o-mini as a reliability fallback if primary differs
    _chain = [(_PROV[_pv], _pv, _mdl, 6)]
    if _pv != "openai":
        _chain.append((_openai, "openai", "gpt-4o-mini", 3))
    _GRADER_CHAIN = _chain
else:
    _GRADER_CHAIN = [(_openrouter, "openrouter", "meta-llama/llama-3.3-70b-instruct", 7),
                     (_openai, "openai", "gpt-4o-mini", 3),
                     (_groq, "groq", MODEL, 2)]
_provider_use = {}

def _chat(system, user, temperature, max_tokens, seed, json_mode=False):
    last = None
    for client, name, model, tries in _GRADER_CHAIN:
        for attempt in range(tries):
            try:
                kw = dict(model=model,
                          messages=[{"role": "system", "content": system},
                                    {"role": "user", "content": user}],
                          temperature=temperature, max_tokens=max_tokens)
                if seed is not None: kw["seed"] = seed
                if json_mode: kw["response_format"] = {"type": "json_object"}
                r = client.chat.completions.create(**kw)
                content = r.choices[0].message.content
                if not content or not content.strip():   # guard: some providers return null content
                    raise RuntimeError(f"empty content (finish={r.choices[0].finish_reason})")
                with _lock:
                    _provider_use[name] = _provider_use.get(name, 0) + 1
                return content
            except Exception as e:
                last = e
                msg = str(e)
                if "429" in msg or "rate" in msg.lower():
                    m = re.search(r"try again in ([\d.]+)s", msg)
                    wait = float(m.group(1)) + 1 if m else 6 * (attempt + 1)
                    time.sleep(min(wait, 25))
                else:
                    time.sleep(1.5 * (attempt + 1))
        # fall through to next provider
    raise RuntimeError(f"all providers failed: {last}")

def _chat_openai(system, user, temperature, max_tokens, model=SIM_MODEL, json_mode=False):
    """Separate path for the learner SIMULATOR (different model than the grader)."""
    last = None
    for attempt in range(4):
        try:
            kw = dict(model=model,
                      messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
                      temperature=temperature, max_tokens=max_tokens)
            if json_mode: kw["response_format"] = {"type": "json_object"}
            r = _openai.chat.completions.create(**kw)
            content = r.choices[0].message.content
            if not content or not content.strip():
                raise RuntimeError("empty content")
            return content
        except Exception as e:
            last = e
            time.sleep(2 * (attempt + 1))
    raise RuntimeError(f"openai sim failed: {last}")

# stems listed here bypass the cache (used by E2 to sample the grader repeatedly)
NO_CACHE_STEMS = set()

def run_prompt(stem, vars, temperature=None, max_tokens=None, seed=None, use_cache=True, system_suffix=""):
    """Run a production prompt YAML with variable substitution. Returns parsed dict.
    system_suffix appends to the system prompt (e.g., an ablation strictness override);
    it is part of the cache key, so a different suffix yields fresh grades."""
    if any(stem.startswith(s) for s in NO_CACHE_STEMS):
        use_cache = False
    p = load_prompt(stem)
    params = p.get("parameters", {})
    temp = temperature if temperature is not None else params.get("temperature", 0.4)
    mt = max_tokens if max_tokens is not None else params.get("max_tokens", 1000)
    # Append the output_schema as an explicit JSON directive (production harness did this;
    # prompts 01/02/11/14 omit the inline 'respond with JSON' line that 03/08/09/10 carry).
    schema = p.get("output_schema", {})
    keys = list(schema.get("properties", {}).keys()) if schema else []
    system = p["system_prompt"] + (
        "\n\nReturn ONLY a single JSON object that CONFORMS to the schema below by FILLING IT WITH "
        "ACTUAL CONTENT. Do NOT echo or return the schema definition itself; do NOT include the words "
        '"type", "properties", or "items" as top-level keys. The object MUST have exactly these top-level '
        "keys: " + ", ".join(keys) + ". No markdown fences, no prose outside the JSON.\nSchema:\n"
        + json.dumps(schema) if schema else "")
    if system_suffix:
        system = system + "\n\n" + system_suffix
    user = _render(p["user_prompt"], vars)
    # Namespace the cache by GRADER model for grading prompts only, so re-grading the same
    # (cached) challenges + learner responses with a different backend yields fresh grades while
    # generation (01-07, 14) and the AI-update (04) stay fixed across grader-robustness runs.
    grader_tag = _GRADER_CHAIN[0][2] if any(stem.startswith(s) for s in ("08", "09", "10", "11")) else ""
    key = hashlib.sha256(json.dumps(
        {"stem": stem, "system": system, "user": user, "temp": temp, "mt": mt, "seed": seed,
         "grader": grader_tag}, sort_keys=True).encode()).hexdigest()[:20]
    cf = CACHE_DIR / f"{stem}_{key}.json"
    if use_cache and cf.exists():
        return json.load(open(cf, encoding="utf-8"))
    raw = _chat(system, user, temp, mt, seed, json_mode=bool(schema))
    try:
        parsed = _extract_json(raw)
    except ValueError:
        raw = _chat(system + "\n\nReturn a JSON OBJECT only.", user, temp, mt, None, json_mode=bool(schema))
        try:
            parsed = _extract_json(raw)
        except ValueError:
            # last resort: model returned prose -> wrap into the primary string field
            prim = next((k for k, v in schema.get("properties", {}).items()
                         if v.get("type") == "string"), None)
            if prim: parsed = {prim: raw.strip()}
            else: raise
    # guard: model echoed the schema instead of filling it -> retry once, fresh
    if keys and not any(k in parsed for k in keys):
        raw = _chat(system + "\n\nIMPORTANT: return REAL DATA filling the keys, NOT the schema.",
                    user, temp, mt, None, json_mode=bool(schema))
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
    # Learners simulated by SIM_MODEL (OpenAI), graded by llama-3.3-70b -> no self-grading bias.
    temp = {"expert": 0.4, "proficient": 0.5, "novice": 0.6, "careless": 0.7}.get(level, 0.5)
    key = hashlib.sha256(json.dumps({"sim": True, "model": SIM_MODEL, "system": system, "user": user,
                                     "temp": temp, "seed": seed}, sort_keys=True).encode()).hexdigest()[:20]
    cf = CACHE_DIR / f"sim_{level}_{key}.json"
    if cf.exists():
        return json.load(open(cf, encoding="utf-8"))
    raw = _chat_openai(system, user, temp, 900, json_mode=True)
    parsed = _extract_json(raw)
    with _lock:
        json.dump(parsed, open(cf, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    return parsed
