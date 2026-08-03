import { getCatalog, getQuestionStore, getQueryParam } from "./dataService.js";

const chapterId = getQueryParam("chapter", "chapter-09");
const chapterTitle = document.querySelector("#chapter-title");
const chapterDescription = document.querySelector("#chapter-description");
const startQuizLink = document.querySelector("#start-quiz-link");
const startQuizCard = startQuizLink?.closest(".study-card");
const unitList = document.querySelector("#unit-list");
const chapterKicker = document.querySelector(".app-kicker");
const chapterBreadcrumb = document.querySelector("#chapter-breadcrumb");

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

try {
  const [catalog, questionStore] = await Promise.all([getCatalog(), getQuestionStore()]);
  const course = catalog.courses.find((item) => item.chapters.some((chapter) => chapter.id === chapterId));
  const chapter = course?.chapters.find((item) => item.id === chapterId);

  if (!course || !chapter) {
    chapterTitle.textContent = "章データが見つかりません";
    chapterDescription.textContent = "指定された章を読み込めませんでした。";
    if (startQuizCard) {
      startQuizCard.hidden = true;
    }
  } else {
    const units = (questionStore.units || [])
      .filter((unit) => unit.chapterId === chapter.id)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

    chapterTitle.textContent = chapter.title;
    chapterDescription.textContent = chapter.description;
    if (chapterKicker) {
      chapterKicker.textContent = course.subjectName;
    }
    if (chapterBreadcrumb) {
      chapterBreadcrumb.textContent = chapter.title;
    }

    if (units.length > 0 && chapter.id === "chapter-sports-01") {
      if (startQuizCard) {
        startQuizCard.hidden = true;
      }
      unitList.innerHTML = units.map((unit) => {
        const count = (questionStore.questionsByUnit.get(unit.id) || []).length;
        return `
          <article class="study-card">
            <div>
              <p class="card-label">Unit ${String(unit.order).padStart(2, "0")}</p>
              <h3>${escapeHtml(unit.title)}</h3>
              <p>${count}問</p>
            </div>
            <a class="primary-button" href="./quiz.html?unit=${encodeURIComponent(unit.id)}">開始</a>
          </article>
        `;
      }).join("");
    } else {
      if (startQuizCard) {
        startQuizCard.hidden = false;
      }
      startQuizLink.href = `./quiz.html?chapter=${encodeURIComponent(chapter.id)}`;
      unitList.innerHTML = "";
    }
  }
} catch (error) {
  console.warn(error);
  chapterTitle.textContent = "章データを読み込めませんでした";
  chapterDescription.textContent = "時間をおいてもう一度お試しください。";
  if (startQuizCard) {
    startQuizCard.hidden = true;
  }
}