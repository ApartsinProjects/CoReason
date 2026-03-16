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
 * syncs all .lang-select dropdowns, persists the choice, auto-translates
 * the page, and dispatches a 'langchange' CustomEvent.
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

  // Auto-translate the page
  translatePage();

  // Render mockup data bindings
  renderMockupData();

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
// Mockup data access
// ────────────────────────────────────────────────────────────────────

/**
 * D(path) — shorthand for mockup data: D('studentUser.name') → C('mockupData.studentUser.name')
 */
function D(path) {
  return C('mockupData.' + path);
}

/**
 * renderMockupData()
 * Scans DOM for data-d attributes and populates from mockup data.
 * Also renders data-d-html for innerHTML.
 */
function renderMockupData() {
  document.querySelectorAll('[data-d]').forEach(function(el) {
    var path = el.getAttribute('data-d');
    var val = D(path);
    if (val !== undefined && val !== null) {
      el.textContent = String(val);
    }
  });
  document.querySelectorAll('[data-d-html]').forEach(function(el) {
    var path = el.getAttribute('data-d-html');
    var val = D(path);
    if (val !== undefined && val !== null) {
      el.innerHTML = String(val);
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
    var stored = localStorage.getItem('coreason-lang');
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
      switchLanguage(this.value.toLowerCase());
    });
  });

  // Apply stored language (triggers translatePage + langchange event)
  // Always call switchLanguage to ensure initial translation
  switchLanguage(currentLang);

  // ── Mockup Mode Switcher ──
  // Inject a fixed bottom-right widget for switching between users/roles
  (function injectMockupSwitcher() {
    // Landing pages per role
    var studentHome = '03-challenge-list.html';
    var instructorHome = '03-challenge-list-instructor.html';

    // Screen mappings for same-role navigation (student ↔ instructor)
    var screenMap = {
      '03-challenge-list.html':            '03-challenge-list-instructor.html',
      '03-challenge-list-instructor.html':  '03-challenge-list.html',
      '04b-create-challenge-student.html':  '04-create-challenge.html',
      '04-create-challenge.html':           '04b-create-challenge-student.html',
      '05-challenge-run.html':              '05-challenge-run-instructor.html',
      '05-challenge-run-instructor.html':   '05-challenge-run.html',
      '05b-challenge-run-open-ended.html':  '05-challenge-run-instructor.html',
      '06-course-catalog.html':             '06-course-catalog-instructor.html',
      '06-course-catalog-instructor.html':  '06-course-catalog.html',
      '07-student-analytics.html':          '08-instructor-analytics.html',
      '08-instructor-analytics.html':       '07-student-analytics.html',
      '07b-challenge-report.html':          '08-instructor-analytics.html',
      '10-edit-subject-tree.html':          '06-course-catalog.html',
      '10b-add-course.html':               '06-course-catalog.html'
    };

    // Detect current role from filename
    var currentFile = location.pathname.split('/').pop() || 'index.html';
    var instructorFiles = [
      '03-challenge-list-instructor.html',
      '04-create-challenge.html',
      '05-challenge-run-instructor.html',
      '06-course-catalog-instructor.html',
      '08-instructor-analytics.html',
      '10-edit-subject-tree.html',
      '10b-add-course.html'
    ];
    var currentRole = instructorFiles.indexOf(currentFile) !== -1 ? 'instructor' : 'student';

    // All demo users across institutions
    var users = [
      { id: 'sarah',  name: 'Sarah Cohen',        avatar: 'SC', institution: 'Tel Aviv University',      role: 'student',    roleLabel: 'Student' },
      { id: 'levy',   name: 'Dr. Dana Levy',      avatar: 'DL', institution: 'Tel Aviv University',      role: 'instructor', roleLabel: 'Instructor' },
      { id: 'alex',   name: 'Alex Mueller',        avatar: 'AM', institution: 'TU Munich',                role: 'student',    roleLabel: 'Student' },
      { id: 'weber',  name: 'Prof. Klaus Weber',   avatar: 'KW', institution: 'TU Munich',                role: 'instructor', roleLabel: 'Instructor' },
      { id: 'maria',  name: 'María García',        avatar: 'MG', institution: 'Universidad de Barcelona', role: 'student',    roleLabel: 'Student' },
      { id: 'dupont', name: 'Prof. Claire Dupont',  avatar: 'CD', institution: 'Sorbonne Université',      role: 'instructor', roleLabel: 'Instructor' }
    ];

    // Determine active user from stored preference or from role
    var storedUserId = null;
    try { storedUserId = localStorage.getItem('coreason-mockup-user'); } catch(e) {}
    var activeUser = null;
    if (storedUserId) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === storedUserId) { activeUser = users[i]; break; }
      }
    }
    if (!activeUser) {
      activeUser = currentRole === 'instructor' ? users[1] : users[0];
    }
    // Store current active user so it persists
    try { localStorage.setItem('coreason-mockup-user', activeUser.id); } catch(e) {}

    // Update topnav to reflect the active user
    var userArea = document.querySelector('.topnav .user-area');
    if (userArea) {
      // Find and update the user name span (usually the text node next to the avatar)
      var spans = userArea.querySelectorAll('span');
      spans.forEach(function(s) {
        // Update role badge
        var dt = s.getAttribute('data-t');
        if (dt === 'student' || dt === 'instructor') {
          s.setAttribute('data-t', activeUser.role);
          s.textContent = activeUser.roleLabel;
          if (activeUser.role === 'instructor') {
            s.style.background = '#e0f2f1';
            s.style.color = '#00695c';
          } else {
            s.style.background = '#e8eaf6';
            s.style.color = '#1a237e';
          }
        }
      });
      // Find the plain text name span (no data-t, no class, not inside a link)
      var nameSpans = userArea.querySelectorAll(':scope > span');
      nameSpans.forEach(function(s) {
        if (!s.getAttribute('data-t') && !s.className && !s.querySelector('*')) {
          // Short display name
          var parts = activeUser.name.split(' ');
          s.textContent = parts.length > 1 ? (parts[0].replace('Prof.','').replace('Dr.','').trim() || parts[1]) + ' ' + parts[parts.length - 1].charAt(0) + '.' : activeUser.name;
          if (activeUser.name.indexOf('Dr.') === 0 || activeUser.name.indexOf('Prof.') === 0) {
            s.textContent = activeUser.name.split(' ').slice(0,2).join(' ');
          }
        }
      });
      // Update avatar
      var avatar = userArea.querySelector('.avatar');
      if (avatar) {
        avatar.textContent = activeUser.avatar;
        if (activeUser.role === 'instructor') {
          avatar.style.background = '#e3f2fd';
          avatar.style.color = 'var(--primary)';
        } else {
          avatar.style.background = '';
          avatar.style.color = '';
        }
      }
      // Inject institution badge
      var existingInst = userArea.querySelector('.inst-badge');
      if (!existingInst) {
        var instSpan = document.createElement('span');
        instSpan.className = 'inst-badge';
        instSpan.textContent = activeUser.institution;
        instSpan.style.cssText = 'font-size:11px;color:#999;border-left:1px solid #ddd;padding-left:8px;margin-left:4px;';
        userArea.insertBefore(instSpan, userArea.firstChild);
      } else {
        existingInst.textContent = activeUser.institution;
      }
    }

    // Inject CSS
    var style = document.createElement('style');
    style.textContent =
      '.mockup-switcher{position:fixed;bottom:16px;right:16px;z-index:9999;font-family:inherit;display:flex;align-items:flex-end;gap:8px;}' +
      '.mockup-switcher .mockup-label{font-size:11px;color:#999;letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px;cursor:default;}' +
      '.mockup-switcher .mockup-dropdown{position:relative;}' +
      '.mockup-switcher .mockup-btn{display:flex;align-items:center;gap:8px;padding:6px 14px;background:#fff;border:1.5px solid #ccc;border-radius:8px;font-size:13px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.12);transition:border-color .15s;max-width:320px;}' +
      '.mockup-switcher .mockup-btn:hover{border-color:#7c4dff;}' +
      '.mockup-switcher .mockup-btn .role-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}' +
      '.mockup-switcher .mockup-btn .role-dot.student{background:#26a69a;}' +
      '.mockup-switcher .mockup-btn .role-dot.instructor{background:#7c4dff;}' +
      '.mockup-switcher .mockup-btn .caret{font-size:10px;color:#999;margin-left:4px;}' +
      '.mockup-switcher .mockup-btn .btn-info{display:flex;flex-direction:column;line-height:1.3;}' +
      '.mockup-switcher .mockup-btn .btn-name{font-weight:600;}' +
      '.mockup-switcher .mockup-btn .btn-inst{font-size:11px;color:#888;}' +
      '.mockup-menu{display:none;position:absolute;bottom:100%;right:0;margin-bottom:6px;background:#fff;border:1.5px solid #ddd;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.15);overflow:hidden;min-width:300px;max-height:400px;overflow-y:auto;}' +
      '.mockup-menu.open{display:block;}' +
      '.mockup-menu-group{padding:6px 16px 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#999;background:#fafafa;border-bottom:1px solid #f0f0f0;}' +
      '.mockup-menu-item{display:flex;align-items:center;gap:10px;padding:10px 16px;cursor:pointer;transition:background .12s;border-bottom:1px solid #f0f0f0;}' +
      '.mockup-menu-item:last-child{border-bottom:none;}' +
      '.mockup-menu-item:hover{background:#f5f0ff;}' +
      '.mockup-menu-item.active{background:#ede7f6;}' +
      '.mockup-menu-item .user-info{display:flex;flex-direction:column;}' +
      '.mockup-menu-item .user-name{font-size:13px;font-weight:600;color:#222;}' +
      '.mockup-menu-item .user-detail{font-size:11px;color:#888;}' +
      '.topnav .inst-badge{font-size:11px;color:#999;margin-left:4px;}' +
      '[dir="rtl"] .mockup-switcher{right:auto;left:16px;}';
    document.head.appendChild(style);

    // Group users by institution
    var institutions = {};
    users.forEach(function(u) {
      if (!institutions[u.institution]) institutions[u.institution] = [];
      institutions[u.institution].push(u);
    });

    // Build menu HTML
    var menuHtml = '';
    Object.keys(institutions).forEach(function(inst) {
      menuHtml += '<div class="mockup-menu-group">' + inst + '</div>';
      institutions[inst].forEach(function(u) {
        var isActive = u.id === activeUser.id;
        menuHtml += '<div class="mockup-menu-item' + (isActive ? ' active' : '') + '" data-user-id="' + u.id + '" data-role="' + u.role + '">' +
          '<span class="role-dot ' + u.role + '"></span>' +
          '<div class="user-info">' +
            '<span class="user-name">' + u.name + '</span>' +
            '<span class="user-detail">' + u.roleLabel + '</span>' +
          '</div>' +
        '</div>';
      });
    });

    // Build widget
    var widget = document.createElement('div');
    widget.className = 'mockup-switcher';
    widget.innerHTML =
      '<span class="mockup-label">Mockup Mode</span>' +
      '<div class="mockup-dropdown">' +
        '<button class="mockup-btn" id="mockupBtn">' +
          '<span class="role-dot ' + activeUser.role + '"></span>' +
          '<div class="btn-info">' +
            '<span class="btn-name">' + activeUser.name + '</span>' +
            '<span class="btn-inst">' + activeUser.institution + ' · ' + activeUser.roleLabel + '</span>' +
          '</div>' +
          '<span class="caret">&#9660;</span>' +
        '</button>' +
        '<div class="mockup-menu" id="mockupMenu">' + menuHtml + '</div>' +
      '</div>';

    document.body.appendChild(widget);

    // Toggle menu
    var btn = document.getElementById('mockupBtn');
    var menu = document.getElementById('mockupMenu');
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
    document.addEventListener('click', function() { menu.classList.remove('open'); });

    // Handle user switch
    menu.querySelectorAll('.mockup-menu-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var userId = this.getAttribute('data-user-id');
        var role = this.getAttribute('data-role');
        if (userId === activeUser.id) { menu.classList.remove('open'); return; }
        // Store preference
        try { localStorage.setItem('coreason-mockup-user', userId); } catch(e) {}

        if (role !== currentRole) {
          // Different role → navigate to the counterpart or home page
          var target = screenMap[currentFile];
          if (!target) {
            target = role === 'instructor' ? instructorHome : studentHome;
          }
          window.location.href = target;
        } else {
          // Same role, different user → reload current page (topnav will update)
          window.location.reload();
        }
      });
    });
  })();
});
