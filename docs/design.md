# StudyHub Phase 1 設計メモ

## 目的

長期的に拡張できるWeb学習システムの土台を作る。
Phase 1では高専1年 化学 第9章から第11章のみを対象にする。

## 方針

- 画面、スタイル、データ取得、データ本体を分離する。
- JSONのキー名は将来のMariaDBテーブルを意識して、`gradeId`、`subjectId`、`chapterId`、`unitId` などを使う。
- CSSは共通ファイルにまとめ、色や角丸はCSS変数で管理する。
- JavaScriptは画面遷移とダミーデータ表示に限定する。

## 将来の主なテーブル候補

- grades
- subjects
- chapters
- units
- questions
- choices
- progress

## Phase 1で実装しないもの

- ログイン
- AI
- 模試
- ランキング
- 成績管理
- 問題管理画面
- 管理者画面
- MariaDB
- PHP
- API
