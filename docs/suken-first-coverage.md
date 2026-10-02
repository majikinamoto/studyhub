# 数検2級1次：範囲と記述教材の対応

更新・公式確認：2026-10-02。
公式：https://www.su-gaku.net/suken/examination/summary/2q/

公式の検定内容は1次・2次を合わせた概要であり、各内容が毎回1次に出るという保証ではない。
本教材ではその計算の前提・代表的な計算技能を1次の学習順に配置する。
全ての難易度・出題の変形を網羅するという意味ではない。
公式過去問題は教材を一巡した後の確認先とする。

## 実装と内訳

入口：`pages/suken-first-bridge.html`。分野は `?topic=probability` 等で指定。
11分野、86項目、説明263画面、練習430問、分野別確認33問。

- 既存のオリジナル基礎教材50項目・250問を、選択肢なしで答えを照合できる形式にも配置。
- 前回の展開・因数分解の試作4項目・20問を配置。旧ページも維持。
- 今回の新作32項目・160問を追加。
- 確認33問は基礎教材の一部を再利用したもので、別の新作33問ではない。

各項目は説明3画面（試作に4画面の項目あり）、途中の一手2問、記述3問。
解答と途中式を紙に書き、ヒント・解答・確認点を見て自己記録する。
理解度・学習時間は未定、スマホが主な端末という条件に合わせ、時間制限は設けない。
進捗と最後に開いた説明・問題は、分野ごとにこの端末へ保存する。
「前回の続き」は記録したURLから再開する。端末間同期・自動採点は実装しない。

## 公式に列挙された内容との対応

| 範囲 | 対応する分野・項目 |
| --- | --- |
| 数と集合・数と式 | roots全項目、algebra全項目、numbersの有理数・二重根号・集合・絶対値 |
| 整数の性質・n進法 | numbers / integers：最大公約数、商と余り、2進法 |
| 式と証明 | algebra / identity, inequality-identity、numbers / logic：係数比較、差の非負、必要十分条件・対偶 |
| 分数式 | numbers / fractions-expression：条件、約分、通分、除法 |
| 複素数・方程式の解 | equations全項目：四則、2次式、判別式、解と係数 |
| 高次方程式 | equations / higher、base-remainder：共通因数、置換、因数定理 |
| 二次関数・グラフ・二次不等式 | geometry / base-quadratic, translation-range, base-quadratic-sign |
| 点と直線 | geometry / base-coordinates, base-line, division, distance |
| 円の方程式 | geometry / base-circle, circle-line |
| 軌跡と領域 | geometry / regions：条件を座標の等式・不等式へ、円と半平面の共通部分。円の軌跡はbase-circleの距離条件も使用 |
| 図形の性質 | geometry / circle-line, similarity：円周角、内接四角形、相似比、面積比・体積比、円錐 |
| 三角比・三角関数 | trigonometry全項目：辺の比、角・弧度法、面積・余弦・正弦定理、加法・2倍角、周期・方程式・合成 |
| 指数関数・対数関数 | powers全項目：指数法則、底の変換、真数条件、方程式・不等式、グラフ、桁数 |
| 高次関数・微分係数と導関数 | calculus / base-derivative, base-tangent：変化率、導関数、接線、増減 |
| 不定積分と定積分 | calculus / base-integral, base-area, integral-constant, area-curve |
| データの分析 | probability / base-variance, data：分散・標準偏差、四分位数、共分散・相関 |
| 場合の数・確率 | probability / base-count, base-chance, base-trials, special-count |
| 確率分布と統計的な推測 | probability / base-expectation, binomial, distribution, normal, inference, test |
| 数列・和（提供資料を含めて補う） | sequences全項目：等差・等比、Σ、和から一般項、漸化式、階差、部分分数 |
| ベクトル（提供資料を含めて補う） | vectors全項目：成分、大きさ、内積、内分・重心、空間・なす角 |

統計の推測は母標準偏差が既知の正規母集団の計算に条件を限定し、
区間推定と仮説検定を混同しない説明を付ける。連続型の確率では密度の積分が1であることを扱う。
提供された問題集の全75設問を直接収録した対応表ではない。
関連ページは確認できるものだけ設定し、新作には推測した設問番号を付けない。

## 原稿・生成・検証

- 新作原稿：`scripts/suken-first-bridge-extras.mjs`
- 統合生成：`scripts/build-suken-first-bridge.mjs` → `data/suken-first-bridge.json`
- `build-suken-content.mjs` の基礎教材保存後にも統合生成を実行する。
- 全分野は共通の `assets/js/suken-bridge.js` を使い、旧試作の保存キーは維持。
- 公開に必要な単位円の図は `assets/images/suken/unit-circle.svg`。元写真は参照せず、ローカル専用を維持。

```powershell
node scripts/build-suken-content.mjs
node scripts/build-suken-pages.mjs
node scripts/test-suken-first-bridge-math.mjs
node scripts/test-suken-first-bridge.mjs
node scripts/test-suken-algebra-bridge.mjs
node scripts/test-suken-math.mjs
node scripts/test-suken-learning.mjs
```

数式の検証は数値・記号の照合に加え、確率の列挙、根の代入、区間の符号、数列の直接和などを使用。
概念の説明や一般的な証明は原稿で別途点検する。
確認用スクリーンショットは一時フォルダーへ保存する。

2026-10-02検証済み：上記の全テストと `git diff --check` を通過。
新作132件の数値・記号回答を照合し、確率と和の恒等式を独立計算で確認。
既存107件の計算検証、試作の多項式の格子照合も通過。
全263説明画面・430練習問・33確認問をEdgeで操作し、解答の初期非表示、
ヒントの記録、保存・再開、図の読込、無効なURL、通信・保存失敗を確認。
新作全画面と解答は320px幅、全教材は390px幅でも横はみ出しなし。
記述教材の入口・信頼区間の説明・デスクトップを画像で確認。
元写真はGit除外対象、公開用単位円SVGは除外されないことを確認。
コミット・GitHubへの公開は今回行っていない。

完成を急ぐ方針に合わせ、細部の学習体験の調整は初版公開後の改善へ回す。
2級の入口から全分野の記述教材へ直接進め、1次の案内ページにも
「学習を始める・続ける」の入口と総項目・問題数を表示。
教材本体・導線・検証を初版の完成範囲とし、残る配信作業はGitHubへの反映。
