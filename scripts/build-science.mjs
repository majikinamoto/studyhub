import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const dir=path.join(root,'data/authoring/entrance-science');
const materials=JSON.parse(fs.readFileSync(path.join(dir,'materials.json'),'utf8'));
const fields={chemistry:'化学',biology:'生物',earth:'地学'};
function parse(name,supplement=false){
 const units=[],questions=[];let unit;
 for(const [index,line] of fs.readFileSync(path.join(dir,`${name}.txt`),'utf8').split(/\r?\n/).entries()){
  if(!line.trim()||line.startsWith('#'))continue;
  if(line.startsWith('@')){
   const [key,title,page,count]=line.slice(1).split('|');
   const field=supplement?key.split('-')[0]:name;
   const number=supplement?key.split('-')[1]:key;
   unit={id:`unit-entrance-${supplement?'science-materials-':''}${field}-${number}`,chapterId:`chapter-entrance-science-${field}`,order:supplement?90+Number(number):Number(number),title,sourceStartPage:Number(page),sourceQuestionCount:Number(count)};
   if(supplement)unit.learningSection='materials';
   units.push(unit);continue;
  }
  assert(unit,`${name}:${index+1} unit missing`);
  const [ref,text,answer,wrong,explanation,key]=line.split('|');
  const [page,number]=ref.split(':').map(Number);
  assert(text&&answer&&wrong&&explanation,`${name}:${index+1} incomplete`);
  const distractors=wrong.split(';');assert.equal(distractors.length,3,`${name}:${index+1}`);
  const order=questions.filter(q=>q.unitId===unit.id).length+1;
  const id=unit.id.replace('unit-','q-')+`-${String(order).padStart(3,'0')}`;
  // Fixed deterministic balance; answer position is independent of original choice letters.
  const position=questions.length%4,labels=[...distractors];labels.splice(position,0,answer);
  assert.equal(new Set(labels).size,4,`${id} duplicate choices`);
  const q={id,chapterId:unit.chapterId,unitId:unit.id,order,text,choices:labels.map((text,i)=>({id:`${id}-c${i+1}`,text})),correctChoiceId:`${id}-c${position+1}`,explanation,source:{page,question:number}};
  if(supplement)q.source.section='資料編';
  if(key){assert(materials[key],`Unknown material ${key}`);q.material=materials[key];}
  questions.push(q);
 }
 if(!supplement)for(const u of units){
  const seen=new Set(questions.filter(q=>q.unitId===u.id).map(q=>q.source.question));
  assert.deepEqual([...seen].sort((a,b)=>a-b),Array.from({length:u.sourceQuestionCount},(_,i)=>i+1),`Original coverage ${u.id}`);
 }
 return {version:1,meta:{title:`高校入試 一問一答 理科・${fields[name]||'資料'}編`,targetCourseId:'entrance-science',questionFormat:'multiple-choice-4',sourceTitle:'高校入試 入試問題で覚える 一問一答 理科 改訂版',originalQuestionCount:supplement?undefined:units.reduce((n,u)=>n+u.sourceQuestionCount,0),questionCount:questions.length,note:supplement?'本文と重なる知識を除き、資料編の補足知識を4択化。':'ユーザー提供写真を確認。複数の名称を答える原問題は分割し、全原問題の番号を保存。図表は学習用に再構成。'},units,questions};
}
for(const field of [...Object.keys(fields),'supplements']){
 const bank=parse(field,field==='supplements');
 const filename=field==='supplements'?'entrance-science-materials.json':`entrance-${field}.json`;
 fs.writeFileSync(path.join(root,'data',filename),JSON.stringify(bank,null,2)+'\n');
 console.log(`${filename}: ${bank.units.length} units / ${bank.questions.length} questions / ${bank.meta.originalQuestionCount??'supplement'} originals`);
}
