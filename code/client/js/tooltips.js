/**
 * Tooltip Help System for AI CoReasoning Lab
 * Adds ? icons next to elements with data-tooltip="key" attributes
 * Loads multilingual text from compiled content
 */
(function() {
  'use strict';

  var TOOLTIP_OFFSET = 8;
  var FALLBACK_LANG = 'en';
  var VIEWPORT_PADDING = 10;
  var TOOLTIP_MAX_WIDTH = 280;
  var TOOLTIP_Z_INDEX = 10000;

  // Tags that should receive the icon as a child element
  var INLINE_TAGS = ['LABEL', 'H1', 'H2', 'H3', 'SPAN', 'TH'];

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

  function createTooltipEl() {
    var el = document.createElement('div');
    el.className = 'help-tooltip';
    el.innerHTML = '<div class="help-tooltip-title"></div><div class="help-tooltip-text"></div>';
    el.style.cssText = 'position:fixed;z-index:' + TOOLTIP_Z_INDEX + ';background:var(--primary, #1a237e);color:#fff;padding:10px 14px;border-radius:var(--radius, 8px);font-size:13px;max-width:' + TOOLTIP_MAX_WIDTH + 'px;box-shadow:0 4px 20px rgba(0,0,0,.25);pointer-events:none;opacity:0;transition:opacity .15s;line-height:1.4;';
    document.body.appendChild(el);
    return el;
  }

  function init() {
    var tooltipEl = createTooltipEl();
    var titleEl = tooltipEl.querySelector('.help-tooltip-title');
    var textEl = tooltipEl.querySelector('.help-tooltip-text');
    titleEl.style.cssText = 'font-weight:700;margin-bottom:4px;font-size:13px;';
    textEl.style.cssText = 'font-weight:400;font-size:12px;opacity:.9;';

    document.querySelectorAll('[data-tooltip]').forEach(function(target) {
      var key = target.dataset.tooltip;

      // Skip elements that are already help-icon spans (inline tooltips with custom text)
      if (target.classList.contains('help-icon')) {
        // This is an inline help icon with custom tooltip text — use it directly as the icon
        var icon = target;
        if (!icon.style.cssText) {
          icon.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:var(--primary-bg, #e8eaf6);color:var(--primary-light, #3949ab);font-size:10px;font-weight:700;cursor:help;margin-left:4px;vertical-align:middle;flex-shrink:0;';
        }
        // Attach tooltip behavior for inline text (not from YAML key)
        icon.addEventListener('mouseenter', function(e) {
          var inlineText = icon.dataset.tooltip;
          titleEl.textContent = '';
          textEl.textContent = inlineText || '';
          tooltipEl.style.opacity = '1';
          var rect = icon.getBoundingClientRect();
          var left = rect.left + rect.width / 2;
          var top = rect.bottom + TOOLTIP_OFFSET;
          tooltipEl.style.left = left + 'px';
          tooltipEl.style.top = top + 'px';
          tooltipEl.style.transform = 'translateX(-50%)';
          requestAnimationFrame(function() {
            var ttRect = tooltipEl.getBoundingClientRect();
            if (ttRect.right > window.innerWidth - VIEWPORT_PADDING) { tooltipEl.style.left = (window.innerWidth - ttRect.width - VIEWPORT_PADDING) + 'px'; tooltipEl.style.transform = 'none'; }
            if (ttRect.left < VIEWPORT_PADDING) { tooltipEl.style.left = VIEWPORT_PADDING + 'px'; tooltipEl.style.transform = 'none'; }
            if (ttRect.bottom > window.innerHeight) { tooltipEl.style.top = (rect.top - ttRect.height - TOOLTIP_OFFSET) + 'px'; }
          });
        });
        icon.addEventListener('mouseleave', function() { tooltipEl.style.opacity = '0'; });
        return; // skip creating a new icon
      }

      // Skip if this element already has a help-icon child (avoid duplicates)
      if (target.querySelector('.help-icon')) return;

      // Create question mark icon
      var icon = document.createElement('span');
      icon.className = 'help-icon';
      icon.textContent = '?';
      icon.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:var(--primary-bg, #e8eaf6);color:var(--primary-light, #3949ab);font-size:10px;font-weight:700;cursor:help;margin-left:4px;vertical-align:middle;flex-shrink:0;';

      // Insert after the target element or inside it
      var tag = target.tagName;
      if (INLINE_TAGS.indexOf(tag) !== -1) {
        target.appendChild(icon);
      } else {
        target.parentNode.insertBefore(icon, target.nextSibling);
      }

      icon.addEventListener('mouseenter', function(e) {
        var tooltips = getTooltips();
        var data = tooltips[key];
        if (!data) return;
        titleEl.textContent = data.title || key;
        textEl.textContent = data.text || '';
        tooltipEl.style.opacity = '1';

        var rect = icon.getBoundingClientRect();
        var left = rect.left + rect.width / 2;
        var top = rect.bottom + TOOLTIP_OFFSET;

        // Reposition to stay in viewport
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
            tooltipEl.style.top = (rect.top - ttRect.height - TOOLTIP_OFFSET) + 'px';
          }
        });
      });

      icon.addEventListener('mouseleave', function() {
        tooltipEl.style.opacity = '0';
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Small delay to ensure content is compiled and loaded
    setTimeout(init, 100);
  }

  // Re-initialize on language change (content-loader dispatches 'langchange')
  document.addEventListener('langchange', function() {
    document.querySelectorAll('.help-icon').forEach(function(i) { i.remove(); });
    setTimeout(init, 50);
  });
})();
