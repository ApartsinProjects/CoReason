/**
 * CoReason Help Popups
 * Loads and displays linked HTML help files as modal overlays.
 */
'use strict';

const HelpPopups = (() => {
  let modal = null;
  const cache = {};

  function createModal() {
    if (modal) return;
    const style = document.createElement('style');
    style.textContent = `
      .help-modal-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.5);
        z-index: 9000; display: flex; align-items: center; justify-content: center;
      }
      .help-modal {
        background: white; border-radius: 12px; max-width: 600px; width: 90vw;
        max-height: 80vh; overflow-y: auto; padding: 32px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.2); position: relative;
      }
      .help-modal-close {
        position: absolute; top: 12px; right: 16px;
        background: none; border: none; font-size: 1.5rem;
        cursor: pointer; color: #999; line-height: 1;
      }
      .help-modal-close:hover { color: #333; }
      .help-modal h2 { color: var(--primary, #1a237e); margin-top: 0; }
      .help-modal h3 { color: var(--teal, #00695c); }
      .help-modal p { line-height: 1.7; color: #444; }
      .help-modal ul, .help-modal ol { color: #444; line-height: 1.7; }
      .help-modal code { background: #f5f6fa; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
      .help-icon {
        display: inline-flex; align-items: center; justify-content: center;
        width: 20px; height: 20px; border-radius: 50%;
        background: var(--teal, #00695c); color: white;
        font-size: 0.75rem; font-weight: bold;
        cursor: pointer; text-decoration: none;
        margin-left: 6px; vertical-align: middle;
      }
      .help-icon:hover { opacity: 0.8; }
    `;
    document.head.appendChild(style);
  }

  async function loadHelp(topic) {
    if (cache[topic]) return cache[topic];
    try {
      const res = await fetch(`help/${topic}-help.html`);
      if (!res.ok) throw new Error(`Help file not found: ${topic}`);
      const html = await res.text();
      cache[topic] = html;
      return html;
    } catch (err) {
      console.warn('[Help] Failed to load:', topic, err);
      return `<h2>Help</h2><p>Help content for "${topic}" is not available yet.</p>`;
    }
  }

  async function show(topic) {
    createModal();
    const content = await loadHelp(topic);

    const overlay = document.createElement('div');
    overlay.className = 'help-modal-overlay';
    overlay.innerHTML = `
      <div class="help-modal">
        <button class="help-modal-close" aria-label="Close">&times;</button>
        ${content}
      </div>
    `;

    overlay.querySelector('.help-modal-close').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    document.body.appendChild(overlay);
    modal = overlay;

    // Close on Escape
    const escHandler = (e) => {
      if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', escHandler); }
    };
    document.addEventListener('keydown', escHandler);
  }

  // Auto-attach to all [data-help] elements
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
      const helpEl = e.target.closest('[data-help]');
      if (helpEl) {
        e.preventDefault();
        show(helpEl.dataset.help);
      }
    });
  });

  return { show, loadHelp };
})();

if (typeof window !== 'undefined') {
  window.HelpPopups = HelpPopups;
}
