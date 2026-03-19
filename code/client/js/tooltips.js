/**
 * Tooltip Help System for AI CoReasoning Lab
 * Adds ? icons next to elements with data-tooltip="key" attributes
 * Renders rich formatted tooltips with WHY / WHAT / HOW sections
 */
(function() {
  'use strict';

  var TOOLTIP_OFFSET = 8;
  var FALLBACK_LANG = 'en';
  var VIEWPORT_PADDING = 10;
  var TOOLTIP_MAX_WIDTH = 360;
  var TOOLTIP_Z_INDEX = 10000;

  // Tags that should receive the icon as a child element
  var INLINE_TAGS = ['LABEL', 'H1', 'H2', 'H3', 'SPAN', 'TH'];

  // Section config: marker → { icon, color, label (en), labelHe }
  var SECTIONS = {
    'WHY':  { icon: '🎯', color: '#ffd54f', label: 'WHY',  labelHe: 'למה' },
    'WHAT': { icon: '📋', color: '#81d4fa', label: 'WHAT', labelHe: 'מה' },
    'HOW':  { icon: '🔧', color: '#a5d6a7', label: 'HOW',  labelHe: 'איך' }
  };

  // Hebrew markers
  var HE_MARKERS = { 'למה': 'WHY', 'מה': 'WHAT', 'איך': 'HOW' };

  function getTooltips() {
    var lang = document.documentElement.lang || FALLBACK_LANG;
    if (window.CONTENT && window.CONTENT[lang] && window.CONTENT[lang].tooltips) {
      return window.CONTENT[lang].tooltips;
    }
    if (window.CONTENT && window.CONTENT[FALLBACK_LANG] && window.CONTENT[FALLBACK_LANG].tooltips) {
      return window.CONTENT[FALLBACK_LANG].tooltips;
    }
    return {};
  }

  function isHebrew() {
    return (document.documentElement.lang || FALLBACK_LANG) === 'he';
  }

  /**
   * Parse "WHY: ... WHAT: ... HOW: ..." text into structured HTML sections
   */
  function formatTooltipHtml(text) {
    if (!text) return '';

    // Try to split by WHY/WHAT/HOW (English) or למה/מה/איך (Hebrew)
    var parts = [];
    var he = isHebrew();

    // Build regex for splitting
    // English: WHY: ... WHAT: ... HOW: ...
    // Hebrew:  למה: ... מה: ... איך: ...
    var enPattern = /\b(WHY|WHAT|HOW)\s*[:：]\s*/gi;
    var hePattern = /(למה|מה|איך)\s*[:：]\s*/g;
    var pattern = he ? hePattern : enPattern;

    // Check if text has section markers — try language-specific pattern first,
    // then fall back to the other pattern so mixed-language content still works
    // (e.g., English WHY/WHAT/HOW text shown on a Hebrew page, or vice versa)
    var hasMarkers = pattern.test(text);
    pattern.lastIndex = 0; // reset

    if (!hasMarkers) {
      // Try the other language's pattern as fallback
      var altPattern = he ? enPattern : hePattern;
      hasMarkers = altPattern.test(text);
      altPattern.lastIndex = 0;
      if (hasMarkers) {
        pattern = altPattern;
      }
    }

    if (!hasMarkers) {
      // No WHY/WHAT/HOW structure — render as simple paragraph
      return '<div style="font-size:13px;line-height:1.6;padding:2px 0">' + escHtml(text) + '</div>';
    }

    // Split into sections
    var tokens = text.split(pattern);
    // tokens: ["", "WHY", "text...", "WHAT", "text...", "HOW", "text..."]

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i].trim();
      if (!token) continue;

      // Check if token is a section marker
      var markerKey = token.toUpperCase();
      if (he && HE_MARKERS[token]) markerKey = HE_MARKERS[token];

      if (SECTIONS[markerKey] && i + 1 < tokens.length) {
        var sec = SECTIONS[markerKey];
        var body = tokens[i + 1].trim();
        var label = he ? sec.labelHe : sec.label;
        parts.push({ key: markerKey, icon: sec.icon, color: sec.color, label: label, body: body });
        i++; // skip the body token
      }
    }

    if (parts.length === 0) {
      return '<div style="font-size:13px;line-height:1.6;padding:2px 0">' + escHtml(text) + '</div>';
    }

    // Build rich HTML
    var html = '';
    for (var j = 0; j < parts.length; j++) {
      var p = parts[j];
      if (j > 0) {
        html += '<div style="border-top:1px solid rgba(255,255,255,.15);margin:6px 0"></div>';
      }
      html += '<div style="display:flex;align-items:flex-start;gap:8px;margin:4px 0">';
      html += '<span style="font-size:15px;line-height:1;flex-shrink:0;margin-top:1px">' + p.icon + '</span>';
      html += '<div style="flex:1;min-width:0">';
      html += '<span style="display:inline-block;font-size:10px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;padding:1px 6px;border-radius:3px;background:' + p.color + ';color:#1a1a2e;margin-bottom:3px">' + escHtml(p.label) + '</span>';
      html += '<div style="font-size:12.5px;line-height:1.55;opacity:.93">' + escHtml(p.body) + '</div>';
      html += '</div></div>';
    }
    return html;
  }

  function escHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function getResponsiveMaxWidth() {
    var vw = window.innerWidth;
    if (vw < 400) {
      return Math.min(280, vw - 40);
    }
    return TOOLTIP_MAX_WIDTH;
  }

  function createTooltipEl() {
    var maxW = getResponsiveMaxWidth();
    var el = document.createElement('div');
    el.className = 'help-tooltip';
    el.innerHTML = '<div class="help-tooltip-content"></div>';
    el.style.cssText = 'position:fixed;z-index:' + TOOLTIP_Z_INDEX
      + ';background:linear-gradient(135deg, #1a237e 0%, #283593 100%)'
      + ';color:#fff;padding:14px 16px;border-radius:10px'
      + ';font-size:13px;max-width:' + maxW + 'px'
      + ';box-shadow:0 8px 32px rgba(0,0,0,.35),0 2px 8px rgba(26,35,126,.2)'
      + ';pointer-events:none;opacity:0;transition:opacity .2s ease'
      + ';line-height:1.5;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif'
      + ';border:1px solid rgba(255,255,255,.1)'
      + ';';
    document.body.appendChild(el);
    return el;
  }

  function positionTooltip(tooltipEl, anchorRect) {
    // Dynamically adjust max-width for narrow viewports
    tooltipEl.style.maxWidth = getResponsiveMaxWidth() + 'px';

    var left = anchorRect.left + anchorRect.width / 2;
    var top = anchorRect.bottom + TOOLTIP_OFFSET;
    tooltipEl.style.left = left + 'px';
    tooltipEl.style.top = top + 'px';
    tooltipEl.style.transform = 'translateX(-50%)';

    requestAnimationFrame(function() {
      var ttRect = tooltipEl.getBoundingClientRect();
      if (ttRect.right > window.innerWidth - VIEWPORT_PADDING) {
        tooltipEl.style.left = (window.innerWidth - ttRect.width - VIEWPORT_PADDING) + 'px';
        tooltipEl.style.transform = 'none';
      }
      if (ttRect.left < VIEWPORT_PADDING) {
        tooltipEl.style.left = VIEWPORT_PADDING + 'px';
        tooltipEl.style.transform = 'none';
      }
      if (ttRect.bottom > window.innerHeight) {
        tooltipEl.style.top = (anchorRect.top - ttRect.height - TOOLTIP_OFFSET) + 'px';
      }
    });
  }

  /**
   * Resolve a data-tooltip value: if it looks like a key (no spaces),
   * try a tooltip dictionary lookup first; otherwise treat as inline text.
   * Returns { titleHtml, bodyHtml } ready for rendering.
   */
  function resolveTooltip(value) {
    var tooltips = getTooltips();
    var data = tooltips[value];
    if (data) {
      var titleHtml = data.title ? '<div style="font-weight:700;font-size:14px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,.2)">' + escHtml(data.title) + '</div>' : '';
      var bodyHtml = formatTooltipHtml(data.text || '');
      return titleHtml + bodyHtml;
    }
    // No key match — treat value as inline text
    return formatTooltipHtml(value);
  }

  function init() {
    var tooltipEl = createTooltipEl();
    var contentEl = tooltipEl.querySelector('.help-tooltip-content');

    document.querySelectorAll('[data-tooltip]').forEach(function(target) {
      // Skip elements already initialized (prevents duplicate event listeners on reinit)
      if (target.hasAttribute('data-tooltip-init')) return;
      target.setAttribute('data-tooltip-init', '1');

      var key = target.dataset.tooltip;

      // Skip elements that are already help-icon spans (inline tooltips with custom text)
      if (target.classList.contains('help-icon')) {
        var icon = target;
        if (!icon.style.cssText) {
          icon.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:var(--primary-bg, #e8eaf6);color:var(--primary-light, #3949ab);font-size:11px;font-weight:700;cursor:help;margin-left:4px;vertical-align:middle;flex-shrink:0;border:1px solid rgba(63,81,181,.15);transition:all .15s;';
        }
        icon.setAttribute('tabindex', '0');
        icon.setAttribute('role', 'button');
        icon.setAttribute('aria-expanded', 'false');
        icon.setAttribute('aria-label', 'Help');
        icon.addEventListener('mouseenter', function() {
          contentEl.innerHTML = resolveTooltip(icon.dataset.tooltip);
          tooltipEl.style.opacity = '1';
          tooltipEl.style.pointerEvents = 'auto';
          icon.setAttribute('aria-expanded', 'true');
          positionTooltip(tooltipEl, icon.getBoundingClientRect());
        });
        icon.addEventListener('mouseleave', function() { tooltipEl.style.opacity = '0'; tooltipEl.style.pointerEvents = 'none'; icon.setAttribute('aria-expanded', 'false'); });
        icon.addEventListener('focus', function() {
          contentEl.innerHTML = resolveTooltip(icon.dataset.tooltip);
          tooltipEl.style.opacity = '1';
          tooltipEl.style.pointerEvents = 'auto';
          icon.setAttribute('aria-expanded', 'true');
          positionTooltip(tooltipEl, icon.getBoundingClientRect());
        });
        icon.addEventListener('blur', function() { tooltipEl.style.opacity = '0'; tooltipEl.style.pointerEvents = 'none'; icon.setAttribute('aria-expanded', 'false'); });
        return;
      }

      // Grade badges: show tooltip directly on hover without adding a ? icon
      if (target.classList.contains('grade') || target.classList.contains('overall-grade') || target.classList.contains('summary-grade-circle')) {
        target.style.cursor = 'help';
        target.addEventListener('mouseenter', function() {
          contentEl.innerHTML = resolveTooltip(target.dataset.tooltip);
          tooltipEl.style.opacity = '1';
          tooltipEl.style.pointerEvents = 'auto';
          positionTooltip(tooltipEl, target.getBoundingClientRect());
        });
        target.addEventListener('mouseleave', function() { tooltipEl.style.opacity = '0'; tooltipEl.style.pointerEvents = 'none'; });
        target.addEventListener('focus', function() {
          contentEl.innerHTML = resolveTooltip(target.dataset.tooltip);
          tooltipEl.style.opacity = '1';
          tooltipEl.style.pointerEvents = 'auto';
          positionTooltip(tooltipEl, target.getBoundingClientRect());
        });
        target.addEventListener('blur', function() { tooltipEl.style.opacity = '0'; tooltipEl.style.pointerEvents = 'none'; });
        return;
      }

      // Skip if this element already has a help-icon child or adjacent sibling
      if (target.querySelector('.help-icon')) return;
      if (target.nextElementSibling && target.nextElementSibling.classList.contains('help-icon') && target.nextElementSibling.hasAttribute('data-dynamic-tooltip')) return;

      // Create question mark icon (marked as dynamically created)
      var icon = document.createElement('span');
      icon.className = 'help-icon';
      icon.setAttribute('data-dynamic-tooltip', '1');
      icon.textContent = '?';
      icon.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:var(--primary-bg, #e8eaf6);color:var(--primary-light, #3949ab);font-size:11px;font-weight:700;cursor:help;margin-left:4px;vertical-align:middle;flex-shrink:0;border:1px solid rgba(63,81,181,.15);transition:all .15s;';

      // Add accessibility attributes
      icon.setAttribute('tabindex', '0');
      icon.setAttribute('role', 'button');
      icon.setAttribute('aria-expanded', 'false');
      icon.setAttribute('aria-label', 'Help');

      // Insert after the target element or inside it
      var tag = target.tagName;
      if (INLINE_TAGS.indexOf(tag) !== -1) {
        target.appendChild(icon);
      } else {
        target.parentNode.insertBefore(icon, target.nextSibling);
      }

      icon.addEventListener('mouseenter', function() {
        var tooltips = getTooltips();
        var data = tooltips[key];
        if (!data) return;

        var titleHtml = data.title ? '<div style="font-weight:700;font-size:14px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,.2)">' + escHtml(data.title) + '</div>' : '';
        var bodyHtml = formatTooltipHtml(data.text || '');
        contentEl.innerHTML = titleHtml + bodyHtml;
        tooltipEl.style.opacity = '1';
        tooltipEl.style.pointerEvents = 'auto';
        icon.setAttribute('aria-expanded', 'true');
        positionTooltip(tooltipEl, icon.getBoundingClientRect());
      });

      icon.addEventListener('mouseleave', function() {
        tooltipEl.style.opacity = '0';
        tooltipEl.style.pointerEvents = 'none';
        icon.setAttribute('aria-expanded', 'false');
      });

      icon.addEventListener('focus', function() {
        var tooltips = getTooltips();
        var data = tooltips[key];
        if (!data) return;
        var titleHtml = data.title ? '<div style="font-weight:700;font-size:14px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,.2)">' + escHtml(data.title) + '</div>' : '';
        var bodyHtml = formatTooltipHtml(data.text || '');
        contentEl.innerHTML = titleHtml + bodyHtml;
        tooltipEl.style.opacity = '1';
        tooltipEl.style.pointerEvents = 'auto';
        icon.setAttribute('aria-expanded', 'true');
        positionTooltip(tooltipEl, icon.getBoundingClientRect());
      });
      icon.addEventListener('blur', function() { tooltipEl.style.opacity = '0'; tooltipEl.style.pointerEvents = 'none'; icon.setAttribute('aria-expanded', 'false'); });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }

  // Clear init flags so elements get re-bound to the new tooltip container
  function clearInitFlags() {
    document.querySelectorAll('[data-tooltip-init]').forEach(function(el) {
      el.removeAttribute('data-tooltip-init');
    });
  }

  // Re-initialize on language change
  document.addEventListener('langchange', function() {
    // Only remove dynamically-created help-icons (those added by init()),
    // NOT help-icons hard-coded in the HTML source (which carry their own data-tooltip)
    document.querySelectorAll('.help-icon').forEach(function(i) {
      if (i.hasAttribute('data-dynamic-tooltip')) i.remove();
    });
    document.querySelectorAll('.help-tooltip').forEach(function(t) { t.remove(); });
    clearInitFlags();
    setTimeout(init, 50);
  });

  // Expose reinit for dynamically rendered content (e.g., challenge-run phases)
  window.reinitTooltips = function() {
    // Remove old tooltip containers (keep help-icons that are part of dynamic content)
    document.querySelectorAll('.help-tooltip').forEach(function(t) { t.remove(); });
    clearInitFlags();
    setTimeout(init, 20);
  };
})();
