/**
 * User Header - Auto-populates user info in the top nav bar.
 *
 * Expected DOM structure in the user-area:
 *   <span id="userInstitution"></span>
 *   <span id="userName">—</span>
 *   <div class="avatar" id="userAvatar">?</div>
 *
 * If those IDs exist, this script fills them from /auth/me.
 * If they don't exist, it looks for common patterns and updates them.
 */
'use strict';

(function() {
  if (typeof API === 'undefined') return;

  // Configuration constants
  var LOGIN_PATH = '/login.html';
  var PUBLIC_PATH_PATTERNS = ['login', 'sign-up'];
  var AVATAR_MAX_INITIALS = 2;
  var NAME_PLACEHOLDER = '\u2014'; // em dash
  var MAX_NAME_LENGTH = 40;
  // Role data-t values to skip when searching for name spans
  var ROLE_BADGE_KEYS = ['student', 'instructor'];

  function isPublicPage(path) {
    return PUBLIC_PATH_PATTERNS.some(function(pattern) {
      return path.indexOf(pattern) !== -1;
    });
  }

  function getInitials(name) {
    var parts = name.split(' ');
    return parts.map(function(p) { return p[0]; }).join('').toUpperCase().substring(0, AVATAR_MAX_INITIALS);
  }

  function getInstitutionName(user) {
    return user.institution_name || user.institutionName || '';
  }

  // Role-based page mappings: student page <-> instructor page
  var ROLE_PAGE_MAP = {
    // student page : instructor equivalent
    'challenge-list.html':       'challenge-list-instructor.html',
    'course-catalog.html':       'course-catalog-instructor.html',
    'student-analytics.html':    'instructor-analytics.html'
  };

  // Build reverse map: instructor page -> student equivalent
  var REVERSE_ROLE_PAGE_MAP = {};
  Object.keys(ROLE_PAGE_MAP).forEach(function(studentPage) {
    REVERSE_ROLE_PAGE_MAP[ROLE_PAGE_MAP[studentPage]] = studentPage;
  });

  // Instructor-only pages that students should be redirected away from
  REVERSE_ROLE_PAGE_MAP['create-challenge.html'] = 'challenge-list.html';
  REVERSE_ROLE_PAGE_MAP['edit-subject-tree.html'] = 'challenge-list.html';
  REVERSE_ROLE_PAGE_MAP['add-course.html'] = 'course-catalog.html';

  // Pages that require admin role
  var ADMIN_PAGES = ['admin.html'];

  function enforceRoleGuard(user) {
    var path = window.location.pathname;
    var filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    var role = user.role;

    if (!role) return; // no role info, skip guard

    // Block non-admin users from admin pages
    if (ADMIN_PAGES.indexOf(filename) !== -1 && role !== 'admin') {
      var fallback = role === 'instructor' ? 'challenge-list-instructor.html' : 'challenge-list.html';
      window.location.replace(fallback);
      return;
    }

    if (role === 'student' && REVERSE_ROLE_PAGE_MAP[filename]) {
      // Student on an instructor page — redirect to student equivalent
      window.location.replace(REVERSE_ROLE_PAGE_MAP[filename]);
      return;
    }

    if (role === 'instructor' && ROLE_PAGE_MAP[filename]) {
      // Instructor on a student-only page — redirect to instructor equivalent
      window.location.replace(ROLE_PAGE_MAP[filename]);
      return;
    }
  }

  API.auth.me().then(function(data) {
    var user = data.user || data;
    window._currentUser = user;

    // MAJ-9: Hide admin link for non-admin users
    var adminLink = document.querySelector('a[href*="admin"]');
    if (adminLink && user.role !== 'admin') {
      adminLink.style.display = 'none';
    }

    // Auto-set language from user profile preference (avoids infinite reload
    // by only switching when the language actually differs)
    if (user.preferred_language && typeof switchLanguage === 'function' && typeof getLang === 'function') {
      var currentLangVal = getLang();
      if (user.preferred_language !== currentLangVal) {
        switchLanguage(user.preferred_language);
      }
    }

    // Enforce role-based page access before page-specific JS loads data
    enforceRoleGuard(user);

    // Update user name
    var nameEl = document.getElementById('userName');
    if (nameEl) {
      nameEl.textContent = user.name || user.email || NAME_PLACEHOLDER;
    } else {
      // Try to find hardcoded name in user-area and replace
      var userArea = document.querySelector('.user-area');
      if (userArea) {
        var spans = userArea.querySelectorAll('span');
        spans.forEach(function(s) {
          // Skip role badges and institution spans
          if (s.hasAttribute('data-t') && ROLE_BADGE_KEYS.indexOf(s.getAttribute('data-t')) !== -1) return;
          if (s.id === 'userInstitution') return;
          if (s.style && s.style.background) return;
          // If it looks like a hardcoded name, replace it
          var text = s.textContent.trim();
          if (text && text !== NAME_PLACEHOLDER && !s.querySelector('*') && text.length < MAX_NAME_LENGTH) {
            s.id = 'userName';
            s.textContent = user.name || user.email || NAME_PLACEHOLDER;
          }
        });
      }
    }

    // Update avatar
    var avatarEl = document.getElementById('userAvatar');
    if (!avatarEl) {
      avatarEl = document.querySelector('.user-area .avatar');
    }
    if (avatarEl) {
      if (user.profile_image) {
        avatarEl.textContent = '';
        avatarEl.innerHTML = '<img src="' + user.profile_image + '" alt="' + (user.name || 'Avatar') + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">';
      } else if (user.name) {
        avatarEl.textContent = getInitials(user.name);
      }
    }

    // Update institution
    var instEl = document.getElementById('userInstitution');
    if (instEl) {
      instEl.textContent = getInstitutionName(user);
    }

    // Update institution label (course catalog)
    var instLabel = document.getElementById('institutionLabel');
    if (instLabel) {
      instLabel.textContent = getInstitutionName(user);
    }

  }).catch(function() {
    // Auth failed — redirect to login (unless already on a public page)
    var path = window.location.pathname;
    if (!isPublicPage(path)) {
      window.location.href = LOGIN_PATH;
    }
  });
})();
