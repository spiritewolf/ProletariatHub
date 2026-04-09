import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, '.env');
const turboBin = resolve(root, 'node_modules/turbo/bin/turbo');
const turboArgs = process.argv.slice(2);

const nodeArgs = existsSync(envPath)
  ? [`--env-file=${envPath}`, turboBin, ...turboArgs]
  : [turboBin, ...turboArgs];

const child = spawn(process.execPath, nodeArgs, {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
});

child.on('close', (code, signal) => {
  if (signal) {
    process.exit(1);
  }
  process.exit(code ?? 0);
});
