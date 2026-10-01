# 公民問題の対応と確認

ユーザー提供の公民編p.98〜128（16枚）にある全206設問を、複数解答欄の分割によって243問の4択問題にした。全問にヒント・解説を付け、写真の図を参照しなくても解ける文章に再構成した。資料編の追加問題は別途作成する。

| 単元 | ページ | 元設問数 | 元画像 |
|---|---|---:|---|
| 現代社会と私たちの生活 | 98–99 | 12 | 1000009160.jpg |
| 人権思想の発達と日本国憲法 | 100–101 | 14 | 1000009161.jpg |
| 日本国憲法とさまざまな人権 | 102–103 | 15 | 1000009162.jpg |
| 現代の民主政治 | 104–105 | 16 | 1000009163.jpg |
| 国会と内閣 | 106–107 | 15 | 1000009164.jpg |
| 裁判所、三権分立 | 108–109 | 12 | 1000009165.jpg |
| 地方の政治と自治 | 110–111 | 14 | 1000009166.jpg |
| 私たちの生活と経済 | 112–113 | 17 | 1000009167.jpg |
| 生産と労働 | 114–115 | 13 | 1000009168.jpg |
| 価格のはたらきと金融 | 116–117 | 13 | 1000009169.jpg |
| 財政 | 118–119 | 10 | 1000009170.jpg |
| 国民生活と福祉、環境 | 120–121 | 12 | 1000009171.jpg |
| 国際社会の中の日本 | 122–123 | 11 | 1000009172.jpg |
| 国際連合と国際協力 | 124–125 | 12 | 1000009173.jpg |
| 国際問題と私たち | 126–128 | 20 | 1000009174.jpg、1000009175.jpg |

## 作成・検証

`data/authoring/entrance-civics/*.txt` の各行は、元設問番号、問題、正解、誤答3個（セミコロン区切り）、ヒント、解説の順で、縦線区切り。元の複数空欄にはa・b・cを付ける。順不同の回答は、それぞれの概念を問う文章に分ける。同じ語が繰り返される空欄は一問で対応する。

`node scripts/build-entrance-civics.mjs` で生成し、`--check` で生成結果の一致、単元数、元設問数、全小問の対応、選択肢の重複、IDの重複を検証する。

`scripts/test-entrance-civics.mjs` は既存問題とのID重複、公民全243問の画面採点、ヒントのリセット、未回答時の動作、ランダム切替、範囲選択、学習記録の保存、320px表示と既存4問題集への到達を検証する。Playwrightが別の場所にある場合は`PLAYWRIGHT_MODULE`を設定する。`STUDYHUB_BASE_URL`を設定すれば本番を検証できる。

## 写真から補正・明確化した点

- 非核三原則の表明は1967年。1971年の関連する国会決議と区別した。
- 労働関係調整法の問題は、写真で労働組合法と重なる説明を、争議の予防・解決に関するものへ修正した。
- 逮捕の令状、クーリング・オフ、介護保険の条件、拒否権の適用範囲を明確にした。
- インフレを好景気に限定せず、物価全体の持続的上昇として出題した。
- 放射能を放射線を出す性質として出題し、放射線・放射性物質と区別した。
- ASEANの旧10か国という説明は使用せず、設立と地域を出題。解説は東ティモール加盟後の11か国に更新した。
- 排他的経済水域の主権的権利と領海の主権を区別した。
- 国際司法裁判所と国際刑事裁判所、NPOとNGOの概念を区別した。
- 旧統計の割合を現在の数値として出題せず、資料が示す概念や制度を問う文章にした。

確認日：2026-10-01。主な一次資料：

- [衆議院・日本国憲法](https://www.shugiin.go.jp/Internet/itdb_annai.nsf/html/statics/shiryo/dl-constitution.htm)
- [外務省・非核三原則](https://www.mofa.go.jp/mofaj/gaiko/kaku/gensoku/)
- [厚生労働省・労働関係調整法](https://www.mhlw.go.jp/web/t_doc?dataId=73012000&dataType=0)
- [厚生労働省・介護保険第2号被保険者](https://www.mhlw.go.jp/stf/newpage_10548.html)
- [裁判所・裁判員の選任資格改正](https://www.courts.go.jp/saibanin/topics/detail/age_down.html)
- [消費者庁・クーリング・オフの適用対象](https://www.no-trouble.caa.go.jp/pdf/20240208ac01.pdf)
- [消費者庁・消費者契約法](https://www.caa.go.jp/policies/policy/consumer_system/consumer_contract_act/)
- [日本銀行・業務](https://www.boj.or.jp/about/education/oshiete/outline/a02.htm)
- [公正取引委員会・独占禁止法の規制](https://www.jftc.go.jp/dk/dkgaiyo/kisei.html)
- [財務省・東ティモールのASEAN加盟](https://www.customs.go.jp/toukei/sankou/sonotai/oj20251217.html)
- [外務省・NPT概要](https://www.mofa.go.jp/mofaj/gaiko/kaku/npt/gaiyo.html)
- [環境省・京都議定書とパリ協定](https://ondankataisaku.env.go.jp/carbon_neutral/topics/feature-01.html)

## 資料問題の分類

各分野の単元に`learningSection: "materials"`を付けると資料問題の入口に表示される。既存単元と公民本文は`recall`。分野目次の範囲選択では両方をまとめて選択できる。IDを変えない限り、既存の学習記録は維持される。
