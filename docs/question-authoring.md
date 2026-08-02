# StudyHub 問題追加マニュアル

## 目的

このファイルは、`studyhub/data/questions.json` に問題を大量追加するためのルールです。
Sprint 1.1では、500問程度まで増えても扱いやすいように、章・単元・並び順をJSONで管理します。

## 編集するファイル

問題を追加するときは、基本的に次の1ファイルを編集します。

```text
studyhub/data/questions.json
```

章カードの説明や章名を変える場合だけ、次のファイルも編集します。

```text
studyhub/data/catalog.json
```

## questions.json の全体構造

```json
{
  "version": 2,
  "meta": {},
  "units": [],
  "questions": []
}
```

- `version`: JSON形式のバージョンです。今は `2` のままにします。
- `meta`: 管理用メモです。画面表示には基本的に使いません。
- `units`: 単元一覧です。
- `questions`: 問題一覧です。問題を増やすときはここへ追加します。

## 単元の追加方法

新しい単元を追加するときは、`units` に1件追加します。

```json
{
  "id": "unit-new-topic",
  "chapterId": "chapter-09",
  "order": 3,
  "title": "新しい単元名"
}
```

### unit項目の意味

- `id`: 単元IDです。英数字とハイフンで作ります。重複禁止です。
- `chapterId`: どの章に属するかを指定します。
- `order`: 章の中での単元順です。
- `title`: 管理用の単元名です。

### 章ID

現在使える章IDは次の3つです。

```text
chapter-09
chapter-10
chapter-11
```

## 問題の追加方法

`questions` 配列の最後に、次の形で1問追加します。

```json
{
  "id": "q-chem-09-004",
  "chapterId": "chapter-09",
  "unitId": "unit-basic-particles",
  "order": 4,
  "text": "ここに問題文を書きます。",
  "correctChoiceId": "c-09-004-2",
  "explanation": "ここに解説を書きます。",
  "choices": [
    { "id": "c-09-004-1", "text": "選択肢1" },
    { "id": "c-09-004-2", "text": "選択肢2" },
    { "id": "c-09-004-3", "text": "選択肢3" },
    { "id": "c-09-004-4", "text": "選択肢4" }
  ]
}
```

## 問題項目の意味

- `id`: 問題IDです。重複禁止です。
- `chapterId`: 章IDです。第9章なら `chapter-09` です。
- `unitId`: 単元IDです。`units` にあるIDを使います。
- `order`: 単元内の並び順です。通常出題OFFのとき、この順番で出ます。
- `text`: 問題文です。
- `correctChoiceId`: 正解の選択肢IDです。
- `explanation`: 回答後に表示する解説です。
- `choices`: 選択肢です。Sprint 1.1では4択を基本にします。

## 並び順のルール

通常出題では、次の順番で自動的に並びます。

```text
chapterId -> unitId -> order -> id
```

画面に出る「問題 1」「問題 2」は、JSONの `order` ではなく、表示順から自動計算されます。
そのため、ランダム出題ONでも問題番号は自然に表示されます。

## ランダム出題

問題画面の「ランダム出題」をONにすると、その章の問題だけをシャッフルして出題します。
OFFに戻すと、JSONの管理順に戻ります。

## 500問投入時の注意

- 1問ごとの `id` は必ず重複しないようにします。
- `correctChoiceId` は必ず `choices` の中にあるIDを指定します。
- `chapterId` は `chapter-09`、`chapter-10`、`chapter-11` のように章単位で統一します。
- `unitId` は `units` に先に登録してから使います。
- `order` は同じ単元内で 1, 2, 3... のように並べると管理しやすいです。
- JSONの最後の要素には余計なカンマを付けません。

## ChatGPTへ大量作成を依頼するときの指示例

```text
StudyHub用に高専1年 化学 第9章の4択問題を30問作ってください。
以下のJSON形式に合わせて、questions配列へ追加できる形だけで出してください。
chapterId は chapter-09、unitId は unit-basic-particles、id は q-chem-09-004 から連番にしてください。
correctChoiceId は必ず choices 内のidと一致させてください。
```

## 追加後チェック

追加後は次を確認します。

- JSONとして壊れていないか
- 問題IDが重複していないか
- 選択肢が4つあるか
- 正解IDが選択肢内に存在するか
- chapterIdとunitIdが正しいか
- 問題画面で該当章を開けるか
