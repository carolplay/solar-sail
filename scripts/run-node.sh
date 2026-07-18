#!/usr/bin/env sh
set -eu

if command -v node >/dev/null 2>&1; then
  exec node "$@"
fi

BUNDLED_NODE="${CODEX_BUNDLED_NODE:-/Users/guoya/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node}"

if [ -x "$BUNDLED_NODE" ]; then
  echo "Using bundled Node fallback: $BUNDLED_NODE" >&2
  exec "$BUNDLED_NODE" "$@"
fi

echo "Node.js was not found on PATH, and bundled fallback is unavailable." >&2
echo "Install Node.js locally or set CODEX_BUNDLED_NODE to a Node executable." >&2
exit 127
