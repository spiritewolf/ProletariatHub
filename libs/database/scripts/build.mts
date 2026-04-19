import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { withDatabaseBuildLock } from './buildLock.mts';

const root: string = join(dirname(fileURLToPath(import.meta.url)), '..');

function runCommand(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject): void => {
    const child = spawn(command, args, { cwd: root, stdio: 'inherit' });
    child.on('error', (error: Error): void => {
      reject(error);
    });
    child.on('exit', (exitCode: number | null): void => {
      if (exitCode === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command failed: ${command} ${args.join(' ')} (exit ${String(exitCode)})`));
    });
  });
}

await withDatabaseBuildLock(async (): Promise<void> => {
  await runCommand('pnpm', ['exec', 'prisma', 'generate', '--no-hints']);
  await runCommand('pnpm', ['exec', 'tsc']);
  await runCommand('tsx', ['./scripts/syncGenerated.mts']);
});
