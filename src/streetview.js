// Googleマップのストリートビューの上に、アバターを後ろ姿で重ねて表示する。
// ストリートビューで前に進むと(矢印キーやクリック)、アバターも一緒に歩く。
//
// 画面のキャプチャから AI で奥行きを推定し(offscreen.js)、
//  - 手前にある建物や人の後ろにアバターを隠す
//  - 坂道や階段ではアバターを地面の高さに合わせる
// ようにしている。奥行きは「足元は平らな地面」という前提で実際の距離(m)に換算する。
import * as THREE from 'three';
import { builtinModelUrl, createLoader, disposeVrm, findClip, normalizeModel } from './avatar-model.js';
import { VrmAnimator } from './vrm-animator.js';

const AVATAR_HEIGHT_M = 1.7;
const CAMERA_HEIGHT_M = 2.5; // ストリートビューのカメラの高さ(撮影車のおおよその値)
// アバターまでの距離は、水平に見たとき足元が画面の中心から下端までの 8 割の位置に来るように決める
// (URL の画角は横なので、横長の画面ほど縦の画角が狭くなり、近いと足が画面の外に出る)
const FEET_ON_SCREEN = 0.8;
const MIN_DIST_M = 4;
const MAX_DIST_M = 12;
const WALK_AFTER_MOVE = 1.2; // パノラマが切り替わったあと歩き続ける秒数
const SETTLE_MS = 700; // 視点が止まってから奥行きを推定するまでの時間
const NEAR = 0.1;
const FAR = 500;

let ctx = null; // 表示中のオーバーレイ
let loadingKey = null;

const toRad = (d) => (d * Math.PI) / 180;
const angleDiff = (a, b) => ((b - a + 540) % 360) - 180;
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

  // 画面中央の縦の帯で、アバターの距離あたりにある点の高さを集める。
  // 足元の地面が画面の外(下)にあるときは、手前の車などを地面と取り違えるので集めない
  const heights = [];
  const bottom = rayFor(0.5, 1, cam);
  const feetVisible = bottom.y < 0 && (CAMERA_HEIGHT_M / -bottom.y) * -bottom.z < cam.dist - 0.45;
  for (let j = 0; feetVisible && j < h; j++) {
    for (let i = Math.floor(w * 0.4); i < w * 0.6; i++) {
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
  return { tex, ground };
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
    walkTimer: 0,
    walkDir: 1,
    lag: 0,
    emote: null,
    raf: 0,
    last: performance.now(),
    onStatus: null,
  };

  c.onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    invalidateDepth(c);
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
  Digit5: 'bow', Digit6: 'spin', Digit7: 'lookaround', Digit8: 'stretch',
};

function triggerEmote(c, name) {
  c.walkTimer = 0;
  c.emote = name;
  if (c.animator) {
    c.animator.startEmote(name);
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
  return { fov: c.camera.fov, aspect: c.camera.aspect, pitch: toDegPitch(c.view), dist: avatarDistance(c.camera.fov) };
}

const avatarDistance = (vfov) =>
  Math.max(MIN_DIST_M, Math.min(MAX_DIST_M, CAMERA_HEIGHT_M / (FEET_ON_SCREEN * Math.tan(toRad(vfov) / 2))));

// URL の y は横の画角(Google の Maps URLs の fov と同じ)。three.js のカメラは縦の画角なので換算する
const verticalFov = (hfov, aspect) =>
  Number.isFinite(hfov) ? (2 * Math.atan(Math.tan(toRad(hfov) / 2) / aspect) * 180) / Math.PI : NaN;

// URL の t は 90 が水平、小さいほど下向き
const toDegPitch = (view) => Math.max(-80, Math.min(80, (view?.tilt ?? 90) - 90));

function update(c, dt) {
  const walking = c.walkTimer > 0;
  c.walkTimer = Math.max(0, c.walkTimer - dt);
  if (walking && c.emote) stopEmote(c);

  // カメラを回したとき、アバターが少し遅れて向きを合わせる(+Z 向きのモデルを奥へ向ける)
  c.lag *= Math.exp(-dt * 4);
  c.root.rotation.y = Math.PI + c.lag;

  // 地面の高さへなめらかに移動
  c.ground += (c.groundTarget - c.ground) * Math.min(1, dt * 5);
  c.spot.position.y = c.ground;

  const forward = walking ? c.walkDir : 0;
  if (c.animator) {
    c.animator.update(dt, { forward, running: false, speed: 1.4 });
    c.model.position.y = c.animator.lift;
  } else if (c.mixer) {
    playAction(c, walking ? 'walk' : c.emote || 'idle');
    if (c.actions.walk) c.actions.walk.timeScale = c.walkDir;
    c.mixer.update(dt);
  }

  // ストリートビューと同じカメラ(画角・上下の向き)で描く
  const fov = verticalFov(c.view?.fov, c.camera.aspect);
  if (Number.isFinite(fov) && Math.abs(c.camera.fov - fov) > 0.01) {
    c.camera.fov = Math.max(5, Math.min(120, fov));
    c.camera.updateProjectionMatrix();
  }
  c.spot.position.z = -avatarDistance(c.camera.fov);
  c.camera.rotation.set(toRad(toDegPitch(c.view)), 0, 0);

  c.renderer.render(c.scene, c.camera);
}

// ---------------------------------------------------------------------------
// 奥行き推定(視点が止まったら画面をキャプチャして推定)
// ---------------------------------------------------------------------------
function viewKeyOf(view) {
  if (!view) return '';
  return [view.lat, view.lng, view.heading, view.tilt, view.fov].map((v) => (v ?? 0).toFixed(5)).join(',');
}

function invalidateDepth(c) {
  c.occluder.visible = false;
  c.depthKey = '';
  c.blankTries = 0;
  c.viewChangedAt = performance.now();
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
    // アバターとボタンが写らないように一瞬隠してキャプチャする
    const bar = document.getElementById('walk3d-buttons');
    c.canvas.style.visibility = 'hidden';
    if (bar) bar.style.visibility = 'hidden';
    await nextFrame();
    await nextFrame();
    let shot;
    try {
      shot = await chrome.runtime.sendMessage({ type: 'sv-capture' });
    } finally {
      c.canvas.style.visibility = '';
      if (bar) bar.style.visibility = '';
    }
    if (!shot || shot.error) throw new Error(shot?.error || 'capture failed');
    if (c.viewKey !== key) return;
    c.onStatus?.('loading');
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
  c.groundTarget = field.ground;
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
    invalidateDepth(ctx); // 視点が変わったら古い奥行きは使えない
  }
  if (!prev) return;

  const dn = (view.lat - prev.lat) * 111320;
  const de = (view.lng - prev.lng) * 111320 * Math.cos(toRad(view.lat));
  const moved = Math.hypot(dn, de);
  if (moved > 0.3) {
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
  cancelAnimationFrame(ctx.raf);
  window.removeEventListener('resize', ctx.onResize);
  window.removeEventListener('keydown', ctx.onKeyDown, true);
  disposeVrm(ctx.vrm);
  ctx.occluder.material.uniforms.depthTex.value?.dispose();
  ctx.renderer.dispose();
  ctx.renderer.forceContextLoss();
  ctx.canvas.remove();
  ctx = null;
  loadingKey = null;
}

// テスト用
export const _internal = { buildDepthField, rayFor, CAMERA_HEIGHT_M };
