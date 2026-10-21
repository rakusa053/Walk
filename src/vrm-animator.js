import * as THREE from 'three';

// VRM モデルにはアニメーションが入っていないので、ヒューマノイドの
// 正規化ボーンを手続き的に動かして歩く・走る・手を振るなどを表現する。
// 正規化ボーンの座標系: +Y=上, +Z=前, +X=キャラクターの左。

const EMOTE_DURATION = {
  jump: 0.9, wave: 2.4, thumbsup: 1.8,
  peace: 2.6, bow: 2.6, spin: 1.3, lookaround: 3.4, stretch: 2.6, beckon: 2.6,
};
// こちら(カメラ側)を向いてから行うエモート。ふだんは後ろ姿なので、振り返って見せる
const FACE_CAMERA = new Set(['peace', 'bow', 'beckon']);
// しばらく立ち止まっていると、自分から行う動き
const IDLE_EMOTES = ['lookaround', 'stretch'];

const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (x) => x * x * (3 - 2 * x);

export class VrmAnimator {
  constructor(vrm) {
    this.vrm = vrm;
    this.bones = {};
    const names = [
      'hips', 'spine', 'chest', 'upperChest', 'neck', 'head',
      'leftUpperLeg', 'leftLowerLeg', 'leftFoot', 'rightUpperLeg', 'rightLowerLeg', 'rightFoot',
      'leftShoulder', 'leftUpperArm', 'leftLowerArm', 'leftHand',
      'rightShoulder', 'rightUpperArm', 'rightLowerArm', 'rightHand',
      'rightThumbMetacarpal', 'rightThumbProximal', 'rightThumbDistal',
      'rightIndexProximal', 'rightMiddleProximal',
      'rightRingProximal', 'rightRingIntermediate', 'rightRingDistal',
      'rightLittleProximal', 'rightLittleIntermediate', 'rightLittleDistal',
    ];
    for (const n of names) this.bones[n] = vrm.humanoid?.getNormalizedBoneNode(n) || null;
    this.hipsRestY = this.bones.hips ? this.bones.hips.position.y : 0;
    this.legLength = this.estimateLegLength();
    this.thighLength = this.estimateThighLength();
    this.time = 0;
    this.phase = 0;
    this.moveWeight = 0; // 0=停止 1=歩行
    this.runWeight = 0; // 0=歩き 1=走り
    this.emote = null;
    this.emoteTime = 0;
    this.emoteWeight = 0;
    this.lift = 0;
    this.nextBlink = 2;
    this.blinkTime = -1;
    this.onEmoteEnd = null;
    this.spin = 0;
    this.idleTime = 0;
    this.nextIdleEmote = 10 + Math.random() * 8;
    this.sitting = false; // 椅子に座っている(座ろうとしている)
    this.sitWeight = 0; // 0=立っている 1=座っている
    this.look = null; // 振り返る・何かを見る向き { yaw, pitch }(体の正面から、+yaw は左)[rad]
    this.lookWeight = 0;
    this.lookYaw = 0;
    this.lookPitch = 0;
    this.talking = false; // おしゃべり中は口を動かす
  }

  // 体の正面から yaw だけ横(+ は左)を見る。後ろを見るときは腰・胸・首に分けて回す
  lookAt(yaw, pitch = 0) {
    this.look = { yaw: Math.max(-1.9, Math.min(1.9, yaw)), pitch };
  }

  stopLooking() {
    this.look = null;
  }

  estimateLegLength() {
    const up = this.bones.leftUpperLeg;
    const foot = this.bones.leftFoot;
    if (!up || !foot) return 0.8;
    // 3Dマップではアバターを「大きさ」の倍率で拡大して描くので、その倍率を含まないモデル自身の座標で測る
    const scene = this.vrm.scene;
    const a = scene.worldToLocal(up.getWorldPosition(new THREE.Vector3()));
    const b = scene.worldToLocal(foot.getWorldPosition(new THREE.Vector3()));
    return Math.max(0.3, a.distanceTo(b) * scene.scale.y);
  }

