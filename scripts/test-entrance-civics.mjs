import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import os from 'node:os';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root = fileURLToPath(new URL('../',import.meta.url));
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
execFileSync(process.execPath,[path.join(root,'scripts/build-entrance-civics.mjs'),'--check']);
const read = name=>JSON.parse(fs.readFileSync(path.join(root,'data',name),'utf8').replace(/^\uFEFF/,''));
const bank=read('entrance-civics.json');
const banks=['questions.json','entrance-geography.json','entrance-physics.json','entrance-history.json','entrance-civics.json'].map(read);
for(const key of ['units','questions']) {
  const ids=banks.flatMap(b=>b[key].map(item=>item.id));
  assert.equal(new Set(ids).size,ids.length);
}
assert.equal(bank.meta.originalQuestionCount,206);
assert.equal(bank.questions.length,243);
assert.equal(bank.units.length,15);
for(const q of bank.questions) {
  assert.equal(q.choices.length,4);
  assert.equal(new Set(q.choices.map(c=>c.text)).size,4);
  assert(q.choices.some(c=>c.id===q.correctChoiceId));
  assert(q.hint && q.explanation);
  assert(!/資料[ⅠⅡⅢⅣ]|地図[ⅠⅡⅢⅣ]|右の図/.test(q.text));
}
const server=http.createServer((req,res)=>{
  const filename=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));
  if(!filename.startsWith(root) || !fs.existsSync(filename) || fs.statSync(filename).isDirectory()) {res.writeHead(404).end();return;}
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'};
  res.writeHead(200,{'Content-Type':(types[path.extname(filename)] || 'application/octet-stream')+'; charset=utf-8'});
  res.end(fs.readFileSync(filename));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=process.env.STUDYHUB_BASE_URL || `http://127.0.0.1:${server.address().port}/`;
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('response',res=>{if(res.status()>=400)errors.push(`${res.status()} ${res.url()}`);});
const go=url=>page.goto(new URL(url,base).href);
const screenshots=path.join(os.tmpdir(),'studyhub-civics-preview');
fs.mkdirSync(screenshots,{recursive:true});
try {
  await go('pages/subject.html?course=entrance-social-studies');
  await page.locator('#chapter-list a[href*="social-civics"]').click();
  await page.locator('#unit-list a[href*="section=recall"]').click();
  await page.locator('.range-panel').waitFor();
  assert.equal(await page.locator('#unit-list .study-card').count(),15);
  await page.locator('.mastery-button').first().click();
  await page.reload();
  await page.locator('.range-panel').waitFor();
  assert.equal(await page.locator('.mastery-button').first().getAttribute('aria-pressed'),'true');
  await page.locator('[data-action="unlearned"]').click();
  assert.equal(await page.locator('.range-checkbox input:checked').count(),14);
  await page.locator('[data-action="none"]').click();
  await page.locator('.range-checkbox input').first().check();
  await page.locator('.range-checkbox input').last().check();
  await page.getByLabel('出題数',{exact:true}).selectOption('20');
  await page.locator('[data-action="start"]').click();
  await page.waitForFunction(()=>document.querySelector('#quiz-progress').textContent==='1 / 20');
  await go('pages/quiz.html?chapter=chapter-entrance-social-civics');
  await page.waitForFunction(()=>document.querySelector('#quiz-progress').textContent==='1 / 243');
  await page.screenshot({path:path.join(screenshots,'quiz-mobile.png')});
  await page.evaluate(questions=>{
    const must=(ok,message)=>{if(!ok)throw new Error(message);};
    for(const [i,q] of questions.entries()) {
      const form=document.querySelector('#quiz-form');
      must(document.querySelector('#question-text').textContent===q.text,`Text ${q.id}`);
      must(form.querySelectorAll('input').length===4,`Choices ${q.id}`);
      must(document.querySelector('#hint-text').textContent===q.hint,`Hint ${q.id}`);
      must(!document.querySelector('#question-hint').open,`Hint reset ${q.id}`);
      document.querySelector('#question-hint').open=true;
      const id=i%2 ? q.correctChoiceId : q.choices.find(c=>c.id!==q.correctChoiceId).id;
      form.querySelector(`input[value="${id}"]`).click();
      must(document.querySelector('#result-box').hidden,`Early grading ${q.id}`);
      form.requestSubmit();
      must(document.querySelector('#result-message').textContent===(i%2?'正解です。':'不正解です。'),`Grade ${q.id}`);
      must(document.querySelector('#explanation-text').textContent===q.explanation,`Explanation ${q.id}`);
      must(document.querySelector('#correct-answer').textContent===`正解：${q.choices.find(c=>c.id===q.correctChoiceId).text}`,`Answer ${q.id}`);
      must([...form.querySelectorAll('input')].every(input=>input.disabled),`Lock ${q.id}`);
      document.querySelector('#next-button').click();
    }
  },bank.questions);
  await page.locator('#quiz-form button').click();
  assert.equal(await page.locator('#result-message').textContent(),'選択肢を1つ選んでください。');
  await page.locator('#random-toggle').check();
  assert.equal(await page.locator('#quiz-progress').textContent(),'1 / 243');
  await page.setViewportSize({width:320,height:740});
  assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
  await page.setViewportSize({width:1280,height:900});
  await go('pages/chapter.html?chapter=chapter-entrance-social-civics&section=recall');
  await page.locator('.range-panel').waitFor();
  await page.screenshot({path:path.join(screenshots,'civics-desktop.png')});
  for(const old of banks.slice(0,4)) {
    const q=old.questions[0];
    await go(`pages/quiz.html?unit=${q.unitId}`);
    await page.locator('#quiz-form input').first().waitFor();
    assert.equal(await page.locator('#question-text').textContent(),q.text);
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({base,originals:206,questionsGraded:243,units:15,range:20,mastery:'persisted',errors,screenshots}));
} finally {await browser.close();server.close();}
