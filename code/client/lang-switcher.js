/**
 * AI CoReasoning Lab — Language Switcher Utility
 * ============================================
 * Shared script that manages language switching across all screens.
 *
 * Usage:
 *   1. Include this script in any HTML page:
 *        <script src="lang-switcher.js"></script>
 *
 *   2. Add a <select class="lang-select"> element in the top nav (or anywhere).
 *      Options should have values matching language codes (e.g. "en", "he").
 *
 *   3. To react to language changes in a specific page, listen for the
 *      'langchange' event on `document`:
 *        document.addEventListener('langchange', function(e) {
 *          var lang = e.detail.lang;
 *          // update page-specific labels...
 *        });
 *
 *   4. Use `t('key')` to get a translated label, and `getLang()` to read the
 *      current language code.
 *
 * Supported languages: English (en), Hebrew (he).
 * Hebrew triggers RTL layout via the CSS rules in styles.css.
 */

/* ── UI Label Translations ── */
var UI_LABELS = {
  en: {
    challenges: 'Challenges',
    courses: 'Courses',
    myResults: 'My Results',
    analytics: 'Analytics',
    practice: 'Practice',
    assessment: 'Assessment',
    reset: 'Reset',
    simulator: 'Simulator',
    phase1: 'Phase 1 \u2014 Framing',
    phase2: 'Phase 2 \u2014 Judge+Steer Cycles',
    challengeReady: 'Challenge Ready to Start',
    clickToGenerate: 'Click \u25b6 to generate the raw problem via LLM.',
    practiceMode: 'Practice Mode',
    practiceModeDesc: 'Feedback after each phase, retries allowed',
    assessmentMode: 'Assessment Mode',
    assessmentModeDesc: 'Feedback revealed at completion only',
    submitFraming: 'Submit framing',
    generateFraming: 'Generate framing options (LLM)',
    selectRefinements: 'Select all refinements that apply',
    solutionComplete: 'Solution is complete \u2014 no modifications needed',
    challengeComplete: 'Challenge Complete',
    skill: 'Skill',
    grade: 'Grade',
    framing: 'Framing',
    judging: 'Judging',
    steering: 'Steering',
    summaryFeedback: 'Summary Feedback',
    viewMyResults: 'View My Results',
    backToChallenges: 'Back to Challenges',
    sessionSummary: 'Session Summary',
    rawProblem: 'Raw Problem',
    currentAiSolution: 'Current AI Solution',
    steeringHistory: 'Steering History',
    exit: 'Exit',
    viewAnalytics: 'View Analytics',
    detailedFeedback: 'Detailed Phase Feedback',
    refinementSections: 'Your Refinement Sections',
    submit: 'Submit',
    generateJudging: 'Generate judging options (LLM)',
    generateSteering: 'Generate steering options',
    generateUpdatedAi: 'Generate updated AI output',
    judgingSubstep: 'A \u2014 Judging',
    steeringSubstep: 'B \u2014 Steering',
    cycleOf: 'Cycle {0} / {1} max',
    final: '(Final)'
  },
  he: {
    challenges: '\u05d0\u05ea\u05d2\u05e8\u05d9\u05dd',
    courses: '\u05e7\u05d5\u05e8\u05e1\u05d9\u05dd',
    myResults: '\u05d4\u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05e9\u05dc\u05d9',
    analytics: '\u05d0\u05e0\u05dc\u05d9\u05d8\u05d9\u05e7\u05d5\u05ea',
    practice: '\u05ea\u05e8\u05d2\u05d5\u05dc',
    assessment: '\u05d4\u05e2\u05e8\u05db\u05d4',
    reset: '\u05d0\u05d9\u05e4\u05d5\u05e1',
    simulator: '\u05e1\u05d9\u05de\u05d5\u05dc\u05d8\u05d5\u05e8',
    phase1: '\u05e9\u05dc\u05d1 1 \u2014 \u05de\u05e1\u05d2\u05d5\u05e8',
    phase2: '\u05e9\u05dc\u05d1 2 \u2014 \u05de\u05d7\u05d6\u05d5\u05e8\u05d9 \u05e9\u05d9\u05e4\u05d5\u05d8 \u05d5\u05d4\u05db\u05d5\u05d5\u05e0\u05d4',
    challengeReady: '\u05d4\u05d0\u05ea\u05d2\u05e8 \u05de\u05d5\u05db\u05df \u05dc\u05d4\u05ea\u05d7\u05dc\u05d4',
    clickToGenerate: '\u05dc\u05d7\u05e6\u05d5 \u25b6 \u05db\u05d3\u05d9 \u05dc\u05d9\u05e6\u05d5\u05e8 \u05d0\u05ea \u05d4\u05d1\u05e2\u05d9\u05d4 \u05d4\u05d2\u05d5\u05dc\u05de\u05d9\u05ea \u05d1\u05d0\u05de\u05e6\u05e2\u05d5\u05ea LLM.',
    practiceMode: '\u05de\u05e6\u05d1 \u05ea\u05e8\u05d2\u05d5\u05dc',
    practiceModeDesc: '\u05de\u05e9\u05d5\u05d1 \u05dc\u05d0\u05d7\u05e8 \u05db\u05dc \u05e9\u05dc\u05d1, \u05e0\u05d9\u05e1\u05d9\u05d5\u05e0\u05d5\u05ea \u05d7\u05d5\u05d6\u05e8\u05d9\u05dd \u05de\u05d5\u05ea\u05e8\u05d9\u05dd',
    assessmentMode: '\u05de\u05e6\u05d1 \u05d4\u05e2\u05e8\u05db\u05d4',
    assessmentModeDesc: '\u05de\u05e9\u05d5\u05d1 \u05de\u05d5\u05e6\u05d2 \u05e8\u05e7 \u05d1\u05e1\u05d9\u05d5\u05dd',
    submitFraming: '\u05e9\u05dc\u05d7 \u05de\u05e1\u05d2\u05d5\u05e8',
    generateFraming: '\u05d9\u05e6\u05d9\u05e8\u05ea \u05d0\u05e4\u05e9\u05e8\u05d5\u05d9\u05d5\u05ea \u05de\u05e1\u05d2\u05d5\u05e8 (LLM)',
    selectRefinements: '\u05d1\u05d7\u05e8\u05d5 \u05d0\u05ea \u05db\u05dc \u05d4\u05e2\u05d9\u05d3\u05d5\u05e0\u05d9\u05dd \u05d4\u05e8\u05dc\u05d5\u05d5\u05e0\u05d8\u05d9\u05dd',
    solutionComplete: '\u05d4\u05e4\u05ea\u05e8\u05d5\u05df \u05e9\u05dc\u05dd \u2014 \u05dc\u05d0 \u05e0\u05d3\u05e8\u05e9\u05d9\u05dd \u05e9\u05d9\u05e0\u05d5\u05d9\u05d9\u05dd',
    challengeComplete: '\u05d4\u05d0\u05ea\u05d2\u05e8 \u05d4\u05d5\u05e9\u05dc\u05dd',
    skill: '\u05de\u05d9\u05d5\u05de\u05e0\u05d5\u05ea',
    grade: '\u05e6\u05d9\u05d5\u05df',
    framing: '\u05de\u05e1\u05d2\u05d5\u05e8',
    judging: '\u05e9\u05d9\u05e4\u05d5\u05d8',
    steering: '\u05d4\u05db\u05d5\u05d5\u05e0\u05d4',
    summaryFeedback: '\u05de\u05e9\u05d5\u05d1 \u05de\u05e1\u05db\u05dd',
    viewMyResults: '\u05e6\u05e4\u05d4 \u05d1\u05ea\u05d5\u05e6\u05d0\u05d5\u05ea',
    backToChallenges: '\u05d7\u05d6\u05e8\u05d4 \u05dc\u05d0\u05ea\u05d2\u05e8\u05d9\u05dd',
    sessionSummary: '\u05e1\u05d9\u05db\u05d5\u05dd \u05de\u05e4\u05d2\u05e9',
    rawProblem: '\u05d1\u05e2\u05d9\u05d4 \u05d2\u05d5\u05dc\u05de\u05d9\u05ea',
    currentAiSolution: '\u05e4\u05ea\u05e8\u05d5\u05df AI \u05e0\u05d5\u05db\u05d7\u05d9',
    steeringHistory: '\u05d4\u05d9\u05e1\u05d8\u05d5\u05e8\u05d9\u05d9\u05ea \u05d4\u05db\u05d5\u05d5\u05e0\u05d4',
    exit: '\u05d9\u05e6\u05d9\u05d0\u05d4',
    viewAnalytics: '\u05e6\u05e4\u05d4 \u05d1\u05d0\u05e0\u05dc\u05d9\u05d8\u05d9\u05e7\u05d5\u05ea',
    detailedFeedback: '\u05de\u05e9\u05d5\u05d1 \u05de\u05e4\u05d5\u05e8\u05d8 \u05dc\u05e4\u05d9 \u05e9\u05dc\u05d1',
    refinementSections: '\u05de\u05e7\u05d8\u05e2\u05d9 \u05d4\u05e2\u05d9\u05d3\u05d5\u05df \u05e9\u05dc\u05da',
    submit: '\u05e9\u05dc\u05d7',
    generateJudging: '\u05d9\u05e6\u05d9\u05e8\u05ea \u05d0\u05e4\u05e9\u05e8\u05d5\u05d9\u05d5\u05ea \u05e9\u05d9\u05e4\u05d5\u05d8 (LLM)',
    generateSteering: '\u05d9\u05e6\u05d9\u05e8\u05ea \u05d0\u05e4\u05e9\u05e8\u05d5\u05d9\u05d5\u05ea \u05d4\u05db\u05d5\u05d5\u05e0\u05d4',
    generateUpdatedAi: '\u05d9\u05e6\u05d9\u05e8\u05ea \u05e4\u05dc\u05d8 AI \u05de\u05e2\u05d5\u05d3\u05db\u05df',
    judgingSubstep: '\u05d0 \u2014 \u05e9\u05d9\u05e4\u05d5\u05d8',
    steeringSubstep: '\u05d1 \u2014 \u05d4\u05db\u05d5\u05d5\u05e0\u05d4',
    cycleOf: '\u05de\u05d7\u05d6\u05d5\u05e8 {0} / {1} \u05de\u05e7\u05e1\u05d9\u05de\u05d5\u05dd',
    final: '(\u05e1\u05d9\u05d5\u05dd)'
  }
};

/* ── State ── */
var currentLang = 'en';

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

/**
 * getLang() — returns the current language code (e.g. 'en', 'he').
 */
function getLang() { return currentLang; }

/**
 * t(key) — returns the translated UI label for the given key in the
 * current language. Falls back to English, then to the raw key.
 */
function t(key) {
  var labels = UI_LABELS[currentLang] || UI_LABELS['en'];
  return labels[key] || UI_LABELS['en'][key] || key;
}

/* ── Initialize from stored preference ── */
(function() {
  try {
    var stored = localStorage.getItem('coreason-lang');
    if (stored) currentLang = stored;
  } catch(e) {}
})();

/* ── Auto-attach change handlers on DOM ready ── */
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
