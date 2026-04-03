const subjects = [
  { text: "I", third: false },
  { text: "you", third: false },
  { text: "we", third: false },
  { text: "they", third: false },
  { text: "he", third: true },
  { text: "she", third: true },
  { text: "it", third: true }
];

const verbPhrases = [
  { base: "like", third: "likes", rest: "coffee" },
  { base: "work", third: "works", rest: "in a bank" },
  { base: "live", third: "lives", rest: "in Warsaw" },
  { base: "play", third: "plays", rest: "tennis" },
  { base: "watch", third: "watches", rest: "TV in the evening" },
  { base: "read", third: "reads", rest: "books" },
  { base: "drink", third: "drinks", rest: "tea in the morning" },
  { base: "eat", third: "eats", rest: "breakfast at 7:00" },
  { base: "study", third: "studies", rest: "English every day" },
  { base: "go", third: "goes", rest: "to school by bus" }
];

const QUESTION_TARGET = 100;

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function normalizeText(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/\s+/g, " ");
}

function buildQuestionBank(totalQuestions) {
  const bank = [];
  const unique = new Set();

  function addQuestion(prompt, sentence, answers) {
    const key = `${prompt}||${sentence}`;
    if (unique.has(key)) {
      return;
    }

    unique.add(key);
    bank.push({
      prompt,
      sentence,
      answers: Array.isArray(answers) ? answers : [answers]
    });
  }

  while (bank.length < totalQuestions) {
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const verb = verbPhrases[Math.floor(Math.random() * verbPhrases.length)];
    const sentenceSubject = capitalize(subject.text);
    const questionSubject = subject.text === "I" ? "I" : subject.text;

    const templateType = Math.floor(Math.random() * 8);

    switch (templateType) {
      case 0:
        addQuestion(
          "Wpisz forme czasownika (like/likes)",
          `${sentenceSubject} ___ ${verb.rest}.`,
          subject.third ? verb.third : verb.base
        );
        break;

      case 1:
        addQuestion(
          "Wpisz operator pytania (do/does)",
          `___ ${questionSubject} ${verb.base} ${verb.rest}?`,
          subject.third ? "does" : "do"
        );
        break;

      case 2:
        addQuestion(
          "Wpisz operator przeczenia (do/does)",
          `${sentenceSubject} ___ not ${verb.base} ${verb.rest}.`,
          subject.third ? "does" : "do"
        );
        break;

      case 3:
        addQuestion(
          "Wpisz pelna forme przeczenia (do not/does not)",
          `${sentenceSubject} ___ ${verb.base} ${verb.rest}.`,
          subject.third ? "does not" : "do not"
        );
        break;

      case 4:
        addQuestion(
          "Wpisz skrocona forme przeczenia (don't/doesn't)",
          `${sentenceSubject} ___ ${verb.base} ${verb.rest}.`,
          subject.third ? ["doesn't", "doesnt"] : ["don't", "dont"]
        );
        break;

      case 5:
        addQuestion(
          "Po does wpisz forme podstawowa czasownika",
          `Does ${questionSubject} ___ ${verb.rest}?`,
          verb.base
        );
        break;

      case 6:
        addQuestion(
          "Po do wpisz forme podstawowa czasownika",
          `Do ${questionSubject} ___ ${verb.rest}?`,
          verb.base
        );
        break;

      default:
        addQuestion(
          "Wpisz brakujace slowo: do / does / like / likes",
          `${sentenceSubject} ___ ${verb.rest}.`,
          subject.third ? verb.third : verb.base
        );
        break;
    }
  }

  return bank.slice(0, totalQuestions);
}

const questions = buildQuestionBank(QUESTION_TARGET);

const sentenceEl = document.getElementById("quizSentence");
const typeEl = document.getElementById("quizType");
const inputEl = document.getElementById("answerInput");
const feedbackEl = document.getElementById("quizFeedback");
const metaEl = document.getElementById("quizMeta");
const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");
const themeBtn = document.getElementById("themeToggleQuiz");
const root = document.documentElement;

let currentIndex = -1;
let answeredCount = 0;
let correctCount = 0;
let answeredCurrent = false;
let solvedCurrent = false;

function setTheme(themeName) {
  root.setAttribute("data-theme", themeName);
  localStorage.setItem("theme", themeName);

  if (themeBtn) {
    const nextMode = themeName === "dark" ? "dzienny" : "nocny";
    themeBtn.textContent = `Przelacz na tryb ${nextMode}`;
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  setTheme(initialTheme);
}

function updateMeta() {
  const questionNumber = currentIndex >= 0 ? currentIndex + 1 : "-";
  metaEl.textContent = `Pytanie: ${questionNumber} / ${questions.length} | Wynik: ${correctCount} / ${answeredCount}`;
}

function pickRandomIndex() {
  if (questions.length <= 1) {
    return 0;
  }

  let nextIndex = 0;
  do {
    nextIndex = Math.floor(Math.random() * questions.length);
  } while (nextIndex === currentIndex);

  return nextIndex;
}

function showQuestion() {
  currentIndex = pickRandomIndex();
  answeredCurrent = false;
  solvedCurrent = false;
  feedbackEl.textContent = "";
  feedbackEl.classList.remove("ok", "bad");

  const question = questions[currentIndex];
  if (typeEl) {
    typeEl.textContent = question.prompt;
  }
  sentenceEl.innerHTML = question.sentence.replace("___", '<span class="quiz-blank">___</span>');
  inputEl.value = "";
  inputEl.focus();
  updateMeta();
}

function checkAnswer() {
  if (currentIndex < 0) {
    return;
  }

  const question = questions[currentIndex];
  const userAnswer = normalizeText(inputEl.value);
  const acceptedAnswers = question.answers.map((answer) => normalizeText(answer));
  const isCorrect = acceptedAnswers.includes(userAnswer);

  if (!answeredCurrent) {
    answeredCount += 1;
    answeredCurrent = true;
  }

  if (isCorrect) {
    if (!solvedCurrent) {
      correctCount += 1;
      solvedCurrent = true;
    }
    feedbackEl.textContent = "Dobrze! Poprawna odpowiedz.";
    feedbackEl.classList.remove("bad");
    feedbackEl.classList.add("ok");
    updateMeta();
    return;
  }

  feedbackEl.textContent = `Jeszcze nie. Poprawna odpowiedz: ${question.answers[0]}`;
  feedbackEl.classList.remove("ok");
  feedbackEl.classList.add("bad");
  updateMeta();
}

if (checkBtn) {
  checkBtn.addEventListener("click", checkAnswer);
}

if (nextBtn) {
  nextBtn.addEventListener("click", showQuestion);
}

if (inputEl) {
  inputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      checkAnswer();
    }
  });
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
}

initTheme();
showQuestion();
