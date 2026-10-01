import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const bank=JSON.parse(fs.readFileSync(path.join(root,'data/entrance-materials.json'),'utf8'));
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+new URL(req.url,'http://local').pathname);
 if(!file.startsWith(root)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404).end();return;}
 res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml'}[path.extname(file)]||'application/octet-stream')+'; charset=utf-8');res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=process.env.STUDYHUB_BASE_URL||`http://127.0.0.1:${server.address().port}/`;
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
const go=url=>page.goto(new URL(url,base).href);
const screenshots=path.join(os.tmpdir(),'studyhub-materials-preview');fs.mkdirSync(screenshots,{recursive:true});
let graded=0;
try{
 for(const field of ['geography','history','civics']){
  await go(`pages/chapter.html?chapter=chapter-entrance-social-${field}&section=materials`);
  await page.locator('#unit-list .study-card').first().waitFor();
  assert.equal(await page.locator('#unit-list .study-card').count(),bank.units.filter(u=>u.chapterId.endsWith(field)).length);
 }
 for(const unit of bank.units){
  await go(`pages/quiz.html?unit=${unit.id}`);
  const questions=bank.questions.filter(q=>q.unitId===unit.id);
  await page.locator('#quiz-form input').first().waitFor();
  for(let i=0;i<questions.length;i++){
   const q=questions[i];
   assert.equal(await page.locator('#question-text').innerText(),q.text);
   assert.equal(await page.locator('#quiz-form input').count(),4);
   assert(await page.locator('#question-material').isVisible());
   assert(!(await page.locator('#question-hint').getAttribute('open')));
   await page.locator('#question-hint summary').click();
   assert.equal(await page.locator('#hint-text').innerText(),q.hint);
   for(const img of await page.locator('#question-material img').all())assert(await img.evaluate(el=>el.complete&&el.naturalWidth>0));
   await page.locator(`input[value="${q.correctChoiceId}"]`).check();
   assert(await page.locator('#result-box').isHidden());
   await page.locator('#quiz-form button[type=submit]').click();
   assert.equal(await page.locator('#result-message').innerText(),'正解です。');
   assert.equal(await page.locator('#explanation-text').innerText(),q.explanation);
   graded++;
   if(i<questions.length-1)await page.locator('#next-button').click();
  }
 }
 for(const width of [320,390,1280]){
  await page.setViewportSize({width,height:900});
  for(const unitId of ['unit-entrance-materials-geography-01','unit-entrance-materials-geography-07','unit-entrance-materials-civics-01']){
   await go(`pages/quiz.html?unit=${unitId}`);await page.locator('#quiz-form input').first().waitFor();
   assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
   await page.screenshot({path:path.join(screenshots,`${unitId}-${width}.png`),fullPage:true});
  }
 }
 await go('pages/quiz.html?chapter=chapter-entrance-social-history');await page.locator('#quiz-form input').first().waitFor();assert.equal(await page.locator('#quiz-progress').innerText(),'1 / 403');assert(await page.locator('#question-material').isHidden());
 await go('pages/quiz.html?chapter=chapter-entrance-social-civics&section=materials');await page.locator('#quiz-form input').first().waitFor();assert.equal(await page.locator('#quiz-progress').innerText(),'1 / 84');
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({base,units:bank.units.length,graded,errors,screenshots}));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
