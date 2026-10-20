// 画面キャプチャから奥行きを推定し(Depth Anything V2 / transformers.js)、座れる椅子・ベンチや、
// 話題にする犬・猫・鳥なども探す。
// 拡張のオフスクリーンドキュメントで動き、background.js から呼ばれる。
import { env, pipeline, RawImage } from '@huggingface/transformers';
import { THING_LABELS } from './companion.js';

const MODEL = 'onnx-community/depth-anything-v2-small';
const OUT_WIDTH = 192; // 返す奥行きマップの横幅
// 椅子・ベンチを探す物体検出(D-FINE small、COCO の 80 種類)。D-FINE nano より大きいが、
// nano は柵をベンチと間違えやすく、カフェの椅子も見落としやすかった
const DETECTOR = 'onnx-community/dfine_s_coco-ONNX';
const SEAT_LABELS = new Set(['chair', 'bench', 'couch']);
const DETECT_WAIT_MS = 1500; // 初回はモデル(約40MB)のダウンロードを待たずに、奥行きだけ先に返す

env.allowLocalModels = false;
env.useWasmCache = false; // blob: URL の import は拡張の CSP で禁止されている
env.backends.onnx.wasm.wasmPaths = {
  mjs: chrome.runtime.getURL('build/ort/ort-wasm-simd-threaded.asyncify.mjs'),
  wasm: chrome.runtime.getURL('build/ort/ort-wasm-simd-threaded.asyncify.wasm'),
};

let estimatorPromise = null;
let detectorPromise = null;

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

function loadDetector() {
  if (!detectorPromise) {
    detectorPromise = pipeline('object-detection', DETECTOR, { device: 'wasm', dtype: 'fp32' }).catch((e) => {
      detectorPromise = null;
      throw e;
    });
  }
  return detectorPromise;
}

// 座れる物(椅子・ベンチ・ソファ)と話題にする物(犬・猫など)の枠を、画面に対する割合で返す。
// モデルがまだ使えなければどちらも null
async function detectObjects(image) {
  try {
    const detector = await Promise.race([loadDetector(), new Promise((r) => setTimeout(r, DETECT_WAIT_MS, null))]);
    if (!detector) return { seats: null, things: null };
    const found = await detector(image, { threshold: 0.5, percentage: true });
    const pick = (labels) => found.filter((d) => labels.has(d.label)).map(({ label, score, box }) => ({ label, score, box }));
    return { seats: pick(SEAT_LABELS), things: pick(new Set(THING_LABELS)) };
  } catch (e) {
    console.warn('[Walk 3D] 椅子などを探せませんでした', e);
    return { seats: null, things: null };
  }
}

// Googleマップの検索欄やミニ地図が入らないよう、画面の中央下側だけを見る
function isBlank(image) {
  const { data, width, height, channels } = image;
  let n = 0, sum = 0, sq = 0;
  for (let y = Math.floor(height * 0.3); y < height; y += 4) {
    for (let x = Math.floor(width * 0.2); x < width * 0.8; x += 4) {
      const k = (y * width + x) * channels;
      const v = data[k] + data[k + 1] + data[k + 2];
      sum += v;
      sq += v * v;
      n += 1;
    }
  }
  const mean = sum / n;
  return Math.sqrt(Math.max(0, sq / n - mean * mean)) < 12;
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
  // パノラマの読み込み中などで画面がほぼ一色のときは推定しない(でたらめな奥行きになる)
  if (isBlank(image)) return { blank: true };
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
  return { width: ow, height: oh, data: out, ...(await detectObjects(image)) };
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.target !== 'offscreen' || msg.type !== 'depth') return false;
  estimate(msg.dataUrl)
    .then((depth) => sendResponse({ depth }))
    .catch((e) => sendResponse({ error: String(e?.message || e) }));
  return true;
});
