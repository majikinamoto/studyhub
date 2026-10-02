import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import os from 'node:os';
import {createRequire} from 'node:module';
import {algebraBridge as d} from './suken-algebra-bridge-content.mjs';
assert.deepEqual(JSON.parse(fs.readFileSync('data/suken-algebra-bridge.json','utf8')),d);
assert.equal(d.diagnostic.length,3);assert.equal(d.lessons.length,4);
const algebra=JSON.parse(fs.readFileSync('data/suken-algebra.json','utf8'));
for(const q of d.diagnostic){const id=new URLSearchParams(q.href.split('#')[1]).get('unit');if(id)assert(algebra.lessons.some(l=>l.id===id),q.href);}
for(const l of d.lessons){assert.equal(l.questions.length,5);assert(l.steps.length>=3);for(const q of l.questions){assert(q.answer&&q.hint&&q.lines.length&&q.check.length);}}
// Each expression is a polynomial of degree <=4 in each variable. Checking
// five distinct values per variable uniquely determines these identities.
function evaluate(s,values){
 const power={'²':'2','³':'3','⁴':'4'};
 s=s.replace(/−/g,'-').replace(/([a-z])([²³⁴])/g,(_,v,p)=>v+'**'+power[p]);
 assert(/^[0-9a-z()+*\- ]+$/.test(s));
 s=s.replace(/(\d|\))(?=[a-z(])/g,'$1*').replace(/([a-z])(?=[a-z(])/g,'$1*').replace(/\)(?=\d)/g,')*');
 return Function('x','y','z','a','b','return '+s)(...['x','y','z','a','b'].map(v=>values[v]??0));
}
const expressions=[
 ['three-terms',2,'(x²+2x-1)(x²+2x-1)'],['three-terms',3,'(2x²-x-1)(2x²-x-1)'],['three-terms',4,'(x²+x-3)(x²+x-3)'],
 ['grouped-square',2,'4x²-y²+2yz-z²'],['grouped-square',3,'x²-4y²-4yz-z²'],['grouped-square',4,'16x²-9y²+6yz-z²'],
 ['repeat-difference',2,'(x-2)(x+2)(x²+4)'],['repeat-difference',3,'x⁴-81'],['repeat-difference',4,'(a-b)(a+b)(a²+b²)'],
 ['two-letters',2,'x²+xy-2y²'],['two-letters',3,'x²+xy-2y²+3x+2'],['two-letters',4,'x²+xy-2y²+4x-y+3']
];
let checked=0;
for(const [id,n,expression] of expressions){const q=d.lessons.find(l=>l.id===id).questions[n];const vars=[...new Set(expression.match(/[a-z]/g))];const walk=(i,v)=>{if(i===vars.length){assert(evaluate(q.answer,v)===evaluate(expression,v),id+'/'+n);checked++;return;}for(const x of [-2,-1,0,1,2])walk(i+1,{...v,[vars[i]]:x});};walk(0,{});}
assert.equal(d.lessons[0].questions[0].answer,'−4x²');assert.equal(d.lessons[0].questions[1].answer,'−3x²');
assert.equal(d.lessons[1].questions[0].answer,'(2y−z)²');assert.equal(d.lessons[1].questions[1].answer,'−2y+z');
assert.equal(d.lessons[2].questions[0].answer,'x²−4');assert.equal(d.lessons[2].questions[1].answer,'x⁴');
assert.equal(d.lessons[3].questions[0].answer,'(y+3)x');assert.equal(d.lessons[3].questions[1].answer,'和y、積−2y²');
console.log('PASS: 12 polynomial answers at '+checked+' grid points; guided answers and prerequisite links.');
const require=createRequire(import.meta.url);const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/Owner/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=process.cwd(),server=http.createServer((req,res)=>{const p=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!p.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css'})[path.extname(p)]||'text/plain');res.end(fs.readFileSync(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,url=base+'/pages/suken-algebra-bridge.html';
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const overflow=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 const go=async hash=>{await page.goto(url+hash);await page.locator('#learning-app h2').waitFor();await overflow();};
 await go('#view=overview');await page.getByRole('link',{name:'確認問題を始める'}).click();
 for(let n=0;n<3;n++){await page.locator('#reveal').waitFor();assert(await page.locator('#solution').isHidden());await page.locator('#reveal').click();await overflow();await page.locator('[data-assess=review]').click();}
 await page.getByRole('heading',{name:'出発点の確認が終わりました'}).waitFor();assert.equal(await page.locator('a.primary-button').count(),4);
 for(const l of d.lessons){
  for(let n=0;n<l.steps.length;n++){await go('#view=lesson&unit='+l.id+'&n='+n);assert.equal(await page.locator('#learning-app h2').textContent(),l.steps[n].title);}
  await page.getByRole('link',{name:'途中の一手へ'}).click();
  for(let n=0;n<5;n++){await page.locator('#reveal').waitFor();assert.equal(await page.locator('input[type=radio]').count(),0);assert(await page.locator('#solution').isHidden());assert.equal(await page.locator('#learning-app h2').textContent(),l.questions[n].text);await page.locator('#reveal').click();assert((await page.locator('#solution').textContent()).includes(l.questions[n].answer));await overflow();await page.locator('[data-assess=independent]').click();}
  await page.getByRole('heading',{name:l.title+'の練習が終わりました'}).waitFor();await overflow();
 }
 await go('#view=question&unit=three-terms&n=2');await page.locator('#hint summary').click();await page.locator('#reveal').click();assert(await page.locator('[data-assess=independent]').isHidden());await page.locator('[data-assess=review]').click();
 await go('#view=overview');assert((await page.locator('.bridge-progress').first().textContent()).includes('4問'));await page.reload();await page.locator('.bridge-progress').first().waitFor();assert((await page.locator('.bridge-progress').first().textContent()).includes('4問'));
 await page.screenshot({path:path.join(os.tmpdir(),'suken-bridge-mobile.png'),fullPage:true});
 await go('#view=question&unit=grouped-square&n=4');await page.locator('#reveal').click();await page.screenshot({path:path.join(os.tmpdir(),'suken-bridge-answer-mobile.png'),fullPage:true});
 for(const hash of ['#view=lesson&unit=missing','#view=question&unit=three-terms&n=-1','#view=question&unit=three-terms&n=99']){await go(hash);assert((await page.locator('h2').textContent()).includes('見つかりません'));}
 await page.route('**/data/suken-algebra-bridge.json',r=>r.abort());await go('');assert((await page.locator('#learning-app').textContent()).includes('読み込めません'));await page.unroute('**/data/suken-algebra-bridge.json');await page.reload();await page.locator('.bridge-progress').first().waitFor();
 await page.setViewportSize({width:320,height:740});await go('#view=lesson&unit=two-letters&n=2');await go('#view=question&unit=two-letters&n=4');await page.locator('#reveal').click();await overflow();
 await page.setViewportSize({width:1280,height:900});await go('#view=overview');assert.deepEqual(errors,[]);
 console.log('PASS: all 14 explanations and 23 questions, diagnostic routing, hidden answers, hint tracking, saved progress, 320/390px, errors.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
