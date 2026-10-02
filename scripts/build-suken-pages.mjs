import fs from 'node:fs';
import {firstPlan} from './suken-first-plan.mjs';
import {sukenCourses,courseHref} from '../assets/js/suken-courses.js';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
for(const phase of ['first','second']){
 const courses=sukenCourses.filter(c=>c.phase===phase).map(c=>({...c,data:JSON.parse(fs.readFileSync('data/suken-'+c.id+'.json','utf8'))}));
 const units=courses.reduce((n,c)=>n+c.data.lessons.length,0),questions=courses.reduce((n,c)=>n+c.data.lessons.reduce((m,l)=>m+l.questions.length,0),0);
 const label=phase==='first'?'1次':'2次';
 const bridge=phase==='first'?JSON.parse(fs.readFileSync('data/suken-first-bridge.json','utf8')):null;
 const bridgeUnits=bridge?.groups.reduce((n,g)=>n+g.lessons.length,0);
 const bridgeQuestions=bridge?.groups.reduce((n,g)=>n+g.lessons.reduce((m,l)=>m+l.questions.length,0),0);
 const start=bridge?`<section class="study-card" aria-labelledby="start-title"><p class="card-label">1次の全11分野</p><h2 id="start-title">説明から記述まで、ここから始めよう</h2><p>${bridgeUnits}項目・${bridgeQuestions}問＋分野別の確認33問。ヒントと途中式を使いながら、紙に答えを書いて進めます。前回の続きも開けます。</p><a class="primary-button" href="./suken-first-bridge.html">1次の学習を始める・続ける</a><p><a class="text-link" href="#list-title">4択の基礎教材で復習する</a></p></section>`:'';
 const intro=phase==='first'?'高校数学が初めてなら、上から順に。分からない言葉を確認し、紙に途中式を書きながら進もう。 <a class="text-link" href="./suken-first-bridge.html">全分野を学ぶ：確認問題と、選択肢なしの記述練習</a>':'理由を説明する練習の入口。まず4択で考え方を確かめ、答えを隠して紙に証明や途中式を書こう。';
 const cards=courses.map((c,i)=>`<article class="study-card"><p class="card-label">${i+1} · ${c.data.lessons.length}項目・${c.data.lessons.reduce((n,l)=>n+l.questions.length,0)}問</p><h3>${esc(c.title)}</h3><p>${c.data.lessons.map(l=>esc(l.title)).join(' ／ ')}</p><a class="primary-button" href="${esc(courseHref(c))}#view=lesson&amp;unit=${c.data.lessons[0].id}">説明から学ぶ</a><a class="secondary-button" href="${esc(courseHref(c))}">項目を選んで練習</a></article>`).join('\n');
 fs.writeFileSync('pages/suken-2-'+phase+'.html',`<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>数検 2級 ${label} | StudyHub</title><link rel="stylesheet" href="../assets/css/style.css"></head>
<body><header class="site-header"><div class="app-shell site-header-inner"><a class="site-brand" href="../index.html">StudyHub</a><a class="home-link" href="../index.html">ホームへ戻る</a></div></header>
<header class="app-header"><div class="app-shell page-header"><nav class="breadcrumb" aria-label="パンくずリスト"><a href="../index.html">StudyHub</a><a href="./qualifications.html">資格試験</a><a href="./suken.html">数検</a><a href="./suken-2.html">2級</a><span aria-current="page">${label}</span></nav><p class="app-kicker">初めて学ぶための基礎練習</p><h1>数検 2級 ${label}</h1><p class="header-copy">${intro}</p></div></header>
<main class="app-shell">${start}${phase==='first'?firstPlan:''}<section class="section-stack" aria-labelledby="list-title"><div class="section-heading"><h2 id="list-title">${units}項目・${questions}問の基礎教材</h2><p>意味を知る → 例題を見る → 途中の一手2問 → 自力練習3問</p><p>1項目ずつ進めれば大丈夫。「覚えた」の印と、選んだ項目のまとめ練習も使えます。</p><p>${phase==='first'?'提供資料を参考にしたオリジナルの基礎教材です。全掲載問題の収録や本番形式の模擬試験ではありません。':'4択は考え方の確認用です。記述答案の添削・自動採点はありません。'} <a class="text-link" href="./suken-2-${phase==='first'?'second':'first'}.html">${phase==='first'?'2次の考え方へ':'1次の基礎に戻る'}</a></p></div><div class="card-grid">${cards}</div></section></main></body></html>\n`);
}
