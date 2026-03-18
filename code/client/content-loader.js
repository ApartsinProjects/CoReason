/**
 * AI CoReasoning Lab — Content Loader & Language Switcher
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

/* ── Constants ── */
var DEFAULT_LANG = 'en';
var RTL_LANGUAGES = ['he', 'ar'];
var LANG_STORAGE_KEY = 'coreason-lang';

/* ── State ── */
var currentLang = DEFAULT_LANG;

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
  // Fallback to default language
  if (currentLang !== DEFAULT_LANG) {
    val = _resolve(window.CONTENT[DEFAULT_LANG], parts);
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
 * syncs all .lang-select dropdowns, persists the choice, auto-translates
 * the page, and dispatches a 'langchange' CustomEvent.
 */
function switchLanguage(lang) {
  currentLang = lang;

  // Set document direction — RTL for Hebrew and Arabic, LTR otherwise
  document.documentElement.dir = (RTL_LANGUAGES.indexOf(lang) !== -1) ? 'rtl' : 'ltr';
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
  try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch(e) {}

  // Auto-translate the page
  translatePage();

  // Dispatch event so page-specific handlers can update their labels
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
}

// ────────────────────────────────────────────────────────────────────
// Auto-translation system
// ────────────────────────────────────────────────────────────────────

/**
 * translatePage()
 * Scans the DOM for elements with data-t attributes and replaces their
 * text content with the translated value from the current language's
 * uiLabels. Also handles data-t-placeholder and data-t-title.
 *
 * Usage in HTML:
 *   <span data-t="challenges">Challenges</span>
 *   <input data-t-placeholder="searchChallenges" placeholder="Search challenges...">
 *   <button data-t-title="edit" title="Edit">...</button>
 *   <h1 data-t="myResults">My Results</h1>
 */
function translatePage() {
  // Translate text content
  document.querySelectorAll('[data-t]').forEach(function(el) {
    var key = el.getAttribute('data-t');
    var val = t(key);
    if (val && val !== key) {
      el.textContent = val;
    }
  });

  // Translate innerHTML (for elements with HTML entities)
  document.querySelectorAll('[data-t-html]').forEach(function(el) {
    var key = el.getAttribute('data-t-html');
    var val = t(key);
    if (val && val !== key) {
      el.innerHTML = val;
    }
  });

  // Translate placeholders
  document.querySelectorAll('[data-t-placeholder]').forEach(function(el) {
    var key = el.getAttribute('data-t-placeholder');
    var val = t(key);
    if (val && val !== key) {
      el.placeholder = val;
    }
  });

  // Translate title attributes
  document.querySelectorAll('[data-t-title]').forEach(function(el) {
    var key = el.getAttribute('data-t-title');
    var val = t(key);
    if (val && val !== key) {
      el.title = val;
    }
  });

  // Translate select option text
  document.querySelectorAll('[data-t-options]').forEach(function(sel) {
    var keys = sel.getAttribute('data-t-options').split(',');
    for (var i = 0; i < sel.options.length && i < keys.length; i++) {
      var key = keys[i].trim();
      if (key) {
        var val = t(key);
        if (val && val !== key) {
          sel.options[i].textContent = val;
        }
      }
    }
  });
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
    var stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored) currentLang = stored;
  } catch(e) {}
})();

/* Auto-attach change handlers on DOM ready */
document.addEventListener('DOMContentLoaded', function() {

  // ── Hamburger Menu ──
  // Inject the hamburger button into every .topnav that has a <nav>
  document.querySelectorAll('.topnav').forEach(function(topnav) {
    var nav = topnav.querySelector('nav');
    if (!nav) return;

    // Create hamburger button
    var btn = document.createElement('button');
    btn.className = 'hamburger-btn';
    btn.setAttribute('aria-label', 'Toggle navigation');
    btn.innerHTML = '&#9776;'; // ☰
    // Insert after the logo
    var logo = topnav.querySelector('.logo');
    if (logo && logo.nextSibling) {
      topnav.insertBefore(btn, logo.nextSibling);
    } else {
      topnav.appendChild(btn);
    }

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      nav.classList.toggle('nav-open');
      btn.innerHTML = nav.classList.contains('nav-open') ? '&#10005;' : '&#9776;';
    });

    // Close menu when a nav link is clicked
    nav.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        nav.classList.remove('nav-open');
        btn.innerHTML = '&#9776;';
      });
    });
  });

  // Close hamburger menu when clicking outside
  document.addEventListener('click', function(e) {
    document.querySelectorAll('.topnav nav.nav-open').forEach(function(nav) {
      var topnav = nav.closest('.topnav');
      if (topnav && !topnav.contains(e.target)) {
        nav.classList.remove('nav-open');
        var btn = topnav.querySelector('.hamburger-btn');
        if (btn) btn.innerHTML = '&#9776;';
      }
    });
  });

  // Make all .lang-select dropdowns functional
  document.querySelectorAll('.lang-select').forEach(function(sel) {

    // Normalise value attributes to lowercase language codes
    for (var i = 0; i < sel.options.length; i++) {
      if (!sel.options[i].value) sel.options[i].value = sel.options[i].textContent.toLowerCase();
      else sel.options[i].value = sel.options[i].value.toLowerCase();
    }

    // Listen for user selection changes
    sel.addEventListener('change', function() {
      var newLang = this.value.toLowerCase();
      switchLanguage(newLang);
      // Sync preferred_language to server only on explicit user action
      if (typeof API !== 'undefined' && API.put) {
        API.put('/users/me', { preferred_language: newLang }).catch(function() {});
      }
    });
  });

  // Apply stored language (triggers translatePage + langchange event)
  // Always call switchLanguage to ensure initial translation
  switchLanguage(currentLang);

});
