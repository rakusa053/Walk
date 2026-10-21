import * as maplibregl from 'maplibre-gl';
import * as THREE from 'three';
import { BUILTIN_MODELS, builtinModelUrl, createLoader, disposeVrm, findClip, normalizeModel } from './avatar-model.js';
import { VrmAnimator } from './vrm-animator.js';
import { AreaWatcher, Companion, formatDistance, greetingKey, passedMilestone } from './companion.js';

// ---------------------------------------------------------------------------
// 設定
// ---------------------------------------------------------------------------
const params = new URLSearchParams(location.search);
const STYLE_URL = params.get('style') || 'https://tiles.openfreemap.org/styles/liberty';
const DEFAULT_POS = { lng: 139.7671, lat: 35.6812 }; // 東京駅
const AVATAR_HEIGHT_M = 1.7;
const WALK_SPEED = 1.5; // m/s(アバターサイズ1倍のとき)
const RUN_SPEED = 4.5;
const TURN_SPEED = 140; // deg/s
const STRIDE_M = 0.75;

const hasChromeStorage = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;

const state = {
  pos: { ...DEFAULT_POS },
  heading: 0, // 北から時計回り(度)
  size: 4,
  speedMul: 1,
  follow: true,
  target: null,
  distance: 0,
  emote: null, // 再生中のワンショット/ループ動作
  model: 'girl',
  dirty: true,
};

const keys = new Set();

// 一緒に散歩している感じ(ときどき振り返る・吹き出しで話しかける・立ち止まると手招き)
const companion = new Companion();
const talk = {
  walkTime: 0, // 歩き続けている秒数
  stillSince: 0, // 立ち止まった時刻(秒)。フレームが遅くても実際の時間で数える
  nextLookBack: 15,
  lookUntil: 0, // この時刻(秒)まで振り返る
  beckoned: false,
  sessionM: 0, // このページを開いてから一緒に歩いた距離
  greeted: false,
};
const areaWatcher = new AreaWatcher();
const nowS = () => performance.now() / 1000;

// ---------------------------------------------------------------------------
// 初期位置(URLパラメータ > 前回の位置 > 東京駅)
// ---------------------------------------------------------------------------
async function loadSaved() {
  if (!hasChromeStorage) return null;
  try {
    const { walkState } = await chrome.storage.local.get('walkState');
    return walkState || null;
  } catch {
    return null;
  }
}

function saveState() {
  if (!hasChromeStorage || !map) return;
  chrome.storage.local.set({
    walkState: {
      lng: state.pos.lng,
      lat: state.pos.lat,
      heading: state.heading,
      size: state.size,
      speedMul: state.speedMul,
      follow: state.follow,
      model: state.model,
      distance: state.distance,
      zoom: map.getZoom(),
      pitch: map.getPitch(),
      bearing: map.getBearing(),
    },
  }).catch(() => {});
}

// ---------------------------------------------------------------------------
// 地理計算(短距離なので正距円筒近似で十分)
// ---------------------------------------------------------------------------
const M_PER_DEG_LAT = 111320;
const toRad = (d) => (d * Math.PI) / 180;
const toDeg = (r) => (r * 180) / Math.PI;

function offset(pos, headingDeg, meters) {
  const h = toRad(headingDeg);
  const dn = Math.cos(h) * meters;
  const de = Math.sin(h) * meters;
  return {
    lat: pos.lat + dn / M_PER_DEG_LAT,
    lng: pos.lng + de / (M_PER_DEG_LAT * Math.cos(toRad(pos.lat))),
  };
}

function vectorTo(from, to) {
  const dn = (to.lat - from.lat) * M_PER_DEG_LAT;
  const de = (to.lng - from.lng) * M_PER_DEG_LAT * Math.cos(toRad(from.lat));
  return { dist: Math.hypot(dn, de), bearing: (toDeg(Math.atan2(de, dn)) + 360) % 360 };
}

const angleDiff = (a, b) => ((b - a + 540) % 360) - 180;

// ---------------------------------------------------------------------------
// アバター(three.js)
// ---------------------------------------------------------------------------
const avatar = {
  root: new THREE.Group(), // 向きとサイズ
  model: null,
  mixer: null,
  actions: {},
  current: null,
  vrm: null,
  animator: null,
};

