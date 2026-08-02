import { getCatalog, getQueryParam } from "./dataService.js";

const chapterId = getQueryParam("chapter", "chapter-09");
const chapterTitle = document.querySelector("#chapter-title");
const chapterDescription = document.querySelector("#chapter-description");
const startQuizLink = document.querySelector("#start-quiz-link");

try {
  const catalog = await getCatalog();
  const chapters = catalog.courses.flatMap((course) => course.chapters);
  const chapter = chapters.find((item) => item.id === chapterId) || chapters[0];

  chapterTitle.textContent = chapter.title;
  chapterDescription.textContent = chapter.description;
  startQuizLink.href = `./quiz.html?chapter=${chapter.id}`;
} catch (error) {
  console.warn(error);
}
