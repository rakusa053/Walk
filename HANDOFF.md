# 引き継ぎメモ(Walk 3D)

次のセッション向けに、これまでの作業内容・設計・未確認事項をまとめたもの。
最初の作業ブランチは `ccr-fc9f9eef-0ixq53`。2回目のセッション(本物での検証・モーション追加)は **`claude/handoff-continuation-eooe8o`** に積んでいる(main はまだ無い)。

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
- URL の `y` は**横の画角**(Google の Maps URLs の `fov`=「horizontal field of view」がそのまま `y` になることを確認済み。`fov=50` → `50y`、窓の形によらない)。three.js 用に縦の画角へ換算している。`t` は上下の向き(90 が水平)、`h` は方位
- アバターはストリートビューと同じカメラ(高さ 2.5m、画角・ピッチを合わせる)で後ろ姿で立つ。距離は「水平に見たとき足元が画面中心〜下端の 8 割の位置」になるよう画角から決める(横長 16:10 で約 6.5m、ブラウザによくある 1.9:1 で約 8m。4〜12m にクランプ)。以前の 3.5m は横の画角で正しく描くと足が画面の外に出ていた。全画面の透明キャンバス(`pointer-events: none`)
- パノラマ移動(URL の座標変化)や ↑/↓ キーで歩くアニメーション。視点を回すと少し遅れて向きを合わせる(`lag`)
- ボタン: 「👧 アバター ON/OFF」(`svAvatar` を保存)と「🚶 3Dで歩く」。ストリートビュー中は画面上部中央、通常の地図では下部中央。ボタン内の丸で奥行き推定の状態(黄=推定中、緑=OK、灰=失敗)

### 4. 奥行きによる隠れ・地面の高さ(`src/offscreen.js`, `extension/offscreen.html`, `background.js`)

流れ: 視点が 700ms 止まる → アバターとボタンを一瞬隠して `chrome.tabs.captureVisibleTab`(background)→ オフスクリーンドキュメントで Depth Anything V2 Small(transformers.js 4 / ONNX Runtime Web、WebGPU fp16 → 失敗時 WASM q8)→ 192px 幅の相対逆深度を返す → `streetview.js` で処理。

- **キャリブレーション**(`calibrate`): 画面の中央の帯(横 35〜65%)で、地平線より下・地面までの距離 12m 以内の点を平らな地面(カメラ高 2.5m)とみなし、`disp ≒ a / z + b` を RANSAC(300回、許容誤差は disp の範囲の 4%)で当てはめてから最小二乗。直線に乗る点が 25% 未満なら「地面が見えていない」として失敗扱い(アバターは手前に表示)。以前の「近い半分を最小二乗」は路地の壁に引っぱられて地面が -0.8〜-1.2m になっていた
- **隠れ処理**: 距離を HalfFloat テクスチャにして、全画面クアッドで `gl_FragDepth` に書き込む(`colorWrite:false`、`depthFunc: AlwaysDepth`。深度テストを切ると深度も書けないため)。足が地面に埋もれないよう `z * 1.06 + 0.35` だけ奥にずらしている
- **地面の高さ**: 画面中央の帯で、前方距離がアバターの距離±0.45m の点の高さの下位20%を地面とし、-1.2〜1.5m にクランプしてなめらかに移動。足元の地面が画面の外のとき(上を向いている等)は集めない(手前の車のボンネットを地面と取り違えていた)
- **真っ黒な画面**: パノラマ読み込み中などで画面中央下がほぼ一色なら、オフスクリーン側で `{ blank: true }` を返し、失敗に数えずに 0.5→1→2…8 秒あけて再挑戦する(以前は黒い画面でも「OK」になり、でたらめな奥行きで隠れていた)
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
- ストリートビューは `ctx.route('https://www.google.com/**', …)` で偽ページを返し、`history.pushState` で URL を変えて移動・回転を再現(1.4.1 から、ストリートビューの URL には `/data=!3m6!1e1!3m4!1s<ID>!2e0` のような `!3m…!1e1` が必要。無いとストリートビューと見なさない)
- 奥行きは `sw.evaluate(() => { self.estimateDepth = async () => 合成データ })` で差し替え(background の `self.estimateDepth` はテスト用の差し替え口)。柱(2m先)と段差(3m先、40cm)の合成シーンで、隠れ処理と地面 0.4m を確認済み
- 推定パイプライン自体は、offscreen.html を通常タブで開き(オフスクリーンドキュメントへの通信は `ctx.route` で横取りできないため)、Hugging Face への通信を ReduceMean だけの小さな ONNX モデルで横取りして、WASM まで通ることを確認済み

## 2回目のセッションで本物を使って確認したこと

ネットワーク許可(下記)を追加して、本物の Googleマップ・Hugging Face・OpenFreeMap・Nominatim で確認した。

