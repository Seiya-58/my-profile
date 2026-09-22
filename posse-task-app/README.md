# POSSE タスク管理アプリ

書籍紹介ページとは別の React プロジェクトです。

## 作成時のコマンド

```sh
pnpm create vite posse-task-app --template react --no-interactive
cd posse-task-app
pnpm add -D tailwindcss @tailwindcss/vite
```

## 起動

このフォルダーで実行し、表示される URL を開いてください。

```sh
pnpm install
pnpm dev
```

## 実装

- useState でタスク・入力文字・フィルターを管理。
- useEffect で localStorage に保存し、再読み込み時に復元。
- ボタンまたは Enter で追加。空文字・空白だけの入力は追加しない。
- タスクの文字をクリックして完了を切り替え。完了済みは灰色と打ち消し線で表示。
- setTasks とスプレッド構文・map・filter で更新し、元の配列を直接変更しない。
- 「すべて」「未完了」「完了済み」で表示のみを絞り込み。
- Tailwind は Vite プラグインを使用し、CDN は使用しない。

## 確認手順

1. 入力して追加ボタンを押し、一覧に表示されることを確認。
2. 別のタスクを Enter で追加。
3. 空文字・空白だけでは追加されないことを確認。
4. タスクをクリックし、打ち消し線が付くこと、再クリックすると戻ることを確認。
5. 各フィルターで絞り込み、「すべて」で全件に戻ることを確認。
6. 削除ボタンで対象だけが消えることを確認。
7. 再読み込みしてタスクと完了状態が保存されていることを確認。

## コードのチェック

```sh
pnpm build
pnpm lint
```
