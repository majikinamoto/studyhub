import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sourceDir = path.join(root, 'data/authoring/entrance-civics');
const chapterId = 'chapter-entrance-social-civics';
const counts = [12,14,15,16,15,12,14,17,13,13,10,12,11,12,20];
const splits = {1:{11:2,12:3},2:{9:3,10:2},3:{9:3},4:{13:2},
  5:{1:2,3:2,6:2,9:2,10:3,11:2},6:{3:2,4:2,10:2,11:3},
  8:{2:2},10:{2:3,6:3},11:{1:2,2:2,7:2},12:{1:2,12:3},13:{2:3},15:{1:2,7:3}};
const units = [];
const questions = [];
function shuffled(values, key) {
  let seed = 2166136261;
  for (const char of key) seed = Math.imul(seed ^ char.codePointAt(0), 16777619) >>> 0;
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    seed = (Math.imul(seed,1664525)+1013904223) >>> 0;
    const j = Math.floor(seed / 4294967296 * (i+1));
    [result[i],result[j]] = [result[j],result[i]];
  }
  return result;
}
for (const name of fs.readdirSync(sourceDir).filter(name=>name.endsWith('.txt')).sort()) {
  let unit;
  for (const line of fs.readFileSync(path.join(sourceDir,name),'utf8').replace(/^\uFEFF/,'').split(/\r?\n/).filter(Boolean)) {
    const fields = line.split('|');
    if (line.startsWith('@')) {
      assert.equal(fields.length,4);
      const [number,title,page,count] = fields;
      unit = {id:`unit-entrance-civics-${number.slice(1)}`,chapterId,learningSection:'recall',
        order:Number(number.slice(1)),title,sourceStartPage:Number(page),sourceQuestionCount:Number(count)};
      units.push(unit);
    } else {
      assert(unit);
      assert.equal(fields.length,6,line);
      assert(fields.every(Boolean),line);
      const [sourceQuestion,text,answer,wrong,hint,explanation] = fields;
      assert.match(sourceQuestion,/^\d+[a-z]?$/);
      const distractors = wrong.split(';');
      assert.equal(distractors.length,3,line);
      assert.equal(new Set([answer,...distractors]).size,4,line);
      const id = `q-entrance-civics-${String(unit.order).padStart(2,'0')}-${sourceQuestion.padStart(3,'0')}`;
      const choices = shuffled([answer,...distractors],id).map((text,i)=>({id:`${id}-c${i+1}`,text}));
      questions.push({id,chapterId,unitId:unit.id,order:questions.filter(q=>q.unitId===unit.id).length+1,
        sourceQuestion,text,hint,correctChoiceId:choices.find(c=>c.text===answer).id,explanation,choices});
    }
  }
}
assert.equal(units.length,15);
assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
units.forEach((unit,i)=>{
  assert.equal(unit.order,i+1);
  assert.equal(unit.sourceStartPage,98+i*2);
  assert.equal(unit.sourceQuestionCount,counts[i]);
  const expected = Array.from({length:counts[i]},(_,j)=>{
    const count = splits[i+1]?.[j+1] || 1;
    return count===1 ? [String(j+1)] : Array.from({length:count},(_,k)=>`${j+1}${String.fromCharCode(97+k)}`);
  }).flat();
  assert.deepEqual(questions.filter(q=>q.unitId===unit.id).map(q=>q.sourceQuestion),expected,unit.title);
});
const data = {version:2,meta:{title:'高校入試 一問一答 社会・公民編',targetCourseId:'entrance-social-studies',
  questionFormat:'multiple-choice-4',sourceTitle:'高校入試 入試問題で覚える 一問一答 社会 改訂版',
  sourcePages:'98–128',sourceImageCount:16,originalQuestionCount:counts.reduce((a,b)=>a+b,0),questionCount:questions.length,
  reviewedAt:'2026-10-01',note:'全設問に対応。複数解答を小問に分割し、図版なしで解ける文章に再構成。制度・法律の注意点を補足。'},units,questions};
const output = JSON.stringify(data,null,2)+'\n';
const destination = path.join(root,'data/entrance-civics.json');
if (process.argv.includes('--check')) assert.equal(fs.readFileSync(destination,'utf8'),output);
else fs.writeFileSync(destination,output);
console.log(JSON.stringify({units:units.length,originals:data.meta.originalQuestionCount,questions:questions.length}));
