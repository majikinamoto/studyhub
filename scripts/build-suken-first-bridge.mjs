import fs from 'node:fs';
import {sukenCourses,courseHref} from '../assets/js/suken-courses.js';
import {algebraBridge} from './suken-algebra-bridge-content.mjs';
import {extras} from './suken-first-bridge-extras.mjs';
export function buildFirstBridge(){
 const groups=sukenCourses.filter(c=>c.phase==='first').map(c=>{
  const old=JSON.parse(fs.readFileSync('data/suken-'+c.id+'.json','utf8'));
  const href=courseHref(c);
  const lessons=old.lessons.map(l=>({id:'base-'+l.id,title:l.title,origin:'existing',source:l.referencePages?.length?'要点整理の関連箇所 p.'+l.referencePages.join('・'):'基礎教材の「'+l.title+'」',href:href+'#view=lesson&unit='+l.id,diagram:l.diagram,
   steps:l.steps.map(([title,body,formula,note])=>({title,body,lines:[formula],note})),
   questions:l.questions.map(q=>({id:q.id,stage:q.stage,text:q.text,answer:q.choices.find(a=>a.id===q.correctChoiceId).text,hint:q.hint,lines:[q.explanation],check:['ヒントを見る前に自分の答えを書いた','説明の計算・理由を自分の途中式と照合した']}))}));
  if(c.id==='algebra')lessons.push(...algebraBridge.lessons.map(l=>({...l,origin:'pilot',href:'./suken-algebra.html'})));
  lessons.push(...extras.filter(l=>l.topic===c.id).map(l=>({...l,origin:'new',source:'同じ分野の基礎を復習し、要点整理と過去問題の関連問題に挑戦しよう。',href})));
  if(c.id==='trigonometry')lessons.find(l=>l.id==='trig-equations').diagram={step:1,file:'unit-circle.svg',alt:'単位円で高さ1/2の水平線と円が交わる2点は、角π/6と5π/6に対応します。',caption:'sinθは縦の座標。0≤θ<2πでは同じ高さの角が2つあります。'};
  const diagnostic=old.lessons.slice(0,3).map(l=>{const q=l.questions[0];return {text:q.text,answer:q.choices.find(a=>a.id===q.correctChoiceId).text,hint:q.hint,lines:[q.explanation],check:['途中式または理由を書いて確認した'],label:l.title,href:href+'#view=lesson&unit='+l.id};});
  return {id:c.id,title:c.title,href,prerequisites:c.prerequisites,diagnostic,lessons};
 });
 const data={version:1,title:'数検2級1次：基礎から記述へ',scopeSource:'https://www.su-gaku.net/suken/examination/summary/2q/',scopeChecked:'2026-10-02',groups};
 fs.writeFileSync('data/suken-first-bridge.json',JSON.stringify(data,null,2)+'\n');
 console.log('First bridge: '+groups.length+' groups, '+groups.reduce((n,c)=>n+c.lessons.length,0)+' lessons, '+groups.reduce((n,c)=>n+c.lessons.reduce((s,l)=>s+l.questions.length,0),0)+' exercises, '+groups.reduce((n,c)=>n+c.diagnostic.length,0)+' diagnostic questions.');
 return data;
}
buildFirstBridge();
