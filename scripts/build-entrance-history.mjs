import fs from 'node:fs';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const sourceDir = path.join(root, 'data/authoring/entrance-history');
const chapterId = 'chapter-entrance-social-history';
const units = [];
const rows = [];
for (const file of fs.readdirSync(sourceDir).filter(name => name.endsWith('.txt')).sort()) {
  let unit;
  for (const line of fs.readFileSync(path.join(sourceDir, file), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean)) {
    const fields = line.split('|');
    if (line.startsWith('@')) {
      assert.equal(fields.length, 4, file);
      const [number, title, page, count] = fields;
      unit = { id: `unit-entrance-history-${number.slice(1)}`, chapterId,
        order: Number(number.slice(1)), title, sourceStartPage: Number(page), sourceQuestionCount: Number(count) };
      units.push(unit);
    } else {
      assert(unit, `Missing header: ${file}`);
      assert.equal(fields.length, 6, `${file}: ${line}`);
      assert(fields.every(Boolean), `Empty field: ${line}`);
      const [sourceQuestion, category, text, answer, hint, explanation] = fields;
      assert.match(sourceQuestion, /^\d+[a-z]?$/);
      rows.push({ unit, sourceQuestion, category, text, answer, hint, explanation });
    }
  }
}

// Small categories and closely related concepts get deliberate, non-overlapping choices.
const extras = {
  life: ['狩猟', '採集', '牧畜'],
  writing: ['くさび形文字', '象形文字', 'ハングル'],
  tax: ['地租'], money: ['富本銭', '永楽通宝', '寛永通宝'],
  tactic: ['集団戦法', '一騎打ち', '兵糧攻め', '海上封鎖'],
  number: ['18歳', '20歳', '25歳', '30歳'],
  gender: ['男子のみ', '女子のみ', '男女とも', '男女とも選挙権なし'],
  right: ['領事裁判権', '関税自主権', '選挙権', '団結権'],
  goods: ['生糸', '綿織物', '毛織物', '石油'],
  conflict: ['民族紛争', '地域紛争', '世界大戦', '労働争議'],
  economy: ['工場制手工業', '工場制機械工業', '問屋制家内工業', '高度経済成長', 'バブル経済'],
  trade: ['西廻り航路', '朱印船貿易'],
  country: ['イギリス', 'フランス', 'スペイン', 'ロシア'],
  state: ['中華民国', '魏', '宋'],
};
const overrides = {
  '14:2': ['産業革命', '宗教改革', '農業革命'],
  '14:4a': ['名誉革命', 'ロシア革命', '辛亥革命'],
  '16:9': ['地租改正', '廃藩置県', '版籍奉還'],
  '01:10': ['東海道', 'インカ道', '王の道'],
  '02:12b': ['邪馬台国', '奴国', '琉球王国'],
  '02:13': ['円墳', '方墳', '八角墳'],
  '04:2': ['荘園', '墾田', '公領'],
  '04:6': ['口分田', '公領', '入会地'],
  '05:11': ['御霊信仰', '山岳信仰', '祖先信仰'],
  '05:18': ['口分田', '公領', '入会地'],
  '07:9': ['チンギス・ハン', '始皇帝', '洪武帝'],
  '08:5': ['座', '五人組', '株仲間'],
  '08:6': ['惣', '五人組', '株仲間'],
  '09:1': ['御家人', '倭寇', 'イエズス会'],
  '10:4': ['宿場', '市場', '蔵屋敷'],
  '10:12': ['台湾', 'フィリピン', '琉球'],
  '12:13': ['惣', '座', '株仲間'],
  '15:11': ['茶', '綿織物', '石炭'],
  '17:7b': ['立憲改進党', '立憲政友会', '立憲民政党'],
  '17:10': ['自由党', '立憲改進党', '全国水平社'],
  '18:10': ['樋口一葉', '平塚らいてう', '津田梅子'],
  '18:15b': ['北京', '上海', '広州'],
  '19:5': ['イベリア半島', 'イタリア半島', 'スカンディナビア半島'],
  '19:14': ['リンカン', 'セオドア・ルーズベルト', 'フランクリン・ルーズベルト'],
  '19:15': ['パリ講和会議', 'ウィーン会議', 'ヤルタ会談'],
  '20:5': ['自由民権運動', '明治維新', '文化大革命'],
  '20:6': ['自由民権運動', '三・一独立運動', '五・四運動'],
  '20:14': ['新婦人協会', '友愛会', '国会期成同盟'],
  '20:15': ['与謝野晶子', '樋口一葉', '津田梅子'],
  '21:11a': ['柳条湖', '山海関', '旅順'],
  '22:3a': ['ミッドウェー島', 'グアム島', 'マニラ'],
  '22:8': ['平和祈念像', 'ひめゆりの塔', '平和の礎'],
  '23:8': ['札幌オリンピック', '大阪万国博覧会', '長野オリンピック'],
  '23:10b': ['吉田茂', '岸信介', '田中角栄'],
  '23:14': ['万里の長城', 'マジノ線', 'ハドリアヌスの長城'],
  '23:16': ['千島列島全体', '小笠原諸島', '南西諸島'],
  '23:18a': ['世界大戦', '労働争議', '関税戦争'],
  '23:18b': ['世界大戦', '冷戦', '軍備競争'],
  '02:5a': ['狩猟', '採集', '牧畜'],
  '01:12': ['イエス', 'シャカ', '孔子'],
  '01:14': ['ムハンマド', 'イエス', 'シャカ'],
  '02:8': ['銅鏡', '銅剣', '銅矛'],
  '03:1': ['中大兄皇子', '蘇我馬子', '小野妹子'],
  '05:13a': ['空海', '鑑真', '法然'],
  '05:14a': ['最澄', '鑑真', '法然'],
  '06:12': ['武家諸法度', '公事方御定書', '大宝律令'],
  '07:1a': ['狩野永徳', '雪舟', '菱川師宣'],
  '07:8': ['浄土宗', '日蓮宗', '時宗'],
  '07:11b': ['磁石', '石炭', '石油'],
  '07:12': ['御成敗式目', '分国法', '武家諸法度'],
  '08:8': ['御成敗式目', '分国法', '武家諸法度'],
  '11:3': ['譜代大名', '外様大名', '旗本'],
  '11:4': ['親藩', '外様大名', '旗本'],
  '11:5': ['親藩', '譜代大名', '旗本'],
  '11:15': ['三都', '五畿七道', '東廻り航路'],
  '12:3': ['高札', '朱印状', '地券'],
  '12:4a': ['千歯こき', '踏車', '唐箕'],
  '12:4b': ['備中鍬', '踏車', '唐箕'],
  '12:5': ['西廻り航路', '南蛮貿易', '朱印船貿易'],
  '12:7': ['享保の改革', '天保の改革', '正徳の治'],
  '12:14': ['天下の城下町', '陸奥の小京都', '西国の玄関口'],
  '12:16': ['工場制機械工業', '問屋制家内工業', '自給自足'],
  '13:2': ['国学', '蘭学', '陽明学'],
  '13:7b': ['朱子学', '蘭学', '陽明学'],
  '13:8b': ['国学', '朱子学', '陽明学'],
  '15:4a': ['横浜', '神戸', '長崎'],
  '15:4b': ['新潟', '神戸', '長崎'],
  '15:4c': ['新潟', '横浜', '長崎'],
  '15:4d': ['新潟', '横浜', '神戸'],
  '16:10': ['八幡製鉄所', '長崎造船所', '横須賀製鉄所'],
  '17:11b': ['イギリス', 'フランス', 'アメリカ合衆国'],
  '17:15a': ['衆議院', '参議院', '枢密院'],
  '17:15b': ['貴族院', '参議院', '枢密院'],
  '19:1': ['富岡製糸場', '長崎造船所', '横須賀製鉄所'],
  '19:6a': ['三国協商', '日独伊三国同盟', '日英同盟'],
  '19:6b': ['三国同盟', '日独伊三国同盟', '日英同盟'],
  '21:6': ['東インド会社', '三井銀行', '日本郵船'],
  '22:2': ['三国同盟', '三国協商', '日英同盟'],
  '22:5': ['長崎県', '鹿児島県', '広島県'],
  '22:9': ['広島県', '沖縄県', '福岡県'],
  '22:10b': ['NATO', 'IMF', 'WTO'],
  '23:5b': ['国際連盟', '欧州連合', '北大西洋条約機構'],
  '23:7': ['バブル経済', '世界恐慌', 'ブロック経済'],
  '23:17': ['高度経済成長', '世界恐慌', 'ブロック経済'],
};

