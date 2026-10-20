import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

// 標準で選べるアバター
export const BUILTIN_MODELS = {
  girl: { file: 'girl.vrm', label: '女の子' },
  robot: { file: 'robot.glb', label: 'ロボット' },
};

export function builtinModelUrl(key) {
  const m = BUILTIN_MODELS[key] || BUILTIN_MODELS.girl;
  return new URL(`../models/${m.file}`, import.meta.url).href;
}

export function createLoader() {
  const loader = new GLTFLoader();
  loader.register((parser) => new VRMLoaderPlugin(parser));
  return loader;
}

export function findClip(clips, patterns) {
  for (const p of patterns) {
    const c = clips.find((clip) => p.test(clip.name));
    if (c) return c;
  }
  return null;
}

// 読み込んだ glTF/VRM を、身長 height(m)・足元が原点・+Z 向きにそろえた Group に包む
export function normalizeModel(gltf, height) {
  const vrm = gltf.userData.vrm || null;
  if (vrm) {
    // VRM 0.x は -Z 向きなので +Z 向きにそろえる
    VRMUtils.rotateVRM0(vrm);
    vrm.scene.updateMatrixWorld(true);
  }
  const model = gltf.scene;
  model.traverse((o) => {
    if (o.isMesh) o.frustumCulled = false;
  });
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const s = height / (size.y || 1);
  const center = box.getCenter(new THREE.Vector3());
  model.scale.setScalar(s);
  model.position.set(-center.x * s, -box.min.y * s, -center.z * s);
  const wrapper = new THREE.Group();
  wrapper.add(model);
  return { wrapper, model, vrm };
}

export function disposeVrm(vrm) {
  if (vrm) VRMUtils.deepDispose(vrm.scene);
}
