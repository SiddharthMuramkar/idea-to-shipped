#!/usr/bin/env bash
# Download a Wikimedia Commons image at a standard thumbnail width and save it
# as a web-sized JPEG.
#
#   fetch-image.sh <thumb-or-original-url> <out.jpg> [width]
#
# <url> is a `thumburl` or `url` from the Commons API (thumb.wikimedia.org or
# upload.wikimedia.org). Always fetches a THUMBNAIL (originals are rate-limited
# hard): width defaults to 1280; Commons serves standard widths such as 330,
# 500, 960, 1280 and 1920. upload.wikimedia.org rate-limits this machine's
# shared address now and then, so this retries patiently (up to ~3 minutes),
# honouring retry-after. Prints "<w>x<h> <bytes>" of the saved file.
set -euo pipefail
url="$1"; out="$2"; width="${3:-1280}"
UA="IdeaToShippedCourseImages/1.0 (https://github.com/SiddharthMuramkar/idea-to-shipped)"
url="${url%%\?*}"
url="${url/thumb.wikimedia.org/upload.wikimedia.org}"
if [[ "$url" == *"/thumb/"* ]]; then
  url="$(echo "$url" | sed -E "s#/[0-9]+px-([^/]+)\$#/${width}px-\1#")"
else
  # An original: turn .../commons/a/ab/Name.jpg into its thumbnail URL.
  name="${url##*/}"
  base="${url%/*}"
  hash2="${base##*/}"; base="${base%/*}"; hash1="${base##*/}"; root="${base%/*}"
  url="${root}/thumb/${hash1}/${hash2}/${name}/${width}px-${name}"
  # SVG and TIFF thumbnails are served as PNG/JPG.
  case "$name" in
    *.svg|*.SVG) url="${url}.png" ;;
    *.tif|*.tiff|*.TIF|*.TIFF) url="${url}.jpg" ;;
  esac
fi
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
code=000
for i in 1 2 3 4 5 6 7 8; do
  code=$(curl -sS -L -o "$tmp/src" -D "$tmp/h" -w "%{http_code}" -A "$UA" "$url" || echo 000)
  [ "$code" = 200 ] && break
  wait=$(grep -i '^retry-after:' "$tmp/h" 2>/dev/null | tr -dc '0-9' || true)
  wait=${wait:-10}; [ "$wait" -gt 30 ] && wait=30
  sleep $((wait + RANDOM % 5))
done
if [ "$code" != 200 ]; then echo "download failed ($code): $url" >&2; exit 1; fi
mkdir -p "$(dirname "$out")"
convert "$tmp/src[0]" -auto-orient -strip -resize '1600x1600>' -background white -flatten -sampling-factor 4:2:0 -interlace JPEG -quality 80 "$out"
identify -format "%wx%h %b\n" "$out"