// Shared semantic families keep distractors comparable (people with people,
// pottery with pottery, modern states with modern states). Per-question
// overrides above handle overlapping umbrella terms and historical aliases.
const families = [
  ['打製石器', '磨製石器', '青銅器', '鉄器'],
  ['縄文土器', '弥生土器', '土師器', '須恵器'],
  ['土偶', '埴輪', '銅鐸', '金剛力士像'],
  ['三内丸山遺跡', '吉野ヶ里遺跡', '登呂遺跡', '岩宿遺跡'],
  ['石見銀山', '足尾銅山', '佐渡金山', '生野銀山'],
  ['殷', '秦', '漢', '唐', '宋', '明'],
  ['満州国', '中華民国', '中華人民共和国', 'ソビエト社会主義共和国連邦'],
  ['仏教', 'キリスト教', 'イスラム教', '儒教'],
  ['天台宗', '真言宗', '浄土宗', '浄土真宗', '時宗', '日蓮宗', '禅宗'],
  ['鑑真', '行基', '最澄', '空海'],
  ['法然', '親鸞', '日蓮', '一遍', '栄西', '道元'],
  ['聖徳太子', '蘇我馬子', '小野妹子', '中大兄皇子', '中臣鎌足'],
  ['天武天皇', '天智天皇', '聖武天皇', '桓武天皇'],
  ['卑弥呼', '推古天皇', '持統天皇', '北条政子'],
  ['藤原道長', '藤原頼通', '菅原道真', '藤原不比等'],
  ['平清盛', '源頼朝', '源義経', '北条時政', '北条泰時', '北条時宗'],
  ['足利尊氏', '足利義満', '足利義政', '後醍醐天皇'],
  ['織田信長', '豊臣秀吉', '徳川家康', '明智光秀', '今川義元', '武田信玄'],
  ['徳川家光', '徳川吉宗', '徳川綱吉', '徳川慶喜'],
  ['新井白石', '田沼意次', '松平定信', '水野忠邦', '大塩平八郎'],
  ['井原西鶴', '近松門左衛門', '松尾芭蕉', '十返舎一九', '曲亭馬琴'],
  ['菱川師宣', '喜多川歌麿', '葛飾北斎', '歌川広重'],
  ['雪舟', '狩野永徳', '狩野探幽', '尾形光琳'],
  ['千利休', '村田珠光', '武野紹鴎', '古田織部'],
  ['出雲阿国', '紫式部', '清少納言', '北条政子'],
  ['本居宣長', '杉田玄白', '伊能忠敬', '福沢諭吉'],
  ['井伊直弼', '吉田松陰', '坂本龍馬', '西郷隆盛'],
  ['大久保利通', '伊藤博文', '板垣退助', '大隈重信', '陸奥宗光', '小村寿太郎'],
  ['原敬', '桂太郎', '寺内正毅', '加藤高明'],
  ['田中正造', '新渡戸稲造', '野口英世', '福沢諭吉'],
  ['レオナルド・ダ・ビンチ', 'ミケランジェロ', 'ラファエロ', 'ボッティチェリ'],
  ['コロンブス', 'マゼラン', 'バスコ・ダ・ガマ', 'バルトロメウ・ディアス'],
  ['ルター', 'カルバン', 'フランシスコ・ザビエル', 'イグナティウス・ロヨラ'],
  ['モンテスキュー', 'ロック', 'ルソー', 'マルクス'],
  ['ナポレオン', 'ルイ14世', 'ルイ16世', 'ロベスピエール'],
  ['ペリー', 'ハリス', 'プチャーチン', 'ラクスマン'],
  ['孫文', '毛沢東', '蒋介石', '袁世凱'],
  ['ヒトラー', 'ムッソリーニ', 'ガンディー', 'ウィルソン', 'マッカーサー'],
  ['平城京', '平安京', '藤原京', '長岡京'],
  ['大輪田泊', '博多', '平戸', '堺', '出島'],
  ['壇ノ浦', '一ノ谷', '屋島', '関ヶ原'],
  ['種子島', '屋久島', '対馬', '奄美大島'],
  ['遼東半島', '朝鮮半島', '山東半島', 'カムチャツカ半島'],
  ['竪穴住居', '高床倉庫', '寝殿造', '書院造'],
  ['寺子屋', '藩校', '昌平坂学問所', '蕃書調所'],
  ['正倉院', '蔵屋敷', '高床倉庫', '土倉'],
  ['大坂城', '安土城', '江戸城', '姫路城'],
  ['法隆寺', '東大寺', '唐招提寺', '延暦寺'],
  ['国分寺', '国分尼寺', '法隆寺', '唐招提寺'],
  ['平等院鳳凰堂', '中尊寺金色堂', '銀閣', '金閣'],
  ['大和絵', '水墨画', '油絵', '浮世絵'],
  ['障壁画', '絵巻物', '錦絵', '仏像彫刻'],
  ['能', '狂言', '歌舞伎', '人形浄瑠璃'],
  ['万葉集', '古今和歌集', '新古今和歌集', '金槐和歌集'],
  ['古事記', '日本書紀', '風土記', '続日本紀'],
  ['源氏物語', '枕草子', '平家物語', '徒然草', '方丈記'],
  ['解体新書', '古事記伝', '学問のすゝめ', '蘭学事始'],
  ['飛鳥文化', '天平文化', '国風文化', '北山文化', '東山文化'],
  ['桃山文化', '元禄文化', '化政文化', '南蛮文化', '文明開化'],
  ['大王', '天皇', '国司', '郡司'],
  ['防人', '国司', '郡司', '衛士'],
  ['守護', '地頭', '執権', '管領', '征夷大将軍', '関白'],
  ['冠位十二階', '班田収授法', '公地・公民', '兵農分離'],
  ['院政', '摂関政治', '建武の新政', '執権政治'],
  ['御恩', '奉公', '下剋上', '参勤交代'],
  ['十七条の憲法', '大宝律令', '改新の詔', '墾田永年私財法'],
  ['租', '庸', '調', '地租'],
  ['鎖国', '楽市・楽座', '刀狩', '太閤検地'],
  ['学制', '徴兵令', '五箇条の御誓文', '教育勅語'],
  ['大日本帝国憲法', '日本国憲法', '教育基本法', '治安維持法', '国家総動員法'],
  ['領事裁判権', '関税自主権', '選挙権', '団結権'],
  ['版籍奉還', '廃藩置県', '地租改正', '殖産興業', '富国強兵', '欧化政策'],
  ['帝国主義', '社会主義', '民本主義', '絶対王政'],
  ['勘合貿易', '南蛮貿易', '朱印船貿易', '中継貿易'],
];

