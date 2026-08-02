import { getQueryParam } from "./dataService.js";

const categoryTitle = document.querySelector("#category-title");
const category = getQueryParam("category", "school-education");

if (category !== "school-education") {
  categoryTitle.textContent = "カテゴリ";
}
