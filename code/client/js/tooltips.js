/**
 * Tooltip Help System for AI CoReasoning Lab
 * Adds ? icons next to elements with data-tooltip="key" attributes
 * Loads multilingual text from compiled content
 */
(function() {
  'use strict';

  var TOOLTIP_OFFSET = 8;

  function getTooltips() {
    var lang = document.documentElement.lang || 'en';
    if (window.CONTENT && window.CONTENT[lang] && window.CONTENT[lang].tooltips) {
      return window.CONTENT[lang].tooltips;
    }
    if (window.CONTENT && window.CONTENT.en && window.CONTENT.en.tooltips) {
      return window.CONTENT.en.tooltips;
    }
    return {};
  }

  function createTooltipEl() {
    var el = document.createElement('div');
    el.className = 'help-tooltip';
    el.innerHTML = '<div class="help-tooltip-title"></div><div class="help-tooltip-text"></div>';
    el.style.cssText = 'position:fixed;z-index:10000;background:#1a237e;color:#fff;padding:10px 14px;border-radius:8px;font-size:13px;max-width:280px;box-shadow:0 4px 20px rgba(0,0,0,.25);pointer-events:none;opacity:0;transition:opacity .15s;line-height:1.4;';
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

      // Create question mark icon
      var icon = document.createElement('span');
      icon.className = 'help-icon';
      icon.textContent = '?';
      icon.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:#e8eaf6;color:#3949ab;font-size:10px;font-weight:700;cursor:help;margin-left:4px;vertical-align:middle;flex-shrink:0;';

      // Insert after the target element or inside it
      var tag = target.tagName;
      if (tag === 'LABEL' || tag === 'H1' || tag === 'H2' || tag === 'H3' || tag === 'SPAN' || tag === 'TH') {
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
          if (ttRect.right > window.innerWidth - 10) {
            tooltipEl.style.left = (window.innerWidth - ttRect.width - 10) + 'px';
            tooltipEl.style.transform = 'none';
          }
          if (ttRect.left < 10) {
            tooltipEl.style.left = '10px';
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

  // Re-initialize on language change
  window.addEventListener('languageChanged', function() {
    document.querySelectorAll('.help-icon').forEach(function(i) { i.remove(); });
    setTimeout(init, 50);
  });
})();
