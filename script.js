// Proste przełączanie sekcji bez przeładowania strony.
const buttons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const root = document.documentElement;
const desktopQuery = window.matchMedia('(min-width: 1080px)');

function openSidebar() {
  document.body.classList.add('sidebar-open');

  if (menuToggle) {
    menuToggle.setAttribute('aria-expanded', 'true');
  }
}

function closeSidebar() {
  document.body.classList.remove('sidebar-open');

  if (menuToggle) {
    menuToggle.setAttribute('aria-expanded', 'false');
  }
}

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

    if (!desktopQuery.matches) {
      closeSidebar();
    }
  });
});

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.contains('sidebar-open');

    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
}

if (sidebarBackdrop) {
  sidebarBackdrop.addEventListener('click', closeSidebar);
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeSidebar();
  }
});

desktopQuery.addEventListener('change', (event) => {
  if (event.matches) {
    closeSidebar();
  }
});

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });
}

initTheme();
closeSidebar();
