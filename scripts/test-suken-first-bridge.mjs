import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import os from 'node:os';
import {createRequire} from 'node:module';
import {sukenCourses,courseHref} from '../assets/js/suken-courses.js';
const d=JSON.parse(fs.readFileSync('data/suken-first-bridge.json','utf8'));
assert.deepEqual(d.groups.map(g=>g.id),sukenCourses.filter(c=>c.phase==='first').map(c=>c.id));
assert.equal(d.groups.length,11);assert.equal(d.groups.reduce((n,g)=>n+g.lessons.length,0),86);
let steps=0,questions=0;
const checkHref=href=>{const [page,hash]=href.split('#');assert(fs.existsSync('pages/'+page.replace('./','').split('?')[0]),href);const unit=new URLSearchParams(hash||'').get('unit');if(unit){const course=sukenCourses.find(c=>courseHref(c)===page);assert(course,href);const source=JSON.parse(fs.readFileSync('data/suken-'+course.id+'.json'));assert(source.lessons.some(l=>l.id===unit),href);}};
for(const g of d.groups){
 assert.equal(g.diagnostic.length,3);assert.equal(new Set(g.lessons.map(l=>l.id)).size,g.lessons.length);checkHref(g.href);
 for(const q of g.diagnostic){checkHref(q.href);assert(q.text&&q.answer&&q.hint&&q.check.length);}
 for(const l of g.lessons){assert(l.steps.length>=3);checkHref(l.href);for(const s of l.steps){assert(s.title&&s.body&&s.lines.length&&s.note);steps++;}assert.equal(l.questions.length,5);
  for(const q of l.questions){assert(q.text&&q.answer&&q.hint&&q.lines.length&&q.check.length);assert(!q.choices);questions++;}
  if(l.diagram)assert(fs.existsSync('assets/images/suken/'+l.diagram.file));
  if(l.origin==='existing'){const old=JSON.parse(fs.readFileSync('data/suken-'+g.id+'.json')).lessons.find(a=>'base-'+a.id===l.id);for(let i=0;i<5;i++){const q=old.questions[i];assert.equal(l.questions[i].answer,q.choices.find(c=>c.id===q.correctChoiceId).text);assert.equal(l.questions[i].lines[0],q.explanation);}}
 }
}
assert.equal(questions,430);console.log('Schema: 11 groups, 86 lessons, '+steps+' explanation screens, 430 exercises + 33 diagnostic questions.');
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/Owner/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=process.cwd(),server=http.createServer((req,res)=>{const p=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!p.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml'})[path.extname(p)]||'text/plain');res.end(fs.readFileSync(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,url=base+'/pages/suken-first-bridge.html';
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const overflow=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow');
 const ready=async title=>{await page.waitForFunction(t=>document.querySelector('#learning-app h2')?.textContent===t,title);await overflow();};
 const go=async(view,l,n,title)=>{await page.evaluate(hash=>location.hash=hash,'#'+new URLSearchParams({view,unit:l?.id||'',n}));await ready(title);};
 await page.goto(url);await ready('11分野から選ぼう');assert.equal(await page.getByRole('link',{name:'分野を開く',exact:true}).count(),11);
 for(const g of d.groups){
  await page.goto(url+'?topic='+g.id);await ready(g.title);
  await page.getByRole('link',{name:'確認問題を始める'}).click();
  for(let n=0;n<3;n++){await ready(g.diagnostic[n].text);assert(await page.locator('#solution').isHidden());await page.locator('#reveal').click();await overflow();await page.locator('[data-assess=review]').click();}
  await ready('出発点の確認が終わりました');assert.equal(await page.locator('a.primary-button').count(),4);
  for(const l of g.lessons){
   for(let n=0;n<l.steps.length;n++){await go('lesson',l,n,l.steps[n].title);if(l.diagram?.step===n)assert(await page.locator('.bridge-diagram').evaluate(img=>img.complete&&img.naturalWidth>0));}
   await page.getByRole('link',{name:'途中の一手へ'}).click();
   for(let n=0;n<5;n++){await ready(l.questions[n].text);assert.equal(await page.locator('input[type=radio]').count(),0);assert(await page.locator('#solution').isHidden());await page.locator('#reveal').click();assert((await page.locator('#solution').textContent()).includes(l.questions[n].answer));await overflow();await page.locator('[data-assess=independent]').click();}
   await ready(l.title+'の練習が終わりました');
  }
  await page.goto(url+'?topic='+g.id);await ready(g.title);for(const text of await page.locator('.bridge-progress').allTextContents())assert(text.includes('5／5問'),text);
  console.log('Browser passed: '+g.id+' ('+g.lessons.length+' lessons)');
 }
 // A hint must not count as independent work; progress survives reload.
 const g=d.groups.find(g=>g.id==='probability'),l=g.lessons.find(l=>l.id==='inference');
 await page.goto(url+'?topic=probability');await ready(g.title);await go('question',l,2,l.questions[2].text);await page.locator('#hint summary').click();await page.locator('#reveal').click();assert(await page.locator('[data-assess=independent]').isHidden());await page.locator('[data-assess=review]').click();await ready(l.questions[3].text);
 await page.reload();await ready(l.questions[3].text);assert(await page.locator('#solution').isHidden());
 await page.goto(url);await ready('11分野から選ぼう');const resume=page.locator('article').filter({has:page.getByRole('heading',{name:g.title,exact:true})}).getByRole('link',{name:'前回の続き'});await resume.click();await ready(l.questions[3].text);
 await go('overview',null,0,g.title);const card=page.locator('article').filter({has:page.getByRole('heading',{name:l.title,exact:true})});assert((await card.locator('.bridge-progress').textContent()).includes('4問'));
 await go('lesson',l,1,l.steps[1].title);await page.screenshot({path:path.join(os.tmpdir(),'suken-first-bridge-inference-mobile.png'),fullPage:true});
 // Check the narrowest supported width on every new explanation and answer.
 await page.setViewportSize({width:320,height:740});
 for(const g of d.groups){await page.goto(url+'?topic='+g.id);await ready(g.title);for(const l of g.lessons.filter(l=>l.origin==='new')){for(let n=0;n<l.steps.length;n++)await go('lesson',l,n,l.steps[n].title);for(let n=0;n<5;n++){await go('question',l,n,l.questions[n].text);await page.locator('#reveal').click();await overflow();}}}
 await page.goto(url);await ready('11分野から選ぼう');await page.screenshot({path:path.join(os.tmpdir(),'suken-first-bridge-catalog-mobile.png'),fullPage:true});
 await page.goto(url+'?topic=missing');await ready('この分野は見つかりません');
 await page.goto(url+'?topic=roots#view=question&unit=base-squares&n=-1');await ready('この項目は見つかりません');
 await page.evaluate(()=>localStorage.setItem('studyhub:suken:first-bridge:roots:v1','bad json'));await page.goto(url+'?topic=roots');await ready(d.groups[0].title);assert((await page.locator('#storage-message').textContent()).includes('読み込めません'));
 await page.route('**/data/suken-first-bridge.json',r=>r.abort());await page.goto(url);await ready('教材を読み込めませんでした');await page.unroute('**/data/suken-first-bridge.json');
 // Disabled storage still lets the student learn.
 const blocked=await browser.newPage({viewport:{width:390,height:844}});await blocked.addInitScript(()=>{Storage.prototype.setItem=()=>{throw Error('blocked');};Storage.prototype.getItem=()=>{throw Error('blocked');};});await blocked.goto(url+'?topic=roots#view=question&unit=base-squares&n=0');await blocked.locator('#reveal').click();await blocked.locator('[data-assess=review]').click();await blocked.waitForFunction(()=>document.querySelector('#learning-app h2')?.textContent.includes('(−4)'));assert((await blocked.locator('#storage-message').textContent()).includes('保存できません'));await blocked.close();
 await page.setViewportSize({width:1280,height:900});await page.goto(url);await ready('11分野から選ぼう');await page.screenshot({path:path.join(os.tmpdir(),'suken-first-bridge-desktop.png'),fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS: all explanations and 463 questions, diagrams, hidden answers, hints, saved progress, resume, 320/390px, invalid routes, load/storage failures, desktop.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
