import fs from 'node:fs';
import assert from 'node:assert/strict';

const load = name => JSON.parse(fs.readFileSync(new URL('../data/' + name, import.meta.url), 'utf8').replace(/^\uFEFF/, ''));
const catalog = load('catalog.json');
const physics = load('entrance-physics.json');
const stores = [load('questions.json'), load('entrance-geography.json'), physics];
const allQuestions = stores.flatMap(s => s.questions);
const allUnits = stores.flatMap(s => s.units);
const units = new Map(allUnits.map(u => [u.id, u]));
const chapters = new Set(catalog.courses.flatMap(c => c.chapters.map(ch => ch.id)));
assert.equal(new Set(allQuestions.map(q => q.id)).size, allQuestions.length, 'Question IDs must be globally unique');
assert.equal(units.size, allUnits.length, 'Unit IDs must be globally unique');
assert.equal(physics.units.length, 14);
assert.equal(physics.questions.length, 168);
assert.equal(physics.meta.questionCount, physics.questions.length);
assert.equal(physics.units.reduce((n, u) => n + u.sourceQuestionCount, 0), 161);
const positions = [0, 0, 0, 0];
for (const q of physics.questions) {
  const unit = units.get(q.unitId);
  assert(unit, q.id + ': unknown unit');
  assert.equal(unit.chapterId, q.chapterId);
  assert(chapters.has(q.chapterId));
  assert.equal(q.choices.length, 4, q.id);
  assert.equal(new Set(q.choices.map(c => c.text)).size, 4, q.id + ': duplicate choices');
  assert.equal(new Set(q.choices.map(c => c.id)).size, 4, q.id);
  const answer = q.choices.findIndex(c => c.id === q.correctChoiceId);
  assert(answer >= 0, q.id + ': missing answer');
  positions[answer]++;
  assert(q.text.trim() && q.explanation.trim(), q.id);
  assert(q.choices.every(c => c.text.trim()), q.id);
  assert(!/図[0-9０-９]|右の図|下の図|上の図|ア〜|ア～/.test(q.text), q.id + ': missing diagram reference');
  assert(q.source.page >= 6 && q.source.page <= 32, q.id);
}
for (const unit of physics.units) {
  const qs = physics.questions.filter(q => q.unitId === unit.id);
  assert.deepEqual(qs.map(q => q.order), Array.from({length: qs.length}, (_, i) => i + 1));
  assert.deepEqual([...new Set(qs.map(q => q.source.question))].sort((a,b) => a-b),
    Array.from({length: unit.sourceQuestionCount}, (_, i) => i+1), unit.title + ': incomplete source coverage');
}
assert.deepEqual(positions, [42, 42, 42, 42]);
const answer = (unit, source) => {
  const q = physics.questions.find(q => q.unitId === 'unit-entrance-physics-' + String(unit).padStart(2, '0') && q.source.question === source);
  return q.choices.find(c => c.id === q.correctChoiceId).text;
};
for (const [unit, source, expected] of [
  [3,6,340*2+' m'], [4,6,2*0.9/0.4+' cm'], [4,7,'1.2 N'],
  [5,7,500*15/50+' mA'], [6,2,1.5/10+' A'], [6,3,2/0.2+' Ω'],
  [6,4,20+40+' Ω'], [6,5,6/(20+40)+' A'], [6,6,1/(1/10+1/30)+' Ω'],
  [6,7,15/10+15/30+' A'], [6,8,15/10+' A'], [6,9,3*2*2+' W'],
  [6,10,6*6/4*600+' J'], [11,5,'0.4 N'], [12,1,'66 cm/s'],
  [13,3,300/100*2+' J'], [13,5,10000/100/20+' W']
]) assert.equal(answer(unit, source), expected, 'Calculation: unit '+unit+' source '+source);
console.log('PASS: 14 units, 168 four-choice questions, all 161 source questions covered, unique IDs, balanced answer positions, 17 numerical answers.');