  // 座ったとき腰を下げる量。太ももを水平にすると、腰がひざの高さまで下がる(ボーンの親の座標で測る)
  estimateThighLength() {
    const up = this.bones.leftUpperLeg;
    const low = this.bones.leftLowerLeg;
    const parent = this.bones.hips?.parent;
    if (!up || !low || !parent) return 0.4;
    const a = parent.worldToLocal(up.getWorldPosition(new THREE.Vector3()));
    const b = parent.worldToLocal(low.getWorldPosition(new THREE.Vector3()));
    return a.distanceTo(b);
  }

  startEmote(name) {
    this.emote = name;
    this.emoteTime = 0;
    this.sitting = false; // エモートは立ってから
  }

  // 座る/立つ。now なら途中の動きなしで切り替える(別の場所へ移るとき)
  setSitting(on, now = false) {
    this.sitting = on;
    if (on) this.stopEmote();
    if (now) this.sitWeight = on ? 1 : 0;
  }

  stopEmote() {
    this.emote = null;
  }

  // motion: { forward: -1..1, running: bool, speed: m/s(アバター実寸換算) }
  update(dt, motion) {
    this.time += dt;
    const moving = motion.forward !== 0;
    if (moving && this.emote && this.emote !== 'jump') this.stopEmote();
    if (moving) this.sitting = false;
    // 0.7 秒で座る・立つ
    const sitStep = dt / 0.7;
    this.sitWeight = this.sitting ? Math.min(1, this.sitWeight + sitStep) : Math.max(0, this.sitWeight - sitStep);

    this.moveWeight = lerp(this.moveWeight, moving ? 1 : 0, Math.min(1, dt * 8));
    this.runWeight = lerp(this.runWeight, motion.running ? 1 : 0, Math.min(1, dt * 5));

    // 歩幅から歩調を決める(足が滑って見えないように)
    const stride = this.legLength * lerp(1.1, 1.8, this.runWeight);
    const cadence = moving ? Math.abs(motion.speed) / stride : 0;
    this.phase += cadence * Math.PI * dt * Math.sign(motion.forward || 1);

    let emoteW = 0;
    if (this.emote) {
      this.emoteTime += dt;
      const dur = EMOTE_DURATION[this.emote];
      if (dur && this.emoteTime >= dur) {
        const ended = this.emote;
        this.emote = null;
        this.onEmoteEnd?.(ended);
      } else {
        const t = this.emoteTime;
        emoteW = dur ? Math.min(1, t / 0.25, (dur - t) / 0.3) : Math.min(1, t / 0.4);
      }
    }
    this.emoteWeight = emoteW;

    // 立ち止まってしばらくすると、見回したり伸びをしたりする(座っているあいだはしない)
    if (moving || this.emote || this.sitting || this.sitWeight > 0) {
      this.idleTime = 0;
    } else {
      this.idleTime += dt;
      if (this.idleTime > this.nextIdleEmote) {
        this.startEmote(IDLE_EMOTES[Math.floor(Math.random() * IDLE_EMOTES.length)]);
        this.idleTime = 0;
        this.nextIdleEmote = 12 + Math.random() * 10;
      }
    }

    // 見る向きへゆっくり振り向く
    this.lookWeight += ((this.look ? 1 : 0) - this.lookWeight) * Math.min(1, dt * 5);
    if (this.look) {
      this.lookYaw += (this.look.yaw - this.lookYaw) * Math.min(1, dt * 6);
      this.lookPitch += (this.look.pitch - this.lookPitch) * Math.min(1, dt * 6);
    }

    this.pose(dt);
    this.updateFace(dt);
    this.vrm.update(dt);
  }

