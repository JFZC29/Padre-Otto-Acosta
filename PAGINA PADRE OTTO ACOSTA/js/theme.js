/* ==========================================================================
   theme.js — Modo claro / oscuro
   ========================================================================== */

(function () {
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#131013' : '#D81B26';
  }

  function currentTheme() {
    const saved = localStorage.getItem('fya_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }

  function initTheme() {
    applyTheme(currentTheme());
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        localStorage.setItem('fya_theme', next);
        applyTheme(next);
      });
    }
  }

  window.fyaTheme = { init: initTheme, apply: applyTheme, current: currentTheme };
})();