# このリポジトリでの作業ルール

- ユーザーとは日本語で話す
- 拡張の動作を変えたら、`extension/manifest.json` の `version` を上げ、`CHANGELOG.md` の先頭にそのバージョン・日付・やったことを追記してから、同じコミットに含める
- `npm run build` の成果物 `extension/build/` もコミットする(ユーザーはビルドせずに ZIP から読み込む)
- 引き継ぎに必要なこと(未確認の点・テストのやり方など)は `HANDOFF.md` に書く
