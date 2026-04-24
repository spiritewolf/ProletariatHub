#!/bin/sh
set -e
cd /app

export PATH="/usr/local/bin:/usr/local/sbin:$PATH"
if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable
  corepack prepare pnpm@9.15.0 --activate
fi

LOCKFILE_HASH_FILE=node_modules/.lockfile-hash
CURRENT_LOCKFILE_HASH=$(sha256sum pnpm-lock.yaml | awk '{ print $1 }')

if [ ! -d node_modules/.pnpm ] || [ ! -f "$LOCKFILE_HASH_FILE" ] || [ "$(cat "$LOCKFILE_HASH_FILE")" != "$CURRENT_LOCKFILE_HASH" ]; then
  pnpm install --frozen-lockfile
  printf '%s' "$CURRENT_LOCKFILE_HASH" > "$LOCKFILE_HASH_FILE"
fi

# Named volumes can retain another OS/arch optional @esbuild/* or @rollup/*; reinstall on native mismatch.
if [ -d node_modules ]; then
  set +e
  pnpm exec tsx /app/docker/check-esbuild-heal.mts
  native_heal_rc=$?
  set -e
  if [ "$native_heal_rc" -eq 2 ]; then
    echo "native optional deps mismatch — reinstalling node_modules"
    rm -rf node_modules
    pnpm install --frozen-lockfile
    CURRENT_LOCKFILE_HASH=$(sha256sum pnpm-lock.yaml | awk '{ print $1 }')
    printf '%s' "$CURRENT_LOCKFILE_HASH" > "$LOCKFILE_HASH_FILE"
  fi
fi

BUILD_LOCK=/app/.compose-dev-build-lock
n=0
while ! mkdir "$BUILD_LOCK" 2>/dev/null; do
  n=$((n + 1))
  if [ "$n" -gt 6000 ]; then
    echo "dev build lock timeout" >&2
    exit 1
  fi
  sleep 0.1
done
trap 'rmdir "$BUILD_LOCK" 2>/dev/null || true' EXIT

pnpm exec turbo run build \
  --filter=@proletariat-hub/config \
  --filter=@proletariat-hub/database \
  --filter=@proletariat-hub/types

rmdir "$BUILD_LOCK" 2>/dev/null || true
trap - EXIT

exec "$@"