- **ストリートビューの写真はこの環境では表示されない**: Google がパノラマのタイル(`streetviewpixels-pa…/v1/tile` が 403、`photometa` が 500)を返さず、拡張なしでも画面が真っ黒。拡張のせいではない(ユーザーが最初に送ってきた真っ黒なスクショとの関係は不明のまま)
- **代わりの検証方法**: サムネイル API(`https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&panoid=…&w=…&h=…&yaw=…&pitch=…&thumbfov=…`)は画像を返す。本物のストリートビュー画面(Google の UI 付き)の真っ黒なキャンバスを隠して、同じ視点のサムネイルを差し込み、本物の Depth Anything V2 で推定させた
  - `thumbfov` は横の画角(窓の形を変えても左右の範囲が同じ)
  - サムネイルの `pitch` は**正が下向き**(URL の `t` とは逆向き)
  - パノラマ ID は、地図にペグマンをドラッグしたあとの URL の `!1s<ID>!2e` から取れる
  - Playwright の `viewport` を指定すると、`captureVisibleTab` の画像(実際の窓)と画面の大きさがずれる(1280×800 に対して 1280×661)。`viewport: null` と `--window-size` を使うこと
- **結果(地面の高さ、正解はどれもほぼ 0)**: 渋谷スクランブル交差点 0.01、住宅街の道 -0.01、狭い路地 -0.01、路地を見下ろし -0.04、坂 0.00 / 見下ろし -0.02、橋 0.02、谷中 0.00、人のいる道 -0.04、車の後ろ -0.29。石畳の細い路地(壁ばかり)は「失敗」になり、アバターは手前に表示
- **3Dマップ(map.html)**: OpenFreeMap のタイルで 3D建物・日本語ラベルが表示され、Nominatim 検索(東京タワー)も動いた。OpenFreeMap のスタイルが一部のアイコン画像の欠けを警告するが表示に影響はない
- **ボタンの位置**: ストリートビュー中、上部中央のボタンが検索欄の横の「あ」(日本語入力ツール)と重なっていたので、`top: 76px` に下げた

## 3回目のセッション(バグのチェック、1.4.1)

ユーザーの依頼「バグがないかチェックして」。全ソースを読み、怪しいところを本物の Googleマップ・モデルで確かめて直した(内容は CHANGELOG の 1.4.1)。この環境でも Googleマップ・Hugging Face・OpenFreeMap に接続できた。

- **ストリートビューの判定**: 航空写真の3D表示の URL は `@35.65,139.74,600a,35y,39.42t/data=!3m1!1e3`、写真ビューアは `…,3a,75y,90t/data=!3m8!1e2…` で、どちらも以前の正規表現に当てはまっていた。ストリートビューは `data=!3m<n>!1e1`(`map_action=pano` で開くと `…,0a,90y,90h,90t/data=!3m3!1e1…`)なので、`gmaps.js` と `background.js` で `/!3m\d+!1e1(?!\d)/` を見るようにした。交通状況レイヤーは `!5m1!1e1` なので `!3m` に限定している
  - この環境(ヘッドレス + SwiftShader)では、Google が 3D の航空写真を 2 秒ほどで 2D(`…,641m/data=!3m1!1e3`)に書き換えるので、読み込み直後 1 秒ほどで確認した。GPU のある本物の Chrome では 3D のまま。そこでアバターが出ないことはまだ見ていない
- **脚の長さ**: `VrmAnimator` が脚の長さをワールド座標で測っていたため、3Dマップでアバターの親(`avatar.root`)が「大きさ」倍(標準 ×4)になったあとにモデルを読み込むと、歩幅が 4 倍と見なされて歩調が 1/4 になっていた(本物の girl.vrm で、親の拡大率 1 → 0.81m・1.69歩/秒、4 → 3.23m・0.42歩/秒)。最初の読み込みは地図より先に終わることが多いので気づきにくく、キャラクターの切り替えや自分の VRM の読み込みで起きていた。モデル自身の座標で測るようにした
- **「3Dで歩く」の開始位置**: 東京タワーを開いたあと地図上の地点をクリックすると、URL が `!4m14!1m7!…!3d35.6585805!4d139.7454329…!3m5!…!3d35.6597096!4d139.7448761` のように前の場所と今の場所の両方を含み、最初の一致(前の場所)を使っていた。最後の一致を使うようにした。ストリートビュー中は `@` の座標と向きを優先する(場所を開いたままストリートビューに入ったときの URL に場所の `!3d!4d` が残るかは、ヘッドレスでペグマンをドラッグできず未確認)
- **モデルの読み込みの前後**: ロボット → 女の子 → ロボットと素早く選ぶと、重い女の子が最後に読み込み終わって表示されていた(選択はロボットのまま)。最後に選んだものだけ使うようにした
- **確認のしかた**: 拡張を読み込んだ Playwright で本物の Googleマップを開き、`#walk3d-buttons` のクラスと `#walk3d-sv-avatar` の有無を見た。修正前の拡張は `git archive HEAD extension | tar -x -C <dir>` で取り出して、同じスクリプトで比べた。WebGPU の fp16 モデル(`onnx/model_fp16.onnx`)の入出力は float32 だったので、出力の扱いは WASM と同じでよい