function setModel(gltf) {
  if (avatar.model) avatar.root.remove(avatar.model);
  if (avatar.mixer) avatar.mixer.stopAllAction();
  disposeVrm(avatar.vrm);
  avatar.mixer = null;
  avatar.vrm = null;
  avatar.animator = null;
  avatar.actions = {};
  avatar.current = null;
  state.emote = null;

  // 高さを AVATAR_HEIGHT_M に正規化し、足元を原点に合わせる
  const { wrapper, model, vrm } = normalizeModel(gltf, AVATAR_HEIGHT_M);

  avatar.model = wrapper;
  avatar.root.add(wrapper);

  if (vrm) {
    avatar.vrm = vrm;
    avatar.animator = new VrmAnimator(vrm);
    avatar.animator.onEmoteEnd = () => {
      state.emote = null;
    };
    // 揺れもの(髪・スカート)を初期姿勢に落ち着かせる
    vrm.springBoneManager?.reset();
    state.dirty = true;
    return;
  }

  const mixer = new THREE.AnimationMixer(model);
  const clips = gltf.animations || [];
  const pick = {
    idle: findClip(clips, [/^idle$/i, /idle/i, /stand/i]),
    walk: findClip(clips, [/^walking$/i, /^walk$/i, /walk/i]),
    run: findClip(clips, [/^running$/i, /^run$/i, /run/i, /jog/i]),
    jump: findClip(clips, [/^jump$/i, /jump/i]),
    wave: findClip(clips, [/wave/i, /hello/i]),
    thumbsup: findClip(clips, [/thumb/i, /yes/i]),
    dance: findClip(clips, [/dance/i]),
    peace: findClip(clips, [/peace/i, /yes/i]),
    bow: findClip(clips, [/bow/i]),
    spin: findClip(clips, [/spin/i, /turn/i]),
    lookaround: findClip(clips, [/look/i]),
    stretch: findClip(clips, [/stretch/i]),
    beckon: findClip(clips, [/beckon/i, /wave/i]),
  };
  if (!pick.walk) pick.walk = pick.run || pick.idle || clips[0] || null;
  if (!pick.run) pick.run = pick.walk;
  if (!pick.idle) pick.idle = null;

  avatar.actions = {};
  for (const [name, clip] of Object.entries(pick)) {
    if (!clip) continue;
    const action = mixer.clipAction(clip);
    if (ONE_SHOT_EMOTES.includes(name)) {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    }
    avatar.actions[name] = action;
  }
  mixer.addEventListener('finished', () => {
    state.emote = null;
  });
  avatar.mixer = mixer;
  avatar.current = null;
  playAction('idle');
  state.dirty = true;
}

const ONE_SHOT_EMOTES = ['jump', 'wave', 'thumbsup', 'peace', 'bow', 'spin', 'lookaround', 'stretch', 'beckon'];
// 数字キー → エモート(3 のダンスだけは、もう一度押すまで続く)
const EMOTE_KEYS = {
  Digit1: 'wave', Digit2: 'thumbsup', Digit3: 'dance', Digit4: 'peace',
  Digit5: 'bow', Digit6: 'spin', Digit7: 'lookaround', Digit8: 'stretch', Digit9: 'beckon',
};

function playAction(name, fade = 0.25) {
  const next = avatar.actions[name];
  if (!next) {
    if (avatar.current) avatar.current.fadeOut(fade);
    avatar.current = null;
    return;
  }
  if (avatar.current === next) return;
  next.reset().setEffectiveWeight(1).fadeIn(fade).play();
  if (avatar.current) avatar.current.fadeOut(fade);
  avatar.current = next;
}

function triggerEmote(name) {
  companion.say(name, {}, { priority: 2, cooldown: 4 });
  if (avatar.animator) {
    clearTarget();
    state.emote = name;
    avatar.animator.startEmote(name);
    return;
  }
  const action = avatar.actions[name];
  if (!action) return;
  clearTarget();
  if (avatar.current === action) action.reset().play();
  state.emote = name;
}

function toggleEmote(name) {
  if (name === 'dance' && state.emote === 'dance') {
    state.emote = null;
    avatar.animator?.stopEmote();
  } else {
    triggerEmote(name);
  }
}

function buildShadow() {
  const geo = new THREE.CircleGeometry(0.45, 32);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = 0.03;
  mesh.renderOrder = -1;
  return mesh;
}

