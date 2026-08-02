/*
 * Central data access for StudyHub.
 * Phase 1.1 keeps data in JSON, but builds small indexes after loading.
 * Later, only this file should need to change when replacing JSON with an API.
 */

const DATA_ROOT = new URL("../../data/", import.meta.url);

async function fetchJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load data: ${path}`);
  }

  return response.json();
}

function sortQuestions(a, b) {
  // Keep the display stable: chapter -> unit -> order -> id.
  return (a.chapterId || "").localeCompare(b.chapterId || "")
    || (a.unitId || "").localeCompare(b.unitId || "")
    || Number(a.order || 0) - Number(b.order || 0)
    || (a.id || "").localeCompare(b.id || "");
}

function buildQuestionIndex(questionData) {
  const questionsByChapter = new Map();
  const questionsByUnit = new Map();
  const questionsById = new Map();

  for (const question of [...questionData.questions].sort(sortQuestions)) {
    questionsById.set(question.id, question);

    if (!questionsByChapter.has(question.chapterId)) {
      questionsByChapter.set(question.chapterId, []);
    }
    questionsByChapter.get(question.chapterId).push(question);

    if (!questionsByUnit.has(question.unitId)) {
      questionsByUnit.set(question.unitId, []);
    }
    questionsByUnit.get(question.unitId).push(question);
  }

  return {
    meta: questionData.meta || {},
    units: questionData.units || [],
    questionsByChapter,
    questionsByUnit,
    questionsById
  };
}

export async function getCatalog() {
  return fetchJson(new URL("catalog.json", DATA_ROOT));
}

export async function getQuestionStore() {
  const questionData = await fetchJson(new URL("questions.json", DATA_ROOT));
  return buildQuestionIndex(questionData);
}

export function getQueryParam(name, fallback = "") {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || fallback;
}
