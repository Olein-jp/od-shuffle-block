# OD Shuffle Block

OD Shuffle Block の WordPress プラグイン開発リポジトリです。

## 必要な環境

- Docker
- Node.js / npm
- PHP 7.4 以上
- Composer 2

## セットアップ

```bash
npm install
composer install
npm run env:start
```

WordPress は `http://localhost:8888`、初期ログイン情報は `admin` / `password` です。

## 開発用コマンド

```bash
npm run env:status
npm run env:logs
npm run env:cli -- plugin list
npm run env:stop
composer lint
composer format
```

## リリース

プラグインヘッダーの `Version` と `package.json` の `version` を更新し、同じバージョンのタグを `v0.2.0` の形式で push します。

```bash
git tag v0.2.0
git push origin v0.2.0
```

GitHub Actions が本番用 Composer 依存関係を含む `od-shuffle-block.zip` を生成し、GitHub Release に添付します。プラグインは最新の GitHub Release を確認し、WordPress 管理画面の更新機能からこの ZIP をインストールします。
