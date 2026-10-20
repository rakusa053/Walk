import * as THREE from 'three';

// VRM モデルにはアニメーションが入っていないので、ヒューマノイドの
// 正規化ボーンを手続き的に動かして歩く・走る・手を振るなどを表現する。
// 正規化ボーンの座標系: +Y=上, +Z=前, +X=キャラクターの左。

const EMOTE_DURATION = { jump: 0.9, wave: 2.4, thumbsup: 1.8 };

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
        default:
      }
    }

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
    const happyTarget = this.emote ? 1 : 0.3;
    const prev = em.getValue('happy') ?? 0;
    const happy = lerp(prev, happyTarget, Math.min(1, dt * 6));
    em.setValue('happy', happy);
    // happy は目を細めるので、まばたきは残りの分だけ
    em.setValue('blink', blink * (1 - happy));
    em.setValue('aa', this.emote === 'wave' || this.emote === 'thumbsup' ? 0.3 * this.emoteWeight : 0);
  }
}

function set(bone, x, y, z) {
  if (bone) bone.rotation.set(x, y, z);
}

function mix(a, b, t) {
  return a.map((v, i) => lerp(v, b[i], t));
}
