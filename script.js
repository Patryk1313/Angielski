// Proste przełączanie sekcji bez przeładowania strony.
const buttons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const root = document.documentElement;
const desktopQuery = window.matchMedia('(min-width: 1080px)');

const labSubject = document.getElementById('labSubject');
const labDrawBtn = document.getElementById('labDrawBtn');
const labTask = document.getElementById('labTask');
const labVerbInfo = document.getElementById('labVerbInfo');
const labAnswer = document.getElementById('labAnswer');
const labCheckBtn = document.getElementById('labCheckBtn');
const labRevealBtn = document.getElementById('labRevealBtn');
const labFeedback = document.getElementById('labFeedback');
const labStats = document.getElementById('labStats');

const labVerbPool = [
  {
    base: 'be',
    polish: 'być',
    rest: 'happy today',
    forms: {
      I: 'am',
      you: 'are',
      we: 'are',
      they: 'are',
      he: 'is',
      she: 'is',
      it: 'is',
    },
  },
  { base: 'have', polish: 'mieć', rest: 'a new book', third: 'has' },
  { base: 'go', polish: 'iść / jechać', rest: 'to school by bus', third: 'goes' },
  { base: 'work', polish: 'pracować', rest: 'in a bank', third: 'works' },
  { base: 'play', polish: 'grać', rest: 'chess on Friday', third: 'plays' },
  { base: 'eat', polish: 'jeść', rest: 'breakfast at 7:00', third: 'eats' },
  { base: 'like', polish: 'lubić', rest: 'this music', third: 'likes' },
  { base: 'live', polish: 'mieszkać', rest: 'near the river', third: 'lives' },
];

let labCurrentVerb = null;
let labCurrentAnswer = '';
let labCurrentSolved = false;
let labCurrentAttempted = false;
let labAnswered = 0;
let labCorrect = 0;
let labStreak = 0;

function capitalizeSubject(subject) {
  return subject === 'I' ? 'I' : subject.charAt(0).toUpperCase() + subject.slice(1);
}

function resolveLabForm(subject, verb) {
  if (verb.forms && verb.forms[subject]) {
    return verb.forms[subject];
  }

  const isThird = subject === 'he' || subject === 'she' || subject === 'it';
  return isThird ? verb.third : verb.base;
}

function refreshLabStats() {
  if (!labStats) {
    return;
  }

  labStats.textContent = `Seria: ${labStreak} | Poprawne: ${labCorrect} / ${labAnswered}`;
}

function drawLabVerb() {
  if (!labSubject || !labTask || !labVerbInfo || !labAnswer || !labFeedback) {
    return;
  }

  let nextVerb = labVerbPool[Math.floor(Math.random() * labVerbPool.length)];
  if (labCurrentVerb && labVerbPool.length > 1) {
    while (nextVerb.base === labCurrentVerb.base) {
      nextVerb = labVerbPool[Math.floor(Math.random() * labVerbPool.length)];
    }
  }

  const subject = labSubject.value;
  const displaySubject = capitalizeSubject(subject);
  labCurrentVerb = nextVerb;
  labCurrentAnswer = resolveLabForm(subject, nextVerb);
  labCurrentSolved = false;
  labCurrentAttempted = false;

  labVerbInfo.textContent = `Czasownik: ${nextVerb.base} (${nextVerb.polish})`;
  labTask.innerHTML = `${displaySubject} <span class="quiz-blank">___</span> ${nextVerb.rest}.`;
  labAnswer.value = '';
  labAnswer.focus();

  labFeedback.textContent = '';
  labFeedback.classList.remove('ok', 'bad');
}

function checkLabAnswer() {
  if (!labCurrentVerb || !labAnswer || !labFeedback) {
    return;
  }

  const userValue = labAnswer.value.trim().toLowerCase();
  const expectedValue = labCurrentAnswer.trim().toLowerCase();

  if (!labCurrentAttempted) {
    labAnswered += 1;
    labCurrentAttempted = true;
  }

  if (userValue === expectedValue) {
    if (!labCurrentSolved) {
      labCorrect += 1;
      labStreak += 1;
      labCurrentSolved = true;
    }

    labFeedback.textContent = 'Super! To poprawna forma.';
    labFeedback.classList.remove('bad');
    labFeedback.classList.add('ok');
    refreshLabStats();
    return;
  }

  labStreak = 0;
  labFeedback.textContent = `Jeszcze nie. Poprawna forma: ${labCurrentAnswer}`;
  labFeedback.classList.remove('ok');
  labFeedback.classList.add('bad');
  refreshLabStats();
}

function revealLabAnswer() {
  if (!labCurrentVerb || !labFeedback) {
    return;
  }

  labStreak = 0;
  labFeedback.textContent = `Odpowiedź: ${labCurrentAnswer}`;
  labFeedback.classList.remove('ok');
  labFeedback.classList.add('bad');
  refreshLabStats();
}

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

if (labDrawBtn) {
  labDrawBtn.addEventListener('click', drawLabVerb);
}

if (labCheckBtn) {
  labCheckBtn.addEventListener('click', checkLabAnswer);
}

if (labRevealBtn) {
  labRevealBtn.addEventListener('click', revealLabAnswer);
}

if (labAnswer) {
  labAnswer.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      checkLabAnswer();
    }
  });
}

if (labSubject) {
  labSubject.addEventListener('change', drawLabVerb);
}

initTheme();
closeSidebar();
refreshLabStats();
