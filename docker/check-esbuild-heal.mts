#!/usr/bin/env node
/**
 * Exit 0: native deps match this OS (esbuild, rollup).
 * Exit 2: wrong/missing optional platform packages — heal by reinstalling node_modules.
 * Exit 1: any other failure (do not delete node_modules).
 *
 * `require('esbuild')` alone is not enough: the binary path is validated on first
 * transform, which is why tsx/api can fail after the entrypoint "passes".
 * Rollup 4.x similarly loads `@rollup/rollup-<platform>` on first require.
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function shouldHealNodeModules(message: string): boolean {
  return (
    /another platform than the one you're currently using/i.test(message) ||
    /package is present but this platform needs/i.test(message) ||
    /You installed esbuild for another platform/i.test(message) ||
    /Cannot find module '@rollup\/rollup-/i.test(message) ||
    /Cannot find module '@esbuild\//i.test(message) ||
    /Exec format error/i.test(message) ||
    /ERR_DLOPEN_FAILED/i.test(message) ||
    /wrong ELF class/i.test(message)
  );
}

function getMessage(error: unknown): string | null {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message.length > 0
  ) {
    return error.message;
  }
  return null;
}

function getCause(error: unknown): unknown {
  if (typeof error === 'object' && error !== null && 'cause' in error) {
    return error.cause;
  }
  return null;
}

function errorText(e: unknown): string {
  const parts: string[] = [];
  let cur: unknown = e;
  let depth = 0;
  while (cur !== null && depth < 6) {
    const message = getMessage(cur);
    if (message !== null) {
      parts.push(message);
    }
    cur = getCause(cur);
    depth += 1;
  }
  if (parts.length > 0) {
    return parts.join(' | ');
  }
  return String(e);
}

try {
  const esbuild = require('esbuild');
  esbuild.transformSync('export {}\n', { loader: 'js' });
} catch (e: unknown) {
  const message = errorText(e);
  if (shouldHealNodeModules(message)) {
    process.exit(2);
  }
  process.exit(1);
}

try {
  require('rollup');
} catch (e: unknown) {
  const message = errorText(e);
  if (shouldHealNodeModules(message)) {
    process.exit(2);
  }
  process.exit(1);
}

process.exit(0);
