#!/bin/sh
set -e
cd /app

export PATH="/usr/local/bin:/usr/local/sbin:$PATH"
if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable
  corepack prepare pnpm@9.15.0 --activate
fi

if [ ! -d node_modules/.pnpm ]; then
  pnpm install --frozen-lockfile
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
  --filter=@proletariat-hub/db \
  --filter=@proletariat-hub/ui

rmdir "$BUILD_LOCK" 2>/dev/null || true
trap - EXIT

exec "$@"
