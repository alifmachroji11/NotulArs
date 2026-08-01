/* NotulArs — light/dark theme picker, shared by index.html & app.html
   Default tampilan: light mode, kecuali pengguna sudah pernah memilih gelap. */
(function () {
  var saved = localStorage.getItem('notulars_theme');
  var initial = saved === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', initial);
})();

function setTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
  localStorage.setItem('notulars_theme', mode);
  updateThemeSwitchUI();
}

function updateThemeSwitchUI() {
  var current = document.documentElement.getAttribute('data-theme') || 'light';
  document.querySelectorAll('[data-theme-opt]').forEach(function (btn) {
    btn.classList.toggle('is-active', btn.getAttribute('data-theme-opt') === current);
  });
}

document.addEventListener('DOMContentLoaded', updateThemeSwitchUI);
