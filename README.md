# OD Shuffle Block

OD Shuffle Block の WordPress プラグイン開発リポジトリです。複数のブロック候補を保持し、フロントエンドではそのうち1候補だけをランダムに出力します。

## MVPの仕様

- `OD Shuffle` の直下に任意数の `Shuffle Item` を保持
- 各 `Shuffle Item` には任意のブロックを配置可能
- 編集画面では1候補だけを表示し、ブロックツールバーから切り替え
- リストビューで候補を選ぶと、編集画面の表示候補も同期
- フロントエンドでは均等確率で選んだ1候補のHTMLだけを出力

ランダム選択はサーバーでページをレンダリングするときに行われます。ページキャッシュやCDNが有効な環境では、キャッシュが更新されるまで同じ候補が表示される場合があります。

## 必要な環境

- Docker
- Node.js / npm
- PHP 7.4 以上
- Composer 2

## セットアップ

```bash
npm install
composer install
npm run build
npm run env:start
```

WordPress は `http://localhost:8888`、初期ログイン情報は `admin` / `password` です。

## 開発用コマンド

```bash
npm run env:status
npm run env:logs
npm run env:cli -- plugin list
npm run env:stop
npm run build
npm run lint:js
npm run lint:css
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
