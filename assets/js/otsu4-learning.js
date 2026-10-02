import { curriculum, lessons, questions, sources } from './otsu4-content.js';

const app = document.getElementById('otsu4-app');
const key = 'studyhub-otsu4-v1';
const questionMap = new Map(questions.map(q => [q.id, q]));
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
let storageAvailable = true;
let restoredWarning = '';
let state = { results: {}, read: [], resume: null, review: [] };
let reviewQueue = [];
try {
  const saved = JSON.parse(localStorage.getItem(key) || 'null');
  if (saved && typeof saved === 'object') {
    if (saved.results && typeof saved.results === 'object') {
      for (const [id, result] of Object.entries(saved.results)) {
        if (questionMap.has(id) && result && Number.isInteger(result.choice) && result.choice >= 0 && result.choice < 5) {
          state.results[id] = { choice: result.choice, correct: result.choice === questionMap.get(id).answer };
        }
      }
    }
    if (Array.isArray(saved.read)) state.read = saved.read.filter(id => lessons.some(l => l.id === id));
    if (Array.isArray(saved.review)) state.review = [...new Set(saved.review.filter(id => questionMap.has(id)))];
    if (typeof saved.resume === 'string' && /^#(?:lesson|quiz)\/[a-z]+(?:\/\d+)?$/.test(saved.resume)) state.resume = saved.resume;
  }
} catch (error) {
  if (error instanceof SyntaxError) restoredWarning = '保存データを読み込めなかったため、進捗を空の状態で始めます。';
  else storageAvailable = false;
}
reviewQueue = state.review;

function save() {
  try { localStorage.setItem(key, JSON.stringify(state)); }
  catch { storageAvailable = false; }
}
const refs = ids => ids.length ? `<details><summary>参考資料</summary><div class="otsu4-links">${ids.map(id => `<a href="${escape(sources[id][1])}" target="_blank" rel="noopener">${escape(sources[id][0])}</a>`).join('')}</div></details>` : '';
const actions = body => `<div class="otsu4-actions">${body}</div>`;
const homeLink = '<a class="quiet" href="#home">単元一覧へ</a>';
const wrongIds = () => questions.filter(q => state.results[q.id]?.correct === false).map(q => q.id);
function display(html, focus = true) {
  app.innerHTML = `${restoredWarning ? `<p class="otsu4-warning" role="status">${restoredWarning}</p>` : ''}${storageAvailable ? '' : '<p class="otsu4-warning" role="status">進捗を保存できません。この画面では学習できますが、再読み込みすると進捗が失われる場合があります。</p>'}${html}`;
  if (focus) {
    const heading = app.querySelector('h2');
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    app.scrollIntoView({ block: 'start' });
  }
}
function home(focus) {
  const answered = Object.keys(state.results).length;
  const correct = Object.values(state.results).filter(r => r.correct).length;
  const wrong = wrongIds().length;
  display(`<section class="study-card"><p class="card-label">基礎から学ぶ · 初期教材</p><h2>1単元から始めよう</h2>
    <p>3分野・18単元・90問。短い説明を読んで、五肢択一の練習問題に進みます。理解度や学習時間が決まっていなくても、好きな単元から始められます。</p>
    <p class="otsu4-note">主要な基礎を扱うオリジナル教材です。試験全範囲の網羅・模擬試験はまだありません。</p>
    <progress class="otsu4-meter" value="${answered}" max="${questions.length}" aria-label="回答済み問題数"></progress>
    <p id="progress-summary">回答済み ${answered} / ${questions.length}問 · 最新の回答で正解 ${correct}問 · 復習待ち ${wrong}問</p>
    ${actions(`${state.resume ? `<a href="${escape(state.resume)}">続きから学ぶ</a>` : '<a href="#lesson/exam">最初の単元へ</a>'}<button class="quiet" data-action="review" ${wrong ? '' : 'disabled'}>間違えた問題を復習（${wrong}問）</button>`)}
    <p class="otsu4-note">進捗はこのブラウザーに保存します。別の端末には引き継がれません。</p></section>
    <div class="otsu4-grid">${curriculum.groups.map(g => `<section class="study-card"><h2>${escape(g.title)}</h2>${g.lessons.map(l => {
      const done = questions.filter(q => q.lessonId === l.id && state.results[q.id]).length;
      return `<a class="otsu4-unit" href="#lesson/${l.id}"><strong>${escape(l.title)}</strong><small>${state.read.includes(l.id) ? '説明を確認済み · ' : ''}回答 ${done} / ${l.questions.length}問</small></a>`;
    }).join('')}</section>`).join('')}</div>
    <section class="study-card"><h2>試験の範囲と今後の追加</h2><p>法令15問・物理化学10問・性質と消火10問。各科目で60%以上が合格基準です（科目免除なし）。</p>
    <p>今後は、施設の位置・構造・設備、貯蔵と取扱い・運搬と移送の基準、保安管理と点検、各物質の詳しい性質、物理化学の応用、35問の模擬試験を追加します。</p>
    <p class="otsu4-note">法令・試験情報の確認日：${curriculum.checked}。申込みや実際の取扱いでは、最新の公式案内・法令・SDSを確認してください。</p>
    ${refs(Object.keys(sources))}</section>`, focus);
}
function readLesson(item) {
  state.resume = `#lesson/${item.id}`;
  save();
  display(`<section class="study-card"><p class="card-label">${escape(item.groupTitle)} · 説明</p><h2>${escape(item.title)}</h2>${item.points.map(p => `<p>${escape(p)}</p>`).join('')}
    ${actions(`<a href="#quiz/${item.id}/0">5問を解く</a>${homeLink}`)}${refs(item.refs)}</section>`);
}
function quiz(item, index, review = false) {
  const queue = review ? reviewQueue.map(id => questionMap.get(id)).filter(Boolean) : questions.filter(q => q.lessonId === item.id);
  if (!queue.length) { home(true); return; }
  index = Math.max(0, Math.min(queue.length - 1, Number.isInteger(index) ? index : 0));
  const question = queue[index];
  const activeLesson = lessons.find(l => l.id === question.lessonId);
  if (!review) { state.resume = `#quiz/${item.id}/${index}`; if (!state.read.includes(item.id)) state.read.push(item.id); }
  save();
  let submitted = false;
  const previous = state.results[question.id];
  display(`<section class="study-card"><p class="card-label">${review ? '間違えた問題の復習' : escape(activeLesson.groupTitle)} · ${index + 1} / ${queue.length}問</p>
    <h2>${escape(activeLesson.title)}</h2>${previous ? '<p class="otsu4-note">回答したことのある問題です。今回の回答で記録を更新します。</p>' : ''}
    <form id="otsu4-answer"><fieldset><legend>${escape(question.prompt)}</legend>${question.choices.map((c, n) => `<label class="otsu4-option"><input type="radio" name="choice" value="${n}" required><span>${n + 1}. ${escape(c)}</span></label>`).join('')}</fieldset>
    ${actions('<button type="submit" id="check-answer" disabled>答えを確認</button>')}</form>
    <div id="otsu4-feedback" role="status" aria-live="polite"></div><div id="otsu4-next"></div>
    ${actions(`<a class="quiet" href="#lesson/${activeLesson.id}">説明を読む</a>${homeLink}`)}${refs(activeLesson.refs)}</section>`);
  const form = document.getElementById('otsu4-answer');
  const check = document.getElementById('check-answer');
  form.addEventListener('change', () => { check.disabled = !form.querySelector('input:checked') || submitted; });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const selected = form.querySelector('input:checked');
    if (!selected || submitted) return;
    submitted = true;
    const choice = Number(selected.value);
    const correct = choice === question.answer;
    state.results[question.id] = { choice, correct };
    save();
    form.querySelectorAll('input').forEach(input => { input.disabled = true; });
    check.disabled = true;
    const feedback = document.getElementById('otsu4-feedback');
    feedback.className = `otsu4-feedback${correct ? '' : ' wrong'}`;
    feedback.innerHTML = `<strong>${correct ? '正解です' : 'もう一度復習しましょう'}</strong><p>正解：${question.answer + 1}. ${escape(question.choices[question.answer])}</p><p>${escape(question.explanation)}</p>${storageAvailable ? '' : '<p>進捗の保存ができませんでした。</p>'}`;
    document.getElementById('otsu4-next').innerHTML = actions(index + 1 < queue.length
      ? `<a href="#${review ? 'review' : `quiz/${item.id}`}/${index + 1}">次の問題へ</a>`
      : `<a href="#${review ? 'review-result' : `result/${item.id}`}">結果を見る</a>`);
  });
}
function result(item, review = false) {
  const queue = review ? reviewQueue.map(id => questionMap.get(id)).filter(Boolean) : questions.filter(q => q.lessonId === item.id);
  const answered = queue.filter(q => state.results[q.id]).length;
  const correct = queue.filter(q => state.results[q.id]?.correct).length;
  const next = !review && lessons[lessons.indexOf(item) + 1];
  if (!review) { state.resume = next ? `#lesson/${next.id}` : null; save(); }
  display(`<section class="study-card"><p class="card-label">${review ? '復習' : escape(item.title)} · 結果</p><h2>${correct} / ${queue.length}問 正解</h2><p>回答済み ${answered}問。最新の回答を使った練習結果です。本試験の合否を示すものではありません。</p>
    ${actions(`${next ? `<a href="#lesson/${next.id}">次の単元へ</a>` : ''}${!review ? `<a class="quiet" href="#quiz/${item.id}/0">もう一度解く</a>` : ''}${homeLink}`)}
    ${queue.map(q => `<details><summary>${state.results[q.id] ? state.results[q.id].correct ? '○ 正解' : '△ 復習' : '未回答'} · ${escape(q.prompt)}</summary><p>正解：${escape(q.choices[q.answer])}</p><p>${escape(q.explanation)}</p></details>`).join('')}</section>`);
}
function route(initial = false) {
  const [view, id, number] = location.hash.slice(1).split('/');
  const item = lessons.find(l => l.id === id);
  if (view === 'lesson' && item) readLesson(item);
  else if (view === 'quiz' && item) quiz(item, Number(number));
  else if (view === 'result' && item) result(item);
  else if (view === 'review' && /^\d+$/.test(id || '')) {
    if (!reviewQueue.length) { reviewQueue = wrongIds(); state.review = reviewQueue; save(); }
    quiz(null, Number(id), true);
  } else if (view === 'review-result' && reviewQueue.length) result(null, true);
  else home(!initial);
}
app.addEventListener('click', event => {
  if (event.target.closest('[data-action="review"]')) {
    reviewQueue = wrongIds();
    state.review = reviewQueue;
    save();
    if (reviewQueue.length) location.hash = '#review/0';
  }
});
window.addEventListener('hashchange', () => route());
route(true);
