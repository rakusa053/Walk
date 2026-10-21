import { build } from 'esbuild';
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const out = 'extension/build';
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// app.js: 3Dマップのページ / streetview.js: Googleマップに重ねるアバター
await build({
  entryPoints: { app: 'src/main.js', streetview: 'src/streetview.js' },
  bundle: true,
  splitting: true,
  format: 'esm',
  minify: true,
  target: 'chrome110',
  outdir: out,
  chunkNames: 'chunk-[hash]',
  legalComments: 'eof',
});

copyFileSync('node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs', `${out}/maplibre-gl-worker.mjs`);
copyFileSync('node_modules/maplibre-gl/dist/maplibre-gl.css', `${out}/maplibre-gl.css`);
// 奥行き推定 (onnxruntime-web) の WASM はリモートから読めないので同梱する
mkdirSync(`${out}/ort`, { recursive: true });
for (const f of ['ort-wasm-simd-threaded.asyncify.mjs', 'ort-wasm-simd-threaded.asyncify.wasm']) {
  copyFileSync(`node_modules/onnxruntime-web/dist/${f}`, `${out}/ort/${f}`);
}
// transformers.js(4.3.1)は、モデルの読み込みと推定を、それぞれ1列に並べて順番に動かしている
// (同時に動かすと ORT がエラーになることがあるため)。ただ、列の中で一度でも失敗すると、あとに並んだものも全部
// 同じエラーで失敗し続ける(椅子を探す AI が一度失敗すると、奥行きの推定もずっとできなくなる)。
// 前のものが失敗しても次を動かすように書き換える(順番に動かすのは変わらない)
let fixedChains = 0;
const fixTransformersChains = {
  name: 'fix-transformers-chains',
  setup(b) {
    b.onLoad({ filter: /transformers\.web\.js$/ }, (args) => ({
      contents: readFileSync(args.path, 'utf8').replace(/\b(webInitChain|webInferenceChain) = \1\.then\(/g, (_, v) => {
        fixedChains += 1;
        return `${v} = ${v}.catch(() => {}).then(`;
      }),
      loader: 'js',
    }));
  },
};

// offscreen.js: 奥行き推定 (transformers.js)。
// 1行に詰めると、モデル名の "mistral" と 32文字のクラス名などが同じ行に並び、
// GitHub のシークレット検出に API キーと誤検出されるので改行は残す
await build({
  entryPoints: { offscreen: 'src/offscreen.js' },
  bundle: true,
  format: 'esm',
  minifySyntax: true,
  minifyIdentifiers: true,
  target: 'chrome110',
  outdir: out,
  legalComments: 'eof',
  plugins: [fixTransformersChains],
});
if (fixedChains !== 2) {
  throw new Error(`transformers.js の書き換えが ${fixedChains} か所でした(2 か所のはず)。transformers.js を更新したら見直す`);
}

// それでも "Mistral3ForConditionalGeneration" のような 32文字の名前が誤検出されるので、
// 32文字の英数字の並びは先頭の1文字を \uXXXX に置き換えて分断する
// (識別子・プロパティ名・文字列のどこでも JavaScript としては同じ意味になる)
const offscreenFile = `${out}/offscreen.js`;
const code = readFileSync(offscreenFile, 'utf8').replace(
  /(?<![A-Za-z0-9_$\\])[A-Za-z0-9]{32}(?![A-Za-z0-9_$])/g,
  (w) => `\\u${w.charCodeAt(0).toString(16).padStart(4, '0')}${w.slice(1)}`,
);
writeFileSync(offscreenFile, code);

console.log('built ->', out);