const avatarLayer = {
  id: 'avatar',
  type: 'custom',
  renderingMode: '3d',
  onAdd(mapInstance, gl) {
    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 2.2));
    const sun = new THREE.DirectionalLight(0xffffff, 2.0);
    sun.position.set(2, 5, 3);
    this.scene.add(sun);
    avatar.root.add(buildShadow());
    this.scene.add(avatar.root);
    this.renderer = new THREE.WebGLRenderer({ canvas: mapInstance.getCanvas(), context: gl, antialias: true });
    this.renderer.autoClear = false;
    this.local = new THREE.Matrix4();
    this.rotX = new THREE.Matrix4().makeRotationX(Math.PI / 2);
  },
  render(gl, args) {
    const merc = maplibregl.MercatorCoordinate.fromLngLat([state.pos.lng, state.pos.lat], 0);
    const s = merc.meterInMercatorCoordinateUnits();
    // ローカル座標: +X=東, +Y=上, +Z=南(単位メートル)
    this.local.makeTranslation(merc.x, merc.y, merc.z).scale(new THREE.Vector3(s, -s, s)).multiply(this.rotX);
    const m = new THREE.Matrix4().fromArray(args.defaultProjectionData.mainMatrix);
    this.camera.projectionMatrix = m.multiply(this.local);
    avatar.root.scale.setScalar(state.size);
    avatar.root.rotation.y = Math.PI - toRad(state.heading);
    this.renderer.resetState();
    this.renderer.render(this.scene, this.camera);
    companion.update(bubbleAnchor(this.camera.projectionMatrix));
  },
};

// 吹き出しを出す位置(アバターの頭の少し上を、画面の座標にしたもの)
const anchorV4 = new THREE.Vector4();
const headPos = new THREE.Vector3();
function bubbleAnchor(proj) {
  if (!avatar.model || !map) return null;
  const head = avatar.vrm?.humanoid?.getRawBoneNode('head');
  if (head) {
    head.getWorldPosition(headPos);
    headPos.y += 0.3 * state.size;
  } else {
    headPos.set(0, (AVATAR_HEIGHT_M + 0.25) * state.size, 0);
  }
  anchorV4.set(headPos.x, headPos.y, headPos.z, 1).applyMatrix4(proj);
  if (anchorV4.w <= 0) return null;
  const rect = map.getCanvas().getBoundingClientRect();
  return {
    x: rect.left + ((anchorV4.x / anchorV4.w + 1) / 2) * rect.width,
    y: rect.top + ((1 - anchorV4.y / anchorV4.w) / 2) * rect.height,
  };
}

// 歩いているあいだ・立ち止まったときに、振り返ったり話しかけたりする
function updateCompanion(dt, moving) {
  const a = avatar.animator;
  const still = nowS() - talk.stillSince;
  if (moving) {
    if (talk.walkTime === 0 && still > 15) companion.say('walkStart', {}, { cooldown: 60 });
    talk.stillSince = nowS();
    talk.beckoned = false;
    talk.walkTime += dt;
    // ときどき振り返って「ついてきてる?」
    if (talk.walkTime > talk.nextLookBack) {
      talk.lookUntil = nowS() + 1.6;
      talk.nextLookBack = talk.walkTime + 12 + Math.random() * 13;
    }
    maybeLookupArea();
  } else {
    // 歩き終わったら一度振り返る
    if (talk.walkTime > 4) talk.lookUntil = nowS() + 1.6;
    talk.walkTime = 0;
    talk.nextLookBack = 8 + Math.random() * 8;
  }

  // はじめにあいさつ(時間帯で変える)と、いる場所の地名(おしゃべりが OFF のあいだはしない)
  if (!talk.greeted && avatar.model && companion.enabled) {
    talk.greeted = true;
    companion.say(greetingKey(), {}, { priority: 3, cooldown: 0 });
    maybeLookupArea();
  }

  // 立ち止まったままだと「こっちこっち」(エモート中はしない)
  if (!talk.beckoned && !moving && !state.emote && !a?.emote && still > 25) {
    talk.beckoned = true;
    companion.say('idle', {}, { cooldown: 60, queue: true });
    if (a) a.startEmote('beckon');
  }

  if (!a) return;
  a.talking = companion.talking;
  // 振り返る・話しているときは、カメラ(地図の手前)のほうを向く
  if (nowS() < talk.lookUntil || companion.talking) {
    const rel = angleDiff(state.heading, map.getBearing() + 180); // アバターの正面から時計回りに見たカメラの方向
    a.lookAt(-toRad(rel), Math.min(0.5, toRad(90 - map.getPitch()) * 0.6));
  } else {
    a.stopLooking();
  }
}

