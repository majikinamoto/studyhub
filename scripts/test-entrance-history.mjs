import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const read = name => JSON.parse(fs.readFileSync(path.join(root, 'data', name), 'utf8').replace(/^\uFEFF/, ''));
const history = read('entrance-history.json');
execFileSync(process.execPath, [path.join(root, 'scripts/build-entrance-history.mjs'), '--check']);

// Independently transcribed source counts and multi-answer fields from the photographs.
const originals = [14,13,15,16,18,12,16,17,14,18,15,16,17,15,15,12,16,16,15,15,13,15,18];
const splits = {2:{5:2,12:2},4:{4:4,8:2,14:2},5:{2:2,13:2,14:2},6:{6:2,7:3},
  7:{1:2,10:2,11:2},8:{16:2},9:{12:2},10:{5:2,15:2},11:{1:2},12:{4:2,6:2},
  13:{7:2,8:2},14:{4:2,7:2},15:{4:4,6:2,12:2,15:2},17:{7:2,11:2,15:2},
  18:{5:2,12:2,15:2},19:{6:2,9:2},20:{8:2,9:2,11:2},21:{11:2},22:{3:2,10:2},
  23:{1:2,5:2,10:2,11:2,18:2}};
assert.equal(history.questions.length, 403);
history.units.forEach((unit, i) => {
  assert.equal(unit.sourceStartPage, 50 + i * 2);
  assert.equal(unit.sourceQuestionCount, originals[i]);
  const expected = Array.from({length: originals[i]}, (_, j) => {
    const count = splits[i + 1]?.[j + 1] || 1;
    return count === 1 ? [String(j + 1)] : Array.from({length:count}, (_, k) => `${j + 1}${String.fromCharCode(97+k)}`);
  }).flat();
  assert.deepEqual(history.questions.filter(q => q.unitId === unit.id).map(q=>q.sourceQuestion), expected);
});
const banks = ['questions.json','entrance-geography.json','entrance-physics.json','entrance-history.json'].map(read);
for (const key of ['units','questions']) {
  const ids = banks.flatMap(bank => bank[key].map(item => item.id));
  assert.equal(new Set(ids).size, ids.length, `${key}: IDs must be globally unique`);
}
for (const q of history.questions) {
  assert.equal(q.choices.length, 4);
  assert.equal(new Set(q.choices.map(c=>c.text)).size, 4);
  assert(q.choices.some(c=>c.id===q.correctChoiceId));
  assert(q.hint && q.explanation);
  assert(!/資料[ⅠⅡⅢⅣⅤⅠ-Ⅹ]|地図[ⅠⅡⅢⅣⅤ]|右の図|次の図/.test(q.text));
}
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
const server = http.createServer((req,res) => {
  const filename = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://local').pathname));
  if (!filename.startsWith(root) || !fs.existsSync(filename) || fs.statSync(filename).isDirectory()) {res.writeHead(404).end(); return;}
  res.writeHead(200, {'Content-Type': types[path.extname(filename)] || 'application/octet-stream'});
  res.end(fs.readFileSync(filename));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base = process.env.STUDYHUB_BASE_URL || `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL || 'msedge',headless:true});
const page = await browser.newPage({viewport:{width:390,height:844}});
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
const go = relative => page.goto(new URL(relative,base).href);
const screenshotDir = path.join(os.tmpdir(), 'studyhub-history-preview');
fs.mkdirSync(screenshotDir,{recursive:true});
try {
  await go('pages/subject.html?course=entrance-social-studies');
  await page.locator('#chapter-list .study-card').first().waitFor();
  assert.equal(await page.locator('#chapter-list a[href*="social-history"]').count(),1);
  assert.equal(await page.locator('#chapter-list a[href*="social-civics"]').count(),1);
  for (const field of ['geography', 'history', 'civics']) {
    await go(`pages/chapter.html?chapter=chapter-entrance-social-${field}`);
    await page.locator('#unit-list a[href*="section=materials"]').waitFor();
    assert.equal(await page.locator('#unit-list .study-card').count(),2);
    assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
    await page.locator('#unit-list a[href*="section=materials"]').click();
    await page.getByRole('heading',{name:'準備中',exact:true}).waitFor();
    assert.equal(await page.locator('#quiz-form').count(),0);
  }
  await go('pages/subject.html?course=entrance-social-studies');
  await page.locator('#chapter-list a[href*="social-history"]').click();
  await page.locator('#unit-list a[href*="section=recall"]').click();
  await page.locator('.range-panel').waitFor();
  assert.equal(await page.locator('#unit-list .study-card').count(),23);
  await page.locator('.mastery-button').first().click();
  await page.reload();
  await page.locator('.range-panel').waitFor();
  assert.equal(await page.locator('.mastery-button').first().getAttribute('aria-pressed'),'true');
  await page.locator('[data-action="unlearned"]').click();
  assert.equal(await page.locator('.range-checkbox input:checked').count(),22);
  await page.locator('[data-action="none"]').click();
  assert(await page.locator('[data-action="start"]').isDisabled());
  await page.locator('.range-checkbox input').nth(0).check();
  await page.locator('.range-checkbox input').nth(22).check();
  await page.getByLabel('出題数',{exact:true}).selectOption('20');
  await page.screenshot({path:path.join(screenshotDir,'history-mobile.png'),fullPage:false});
  await page.locator('[data-action="start"]').click();
  await page.waitForFunction(()=>document.querySelector('#quiz-progress').textContent==='1 / 20');
  const allowed = history.questions.filter(q=>[history.units[0].id,history.units[22].id].includes(q.unitId)).map(q=>q.text);
  const selected = await page.evaluate(() => {
    const texts=[];
    for(let i=0;i<20;i++) {
      texts.push(document.querySelector('#question-text').textContent);
      document.querySelector('input[name=choice]').click();
      document.querySelector('#quiz-form').requestSubmit();
      document.querySelector('#next-button').click();
    }
    return texts;
  });
  assert.equal(new Set(selected).size,20);
  assert(selected.every(text=>allowed.includes(text)));
  // Exercise every history item through the actual quiz event handlers.
  await go('pages/quiz.html?chapter=chapter-entrance-social-history');
  await page.waitForFunction(()=>document.querySelector('#quiz-progress').textContent==='1 / 403');
  const result = await page.evaluate((questions)=>{
    const must=(value,message)=>{if(!value)throw new Error(message);};
    for(let i=0;i<questions.length;i++) {
      const q=questions[i];
      const form=document.querySelector('#quiz-form');
      must(document.querySelector('#question-text').textContent===q.text,`Question ${i}`);
      must(form.querySelectorAll('input').length===4,`Choices ${i}`);
      must(document.querySelector('#hint-text').textContent===q.hint,`Hint ${i}`);
      must(!document.querySelector('#question-hint').open,`Hint reset ${i}`);
      document.querySelector('#question-hint').open=true;
      const id = i%2 ? q.correctChoiceId : q.choices.find(c=>c.id!==q.correctChoiceId).id;
      form.querySelector(`input[value="${id}"]`).click();
      must(document.querySelector('#result-box').hidden,`Premature grading ${i}`);
      form.requestSubmit();
      must(document.querySelector('#result-message').textContent===(i%2?'正解です。':'不正解です。'),`Grading ${i}`);
      must(document.querySelector('#explanation-text').textContent===q.explanation,`Explanation ${i}`);
      must(document.querySelector('#correct-answer').textContent===`正解：${q.choices.find(c=>c.id===q.correctChoiceId).text}`,`Correct answer ${i}`);
      must([...form.querySelectorAll('input')].every(input=>input.disabled),`Lock ${i}`);
      document.querySelector('#next-button').click();
    }
    return document.querySelector('#quiz-progress').textContent;
  },history.questions);
  assert.equal(result,'1 / 403');
  await page.locator('#quiz-form button').click();
  assert.equal(await page.locator('#result-message').textContent(),'選択肢を1つ選んでください。');
  assert(await page.locator('#next-button').isHidden());
  await page.locator('#random-toggle').check();
  assert.equal(await page.locator('#quiz-progress').textContent(),'1 / 403');
  await page.locator('#random-toggle').uncheck();
  assert.equal(await page.locator('#question-text').textContent(),history.questions[0].text);
  await page.locator('#question-hint summary').click();
  await page.locator(`input[value="${history.questions[0].correctChoiceId}"]`).check();
  await page.locator('#quiz-form button').click();
  assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
  await page.screenshot({path:path.join(screenshotDir,'quiz-mobile.png'),fullPage:true});
  // Long names on the narrowest supported phone, as well as desktop layout.
  await page.setViewportSize({width:320,height:740});
  await go('pages/quiz.html?unit=unit-entrance-history-23');
  await page.waitForFunction(()=>document.querySelector('#quiz-progress').textContent==='1 / 23');
  assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
  await page.setViewportSize({width:1280,height:900});
  await go('pages/chapter.html?chapter=chapter-entrance-social-history');
  await page.locator('.range-panel').waitFor();
  await page.screenshot({path:path.join(screenshotDir,'history-desktop.png'),fullPage:false});
  // Existing banks remain reachable; new hints are hidden when absent.
  for(const bank of banks.slice(0,3)) {
    const q=bank.questions[0];
    await go(`pages/quiz.html?unit=${q.unitId}`);
    await page.waitForFunction(()=>document.querySelector('#quiz-form input'));
    assert.equal(await page.locator('#question-text').textContent(),q.text);
    assert.equal(await page.locator('#question-hint').isHidden(),!q.hint);
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({base,sourceQuestions:351,questionsGraded:403,units:23,range:20,mastery:'persisted',errors,screenshots:screenshotDir}));
} finally {
  await browser.close();
  server.close();
}
