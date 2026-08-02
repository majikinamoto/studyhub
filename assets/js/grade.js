import { getQueryParam } from "./dataService.js";

const schoolTitle = document.querySelector("#school-title");
const school = getQueryParam("school", "kosen");

if (school !== "kosen") {
  schoolTitle.textContent = "学校種別";
}
