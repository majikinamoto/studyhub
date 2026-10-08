import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=f=>JSON.parse(fs.readFileSync(path.join(root,'data',f),'utf8').replace(/^\uFEFF/,''));
const files=['entrance-chemistry.json','entrance-biology.json','entrance-earth.json','entrance-science-materials.json'];
const banks=files.map(read),all=banks.flatMap(b=>b.questions),units=banks.flatMap(b=>b.units);
const others=['questions.json','entrance-geography.json','entrance-history.json','entrance-civics.json','entrance-physics.json','entrance-materials.json'].map(read);
const ids=others.flatMap(b=>b.questions).concat(all).map(q=>q.id);
assert.equal(new Set(ids).size,ids.length,'Global question IDs');
assert.equal(new Set(units.map(u=>u.id)).size,units.length);
const catalog=read('catalog.json'),course=catalog.courses.find(c=>c.id==='entrance-science');
for(const bank of banks){
 assert.equal(bank.questions.length,bank.meta.questionCount);
 const positions=[0,0,0,0];
 for(const u of bank.units){
  assert(course.chapters.some(c=>c.id===u.chapterId&&c.available!==false));
  const qs=bank.questions.filter(q=>q.unitId===u.id);
  assert(qs.length>0);assert.deepEqual(qs.map(q=>q.order),qs.map((_,i)=>i+1));
  if(u.sourceQuestionCount){const seen=new Set(qs.map(q=>q.source.question));assert.deepEqual([...seen].sort((a,b)=>a-b),Array.from({length:u.sourceQuestionCount},(_,i)=>i+1));}
 }
 for(const q of bank.questions){
  assert.equal(q.choices.length,4);assert.equal(new Set(q.choices.map(c=>c.text)).size,4);
  const pos=q.choices.findIndex(c=>c.id===q.correctChoiceId);assert(pos>=0);positions[pos]++;
  assert(q.text&&q.explanation&&Number.isInteger(q.source.page));
  if(q.material){const m=q.material;assert(m.title);if(m.type==='image'){assert(m.alt);assert(fs.existsSync(path.join(root,'assets/images/materials',m.image+'.svg')));}if(m.headers)for(const row of m.rows)assert.equal(row.length,m.headers.length);if(m.values)assert.equal(m.values.length,m.labels.length);}
 }
 assert(Math.max(...positions)-Math.min(...positions)<=1);
}
const correct=q=>q.choices.find(c=>c.id===q.correctChoiceId).text;
const source=(field,p,n)=>banks[files.indexOf(`entrance-${field}.json`)].questions.find(q=>q.source.page===p&&q.source.question===n);
assert.equal(correct(source('chemistry',34,6)),`${12/10} g/cm³`);
assert.equal(correct(source('chemistry',40,4)),`${Math.round((47.6-45.2)/(65.2-45.2)*100)}％`);
assert.equal(correct(source('earth',110,5)),`${(12.1/19.4*100).toFixed(1)}％`);
assert.equal(correct(source('earth',112,5)),`${24/(20*10/10000)} Pa`);
assert.equal(correct(source('biology',93,6)),'1：2：1');
const sourceImages=fs.readdirSync(path.join(root,'assets/images/materials')).filter(f=>f.startsWith('science-'));
assert(sourceImages.every(f=>f.endsWith('.svg')));
console.log(JSON.stringify({units:units.length,questions:all.length,originals:banks.slice(0,3).reduce((n,b)=>n+b.meta.originalQuestionCount,0),supplements:banks[3].questions.length,diagramQuestions:all.filter(q=>q.material).length,svgFiles:sourceImages.length}));
