#!/bin/bash
# Usage: capture.sh <base-url> <out-dir>
# Fetches every route that has a baseline page (home, credits, each /learn/<slug>)
# into <out-dir>, named like the baseline files. Prints any non-200 route.
set -u
here="$(cd "$(dirname "$0")" && pwd)"
base="$1"; out="$2"
mkdir -p "$out"
curl -s -o /dev/null --retry 60 --retry-connrefused --retry-delay 1 "$base/"
for f in "$here/../baseline/local/"*.html; do
  name="$(basename "$f" .html)"
  case "$name" in
    home) route="/" ;;
    credits) route="/credits" ;;
    learn_*) route="/learn/${name#learn_}" ;;
    *) continue ;;
  esac
  code="$(curl -s -o "$out/$name.html" -w '%{http_code}' "$base$route")"
  [ "$code" = "200" ] || echo "HTTP $code $route"
done
