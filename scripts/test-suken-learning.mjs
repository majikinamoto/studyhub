import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import os from 'node:os';
import {createRequire} from 'node:module';
import {sukenCourses,courseHref} from '../assets/js/suken-courses.js';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/Owner/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const ids=new Set();let total=0,stepCount=0;
const records=sukenCourses.map(c=>({...c,data:JSON.parse(fs.readFileSync('data/suken-'+c.id+'.json','utf8'))}));
for(const c of records){
 const lids=new Set();for(const l of c.data.lessons){assert(!lids.has(l.id));lids.add(l.id);assert(l.steps.length>=3);for(const step of l.steps){assert.equal(step.length,4);assert(step.every(s=>typeof s==='string'&&s.length));stepCount++;}
 assert.equal(l.questions.length,5);assert.equal(l.questions.filter(q=>q.stage==='guided').length,2);assert.equal(l.questions.filter(q=>q.stage==='practice').length,3);
 for(const q of l.questions){assert(!ids.has(q.id));ids.add(q.id);assert(q.text&&q.hint&&q.explanation);assert.equal(q.choices.length,4);assert.equal(new Set(q.choices.map(x=>x.id)).size,4);assert.equal(new Set(q.choices.map(x=>x.text)).size,4);assert.equal(q.choices.filter(x=>x.id===q.correctChoiceId).length,1);assert(q.choices.every(x=>x.feedback));total++;}
 if(l.diagram){assert(fs.existsSync('assets/images/suken/'+l.diagram.file));assert(l.diagram.step<l.steps.length);}
 }
}
assert.equal(total,275);console.log('Schema: 55 lessons, '+total+' questions, '+stepCount+' explanation steps');
const root=process.cwd();const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{const data=fs.readFileSync(file);const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml'})[ext]||'application/octet-stream');res.end(data);}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const overflow=async label=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'overflow: '+label);
 const text=async(sel,value)=>{await page.locator(sel).filter({hasText:value}).waitFor();};
 for(const c of records){
 const href=base+'/pages/'+courseHref(c).slice(2);await page.goto(href);await page.locator('#marks').waitFor();await overflow(c.id+' overview');assert.equal(await page.locator('[data-mark]').count(),c.data.lessons.length);
 if(!c.page){assert.equal(await page.locator('[data-course-title]').textContent(),c.data.title);assert.equal(await page.locator('[data-phase-link]').textContent(),c.phase==='first'?'1次':'2次');}
 for(const l of c.data.lessons){
 await page.goto(href+'#view=lesson&unit='+l.id);await page.locator('#next-step').waitFor();
 for(let j=0;j<l.steps.length;j++){assert.equal(await page.locator('#learning-app h2').textContent(),l.steps[j][0]);await overflow(c.id+'/'+l.id+'/step'+j);if(l.diagram?.step===j){assert(await page.locator('.lesson-figure img').evaluate(el=>el.complete&&el.naturalWidth>0));}
 await page.locator('#next-step').click();}
 for(let i=0;i<l.questions.length;i++){
 const q=l.questions[i];await text('#learning-app h2',q.text);await overflow(q.id);await page.locator('input[value="'+q.correctChoiceId+'"]').check();assert(await page.locator('#result').isHidden());await page.locator('button[type=submit]').click();await page.locator('#result.is-correct').waitFor();assert((await page.locator('#result').textContent()).includes(q.explanation));await overflow(q.id+' result');await page.locator('#next-question').click();
 }
 await text('#learning-app h2','今回の練習');assert((await page.locator('#learning-app').textContent()).includes('5問中 5問正解'));
 }
 await page.goto(href);await page.locator('[data-mark]').first().click();await page.reload();await page.locator('[data-mark][aria-pressed=true]').waitFor();assert.equal(await page.locator('[data-mark][aria-pressed=true]').count(),1);
 await page.locator('[data-select=all]').click();assert((await page.locator('#selection').textContent()).includes((c.data.lessons.length*3)+'問'));await page.locator('#limit').selectOption('10');await page.locator('#start').click();await page.locator('#learning-form').waitFor();assert((await page.locator('.quiz-topline').textContent()).includes('1／'+Math.min(10,c.data.lessons.length*3)));
 const wrong=await page.locator('input[type=radio]').first().getAttribute('value');const qq=c.data.lessons.flatMap(l=>l.questions).find(q=>q.choices.some(x=>x.id===wrong));const wrongId=qq.choices.find(x=>x.id!==qq.correctChoiceId).id;
 await page.locator('button[type=submit]').click();await text('#answer-notice','答えを1つ');await page.locator('input[value="'+wrongId+'"]').check();await page.locator('button[type=submit]').click();await page.locator('#result.is-wrong').waitFor();
 console.log('Browser passed: '+c.id+' ('+c.data.lessons.length+' lessons)');
 }
 for(const phase of ['first','second']){await page.goto(base+'/pages/suken-2-'+phase+'.html');await overflow(phase+' landing');const links=await page.locator('main a').evaluateAll(es=>es.map(e=>e.href));for(const link of links){assert((await page.request.get(link)).ok(),link);}}
 await page.goto(base+'/pages/suken-course.html?topic=invalid');await text('#learning-app h2','この分野は見つかりません');
 await page.goto(base+'/pages/suken-course.html?topic=calculus#view=lesson&unit=invalid');await text('#learning-app h2','この項目は見つかりません');
 await page.route('**/data/suken-vectors.json',route=>route.abort());await page.goto(base+'/pages/suken-course.html?topic=vectors');await text('#learning-app h2','教材を読み込めませんでした');await page.unroute('**/data/suken-vectors.json');
 await page.goto(base+'/pages/suken-course.html?topic=trigonometry#view=lesson&unit=ratio');await page.locator('.lesson-figure img').waitFor();await page.screenshot({path:path.join(os.tmpdir(),'suken-triangle-mobile.png'),fullPage:true});
 await page.setViewportSize({width:1280,height:900});await page.goto(base+'/pages/suken-2-first.html');await overflow('desktop');await page.screenshot({path:path.join(os.tmpdir(),'suken-first-desktop.png'),fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS: all answers, steps, diagrams, mobile, progress, mixed quiz, errors, links. Screenshots in '+os.tmpdir());
}finally{await browser.close();await new Promise(r=>server.close(r));}
