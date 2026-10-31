#!/bin/bash
# Usage: compare.sh <baseline-dir> <candidate-dir>
# Diffs every page's normalized markup; prints changed-line counts per page
# and the first lines of each diff. Exit 1 if any page differs.
set -u
here="$(cd "$(dirname "$0")" && pwd)"
a="$1"; b="$2"; status=0
for f in "$a"/*.html; do
  name="$(basename "$f")"
  if [ ! -f "$b/$name" ]; then echo "MISSING $name"; status=1; continue; fi
  d="$(diff <(node "$here/normalize.mjs" "$f") <(node "$here/normalize.mjs" "$b/$name"))"
  if [ -n "$d" ]; then
    status=1
    echo "=== $name: $(printf '%s\n' "$d" | grep -c '^[<>]') changed lines"
    printf '%s\n' "$d" | head -12
  fi
done
[ $status -eq 0 ] && echo "All pages identical after normalization."
exit $status
