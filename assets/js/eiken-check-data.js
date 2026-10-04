/* 確認問題：Unit|番号|英文|選択肢|正解(0始まり)|日本語訳|解説 */
(() => {
  'use strict';
  const rows = `
1|1|His ( ) in history class was very interesting.|competition/presentation/graduation|1|歴史の授業での彼の発表は、とても興味深かった。|授業で行う「発表」はpresentation。
1|2|Who's the ( ) of that red car?|carpenter/partner/owner|2|あの赤い車の持ち主は誰ですか。|車の「所有者」を尋ねるのでowner。
1|3|Please visit our ( ) for more information.|site/rule/desert|0|詳しい情報については、私たちのウェブサイトをご覧ください。|情報を得るために訪れるウェブサイトをsiteと言う。
1|4|I'm interested in AI ( ).|technology/biology/ceremony|0|私はAI技術に興味がある。|AIに関する「技術」はtechnology。
1|5|I had a ( ) this morning.|lifetime/character/fever|2|今朝、熱があった。|have a feverで「熱がある」。
1|6|I'm good at doing card ( ).|topics/tricks/details|1|私はカードの手品が得意だ。|card tricksは「カードを使った手品」。
1|7|I ( ) the Internet in my free time.|own/set/surf|2|私は暇な時間にインターネットを見て回る。|surf the Internetで「ネットを見て回る」。
1|8|He kindly ( ) to help us.|offered/filled/stressed|0|彼は親切にも私たちを手伝うと申し出た。|offer to doで「〜すると申し出る」。
1|9|You can't ( ) the animals at the zoo.|solve/feed/quit|1|動物園で動物にえさを与えてはいけません。|動物に「えさを与える」はfeed。
1|10|Do you ( ) if I open the window?|mind/expect/fix|0|窓を開けてもよいですか。|Do you mind if ...?は許可を丁寧に尋ねる表現。
1|11|My family always ( ) me.|builds/supports/accesses|1|家族はいつも私を支えてくれる。|「支える」はsupport。主語に合わせsupportsとなる。
1|12|Her speech ( ) the audience.|impressed/attended/created|0|彼女のスピーチは聴衆に感銘を与えた。|「感銘を与える」はimpress。過去形はimpressed。
1|13|These shoes are ( ).|active/comfortable/historical|1|この靴は快適だ。|靴の履き心地を表すのはcomfortable。
1|14|Don't worry. It's a ( ) mistake.|common/huge/wrong|0|心配しないで。よくある間違いです。|common mistakeで「よくある間違い」。
1|15|It was a ( ) game, but our team won.|convenient/tall/tough|2|厳しい試合だったが、私たちのチームが勝った。|試合の厳しさを表すtoughが合う。
1|16|Their new house is ( ) large.|quite/hopefully/sometime|0|彼らの新しい家はかなり大きい。|形容詞largeの程度を表す副詞quite。
1|17|Thank you for the invitation. ( ), I'm afraid that I can't attend.|Suddenly/Besides/However|2|ご招待ありがとう。しかし、残念ながら出席できません。|感謝から出席できない話へ転じるのでHowever。
1|18|Mr. and Mrs. Davis live ( ).|softly/apart/actually|1|デイビス夫妻は離れて暮らしている。|live apartで「離れて暮らす」。
1|19|I ( ) my report to Mr. Smith yesterday.|did well/handed in/checked out|1|昨日、スミス先生にレポートを提出した。|hand inが「提出する」。yesterdayに合わせ過去形。
1|20|Sorry, I'm ( ).|in a hurry/for a while/at once|0|ごめんなさい、急いでいるんです。|be in a hurryで「急いでいる」。
2|1|We're working on a new ( ) now.|host/project/heat|1|今、新しいプロジェクトに取り組んでいる。|work on a projectで計画・企画に取り組む。
2|2|Meg is in a difficult ( ) now.|situation/importance/nationality|0|メグは今、難しい状況にいる。|in a difficult situationで「難しい状況にいる」。
2|3|This new medicine had no ( ) on my headache.|article/effect/success|1|この新しい薬は頭痛に効果がなかった。|have an effect onで「〜に効果・影響がある」。
2|4|Could you give me ( ) to the nearest bank?|introductions/directions/instructions|1|最寄りの銀行への道順を教えてくれますか。|目的地までの道順はdirections。
2|5|I have no ( ) in that new movie.|insect/skill/interest|2|その新しい映画には興味がない。|have an interest inで「〜に興味がある」。
2|6|She has a bad ( ) of biting her nails.|habit/temperature/illness|0|彼女には爪をかむ悪い癖がある。|習慣や癖を表すhabit。
2|7|Thank you for your ( ).|material/pain/advice|2|助言をありがとう。|人からもらう「助言」はadvice。
2|8|My grandfather has heart ( ).|care/disease/peace|1|祖父は心臓病を患っている。|heart diseaseで「心臓病」。
2|9|I had to make a lot of ( ) when I was planning my trip.|choices/brains/models|0|旅行を計画するとき、多くの選択をしなければならなかった。|make a choiceで「選択する」。ここでは複数形。
2|10|She did some ( ) for her report.|agreement/research/sentence|1|彼女はレポートのために調査をした。|do researchで「研究・調査をする」。
2|11|Kenji is ( ) for his high school entrance examination.|preparing/exercising/parking|0|ケンジは高校入試に向けて準備している。|prepare forで「〜の準備をする」。
2|12|Can you ( ) a good restaurant?|recommend/train/greet|0|よいレストランを推薦してくれますか。|「推薦する」はrecommend。
2|13|This factory ( ) thousands of toys every day.|allows/aims/produces|2|この工場は毎日、何千ものおもちゃを生産している。|工場が品物を「生産する」のでproduces。
2|14|I want to ( ) my English.|add/release/improve|2|英語を上達させたい。|能力を改善・上達させるのはimprove。
2|15|My sister ( ) the broken chair.|failed/repaired/wondered|1|姉は壊れた椅子を修理した。|壊れた物を「修理する」はrepair。
2|16|I was ( ) all night.|coughing/crashing/weighing|0|私は一晩中せきをしていた。|「せきをする」はcough。wasとともに過去進行形。
2|17|These jeans are too ( ) for me. Can I try a bigger size?|fluent/tight/sharp|1|このジーンズはきつすぎます。大きいサイズを試せますか。|大きいサイズを求めているのでtight。
2|18|The garden is famous for its ( ) fruit.|peaceful/patient/tropical|2|その庭は熱帯の果物で有名だ。|果物の種類を表すtropical。
2|19|I don't want to play video games. Let's play outside ( ).|instead/apparently/completely|0|ゲームはしたくない。代わりに外で遊ぼう。|別の行動を提案するのでinstead。
2|20|In the end, they ( ) the secret.|caught up with/found out/got better|1|ついに彼らは秘密を突き止めた。|find outで「見つけ出す・知る」。過去形はfound out。
3|1|About 21 percent of the air is ( ).|oxygen/sunlight/cattle|0|空気の約21パーセントは酸素だ。|空気に含まれる気体はoxygen。
3|2|Tokyo has a large ( ).|instruction/education/population|2|東京は人口が多い。|large populationで「多い人口」。
3|3|Rice is the main ( ) in this prefecture.|lobby/energy/crop|2|この県の主な農作物は米だ。|米を「農作物」として説明するcrop。
3|4|This classic car is in good ( ).|condition/anniversary/tournament|0|このクラシックカーはよい状態にある。|in good conditionで「よい状態にある」。
3|5|I recently learned that my ( ) were from Shikoku.|ancestors/signals/citizens|0|最近、先祖が四国出身だったと知った。|家系の「先祖」はancestors。
3|6|( ) is important in relationships.|Wave/Communication/Gallery|1|人間関係ではコミュニケーションが大切だ。|意思疎通を表すCommunication。
3|7|Many animals lived in this ( ) 50 years ago.|business/area/definition|1|50年前、この地域には多くの動物がいた。|動物が住む「地域」はarea。
3|8|She went on a year-long ( ) through Europe.|master/custom/journey|2|彼女はヨーロッパを巡る1年間の旅に出た。|長い旅を表すjourney。
3|9|The country's ( ) is growing fast.|calcium/economy/route|1|その国の経済は急速に成長している。|国の「経済」はeconomy。
3|10|He wrote an ( ) on animal rights.|essay/arrival/instrument|0|彼は動物の権利について小論文を書いた。|テーマについて書く文章はessay。
3|11|Which would you ( ), a window seat or an aisle seat?|apologize/march/prefer|2|窓側と通路側の席では、どちらがよいですか。|好みを尋ねるprefer。
3|12|A cat suddenly ( ) from behind the tree.|acted/exhibited/appeared|2|猫が突然、木の後ろから現れた。|姿を見せたのでappeared。
3|13|Jane is ( ) with Mark.|avoiding/arguing/forgiving|1|ジェーンはマークと言い争っている。|argue withで「〜と言い争う」。
3|14|Sunscreen ( ) your skin from UV rays.|protects/flashes/serves|0|日焼け止めは紫外線から肌を守る。|protect A from Bで「BからAを守る」。
3|15|Air pollution is a ( ) issue.|busy/following/global|2|大気汚染は世界的な問題だ。|世界に関わる問題なのでglobal。
3|16|My father bought me an ( ) dictionary.|available/electronic/allergic|1|父は私に電子辞書を買ってくれた。|electronic dictionaryで「電子辞書」。
3|17|The stadium was completely ( ).|empty/final/major|0|競技場にはまったく人がいなかった。|空の状態はempty。
3|18|There are ( ) about 400 students at my school.|softly/currently/equally|1|私の学校には現在、約400人の生徒がいる。|現在の状況を表すcurrently。
3|19|You can ( ) me for anything.|make sure/depend on/come true|1|何でも私を頼ってよいですよ。|depend onで「〜に頼る」。
3|20|The plane arrived ( ).|on time/one another/far from|0|飛行機は時間通りに到着した。|on timeで「時間通りに」。
4|1|The rice is ready for ( ).|harvest/greenhouse/belief|0|米は収穫の準備ができている。|農作物の収穫はharvest。
4|2|He has a good ( ) of humor.|sense/favor/tear|0|彼はユーモアのセンスがある。|a sense of humorで「ユーモアのセンス」。
4|3|There was a large ( ) at the rock concert.|prefecture/industry/audience|2|ロックコンサートには大勢の観客がいた。|公演の観客はaudience。
4|4|The ( ) takes several months.|voyage/dormitory/cloth|0|その航海には数か月かかる。|長期間の船旅はvoyage。
4|5|The novel became popular after the author's ( ).|credit/death/meaning|1|その小説は作者の死後、人気になった。|after the author's deathで「作者の死後」。
4|6|I had an interesting ( ) with your sister.|generation/description/conversation|2|あなたのお姉さんと興味深い会話をした。|人とする「会話」はconversation。
4|7|It is 25 ( ) Celsius outside.|coasts/degrees/nations|1|外は摂氏25度です。|温度の「度」はdegrees。
4|8|The ( ) members are in a meeting now.|luck/staff/dinosaur|1|職員は今、会議中だ。|staff membersで「職員たち」。
4|9|I'm saving this dress for a special ( ).|occasion/popularity/community|0|このドレスは特別な機会のために取っておく。|a special occasionで「特別な機会・行事」。
4|10|I ( ) that there were some mistakes in my report.|poured/destroyed/realized|2|レポートに間違いがあることに気づいた。|realize that ...で「〜と気づく」。
4|11|She ( ) her goal.|pressed/achieved/floated|1|彼女は目標を達成した。|achieve a goalで「目標を達成する」。
4|12|My brother ( ) to four colleges.|retired/applied/arrested|1|兄は4つの大学に出願した。|apply toで「〜に申し込む・出願する」。
4|13|The students ( ) Mr. Smith.|respected/met/developed|0|生徒たちはスミス先生を尊敬していた。|「尊敬する」はrespect。
4|14|He always tries not to ( ) his parents.|invent/import/disappoint|2|彼はいつも両親を失望させないようにしている。|「失望させる」はdisappoint。
4|15|I need to ( ) a welcome party for our new teammates.|publish/organize/remind|1|新しい仲間の歓迎会を手配する必要がある。|会や行事を「手配する」はorganize。
4|16|I'm happy that the play was ( ).|female/tiny/successful|2|劇が成功してうれしい。|成功したことを表すsuccessful。
4|17|I usually check the ( ) news online.|latest/double/round|0|普段、最新のニュースをオンラインで確認する。|最新の情報はlatest news。
4|18|Choose a more ( ) topic for your report.|terrible/specific/careless|1|レポートには、もっと具体的なテーマを選んでください。|テーマを絞る意味でspecific。
4|19|What ( ) did he say?|exactly/extremely/gradually|0|彼は正確には何と言ったのですか。|発言内容を正確に尋ねるexactly。
4|20|The summer festival in my town ( ) every July.|makes fun of/takes place/goes through|1|町の夏祭りは毎年7月に開催される。|take placeで「行われる・開催される」。
5|1|I was surprised at the good test ( ).|results/moments/tasks|0|よいテスト結果に驚いた。|test resultsで「テスト結果」。
5|2|My brother will start ( ) next year.|childhood/shelter/kindergarten|2|弟は来年、幼稚園に入る。|通い始める場所はkindergarten。
5|3|The students gave a great ( ) in the school play.|behavior/victory/performance|2|生徒たちは学校の劇で素晴らしい演技をした。|劇での「演技」はperformance。
5|4|The ( ) announced a new policy.|government/biography/attention|0|政府が新しい政策を発表した。|政策を発表する主体はgovernment。
5|5|Mr. Adams is one of our regular ( ).|coworkers/friends/customers|2|アダムズさんは常連のお客さんの一人だ。|regular customerで「常連客」。
5|6|Scientists made a big ( ) last week.|charge/discovery/danger|1|科学者たちは先週、大きな発見をした。|make a discoveryで「発見する」。
5|7|What's the ( ) of your visit?|fossil/emotion/purpose|2|訪問の目的は何ですか。|訪問する「目的」を尋ねるpurpose。
5|8|The plum ( ) are really beautiful at this time of year.|blossoms/boards/tails|0|この時期は梅の花が本当に美しい。|果樹の花をblossomsと言う。
5|9|My mother's greatest ( ) is a gold ring.|pause/treasure/location|1|母の一番の宝物は金の指輪だ。|大切な「宝物」はtreasure。
5|10|I've never seen such a beautiful ( ).|flour/sight/pleasure|1|こんなに美しい光景は見たことがない。|目に映る「光景」はsight。
5|11|The bird ( ) from the cage.|treated/escaped/replaced|1|鳥はかごから逃げた。|escape fromで「〜から逃げる」。
5|12|Don't ( ) paper.|waste/translate/scream|0|紙を無駄にしないでください。|「無駄に使う」はwaste。
5|13|We're ( ) this house from Mr. Jones.|warning/floating/renting|2|私たちはジョーンズさんからこの家を借りている。|rent A from Bで「BからAを有料で借りる」。
5|14|My uncle ( ) his shoulder in the accident.|separated/injured/fulfilled|1|叔父は事故で肩にけがをした。|身体を傷つけるのでinjured。
5|15|I ( ) for her in the election.|voted/calculated/judged|0|選挙で彼女に投票した。|vote forで「〜に投票する」。
5|16|I play ( ) sports in my free time.|bright/various/handsome|1|暇なときにさまざまなスポーツをする。|複数の種類を表すvarious。
5|17|I've been to Okinawa ( ) times.|unusual/several/formal|1|沖縄には何度か行ったことがある。|several timesで「数回」。
5|18|Try to be ( ) when you give a speech.|confident/ill/jealous|0|スピーチをするときは自信を持つようにしよう。|人前で話す態度にはconfident。
5|19|I haven't seen any good movies ( ).|shortly/regularly/lately|2|最近、よい映画を見ていない。|現在完了の文で「最近」を表すlately。
5|20|I ( ) my host family by e-mail.|keep in touch with/believe in/run over|0|メールでホストファミリーと連絡を取り続けている。|keep in touch withで「連絡を取り続ける」。
6|1|I need to make a ( ) about what to study at university.|decision/method/forecast|0|大学で何を学ぶか決める必要がある。|make a decisionで「決定する」。
6|2|The ( ) will be held in two months.|bill/necessity/election|2|選挙は2か月後に行われる。|heldで開催されるものはelection。
6|3|His ( ) of astronomy is amazing.|strength/knowledge/navigation|1|彼の天文学の知識は驚くほどだ。|knowledge ofで「〜についての知識」。
6|4|What was her ( ) to the good news?|effort/spirit/reaction|2|よい知らせに対する彼女の反応はどうだったか。|reaction toで「〜への反応」。
6|5|They finally reached a ( ) after a long discussion.|branch/conclusion/courage|1|長い議論の末、ついに結論に達した。|reach a conclusionで「結論に達する」。
6|6|We did an ( ) in science class today.|invitation/image/experiment|2|今日は理科の授業で実験をした。|do an experimentで「実験する」。
6|7|Australia is the smallest ( ) on the earth.|emergency/continent/license|1|オーストラリアは地球で最も小さい大陸だ。|「大陸」はcontinent。
6|8|An ( ) hit the city late last night, but there isn't any serious damage.|earthquake/excuse/employer|0|昨夜遅く町を地震が襲ったが、深刻な被害はない。|町を襲う災害を表すearthquake。
6|9|He has a lot of artistic ( ).|fear/talent/greeting|1|彼には芸術的な才能が豊富にある。|artistic talentで「芸術的な才能」。
6|10|We've decided to ( ) our trip until next month.|delay/gather/lead|0|来月まで旅行を延期することに決めた。|delay ... untilで「〜まで延期する」。
6|11|It's difficult for me to ( ) my thoughts openly.|select/express/reply|1|自分の考えを率直に表現するのは難しい。|考えを「表現する」はexpress。
6|12|The sun ( ) behind the clouds.|disappeared/communicated/embarrassed|0|太陽は雲の後ろに隠れて見えなくなった。|見えなくなるのでdisappeared。
6|13|She ( ) going to a local restaurant.|recognized/delivered/suggested|2|彼女は地元のレストランに行くことを提案した。|suggest doingで「〜することを提案する」。
6|14|The number of insects is ( ) year by year.|decreasing/discovering/digging|0|昆虫の数は年々減っている。|数の減少はdecreasing。
6|15|The country needs ( ) aid.|medical/past/charming|0|その国は医療援助を必要としている。|medical aidで「医療援助」。
6|16|We sold the house for a ( ) price.|classical/fair/personal|1|私たちはその家を適正な価格で売った。|fair priceで「適正な価格」。
6|17|Peter is very hardworking, but his brother is ( ).|certain/pleasant/lazy|2|ピーターは勤勉だが、弟は怠け者だ。|butの前後で勤勉と対比するlazy。
6|18|They'll hold an ( ) conference in London next month.|international/average/impossible|0|来月ロンドンで国際会議を開く。|international conferenceで「国際会議」。
6|19|I work ( ), but I live in the suburbs.|strongly/afterward/downtown|2|職場は中心街だが、住まいは郊外だ。|suburbsと対比されるdowntown。
6|20|Please call me if you ( ).|major in/lose your way/point out|1|道に迷ったら電話してください。|lose one's wayで「道に迷う」。主語youなのでyour。
7|1|There was a ( ) of water in my town last summer.|fare/shortage/climate|1|昨夏、私の町では水不足があった。|a shortage ofで「〜の不足」。
7|2|We must take ( ) to reduce water pollution.|action/crime/expert|0|水質汚染を減らすために行動しなければならない。|take actionで「行動を起こす」。
7|3|Brian donates money to a ( ) every month.|pole/trouble/charity|2|ブライアンは毎月、慈善団体に寄付している。|寄付先の慈善団体をcharityと言う。
7|4|He didn't get the job because of his ( ) of experience.|lack/honor/thought|0|経験不足のため、彼はその仕事に就けなかった。|lack of experienceで「経験不足」。
7|5|My school has a really good ( ).|port/grocery/atmosphere|2|私の学校はとても雰囲気がよい。|学校の「雰囲気」はatmosphere。
7|6|I need a clearer ( ).|explanation/entertainment/crowd|0|もっと明確な説明が必要だ。|分かりやすさを求める「説明」はexplanation。
7|7|I looked up the ( ) of the word in the dictionary.|movement/value/origin|2|辞書でその語の起源を調べた。|語がどこから来たかはorigin。
7|8|The ( ) of those products is very high.|statue/quality/principal|1|それらの製品の品質はとても高い。|製品を評価する「品質」はquality。
7|9|My room was a ( ) when my mother came in.|privacy/receipt/mess|2|母が入ってきたとき、部屋は散らかっていた。|be a messで「散らかった状態である」。
7|10|I ( ) my lost wallet to the police officer.|described/traded/requested|0|警官に紛失した財布の特徴を説明した。|describeで特徴を説明する。
7|11|The police ( ) for information about the accident.|trapped/repeated/appealed|2|警察は事故に関する情報を求めた。|appeal for informationで「情報提供を求める」。
7|12|The doctor ( ) in heart disease.|specializes/whispers/denies|0|その医師は心臓病を専門としている。|specialize inで「〜を専門とする」。
7|13|The school ( ) a new math teacher.|points/chases/seeks|2|学校は新しい数学の先生を探している。|seekで「探し求める」。
7|14|It was very hard to ( ) the stain from the shirt.|demonstrate/remove/widen|1|シャツの染みを取り除くのはとても難しかった。|remove A from Bで「BからAを取り除く」。
7|15|My parents have been ( ) the company for 30 years.|surrounding/running/stretching|1|両親は30年間、その会社を経営してきた。|run a companyで「会社を経営する」。have been runningは継続を表す。
7|16|These flowers can only be found in a ( ) area.|particular/missing/rapid|0|その花は特定の地域でしか見られない。|特定の地域はa particular area。
7|17|My house is in a ( ) area.|central/heavy/double|0|私の家は中心部にある。|central areaで「中心地域」。
7|18|Why were you so ( ) to your teacher?|rude/wise/painful|0|なぜ先生にそんなに失礼だったのですか。|rude toで「〜に失礼な」。
7|19|Could you explain the rules ( )?|forever/simply/anymore|1|ルールを分かりやすく説明してくれますか。|説明の仕方を表すsimply。
7|20|Let's ( ) for a picnic this weekend.|stand by/take over/get together|2|今週末、集まってピクニックをしよう。|get togetherで「集まる」。
8|1|The ( ) in the forest is a little scary.|law/silence/row|1|森の静けさは少し怖い。|音がない「静けさ」はsilence。
8|2|This college has a lot of different student ( ).|organizations/vehicles/engines|0|この大学にはさまざまな学生団体がある。|student organizationsで「学生団体」。
8|3|She and her mother have similar ( ).|personalities/scenes/rumors|0|彼女と母親は性格が似ている。|人の「性格」はpersonality。二人なので複数形。
8|4|The scientist needs a large ( ) of money for the experiment.|freedom/amount/faith|1|科学者は実験に多額のお金を必要としている。|a large amount of moneyで「多額のお金」。
8|5|The city has many kinds of public ( ).|beauty/position/transportation|2|その市には多くの種類の公共交通機関がある。|public transportationで「公共交通機関」。
8|6|Scientists discovered a new ( ) of frog.|tear/symbol/species|2|科学者たちは新種のカエルを発見した。|a species ofで生物の「種」を表す。
8|7|The hotel is within walking ( ) of the station.|distance/figure/rate|0|ホテルは駅から徒歩圏内にある。|within walking distanceで「歩いて行ける距離に」。
8|8|Vancouver has a lot of beautiful ( ).|pride/scenery/truth|1|バンクーバーには美しい風景がたくさんある。|風景全体を表すscenery。
8|9|They'll ( ) the winners soon.|announce/remain/shape|0|まもなく優勝者たちが発表される。|勝者を「発表する」はannounce。
8|10|Japan ( ) a lot of cars to the US.|confuses/exports/cycles|1|日本は米国に多くの車を輸出している。|export A to Bで「BへAを輸出する」。
8|11|They ( ) the neighborhood for the missing cat.|lied/recorded/searched|2|彼らは迷子の猫を探して近所を捜索した。|search A for Bで「Bを求めてAを捜索する」。
8|12|I'm sure that he'll ( ) as a professional singer.|bend/succeed/shock|1|彼はプロの歌手としてきっと成功する。|succeed asで「〜として成功する」。
8|13|If you know the answer, ( ) your hand.|pack/direct/raise|2|答えが分かったら手を挙げてください。|raise your handで「手を挙げる」。
8|14|That typhoon ( ) the roof.|matched/damaged/laid|1|その台風で屋根が損傷した。|損害を与えたのでdamaged。
8|15|You should do things by yourself to become more ( ).|independent/portable/frightening|0|もっと自立するために、自分で物事を行うべきだ。|自分で行う姿勢を表すindependent。
8|16|Spies need to be really creative and ( ).|medium/intelligent/spare|1|スパイには高い創造力と知性が必要だ。|人の知性を表すintelligent。
8|17|The chemicals in this product can be ( ) to people.|mobile/harmful/general|1|この製品の化学物質は人体に有害な場合がある。|harmful toで「〜に有害な」。
8|18|This old knife is ( ).|violent/minor/useless|2|この古いナイフは役に立たない。|役に立たないことを表すuseless。
8|19|I ( ) forgot to bring my lunch today.|totally/anyway/widely|0|今日、お弁当を持ってくるのをすっかり忘れた。|totally forgotで「すっかり忘れた」。
8|20|Mika is going to ( ) the English speech contest next month.|look up to/rely on/take part in|2|ミカは来月、英語スピーチコンテストに参加する予定だ。|take part inで「〜に参加する」。
`;
  window.EikenVocabularyData.checks = rows.trim().split('\n').map(line => {
    const [unit, number, sentence, choices, correct, translation, explanation] = line.split('|');
    const options=choices.split('/');
    return {unit:Number(unit), number:Number(number), sentence, options, answer:options[Number(correct)], translation, explanation};
  });
})();
