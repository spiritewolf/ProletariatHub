#!/usr/bin/env node
/**
 * Exit 0: esbuild runs on this OS (native binary matches).
 * Exit 2: wrong optional @esbuild/* platform — heal by reinstalling node_modules.
 * Exit 1: any other failure (do not delete node_modules).
 *
 * `require('esbuild')` alone is not enough: the binary path is validated on first
 * transform, which is why tsx/api can fail after the entrypoint "passes".
 */
function isWrongPlatformMessage(m) {
  return (
    /another platform than the one you're currently using/i.test(m) ||
    /package is present but this platform needs/i.test(m) ||
    /You installed esbuild for another platform/i.test(m)
  );
}

try {
  const esbuild = require('esbuild');
  esbuild.transformSync('export {}\n', { loader: 'js' });
  process.exit(0);
} catch (e) {
  const m = e && e.message ? e.message : String(e);
  if (isWrongPlatformMessage(m)) {
    process.exit(2);
  }
  process.exit(1);
}
