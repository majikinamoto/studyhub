const app=document.querySelector('#learning-app'),notice=document.querySelector('#storage-message');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const phase=app.dataset.curriculum,full=['first','second'].includes(phase),second=phase==='second',bridgeFile='suken-'+phase+'-bridge.html',topic=new URLSearchParams(location.search).get('topic');
let key='studyhub:suken:algebra-bridge:v1';
let data,curriculum,state={diagnostic:{},answers:{}};
const link=(view,unit='',n=0)=>'#'+new URLSearchParams({view,unit,n});
const topicLink=id=>'./'+bridgeFile+'?topic='+encodeURIComponent(id);
const returnLinks=()=>full?'<p><a href="./'+bridgeFile+'">全分野の一覧へ</a></p>':'';
const lines=a=>'<div class="math-line bridge-lines">'+a.map(s=>'<span>'+esc(s)+'</span>').join('')+'</div>';
function save(){try{localStorage.setItem(key,JSON.stringify(state));notice.textContent='';}catch{notice.textContent='記録を保存できません。このページを閉じると記録が失われます。';}}
function catalog(){
 app.innerHTML='<h2 tabindex="-1">'+curriculum.groups.length+'分野から選ぼう</h2><p>初めてなら上から順に。各分野の確認3問から、必要な基礎を探せます。学習時間は決めなくても大丈夫。</p>'+curriculum.groups.map(g=>{
 let saved={};try{saved=JSON.parse(localStorage.getItem('studyhub:suken:'+phase+'-bridge:'+g.id+':v1')||'{}');}catch{}
 const completed=g.lessons.reduce((n,l)=>n+Object.values(saved?.answers?.[l.id]||{}).filter(v=>['independent','review'].includes(v)).length,0);
 const last=saved?.last;const valid=last&&g.lessons.some(l=>l.id===last.unit)&&['lesson','question'].includes(last.view)&&Number.isInteger(last.n)&&last.n>=0&&last.n<(last.view==='lesson'?g.lessons.find(l=>l.id===last.unit).steps.length:5);
 return '<article class="study-card"><h3>'+esc(g.title)+'</h3><p>'+g.lessons.length+'項目・'+g.lessons.length*5+'問＋確認3問</p><p class="bridge-progress">記録：'+completed+'／'+g.lessons.length*5+'問</p><div class="lesson-actions"><a class="primary-button" href="'+topicLink(g.id)+'">分野を開く</a>'+(valid?'<a class="secondary-button" href="'+topicLink(g.id)+link(last.view,last.unit,last.n)+'">前回の続き</a>':'')+'</div></article>';
 }).join('')+'<p>自分の答えと途中式を照合する教材です。記録はこの端末に保存されます。分野を一巡したら、公式過去問題にも取り組もう。</p><a class="text-link" href="https://www.su-gaku.net/suken/support/past_questions/" target="_blank" rel="noopener">公式過去問題へ</a>';
 app.querySelector('h2')?.focus();
}
function overview(){
 app.innerHTML=`<h2 tabindex="-1">${esc(data.title)}</h2>${returnLinks()}<p>説明だけ、1問だけでも大丈夫。次回はこの一覧から続けられます。</p><section class="study-card"><h3>まず3問で出発点を確認</h3><p>時間制限はありません。分からない問題は解説を見て、基礎へ戻れます。解答と途中式を自分で照合します。</p><a class="primary-button" href="${link('diagnostic')}">確認問題を始める</a></section>${data.lessons.map(l=>{const a=state.answers[l.id]||{};return `<article class="study-card"><h3>${esc(l.title)}</h3><p class="bridge-progress">記録：${Object.keys(a).length}／5問 · ヒントなしで解けた：${Object.values(a).filter(v=>v==='independent').length}問</p><div class="lesson-actions"><a class="primary-button" href="${link('lesson',l.id)}">説明から学ぶ</a><a class="secondary-button" href="${link('question',l.id,2)}">選択肢なしの3問</a></div></article>`}).join('')}<p>「解けた」は自己確認の記録です。自動採点や合格判定ではありません。翌日にもう一度解いて、解き方も説明してみよう。</p>`;
}
function lesson(l,n){
 const s=l.steps[n];
 app.innerHTML=`<a href="${link('overview')}">項目一覧へ</a><p>${esc(l.title)} · 説明 ${n+1}／${l.steps.length}</p><section class="study-card"><h2 tabindex="-1">${esc(s.title)}</h2><p class="lesson-copy">${esc(s.body)}</p>${lines(s.lines)}${l.diagram?.step===n?`<figure><img class="bridge-diagram" src="../assets/images/suken/${esc(l.diagram.file)}" alt="${esc(l.diagram.alt)}"><figcaption>${esc(l.diagram.caption)}</figcaption></figure>`:''}<p class="lesson-note">${esc(s.note)}</p><div class="lesson-actions">${n?`<a class="secondary-button" href="${link('lesson',l.id,n-1)}">前の説明</a>`:''}<a class="primary-button" href="${n+1<l.steps.length?link('lesson',l.id,n+1):link('question',l.id)}">${n+1<l.steps.length?'次の説明':'途中の一手へ'}</a></div></section><p><a href="${esc(l.href||'./suken-algebra.html')}">迷ったら、関連する基礎へ戻る</a></p><p>今日はここまででも大丈夫。このページをブックマークすると、同じ説明から再開できます。</p>${returnLinks()}`;
}
function question(q,n,l){
 const diagnostic=!l;let hint=false;
 app.innerHTML=`<a href="${link('overview')}">項目一覧へ</a><p>${diagnostic?'出発点の確認':n<2?'途中の一手':'選択肢なしの自力練習'} · ${diagnostic?n+1:n<2?n+1:n-1}／${diagnostic?3:n<2?2:3}</p><section class="study-card"><h2 tabindex="-1">${esc(q.text)}</h2><p>${second?'紙に答え・途中式・理由を書こう。条件や等号成立も確認しよう。':'紙に答えと途中式を書こう。'}分からなければ、ヒントや解説を見て大丈夫。</p><details id="hint"><summary>ヒントを見る</summary><p>${esc(q.hint)}</p></details><button id="reveal" class="primary-button">答え・途中式を確認する</button><div id="solution" hidden><h3>答え：${esc(q.answer)}</h3>${lines(q.lines)}<h3>途中式も確認しよう</h3><ul>${q.check.map(c=>'<li>'+esc(c)+'</li>').join('')}</ul><p>${second?'解き方が違っても、条件を満たし、結論までの理由が正しければ構いません。確認欄で答案を照合しよう。':'式の並び順や因数の順番が違っても、同じ式なら正解です。'}</p><p id="hint-note"></p><div class="bridge-feedback"><button data-assess="independent" class="primary-button">答えを見る前に、途中式も書いて解けた</button><button data-assess="review" class="secondary-button">ヒント・解説で分かった／まだ難しい</button></div></div></section>`;
 app.querySelector('#hint').ontoggle=e=>{if(e.target.open)hint=true;};
 app.querySelector('#reveal').onclick=()=>{hint=hint||app.querySelector('#hint').open;app.querySelector('#solution').hidden=false;app.querySelector('#reveal').hidden=true;if(hint){app.querySelector('[data-assess=independent]').hidden=true;app.querySelector('#hint-note').textContent='今回はヒントを使ったので、復習として記録します。';}};
 app.querySelectorAll('[data-assess]').forEach(b=>b.onclick=()=>{
  const value=hint?'review':b.dataset.assess;
  if(diagnostic)state.diagnostic[n]=value;else{state.answers[l.id]??={};state.answers[l.id][n]=value;}save();
  const count=diagnostic?data.diagnostic.length:l.questions.length;
  if(n+1<count)location.hash=link(diagnostic?'diagnostic':'question',l?.id||'',n+1);else if(diagnostic)diagnosticResult();else finish(l);
  app.querySelector('h2')?.focus();
 });
}
function diagnosticResult(){
 const missing=data.diagnostic.filter((q,n)=>state.diagnostic[n]!=='independent');
 app.innerHTML=`<h2 tabindex="-1">出発点の確認が終わりました</h2><p>3問の自己確認は、理解度の目安です。${missing.length?'まず、次の基礎を読み直そう。':'次はこの分野の説明へ。途中で迷ったら基礎に戻れます。'}</p>${missing.map(q=>`<p><a class="primary-button" href="${esc(q.href)}">${esc(q.label)}を学ぶ</a></p>`).join('')}<a class="primary-button" href="${link('lesson',data.lessons[0].id)}">${second?'理由を書く練習を始める':'説明から練習を始める'}</a><a class="secondary-button" href="${link('overview')}">項目一覧へ</a>`;
}
function finish(l){
 const a=state.answers[l.id]||{},next=data.lessons[data.lessons.indexOf(l)+1];
 app.innerHTML=`<h2 tabindex="-1">${esc(l.title)}の練習が終わりました</h2><p>自己確認の記録：ヒントなしで解けた ${Object.values(a).filter(v=>v==='independent').length}／5問。答えだけでなく、途中式を説明できるか確かめよう。</p><a class="primary-button" href="${link('question',l.id,2)}">自力3問をもう一度</a><a class="secondary-button" href="${link('lesson',l.id)}">説明を読み直す</a><p class="bridge-reference">関連する復習先：${esc(l.source)}。学んだ計算を、手元の問題集でも試してみよう。</p>${next?`<a class="primary-button" href="${link('lesson',next.id)}">次：${esc(next.title)}</a>`:'<p>この分野の練習を終えました。翌日にもう一度解いてから、次の分野へ進もう。</p>'}<a class="secondary-button" href="${link('overview')}">項目一覧へ</a>${returnLinks()}`;
}
function route(){
 if(full&&!data){catalog();return;}
 const p=new URLSearchParams(location.hash.slice(1)),view=p.get('view')||'overview',l=data.lessons.find(l=>l.id===p.get('unit')),n=Number(p.get('n')||0);
 if(view==='overview')overview();
 else if(view==='diagnostic'&&Number.isInteger(n)&&n>=0&&n<data.diagnostic.length)question(data.diagnostic[n],n);
 else if(view==='lesson'&&l&&Number.isInteger(n)&&n>=0&&n<l.steps.length){lesson(l,n);if(full){state.last={view,unit:l.id,n};save();}}
 else if(view==='question'&&l&&Number.isInteger(n)&&n>=0&&n<l.questions.length){question(l.questions[n],n,l);if(full){state.last={view,unit:l.id,n};save();}}
 else app.innerHTML='<h2 tabindex="-1">この項目は見つかりません</h2><a href="#view=overview">一覧へ戻る</a>';
 app.querySelector('h2')?.focus();
}
try{
 const r=await fetch(full?'../data/suken-'+phase+'-bridge.json':'../data/suken-algebra-bridge.json');if(!r.ok)throw Error('load');const loaded=await r.json();
 if(full){curriculum=loaded;data=curriculum.groups.find(g=>g.id===topic);if(topic&&!data){app.innerHTML='<h2>この分野は見つかりません</h2><a href="./'+bridgeFile+'">全分野の一覧へ</a>'; }else if(data){key='studyhub:suken:'+phase+'-bridge:'+data.id+':v1';document.querySelector('#topic-label').textContent=data.title;document.title=data.title+(second?'：理由を書いて解く':'：基礎から記述へ')+' | StudyHub';}}else data=loaded;
 if(!data){if(!topic)catalog();}else{
 try{const s=JSON.parse(localStorage.getItem(key)||'null');if(s&&typeof s.diagnostic==='object'&&s.diagnostic&&!Array.isArray(s.diagnostic)&&typeof s.answers==='object'&&s.answers&&!Array.isArray(s.answers)){state={diagnostic:{},answers:{},last:s.last};for(let n=0;n<3;n++)if(['independent','review'].includes(s.diagnostic[n]))state.diagnostic[n]=s.diagnostic[n];for(const l of data.lessons){state.answers[l.id]={};for(let n=0;n<5;n++)if(['independent','review'].includes(s.answers[l.id]?.[n]))state.answers[l.id][n]=s.answers[l.id][n];}}}catch{notice.textContent='保存記録を読み込めませんでした。学習は続けられます。';}
 route();addEventListener('hashchange',route);
 }
}catch{app.innerHTML='<h2>教材を読み込めませんでした</h2><p>通信状態を確認して再読み込みしてください。</p><a href="./suken-2-'+(second?'second':'first')+'.html">'+(second?'2次':'1次')+'の入口へ</a>';}
