// Googleマップのストリートビューの上に、アバターを後ろ姿で重ねて表示する。
// ストリートビューで前に進むと(矢印キーやクリック)、アバターも一緒に歩く。
import * as THREE from 'three';
import { builtinModelUrl, createLoader, disposeVrm, findClip, normalizeModel } from './avatar-model.js';
import { VrmAnimator } from './vrm-animator.js';

const AVATAR_HEIGHT_M = 1.7;
const CAMERA_DIST = 4.2;
const WALK_AFTER_MOVE = 1.2; // パノラマが切り替わったあと歩き続ける秒数

let ctx = null; // 表示中のオーバーレイ
let loadingKey = null;

const toRad = (d) => (d * Math.PI) / 180;
const angleDiff = (a, b) => ((b - a + 540) % 360) - 180;

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
  sun.position.set(-2, 5, -4);
  scene.add(sun);

  const shadowGeo = new THREE.CircleGeometry(0.42, 32);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadow = new THREE.Mesh(
    shadowGeo,
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3, depthWrite: false }),
  );
  shadow.scale.set(1, 1, 0.7);
  shadow.renderOrder = -1;
  scene.add(shadow);

  const root = new THREE.Group();
  scene.add(root);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);

  const c = {
    canvas, renderer, scene, camera, root,
    model: null, vrm: null, animator: null, mixer: null, actions: {}, current: null,
    view: null,
    walkTimer: 0,
    walkDir: 1,
    lag: 0,
    tilt: 90,
    emote: null,
    keys: new Set(),
    raf: 0,
    last: performance.now(),
  };

  c.onResize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
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
    } else if (!e.repeat && e.code === 'Digit1') {
      triggerEmote(c, 'wave');
    } else if (!e.repeat && e.code === 'Digit2') {
      triggerEmote(c, 'thumbsup');
    } else if (!e.repeat && e.code === 'Digit3') {
      if (c.emote === 'dance') stopEmote(c);
      else triggerEmote(c, 'dance');
    }
  };
  window.addEventListener('keydown', c.onKeyDown, true);

  c.tick = (t) => {
    const dt = Math.min(0.1, (t - c.last) / 1000);
    c.last = t;
    update(c, dt);
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
  };
  for (const [name, clip] of Object.entries(pick)) {
    if (!clip) continue;
    const a = c.mixer.clipAction(clip);
    if (name === 'wave' || name === 'thumbsup') {
      a.setLoop(THREE.LoopOnce, 1);
      a.clampWhenFinished = true;
    }
    c.actions[name] = a;
  }
  c.mixer.addEventListener('finished', () => {
    c.emote = null;
  });
}

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

function update(c, dt) {
  const walking = c.walkTimer > 0;
  c.walkTimer = Math.max(0, c.walkTimer - dt);
  if (walking && c.emote) stopEmote(c);

  // カメラを回したとき、アバターが少し遅れて向きを合わせる
  c.lag *= Math.exp(-dt * 4);
  c.root.rotation.y = c.lag;

  const forward = walking ? c.walkDir : 0;
  if (c.animator) {
    c.animator.update(dt, { forward, running: false, speed: 1.4 });
    c.model.position.y = c.animator.lift;
  } else if (c.mixer) {
    playAction(c, walking ? 'walk' : c.emote || 'idle');
    if (c.actions.walk) c.actions.walk.timeScale = c.walkDir;
    c.mixer.update(dt);
  }

  // ストリートビューの上下の向き(t)に合わせて、見下ろす角度を変える
  const elev = toRad(Math.max(2, Math.min(50, 90 - c.tilt + 10)));
  c.camera.position.set(0, 0.85 + Math.sin(elev) * CAMERA_DIST, -Math.cos(elev) * CAMERA_DIST);
  c.camera.lookAt(0, 0.85, 0);

  c.renderer.render(c.scene, c.camera);
}

// Googleマップから現在の視点が通知される
export function updateView(view) {
  if (!ctx || !view) return;
  const prev = ctx.view;
  ctx.view = view;
  if (Number.isFinite(view.tilt)) ctx.tilt = view.tilt;
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
  }
  if (Number.isFinite(view.heading) && Number.isFinite(prev.heading)) {
    const d = angleDiff(prev.heading, view.heading);
    ctx.lag = Math.max(-1, Math.min(1, ctx.lag + toRad(d)));
  }
}

export async function show(modelKey, view) {
  if (!ctx) ctx = createOverlay();
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
  ctx.renderer.dispose();
  ctx.renderer.forceContextLoss();
  ctx.canvas.remove();
  ctx = null;
  loadingKey = null;
}
