#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
PORT="${PORT:-8000}"
HOST="${HOST:-127.0.0.1}"
printf 'Golden Greens Spatial Product System\nOpen: http://%s:%s\nStop with Ctrl+C\n' "$HOST" "$PORT"
exec python3 -m http.server "$PORT" --bind "$HOST"