// 地名が変わったら「〇〇に来たね」(調べる間隔は AreaWatcher が守る)
function maybeLookupArea() {
  if (!companion.enabled || !hasChromeStorage) return;
  areaWatcher.check(state.pos.lat, state.pos.lng, (key, vars) => companion.say(key, vars, { priority: 2, cooldown: 0, queue: true }));
}

// ---------------------------------------------------------------------------
// 地図
// ---------------------------------------------------------------------------
let map;
let targetMarker;

function localizeLabels() {
  const lang = (navigator.language || 'ja').split('-')[0];
  for (const layer of map.getStyle().layers) {
    if (layer.type !== 'symbol') continue;
    const tf = map.getLayoutProperty(layer.id, 'text-field');
    if (!tf || !JSON.stringify(tf).includes('name')) continue;
    map.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', `name:${lang}`], ['get', 'name']]);
  }
}

function ensure3DBuildings() {
  const layers = map.getStyle().layers;
  if (layers.some((l) => l.type === 'fill-extrusion')) return;
  const sourceId = Object.entries(map.getStyle().sources).find(([, s]) => s.type === 'vector')?.[0];
  if (!sourceId) return;
  const firstSymbol = layers.find((l) => l.type === 'symbol')?.id;
  map.addLayer(
    {
      id: 'walk-3d-buildings',
      type: 'fill-extrusion',
      source: sourceId,
      'source-layer': 'building',
      minzoom: 14,
      paint: {
        'fill-extrusion-color': ['interpolate', ['linear'], ['coalesce', ['get', 'render_height'], 10], 0, '#e6e1d8', 60, '#cfc8bd', 200, '#b9b2a8'],
        'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 10],
        'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
        'fill-extrusion-opacity': 0.9,
      },
    },
    firstSymbol,
  );
}

function addSky() {
  try {
    map.setSky({
      'sky-color': '#7fb8f0',
      'horizon-color': '#dcecff',
      'fog-color': '#eef4fb',
      'sky-horizon-blend': 0.6,
      'horizon-fog-blend': 0.6,
      'fog-ground-blend': 0.7,
    });
  } catch (e) {
    console.warn('sky not supported', e);
  }
}

function setupCameraControls() {
  const el = map.getCanvasContainer();
  let drag = null;
  el.addEventListener('pointerdown', (e) => {
    drag = { x: e.clientX, y: e.clientY, moved: false, id: e.pointerId };
  });
  window.addEventListener('pointermove', (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true;
    el.classList.add('dragging');
    map.jumpTo({
      bearing: map.getBearing() - dx * 0.3,
      pitch: Math.max(0, Math.min(85, map.getPitch() - dy * 0.2)),
    });
    drag.x = e.clientX;
    drag.y = e.clientY;
    state.lastManualRotate = performance.now();
  });
  window.addEventListener('pointerup', (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    el.classList.remove('dragging');
    if (drag.moved) {
      // ドラッグ後の click を無視する
      state.suppressClickUntil = performance.now() + 50;
    }
    drag = null;
  });
}

function setTarget(lngLat) {
  state.target = { lng: lngLat.lng, lat: lngLat.lat };
  if (!targetMarker) {
    const el = document.createElement('div');
    el.className = 'target-pin';
    targetMarker = new maplibregl.Marker({ element: el, anchor: 'bottom' });
  }
  targetMarker.setLngLat(lngLat).addTo(map);
  companion.say('target', {}, { cooldown: 40 });
  // 歩き出す前に、いまのエモートをやめる(ジャンプは着地まで続ける)。VRM のアニメーションにも伝えないと、
  // すぐ近くをクリックして歩かなかったとき、ダンスだけが続いて 3 キーで止められなくなる
  if (state.emote !== 'jump') {
    state.emote = null;
    avatar.animator?.stopEmote();
  }
}

function clearTarget() {
  state.target = null;
  if (targetMarker) targetMarker.remove();
}

function teleport(lng, lat) {
  clearTarget();
  state.pos = { lng, lat };
  map.jumpTo({ center: [lng, lat] });
  state.dirty = true;
  saveState();
}

