/**
 * CoReasoning Lab — Content Loader & Language Switcher
 * =====================================================
 * Replaces the original lang-switcher.js with a unified content API.
 * Expects compiled content bundles to be loaded first via:
 *   <script src="content-compiled/en.js"></script>
 *   <script src="content-compiled/he.js"></script>
 *   <script src="content-loader.js"></script>
 *
 * Public API:
 *   C(path)              — deep lookup: C('challenges.sorting.title')
 *   t(key)               — UI label shorthand: t('submit') → "Submit"
 *   getLang()             — current language code
 *   switchLanguage(lang)  — change language (persists, dispatches event)
 *   getChallenges()       — all challenges for current language
 *   getCourses()          — all courses for current language
 *   getInstitutions()     — institutions list for current language
 *   getUsers()            — users list for current language
 *   getScenarios()        — scenarios for current language
 *   getPrompt(id)         — single prompt by id
 *   getInstruction(id)    — single instruction by id
 *   getSubjectTree(id)    — single subject tree by id
 *   getActiveData()       — { challenges, scenarios } for current language
 */

/* ── Ensure CONTENT namespace ── */
window.CONTENT = window.CONTENT || {};

/* ── State ── */
var currentLang = 'en';

// ────────────────────────────────────────────────────────────────────
// Core content access
// ────────────────────────────────────────────────────────────────────

/**
 * C(path) — Resolve a dot-separated path against the current language's
 * content tree. Falls back to English if the key is missing in the
 * active language.
 *
 * Examples:
 *   C('uiLabels.submit')            → "Submit"
 *   C('challenges.sorting.title')   → "Sorting Pipeline for Sensor Data"
 */
function C(dotPath) {
  var parts = dotPath.split('.');
  var val = _resolve(window.CONTENT[currentLang], parts);
  if (val !== undefined) return val;
  // Fallback to English
  if (currentLang !== 'en') {
    val = _resolve(window.CONTENT['en'], parts);
    if (val !== undefined) return val;
  }
  return undefined;
}

/**
 * Internal: walk an object by an array of keys.
 */
function _resolve(obj, parts) {
  if (!obj) return undefined;
  var cur = obj;
  for (var i = 0; i < parts.length; i++) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[parts[i]];
  }
  return cur;
}

// ────────────────────────────────────────────────────────────────────
// UI label shorthand (backward compatible with lang-switcher.js)
// ────────────────────────────────────────────────────────────────────

/**
 * t(key) — returns the translated UI label for the given key.
 * Falls back to English, then to the raw key string.
 */
function t(key) {
  var val = C('uiLabels.' + key);
  return (val !== undefined) ? val : key;
}

// ────────────────────────────────────────────────────────────────────
// Language switching (backward compatible with lang-switcher.js)
// ────────────────────────────────────────────────────────────────────

/**
 * getLang() — returns the current language code (e.g. 'en', 'he').
 */
function getLang() { return currentLang; }

/**
 * switchLanguage(lang)
 * Sets the active language, updates document direction for RTL languages,
 * syncs all .lang-select dropdowns, persists the choice, and dispatches
 * a 'langchange' CustomEvent so page-specific scripts can react.
 */
function switchLanguage(lang) {
  currentLang = lang;

  // Set document direction — RTL for Hebrew and Arabic, LTR otherwise
  document.documentElement.dir = (lang === 'he' || lang === 'ar') ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;

  // Update every lang selector on the page to reflect the current choice
  var selects = document.querySelectorAll('.lang-select');
  selects.forEach(function(s) {
    for (var i = 0; i < s.options.length; i++) {
      if (s.options[i].value === lang.toUpperCase() || s.options[i].textContent === lang.toUpperCase()) {
        s.selectedIndex = i;
        break;
      }
    }
  });

  // Persist preference to localStorage
  try { localStorage.setItem('coreason-lang', lang); } catch(e) {}

  // Dispatch event so page-specific handlers can update their labels
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
}

// ────────────────────────────────────────────────────────────────────
// Convenience accessors
// ────────────────────────────────────────────────────────────────────

function getChallenges() {
  return C('challenges') || {};
}

function getCourses() {
  return C('courses') || {};
}

function getInstitutions() {
  return C('institutions') || [];
}

function getUsers() {
  return C('users') || [];
}

function getScenarios() {
  return C('scenarios') || {};
}

function getPrompt(id) {
  return C('prompts.' + id) || null;
}

function getInstruction(id) {
  return C('instructions.' + id) || null;
}

function getSubjectTree(id) {
  return C('subjects.' + id) || null;
}

/**
 * getActiveData() — returns { challenges, scenarios } for the current
 * language. Backward compatible with challenge-run pages that relied on
 * a single data object.
 */
function getActiveData() {
  return {
    challenges: getChallenges(),
    scenarios: getScenarios()
  };
}

// ────────────────────────────────────────────────────────────────────
// Initialization
// ────────────────────────────────────────────────────────────────────

/* Restore stored language preference */
(function() {
  try {
    var stored = localStorage.getItem('coreason-lang');
    if (stored) currentLang = stored;
  } catch(e) {}
})();

/* Auto-attach change handlers on DOM ready */
document.addEventListener('DOMContentLoaded', function() {

  // Make all .lang-select dropdowns functional
  document.querySelectorAll('.lang-select').forEach(function(sel) {

    // Normalise value attributes to lowercase language codes
    for (var i = 0; i < sel.options.length; i++) {
      if (!sel.options[i].value) sel.options[i].value = sel.options[i].textContent.toLowerCase();
      else sel.options[i].value = sel.options[i].value.toLowerCase();
    }

    // Listen for user selection changes
    sel.addEventListener('change', function() {
      switchLanguage(this.value.toLowerCase());
    });
  });

  // If the stored language differs from the default, apply it now
  if (currentLang !== 'en') {
    switchLanguage(currentLang);
  }
});
