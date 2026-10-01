import fs from 'node:fs';
import assert from 'node:assert/strict';
import { materials } from '../data/authoring/entrance-materials/materials.mjs';
const root = new URL('../', import.meta.url);
const units = [], questions = [];
for (const field of ['geography','history','civics']) {
  let unit;
  const input = fs.readFileSync(new URL(`data/authoring/entrance-materials/${field}.txt`,root),'utf8');
  for (const line of input.split(/\r?\n/).filter(Boolean)) {
    const parts = line.split('|');
    if (line.startsWith('@')) {
      assert.equal(parts.length,3);
      const [key,title,sourcePages] = parts;
      unit = {id:`unit-entrance-materials-${key.slice(1)}`,chapterId:`chapter-entrance-social-${field}`,learningSection:'materials',order:Number(key.slice(-2)),title,sourcePages};
      units.push(unit);
      continue;
    }
    assert(unit); assert.equal(parts.length,7,line); assert(parts.every(Boolean),line);
    const [number,text,answer,wrong,hint,explanation,materialKey] = parts;
    const values = [answer,...wrong.split(';')];
    assert.equal(values.length,4); assert.equal(new Set(values).size,4,line);
    assert(materials[materialKey],materialKey);
    const order = questions.filter(q=>q.unitId===unit.id).length+1;
    assert.equal(Number(number),order,line);
    const id = `q-entrance-materials-${field}-${String(unit.order).padStart(2,'0')}-${String(order).padStart(3,'0')}`;
    const offset = (order+unit.order)%4;
    const choices = values.slice(offset).concat(values.slice(0,offset)).map((text,i)=>({id:`${id}-c${i+1}`,text}));
    questions.push({id,chapterId:unit.chapterId,unitId:unit.id,order,text,hint,explanation,choices,correctChoiceId:choices.find(c=>c.text===answer).id,material:materials[materialKey]});
  }
}
assert.equal(units.length,14);
assert.equal(questions.length,261);
assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
const data={version:2,meta:{title:'高校受験 社会 資料問題',targetCourseId:'entrance-social-studies',questionFormat:'multiple-choice-4',sourcePages:'130–159・憲法条文続き（ページ番号不明）',questionCount:questions.length,note:'資料編の各分野を学習用の図表と四択問題に再構成。統計は掲載年を明記。模式図は原図の複製ではない。'},units,questions};
const output=JSON.stringify(data,null,2)+'\n';
const destination=new URL('data/entrance-materials.json',root);
if(process.argv.includes('--check')) assert.equal(fs.readFileSync(destination,'utf8'),output);
else fs.writeFileSync(destination,output);
console.log(JSON.stringify({units:units.length,questions:questions.length,fields:Object.fromEntries(['geography','history','civics'].map(field=>[field,questions.filter(q=>q.chapterId.endsWith(field)).length]))}));
