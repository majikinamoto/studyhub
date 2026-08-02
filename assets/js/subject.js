import { getCatalog, getQueryParam } from "./dataService.js";

const courseId = getQueryParam("course", "kosen-1-chemistry");
const subjectTitle = document.querySelector("#subject-title");
const chapterList = document.querySelector("#chapter-list");

try {
  const catalog = await getCatalog();
  const course = catalog.courses.find((item) => item.id === courseId) || catalog.courses[0];

  subjectTitle.textContent = `${course.gradeName} ${course.subjectName}`;
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
} catch (error) {
  console.warn(error);
  chapterList.innerHTML = "<p>章データを読み込めませんでした。</p>";
}
