/* NotulArs — manual light/dark theme toggle, shared by index.html & app.html */
(function () {
  var saved = localStorage.getItem('notulars_theme');
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.setAttribute('data-theme', saved);
  }
})();

function isDarkActive() {
  var forced = document.documentElement.getAttribute('data-theme');
  if (forced === 'dark') return true;
  if (forced === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function updateThemeToggleIcons() {
  var dark = isDarkActive();
  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.classList.toggle('is-dark', dark);
  });
}

function toggleTheme() {
  var next = isDarkActive() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('notulars_theme', next);
  updateThemeToggleIcons();
}

document.addEventListener('DOMContentLoaded', updateThemeToggleIcons);
