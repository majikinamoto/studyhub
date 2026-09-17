import { getCatalog, getQueryParam } from "./dataService.js";

const gradeTitle = document.querySelector("#grade-title");
const subjectListTitle = document.querySelector("#subject-list-title");
const subjectList = document.querySelector("#subject-list");
const schoolBreadcrumbLink = document.querySelector("#school-breadcrumb-link");
const gradeBreadcrumb = document.querySelector("#grade-breadcrumb");
const grade = getQueryParam("grade", "kosen-1");

try {
  const catalog = await getCatalog();
  const courses = catalog.courses.filter((course) => course.gradeId === grade);

  if (courses.length === 0) {
    gradeTitle.textContent = "学年";
    subjectListTitle.textContent = "教材準備中";
    subjectList.innerHTML = "<p>この学年の教材はまだ準備中です。</p>";
  } else {
    const gradeName = courses[0].gradeName;
    document.title = `${gradeName} | StudyHub`;
    gradeTitle.textContent = gradeName;
    subjectListTitle.textContent = gradeName;
    gradeBreadcrumb.textContent = gradeName;

    if (grade === "junior-high") {
      schoolBreadcrumbLink.hidden = true;
    }

    subjectList.innerHTML = courses.map((course) => `
      <article class="study-card">
        <div>
          <p class="card-label">利用可能</p>
          <h3>${course.subjectName}</h3>
          <p>${course.description}</p>
        </div>
        <a class="primary-button" href="./subject.html?course=${encodeURIComponent(course.id)}">開く</a>
      </article>
    `).join("");
  }
} catch (error) {
  console.warn(error);
}
