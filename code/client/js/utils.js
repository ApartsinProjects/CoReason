// Shared utility functions for CoReason
(function() {
  // HTML escaping
  window.escHtml = function(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  };

  // Capitalize first letter
  window.capitalize = function(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  };

  // Toast notification system
  window.showToast = function(message, type, duration) {
    type = type || 'info';
    duration = duration || 4000;
    var existing = document.querySelectorAll('.toast-notification');
    existing.forEach(function(el) { el.remove(); });

    var toast = document.createElement('div');
    toast.className = 'toast-notification toast-' + type;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(function() {
      toast.classList.add('toast-visible');
    });

    setTimeout(function() {
      toast.classList.remove('toast-visible');
      setTimeout(function() { toast.remove(); }, 300);
    }, duration);
  };
})();
