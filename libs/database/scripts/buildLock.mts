import { mkdir, rm, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { setTimeout as sleepPromise } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const root: string = join(dirname(fileURLToPath(import.meta.url)), '..');
const lockDirectory: string = join(root, '.database-build.lock');
const LOCK_ACQUIRE_TIMEOUT_MS: number = 60_000;
const LOCK_STALE_THRESHOLD_MS: number = 300_000;
const LOCK_RETRY_INTERVAL_MS: number = 100;

function sleep(ms: number): Promise<void> {
  return sleepPromise(ms);
}

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === 'object' && error !== null && 'code' in error;
}

async function isStaleLock(): Promise<boolean> {
  try {
    const lockStats = await stat(lockDirectory);
    const lockAgeMs = Date.now() - lockStats.mtimeMs;
    return lockAgeMs > LOCK_STALE_THRESHOLD_MS;
  } catch {
    return false;
  }
}

export async function withDatabaseBuildLock(run: () => Promise<void>): Promise<void> {
  const lockDeadline = Date.now() + LOCK_ACQUIRE_TIMEOUT_MS;

  while (true) {
    try {
      await mkdir(lockDirectory);
      break;
    } catch (error: unknown) {
      if (!isErrnoException(error) || error.code !== 'EEXIST') {
        throw error;
      }

      if (await isStaleLock()) {
        await rm(lockDirectory, { recursive: true, force: true });
        continue;
      }

      if (Date.now() >= lockDeadline) {
        throw new Error(
          `Timed out waiting for database build lock at ${lockDirectory} after ${LOCK_ACQUIRE_TIMEOUT_MS}ms.`,
        );
      }

      await sleep(LOCK_RETRY_INTERVAL_MS);
    }
  }

  try {
    await run();
  } finally {
    await rm(lockDirectory, { recursive: true, force: true });
  }
}
