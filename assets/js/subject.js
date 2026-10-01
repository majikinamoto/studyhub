import { getCatalog, getQuestionStore, getQueryParam } from "./dataService.js";

import { mountRangeSelection } from "./rangeSelection.js";

const courseId = getQueryParam("course", "kosen-1-chemistry");
const subjectTitle = document.querySelector("#subject-title");
const subjectBreadcrumb = document.querySelector("#subject-breadcrumb");
const subjectDescription = document.querySelector("#subject-description");
const chapterListTitle = document.querySelector("#chapter-list-title");
const chapterListCopy = document.querySelector("#chapter-list-copy");
const chapterList = document.querySelector("#chapter-list");
const schoolBreadcrumbLink = document.querySelector("#school-breadcrumb-link");
const gradeBreadcrumbLink = document.querySelector("#grade-breadcrumb-link");

try {
  const [catalog, questionStore] = await Promise.all([getCatalog(), getQuestionStore()]);
  const course = catalog.courses.find((item) => item.id === courseId) || catalog.courses[0];

  document.title = `${course.gradeName} ${course.subjectName} | StudyHub`;
  subjectTitle.textContent = `${course.gradeName} ${course.subjectName}`;
  subjectBreadcrumb.textContent = course.subjectName;
  subjectDescription.textContent = course.description;

  if (course.gradeId === "entrance-exam") {
    schoolBreadcrumbLink.href = "./entrance-exam.html";
    schoolBreadcrumbLink.textContent = "高校受験";
    gradeBreadcrumbLink.hidden = true;
  } else if (course.gradeId === "junior-high") {
    schoolBreadcrumbLink.href = `./subjects.html?grade=${encodeURIComponent(course.gradeId)}`;
    schoolBreadcrumbLink.textContent = course.gradeName;
    gradeBreadcrumbLink.hidden = true;
  } else {
    gradeBreadcrumbLink.href = `./subjects.html?grade=${encodeURIComponent(course.gradeId)}`;
    gradeBreadcrumbLink.textContent = course.gradeName;
  }

  if (course.materialTitle) {
    chapterListTitle.textContent = course.materialTitle;
    chapterListCopy.textContent = "学習したい分野を選んでください。";
  }

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
        <a class="secondary-button" href="${course.gradeId === "entrance-exam" ? "./entrance-exam.html" : `./subjects.html?grade=${encodeURIComponent(course.gradeId)}`}">教科一覧へ戻る</a>
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
        ${chapter.available === false && !chapter.learningSections?.length
          ? '<span class="primary-button is-disabled" aria-disabled="true">準備中</span>'
          : `<a class="primary-button" href="./chapter.html?chapter=${encodeURIComponent(chapter.id)}">開く</a>`}
      </article>
    `).join("");
    mountRangeSelection(chapterList, course, course.chapters.map(c => ({ id: c.id, title: c.title, type: "chapter", count: c.available === false ? 0 : (questionStore.questionsByChapter.get(c.id) || []).length })));
  }
} catch (error) {
  console.warn(error);
  chapterList.innerHTML = "<p>章データを読み込めませんでした。</p>";
}
