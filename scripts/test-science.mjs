import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const banks=['chemistry','biology','earth','science-materials'].map(f=>JSON.parse(fs.readFileSync(path.join(root,`data/entrance-${f}.json`),'utf8')));
const units=banks.flatMap(b=>b.units),questions=banks.flatMap(b=>b.questions);
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!file.startsWith(root)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml'}[path.extname(file)]||'application/octet-stream')+'; charset=utf-8');res.end(fs.readFileSync(file));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}/`;
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
const go=url=>page.goto(new URL(url,base).href);
const screenshots=path.join(os.tmpdir(),'studyhub-science-preview');fs.mkdirSync(screenshots,{recursive:true});
let graded=0;
try{
 for(const field of ['physics','chemistry','biology','earth']){
  await go(`pages/chapter.html?chapter=chapter-entrance-science-${field}`);await page.locator('#unit-list .study-card').first().waitFor();assert.equal(await page.locator('#unit-list .study-card').count(),2);
  for(const section of ['recall','materials']){await go(`pages/chapter.html?chapter=chapter-entrance-science-${field}&section=${section}`);await page.locator('#unit-list .study-card').first().waitFor();const expected=section==='materials'?1:field==='physics'?14:banks.find(b=>b.units[0].chapterId.endsWith(field)).units.length;assert.equal(await page.locator('#unit-list .study-card').count(),expected);}
 }
 for(const unit of units){
  await go(`pages/quiz.html?unit=${unit.id}`);await page.locator('#quiz-form input').first().waitFor();
  const qs=questions.filter(q=>q.unitId===unit.id);
  for(let i=0;i<qs.length;i++){
   const q=qs[i];assert.equal(await page.locator('#question-text').innerText(),q.text);assert.equal(await page.locator('#quiz-form input').count(),4);assert.equal(await page.locator('#question-material').isVisible(),!!q.material);
   for(const img of await page.locator('#question-material img').all())await page.waitForFunction(el=>el.complete&&el.naturalWidth>0,await img.elementHandle());
   assert(await page.locator('#result-box').isHidden());
   await page.locator(`input[value="${q.correctChoiceId}"]`).check();assert(await page.locator('#result-box').isHidden());
   await page.locator('#quiz-form button[type=submit]').click();assert.equal(await page.locator('#result-message').innerText(),'正解です。');assert.equal(await page.locator('#explanation-text').innerText(),q.explanation);graded++;
   if(i<qs.length-1)await page.locator('#next-button').click();
  }
  console.log(`Verified ${unit.id}: ${qs.length} questions (${graded}/${questions.length})`);
 }
 // Wrong answer and no selection must use the existing explicit-submit behavior.
 const q=questions[0];await go(`pages/quiz.html?unit=${q.unitId}`);await page.locator('#quiz-form input').first().waitFor();await page.locator('#quiz-form button[type=submit]').click();assert.equal(await page.locator('#result-message').innerText(),'選択肢を1つ選んでください。');await page.locator(`input[value="${q.choices.find(c=>c.id!==q.correctChoiceId).id}"]`).check();await page.locator('#quiz-form button[type=submit]').click();assert.equal(await page.locator('#result-message').innerText(),'不正解です。');
 const sample=[...new Map(questions.filter(q=>q.material).map(q=>[JSON.stringify(q.material),q])).values()];
 // Render every unique diagram/table at small phone and desktop widths.
 for(const width of [320,1280]){await page.setViewportSize({width,height:900});for(const q of sample){await go(`pages/quiz.html?unit=${q.unitId}`);await page.locator('#quiz-form input').first().waitFor();for(let i=1;i<q.order;i++){await page.locator('#quiz-form input').first().check();await page.locator('#quiz-form button[type=submit]').click();await page.locator('#next-button').click();}assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),`${q.id} overflow at ${width}`);for(const img of await page.locator('#question-material img').all())await page.waitForFunction(el=>el.complete&&el.naturalWidth>0,await img.elementHandle());await page.screenshot({path:path.join(screenshots,`${q.material.image||q.id}-${width}.png`),fullPage:true});}}
 // Mixed range, and the pre-existing physics chapter still has all 168 main questions.
 await go(`pages/quiz.html?selection=1&course=entrance-science&count=10&unit=${units[0].id}&unit=${units[16].id}`);await page.locator('#quiz-form input').first().waitFor();assert.equal(await page.locator('#quiz-progress').innerText(),'1 / 10');
 await go('pages/quiz.html?chapter=chapter-entrance-science-physics');await page.locator('#quiz-form input').first().waitFor();assert.equal(await page.locator('#quiz-progress').innerText(),'1 / 168');
 assert.deepEqual(errors,[]);console.log(JSON.stringify({units:units.length,graded,materialTypes:sample.length,screenshots,errors}));
}finally{await browser.close();await new Promise(r=>server.close(r));}
