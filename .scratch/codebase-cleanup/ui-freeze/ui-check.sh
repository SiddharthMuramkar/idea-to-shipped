#!/bin/bash
# Usage: ui-check.sh <repo-dir> <port>
# Builds the site with a dummy DATABASE_URL (static pages never query it; the
# API route only needs a well-formed URL at import), serves it on <port>,
# captures every baseline route and diffs the normalized HTML against the
# pre-change baseline. Success prints "All pages identical after normalization."
# Exit codes: 0 identical, 1 differences, 2 build failed.
set -u
here="$(cd "$(dirname "$0")" && pwd)"
repo="$1"; port="${2:-3200}"
out="$here/../candidate-$port"
log="$here/../candidate-$port.log"
cd "$repo" || exit 2

stale="$(lsof -ti:"$port")"
[ -n "$stale" ] && kill $stale

if ! DATABASE_URL=postgresql://build:build@localhost:5432/build npx next build > "$log" 2>&1; then
  echo "BUILD FAILED (full log: $log)"
  tail -40 "$log"
  exit 2
fi

rm -rf "$out"
mkdir -p "$out"
npx next start -p "$port" >> "$log" 2>&1 &
"$here/capture.sh" "http://localhost:$port" "$out"
pids="$(lsof -ti:"$port")"
[ -n "$pids" ] && kill $pids
wait 2>/dev/null

"$here/compare.sh" "$here/../baseline/local" "$out"
