import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root: string = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath: string = resolve(root, '.env');
const turboBin: string = resolve(root, 'node_modules/turbo/bin/turbo');
const turboArgs: string[] = process.argv.slice(2);

const nodeArgs: string[] = existsSync(envPath)
  ? [`--env-file=${envPath}`, turboBin, ...turboArgs]
  : [turboBin, ...turboArgs];

const child = spawn(process.execPath, nodeArgs, {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
});

child.on('close', (code: number | null, signal: NodeJS.Signals | null): void => {
  if (signal !== null) {
    process.exit(1);
  }
  process.exit(code ?? 0);
});
