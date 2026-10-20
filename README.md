# Walk 3D — アバターと3Dマップを歩くChrome拡張

Googleマップのような3Dの街並み(立体の建物)を、3Dモデルのアバターと一緒に歩けるChrome拡張です。

- 地図: [MapLibre GL JS](https://maplibre.org/) + [OpenFreeMap](https://openfreemap.org/)(OpenStreetMapのデータ、APIキー不要)
- アバター: [three.js](https://threejs.org/) で描画する glTF モデル(標準はアニメーション付きロボット。手持ちの `.glb` も読み込めます)

## インストール

1. このリポジトリをダウンロード(またはclone)します。
2. Chromeで `chrome://extensions` を開き、右上の「デベロッパーモード」をオンにします。
3. 「パッケージ化されていない拡張機能を読み込む」で **`extension` フォルダ** を選びます。

ビルド済みのファイルが `extension/build/` に入っているので、ビルドしなくてもそのまま使えます。

## 使い方

- ツールバーの拡張アイコンをクリックすると、3Dマップが新しいタブで開きます。
  - Googleマップを表示中のタブでクリックすると、その場所から歩き始めます。
- Googleマップのページ右下にある **「3Dで歩く」** ボタンや、右クリックメニュー「この場所を3Dマップで歩く」からも開けます。
- 前回歩いていた場所と、歩いた距離は保存されます。

### 操作

| キー / 操作 | 動作 |
| --- | --- |
| W / ↑ | 前に歩く |
| S / ↓ | 後ろに下がる |
| A D / ← → | 向きを変える |
| Shift | 走る |
| 地図をクリック | その場所まで自動で歩く |
| ドラッグ | カメラを回す・傾ける |
| ホイール | ズーム |
| Space | ジャンプ |
| 1 / 2 / 3 | 手を振る / いいね / ダンス |
| C | カメラの背後追従のオン・オフ |
| F または / | 場所を検索 |
| H | 操作方法の表示 |
| Esc | 自動歩行をやめる |

右上のパネルでは、アバターの大きさ・速さの変更、自分の3Dモデル(`.glb`)の読み込み、現在地への移動、同じ場所をGoogleマップやストリートビューで開くことができます。

### 自分のアバターを使う

glTFバイナリ(`.glb`)を読み込めます。モデルのアニメーションの名前に `walk` / `run` / `idle` / `jump` / `wave` / `dance` などが含まれていれば、自動でその動きを使います([Mixamo](https://www.mixamo.com/) のアニメーション付きモデルを Blender で `.glb` に書き出したものなど)。

## 開発

```sh
npm install
npm run build   # src/main.js を extension/build/ にビルド
```

- `src/main.js` — 地図・アバター・操作のメイン処理
- `extension/` — 拡張本体(`manifest.json`、`map.html`、`background.js`、Googleマップ用の `content/`)

## クレジット

- 地図データ © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors、タイル: [OpenFreeMap](https://openfreemap.org/)
- 場所検索: [Nominatim](https://nominatim.org/)
- ロボットモデル: "RobotExpressive" by [Tomás Laulhé](https://www.patreon.com/quaternius)(CC0)、three.js examples より
- MapLibre GL JS(BSD-3-Clause)、three.js(MIT)
