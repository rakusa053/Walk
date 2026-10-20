import { build } from 'esbuild';
import { copyFileSync, mkdirSync, rmSync } from 'node:fs';

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
console.log('built ->', out);
