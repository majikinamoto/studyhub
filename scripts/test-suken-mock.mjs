import assert from 'node:assert/strict';
import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import os from 'node:os';import {createRequire} from 'node:module';
import {mockSets} from '../assets/js/suken-mock-content.js';
assert.equal(mockSets.first.questions.length,15);assert.equal(mockSets.second.questions.length,7);
assert.equal(mockSets.first.minutes,50);assert.equal(mockSets.second.minutes,90);
for(const phase of ['first','second']){const groups=JSON.parse(fs.readFileSync('data/suken-'+phase+'-bridge.json')).groups;const ids=new Set();for(const q of mockSets[phase].questions){assert(!ids.has(q.id));ids.add(q.id);assert(groups.some(g=>g.id===q.topic));for(const p of q.parts)assert(p.text&&p.answer&&p.lines.length&&p.check.length);}}
// Independent solutions and identities. Proof/interpretation prose is editorially checked.
for(let x=-10;x<=10;x+=.25){assert(Math.abs((x+3)*(x-2)-(x*x+x-6))<1e-10);if(x!==3)assert(Math.abs((x*x-9)/(x-3)-(x+3))<1e-10);}
assert(Math.abs(Math.sqrt(75)-Math.sqrt(12)-3*Math.sqrt(3))<1e-10);
// ((1+3i)/2)(1-i)=2+i.
assert.equal(.5+1.5,2);assert.equal(1.5-.5,1);
for(const x of [-2,0,2])assert.equal(x**3-4*x,0);
for(const x of [1,2])assert.equal(2**(2*x)-6*2**x+8,0);assert.equal(3**2+2,11);
for(const x of [Math.PI/3,5*Math.PI/3])assert(Math.abs(Math.cos(x)-.5)<1e-10);
assert.equal(12+9+4,25);for(const [x,y] of [[1,2],[3,8]])assert.equal(3*x-1,y);
const f=x=>3*x**3-2*x*x+x;for(let x=-5;x<=5;x++){const h=1e-5;assert(Math.abs((f(x+h)-f(x-h))/(2*h)-(9*x*x-4*x+1))<1e-6);}
assert.equal(2**3-2**2+2,6);assert.equal(6*5/2,15);assert.equal(8*.25,2);assert.equal(8*.25*.75,1.5);assert.equal([1,3,5].reduce((s,x)=>s+(x-3)**2,0)/3,8/3);
let aMax=0,bMax=0;for(let x=0;x<=100;x++){assert.equal(500+30*x<=1000+20*x,x<=50);if(500+30*x<=3000)aMax=x;if(1000+20*x<=3000)bMax=x;}assert.equal(aMax,83);assert.equal(bMax,100);
assert(Math.abs(102-1.96*12/6-98.08)<1e-10);assert(Math.abs(102+1.96*12/6-105.92)<1e-10);assert.equal((102-100)/(12/6),1);
assert.equal(1**3-6+9,4);assert.equal(3**3-6*9+27,0);
for(const [x,y] of [[1,2],[-2,-1]]){assert.equal(x*x+y*y,5);assert.equal(y,x+1);}assert(Math.abs(40-4*Math.sqrt(10)**2)<1e-10);
// Simpson integration verifies both geometric areas independently.
const integrate=(fn,a,b)=>{const N=1000,h=(b-a)/N;let t=fn(a)+fn(b);for(let i=1;i<N;i++)t+=(i%2?4:2)*fn(a+i*h);return t*h/3;};assert(Math.abs(integrate(x=>3*x-x*x,0,3)-4.5)<1e-10);assert(Math.abs(integrate(x=>(x-2)**2,0,2)-8/3)<1e-10);
assert(Math.abs(Math.sin(Math.PI/4)+Math.cos(Math.PI/4)-Math.SQRT2)<1e-10);
let total=0,red=0,condition=0;for(let i=0;i<7;i++)for(let j=i+1;j<7;j++){total++;if(i<4&&j<4)red++;if(i<4||j<4)condition++;}assert.equal(red/total,2/7);assert.equal(red/condition,1/3);
console.log('PASS: 22 original questions/29 subquestions; independent algebra, complex arithmetic, roots, derivative, optimization, statistics, circle intersections, areas and exhaustive probability.');
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'C:/Users/Owner/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=process.cwd(),server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[path.extname(file)]||'text/plain');res.end(fs.readFileSync(file));}catch{res.writeHead(404).end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port,url=base+'/pages/suken-mock.html',browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const heading=async text=>await page.getByRole('heading',{name:text,exact:true}).waitFor();const overflow=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.goto(url);await heading('練習方法を選ぶ');await page.getByRole('button',{name:'1次の模擬練習',exact:true}).click();await page.locator('#begin').click();assert.equal(await page.locator('details').count(),0);await page.locator('#mark').click();await page.locator('#next').click();const started=await page.evaluate(()=>JSON.parse(localStorage.getItem('studyhub:suken:mock:v1')).first.started);
 await page.reload();await page.getByRole('button',{name:'1次の前回の続き'}).click();await heading('1次：平方根');assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('studyhub:suken:mock:v1')).first.started),started);
 await page.locator('#finish').click();assert((await page.locator('#mock-app').textContent()).includes('14題'));await page.locator('#cancel').click();await heading('1次：平方根');await page.locator('#finish').click();await page.locator('#end').click();await heading('解答例と照合して復習する');assert((await page.locator('#mock-app').textContent()).includes('未確認 15題'));await page.locator('[data-assess=review]').first().click();assert((await page.locator('#mock-app').textContent()).includes('復習したい 1題'));await page.locator('#home').click();
 await page.getByRole('button',{name:'2次の模擬練習',exact:true}).click();assert(await page.locator('#begin').isDisabled());const inputs=page.locator('input');for(let i=0;i<3;i++)await inputs.nth(i).check();assert(await page.locator('#begin').isEnabled());await inputs.nth(3).check();assert(await page.locator('#begin').isDisabled());await inputs.nth(3).uncheck();await page.locator('#begin').click();assert.equal(await page.locator('[data-index]').count(),5);assert.equal(await page.locator('details').count(),0);
 await page.evaluate(()=>{const r=JSON.parse(localStorage.getItem('studyhub:suken:mock:v1'));r.second.started=Date.now()-91*60000;localStorage.setItem('studyhub:suken:mock:v1',JSON.stringify(r));});await page.reload();await page.getByRole('button',{name:'2次の前回の続き'}).click();assert((await page.locator('#timer').textContent()).includes('制限時間になりました'));await page.locator('#finish').click();await page.locator('#end').click();assert((await page.locator('#mock-app').textContent()).includes('制限時間超過'));assert.equal(await page.locator('#mock-app article').count(),5);await page.locator('#home').click();
 // Practice exposes all questions and answers, while preserving the other phase's latest attempt.
 for(const width of [320,390,1280]){await page.setViewportSize({width,height:850});for(const [phase,set] of Object.entries(mockSets)){await page.getByRole('button',{name:set.label+'の総合練習（時間なし）',exact:true}).click();await page.locator('#begin').click();await overflow();assert((await page.locator('#timer').textContent()).includes('時間制限なし'));for(let i=0;i<set.questions.length;i++){await page.locator('[data-index="'+i+'"]').click();await page.locator('summary').click();await overflow();for(const p of set.questions[i].parts)assert((await page.locator('details').textContent()).includes(p.answer));}await page.locator('#finish').click();await page.locator('#end').click();await overflow();await page.locator('#home').click();}await overflow();}
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'2次の前回の結果'}).click();await page.locator('summary').nth(1).click();await page.screenshot({path:path.join(os.tmpdir(),'suken-mock-results-mobile.png'),fullPage:true});
 await page.evaluate(()=>localStorage.setItem('studyhub:suken:mock:v1','bad json'));await page.reload();await heading('練習方法を選ぶ');assert((await page.locator('#notice').textContent()).includes('読み込めません'));
 const blocked=await browser.newPage();await blocked.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('blocked');};Storage.prototype.setItem=()=>{throw Error('blocked');};});await blocked.goto(url);await blocked.getByRole('button',{name:'1次の模擬練習',exact:true}).click();await blocked.locator('#begin').click();assert((await blocked.locator('#notice').textContent()).includes('保存できません'));await blocked.close();
 await page.goto(base+'/pages/suken-2.html');assert.equal(await page.locator('a[href="./suken-mock.html"]').count(),1);assert.deepEqual(errors,[]);
 console.log('PASS: selection limits, required questions, hidden solutions, navigation, marks, finish/cancel, review, persistent timer/resume, timeout, all problems at 320/390/1280px, corrupt/blocked storage, entry link.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
