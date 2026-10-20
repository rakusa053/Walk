import { build } from 'esbuild';
import { copyFileSync, mkdirSync } from 'node:fs';

const out = 'extension/build';
mkdirSync(out, { recursive: true });

await build({
  entryPoints: ['src/main.js'],
  bundle: true,
  format: 'esm',
  minify: true,
  target: 'chrome110',
  outfile: `${out}/app.js`,
  legalComments: 'eof',
});

copyFileSync('node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs', `${out}/maplibre-gl-worker.mjs`);
copyFileSync('node_modules/maplibre-gl/dist/maplibre-gl.css', `${out}/maplibre-gl.css`);
console.log('built ->', out);