// ---------------------------------------------------------------------------
// メインループ
// ---------------------------------------------------------------------------
let lastT = performance.now();

function tick(t) {
  const dt = Math.min(0.1, (t - lastT) / 1000);
  lastT = t;

  const up = keys.has('KeyW') || keys.has('ArrowUp');
  const down = keys.has('KeyS') || keys.has('ArrowDown');
  const left = keys.has('KeyA') || keys.has('ArrowLeft');
  const right = keys.has('KeyD') || keys.has('ArrowRight');
  const run = keys.has('ShiftLeft') || keys.has('ShiftRight');

  let forward = (up ? 1 : 0) - (down ? 1 : 0);
  const turn = (right ? 1 : 0) - (left ? 1 : 0);
  if (forward || turn) clearTarget();

  state.heading = (state.heading + turn * TURN_SPEED * dt + 360) % 360;

  let running = run;
  if (state.target) {
    const v = vectorTo(state.pos, state.target);
    if (v.dist < 0.3 * state.size) {
      clearTarget();
    } else {
      const diff = angleDiff(state.heading, v.bearing);
      state.heading = (state.heading + Math.sign(diff) * Math.min(Math.abs(diff), TURN_SPEED * 2 * dt) + 360) % 360;
      forward = Math.abs(diff) < 60 ? 1 : 0;
      running = run || v.dist > 40 * state.size;
    }
  }

  const moving = forward !== 0;
  if (moving) {
    if (!avatar.animator) state.emote = null;
    const base = running ? RUN_SPEED : WALK_SPEED;
    let step = forward * base * state.size * state.speedMul * dt;
    if (forward < 0) step *= 0.6;
    if (state.target) step = Math.min(step, vectorTo(state.pos, state.target).dist);
    state.pos = offset(state.pos, state.heading, step);
    state.distance += Math.abs(step);
    state.dirty = true;
    // 一緒に歩いた距離が区切りを越えたら一言
    const before = talk.sessionM;
    talk.sessionM += Math.abs(step);
    const mark = passedMilestone(before, talk.sessionM);
    if (mark) companion.say('distance', { d: formatDistance(mark) }, { priority: 2, cooldown: 0, queue: true });
  }

  // アニメーション
  if (avatar.animator) {
    const speed = moving ? (running ? RUN_SPEED : WALK_SPEED) * state.speedMul * (forward < 0 ? 0.6 : 1) : 0;
    if (moving) state.emote = state.emote === 'jump' ? 'jump' : null;
    avatar.animator.update(dt, { forward, running, speed });
    avatar.model.position.y = avatar.animator.lift;
  } else if (avatar.mixer) {
    let name;
    if (moving) name = running ? 'run' : 'walk';
    else name = state.emote || 'idle';
    playAction(name);
    const a = avatar.actions[name];
    if (a && (name === 'walk' || name === 'run')) a.timeScale = forward * state.speedMul;
    else if (a) a.timeScale = 1;
    avatar.mixer.update(dt);
  }

  updateCompanion(dt, moving);

  // カメラ追従
  const cam = { center: [state.pos.lng, state.pos.lat] };
  const recentlyRotated = performance.now() - (state.lastManualRotate || 0) < 1500;
  if (state.follow && (moving || turn) && !recentlyRotated) {
    const b = map.getBearing();
    const diff = angleDiff(b, state.heading);
    cam.bearing = b + diff * Math.min(1, dt * 3);
  }
  map.jumpTo(cam);
  map.triggerRepaint();

  if (state.dirty) {
    updateHud();
    state.dirty = false;
  }
  requestAnimationFrame(tick);
}

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------
const $ = (id) => document.getElementById(id);

function updateHud() {
  const d = state.distance;
  $('hud-distance').textContent = d >= 1000 ? `${(d / 1000).toFixed(2)} km` : `${Math.round(d)} m`;
  $('hud-steps').textContent = Math.round(d / (STRIDE_M * state.size)).toLocaleString();
  $('hud-coords').textContent = `${state.pos.lat.toFixed(5)}, ${state.pos.lng.toFixed(5)}`;
}

