import { getCatalog } from "./dataService.js";

const chapterList = document.querySelector("#chapter-list");

// ホームはテスト前に何度も開く画面なので、章カードからすぐ問題へ進める形にしています。
try {
  const catalog = await getCatalog();
  const course = catalog.courses[0];

  chapterList.innerHTML = course.chapters.map((chapter) => `
    <article class="study-card">
      <div>
        <p class="card-label">${chapter.number}</p>
        <h3>${chapter.title}</h3>
        <p>${chapter.description}</p>
      </div>
      <a class="primary-button" href="./pages/quiz.html?chapter=${chapter.id}">問題を解く</a>
    </article>
  `).join("");
} catch (error) {
  // JSONを読めない環境でも、HTMLに書いた3章カードをそのまま使えるようにします。
  console.warn(error);
}
