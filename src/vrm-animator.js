import * as THREE from 'three';

// VRM モデルにはアニメーションが入っていないので、ヒューマノイドの
// 正規化ボーンを手続き的に動かして歩く・走る・手を振るなどを表現する。
// 正規化ボーンの座標系: +Y=上, +Z=前, +X=キャラクターの左。

const EMOTE_DURATION = {
  jump: 0.9, wave: 2.4, thumbsup: 1.8,
  peace: 2.6, bow: 2.6, spin: 1.3, lookaround: 3.4, stretch: 2.6,
};
// こちら(カメラ側)を向いてから行うエモート。ふだんは後ろ姿なので、振り返って見せる
const FACE_CAMERA = new Set(['peace', 'bow']);
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
  }

  estimateLegLength() {
    const up = this.bones.leftUpperLeg;
    const foot = this.bones.leftFoot;
    if (!up || !foot) return 0.8;
    const a = up.getWorldPosition(new THREE.Vector3());
    const b = foot.getWorldPosition(new THREE.Vector3());
    return Math.max(0.3, a.distanceTo(b));
  }

  startEmote(name) {
    this.emote = name;
    this.emoteTime = 0;
  }

  stopEmote() {
    this.emote = null;
  }

  // motion: { forward: -1..1, running: bool, speed: m/s(アバター実寸換算) }
  update(dt, motion) {
    this.time += dt;
    const moving = motion.forward !== 0;
    if (moving && this.emote && this.emote !== 'jump') this.stopEmote();

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

    // 立ち止まってしばらくすると、見回したり伸びをしたりする
    if (moving || this.emote) {
      this.idleTime = 0;
    } else {
      this.idleTime += dt;
      if (this.idleTime > this.nextIdleEmote) {
        this.startEmote(IDLE_EMOTES[Math.floor(Math.random() * IDLE_EMOTES.length)]);
        this.idleTime = 0;
        this.nextIdleEmote = 12 + Math.random() * 10;
      }
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
    set(b.leftUpperLeg, -s * legAmp, 0, 0);
    set(b.rightUpperLeg, s * legAmp, 0, 0);
    set(b.leftLowerLeg, Math.max(0, c) * kneeAmp + 0.05 * mw, 0, 0);
    set(b.rightLowerLeg, Math.max(0, -c) * kneeAmp + 0.05 * mw, 0, 0);
    set(b.leftFoot, (s * 0.2 - Math.max(0, c) * 0.2) * mw, 0, 0);
    set(b.rightFoot, (-s * 0.2 - Math.max(0, -c) * 0.2) * mw, 0, 0);

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
          set(b.leftUpperLeg, -k * 0.9, 0, 0);
          set(b.rightUpperLeg, -k * 0.9, 0, 0);
          set(b.leftLowerLeg, k * 1.6, 0, 0);
          set(b.rightLowerLeg, k * 1.6, 0, 0);
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
          set(b.leftUpperLeg, -Math.max(0, bs) * 0.3 * ew, 0, -0.05 * ew);
          set(b.rightUpperLeg, -Math.max(0, -bs) * 0.3 * ew, 0, 0.05 * ew);
          set(b.leftLowerLeg, Math.max(0, bs) * 0.5 * ew, 0, 0);
          set(b.rightLowerLeg, Math.max(0, -bs) * 0.5 * ew, 0, 0);
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
          set(b.leftFoot, 0.35 * up * ew, 0, 0);
          set(b.rightFoot, 0.35 * up * ew, 0, 0);
          break;
        }
        default:
      }
    }
    if (this.emote !== 'spin') this.spin = 0;
    // 振り返るエモートは、体ごとカメラのほうを向く
    if (FACE_CAMERA.has(this.emote)) hipsRot[1] += Math.PI * this.poseWeight(et, 0);
    hipsRot[1] += this.spin;

    if (b.hips) b.hips.position.y = hipsY;
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
    const happyTarget = this.emote && !IDLE_EMOTES.includes(this.emote) ? 1 : 0.3;
    const prev = em.getValue('happy') ?? 0;
    const happy = lerp(prev, happyTarget, Math.min(1, dt * 6));
    em.setValue('happy', happy);
    // happy は目を細めるので、まばたきは残りの分だけ
    em.setValue('blink', blink * (1 - happy));
    em.setValue('blinkLeft', this.emote === 'peace' ? this.poseWeight(this.emoteTime, 0.35) : 0);
    em.setValue('aa', this.emote === 'wave' || this.emote === 'thumbsup' ? 0.3 * this.emoteWeight : 0);
  }
}

function set(bone, x, y, z) {
  if (bone) bone.rotation.set(x, y, z);
}

function mix(a, b, t) {
  return a.map((v, i) => lerp(v, b[i], t));
}