function setupUi() {
  // モーションのボタン(数字キーと同じ)
  $('emote-buttons').addEventListener('click', (e) => {
    const name = e.target.closest('[data-emote]')?.dataset.emote;
    if (name) toggleEmote(name);
  });

  // 検索(Nominatim / OpenStreetMap)
  const form = $('search-form');
  const results = $('search-results');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = $('search-input').value.trim();
    if (!q) return;
    const coord = q.match(/^\s*(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)\s*$/);
    if (coord) {
      teleport(parseFloat(coord[2]), parseFloat(coord[1]));
      results.hidden = true;
      return;
    }
    results.hidden = false;
    results.innerHTML = '<li class="muted">検索中…</li>';
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&accept-language=${encodeURIComponent(navigator.language || 'ja')}&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      const list = await res.json();
      results.innerHTML = '';
      if (!list.length) {
        results.innerHTML = '<li class="muted">見つかりませんでした</li>';
        return;
      }
      for (const item of list) {
        const li = document.createElement('li');
        li.textContent = item.display_name;
        li.addEventListener('click', () => {
          teleport(parseFloat(item.lon), parseFloat(item.lat));
          companion.say('warp', { name: item.name || item.display_name.split(',')[0] }, { priority: 2, cooldown: 0 });
          // ワープした先の地名をすぐ調べ直す
          areaWatcher.reset();
          maybeLookupArea();
          results.hidden = true;
          $('search-input').blur();
        });
        results.appendChild(li);
      }
    } catch (err) {
      results.innerHTML = '<li class="muted">検索に失敗しました</li>';
      console.error(err);
    }
  });

  const size = $('size');
  size.value = state.size;
  $('size-val').textContent = `×${state.size}`;
  size.addEventListener('input', () => {
    state.size = parseFloat(size.value);
    $('size-val').textContent = `×${state.size}`;
    state.dirty = true;
  });

  const speed = $('speed');
  speed.value = state.speedMul;
  $('speed-val').textContent = `×${state.speedMul}`;
  speed.addEventListener('input', () => {
    state.speedMul = parseFloat(speed.value);
    $('speed-val').textContent = `×${state.speedMul}`;
  });

  // おしゃべり(吹き出し)の ON/OFF。ストリートビューの 💬 ボタンと同じ設定
  const talkBox = $('talk');
  talkBox.addEventListener('change', () => {
    companion.setEnabled(talkBox.checked);
    if (hasChromeStorage) chrome.storage.local.set({ talk: talkBox.checked }).catch(() => {});
  });
  if (hasChromeStorage) {
    chrome.storage.local.get('talk').then(({ talk: on }) => {
      talkBox.checked = on !== false;
      companion.setEnabled(talkBox.checked);
    });
    chrome.storage.onChanged.addListener((changes) => {
      if (!changes.talk) return;
      talkBox.checked = changes.talk.newValue !== false;
      companion.setEnabled(talkBox.checked);
    });
  }

  const follow = $('follow');
  follow.checked = state.follow;
  follow.addEventListener('change', () => {
    state.follow = follow.checked;
  });

  $('model-file').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const seq = ++modelLoadSeq;
    const url = URL.createObjectURL(file);
    try {
      const gltf = await createLoader().loadAsync(url);
      if (seq !== modelLoadSeq) return;
      setModel(gltf);
      $('model-name').textContent = file.name;
      $('model-select').value = '';
    } catch (err) {
      alert(`モデルを読み込めませんでした: ${err.message}`);
    } finally {
      URL.revokeObjectURL(url);
    }
  });
  const select = $('model-select');
  for (const [key, m] of Object.entries(BUILTIN_MODELS)) {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = m.label;
    select.appendChild(opt);
  }
  select.value = state.model;
  select.addEventListener('change', () => {
    if (!select.value) return;
    state.model = select.value;
    loadBuiltinModel(state.model);
    saveState();
  });

  $('btn-gmaps').addEventListener('click', () => {
    window.open(`https://www.google.com/maps/@${state.pos.lat},${state.pos.lng},19z`, '_blank');
  });
  $('btn-streetview').addEventListener('click', () => {
    window.open(
      `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${state.pos.lat},${state.pos.lng}&heading=${Math.round(state.heading)}`,
      '_blank',
    );
  });
  $('btn-locate').addEventListener('click', () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => teleport(p.coords.longitude, p.coords.latitude),
      (err) => alert(`現在地を取得できませんでした: ${err.message}`),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
  $('btn-reset-distance').addEventListener('click', () => {
    state.distance = 0;
    state.dirty = true;
  });
  $('btn-panel').addEventListener('click', () => {
    document.body.classList.toggle('panel-collapsed');
  });
  $('btn-help').addEventListener('click', () => {
    $('help').hidden = !$('help').hidden;
  });

  const isTyping = () => ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) && document.activeElement.type !== 'range' && document.activeElement.type !== 'checkbox';

  window.addEventListener('keydown', (e) => {
    if (isTyping()) {
      if (e.code === 'Escape') document.activeElement.blur();
      return;
    }
    if (e.code === 'Slash' || e.code === 'KeyF') {
      e.preventDefault();
      $('search-input').focus();
      return;
    }
    if (e.repeat) {
      if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
      return;
    }
    keys.add(e.code);
    if (EMOTE_KEYS[e.code]) {
      toggleEmote(EMOTE_KEYS[e.code]);
      return;
    }
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        triggerEmote('jump');
        break;
      case 'KeyC':
        state.follow = !state.follow;
        follow.checked = state.follow;
        break;
      case 'KeyH':
        $('help').hidden = !$('help').hidden;
        break;
      case 'Escape':
        clearTarget();
        break;
      default:
        if (e.code.startsWith('Arrow')) e.preventDefault();
    }
  });
  window.addEventListener('keyup', (e) => keys.delete(e.code));
  window.addEventListener('blur', () => keys.clear());
  window.addEventListener('beforeunload', saveState);
  setInterval(saveState, 3000);
}

