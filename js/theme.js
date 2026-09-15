/* ==========================================================================
   THEME SWITCHER MODULE
   Manages Dark and Light mode state, transitions, and persistence
   ========================================================================== */

const ThemeManager = (() => {
  const THEME_STORAGE_KEY = 'yk_portfolio_theme';
  const root = document.documentElement;
  let currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';

  function init() {
    setTheme(currentTheme, false);
    setupToggleListeners();
  }

  function setTheme(theme, playSound = true) {
    currentTheme = theme;
    root.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    if (playSound && window.AudioManager) {
      window.AudioManager.playBlip(theme === 'light' ? 660 : 440);
    }

    // Dispatch custom event for canvas and other modules to update palettes
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme, true);
  }

  function setupToggleListeners() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }

    // Optional lab theme switcher button
    const labThemeBtn = document.getElementById('lab-theme-btn');
    if (labThemeBtn) {
      labThemeBtn.addEventListener('click', toggleTheme);
    }
  }

  function getTheme() {
    return currentTheme;
  }

  return {
    init,
    toggleTheme,
    setTheme,
    getTheme
  };
})();

window.ThemeManager = ThemeManager;
