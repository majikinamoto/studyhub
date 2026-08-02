import { getCatalog, getQuestionStore, getQueryParam } from "./dataService.js";

const chapterId = getQueryParam("chapter", "chapter-09");
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

try {
  const [catalog, questionStore] = await Promise.all([getCatalog(), getQuestionStore()]);
  const course = catalog.courses[0];
  const chapter = course.chapters.find((item) => item.id === chapterId) || course.chapters[0];

  chapterLabel.textContent = `${course.gradeName} ${course.subjectName} ${chapter.number}`;
  baseQuestions = questionStore.questionsByChapter.get(chapter.id) || [];

  if (baseQuestions.length === 0) {
    questionText.textContent = "この章の問題はまだありません。";
    quizForm.innerHTML = "";
  } else {
    setQuestionOrder();
    renderQuestion();
  }
} catch (error) {
  console.warn(error);
  questionText.textContent = "問題データを読み込めませんでした。";
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
