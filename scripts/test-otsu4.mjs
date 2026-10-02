import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import os from 'node:os';
import { createRequire } from 'node:module';
import { curriculum, lessons, questions, sources } from '../assets/js/otsu4-content.js';

assert.equal(curriculum.groups.length, 3);
assert.equal(lessons.length, 18);
assert.equal(questions.length, 90);
assert.equal(new Set(questions.map(q => q.id)).size, 90);
for (const group of curriculum.groups) assert.equal(group.lessons.length, 6);
for (const item of lessons) {
  assert.equal(item.questions.length, 5);
  assert(item.points.length >= 2);
  for (const ref of item.refs) assert(sources[ref]);
}
for (const q of questions) {
  assert(q.prompt && q.explanation);
  assert.equal(q.choices.length, 5);
  assert.equal(new Set(q.choices).size, 5);
  assert(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 5);
}
const answer = id => { const q = questions.find(q => q.id === id); assert(q); return q.choices[q.answer]; };
const numeric = id => Number(answer(id).replaceAll(',', '').match(/^[\d.]+/)[0]);
// Independent reference values and calculations, not copied answer indices.
assert.equal(numeric('exam-1'), 15 + 10 + 10);
assert.equal(numeric('quantity-1'), 50);
assert.equal(numeric('quantity-2'), 200);
assert.equal(numeric('quantity-3'), 400);
assert.equal(numeric('quantity-4'), 1000);
assert.equal(numeric('quantity-5'), 6000);
assert.equal(numeric('multiples-1'), 100 / 200);
assert.equal(numeric('multiples-2'), 1500 / 1000);
assert.equal(numeric('multiples-3'), 100 / 200 + 500 / 1000);
assert.equal(numeric('multiples-4'), 40 / 200 + 300 / 1000);
assert.equal(numeric('multiples-5'), 120 / 200 + 600 / 1000);
assert.equal(numeric('heat-2'), 100 * 4 * 10);
assert.equal(numeric('heat-3'), 35 - 20);
assert.equal(numeric('heat-5'), 50 * 2 * 20);
assert.equal(numeric('density-2'), .8 * 100);
assert.equal(numeric('density-3'), 1000);
assert.equal(numeric('density-4'), 180 / 200);
assert.equal(numeric('states-4'), 27 + 273);
assert.equal(numeric('states-5'), 600 / 300);
assert.equal(numeric('reaction-3'), 2 * 2);
assert.equal(numeric('reaction-4'), 2 * 1);
assert.equal(numeric('acid-3'), 7);
assert.equal(answer('classes-3'), '第二石油類の範囲');
assert.equal(answer('classes-4'), '第三石油類の範囲');
assert.equal(answer('classes-5'), '第四石油類の範囲');
assert.equal(answer('soluble-3'), '水溶性の第一石油類');
assert.equal(answer('higher-2'), '水溶性の第三石油類');
console.log('PASS: 18 lessons, 90 unique five-choice questions; independent quantitative and boundary checks.');

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'C:/Users/Owner/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = process.cwd();
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  try {
    res.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' })[path.extname(file)] || 'text/plain');
    res.end(fs.readFileSync(file));
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const url = base + '/pages/hazardous-materials-otsu4.html';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const heading = async name => page.getByRole('heading', { name, exact: true }).waitFor();
  const overflow = async () => assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  const goto = async hash => { await page.goto(url + hash); await page.locator('#otsu4-app h2').first().waitFor(); };
  await goto('#home');
  assert.equal(await page.locator('.otsu4-unit').count(), 18);
  await page.getByRole('link', { name: '最初の単元へ', exact: true }).click();
  await heading('試験の全体像');
  await page.getByRole('link', { name: '5問を解く', exact: true }).click();
  assert(await page.locator('#check-answer').isDisabled());
  assert.equal(await page.locator('#otsu4-feedback').textContent(), '');
  const first = questions[0];
  await page.locator(`input[value="${(first.answer + 1) % 5}"]`).check();
  await page.locator('#check-answer').click();
  assert((await page.locator('#otsu4-feedback').textContent()).includes('もう一度'));
  await page.getByRole('link', { name: '次の問題へ', exact: true }).click();
  await page.reload();
  assert.equal(await page.locator('legend').textContent(), questions[1].prompt);
  await page.getByRole('link', { name: '単元一覧へ', exact: true }).click();
  assert((await page.locator('#progress-summary').textContent()).includes('復習待ち 1問'));
  await page.getByRole('link', { name: '続きから学ぶ', exact: true }).click();
  assert.equal(await page.locator('legend').textContent(), questions[1].prompt);
  await page.getByRole('link', { name: '単元一覧へ', exact: true }).click();
  await page.getByRole('button', { name: '間違えた問題を復習（1問）', exact: true }).click();
  await page.reload();
  assert.equal(await page.locator('legend').textContent(), first.prompt);
  await page.locator(`input[value="${first.answer}"]`).check();
  await page.locator('#check-answer').click();
  await page.getByRole('link', { name: '結果を見る', exact: true }).click();
  await heading('1 / 1問 正解');
  await page.getByRole('link', { name: '単元一覧へ', exact: true }).click();
  assert((await page.locator('#progress-summary').textContent()).includes('復習待ち 0問'));

  // Every authored question is rendered, graded, saved and navigated through.
  for (const item of lessons) {
    await goto(`#lesson/${item.id}`);
    await overflow();
    await page.getByRole('link', { name: '5問を解く', exact: true }).click();
    for (let index = 0; index < item.questions.length; index++) {
      const q = item.questions[index];
      assert.equal(await page.locator('legend').textContent(), q.prompt);
      assert.equal(await page.locator('input[type=radio]').count(), 5);
      await page.locator(`input[value="${q.answer}"]`).check();
      await page.locator('#check-answer').click();
      assert((await page.locator('#otsu4-feedback').textContent()).includes(q.explanation));
      assert(await page.locator('#check-answer').isDisabled());
      await overflow();
      await page.getByRole('link', { name: index === 4 ? '結果を見る' : '次の問題へ', exact: true }).click();
    }
    await heading('5 / 5問 正解');
  }
  await goto('#home');
  assert((await page.locator('#progress-summary').textContent()).includes('回答済み 90 / 90問'));
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 850 });
    await goto('#home'); await overflow();
    await goto('#lesson/quantity'); await overflow();
    await page.locator('summary').click(); await overflow();
    await goto('#quiz/multiples/0'); await overflow();
    await page.locator(`input[value="${questions.find(q => q.id === 'multiples-1').answer}"]`).check();
    await page.locator('#check-answer').click(); await overflow();
    await goto('#result/multiples'); await page.locator('summary').first().click(); await overflow();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await goto('#home');
  await page.screenshot({ path: path.join(os.tmpdir(), 'studyhub-otsu4-mobile.png'), fullPage: true });
  await goto('#quiz/multiples/0');
  await page.locator('input').first().check(); await page.locator('#check-answer').click();
  await page.screenshot({ path: path.join(os.tmpdir(), 'studyhub-otsu4-question.png'), fullPage: true });
  await page.evaluate(() => localStorage.setItem('studyhub-otsu4-v1', '{bad json'));
  await page.reload(); await page.locator('#otsu4-app h2').waitFor();
  assert((await page.locator('#otsu4-app').textContent()).includes('保存データを読み込めなかった'));
  await goto('#quiz/doesnotexist/0'); await heading('1単元から始めよう');
  const blocked = await browser.newPage();
  await blocked.addInitScript(() => {
    Storage.prototype.getItem = () => { throw Error('blocked'); };
    Storage.prototype.setItem = () => { throw Error('blocked'); };
  });
  await blocked.goto(url + '#quiz/exam/0');
  await blocked.locator('input').first().check();
  await blocked.locator('#check-answer').click();
  assert((await blocked.locator('#otsu4-app').textContent()).includes('保存できません'));
  await blocked.close();
  await page.goto(base + '/pages/qualifications.html');
  assert.equal(await page.locator('a[href="./hazardous-materials-otsu4.html"]').count(), 1);
  assert.deepEqual(errors, []);
  console.log('PASS: all 90 questions; correct/wrong feedback, persistence/resume, review, results, 320/390/1280px, corrupt/blocked storage, invalid route, entry.');
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
