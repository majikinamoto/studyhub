const { chromium } = require('C:/Users/Owner/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const context={window:{}};
vm.runInNewContext(fs.readFileSync('assets/js/eiken-vocabulary-data.js','utf8'),context);
vm.runInNewContext(fs.readFileSync('assets/js/eiken-check-data.js','utf8'),context);
const data=JSON.parse(JSON.stringify(context.window.EikenVocabularyData));
assert.equal(data.entries.length,744);
assert.deepEqual(data.entries.map(i=>i.number),Array.from({length:744},(_,i)=>i+1));
assert.equal(data.units.reduce((n,u)=>n+u.words.length,0),665);
assert.equal(data.units.reduce((n,u)=>n+u.phrases.length,0),79);
// Answer keys below are transcribed from the supplied following-Unit pages.
const answerKeys=[
' b c a a c b c a b a b a b a c a c b b a ',
' b a b b c a c b a b a a c c b a b c a b ',
' a c c a a b b c b a c c b a c b a b b a ',
' a a c a b c b b a c b b a c b c a b a b ',
' a c c a c b c a b b b a c b a b b a c a ',
' a c b c b c b a b a b a c a a b c a c b ',
' b a c a c a c b c a c a c b b a a a b c '
].map(s=>s.trim().split(/\s+/).map(c=>'abc'.indexOf(c)));
for(const unit of data.units){
assert.equal(unit.words.length+unit.phrases.length,unit.id===1?72:96);
const checks=data.checks.filter(c=>c.unit===unit.id);assert.equal(checks.length,20);
checks.forEach((c,i)=>{assert.equal(c.number,i+1);assert.equal(c.options.length,3);assert.equal(new Set(c.options).size,3);assert.ok(c.options.includes(c.answer));assert.ok(c.sentence.includes('( )'));assert.ok(c.translation&&c.explanation);if(unit.id<8)assert.equal(c.options.indexOf(c.answer),answerKeys[unit.id-1][i],'Answer key Unit '+unit.id+' question '+c.number);});
unit.phrases.forEach(p=>assert.ok(p.answer.split(' ').length>=2));
}
(async()=>{
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
const page=await browser.newPage({viewport:{width:390,height:844}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const open=name=>page.goto(pathToFileURL(path.resolve('pages',name)).href);
const width=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
await open('eiken.html');assert.equal(await page.locator('a[href="./eiken-checks.html"]').count(),1);
assert.equal(data.studyUnits.length,31);
assert.deepEqual(data.studyUnits.flatMap(u=>[...u.words,...u.phrases]).map(i=>i.number).sort((a,b)=>a-b),data.entries.map(i=>i.number));
for(const u of data.studyUnits){assert.equal(u.last-u.first+1,24);assert.equal(u.words.length+u.phrases.length,24);}
assert.equal(data.studyUnits.find(u=>u.id==='5-1').first,361);
assert.equal(data.studyUnits.find(u=>u.id==='5-2').first,385);
for(const kind of ['words','phrases','checks']){
await open('eiken-'+kind+'.html');assert.equal(await page.locator('#unit-cards article').count(),kind==='checks'?8:31);await width();
for(const unit of (kind==='checks'?data.units:data.studyUnits)){
await page.getByRole('button',{name:'Unit '+unit.id+'を始める',exact:true}).click();
const items=kind==='checks'?data.checks.filter(c=>c.unit===unit.id):unit[kind];
assert.match(await page.locator('#vocabulary-app').innerText(),new RegExp('1 / '+items.length+'問'));
const seen=[];
for(let i=0;i<items.length;i++){
const num=Number(await page.locator('#vocabulary-app').getAttribute('data-item'));seen.push(num);
const item=items.find(v=>v.number===num);assert.ok(item);
await page.evaluate(({kind,answer,wrong})=>{
const area=document.querySelector('#answer-area');
if(kind==='phrases'){
const submit=document.querySelector('#editing .primary-button');if(!submit.disabled)throw Error('Incomplete answer enabled');
const token=area.querySelector('[data-token]');token.click();document.querySelector('#editing .secondary-button').click();
if(area.querySelectorAll('[data-token]:disabled').length)throw Error('Undo failed');
token.click();document.querySelectorAll('#editing .secondary-button')[1].click();
if(area.querySelectorAll('[data-token]:disabled').length)throw Error('Reset failed');
for(const word of answer.split(' ')){const b=[...area.querySelectorAll('[data-token]')].find(b=>!b.disabled&&b.textContent===word);if(!b)throw Error('Missing token '+word);b.click();}
submit.click();
}else{
const buttons=[...area.querySelectorAll('button')];if(buttons.length!==3)throw Error('Not 3 choices');const b=buttons.find(b=>wrong?b.textContent!==answer:b.textContent===answer);b.click();
}
},{kind,answer:item.answer,wrong:kind==='checks'&&i===0});
assert.match(await page.locator('#feedback').innerText(),kind==='checks'&&i===0?/もう一度/:/^正解！/);
if(kind==='checks')assert.match(await page.locator('#feedback').innerText(),/日本語訳：.*[\s\S]*解説：/);
if(i===0)await width();
await page.locator('#next-control button').click();
}
assert.equal(new Set(seen).size,items.length);
assert.match(await page.locator('.vocab-score').innerText(),new RegExp(items.length+'問中 '+(items.length-(kind==='checks'?1:0))+'問正解'));
if(kind==='checks'){
await page.getByRole('button',{name:'間違えた1問に再挑戦',exact:true}).click();
assert.match(await page.locator('#vocabulary-app').innerText(),/1 \/ 1問/);
const item=items.find(v=>v.number===Number(seen[0]));await page.getByRole('button',{name:item.answer,exact:true}).click();await page.locator('#next-control button').click();assert.match(await page.locator('.vocab-score').innerText(),/1問中 1問正解/);
await page.getByRole('button',{name:'Unit '+unit.id+'をもう一度',exact:true}).click();assert.match(await page.locator('#vocabulary-app').innerText(),/1 \/ 20問/);
}
await page.getByRole('button',{name:'Unit選択に戻る',exact:true}).click();
}
}
await open('eiken-words.html');await page.getByLabel('学習モード').selectOption('hard');await page.getByRole('button',{name:'Unit 1-2を始める',exact:true}).click();
for(let i=0;i<21;i++){
const num=Number(await page.locator('#vocabulary-app').getAttribute('data-item'));const item=data.entries.find(v=>v.number===num);
if(i===0){await page.getByRole('button',{name:'頭文字を見る',exact:true}).click();assert.match(await page.locator('#answer-area').innerText(),/頭文字：/);}
const fullwidth=item.answer.toUpperCase().replace(/[A-Z]/g,c=>String.fromCharCode(c.charCodeAt(0)+65248));
await page.getByLabel('英単語の回答').fill(i===1?'wrong':'  '+fullwidth+'  ');await page.getByRole('button',{name:'答え合わせ',exact:true}).click();assert.match(await page.locator('#feedback').innerText(),i===1?/もう一度/:/^正解！/);await page.locator('#next-control button').click();
}
assert.match(await page.locator('.vocab-score').innerText(),/21問中 20問正解/);assert.match(await page.locator('#review').innerText(),/ヒントの使用：1問/);
await page.getByRole('button',{name:'間違えた1問に再挑戦',exact:true}).click();assert.match(await page.locator('#vocabulary-app').innerText(),/1 \/ 1問/);
await open('eiken-checks.html');await page.screenshot({path:'docs/drafts/eiken-menu-mobile.png',fullPage:true});
await page.getByRole('button',{name:'Unit 8を始める',exact:true}).click();await page.locator('.vocab-choices button').nth(1).click();await page.screenshot({path:'docs/drafts/eiken-check-mobile.png',fullPage:true});await width();
await page.setViewportSize({width:1280,height:900});await open('eiken-words.html');await page.screenshot({path:'docs/drafts/eiken-menu-desktop.png',fullPage:true});await width();
assert.deepEqual(errors,[]);
console.log('PASS: 744 entries, 160 checks, answer keys Units 1–7; all 904 easy/phrase/check questions across 31 vocabulary Units and 8 check Units, hard typing, Unicode, hints, undo/reset, wrong-only retry, full retry, mobile/desktop, no browser errors.');
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
