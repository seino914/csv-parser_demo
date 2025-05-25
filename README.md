# 概要

Next.js で`csv-parser`ライブラリを使用した CSV ファイル解析のデモアプリケーションです。

以下記事のサンプルアプリケーションとして作成しております。

[Zenn の記事](https://zenn.dev/iroiro/)

## 機能

- CSV ファイルのアップロード
- CSV データのテーブル表示
- ヘッダー行の自動認識
- 空白の自動トリミング

## 技術スタック

- Next.js (App Router)
- TypeScript
- csv-parser
- Tailwind CSS

## 使い方

### 開発環境のセットアップ

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

### アクセス

開発サーバー起動後、以下の URL にアクセスしてください：
http://localhost:3000

## 制限事項

- アップロード可能なファイルサイズ: 5MB 以下
- 対応ファイル形式: CSV 形式のみ