このとき気づいて残していた小さなこと(どちらも 1.4.2 で直した):

- ストリートビューで奥行き推定の途中に通常の地図へ戻ると、次にストリートビューに入ったとき、ボタンの丸がしばらく黄色(推定中)のまま残る → キャプチャ中に隠すと、キャプチャのあとの `onStatus('loading')` が隠したあとに届いていた。`hide()` で `onStatus` を外すようにした(`gmaps.js` は隠すときに必ず丸を消す `hideAvatar()` にまとめた)
- 3Dマップで VRM がダンス中に、すぐ近く(大きさ×0.3m 以内)をクリックすると、ダンスは続くのに内部の状態は「エモートなし」になり、次に 3 を押すと止まらずに最初から踊り直す → `setTarget()` が `state.emote` だけ消して `VrmAnimator` に伝えていなかった。クリックでアニメーション側のエモートも止める(ジャンプは除く)
- 確かめ方: Googleマップ本体は URL を書き戻すので、`ctx.route('https://www.google.com/maps**')` で中身の無いページを返し、`history.pushState` でストリートビュー ↔ 地図を切り替えた。キャプチャ中に切り替えるため、`sw.evaluate` で `chrome.tabs.captureVisibleTab` を 3 秒遅らせる関数に差し替えた(差し替えは効く)。ダンスは 0.4 秒あけた 2 枚のスクショの差分で踊っているかを見た。どちらも修正前(`git archive HEAD extension`)で再現し、修正後で直ることを確認

## 4回目のセッション(椅子に座る、1.5.0)

ユーザーの依頼「椅子を発見したら座るようにして」。ストリートビューだけで実装した。

- **3Dマップでは座らない理由**: OpenFreeMap のタイル(OpenMapTiles)の `poi` レイヤーにベンチ(`amenity=bench`)が入っていない(代々木・上野・日比谷・渋谷の z14 タイルを `@mapbox/vector-tile` で読んで確認。座れそうなものは `shelter` だけ)。やるなら Overpass API(`node[amenity=bench](around:…)`)で取ってきて、ベンチも自分で 3D で描く必要がある。この環境から Overpass(`overpass-api.de` など)には接続できない(許可されたドメインに無い)
- **椅子を見つける**: `offscreen.js` で、奥行きと同じ画像に物体検出 `onnx-community/dfine_s_coco-ONNX`(D-FINE small、fp32 約41MB、WASM)をかけ、`chair` / `bench` / `couch` で確からしさ 0.5 以上の枠(画面に対する割合)を返す。モデルがまだ読み込めていなければ 1.5 秒だけ待って `seats: null` を返し、`streetview.js` が 4・8・12 秒後に同じ視点をもう一度調べる
  - モデル選び: 本物のストリートビューのサムネイル 68 枚(公園・バス停・セントラルパーク・ブライアントパーク・タイムズスクエアなど)で比べた。D-FINE nano(15MB)は柵をベンチと間違え、タイムズスクエアの椅子も見落とした。D-FINE small は椅子・ベンチをよく見つけ、0.7 以上でも井の頭公園の丸太の柵(0.80)・日比谷の手すり(0.70)を間違える。RT-DETR r18 int8 も同じくらいで遅い
  - Node でモデルを試すときは `NODE_USE_ENV_PROXY=1` が要る(Node の fetch はそのままだとプロキシを使わない)
