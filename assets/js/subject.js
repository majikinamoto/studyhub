import { getCatalog, getQueryParam } from "./dataService.js";

const courseId = getQueryParam("course", "kosen-1-chemistry");
const subjectTitle = document.querySelector("#subject-title");
const subjectBreadcrumb = document.querySelector("#subject-breadcrumb");
const subjectDescription = document.querySelector("#subject-description");
const chapterListTitle = document.querySelector("#chapter-list-title");
const chapterListCopy = document.querySelector("#chapter-list-copy");
const chapterList = document.querySelector("#chapter-list");

try {
  const catalog = await getCatalog();
  const course = catalog.courses.find((item) => item.id === courseId) || catalog.courses[0];

  subjectTitle.textContent = `${course.gradeName} ${course.subjectName}`;
  subjectBreadcrumb.textContent = course.subjectName;
  subjectDescription.textContent = course.description;

  if (course.chapters.length === 0) {
    chapterListTitle.textContent = "教材準備中";
    chapterListCopy.textContent = "この教科の問題はまだ準備中です。";
    chapterList.innerHTML = `
      <article class="study-card">
        <div>
          <p class="card-label">教材準備中</p>
          <h3>${course.subjectName}</h3>
          <p>${course.description}</p>
        </div>
        <a class="secondary-button" href="./subjects.html?grade=${course.gradeId}">教科一覧へ戻る</a>
      </article>
    `;
  } else {
    chapterList.innerHTML = course.chapters.map((chapter) => `
      <article class="study-card">
        <div>
          <p class="card-label">${chapter.number}</p>
          <h3>${chapter.title}</h3>
          <p>${chapter.description}</p>
        </div>
        <a class="primary-button" href="./chapter.html?chapter=${chapter.id}">開く</a>
      </article>
    `).join("");
  }
} catch (error) {
  console.warn(error);
  chapterList.innerHTML = "<p>章データを読み込めませんでした。</p>";
}
