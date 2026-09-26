const app=document.querySelector('#learning-app'), notice=document.querySelector('#storage-message');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key='studyhub:suken-2-first:roots:mastered';
let lessons=[],marks=new Set(),session;
const url=(view,unit)=>'#'+new URLSearchParams({view,...(unit?{unit}:{})});
function focus(){app.querySelector('h2')?.focus();}
function bindMarks(){
 app.querySelectorAll('[data-mark]').forEach(b=>b.onclick=()=>{
 const id=b.dataset.mark;marks.has(id)?marks.delete(id):marks.add(id);
 try{localStorage.setItem(key,JSON.stringify([...marks]));notice.textContent='';}catch{notice.textContent='印を保存できませんでした。このページを閉じると変更が失われます。';}
 b.textContent=marks.has(id)?'⭐ 覚えた':'☆ 覚えた';b.setAttribute('aria-pressed',marks.has(id));
 const summary=app.querySelector('#marks');if(summary)summary.textContent='覚えた項目 '+marks.size+'／'+lessons.length;
 });
}
const mark=l=>`<button class="mastery-button" data-mark="${l.id}" aria-label="${esc(l.title)}の覚えた印" aria-pressed="${marks.has(l.id)}">${marks.has(l.id)?'⭐':'☆'} 覚えた</button>`;
function overview(){
 session=null;
 app.innerHTML=`<h2 tabindex="-1">√の基礎〜有理化</h2><p>初めてなら上から順に「説明から学ぶ」へ。紙と鉛筆で途中式を書いてみよう。</p><p id="marks" aria-live="polite">覚えた項目 ${marks.size}／${lessons.length}</p>
 <section class="range-panel"><h3>問題を練習する</h3><p>習った項目をチェックして、自力練習をまとめて出題できます。</p><div class="lesson-actions"><button class="secondary-button" data-select="all">全選択</button><button class="secondary-button" data-select="none">全解除</button><button class="secondary-button" data-select="unlearned">まだ覚えていない項目</button></div><p id="selection" aria-live="polite">0項目・0問を選択</p><label>出題数 <select id="limit"><option value="all">すべて</option><option value="10">10問</option><option value="20">20問</option></select></label><button class="primary-button" id="start" disabled>選んだ項目から出題</button></section>
 ${lessons.map((l,i)=>`<article class="study-card"><p class="card-label">ステップ ${i+1}</p><h3>${esc(l.title)}</h3><div class="lesson-actions"><a class="primary-button" href="${url('lesson',l.id)}">説明から学ぶ</a><a class="secondary-button" href="${url('practice',l.id)}">自力練習 3問</a></div><div class="range-controls"><label class="range-checkbox"><input type="checkbox" value="${l.id}" aria-label="${esc(l.title)}を出題する">出題する</label>${mark(l)}</div></article>`).join('')}`;
 const checks=[...app.querySelectorAll('input[type=checkbox]')];
 const update=()=>{const n=checks.filter(c=>c.checked).length;app.querySelector('#selection').textContent=n+'項目・'+(n*3)+'問を選択';app.querySelector('#start').disabled=!n;};
 checks.forEach(c=>c.onchange=update);
 app.querySelectorAll('[data-select]').forEach(b=>b.onclick=()=>{checks.forEach(c=>c.checked=b.dataset.select==='all'||(b.dataset.select==='unlearned'&&!marks.has(c.value)));update();});
 app.querySelector('#start').onclick=()=>{location.hash=new URLSearchParams({view:'mixed',units:checks.filter(c=>c.checked).map(c=>c.value).join(','),count:app.querySelector('#limit').value});};
 bindMarks();
}
function lesson(l,step=0){
 const [title,body,formula,note]=l.steps[step];
 app.innerHTML=`<a class="text-link" href="#view=overview">項目一覧へ戻る</a><p>説明 ${step+1}／${l.steps.length} · ${esc(l.title)}</p><section class="study-card"><h2 tabindex="-1">${esc(title)}</h2><p class="lesson-copy">${esc(body)}</p><p class="math-line">${esc(formula)}</p><p class="lesson-note">${esc(note)}</p><div class="lesson-actions">${step?'<button id="prev" class="secondary-button">前の説明</button>':''}<button id="next-step" class="primary-button">${step+1<l.steps.length?'次の説明':'途中の一手から練習する'}</button></div></section><p>何度戻っても大丈夫。分からないところを一つずつ確認しよう。</p>`;
 app.querySelector('#prev')?.addEventListener('click',()=>{lesson(l,step-1);focus();});
 app.querySelector('#next-step').onclick=()=>{if(step+1<l.steps.length){lesson(l,step+1);focus();}else location.hash=url('guided',l.id);};
}
function quiz(qs,ids){
 if(!qs.length){missing();return;}session={qs,ids,index:0,answers:[]};question();
}
function question(){
 const q=session.qs[session.index],l=lessons.find(l=>l.questions.some(x=>x.id===q.id));let answered=false,hint=false;
 app.innerHTML=`<a class="text-link" href="#view=overview">項目一覧へ戻る</a><section class="quiz-panel"><div class="quiz-topline"><p>${q.stage==='guided'?'途中の一手':'自力練習'}</p><p>${session.index+1}／${session.qs.length}</p></div><p>${esc(l.title)}</p><h2 tabindex="-1">${esc(q.text)}</h2><p>紙に途中式を書いてから選ぼう。困ったらヒントを見ても大丈夫。</p><details id="hint"><summary>ヒントを見る</summary><p>${esc(q.hint)}</p></details><form id="learning-form" class="choice-list">${q.choices.map(c=>`<label class="choice-card"><input type="radio" name="answer" value="${c.id}"><span>${esc(c.text)}</span></label>`).join('')}<p id="answer-notice" role="status"></p><button class="primary-button" type="submit">回答する</button></form><div id="result" class="result-box" role="status" hidden></div><button id="next-question" class="secondary-button" hidden>${session.index+1<session.qs.length?'次の問題':'練習の結果を見る'}</button></section>`;
 app.querySelector('#hint').ontoggle=ev=>{if(ev.target.open&&!answered)hint=true;};
 app.querySelector('form').onsubmit=ev=>{
 ev.preventDefault();if(answered)return;
 const choice=q.choices.find(c=>c.id===new FormData(ev.currentTarget).get('answer'));
 if(!choice){app.querySelector('#answer-notice').textContent='答えを1つ選んでください。';return;}
 answered=true;const correct=choice.id===q.correctChoiceId;
 session.answers.push({unit:l.id,correct,hint:hint||app.querySelector('#hint').open});
 app.querySelector('#answer-notice').textContent='';
 app.querySelectorAll('form input,form button').forEach(el=>el.disabled=true);
 const r=app.querySelector('#result');r.hidden=false;r.className='result-box '+(correct?'is-correct':'is-wrong');
 r.innerHTML=`<p class="result-message">${correct?'正解です。':'ここを確認してみよう。'}</p><p class="result-message">正解：${esc(q.choices.find(c=>c.id===q.correctChoiceId).text)}</p><p>${esc(choice.feedback)}</p><p class="explanation-text">${esc(q.explanation)}</p><a class="text-link" target="_blank" rel="noopener" href="${url('lesson',l.id)}">説明を別タブで読む</a>`;app.querySelector('#next-question').hidden=false;
 };
 app.querySelector('#next-question').onclick=()=>{if(!answered)return;session.index++;session.index<session.qs.length?question():finish();focus();};
}
function finish(){
 const a=session.answers;
 app.innerHTML=`<section class="study-card"><h2 tabindex="-1">今回の練習</h2><p class="result-message">${a.length}問中 ${a.filter(x=>x.correct).length}問正解</p><p>ヒントなしで正解：${a.filter(x=>x.correct&&!x.hint).length}問 ／ ヒント使用：${a.filter(x=>x.hint).length}問</p><p>ヒントなしで解き方を説明できたら「覚えた」の目安にしよう。印はこのブラウザに保存されます。</p>${lessons.filter(l=>a.some(x=>x.unit===l.id)).map(l=>`<div class="result-box"><h3>${esc(l.title)}</h3><p>${a.some(x=>x.unit===l.id&&(!x.correct||x.hint))?'説明や途中式をもう一度確認しよう。':'ヒントなしで全問正解できました。'}</p><a class="text-link" href="${url('lesson',l.id)}">説明に戻る</a>${mark(l)}</div>`).join('')}<button id="retry" class="primary-button">同じ範囲をもう一度練習</button><a class="secondary-button" href="#view=overview">項目一覧へ戻る</a></section>`;
 bindMarks();app.querySelector('#retry').onclick=()=>{route();focus();};
}
function missing(){app.innerHTML='<h2 tabindex="-1">この項目は見つかりません</h2><a href="#view=overview">項目一覧へ戻る</a>';}
function route(){
 const p=new URLSearchParams(location.hash.slice(1)),view=p.get('view')||'overview',l=lessons.find(l=>l.id===p.get('unit'));
 if(view==='overview')overview();
 else if(view==='lesson'&&l)lesson(l);
 else if(['guided','practice'].includes(view)&&l)quiz(l.questions.filter(q=>view==='guided'||q.stage==='practice'),[l.id]);
 else if(view==='mixed'){
 const ids=[...new Set((p.get('units')||'').split(','))].filter(id=>lessons.some(l=>l.id===id));
 const qs=lessons.filter(l=>ids.includes(l.id)).flatMap(l=>l.questions.filter(q=>q.stage==='practice'));
 for(let i=qs.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[qs[i],qs[j]]=[qs[j],qs[i]];}
 quiz(qs.slice(0,['10','20'].includes(p.get('count'))?Number(p.get('count')):qs.length),ids);
 }else missing();
}
try{
 const r=await fetch('../data/suken-roots.json');if(!r.ok)throw Error('load failed');lessons=(await r.json()).lessons;
 try{const saved=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(saved))marks=new Set(saved.filter(id=>lessons.some(l=>l.id===id)));}catch{notice.textContent='保存された印を読み込めませんでした。学習は続けられます。';}
 route();window.addEventListener('hashchange',()=>{route();focus();});
}catch(error){console.warn(error);app.innerHTML='<h2>教材を読み込めませんでした</h2><p>通信状態を確認して再読み込みしてください。</p><a href="./suken-2-first.html">数検2級 1次へ戻る</a>';}
