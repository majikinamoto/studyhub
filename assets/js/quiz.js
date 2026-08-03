import { getCatalog, getQuestionStore, getQueryParam } from "./dataService.js";

const unitId = getQueryParam("unit", "");
const chapterId = getQueryParam("chapter", "");
const chapterLabel = document.querySelector("#chapter-label");
const questionNumber = document.querySelector("#question-number");
const quizProgress = document.querySelector("#quiz-progress");
const randomToggle = document.querySelector("#random-toggle");
const questionText = document.querySelector("#question-text");
const quizForm = document.querySelector("#quiz-form");
const resultBox = document.querySelector("#result-box");
const resultMessage = document.querySelector("#result-message");
const explanationText = document.querySelector("#explanation-text");
const nextButton = document.querySelector("#next-button");
const quizTitle = document.querySelector("h1");
const subjectBreadcrumbLink = document.querySelector('a[href="./subject.html?course=kosen-1-chemistry"]');

let baseQuestions = [];
let questions = [];
let currentIndex = 0;
let answered = false;

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function shuffleQuestions(items) {
  const shuffled = [...items];

  // Fisher-Yates shuffle. 500問程度でも軽く、毎回同じ配列を壊しません。
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function findCourseByChapter(catalog, targetChapterId) {
  return catalog.courses.find((course) => course.chapters.some((chapter) => chapter.id === targetChapterId));
}

function findChapter(course, targetChapterId) {
  return course?.chapters.find((chapter) => chapter.id === targetChapterId);
}

function setQuestionOrder() {
  questions = randomToggle.checked ? shuffleQuestions(baseQuestions) : [...baseQuestions];
  currentIndex = 0;
}

function renderQuestion() {
  const question = questions[currentIndex];
  answered = false;

  // 画面上の問題番号は表示順から自動計算します。JSON側のorderは並び順管理専用です。
  questionNumber.textContent = `問題 ${currentIndex + 1}`;
  quizProgress.textContent = `${currentIndex + 1} / ${questions.length}`;
  questionText.textContent = question.text;
  resultBox.hidden = true;
  nextButton.hidden = true;

  // choices配列へ追加するだけで、選択肢の表示も自動で増やせます。
  quizForm.innerHTML = `
    ${question.choices.map((choice) => `
      <label class="choice-card">
        <input type="radio" name="choice" value="${escapeHtml(choice.id)}">
        <span>${escapeHtml(choice.text)}</span>
      </label>
    `).join("")}
    <button class="primary-button wide-button" type="submit">回答する</button>
  `;
}

function showAnswer(selectedChoiceId) {
  const question = questions[currentIndex];
  const isCorrect = selectedChoiceId === question.correctChoiceId;

  answered = true;
  resultBox.hidden = false;
  resultBox.className = isCorrect ? "result-box is-correct" : "result-box is-wrong";
  resultMessage.textContent = isCorrect ? "正解です。" : "不正解です。";
  explanationText.textContent = question.explanation;
  nextButton.hidden = false;
  nextButton.textContent = currentIndex + 1 < questions.length ? "次の問題" : "最初からもう一度";

  quizForm.querySelectorAll("input").forEach((input) => {
    input.disabled = true;
  });
}

function showMissing(message) {
  chapterLabel.textContent = "問題データなし";
  if (quizTitle) {
    quizTitle.textContent = "確認問題";
  }
  questionText.textContent = message;
  quizProgress.textContent = "0 / 0";
  quizForm.innerHTML = "";
  resultBox.hidden = true;
  nextButton.hidden = true;
}

try {
  const [catalog, questionStore] = await Promise.all([getCatalog(), getQuestionStore()]);
  let course;
  let chapter;
  let unit;

  if (unitId) {
    unit = questionStore.units.find((item) => item.id === unitId);
    course = unit ? findCourseByChapter(catalog, unit.chapterId) : null;
    chapter = course && unit ? findChapter(course, unit.chapterId) : null;
    baseQuestions = unit ? questionStore.questionsByUnit.get(unit.id) || [] : [];
  } else {
    const targetChapterId = chapterId || "chapter-09";
    course = findCourseByChapter(catalog, targetChapterId);
    chapter = course ? findChapter(course, targetChapterId) : null;
    baseQuestions = chapter ? questionStore.questionsByChapter.get(chapter.id) || [] : [];
  }

  if (!course || !chapter || (unitId && !unit)) {
    showMissing("指定された問題データが見つかりません。");
  } else if (baseQuestions.length === 0) {
    showMissing("この範囲の問題はまだありません。");
  } else {
    const rangeLabel = unit ? `${chapter.number} ${unit.title}` : chapter.number;
    chapterLabel.textContent = `${course.gradeName} ${course.subjectName} ${rangeLabel}`;
    if (quizTitle) {
      quizTitle.textContent = unit ? unit.title : "確認問題";
    }
    if (subjectBreadcrumbLink) {
      subjectBreadcrumbLink.href = `./subject.html?course=${encodeURIComponent(course.id)}`;
      subjectBreadcrumbLink.textContent = course.subjectName;
    }
    setQuestionOrder();
    renderQuestion();
  }
} catch (error) {
  console.warn(error);
  showMissing("問題データを読み込めませんでした。");
}

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (answered || questions.length === 0) {
    return;
  }

  const selectedChoiceId = new FormData(quizForm).get("choice");

  if (!selectedChoiceId) {
    resultBox.hidden = false;
    resultBox.className = "result-box is-wrong";
    resultMessage.textContent = "選択肢を1つ選んでください。";
    explanationText.textContent = "";
    return;
  }

  showAnswer(selectedChoiceId);
});

nextButton.addEventListener("click", () => {
  currentIndex = currentIndex + 1 < questions.length ? currentIndex + 1 : 0;
  renderQuestion();
});

randomToggle.addEventListener("change", () => {
  if (baseQuestions.length === 0) {
    return;
  }

  setQuestionOrder();
  renderQuestion();
});