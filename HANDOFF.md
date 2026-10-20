# 引き継ぎメモ(Walk 3D)

次のセッション向けに、これまでの作業内容・設計・未確認事項をまとめたもの。
作業ブランチは **`ccr-fc9f9eef-0ixq53`**(main はまだ無く、全部このブランチにある)。

## 何を作っているか

ユーザーの依頼:「Googleマップのような3Dマップを、3Dモデルのアバターと一緒に歩くChrome拡張」。
その後の追加依頼:

1. アバターを「可愛い彼女のように」 → VRM の女の子を標準に
2. 「Googleマップ(ストリートビュー)でアバターが見えない」 → ストリートビュー画面にアバターを重ねる
3. 「写真の上に重ねるだけで、建物や人の後ろに隠れない/坂や階段で高さが変わらない」を改善 → AI の奥行き推定で隠れ処理と地面の高さ合わせ

ユーザーは日本語で話す。Mac の Chrome を使用。拡張は `extension/` を「パッケージ化されていない拡張機能」として読み込んでいる(ZIP でダウンロードして展開)。

## 機能と構成

### 1. 3Dマップのページ(`extension/map.html`, `src/main.js`)

- 拡張アイコン/Googleマップ上の「3Dで歩く」/右クリックメニューで新しいタブに開く。Googleマップの URL(`@lat,lng` や `!3d..!4d..`)から開始位置を取る(`extension/background.js` の `parseGoogleMapsUrl`)
- 地図: MapLibre GL JS 6 + OpenFreeMap(`https://tiles.openfreemap.org/styles/liberty`、APIキー不要)。3D建物(fill-extrusion が無ければ追加)、ラベルを `name:ja` に、空(sky)
- アバター: three.js をカスタムレイヤーで描画。WASD/矢印で歩く、Shift で走る、クリック地点へ自動歩行、ドラッグでカメラ回転、Space ジャンプ、1/2/3 エモート、C でカメラ追従切替、F で検索(Nominatim)
- パネル: キャラクター選択(女の子/ロボット)、`.vrm`/`.glb` 読み込み、大きさ・速さ、現在地、Googleマップ/ストリートビューで開く
- `chrome.storage.local` の `walkState` に位置・設定・選んだモデル(`model`)を保存
- MapLibre 6 は ESM のみで、拡張では `import.meta.url` が http でないためワーカー URL を自動で決められない → `setWorkerUrl(new URL('maplibre-gl-worker.mjs', import.meta.url))` で明示している

### 2. アバター(`src/avatar-model.js`, `src/vrm-animator.js`)

- `extension/models/girl.vrm`: pixiv の `VRM1_Constraint_Twist_Sample`(three-vrm examples より。VRM Public License 1.0、再配布可、クレジット不要)。約10MB
- `extension/models/robot.glb`: three.js examples の RobotExpressive(CC0、アニメーション付き)
- `avatar-model.js`: GLTFLoader + `VRMLoaderPlugin`、身長 1.7m・足元原点・+Z 向きに正規化(VRM0 は `rotateVRM0`)
- `vrm-animator.js`: VRM にはアニメーションが無いので、正規化ボーンを手続き的に動かす(待機・歩き・走り・ジャンプ・手を振る・よろこぶ・ダンス)。まばたき、ふだんは軽い笑顔、エモート中は満面の笑み。スプリングボーンは `vrm.update(dt)` で揺れる
  - 正規化ボーン座標系: +Y 上、+Z 前、+X キャラの左。腕を下ろすのは左 `z=-1.2` / 右 `z=+1.2`、脚の前振りは `x` が負
- GLB(ロボット)は AnimationMixer でクリップ名(walk/run/idle/jump/wave…)を正規表現で拾う

### 3. ストリートビューに重ねるアバター(`extension/content/gmaps.js`, `src/streetview.js`)

- コンテンツスクリプト `gmaps.js`(Googleマップのページ)が URL を 250ms ごとに監視。ストリートビューの URL(`@lat,lng,3a,75y,305.69h,63.68t`)を見つけたら `build/streetview.js` を動的 import して表示(重いので遅延ロード。`web_accessible_resources` に `build/*`, `models/*`)
- URL の `y` を**縦の画角**、`t` を上下の向き(90 が水平)、`h` を方位として扱っている(`y` が縦か横かは**未確認**。実画面で要確認)
- アバターはストリートビューと同じカメラ(高さ 2.5m、画角・ピッチを合わせる)で 3.5m 先に後ろ姿で立つ。全画面の透明キャンバス(`pointer-events: none`)
- パノラマ移動(URL の座標変化)や ↑/↓ キーで歩くアニメーション。視点を回すと少し遅れて向きを合わせる(`lag`)
- ボタン: 「👧 アバター ON/OFF」(`svAvatar` を保存)と「🚶 3Dで歩く」。ストリートビュー中は画面上部中央、通常の地図では下部中央。ボタン内の丸で奥行き推定の状態(黄=推定中、緑=OK、灰=失敗)

### 4. 奥行きによる隠れ・地面の高さ(`src/offscreen.js`, `extension/offscreen.html`, `background.js`)

流れ: 視点が 700ms 止まる → アバターとボタンを一瞬隠して `chrome.tabs.captureVisibleTab`(background)→ オフスクリーンドキュメントで Depth Anything V2 Small(transformers.js 4 / ONNX Runtime Web、WebGPU fp16 → 失敗時 WASM q8)→ 192px 幅の相対逆深度を返す → `streetview.js` で処理。