- **位置**: 枠の中ほど(横 25〜75%、縦 35〜90%)の距離の小さいほうから 30% の値を椅子の奥行きとし(すき間から見える奥を除く)、枠の下端の中央をその奥行きで 3D にする(`findSeats` / `locateSeat`)。確からしさ 0.6 以上、前方 2.5〜15m、画面の横 85% 以内、枠の下端が画面の下 3% より上(脚が切れていない)のものだけ
- **動き**: 操作がなくなって 2 秒たつと、いまの位置から一番近い椅子へ 1.1m/s で歩き(`updateSeat`)、着いたらカメラの方向から 0.45rad ずらした向きを向いて(真正面だと太ももが縮んで座って見えにくい)座る。地面の高さは歩きながら椅子の位置の高さへ変える。視点が変わると(`invalidateDepth`)いつもの位置へすぐ戻り、↑↓キー・モーションのキーではその場で立つ(そのあと 10 秒は座りに行かない)
- **座るポーズ**(`VrmAnimator.setSitting`): 太ももを水平(-1.5rad)、すねを下(+1.45rad)にして、腰を太ももの長さだけ下げる(足は地面に着いたまま、座面はひざの高さ ≒ 0.45m)。手はひざの上、ときどき足をぶらぶら。座っているあいだは自動の見回す・のびをしない。脚の角度はいったん配列にしてから最後に設定するように変えた(座るポーズと混ぜるため)
- ロボット(GLB)は座らない(RobotExpressive の `Sitting` は床に座る動きなので使っていない)
- **確かめ方**: 本物のストリートビュー画面(真っ黒)に同じ視点のサムネイルを差し込む方法で、タイムズスクエア(赤い椅子 9.8m 先)・セントラルパーク(ベンチ 7.5m 先)・ブライアントパーク(椅子 8.4m 先)では歩いていって座り、住宅街の道・井の頭公園(柵)・上野(石のベンチは確からしさ 0.5 未満で見つからず)では動かないことを確認。モーションのキー(1)で立って手を振り、視点(URL の h)を変えると中央に戻ることも確認

## 次にやること

1. ユーザーの Mac の Chrome で、本物のパノラマの上でアバターの大きさ・足元の位置・隠れ方が自然か見てもらう(ここではサムネイルでしか確認できていない)
2. 車の後ろに立つ場面などで、隠れ処理の余裕(`z * 1.06 + 0.35`)が距離 7〜8m でも妥当か
3. 新しいモーション(ピース・おじぎ・回る・見回す・のび)を本物の画面で見てもらい、好みを聞く
4. 椅子に座る動きを本物の画面で見てもらう。WebGPU のある Mac で、奥行き(WebGPU)と椅子の検出(WASM)を同時に動かしても重くないか。座る位置(椅子の手前の端に腰かける)・向き・座面の高さ(いつも約 0.45m)が自然か
5. 3Dマップでも座らせたいか聞く(Overpass API からベンチを取ってくる必要がある)

## ネットワーク許可(クラウド環境の「許可されたドメイン」)

```
*.google.com
*.google.co.jp
*.gstatic.com
*.ggpht.com
*.googleusercontent.com
*.googleapis.com
huggingface.co
*.huggingface.co
*.hf.co
tiles.openfreemap.org
nominatim.openstreetmap.org
```

Hugging Face のモデル本体は `us.aws.cdn.hf.co` から配信されるので `*.hf.co` が必要。「セットアップスクリプト」欄にドメインを書かないこと(コマンドとして実行されてしまう)。

## 既知の制限

- 目の前すぐから階段が始まる場所では、キャリブレーションの前提(足元は平ら)が崩れて高さがずれる
- アバターのすぐ近く(〜30cm)の物は、隠れ判定の余裕のため手前に見えることがある
- キャプチャの瞬間にアバターが一瞬消える。歩行中・回転中は奥行きが無効
- 髪は体の動きでだけ揺れ、移動の勢いではなびかない

## モーション(2回目のセッションで追加)

- 数字キー 1〜8: 手を振る / よろこぶ / ダンス(もう一度押すと止まる) / ピース / おじぎ / くるっと回る / 見回す / のびをする。3Dマップのパネルにも同じボタン、ストリートビューでも同じキー
- ピースとおじぎは、いったん振り返ってカメラのほうを向いてから行う(ふだんは後ろ姿なので)。ピースはウインク(`blinkLeft`)付きで、右手の薬指・小指・親指を曲げる
- 10〜18秒立ち止まっていると、自分から「見回す」「のび」をする(`IDLE_EMOTES`)
- ロボット(GLB)はクリップ名が合うもの(ピース→Yes)だけ動く
- 以前は VRM でダンス中に 3 を押しても止まらなかったのを直した

## ユーザーとのやりとりで分かったこと

- 最初「真っ黒なストリートビュー(海の上の座標 -24.08, 1.45)」のスクショが来たが、原因は未特定(拡張のボタン経由かどうか聞いたが答えは無く、次の依頼に進んだ)
- ユーザーは「3Dで歩く」で開く別タブではなく、**Googleマップの画面そのものにアバターが出る**ことを期待していた
- ネットワーク許可を最初「セットアップスクリプト」欄に書いてしまっていたので、「許可するドメイン」欄に1行ずつ書くよう案内した
- 2回目のセッションでは、ユーザーはスマホ(Android の Claude アプリ)から操作していた。アプリにはクラウド環境の編集画面が無く、スマホの Chrome で claude.ai/code を開いて設定してもらった
- 2回目のセッション途中で「モーションを追加して」と依頼があった
