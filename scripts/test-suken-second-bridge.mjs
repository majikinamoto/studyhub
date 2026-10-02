import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import os from 'node:os';
import {createRequire} from 'node:module';
const d=JSON.parse(fs.readFileSync('data/suken-second-bridge.json','utf8'));
assert.equal(d.groups.length,7);assert.equal(d.groups.reduce((n,g)=>n+g.lessons.length,0),25);
for(const g of d.groups){assert.equal(g.diagnostic.length,3);assert.equal(new Set(g.lessons.map(l=>l.id)).size,g.lessons.length);for(const l of g.lessons){assert.equal(l.questions.length,5);assert(l.steps.length>=3);for(const s of l.steps)assert(s.title&&s.body&&s.lines.length&&s.note);for(const q of l.questions)assert(q.text&&q.answer&&q.hint&&q.lines.length&&q.check.length&&!q.choices);}}
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'C:/Users/Owner/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=process.cwd(),server=http.createServer((req,res)=>{const p=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!p.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml'})[path.extname(p)]||'text/plain');res.end(fs.readFileSync(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,url=base+'/pages/suken-second-bridge.html';
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const overflow=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow');
 const ready=async title=>{await page.waitForFunction(t=>document.querySelector('#learning-app h2')?.textContent===t,title);await overflow();};
 const go=async(view,l,n,title)=>{await page.evaluate(hash=>location.hash=hash,'#'+new URLSearchParams({view,unit:l?.id||'',n}));await ready(title);};
 await page.goto(url);await ready('7分野から選ぼう');assert.equal(await page.getByRole('link',{name:'分野を開く',exact:true}).count(),7);
 for(const g of d.groups){
  await page.goto(url+'?topic='+g.id);await ready(g.title);await page.getByRole('link',{name:'確認問題を始める'}).click();
  for(let n=0;n<3;n++){await ready(g.diagnostic[n].text);assert(await page.locator('#solution').isHidden());await page.locator('#reveal').click();await page.locator('[data-assess=review]').click();}
  await ready('出発点の確認が終わりました');assert.equal(await page.locator('a.primary-button').count(),4);
  for(const l of g.lessons){
   for(let n=0;n<l.steps.length;n++)await go('lesson',l,n,l.steps[n].title);
   await page.getByRole('link',{name:'途中の一手へ'}).click();
   for(let n=0;n<5;n++){await ready(l.questions[n].text);assert(await page.locator('#solution').isHidden());assert.equal(await page.locator('input[type=radio]').count(),0);await page.locator('#reveal').click();assert((await page.locator('#solution').textContent()).includes(l.questions[n].answer));await overflow();await page.locator('[data-assess=independent]').click();}
   await ready(l.title+'の練習が終わりました');
  }
  await page.goto(url+'?topic='+g.id);await ready(g.title);for(const text of await page.locator('.bridge-progress').allTextContents())assert(text.includes('5／5問'));
  console.log('Browser passed: '+g.id);
 }
 const g=d.groups[1],l=g.lessons[0];await page.goto(url+'?topic='+g.id);await ready(g.title);await go('question',l,2,l.questions[2].text);await page.locator('#hint summary').click();await page.locator('#reveal').click();assert(await page.locator('[data-assess=independent]').isHidden());await page.locator('[data-assess=review]').click();await ready(l.questions[3].text);await page.reload();await ready(l.questions[3].text);assert(await page.locator('#solution').isHidden());
 await page.goto(url);await ready('7分野から選ぼう');await page.locator('article').filter({has:page.getByRole('heading',{name:g.title,exact:true})}).getByRole('link',{name:'前回の続き'}).click();await ready(l.questions[3].text);
 assert.equal(await page.evaluate(()=>localStorage.getItem('studyhub:suken:first-bridge:functions:v1')),null);
 await page.setViewportSize({width:320,height:740});for(const g of d.groups){await page.goto(url+'?topic='+g.id);await ready(g.title);for(const l of g.lessons){for(let n=0;n<l.steps.length;n++)await go('lesson',l,n,l.steps[n].title);for(let n=0;n<5;n++){await go('question',l,n,l.questions[n].text);await page.locator('#reveal').click();await overflow();}}}
 await page.goto(url);await ready('7分野から選ぼう');await page.screenshot({path:path.join(os.tmpdir(),'suken-second-bridge-mobile.png'),fullPage:true});
 await page.goto(url+'?topic=missing');await ready('この分野は見つかりません');await page.goto(url+'?topic=functions#view=question&unit='+l.id+'&n=-1');await ready('この項目は見つかりません');
 await page.evaluate(()=>localStorage.setItem('studyhub:suken:second-bridge:functions:v1','bad json'));await page.goto(url+'?topic=functions');await ready(g.title);assert((await page.locator('#storage-message').textContent()).includes('読み込めません'));
 await page.route('**/data/suken-second-bridge.json',r=>r.abort());await page.goto(url);await ready('教材を読み込めませんでした');assert(await page.getByRole('link',{name:'2次の入口へ'}).count());await page.unroute('**/data/suken-second-bridge.json');
 const blocked=await browser.newPage({viewport:{width:390,height:844}});await blocked.addInitScript(()=>{Storage.prototype.setItem=()=>{throw Error('blocked');};Storage.prototype.getItem=()=>{throw Error('blocked');};});await blocked.goto(url+'?topic=functions#view=question&unit='+l.id+'&n=0');await blocked.locator('#reveal').click();await blocked.locator('[data-assess=review]').click();await blocked.waitForFunction(t=>document.querySelector('#learning-app h2')?.textContent===t,l.questions[1].text);assert((await blocked.locator('#storage-message').textContent()).includes('保存できません'));await blocked.close();
 for(const entry of ['/pages/suken-2.html','/pages/suken-2-second.html']){await page.goto(base+entry);assert(await page.locator('a[href="./suken-second-bridge.html"]').count());await overflow();}
 await page.setViewportSize({width:1280,height:900});await page.goto(url);await ready('7分野から選ぼう');assert.deepEqual(errors,[]);
 console.log('PASS: 75 explanation screens, 125 exercises + 21 diagnostics, hidden answers, hints, reload, resume, storage isolation/errors, bad routes, 320/390px and desktop, entry links.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
