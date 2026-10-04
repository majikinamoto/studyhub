const {chromium}=require('C:/Users/Owner/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  try {
    const page=await browser.newPage({viewport:{width:390,height:844}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const open=kind=>page.goto(pathToFileURL(path.resolve('pages/eiken-'+kind+'.html')).href);
    const mark=id=>page.getByRole('checkbox',{name:'Unit '+id+'の覚えたチェック',exact:true});
    await open('words');await page.evaluate(()=>localStorage.clear());await page.reload();
    assert.equal(await page.getByRole('checkbox').count(),31);
    await mark('5-1').check();assert.match(await page.locator('#mastery-summary').innerText(),/1 \/ 31/);
    await page.reload();assert.equal(await mark('5-1').isChecked(),true);
    await open('phrases');assert.equal(await mark('5-1').isChecked(),false);await mark('5-1').check();
    await open('words');await mark('5-1').uncheck();await page.reload();assert.equal(await mark('5-1').isChecked(),false);
    await open('phrases');assert.equal(await mark('5-1').isChecked(),true);
    await page.getByRole('button',{name:'Unit 1-2を始める',exact:true}).click();
    await page.evaluate(()=>{
      for(let i=0;i<3;i++){
        const num=Number(document.querySelector('#vocabulary-app').dataset.item);
        const item=window.EikenVocabularyData.entries.find(e=>e.number===num);
        for(const word of item.answer.split(' ')) [...document.querySelectorAll('[data-token]')].find(b=>!b.disabled&&b.textContent===word).click();
        document.querySelector('#editing .primary-button').click();document.querySelector('#next-control button').click();
      }
    });
    assert.match(await page.locator('.vocab-score').innerText(),/3問中 3問正解/);
    assert.equal(await mark('1-2').isChecked(),false);await mark('1-2').check();
    await page.getByRole('button',{name:'Unit選択に戻る',exact:true}).click();assert.equal(await mark('1-2').isChecked(),true);
    await open('checks');assert.equal(await page.getByRole('checkbox').count(),8);await mark('5').check();await page.reload();assert.equal(await mark('5').isChecked(),true);
    await open('words');await page.evaluate(()=>localStorage.setItem('studyhub:eiken:words:mastered','{"bad":true}'));await page.reload();assert.equal(await mark('5-1').isChecked(),false);
    await page.evaluate(()=>localStorage.setItem('studyhub:eiken:words:mastered','not json'));await page.reload();assert.match(await page.locator('#mastery-notice').innerText(),/読み込めません/);
    await page.addInitScript(()=>{Storage.prototype.setItem=function(){throw new Error('blocked');};});await page.reload();await mark('5-1').check();assert.match(await page.locator('#mastery-notice').innerText(),/保存できません/);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    assert.deepEqual(errors,[]);
    console.log('PASS: mastery add/remove, reload persistence, separate word/phrase/check records, results control, no automatic marks, malformed data, storage failure, mobile width.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
