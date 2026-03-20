const { readdirSync } = require('node:fs');
const { join } = require('node:path');
const esbuild = require('esbuild');

const rootDir = join(__dirname, '..');
const srcDir = join(rootDir, 'src');

function getEntryPoints(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getEntryPoints(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

const entryPoints = getEntryPoints(srcDir);

const sharedConfig = {
  entryPoints,
  entryNames: '[dir]/[name]',
  outbase: srcDir,
  sourcemap: true,
};

async function main() {
  await Promise.all([
    esbuild.build({
      ...sharedConfig,
      bundle: false,
      format: 'cjs',
      platform: 'node',
      target: ['node20'],
      outdir: join(rootDir, 'dist'),
    }),
    esbuild.build({
      ...sharedConfig,
      bundle: true,
      splitting: true,
      format: 'esm',
      platform: 'neutral',
      packages: 'external',
      target: ['es2015'],
      outdir: join(rootDir, 'dist', 'esm'),
      chunkNames: 'chunks/[name]-[hash]',
      outExtension: {
        '.js': '.mjs',
      },
    }),
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
