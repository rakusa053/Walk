// Googleマップのストリートビューの上に、アバターを後ろ姿で重ねて表示する。
// ストリートビューで前に進むと(矢印キーやクリック)、アバターも一緒に歩く。
//
// 画面のキャプチャから AI で奥行きを推定し(offscreen.js)、
//  - 手前にある建物や人の後ろにアバターを隠す
//  - 坂道や階段ではアバターを地面の高さに合わせる
//  - 椅子やベンチが写っていたら、そこまで歩いていって座る
//  - 立ち止まっているあいだは、写っている平らな地面を歩き回る
// ようにしている。また、一緒に散歩している感じが出るように、ときどき振り返ったり、
// 吹き出しで話しかけたり(companion.js)、立ち止まっていると手招きしたりする。
// 奥行きは「足元は平らな地面」という前提で実際の距離(m)に換算する。
import * as THREE from 'three';
import { builtinModelUrl, createLoader, disposeVrm, findClip, normalizeModel } from './avatar-model.js';
import { FACE_CAMERA, VrmAnimator } from './vrm-animator.js';
import { AreaWatcher, Companion, formatDistance, greetingKey, passedMilestone } from './companion.js';

const AVATAR_HEIGHT_M = 1.7;
const CAMERA_HEIGHT_M = 2.5; // ストリートビューのカメラの高さ(撮影車のおおよその値)
// アバターまでの距離は、水平に見たとき足元が画面の中心から下端までの 8 割の位置に来るように決める
// (URL の画角は横なので、横長の画面ほど縦の画角が狭くなり、近いと足が画面の外に出る)
const FEET_ON_SCREEN = 0.8;
const MIN_DIST_M = 4;
// ズームする(画角を狭める)と遠くに置かないと足が画面の下に出るので、上限は大きめにする
// (横 15° までズームしても足元が画面に入る。見た目の大きさはズームしても変わらない)
const MAX_DIST_M = 50;
const WALK_AFTER_MOVE = 1.2; // パノラマが切り替わったあと歩き続ける秒数
const SETTLE_MS = 700; // 視点が止まってから奥行きを推定するまでの時間
const NEAR = 0.1;
const FAR = 500;
// 椅子・ベンチを見つけたら座りに行く
const SEAT_MIN_SCORE = 0.6; // 検出の確からしさ(低くすると柵なども椅子と見なしやすい)
const SEAT_RANGE_M = [2.5, 15]; // 座りに行く椅子の、カメラからの前方の距離
const SEAT_WALK_SPEED = 1.1; // m/s
const SIT_AFTER_IDLE_S = 2; // 操作がなくなって(視点が止まって)からこの秒数たったら座りに行く
const SEAT_COOLDOWN_S = 10; // キー操作で立たせたあと、また座りに行くまでの秒数
const SIT_ANGLE = 0.45; // 座るときの向き(カメラの方向から少しずらす)[rad]
const SIT_STAY_S = [30, 60]; // 座ってから、自分で立ってまた歩き回るまで
const SEAT_AGAIN_S = 45; // 自分で立ったあと、また座りに行くまで
// 立ち止まっているあいだ、まわりを歩き回る(奥行きから、写っている平らな地面だけを選んで歩く)
const WANDER_SPEED = 0.85; // m/s(座りに行くより少しゆっくり)
const WANDER_LEG_M = [1.5, 7]; // 1 回に歩く距離
const WANDER_PAUSE_S = [3, 8]; // 着いてから、次に歩き出すまで
const WANDER_START_S = [2.5, 5]; // 操作がなくなってから歩き出すまで(椅子に座りに行くのは SIT_AFTER_IDLE_S)
const WANDER_FORWARD = [0.75, 1.8]; // 行き先の前方の距離(いつもの位置までの距離に対する割合)
// 一緒に散歩している感じ
// 画面の真ん中ではなく、中心から右端までの 25% のところを歩く(となりを一歩先に歩いている感じ。
// 横長の画面で約 1.5m 右)。m で決めると、ズームしたとき画面の外に出てしまう
const SIDE_FRACTION = 0.25;
const LOOK_BACK_EVERY_S = [12, 25]; // 歩いているあいだ、この間隔でときどき振り返る
const LOOK_BACK_S = 1.6; // 振り返っている時間
const IDLE_BECKON_S = 25; // 立ち止まったままこの秒数たつと「こっちこっち」と手招き

let ctx = null; // 表示中のオーバーレイ
let loadingKey = null;
let talkEnabled = true; // 吹き出しでおしゃべりするか
// このページで一緒に歩いた距離と、地名(ストリートビューを出たり入ったりしても続ける)
let walkedM = 0;
let greeted = false;
const areaWatcher = new AreaWatcher();