function seedOf(text) {
  let hash = 2166136261;
  for (const char of text) hash = Math.imul(hash ^ char.codePointAt(0), 16777619) >>> 0;
  return hash;
}
function shuffle(items, seed) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = Math.floor(seed / 4294967296 * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
const orderByUnit = new Map();
const usedOverrides = new Set();
const questions = rows.map(row => {
  const { unit, sourceQuestion, category, text, answer, hint, explanation } = row;
  const order = (orderByUnit.get(unit.id) || 0) + 1;
  orderByUnit.set(unit.id, order);
  const number = String(unit.order).padStart(2, '0');
  const id = `q-entrance-history-${number}-${sourceQuestion.padStart(3, '0')}`;
  const key = `${number}:${sourceQuestion}`;
  // Prefer answers of the same kind from nearby units, avoiding unrelated eras where possible.
  const candidates = rows.filter(other => other.category === category && other.answer !== answer)
    .sort((a, b) => Math.abs(a.unit.order - unit.order) - Math.abs(b.unit.order - unit.order));
  const family = families.find(values => values.includes(answer));
  const pool = [...new Set(family || [...candidates.map(other => other.answer), ...(extras[category] || [])])]
    .filter(value => value !== answer);
  const distractors = overrides[key] || shuffle(pool.slice(0, 10), seedOf(id)).slice(0, 3);
  if (overrides[key]) usedOverrides.add(key);
  assert.equal(distractors.length, 3, `Need choices for ${id}: ${category}`);
  assert.equal(new Set([answer, ...distractors]).size, 4, `Duplicate choice: ${id}`);
  const choices = shuffle([answer, ...distractors], seedOf(`${id}:choices`))
    .map((choice, index) => ({ id: `${id}-c${index + 1}`, text: choice }));
  return { id, chapterId, unitId: unit.id, order, sourceQuestion, text, hint,
    correctChoiceId: choices.find(choice => choice.text === answer).id, explanation, choices };
});

assert.equal(units.length, 23);
assert.deepEqual(units.map(unit => unit.order), Array.from({ length: 23 }, (_, i) => i + 1));
assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
for (const unit of units) {
  const sourceRows = rows.filter(row => row.unit === unit);
  assert.equal(new Set(sourceRows.map(row => row.sourceQuestion)).size, sourceRows.length);
  assert.deepEqual([...new Set(sourceRows.map(row => parseInt(row.sourceQuestion)))].sort((a, b) => a - b),
    Array.from({ length: unit.sourceQuestionCount }, (_, i) => i + 1), `Source coverage: ${unit.title}`);
}
assert.deepEqual([...usedOverrides].sort(), Object.keys(overrides).sort(), 'Unused choice override');
const result = { version: 2, meta: {
  title: '高校入試 一問一答 社会・歴史編', targetCourseId: 'entrance-social-studies',
  questionFormat: 'multiple-choice-4', sourceTitle: '高校入試 入試問題で覚える 一問一答 社会 改訂版',
  sourcePages: '50–96', sourceImageCount: 24,
  originalQuestionCount: units.reduce((total, unit) => total + unit.sourceQuestionCount, 0),
  questionCount: questions.length,
  note: 'ユーザー提供写真の全設問に対応。複数解答欄を小問に分割し、図版がなくても解ける文章に再構成。全問にヒントと解説を付与。'
}, units, questions };
const output = JSON.stringify(result, null, 2) + '\n';
const destination = path.join(root, 'data/entrance-history.json');
if (process.argv.includes('--check')) assert.equal(fs.readFileSync(destination, 'utf8'), output, 'Rebuild history JSON');
else fs.writeFileSync(destination, output);
console.log(JSON.stringify({ units: units.length, originals: result.meta.originalQuestionCount, questions: questions.length,
  coverage: units.map(unit => ({ unit: unit.order, originals: unit.sourceQuestionCount, questions: orderByUnit.get(unit.id) })) }));
