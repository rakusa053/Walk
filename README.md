# Walk 3D — アバターと3Dマップを歩くChrome拡張

Googleマップのような3Dの街並み(立体の建物)を、3Dモデルのアバターと一緒に歩けるChrome拡張です。

- 地図: [MapLibre GL JS](https://maplibre.org/) + [OpenFreeMap](https://openfreemap.org/)(OpenStreetMapのデータ、APIキー不要)
- アバター: [three.js](https://threejs.org/) + [three-vrm](https://github.com/pixiv/three-vrm)。標準は女の子(VRM)とロボットから選べ、手持ちの `.vrm` / `.glb` も読み込めます

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

### ストリートビューで一緒に歩く

Googleマップでストリートビューを開くと、画面の下に**アバターが後ろ姿で表示**されます。

- ↑キーや地面の矢印クリックで進むと、アバターも一緒に歩きます(↓キーで後ろ歩き)
- 視点を回すと、アバターも少し遅れて向きを変えます
- 1 / 2 / 3 キーで 手を振る / よろこぶ / ダンス
- アバターはストリートビューと同じカメラで、3.5m 先に立っているように描かれます
- 画面上の「👧 アバター ON/OFF」ボタンで表示を切り替えられます
- キャラクターは3Dマップのパネルで選んだもの(女の子/ロボット)が使われます

#### 建物や人の後ろに隠れる・坂や階段で地面に立つ

視点が止まると画面をキャプチャし、AI(Depth Anything V2)で写真の奥行きを推定します。それを使って、

- アバターより手前にある建物・柱・人などの後ろにアバターが隠れます
- 坂道や階段では、アバターが立っている場所の地面の高さに合わせて上下します

「アバター ON」ボタンの丸で状態が分かります(黄色=推定中、緑=OK、灰色=失敗。失敗してもアバターは手前に表示されます)。

- 初回だけAIモデル(約25〜50MB)を Hugging Face からダウンロードします。2回目以降はブラウザに保存されたものを使います
- 推定はパソコン上で行われ、画像がどこかに送られることはありません
- 画面のキャプチャのため、拡張機能のインストール時に「すべてのサイトのデータの読み取り」の許可が表示されます(キャプチャするのはストリートビューを表示中のタブだけです)
- キャプチャの瞬間、アバターが一瞬消えます
- 奥行きは「カメラの足元は平らな地面」という前提で距離に換算しています。目の前がすぐ階段のような場所では、高さがずれることがあります

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
| 1 / 2 / 3 | 手を振る / よろこぶ / ダンス |
| C | カメラの背後追従のオン・オフ |
| F または / | 場所を検索 |
| H | 操作方法の表示 |
| Esc | 自動歩行をやめる |

右上のパネルでは、アバターの大きさ・速さの変更、自分の3Dモデル(`.glb`)の読み込み、現在地への移動、同じ場所をGoogleマップやストリートビューで開くことができます。

### 自分のアバターを使う

**VRM(`.vrm`)がおすすめです。** 無料の [VRoid Studio](https://vroid.com/studio) で髪型・顔・服を自由に作ったキャラクターや、[VRoid Hub](https://hub.vroid.com/) で「アバター利用OK」になっているモデルを、パネルの「自分のモデルを読み込む」から選ぶだけで使えます。VRMモデルは歩く・走る・手を振るなどの動きを自動で付け、まばたきや笑顔、髪やスカートの揺れも再現します。

glTFバイナリ(`.glb`)も読み込めます。モデルのアニメーションの名前に `walk` / `run` / `idle` / `jump` / `wave` / `dance` などが含まれていれば、自動でその動きを使います([Mixamo](https://www.mixamo.com/) のアニメーション付きモデルを Blender で `.glb` に書き出したものなど)。

## 開発

```sh
npm install --ignore-scripts   # onnxruntime-node のバイナリ取得を省く
npm run build   # src/main.js を extension/build/ にビルド
```

- `src/main.js` — 地図・アバター・操作のメイン処理
- `src/streetview.js` — ストリートビューの上に重ねるアバター(奥行きによる隠れ・地面の高さ合わせ)
- `src/offscreen.js` — 画面キャプチャからの奥行き推定(transformers.js)
- `src/avatar-model.js` — モデルの読み込みと大きさ・向きの正規化
- `src/vrm-animator.js` — VRMモデルの歩行・エモート・表情の手続き的アニメーション
- `extension/` — 拡張本体(`manifest.json`、`map.html`、`background.js`、Googleマップ用の `content/`)

## クレジット

- 地図データ © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors、タイル: [OpenFreeMap](https://openfreemap.org/)
- 場所検索: [Nominatim](https://nominatim.org/)
- 奥行き推定: [Depth Anything V2 Small](https://huggingface.co/depth-anything/Depth-Anything-V2-Small)(Apache-2.0)、[transformers.js](https://github.com/huggingface/transformers.js)、ONNX Runtime Web(MIT)
- 女の子モデル: "VRM1_Constraint_Twist_Sample" © 2022 pixiv Inc.([VRM Public License 1.0](https://vrm.dev/licenses/1.0/)、再配布可)、three-vrm examples より
- ロボットモデル: "RobotExpressive" by [Tomás Laulhé](https://www.patreon.com/quaternius)(CC0)、three.js examples より
- MapLibre GL JS(BSD-3-Clause)、three.js(MIT)、three-vrm(MIT)