const toRad = (d) => (d * Math.PI) / 180;
const angleDiff = (a, b) => ((b - a + 540) % 360) - 180;
const angleDiffRad = (a, b) => Math.atan2(Math.sin(b - a), Math.cos(b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

// ---------------------------------------------------------------------------
// 奥行きを深度バッファに書き込む全画面パス
// ---------------------------------------------------------------------------
function createDepthOccluder() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      depthTex: { value: null },
      near: { value: NEAR },
      far: { value: FAR },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D depthTex;
      uniform float near;
      uniform float far;
      varying vec2 vUv;
      void main() {
        // 推定誤差で足元の地面に足が埋もれないよう、少し奥にずらす
        float z = clamp(texture2D(depthTex, vUv).r * 1.06 + 0.35, near, far);
        // 視点からの距離 z を、透視投影後の深度 [0,1] に変換する
        float ndc = ((far + near) * z - 2.0 * far * near) / ((far - near) * z);
        gl_FragDepth = ndc * 0.5 + 0.5;
        gl_FragColor = vec4(0.0);
      }`,
    // 深度テストを切ると深度も書けないので、テストは常に合格にする
    depthTest: true,
    depthFunc: THREE.AlwaysDepth,
    depthWrite: true,
    colorWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -100;
  mesh.visible = false;
  return mesh;
}

// ---------------------------------------------------------------------------
// カメラの向き → 画面の各点の視線ベクトル
// ---------------------------------------------------------------------------
function rayFor(u, v, cam) {
  // u, v: 画面上の位置 (0..1, 左上原点)
  const tanV = Math.tan(toRad(cam.fov) / 2);
  const x = (u * 2 - 1) * tanV * cam.aspect;
  const y = (1 - v * 2) * tanV;
  const p = toRad(cam.pitch);
  // カメラ座標 (x, y, -1) を上下の向き p だけ回す。返すベクトルはカメラ奥行き 1m あたり
  return { x, y: y * Math.cos(p) + Math.sin(p), z: y * Math.sin(p) - Math.cos(p) };
}

// 相対的な逆深度 disp を、距離 z[m] に換算する係数 (disp ≒ a / z + b) を求める。
// 画面の中央の帯にある「地平線より下の点」を平らな地面(カメラ高 CAMERA_HEIGHT_M)とみなし、
// その中で一番多くの点が乗る直線を RANSAC で探す。路地の壁や人・車は直線に乗らないので外れる
function calibrate(depth, cam) {
  const { width: w, height: h, data } = depth;
  const pts = [];
  for (let j = 0; j < h; j++) {
    for (let i = Math.floor(w * 0.35); i < w * 0.65; i += 2) {
      const r = rayFor((i + 0.5) / w, (j + 0.5) / h, cam);
      if (r.y > -0.05) continue; // 地平線に近すぎる点は使わない
      const zGround = CAMERA_HEIGHT_M / -r.y;
      if (zGround > 12) continue;
      pts.push([1 / zGround, data[j * w + i]]);
    }
  }
  if (pts.length < 30) return null;

  const ys = pts.map((p) => p[1]).sort((p, q) => p - q);
  const tol = (ys[Math.floor(ys.length * 0.95)] - ys[Math.floor(ys.length * 0.05)]) * 0.04;
  let seed = 1; // 毎回同じ結果になるよう乱数は固定
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  let best = null;
  let bestCount = 0;
  for (let k = 0; k < 300; k++) {
    const p = pts[Math.floor(rand() * pts.length)];
    const q = pts[Math.floor(rand() * pts.length)];
    if (Math.abs(p[0] - q[0]) < 1e-3) continue;
    const a = (p[1] - q[1]) / (p[0] - q[0]);
    if (a <= 0) continue;
    const b = p[1] - a * p[0];
    let count = 0;
    for (const [x, y] of pts) if (Math.abs(y - (a * x + b)) < tol) count++;
    if (count > bestCount) {
      bestCount = count;
      best = { a, b };
    }
  }
  // 地面がほとんど見えていない(壁ばかりなど)ときは、当てにならないので使わない
  if (!best || bestCount < Math.max(30, pts.length * 0.25)) return null;
  const fit = linearFit(pts.filter(([x, y]) => Math.abs(y - (best.a * x + best.b)) < tol));
  return fit && fit.a > 0 ? fit : null;
}

function linearFit(pts) {
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const [x, y] of pts) {
    sx += x; sy += y; sxx += x * x; sxy += x * y;
  }
  const n = pts.length;
  const d = n * sxx - sx * sx;
  if (Math.abs(d) < 1e-12) return null;
  const a = (n * sxy - sx * sy) / d;
  return { a, b: (sy - a * sx) / n };
}

// 奥行きマップ → 距離[m] の配列と、アバターの立つ位置の地面の高さ
function buildDepthField(depth, cam) {
  const fit = calibrate(depth, cam);
  if (!fit) return null;
  const { width: w, height: h, data } = depth;
  const metric = new Float32Array(w * h);
  for (let k = 0; k < data.length; k++) {
    const den = data[k] - fit.b;
    metric[k] = den > 1e-6 ? Math.min(FAR, Math.max(NEAR, fit.a / den)) : FAR;
  }

  // アバターが立つ位置(画面のやや右)の縦の帯で、アバターの距離あたりにある点の高さを集める。
  // 足元の地面が画面の外(下)にあるときは、手前の車などを地面と取り違えるので集めない
  const heights = [];
  const uc = 0.5 + (cam.side / (cam.dist * Math.tan(toRad(cam.fov) / 2) * cam.aspect)) * 0.5;
  const bottom = rayFor(uc, 1, cam);
  const feetVisible = bottom.y < 0 && (CAMERA_HEIGHT_M / -bottom.y) * -bottom.z < cam.dist - 0.45;
  for (let j = 0; feetVisible && j < h; j++) {
    for (let i = Math.max(0, Math.floor(w * (uc - 0.1))); i < Math.min(w, w * (uc + 0.1)); i++) {
      const r = rayFor((i + 0.5) / w, (j + 0.5) / h, cam);
      const z = metric[j * w + i];
      const forward = -r.z * z;
      if (Math.abs(forward - cam.dist) > 0.45) continue;
      const y = CAMERA_HEIGHT_M + r.y * z; // 足元の地面を 0 とした高さ
      if (y < CAMERA_HEIGHT_M - 0.3) heights.push(y);
    }
  }
  let ground = 0;
  if (heights.length >= 5) {
    heights.sort((p, q) => p - q);
    ground = heights[Math.floor(heights.length * 0.2)]; // 一番低い面 = 地面(人や物は上にある)
    ground = Math.max(-1.2, Math.min(1.5, ground)); // 推定が外れても極端に埋まったり浮いたりしない
  }

  // 画面と同じ向き(下が v=1)のテクスチャにする。WebGL は下から上なので上下反転
  const half = new Uint16Array(w * h);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) half[(h - 1 - j) * w + i] = THREE.DataUtils.toHalfFloat(metric[j * w + i]);
  }
  const tex = new THREE.DataTexture(half, w, h, THREE.RedFormat, THREE.HalfFloatType);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return { tex, ground, metric, w, h };
}

// 検出した椅子・ベンチの枠を、奥行きを使ってカメラのまわりの位置[m]にする(画面の右が +x、奥が -z)
function findSeats(field, found, cam) {
  if (!found) return [];
  const seats = [];
  const tanH = Math.tan(toRad(cam.fov) / 2) * cam.aspect; // 横の画角の半分の tan
  for (const { score, box } of found) {
    // 脚が画面の下で切れていると、地面のどこに置いてあるか分からない
    if (score < SEAT_MIN_SCORE || box.ymax > 0.97) continue;
    const seat = locateSeat(field, cam, box);
    if (!seat) continue;
    const forward = -seat.z;
    if (forward < SEAT_RANGE_M[0] || forward > SEAT_RANGE_M[1]) continue;
    if (Math.abs(seat.x) > forward * tanH * 0.85) continue; // 画面の端すぎるとアバターが見えなくなる
    if (Math.abs(seat.ground) > 1.5) continue;
    seats.push({ ...seat, score });
  }
  return seats;
}

function locateSeat(field, cam, box) {
  const { metric, w, h } = field;
  const bw = box.xmax - box.xmin;
  const bh = box.ymax - box.ymin;
  const i0 = Math.max(0, Math.floor((box.xmin + bw * 0.25) * w));
  const i1 = Math.min(w - 1, Math.floor((box.xmax - bw * 0.25) * w));
  const j0 = Math.max(0, Math.floor((box.ymin + bh * 0.35) * h));
  const j1 = Math.min(h - 1, Math.floor((box.ymax - bh * 0.1) * h));
  const zs = [];
  for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) zs.push(metric[j * w + i]);
  if (zs.length < 2) return null;
  zs.sort((p, q) => p - q);
  // 椅子のすき間から見える奥の景色ではなく、椅子そのもの(手前側)の奥行き
  const z = zs[Math.floor(zs.length * 0.3)];
  // 枠の下端(脚が地面に着くところ)の真ん中を、その奥行きで 3D の位置にする
  const r = rayFor((box.xmin + box.xmax) / 2, box.ymax, cam);
  return { x: r.x * z, z: r.z * z, ground: CAMERA_HEIGHT_M + r.y * z };
}

// ---------------------------------------------------------------------------
// オーバーレイ本体
// ---------------------------------------------------------------------------
function createOverlay() {
  const canvas = document.createElement('canvas');
  canvas.id = 'walk3d-sv-avatar';
  document.documentElement.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 2.4));
  const sun = new THREE.DirectionalLight(0xffffff, 1.8);
  sun.position.set(-2, 5, 4);
  scene.add(sun);

  const occluder = createDepthOccluder();
  scene.add(occluder);

  // アバターの立つ場所(地面の高さはここで合わせる)
  const spot = new THREE.Group();
  scene.add(spot);

  const shadowGeo = new THREE.CircleGeometry(0.42, 32);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadow = new THREE.Mesh(
    shadowGeo,
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3, depthWrite: false }),
  );
  shadow.position.y = 0.02;
  shadow.scale.set(1, 1, 0.7);
  spot.add(shadow);

  const root = new THREE.Group();
  spot.add(root);

  const camera = new THREE.PerspectiveCamera(75, 1, NEAR, FAR);
  camera.position.set(0, CAMERA_HEIGHT_M, 0);
  camera.rotation.order = 'YXZ';

  const c = {
    canvas, renderer, scene, camera, root, spot, occluder,
    model: null, vrm: null, animator: null, mixer: null, actions: {}, current: null,
    view: null,
    viewKey: '',
    viewChangedAt: 0,
    depthKey: '', // 奥行きを推定済み(または推定中)の視点
    depthBusy: false,
    depthFailed: 0,
    blankTries: 0,
    ground: 0,
    groundTarget: 0,
    homeGround: 0, // いつもの位置(画面の中央)の地面の高さ
    seats: [], // いまの視点で見つかった、座れる場所
    seatRetries: 0,
    plan: null, // 座りに行く・歩き回るときの予定 { kind: 'seat' | 'wander', dest, phase, … }
    nextPlanAt: 0, // この時刻(秒)までは、歩き回る行き先を探さない
    field: null, // いまの視点の奥行き(歩ける場所を探すのに使う)
    at: null, // いつもの位置以外にいるときの位置 {x, z}
    yaw: Math.PI, // アバターの向き(+Z 向きのモデルを奥へ向けると π)
    lastActive: nowS(), // 最後に操作した時刻(秒)。フレームが遅くても実際の時間で数える
    seatCooldownUntil: 0,
    home: { x: 1.5, z: -8 }, // いつもの位置(毎フレーム画角から決める)
    companion: new Companion(),
    things: [], // いまの視点で見つかった、話題にする物(犬・猫など)
    stillSince: nowS(), // 視点が動かなくなった時刻(秒)。入ったときから数える
    lastMoveAt: -1e9, // 最後に前へ進んだ(パノラマが変わった)時刻(秒)
    walkTime: 0, // 歩き続けている秒数
    nextLookBack: 15,
    lookUntil: 0, // この時刻(秒)まで、lookTarget のほうを見る
    lookTarget: null, // 'camera' または {x, z}
    moveTimes: [], // 最近、前へ進んだ時刻(すばやく進むと走ってついてくる)
    running: false,
    beckoned: false,
    sitSince: 0,
    retryShot: null, // 椅子を探し直すときに使う、さっきのキャプチャ
    walkTimer: 0,
    walkDir: 1,
    lag: 0,
    emote: null,
    raf: 0,
    last: performance.now(),
    onStatus: null,
  };
  c.companion.setEnabled(talkEnabled);

  c.onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    invalidateDepth(c, true);
  };
  window.addEventListener('resize', c.onResize);
  c.onResize();

  const isTyping = (e) => {
    const t = e.target;
    return t && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));
  };
  c.onKeyDown = (e) => {
    if (isTyping(e)) return;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      c.walkTimer = Math.max(c.walkTimer, 0.6);
      c.walkDir = 1;
    } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      c.walkTimer = Math.max(c.walkTimer, 0.6);
      c.walkDir = -1;
    } else if (!e.repeat && EMOTE_KEYS[e.code]) {
      const name = EMOTE_KEYS[e.code];
      if (name === 'dance' && c.emote === 'dance') stopEmote(c);
      else triggerEmote(c, name);
    }
  };
  window.addEventListener('keydown', c.onKeyDown, true);

  c.tick = (t) => {
    const dt = Math.min(0.1, (t - c.last) / 1000);
    c.last = t;
    update(c, dt);
    maybeEstimateDepth(c);
    c.raf = requestAnimationFrame(c.tick);
  };
  c.raf = requestAnimationFrame(c.tick);
  return c;
}

function setModel(c, gltf) {
  if (c.model) c.root.remove(c.model);
  if (c.mixer) c.mixer.stopAllAction();
  disposeVrm(c.vrm);
  c.vrm = null;
  c.animator = null;
  c.mixer = null;
  c.actions = {};
  c.current = null;
  c.emote = null;

  const { wrapper, model, vrm } = normalizeModel(gltf, AVATAR_HEIGHT_M);
  c.model = wrapper;
  c.root.add(wrapper);

  if (vrm) {
    c.vrm = vrm;
    c.animator = new VrmAnimator(vrm);
    c.animator.onEmoteEnd = () => {
      c.emote = null;
    };
    vrm.springBoneManager?.reset();
    return;
  }

  const clips = gltf.animations || [];
  c.mixer = new THREE.AnimationMixer(model);
  const pick = {
    idle: findClip(clips, [/^idle$/i, /idle/i, /stand/i]),
    walk: findClip(clips, [/^walking$/i, /^walk$/i, /walk/i]) || clips[0],
    wave: findClip(clips, [/wave/i]),
    thumbsup: findClip(clips, [/thumb/i, /yes/i]),
    dance: findClip(clips, [/dance/i]),
    peace: findClip(clips, [/peace/i, /yes/i]),
    bow: findClip(clips, [/bow/i]),
    spin: findClip(clips, [/spin/i, /turn/i]),
    lookaround: findClip(clips, [/look/i]),
    stretch: findClip(clips, [/stretch/i]),
    beckon: findClip(clips, [/beckon/i, /wave/i]),
  };
  for (const [name, clip] of Object.entries(pick)) {
    if (!clip) continue;
    const a = c.mixer.clipAction(clip);
    if (name !== 'idle' && name !== 'walk' && name !== 'dance') {
      a.setLoop(THREE.LoopOnce, 1);
      a.clampWhenFinished = true;
    }
    c.actions[name] = a;
  }
  c.mixer.addEventListener('finished', () => {
    c.emote = null;
  });
}

// 数字キー → エモート(3 のダンスだけは、もう一度押すまで続く)
const EMOTE_KEYS = {
  Digit1: 'wave', Digit2: 'thumbsup', Digit3: 'dance', Digit4: 'peace',
  Digit5: 'bow', Digit6: 'spin', Digit7: 'lookaround', Digit8: 'stretch', Digit9: 'beckon',
};

function triggerEmote(c, name) {
  // ロボット(GLB)に、その動きのアニメーションが無いときは何もしない(c.emote が残って戻らなくなる)
  if (!c.animator && !c.actions[name]) return;
  cancelPlan(c); // 座っていたら、その場で立ってから。歩き回っていたら止まる
  c.walkTimer = 0;
  c.emote = name;
  c.companion.say(name, {}, { priority: 2, cooldown: 4 });
  if (c.animator) {
    c.animator.startEmote(name, false);
  } else if (c.actions[name] && c.current === c.actions[name]) {
    c.actions[name].reset().play();
  }
}

function stopEmote(c) {
  c.emote = null;
  c.animator?.stopEmote();
}

function playAction(c, name) {
  const next = c.actions[name];
  if (!next || c.current === next) return;
  next.reset().setEffectiveWeight(1).fadeIn(0.25).play();
  if (c.current) c.current.fadeOut(0.25);
  c.current = next;
}

function cameraParams(c) {
  const dist = avatarDistance(c.camera.fov);
  return { fov: c.camera.fov, aspect: c.camera.aspect, pitch: toDegPitch(c.view), dist, side: homeSide(c.camera, dist) };
}

// いつもの位置の、右へのずれ[m]
const homeSide = (camera, dist) => SIDE_FRACTION * dist * Math.tan(toRad(camera.fov) / 2) * camera.aspect;

const avatarDistance = (vfov) =>
  Math.max(MIN_DIST_M, Math.min(MAX_DIST_M, CAMERA_HEIGHT_M / (FEET_ON_SCREEN * Math.tan(toRad(vfov) / 2))));

// URL の y は横の画角(Google の Maps URLs の fov と同じ)。three.js のカメラは縦の画角なので換算する
const verticalFov = (hfov, aspect) =>
  Number.isFinite(hfov) ? (2 * Math.atan(Math.tan(toRad(hfov) / 2) / aspect) * 180) / Math.PI : NaN;

// URL の t は 90 が水平、小さいほど下向き
const toDegPitch = (view) => Math.max(-80, Math.min(80, (view?.tilt ?? 90) - 90));

function update(c, dt) {
  // ストリートビューと同じカメラ(画角・上下の向き)で描く
  const fov = verticalFov(c.view?.fov, c.camera.aspect);
  if (Number.isFinite(fov) && Math.abs(c.camera.fov - fov) > 0.01) {
    c.camera.fov = Math.max(5, Math.min(120, fov));
    c.camera.updateProjectionMatrix();
  }
  c.camera.rotation.set(toRad(toDegPitch(c.view)), 0, 0);
  const dist = avatarDistance(c.camera.fov);
  const home = { x: homeSide(c.camera, dist), z: -dist };
  c.home = home;

  const walking = c.walkTimer > 0;
  c.walkTimer = Math.max(0, c.walkTimer - dt);
  if (walking && c.emote) stopEmote(c);
  if (walking) cancelPlan(c); // 歩き出したら立ち上がる・歩き回るのをやめる(いまの位置のまま一緒に歩く)

  // 椅子に向かって歩く・座る・まわりを歩き回る
  const planSpeed = updatePlan(c, dt, home);

  // カメラを回したとき、アバターが少し遅れて向きを合わせる(+Z 向きのモデルを奥へ向ける)。
  // 振り返るエモート(ピース・おじぎ・手招き)のあいだは、体ごとこちらを向く
  c.lag *= Math.exp(-dt * 4);
  const at = c.at || home;
  const faceCamera = FACE_CAMERA.has(c.animator?.emote);
  const yawTarget = c.plan ? c.plan.yaw : faceCamera ? Math.atan2(-at.x, -at.z) : Math.PI + c.lag;
  c.yaw += angleDiffRad(c.yaw, yawTarget) * Math.min(1, dt * 8);
  c.root.rotation.y = c.yaw;

  // 地面の高さへなめらかに移動
  c.ground += (c.groundTarget - c.ground) * Math.min(1, dt * 5);
  c.spot.position.set(at.x, c.ground, at.z);

  updateCompanion(c, dt, walking);

  const forward = walking ? c.walkDir : planSpeed > 0 ? 1 : 0;
  const running = walking && c.running;
  if (c.animator) {
    c.animator.update(dt, { forward, running, speed: running ? 3.2 : walking ? 1.4 : planSpeed });
    c.model.position.y = c.animator.lift;
  } else if (c.mixer) {
    playAction(c, forward ? 'walk' : c.emote || 'idle');
    if (c.actions.walk) c.actions.walk.timeScale = walking ? c.walkDir * (running ? 2 : 1) : planSpeed / 1.4;
    c.mixer.update(dt);
  }

  c.renderer.render(c.scene, c.camera);
  c.companion.update(bubbleAnchor(c));
}

// ---------------------------------------------------------------------------
// 一緒に散歩している感じ(振り返る・話しかける・手招き)
// ---------------------------------------------------------------------------
const nowS = () => performance.now() / 1000;

// アバターから見て、点 (x, z) がどちらにあるか(体の正面から、+ が左)[rad]
function yawToward(c, x, z) {
  const at = c.at || c.home;
  const vx = x - at.x;
  const vz = z - at.z;
  const lx = vx * Math.cos(c.yaw) - vz * Math.sin(c.yaw);
  const lz = vx * Math.sin(c.yaw) + vz * Math.cos(c.yaw);
  return Math.atan2(lx, lz);
}

function lookFor(c, target, seconds) {
  c.lookTarget = target;
  c.lookUntil = nowS() + seconds;
}

function updateCompanion(c, dt, walking) {
  const a = c.animator;
  if (!walking) c.running = false;

  // 歩いているあいだ、ときどき振り返って「ついてきてる?」。歩き終わったときも一度振り返る
  if (walking) {
    c.walkTime += dt;
    if (c.walkTime > c.nextLookBack) {
      lookFor(c, 'camera', LOOK_BACK_S);
      c.nextLookBack = c.walkTime + LOOK_BACK_EVERY_S[0] + Math.random() * (LOOK_BACK_EVERY_S[1] - LOOK_BACK_EVERY_S[0]);
    }
  } else if (c.walkTime > 0) {
    if (c.walkTime > 4) lookFor(c, 'camera', LOOK_BACK_S);
    c.walkTime = 0;
    c.nextLookBack = 8 + Math.random() * 8;
  }

  // 立ち止まったままだと「こっちこっち」(VRM だけ。座っているとき・歩き回って歩いているとき・エモート中はしない)
  const resting = !c.plan || c.plan.phase === 'pause';
  if (a && !c.beckoned && resting && !c.emote && !a.emote && nowS() - c.stillSince > IDLE_BECKON_S) {
    c.beckoned = true;
    c.plan = null; // 歩き回る途中で止まっていたら、その予定はやめて振り返る
    a.startEmote('beckon', false);
    c.companion.say('idle', {}, { cooldown: 60, queue: true });
  }

  // 座っているあいだ
  if (c.plan?.phase === 'sit' && nowS() - c.sitSince > 50) c.companion.say('sitLong', {}, { cooldown: 120 });

  // はじめてストリートビューに入ったら、あいさつ(時間帯で変える)
  // (おしゃべりが OFF のあいだはしない。あとで ON にしたら、そのときにあいさつする)
  if (!greeted && c.model && talkEnabled) {
    greeted = true;
    c.companion.say(greetingKey(), {}, { priority: 3, cooldown: 0 });
    checkArea(c.view); // 地名は、あいさつのあとに言う
  }

  if (!a) return;
  a.talking = c.companion.talking;
  // 話しているときは、こちらを向く(物を見ているときはそちら)
  let target = nowS() < c.lookUntil ? c.lookTarget : null;
  if (!target && c.companion.talking && resting) target = 'camera';
  if (!target) {
    a.stopLooking();
  } else if (target === 'camera') {
    const dist = Math.hypot((c.at || c.home).x, (c.at || c.home).z);
    a.lookAt(yawToward(c, 0, 0), Math.atan2(CAMERA_HEIGHT_M - 1.5, dist));
  } else {
    a.lookAt(yawToward(c, target.x, target.z), 0);
  }
}

// 吹き出しを出す位置(アバターの頭の少し上を、画面の座標にしたもの)
const anchorVec = new THREE.Vector3();
function bubbleAnchor(c) {
  if (!c.model || c.canvas.style.visibility === 'hidden') return null;
  const head = c.vrm?.humanoid?.getRawBoneNode('head');
  if (head) {
    head.getWorldPosition(anchorVec);
    anchorVec.y += 0.3;
  } else {
    c.spot.getWorldPosition(anchorVec);
    anchorVec.y += AVATAR_HEIGHT_M + 0.25;
  }
  anchorVec.project(c.camera);
  if (anchorVec.z < -1 || anchorVec.z > 1) return null;
  return { x: ((anchorVec.x + 1) / 2) * window.innerWidth, y: ((1 - anchorVec.y) / 2) * window.innerHeight };
}

// 地名が変わったら「〇〇に来たね」(調べる間隔は AreaWatcher が守る)
function checkArea(view) {
  if (!talkEnabled) return;
  areaWatcher.check(view?.lat, view?.lng, (key, vars) => {
    if (!ctx?.companion.enabled) return false;
    ctx.companion.say(key, vars, { priority: 2, cooldown: 0, queue: true });
    return true;
  });
}

// 写真に写っている犬・猫などを話題にして、そちらを見る(別のことを話している間なら、そのあとで言う)
function noticeThings(c) {
  const best = c.things.filter((t) => t.score >= SEAT_MIN_SCORE).sort((p, q) => q.score - p.score)[0];
  if (!best) return;
  c.companion.say(best.label, {}, { cooldown: 90, queue: true });
  lookFor(c, { x: best.x, z: best.z }, 3);
}

// ---------------------------------------------------------------------------
// 椅子・ベンチに座る(見つけたら歩いていって、こちらを向いて座る)・まわりを歩き回る
// ---------------------------------------------------------------------------
const randIn = ([a, b]) => a + Math.random() * (b - a);

// 予定(座りに行く・歩き回る)を進める。戻り値は、歩いているときの速さ[m/s](止まっているときは 0)
function updatePlan(c, dt, home) {
  const plan = c.plan;
  const t = nowS();
  if (!plan) {
    // 操作がなくなってしばらくしたら、椅子があれば座りに行き(VRM だけ。ロボットには座るアニメーションがない)、
    // なければ歩き回る
    const idle = !c.emote && !c.animator?.emote && c.walkTimer <= 0 && t - c.lastActive >= SIT_AFTER_IDLE_S;
    if (!idle) return 0;
    if (c.animator && c.seats.length && t >= c.seatCooldownUntil) startSeat(c, home);
    else if (c.field && t >= c.nextPlanAt) startWander(c, home);
    return 0;
  }
  if (plan.phase === 'walk') {
    const { dest } = plan;
    const cur = c.at || home;
    const dx = dest.x - cur.x;
    const dz = dest.z - cur.z;
    const d = Math.hypot(dx, dz);
    const step = plan.speed * dt;
    if (d <= Math.max(step, 0.02)) {
      c.at = { x: dest.x, z: dest.z };
      arrive(c, plan);
    } else {
      c.at = { x: cur.x + (dx / d) * step, z: cur.z + (dz / d) * step };
      plan.yaw = Math.atan2(dx, dz);
    }
    const done = 1 - Math.min(1, Math.hypot(dest.x - c.at.x, dest.z - c.at.z) / plan.length);
    c.groundTarget = lerp(plan.ground0, dest.ground, done);
    return plan.phase === 'walk' ? plan.speed : 0;
  }
  if (plan.phase === 'turn' && Math.abs(angleDiffRad(c.yaw, plan.yaw)) < 0.15) {
    plan.phase = 'sit';
    c.animator?.setSitting(true);
    c.sitSince = t;
    c.companion.say('sit', {}, { cooldown: 60 });
  } else if (plan.phase === 'sit' && t - c.sitSince > plan.stay) {
    // しばらく座ったら、自分で立って、また歩き回る
    cancelPlan(c);
    c.seatCooldownUntil = t + SEAT_AGAIN_S;
  } else if (plan.phase === 'pause' && t >= plan.until) {
    c.plan = null; // 次の行き先を探す
  }
  return 0;
}

// 行き先に着いたとき。椅子ならこちらを向いて座る。歩き回っているときは、こちらを向いたり景色を眺めたりして少し止まる
function arrive(c, plan) {
  const facingCamera = Math.atan2(-plan.dest.x, -plan.dest.z);
  if (plan.kind === 'seat') {
    plan.phase = 'turn';
    // 真正面だと太ももが縮んで見えて座っているように見えにくいので、少し斜めに
    plan.yaw = facingCamera + SIT_ANGLE;
    return;
  }
  plan.phase = 'pause';
  plan.until = nowS() + randIn(WANDER_PAUSE_S);
  const r = Math.random();
  if (r < 0.35) {
    plan.yaw = facingCamera;
  } else {
    plan.yaw = Math.PI + (Math.random() * 2 - 1) * 1.3;
    if (r > 0.8) c.animator?.startEmote('lookaround');
  }
}

function startWalk(c, home, kind, dest, speed) {
  const cur = c.at || home;
  c.at = { x: cur.x, z: cur.z };
  const length = Math.max(0.01, Math.hypot(dest.x - cur.x, dest.z - cur.z));
  c.plan = { kind, dest, phase: 'walk', speed, yaw: c.yaw, length, ground0: c.groundTarget };
}

// いまの位置から一番近い椅子へ向かう
function startSeat(c, home) {
  const cur = c.at || home;
  let best = null;
  let bestDist = Infinity;
  for (const seat of c.seats) {
    const d = Math.hypot(seat.x - cur.x, seat.z - cur.z);
    if (d < bestDist) {
      best = seat;
      bestDist = d;
    }
  }
  if (!best) return;
  startWalk(c, home, 'seat', best, SEAT_WALK_SPEED);
  c.plan.stay = randIn(SIT_STAY_S);
}

// 写っている平らな地面から行き先を選んで歩く(見つからなければ、少しあとでまた探す)
function startWander(c, home) {
  const dest = pickWanderTarget(c, home);
  if (dest) startWalk(c, home, 'wander', dest, WANDER_SPEED);
  else c.nextPlanAt = nowS() + 4;
}

// 行き先を選ぶ。画面の下半分の、前方の距離が WANDER_FORWARD の範囲に写っている点から選ぶ
// (場所を適当に選ぶと、狭い路地では壁の中ばかりになる)。ときどき、いつもの位置(斜め前)に戻ってくる
function pickWanderTarget(c, home) {
  const { field } = c;
  const { metric, w, h, cam } = field;
  const cur = c.at || home;
  const candidates = Math.random() < 0.3 ? [home] : [];
  const far = toScreen(cam, 0, 0, -WANDER_FORWARD[1] * cam.dist);
  const near = toScreen(cam, 0, 0, -WANDER_FORWARD[0] * cam.dist);
  for (let k = 0; far && near && far.v < 0.95 && k < 30; k++) {
    const i = Math.floor((0.1 + Math.random() * 0.8) * w);
    const j = Math.min(h - 1, Math.floor(lerp(Math.max(0, far.v), Math.min(0.95, near.v), Math.random()) * h));
    const r = rayFor((i + 0.5) / w, (j + 0.5) / h, cam);
    const d = metric[j * w + i];
    candidates.push({ x: r.x * d, z: r.z * d });
  }
  for (const { x, z } of candidates) {
    const d = Math.hypot(x - cur.x, z - cur.z);
    if (d < WANDER_LEG_M[0] || d > WANDER_LEG_M[1] || -z > WANDER_FORWARD[1] * cam.dist) continue;
    const ground = groundAt(field, x, z);
    if (ground !== null && onScreen(cam, x, ground, z) && pathClear(field, cur, { x, z })) return { x, z, ground };
  }
  return null;
}

// カメラのまわりの点 (x, y, z)[m](y は足元の地面からの高さ)が、画面のどこに写るか。
// u, v は画面の左上を 0、右下を 1 とした位置、d はカメラからの奥行き。カメラの後ろなら null(rayFor の逆)
function toScreen(cam, x, y, z) {
  const p = toRad(cam.pitch);
  const dy = y - CAMERA_HEIGHT_M;
  const d = dy * Math.sin(p) - z * Math.cos(p);
  if (d < 0.1) return null;
  const tanV = Math.tan(toRad(cam.fov) / 2);
  const ys = (dy * Math.cos(p) + z * Math.sin(p)) / d;
  return { u: (x / d / (tanV * cam.aspect) + 1) / 2, v: (1 - ys / tanV) / 2, d };
}

// その場所に立ったアバターが、画面に入るか(足元や頭、横の端が切れない)
function onScreen(cam, x, ground, z) {
  const feet = toScreen(cam, x, ground, z);
  const head = toScreen(cam, x, ground + AVATAR_HEIGHT_M + 0.15, z);
  return !!feet && !!head && feet.v < 0.92 && head.v > 0.08 && Math.abs(feet.u - 0.5) < 0.4;
}

// (x, z) のまわり(半径 0.5m)の地面の高さ。手前の物に隠れて見えないときや、
// 人・車・柱などが立っていて平らな地面ではないときは null
function groundAt(field, x, z) {
  const { metric, w, h, cam } = field;
  // 地面の高さが -1.2〜+1m のどこにあっても入るよう、その範囲が写るところを調べる
  let u0 = 1, u1 = 0, v0 = 1, v1 = 0;
  for (const dx of [-0.5, 0.5]) {
    for (const dz of [-0.5, 0.5]) {
      for (const y of [-1.2, 1]) {
        const s = toScreen(cam, x + dx, y, z + dz);
        if (!s) return null;
        u0 = Math.min(u0, s.u);
        u1 = Math.max(u1, s.u);
        v0 = Math.min(v0, s.v);
        v1 = Math.max(v1, s.v);
      }
    }
  }
  const ys = [];
  for (let j = Math.max(0, Math.floor(v0 * h)); j <= Math.min(h - 1, Math.floor(v1 * h)); j++) {
    for (let i = Math.max(0, Math.floor(u0 * w)); i <= Math.min(w - 1, Math.floor(u1 * w)); i++) {
      const r = rayFor((i + 0.5) / w, (j + 0.5) / h, cam);
      const d = metric[j * w + i];
      if (Math.hypot(r.x * d - x, r.z * d - z) <= 0.5) ys.push(CAMERA_HEIGHT_M + r.y * d);
    }
  }
  if (ys.length < 6) return null;
  ys.sort((p, q) => p - q);
  const ground = ys[Math.floor(ys.length * 0.2)];
  if (ys[Math.floor(ys.length * 0.8)] - ground > 0.3 || Math.abs(ground) > 1.2) return null;
  return ground;
}

// from から to まで、まっすぐ歩けるか(途中の地面が見えていて、段差がない)。
// 歩き出すところ(0.9m 以内)は、座っていた椅子などがあるので調べない
function pathClear(field, from, to) {
  const len = Math.hypot(to.x - from.x, to.z - from.z);
  let prev = null;
  for (let s = 0.9; s < len + 0.35; s += 0.7) {
    const k = Math.min(1, s / len);
    const g = groundAt(field, lerp(from.x, to.x, k), lerp(from.z, to.z, k));
    if (g === null || (prev !== null && Math.abs(g - prev) > 0.3)) return false;
    prev = g;
  }
  return true;
}

// 座る・歩き回るのをやめる。reset なら(視点が変わったとき)すぐに立つ。
// home ならいつもの位置へすぐ戻る(invalidateDepth)。それ以外は、いまの位置のまま
function cancelPlan(c, { reset = false, home = false } = {}) {
  c.lastActive = nowS();
  c.nextPlanAt = c.lastActive + randIn(WANDER_START_S);
  const plan = c.plan;
  if (plan?.phase === 'sit' && !reset) c.companion.say('stand', {}, { cooldown: 30 });
  if (plan) {
    c.plan = null;
    if (plan.kind === 'seat') {
      c.animator?.setSitting(false, reset);
      c.seatCooldownUntil = reset ? 0 : nowS() + SEAT_COOLDOWN_S;
    }
  }
  if (home && c.at) {
    c.at = null;
    c.groundTarget = c.homeGround;
    c.yaw = Math.PI + c.lag;
  }
}

// ---------------------------------------------------------------------------
// 奥行き推定(視点が止まったら画面をキャプチャして推定)
// ---------------------------------------------------------------------------
function viewKeyOf(view) {
  if (!view) return '';
  return [view.lat, view.lng, view.heading, view.tilt, view.fov].map((v) => (v ?? 0).toFixed(5)).join(',');
}

// home なら(画角や画面の大きさが変わった・大きく向きを変えたとき)いつもの位置へ戻る。それ以外(前に進んだ・
// 少し回した)は、いまの位置のまま一緒に歩く(画面の中の同じところにいる)
function invalidateDepth(c, home) {
  c.occluder.visible = false;
  c.depthKey = '';
  c.blankTries = 0;
  c.viewChangedAt = performance.now();
  // 見つけていた椅子や歩ける場所も使えなくなるので、座っていたら立ち、歩き回るのもやめる
  c.field = null;
  c.seats = [];
  c.things = [];
  c.seatRetries = 0;
  c.retryShot = null;
  cancelPlan(c, { reset: true, home });
}

async function maybeEstimateDepth(c) {
  if (c.depthBusy || !c.view || !c.model) return;
  if (c.depthKey === c.viewKey) return;
  if (performance.now() - c.viewChangedAt < SETTLE_MS) return;
  if (c.depthFailed >= 3) return; // 何度も失敗したらあきらめる(アバターは今まで通り表示)
  if (document.visibilityState !== 'visible') return;

  const key = c.viewKey;
  const cam = cameraParams(c);
  c.depthBusy = true;
  c.depthKey = key;
  try {
    // 椅子を探し直すだけのときは、さっきのキャプチャを使う(アバターを隠してちらつかせない)
    const retry = c.retryShot?.key === key ? c.retryShot : null;
    c.retryShot = null;
    let shot = retry && { dataUrl: retry.dataUrl };
    if (!shot) {
      // アバターとボタンが写らないように一瞬隠してキャプチャする
      const bar = document.getElementById('walk3d-buttons');
      c.canvas.style.visibility = 'hidden';
      c.companion.el.style.visibility = 'hidden';
      if (bar) bar.style.visibility = 'hidden';
      await nextFrame();
      await nextFrame();
      try {
        shot = await chrome.runtime.sendMessage({ type: 'sv-capture' });
      } finally {
        c.canvas.style.visibility = '';
        c.companion.el.style.visibility = '';
        if (bar) bar.style.visibility = '';
      }
    }
    if (!shot || shot.error) throw new Error(shot?.error || 'capture failed');
    if (c.viewKey !== key) return;
    if (!retry) c.onStatus?.('loading');
    const res = await chrome.runtime.sendMessage({ type: 'sv-depth', dataUrl: shot.dataUrl });
    if (!res || res.error) throw new Error(res?.error || 'depth failed');
    if (!ctx || c !== ctx || c.viewKey !== key) return;
    if (res.depth.blank) {
      // パノラマの読み込み中(画面が真っ黒など)。失敗には数えず、少し待ってやり直す
      c.depthKey = '';
      c.viewChangedAt = performance.now() + Math.min(8000, 500 * 2 ** c.blankTries++);
      return;
    }
    applyDepth(c, res.depth, cam);
    c.depthFailed = 0;
    // 椅子を探すモデルがまだ読み込み中だったら、少しあとで同じ視点をもう一度調べる
    if (res.depth.seats === null && c.seatRetries < 3) {
      c.seatRetries += 1;
      c.retryShot = { key, dataUrl: shot.dataUrl };
      c.depthKey = '';
      c.viewChangedAt = performance.now() + 4000 * c.seatRetries;
    }
  } catch (e) {
    c.depthFailed += 1;
    c.depthKey = '';
    c.viewChangedAt = performance.now() + 2000 * c.depthFailed; // 少し待ってから再挑戦
    console.warn('[Walk 3D] 奥行き推定に失敗しました', e);
    c.onStatus?.('error', String(e?.message || e));
  } finally {
    c.depthBusy = false;
  }
}

function applyDepth(c, depth, cam) {
  const field = buildDepthField(depth, cam);
  if (!field) {
    c.onStatus?.('error', '地面が見つかりませんでした');
    return;
  }
  const old = c.occluder.material.uniforms.depthTex.value;
  if (old) old.dispose();
  c.occluder.material.uniforms.depthTex.value = field.tex;
  c.occluder.visible = true;
  c.field = { metric: field.metric, w: field.w, h: field.h, cam };
  c.homeGround = field.ground;
  if (!c.at) {
    c.groundTarget = field.ground;
  } else if (!c.plan) {
    // 歩き回ったところにいるときは、そこの地面の高さにする。進んだり回したりして、そこが壁の向こうなどに
    // なって見えない・画面の外のときは、いつもの位置に戻る(見えないので、移っても目立たない)
    const g = groundAt(c.field, c.at.x, c.at.z);
    if (g !== null && onScreen(cam, c.at.x, g, c.at.z)) {
      c.groundTarget = g;
    } else {
      c.at = null;
      c.groundTarget = field.ground;
    }
  }
  c.seats = findSeats(field, depth.seats, cam);
  c.things = (depth.things || []).flatMap((t) => {
    const at = locateSeat(field, cam, t.box);
    return at ? [{ label: t.label, score: t.score, x: at.x, z: at.z }] : [];
  });
  noticeThings(c);
  c.onStatus?.('ok');
}

// ---------------------------------------------------------------------------
// 公開 API(content/gmaps.js から呼ばれる)
// ---------------------------------------------------------------------------
export function updateView(view) {
  if (!ctx || !view) return;
  const prev = ctx.view;
  ctx.view = view;
  const key = viewKeyOf(view);
  if (key !== ctx.viewKey) {
    ctx.viewKey = key;
    // 視点が変わったら古い奥行きは使えない。画角が変わった・大きく向きを変えたときは、画面の同じところに
    // いても、そこに写る物がまったく変わるので、いつもの位置に戻る(前に進んだだけなら、いまの位置のまま)
    const turned = Math.abs(angleDiff(prev?.heading ?? 0, view.heading ?? 0)) > 20;
    invalidateDepth(ctx, !prev || prev.fov !== view.fov || turned);
  }
  if (!prev) return;

  const dn = (view.lat - prev.lat) * 111320;
  const de = (view.lng - prev.lng) * 111320 * Math.cos(toRad(view.lat));
  const moved = Math.hypot(dn, de);
  if (key !== viewKeyOf(prev)) {
    ctx.stillSince = nowS();
    ctx.beckoned = false;
  }
  if (moved > 0.3) {
    const c = ctx;
    // 一緒に歩いた距離。区切りの距離を越えたら一言
    const before = walkedM;
    walkedM += Math.min(moved, 100); // ワープのような大きな移動は数えすぎない
    const mark = passedMilestone(before, walkedM);
    if (mark) c.companion.say('distance', { d: formatDistance(mark) }, { priority: 2, cooldown: 0, queue: true });
    // しばらく止まっていたあとに歩き出したら「いこいこ!」、続けてすばやく進んだら走ってついてくる
    const t = nowS();
    if (t - c.lastMoveAt > 15) c.companion.say('walkStart', {}, { cooldown: 60 });
    c.moveTimes = c.moveTimes.filter((m) => t - m < 2.5).concat(t);
    if (c.moveTimes.length >= 3 && !c.running) {
      c.running = true;
      c.companion.say('run', {}, { cooldown: 45, queue: true });
    }
    c.lastMoveAt = t;
    checkArea(view);
    // 進んだ方向が、見ている向きの前か後ろか
    const bearing = (Math.atan2(de, dn) * 180) / Math.PI;
    const ahead = Math.abs(angleDiff(prev.heading ?? view.heading ?? 0, bearing)) < 100;
    ctx.walkDir = ahead ? 1 : -1;
    ctx.walkTimer = Math.max(ctx.walkTimer, WALK_AFTER_MOVE);
    ctx.groundTarget = 0; // 新しい場所の地面が分かるまでは足元と同じ高さ
  }
  if (Number.isFinite(view.heading) && Number.isFinite(prev.heading)) {
    const d = angleDiff(prev.heading, view.heading);
    ctx.lag = Math.max(-1, Math.min(1, ctx.lag + toRad(d)));
  }
}

export async function show(modelKey, view, onStatus) {
  if (!ctx) ctx = createOverlay();
  ctx.onStatus = onStatus || null;
  ctx.canvas.hidden = false;
  if (view) {
    ctx.view = null;
    updateView(view);
    if (greeted) checkArea(view); // はじめて入ったときは、あいさつのあとで調べる
  }
  if (ctx.modelKey === modelKey || loadingKey === modelKey) return;
  loadingKey = modelKey;
  try {
    const gltf = await createLoader().loadAsync(builtinModelUrl(modelKey));
    if (!ctx || loadingKey !== modelKey) return;
    setModel(ctx, gltf);
    ctx.modelKey = modelKey;
  } finally {
    if (loadingKey === modelKey) loadingKey = null;
  }
}

export function hide() {
  if (!ctx) return;
  // 推定の途中で隠したとき、あとから届いた結果でボタンの丸が「推定中」などに戻らないようにする
  ctx.onStatus = null;
  cancelAnimationFrame(ctx.raf);
  window.removeEventListener('resize', ctx.onResize);
  window.removeEventListener('keydown', ctx.onKeyDown, true);
  disposeVrm(ctx.vrm);
  ctx.occluder.material.uniforms.depthTex.value?.dispose();
  ctx.renderer.dispose();
  ctx.renderer.forceContextLoss();
  ctx.canvas.remove();
  ctx.companion.dispose();
  ctx = null;
  loadingKey = null;
}

// 吹き出しのおしゃべりをするか(gmaps.js の 💬 ボタン)
export function setTalk(on) {
  talkEnabled = on;
  ctx?.companion.setEnabled(on);
}

// テスト用
export const _internal = { buildDepthField, findSeats, rayFor, toScreen, groundAt, pathClear, CAMERA_HEIGHT_M };
