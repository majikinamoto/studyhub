import { getQueryParam } from "./dataService.js";

const gradeTitle = document.querySelector("#grade-title");
const grade = getQueryParam("grade", "kosen-1");

if (grade !== "kosen-1") {
  gradeTitle.textContent = "学年";
}