  pose() {
    const b = this.bones;
    const t = this.time;
    const p = this.phase;
    const mw = this.moveWeight;
    const rw = this.runWeight;
    const s = Math.sin(p);
    const c = Math.cos(p);

    // --- 待機(呼吸と小さな揺れ) ---
    const breath = Math.sin(t * 2.2) * 0.02;
    const sway = Math.sin(t * 0.9) * 0.03;

    // --- 脚 ---
    const legAmp = lerp(0.45, 0.85, rw) * mw;
    const kneeAmp = lerp(0.55, 1.3, rw) * mw;
    let lUpLeg = [-s * legAmp, 0, 0];
    let rUpLeg = [s * legAmp, 0, 0];
    let lLowLeg = [Math.max(0, c) * kneeAmp + 0.05 * mw, 0, 0];
    let rLowLeg = [Math.max(0, -c) * kneeAmp + 0.05 * mw, 0, 0];
    let lFoot = [(s * 0.2 - Math.max(0, c) * 0.2) * mw, 0, 0];
    let rFoot = [(-s * 0.2 - Math.max(0, -c) * 0.2) * mw, 0, 0];

    // --- 腕(女の子らしく脇を少し締めて、ひじを軽く曲げる) ---
    const armDown = 1.2;
    const armAmp = lerp(0.35, 0.8, rw) * mw;
    const elbow = lerp(0.25, 1.3, rw * mw) + 0.1;
    let lArm = [s * armAmp, 0, -armDown + sway * 0.3];
    let rArm = [-s * armAmp, 0, armDown + sway * 0.3];
    let lFore = [0, -elbow - Math.max(0, -s) * 0.3 * mw, 0];
    let rFore = [0, elbow + Math.max(0, s) * 0.3 * mw, 0];
    let lHand = [0, 0, -0.15];
    let rHand = [0, 0, 0.15];

    // --- 体幹 ---
    const bob = Math.abs(c) * lerp(0.025, 0.06, rw) * mw;
    let hipsY = this.hipsRestY - bob;
    let hipsRot = [0, s * 0.12 * mw, sway * 0.3 * (1 - mw) + c * 0.04 * mw];
    let spineRot = [lerp(0.03, 0.22, rw) * mw + breath, -s * 0.1 * mw, -hipsRot[2] * 0.6];
    let chestRot = [breath, -s * 0.06 * mw, 0];
    let headRot = [-lerp(0.03, 0.18, rw) * mw - breath, 0, Math.sin(t * 0.7) * 0.04 * (1 - mw)];
    this.lift = 0;
    let fingerCurl = 0; // ピースのときに薬指・小指・親指を曲げる

    // --- エモート ---
    const ew = this.emoteWeight;
    const et = this.emoteTime;
    if (this.emote && ew > 0) {
      switch (this.emote) {
        case 'wave': {
          const w = Math.sin(et * 11) * 0.35;
          rArm = mix(rArm, [-0.35, 0, -0.75], ew);
          rFore = mix(rFore, [0, 0.35, -0.55 + w], ew);
          rHand = mix(rHand, [0, 0, 0], ew);
          headRot = mix(headRot, [0.05, 0.15, 0.18], ew);
          hipsRot = mix(hipsRot, [0, 0, 0.05], ew);
          break;
        }
        case 'thumbsup': {
          // 両手をあげて「やったー」
          const hop = Math.max(0, Math.sin(et * 7)) * 0.08;
          this.lift = hop * ew;
          lArm = mix(lArm, [-0.3, 0, 1.0], ew);
          rArm = mix(rArm, [-0.3, 0, -1.0], ew);
          lFore = mix(lFore, [0, -0.2, 0.5], ew);
          rFore = mix(rFore, [0, 0.2, -0.5], ew);
          headRot = mix(headRot, [-0.15, 0, Math.sin(et * 7) * 0.08], ew);
          break;
        }
        case 'jump': {
          const d = EMOTE_DURATION.jump;
          const air = Math.max(0, Math.min(1, (et - 0.15) / (d - 0.3)));
          const crouch = et < 0.15 ? et / 0.15 : et > d - 0.15 ? (d - et) / 0.15 : 0;
          this.lift = 4 * air * (1 - air) * 0.55;
          hipsY -= crouch * 0.12;
          const k = Math.max(crouch, air > 0 && air < 1 ? 0.35 : 0);
          lUpLeg = [-k * 0.9, 0, 0];
          rUpLeg = [-k * 0.9, 0, 0];
          lLowLeg = [k * 1.6, 0, 0];
          rLowLeg = [k * 1.6, 0, 0];
          lArm = mix(lArm, [-0.4, 0, 0.3], ew * (air > 0 ? 1 : 0.3));
          rArm = mix(rArm, [-0.4, 0, -0.3], ew * (air > 0 ? 1 : 0.3));
          break;
        }
        case 'dance': {
          const beat = et * Math.PI * 2 * 1.1;
          const bs = Math.sin(beat);
          const bc = Math.cos(beat);
          hipsY -= Math.abs(bc) * 0.04 * ew;
          hipsRot = mix(hipsRot, [0, bs * 0.25, bs * 0.12], ew);
          spineRot = mix(spineRot, [0.05, -bs * 0.2, -bs * 0.15], ew);
          headRot = mix(headRot, [0, bs * 0.15, bs * 0.15], ew);
          lArm = mix(lArm, [-0.6 + bc * 0.3, 0, -0.2 + bs * 0.5], ew);
          rArm = mix(rArm, [-0.6 - bc * 0.3, 0, 0.2 + bs * 0.5], ew);
          lFore = mix(lFore, [0, -1.2, 0], ew);
          rFore = mix(rFore, [0, 1.2, 0], ew);
          lUpLeg = [-Math.max(0, bs) * 0.3 * ew, 0, -0.05 * ew];
          rUpLeg = [-Math.max(0, -bs) * 0.3 * ew, 0, 0.05 * ew];
          lLowLeg = [Math.max(0, bs) * 0.5 * ew, 0, 0];
          rLowLeg = [Math.max(0, -bs) * 0.5 * ew, 0, 0];
          break;
        }
        case 'peace': {
          // 振り返って、顔の横でピース。首をかしげてウインク
          const w = this.poseWeight(et, 0.35);
          rArm = mix(rArm, [-0.55, 0.2, 0.75], w);
          rFore = mix(rFore, [0, 2.0, 0], w);
          rHand = mix(rHand, [0, -0.3, -0.35], w);
          lArm = mix(lArm, [0.05, 0, -1.25], w);
          headRot = mix(headRot, [0.05, 0, -0.22], w);
          spineRot = mix(spineRot, [0, 0, 0.06], w);
          hipsRot = mix(hipsRot, [0, 0, -0.05], w);
          fingerCurl = w;
          break;
        }
        case 'bow': {
          // 振り返って、手を前でそろえておじぎ
          const w = this.poseWeight(et, 0.45);
          const dip = smooth(Math.min(1, Math.max(0, (et - 0.6) / 0.5))) * smooth(Math.min(1, Math.max(0, (EMOTE_DURATION.bow - 0.55 - et) / 0.5)));
          lArm = mix(lArm, [-0.45, 0, -1.5], w);
          rArm = mix(rArm, [-0.45, 0, 1.5], w);
          lFore = mix(lFore, [0, -0.9, 0], w);
          rFore = mix(rFore, [0, 0.9, 0], w);
          hipsRot = mix(hipsRot, [0.3 * dip, 0, 0], w);
          spineRot = mix(spineRot, [0.55 * dip, 0, 0], w);
          chestRot = mix(chestRot, [0.2 * dip, 0, 0], w);
          headRot = mix(headRot, [0.25 * dip, 0, 0], w);
          break;
        }
        case 'beckon': {
          // 振り返って「こっちこっち」。手のひらを下にして、ひじから先をぱたぱた
          const w = this.poseWeight(et, 0.35);
          const flap = Math.sin(et * 11);
          rArm = mix(rArm, [-1.15, 0, 0.6], w);
          rFore = mix(rFore, [0, 0.55 + flap * 0.45, 0], w);
          rHand = mix(rHand, [0, 0, -0.3 + flap * 0.35], w);
          lArm = mix(lArm, [0.05, 0, -1.2], w);
          headRot = mix(headRot, [0.04, 0, 0.14], w);
          spineRot = mix(spineRot, [0.08, 0, 0], w);
          break;
        }
        case 'spin': {
          // くるっと一回転
          const turn = smooth(Math.min(1, et / EMOTE_DURATION.spin));
          this.spin = turn * Math.PI * 2;
          this.lift = Math.sin(turn * Math.PI) * 0.06 * ew;
          lArm = mix(lArm, [0, 0, -0.55], ew);
          rArm = mix(rArm, [0, 0, 0.55], ew);
          lFore = mix(lFore, [0, -0.3, 0], ew);
          rFore = mix(rFore, [0, 0.3, 0], ew);
          headRot = mix(headRot, [-0.1, 0, 0], ew);
          break;
        }
        case 'lookaround': {
          // 手をおでこにかざして、左右をきょろきょろ
          const look = Math.sin((et / EMOTE_DURATION.lookaround) * Math.PI * 2) * 0.75;
          rArm = mix(rArm, [-0.9, 0.3, 0.35], ew);
          rFore = mix(rFore, [0, 2.1, 0], ew);
          rHand = mix(rHand, [0, 0, 0.3], ew);
          headRot = mix(headRot, [-0.08, look, 0], ew);
          chestRot = mix(chestRot, [0, look * 0.35, 0], ew);
          break;
        }
        case 'stretch': {
          // 両手を上にのばして、つま先立ちで伸び
          const up = Math.sin(Math.min(1, et / (EMOTE_DURATION.stretch * 0.8)) * Math.PI);
          lArm = mix(lArm, [-0.1, 0, 1.35], ew);
          rArm = mix(rArm, [-0.1, 0, -1.35], ew);
          lFore = mix(lFore, [0, -0.15, 0], ew);
          rFore = mix(rFore, [0, 0.15, 0], ew);
          spineRot = mix(spineRot, [-0.18 * up, 0, 0], ew);
          headRot = mix(headRot, [-0.3 * up, 0, 0], ew);
          this.lift = 0.04 * up * ew;
          lFoot = [0.35 * up * ew, 0, 0];
          rFoot = [0.35 * up * ew, 0, 0];
          break;
        }
        default:
      }
    }
    if (this.emote !== 'spin') this.spin = 0;

    // --- 座る(太ももを水平に、すねをまっすぐ下ろし、手はひざの上。ときどき足をぶらぶら) ---
    const sw = smooth(this.sitWeight);
    if (sw > 0) {
      const swing = Math.sin(t * 2.4) * 0.22 * Math.max(0, Math.sin(t * 0.37));
      lUpLeg = mix(lUpLeg, [-1.5, 0, 0.03], sw);
      rUpLeg = mix(rUpLeg, [-1.5, 0, -0.03], sw);
      lLowLeg = mix(lLowLeg, [1.45 + swing, 0, 0], sw);
      rLowLeg = mix(rLowLeg, [1.45 - swing, 0, 0], sw);
      lFoot = mix(lFoot, [0.05, 0, 0], sw);
      rFoot = mix(rFoot, [0.05, 0, 0], sw);
      hipsY -= this.thighLength * sw;
      hipsRot = mix(hipsRot, [0, 0, 0], sw);
      spineRot = mix(spineRot, [-0.06 + breath, 0, 0], sw);
      headRot = mix(headRot, [0.06, Math.sin(t * 0.45) * 0.18, Math.sin(t * 0.7) * 0.05], sw);
      lArm = mix(lArm, [-0.6, 0, -1.3], sw);
      rArm = mix(rArm, [-0.6, 0, 1.3], sw);
      lFore = mix(lFore, [0, -0.75, 0], sw);
      rFore = mix(rFore, [0, 0.75, 0], sw);
      this.lift *= 1 - sw;
    }

    // --- 振り返る・何かを見る(エモート中はしない。座っているときは腰は回さない) ---
    const lkw = this.lookWeight * (1 - ew);
    if (lkw > 0.001) {
      const y = this.lookYaw * lkw;
      hipsRot[1] += y * 0.15 * (1 - sw);
      spineRot[1] += y * 0.12;
      chestRot[1] += y * 0.2;
      headRot[1] += y * 0.53;
      headRot[0] -= this.lookPitch * lkw;
    }
    // 振り返るエモートは、体ごとカメラのほうを向く
    if (FACE_CAMERA.has(this.emote)) hipsRot[1] += Math.PI * this.poseWeight(et, 0);
    hipsRot[1] += this.spin;

    if (b.hips) b.hips.position.y = hipsY;
    set(b.leftUpperLeg, ...lUpLeg);
    set(b.rightUpperLeg, ...rUpLeg);
    set(b.leftLowerLeg, ...lLowLeg);
    set(b.rightLowerLeg, ...rLowLeg);
    set(b.leftFoot, ...lFoot);
    set(b.rightFoot, ...rFoot);
    set(b.hips, ...hipsRot);
    set(b.spine, ...spineRot);
    set(b.chest, ...chestRot);
    set(b.head, ...headRot);
    set(b.leftUpperArm, ...lArm);
    set(b.rightUpperArm, ...rArm);
    set(b.leftLowerArm, ...lFore);
    set(b.rightLowerArm, ...rFore);
    set(b.leftHand, ...lHand);
    set(b.rightHand, ...rHand);

    // 指(右手)。ピースは人差し指と中指を開いて、ほかを握る
    const curl = 1.3 * fingerCurl;
    for (const n of ['rightRingProximal', 'rightRingIntermediate', 'rightRingDistal',
      'rightLittleProximal', 'rightLittleIntermediate', 'rightLittleDistal']) set(b[n], 0, 0, curl);
    set(b.rightThumbMetacarpal, 0, -0.5 * fingerCurl, 0);
    set(b.rightThumbProximal, 0, -0.6 * fingerCurl, 0);
    set(b.rightThumbDistal, 0, -0.5 * fingerCurl, 0);
    set(b.rightIndexProximal, 0, 0.2 * fingerCurl, 0);
    set(b.rightMiddleProximal, 0, -0.1 * fingerCurl, 0);
  }

