export function collectSelectedQuestions(course, store, chapters, units) {
  const allowed = new Set(course?.chapters.filter(c => c.available !== false).map(c => c.id) || []);
  const result = new Map();
  for (const id of chapters) if (allowed.has(id))
    for (const q of store.questionsByChapter.get(id) || []) result.set(q.id, q);
  for (const id of units) {
    const unit = store.units.find(u => u.id === id);
    if (unit && allowed.has(unit.chapterId))
      for (const q of store.questionsByUnit.get(id) || [])
        if (q.chapterId === unit.chapterId) result.set(q.id, q);
  }
  return [...result.values()];
}

export function mountRangeSelection(list, course, items) {
  const storageKey = 'studyhub:mastered:' + course.id;
  let mastered;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    mastered = new Set(Array.isArray(saved) ? saved.filter(x => typeof x === 'string') : []);
  } catch { mastered = new Set(); }
  const panel = document.createElement('div');
  panel.className = 'range-panel';
  panel.innerHTML = `<h3>項目を選んでまとめて出題</h3>
    <p>出題チェックと「覚えた」印は別々に付けられます。印はこのブラウザに保存されます。</p>
    <div class="range-actions"><button type="button" class="secondary-button" data-action="all">全選択</button>
    <button type="button" class="secondary-button" data-action="none">全解除</button>
    <button type="button" class="secondary-button" data-action="unlearned">まだ覚えていない項目を選択</button></div>
    <p class="range-summary" aria-live="polite"></p>
    <div class="range-actions"><label>出題数 <select aria-label="出題数"><option value="10">10問</option><option value="20">20問</option><option value="all">すべて</option></select></label>
    <button type="button" class="primary-button" data-action="start" disabled>選んだ項目から出題</button></div>
    <p class="storage-message" role="status"></p>`;
  list.before(panel);
  const entries = items.map((item, index) => {
    const controls = document.createElement('div');
    controls.className = 'range-controls';
    const label = document.createElement('label');
    label.className = 'range-checkbox';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.disabled = !item.count;
    checkbox.setAttribute('aria-label', item.title + 'を出題する');
    label.append(checkbox, document.createTextNode('出題する'));
    const star = document.createElement('button');
    star.type = 'button';
    star.className = 'mastery-button';
    star.disabled = !item.count;
    const key = item.type + ':' + item.id;
    star.addEventListener('click', () => {
      mastered.has(key) ? mastered.delete(key) : mastered.add(key);
      try {
        localStorage.setItem(storageKey, JSON.stringify([...mastered]));
        panel.querySelector('.storage-message').textContent = '';
      } catch {
        panel.querySelector('.storage-message').textContent = '印を保存できませんでした。このページを閉じると変更が失われます。';
      }
      update();
    });
    checkbox.addEventListener('change', update);
    controls.append(label, star);
    list.children[index].append(controls);
    return { ...item, checkbox, star, key };
  });
  function update() {
    const available = entries.filter(e => e.count > 0);
    const checked = available.filter(e => e.checkbox.checked);
    panel.querySelector('.range-summary').textContent = `選択 ${checked.length}項目・${checked.reduce((sum, e) => sum + e.count, 0)}問 ／ 覚えた項目 ${available.filter(e => mastered.has(e.key)).length}／${available.length}`;
    panel.querySelector('[data-action="start"]').disabled = checked.length === 0;
    for (const e of entries) {
      const done = mastered.has(e.key);
      e.star.textContent = done ? '⭐ 覚えた' : '☆ 覚えた';
      e.star.setAttribute('aria-pressed', String(done));
      e.star.setAttribute('aria-label', e.title + (done ? '：覚えた印を外す' : '：覚えた印を付ける'));
    }
  }
  panel.addEventListener('click', event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    if (action === 'start') {
      const params = new URLSearchParams({ course: course.id, selection: '1', count: panel.querySelector('select').value });
      for (const e of entries.filter(e => e.checkbox.checked && e.count)) params.append(e.type, e.id);
      window.location.href = './quiz.html?' + params;
      return;
    }
    for (const e of entries) e.checkbox.checked = Boolean(e.count) && (action === 'all' || (action === 'unlearned' && !mastered.has(e.key)));
    update();
  });
  update();
}
