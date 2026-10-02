import fs from 'node:fs';
import {secondUnits} from './suken-second-bridge-content.mjs';
import {secondExpansion} from './suken-second-expansion-content.mjs';
const old=JSON.parse(fs.readFileSync('data/suken-reasoning.json','utf8'));
const titles={reasoning:'証明・整数・論理',functions:'関数と方程式の条件',geometry:'軌跡と最短距離',calculus:'微分・積分の活用',sequences:'数列・帰納法・和',vectors:'ベクトルと図形',probability:'確率・期待値・分散'};
const groups=Object.entries(titles).map(([id,title])=>{
 const href=id==='reasoning'?'./suken-course.html?topic=reasoning':'./suken-first-bridge.html?topic='+({functions:'equations',geometry:'geometry',calculus:'calculus',sequences:'sequences',vectors:'vectors',probability:'probability'}[id]);
 const lessons=[];
 if(id==='reasoning')lessons.push(...old.lessons.map(l=>({id:'base-'+l.id,title:l.title,origin:'existing',source:'既存の2次基礎教材',href:'./suken-course.html?topic=reasoning#view=lesson&unit='+l.id,steps:l.steps.map(([title,body,formula,note])=>({title,body,lines:[formula],note})),questions:l.questions.map(q=>({text:q.text,answer:q.choices.find(c=>c.id===q.correctChoiceId).text,hint:q.hint,lines:[q.explanation],check:['解答に至る式または理由を紙に書いた','説明と自分の理由を照合した']}))})));
 lessons.push(...[...secondUnits,...secondExpansion].filter(l=>l.topic===id).map(l=>({...l,origin:'new',source:'2次に向けたオリジナル記述練習',href})));
 for(const l of lessons)l.questions.forEach((q,n)=>{q.id=l.id+'-'+n;q.stage=n<2?'guided':'practice';});
 const seeds=id==='reasoning'?lessons.slice(0,3).map(l=>({l,q:l.questions[0]})):[{l:lessons[0],q:lessons[0].questions[0]},{l:lessons[0],q:lessons[0].questions[1]},{l:lessons[1],q:lessons[1].questions[0]}];
 const diagnostic=seeds.map(({l,q})=>({...q,label:l.title,href:'./suken-second-bridge.html?topic='+id+'#view=lesson&unit='+l.id}));
 return {id,title,href,diagnostic,lessons};
});
fs.writeFileSync('data/suken-second-bridge.json',JSON.stringify({version:1,title:'数検2級2次：理由を書いて解く',note:'主要な型を学ぶ初期教材。公式過去問題・答案添削と組み合わせて使います。',groups},null,2)+'\n');
console.log('Second bridge: '+groups.length+' groups, '+groups.reduce((n,g)=>n+g.lessons.length,0)+' lessons, '+groups.reduce((n,g)=>n+g.lessons.length*5,0)+' exercises + 21 diagnostic questions.');
