/**
 * CoReason Product Tour
 * Lightweight guided onboarding with popup/next flow.
 * No external dependencies — pure vanilla JS.
 */
'use strict';

const CoReasonTour = (() => {
  let currentStep = 0;
  let steps = [];
  let overlay = null;
  let popup = null;

  // Configuration constants
  const TOUR_STORAGE_KEY = 'coreason_tour_completed';
  const AUTO_START_DELAY_MS = 1000;
  const POPUP_OFFSET_PX = 12;
  const POPUP_MAX_WIDTH = 360;
  const POPUP_VIEWPORT_MARGIN = 12;
  const DEFAULT_ROLE = 'student';

  // Tour step definitions — keyed by role, with translatable text.
  // To localize, override CoReasonTour.tourData before starting.
  const TOURS = {
    student: [
      { target: '.topnav', titleKey: 'tour_welcome', title: 'Welcome to AI CoReasoning Lab!', text: 'This is your learning platform for developing critical AI evaluation skills.', position: 'bottom' },
      { target: '.topnav a[href*="challenge-list"]', titleKey: 'tour_challenges', title: 'Your Challenges', text: 'Browse available challenges, filter by course, type, or status.', position: 'bottom' },
      { target: '.topnav a[href*="course-catalog"]', titleKey: 'tour_courses', title: 'Course Catalog', text: 'Subscribe to courses to access their challenges and track progress.', position: 'bottom' },
      { target: '.topnav a[href*="analytics"]', titleKey: 'tour_analytics', title: 'Your Analytics', text: 'View your grades and track improvement across Framing, Judging, and Steering skills.', position: 'bottom' },
      { target: '.lang-select', titleKey: 'tour_language', title: 'Language', text: 'Switch the interface language.', position: 'bottom-end' },
      { target: '.user-area', titleKey: 'tour_profile', title: 'Your Profile', text: 'View and edit your profile, see your statistics, and manage settings.', position: 'bottom-end' },
    ],
    instructor: [
      { target: '.topnav', titleKey: 'tour_welcome_instructor', title: 'Welcome, Instructor!', text: 'Create challenges, manage courses, and track student performance.', position: 'bottom' },
      { target: '.topnav a[href*="challenge-list"]', titleKey: 'tour_challenge_mgmt', title: 'Challenge Management', text: 'Create, publish, and manage challenges for your students.', position: 'bottom' },
      { target: '.topnav a[href*="course-catalog"]', titleKey: 'tour_course_mgmt', title: 'Course Management', text: 'Join courses as a steward and configure LLM settings.', position: 'bottom' },
      { target: '.topnav a[href*="analytics"]', titleKey: 'tour_analytics_dash', title: 'Analytics Dashboard', text: 'View student performance, grade distributions, and export reports.', position: 'bottom' },
      { target: '.lang-select', titleKey: 'tour_language', title: 'Language', text: 'Switch the interface language.', position: 'bottom-end' },
      { target: '.user-area', titleKey: 'tour_profile', title: 'Your Profile', text: 'View your profile and see challenge statistics.', position: 'bottom-end' },
    ],
  };

  function createStyles() {
    if (document.getElementById('tour-styles')) return;
    const style = document.createElement('style');
    style.id = 'tour-styles';
    style.textContent = `
      .tour-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.5);
        z-index: 10000; transition: opacity 0.3s;
      }
      .tour-highlight {
        position: relative; z-index: 10001;
        box-shadow: 0 0 0 4px var(--accent, #f9a825), 0 0 20px rgba(249,168,37,0.4);
        border-radius: var(--radius, 8px);
      }
      .tour-popup {
        position: fixed; z-index: 10002;
        background: white; border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        padding: 24px; max-width: 360px; width: 90vw;
        font-family: inherit;
      }
      .tour-popup h3 {
        margin: 0 0 8px; color: var(--primary, #1a237e);
        font-size: 1.1rem;
      }
      .tour-popup p {
        margin: 0 0 20px; color: #555; font-size: 0.95rem; line-height: 1.5;
      }
      .tour-footer {
        display: flex; justify-content: space-between; align-items: center;
      }
      .tour-progress {
        color: #999; font-size: 0.85rem;
      }
      .tour-buttons { display: flex; gap: 8px; }
      .tour-btn {
        padding: 8px 16px; border-radius: 6px; border: none;
        cursor: pointer; font-size: 0.9rem; font-weight: 500;
      }
      .tour-btn-skip {
        background: transparent; color: #999;
      }
      .tour-btn-skip:hover { color: #666; }
      .tour-btn-back {
        background: #e8eaf6; color: var(--primary, #1a237e);
      }
      .tour-btn-next {
        background: var(--primary, #1a237e); color: white;
      }
      .tour-btn-next:hover { opacity: 0.9; }
    `;
    document.head.appendChild(style);
  }

  function showStep(index) {
    // Clean previous highlight
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));

    if (index >= steps.length) {
      end();
      return;
    }

    currentStep = index;
    const step = steps[index];
    const target = document.querySelector(step.target);

    // Highlight target
    if (target) {
      target.classList.add('tour-highlight');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Position popup
    if (!popup) {
      popup = document.createElement('div');
      popup.className = 'tour-popup';
      document.body.appendChild(popup);
    }

    // Resolve translatable title/text: check content loader if available
    const resolvedTitle = (typeof t === 'function' && step.titleKey) ? (t(step.titleKey) !== step.titleKey ? t(step.titleKey) : step.title) : step.title;
    const resolvedText = (typeof t === 'function' && step.textKey) ? (t(step.textKey) !== step.textKey ? t(step.textKey) : step.text) : step.text;

    popup.innerHTML = `
      <h3>${resolvedTitle}</h3>
      <p>${resolvedText}</p>
      <div class="tour-footer">
        <span class="tour-progress">${index + 1} / ${steps.length}</span>
        <div class="tour-buttons">
          <button class="tour-btn tour-btn-skip" onclick="CoReasonTour.end()">Skip</button>
          ${index > 0 ? '<button class="tour-btn tour-btn-back" onclick="CoReasonTour.prev()">Back</button>' : ''}
          <button class="tour-btn tour-btn-next" onclick="CoReasonTour.next()">
            ${index === steps.length - 1 ? (typeof t === 'function' ? t('completed') || 'Done!' : 'Done!') : 'Next →'}
          </button>
        </div>
      </div>
    `;

    // Position near target
    if (target) {
      const rect = target.getBoundingClientRect();
      const popupRect = popup.getBoundingClientRect();
      let top = rect.bottom + POPUP_OFFSET_PX;
      let left = Math.max(POPUP_VIEWPORT_MARGIN, rect.left);

      // Keep within viewport
      if (top + popupRect.height > window.innerHeight - POPUP_VIEWPORT_MARGIN * 2) {
        top = rect.top - popupRect.height - POPUP_OFFSET_PX;
      }
      if (left + POPUP_MAX_WIDTH > window.innerWidth - POPUP_VIEWPORT_MARGIN) {
        left = window.innerWidth - POPUP_MAX_WIDTH - POPUP_VIEWPORT_MARGIN;
      }

      popup.style.top = top + 'px';
      popup.style.left = left + 'px';
    } else {
      popup.style.top = '50%';
      popup.style.left = '50%';
      popup.style.transform = 'translate(-50%, -50%)';
    }
  }

  return {
    // Allow external tour data override for localization
    tourData: TOURS,

    start(role = DEFAULT_ROLE) {
      steps = this.tourData[role] || this.tourData[DEFAULT_ROLE];
      currentStep = 0;
      createStyles();

      // Create overlay
      overlay = document.createElement('div');
      overlay.className = 'tour-overlay';
      overlay.onclick = () => {};  // prevent click-through
      document.body.appendChild(overlay);

      showStep(0);
    },

    next() { showStep(currentStep + 1); },
    prev() { showStep(Math.max(0, currentStep - 1)); },

    end() {
      document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
      if (overlay) { overlay.remove(); overlay = null; }
      if (popup) { popup.remove(); popup = null; }

      // Persist completion
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');

      // Also tell the server
      if (window.API) {
        API.users.update({ tour_completed: true }).catch(() => {});
      }
    },

    shouldShow() {
      return !localStorage.getItem(TOUR_STORAGE_KEY);
    },

    restart(role) {
      localStorage.removeItem(TOUR_STORAGE_KEY);
      this.start(role);
    },
  };
})();

if (typeof window !== 'undefined') {
  window.CoReasonTour = CoReasonTour;

  // Auto-start tour for new users
  document.addEventListener('DOMContentLoaded', () => {
    if (CoReasonTour.shouldShow()) {
      setTimeout(() => {
        const role = document.body.dataset.role || 'student';
        CoReasonTour.start(role);
      }, 1000);
    }
  });
}
