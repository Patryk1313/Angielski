// Proste przełączanie sekcji bez przeładowania strony.
const buttons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function setTheme(themeName) {
  root.setAttribute('data-theme', themeName);
  localStorage.setItem('theme', themeName);

  if (themeToggle) {
    const nextMode = themeName === 'dark' ? 'dzienny' : 'nocny';
    themeToggle.textContent = `Przelacz na tryb ${nextMode}`;
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  setTheme(initialTheme);
}

function activateSection(targetId) {
  sections.forEach((section) => {
    section.classList.toggle('active', section.id === targetId);
  });

  buttons.forEach((button) => {
    button.classList.toggle('active', button.dataset.target === targetId);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    activateSection(button.dataset.target);
  });
});

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });
}

initTheme();
