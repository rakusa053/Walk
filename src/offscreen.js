// 画面キャプチャから奥行きを推定する(Depth Anything V2 / transformers.js)。
// 拡張のオフスクリーンドキュメントで動き、background.js から呼ばれる。
import { env, pipeline, RawImage } from '@huggingface/transformers';

const MODEL = 'onnx-community/depth-anything-v2-small';
const OUT_WIDTH = 192; // 返す奥行きマップの横幅

env.allowLocalModels = false;
env.useWasmCache = false; // blob: URL の import は拡張の CSP で禁止されている
env.backends.onnx.wasm.wasmPaths = {
  mjs: chrome.runtime.getURL('build/ort/ort-wasm-simd-threaded.asyncify.mjs'),
  wasm: chrome.runtime.getURL('build/ort/ort-wasm-simd-threaded.asyncify.wasm'),
};

let estimatorPromise = null;

async function createEstimator() {
  if (navigator.gpu) {
    try {
      return await pipeline('depth-estimation', MODEL, { device: 'webgpu', dtype: 'fp16' });
    } catch (e) {
      console.warn('[Walk 3D] WebGPU が使えないので WASM で推定します', e);
    }
  }
  return pipeline('depth-estimation', MODEL, { device: 'wasm', dtype: 'q8' });
}

async function estimate(dataUrl) {
  if (!estimatorPromise) {
    estimatorPromise = createEstimator().catch((e) => {
      estimatorPromise = null;
      throw e;
    });
  }
  const estimator = await estimatorPromise;
  let image = await RawImage.fromURL(dataUrl);
  if (image.width > 640) image = await image.resize(640, Math.round((640 * image.height) / image.width));
  const { predicted_depth: depth } = await estimator(image);
  const [h, w] = depth.dims.slice(-2);
  const src = depth.data;
  // 縮小して返す(値は相対的な逆深度: 大きいほど近い)
  const ow = Math.min(OUT_WIDTH, w);
  const oh = Math.round((ow * h) / w);
  const out = new Array(ow * oh);
  for (let y = 0; y < oh; y++) {
    const sy = Math.min(h - 1, Math.floor(((y + 0.5) * h) / oh));
    for (let x = 0; x < ow; x++) {
      const sx = Math.min(w - 1, Math.floor(((x + 0.5) * w) / ow));
      out[y * ow + x] = Math.round(src[sy * w + sx] * 1000) / 1000;
    }
  }
  return { width: ow, height: oh, data: out };
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.target !== 'offscreen' || msg.type !== 'depth') return false;
  estimate(msg.dataUrl)
    .then((depth) => sendResponse({ depth }))
    .catch((e) => sendResponse({ error: String(e?.message || e) }));
  return true;
});