// 読み込みが前後しても、最後に選んだモデルだけを使う(軽いロボットが先に読み込み終わることがある)
let modelLoadSeq = 0;

async function loadBuiltinModel(key) {
  const seq = ++modelLoadSeq;
  const m = BUILTIN_MODELS[key] || BUILTIN_MODELS.girl;
  $('model-name').textContent = '読み込み中…';
  const url = builtinModelUrl(key);
  const gltf = await createLoader().loadAsync(url);
  if (seq !== modelLoadSeq) return;
  setModel(gltf);
  $('model-name').textContent = m.label;
}

// ---------------------------------------------------------------------------
// 起動
// ---------------------------------------------------------------------------
async function main() {
  maplibregl.setWorkerUrl(new URL('maplibre-gl-worker.mjs', import.meta.url).href);

  const saved = await loadSaved();
  let view = { zoom: 19.5, pitch: 70, bearing: 0 };
  if (saved) {
    state.pos = { lng: saved.lng, lat: saved.lat };
    state.heading = saved.heading ?? 0;
    state.size = saved.size ?? state.size;
    state.speedMul = saved.speedMul ?? state.speedMul;
    state.follow = saved.follow ?? state.follow;
    if (BUILTIN_MODELS[saved.model]) state.model = saved.model;
    state.distance = saved.distance ?? 0;
    view = { zoom: saved.zoom ?? 19.5, pitch: saved.pitch ?? 70, bearing: saved.bearing ?? state.heading };
  }
  const lat = parseFloat(params.get('lat'));
  const lng = parseFloat(params.get('lng'));
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    state.pos = { lat, lng };
    if (params.has('heading')) state.heading = parseFloat(params.get('heading')) || 0;
    view.bearing = state.heading;
  }

  map = new maplibregl.Map({
    container: 'map',
    style: STYLE_URL,
    center: [state.pos.lng, state.pos.lat],
    zoom: view.zoom,
    pitch: view.pitch,
    bearing: view.bearing,
    maxPitch: 85,
    maxZoom: 22,
    minZoom: 14,
    dragPan: false,
    dragRotate: false,
    keyboard: false,
    doubleClickZoom: false,
    boxZoom: false,
    canvasContextAttributes: { antialias: true },
  });
  map.scrollZoom.enable({ around: 'center' });
  map.touchZoomRotate.enable({ around: 'center' });
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true, showZoom: true }), 'bottom-right');
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

  setupCameraControls();
  setupUi();
  updateHud();

  map.on('click', (e) => {
    if (performance.now() < (state.suppressClickUntil || 0)) return;
    setTarget(e.lngLat);
  });

  map.on('load', () => {
    try { localizeLabels(); } catch (e) { console.warn(e); }
    try { ensure3DBuildings(); } catch (e) { console.warn(e); }
    addSky();
    map.addLayer(avatarLayer);
    document.body.classList.add('ready');
    requestAnimationFrame(tick);
  });

  loadBuiltinModel(state.model).catch((err) => console.error('model load failed', err));
}

main();