  // 振り返り(delay 秒)のあとにポーズへ入り、終わる前に戻る重み
  poseWeight(t, delay) {
    const dur = EMOTE_DURATION[this.emote] || 1;
    const turn = 0.4;
    return smooth(Math.max(0, Math.min(1, (t - delay) / turn, (dur - delay - t) / turn)));
  }

  updateFace(dt) {
    const em = this.vrm.expressionManager;
    if (!em) return;
    // まばたき
    this.nextBlink -= dt;
    if (this.nextBlink <= 0 && this.blinkTime < 0) {
      this.blinkTime = 0;
      this.nextBlink = 2 + Math.random() * 3;
    }
    let blink = 0;
    if (this.blinkTime >= 0) {
      this.blinkTime += dt;
      const x = this.blinkTime / 0.16;
      blink = x < 1 ? smooth(x < 0.5 ? x * 2 : 2 - x * 2) : 0;
      if (x >= 1) this.blinkTime = -1;
    }
    // ふだんはほほえみ、エモート中は満面の笑み
    const happyTarget = this.emote && !IDLE_EMOTES.includes(this.emote) ? 1 : this.sitting || this.look ? 0.6 : 0.3;
    const prev = em.getValue('happy') ?? 0;
    const happy = lerp(prev, happyTarget, Math.min(1, dt * 6));
    em.setValue('happy', happy);
    // happy は目を細めるので、まばたきは残りの分だけ
    em.setValue('blink', blink * (1 - happy));
    em.setValue('blinkLeft', this.emote === 'peace' ? this.poseWeight(this.emoteTime, 0.35) : 0);
    // 口: おしゃべり中はぱくぱく、手を振る・よろこぶときは少し開ける
    const chat = this.talking ? 0.35 * Math.abs(Math.sin(this.time * 13)) * (0.6 + 0.4 * Math.sin(this.time * 3.1)) : 0;
    em.setValue('aa', Math.max(chat, this.emote === 'wave' || this.emote === 'thumbsup' ? 0.3 * this.emoteWeight : 0));
  }
}

function set(bone, x, y, z) {
  if (bone) bone.rotation.set(x, y, z);
}

function mix(a, b, t) {
  return a.map((v, i) => lerp(v, b[i], t));
}
