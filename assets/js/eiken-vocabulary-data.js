/* 写真の見出し語を番号順に転記。W=単語、P=熟語。元写真はローカル専用。 */
(() => {
  'use strict';
  const rows = `
1|W|biology|生物学
2|W|presentation|プレゼンテーション・発表
3|W|graduation|卒業
4|W|education|教育
5|W|favor|親切・好意
6|W|lifetime|一生・生涯
7|W|neighborhood|近所・近隣
8|W|site|場所・用地・敷地／ウェブサイト
9|W|introduction|導入・紹介
10|W|feed|〜にえさを与える
11|W|attend|〜に出席する
12|W|fill|〜をいっぱいにする・満たす
13|W|stress|〜を強調する／ストレス
14|W|own|〜を所有している
15|W|offer|〜を申し出る・提供する
16|W|tough|つらい・厳しい／丈夫な
17|W|historical|歴史の・歴史に関する
18|W|regular|定期的な・規則正しい
19|W|actually|本当に・実際には
20|W|quite|かなり・まったく
21|W|hopefully|願わくは・うまくいけば
22|P|do well|成功する・うまくいく
23|P|in a hurry|急いで・あわてて
24|P|at once|すぐに・ただちに／同時に・一度に
25|W|desert|砂漠
26|W|partner|配偶者・恋人・パートナー／共同経営者
27|W|technology|科学技術・テクノロジー
28|W|form|形・形状／用紙・書式
29|W|character|性格・特徴
30|W|plate|皿・取り皿／金属やガラスなどの板
31|W|rule|規則・ルール／支配
32|W|access|〜にアクセスする・接続する／接続・接近
33|W|compete|競争する・競う
34|W|surf|サーフィンをする／ネットなどを見て回る
35|W|set|〜を置く・配置する／時計などを設定する／日時などを決める
36|W|discuss|〜について話し合う・議論する
37|W|expect|〜を予期する／〜を期待する
38|W|mind|〜を気にする・嫌だと思う
39|W|solve|〜を解決する・解く
40|W|amazing|驚くほどよい・びっくりさせるような
41|W|available|利用できる・入手できる／手があいて対応できる
42|W|common|普通の・よくある／共通の
43|W|sometime|いつか・そのうち
44|W|however|しかしながら・けれども・一方では
45|P|hand in|〜を提出する
46|P|feel like doing|〜したい気がする・気分である
47|P|one another|お互い
48|P|thanks to|〜のおかげで
49|W|carpenter|大工
50|W|insect|昆虫・虫
51|W|owner|持ち主・所有者
52|W|trick|たくらみ・策略／手品／悪ふざけ・いたずら
53|W|competition|競争・競技会
54|W|topic|話題・トピック
55|W|detail|細部／詳細・詳細な記述
56|W|guide|〜を案内する／案内人
57|W|support|〜を支持する・支援する／〜を支える
58|W|create|〜を創造する・創作する
59|W|fix|〜を固定する／〜を修理する
60|W|quit|〜をやめる
61|W|impress|〜に感銘を与える・よい印象を与える
62|W|surprise|〜を驚かす・びっくりさせる
63|W|active|活発な／積極的な・意欲的な
64|W|original|最初の・本来の／独創的な／もとの・原文の
65|W|comfortable|快適な・心地よく感じる
66|W|normal|標準の・普通の・正常な
67|W|apart|離れて（距離・時間）
68|W|softly|静かに・柔らかく
69|W|besides|さらに・その上／〜のほかに
70|P|check out|ホテルなどでチェックアウトする
71|P|make sure|〜を確かめる／必ず〜するように手配する
72|P|for a while|しばらくの間
73|W|care|世話・手入れ／注意・心遣い
74|W|effect|効果・影響
75|W|direction|道順・指示・説明／方向・方角
76|W|heat|熱・熱さ／暑さ
77|W|generation|同世代の人々・世代
78|W|material|原料・材料
79|W|percent|パーセント
80|W|project|事業計画・企画・プロジェクト
81|W|skill|技術・腕前
82|W|temperature|温度・気温・体温
83|W|variety|多様性・変化に富むこと
84|W|aim|〜を目指す／〜をねらう／目的
85|W|avoid|〜を避ける
86|W|crash|衝突する・墜落する
87|W|guess|〜を推測する
88|W|improve|〜を改善する・上達させる／よくなる・上達する
89|W|recommend|〜を推薦する
90|W|fluent|すらすらと話せる・流暢な
91|W|sharp|よく切れる・鋭利な／激しい・鋭い（痛み・刺激）
92|W|tropical|熱帯の
93|W|apparently|たぶん・どうやら〜らしい／見たところ・どう見ても
94|P|get better|以前よりよくなる
95|P|find out|〜を見つけ出す・知る
96|P|after all|結局・やはり
97|W|technique|専門技術・技法
98|W|article|記事（新聞・雑誌など）
99|W|brain|脳／知能・頭脳
100|W|peace|平和
101|W|agreement|協定・契約／同意・了解
102|W|illness|病気
103|W|pain|痛み／苦労
104|W|situation|立場・状態・状況
105|W|advice|助言・忠告・アドバイス
106|W|train|〜を訓練する・教育する／トレーニングする
107|W|release|〜を解き放す／〜を公表する・発売する
108|W|allow|〜を許す・許可する
109|W|fail|失敗する／試験に落ちる
110|W|miss|〜をしそこなう・逃す／〜がいないので寂しく思う
111|W|produce|〜を生産する・製造する
112|W|wonder|〜だろうかと思う・〜かしらと思う
113|W|tight|きつい・ぴちぴちの（靴・服）
114|W|allergic|アレルギーの・アレルギー体質の
115|W|average|平均的な・標準的な・典型的な
116|W|surprising|驚くべき・驚かせるような
117|W|recently|最近・ついこのあいだ
118|W|quickly|速く・急いで
119|P|be used to doing|〜するのに慣れている
120|P|by accident|偶然に・誤って・たまたま
121|W|habit|習慣・癖
122|W|host|主人・主催者／開催国・団体／番組の司会者
123|W|instruction|取扱説明書／指図・指示
124|W|interest|興味・関心／利子・利息
125|W|director|監督・ディレクター・重役
126|W|safety|安全・無事
127|W|sentence|文
128|W|hint|ヒント・暗示
129|W|model|模型／型
130|W|count|〜を数える・計算する
131|W|exercise|運動をする
132|W|advise|〜に助言する・忠告する
133|W|measure|〜を測る・測定する
134|W|prepare|〜を準備する・用意する
135|W|reserve|〜を予約する／〜をとっておく
136|W|weigh|〜の重さがある／〜の重さを量る
137|W|repair|〜を修理する
138|W|careless|不注意な・軽率な
139|W|following|次の／次に述べる・下記の
140|W|responsible|責任がある／信頼できる
141|W|already|すでに・もう
142|W|instead|その代わりに・それよりも・それどころか
143|W|surprisingly|驚くほどに・意外に／驚いたことに
144|P|be likely to do|〜しそうである・たぶん〜するだろう
145|W|nationality|国籍
146|W|officer|役人・公務員・役員
147|W|oil|油・石油
148|W|disease|病気
149|W|resort|行楽地・リゾート／頼ること
150|W|speed|速度・速さ
151|W|success|成功
152|W|delivery|配達・配送
153|W|importance|重要性・重要なこと
154|W|choice|選択
155|W|research|研究・調査
156|W|add|〜を加える／〜を足す・合計する
157|W|greet|〜にあいさつする
158|W|park|〜を駐車する・止めておく
159|W|bite|〜をかむ・かみつく
160|W|cough|せきをする・せき払いをする
161|W|unique|唯一の／独特の・ユニークな
162|W|peaceful|平和な・穏やかな・静かな
163|W|patient|我慢強い／患者
164|W|completely|完全に
165|W|perhaps|おそらく・ひょっとすると
166|P|catch up with|〜に追いつく
167|P|cheer 〜 up|〜を元気づける・励ます
168|P|plenty of|たくさんの・十分な
169|W|wave|波
170|W|sunlight|日光
171|W|oxygen|酸素
172|W|master|名人・達人／〜を習得する
173|W|aisle|通路
174|W|signal|合図・信号
175|W|ancestor|祖先・先祖
176|W|service|奉仕／サービス・接客
177|W|tourism|観光事業
178|W|sail|航海する／帆・帆船
179|W|flash|ぴかっと光る／さっと通り過ぎる・ぱっと現れる
180|W|survive|生き残る
181|W|act|行動する／〜を演じる
182|W|apologize|謝罪する・わびる・謝る
183|W|prefer|〜のほうが好きである・〜するほうを好む
184|W|raw|生の
185|W|honest|正直な
186|W|calm|落ち着いた・冷静な／穏やかな（海・天候）
187|W|simple|単純な・簡単な／簡素な
188|W|awful|最悪の・ひどい・恐ろしい
189|W|anywhere|どこでも・どこにでも／どこかに／どこにも
190|P|be popular with|〜に人気である・評判である
191|P|come true|夢・望みなどが実現する
192|P|depend on|〜次第である／〜に依存する・頼る
193|W|cattle|家畜として飼われる牛
194|W|baggage|旅行用の手荷物
195|W|basement|地階・地下室
196|W|calcium|カルシウム
197|W|crop|農作物・収穫物／収穫高
198|W|anniversary|記念日・記念祭
199|W|communication|伝達・意思の疎通／通信
200|W|approach|〜に近づく・接近する
201|W|protect|〜を保護する・守る
202|W|trust|〜を信頼する・信用する
203|W|forgive|〜を許す（人・行為・罪）
204|W|earn|〜を得る・稼ぐ・もうける
205|W|final|最終の・最後の
206|W|ill|病気で・気分が悪い／悪い・有害な
207|W|national|国家の・国民の／全国的な／国立の
208|W|empty|空の・空席の・人のいない
209|W|terrible|恐ろしい・ぞっとする／ひどい・最悪の
210|W|badly|まずく・下手に／かなり・ひどく
211|W|probably|たぶん・おそらく
212|W|pretty|かなり・相当に／かわいい・きれいな
213|W|nowadays|この頃では・近頃では
214|P|get along with|〜とうまく・仲良くやっている
215|P|drop by|〜に立ち寄る・ひょっこり訪ねる
216|P|in advance|前もって・あらかじめ
217|W|citizen|国民／市民・住民
218|W|population|人口・個体数
219|W|tournament|トーナメント・勝ち抜き試合
220|W|weight|重さ・体重
221|W|arrival|到着
222|W|beginning|最初・始まり・初めの部分
223|W|business|商売・事業・仕事／用事
224|W|condition|状態・体調／状況／条件
225|W|route|道・道筋／路線・航路
226|W|copy|〜を写し取る・書き写す・まねる
227|W|hire|〜を雇う
228|W|beat|〜に打ち勝つ・負かす／〜を打つ／鼓動する
229|W|argue|言い争う・口論する／〜だと主張する
230|W|serve|飲食物を出す／〜のために働く・〜に仕える
231|W|compare|〜を比べる・比較する
232|W|handsome|ハンサムな・顔立ちの整った
233|W|electronic|電子の
234|W|major|より大きな・主要な
235|W|greatly|大いに・非常に
236|W|equally|同様に・同程度に／等しく・平等に
237|W|frankly|率直に・思い切って／率直に言って
238|P|exchange A for B|AをBと取り替える・交換する
239|P|on time|時間通りに
240|P|as 〜 as possible|できるだけ〜
241|W|area|地域・場所／領域・分野
242|W|lobby|ホテル・劇場などのロビー・ホール
243|W|gallery|美術館・画廊
244|W|assistant|助手・アシスタント
245|W|journey|長距離の旅行
246|W|economy|経済・景気
247|W|energy|活力・気力／エネルギー・資源
248|W|custom|社会的な慣習・風習／税関
249|W|essay|小論文・作文・エッセイ
250|W|definition|語などの定義
251|W|celebration|祝賀・祝賀会
252|W|breathe|息をする・呼吸する／〜を吸い込む
253|W|kick|〜を蹴る
254|W|march|行進する
255|W|block|〜をせき止める・ふさぐ／〜を阻止する
256|W|report|〜を報告する
257|W|award|〜を授与する・贈る
258|W|appear|現れる／出演する・登場する
259|W|exhibit|〜を展示する
260|W|dead|死んだ・枯れた
261|W|global|世界的な・全世界の
262|W|currently|現在は・今は
263|P|show 〜 around|人を案内して回る
264|P|far from|〜から遠く離れて
265|W|audience|聴衆・観客
266|W|popularity|人気・評判
267|W|sense|感覚／意味／センス
268|W|luck|幸運・運
269|W|industry|産業・工業
270|W|harvest|収穫・収穫期／収穫物・収穫高
271|W|flashlight|懐中電灯
272|W|coast|沿岸・海岸
273|W|dinosaur|恐竜
274|W|nation|国・国家／国民
275|W|tradition|伝統・しきたり
276|W|retire|退職する・引退する
277|W|melt|溶ける／〜を溶かす
278|W|pour|〜を注ぐ・かける／雨が激しく降る
279|W|press|〜を押す
280|W|realize|〜を理解する・気づく／〜を実現する
281|W|respect|〜を敬う・尊重する
282|W|wrap|〜を包む
283|W|round|丸い・円形の
284|W|spicy|香辛料のきいた
285|W|successful|成功した・うまくいった
286|P|be filled with|〜でいっぱいである
287|P|keep up with|〜に遅れずについていく
288|P|make fun of|〜をからかう
289|W|chemistry|化学
290|W|degree|温度・角度などの度／学位
291|W|dormitory|寮・寄宿舎
292|W|favor|好意・親切な行為
293|W|credit|信用・信頼
294|W|death|死・死亡
295|W|arrest|〜を逮捕する
296|W|destroy|〜を破壊する・壊す
297|W|apply|申し込む／あてはまる・適用される
298|W|display|〜を展示する・陳列する・飾る
299|W|dress|〜に服を着せる／服を着る
300|W|import|〜を輸入する・持ち込む
301|W|rise|出る・昇る／上昇する・増加する
302|W|publish|〜を出版する／〜を発表する
303|W|double|2倍の／〜を2倍にする
304|W|female|女性の・雌の
305|W|latest|最近の・最新の
306|W|exactly|正確に・ちょうど／その通り
307|W|extremely|極度に・極端に・非常に
308|W|unfortunately|不幸にも・あいにく・残念ながら
309|P|be crowded with|〜で混雑している
310|P|take place|事が起こる・行われる・開催される
311|P|in the end|結局・最後には
312|P|for fun|楽しみのために・面白半分で
313|W|couple|夫婦・恋人同士／2つの・いくつかの
314|W|conversation|会話
315|W|description|記述・説明・描写
316|W|greenhouse|温室・ビニールハウス
317|W|item|項目・アイテム／品物
318|W|matter|事・問題／物質・物体
319|W|level|水準・高さ／水準・能力／程度・数量
320|W|voyage|船旅・航海・宇宙旅行
321|W|achieve|〜を達成する・成し遂げる／〜を獲得する
322|W|disappoint|〜を失望させる・がっかりさせる
323|W|bark|ほえる
324|W|develop|〜を発達させる・開発する／発達する・発展する
325|W|fold|〜を折りたたむ／腕などを組む
326|W|freeze|凍る／〜を凍らせる・冷凍する
327|W|annoy|〜をいらいらさせる・悩ませる
328|W|frightened|おびえた・ぞっとした
329|W|modern|現代の・近頃の／現代的な・最新式の
330|W|specific|明確な・具体的な／特定の
331|W|afterward|後で・その後
332|W|gradually|だんだんと・徐々に
333|W|mostly|たいていは・大部分は
334|W|environmentally|環境保護の点で・環境面で
335|P|be satisfied with|〜に満足している
336|P|be worried about|〜について心配する・不安である
337|W|army|軍隊・陸軍
338|W|crowd|群衆・人ごみ・観衆
339|W|staff|職員・スタッフ
340|W|belief|信じること・確信／信仰・信条
341|W|community|地域社会・共同体
342|W|cloth|布／ふきん・ぞうきん
343|W|meaning|意味・意義
344|W|occasion|時・場合・行事
345|W|dislike|〜が嫌いである・〜を嫌う
346|W|include|〜を含む
347|W|limit|〜を制限する・抑える
348|W|locate|〜の場所を突き止める・見つける／位置する
349|W|organize|〜を準備する・手配する／〜をまとめる・整理する
350|W|remind|〜に思い出させる
351|W|review|〜を再調査する／〜を批評する／〜を復習する
352|W|alive|生きて
353|W|delighted|とても喜ぶ・大変うれしく思う
354|W|tiny|とても小さい・ちっちゃい
355|W|full-time|フルタイムで・常勤で
356|W|rarely|めったに〜ない
357|P|be similar to|〜とよく似ている
358|P|go through|〜を通り抜ける／〜を経験する
359|P|major in|〜を専攻する
360|P|for free|ただで・無料で
361|W|tail|尾・しっぽ
362|W|flour|小麦粉
363|W|spray|スプレー・噴霧器／しぶき・水煙
364|W|customer|客・顧客
365|W|coworker|仕事仲間・同僚
366|W|childhood|子ども時代・幼少期
367|W|kindergarten|幼稚園
368|W|charge|サービスに対する料金・使用料
369|W|biography|伝記
370|W|order|順番・順序／注文／命令・指示
371|W|emotion|感情
372|W|marry|〜と結婚する
373|W|respond|反応する・応じる／答える・応答する
374|W|rent|〜を有料で借りる／〜を有料で貸す
375|W|waste|〜を浪費する・無駄に使う
376|W|exist|存在する・実在する
377|W|warn|〜に警告する・注意する
378|W|bright|明るい・輝いている／頭のよい・利口な
379|W|extra|追加の・余分の
380|W|various|さまざまな・いろいろな
381|W|naturally|自然に／ありのままに
382|W|fortunately|運よく・幸運にも
383|W|since|〜以来／〜なので
384|P|in time|間に合うように・間に合って
385|W|boss|上司・親分・長
386|W|professor|教授
387|W|millionaire|大富豪・百万長者
388|W|motorcycle|オートバイ
389|W|attraction|人を引きつける物・人・アトラクション
390|W|shelter|避難所・保護施設・シェルター
391|W|performance|公演・演奏・演技／成績・業績
392|W|pause|小休止・途切れ・間
393|W|difference|違い・相違・差
394|W|balance|〜の釣り合いを取る／バランス・均衡
395|W|interview|〜と面接する／〜にインタビューする
396|W|lock|〜に鍵を掛ける／鍵が掛かる
397|W|burn|〜を燃やす・焦がす／燃える・焦げる
398|W|escape|逃げる／〜を逃れる・免れる
399|W|translate|〜を翻訳する・訳す
400|W|classical|クラシックの・古典派の
401|W|formal|正式の・形式ばった／礼儀ばった
402|W|confident|自信にあふれた・自信を持って
403|W|lately|最近・近頃
404|W|shortly|まもなく・すぐに・じきに
405|P|make an appointment|面会・医師・美容師などの予約をする
406|P|believe in|〜の存在を信じる／〜を信頼する
407|P|keep in touch with|〜と連絡を取り続ける
408|P|out of date|時代遅れの
409|W|author|著者・作家・作者
410|W|location|位置・場所
411|W|section|部分・区画・区域
412|W|sight|視力／景色・光景
413|W|result|結果・結末・成り行き／成果
414|W|moment|瞬間・短時間／時・時間・機会
415|W|fossil|化石
416|W|discovery|発見
417|W|purpose|目的・意図
418|W|difficulty|困難・苦労
419|W|behavior|ふるまい・行動・行儀・態度
420|W|recover|回復する・元気になる／〜を取り戻す
421|W|hang|〜を掛ける・つるす／掛かっている・ぶら下がる
422|W|twist|〜をねじる・よじる／〜をひねる
423|W|injure|〜にけがをさせる・傷つける
424|W|treat|〜を扱う／〜を治療する／〜をおごる
425|W|separate|〜を分ける／〜を引き離す
426|W|judge|〜を判断する／〜に判決を下す
427|W|southern|南の・南にある
428|W|whole|全体の・全部の・まるごとの
429|W|delicate|微妙な・扱いの難しい／繊細な・優美な
430|W|unusual|普通でない・珍しい・異常な
431|W|necessarily|必ず・必然的に
432|P|by nature|本質上・生まれつき・本来・もともと
433|W|blossom|主に果樹の花
434|W|treasure|宝物
435|W|enemy|敵・敵軍
436|W|stranger|見知らぬ人・他人／不慣れな人
437|W|board|板・まな板／委員会
438|W|task|やるべき仕事・任務・作業
439|W|danger|危険・危険な物や人・危険性
440|W|victory|勝利
441|W|attention|注意・注目・関心・興味
442|W|pleasure|楽しみ・喜び
443|W|government|政府／政治
444|W|attract|興味や注意を引きつける・人を魅了する
445|W|scream|叫ぶ・悲鳴を上げる
446|W|float|浮かぶ・浮く／〜を浮かべる
447|W|sink|沈む／〜を沈める・沈没させる
448|W|replace|〜に取って代わる／〜を取り替える
449|W|calculate|〜を計算する
450|W|vote|投票する／〜を投票で決める
451|W|fulfill|役割や条件を果たす・満たす／望みを実現する
452|W|several|いくつかの
453|W|jealous|ねたんだ・嫉妬した・嫉妬深い
454|W|regularly|定期的に
455|P|name A after B|BにちなんでAを名づける
456|P|run over|車などが〜をひく
457|W|conclusion|結論・決定／結末・結び
458|W|excuse|理由・言い訳
459|W|bill|請求書・勘定／紙幣・札
460|W|drugstore|ドラッグストア・薬局
461|W|effort|努力・奮闘
462|W|emergency|非常事態・緊急事態
463|W|data|資料・データ
464|W|furniture|家具
465|W|invitation|招待・誘い／招待状
466|W|election|選挙・投票
467|W|behave|ふるまう・行動する／行儀よくする
468|W|contact|〜と連絡を取る
469|W|delay|〜を延期する／〜を遅らせる
470|W|discover|〜を発見する
471|W|handle|〜を扱う・処理する
472|W|arrange|〜をきちんと並べる／〜を取り決める・準備する
473|W|past|過去の／〜を過ぎて
474|W|medical|医学の・医療の
475|W|unknown|知られていない・不明の／無名の
476|W|fair|適正な・正しい／公平な／晴れた／肌などが色白の
477|W|private|私的な・個人的な／民間の・私立の
478|W|secretly|秘密に・こっそりと・内緒で
479|P|have 〜 in common with|〜と共通点がある
480|P|so far|これまでのところ・これまでは
481|W|branch|枝／支店・支社
482|W|convenience|便利さ
483|W|employer|雇い主・雇用者
484|W|frame|枠・額縁／骨組み・構造
485|W|knowledge|知識
486|W|method|方法・方式
487|W|necessity|必要性／必需品
488|W|operation|操作／手術
489|W|reaction|反応・反響／化学などの反応
490|W|track|小道／線路／通った跡・足跡
491|W|blow|風が吹く／〜に息を吹きかける
492|W|challenge|人に挑戦する・挑む
493|W|decrease|減少する・減る／〜を減らす
494|W|deliver|〜を配達する
495|W|gather|〜を集める／集まる
496|W|oversleep|寝過ごす・寝坊する
497|W|select|〜を選び出す
498|W|slide|滑る／〜を滑らせる
499|W|tease|〜をからかう・いじめる
500|W|lazy|怠惰な・怠けた
501|W|pleasant|楽しい／感じのよい
502|W|downtown|町の中心街に・繁華街へ
503|P|be in trouble|困難な・困った状況にある
504|P|as well as|〜だけでなく…も
505|W|ability|能力・力量
506|W|spirit|精神・気分／気質
507|W|decision|決定・決断
508|W|relation|関係・関連
509|W|strength|力・強さ／長所
510|W|brand|銘柄・商標・ブランド
511|W|diet|食事／食事制限
512|W|experiment|実験・試み
513|W|forecast|予報・予測
514|W|license|免許・許可証
515|W|cancel|〜を取り消す・中止する
516|W|communicate|情報や意見を交換する・連絡を取る／〜を伝える
517|W|disappear|見えなくなる・消え去る
518|W|lead|〜を案内する／〜に至る／〜を率いる
519|W|suggest|〜を提案する／〜を示唆する
520|W|silly|愚かな・くだらない・ばかげた
521|W|certain|確信して・確かで／ある一定の
522|W|international|国際的な・国際間の
523|W|personal|個人の・個人的な
524|W|upset|動揺して・混乱して・不安で
525|W|strongly|強く・断固として・明確に
526|W|therefore|それゆえに・したがって
527|P|show up|現れる
528|P|as a result of|〜の結果として
529|W|continent|大陸
530|W|courage|勇気
531|W|earthquake|地震
532|W|fear|恐れ・不安
533|W|greeting|あいさつ
534|W|image|印象・イメージ／像・映像
535|W|microwave|電子レンジ
536|W|navigation|航海・航空術／乗り物などの誘導
537|W|security|警備・セキュリティ／安心・備え
538|W|selection|選択・選ぶこと・品ぞろえ
539|W|talent|才能・適性
540|W|theme|主題・テーマ
541|W|traffic|交通量・往来
542|W|dig|〜を掘る・掘り出す
543|W|embarrass|〜に恥ずかしい思いをさせる・困らせる
544|W|express|〜を表現する
545|W|kill|〜を殺す・枯らす
546|W|recognize|〜が分かる・認識する・見覚えがある
547|W|reply|〜に返事をする／〜と答える
548|W|charming|魅力的な・感じのよい
549|W|clear|分かりやすい／はっきりした／澄んだ・晴れた
550|W|obviously|明らかに・目に見えて・言うまでもなく
551|P|lose one's way|道に迷う
552|P|point out|〜を指摘する
553|W|port|港
554|W|pole|棒・柱・さお
555|W|receipt|領収書・受領書・レシート
556|W|wheat|小麦
557|W|statue|像・彫像
558|W|honor|名誉・光栄
559|W|action|行動・活動
560|W|trouble|困ったこと・面倒なこと／心配事・悩み事
561|W|charity|慈善行為・慈善団体
562|W|shortage|不足・欠乏
563|W|skip|〜を飛ばす・省く／跳び跳ねる
564|W|hug|〜を抱きしめる・抱える
565|W|trap|〜を閉じ込める／〜をわなで捕らえる
566|W|describe|〜の特徴を述べる・描写する・説明する
567|W|run|〜を経営する／立候補する
568|W|trade|貿易する・取引する／〜を交換する
569|W|stand|〜を我慢する・耐える
570|W|rude|失礼な・無礼な
571|W|wise|賢い・賢明な
572|W|stupid|ばかげた・愚かな
573|W|enjoyable|楽しい・愉快な・面白い
574|P|shake hands with|〜と握手する
575|P|in the middle of|〜の真ん中に／〜の最中で
576|P|by mistake|間違って・誤って
577|W|pillow|枕
578|W|root|根／根源・原因
579|W|network|輸送網／情報網・人脈
580|W|grocery|日用雑貨・食料品
581|W|fare|交通機関の料金・運賃
582|W|poem|詩
583|W|crime|罪・犯罪
584|W|privacy|プライバシー・私的な自由
585|W|lack|不足・欠乏
586|W|atmosphere|雰囲気・環境・ムード／大気・大気圏
587|W|point|指さす・指し示す
588|W|lift|〜を持ち上げる・上げる
589|W|whisper|ささやく・ひそひそ話す
590|W|request|〜を要請する・頼む
591|W|specialize|専門に取り扱う・専攻する
592|W|colored|色のついた・着色された
593|W|fantastic|素晴らしい・すごい／空想的な
594|W|male|男性の・雄の
595|W|instant|即席の／瞬間の
596|W|simply|分かりやすく・簡単に／ただ単に／質素に
597|W|somewhere|どこかで・どこかへ
598|P|get together|集まる
599|P|stand by|〜を支持する・助ける
600|P|take over|〜を引き継ぐ
601|W|horizon|地平線・水平線
602|W|climate|気候
603|W|argument|口論・言い争い／議論・論争
604|W|wheelchair|車いす
605|W|employee|従業員・社員
606|W|quality|質・品質
607|W|value|価値・価格
608|W|flavor|風味・味・フレーバー
609|W|media|マスメディア・マスコミ
610|W|movement|動き・動作／運動・活動
611|W|friendship|友情・友人関係・友好関係
612|W|origin|起源・発祥・出自
613|W|seek|〜を探す・探し求める
614|W|chase|〜を追う・追跡する
615|W|repeat|〜を繰り返す・繰り返して言う
616|W|surround|〜を囲む
617|W|stare|〜をじっと見る
618|W|demonstrate|〜を証明する／〜を実演する・説明する
619|W|central|中央の・中心の／重要な・主要な
620|W|overweight|太りすぎの・重量超過の
621|W|plain|平易な・分かりやすい
622|W|reasonable|筋の通った・納得できる／適切な・手頃な
623|W|ideal|理想的な・申し分のない
624|P|put 〜 away|〜をしまう・片づける／〜を蓄える
625|W|shadow|影
626|W|expert|熟練者・専門家
627|W|principal|校長／主要な
628|W|state|国・国家／州
629|W|thought|考え・思いつき／思考
630|W|explanation|説明・釈明
631|W|entertainment|娯楽・楽しみ・気晴らし
632|W|mess|散らかっている状態・混乱
633|W|control|〜を支配する・制御する
634|W|stretch|〜を伸ばす・伸びる／首などを伸ばして見る
635|W|widen|広がる／〜を広げる
636|W|remove|〜を取り除く・取り去る
637|W|pronounce|〜を発音する
638|W|appeal|訴える・求める／魅力がある・興味を引く
639|W|deny|〜を否定する・拒絶する
640|W|mild|穏やかな・温暖な／口当たりがよい
641|W|nearby|近くの／近くに
642|W|rapid|急激な・急速な／素早い
643|W|painful|つらい・苦しい／痛みを伴う
644|W|particular|特定の・特にこの／独特の・特有の
645|W|missing|欠けている・行方不明の・見当たらない
646|W|forever|永久に・永遠に・ずっと
647|W|anymore|もはや・これ以上
648|P|take a look at|〜を見る
649|W|amount|ある量／総計・総額
650|W|beauty|美・美しさ
651|W|scene|場面・シーン／景色
652|W|freedom|自由・解放
653|W|department|部・課／売り場
654|W|organization|組織・団体
655|W|law|法律・法
656|W|position|位置・場所／立場・状況
657|W|pride|誇り・自尊心・うぬぼれ
658|W|skin|皮膚・肌／皮
659|W|tear|涙・泣くこと
660|W|announce|〜を発表する・公表する
661|W|bend|身をかがめる／〜を曲げる
662|W|export|〜を輸出する
663|W|lie|うそをつく
664|W|pack|荷造りする・荷物を詰める
665|W|portable|持ち運びできる・携帯用の
666|W|chemical|化学の・化学的な
667|W|flat|平らな・平たんな
668|W|independent|頼らない・自立した／独立した
669|W|outdoor|屋外の・屋外にある・屋外用の
670|W|violent|暴力的な・乱暴な
671|W|valuable|高価な／貴重な・役に立つ
672|P|at least|少なくとも
673|W|avenue|大通り・〜街
674|W|vehicle|乗り物・車
675|W|faith|信頼・信用／信仰
676|W|truth|真実・事実
677|W|personality|個性・性格・人柄／有名人
678|W|silence|静けさ・静寂／沈黙・無言
679|W|symbol|シンボル・象徴
680|W|harm|〜を害する・傷つける・悪影響を与える
681|W|match|〜に合う・調和する／〜に匹敵する
682|W|remain|〜のままである／とどまる・居残る
683|W|search|〜を捜す・捜索する・検索する
684|W|shine|輝く・光る／生き生きと輝く
685|W|basic|基本的な・初歩的な
686|W|gentle|優しい／穏やかな
687|W|intelligent|知能の高い・理解力のある・頭のよい
688|W|mobile|動きやすい・可動性の
689|W|medium|中くらいの・中間の／肉の焼き具合がミディアムの
690|W|single|たった1つの／独身の・未婚の
691|W|spare|予備の・スペアの
692|W|technical|工業技術の・科学技術の／専門の
693|W|tidy|きちんとした・整った
694|W|anyway|とにかく・いずれにせよ
695|P|look up to|目上の人を尊敬する
696|P|in public|公然と・人前で
697|W|attendant|接客係・案内係・乗員
698|W|crocodile|ワニ・クロコダイル
699|W|figure|人影・人像／図・図形／数字
700|W|scenery|風景・景色
701|W|rate|割合・比率／料金／速度・ペース
702|W|relative|親戚・身内
703|W|row|列・座席の列
704|W|species|種
705|W|rumor|うわさ
706|W|confuse|〜を困惑させる・混乱させる／〜を混同する
707|W|damage|〜に損害を与える・傷つける
708|W|film|〜を撮影する・映画化する
709|W|raise|〜を上げる・挙げる／〜を育てる
710|W|shock|〜に衝撃を与える・ぎょっとさせる
711|W|general|全体的な・一般の・たいていの
712|W|harmful|有害な・害を及ぼす
713|W|minor|比較的重要でない／少ない・小さい
714|W|standard|標準的な／基準となる
715|W|rough|ざらざらした・肌の荒れた／大ざっぱな
716|W|widely|広く・広範囲にわたって
717|P|rely on|〜を頼りにする・信頼する
718|P|get out of|〜から降りる・出る
719|P|a number of|多数の・いくつかの
720|P|on average|平均して・一般に
721|W|distance|距離／隔たり・遠方
722|W|engine|エンジン
723|W|passenger|乗客・旅客
724|W|studio|スタジオ／アトリエ
725|W|transportation|輸送機関・交通機関
726|W|wool|羊毛・ウール
727|W|attack|〜を攻撃する・襲う
728|W|cycle|〜を循環させる／周期・サイクル
729|W|direct|〜に指示する／映画などを監督する
730|W|lay|〜を横たえる・置く／卵を産む
731|W|memorize|〜を記憶する・暗記する
732|W|record|〜を記録する／〜を録音する・録画する
733|W|shape|〜を形作る
734|W|succeed|成功する／〜の後を継ぐ
735|W|square|正方形の・四角い／平方の
736|W|frightening|恐ろしい・ぞっとさせる
737|W|pure|純粋な・不純物のない
738|W|useless|無益な・役に立たない
739|W|totally|まったく・すっかり・完全に
740|P|be familiar with|〜を熟知している・〜に精通している
741|P|run into|〜に偶然出会う・ばったり会う
742|P|break down|故障する
743|P|take part in|〜に参加する
744|P|on business|用事で・商用で・仕事で
`;
  const entries = rows.trim().split('\n').map(line => {
    const [number, kind, answer, meaning] = line.split('|');
    return {number:Number(number), kind, answer, meaning};
  });
  const units = Array.from({length:8}, (_, index) => {
    const id=index+1, first=id===1?1:73+(id-2)*96, last=id===1?72:first+95;
    const items=entries.filter(item=>item.number>=first&&item.number<=last);
    return {id, first, last, words:items.filter(item=>item.kind==='W'), phrases:items.filter(item=>item.kind==='P')};
  });
  // 写真の見出しは24項目ずつ。Unit 1は1-2から始まる。
  const studyUnits = units.flatMap(unit => {
    const firstPart=unit.id===1?2:1;
    return Array.from({length:unit.id===1?3:4}, (_, index) => {
      const first=unit.first+index*24, last=first+23;
      const items=entries.filter(item=>item.number>=first&&item.number<=last);
      return {id:unit.id+'-'+(firstPart+index), parent:unit.id, first, last,
        words:items.filter(item=>item.kind==='W'), phrases:items.filter(item=>item.kind==='P')};
    });
  });
  window.EikenVocabularyData = {entries, units, studyUnits};
})();