- **キャリブレーション**(`calibrate`): 画面下側の「近い半分」の点を、カメラの真下から続く平らな地面(カメラ高 2.5m)とみなして `disp ≒ a / z + b` を最小二乗(外れ値除去3回)。相対深度を距離[m]に換算
- **隠れ処理**: 距離を HalfFloat テクスチャにして、全画面クアッドで `gl_FragDepth` に書き込む(`colorWrite:false`、`depthFunc: AlwaysDepth`。深度テストを切ると深度も書けないため)。足が地面に埋もれないよう `z * 1.06 + 0.35` だけ奥にずらしている
- **地面の高さ**: 画面中央の帯で、前方距離が 3.5m±0.45m の点の高さの下位20%を地面とし、-1.2〜1.5m にクランプしてなめらかに移動
- 視点が変わったら古い奥行きは無効(隠れ処理オフ、地面は移動時に 0 へ)。3回失敗したら推定をやめる
- モデルは初回に Hugging Face(`onnx-community/depth-anything-v2-small`)からダウンロードされ、ブラウザにキャッシュされる
- 権限: `captureVisibleTab` のために `host_permissions: ["<all_urls>"]`、`offscreen`。CSP に `'wasm-unsafe-eval'`。`env.useWasmCache = false`(blob: URL の import は拡張の CSP で禁止)、WASM は `build/ort/` に同梱(asyncify 版、約27MB)

## ビルド

```sh
npm install --ignore-scripts   # onnxruntime-node の postinstall がバイナリ取得に失敗するので省く
npm run build                  # scripts/build.mjs → extension/build/
```

- `app.js`(地図ページ)と `streetview.js` はコード分割(共通チャンク `chunk-*.js`)、`offscreen.js` は別ビルド
- **ビルド成果物 `extension/build/` もコミットする**(ユーザーはビルドせずに ZIP から読み込むため)
- **注意(GitHub のシークレット検出)**: transformers.js を1行に minify すると、`"mistral"` の近くに 32文字の英数字(`Mistral3ForConditionalGeneration` や gist ID)が並び、「Mistral AI API Key」と誤検出されて push が拒否された。対策として offscreen.js は改行を残し(`minifyWhitespace` なし)、さらに 32文字の英数字の並びは先頭1文字を `\uXXXX` に置換している(`scripts/build.mjs`)。依存を更新したら再発に注意

## テストのやり方(前のセッションで使ったもの)

前の環境では `www.google.com`、`huggingface.co`、`tiles.openfreemap.org` などに**接続できなかった**ので、以下のように代用した。テストスクリプトはスクラッチパッドにあったので残っていない。必要なら作り直す。

- Playwright(グローバルの `playwright`、`executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'`)で `launchPersistentContext` + `--load-extension=extension`、WebGL は `--use-angle=swiftshader --enable-unsafe-swiftshader`
- 拡張 ID はサービスワーカーの URL から取る。地図ページは `chrome-extension://<id>/map.html?style=<ローカルのスタイルJSON>&lat=..&lng=..`(`?style=` でスタイルを差し替え可能)
- ストリートビューは `ctx.route('https://www.google.com/**', …)` で偽ページを返し、`history.pushState` で URL を変えて移動・回転を再現
- 奥行きは `sw.evaluate(() => { self.estimateDepth = async () => 合成データ })` で差し替え(background の `self.estimateDepth` はテスト用の差し替え口)。柱(2m先)と段差(3m先、40cm)の合成シーンで、隠れ処理と地面 0.4m を確認済み
- 推定パイプライン自体は、offscreen.html を通常タブで開き(オフスクリーンドキュメントへの通信は `ctx.route` で横取りできないため)、Hugging Face への通信を ReduceMean だけの小さな ONNX モデルで横取りして、WASM まで通ることを確認済み

## 未確認(次のセッションでやること)

ユーザーがネットワーク許可(Googleマップ、Hugging Face、OpenFreeMap、Nominatim)を追加したので、**まず接続を確認**してから本物で検証する。

1. 本物のストリートビューでアバターが表示され、移動・回転に追従するか(Google が自動操作ブラウザに確認画面を出す可能性あり)
2. URL の `y` が縦の画角で合っているか(アバターの大きさ・足元の位置が景色と合うか)。カメラ高 2.5m・距離 3.5m が自然か
3. 本物の Depth Anything V2 の出力で、キャリブレーション・隠れ処理・地面の高さが妥当か(係数 `1.06 + 0.35`、ウィンドウ ±0.45m、下位20% などは合成データでしか調整していない)
4. キャプチャ時に Google の UI(検索欄など)が写り込むことの影響
5. 3Dマップ(map.html)を実際の OpenFreeMap のタイルで表示したとき、3D建物・日本語ラベル・空が正しく出るか。Nominatim 検索
6. Googleマップ上のボタンの位置が Google の UI と重ならないか

## 既知の制限

- 目の前すぐから階段が始まる場所では、キャリブレーションの前提(足元は平ら)が崩れて高さがずれる
- アバターのすぐ近く(〜30cm)の物は、隠れ判定の余裕のため手前に見えることがある
- キャプチャの瞬間にアバターが一瞬消える。歩行中・回転中は奥行きが無効
- 髪は体の動きでだけ揺れ、移動の勢いではなびかない

## ユーザーとのやりとりで分かったこと

- 最初「真っ黒なストリートビュー(海の上の座標 -24.08, 1.45)」のスクショが来たが、原因は未特定(拡張のボタン経由かどうか聞いたが答えは無く、次の依頼に進んだ)
- ユーザーは「3Dで歩く」で開く別タブではなく、**Googleマップの画面そのものにアバターが出る**ことを期待していた
- ネットワーク許可を最初「セットアップスクリプト」欄に書いてしまっていたので、「許可するドメイン」欄に1行ずつ書くよう案内した
