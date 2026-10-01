import { getCatalog, getQuestionStore, getQueryParam } from "./dataService.js";

import { mountRangeSelection } from "./rangeSelection.js";

const chapterId = getQueryParam("chapter", "chapter-09");
const sectionId = getQueryParam("section", "");
const chapterTitle = document.querySelector("#chapter-title");
const chapterDescription = document.querySelector("#chapter-description");
const startQuizLink = document.querySelector("#start-quiz-link");
const startQuizCard = startQuizLink?.closest(".study-card");
const unitList = document.querySelector("#unit-list");
const chapterKicker = document.querySelector(".app-kicker");
const chapterBreadcrumb = document.querySelector("#chapter-breadcrumb");
const subjectBreadcrumbLink = document.querySelector("#subject-breadcrumb-link");
const schoolBreadcrumbLink = document.querySelector("#school-breadcrumb-link");
const gradeBreadcrumbLink = document.querySelector("#grade-breadcrumb-link");

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

try {
  const [catalog, questionStore] = await Promise.all([getCatalog(), getQuestionStore()]);
  const course = catalog.courses.find((item) => item.chapters.some((chapter) => chapter.id === chapterId));
  const chapter = course?.chapters.find((item) => item.id === chapterId);
  const sections = chapter?.learningSections || [];
  const section = sections.find((item) => item.id === sectionId);
  const chapterUnits = (questionStore.units || []).filter((unit) => unit.chapterId === chapterId);
  const unitsForSection = (id) => chapterUnits.filter((unit) => (unit.learningSection || "recall") === id);

  if (sections.length) {
    schoolBreadcrumbLink.href = "./entrance-exam.html";
    schoolBreadcrumbLink.textContent = "高校受験";
    gradeBreadcrumbLink.hidden = true;
    subjectBreadcrumbLink.href = `./subject.html?course=${encodeURIComponent(course.id)}`;
    subjectBreadcrumbLink.textContent = course.subjectName;
    chapterKicker.textContent = course.subjectName;
    document.querySelector(".header-copy").textContent = "学びたい問題の種類と単元を選んでください。";
  }

  if (sections.length && !section) {
    chapterTitle.textContent = chapter.title;
    chapterBreadcrumb.textContent = chapter.title;
    chapterDescription.textContent = "一問一答で重要事項を確認し、資料問題で読み取りや計算を練習します。";
    document.querySelector("#chapter-detail-title").textContent = "問題の種類";
    if (startQuizCard) startQuizCard.hidden = true;
    unitList.innerHTML = sections.map((item) => {
      const units = unitsForSection(item.id);
      const count = units.reduce((sum, unit) => sum + (questionStore.questionsByUnit.get(unit.id) || []).length, 0);
      return `<article class="study-card"><div><p class="card-label">${escapeHtml(chapter.title)}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><p>${count ? `${units.length}単元・${count}問` : "問題は準備中です。"}</p></div><a class="${count ? "primary" : "secondary"}-button" href="./chapter.html?chapter=${encodeURIComponent(chapter.id)}&section=${encodeURIComponent(item.id)}">${count ? "開く" : "内容を見る"}</a></article>`;
    }).join("");
    const availableUnits = chapterUnits.filter((unit) => (questionStore.questionsByUnit.get(unit.id) || []).length > 0);
    if (availableUnits.length) {
      const combined = document.createElement("div");
      combined.className = "section-stack";
      unitList.after(combined);
      combined.innerHTML = availableUnits.map((unit) => `<article class="study-card"><div><p class="card-label">${escapeHtml(sections.find(item => item.id === (unit.learningSection || "recall"))?.title || "一問一答")}</p><h3>${escapeHtml(unit.title)}</h3></div></article>`).join("");
      mountRangeSelection(combined, course, availableUnits.map(unit => ({ id: unit.id, title: unit.title, type: "unit", count: (questionStore.questionsByUnit.get(unit.id) || []).length })));
    }
  } else if (section && (chapter.available === false || !unitsForSection(section.id).length)) {
    chapterTitle.textContent = `${chapter.title} — ${section.title}`;
    chapterBreadcrumb.textContent = `${chapter.title} / ${section.title}`;
    chapterDescription.textContent = section.description;
    if (startQuizCard) startQuizCard.hidden = true;
    unitList.innerHTML = `<article class="study-card"><div><h3>準備中</h3><p>この種類の問題は準備中です。</p></div><a class="secondary-button" href="./chapter.html?chapter=${encodeURIComponent(chapter.id)}">${escapeHtml(chapter.title)}の目次へ戻る</a></article>`;
  } else if (!course || !chapter) {
    chapterTitle.textContent = "章データが見つかりません";
    chapterDescription.textContent = "指定された章を読み込めませんでした。";
    if (startQuizCard) {
      startQuizCard.hidden = true;
    }
  } else if (chapter.available === false) {
    chapterTitle.textContent = `${chapter.title}（準備中）`;
    chapterDescription.textContent = "この分野の教材は準備中です。";
    if (startQuizCard) startQuizCard.hidden = true;
    unitList.innerHTML = `<a class="secondary-button" href="./subject.html?course=${encodeURIComponent(course.id)}">${escapeHtml(course.subjectName)}の分野一覧へ戻る</a>`;
    schoolBreadcrumbLink.href = "./entrance-exam.html";
    schoolBreadcrumbLink.textContent = course.gradeName;
    gradeBreadcrumbLink.hidden = true;
    subjectBreadcrumbLink.href = `./subject.html?course=${encodeURIComponent(course.id)}`;
    subjectBreadcrumbLink.textContent = course.subjectName;
    chapterBreadcrumb.textContent = chapter.title;
    chapterKicker.textContent = course.subjectName;
  } else {
    const units = (questionStore.units || [])
      .filter((unit) => unit.chapterId === chapter.id)
      .filter((unit) => !section || (unit.learningSection || "recall") === section.id)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

    chapterTitle.textContent = section ? `${chapter.title} — ${section.title}` : chapter.title;
    chapterDescription.textContent = section ? section.description : chapter.description;
    if (section) {
      const parentLink = document.createElement("a");
      parentLink.href = `./chapter.html?chapter=${encodeURIComponent(chapter.id)}`;
      parentLink.textContent = chapter.title;
      chapterBreadcrumb.before(parentLink);
    }
    if (chapterKicker) {
      chapterKicker.textContent = course.subjectName;
    }
    if (chapterBreadcrumb) {
      chapterBreadcrumb.textContent = section ? section.title : chapter.title;
    }
    if (subjectBreadcrumbLink) {
      subjectBreadcrumbLink.href = `./subject.html?course=${encodeURIComponent(course.id)}`;
      subjectBreadcrumbLink.textContent = course.subjectName;
    }
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

    const showsUnitCards = chapter.showUnits === true || chapter.id === "chapter-sports-01" || chapter.id === "chapter-social-history";

    if (units.length > 0 && showsUnitCards) {
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
      mountRangeSelection(unitList, course, units.map(u => ({ id: u.id, title: u.title, type: "unit", count: (questionStore.questionsByUnit.get(u.id) || []).length })));
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
